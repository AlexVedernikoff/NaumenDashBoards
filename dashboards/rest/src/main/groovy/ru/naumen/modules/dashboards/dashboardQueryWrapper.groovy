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

import ru.naumen.core.server.script.api.criteria.*
import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.shared.list.IListDescriptor
import static MessageProvider.*
import groovy.json.JsonSlurper
import static groovy.json.JsonOutput.toJson
import ru.naumen.core.server.script.api.IMetainfoApi
import ru.naumen.core.server.script.api.metainfo.IMetaClassWrapper
import ru.naumen.core.server.script.api.ISelectClauseApi
import ru.naumen.core.server.script.api.IWhereClauseApi
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.server.script.api.metainfo.IAttributeWrapper

@ru.naumen.core.server.script.api.injection.InjectApi
trait CriteriaWrapper
{
    IApiCriteria buildCriteria(Source source)
    {
        IApiCriteria criteria
        if (source.descriptor)
        {
            IListDescriptor listDescriptor = api.listdata.createListDescriptor(source.descriptor)
            Boolean newDescriptorMethodsExist =
                api.listdata.getClass().metaClass.methods*.name.any {
                    it == 'defineListDescriptor'
                }
            if (newDescriptorMethodsExist)
            {
                listDescriptor = api.listdata.defineListDescriptor(listDescriptor)
                                    .setRemovedMode("ALL")
                                    .create()
            }
            criteria = api.listdata.createCriteria(listDescriptor)
        }
        else
        {
            criteria = api.db.createCriteria().addSource(source.classFqn)
        }
        return criteria
    }

    /**
     * Метод выполнения параметров
     * @param criteria - критерия
     * @param diagramType - тип диаграммы
     * @param hasBreakdown - флаг, есть ли разбивка
     * @param ignoreParameterLimit - флаг, игнорировать ли лимит
     * @param paginationSettings - настройки пагинации
     * @param isTimerTypeAttributeInGroup - флаг на присутствие в группировке атрибута типа счетчик
     * @return результат разбивки
     */
    List execute(IApiCriteria criteria, DiagramType diagramType = DiagramType.COLUMN, Boolean hasBreakdown = false, Boolean ignoreParameterLimit = false, PaginationSettings paginationSettings = null, Boolean isTimerTypeAttributeInGroup = false)
    {
        Boolean isDebugMode = DashboardUtils.isDebugMode()
        if(diagramType in [DiagramType.TABLE, DiagramType.PIVOT_TABLE])
        {
            if(paginationSettings)
            {
                if (isDebugMode)
                {
                    def query = api.db.query(criteria)
                    DashboardUtils.log(QueryWrapper.DASHBOARD_QUERY_WRAPPER_MODULE_NAME, 43, 'query', query.hq.getQueryString())
                }
                return api.db.query(criteria).setFirstResult(paginationSettings.firstElementIndex).setMaxResults(paginationSettings.pageSize).list()
            }
            if (ignoreParameterLimit)
            {
                if (isDebugMode)
                {
                    def query = api.db.query(criteria)
                    DashboardUtils.log(QueryWrapper.DASHBOARD_QUERY_WRAPPER_MODULE_NAME, 49, 'query', query.hq.getQueryString())
                }
                return api.db.query(criteria).list()
            }
            else
            {
                if (isDebugMode)
                {
                    def query = api.db.query(criteria)
                    DashboardUtils.log(QueryWrapper.DASHBOARD_QUERY_WRAPPER_MODULE_NAME, 55, 'query', query.hq.getQueryString())
                }
                return api.db.query(criteria).setMaxResults(DashboardUtils.tableParameterLimit).list()
            }

        }
        if (isDebugMode)
        {
            def query = api.db.query(criteria)
            DashboardUtils.log(QueryWrapper.DASHBOARD_QUERY_WRAPPER_MODULE_NAME, 61, 'query', query.hq.getQueryString())
        }
        return api.db.query(criteria).setMaxResults(hasBreakdown || isTimerTypeAttributeInGroup ? 5000 : 100).list()
    }
}

class QueryWrapper implements CriteriaWrapper
{
    private IApiCriteria criteria

    private String locale

    private static final DASHBOARD_QUERY_WRAPPER_MODULE_NAME = 'dashboardQueryWrapper'

    private IApiCriteria totalValueCriteria

    MessageProvider messageProvider = MessageProvider.instance

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

    /**
     * Метод агрегирования параметров
     * @param criteria - критерия
     * @param totalValueCriteria - критерия для вычисления процента
     * @param parameter - параметр агрегации
     * @param criteriaForColumn - критерия для колонок
     * @param fromSevenDays
     * @param top - лимит
     * @param requestData - запрос
     * @param sourceMetaClassCriteriaMap - маппинг метаклассов источников и критерий
     * @return объект обертки запроса
     */
    QueryWrapper aggregate(IApiCriteria criteria, Boolean totalValueCriteria, AggregationParameter parameter, IApiCriteria criteriaForColumn, boolean fromSevenDays, Top top, RequestData requestData, Map<String, Object> sourceMetaClassCriteriaMap)
    {
        Aggregation aggregationType = parameter.type
        def sc = api.selectClause
        def attribute = parameter.attribute

        Closure aggregation = getAggregation(aggregationType)
        String[] attributeCodes = parameter.attribute.attrChains()*.code.with(this.&replaceMetaClassCode.rcurry(true))

        IApiCriteriaColumn column = getProcessedColumn(attributeCodes, criteria, criteriaForColumn, aggregation, parameter, attribute, fromSevenDays)
        criteria.addColumn(column)

        String sortingType = parameter.sortingType
        if (sortingType)
        {
            Closure sorting = getSorting(sortingType)
            column.with(sorting).with(criteria.&addOrder)
            criteria.add(api.whereClause.isNotNull(sc.property(criteriaForColumn, attributeCodes)))
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
     * Метод обработки колонки
     * @param attributeCodes - коды атрибутов
     * @param criteria - основная критерия
     * @param criteriaForColumn - критерия для колонки
     * @param aggregation - функция агрегации
     * @return обработанная колонки
     */
    private IApiCriteriaColumn getProcessedColumn(String[] attributeCodes,
                                                  IApiCriteria criteria,
                                                  IApiCriteria criteriaForColumn,
                                                  Closure aggregation,
                                                  AggregationParameter parameter,
                                                  BaseAttribute attribute,
                                                  boolean fromSevenDays)
    {
        ISelectClauseApi sc = api.selectClause
        IApiCriteriaColumn column = sc.property(criteriaForColumn, attributeCodes)
        if (parameter.attribute.type == AttributeType.CATALOG_ITEM_TYPE &&
            parameter.type == Aggregation.AVG)
        {
            column = sc.property(criteriaForColumn, attributeCodes).with(sc.&cast.rcurry('float'))
        }

        if (fromSevenDays && (attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)))
        {
            String linkTemplateUuid = attribute.attrChains().last().title ?: ''
            column = castDynamicToType(attribute, column)
            criteria.add(api.filters.attrValueEq('totalValue.linkTemplate', linkTemplateUuid))
        }

        return column.with(aggregation)
    }

    /**
     * Метод агрегирования параметров
     * @param criteria - критерия
     * @param totalValueCriteria - критерия для вычисления процента
     * @param parameter - параметр агрегации
     * @param totalCount - Итоговое количество
     * @param withCount - флаг, добавлять ли к результату кол-во
     * @return объект обертки запроса
     */
    QueryWrapper percentAggregate(IApiCriteria criteria, Boolean totalValueCriteria, AggregationParameter parameter, int totalCount, Boolean withCount = false)
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
                           .with(sc.&countDistinct)
                           .with(sc.&columnMultiply.rcurry(sc.constant(100.00)))
                           .with(sc.&columnDivide.rcurry(sc.constant(totalCount)))

            IApiCriteriaColumn countColumn
            if (withCount)
            {
                countColumn = sc.property(attributeCodes).with(sc.&countDistinct)
                column = sc.concat(
                    sc.cast(countColumn, 'string'),
                    sc.constant(' '),
                    sc.cast(column, 'string')
                )
            }

            column.with(criteria.&addColumn)

            String sortingType = parameter.sortingType
            if (sortingType)
            {
                if (parameter.type == Aggregation.PERCENT_CNT){
                    criteria.addOrder(ApiCriteriaOrders.desc(countColumn))
                }
                else if(parameter.type == Aggregation.PERCENT){
                    criteria.addOrder(ApiCriteriaOrders.desc(column))
                }
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
     * @param criteria - критерия
     * @param totalValueCriteria - критерия для вычисления процента
     * @param parameter - параметр агрегации
     * @return тело запрос с агрегацией N/A
     */
    QueryWrapper noneAggregate(IApiCriteria criteria, Boolean totalValueCriteria, AggregationParameter parameter)
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

                IApiCriteriaColumn dateColumn = sc.concat(sc.cast(day, 'string'),
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
        if(attribute.type in [AttributeType.STRING_TYPE, *AttributeType.NUMBER_TYPES, AttributeType.CATALOG_ITEM_TYPE])
        {
            if (attribute.type in AttributeType.NUMBER_TYPES)
            {
                column = sc.cast(column, 'string')
                column = sc.selectCase()
                    .when(api.whereClause.isNull(column), sc.constant('0'))
                    .otherwise(column)
            }
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

        if (sortingType)
        {
            Closure sorting = getSorting(sortingType)
            column.with(sorting).with(criteria.&addOrder)
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
     * Метод получения маппинга метаклассов источника и критерий
     * @param requestData - запрос
     * @param diagramType - тип диаграммы
     * @param criteria - основная критерия
     * @param indicatorFiltration - фильтрация на показателе
     * @return маппинг метаклассов источника и критерий
     */
    private Map<String, Object> getSourceMetaClassCriteriaMap(RequestData requestData, DiagramType diagramType, IApiCriteria criteria, IndicatorFiltration indicatorFiltration)
    {
        Map<String, String> sourceDataKeyMetaClassMap = [:]
        Map<String, Object> sourceMetaClassCriteriaMap = [:]
        Map<String, Object> sourceDataKeyCriteriaMap = [:]

        if (diagramType == DiagramType.PIVOT_TABLE)
        {
            if (indicatorFiltration?.metaClassFqn == requestData.source.classFqn)
            {
                api.listdata.addFilters(
                    criteria,
                    api.listdata.createListDescriptor(
                        DashboardQueryWrapperUtils.getDescriptorWithMergedFilters(
                            requestData.source.descriptor,
                            indicatorFiltration.descriptor
                        )
                    )
                )
            }

            sourceDataKeyMetaClassMap = requestData.sources.findResults {
                return [(it.dataKey): it.classFqn]
            }.collectEntries()

            requestData.links.each { link ->
                IApiCriteria criteriaToJoinFrom
                if (link.dataKey1 == requestData.source.dataKey)
                {
                    criteriaToJoinFrom = criteria
                }
                else
                {
                    criteriaToJoinFrom = sourceDataKeyCriteriaMap[link.dataKey1]
                }

                IApiCriteria criteriaToJoin = criteriaToJoinFrom.addLeftJoin(link.attribute.code)
                Source criteriaToJoinSource = requestData.sources.find {
                    it.dataKey == link.dataKey2
                }

                String criteriaToJoinSourceDescriptor = ''

                if (indicatorFiltration?.metaClassFqn == criteriaToJoinSource.classFqn)
                {
                    criteriaToJoinSourceDescriptor = indicatorFiltration.descriptor
                }

                if (criteriaToJoinSource.descriptor)
                {
                    criteriaToJoinSourceDescriptor = DashboardQueryWrapperUtils.getDescriptorWithMergedFilters(
                        criteriaToJoinSourceDescriptor,
                        criteriaToJoinSource.descriptor
                    )
                }

                if (criteriaToJoinSourceDescriptor)
                {
                    api.listdata.addFilters(
                        criteriaToJoin,
                        api.listdata.createListDescriptor(
                            criteriaToJoinSourceDescriptor
                        )
                    )
                }

                sourceDataKeyCriteriaMap[link.dataKey2] = criteriaToJoin
            }

            sourceMetaClassCriteriaMap = sourceDataKeyCriteriaMap.collect { key, value ->
                return [(sourceDataKeyMetaClassMap[key]): value]
            }.collectEntries()
        }

        return sourceMetaClassCriteriaMap
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
     * @param source - источник
     * @param sourceMetaClassCriteriaMap - маппинг метаклассов источников и критерий
     * @return текущий запрос в БД с добавленной группой
     */
    QueryWrapper processGroup(QueryWrapper wrapper, IApiCriteria criteria,
                              Boolean totalValueCriteria, GroupParameter parameter,
                              DiagramType diagramType, Source source,
                              IUUIDIdentifiable user,
                              Map<String, Object> sourceMetaClassCriteriaMap = null)
    {
        IApiCriteria criteriaForColumn = criteria
        if (diagramType == DiagramType.PIVOT_TABLE && parameter.attribute.metaClassFqn != source.classFqn)
        {
            criteriaForColumn = sourceMetaClassCriteriaMap[parameter.attribute.metaClassFqn]
        }

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
                wrapper.group(criteria, totalValueCriteria, parameter, diagramType, criteria, user)
            }
        }
        else
        {
            wrapper.group(
                criteria,
                totalValueCriteria,
                parameter,
                diagramType,
                criteriaForColumn,
                user
            )
        }
        return wrapper
    }

    /**
     * Метод по добавлению агрегаций в запрос и их обработке
     * @param wrapper текущий запрос в БД
     * @param requestData - данные для запроса
     * @param parameter - параметр с агрегацией для добавления
     * @param diagramType - тип диаграммы
     * @param top - лимит
     * @param onlyFilled - флаг - показывать ли только заполненные
     * @param sourceMetaClassCriteriaMap - маппинг метаклассов источников и критерий
     * @return текущий запрос в БД с добавленной агрегацией
     */
    QueryWrapper processAggregation(QueryWrapper wrapper, IApiCriteria criteria, Boolean totalValueCriteria,
                                    RequestData requestData, AggregationParameter parameter,
                                    DiagramType diagramType, Top top, Boolean onlyFilled, Map<String, Object> sourceMetaClassCriteriaMap)
    {
        IApiCriteria criteriaForColumn = criteria
        if (diagramType == DiagramType.PIVOT_TABLE && parameter.attribute.metaClassFqn != requestData.source.classFqn)
        {
            criteriaForColumn = sourceMetaClassCriteriaMap[parameter.attribute.metaClassFqn]
        }
        if (parameter.type == Aggregation.PERCENT || parameter.type == Aggregation.PERCENT_CNT)
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

            IMetainfoApi apiMetainfo = api.metainfo
            Source requestDataSource  =  DashboardQueryWrapperUtils.assigningCorrectSource(requestData, diagramType, apiMetainfo)
            def wrappedQuery = QueryWrapper.build(requestDataSource)
            def wrappedCriteria = wrappedQuery.criteria
            if (filterParameter && onlyFilled)
            {
                wrappedQuery.filtering(wrappedCriteria, totalValueCriteria, [filterParameter])
            }
            int totalCount = wrappedQuery.aggregate(wrappedCriteria, totalValueCriteria, totalParameter, wrappedCriteria, false, top, requestData, sourceMetaClassCriteriaMap)
                                         .result.head().head()

            wrapper.percentAggregate(criteria, totalValueCriteria, parameter, totalCount, parameter.type == Aggregation.PERCENT_CNT)
        }
        else if (parameter.type == Aggregation.NOT_APPLICABLE)
        {
            wrapper.noneAggregate(criteria, totalValueCriteria, parameter)
        }
        else
        {
            wrapper.aggregate(criteria, totalValueCriteria, parameter, criteriaForColumn, false, top, requestData, sourceMetaClassCriteriaMap)
        }
    }

    QueryWrapper group(IApiCriteria criteria, Boolean totalValueCriteria,
                       GroupParameter parameter, DiagramType diagramType,
                       IApiCriteria criteriaForColumn, IUUIDIdentifiable user)
    {
        def sc = api.selectClause
        GroupType groupType = parameter.type
        parameter.attribute = DashboardQueryWrapperUtils.updateRefAttributeCode(parameter.attribute)
        String[] attributeCodes = parameter.attribute.attrChains()*.code
                                           .with(this.&replaceMetaClassCode)
        IApiCriteriaColumn column = sc.property(criteriaForColumn, attributeCodes)
        def attributeChains = parameter.attribute.attrChains()
        String timeZone = TimeZone.getDefault().ID
        if (user?.UUID)
        {
            timeZone = api.employee.getTimeZone(user.UUID)?.code ?: timeZone
        }
        Object columnAccordingToUTC

        //в цепочке атрибутов может прийти свыше 2-х только в случае, если выбран ссылочный атрибут,
        // его податрибут: ссылочный атрибут, и уже его податрибут либо такой же ссылочный, либо обычный (сейчас это title строкового типа, подставляется на бэке)
        //поэтому, в в случае если пришёл ссылочный атрибут со ссылочным податрибутом, то важно знать тип последнего ссылочного, а title не интересен
        //в ином случае, важен тип самого последнего атрибута
        String lastParameterAttributeType = attributeChains.size() > 2 ? attributeChains*.type[-2] : attributeChains*.type.last()
        //если подставили title сами, то нам важно знать тип самого первого атрибута  в цепочке, тк он может повлиять на необходимость вывести uuid
        if( attributeChains.code.last() == 'title' &&
            parameter.attribute.type in AttributeType.HAS_UUID_TYPES &&
            !(diagramType == DiagramType.TABLE && parameter?.attribute?.title?.contains(DashboardQueryWrapperUtils.FALSE_SOURCE_STRING)))
        {
            lastParameterAttributeType = parameter.attribute.type
        }

        column = castDynamicToType(parameter.attribute, column)
        switch (groupType)
        {
            case GroupType.OVERLAP:
                if (attributeCodes.any {it.toLowerCase().contains('state')} && lastParameterAttributeType == AttributeType.STATE_TYPE)
                {
                    column = sc.concat(sc.property(criteriaForColumn, attributeCodes),
                                       sc.constant(StateMarshaller.delimiter),
                                       sc.property(criteriaForColumn, getMetaCaseIdCode(attributeChains)))
                    criteria.addGroupColumn(column)
                    criteria.addGroupColumn(sc.property(criteriaForColumn, getMetaCaseIdCode(attributeChains)))
                    criteria.addColumn(column)
                }
                else if(lastParameterAttributeType in AttributeType.HAS_UUID_TYPES)
                {
                    String columnStringValue = LinksAttributeMarshaller.marshal(
                        attributeChains.takeWhile {
                            it.type in AttributeType.HAS_UUID_TYPES
                        }.code.with(this.&replaceMetaClassCode).join('.'),
                        DashboardQueryWrapperUtils.UUID_CODE
                    ).toString()

                    Object columnFirst = sc.property(criteriaForColumn, attributeCodes)
                    Object columnSecond = sc.property(criteriaForColumn, columnStringValue)

                    column = sc.selectCase()
                               .when(api.whereClause.isNull(columnSecond), columnFirst)
                               .otherwise(
                                   sc.concat(
                                       columnFirst,
                                       sc.constant(LinksAttributeMarshaller.delimiter),
                                       columnSecond
                                   )
                               )
                    criteria.addGroupColumn(column)
                    criteria.addColumn(column)
                }
                else
                {
                    if(attributeChains?.find {it?.type == AttributeType.TIMER_TYPE}?.timerValue == TimerValue.VALUE )
                    {
                        IApiCriteriaColumn timerColumn = sc.property(criteriaForColumn, attributeCodes)
                        criteria.addGroupColumn(timerColumn)
                        criteria.addColumn(timerColumn)
                    }
                    else
                    {
                        IApiCriteriaColumn attributeColumn = sc.property(criteriaForColumn, attributeCodes)

                        switch (parameter.attribute.type)
                        {
                            case 'string':
                                column = sc.selectCase().when(api.whereClause.isNull(attributeColumn), '')
                                           .otherwise(attributeColumn)
                                break
                            case 'integer':
                            case 'double':
                                column = sc.selectCase().when(api.whereClause.isNull(attributeColumn), 0)
                                           .otherwise(attributeColumn)
                                break
                            default:
                                column = attributeColumn
                        }
                        criteria.addGroupColumn(column)
                        criteria.addColumn(column)
                    }
                }

                String sortingType = parameter.sortingType
                if (sortingType)
                {
                    Closure sorting = getSorting(sortingType)
                    column.with(sorting).with(criteria.&addOrder)
                }
                break
            case GroupType.MINUTES:
                columnAccordingToUTC = methodAtTimeZone(sc, column, timeZone)
                IApiCriteriaColumn groupColumn = sc.extract(columnAccordingToUTC, 'MINUTE')
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
                columnAccordingToUTC = methodAtTimeZone(sc, column, timeZone)
                switch (format)
                {
                    case 'dd':
                        IApiCriteriaColumn dayColumn = sc.day(columnAccordingToUTC)
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
                        IApiCriteriaColumn dayColumn = sc.day(columnAccordingToUTC)
                        IApiCriteriaColumn monthColumn = sc.month(columnAccordingToUTC)
                        IApiCriteriaColumn yearColumn = sc.year(columnAccordingToUTC)
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
                        IApiCriteriaColumn hourColumn = sc.extract(columnAccordingToUTC, 'HOUR')
                        IApiCriteriaColumn dayColumn = sc.day(columnAccordingToUTC)
                        IApiCriteriaColumn monthColumn = sc.month(columnAccordingToUTC)
                        IApiCriteriaColumn yearColumn = sc.year(columnAccordingToUTC)

                        criteria.addColumn(
                            sc.concat(
                                sc.cast(dayColumn, 'string'), sc.constant('.'),
                                sc.cast(monthColumn, 'string'), sc.constant('.'),
                                sc.cast(yearColumn, 'string'), sc.constant(' '),
                                sc.cast(hourColumn, 'string')
                            )
                        )

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
                        criteria.addGroupColumn(sc.truncDate(columnAccordingToUTC, 'minute'))
                        criteria.addColumn(sc.truncDate(columnAccordingToUTC, 'minute'))
                        String sortingType = parameter.sortingType
                        if (sortingType)
                        {
                            Closure sorting = getSorting(sortingType)
                            sc.truncDate(columnAccordingToUTC, 'minute').with(sorting)
                              .with(criteria.&addOrder)
                            sc.truncDate(columnAccordingToUTC, 'minute').with(sorting)
                              .with(criteria.&addOrder)
                        }
                        break
                    case 'WD':
                        IApiCriteriaColumn weekColumn = sc.dayOfWeek(columnAccordingToUTC)
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
                        IApiCriteriaColumn dayColumn = sc.day(columnAccordingToUTC)
                        IApiCriteriaColumn monthColumn = sc.month(columnAccordingToUTC)
                        criteria.addGroupColumn(dayColumn)
                        criteria.addGroupColumn(monthColumn)
                        IApiCriteriaColumn sortColumn = sc.concat(sc.cast(dayColumn, 'string'), sc.constant('/'), sc.cast(monthColumn, 'string'))
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
                columnAccordingToUTC = methodAtTimeZone(sc, column, timeZone)
                String format = parameter.format
                switch (format)
                {
                    case 'WW YY':
                        IApiCriteriaColumn weekColumn = sc.week(columnAccordingToUTC)
                        IApiCriteriaColumn yearColumn = sc.year(columnAccordingToUTC)
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
                        IApiCriteriaColumn monthColumn = sc.month(columnAccordingToUTC)
                        IApiCriteriaColumn yearColumn = sc.year(columnAccordingToUTC)
                        criteria.addColumn(
                            sc.concat(
                                sc.cast(monthColumn, 'string'),
                                sc.constant('/'),
                                sc.cast(yearColumn, 'string')
                            )
                        )
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
                        IApiCriteriaColumn quarterColumn = getQuarterGroupColumn(columnAccordingToUTC)
                        IApiCriteriaColumn yearColumn = sc.year(columnAccordingToUTC)
                        criteria.addColumn(
                            sc.concat(
                                sc.cast(quarterColumn, 'string'), sc.constant(' кв-л '),
                                sc.cast(yearColumn, 'string')
                            )
                        )
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
                            groupColumn = getQuarterGroupColumn(columnAccordingToUTC)
                        }
                        else
                        {
                            groupColumn = sc.(groupType.toString().toLowerCase())(columnAccordingToUTC)
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
                columnAccordingToUTC = methodAtTimeZone(sc, column, timeZone)
                String format = parameter.format
                IApiCriteriaColumn hourColumn = sc.extract(columnAccordingToUTC, 'HOUR')
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
                        criteria.addColumn(
                            sc.concat(
                                sc.cast(hourColumn, 'string'),
                                sc.constant(':'),
                                sc.cast(minuteColumn, 'string')
                            )
                        )
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
                    default:
                        String message = messageProvider.getMessage(NOT_SUPPORTED_DATE_FORMAT_ERROR, locale, format: format)
                        return api.utils.throwReadableException("$message#${NOT_SUPPORTED_DATE_FORMAT_ERROR}")
                }
                break
            default:
                String message = messageProvider.getMessage(NOT_SUPPORTED_GROUP_TYPE_ERROR, locale, type: groupType)
                api.utils.throwReadableException("$message#${NOT_SUPPORTED_GROUP_TYPE_ERROR}")
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
     * Метод для проверки на наличие метода
     * @param sc - сокращение от selectClause
     * @param IApiCriteriaColumn column - значения колонки
     * @param timeZone - значение часового пояса
     * @return columnAccordingToUTC - результат проверки метода
     */
    private IApiCriteriaColumn methodAtTimeZone(sc, IApiCriteriaColumn column, String timeZone)
    {
        Boolean conditionAtTimeZone = sc.class.metaClass.methods*.name.any {it == 'atTimeZone'}
        Object columnAccordingToUTC
        if (conditionAtTimeZone)
        {
            columnAccordingToUTC = sc.atTimeZone(column, timeZone)
        }
        else
        {
            columnAccordingToUTC = column
        }

        return columnAccordingToUTC
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

    /**
     * Метод фильтрации параметров
     * @param criteria - критерия
     * @param totalValueCriteria - критерия для вычисления процента
     * @param filters - фильтры
     * @return объект обертки запроса
     */
    QueryWrapper filtering(IApiCriteria criteria, Boolean totalValueCriteria, List<FilterParameter> filters)
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
                //трехуровневый атрибут
                //для НЭС и ЭС, возможна, нужна будет дополнительная проверка для получения кода атрибута
                attribute?.attrChains()?.last()?.ref = new Attribute(code: 'title', type: 'string')
            }
            if(attribute.type in AttributeType.LINK_TYPES && attribute?.ref?.code in ['title', 'code'])
            {
                //двухуровневый атрибут, второй уровень которого был добавлен синтетически, обработка для условия EQUAL, NOT_EQUAL
                code = attribute.code
            }

            String columnCode
            if (attribute.type == AttributeType.TEXT_TYPE)
            {
                columnCode = attribute.code.replace('metaClass', valueToPut)
            }
            else
            {
                columnCode = attribute.attrChains()*.code.join('.').replace('metaClass', valueToPut)
            }
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
            if(columnCode.equals('firstName'))
            {
                Object sc = api.selectClause
                criteria.add(api.whereClause.ne(sc.property(columnCode), sc.constant('')))
            }
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
                case Comparison.NOT_BETWEEN:
                    def (first, second) = parameter.value
                    return api.filters.not(api.filters.between(columnCode, first, second))
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
                    return api.filters.attrContains(columnCode.replace('title', DashboardQueryWrapperUtils.UUID_CODE), parameter.value, false, false)
                case Comparison.NOT_EQUAL_REMOVED:
                    return api.filters.attrContains(columnCode.replace('title', DashboardQueryWrapperUtils.UUID_CODE), parameter.value, false, false)
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
                default:
                    String message = messageProvider.getMessage(NOT_SUPPORTED_FILTER_CONDITION_ERROR, locale, condition: type)
                    api.utils.throwReadableException("${message}#${NOT_SUPPORTED_FILTER_CONDITION_ERROR}")
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

    /**
     * Метод получения результата из базы
     * @param requestHasOneNoneAggregation - флаг на присутствие в запросе агрегации N/A
     * @param diagramType - тип диаграмы
     * @param hasBreakdown - флаг на разбивку
     * @param ignoreParameterLimit - флаг на игнорирование лимита
     * @param paginationSettings - настройки пагинации
     * @param isTimerTypeAttributeInGroup - флаг на присутствие в группировке атрибута типа счетчик
     * @return результат запроса
     */
    List<List> getResult(Boolean requestHasOneNoneAggregation = false,
                         DiagramType diagramType = DiagramType.COLUMN,
                         Boolean hasBreakdown = false,
                         Boolean ignoreParameterLimit = false,
                         PaginationSettings paginationSettings = null,
                         Boolean isTimerTypeAttributeInGroup = false)
    {
        return execute(criteria, diagramType, hasBreakdown, ignoreParameterLimit, paginationSettings, isTimerTypeAttributeInGroup).collect {
            requestHasOneNoneAggregation || it in String ? [it] : it.collect() as List
        }
    }

    /**
     * Метод получения незаполненных данных для динамических атрибутов
     * @param criteriaBlankDataForDynamicAttributes - критерия для незаполненых данных
     * @param requestHasOneNoneAggregation - флаг наличия N/A агрегации
     * @param diagramType - тип диаграммы
     * @param hasBreakdown - флаг наличия разбивки
     * @param ignoreParameterLimit - флаг игнорирования лимита параметра
     * @param paginationSettings - настройки пагинации
     * @param templateUUID - ключ шаблона
     * @return список незаполненных данных
     */
    List getBlankDataForDynamicElements(IApiCriteria criteriaBlankDataForDynamicAttributes,
                                        Boolean requestHasOneNoneAggregation,
                                        DiagramType diagramType,
                                        Boolean hasBreakdown,
                                        Boolean ignoreParameterLimit,
                                        PaginationSettings paginationSettings,
                                        String templateUUID)
    {
        ISelectClauseApi sc = api.selectClause
        IWhereClauseApi w = api.whereClause

        String totalValueFormatKey =
            DashboardUtils.getFormatKeyForTemplateOfDynamicAttribute(templateUUID)
        IApiCriteria totalValueCriteria =
            criteriaBlankDataForDynamicAttributes.subquery().addSource(totalValueFormatKey)
        Object linkedScId = sc.property(totalValueCriteria, 'linkedSc.id')
        totalValueCriteria.addColumn(linkedScId)
        totalValueCriteria.add(api.filters.attrValueEq('linkTemplate', templateUUID))
                          .add(w.isNotNull(linkedScId))

        criteriaBlankDataForDynamicAttributes.add(w.notIn(sc.property('id'), totalValueCriteria))
        return execute(
            criteriaBlankDataForDynamicAttributes,
            diagramType,
            hasBreakdown,
            ignoreParameterLimit,
            paginationSettings
        ).collect {
            requestHasOneNoneAggregation || it in String ? [it] : [it, null]
        }
    }

    private Closure getAggregation(Aggregation type)
    {
        Closure getMessage = { Aggregation aggregationType -> messageProvider.getMessage(NOT_SUPPORTED_AGGREGATION_TYPE_ERROR, locale, aggregationType: aggregationType)}
        switch (type)
        {
            case Aggregation.COUNT_CNT:
            case Aggregation.PERCENT_CNT:
                return api.selectClause.&countDistinct
            case Aggregation.SUM:
                return api.selectClause.&sum
            case Aggregation.AVG:
                return api.selectClause.&avg
            case Aggregation.MAX:
                return api.selectClause.&max
            case Aggregation.MIN:
                return api.selectClause.&min
            default:
                return api.utils.throwReadableException("${getMessage(type)}#${NOT_SUPPORTED_AGGREGATION_TYPE_ERROR}")
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
            default:
                String message = messageProvider.getMessage(NOT_SUPPORTED_SORTING_TYPE_ERROR, locale, type: type)
                return api.utils.throwReadableException("${message}#${NOT_SUPPORTED_SORTING_TYPE_ERROR}")
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
     * @param attrSourceCodes - список кодов источников у атрибутов
     * @return тело запроса в БД
     */
    QueryWrapper setCases(String sourceClassFqn, List attrSourceCodes = [])
    {
        attrSourceCodes?.each { cases ->
            if(cases && cases != sourceClassFqn && cases in String && api.metainfo.checkAttributeExisting(sourceClassFqn, cases))
            {
                String fqnCase = api.metainfo.getMetaClass(cases).fqnCase
                if (fqnCase)
                {
                    criteria.add(
                        api.filters.inCases(fqnCase)
                    )
                }
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
    private static String locale = 'ru'
    private static final MessageProvider messageProvider = MessageProvider.instance
    private static final String FALSE_SOURCE_STRING = 'refString'

    /**
     * Метод получения данных биаграммы
     * @param requestData - запрос на получение данных
     * @param onlyFilled - вывод только заполненных полей
     * @param diagramType - тип диаграммы
     * @param ignoreParameterLimit - флаг игнорирования лимита параметра
     * @param templateUUID - ключ шаблона
     * @param paginationSettings - настройки пагинации
     * @param indicatorFiltration - настройки фильтрации на показателе
     * @return результат выборки
     */
    List<List> getData(RequestData requestData,
                       Top top,
                       String currentUserLocale,
                       IUUIDIdentifiable user,
                       Boolean onlyFilled = true,
                       DiagramType diagramType = DiagramType.DONUT,
                       Boolean ignoreParameterLimit = false,
                       String templateUUID = '',
                       PaginationSettings paginationSettings = null,
                       IndicatorFiltration indicatorFiltration = null)
    {
        validate(requestData)
        validate(requestData.source)
        IMetainfoApi apiMetainfo = api.metainfo
        Source requestDataSource  =  assigningCorrectSource(requestData, diagramType, apiMetainfo)
        QueryWrapper wrapper = QueryWrapper.build(requestDataSource, templateUUID)
        def criteria = wrapper.criteria
        QueryWrapper wrapperBlankData = QueryWrapper.build(requestDataSource)
        IApiCriteria criteriaBlankDataForDynamicAttributes= wrapperBlankData.criteria
        Boolean totalValueCriteria = false
        wrapper.locale = currentUserLocale
        locale = currentUserLocale

        Map<String, Object> sourceMetaClassCriteriaMap = wrapper.getSourceMetaClassCriteriaMap(requestData, diagramType, criteria, indicatorFiltration)

        requestData.aggregations.each { validate(it as AggregationParameter) }
        //необходимо, чтобы не кэшировать обработку у предыдущей агрегации
        def clonedAggregations = requestData.aggregations.collect {
            new AggregationParameter(
                title: it.title,
                type: it.type,
                attribute: it.attribute.deepClone(),
                sortingType: top ? 'DESC' : it.sortingType,
                descriptor: it.descriptor
            )
        }

        requestData.groups.each { validate(it as GroupParameter) }
        List<GroupParameter> clonedGroups = requestData.groups.collect {
            new GroupParameter(
                title: it.title,
                type: it.type,
                attribute: it.attribute.deepClone(),
                sortingType: top && diagramType == DiagramType.TABLE ? '' : it.sortingType,
                format: it.format
            )
        }

        Boolean isTimerTypeAttributeInGroup = clonedGroups.any {
            return Attribute.getAttributeType(it.attribute) ==
                   AttributeType.TIMER_TYPE && it.attribute.timerValue == TimerValue.VALUE
        }

        Boolean hasBreakdown = clonedGroups?.any {it?.title?.contains('breakdown') }

        wrapper.setCases(requestData.source.classFqn,
                         clonedAggregations.attribute?.findAll{!(it.code.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                                                 it.code.contains(AttributeType.VALUE_TYPE)) }?.sourceCode?.unique())

        clonedAggregations.each {
            if (it.attribute.type != 'PERCENTAGE_RELATIVE_ATTR')
            {
                prepareAttribute(it.attribute as Attribute, it.type != Aggregation.NOT_APPLICABLE)
            }
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
            wrapper.processAggregation(wrapper, criteria, totalValueCriteria, requestData, it as AggregationParameter, diagramType, top, onlyFilled, sourceMetaClassCriteriaMap)
        }

        wrapper.setCases(requestData.source.classFqn,
                         clonedGroups.attribute?.findAll{ !(it.code.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                                            it.code.contains(AttributeType.VALUE_TYPE))}?.sourceCode?.unique())

        clonedGroups.each {
            prepareAttribute(it.attribute as Attribute)
            if (templateUUID && it.attribute.code.contains(AttributeType.VALUE_TYPE))
            {
                criteria = wrapper.totalValueCriteria
                totalValueCriteria = true
            }
            else
            {
                criteria = wrapper.criteria
                totalValueCriteria = false
            }
            wrapper.processGroup(
                wrapper,
                criteria,
                totalValueCriteria,
                it as GroupParameter,
                diagramType,
                requestData.source,
                user,
                sourceMetaClassCriteriaMap
            )
        }

        Set filterAttributeSourceCodes = requestData.filters?.collectMany { filters ->
            return filters*.attribute.findAll{ !(it.code.contains(AttributeType.TOTAL_VALUE_TYPE) ||
                                                 it.code.contains(AttributeType.VALUE_TYPE) ||
                                                 it.code.contains('linkTemplate'))}?.sourceCode
        }

        wrapper.setCases(requestData.source.classFqn, filterAttributeSourceCodes?.toList())

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

        Boolean percentCntAggregationForColumnStackedExists = clonedAggregations.size() == 1 &&
                                                              clonedGroups.size() == 2 &&
                                                              clonedAggregations.first().type == Aggregation.PERCENT_CNT

        //Фильтрация по непустым атрибутам
        def attributeSet = []
        if (onlyFilled && !percentCntAggregationForColumnStackedExists)
        {
            attributeSet = clonedAggregations.findAll { it?.type == Aggregation.NOT_APPLICABLE }.attribute + clonedGroups*.attribute
        }
        attributeSet?.unique { it?.code }?.findResults { attr ->
            if(attr)
            {
                return new FilterParameter(
                    title: 'не пусто',
                    type: Comparison.NOT_NULL,
                    attribute: attr,
                    value: null
                )
            }
        }?.each {
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

            IApiCriteria criteriaToFilter = criteria

            if (diagramType == DiagramType.PIVOT_TABLE)
            {
                if (isMetaClassSameOrParent(requestData.source.classFqn, it.attribute.metaClassFqn))
                {
                    criteriaToFilter = criteria
                }
                else
                {
                    criteriaToFilter = sourceMetaClassCriteriaMap ?
                        sourceMetaClassCriteriaMap[it.attribute.metaClassFqn] : criteria
                }
            }

            wrapper.filtering(criteriaToFilter, totalValueCriteria, [it])
        }

        //при таких условиях в запросе придёт массив с 1 уровнем вложенности [v1, v2, v3,..]
        Boolean requestHasOneNoneAggregation = clonedAggregations?.count {
            it?.type == Aggregation.NOT_APPLICABLE
        } == 1 && clonedAggregations?.size() == 1 && clonedGroups.size() == 0
        Boolean onlyFilledAndHasDynamicElements = !onlyFilled && totalValueCriteria
        List<List> totalList = []
        totalList.addAll(
            wrapper.getResult(
                requestHasOneNoneAggregation,
                diagramType,
                hasBreakdown,
                ignoreParameterLimit,
                paginationSettings,
                isTimerTypeAttributeInGroup
            )
        )
        if (onlyFilledAndHasDynamicElements)
        {
            clonedAggregations.each {
                wrapperBlankData.processAggregation(
                    wrapperBlankData,
                    criteriaBlankDataForDynamicAttributes,
                    false,
                    requestData,
                    it as AggregationParameter,
                    diagramType,
                    top,
                    onlyFilled,
                    sourceMetaClassCriteriaMap
                )
            }
            totalList.addAll(
                wrapperBlankData.getBlankDataForDynamicElements(
                    criteriaBlankDataForDynamicAttributes,
                    requestHasOneNoneAggregation,
                    diagramType,
                    hasBreakdown,
                    ignoreParameterLimit,
                    paginationSettings,
                    templateUUID
                )
            )
        }

        return totalList
    }

    /**
     * Метод для проверки, являются ли метаклассы одинаковыми, или один наследник другого
     * @param parentClassFqn - родительский метакласс
     * @param childClassFqn - дочерний метакласс
     * @return флаг
     */
    static Boolean isMetaClassSameOrParent(String parentClassFqn, String childClassFqn)
    {
        if (parentClassFqn == childClassFqn)
        {
            return true
        }

        Boolean isParent = false

        IMetaClassWrapper metaClass = getApi().metainfo.getMetaClass(childClassFqn)
        while (metaClass.parent)
        {
            isParent = isParent || metaClass.parent.code == parentClassFqn
            metaClass = metaClass.parent
        }

        return isParent
    }

    /**
     * Метод получения дескриптора с фильтрами из дескриптора источника и дескриптора показателя
     * @param sourceDescriptor - дескриптор источника
     * @param indicatorDescriptor - дескриптор показателя
     * @return дескриптор с обоими фильтрами
     */
    static String getDescriptorWithMergedFilters(String sourceDescriptor, String indicatorDescriptor)
    {
        JsonSlurper slurper = new JsonSlurper()
        Map<String, Object> parsedSourceDescriptor = sourceDescriptor ? slurper.parseText(sourceDescriptor) : [:]
        Map<String, Object> parsedIndicatorDescriptor = indicatorDescriptor ? slurper.parseText(indicatorDescriptor) : [:]

        if (parsedSourceDescriptor.filters)
        {
            parsedSourceDescriptor.filters.each {
                parsedIndicatorDescriptor.filters << it
            }
        }

        indicatorDescriptor = toJson(parsedIndicatorDescriptor)
        return indicatorDescriptor
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
            String message = messageProvider.getConstant(EMPTY_REQUEST_DATA_ERROR, locale)
            getApi().utils.throwReadableException("${message}#${EMPTY_REQUEST_DATA_ERROR}")
        }

        def source = data.source
        validate(source as Source)

        def aggregations = data.aggregations
        if (!aggregations)
        {
            String message = messageProvider.getConstant(EMPTY_AGGREGATION_ERROR, locale)
            getApi().utils.throwReadableException("${message}#${EMPTY_AGGREGATION_ERROR}")
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
            String message = messageProvider.getConstant(EMPTY_SOURCE_ERROR, locale)
            getApi().utils.throwReadableException("${message}#${EMPTY_SOURCE_ERROR}")
        }
        if (!(source.descriptor) && !(source.classFqn))
        {
            String message = messageProvider.getConstant(INVALID_SOURCE_ERROR, locale)
            getApi().utils.throwReadableException("${message}#${INVALID_SOURCE_ERROR}")
        }
    }

    /**
     * Метод проверки параметра агрегации.
     * Бросает исключение.
     * @param parameter - параметр агрегации
     */
    private static def validate(AggregationParameter parameter)
    {
        if (parameter.attribute.type == 'PERCENTAGE_RELATIVE_ATTR')
        {
            return
        }
        if (!parameter.attribute.attrChains())
        {
            String message = messageProvider. getConstant(ATTRIBUTE_IS_NULL_ERROR, locale)
            getApi().utils.throwReadableException("${message}#${ATTRIBUTE_IS_NULL_ERROR}")
        }
        Aggregation type = parameter.type
        String attributeType = Attribute.getAttributeType(parameter.attribute)

        switch (attributeType)
        {
            case AttributeType.DT_INTERVAL_TYPE:
            case AttributeType.NUMBER_TYPES:
            case AttributeType.TIMER_TYPES:
                if (!(type in Aggregation.with {
                    [MIN, MAX, SUM, AVG, COUNT_CNT, PERCENT, NOT_APPLICABLE, PERCENT_CNT ]
                }))
                {
                    String message = messageProvider.getMessage(NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE_ERROR, locale, type: type, attributeType: attributeType)
                    getApi().utils.throwReadableException("${message}#${NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE_ERROR}")
                }
                break
            default:
                if ((!(type in Aggregation.with { [COUNT_CNT, PERCENT, NOT_APPLICABLE, PERCENT_CNT ] }) &&
                     parameter.attribute.type != AttributeType.CATALOG_ITEM_TYPE) ||
                    (parameter.attribute.type == AttributeType.CATALOG_ITEM_TYPE &&
                     !(type in Aggregation.with { [AVG, COUNT_CNT, PERCENT, NOT_APPLICABLE, PERCENT_CNT ] })))
                {
                    String message = messageProvider.getMessage(NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE_ERROR, locale, type: type, attributeType: attributeType)
                    getApi().utils.throwReadableException("${message}#${NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE_ERROR}")
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
        String message
        if (!parameter.attribute.attrChains())
        {
            message = messageProvider.getConstant(ATTRIBUTE_IS_NULL_ERROR, locale)
            return getApi().utils.throwReadableException("${message}#${ATTRIBUTE_IS_NULL_ERROR}")
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
                    message = messageProvider.getMessage(NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR, locale, type: type, attributeType: attributeType)
                    return getApi().utils.throwReadableException("${message}#${NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR}")
                }
                break
            case AttributeType.DATE_TYPES:
                def groupTypeSet = GroupType.with {
                    [OVERLAP, DAY, SEVEN_DAYS, WEEK, MONTH, QUARTER, YEAR, HOURS, MINUTES]
                }
                if (!(type in groupTypeSet))
                {
                    message = messageProvider.getMessage(NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR, locale, type: type, attributeType: attributeType)
                    return getApi().utils.throwReadableException("${message}#${NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR}")
                }
                break
            case AttributeType.TIMER_TYPES:
                def groupTypeSet = GroupType.with {
                    [OVERLAP, ACTIVE, NOT_STARTED, PAUSED, STOPPED, EXCEED]
                }
                if (!(type in groupTypeSet))
                {
                    message = messageProvider.getMessage(NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR, locale, type: type, attributeType: attributeType)
                    return getApi().utils.throwReadableException("${message}#${NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR}")
                }
                break
            default:
                if (type != GroupType.OVERLAP)
                {
                    message = messageProvider.getMessage(NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR, locale, type: type, attributeType: attributeType)
                    return getApi().utils.throwReadableException("${message}#${NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR}")
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

        Boolean localizationIsOn = getBeanFactory().getBean('localizationSettingsService').localizationSettings.localizationEnabled
        Boolean ableToUseBaseOrTitle = checkIfAbleToUseBaseOrTitle(localizationIsOn)

        switch (attributeType)
        {
            case AttributeType.DT_INTERVAL_TYPE:
                attribute.attrChains().last().ref = new Attribute(code: 'ms', type: 'long')
                break
            case AttributeType.TIMER_TYPES:
                String attrCode = attribute.attrChains().last().timerValue == TimerValue.VALUE ? 'elapsed' : 'statusCode'
                attribute.attrChains().last().ref =  new Attribute(code: attrCode, type: 'string')
                break
            case AttributeType.LINK_TYPES:
                if(forAggregation && attributeType in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE])
                {
                    attribute.attrChains().last().ref = new Attribute(code: 'code', title: 'Код элемента справочника', type: 'string')
                }
                else
                {
                    if (forAggregation)
                    {
                        attribute.attrChains().last().ref = new Attribute(code: 'title', type: 'string')
                        Boolean attrFromEmployee = checkIfAttrFromEmployeeClass(attribute)
                        if(ableToUseBaseOrTitle)
                        {
                            //если есть доработка, и атрибут не из класса Employee,
                            // а также сама локализация на стенде включена, то можно добавить поле base
                            if(!attrFromEmployee && localizationIsOn)
                            {
                                attribute.attrChains().last().ref = new Attribute(code: 'base', type: 'string')
                            }
                        }
                        else
                        {
                            //иначе используется костыль для подсчета, если здесь оставить title, будет ошибка
                            attribute.attrChains().last().ref = new Attribute(code: 'id', type: 'string')
                        }
                    }
                    else
                    {
                        attribute.attrChains().last().ref = new Attribute(code: 'title', type: 'string')
                    }
                }
                break
            default:
                if (!(attributeType in AttributeType.ALL_ATTRIBUTE_TYPES))
                {
                    String message = messageProvider.getMessage(NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR, locale, attributeType: attributeType)
                    return getApi().utils.throwReadableException("${message}#${NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR}")
                }
                if(forAggregation && (attributeType == AttributeType.LOCALIZED_TEXT_TYPE || attributeType == AttributeType.STRING_TYPE && attribute.attrChains().last().code == 'title'))
                {
                    if(attribute.type in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE])
                    {
                        attribute.attrChains().takeWhile { it.type != AttributeType.LOCALIZED_TEXT_TYPE }.last().ref = new Attribute(code: 'code',
                                                                                                                                     title: 'Код элемента справочника',
                                                                                                                                     type: 'string')
                    }
                    else
                    {
                        Boolean attrFromEmployee = checkIfAttrFromEmployeeClass(attribute)
                        if(ableToUseBaseOrTitle)
                        {
                            if(!attrFromEmployee && localizationIsOn)
                            {
                                attribute.attrChains().last().ref = new Attribute(code: 'base', title: 'Базовая локаль', type: 'string')
                            }
                        }
                        else
                        {
                            if(attribute?.attrChains()?.size() == 1)
                            {
                                attribute?.code = 'id'
                            }
                            else
                            {
                                //сюда придёт код, если выбран атрибут и в нём его атрибут с кодом title, т.е. всего 2 уровня
                                attribute?.ref?.code = 'id'
                            }
                        }
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
     * Метод проверки, пришёл ли атрибут из класса employee или его типа
     * @param attribute - атрибут
     * @return флаг на класс-источник employee
     */
    private static Boolean checkIfAttrFromEmployeeClass(Attribute attribute)
    {
        if(attribute)
        {
            def attrChains = attribute.attrChains()
            Integer attrCount = attrChains.size()
            Integer attrIndex = attrCount <= 2 ? 0 : 1
            String valueToCheck = 'property'
            if(attrCount == 1 && !(attribute.type in AttributeType.LINK_TYPES))
            {
                valueToCheck = 'metaClassFqn'
            }
            return attrChains[attrIndex][valueToCheck]?.contains('employee')
        }
    }

    /**
     * Метод с микрозапросом для проверки возможности использования поля base - проверка наличия доработки на стенде
     * @return флаг на наличие доработки - возможность использования
     */
    private static boolean checkIfAbleToUseBaseOrTitle(Boolean localizationIsOn)
    {
        try
        {
            def criteria = getApi().db.createCriteria().addSource('ou')
                                   .addColumn(getApi().selectClause.count(getApi().selectClause.property(localizationIsOn ? 'title.base' : 'title')))
            def res = getApi().db.query(criteria).list()
            return true
        }
        catch (Exception ex)
        {
            return false
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
        IApiCriteriaColumn sc =  getApi().selectClause
        String templateUUID = attr.title //после обработки атрибута в модуле queryWrapper, значение uuid-а шаблона хранится в названии
        def field = 'value'
        def wrapper = QueryWrapper.build(source, templateUUID)
        wrapper.totalValueCriteria.add(getApi().filters.attrValueEq('linkTemplate', templateUUID))
               .addColumn(sc.min(sc.property(field)))
        return wrapper.getResult(true, DiagramType.TABLE, true).flatten().head() as Date
    }

    /**
     * Метод по изменению кода атрибута, если он есть только в конкретном типе, но его нет в классе
     * @param attribute - атрибут целиком
     * @return атрибут с новым кодом
     */
    static Attribute updateRefAttributeCode(Attribute attribute)
    {
        Boolean attributeIsNotDynamic = !(attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE)
            || attribute.property?.contains(AttributeType.TOTAL_VALUE_TYPE))

        List<Attribute> attributesToUpdate = [attribute]
        if (attribute.ref)
        {
            attributesToUpdate << attribute.ref
        }

        attributesToUpdate.each {attributeToUpdate ->
            Boolean attrRefHasBaseValues = !attributeToUpdate.code?.contains('@')

            //если класс/тип, на который ссылается атрибут не равен метаклассу атрибута,
            //скорей всего атрибут есть только в конкретном типе, но его нет в классе
            //также атрибут должен быть не динамический и в нём уже не проставлен этот код корректно
            if (attributeToUpdate.metaClassFqn && attributeIsNotDynamic && attrRefHasBaseValues)
            {
                String attrRefCode = attributeToUpdate.code
                IAttributeWrapper systemAttribute = getApi().metainfo.getMetaClass(attributeToUpdate.metaClassFqn).getAttribute(attrRefCode)
                Boolean attrSignedInClass = systemAttribute.declaredMetaClass.fqn.isClass() &&
                                            !systemAttribute.declaredMetaClass.toString().contains('__Evt')
                if (!attrSignedInClass && (!attribute.ref || attribute.property !=
                                           attribute.ref?.metaClassFqn ||
                                           attribute.metaClassFqn.contains(
                                               '__Evt'
                                           )))
                {
                    attributeToUpdate.code = systemAttribute.attributeFqn.toString()
                }
            }
        }

        return attribute
    }

    /**
     * Метод назначения, источника в зависимости от принадлежности атрибута классу или типу
     * @param requestData - запрос на получение данных
     * @param diagramType - тип диаграммы
     * @param apiMetainfo - API метаинформация для запросов в ДБ
     * @return корректное значение источника
     */
    private static Source assigningCorrectSource(RequestData requestData,
                                                 DiagramType diagramType,
                                                 IMetainfoApi apiMetainfo)
    {
        Collection<IMetaClassWrapper> listChildTypes =
            apiMetainfo.getTypes(requestData.source.classFqn)
        Collection<String> listAttributes =
            apiMetainfo.getMetaClass(requestData.source.classFqn).attributeCodes
        Collection<String> listAttributeCodes = requestData.groups.collect {
            it.attribute.code
        }
        Collection<String> listMetaClassFqn = requestData.groups.collect {
            String metaClassFqn = it?.attribute?.metaClassFqn ?: ''
            if (!metaClassFqn.grep(requestData.source.classFqn) && !requestData.source.classFqn.grep(metaClassFqn))
            {
                metaClassFqn = requestData.source.classFqn
            }
            return metaClassFqn
        }
        Source requestDataSource = requestData.source
        if (listAttributeCodes.any {
            it && !(it in listAttributes)
        })
        {
            int lastSuitableSourceIdx = listMetaClassFqn.findLastIndexOf {
                it != requestData.source.classFqn
            }
            if (lastSuitableSourceIdx != -1)
            {
                String attrObjDataClassFqn = listMetaClassFqn[lastSuitableSourceIdx]
                requestDataSource = new Source(classFqn: attrObjDataClassFqn, descriptor: "", dataKey: requestData.source.dataKey)
            }
        }
        return requestDataSource
    }
}
return
