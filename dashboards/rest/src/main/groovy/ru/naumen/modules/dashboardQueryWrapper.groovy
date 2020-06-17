/*! UTF-8 */
//Автор: nordclan
//Дата создания: 21.01.2020
//Код:
//Назначение:
/**
 * Модуль получения данных для диаграмм
 */
//Версия: 1.1
//Категория: скриптовый модуль

package ru.naumen.modules

import groovy.transform.Field
import ru.naumen.core.server.script.api.criteria.*
import java.sql.Timestamp

//region КОНСТАНТЫ
@Field private static final String UUID_CODE = 'UUID'
//endregion

@ru.naumen.core.server.script.api.injection.InjectApi
trait CriteriaWrapper
{
    ApiCriteria buildCriteria(Source source)
    {
        return source.descriptor ? source.descriptor
                                         .with(api.listdata.&createListDescriptor)
                                         .with(api.listdata.&createCriteria) as ApiCriteria
            : api.db.createCriteria().addSource(source.classFqn) as ApiCriteria
    }

    List execute(ApiCriteria criteria)
    {
        return api.db.query(criteria).setMaxResults(100).list()
    }
}

class QueryWrapper implements CriteriaWrapper
{
    private ApiCriteria criteria

    protected QueryWrapper(Source source)
    {
        this.criteria = buildCriteria(source)
    }

    static QueryWrapper build(Source source)
    {
        return new QueryWrapper(source)
    }

    QueryWrapper aggregate(AggregationParameter parameter)
    {
        Aggregation aggregationType = parameter.type
        Closure aggregation = getAggregation(aggregationType)
        String[] attributeCodes =
            parameter.attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = api.selectClause.property(attributeCodes)
        column.with(aggregation).with(criteria.&addColumn)
        String sortingType = parameter.sortingType
        if (sortingType)
        {
            Closure sorting = getSorting(sortingType)
            column.with(aggregation).with(sorting).with(criteria.&addOrder)
        }
        return this
    }

    //Костыльный метод. Потому что логика выходит за пределы стандартного алгоритма
    QueryWrapper percentAggregate(AggregationParameter parameter, int totalCount)
    {
        def attribute = parameter.attribute
        def sc = api.selectClause
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        if (totalCount <= 0)
        {
            //Всё плохо. Процент невозможно вычислить!
            criteria.addColumn(sc.constant(0))
        }
        else
        {
            def column = sc.property(attributeCodes)
                           .with(sc.&count)
                           .with(sc.&columnMultiply.rcurry(sc.constant(100.00)))
                           .with(sc.&columnDivide.rcurry(sc.constant(totalCount)))
            column.with(criteria.&addColumn)
            String sortingType = parameter.sortingType
            if (sortingType)
            {
                Closure sorting = getSorting(sortingType)
                column.with(sorting).with(criteria.&addOrder)
            }
        }
        return this
    }

    QueryWrapper group(GroupParameter parameter)
    {
        def sc = api.selectClause
        GroupType groupType = parameter.type
        String[] attributeCodes =
            parameter.attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(attributeCodes)
        switch (groupType)
        {
            case GroupType.OVERLAP:
                criteria.addGroupColumn(column)
                criteria.addColumn(column)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    column.with(sorting).with(criteria.&addOrder)
                }
                break
            case GroupType.DAY:
                IApiCriteriaColumn dayColumn = sc.day(column)
                IApiCriteriaColumn monthColumn = sc.month(column)
                criteria.addGroupColumn(dayColumn)
                criteria.addGroupColumn(monthColumn)
                criteria.addOrder(ApiCriteriaOrders.asc(monthColumn))
                criteria.addOrder(ApiCriteriaOrders.asc(dayColumn))
                def sortColumn = sc.concat(dayColumn, sc.constant('/'), monthColumn)
                criteria.addColumn(sortColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    sortColumn.with(sorting).with(criteria.&addOrder)
                }
                break
            case GroupType.with { [WEEK, MONTH, QUARTER, YEAR] }:
                IApiCriteriaColumn groupColumn = sc.extract(column, groupType as String)
                criteria.addGroupColumn(groupColumn)
                criteria.addColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(groupColumn))
                }
                break
            case GroupType.SECOND_INTERVAL:
                def secondInterval = 1000
                IApiCriteriaColumn groupColumn = sc.columnDivide(
                    column, sc.constant(
                    secondInterval
                )
                )
                criteria.addGroupColumn(groupColumn)
                criteria.addColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(groupColumn))
                }
                break
            case GroupType.MINUTE_INTERVAL:
                def minuteInterval = 1000 * 60
                IApiCriteriaColumn groupColumn = sc.columnDivide(
                    column, sc.constant(
                    minuteInterval
                )
                )
                criteria.addGroupColumn(groupColumn)
                criteria.addColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(groupColumn))
                }
                break
            case GroupType.HOUR_INTERVAL:
                def hourInterval = 1000 * 60 * 60
                IApiCriteriaColumn groupColumn = sc.columnDivide(column, sc.constant(hourInterval))
                criteria.addGroupColumn(groupColumn)
                criteria.addColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(groupColumn))
                }
                break
            case GroupType.DAY_INTERVAL:
                def dayInterval = 1000 * 60 * 60 * 24
                IApiCriteriaColumn groupColumn = sc.columnDivide(column, sc.constant(dayInterval))
                criteria.addGroupColumn(groupColumn)
                criteria.addColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(groupColumn))
                }
                break
            case GroupType.WEEK_INTERVAL:
                def weekInterval = 1000 * 60 * 60 * 24 * 7
                IApiCriteriaColumn groupColumn = sc.columnDivide(column, sc.constant(weekInterval))
                criteria.addGroupColumn(groupColumn)
                criteria.addColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(groupColumn))
                }
                break
            case GroupType.getTimerTypes():
                String statusType = parameter.type?.toString()
                String statusCode = statusType?.toLowerCase().charAt(0)
                String columnCode = attributeCodes.join('.')
                criteria.add(api.filters.attrContains(columnCode, statusCode, false, false))
                criteria.addColumn(column)
                criteria.addGroupColumn(column)
                break
            default: throw new IllegalArgumentException("Not supported group type: $groupType")
        }
        return this
    }

    //Костыльный метод. Потому что логика выходит за пределы стандартного алгоритма
    QueryWrapper sevenDaysGroup(GroupParameter parameter, Date minStartDate)
    {
        def attribute = parameter.attribute
        def sc = api.selectClause
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        String minDate = new Timestamp(minStartDate.time)// преобразуем дату в понятный ормат для БД
        IApiCriteriaColumn weekNumberColumn = sc.property(attributeCodes)
            .with(sc.&cast.rcurry('timestamp')) // водим к формату даты
            .with(sc.&columnSubtract.rcurry(sc.constant("'$minDate'"))) // Вычитаем значение минимальной даты
            .with(sc.&extract.rcurry('DAY')) // извлекаем количество дней
            .with(sc.&columnSubtract.rcurry(sc.constant(0.6))) // вычистаем кофециент округления
            .with(sc.&columnDivide.rcurry(sc.constant(7))) // делим на семь дней
            .with(sc.&abs)
            .with(sc.&round)
        criteria.addGroupColumn(weekNumberColumn)
        def column = sc.concat(sc.constant("'$minDate'"), sc.constant('#'), weekNumberColumn)
        criteria.addColumn(column)
        String sortingType = parameter.sortingType
        if (sortingType)
        {
            Closure sorting = getSorting(sortingType)
            weekNumberColumn.with(sorting).with(criteria.&addOrder)
        }
        return this
    }

    QueryWrapper filtering(List<FilterParameter> filters)
    {
        filters.collect { parameter ->
            String columnCode = parameter.attribute
                                         .attrChains()*.code
                                         .inject { first, second ->
                                             "${ first }.${ second }".toString()
                                         }
            String code = parameter.attribute.code
            if (columnCode == 'id')
            {
                columnCode = modules.dashboardQueryWrapper.UUID_CODE
            }
            Comparison type = parameter.type
            switch (type)
            {
                case Comparison.IS_NULL:
                    return api.filters.isNull(columnCode)
                case Comparison.NOT_NULL:
                    return api.filters.isNotNull(columnCode)
                case Comparison.EQUAL:
                    return api.filters.attrValueEq(code, parameter.value)
                case Comparison.NOT_EQUAL:
                    return api.filters.attrValueEq(code, parameter.value)
                              .with(api.filters.&not)
                case Comparison.NOT_EQUAL_AND_NOT_NULL:
                    def notNullFilter = api.filters.attrContains.isNotNull(columnCode)
                    def notEqualFilter = api.filters.attrContains(
                        columnCode,
                        parameter.value,
                        false,
                        false
                    ).with(api.filters.&not)
                    return api.filters.and(notEqualFilter, notNullFilter)
                case Comparison.GREATER:
                    return api.filters.inequality(columnCode, '>', parameter.value)
                case Comparison.LESS:
                    return api.filters.inequality(columnCode, '<', parameter.value)
                case Comparison.GREATER_OR_EQUAL:
                    return api.filters.inequality(columnCode, '>=', parameter.value)
                case Comparison.LESS_OR_EQUAL:
                    return api.filters.inequality(columnCode, '<=', parameter.value)
                case Comparison.BETWEEN:
                    def (first, second) = parameter.value
                    return api.filters.between(columnCode, first, second)
                case Comparison.IN:
                    return api.filters.attrValueEq(code, parameter.value)
                case Comparison.CONTAINS:
                    return api.filters.attrContains(columnCode, parameter.value, false, false)
                case Comparison.NOT_CONTAINS:
                    return api.filters.attrContains(columnCode, parameter.value, false, false)
                              .with(api.filters.&not)
                case Comparison.NOT_CONTAINS_AND_NOT_NULL:
                    def notNullFilter = api.filters.isNotNull(columnCode)
                    def notContainsFilter = api.filters.attrContains(
                        columnCode,
                        parameter.value,
                        false, false
                    ).with(api.filters.&not)
                    return api.filters.and(notContainsFilter, notNullFilter)
                case Comparison.EQUAL_REMOVED:
                    return api.filters.attrContains(columnCode, parameter.value, false, false)
                case Comparison.NOT_EQUAL_REMOVED:
                    return api.filters.attrContains(columnCode, parameter.value, false, false)
                              .with(api.filters.&not)
                default: throw new IllegalArgumentException("Not supported filter type: $type!")

            }
        }.with {
            api.filters.or(*it)
        }.with(criteria.&add)
        return this
    }

    QueryWrapper ordering(Map parameter)
    {
        String orderType = parameter.type
        def attribute = parameter.attribute as Attribute
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode)

        switch (orderType.toLowerCase())
        {
            case 'asc':
                api.selectClause.property(attributeCodes)
                   .with(ApiCriteriaOrders.&asc)
                   .with(criteria.&addOrder)
                break
            case 'desc':
                api.selectClause.property(attributeCodes)
                   .with(ApiCriteriaOrders.&desc)
                   .with(criteria.&addOrder)
                break
            default: throw new IllegalArgumentException("Not supported ordering type: $orderType")
        }
        return this
    }

    List<List> getResult()
    {
        return execute(criteria).collect {
            it.collect() as List
        }
    }

    private Closure getAggregation(Aggregation type)
    {
        switch (type)
        {
            case Aggregation.COUNT_CNT:
                return api.selectClause.&count
            case Aggregation.SUM:
                return api.selectClause.&sum
            case Aggregation.AVG:
                return api.selectClause.&avg
            case Aggregation.MAX:
                return api.selectClause.&max
            case Aggregation.MIN:
                return api.selectClause.&min
            case Aggregation.PERCENT:
                throw new IllegalArgumentException("Still not supported aggregation type: $type")
            case Aggregation.MDN:
                throw new IllegalArgumentException("Still not supported aggregation type: $type")
            default: throw new IllegalArgumentException("Not supported aggregation type: $type")
        }
    }

    private Closure getSorting(String type)
    {
        switch (type)
        {
            case 'ASC':
                return ApiCriteriaOrders.&asc
            case 'DESC':
                return ApiCriteriaOrders.&desc
            default: throw new IllegalArgumentException("Not supported aggregation type: $type")
        }
    }

    /**
     * Метод подменяющий код атрибута metaClass на metaClassFqn
     * @param list - список кодов
     * @return Список кодов
     */
    private List<String> replaceMetaClassCode(List<String> list)
    {
        return 'metaClass' in list ? (list - 'metaClass' + 'metaClassFqn') : list
    }
}

/**
 * Метод получения данных биаграммы
 * @param requestData - запрос на получение данных
 * @return результат выборки
 */
List<List> getData(RequestData requestData)
{
    validate(requestData)
    validate(requestData.source)
    def wrapper = QueryWrapper.build(requestData.source)

    requestData.aggregations.each { validate(it as AggregationParameter) }
    requestData.aggregations.each { prepareAttribute(it.attribute as Attribute) }
    requestData.aggregations.each {
        AggregationParameter parameter = it as AggregationParameter
        if (parameter.type == Aggregation.PERCENT)
        {
            def totalAttribute = new Attribute(title: 'id', code: 'id', type: 'integer')
            def totalParameter = new AggregationParameter(
                title: 'totalCount',
                type: Aggregation.COUNT_CNT,
                attribute: totalAttribute
            )
            int totalCount = QueryWrapper.build(requestData.source)
                                         .aggregate(
                                             totalParameter
                                         )//TODO: возможно тут должны применяться фильтры от основного источника
                                         .result.head().head()
            wrapper.percentAggregate(parameter, totalCount)
        }
        else
        {
            wrapper.aggregate(parameter)
        }
    }

    //TODO: Нужна возможность получать начало отсчёта из вне
    requestData.groups.each { validate(it as GroupParameter) }
    requestData.groups.each { prepareAttribute(it.attribute as Attribute) }
    requestData.groups.each {
        GroupParameter parameter = it as GroupParameter
        if (parameter.type == GroupType.SEVEN_DAYS)
        {
            def minDateParameter = new AggregationParameter(
                title: 'min',
                type: Aggregation.MIN,
                attribute: parameter.attribute
            )
            Date startMinDate = QueryWrapper.build(requestData.source)
                                            .aggregate(minDateParameter)
                                            .result.head().head()
            wrapper.sevenDaysGroup(parameter, startMinDate)
        }
        else
        {
            wrapper.group(parameter)
        }
    }

    requestData.filters.each { wrapper.filtering(it as List<FilterParameter>) }

    //Фильтрация по непустым атрибутам
    Set attributeSet = requestData.aggregations*.attribute + requestData.groups*.attribute
    attributeSet.findResults {
        it
    }.collect { attr ->
        new FilterParameter(
            title: 'не пусто',
            type: Comparison.NOT_NULL,
            attribute: attr,
            value: null
        )
    }.each {
        wrapper.filtering([it])
    }

    return wrapper.result
}

/**
 * Метод проверки данных запроса.
 * Выбрасывает исключение.
 * @param data - данные запроса
 */
private void validate(RequestData data)
{
    if (!data)
    {
        throw new IllegalArgumentException("Empty request data")
    }

    def source = data.source
    validate(source as Source)

    def aggregations = data.aggregations
    if (!aggregations)
    {
        throw new IllegalArgumentException("Empty aggregation")
    }
    aggregations.each {
        validate(it as AggregationParameter)
    }
    data.groups.each {
        validate(it as GroupParameter)
    }
}

/**
 * Метод проверки источника.
 * Бросает исключение.
 * @param source - источник
 */
private void validate(Source source)
{
    if (!source)
    {
        throw new IllegalArgumentException("Empty source")
    }
    if (!(source.descriptor) && !(source.classFqn))
    {
        throw new IllegalArgumentException("Invalid source")
    }
}

/**
 * Метод проверки параметра агрегации.
 * Бросает исключение.
 * @param parameter - параметр агрегации
 */
private static def validate(AggregationParameter parameter) throws IllegalArgumentException
{
    if (!parameter.attribute.attrChains()) {
        throw new IllegalArgumentException("Attribute is null or empty!")
    }
    Aggregation type = parameter.type
    String attributeType = parameter.attribute.attrChains().last().type
    switch (attributeType)
    {
        case AttributeType.DT_INTERVAL_TYPE:
        case AttributeType.NUMBER_TYPES:
            if (!(type in Aggregation.with { [MIN, MAX, SUM, AVG, COUNT_CNT, PERCENT] })) {
                throw new IllegalArgumentException("Not suitable aggregation type: $type and attribute type: $attributeType")
            }
            break
        default:
            if (!(type in [Aggregation.COUNT_CNT, Aggregation.PERCENT]))
            {
                throw new IllegalArgumentException("Not suitable aggregation type: $type and attribute type: $attributeType")
            }
            break
    }
}

/**
 * Метод проверки параметра группировки
 * @param parameter - параметр группировки
 */
private static def validate(GroupParameter parameter)
{
    if (!parameter.attribute.attrChains()) {
        throw new IllegalArgumentException("Attribute is null or empty!")
    }
    GroupType type = parameter.type
    //Смотрим на тип последнего вложенного атрибута
    String attributeType = parameter.attribute.attrChains().last().type
    switch (attributeType)
    {
        case AttributeType.DT_INTERVAL_TYPE:
            def groupTypeSet = GroupType.with {
                [OVERLAP, SECOND_INTERVAL, MINUTE_INTERVAL, HOUR_INTERVAL, DAY_INTERVAL,
                 WEEK_INTERVAL]
            }
            if (!(type in groupTypeSet))
            {
                throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
            }
            break
        case AttributeType.DATE_TYPES:
            def groupTypeSet = GroupType.with {
                [OVERLAP, DAY, SEVEN_DAYS, WEEK, MONTH, QUARTER, YEAR]
            }
            if (!(type in groupTypeSet))
            {
                throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
            }
            break
        case AttributeType.TIMER_TYPES:
            def groupTypeSet = GroupType.with {
                [OVERLAP, ACTIVE, NOT_STARTED, PAUSED, STOPPED, EXCEED]
            }
            if (!(type in groupTypeSet))
            {
                throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
            }
            break
        default:
            if (type != GroupType.OVERLAP)
            {
                throw new IllegalArgumentException("Not suitable group type: $type and attribute type: $attributeType")
            }
            break
    }
}

/**
 * Метод подготовки полей атрибута
 * @param parameter - параметр агрегации
 */
private static  def prepareAttribute(Attribute attribute) {
    String attributeType = attribute.attrChains().last().type
    String attributeCode = attribute.attrChains().last().code
    switch (attributeType) {
        case AttributeType.LOCALIZED_TEXT_TYPE:
           attribute.attrChains().last().ref = new Attribute(code: 'ru', type: 'string')
            break
        case AttributeType.DT_INTERVAL_TYPE:
           attribute.attrChains().last().ref = new Attribute(code: 'ms', type: 'long')
            break
        case AttributeType.TIMER_TYPES:
            attribute.attrChains().last().ref = new Attribute(code: 'statusCode', type: 'string')
            break
        default:
            if (!(attributeType in AttributeType.ALL_ATTRIBUTE_TYPES))
            {
                throw new IllegalArgumentException("Not supported attribute type: $attributeType")
            }
            break
    }
    if (attributeCode == UUID_CODE)
    {
        attribute.attrChains().last().code = 'id'
    }
}
