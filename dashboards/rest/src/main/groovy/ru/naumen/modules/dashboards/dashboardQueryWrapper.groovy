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

package ru.naumen.modules.dashboards

import groovy.transform.Field
import ru.naumen.core.server.script.api.criteria.*
import java.sql.Timestamp

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

    List execute(ApiCriteria criteria, DiagramType diagramType = DiagramType.COLUMN, Boolean ignoreParameterLimit = false)
    {
        if(diagramType == DiagramType.TABLE)
        {
            if (ignoreParameterLimit)
            {
                return api.db.query(criteria).list()
            }
            else
            {
                return api.db.query(criteria).setMaxResults(DashboardUtils.tableParameterLimit).list()
            }

        }
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

    QueryWrapper aggregate(AggregationParameter parameter, boolean fromSevenDays = false, Integer top = null)
    {
        Aggregation aggregationType = parameter.type
        def sc = api.selectClause
        def attribute = parameter.attribute
        Closure aggregation = getAggregation(aggregationType)
        String[] attributeCodes = parameter.attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(attributeCodes)
        if (parameter.attribute.type == AttributeType.CATALOG_ITEM_TYPE &&
            aggregationType == Aggregation.AVG)
        {
            parameter?.attribute?.ref = new Attribute(
                code: 'code',
                title: "Код элемента справочника",
                type: "string"
            )
            attributeCodes = parameter.attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
            column = sc.property(attributeCodes)
            column = column.with(sc.&cast.rcurry('integer'))
        }

        if (fromSevenDays && (attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)))
        {
            String linkTemplateUuid = attribute.attrChains().last().title ?: ''
            column = castDynamicToType(attribute, column)
            criteria.add(api.filters.attrValueEq('totalValue.linkTemplate', linkTemplateUuid))
        }
        column.with(aggregation).with(criteria.&addColumn)
        if(top)
        {
            column.with(aggregation).with(getSorting('DESC')).with(criteria.&addOrder)
        }
        else
        {
            String sortingType = parameter.sortingType
            if (sortingType)
            {
                Closure sorting = getSorting(sortingType)
                column.with(aggregation).with(sorting).with(criteria.&addOrder)
            }
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

    /**
     * Метод агрегации N/A
     * @param parameter - параметр агрегации
     * @param diagramType - тип диаграммы
     * @return тело запрос с агрегацией N/A
     */
    QueryWrapper noneAggregate(parameter, DiagramType diagramType)
    {
        def attribute = parameter.attribute
        def sc = api.selectClause
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(attributeCodes)
        if (parameter.attribute.type in AttributeType.LINK_TYPES_WITHOUT_CATALOG)
        {
            String attributeCode = attributeCodes.find()
            column = sc.concat(column, sc.constant(ObjectMarshaller.delimiter), sc.property("${attributeCode}.${DashboardQueryWrapperUtils.UUID_CODE}"))
            criteria.addGroupColumn(sc.property("${attributeCode}.${DashboardQueryWrapperUtils.UUID_CODE}"))
        }
        //атрибут связанного типа
        if(parameter.attribute.type == AttributeType.STRING_TYPE)
        {
            column = sc.concat(column, sc.constant(ObjectMarshaller.delimiter), sc.property(DashboardQueryWrapperUtils.UUID_CODE))
            criteria.addGroupColumn(sc.property(DashboardQueryWrapperUtils.UUID_CODE))
        }

        if (attributeCodes.any { it.contains('state') })
        {
            column = sc.concat(sc.property(attributeCodes),
                               sc.constant(StateMarshaller.delimiter),
                               sc.property('metaCaseId'))
            criteria.addGroupColumn(column)
            criteria.addGroupColumn(sc.property('metaCaseId'))
            criteria.addColumn(column)
            return this
        }

        criteria.addColumn(column)
        criteria.addGroupColumn(column)
        return this
    }

    /**
     * Метод преобразования динамического типа атрибута к конкретному типу даты
     * @param attribute - динамический атрибут
     * @param column - преобразованная колонка для запроса
     * @return готовка для запроса колонка
     */
    private IApiCriteriaColumn castDynamicToType(Attribute attribute, def column)
    {
        if (attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE) &&
            (attribute.type in AttributeType.DATE_TYPES))
        {
            String typeToCast = attribute.type == AttributeType.DATE_TIME_TYPE ? 'timestamp' : attribute.type
            def sc = api.selectClause
            return sc.cast(column, typeToCast)
        }
        return column
    }

    /**
     * Метод по получению правильного подхода к группированию по кварталу
     * @return колонка для группировки по кварталу
     */
    private IApiCriteriaColumn getQuarterGroupColumn(def column)
    {
        def sc = api.selectClause
        if(sc.metaClass.respondsTo(sc, 'quarter'))
        {
            return sc.quarter(column)
        }
        else
        {
            return sc.extract(column, 'QUARTER')
        }
    }

    /**
     * Метод по добавлению группировок в запрос и их обработке
     * @param wrapper - текущий запрос в БД
     * @param parameter - параметр с группой для добавления
     * @param diagramType - тип диаграммы
     * @return текущий запрос в БД с добавленной группой
     */
    QueryWrapper processGroup(QueryWrapper wrapper, GroupParameter parameter, DiagramType diagramType, Source source)
    {
        if (parameter.type == GroupType.SEVEN_DAYS)
        {
            Date startMinDate = DashboardUtils.getMinDate(
                parameter.attribute.code,
                parameter.attribute.sourceCode,
                source.descriptor
            )
            startMinDate = new Date(startMinDate.time).clearTime()
            wrapper.sevenDaysGroup(parameter, startMinDate)
        }
        else
        {
            wrapper.group(parameter, diagramType)
        }
        return wrapper
    }

    /**
     * Метод по добавлению агрегаций в запрос и их обработке
     * @param wrapper текущий запрос в БД
     * @param requestData - данные для запроса
     * @param parameter - параметр с агрегацией для добавления
     * @param diagramType - тип диаграммы
     * @return текущий запрос в БД с добавленной агрегацией
     */
    QueryWrapper processAggregation(QueryWrapper wrapper, RequestData requestData, AggregationParameter parameter, DiagramType diagramType, Integer top)
    {
        if (parameter.type == Aggregation.PERCENT)
        {
            def totalAttribute = new Attribute(title: 'id', code: 'id', type: 'integer')
            def totalParameter = new AggregationParameter(
                title: 'totalCount',
                type: Aggregation.COUNT_CNT,
                attribute: totalAttribute
            )

            def filterAttribute = requestData?.groups?.find()?.attribute
            def filterParameter = filterAttribute
                ? new FilterParameter(
                title: 'filter',
                type: Comparison.NOT_NULL,
                attribute: filterAttribute)
                : null

            def wrappedQuery = QueryWrapper.build(requestData.source)
            if (filterParameter)
            {
                wrappedQuery.filtering([filterParameter])
            }
            int totalCount = wrappedQuery.aggregate(totalParameter, false, top)
                                         .result.head().head()

            wrapper.percentAggregate(parameter, totalCount)
        }
        else if (parameter.type == Aggregation.NOT_APPLICABLE)
        {
            wrapper.noneAggregate(parameter, diagramType)
        }
        else
        {
            wrapper.aggregate(parameter, false, top)
        }
    }

    QueryWrapper group(GroupParameter parameter, DiagramType diagramType)
    {
        def sc = api.selectClause
        GroupType groupType = parameter.type
        String[] attributeCodes = parameter.attribute.attrChains()*.code
                                           .with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(attributeCodes)
        column = castDynamicToType(parameter.attribute, column)
        switch (groupType)
        {
            case GroupType.OVERLAP:
                if (attributeCodes.any {it.contains('state')})
                {
                    column = sc.concat(sc.property(attributeCodes),
                                       sc.constant(StateMarshaller.delimiter),
                                       sc.property('metaCaseId'))
                    criteria.addGroupColumn(column)
                    criteria.addGroupColumn(sc.property('metaCaseId'))
                    criteria.addColumn(column)
                }
                else if(parameter.attribute.type in AttributeType.ONLY_LINK_TYPES)
                {
                    column = sc.concat(
                        sc.property(attributeCodes),
                        sc.constant(LinksAttributeMarshaller.delimiter),
                        sc.property(LinksAttributeMarshaller.marshal(parameter.attribute.code, DashboardQueryWrapperUtils.UUID_CODE))
                    )
                    criteria.addGroupColumn(column)
                    criteria.addColumn(column)
                }
                else
                {
                    criteria.addGroupColumn(column)
                    criteria.addColumn(column)
                }
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    column.with(sorting).with(criteria.&addOrder)
                }
                break
            case GroupType.MINUTES:
                def groupColumn = sc.extract(column, 'MINUTE')
                criteria.addColumn(groupColumn)
                criteria.addGroupColumn(groupColumn)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    groupColumn.with(sorting).with(criteria.&addOrder)
                }
                break
            case GroupType.DAY:
                String format = parameter.format
                switch (format)
                {
                    case 'dd':
                        def dayColumn = sc.day(column)
                        criteria.addColumn(dayColumn)
                        criteria.addGroupColumn(dayColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            dayColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(dayColumn))
                        }
                        break
                    case 'dd.mm.YY':
                        def dayColumn = sc.day(column)
                        def monthColumn = sc.month(column)
                        def yearColumn = sc.year(column)
                        criteria.addColumn(
                            sc.concat(
                                dayColumn, sc.constant('.'),
                                monthColumn, sc.constant('.'),
                                yearColumn
                            )
                        )

                        criteria.addGroupColumn(yearColumn)
                        criteria.addGroupColumn(monthColumn)
                        criteria.addGroupColumn(dayColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            yearColumn.with(sorting).with(criteria.&addOrder)
                            monthColumn.with(sorting).with(criteria.&addOrder)
                            dayColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(yearColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(monthColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(dayColumn))
                        }
                        break
                    case 'dd.mm.YY hh':
                        IApiCriteriaColumn hourColumn = sc.extract(column, 'HOUR')
                        IApiCriteriaColumn dayColumn = sc.day(column)
                        IApiCriteriaColumn monthColumn = sc.month(column)
                        IApiCriteriaColumn yearColumn = sc.year(column)

                        criteria.addColumn(sc.concat(dayColumn,sc.constant('.'),
                                                     monthColumn, sc.constant('.'),
                                                     yearColumn, sc.constant(' '),
                                                     hourColumn))

                        criteria.addGroupColumn(yearColumn)
                        criteria.addGroupColumn(monthColumn)
                        criteria.addGroupColumn(dayColumn)
                        criteria.addGroupColumn(hourColumn)

                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            yearColumn.with(sorting).with(criteria.&addOrder)
                            monthColumn.with(sorting).with(criteria.&addOrder)
                            dayColumn.with(sorting).with(criteria.&addOrder)
                            hourColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(yearColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(monthColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(dayColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(hourColumn))
                        }
                        break
                    case 'dd.mm.YY hh:ii':
                        criteria.addGroupColumn(column)
                        criteria.addColumn(column)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            column.with(sorting).with(criteria.&addOrder)
                        }
                        break
                    case 'WD':
                        def weekColumn = sc.dayOfWeek(column)
                        criteria.addColumn(weekColumn)
                        criteria.addGroupColumn(weekColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            weekColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(weekColumn))
                        }
                        break
                    default:
                        IApiCriteriaColumn dayColumn = sc.day(column)
                        IApiCriteriaColumn monthColumn = sc.month(column)
                        criteria.addGroupColumn(dayColumn)
                        criteria.addGroupColumn(monthColumn)
                        def sortColumn = sc.concat(dayColumn, sc.constant('/'), monthColumn)
                        criteria.addColumn(sortColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            monthColumn.with(sorting).with(criteria.&addOrder)
                            dayColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(monthColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(dayColumn))
                        }
                }
                break
            case GroupType.with { [WEEK, MONTH, QUARTER, YEAR] }:
                String format = parameter.format
                switch (format)
                {
                    case 'WW YY':
                        def weekColumn = sc.week(column)
                        def yearColumn = sc.year(column)
                        criteria.addColumn(sc.concat(weekColumn,
                                                     sc.constant(' неделя '),
                                                     yearColumn))
                        criteria.addGroupColumn(yearColumn)
                        criteria.addGroupColumn(weekColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            yearColumn.with(sorting).with(criteria.&addOrder)
                            weekColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(yearColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(weekColumn))
                        }
                        break
                    case 'MM YY':
                        def monthColumn = sc.month(column)
                        def yearColumn = sc.year(column)
                        criteria.addColumn(sc.concat(monthColumn, sc.constant('/'), yearColumn))
                        criteria.addGroupColumn(yearColumn)
                        criteria.addGroupColumn(monthColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            yearColumn.with(sorting).with(criteria.&addOrder)
                            monthColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(yearColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(monthColumn))
                        }
                        break
                    case 'QQ YY':
                        def quarterColumn = getQuarterGroupColumn(column)
                        def yearColumn = sc.year(column)
                        criteria.addColumn(sc.concat(quarterColumn, sc.constant(' кв-л '),
                                                     yearColumn))
                        criteria.addGroupColumn(yearColumn)
                        criteria.addGroupColumn(quarterColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            yearColumn.with(sorting).with(criteria.&addOrder)
                            quarterColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(yearColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(quarterColumn))
                        }
                        break
                    default:
                        IApiCriteriaColumn groupColumn
                        if(groupType == GroupType.QUARTER)
                        {
                            groupColumn = getQuarterGroupColumn(column)
                        }
                        else
                        {
                            groupColumn = sc.(groupType.toString().toLowerCase())(column)
                        }
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
            case GroupType.HOURS:
                String format = parameter.format
                IApiCriteriaColumn hourColumn = sc.extract(column, 'HOUR')
                switch (format)
                {
                    case 'hh':
                        criteria.addGroupColumn(hourColumn)
                        criteria.addColumn(hourColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            hourColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(hourColumn))
                        }
                        break
                    case 'hh:ii':
                        IApiCriteriaColumn minuteColumn = sc.extract(column, 'MINUTE')
                        criteria.addColumn(sc.concat(hourColumn, sc.constant(':'), minuteColumn))
                        criteria.addGroupColumn(hourColumn)
                        criteria.addGroupColumn(minuteColumn)
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            hourColumn.with(sorting).with(criteria.&addOrder)
                            minuteColumn.with(sorting).with(criteria.&addOrder)
                        }
                        else
                        {
                            criteria.addOrder(ApiCriteriaOrders.asc(hourColumn))
                            criteria.addOrder(ApiCriteriaOrders.asc(minuteColumn))
                        }
                        break
                    default: throw new IllegalArgumentException("Not supported format: $format")
                }
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
                                                .with(sc.&cast.rcurry('timestamp')) // приводим к формату даты
                                                .with(sc.&columnSubtract.rcurry(sc.constant("'$minDate'"))) // Вычитаем значение минимальной даты
                                                .with(sc.&extract.rcurry('DAY')) // извлекаем количество дней
                                                .with(sc.&columnSum.rcurry(sc.constant(DashboardQueryWrapperUtils.ACCURACY))) //прибавляем для точности данных
                                                .with(sc.&columnDivide.rcurry(sc.constant(DashboardQueryWrapperUtils.WEEKDAY_COUNT))) // делим на семь дней
                                                .with(sc.&columnSubtract.rcurry(sc.constant(DashboardQueryWrapperUtils.ROUNDING))) // вычитаем коэффициент округления
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
            String parameterFqn = parameter.attribute.metaClassFqn
            if (parameter.attribute.attrChains()*.code.any { it == 'id' })
            {
                columnCode = columnCode.replace('id', DashboardQueryWrapperUtils.UUID_CODE)
            }
            if (code == AttributeType.TOTAL_VALUE_TYPE)
            {
                code = columnCode
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
                    def nullFilter = api.filters.isNull(columnCode)
                    def notEqualFilter = api.filters.attrValueEq(columnCode, parameter.value)
                                            .with(api.filters.&not)
                    return api.filters.or(notEqualFilter, nullFilter)
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
                case Comparison.NOT_CONTAINS_INCLUDING_EMPTY:
                    def nullFilter = api.filters.isNull(columnCode)
                    def notContainsFilter = api.filters.attrContains(
                        columnCode, parameter.value,
                        false, false
                    ).with(api.filters.&not)
                    return api.filters.or(notContainsFilter, nullFilter)
                case Comparison.EQUAL_REMOVED:
                    return api.filters.attrContains(columnCode, parameter.value, false, false)
                case Comparison.NOT_EQUAL_REMOVED:
                    return api.filters.attrContains(columnCode, parameter.value, false, false)
                              .with(api.filters.&not)
                case Comparison.STATE_TITLE_CONTAINS:
                    List fqns = getFqns(parameterFqn)
                    return api.filters.stateTitleLike(fqns, parameter.value)
                case Comparison.STATE_TITLE_NOT_CONTAINS:
                    List fqns = getFqns(parameterFqn)
                    return api.filters.stateTitleLike(fqns, parameter.value).with(api.filters.&not)
                case Comparison.METACLASS_TITLE_CONTAINS:
                    return api.filters.inCases(api.metainfo.getTypes(parameterFqn).findAll{
                        it.title.contains(parameter.value)
                    }*.fqnCase as String[])
                case Comparison.METACLASS_TITLE_NOT_CONTAINS:
                    return api.filters.inCases(api.metainfo.getTypes(parameterFqn).findAll{
                        !it.title.contains(parameter.value)
                    }*.fqnCase as String[])
                default: throw new IllegalArgumentException("Not supported filter type: $type!")

            }
        }.with {
            api.filters.or(*it)
        }.with(criteria.&add)
        return this
    }

    /**
     * Метод получения fqn-ов для типов, которые должны попасть в результаты выборки
     * @param parameterFqn - fqn класса параметра
     * @return список fqn-ов типов
     */
    List getFqns(String parameterFqn)
    {
        List total = api.metainfo.getTypes(parameterFqn)?.toList()
        return total.collect {
            api.types.newClassFqn(it as String)
        }
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

    List<List> getResult(Boolean requestHasOneNoneAggregation = false, DiagramType diagramType = DiagramType.COLUMN, Boolean ignoreParameterLimit = false)
    {
        return execute(criteria, diagramType, ignoreParameterLimit).collect {
            requestHasOneNoneAggregation ? [it] : it.collect() as List
        }
    }

    private Closure getAggregation(Aggregation type)
    {
        switch (type)
        {
            case Aggregation.COUNT_CNT:
                return api.selectClause.&countDistinct
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


class DashboardQueryWrapperUtils
{
    private static final String UUID_CODE = 'UUID'
    private static final Double ACCURACY = 0.9
    private static final Double ROUNDING = 0.6
    private static final Integer WEEKDAY_COUNT = 7

    /**
     * Метод получения данных биаграммы
     * @param requestData - запрос на получение данных
     * @param onlyFilled - вывод только заполненных полей
     * @param diagramType - тип диаграммы
     * @return результат выборки
     */
    static List<List> getData(RequestData requestData, Integer top, Boolean onlyFilled = true, DiagramType diagramType = DiagramType.DONUT,
                              Boolean ignoreParameterLimit = false)
    {
        validate(requestData)
        validate(requestData.source)
        def wrapper = QueryWrapper.build(requestData.source)

        requestData.aggregations.each { validate(it as AggregationParameter) }
        //необходимо, чтобы не кэшировать обработку у предыдущей агрегации
        def clonedAggregations = requestData.aggregations.collect {
            new AggregationParameter(
                title: it.title,
                type: it.type,
                attribute: it.attribute.deepClone(),
                sortingType: it.sortingType
            )
        }

        requestData.groups.each { validate(it as GroupParameter) }
        def clonedGroups = requestData.groups.collect {
            new GroupParameter(
                title: it.title,
                type: it.type,
                attribute: it.attribute.deepClone(),
                sortingType: it.sortingType,
                format: it.format
            )
        }

        clonedAggregations.each {
            prepareAttribute(it.attribute as Attribute)
            wrapper.processAggregation(wrapper, requestData, it as AggregationParameter, diagramType, top)
        }

        clonedGroups.each {
            prepareAttribute(it.attribute as Attribute)
            wrapper.processGroup(wrapper, it as GroupParameter, diagramType, requestData.source)
        }

        requestData.filters.each { wrapper.filtering(it as List<FilterParameter>) }

        //Фильтрация по непустым атрибутам
        Set attributeSet = []
        if (onlyFilled)
        {
            attributeSet = clonedAggregations.findAll { it?.type == Aggregation.NOT_APPLICABLE }.attribute + clonedGroups*.attribute
        }
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

        //при таких условиях в запросе придёт массив с 1 уровнем вложенности [v1, v2, v3,..]
        Boolean requestHasOneNoneAggregation = clonedAggregations?.count {
            it?.type == Aggregation.NOT_APPLICABLE
        } == 1 && clonedAggregations?.size() == 1 && clonedGroups.size() == 0
        return wrapper.getResult(requestHasOneNoneAggregation, diagramType, ignoreParameterLimit)
    }

    /**
     * Метод проверки данных запроса.
     * Выбрасывает исключение.
     * @param data - данные запроса
     */
    private static void validate(RequestData data)
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
    private static void validate(Source source)
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
        if (!parameter.attribute.attrChains())
        {
            throw new IllegalArgumentException("Attribute is null or empty!")
        }
        Aggregation type = parameter.type
        String attributeType = parameter.attribute.attrChains().last().type
        switch (attributeType)
        {
            case AttributeType.DT_INTERVAL_TYPE:
            case AttributeType.NUMBER_TYPES:
                if (!(type in Aggregation.with {
                    [MIN, MAX, SUM, AVG, COUNT_CNT, PERCENT, NOT_APPLICABLE ]
                }))
                {
                    throw new IllegalArgumentException("Not suitable aggregation type: $type and attribute type: $attributeType")
                }
                break
            default:
                if ((!(type in [Aggregation.COUNT_CNT, Aggregation.PERCENT, Aggregation.NOT_APPLICABLE ]) &&
                     parameter.attribute.type != AttributeType.CATALOG_ITEM_TYPE) ||
                    (parameter.attribute.type == AttributeType.CATALOG_ITEM_TYPE &&
                     !(type in Aggregation.with { [AVG, COUNT_CNT, PERCENT, NOT_APPLICABLE ] })))
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
        if (!parameter.attribute.attrChains())
        {
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
                    [OVERLAP, DAY, SEVEN_DAYS, WEEK, MONTH, QUARTER, YEAR, HOURS, MINUTES]
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
    private static def prepareAttribute(Attribute attribute)
    {
        String attributeType = attribute.attrChains().last().type
        String attributeCode = attribute.attrChains().last().code
        switch (attributeType)
        {
            case AttributeType.LOCALIZED_TEXT_TYPE:
                attribute.attrChains().last().ref = new Attribute(code: 'ru', type: 'string')
                break
            case AttributeType.DT_INTERVAL_TYPE:
                if (!(attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)))
                {
                    attribute.attrChains().last().ref = new Attribute(code: 'ms', type: 'long')
                }
                break
            case AttributeType.TIMER_TYPES:
                attribute.attrChains().last().ref = new Attribute(code: 'statusCode', type: 'string')
                break
            case AttributeType.LINK_TYPES:
                attribute.attrChains().last().ref = new Attribute(code: 'title', type: 'string')
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
        if (attributeCode.contains(AttributeType.TOTAL_VALUE_TYPE))
        {
            def (dynAttrCode, templateUUID) = attribute.code.split('_', 2)
            attribute.code = dynAttrCode
            attribute.attrChains().last().ref = new Attribute(
                code: 'textValue',
                type: 'string',
                title: templateUUID
            )
        }
    }
}
return