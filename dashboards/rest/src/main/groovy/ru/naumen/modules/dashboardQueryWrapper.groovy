/*! UTF-8 */
//Автор: nordclan
//Дата создания: 21.01.2020
//Код:
//Назначение:
/**
 * Модуль получения данных для диаграмм
 */
//Версия: 1.0
//Категория: скриптовый модуль

package ru.naumen.modules

import ru.naumen.core.server.hquery.*

/**
 * Класс обёртка над HCriteria.
 * Класс бля получений из бд данных диаграмм.
 */
@ru.naumen.core.server.script.api.injection.InjectApi
class QueryWrapper
{
    private RequestData data // данные тут нужны только из-за подсчёта процентов
    private HCriteria criteria
    private List result
    private String locale

    private final static NUMBER_TYPES = ['integer', 'double']
    private final static DATE_TYPES = ['date', 'dateTime']
    private final static LINK_TYPES = ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem']
    private final static SIMPLE_TYPES = ['date', 'dateTime', 'string', 'integer', 'double', 'state']
    private final static DATE_TIME_INTERVAL = 'dtInterval'
    private final static LOCALIZED_TEXT = 'localizedText'

    QueryWrapper(RequestData data, String locale = 'ru')
    {
        validate(data)
        this.locale = locale
        this.data = data
        criteria = buildCriteria(data.source)
        data.aggregations.each { aggregation(it as AggregationParameter) }
        data.groups.each { grouping(it as GroupParameter) }
        data.filters?.with(this.&filtering)
    }

    /**
     * Метод выполнения запроса.
     * @return this
     */
    QueryWrapper executeQuery()
    {
        result = execute(criteria).collect()
        return this
    }

    /**
     * Метод получения результата.
     * @return список данных
     */
    def getResult()
    {
        return result
    }

    /**
     * Метод применения агрегации.
     * @param parameter - атрибут и тип агрегации.
     */
    private void aggregation(AggregationParameter parameter)
    {
        Aggregation aggregationType = parameter.type
        String code = getCriteriaColumnCode(parameter.attribute)
        switch (aggregationType)
        {
            case Aggregation.PERCENT:
                criteria.addColumn(aggregationType.apply(code, getTotalCount() as String))
                break
            case Aggregation.values() - Aggregation.PERCENT:
                criteria.addColumn(aggregationType.apply(code))
                break
            default: throw new Exception("Not support aggregation type: $aggregationType")
        }
    }

    /**
     * Метод применения группировок.
     * @param parameter - атрибут и тип группировки.
     */
    private void grouping(GroupParameter parameter)
    {
        HColumn columnCode = getCriteriaColumnCode(parameter.attribute)
        GroupType type = parameter.type
        switch (type)
        {
            case GroupType.DAY:
                def day = HHelper.getColumn("extract(DAY from $columnCode)")
                def month = HHelper.getColumn("extract(MONTH from $columnCode)")
                criteria.add(HRestrictions.isNotNull(month))
                criteria.add(HRestrictions.isNotNull(day))
                criteria.addGroupColumn(month as String)
                criteria.addGroupColumn(day as String)
                criteria.addOrder(HOrders.asc(month))
                criteria.addOrder(HOrders.asc(day))
                criteria.addColumn("concat($day, '/', $month)")
                break
            case GroupType.with { [WEEK, MONTH, QUARTER, YEAR] }:
                def column = HHelper.getColumn("extract($type from $columnCode)")
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(column as String)
                criteria.addOrder(HOrders.asc(column))
                criteria.addColumn(column)
                break
            case GroupType.SEVEN_DAYS:
                HCriteria cteSource = buildCriteria(data.source)
                HColumn cteColumn = revelation(parameter.attribute)
                        .inject(cteSource, this.&addAttributeInCriteria) as HColumn
                cteSource.addColumn("MIN(CAST($cteColumn AS timestamp))", 'cteMinDate')
                HCriteria cteCriteria = criteria.addCTESource(cteSource)

                // Вывод периода день.месяц-(день.месяц + 7 дней)
                HColumn startDate = cteCriteria.getProperty('cteMinDate')
                String weekNumber = "ROUND(ABS((extract(DAY from (CAST($columnCode AS timestamp)-$startDate))-0.6)/7))"

                // Группировка и сортировка по 7 дней от минимальной даты

                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(weekNumber)
                criteria.addOrder(HOrders.asc(HHelper.getColumn(weekNumber)))
                criteria.addColumn("MIN(concat($startDate,'#', $weekNumber))")
                break
            case GroupType.OVERLAP:
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(columnCode as String)
                criteria.addOrder(HOrders.asc(columnCode))
                criteria.addColumn(columnCode)
                break
            default: throw new Exception("Not support grouping type: $type")
        }
    }

    /**
     * Метод примменения устовий фильтрации через условие "И".
     * @param filters - условия фильтрации
     */
    private void filtering(Collection<Collection<FilterParameter>> filters)
    {
        filters.collect(this.&orCondition).with(HRestrictions.&and).with(criteria.&add)
    }

    /**
     * Добавление условия "ИЛИ" в критерию
     * @param list - условия фильтрации
     * @return HCriterion
     */
    private HCriterion orCondition(Collection<FilterParameter> list)
    {
        return list.collect { condition(it as FilterParameter) }.with(HRestrictions.&or)
    }

    /**
     * Добавление условия "ИЛИ" в критерию
     * @param list - условия фильтрации
     * @return HCriterion
     */
    private HCriterion condition(FilterParameter filter)
    {
        HColumn column = getCriteriaColumnCode(filter.attribute)
        String type = filter.type.toLowerCase()
        switch (type)
        {
            case ['=', 'equal', 'eq']:
                return HRestrictions.eq(column, filter.value)
            case ['!=', 'not equal', 'neq']:
                return HRestrictions.not(HRestrictions.eq(column, filter.value))
            case ['>', 'greater', 'gt']:
                return HRestrictions.gt(column, filter.value)
            case ['<', 'less', 'lt']:
                return HRestrictions.lt(column, filter.value)
            case ['>=', 'greater or equal', 'ge']:
                return HRestrictions.ge(column, filter.value)
            case ['<=', 'less or equal', 'le']:
                return HRestrictions.le(column, filter.value)
            case ['<=>', 'between']:
                def (first, second) = filter.value
                return HRestrictions.between(column, first, second)
            default: throw new Exception("Not supported filter type: $type!")
        }
    }

    /**
     * Метод получения кода атрибута у критериию Добаляет
     * @param attribute - атрибут
     * @return HColumn
     */
    private HColumn getCriteriaColumnCode(Attribute attribute)
    {
        assert attribute: "Empty attribute"
        return revelation(attribute).inject(criteria, this.&addAttributeInCriteria)
    }

    /**
     * Метод добавления кода атрибута в цепочку кодов. Нужен для работы с сылочными атрибутами
     * @param hColumn   - цепочка кодов атрибутов.
     * @param attribute - атрибут.
     * @return HColumn
     */
    private HColumn addAttributeInCriteria(HColumn hColumn, Attribute attribute)
    {
        String code = attribute.code == 'UUID' ? 'id' : attribute.code // Костыль.
        // В БД нет 'UUID' есть только 'id'
        // Неприятности могут возникнуть в модуле drilldown только в случае,
        // если пользователь построит диаграмму с разбивкой по уникальному идентификатору. Но это лишено смысла.
        switch (attribute.type)
        {
            case LINK_TYPES:
                return hColumn.addInnerJoin(code)
            case SIMPLE_TYPES:
                return hColumn.getProperty(code)
            case DATE_TIME_INTERVAL:
                return hColumn.getProperty(code).getProperty('ms')
            case LOCALIZED_TEXT:
                return hColumn.getProperty(code).getProperty(locale)
            default:
                throw new Exception("Not support attribute type: ${attribute.type}")
        }
    }

    /**
     * Метод получения количества количества записей в БД.
     * @return количество записей в БД.
     */
    private int getTotalCount()
    {
        return data.with {
            Attribute[] attributes = groups*.attribute + aggregations.attribute
            buildTotalCriteria(source, attributes).with(this.&execute).head()
        }
    }

    /**
     * Создание запроса на получения общего количества записей.
     * @param source - источник
     * @param attributes - атрибут по ктоторому отфильтровываются пустые значения
     * @return HCriteria
     */
    private HCriteria buildTotalCriteria(Source source, Attribute... attributes)
    {
        return attributes.grep().inject(buildCriteria(source) as HCriteria)
        { criteria, attribute ->
            getColumnCode(criteria, attribute)
                    .with(HHelper.&getColumn)
                    .with(HRestrictions.&isNotNull)
                    .with(criteria.&add)
        }.with { criteria ->
            criteria.addColumn(Aggregation.COUNT_CNT.apply(criteria.getAlias() as String))
        }
    }

    /**
     * Метод преобрадования вложенностей атрибута в список
     * @param attribute - атрибут
     * @return список вложеных атрибутов.
     */
    private static List<Attribute> revelation(Attribute attribute)
    {
        //TODO: метод стоит перенести в класс Attribute
        return attribute ? [attribute] + revelation(attribute.ref) : []
    }

    /**
     * Метод создания критерии по источнику даных
     * @param source - источник данных
     * @return HCriteria
     */
    private HCriteria buildCriteria(Source source)
    {
        HCriteria criteria = source.descriptor
                ?.with(api.listdata.&createListDescriptor)
                ?.with(api.listdata.&createCriteria)
                ?: HHelper.create().addSource(source.classFqn)
        criteria.getOrders().clear()
        return criteria
    }

    /**
     * Метод исполнения запроса
     * @param criteria - запрос
     * @return результат запроса
     */
    private execute(HCriteria criteria)
    {
        return api.db.query(criteria).list()
    }

    /**
     * Метод получения HQL запроса из критерии
     * @param criteria - запрос
     * @return HQL запроса
     */
    private showQuery(HCriteria criteria)
    { //TODO: в дальнейшем удалить
        criteria.getDelegate().generateHQL(beanFactory.getBean('sessionFactory').getCurrentSession())
    }

    /**
     * Метод проверки данных запроса.
     * Выбрасывает исключение.
     * @param data - данные запроса
     */
    private static void validate(RequestData data)
    {
        //TODO: можно перенести эти методы валидации в отдельный класс
        if (!data) throw new Exception("Empty request data")

        def source = data.source
        validate(source as Source)

        def aggregations = data.aggregations
        if (!aggregations) throw new Exception("Empty aggregation")
        aggregations.each { validate(it as AggregationParameter) }
        data.groups.each { validate(it as GroupParameter) }
    }

    /**
     * Метод проверки источника.
     * Бросает исключение.
     * @param source - источник
     */
    private static void validate(Source source)
    {
        if (!source) throw new Exception("Empty source")
        if (!(source.descriptor) && !(source.classFqn)) throw new Exception("Invalid source")
    }

    /**
     * Метод проверки параметра агрегации.
     * Бросает исключение.
     * @param parameter - параметр агрегации
     */
    private static def validate(AggregationParameter parameter)
    {
        Aggregation type = parameter.type
        String attributeType = parameter.attribute.type
        if (type in [Aggregation.MIN, Aggregation.MAX, Aggregation.SUM, Aggregation.AVG] && !(attributeType in NUMBER_TYPES))
            throw new Exception("Not suitable aggregation type: $type and attribute type: $attributeType")
    }

    /**
     * Метод проверки параметра группировки
     * @param parameter - параметр группировки
     */
    private static def validate(GroupParameter parameter)
    {
        GroupType type = parameter.type
        String attributeType = parameter.attribute.type
        if (type in GroupType.values() - GroupType.OVERLAP && !(attributeType in DATE_TYPES))
            throw new Exception("Not suitable group type: $type and attribute type: $attributeType")
    }
}

/**
 * Метод получения данных биаграммы
 * @param requestData - запрос на получение данных
 * @return результат выборки
 */
List<List> getData(RequestData requestData)
{
    QueryWrapper query = new QueryWrapper(requestData)
    def result = query.executeQuery().getResult()
    return requestData.groups?.size() ? result : [result] //приводим к единому формату данных
}