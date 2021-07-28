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
import ru.naumen.core.server.script.api.injection.InjectApi

@ru.naumen.core.server.script.api.injection.InjectApi
trait CriteriaWrapper
{
    IApiCriteria buildCriteria(Source source)
    {
        return source.descriptor ? source.descriptor
                                         .with(api.listdata.&createListDescriptor)
                                         .with(api.listdata.&createCriteria)
            : api.db.createCriteria().addSource(source.classFqn)
    }

    List execute(IApiCriteria criteria, DiagramType diagramType = DiagramType.COLUMN, Boolean ignoreParameterLimit = false, PaginationSettings paginationSettings = null)
    {
        if(diagramType == DiagramType.TABLE)
        {
            if(paginationSettings)
            {
                return api.db.query(criteria).setFirstResult(paginationSettings.firstElementIndex).setMaxResults(paginationSettings.pageSize).list()
            }
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
    private IApiCriteria criteria

    private IApiCriteria totalValueCriteria

    protected QueryWrapper(Source source, String templateUUID)
    {
        if(templateUUID)
        {
            def w = api.whereClause
            def sc = api.selectClause
            this.criteria = this.totalValueCriteria = buildCriteria(source)
            String totalValueFormatKey = DashboardUtils.getFormatKeyForTemplateOfDynamicAttribute(templateUUID)
            this.totalValueCriteria = this.totalValueCriteria
                                          .addSource(totalValueFormatKey)
                                          .add(w.eq(sc.property(this.criteria, 'id'), sc.property('linkedSc.id')))
        }
        else
        {
            this.criteria = buildCriteria(source)
        }
    }

    static QueryWrapper build(Source source, String templateUUID = '')
    {
        return new QueryWrapper(source, templateUUID)
    }

    QueryWrapper aggregate(IApiCriteria criteria, Boolean totalValueCriteria, AggregationParameter parameter, boolean fromSevenDays = false, Integer top = null)
    {
        Aggregation aggregationType = parameter.type
        def sc = api.selectClause
        def attribute = parameter.attribute
        Closure aggregation = getAggregation(aggregationType)
        String[] attributeCodes = parameter.attribute.attrChains()*.code.with(this.&replaceMetaClassCode.rcurry(true))

        IApiCriteriaColumn column = sc.property(attributeCodes)
        if (parameter.attribute.type == AttributeType.CATALOG_ITEM_TYPE &&
            aggregationType == Aggregation.AVG)
        {
            column = sc.property(attributeCodes).with(sc.&cast.rcurry('integer'))
        }

        if (fromSevenDays && (attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)))
        {
            String linkTemplateUuid = attribute.attrChains().last().title ?: ''
            column = castDynamicToType(attribute, column)
            criteria.add(api.filters.attrValueEq('totalValue.linkTemplate', linkTemplateUuid))
        }
        column.with(aggregation).with(criteria.&addColumn)
        String sortingType = parameter.sortingType
        if (sortingType)
        {
            Closure sorting = getSorting(sortingType)
            column.with(aggregation).with(sorting).with(criteria.&addOrder)
        }

        if(totalValueCriteria)
        {
            this.totalValueCriteria = criteria
        }
        else
        {
            this.criteria = criteria
        }
        return this
    }

    //Костыльный метод. Потому что логика выходит за пределы стандартного алгоритма
    QueryWrapper percentAggregate(IApiCriteria criteria, Boolean totalValueCriteria, AggregationParameter parameter, int totalCount)
    {
        def attribute = parameter.attribute
        def sc = api.selectClause
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode.rcurry(true))
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
        if(totalValueCriteria)
        {
            this.totalValueCriteria = criteria
        }
        else
        {
            this.criteria = criteria
        }
        return this
    }

    /**
     * Метод агрегации N/A
     * @param parameter - параметр агрегации
     * @param diagramType - тип диаграммы
     * @return тело запрос с агрегацией N/A
     */
    QueryWrapper noneAggregate(IApiCriteria criteria, Boolean totalValueCriteria, def parameter, DiagramType diagramType)
    {
        def attribute = parameter.attribute
        String sortingType = parameter.sortingType
        def sc = api.selectClause
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(attributeCodes)
        def attributeChains = attribute.attrChains()
        String lastParameterAttributeType = Attribute.getAttributeType(attribute)
        if (attribute.type in AttributeType.LINK_TYPES_WITHOUT_CATALOG)
        {
            String attributeCode = attributeCodes.find()
            if(lastParameterAttributeType in AttributeType.DATE_TYPES)
            {
                //дата приходит в зависимости от БД по-разному и строкой, тк использована конкатенация
                //необходимо преобразование даты на уровне БД
                def day = sc.day(column)
                def month = sc.month(column)
                def year = sc.year(column)
                def hour = sc.extract(column, 'HOUR')
                def minute = sc.extract(column, 'MINUTE')

                def dateColumn = sc.concat(sc.cast(day, 'string'),
                                           sc.constant('.'), sc.cast(month, 'string'),
                                           sc.constant('.'), sc.cast(year, 'string'),
                                           sc.constant(' '), sc.cast(hour, 'string'),
                                           sc.constant(':'), sc.cast(minute, 'string'))

                //для атрибута ссылочного типа необходима передача uuid-а
                column = sc.concat(dateColumn,
                                   sc.constant(ObjectMarshaller.delimiter),
                                   sc.property("${attributeCode}.${DashboardQueryWrapperUtils.UUID_CODE}"))

                criteria.addGroupColumn(day)
                        .addGroupColumn(month)
                        .addGroupColumn(year)
                        .addGroupColumn(hour)
                        .addGroupColumn(minute)
            }
            else
            {
                column = sc.concat(column, sc.constant(ObjectMarshaller.delimiter),
                                   sc.property("${attributeCode}.${DashboardQueryWrapperUtils.UUID_CODE}"))
            }
            criteria.addGroupColumn(sc.property("${attributeCode}.${DashboardQueryWrapperUtils.UUID_CODE}"))
        }
        //атрибут связанного типа
        if(attribute.type == AttributeType.STRING_TYPE)
        {
            column = sc.concat(column, sc.constant(ObjectMarshaller.delimiter), sc.property(DashboardQueryWrapperUtils.UUID_CODE))
            criteria.addGroupColumn(sc.property(DashboardQueryWrapperUtils.UUID_CODE))
        }

        if (attributeCodes.any { it.toLowerCase().contains('state') } && lastParameterAttributeType == AttributeType.STATE_TYPE)
        {
            String metaCaseId = getMetaCaseIdCode(attribute.attrChains())
            column = sc.concat(sc.property(attributeCodes),
                               sc.constant(StateMarshaller.delimiter),
                               sc.property(metaCaseId))
            criteria.addGroupColumn(column)
            criteria.addGroupColumn(sc.property(metaCaseId))
            criteria.addColumn(column)
            if (sortingType)
            {
                Closure sorting = getSorting(sortingType)
                column.with(sorting).with(criteria.&addOrder)
            }
            return this
        }

        String possibleDtIntervalType = attributeChains.size() > 2 ? attributeChains*.type[-2] : attribute.type
        if(possibleDtIntervalType == AttributeType.DT_INTERVAL_TYPE)
        {
            def hourInterval = 1000 * 60 * 60
            column = sc.columnDivide(column, sc.constant(hourInterval))
            criteria.addGroupColumn(column)
            criteria.addColumn(column)
            if (sortingType)
            {
                Closure sorting = getSorting(sortingType)
                column.with(sorting).with(criteria.&addOrder)
            }
            return this
        }

        criteria.addColumn(column)
        criteria.addGroupColumn(column)
        if(totalValueCriteria)
        {
            this.totalValueCriteria = criteria
        }
        else
        {
            this.criteria = criteria
        }
        return this
    }

    /**
     * Метод для получения правильного кода атрибута для получения названия статуса по metaCaseId
     * @param attrChains - цепочка атрибутов
     * @return правильный код атрибута для получения названия статуса по metaCaseId
     */
    private String getMetaCaseIdCode(Collection attrChains)
    {
        if(this.criteria.currentMetaClass.fqn.code.contains('_Evt'))
        {
            //если источник из ЖЦ, то нужно обратиться к его классу-родителю
            return 'parent.metaCaseId'
        }
        if(attrChains?.size > 1)
        {
            //если атрибут ссылочного типа и в нем выбран статус, то нужно перейти к metaCaseId от первого атрибута в цепочке
            return "${attrChains?.head()?.code}.metaCaseId"
        }
        return 'metaCaseId'
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
     * Метод по формированию колонки с номером недели
     * @param column - колонка
     * @param minDate - минимальная дата в датасете
     * @return колонка с разницей дат
     */
    private IApiCriteriaColumn getWeekNumColumn(def column, def minDate)
    {
        def sc = api.selectClause
        if(sc.metaClass.respondsTo(sc, 'absDurationInUnits'))
        {
            return sc.absDurationInUnits(column, sc.constant(minDate), 'week')
        }
        else
        {
            return sc.extract(
                sc.columnSubtract(
                    column, sc.constant(minDate) // Вычитаем значение минимальной даты и извлекаем количество дней
                ),
                'DAY').with(sc.&columnSum.rcurry(sc.constant(DashboardQueryWrapperUtils.ACCURACY))) //прибавляем для точности данных
                     .with(sc.&columnDivide.rcurry(sc.constant(DashboardQueryWrapperUtils.WEEKDAY_COUNT))) // делим на семь дней
                     .with(sc.&columnSubtract.rcurry(sc.constant(DashboardQueryWrapperUtils.ROUNDING))) // вычитаем коэффициент округления
                     .with(sc.&abs)
                     .with(sc.&round)
        }
    }

    /**
     * Метод по добавлению группировок в запрос и их обработке
     * @param wrapper - текущий запрос в БД
     * @param parameter - параметр с группой для добавления
     * @param diagramType - тип диаграммы
     * @return текущий запрос в БД с добавленной группой
     */
    QueryWrapper processGroup(QueryWrapper wrapper, IApiCriteria criteria, Boolean totalValueCriteria, GroupParameter parameter, DiagramType diagramType, Source source)
    {
        if (parameter.type == GroupType.SEVEN_DAYS)
        {
            Date startMinDate
            if(parameter.attribute.code.contains(AttributeType.VALUE_TYPE))
            {
                startMinDate = DashboardQueryWrapperUtils.getMinDateDynamic(parameter.attribute, source)
            }else
            {
                startMinDate = DashboardUtils.getMinDate(
                    parameter.attribute.attrChains().code.join('.'),
                    parameter.attribute.sourceCode,
                    source.descriptor
                )
            }
            if(startMinDate)
            {
                startMinDate = new Date(startMinDate.time).clearTime()
                wrapper.sevenDaysGroup(criteria, totalValueCriteria, parameter, startMinDate)
            }
            else
            {
                parameter.type = GroupType.OVERLAP
                wrapper.group(criteria, totalValueCriteria, parameter, diagramType)
            }
        }
        else
        {
            wrapper.group(criteria, totalValueCriteria, parameter, diagramType)
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
    QueryWrapper processAggregation(QueryWrapper wrapper, IApiCriteria criteria, Boolean totalValueCriteria,
                                    RequestData requestData, AggregationParameter parameter,
                                    DiagramType diagramType, Integer top, Boolean onlyFilled)
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
            def wrappedCriteria = wrappedQuery.criteria
            if (filterParameter && onlyFilled)
            {
                wrappedQuery.filtering(wrappedCriteria, totalValueCriteria, [filterParameter])
            }
            int totalCount = wrappedQuery.aggregate(wrappedCriteria, totalValueCriteria, totalParameter, false, top)
                                         .result.head().head()

            wrapper.percentAggregate(criteria, totalValueCriteria, parameter, totalCount)
        }
        else if (parameter.type == Aggregation.NOT_APPLICABLE)
        {
            wrapper.noneAggregate(criteria, totalValueCriteria, parameter, diagramType)
        }
        else
        {
            wrapper.aggregate(criteria, totalValueCriteria, parameter, false, top)
        }
    }

    QueryWrapper group(IApiCriteria criteria, Boolean totalValueCriteria, GroupParameter parameter, DiagramType diagramType)
    {
        def sc = api.selectClause
        GroupType groupType = parameter.type
        String[] attributeCodes = parameter.attribute.attrChains()*.code
                                           .with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(attributeCodes)
        def attributeChains = parameter.attribute.attrChains()

        //в цепочке атрибутов может прийти свыше 2-х только в случае, если выбран ссылочный атрибут,
        // его податрибут: ссылочный атрибут, и уже его податрибут либо такой же ссылочный, либо обычный (сейчас это title строкового типа, подставляется на бэке)
        //поэтому, в в случае если пришёл ссылочный атрибут со ссылочным податрибутом, то важно знать тип последнего ссылочного, а title не интересен
        //в ином случае, важен тип самого последнего атрибута
        String lastParameterAttributeType = attributeChains.size() > 2 ? attributeChains*.type[-2] : attributeChains*.type.last()
        //если подставили title сами, то нам важно знать тип самого первого атрибута  в цепочке, тк он может повлиять на необходимость вывести uuid
        if( attributeChains.code.last() == 'title' && parameter.attribute.type in AttributeType.HAS_UUID_TYPES)
        {
            lastParameterAttributeType = parameter.attribute.type
        }

        column = castDynamicToType(parameter.attribute, column)
        switch (groupType)
        {
            case GroupType.OVERLAP:
                if (attributeCodes.any {it.toLowerCase().contains('state')} && lastParameterAttributeType == AttributeType.STATE_TYPE)
                {
                    column = sc.concat(sc.property(attributeCodes),
                                       sc.constant(StateMarshaller.delimiter),
                                       sc.property(getMetaCaseIdCode(attributeChains)))
                    criteria.addGroupColumn(column)
                    criteria.addGroupColumn(sc.property(getMetaCaseIdCode(attributeChains)))
                    criteria.addColumn(column)
                }
                else if(lastParameterAttributeType in AttributeType.HAS_UUID_TYPES)
                {

                    def lastColumn =  sc.property(
                        LinksAttributeMarshaller.marshal(
                            attributeChains.takeWhile { it.type in AttributeType.HAS_UUID_TYPES }.code.with(this.&replaceMetaClassCode).join('.'),
                            DashboardQueryWrapperUtils.UUID_CODE))
                    if(lastParameterAttributeType == AttributeType.META_CLASS_TYPE)
                    {
                        lastColumn = sc.property(
                            attributeChains.takeWhile { it.type in AttributeType.HAS_UUID_TYPES }.code.with(this.&replaceMetaClassCode).join('.'))
                    }
                    column = sc.concat(
                        sc.property(attributeCodes),
                        sc.constant(LinksAttributeMarshaller.delimiter),
                        lastColumn)
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
                                sc.cast(dayColumn, 'string'), sc.constant('.'),
                                sc.cast(monthColumn, 'string'), sc.constant('.'),
                                sc.cast(yearColumn, 'string')
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

                        criteria.addColumn(sc.concat(sc.cast(dayColumn, 'string'),sc.constant('.'),
                                                     sc.cast(monthColumn, 'string'), sc.constant('.'),
                                                     sc.cast(yearColumn, 'string'), sc.constant(' '),
                                                     sc.cast(hourColumn, 'string')))

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
                        def sortColumn = sc.concat(sc.cast(dayColumn, 'string'), sc.constant('/'), sc.cast(monthColumn, 'string'))
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
                        criteria.addColumn(sc.concat(sc.cast(weekColumn, 'string'),
                                                     sc.constant(' неделя '),
                                                     sc.cast(yearColumn, 'string')))
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
                        criteria.addColumn(sc.concat(sc.cast(monthColumn, 'string'), sc.constant('/'), sc.cast(yearColumn, 'string')))
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
                        criteria.addColumn(sc.concat(sc.cast(quarterColumn, 'string'), sc.constant(' кв-л '),
                                                     sc.cast(yearColumn, 'string')))
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
            case GroupType.MINUTE_INTERVAL:
            case GroupType.HOUR_INTERVAL:
            case GroupType.DAY_INTERVAL:
            case GroupType.WEEK_INTERVAL:
                criteria.addGroupColumn(column)
                criteria.addColumn(column)
                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    column.with(sorting).with(criteria.&addOrder)
                }
                else
                {
                    criteria.addOrder(ApiCriteriaOrders.asc(column))
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
                        criteria.addColumn(sc.concat(sc.cast(hourColumn, 'string'), sc.constant(':'), sc.cast(minuteColumn, 'string')))
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
        if(totalValueCriteria)
        {
            this.totalValueCriteria = criteria
        }
        else
        {
            this.criteria = criteria
        }
        return this
    }

    //Костыльный метод. Потому что логика выходит за пределы стандартного алгоритма
    QueryWrapper sevenDaysGroup(IApiCriteria criteria, Boolean totalValueCriteria, GroupParameter parameter, Date minStartDate)
    {
        def attribute = parameter.attribute
        def sc = api.selectClause
        String[] attributeCodes = attribute.attrChains()*.code.with(this.&replaceMetaClassCode)
        IApiCriteriaColumn weekNumberColumn = sc.property(attributeCodes)
                                                .with(this.&getWeekNumColumn.rcurry(minStartDate)) // Получаем номер недели
        criteria.addGroupColumn(weekNumberColumn)
        criteria.addColumn(weekNumberColumn)
        String sortingType = parameter.sortingType
        if (sortingType)
        {
            Closure sorting = getSorting(sortingType)
            weekNumberColumn.with(sorting).with(criteria.&addOrder)
        }
        if(totalValueCriteria)
        {
            this.totalValueCriteria = criteria
        }
        else
        {
            this.criteria = criteria
        }
        return this
    }

    QueryWrapper filtering(IApiCriteria criteria, Boolean totalValueCriteria,List<FilterParameter> filters)
    {
        filters.collect { parameter ->
            def attribute = parameter.attribute as Attribute

            Boolean sourceIsEvt = criteria.currentMetaClass.fqn.code.contains('_Evt')
            def valueToPut = sourceIsEvt ? 'parent.metaClass' : 'metaClass'
            Boolean attributeIsDynamic = attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE)
            attribute = DashboardQueryWrapperUtils.updateRefAttributeCode(attribute)
            Collection attrChains = attribute.attrChains()
            String code = attrChains*.code.join('.').replace('metaClass', valueToPut)
            if(Attribute.getAttributeType(attribute) in AttributeType.LINK_TYPES && !attributeIsDynamic)
            {
                attribute?.attrChains()?.last()?.ref = Attribute.getAttributeType(attribute) in AttributeType.LINK_TYPES_WITHOUT_CATALOG
                    ? new Attribute(code: 'title', type: 'string')
                    : new Attribute(code: 'code', type: 'string')
            }
            String columnCode = attribute.attrChains()*.code.join('.').replace('metaClass', valueToPut)
            String parameterFqn = attribute.attrChains().last().metaClassFqn
            if (attribute.attrChains()*.code.any { it == 'id' })
            {
                columnCode = columnCode.replace('id', DashboardQueryWrapperUtils.UUID_CODE)
            }
            if (attributeIsDynamic)
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
                    if(attrChains.size() > 1)
                    {
                        criteria = criteria.addLeftJoin(attribute.code)
                    }
                    return api.filters.stateTitleLike(fqns, parameter.value)
                case Comparison.STATE_TITLE_NOT_CONTAINS:
                    List fqns = getFqns(parameterFqn)
                    if(attrChains.size() > 1)
                    {
                        criteria.addLeftJoin(attribute.code)
                    }
                    return api.filters.stateTitleLike(fqns, parameter.value).with(api.filters.&not)
                case Comparison.METACLASS_TITLE_CONTAINS:
                    return api.filters.inCases(api.metainfo.getTypes(parameterFqn).findAll{
                        it.title.contains(parameter.value)
                    }*.fqnCase as String[])
                case Comparison.METACLASS_TITLE_NOT_CONTAINS:
                    return api.filters.inCases(api.metainfo.getTypes(parameterFqn).findAll{
                        !it.title.contains(parameter.value)
                    }*.fqnCase as String[])
                case Comparison.TODAY:
                    return api.filters.today(columnCode)
                case Comparison.LAST_N_DAYS:
                    return api.filters.lastNDays(columnCode, parameter.value)
                default: throw new IllegalArgumentException("Not supported filter type: $type!")
            }
        }.with {
            api.filters.or(*it)
        }.with(criteria.&add)
        if(totalValueCriteria)
        {
            this.totalValueCriteria = criteria
        }
        else
        {
            this.criteria = criteria
        }
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

    List<List> getResult(Boolean requestHasOneNoneAggregation = false,
                         DiagramType diagramType = DiagramType.COLUMN,
                         Boolean ignoreParameterLimit = false,
                         PaginationSettings paginationSettings = null)
    {
        return execute(criteria, diagramType, ignoreParameterLimit, paginationSettings).collect {
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
     * @param forAggregation - использовать для агрегации
     * @return Список кодов
     */
    private List<String> replaceMetaClassCode(List<String> list, Boolean forAggregation = false)
    {
        Boolean sourceIsEvt = this.criteria.currentMetaClass.fqn.code.contains('_Evt')
        def valueToPut = sourceIsEvt ? 'parent.metaClassFqn' : 'metaClassFqn'
        if(forAggregation)
        {
            valueToPut = sourceIsEvt ? 'parent.metaCaseId' : 'metaCaseId'
        }
        return 'metaClass' in list ? (list - 'metaClass' + valueToPut) : list
    }

    /**
     *  Метод для установки типов при запросе из основного класса
     * @param sourceClassFqn - код основного класса
     * @param diagramType - тип диаграммы
     * @param attrSourceCodes - список кодов источников у атрибутов
     * @return тело запроса в БД
     */
    QueryWrapper setCases(String sourceClassFqn, DiagramType diagramType, List attrSourceCodes = [])
    {
        attrSourceCodes?.each { cases ->
            if(cases && cases != sourceClassFqn && diagramType != DiagramType.TABLE)
            {
                criteria.add(
                    api.filters.inCases(
                        api.metainfo.getMetaClass(cases).fqnCase
                    )
                )
            }
        }
        return this
    }

    /**
     * Метод по получению список кодов для типа интервала из БД
     * @param attribute - атрибут типа временной интервал
     * @param attributeCodes - список кодов атрибута для запроса
     * @return список кодов для типа интервала из БД
     */
    String[] prepareIntervalTypeColumnCode(Attribute attribute,String[] attributeCodes)
    {
        return attributeCodes - 'ms' + 'interval'
    }
}

@InjectApi
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
                              Boolean ignoreParameterLimit = false, String templateUUID = '', PaginationSettings paginationSettings = null)
    {
        validate(requestData)
        validate(requestData.source)
        def wrapper = QueryWrapper.build(requestData.source, templateUUID)
        def criteria = wrapper.criteria
        Boolean totalValueCriteria = false

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

        wrapper.setCases(requestData.source.classFqn,
                         diagramType,
                         clonedAggregations.attribute?.findAll{!(it.code.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                                                 it.code.contains(AttributeType.VALUE_TYPE)) }?.sourceCode?.unique())

        clonedAggregations.each {
            prepareAttribute(it.attribute as Attribute, true)
            if(templateUUID && (it.type == Aggregation.PERCENT || it.attribute.code.contains(AttributeType.VALUE_TYPE)))
            {
                criteria = wrapper.totalValueCriteria
                totalValueCriteria = true
            }
            else
            {
                criteria = wrapper.criteria
                totalValueCriteria = false
            }
            wrapper.processAggregation(wrapper, criteria, totalValueCriteria, requestData, it as AggregationParameter, diagramType, top, onlyFilled)
        }

        wrapper.setCases(requestData.source.classFqn, diagramType,
                         clonedGroups.attribute?.findAll{ !(it.code.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                                            it.code.contains(AttributeType.VALUE_TYPE))}?.sourceCode?.unique())

        clonedGroups.each {
            prepareAttribute(it.attribute as Attribute)
            if(templateUUID && it.attribute.code.contains(AttributeType.VALUE_TYPE))
            {
                criteria = wrapper.totalValueCriteria
                totalValueCriteria = true
            }
            else
            {
                criteria = wrapper.criteria
                totalValueCriteria = false
            }
            wrapper.processGroup(wrapper, criteria, totalValueCriteria, it as GroupParameter, diagramType, requestData.source)
        }

        Set filterAttributeSourceCodes = requestData.filters?.collectMany { filters ->
            return filters*.attribute.findAll{ !(it.code.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                                 it.code.contains(AttributeType.VALUE_TYPE) ||
                                                 it.code.contains('linkTemplate'))}?.sourceCode
        }

        wrapper.setCases(requestData.source.classFqn, diagramType, filterAttributeSourceCodes?.toList())

        requestData.filters.each {
            if(templateUUID &&
               it.attribute.code.any { it.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                       it.contains(AttributeType.VALUE_TYPE) ||
                                       it.contains('linkTemplate') })
            {
                criteria = wrapper.totalValueCriteria
                totalValueCriteria = true
            }
            else
            {
                criteria = wrapper.criteria
                totalValueCriteria = false
            }
            wrapper.filtering(criteria, totalValueCriteria, it as List<FilterParameter>)
        }

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
            if(templateUUID && it.attribute.code.contains(AttributeType.VALUE_TYPE))
            {
                criteria = wrapper.totalValueCriteria
                totalValueCriteria = true
            }
            else
            {
                criteria = wrapper.criteria
                totalValueCriteria = false
            }
            wrapper.filtering(criteria, totalValueCriteria, [it])
        }

        //при таких условиях в запросе придёт массив с 1 уровнем вложенности [v1, v2, v3,..]
        Boolean requestHasOneNoneAggregation = clonedAggregations?.count {
            it?.type == Aggregation.NOT_APPLICABLE
        } == 1 && clonedAggregations?.size() == 1 && clonedGroups.size() == 0
        return wrapper.getResult(requestHasOneNoneAggregation, diagramType, ignoreParameterLimit, paginationSettings)
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
        String attributeType = Attribute.getAttributeType(parameter.attribute)
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
        String attributeType = Attribute.getAttributeType(parameter.attribute)
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
     * @param forAggregation - флаг на подготовку атрибута для агргегации
     */
    private static def prepareAttribute(Attribute attribute, Boolean forAggregation = false)
    {
        String attributeType = Attribute.getAttributeType(attribute)
        String attributeCode = attribute.attrChains().last().code
        Boolean attributeIsDynamic = attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE)
        attribute = updateRefAttributeCode(attribute)

        switch (attributeType)
        {
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
                if(forAggregation && attributeType in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE])
                {
                    attribute.attrChains().last().ref = new Attribute(code: 'code', title: 'Код элемента справочника', type: 'string')
                }
                else
                {
                    attribute.attrChains().last().ref = new Attribute(code: 'title', type: 'string')
                }
                break
            default:
                if (!(attributeType in AttributeType.ALL_ATTRIBUTE_TYPES))
                {
                    throw new IllegalArgumentException("Not supported attribute type: $attributeType")
                }
                if(forAggregation && (attributeType == AttributeType.LOCALIZED_TEXT_TYPE || attributeType == AttributeType.STRING_TYPE && attribute.attrChains().code == 'title'))
                {
                    if(attribute.type in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE])
                    {
                        attribute.attrChains().takeWhile { it.type != AttributeType.LOCALIZED_TEXT_TYPE }.last().ref = new Attribute(code: 'code', title: 'Код элемента справочника', type: 'string')
                    }
                    else
                    {
                        attribute.attrChains().takeWhile { it.type != AttributeType.LOCALIZED_TEXT_TYPE }.last().ref = null //убрали строковый атрибут в коцне на подсчет
                    }
                }
                break
        }
        if (attributeCode == UUID_CODE && forAggregation)
        {
            attribute.attrChains().last().code = 'id'
        }
        if (attributeIsDynamic)
        {
            def (dynAttrCode, templateUUID) = TotalValueMarshaller.unmarshal(attribute.code)
            attribute.code = AttributeType.VALUE_TYPE
            attribute.title = templateUUID
        }
    }

    /**
     * Метод получению количества объектов в динамическом атрибуте
     * @param source- источник запроса с правильным дескриптором
     * @param templateUUID - идентификатор шаблона атрибута
     * @return количество объектов в динамическом атрибуте
     */
    static Integer countDistinctTotalValue(Source source, String templateUUID)
    {
        def sc = getApi().selectClause
        def wrapper = QueryWrapper.build(source)
        def column = sc.property('totalValue.textValue')
        wrapper.criteria.addColumn(sc.countDistinct(column))
        wrapper.criteria.add(getApi().filters.attrValueEq('totalValue.linkTemplate', getApi().utils.get(templateUUID)))
        return wrapper.result.head().head()
    }

    /**
     * Метод, позволяющий получить минимальную дату у динамического атрибута типа дата/дата время
     * @param attr - динамический атрибут типа дата/дата время
     * @param source - источник запроса
     * @return минимальная дата у динамического атрибута типа дата/дата время
     */
    static Date getMinDateDynamic(Attribute attr, Source source)
    {
        def sc =  getApi().selectClause
        String templateUUID = attr.title //после обработки атрибута в модуле queryWrapper, значение uuid-а шаблона хранится в названии
        def field = 'value'
        def wrapper = QueryWrapper.build(source, templateUUID)
        wrapper.totalValueCriteria.add(getApi().filters.attrValueEq('linkTemplate', templateUUID))
               .addColumn(sc.min(sc.property(field)))
        return wrapper.getResult(true, DiagramType.TABLE, true).flatten().head() as Date
    }

    /**
     * Метод по изменению кода атрибута второго по уровню, если он есть только в конкретном типе, но его нет в классе
     * @param attribute - атрибут целиком
     * @return атрибут с новым кодом
     */
    static Attribute updateRefAttributeCode(Attribute attribute)
    {
        Boolean attributeIsNotDynamic = !attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE)
        Boolean attrRefHasBaseValues = !attribute?.ref?.code?.contains('@')
        //если класс/тип, на который ссылается атрибут не равен метаклассу атрибута второго уровня для него,
        //скорей всего атрибут второго уровня есть только в конкретном типе, но его нет в классе
        //также атрибут должен быть не динамический и в нём уже не проставлен этот код корректно
        if(attribute.ref && attribute.property && attribute.ref.metaClassFqn && attributeIsNotDynamic && attrRefHasBaseValues)
        {
            String attrRefCode = attribute.ref.code
            def systemAttribute = getApi().metainfo.getMetaClass(attribute.ref.metaClassFqn).getAttribute(attrRefCode)
            Boolean attrSignedInClass = systemAttribute.declaredMetaClass.fqn.isClass()
            if(!attrSignedInClass && attribute.property != attribute.ref.metaClassFqn)
            {
               attribute.ref.code = systemAttribute.attributeFqn.toString()
            }
        }
        return attribute
    }
}
return