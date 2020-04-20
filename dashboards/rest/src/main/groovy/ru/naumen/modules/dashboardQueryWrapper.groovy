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

@ru.naumen.core.server.script.api.injection.InjectApi
trait CriteriaWrapper {
    HCriteria buildCriteria(Source source) {
        return source.descriptor ? source.descriptor
                .with(api.listdata.&createListDescriptor)
                .with(api.listdata.&createCriteria) as HCriteria
                : HHelper.create().addSource(source.classFqn) as HCriteria
    }

    HColumn getCriteriaColumn(HCriteria criteria, Attribute attribute) {
        return attribute.revelation().inject(criteria as HColumn) { column, attr ->
            addAttributeInCriteria(column, attr)
        }
    }

    abstract HColumn addAttributeInCriteria(HColumn column, Attribute attribute)

    List execute(HCriteria criteria) {
        return api.db.query(criteria).list()
    }

    String showQuery(HCriteria criteria) { //TODO: в дальнейшем удалить
        return criteria.getDelegate().generateHQL(beanFactory.getBean('sessionFactory').getCurrentSession())
    }
}

/**
 * Класс обёртка над HCriteria.
 * Класс бля получений из бд данных диаграмм.
 */
@ru.naumen.core.server.script.api.injection.InjectApi
class QueryWrapper implements CriteriaWrapper
{
    private RequestData data // данные тут нужны только из-за подсчёта процентов
    private HCriteria criteria
    private List result
    private String locale

    //TODO: Придётся переписывать весь модуль для возможности кастомизировать его костылями.
    private final static TIMER_TYPE = ['timer', 'backTimer']
    private final static NUMBER_TYPES = ['integer', 'double']
    private final static DATE_TYPES = ['date', 'dateTime']
    private final static LINK_TYPES = ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem']
    private final static SIMPLE_TYPES = ['date', 'dateTime', 'string', 'integer', 'double', 'state'] //TODO: расширить набор типов
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
        data.filters ? filtering(data.filters) : filteringRemoved()
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
     * Метод добавления кода атрибута в цепочку кодов. Нужен для работы с ссылочными атрибутами
     * @param hColumn   - цепочка кодов атрибутов.
     * @param attribute - атрибут.
     * @return HColumn
     */
    @Override
    private HColumn addAttributeInCriteria(HColumn column, Attribute attribute) {
        String code = attribute.code == 'UUID' ? 'id' : attribute.code // Костыль.
        // В БД нет 'UUID' есть только 'id'
        // Неприятности могут возникнуть в модуле drilldown только в случае,
        // если пользователь построит диаграмму с разбивкой по уникальному идентификатору. Но это лишено смысла.
        switch (attribute.type)
        {
            case LINK_TYPES:
                return column.addInnerJoin(code)
            case SIMPLE_TYPES:
                return column.getProperty(code)
            case DATE_TIME_INTERVAL:
                return column.getProperty(code).getProperty('ms')
            case LOCALIZED_TEXT:
                return column.getProperty(code).getProperty(locale)
            case TIMER_TYPE:
                return column.getProperty(code)//.getProperty('statusCode') // у таймера нас интересует только его статус
                // не совсем
            default:
                throw new IllegalArgumentException("Not support attribute type: ${attribute.type}")
        }
    }

    /**
     * Метод применения агрегации.
     * @param parameter - атрибут и тип агрегации.
     */
    private void aggregation(AggregationParameter parameter)
    {
        Aggregation aggregationType = parameter.type

        parameter.attribute.revelation().last().with { //костыль, если попался таймер, то нас интересует его статус
            if (it.type in TIMER_TYPE) {
                it.ref = new Attribute(title: 'статус', code: 'statusCode', type: 'string')
            }
        }

        String code = getCriteriaColumnCode(parameter.attribute)
        switch (aggregationType)
        {
            case Aggregation.PERCENT:
                //TODO: имеется проблема при вычислении процента в пустом множестве.
                // результатом является неопределённость (0/0)
                criteria.addColumn(aggregationType.apply(code, getTotalCount() as String))
                break
            case Aggregation.values() - Aggregation.PERCENT:
                criteria.addColumn(aggregationType.apply(code))
                break
            default: throw new IllegalArgumentException("Not support aggregation type: $aggregationType")
        }
    }

    /**
     * Метод применения группировок.
     * @param parameter - атрибут и тип группировки.
     */
    private void grouping(GroupParameter parameter)
    {
        parameter.attribute.revelation().last().with { //костыль, если попался таймер, то нас интересует его статус
            if (it.type in TIMER_TYPE) {
                it.ref = new Attribute(title: 'статус', code: 'statusCode', type: 'string')
            }
        }
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
                HColumn cteColumn = parameter.attribute.revelation()
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
            case GroupType.SECOND_INTERVAL:
                def secondInterval = 1000
                def code = columnCode.with { "$it/$secondInterval" }
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(code)
                criteria.addOrder(HOrders.asc(HHelper.getColumn(code)))
                criteria.addColumn(code)
                break
            case GroupType.MINUTE_INTERVAL:
                def minuteInterval = 1000 * 60
                def code = columnCode.with { "$it/$minuteInterval" }
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(code)
                criteria.addOrder(HOrders.asc(HHelper.getColumn(code)))
                criteria.addColumn(code)
                break
            case GroupType.HOUR_INTERVAL:
                def hourInterval = 1000 * 60 * 60
                def code = columnCode.with { "$it/$hourInterval" }
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(code)
                criteria.addOrder(HOrders.asc(HHelper.getColumn(code)))
                criteria.addColumn(code)
                break
            case GroupType.DAY_INTERVAL:
                def dayInterval = 1000 * 60 * 60 * 24
                def code = columnCode.with { "$it/$dayInterval" }
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(code)
                criteria.addOrder(HOrders.asc(HHelper.getColumn(code)))
                criteria.addColumn(code)
                break
            case GroupType.WEEK_INTERVAL:
                def weekInterval = 1000 * 60 * 60 * 24 * 7
                def code = columnCode.with { "$it/$weekInterval" }
                criteria.add(HRestrictions.isNotNull(columnCode))
                criteria.addGroupColumn(code)
                criteria.addOrder(HOrders.asc(HHelper.getColumn(code)))
                criteria.addColumn(code)
                break
            default: throw new IllegalArgumentException("Not support grouping type: $type")
        }
    }

    private void filteringRemoved() {
        HRestrictions.eq(criteria.getProperty('removed'), false).with(criteria.&add)
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
        def type = filter.type as Comparison
        def removedFalse = HRestrictions.eq(criteria.getProperty('removed'), false)
        switch (type)
        {
            case Comparison.IS_NULL:
                def condition = HRestrictions.isNull(column)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.NOT_NULL:
                def condition = HRestrictions.isNotNull(column)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.NOT_EQUAL_AND_NOT_NULL:
                def condition = HRestrictions.eqNullSafe(column, filter.value).with(HRestrictions.&not)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.EQUAL:
                def condition = HRestrictions.eq(column, filter.value)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.NOT_EQUAL:
                def condition = HRestrictions.ne(column, filter.value)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.GREATER:
                def condition = HRestrictions.gt(column, filter.value)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.LESS:
                def condition = HRestrictions.lt(column, filter.value)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.GREATER_OR_EQUAL:
                def condition = HRestrictions.ge(column, filter.value)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.LESS_OR_EQUAL:
                def condition = HRestrictions.le(column, filter.value)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.BETWEEN:
                def (first, second) = filter.value
                def condition = HRestrictions.between(column, first, second)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.IN:
                def condition = HRestrictions.in(column, filter.value as Collection)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.CONTAINS:
                def condition = HRestrictions.like(column, filter.value.with { "%$it%" })
                return HRestrictions.and(condition, removedFalse)
            case Comparison.NOT_CONTAINS:
                def condition = HRestrictions.like(column, filter.value.with { "%$it%" }).with(HRestrictions.&not)
                return HRestrictions.and(condition, removedFalse)
            case Comparison.NOT_CONTAINS_AND_NOT_NULL:
                def notNull = HRestrictions.isNotNull(column)
                def condition = HRestrictions.like(column, filter.value.with { "%$it%" }).with(HRestrictions.&not)
                return HRestrictions.and(condition, notNull, removedFalse)
            case Comparison.EQUAL_REMOVED:
                return HRestrictions.eq(column, filter.value)
            case Comparison.NOT_EQUAL_REMOVED:
                return HRestrictions.ne(column, filter.value)
            default: throw new IllegalArgumentException("Not supported filter type: $type!")
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
        HCriteria totalCriteria = buildCriteria(source)
        attributes.each { attribute ->
            getCriteriaColumn(totalCriteria, attribute)
                    .with(HRestrictions.&isNotNull)
                    .with(totalCriteria.&add)
        }
        def countColumn = Aggregation.COUNT_CNT.apply(totalCriteria.getAlias() as String)
        totalCriteria.addColumn(countColumn)
        return totalCriteria
    }

    /**
     * Метод получения кода атрибута у критериию Добаляет
     * @param attribute - атрибут
     * @return HColumn
     */
    private HColumn getCriteriaColumnCode(Attribute attribute)
    {
        assert attribute: "Empty attribute"
        return getCriteriaColumn(criteria, attribute)
    }


    /**
     * Метод проверки данных запроса.
     * Выбрасывает исключение.
     * @param data - данные запроса
     */
    private static void validate(RequestData data)
    {
        //TODO: можно перенести эти методы валидации в отдельный класс
        if (!data) throw new IllegalArgumentException("Empty request data")

        def source = data.source
        validate(source as Source)

        def aggregations = data.aggregations
        if (!aggregations) throw new IllegalArgumentException("Empty aggregation")
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
        if (!source) throw new IllegalArgumentException("Empty source")
        if (!(source.descriptor) && !(source.classFqn)) throw new IllegalArgumentException("Invalid source")
    }

    /**
     * Метод проверки параметра агрегации.
     * Бросает исключение.
     * @param parameter - параметр агрегации
     */
    private static def validate(AggregationParameter parameter) throws IllegalArgumentException
    {
        Aggregation type = parameter.type
        String attributeType = parameter.attribute.type
        switch (attributeType) {
            case NUMBER_TYPES:
                if (!(type in Aggregation.with { [MIN, MAX, SUM, AVG, COUNT_CNT, PERCENT] }))
                    throw new IllegalArgumentException("Not suitable aggregation type: $type and attribute type: $attributeType")
                break
            default:
                if (!(type in [Aggregation.COUNT_CNT, Aggregation.PERCENT]))
                    throw new IllegalArgumentException("Not suitable aggregation type: $type and attribute type: $attributeType")
                break
        }
    }

    /**
     * Метод проверки параметра группировки
     * @param parameter - параметр группировки
     */
    private static def validate(GroupParameter parameter)
    {
        GroupType type = parameter.type
        //Смотрим на тип последнего вложенного атрибута
        String attributeType = parameter.attribute.revelation().last().type

        switch (attributeType) {
            case DATE_TIME_INTERVAL:
                def groupTypeSet = GroupType.with {
                    [OVERLAP, SECOND_INTERVAL, MINUTE_INTERVAL, HOUR_INTERVAL, DAY_INTERVAL, WEEK_INTERVAL]
                }
                if (!(type in groupTypeSet)) {
                    throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
                }
                break
            case DATE_TYPES:
                def groupTypeSet = GroupType.with { [OVERLAP, DAY, SEVEN_DAYS, WEEK, MONTH, QUARTER, YEAR] }
                if(!(type in groupTypeSet)) {
                    throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
                }
                break
            default:
                if (type != GroupType.OVERLAP) {
                    throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
                }
                break
        }
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
