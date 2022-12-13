    /*! UTF-8 */
    //Автор: nordclan
    //Дата создания: 03.09.2019
    //Код:
    //Назначение:
    /**
     * Бекенд для получения данных и построения графиков в встроенном приложении "Дашборды"
     */
    //Версия: 4.10.0.15
    //Категория: скриптовый модуль

    package ru.naumen.modules.dashboards

    import com.fasterxml.jackson.annotation.JsonInclude
    import com.fasterxml.jackson.databind.ObjectMapper
    import groovy.json.JsonOutput
    import groovy.json.JsonSlurper
    import groovy.transform.Field
    import groovy.transform.TupleConstructor
    import ru.naumen.core.server.script.api.IAuthenticationApi
    import ru.naumen.core.server.script.api.IDbApi
    import ru.naumen.core.server.script.api.IKeyValueStorageApi
    import ru.naumen.core.server.script.api.IListDataApi
    import ru.naumen.core.server.script.api.IMetainfoApi
    import ru.naumen.core.server.script.api.ISelectClauseApi
    import ru.naumen.core.server.script.api.ITypesApi
    import ru.naumen.core.server.script.api.ea.IEmbeddedApplicationsApi
    import ru.naumen.core.server.script.spi.IScriptUtils

    import java.text.DecimalFormat
    import java.text.DecimalFormatSymbols
    import java.text.SimpleDateFormat
    import java.util.concurrent.TimeUnit
    import static DeserializationHelper.mapper
    import groovy.transform.InheritConstructors
    import ru.naumen.core.shared.IUUIDIdentifiable
    import org.apache.commons.lang3.time.DateUtils


    import static DiagramType.*
    import static MessageProvider.*
    import static DashboardMarshallerClass.*
    import static groovy.json.JsonOutput.toJson

    @Field @Lazy @Delegate DashboardDataSet dashboardDataSet = new DashboardDataSetImpl(binding, new DashboardDataSetService(api.utils,
                                                                                                                             api.metainfo,
                                                                                                                             api.listdata,
                                                                                                                             api.types,
                                                                                                                             api.selectClause,
                                                                                                                             api.db,
                                                                                                                             api.auth,
                                                                                                                             new DashboardUtils(),
                                                                                                                             new DashboardQueryWrapperUtils(),
                                                                                                                             new DashboardSettingsService(api.metainfo,
                                                                                                                                                          api.apps,
                                                                                                                                                          api.utils,
                                                                                                                                                          api.db,
                                                                                                                                                          api.keyValue,
                                                                                                                                                          new DashboardUtils(),
                                                                                                                                                          logger),
                                                                                                                             logger))

    interface DashboardDataSet
    {
        /**
         * Получение данных для диаграмм. Нужен для обратной совместимости.
         * @param requestContent - тело запроса в формате @link RequestGetDataForDiagram
         * @param user - текущий пользователь системы
         * @return данные для построения диаграммы
         */
        String getDataForCompositeDiagram(Map<String, Object> requestContent, IUUIDIdentifiable user)

        /**
         * Получение данных для таблиц. Нужен для обратной совместимости.
         * @param requestContent - ключ дашборда для построения виджета
         * @param user - текущий пользователь системы
         * @return данные для построения таблицы
         */
        String getDataForTableDiagram(Map<String, Object> requestContent, IUUIDIdentifiable user)
    }

    class DashboardDataSetImpl extends BaseController implements DashboardDataSet
    {
        private final DashboardDataSetService service

        DashboardDataSetImpl(Binding binding, DashboardDataSetService service)
        {
            super(binding)
            this.service = service
        }

        Object run()
        {
            return null
        }

        @Override
        String getDataForCompositeDiagram(Map<String, Object> requestContent, IUUIDIdentifiable user)
        {
            GetGataForCompositeDiagramRequest request = new ObjectMapper().convertValue(requestContent, GetGataForCompositeDiagramRequest)
            Collection<WidgetFilterResponse> widgetFilters
            if(request.widgetFilters)
            {
                widgetFilters = WidgetFilterResponse.getWidgetFiltersCollection(request.widgetFilters)
            }
            else
            {
                widgetFilters = []
            }
            return user
                ? api.auth.callAs(user){ service.buildDiagram(request.dashboardKey, request.widgetKey, request.cardObjectUuid, widgetFilters, request.offsetUTCMinutes, user, requestContent).with(JsonOutput.&toJson) }
                : service.buildDiagram(request.dashboardKey, request.widgetKey, request.cardObjectUuid, widgetFilters, request.offsetUTCMinutes, user, requestContent).with(JsonOutput.&toJson)
        }

        @Override
        String getDataForTableDiagram(Map<String, Object> requestContent, IUUIDIdentifiable user)
        {
            GetDataForTableDiagramRequest request = new ObjectMapper().convertValue(requestContent, GetDataForTableDiagramRequest)
            Collection<WidgetFilterResponse> widgetFilters
            if(request.widgetFilters)
            {
                widgetFilters = WidgetFilterResponse.getWidgetFiltersCollection(request.widgetFilters)
            }
            else
            {
                widgetFilters = []
            }
            return user
                ? api.auth.callAs(user){ service.buildDiagram(request.dashboardKey, request.widgetKey, request.cardObjectUuid, widgetFilters, request.offsetUTCMinutes, user, request.tableRequestSettings, requestContent).with(JsonOutput.&toJson) }
                : service.buildDiagram(request.dashboardKey, request.widgetKey, request.cardObjectUuid, widgetFilters, request.offsetUTCMinutes, user, request.tableRequestSettings, requestContent).with(JsonOutput.&toJson)
        }
    }

    class DashboardDataSetService
    {
        private final IScriptUtils utils
        private final IMetainfoApi metainfo
        private final IListDataApi listdata
        private final ITypesApi types
        private final ISelectClauseApi selectClause
        private final IDbApi db
        private final IAuthenticationApi auth
        private DashboardSettingsService dashboardSettingsService
        private final DashboardUtils dashboardUtils
        private final DashboardQueryWrapperUtils dashboardQueryWrapperUtils
        private final def logger

        DashboardDataSetService(IScriptUtils utils,
                                IMetainfoApi metainfo,
                                IListDataApi listdata,
                                ITypesApi types,
                                ISelectClauseApi selectClause,
                                IDbApi db,
                                IAuthenticationApi auth,
                                DashboardUtils dashboardUtils,
                                DashboardQueryWrapperUtils dashboardQueryWrapperUtils,
                                DashboardSettingsService dashboardSettingsService,
                                def logger)
        {
            this.utils = utils
            this.metainfo = metainfo
            this.listdata = listdata
            this.types = types
            this.selectClause = selectClause
            this.db = db
            this.auth = auth
            this.dashboardSettingsService = dashboardSettingsService
            this.dashboardQueryWrapperUtils = dashboardQueryWrapperUtils
            this.dashboardUtils = dashboardUtils
            this.logger = logger
        }

        MessageProvider messageProvider = new MessageProvider(utils)

        private static final List<String> NOMINATIVE_RUSSIAN_MONTH = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                                                                      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
        private static final List<String> GENITIVE_RUSSIAN_MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                                                                    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

        private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormatSymbols().with {
            setDecimalSeparator('.' as char)
            new DecimalFormat("#.####", it)
        }

        private static final String blankData = 'Не заполнено'

        private String currentUserLocale = 'ru'

        private static final Integer maxDiagramDataSize = 5000

        /**
         * Метод по получению тела запроса по метаданным из хранилища по ключу дашборда и виджета
         * @param dbSettings - настройки дашборда
         * @param widgetKey - ключ виджета
         * @return тело запроса
         */
        Widget getWidgetSettingsByDashboardSettingsAndWidgetKey(DashboardSettingsClass dbSettings, String widgetKey, String currentUserLocale)
        {
            def widget = dbSettings.widgets.find { it.id == widgetKey }
            if(widget)
            {
                widget.data = widget.data.collect { widgetData ->
                    widgetData.parameters?.findResults {
                        it.group = Group.mappingGroup(it.group, dbSettings?.customGroups, false)
                        return it
                    }
                    widgetData.breakdown?.findResults {
                        it.group = Group.mappingGroup(it.group, dbSettings?.customGroups, !widgetData?.breakdown?.any())
                        return it
                    }
                    widgetData.source = NewSourceValue.mappingSource(widgetData.source)
                    return widgetData
                }
                return widget
            }
            else
            {
                String message = messageProvider.getConstant(WIDGET_NOT_FOUND_ERROR, currentUserLocale)
                utils.throwReadableException("${message}#${WIDGET_NOT_FOUND_ERROR}")
            }
        }

        /**
         * Метод получения uuid-а текущего пользователя или uuid-а пользователя, сохраненного в экземпляре дашборда,
         * если предусмотрен "пользовательский" режим работы
         * @param dbSettings - настройки дашборда
         * @param user - текущий пользователь
         * @return uuid текущего пользователя или uuid пользователя, сохраненного в экземпляре дашборда, если предусмотрен "пользовательский" режим работы
         */
        String getCardObjectUUID(DashboardSettingsClass dbSettings, IUUIDIdentifiable user)
        {
            String cardObjectUUID
            if(dbSettings.type == DashboardType.USER && dbSettings.dashboardUUID)
            {
                if(user)
                {
                    cardObjectUUID = user.UUID
                }
                else
                {
                    cardObjectUUID = utils.get(dbSettings.dashboardUUID).userReports?.UUID
                }

            }
            return cardObjectUUID
        }

        /**
         * Метод построения диаграмм.
         * @param dashboardKey - ключ дашборда
         * @param widgetKey - ключ виджета
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param widgetFilters - список пользовательских фильтров для виджета
         * @param frontOffsetMinutes - смещение в минутах относительно 0 часового пояса, полученное с фронта
         * @param user - текущий пользователь системы
         * @param tableRequestSettings - настройки для запроса по таблице
         * @param requestContent - тело запроса
         * @return Типизированные данные для построения диаграмм
         */
        def buildDiagram(String dashboardKey,
                         String widgetKey,
                         String subjectUUID,
                         Collection<WidgetFilterResponse> widgetFilters = [],
                         Integer frontOffsetMinutes,
                         IUUIDIdentifiable user = null,
                         TableRequestSettings tableRequestSettings = null,
                         Map<String, Object> requestContent)
        {
            currentUserLocale = dashboardUtils.getUserLocale(user?.UUID)
            DashboardSettingsClass dbSettings = dashboardSettingsService.getDashboardSetting(dashboardKey, true)
            def widgetSettings = getWidgetSettingsByDashboardSettingsAndWidgetKey(dbSettings, widgetKey, currentUserLocale)
            subjectUUID = getCardObjectUUID(dbSettings, user) ?: subjectUUID
            def diagramType = widgetSettings.type as DiagramType
            String templateUUID = getTemplateUUID(widgetSettings)
            def request
            def res
            Integer rowCount
            Integer countTotals
            List tableTotals
            PaginationSettings paginationSettings
            def tableSorting
            Integer tableTop
            Boolean reverseRowCount = false
            def offsetUTCMinutes = dashboardUtils.getOffsetUTCMinutes(user?.UUID, frontOffsetMinutes)
            String minValue
            String maxValue
            Boolean isSourceForEachRow = widgetSettings.data.sourceRowName.findAll() && diagramType == DiagramType.TABLE

            if (diagramType in [DiagramType.TABLE, DiagramType.PIVOT_TABLE])
            {
                widgetSettings.showEmptyData = true
                if (widgetSettings.data.head().sourceRowName != null)
                {
                    widgetSettings.data.each { dataSet ->
                        dataSet.parameters = []
                    }
                }
                Boolean requestHasBreakdown = checkForBreakdown(widgetSettings)
                Boolean showTableNulls = widgetSettings.showEmptyData
                Boolean showTableBlanks = widgetSettings.showBlankData
                Integer pageSize
                Integer firstElementIndex

                if(tableRequestSettings)
                {
                    pageSize = tableRequestSettings.pageSize
                    firstElementIndex = pageSize * (tableRequestSettings.pageNumber - 1)
                    paginationSettings = new PaginationSettings(pageSize: pageSize, firstElementIndex: firstElementIndex)
                }
                Boolean computationInTableRequest = widgetSettings?.data?.any { it.indicators?.any { it?.attribute?.any { it.type == 'COMPUTED_ATTR'} } }
                tableTop = widgetSettings.top?.show ? widgetSettings.top?.count as Integer : null
                if (computationInTableRequest && !tableTop)
                {
                    //вернём всё из бд, после сагрегируем
                    showTableNulls = true
                }
                tableSorting = tableRequestSettings?.sorting
                if(tableSorting?.accessor == 'ID')
                {
                    tableSorting?.accessor = widgetSettings.data.find().parameters.find().attribute.title
                    reverseRowCount = tableSorting?.type == SortingType.DESC
                }
                request = mappingDiagramRequest(widgetSettings, subjectUUID, diagramType,
                                                widgetFilters, offsetUTCMinutes, showTableNulls, showTableBlanks,
                                                computationInTableRequest, tableTop, tableSorting)

                DashboardUtils.log('dashboardDataSet', 323, 'request', request, true)

                Integer aggregationCnt = request?.data?.findResult { key, value ->
                    value?.aggregations?.count { it.type != Aggregation.NOT_APPLICABLE }
                }
                //при наличии разбивки или кастомных группировок, пагинацию нужно обеспечить своими силами
                Set<Map> innerCustomGroupNames = getInnerCustomGroupNames(widgetSettings)
                Boolean sortingValueIsComputationAttribute = false
                if(tableSorting?.accessor)
                {
                    List<Map> attributes = getAttributeNamesAndValuesFromRequest(widgetSettings)
                    def attrValue = attributes.find {it?.name?.trim() == tableSorting.accessor.trim()}
                    sortingValueIsComputationAttribute = attrValue?.attribute instanceof ComputedAttr
                }

							  Boolean isCodeState = widgetSettings.data?.parameters?.attribute?.code?.any {it.any {it == 'state'}}

                Boolean noPaginationInSQL = requestHasBreakdown || innerCustomGroupNames || sortingValueIsComputationAttribute || tableTop || isCodeState
                res = getDiagramData(
                    request,
                    user,
                    diagramType,
                    templateUUID,
                    aggregationCnt,
                    widgetSettings,
                    tableRequestSettings?.ignoreLimits,
                    noPaginationInSQL ? null : paginationSettings
                )

                if (diagramType == DiagramType.PIVOT_TABLE)
                {
                    String requestDataKey = request.data.keySet().first()
                    RequestData requestData = request.data[requestDataKey]
                    res = applyIndicatorsFiltration(requestData, res, user)
                    res = applyIndicatorsBreakdown(
                        requestData,
                        res,
                        user,
                        subjectUUID,
                        offsetUTCMinutes,
                        templateUUID,
                        requestContent,
                        dbSettings,
                        aggregationCnt,
                        widgetSettings
                    )
                }

                DashboardUtils.log('dashboardDataSet', 342, 'res', res, true)

                if (computationInTableRequest)
                {
                    //а здесь уже важно знать, выводить пустые значения или нет
                    showTableNulls = widgetSettings.showEmptyData

                    if (!isSourceForEachRow)
                    {
                        res =
                            prepareDataSet(res, widgetSettings, showTableNulls, requestHasBreakdown)
                        result = getDiagramData(
                            request, user, diagramType, templateUUID,
                            aggregationCnt, widgetSettings,
                            tableRequestSettings?.ignoreLimits
                        )
                        rowCount = requestHasBreakdown
                            ? rowCount
                            : prepareDataSet(
                            result, widgetSettings,
                            showTableNulls, requestHasBreakdown
                        )?.find()?.size()
                    }
                }
                countTotals = getTotalAmount(
                    request, res, diagramType, templateUUID, user, widgetSettings,
                    tableRequestSettings?.ignoreLimits, isSourceForEachRow
                )
                if(!(requestHasBreakdown && computationInTableRequest))
                {
                    def fullRes = getDiagramData(
                        request, user, diagramType, templateUUID,
                        aggregationCnt, widgetSettings,
                        tableRequestSettings?.ignoreLimits
                    )
                    rowCount = fullRes?.find()?.size()
                    def listIdsOfNormalAggregations = request?.data?.findResult { key, value ->
                        value?.aggregations?.withIndex()?.findResults { val, i ->
                            if (val.type != Aggregation.NOT_APPLICABLE)
                                return i
                        }
                    }
                    List aggregations = getSpecificAggregationsList(widgetSettings)
                    Integer aggregationsSize = aggregations.size()
                    if(fullRes?.find())
                    {
                        List transposeRes = []
                        if (isSourceForEachRow)
                        {
                            transposeRes = fullRes.collect {
                                [it.head().head()]
                            }
                        }
                        else
                        {
                            List tempTransponseRes = fullRes?.find()?.transpose()
                            Integer finalIndex = aggregationsSize > tempTransponseRes.size() ? tempTransponseRes.size() : aggregationsSize
                            transposeRes = tempTransponseRes[0..finalIndex - 1]
                        }

                        Collection<Integer> percentCntAggregationIndexes
                        if (isSourceForEachRow)
                        {
                            percentCntAggregationIndexes = getIndexesForTableWithNoParametersByAggregationType(request, Aggregation.PERCENT_CNT)
                        }
                        else
                        {
                            percentCntAggregationIndexes = getPercentCntAggregationIndexes(request)
                        }


                        tableTotals = transposeRes?.withIndex()?.collect { val, i ->
                            if (i in listIdsOfNormalAggregations)
                            {
                                return val.sum {
                                    List<String> countAndPercentValuesForTable
                                    if (i in percentCntAggregationIndexes)
                                    {
                                        countAndPercentValuesForTable = it.split(' ')
                                        return countAndPercentValuesForTable[0] as Double
                                    }
                                    return it as Double
                                }
                            }
                            else
                            {
                                return val.size()
                            }
                        }
                    }
                }
            }
            else
            {
                request = mappingDiagramRequest(widgetSettings, subjectUUID, diagramType, widgetFilters, offsetUTCMinutes)
                DashboardUtils.log('dashboardDataSet', 429, 'request', request, true)
                res = getDiagramData(request, user, diagramType, templateUUID)
                replaceResultAttributeMetaClass(res.first(), request)
                DashboardUtils.log('dashboardDataSet', 431, 'res', res, true)
                countTotals = getTotalAmount(request, res, diagramType, templateUUID, user, widgetSettings)
                if(diagramType == DiagramType.SPEEDOMETER)
                {
                    minValue = getValueForBorder(widgetSettings, subjectUUID, diagramType, widgetFilters, templateUUID,request, 'min', user)
                    maxValue = getValueForBorder(widgetSettings, subjectUUID, diagramType, widgetFilters, templateUUID,request, 'max', user)
                }
            }

            switch (diagramType)
            {
                case [*DiagramType.StandardTypes]:
                    String legend = widgetSettings?.data?.find()?.source?.value?.label
                    Boolean reverseGroups = isCustomGroupFromBreakdown(widgetSettings)
                    Boolean changeLabels = widgetSettings?.sorting?.value == SortingValue.PARAMETER
                    Boolean reverseLabels = widgetSettings?.sorting?.type == SortingType.DESC && changeLabels

                    String format = getValueFromParameter(widgetSettings, 'format')
                    String groupFormat =  getValueFromParameter(widgetSettings, 'data')

                    return mappingStandardDiagram(res, legend, reverseGroups, changeLabels, reverseLabels, format, groupFormat, countTotals)
                case DiagramType.RoundTypes:
                    Collection<Integer> percentCntAggregationIndexes = getPercentCntAggregationIndexes(request)
                    Integer percentCntAggregationIndex = percentCntAggregationIndexes ? percentCntAggregationIndexes.first() : null
                    Boolean checkTypeMetaClass = widgetSettings?.data?.each { value ->
                        value?.indicators?.any {
                            it?.aggregation == "PERCENT_CNT"
                        }
                    }
                    return mappingRoundDiagram(res, countTotals, percentCntAggregationIndex != null || checkTypeMetaClass)
                case DiagramType.CountTypes:
                    return mappingSummaryDiagram(res, diagramType, minValue, maxValue)
                case [TABLE, PIVOT_TABLE]:
                    def (totalColumn, showRowNum) = [widgetSettings.calcTotalColumn,
                                                     widgetSettings.table.body.showRowNum]

                    return mappingTableDiagram(res, totalColumn as boolean,
                                               showRowNum as boolean, rowCount, tableTop,
                                               paginationSettings, tableSorting, reverseRowCount,
                                               widgetSettings, request, tableRequestSettings?.ignoreLimits,
                                               countTotals, tableTotals, widgetSettings.data.sourceRowName.findAll(), diagramType, user)
                case COMBO:
                    Integer sortingDataIndex = getSortingDataIndex(widgetSettings)
                    //нашли источник, по которому должна быть сортировка
                    res = sortListsForCombo(res, sortingDataIndex)
                    List<Map> additionals = (widgetSettings.data).findResults { value ->
                        if (!(value.sourceForCompute))
                        {
                            def indicator = value.indicators.find()
                            return [
                                type     : value.type,
                                breakdown: indicator.attribute.title,
                                name     : indicator.attribute.title,
                                dataKey  : value.dataKey
                            ]
                        }
                    }
                    additionals = sortListsForCombo(additionals, sortingDataIndex)
                    String format = getValueFromParameter(widgetSettings, 'format')
                    String groupFormat =  getValueFromParameter(widgetSettings, 'data')

                    Boolean changeLabels = widgetSettings?.sorting?.value == SortingValue.PARAMETER
                    Boolean reverseLabels = widgetSettings?.sorting?.type == SortingType.DESC && changeLabels
                    List<Boolean> customsInBreakdown = isCustomGroupFromBreakdown(widgetSettings, diagramType)
                    customsInBreakdown = sortListsForCombo(customsInBreakdown, sortingDataIndex)
                    return mappingComboDiagram(res, additionals, groupFormat, format,
                                               changeLabels, reverseLabels, customsInBreakdown, sortingDataIndex, countTotals)
                default:
                    String message = messageProvider.getMessage(NOT_SUPPORTED_DIAGRAM_TYPE_ERROR, currentUserLocale, diagramType: diagramType)
                    return utils.throwReadableException("${message}#${NOT_SUPPORTED_DIAGRAM_TYPE_ERROR}")
            }
        }

        /**
         * Метод применения фильтрации на показателях
         * @param requestData - данные запроса
         * @param res - результат первоначального запроса
         * @param user - текущий пользователь системы
         * @return результат с фильтрацией на показателях
         */
        private List applyIndicatorsFiltration(RequestData requestData, List res, IUUIDIdentifiable user)
        {
            Collection<AggregationParameter> allAggregations = requestData.aggregations
            Collection<AggregationParameter> aggregationsWithFiltration =
                allAggregations.findAll {
                    !it.breakdown && it.descriptor
                }
            Map<AggregationParameter, List> aggregationFiltrationResult = [:]

            aggregationsWithFiltration.each { aggregation ->
                RequestData requestDataCopy = requestData.clone()
                requestDataCopy.aggregations = [aggregation]

                List result = dashboardQueryWrapperUtils.getData(
                    requestDataCopy,
                    null,
                    currentUserLocale,
                    user,
                    false,
                    DiagramType.PIVOT_TABLE,
                    false,
                    '',
                    null,
                    new IndicatorFiltration(
                        metaClassFqn: aggregation.attribute.sourceCode,
                        descriptor: aggregation.descriptor
                    )
                )

                List listIdsOfNormalAggregations =
                    requestDataCopy.aggregations?.withIndex()?.findResults { val, i ->
                        if (val.type != Aggregation.NOT_APPLICABLE)
                        {
                            return i
                        }
                    }
                Closure formatGroup = this.&formatGroupSet.rcurry(requestDataCopy, listIdsOfNormalAggregations, DiagramType.PIVOT_TABLE)
                result = formatGroup(result)

                aggregationFiltrationResult[aggregation] = result
            }


            Integer groupsCount = requestData.groups.size()

            aggregationFiltrationResult.eachWithIndex { aggregation, filtrationResult, index ->
                Integer aggregationIndex = allAggregations.findIndexOf { it == aggregation }
                res[0].each { resultItem ->
                    Object value = 0

                    filtrationResult.each { filtrationResultItem ->
                        if (value == 0)
                        {
                            Boolean filtrationResultItemMatch = true
                            for (int i = 1; i < groupsCount + 1; i++)
                            {
                                filtrationResultItemMatch = filtrationResultItemMatch &&
                                                            resultItem[resultItem.size() - i] ==
                                                            filtrationResultItem[filtrationResultItem.size() - i]
                            }

                            if (filtrationResultItemMatch)
                            {
                                value = filtrationResultItem[0]
                            }
                        }
                    }

                    resultItem[aggregationIndex] = value
                }
            }

            return res
        }

        /**
         * Метод применения разбивки на показателях
         * @param requestData - данные запроса
         * @param res - результат первоначального запроса
         * @param user - текущий пользователь системы
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param offsetUTCMinutes - смещение в минутах относительно 0 часового пояса
         * @param templateUUID - uuid шаблона динамического атрибута
         * @param requestContent - тело запроса
         * @param dbSettings - настройки дашборда
         * @param aggregationCnt - количество агрегаций
         * @param widgetSettings - тела запроса по метаданным из хранилища по ключу дашборда и виджета
         * @return результат с разбивкой на показателях
         */
        private List applyIndicatorsBreakdown(RequestData requestData,
                                              List res,
                                              IUUIDIdentifiable user,
                                              String subjectUUID,
                                              Integer offsetUTCMinutes,
                                              String templateUUID,
                                              Map<String, Object> requestContent,
                                              DashboardSettingsClass dbSettings,
                                              Integer aggregationCnt,
                                              Widget widgetSettings)
        {
            Collection<AggregationParameter> allAggregations = requestData.aggregations
            Collection<AggregationParameter> aggregationsWithBreakdown =
                allAggregations.findAll {
                    it.breakdown != null
                }

            Map<AggregationParameter, List> aggregationBreakdownResult = [:]

            aggregationsWithBreakdown.each { aggregation ->
                RequestData requestDataCopy = requestData.clone()
                requestDataCopy.aggregations = [aggregation]
                requestDataCopy.groups = requestDataCopy.groups.collect()
                List listIdsOfNormalAggregations =
                    requestDataCopy.aggregations?.withIndex()?.findResults { val, i ->
                        if (val.type != Aggregation.NOT_APPLICABLE)
                        {
                            return i
                        }
                    }
                Closure formatGroup = this.&formatGroupSet.rcurry(requestDataCopy, listIdsOfNormalAggregations, DiagramType.PIVOT_TABLE)
                List result = []
                if (aggregation.breakdown.group?.way == Way.SYSTEM)
                {
                    GroupParameter breakdownGroup =
                        buildSystemGroup(aggregation.breakdown.group, aggregation.breakdown.attribute)
                    requestDataCopy.groups << breakdownGroup

                    result = dashboardQueryWrapperUtils.getData(
                        requestDataCopy,
                        null,
                        currentUserLocale,
                        user,
                        false,
                        DiagramType.PIVOT_TABLE,
                        false,
                        '',
                        null,
                        aggregation.descriptor ? new IndicatorFiltration(
                            metaClassFqn: aggregation.attribute.sourceCode,
                            descriptor: aggregation.descriptor
                        ) : null
                    )
                    result = formatGroup(result)
                } else
                {
                    Source source = requestData.source
                    NewBreakdown breakdownAttribute = aggregation.breakdown
                    breakdownAttribute.group =
                        Group
                            .mappingGroup(breakdownAttribute.group, dbSettings?.customGroups, false)
                    NewParameter breakdownCustomGroup = new NewParameter(
                        group: breakdownAttribute?.group,
                        attribute: breakdownAttribute?.attribute
                    )
                    FilterList breakdownFilter = getFilterList(
                        breakdownCustomGroup,
                        subjectUUID,
                        'breakdown',
                        source,
                        offsetUTCMinutes
                    )
                    List newParameterFilters = breakdownFilter.filters
                    List filtering = prepareFilters(
                        1,
                        DiagramType.PIVOT_TABLE,
                        requestContent,
                        [],
                        newParameterFilters
                    )
                    result = filtering?.withIndex()?.collectMany { filters, i ->
                        requestDataCopy.filters = filters
                        result = dashboardQueryWrapperUtils.getData(
                            requestDataCopy,
                            null,
                            currentUserLocale,
                            user,
                            false,
                            DiagramType.PIVOT_TABLE,
                            false,
                            templateUUID,
                            aggregation.descriptor ? new IndicatorFiltration(
                                metaClassFqn: aggregation.attribute.sourceCode,
                                descriptor: aggregation.descriptor
                            ) : null
                        )
                                                           .with(formatGroup)

                        List<String> notAggregatedAttributes = []
                        List attributes = getAttributeNamesAndValuesFromRequest(widgetSettings)
                        notAggregatedAttributes = notAggregationAttributeNames(attributes)
                        Collection filtersTitle = requestDataCopy.filters.unique {
                            it.id
                        }.findResults {
                            if (it.title)
                            {
                                String titleValue = (it.title).find()
                                if (dbSettings.type in DiagramType.SortableTypes && titleValue)
                                {
                                    return "${ titleValue }#${ (it.id).find() }"
                                }
                                return titleValue
                            }
                        }
                        filtersTitle = filtersTitle.unique()
                        Object partial = [(filtersTitle): result]
                        partial = formatResult(
                            partial,
                            aggregationCnt + notAggregatedAttributes.size() + 1
                        )
                    }
                }
                replaceResultAttributeMetaClass(result, new DiagramRequest(data: [(requestDataCopy.source.dataKey): requestDataCopy]))
                aggregationBreakdownResult[aggregation] = result
            }

            Integer groupsCount = requestData.groups.size()
            Integer aggregationsCount = allAggregations.size()
            aggregationBreakdownResult.eachWithIndex { aggregation, breakdownResult, index ->
                Integer aggregationIndex = allAggregations.findIndexOf { it == aggregation }

                res[0].eachWithIndex { resultItem, resIndex ->
                    List matchBreakdownResultItems = []
                    breakdownResult.each { breakdownResultItem ->
                        Boolean breakdownResultItemMatch = true
                        for (int i = breakdownResultItem.size() - 1; i > resultItem.size() - groupsCount - (aggregationsCount - 1); i--)
                        {
                            breakdownResultItemMatch =
                                breakdownResultItemMatch && resultItem[i - 1 + (aggregationsCount - 1)] == breakdownResultItem[i - 1]
                        }

                        if (breakdownResultItemMatch)
                        {
                            matchBreakdownResultItems << breakdownResultItem
                        }
                    }

                    matchBreakdownResultItems = matchBreakdownResultItems.collect {
                        return [it[index], it[it.size() - 1]]
                    }
                    res[0][resIndex][aggregationIndex] = matchBreakdownResultItems
                }
            }
            return res
        }

        /**
         * Метод получения данных о границах для спидометра
         * @param widgetSettings - настройки виджета
         * @param subjectUUID -  идентификатор карточки "текущего объекта"
         * @param diagramType - тип диаграммы
         * @param widgetFilters - фильтрация на виджете
         * @param templateUUID - уникальный идентификатор шаблона динамического атрибута
         * @param request - тело запроса
         * @param fieldName - название поля для обработки
         * @param user - текущий пользователь системы
         * @return данные о  границах для спидометра
         */
        private String getValueForBorder(SpeedometerCurrentAndNew widgetSettings,
                                         String subjectUUID,
                                         DiagramType diagramType,
                                         Collection<WidgetFilterResponse> widgetFilters,
                                         String templateUUID,
                                         DiagramRequest request,
                                         String fieldName,
                                         IUUIDIdentifiable user)
        {

            MinMaxBorder field = widgetSettings.borders[fieldName]
            if (!(field.isNumber))
            {
                def fieldAggregation = field.indicator
                widgetSettings?.data?.find { !it.sourceForCompute }?.indicators = [fieldAggregation]

                request =  mappingDiagramRequest(widgetSettings, subjectUUID, diagramType, widgetFilters)
                Double result = getDiagramData(request, user, diagramType, templateUUID).find().find().find() as Double ?: 0
                return DECIMAL_FORMAT.format(result)
            }
            return field.value
        }

        /**
         * Метод получения итогов по виджету
         * @param request - запрос на построение
         * @param res - датасет по запросу
         * @param diagramType - тип диаграммы
         * @param templateUUID - код шаблона динамического атрибута
         * @param user - текущий пользователь системы
         * @param widgetSettings - настройки виджета
         * @param ignoreLimits - объект с флагами игнорирования пределов
         * @param isSourceForEachRow - флаг на таблицу без параметра
         * @return итог по количеству данных на виджете
         */
        Integer getTotalAmount(DiagramRequest request,
                               def res,
                               DiagramType diagramType,
                               String templateUUID,
                               IUUIDIdentifiable user,
                               Widget widgetSettings = null,
                               IgnoreLimits ignoreLimits = null,
                               Boolean isSourceForEachRow = false)
        {
            Integer total = 0
            if(widgetSettings.type in [*DiagramType.CountableTypes, DiagramType.TABLE] && widgetSettings.showTotalAmount)
            {
                if (isSourceForEachRow)
                {
                    Collection<Number> percentCntAggregationIndexes =
                        getIndexesForTableWithNoParametersByAggregationType(
                            request,
                            Aggregation.PERCENT_CNT
                        )
                    Collection<Number> percentAggregationIndexes =
                        getIndexesForTableWithNoParametersByAggregationType(
                            request,
                            Aggregation.PERCENT
                        )
                    res.eachWithIndex { value, index ->
                        value.each {
                            Double amountToAdd
                            if (index in percentCntAggregationIndexes)
                            {
                                List<String> countAndPercentValuesForTable = it[0].split(' ')
                                amountToAdd = countAndPercentValuesForTable[0] as Double
                            }
                            else if (index in percentAggregationIndexes)
                            {
                                amountToAdd = 0
                            }
                            else
                            {
                                amountToAdd = it[0] as Double
                            }
                            total += amountToAdd
                        }
                    }
                }
                else
                {
                    //флаг на проверку, что пришедший датасет уже правильно построен
                    Boolean dataAndResultAlreadyOk =
                        diagramType == DiagramType.TABLE && request.requisite.every {
                            it.showNulls
                        } || request?.data?.every { key, value ->
                            value.aggregations.type.every {
                                it == Aggregation.COUNT_CNT
                            }
                        } && diagramType in DiagramType.CountableTypes &&
                        request.requisite.every {
                            it.nodes.every {
                                it.type == 'DEFAULT'
                            }
                        }

                    //иначе датасет получается по-новому
                    if(!dataAndResultAlreadyOk)
                    {
                        request = updateAggregationsInRequest(request, diagramType)
                        Integer aggregationCnt = request?.data?.findResult { key, value ->
                            value?.aggregations?.count { it.type != Aggregation.NOT_APPLICABLE }
                        }
                        res = diagramType in DiagramType.CountableTypes
                            ? getDiagramData(request, user, diagramType, templateUUID)
                            : getDiagramData(request, user,  diagramType, templateUUID,
                                             aggregationCnt, widgetSettings,
                                             ignoreLimits)
                    }

                    //проверка на наличии агрегации N/A в таблице
                    Boolean tableWithNA = diagramType == DiagramType.TABLE &&
                                          request?.data?.any { key, value ->
                                              value.aggregations.type.any { it == Aggregation.NOT_APPLICABLE }
                                          }
                    if(tableWithNA)
                    {
                        Integer NAIndex = request?.data?.findResult { key, value ->
                            value?.aggregations?.withIndex()?.findResult { val, i ->
                                if (val.type == Aggregation.NOT_APPLICABLE)
                                    return i
                            }
                        }
                        total = res?.find()?.transpose()?.get(NAIndex)?.count {it != '' }
                    }
                    else
                    {
                        //подсчет для комбо будет суммой для всех показателей диаграммы
                        if(diagramType == DiagramType.COMBO)
                        {
                            total = res.grep()*.transpose()*.get(0).flatten().sum { it as Integer }
                        }
                        else
                        {
                            //В качестве аргументов может прийти неправильной формы число, типа "14 5.0909".
                            // Для всех остальных случаев ничего не меняется. Возможно потребуется округление для Integer.
                            List totalList =res?.find()?.transpose()?.find()?.collect {elem ->elem.split(" ")}
                                               .transpose()?.find()
                            total = totalList?.sum { it as Double }
                        }
                    }
                }
            }
            return total
        }

        /**
         * Метод замены итоговых данных, в том случае когда атрибут metaClass
         * @param res - датасет по запросу
         * @param request - текущий запрос на построение
         */
        void replaceResultAttributeMetaClass(Collection res, DiagramRequest request)
        {
            Boolean isTypeMetaClass = request?.data?.every { key, value ->
                value?.groups?.size() != 0 && value?.groups?.any {
                    it?.attribute?.type == 'metaClass'
                }
            }
            if (isTypeMetaClass)
            {
                res.each { resArraysData ->
                    if (resArraysData)
                    {
                        for (int i = 0; i < resArraysData.size(); i++)
                        {
                            try
                            {
                                String secondDataElement =
                                    MetaClassMarshaller.unmarshal(resArraysData[i]).last()
                                if (metainfo.getMetaClass(secondDataElement))
                                {
                                    String firstDataElement =
                                        metainfo.getMetaClass(secondDataElement) ?
                                            metainfo.getMetaClass(secondDataElement).title :
                                            MetaClassMarshaller.unmarshal(resArraysData[i]).first()
                                    resArraysData[i] =
                                        MetaClassMarshaller.marshal(firstDataElement, secondDataElement)
                                }
                            }
                            catch (Exception ex)
                            {
                                //результат не требует замены элементов
                            }
                        }
                    }
                }
            }
        }

        /**
         * Метод преобразования настроек агрегаций в запросе для получения нужного датасета на подсчет итогов
         * @param request - текущий запрос на построение
         * @param diagramType - тип диаграммы
         * @return обновленный запрос на построение
         */
        DiagramRequest updateAggregationsInRequest(DiagramRequest request, DiagramType diagramType)
        {
            Boolean noCalculation = request.requisite.every { it.nodes.every { it.type == 'DEFAULT' } }
            if(diagramType in DiagramType.CountableTypes)
            {
                if(noCalculation)
                {
                    request = updateAggregationsInBaseDiagramWithoutCalculation(request)
                }
                else
                {
                    request = updateAggregationsInBaseDiagramWithCalculation(request, diagramType)
                }
            }
            else
            {
                request = updateAggregationsInTableDiagram(request, !noCalculation)
            }
            return request
        }

        /**
         * Метод преобразования настроек агрегаций в запросе для таблицы, где есть вычисления
         * @param request - текущий запрос на построение
         * @return обновленный запрос на построение
         */
        private DiagramRequest updateAggregationsInTableDiagram(DiagramRequest request, Boolean withCalculation)
        {
            def tempData = request.data.find { key, value -> value.aggregations }
            if(!withCalculation)
            {
                def originalRequisite = request.requisite.find()
                Requisite defaultRequisite = createBaseRequisite(tempData.key, originalRequisite)
                request.requisite = [defaultRequisite]
            }

            if (tempData.value.aggregations.any { it.type != Aggregation.NOT_APPLICABLE })
            {
                AggregationParameter aggregationParameter = new AggregationParameter(
                    type: Aggregation.COUNT_CNT, attribute: new Attribute(code: 'id', type: 'string')
                )
                tempData.value.aggregations = [aggregationParameter]

            }
            request.data = [(tempData.key): tempData.value]
            return request
        }

        /**
         * Метод преобразования настроек агрегаций в запросе для диаграмм, где есть вычисления
         * @param request - текущий запрос на построение
         * @param diagramType - тип диаграммы
         * @return обновленный запрос на построение
         */
        private DiagramRequest updateAggregationsInBaseDiagramWithCalculation(DiagramRequest request, DiagramType diagramType)
        {
            if(diagramType == DiagramType.COMBO)
            {
                def requisites = request.requisite
                def normalRequisites = requisites.findAll {it.nodes.every {it.type == 'DEFAULT'}}
                def compRequisites = requisites - normalRequisites

                def totalData = [:]
                def totalRequisites = normalRequisites

                normalRequisites.each { requisite ->
                    requisite.nodes.each { node ->
                        totalData << request.data.find {it.key == node.dataKey }
                    }
                }

                compRequisites.each { requisite ->
                    requisite.nodes.each { node ->
                        def calculator = new FormulaCalculator(node.formula)
                        def dataKeys = calculator.variableNames
                        dataKeys -= dataKeys.findAll {it in totalData.keySet() }

                        def additionalData = dataKeys.collect { key -> request.data.find {it.key == key } }
                        additionalData.each { tempData ->
                            if (tempData.value.aggregations)
                            {
                                tempData.value.aggregations.each {
                                    it.type = Aggregation.COUNT_CNT
                                    it.attribute = new Attribute(code: 'id', type: 'string')
                                }
                            }
                            totalData << [(tempData.key): tempData.value]
                        }

                        dataKeys.each { key ->
                            totalRequisites += createBaseRequisite(key, requisite)
                        }
                    }
                }

                request.data = totalData
                request.requisite = totalRequisites
            }
            else
            {
                def tempData = request.data.find { k, v -> v.aggregations }
                def originalRequisite = request.requisite.find()
                Requisite defaultRequisite = createBaseRequisite(tempData.key, originalRequisite)
                request.requisite = [defaultRequisite]

                def value = tempData.value

                if (value.aggregations)
                {
                    value.aggregations.each {
                        it.type = Aggregation.COUNT_CNT
                        it.attribute = new Attribute(code: 'id', type: 'string')
                    }
                }
                request.data = [(tempData.key): value]
            }
            return request
        }

        /**
         * Метод формирования базового реквизита на основе изначального
         * @param key - ключ для датасета
         * @param originalRequisite - изначальный реквизит
         * @return базовый реквизит на основе изначального
         */
        private Requisite createBaseRequisite(String key, Requisite originalRequisite)
        {
            DefaultRequisiteNode defaultRequisiteNode = new DefaultRequisiteNode(
                title: null,
                type: 'DEFAULT',
                dataKey: key)

            return new Requisite(
                title: 'DEFAULT',
                nodes: [defaultRequisiteNode],
                showNulls: originalRequisite.showNulls,
                showBlank: originalRequisite.showBlank,
                top: originalRequisite.top)
        }

        /**
         * Метод преобразования настроек агрегаций в запросе для диаграмм, где нет вычислений
         * @param request - текущий запрос на построение
         * @return обновленный запрос на построение
         */
        private DiagramRequest updateAggregationsInBaseDiagramWithoutCalculation(DiagramRequest request)
        {
            def tempData = request.data
            tempData.each { k, v ->
                if (v.aggregations)
                {
                    v.aggregations.each {
                        it.type = Aggregation.COUNT_CNT
                        it.attribute = new Attribute(code: 'id', type: 'string')
                    }
                }
            }
            request.data = tempData
            return request
        }

        /**
         * Метод получения значений в параметре диаграммы по его полю
         * @param widgetSettings - настройки виджета
         * @param field - название поля для получения
         * @return значение из поля
         */
        String getValueFromParameter(Widget widgetSettings, String field)
        {
            return widgetSettings.data.findResult { value ->
                def xAxis = value.parameters.find()
                if (xAxis.attribute?.type in AttributeType.DATE_TYPES && xAxis.group.way == Way.SYSTEM)
                {
                    return xAxis.group[field]
                }
            }
        }

        /**
         * Метод подсчёта кастомных группировок в запросе
         * @param requestContent - тело запроса
         * @param inFirstSource - флаг на подсчёт только в первом источнике
         * @return количество кастомных группировок
         */
        Integer countDataForManyCustomGroupsInParameters(def requestContent, Boolean inFirstSource = true)
        {
            def tempData = requestContent.data
            if (inFirstSource)
            {
                def data = tempData.find() //берем данные первого источника
                return data?.parameters?.count { it?.group?.way == Way.CUSTOM }
            }
            else
            {
                return tempData?.parameters?.collectMany { parameters ->
                    return parameters.findResults {
                        it?.group?.way == Way.CUSTOM
                            ? it?.group?.data?.id
                            : null
                    }
                }?.unique()?.size()
            }
        }

        /**
         * Метод, возвращающий датасет с "ручной" пагинацией
         * @param groups - список объектов
         * @param paginationSettings - настройки пагинации
         * @return датасет с "ручной" пагинацией
         */
        def getDataSetWithPagination(def groups, PaginationSettings paginationSettings)
        {
            if(paginationSettings)
            {
                if(groups in Map)
                {
                    List keys = groups?.keySet()?.toList()
                    keys = sliceCollection(keys, paginationSettings)
                    return groups.findAll { it.key in keys }
                }
                else
                {
                    return sliceCollection(groups, paginationSettings)
                }
            }
            else return groups
        }

        /**
         * Метод, возвращающий элементы между индексами
         * @param elements - элементы
         * @param paginationSettings - настройки пагинации
         * @return элементы, подходящие по индексам для страницы
         */
        Collection sliceCollection(Collection list, PaginationSettings paginationSettings)
        {
            Integer offset = paginationSettings.firstElementIndex
            Integer limit = paginationSettings.pageSize
            def from = Math.min(offset, list?.size()) as int
            def to = (limit ? Math.min(offset + limit, list?.size()) : list?.size()) as int
            return list.subList(from, to)
        }

        /**
         * Метод получения реального количества списков фильтров для таблицы
         * @param filterListSize - текущий список фильтров
         * @param requestContent - запрос на построение диаграммы
         * @param templateUUID - uuid шаблона динамического атрибута
         * @return  реальное количество списков фильтров для таблицы
         */
        private Integer getRealFilterListSizeForTable(Integer filterListSize, def requestContent, String templateUUID)
        {
            Integer countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(requestContent)
            Integer countOfCustomsInFullRequest = countDataForManyCustomGroupsInParameters(requestContent, false)
            Boolean requestHasDynamicAndCustom = (countOfCustomsInFirstSource > 0  || countOfCustomsInFullRequest > 0) && templateUUID

            if  (countOfCustomsInFirstSource > 1 || countOfCustomsInFullRequest > 1 || requestHasDynamicAndCustom)
            {
                filterListSize = 2
            }
            return filterListSize
        }

        /**
         * Метод получения uuid-а шаблона динамического атрибута в данных на запрос в БД
         * @param widgetSettings - настройки виджета
         * @return  uuid шаблона динамического атрибута
         */
        private String getTemplateUUID(Widget widgetSettings)
        {
            List places = ['parameters', 'indicators', 'breakdown']
            def attrCode = places.findResult { place ->
                return widgetSettings?.data?.findResult { v ->
                    return v[place]?.attribute?.code?.find { it?.contains(AttributeType.TOTAL_VALUE_TYPE) }
                }
            }
            return attrCode ? TotalValueMarshaller.unmarshal(attrCode).last() : ''
        }

        /**
         * Метод преобразования промежуточных данных от нескольких источников к промежуточным данным от одного источника
         * @param intermediateData - промежуточные данные от нескольких источников
         * @param computationInRequest - флаг на наличие вычислдений в запросе
         * @param countOfCustomsInFirstSource - количество кастомных группировок в первом источнике
         * @return промежуточные данные от одного источника
         */
        Map<String, Map> updateIntermediateDataToOneSource(Map<String, Map> intermediateData, Boolean computationInRequest, Integer countOfCustomsInFirstSource)
        {
            //если агрегаций нет, то источник нужен только для вычисления
            List<RequestData> requestData = intermediateData.findResults { key, value -> value?.requestData?.aggregations ? value?.requestData : null }
            Source mainSource = intermediateData.findResult { key, value -> value.requestData ?: null }.source
            def totalKey = intermediateData.findResult { key, value -> key ?: null }
            List computationData = intermediateData.collectMany { key, value -> value.computeData ?: []  }.findResults {
                return it?.collectEntries { key, value->
                    value.aggregation = prepareAggregation(value.aggregation, mainSource.classFqn)
                    return [(key):value]
                }
            }

            Requisite originalRequisite = intermediateData.findResult { key, value ->
                if (computationInRequest && value?.requisite?.nodes?.findAll {it.type == 'COMPUTATION'})
                {
                    return value.requisite
                }
                else
                {
                    return value.requisite
                }
            }
            def filterList = intermediateData.collectMany { key, value ->
                if (value?.requisite)
                {
                    return value?.requestData?.source?.filterList
                }
                else
                {
                    return []
                }
            }
            //наличие фильтров в разных источниках
            int cnt = filterList.count {
                it?.place == 'parameter'
            }
            //если фильтры есть больше, чем в одном источнике
            if (cnt > 1)
            {
                //берём фильтры первого источника
                def parameterFilters = filterList.find {
                    it?.place == 'parameter'
                }?.filters
                //идём по фильтрам остальных источников (со второго по последний)
                filterList.findAll { it?.place == 'parameter' }[1..-1].each { tempFilterList ->
                    List tempFilters = tempFilterList?.filters
                    parameterFilters = parameterFilters?.collectMany { parameterFilter ->
                        tempFilters.collect {
                            (countOfCustomsInFirstSource > 1) ? [*parameterFilter, it] : [parameterFilter, it]
                        }
                    }
                }
                parameterFilters = new FilterList(place: 'parameter', filters: parameterFilters)
                FilterList breakdownFilterList = filterList.find {
                    it?.place == 'breakdown' && it.filters
                }
                mainSource.filterList = breakdownFilterList ? [parameterFilters] + [breakdownFilterList] : [parameterFilters]
            }
            else
            {
                mainSource.filterList = filterList.findAll { it?.filters }
            }
            if (computationInRequest)
            {
                //если есть вычисления меняем все ноды
                originalRequisite.nodes = intermediateData.findResults { key, value ->
                    if (value?.requisite?.nodes?.any { it?.type == 'COMPUTATION' })
                    {
                        return value.requisite
                    }
                }.nodes.inject {first, second -> first + second}
            }
            List fullGroups =  requestData?.collectMany {
                def groups = it?.groups
                //если параметры из другого источника
                if (it?.source?.classFqn != mainSource.classFqn)
                {
                    //добавляем привязку к этому источнику - атрибуту
                    return groups?.collect { group ->
                        def highLevelAttr = new Attribute(code: it?.source?.classFqn, sourceCode: mainSource.classFqn,
                                                          type: 'object',
                                                          title: "${group.attribute.title}${dashboardQueryWrapperUtils.FALSE_SOURCE_STRING}",
                                                          ref: group.attribute)
                        group.attribute = highLevelAttr
                        return group
                    }
                }
                return groups || []
            }

            List fullAggregations = requestData?.aggregations?.collectMany {
                it?.any {it?.attribute instanceof ComputedAttr } ? it : it?.collect { aggr -> return prepareAggregation(aggr, mainSource.classFqn)}
            }

            def breakdowns = fullGroups.findAll { it.title == 'breakdown' }
            fullGroups = fullGroups - breakdowns
            fullGroups = fullGroups + breakdowns

            RequestData totalRequestData = new RequestData(source: mainSource, aggregations: fullAggregations, groups: fullGroups, filters: null)
            return [(totalKey): [requestData: totalRequestData, computeData: computationData, customGroup:
                null, requisite: originalRequisite]]
        }

        /**
         * Метод по переподготовке промежуточных данных для формирования запроса
         * @param intermediateData - текущие промежуточные данные для формирования запроса
         * @return подготовленные промежуточные данные для формирования запроса
         */
        Map<String, Map> updateIntermediateData(Map<String, Map> intermediateData)
        {
            RequestData requestData = intermediateData.findResult { key, value -> value.requestData }
            List computationData = intermediateData.findResult { key, value -> value.computeData }
            Requisite originalRequisite = intermediateData.findResult { key, value -> value.requisite }

            RequestData defaultRequestData = requestData.clone()
            def computeAggregations = defaultRequestData.aggregations.findAll { it.attribute.type == 'COMPUTED_ATTR'}
            defaultRequestData.aggregations -= computeAggregations
            Map dataMap = [:]
            if (defaultRequestData.aggregations.any())
            {
                String keyForData = 'not-сompute-data'
                DefaultRequisiteNode defaultRequisiteNode =  new DefaultRequisiteNode(title: null, type: 'DEFAULT', dataKey: keyForData)
                Requisite defaultRequisite = new Requisite(
                    title: 'DEFAULT',
                    nodes: [defaultRequisiteNode],
                    showNulls: originalRequisite.showNulls
                )

                dataMap = [(keyForData): [requestData: defaultRequestData, computeData: null, customGroup:
                    null, requisite: defaultRequisite]]
            }

            //поставим агрегацию N/A второй после исходной агрегации на подсчёт
            List aggregationsNoneAggr = defaultRequestData?.aggregations?.findAll { it.type == Aggregation.NOT_APPLICABLE }
            Map dataMaps = computeAggregations.withIndex().collect { aggregation, i ->
                RequestData tempRequestData = requestData.clone()
                tempRequestData.aggregations = [aggregation] + aggregationsNoneAggr
                Requisite tempRequisite = new Requisite(
                    title: 'DEFAULT',
                    nodes: [originalRequisite.nodes[i]],
                    showNulls: originalRequisite.showNulls,
                    top: originalRequisite.top
                )
                String dataKey = "сompute-data_${i}"
                return [(dataKey): [requestData: tempRequestData, computeData: computationData[i], customGroup:
                    null, requisite: tempRequisite]]
            }.inject{ first, second ->
                first + second
            }
            if (dataMaps.any())
            {
                intermediateData = dataMap + [*:dataMaps]
            }
            return intermediateData
        }

        /**
         * Метод по переподготовке промежуточных данных для формирования запроса для таблиц без параметра
         * @param intermediateData - текущие промежуточные данные для формирования запроса
         * @return подготовленные промежуточные данные для формирования запроса
         */
        Map<String, Map> updateIntermediateDataForTableWithoutParameters(Map<String, Map> intermediateData)
        {
            Map<String, Map> preparedIntermediateData = [:]
            List<String> usedComputeDataKeys = []
            intermediateData.eachWithIndex { data, sourceIndex ->
                RequestData requestData = data.value.requestData
                List computationData = data.value.computeData
                Requisite originalRequisite = data.value.requisite

                RequestData defaultRequestData = requestData.clone()
                List computeAggregations = defaultRequestData.aggregations.findAll {
                    it.attribute.type == 'COMPUTED_ATTR'
                }
                defaultRequestData.aggregations -= computeAggregations

                // Выделение обычных аггрегаций (не вычислений) для каждого из источников - начало
                if (defaultRequestData.aggregations.any())
                {
                    String keyForData = 'not-сompute-data_' + sourceIndex
                    DefaultRequisiteNode defaultRequisiteNode = new DefaultRequisiteNode(
                        title: null,
                        type: 'DEFAULT',
                        dataKey: keyForData
                    )
                    Requisite defaultRequisite = new Requisite(
                        title: 'DEFAULT',
                        nodes: [defaultRequisiteNode],
                        showNulls: originalRequisite.showNulls
                    )
                    preparedIntermediateData[keyForData] = [
                        requestData: defaultRequestData,
                        computeData: null,
                        customGroup: null,
                        requisite  : defaultRequisite
                    ]
                }
                // Выделение обычных аггрегаций (не вычислений) для каждого из источников - конец

                // Выделение вычислений для каждого из источников - начало
                List aggregationsNoneAggr = defaultRequestData?.aggregations?.findAll {
                    it.type == Aggregation.NOT_APPLICABLE
                }

                if (computeAggregations)
                {
                    Map dataMaps = computeAggregations.withIndex().collect { aggregation, i ->
                        RequestData tempRequestData = requestData.clone()
                        tempRequestData.aggregations = [aggregation] + aggregationsNoneAggr
                        ComputationRequisiteNode compositeRequisiteNode = new ComputationRequisiteNode(
                            title: null,
                            type: 'COMPUTATION',
                            formula: "[${ aggregation.attribute.stringForCompute }]"
                        )

                        Map newComputationData = computationData[i].clone()
                        newComputationData = newComputationData.collectEntries {
                            String key = it.key
                            if (usedComputeDataKeys.contains(it.key))
                            {
                                key = UUID.randomUUID().toString()
                                compositeRequisiteNode.formula = compositeRequisiteNode.formula.replaceAll(it.key, key)
                            }
                            return [key, it.value]
                        }

                        Requisite tempRequisite = new Requisite(
                            title: 'DEFAULT',
                            nodes: [compositeRequisiteNode],
                            showNulls: originalRequisite.showNulls,
                            top: originalRequisite.top
                        )

                        String dataKey = "сompute-data_${ sourceIndex }_${ i }"
                        newComputationData.each {
                            it.value = it.value.clone()
                            it.value.dataKey = dataKey
                            usedComputeDataKeys << it.key
                        }

                        return [(dataKey): [
                            requestData: tempRequestData,
                            computeData: newComputationData,
                            customGroup: null,
                            requisite  : tempRequisite]
                        ]
                    }.inject { first, second ->
                        first + second
                    }

                    if (dataMaps.any())
                    {
                        preparedIntermediateData = preparedIntermediateData + [*:dataMaps]
                    }
                }
                // Выделение вычислений для каждого из источников - конец

            }
            return preparedIntermediateData
        }

        /**
         * Метод подготовки агрегации
         * @param aggregationParameter - параметр агрегации
         * @param classFqn - classFqn источника
         * @return правильный параметр агрегации
         */
        AggregationParameter prepareAggregation(AggregationParameter aggregationParameter, String classFqn)
        {
            if (aggregationParameter?.attribute?.sourceCode == classFqn)
            {
                return aggregationParameter
            }
            else
            {
                Attribute sourceAttribute = new Attribute(
                    code: aggregationParameter?.attribute?.sourceCode,
                    sourceCode: classFqn,
                    title: "${aggregationParameter?.attribute?.title} (${aggregationParameter?.attribute?.sourceName})",
                    type: 'object'
                )

                sourceAttribute.addLast(aggregationParameter.attribute)
                aggregationParameter.attribute = sourceAttribute
                return aggregationParameter
            }
        }

        /**
         Метод приведения запроса на построение диаграмм к единому формату
         * @param widgetSettings - настройки виджета на построение диаграммы
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param diagramType - тип диаграммы
         * @param widgetFilters - фильтрация от обычного пользователя на виджете
         * @param offsetUTCMinutes - смещение часового пояса пользователя относительно серверного времени
         * @param showTableNulls - флаг на отображение пустых значений, если диаграмма типа таблица
         * @param showTableBlanks - флаг на отображение незаполненных значений, если диаграмма типа таблица
         * @param computationInTableRequest - флаг на наличие вычислений в запросе, если диаграмма типа таблица
         * @param tableTop - количество записей, которое нужно вывести, если диаграмма типа таблица
         * @param tableSorting - сортировка на таблице
         * @return DiagramRequest
         */
        DiagramRequest mappingDiagramRequest(def widgetSettings, String subjectUUID,
                                             DiagramType diagramType, Collection<WidgetFilterResponse> widgetFilters,
                                             Integer offsetUTCMinutes = 0,
                                             Boolean showTableNulls = false, Boolean showTableBlanks = false,
                                             Boolean computationInTableRequest = false, Integer tableTop = 0,
                                             Sorting tableSorting = null)
        {
            def sorting
            //формируем копию настроек, чтобы не изменять источник
            def tempWidgetSettings = mapper.convertValue(widgetSettings, widgetSettings.getClass())
            def uglyRequestData = tempWidgetSettings.data
            Boolean isDiagramTypeTable = diagramType in [DiagramType.TABLE, DiagramType.PIVOT_TABLE]
            Boolean hasTableNotOnlyBaseSources = (tempWidgetSettings?.data*.source.value.value as Set).size() > 1
            Boolean isDiagramTypeNotCount = !(diagramType in [DiagramType.CountTypes, DiagramType.RoundTypes])
            Boolean isDiagramTypeCount = diagramType in DiagramType.CountTypes
            Boolean isSourceForEachRow = widgetSettings.data.sourceRowName.findAll() && diagramType == DiagramType.TABLE
            def commonBreakdown
            if(!isDiagramTypeCount && !isDiagramTypeTable)
            {
                sorting = tempWidgetSettings.sorting
            }
            def intermediateData = [:]
            uglyRequestData.each { data ->
                def descriptor = DashboardMarshallerClass.substitutionCardObject(data.source.descriptor as String, subjectUUID)
                def source = getCorrectSource(data.dataKey, data.source, descriptor, widgetFilters)
                def sourceForCompute = data.sourceForCompute
                def dynamicGroup = null

                List<BaseAttribute> indicators = data.indicators
                List<AggregationParameter> aggregationParameters = !(sourceForCompute) ? indicators.collect { indicator ->
                    def sortingType
                    if(isDiagramTypeTable)
                    {
                        sortingType = tableSorting?.accessor?.trim() == indicator.attribute.title.trim() ? tableSorting?.type : null
                    }
                    else
                    {
                        sortingType = sorting && sorting?.value == SortingValue.INDICATOR ? sorting?.type : null
                    }
                    return new AggregationParameter(
                        title: 'column',
                        type: indicator.aggregation,
                        attribute: indicator.attribute,
                        sortingType: sortingType,
                        breakdown: indicator?.breakdown,
                        key: indicator?.key,
                        descriptor: indicator.descriptor
                    )
                } : []
                boolean dynamicInAggregate
                aggregationParameters.each { aggregationParameter ->
                    dynamicInAggregate = aggregationParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    if (dynamicInAggregate)
                    {
                        def attrClone = aggregationParameter.attribute.deepClone()
                        dynamicGroup = mappingDynamicAttributeCustomGroup(attrClone)
                    }
                }

                Collection<NewParameter> parameters = data.parameters
                List groupParameters = []
                List parameterFilters = []
                //cчитаем только параметры с группировкой, среди всех параметров
                int groupParameterId = 0
                if(isDiagramTypeNotCount)
                {
                    parameters.each {
                        Attribute attribute = it.attribute
                        Group group = it.group
                        def sortingType
                        if(isDiagramTypeTable)
                        {
                            sortingType = tableSorting?.accessor?.trim()  == attribute.title.trim()
                                ? tableSorting?.type
                                : null
                        }
                        else
                        {
                            sortingType = sorting && sorting.value == SortingValue.PARAMETER ? sorting.type : null
                        }

                        if (group.way == Way.SYSTEM)
                        {
                            def groupParameter = buildSystemGroup(group, attribute, 'parameter')
                            groupParameter?.sortingType = sortingType
                            groupParameters << groupParameter
                        }
                        else
                        {
                            def newParameterFilterList = getFilterList(it,
                                                                       subjectUUID,
                                                                       'parameter',
                                                                       source,
                                                                       offsetUTCMinutes,
                                                                       sortingType)
                            if (parameterFilters)
                            {
                                List newParameterFilters = newParameterFilterList.filters
                                Collection<Collection<FilterParameter>> parameterListFilters = parameterFilters.find().filters
                                parameterListFilters = parameterListFilters.collectMany { parameterFilter ->
                                    newParameterFilters.collect {
                                        //если группировка добавляется не впервые, добавляем её другим форматом
                                        (groupParameterId > 1) ? [*parameterFilter, it] : [parameterFilter, it]
                                    }
                                }
                                def filterList = new FilterList(place: 'parameter',
                                                                filters: parameterListFilters,
                                                                sortingType: sortingType)
                                parameterFilters = [filterList]
                            }
                            else
                            {
                                parameterFilters << newParameterFilterList
                            }
                            groupParameterId++
                        }
                    }
                }

                boolean dynamicInParameter
                groupParameters.each {groupParameter ->
                    dynamicInParameter = groupParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    if (dynamicInParameter)
                    {
                        def attrClone = groupParameter.attribute.deepClone()
                        dynamicGroup = mappingDynamicAttributeCustomGroup(attrClone)
                    }
                }

                def mayBeBreakdown = data.breakdown
                def breakdownMap = [:]
                breakdownMap = isDiagramTypeTable && !hasTableNotOnlyBaseSources && !mayBeBreakdown && computationInTableRequest && commonBreakdown
                    ? [(data.dataKey): commonBreakdown.values().find()]
                    : breakdownMap
                boolean dynamicInBreakdown = false

                if(isDiagramTypeNotCount)
                {
                    if (mayBeBreakdown instanceof Collection && mayBeBreakdown?.any())
                    {
                        def groupTypes = data.breakdown*.group as Set
                        if (groupTypes.size() == 1)
                        {
                            //Группировка одного типа можно продолжать
                            breakdownMap = mayBeBreakdown
                                .findAll { el ->
                                    el?.group?.way != Way.CUSTOM
                                }
                                .collectEntries { el ->
                                dynamicInBreakdown = el?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                                if(dynamicInBreakdown)
                                {
                                    dynamicGroup =  mappingDynamicAttributeCustomGroup(el.attribute)
                                }
                                [(el.dataKey): buildSystemGroup(el.group, el.attribute, diagramType == DiagramType.COMBO ? 'usual_breakdown' : 'breakdown')]
                            }
                            commonBreakdown = isDiagramTypeTable && !hasTableNotOnlyBaseSources ? breakdownMap : [:]
                        }
                        else
                        {
                            String message =messageProvider.getMessage(GROUP_TYPES_DONT_MATCH_ERROR, currentUserLocale, groupTypes: groupTypes)
                            return utils.throwReadableException("${message}#${GROUP_TYPES_DONT_MATCH_ERROR}")
                        }
                    }
                }

                int compIndicatorId = 0
                //ведём подсчёт только показателей с вычислениями; не все показатели могут быть с вычислениями
                def comp = !(sourceForCompute) ? indicators?.findResults { indicator ->
                    if (indicator?.attribute instanceof ComputedAttr)
                    {
                        def compData = indicator.attribute.computeData as Map
                        def computeData = compData.collectEntries { k, v ->
                            String dataKey = isDiagramTypeTable ? "сompute-data_${compIndicatorId}" : v.dataKey
                            def br = breakdownMap[v.dataKey] as GroupParameter
                            def aggr = new AggregationParameter(
                                title: indicator?.attribute?.title,
                                type: v.aggregation as Aggregation,
                                attribute: v.attr
                            )
                            return [(k): [aggregation: aggr, group: br, dataKey: dataKey]]
                        }
                        compIndicatorId++
                        return [
                            formula    : indicator?.attribute?.stringForCompute as String,
                            title      : indicator.attribute.title as String,
                            computeData: computeData
                        ]
                    }
                } : []

                boolean isBreakdownGroupCustom = false
                if(isDiagramTypeNotCount)
                {
                    isBreakdownGroupCustom = mayBeBreakdown?.group?.way.find() == Way.CUSTOM
                }

                def breakdownAttribute = mayBeBreakdown?.find() //м.б. нужно будет убрать find() и пойти в цикле

                def breakdownCustomGroup =  isBreakdownGroupCustom
                    ? new NewParameter(group: breakdownAttribute?.group, attribute: breakdownAttribute?.attribute)
                    : null
                if (dynamicInBreakdown && !isBreakdownGroupCustom)
                {
                    breakdownCustomGroup = dynamicGroup
                }
                FilterList breakdownFilter = getFilterList(breakdownCustomGroup, subjectUUID, 'breakdown', source, offsetUTCMinutes)
                if ((dynamicInAggregate || dynamicInParameter) && !parameterFilters)
                {
                    parameterFilters << getFilterList(dynamicGroup,
                                                      subjectUUID,
                                                      'parameter',
                                                      source,
                                                      offsetUTCMinutes,
                                                      sorting?.value == SortingValue.PARAMETER ? sorting?.type : null)
                }

                def requisite
                if (sourceForCompute)
                {
                    requisite = null
                }
                else
                {
                    def requisiteNode
                    Boolean computeCheck = comp?.size() > 1
                    //если вычисления есть больше, чем в одном показателе, составляем список нод по ним
                    if (computeCheck)
                    {
                        requisiteNode = comp.collect {
                            new ComputationRequisiteNode(
                                title: null,
                                type: 'COMPUTATION',
                                formula: it.formula
                            )
                        }
                    }
                    else
                    {
                        String attributeTitle = null
                        if(isDiagramTypeCount)
                        {
                            attributeTitle = aggregationParameters.find()?.attribute?.title
                        }
                        requisiteNode = comp
                            ? new ComputationRequisiteNode(
                            title: attributeTitle,
                            type: 'COMPUTATION',
                            formula: comp.formula
                        )
                            : new DefaultRequisiteNode(title: attributeTitle, type: 'DEFAULT', dataKey: data.dataKey)
                    }
                    Boolean showNulls = isDiagramTypeTable ? showTableNulls : data.showEmptyData as Boolean
                    Boolean showBlank = isDiagramTypeTable ? showTableBlanks : data.showBlankData as Boolean
                    Integer top = isDiagramTypeTable ? tableTop : data?.top?.show ? data.top?.count as Integer : null
                    requisite = new Requisite(title: 'DEFAULT',
                                              nodes: (computeCheck) ? requisiteNode : [requisiteNode],
                                              showNulls: showNulls,
                                              showBlank: showBlank,
                                              top: top)
                }
                source.filterList = [breakdownFilter, *parameterFilters]
                RequestData res = new RequestData(
                    source: source,
                    aggregations: aggregationParameters,
                    groups: groupParameters + [breakdownMap[data.dataKey] as GroupParameter].grep()
                )
                intermediateData << [(data.dataKey): [requestData: res,
                                                      computeData: isDiagramTypeTable
                                                          ? comp?.computeData
                                                          : comp.find()?.computeData,
                                                      requisite: requisite]]
            }
            Boolean manySources = isDiagramTypeTable &&
                                  tempWidgetSettings?.data*.sourceForCompute?.count { !it } > 1
            def prevData = intermediateData
            if (isSourceForEachRow)
            {
                mergeDataAmongSources(intermediateData)
            }
            else if (!isSourceForEachRow && diagramType != DiagramType.PIVOT_TABLE && manySources || (hasTableNotOnlyBaseSources && computationInTableRequest))
            {
                Integer countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(tempWidgetSettings)
                intermediateData = updateIntermediateDataToOneSource(intermediateData, computationInTableRequest, countOfCustomsInFirstSource)
            }
            if(computationInTableRequest)
            {
                if (isSourceForEachRow)
                {
                    intermediateData = updateIntermediateDataForTableWithoutParameters(intermediateData)
                }
                else
                {
                    intermediateData = updateIntermediateData(intermediateData)
                }

                DiagramRequest request = buildDiagramRequest(intermediateData, subjectUUID, diagramType, widgetSettings)

                List<RequestData> requestData = prevData.findResults { key, value -> value?.requestData?.aggregations ? value?.requestData : null }
                def computeData = requestData?.aggregations?.attribute?.flatten()?.collectMany {
                    if(it instanceof ComputedAttr)
                    {
                        return it?.computeData?.findResults { k, v ->
                            return [currentKey: k, prevKey: v?.dataKey]
                        }
                    }
                    else
                        return []
                }
                computeData?.each {
                    def prevDataSource = prevData[it?.prevKey]?.requestData?.source
                    def currentSource = request?.data?.getAt(it?.currentKey)?.source //здесь может быть как ссылочный атрибут,
                    //так и полноценный источник - важен его код(classFqn)
                    if(metainfo.checkAttributeExisting(currentSource.classFqn, prevDataSource.classFqn))
                    {
                        request?.data[it?.currentKey]?.source = prevDataSource
                    }
                }
                return request
            }
            return buildDiagramRequest(intermediateData, subjectUUID, diagramType, widgetSettings)
        }

        /**
         * Метод объединения данных у всех источников
         * @param intermediateData - данные для формирования запроса
         */
        private void mergeDataAmongSources(Map intermediateData)
        {
            List<GroupParameter> allGroups = []

            intermediateData.each { key, request ->
                request.requestData.groups.each { group ->
                    if (!checkDuplicateGroup(allGroups, group))
                    {
                        allGroups << group
                    }
                }
            }

            if (!allGroups)
            {
                return
            }

            if (allGroups.size() == 1) // Если группировка общая
            {
                intermediateData.each { key, request ->
                    String sourceClassFqn = request.requestData.source.classFqn
                    List<GroupParameter> groups = allGroups.collect {
                        GroupParameter group = it.deepClone()
                        group.attribute.sourceCode = sourceClassFqn
                        group.attribute.metaClassFqn = sourceClassFqn
                        return group
                    }

                    request.requestData.groups = groups
                }
            }
            else if (allGroups)
            {
                Object firstGroupFormat = allGroups.head().format
                Object firstGroupType = allGroups.head().type
                intermediateData.eachWithIndex { it, index ->
                    Object request = it.value
                    String sourceClassFqn = request.requestData.source.classFqn

                    GroupParameter group = allGroups[index].deepClone()
                    group.attribute.sourceCode = sourceClassFqn
                    group.attribute.metaClassFqn = sourceClassFqn
                    group.format = firstGroupFormat
                    group.type = firstGroupType

                    request.requestData.groups = [group]
                }
            }
        }

        /**
         * Метод проверки дупликатов группировки
         * @param groups - список группировок
         * @param group - проверяемая группировка
         * @return показатель дупликат или нет
         */
        private Boolean checkDuplicateGroup(List<GroupParameter> groups, GroupParameter group)
        {
            Boolean isGroupDuplicate = false
            groups.each {
                if (group
                    && group.type == it.type
                    && group.attribute.code == it.attribute.code
                    && group.attribute.metaClassFqn == it.attribute.metaClassFqn)
                {
                    isGroupDuplicate = true
                }
            }
            return isGroupDuplicate
        }

        /**
         * Метод получения корректного источника для виджета
         * @param dataKey - ключ датасета, где использован источник
         * @param source - источник из виджета
         * @param baseDescriptor - базовый дескриптор
         * @param widgetFilters - возможные фильтры для виджета (для разных датасетов
         * @return источник с правильным фильтром
         */
        private Source getCorrectSource(String dataKey, NewSourceValue source, String baseDescriptor, Collection<WidgetFilterResponse> widgetFilters)
        {
            if(dataKey in widgetFilters.dataKey)
            {
                WidgetFilterResponse userFilter = widgetFilters.find { it.dataKey == dataKey }
                String userDescriptor = userFilter.descriptor
                baseDescriptor = prepareWidgetDescriptor(baseDescriptor, userDescriptor)
            }
            return new Source(classFqn: source.value.value, descriptor: baseDescriptor)
        }

        /**
         * Метод подготовки фильтра источника в правильному виду
         * @param baseDescriptor - базовый фильтр источника
         * @param userDescriptor - фильтр источника со стороны пользователя
         * @return подготовленный фильтр источника
         */
        private String prepareWidgetDescriptor(String baseDescriptor, String userDescriptor)
        {
            List baseDescriptorAttributes = baseDescriptor ? getAttributesFqnFromDescriptor(baseDescriptor) : []
            List userDescriptorAttributes = userDescriptor ? getAttributesFqnFromDescriptor(userDescriptor) : []
            Boolean descriptorsHaveSameAttrs = baseDescriptorAttributes.any { it in userDescriptorAttributes }

            def slurper = new groovy.json.JsonSlurper()
            def descriptorMap = baseDescriptor ? slurper.parseText(baseDescriptor) : [:]
            def userDescriptorMap = userDescriptor ? slurper.parseText(userDescriptor) : [:]

            if(descriptorsHaveSameAttrs)
            {
                descriptorMap = updateDescriptorWithTheSameAttrs(descriptorMap, userDescriptorMap, baseDescriptorAttributes, userDescriptorAttributes)
            }
            else
            {
                if(descriptorMap)
                {
                    def filters = descriptorMap.filters
                    def userFilters = userDescriptorMap ? userDescriptorMap.filters : []

                    filters = filters ? filters + userFilters : userFilters
                    descriptorMap.filters = filters
                }
                else
                {
                    descriptorMap = userDescriptorMap
                }
            }
            return JsonOutput.toJson(descriptorMap)
        }

        /**
         * Метод по преобразованию двух фильтров источника в один, если у них есть одинаковые атрибуты в составе
         * @param descriptorMap - словарь с настройками базового фильтра
         * @param userDescriptorMap - словарь с настройками основного фильтра
         * @param baseDescriptorAttributes - атрибуты базового фильтра
         * @param userDescriptorAttributes - атрибуты пользовательского фильтра
         * @return комбо-фильтр для источника
         */
        private Map updateDescriptorWithTheSameAttrs(Map descriptorMap, Map userDescriptorMap, List baseDescriptorAttributes, List userDescriptorAttributes)
        {
            //фильтры основного фильтра  покрывает фильтры от пользовательского целиком -
            // нужно заменить фильтры основного, где атрибуты одни и те же, на те, что есть в пользовательском фильтре
            if(baseDescriptorAttributes - userDescriptorAttributes && baseDescriptorAttributes.containsAll(userDescriptorAttributes))
            {
                def filters = descriptorMap.filters
                def userFilters = userDescriptorMap.filters
                descriptorMap.filters = putUserFiltersIntoBase(userFilters, filters, userDescriptorAttributes)
            }
            else if(userDescriptorAttributes.containsAll(baseDescriptorAttributes))
            {
                //иначе пользовательский покрыл все фильтры основного, то логично применить фильтры от пользовательского целиком
                descriptorMap = userDescriptorMap
            }
            else if((userDescriptorAttributes - baseDescriptorAttributes) && (baseDescriptorAttributes - userDescriptorAttributes))
            {
                //в обоих случаях остались фильтры помимо пользовательского/основного
                def filters = descriptorMap.filters
                def userFilters = userDescriptorMap.filters
                //помещаем в нужные базовые фильтры значения пользовательского фильтров и смешиваем их с пользовательскими
                descriptorMap.filters = putUserFiltersIntoBase(userFilters, filters, userDescriptorAttributes) + userFilters
                //убираем повторы
                descriptorMap.filters.unique()
            }
            return descriptorMap
        }

        /**
         * Метод по смешению атрибутов базового и пользовательского фильтра
         * @param userFilters - словарь с настройками базового фильтра
         * @param filters - словарь с настройками основного фильтра
         * @param userDescriptorAttributes - атрибуты пользовательского дескриптора
         * @return базовый фильтр со значениями пользовательского в нужных атрибутах
         */
        List<List> putUserFiltersIntoBase( List<List> userFilters,  List<List> filters, List userDescriptorAttributes)
        {
            List<List> result = filters.collect { filterValue ->
                return filterValue.findAll { filtering ->
                    def attribute = filtering.properties.attributeFqn
                    return !(attribute in userDescriptorAttributes)
                }
            }
            return result.findAll() + userFilters
        }

        /**
         * Метод по получению fqn-кодов атрибутов из фильтра источника
         * @param descriptor - фильтр источника
         * @return список fqn-кодов атрибутов
         */
        private List<String> getAttributesFqnFromDescriptor(String descriptor)
        {
            List descriptorAttributes = []
            def iDesciptor = listdata.createListDescriptor(descriptor).wrapped

            iDesciptor.listFilter.elements.each { orFilter ->
                orFilter.elements.each { filter ->
                    descriptorAttributes << filter.getAttributeFqn() as String
                }
            }
            return descriptorAttributes
        }

        /**
         * Метод создания параметра группировки основанного только на системных группировках
         * @param groupType - объект описывающий группировку
         * @param attr - атрибут
         * @param title - название места, откуда пришла группа
         * @return параметр группировки
         */
        private GroupParameter buildSystemGroup(def groupType, Attribute attr, String title = 'breakdown')
        {
            return new GroupParameter(
                title: title,
                type: Attribute.getAttributeType(attr) == AttributeType.DT_INTERVAL_TYPE
                    ? getDTIntervalGroupType(groupType.data as String)
                    : groupType.data as GroupType,
                attribute: attr,
                format: groupType.format
            )
        }

        /**
         * Метод определения типа группировки для атрибута типа "временной интервал"
         * @param groupType - декларируемая группировка временного интервала
         * @return фактическая группировка временного интервала
         */
        private GroupType getDTIntervalGroupType(String groupType)
        {
            if (!groupType)
            {
                groupType = ''
            }
            switch (groupType.toLowerCase())
            {
                case 'overlap':
                    return GroupType.OVERLAP
                case 'second':
                    return GroupType.SECOND_INTERVAL
                case 'minute':
                    return GroupType.MINUTE_INTERVAL
                case 'hour':
                    return GroupType.HOUR_INTERVAL
                case 'day':
                    return GroupType.DAY_INTERVAL
                case 'week':
                    return GroupType.WEEK_INTERVAL
                default:
                    String message = messageProvider.getMessage(NOT_SUPPORTED_DTINTERVAL_GROUP_TYPE_ERROR, currentUserLocale, groupType: groupType)
                    utils.throwReadableException("$message#${NOT_SUPPORTED_DTINTERVAL_GROUP_TYPE_ERROR}")
            }
        }

        /**
         * Метод создания запроса для QueryWrapper
         * @param intermediateData - промежуточные данные сгруппированые по первичному признаку
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param diagramType - тип диаграммы
         * @param widgetSettings - настройки виджета
         * @return DiagramRequest
         */
        private DiagramRequest buildDiagramRequest(Map<String, Map> intermediateData, String subjectUUID, DiagramType diagramType = DiagramType.COMBO, Object widgetSettings)
        {
            if (diagramType == DiagramType.PIVOT_TABLE)
            {
                intermediateData = mergeSourceDataForPivotTable(intermediateData, widgetSettings)
            }

            // доводим запрос до совершенства/ шлифуем вычисления
            Closure getRequestData = { String key -> intermediateData[key].requestData }
            def computationDataRequest = intermediateData
                .findResults { key, value -> value.computeData ? value : null }
                ?.collectEntries(this.&produceComputationData.curry(getRequestData, diagramType)) ?: [:]

            def defaultDataRequest = intermediateData.findResults { key, map ->
                map.requisite && !(map.computeData) ? [(key): map.requestData] : null
            }?.collectEntries() ?: [:]

            def resultRequestData = (defaultDataRequest + computationDataRequest) as Map<String, RequestData>

            // Реквизиты
            Collection<Requisite> requisite = intermediateData.findResults { key, value ->
                value.requisite as Requisite
            }

            resultRequestData = updateDiagramRequestDataForPercentCalculation(requisite, resultRequestData)

            return new DiagramRequest(requisite: requisite, data: resultRequestData)
        }

        /**
         * Приведение данных к одному источнику для сводной таблицы
         * @param intermediateData - промежуточные данные запроса
         * @param widgetSettings - настройки виджета
         * @return данные запроса для сводной таблицы
         */
        private Map<String, Map> mergeSourceDataForPivotTable(Map<String, Map> intermediateData, Object widgetSettings)
        {
            String firstDataKey

            Collection<AggregationParameter> aggregations = []
            Collection<GroupParameter> groups = []
            Collection<Collection<FilterParameter>> filters = []
            Collection<Source> sources = []

            intermediateData.each { key, value ->
                if (!firstDataKey)
                {
                    firstDataKey = key
                }

                aggregations += value.requestData.aggregations
                groups += value.requestData.groups
                filters += value.requestData.filters
                value.requestData.source.dataKey = key
                sources << value.requestData.source
            }

            intermediateData = [(firstDataKey): intermediateData[firstDataKey]] as Map<String, Map>
            intermediateData[firstDataKey].requestData.aggregations = aggregations
            intermediateData[firstDataKey].requestData.groups = groups
            intermediateData[firstDataKey].requestData.sources = sources
            intermediateData[firstDataKey].requestData.links = widgetSettings.links

            return intermediateData
        }

        /**
         * Метод обработки данных запроса для расчета процента для показателя относительно источника
         * @param requisites - реквизиты
         * @param resultRequestData - данные запроса
         * @return обновленные данные запроса
         */
        private Map<String, RequestData> updateDiagramRequestDataForPercentCalculation(Collection<Requisite> requisites,
                                                                   Map<String, RequestData> resultRequestData)
        {
            Map<String, RequestData> updatedRequestData = [:]

            resultRequestData.each {
                RequestData requestData = it.value
                String dataKey = it.key
                Collection<AggregationParameter> aggregations = requestData.aggregations
                updatedRequestData[dataKey] = requestData

                if (aggregations.head().attribute.type != 'PERCENTAGE_RELATIVE_ATTR')
                {
                    return
                }

                String sourceCode = requestData.source.classFqn
                String mergedDescriptor = dashboardQueryWrapperUtils.getDescriptorWithMergedFilters(
                    requestData.source.descriptor,
                    aggregations.head().attribute.descriptor
                )
                Attribute attributeForPercentCalculation = getAttributeForPercentCalculation(sourceCode)

                aggregations.head().attribute = attributeForPercentCalculation

                RequestData requestDataWithMergedDescriptor = requestData.clone()
                requestDataWithMergedDescriptor.source = requestDataWithMergedDescriptor.source.clone()
                String newDataKey = UUID.randomUUID()
                requestDataWithMergedDescriptor.source.descriptor = mergedDescriptor
                updatedRequestData[newDataKey] = requestDataWithMergedDescriptor

                RequisiteNode requisiteNode = new ComputationRequisiteNode(
                    title: null,
                    type: 'COMPUTATION',
                    formula: "[{${ newDataKey }}/{${ dataKey }}*100]"
                )
                Requisite requisite = new Requisite(
                    title: 'DEFAULT',
                    nodes: [requisiteNode],
                    showNulls: false
                )
                requisites[
                    requisites.findIndexOf {
                        it.nodes.head() in DefaultRequisiteNode && it.nodes.head().dataKey == dataKey
                    }
                ] = requisite
            }

            return updatedRequestData
        }

        /**
         * Метод получения атрибута, относительно которого будет производится расчет процента для показателя относительно источника
         * @param sourceCode - код источнка
         * @return атрибут
         */
        private Attribute getAttributeForPercentCalculation(String sourceCode)
        {
            return new Attribute(
                type: 'string',
                metaClassFqn: sourceCode,
                sourceCode: sourceCode,
                code: 'UUID'
            )
        }

        /**
         * Метод обработки вычислений
         * @param getData - функция получения источника данных по ключю
         * @param diagramType - тип диаграммы
         * @param map - данные для вычислений
         * @return сгруппированные данные по названию переменной и источнику данных
         */
        Map<String, RequestData> produceComputationData(Closure getData, DiagramType diagramType, Map map)
        {
            if (map.computeData instanceof Collection)
            {
                def computeData = map.computeData as List<Map>
                // делаем предположение. Если есть вычисление значит реквизиты точно есть
                def req = map.requisite as Requisite
                //в записи лежит формула
                def node = req.nodes.find {
                    it instanceof ComputationRequisiteNode
                }
                //по идее на этом этапе у нас только один реквизит и у него одна запись
                def formula = (node as ComputationRequisiteNode).formula
                def variableNames = new FormulaCalculator(formula).variableNames

                return variableNames.collectEntries { variableName ->
                    def comp = computeData[variableName].find() as Map<String, Object>

                    def attribute = comp?.aggregation?.attribute
                    def attributeType = Attribute.getAttributeType(attribute)
                    if (attributeType in AttributeType.LINK_TYPES && attributeType != AttributeType.CATALOG_ITEM_TYPE)
                    {
                        attribute.attrChains().last().ref = new Attribute(title: 'Название', code: 'title', type: 'string')
                    }

                    def dataKey = comp.dataKey as String
                    // этот ключ указывает на источник вместе с группировками
                    def requestData = getData(dataKey) as RequestData
                    def newRequestData = requestData.clone()
                    def group = comp.group as GroupParameter
                    def aggregation = comp.aggregation as AggregationParameter
                    aggregation.attribute.title = aggregation.title
                    if (diagramType == DiagramType.TABLE)
                    {
                        //убираем всю информацию о вычислении
                        newRequestData.aggregations -= newRequestData.aggregations.findAll {
                            !it?.attribute || it?.attribute?.type == 'COMPUTED_ATTR'
                        }
                        //заменяем нормальным атрибутов агрегации
                        newRequestData.aggregations.add(0, aggregation)
                    }
                    else
                    {
                        newRequestData.aggregations = [aggregation]
                    }
                    // предполагаем что количество агрегаций будет не больше одной
                    newRequestData.groups = (newRequestData.groups || group) ? (newRequestData.groups + group).grep() :
                        null
                    // группировку нужно будет добавить к существующим
                    newRequestData.groups = newRequestData.groups as Set
                    return [(variableName): newRequestData]
                }
            }
            else
            {
                def computeData = map.computeData as Map<String, Object>
                // делаем предположение. Если есть вычисление значит реквизиты точно есть
                def req = map.requisite as Requisite
                //в записи лежит формула
                def node = req.nodes.head()
                //по идее на этом этапе у нас только один реквизит и у него одна запись
                def formula = (node as ComputationRequisiteNode).formula
                def variableNames = new FormulaCalculator(formula).variableNames

                return variableNames.collectEntries { variableName ->
                    def comp = computeData[variableName] as Map<String, Object>

                    def attribute = comp?.aggregation?.attribute
                    def attributeType = Attribute.getAttributeType(attribute)
                    if (attributeType in AttributeType.LINK_TYPES && attributeType != AttributeType.CATALOG_ITEM_TYPE)
                    {
                        attribute.attrChains().last().ref = new Attribute(title: 'Название', code: 'title', type: 'string')
                    }
                    def dataKey = comp.dataKey as String
                    // этот ключ указывает на источник вместе с группировками
                    def requestData = getData(dataKey) as RequestData
                    def newRequestData = requestData.clone()

                    def group = null
                    if (!checkDuplicateGroup(newRequestData.groups, comp.group as GroupParameter))
                    {
                        group = comp.group as GroupParameter
                    }

                    def aggregation = comp.aggregation as AggregationParameter
                    if (diagramType == DiagramType.TABLE)
                    {
                        //убираем всю информацию о вычислении
                        newRequestData.aggregations -= newRequestData.aggregations.findAll {
                            !it?.attribute || it?.attribute?.type == 'COMPUTED_ATTR'
                        }
                        //заменяем нормальным атрибутов агрегации
                        newRequestData.aggregations.add(0, aggregation)
                    }
                    else
                    {
                        newRequestData.aggregations = [aggregation]
                    }
                    // предполагаем что количество агрегаций будет не больше одной
                    newRequestData.groups = (newRequestData.groups || group)
                        ? (newRequestData.groups.findAll { it?.title != 'usual_breakdown' } + group).grep()
                        : null
                    // группировку нужно будет добавить к существующим
                    newRequestData.groups = newRequestData.groups as Set
                    return [(variableName): newRequestData]
                }
            }
        }

        /**
         * Метод построения атрибута
         * @param data - данные для атрибута
         * @return Attribute
         */
        private Attribute mappingAttribute(Map<String, Object> data)
        {
            return Attribute.fromMap(data)
        }

        /**
         * Метод получения функции преобразования пользовательской группировки в удобный формат
         * @param type - тип пользовательской группировки
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param source - источник запроса
         * @param offsetUTCMinutes - смещение часового пояса пользователя относительно серверного времени
         * @param fromDD - флаг на вызов метода из модуля Дриллдаун
         * @return функция преобразования настроек пользовательской группировки
         */
        private Closure<Collection<Collection<FilterParameter>>> getMappingFilterMethodByType(String type, String subjectUUID, Source source, Integer offsetUTCMinutes, Boolean fromDD = false)
        {
            switch (type)
            {
                case AttributeType.DT_INTERVAL_TYPE:
                    return this.&mappingDTIntervalTypeFilters
                case AttributeType.STRING_TYPE:
                    return this.&mappingStringTypeFilters
                case AttributeType.INTEGER_TYPE:
                    return this.&mappingNumberTypeFilters.curry({ it as long })
                case AttributeType.DOUBLE_TYPE:
                    return this.&mappingNumberTypeFilters.curry({ it as double })
                case AttributeType.DATE_TYPES:
                    return this.&mappingDateTypeFilters.curry(source, offsetUTCMinutes)
                case AttributeType.STATE_TYPE:
                    return this.&mappingStateTypeFilters.curry(subjectUUID)
                case [AttributeType.BO_LINKS_TYPE, AttributeType.BACK_BO_LINKS_TYPE, AttributeType.OBJECT_TYPE]:
                    return this.&mappingLinkTypeFilters.curry(subjectUUID)
                case [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE]:
                    return this.&mappingCatalogItemTypeFilters.curry(subjectUUID)
                case AttributeType.META_CLASS_TYPE:
                    return this.&mappingMetaClassTypeFilters.curry(subjectUUID)
                case AttributeType.TIMER_TYPES:
                    return this.&mappingTimerTypeFilters.curry(source, fromDD)
                default:
                    String message = messageProvider.getMessage(NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP_ERROR, currentUserLocale, type: type)
                    utils.throwReadableException("$message#${NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP_ERROR}")
            }
        }

        /**
         * Метод преодбразований настроек группировки для динамических атрибутов
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировка
         * @param title - название группировки
         * @param id - уникальный идентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> getDynamicFilter(List<List> data, Attribute attribute, String title, String id)
        {
            String templateUUID = TotalValueMarshaller.unmarshal(attribute?.code).last()
            return mappingFilter(data) { condition ->
                def value = utils.get(templateUUID)
                return new FilterParameter(
                    value: value,
                    title: title,
                    id: id,
                    type: Comparison.EQUAL,
                    attribute: new Attribute(code: 'linkTemplate', type: AttributeType.OBJECT_TYPE)
                )
            }
        }

        /**
         * Метод преодбразований настроек группировки для каталогов
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный идентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingCatalogItemTypeFilters(String subjectUUID, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            String message = messageProvider.getConstant(NO_DATA_FOR_CONDITION_ERROR, currentUserLocale)
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.EMPTY:
                        return new FilterParameter(
                            value: null,
                            title: title,
                            id: id,
                            type: Comparison.IS_NULL,
                            attribute: attribute
                        )
                    case Condition.NOT_EMPTY:
                        return new FilterParameter(
                            value: null,
                            title: title,
                            id: id,
                            type: Comparison.NOT_NULL,
                            attribute: attribute
                        )
                    case Condition.CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        def value = utils.get(uuid)
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL,
                            attribute: attribute
                        )
                    case Condition.NOT_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        def value = utils.get(uuid)
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.NOT_EQUAL,
                            attribute: attribute
                        )
                    case Condition.CONTAINS_ANY:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def uuids = condition.data*.uuid
                        def values = uuids.collect { uuid -> utils.get(uuid)
                        }
                        return new FilterParameter(
                            value: values,
                            title: title,
                            id: id,
                            type: Comparison.IN,
                            attribute: attribute
                        )
                    case Condition.TITLE_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        return new FilterParameter(
                            value: condition.data,
                            title: title,
                            id: id,
                            type: Comparison.CONTAINS,
                            attribute: attribute
                        )
                    case Condition.TITLE_NOT_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        return new FilterParameter(
                            value: condition.data,
                            title: title,
                            id: id,
                            type: Comparison.NOT_CONTAINS,
                            attribute: attribute
                        )
                    case Condition.CONTAINS_CURRENT_OBJECT:
                        def value = utils.get(subjectUUID)
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL,
                            attribute: attribute
                        )
                    case [Condition.CONTAINS_ATTR_CURRENT_OBJECT, Condition.EQUAL_ATTR_CURRENT_OBJECT]:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def code = condition.data.code
                        def value = utils.get(subjectUUID)[code]
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL,
                            attribute: attribute
                        )
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для ссылочных типов
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный идентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingLinkTypeFilters(String subjectUUID, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            String message = messageProvider.getConstant(NO_DATA_FOR_CONDITION_ERROR, currentUserLocale)
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.EMPTY:
                        return new FilterParameter(
                            value: null,
                            title: title,
                            id: id,
                            type: Comparison.IS_NULL,
                            attribute: attribute
                        )
                    case Condition.NOT_EMPTY:
                        return new FilterParameter(
                            value: null,
                            title: title,
                            id: id,
                            type: Comparison.NOT_NULL,
                            attribute: attribute
                        )
                    case Condition.CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        def value = utils.get(uuid)
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL,
                            attribute: attribute
                        )
                    case Condition.NOT_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        def value = utils.get(uuid)
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.NOT_EQUAL,
                            attribute: attribute
                        )
                    case Condition.IN:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def uuids = condition.data*.uuid
                        def values = uuids.collect { uuid -> utils.get(uuid)
                        }
                        return new FilterParameter(
                            value: values,
                            title: title,
                            id: id,
                            type: Comparison.IN,
                            attribute: attribute
                        )
                    case Condition.TITLE_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        return new FilterParameter(
                            value: condition.data,
                            title: title,
                            id: id,
                            type: Comparison.CONTAINS,
                            attribute: attribute
                        )
                    case Condition.TITLE_NOT_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        return new FilterParameter(
                            value: condition.data,
                            title: title,
                            id: id,
                            type: Comparison.NOT_CONTAINS,
                            attribute: attribute
                        )
                    case Condition.CONTAINS_INCLUDING_ARCHIVAL:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def value = condition.data.uuid
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL_REMOVED,
                            attribute: attribute
                        )
                    case Condition.NOT_CONTAINS_INCLUDING_ARCHIVAL:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def value = condition.data.uuid
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.NOT_EQUAL_REMOVED,
                            attribute: attribute
                        )
                    case Condition.CONTAINS_INCLUDING_NESTED:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        def value = utils.get(uuid)
                        def nestedVaues =  utils.getNested(value)
                        return new FilterParameter(
                            value: [value, *nestedVaues],
                            title: title,
                            id: id,
                            type: Comparison.IN,
                            attribute: attribute
                        )
                    case Condition.CONTAINS_ANY:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def uuids = condition.data*.uuid
                        def values = uuids.collect { uuid -> utils.get(uuid)
                        }
                        return new FilterParameter(
                            value: values,
                            title: title,
                            id: id,
                            type: Comparison.IN,
                            attribute: attribute
                        )
                    case [Condition.CONTAINS_CURRENT_OBJECT, Condition.EQUAL_CURRENT_OBJECT]:
                        def value = utils.get(subjectUUID)
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL,
                            attribute: attribute
                        )
                    case [Condition.EQUAL_ATTR_CURRENT_OBJECT, Condition.CONTAINS_ATTR_CURRENT_OBJECT]:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def code = condition.data.code
                        def value = utils.get(subjectUUID)[code]
                        return new FilterParameter(
                            value: value,
                            title: title,
                            id: id,
                            type: Comparison.EQUAL,
                            attribute: attribute
                        )
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для временных интервалов
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingDTIntervalTypeFilters(List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                Closure<FilterParameter> buildFilterParameterFromCondition = { Comparison type ->
                    def interval = condition.data as Map
                    // тут будет лежать значение временного интервала
                    def value = interval
                        ? types.newDateTimeInterval([interval.value as long, interval.type as String])
                        : null
                    //Важный момент. Обязательно извлекать милисекунды, так как критерия не может это сделать сама.
                    new FilterParameter(value: value, title: title,
                                        id: id, type: type, attribute: attribute)
                }
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.EMPTY:
                        return buildFilterParameterFromCondition(Comparison.IS_NULL)
                    case Condition.NOT_EMPTY:
                        return buildFilterParameterFromCondition(Comparison.NOT_NULL)
                    case Condition.EQUAL:
                        return buildFilterParameterFromCondition(Comparison.EQUAL)
                    case Condition.NOT_EQUAL:
                        return buildFilterParameterFromCondition(Comparison.NOT_EQUAL)
                    case Condition.GREATER:
                        return buildFilterParameterFromCondition(Comparison.GREATER)
                    case Condition.LESS:
                        return buildFilterParameterFromCondition(Comparison.LESS)
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для строковых типов
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingStringTypeFilters(List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                Closure buildFilterParameterFromCondition = { Comparison type ->
                    new FilterParameter(
                        value: condition.data,
                        title: title,
                        id: id,
                        type: type,
                        attribute: attribute
                    )
                }
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.CONTAINS:
                        return buildFilterParameterFromCondition(Comparison.CONTAINS)
                    case Condition.NOT_CONTAINS_INCLUDING_EMPTY:
                        return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS_INCLUDING_EMPTY)
                    case Condition.NOT_CONTAINS:
                        return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS)
                    case Condition.EMPTY:
                        return buildFilterParameterFromCondition(Comparison.IS_NULL)
                    case Condition.NOT_EMPTY:
                        return buildFilterParameterFromCondition(Comparison.NOT_NULL)
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для числовых типов
         * @param valueConverter - функция преодразования строки в число
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingNumberTypeFilters(Closure valueConverter, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            def possibleFilter = mappingFilter(data) { condition ->
                Closure buildFilterParameterFromCondition = { Comparison type ->
                    new FilterParameter(
                        value: condition.data ? condition.data.with(valueConverter) : null,
                        title: title,
                        id: id,
                        type: type,
                        attribute: attribute
                    )
                }
                String conditionType = condition.type
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.EQUAL:
                        return buildFilterParameterFromCondition(Comparison.EQUAL) as FilterParameter
                    case Condition.NOT_EQUAL_NOT_EMPTY:
                        return buildFilterParameterFromCondition(Comparison.NOT_EQUAL_AND_NOT_NULL) as FilterParameter
                    case Condition.NOT_EQUAL:
                        return buildFilterParameterFromCondition(Comparison.NOT_EQUAL) as FilterParameter
                    case Condition.GREATER:
                        return buildFilterParameterFromCondition(Comparison.GREATER) as FilterParameter
                    case Condition.LESS:
                        return buildFilterParameterFromCondition(Comparison.LESS) as FilterParameter
                    case Condition.EMPTY:
                        return buildFilterParameterFromCondition(Comparison.IS_NULL) as FilterParameter
                    case Condition.NOT_EMPTY:
                        return buildFilterParameterFromCondition(Comparison.NOT_NULL) as FilterParameter
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для dateTime типов
         * @param source - источник
         * @param offsetMinutes - смещение часового пояса пользователя относительно серверного времени
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingDateTypeFilters(Source source, Integer offsetMinutes, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            String templateUUID
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                templateUUID = TotalValueMarshaller.unmarshal(attribute.code).last()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                Closure<FilterParameter> buildFilterParameterFromCondition = { value, type ->
                    return new FilterParameter(
                        title: title,
                        id: id,
                        type: type,
                        attribute: attribute,
                        value: value
                    )
                }
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.EMPTY:
                        return buildFilterParameterFromCondition(null, Comparison.IS_NULL)
                    case Condition.NOT_EMPTY:
                        return buildFilterParameterFromCondition(null, Comparison.NOT_NULL)
                    case Condition.TODAY:
                        return buildFilterParameterFromCondition(null, Comparison.TODAY)
                    case Condition.LAST:
                        def count = condition.data as int
                        return buildFilterParameterFromCondition(count, Comparison.LAST_N_DAYS)
                    case Condition.LAST_HOURS:
                        def count  = condition.data as int
                        def start = Calendar.instance.with {
                            add(DAY_OF_MONTH, 0)
                            set(HOUR_OF_DAY, -count)
                            set(MINUTE, 0)
                            set(SECOND, 0)
                            set(MILLISECOND, 0)
                            getTime()
                        }
                        def end = Calendar.instance.with {
                            set(HOUR_OF_DAY, 23)
                            set(MINUTE, 59)
                            set(SECOND, 59)
                            set(MILLISECOND, 999)
                            getTime()
                        }
                        // Сдвиг для учета часового пояса пользователя.
                        start = DateUtils.addMinutes(start, offsetMinutes)
                        end = DateUtils.addMinutes(end, offsetMinutes)
                        return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                    case Condition.NEAR:
                        def count = condition.data as int
                        def start = new Date()
                        //86400000 - 24*60*60*1000 (день в мс)
                        def end = new Date(start.getTime() + count * 86400000)
                        start = DateUtils.addMinutes(start, offsetMinutes)
                        end = DateUtils.addMinutes(end, offsetMinutes)
                        return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                    case Condition.NEAR_HOURS:
                        def count = condition.data as int
                        def start = new Date()
                        //3600000 - 60*60*1000 (час в мс)
                        def end = new Date(start.getTime() + count * 3600000)
                        start = DateUtils.addMinutes(start, offsetMinutes)
                        end = DateUtils.addMinutes(end, offsetMinutes)
                        return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                    case Condition.BETWEEN:
                        def dateSet = condition.data as Map<String, Object> // тут будет массив дат или одна из них
                        def start
                        if(dateSet.startDate)
                        {
                            String dateFormat = DashboardUtils.getDateFormatByDate(dateSet.startDate)
                            start = Date.parse(dateFormat, dateSet.startDate as String)
                        }
                        else
                        {
                            Date minDate
                            if(attrIsDynamic)
                            {
                                def tempAttr = attribute.deepClone()
                                tempAttr.title = templateUUID
                                minDate = dashboardQueryWrapperUtils.getMinDateDynamic(tempAttr, source)
                            }
                            else
                            {
                                minDate = DashboardUtils.getMinDate(attribute.attrChains().code.join('.'), attribute.sourceCode)
                            }

                            start = new Date(minDate.time).clearTime()
                        }
                        def end
                        if (dateSet.endDate)
                        {
                            String dateFormat = DashboardUtils.getDateFormatByDate(dateSet.endDate)
                            end = Date.parse(dateFormat, dateSet.endDate as String)
                            if(Attribute.getAttributeType(attribute) == AttributeType.DATE_TIME_TYPE)
                            {
                                def dateScope = 86399000 //+23 ч 59 мин 59с
                                end = new Date(end.getTime() + dateScope)
                            }
                        }
                        else
                        {
                            end = new Date()
                        }
                        start = DateUtils.addMinutes(start, offsetMinutes)
                        end = DateUtils.addMinutes(end, offsetMinutes)
                        return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для статусов
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingStateTypeFilters(String subjectUUID, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                Closure buildFilterParameterFromCondition = { Comparison comparison, Attribute attr, value ->
                    return new FilterParameter(title: title, id: id, type: comparison, attribute: attr, value: value)
                }
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.CONTAINS:
                        return buildFilterParameterFromCondition(Comparison.EQUAL, attribute, condition.data.uuid)
                    case Condition.NOT_CONTAINS:
                        return buildFilterParameterFromCondition(Comparison.NOT_EQUAL, attribute, condition.data.uuid)
                    case Condition.CONTAINS_ANY:
                        return buildFilterParameterFromCondition(Comparison.IN, attribute, condition.data.uuid)
                    case Condition.TITLE_CONTAINS:
                        return buildFilterParameterFromCondition(Comparison.STATE_TITLE_CONTAINS, attribute, condition.data)
                    case Condition.TITLE_NOT_CONTAINS:
                        return buildFilterParameterFromCondition(Comparison.STATE_TITLE_NOT_CONTAINS, attribute, condition.data)
                    case [Condition.EQUAL_SUBJECT_ATTRIBUTE, Condition.EQUAL_ATTR_CURRENT_OBJECT]:
                        if (!condition.data)
                        {
                            String message = messageProvider.getConstant(NO_DATA_FOR_CONDITION_ERROR, currentUserLocale)
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def code = condition.data.code
                        def value = utils.get(subjectUUID)[code]
                        def subjectAttribute = condition.data
                        def subjectAttributeType = subjectAttribute.type
                        if (subjectAttributeType != attribute.type)
                        {
                            String message = messageProvider.getMessage(SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_ERROR, currentUserLocale, subjectType: subjectType, property: attribute.property)
                            utils.throwReadableException("$message#${SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_ERROR}")
                        }
                        return new FilterParameter(value: value, title: title,
                                                   id: id, type: Comparison.EQUAL, attribute: attribute)
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод преодбразований настроек группировки для таймеров
         * @param source - источник запроса
         * @param fromDD - флаг, указывающий на то, что метод вызыван из модуля Дриллдаун
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingTimerTypeFilters(Source source, Boolean fromDD, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            String templateUUID
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                templateUUID = TotalValueMarshaller.unmarshal(attribute.code).last()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                Closure buildFilterParameterFromCondition = { Comparison comparison, Attribute attr, value ->
                    return new FilterParameter(title: title,
                                               id: id, type: comparison, attribute: attr, value: value)
                }
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.STATUS_CONTAINS:
                        def status = condition.data.value.toString()
                        String value = status.toLowerCase().charAt(0)
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                        return buildFilterParameterFromCondition(Comparison.CONTAINS, temAttribute, value)
                    case Condition.STATUS_NOT_CONTAINS:
                        def status = condition.data.value.toString()
                        String value = status.toLowerCase().charAt(0)
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                        return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS, temAttribute, value)
                    case Condition.EXPIRATION_CONTAINS:
                        def comparison = condition.data.value == 'EXCEED'
                            ? Comparison.CONTAINS
                            : Comparison.NOT_CONTAINS
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                        return buildFilterParameterFromCondition(comparison, temAttribute, 'e')
                    case Condition.EXPIRES_BETWEEN: // Время окончания в диапазоне
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'время окончания', code: 'deadLineTime', type: 'integer'))
                        def dateSet = condition.data as Map<String, Object> // тут будет массив дат или одна из них
                        def start
                        if(dateSet.startDate)
                        {
                            String dateFormat = DashboardUtils.getDateFormatByDate(dateSet.startDate)
                            start = Date.parse(dateFormat, dateSet.startDate as String)
                        }
                        else
                        {

                            def minDate

                            if(attrIsDynamic)
                            {
                                def tempAttr = attribute.deepClone()
                                tempAttr.title = templateUUID
                                minDate = dashboardQueryWrapperUtils.getMinDateDynamic(tempAttr, source)
                            }
                            else
                            {
                                String attributeCode = "${attribute.attrChains().code.join('.')}.deadLineTime"
                                minDate = DashboardUtils.getMinDate(attributeCode, attribute.sourceCode)
                            }
                            start = new Date(minDate.time).clearTime()
                        }
                        def end
                        if (dateSet.endDate)
                        {
                            String dateFormat = DashboardUtils.getDateFormatByDate(dateSet.endDate)
                            end = Date.parse(dateFormat, dateSet.endDate as String)
                        }
                        else
                        {
                            end = new Date().clearTime()
                        }
                        return buildFilterParameterFromCondition(Comparison.BETWEEN,temAttribute, [start.getTime(), end.getTime()])
                    case Condition.GREATER:
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'значение счётчика', code: 'elapsed', type: 'long'))
                        def durationInMs = getTimerDurationInMsByConditionValue(condition.data, TIMER_ROUND_TYPE.ROUND_CEIL_BY_MINUTES)
                        return buildFilterParameterFromCondition(Comparison.GREATER, temAttribute, durationInMs)
                    case Condition.LESS:
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'значение счётчика', code: 'elapsed', type: 'long'))
                        def durationInMs = getTimerDurationInMsByConditionValue(condition.data, TIMER_ROUND_TYPE.ROUND_FLOOR_BY_MINUTES)
                        return buildFilterParameterFromCondition(Comparison.LESS, temAttribute, durationInMs)
                    case Condition.EQUAL:
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'значение счётчика', code: 'elapsed', type: 'long'))
                        def durationInMsMinuteStart = getTimerDurationInMsByConditionValue(condition.data)
                        def durationInMsMinuteEnd = getTimerDurationInMsByConditionValue(condition.data,fromDD ? TIMER_ROUND_TYPE.ROUND_CEIL_BY_SECONDS : TIMER_ROUND_TYPE.ROUND_CEIL_BY_MINUTES)
                        return buildFilterParameterFromCondition(Comparison.BETWEEN, temAttribute, [durationInMsMinuteStart, durationInMsMinuteEnd])
                    case Condition.NOT_EQUAL:
                        def temAttribute = attribute.deepClone()
                        temAttribute.addLast(new Attribute(title: 'значение счётчика', code: 'elapsed', type: 'long'))
                        def durationInMsMinuteStart = getTimerDurationInMsByConditionValue(condition.data)
                        def durationInMsMinuteEnd = getTimerDurationInMsByConditionValue(condition.data, TIMER_ROUND_TYPE.ROUND_CEIL_BY_MINUTES)
                        return buildFilterParameterFromCondition(Comparison.NOT_BETWEEN, temAttribute, [durationInMsMinuteStart, durationInMsMinuteEnd])
                    case Condition.EMPTY:
                        def temAttribute = attribute.deepClone()
                        return buildFilterParameterFromCondition(Comparison.IS_NULL, temAttribute, null)
                    case Condition.NOT_EMPTY:
                        def temAttribute = attribute.deepClone()
                        return buildFilterParameterFromCondition(Comparison.NOT_NULL, temAttribute, null)
                    default:
                        String message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }


        /**
         * Метод полученеия количества округленных миллисекунд из условия
         * @param conditionValue - условие, содержащее количество часов, минут, возможно секунд
         * @param roundType - тип округления
         * @return - количество миллисекунд
         */
        Long getTimerDurationInMsByConditionValue(ArrayList conditionValue, TIMER_ROUND_TYPE roundType = TIMER_ROUND_TYPE.NO_ROUND)
        {
            def msInSecond = 1000
            def msInMinute = 60 * msInSecond
            def minutesInHour = 60

            Long durationInMs = conditionValue.collect {
                switch (it.type)
                {
                    case 'HOUR':
                        return msInMinute * minutesInHour * (it.value as Integer)
                    case 'MINUTE':
                        def minutes = it.value as Integer

                        if (roundType == TIMER_ROUND_TYPE.ROUND_CEIL_BY_MINUTES) {
                            minutes++
                        }
                        if (roundType == TIMER_ROUND_TYPE.ROUND_FLOOR_BY_MINUTES) {
                            minutes--
                        }
                        return msInMinute * minutes
                    case 'SECOND':
                        def seconds = it.value as Integer

                        if (roundType == TIMER_ROUND_TYPE.ROUND_CEIL_BY_SECONDS)
                        {
                            seconds++
                        }
                        if (roundType == TIMER_ROUND_TYPE.ROUND_FLOOR_BY_SECONDS)
                        {
                            seconds--
                        }
                        return msInSecond * seconds
                    default: return 0
                }
            }.sum()

            if (roundType in [TIMER_ROUND_TYPE.ROUND_CEIL_BY_SECONDS, TIMER_ROUND_TYPE.ROUND_CEIL_BY_MINUTES])
            {
                durationInMs--
            }
            if (roundType in [TIMER_ROUND_TYPE.ROUND_FLOOR_BY_SECONDS, TIMER_ROUND_TYPE.ROUND_FLOOR_BY_MINUTES])
            {
                durationInMs++
            }

            return durationInMs
        }

        /**
         * Метод преодбразований настроек группировки для метакласса
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param data - настройки группировки
         * @param attribute - атрибут к которому привязана группировки
         * @param title - название группировки
         * @param id - уникальный индентификатор
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingMetaClassTypeFilters(String subjectUUID, List<List> data, Attribute attribute, String title, String id)
        {
            Boolean attrIsDynamic = attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            def dynamicFilter
            if(attrIsDynamic)
            {
                dynamicFilter = getDynamicFilter(data, attribute, title, id)
                attribute = attribute.deepClone()
                attribute?.code = AttributeType.VALUE_TYPE
            }
            String message = messageProvider.getConstant(NO_DATA_FOR_CONDITION_ERROR, currentUserLocale)
            def possibleFilter = mappingFilter(data) { condition ->
                String conditionType = condition.type
                switch (Condition.getByTitle(conditionType.toLowerCase()))
                {
                    case Condition.CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        return new FilterParameter(
                            value: uuid, title: title,
                            id: id, type: Comparison.CONTAINS, attribute: attribute
                        )
                    case Condition.NOT_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        String uuid = condition.data.uuid
                        return new FilterParameter(
                            value: uuid, title: title,
                            id: id, type: Comparison.NOT_CONTAINS, attribute: attribute
                        )
                    case Condition.CONTAINS_ANY:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def uuids = condition.data*.uuid
                        return new FilterParameter(
                            value: uuids, title: title,
                            id: id, type: Comparison.CONTAINS, attribute: attribute
                        )
                    case Condition.TITLE_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        return new FilterParameter(
                            value: condition.data, title: title,
                            id: id, type: Comparison.METACLASS_TITLE_CONTAINS, attribute: attribute
                        )
                    case Condition.TITLE_NOT_CONTAINS:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        return new FilterParameter(
                            value: condition.data,
                            title: title,
                            id: id,
                            type: Comparison.METACLASS_TITLE_NOT_CONTAINS,
                            attribute: attribute
                        )
                    case Condition.EQUAL_ATTR_CURRENT_OBJECT:
                        if (!condition.data)
                        {
                            return utils.throwReadableException("$message#${NO_DATA_FOR_CONDITION_ERROR}")
                        }
                        def code = condition.data.code
                        def value = utils.get(subjectUUID)[code]
                        return new FilterParameter(
                            value: value, title: title,
                            id: id, type: Comparison.EQUAL, attribute: attribute
                        )
                    default:
                        message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: conditionType)
                        utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                }
            }
            return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
        }

        /**
         * Метод обхода настроек пользовательской группировки
         * @param data - настройки пользовательской группировки
         * @param mapFilter - функция преобразования данных в удобный формат
         * @return настройки группировки в удобном формате
         */
        private List<List<FilterParameter>> mappingFilter(List<List> data, Closure<FilterParameter> mapFilter)
        {
            return data.collect { andCondition -> andCondition.collect { orCondition -> mapFilter(orCondition) }}
        }

        /**
         * Метод получения данных для диаграмм
         * @param request - запрос на получение данных
         * @param user - текущий пользователь системы
         * @param diagramType - тип диаграммы
         * @param templateUUID - ключ шаблона для динамических атрибутов
         * @param aggregationCnt - количество агрегаций
         * @param requestContent - тело запроса
         * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
         * @param paginationSettings - настройки для пагинации в таблице
         * @return сырые данные из Бд по запросу
         */
        def getDiagramData(DiagramRequest request, IUUIDIdentifiable user,
                           DiagramType diagramType = DiagramType.DONUT,
                           String templateUUID = '',
                           Integer aggregationCnt = 1, def requestContent = null,
                           IgnoreLimits ignoreLimits = new IgnoreLimits(),
                           PaginationSettings paginationSettings = null)
        {
            assert request: "Empty request!"
            Boolean isSourceForEachRow = requestContent?.data?.sourceRowName?.findAll() && diagramType == DiagramType.TABLE
            return request.requisite.collect { requisite ->
                Boolean onlyFilled = !requisite.showNulls
                Boolean notBlank = !requisite.showBlank
                Integer top = requisite.top
                return requisite.nodes.collectMany { node ->
                    String nodeType = node.type
                    switch (nodeType.toLowerCase())
                    {
                        case 'default':
                            DefaultRequisiteNode requisiteNode = node as DefaultRequisiteNode
                            RequestData requestData = request.data[requisiteNode.dataKey] as RequestData
                            String aggregationSortingType = requestData.aggregations.find()?.sortingType

                            def listIdsOfNormalAggregations = [0]

                            if (diagramType == DiagramType.TABLE)
                            {
                                listIdsOfNormalAggregations =
                                    request?.data?.findResult { key, value ->
                                        value?.aggregations?.withIndex()?.findResults { val, i ->
                                            if (val.type != Aggregation.NOT_APPLICABLE)
                                            {
                                                return i
                                            }
                                        }
                                    }
                            }
                            else if (diagramType == DiagramType.PIVOT_TABLE)
                            {
                                listIdsOfNormalAggregations = [0..(requestData.aggregations.size() - 1)].first()
                            }
                            Map<String, Object> filterMap = getInfoAboutFilters(requisiteNode.dataKey, request)
                            String parameterSortingType = diagramType == DiagramType.TABLE ? null : filterMap.parameterSortingType
                            def parameterFilters = filterMap.parameterFilters
                            def breakdownFilters = filterMap.breakdownFilters
                            Integer filterListSize = filterMap.filterListSize
                            List filtering = filterListSize > 0
                                ? prepareFilters(filterListSize, diagramType, requestContent, parameterFilters, breakdownFilters)
                                : []
                            List<String> notAggregatedAttributes = []
                            Boolean customInBreakTable = false
                            if (requestContent)
                            {
                                  List attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                                notAggregatedAttributes = notAggregationAttributeNames(attributes)
                                String attrInCustoms = getInnerCustomGroupNames(requestContent).find()?.attributeName
                                String possibleBreakdownAttribute = attributes.last().name
                                customInBreakTable = possibleBreakdownAttribute == attrInCustoms
                            }
                            if (!filtering)
                            {
                                return getNoFilterListDiagramData(
                                    node,
                                    request,
                                    aggregationCnt,
                                    top,
                                    notBlank,
                                    onlyFilled,
                                    diagramType,
                                    requestContent,
                                    ignoreLimits,
                                    user,
                                    paginationSettings
                                )
                            }
                            RequestData newRequestData = requestData.clone()
                            Closure formatAggregation = this.&formatAggregationSet.rcurry(
                                listIdsOfNormalAggregations,
                                request,
                                diagramType,
                                onlyFilled,
                                getPercentCntAggregationIndexes(request)
                            )
                            Closure formatGroup = this.&formatGroupSet.rcurry(newRequestData, listIdsOfNormalAggregations, diagramType)
                            def res = filtering?.withIndex()?.collectMany { filters, i ->
                                newRequestData.filters = filters
                                List res = dashboardQueryWrapperUtils.getData(
                                    newRequestData,
                                    top,
                                    currentUserLocale,
                                    user,
                                    notBlank,
                                    diagramType,
                                    ignoreLimits?.parameter ?: false,
                                    templateUUID,
                                    paginationSettings
                                )
                                                                     .with(formatGroup)
                                                                     .with(formatAggregation)

                                if(!res && !onlyFilled && !customInBreakTable)
                                {
                                    def tempRes = ['']*(newRequestData.groups.size() + notAggregatedAttributes.size())
                                    listIdsOfNormalAggregations.each { id-> tempRes.add(id, 0) }
                                    res = [tempRes].with(formatGroup)
                                                   .with(formatAggregation)
                                }
                                def filtersTitle = filters.unique { it.id }.findResults {
                                    if(it.title)
                                    {
                                        def titleValue = (it.title as Set).find()
                                        if(diagramType in DiagramType.SortableTypes && titleValue)
                                        {
                                            return "${titleValue}#${(it.id as Set).find()}"
                                        }
                                        return titleValue
                                    }
                                }
                                filtersTitle = filtersTitle.unique()
                                def partial = (customInBreakTable || onlyFilled) && !res ? [:] :[(filtersTitle): res]

                                partial = formatResult(partial, aggregationCnt + notAggregatedAttributes.size())
                                Boolean hasStateOrTimer = newRequestData?.groups?.any { value -> Attribute.getAttributeType(value?.attribute) in [AttributeType.STATE_TYPE, AttributeType.TIMER_TYPE] } ||
                                                   newRequestData?.aggregations?.any { it?.type in Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) in [AttributeType.STATE_TYPE, AttributeType.TIMER_TYPE]  }
                                if (hasStateOrTimer)
                                {
                                    Boolean resWithPercentCnt
                                    Collection<Integer> percentCntAggregationIndexes
                                    if (isSourceForEachRow)
                                    {
                                        percentCntAggregationIndexes = getIndexesForTableWithNoParametersByAggregationType(request, Aggregation.PERCENT_CNT)
                                    }
                                    else
                                    {
                                        percentCntAggregationIndexes = getPercentCntAggregationIndexes(request)
                                    }

                                    resWithPercentCnt = i in percentCntAggregationIndexes
                                    partial = prepareRequestWithStates(partial, listIdsOfNormalAggregations, resWithPercentCnt)
                                }
                                filterListSize = checkTableForSize(filterListSize, requestContent, diagramType)
                                return prepareResultListListForTop(partial, filterListSize, top, parameterFilters, breakdownFilters, i)
                            }
                            def parameter = requestData.groups.find()
                            String parameterAttributeType = parameter?.attribute?.type
                            Boolean parameterWithDateOrDtInterval = parameterAttributeType in [*AttributeType.DATE_TYPES, AttributeType.DT_INTERVAL_TYPE]
                            Boolean parameterWithDate = parameterAttributeType in AttributeType.DATE_TYPES
                            if(top)
                            {
                                res = getTop(res, top, parameterFilters, breakdownFilters, false, parameterWithDate ? parameter : null, parameterSortingType, aggregationSortingType )
                            }
                            if (!parameterWithDateOrDtInterval &&
                                (aggregationSortingType || parameterSortingType) &&
                                diagramType in DiagramType.SortableTypes)
                            {
                                return sortResList(res, aggregationSortingType, parameterSortingType, parameterFilters, breakdownFilters, getPercentCntAggregationIndexes(request))
                            }
                            return res
                        case 'computation':
                            def requisiteNode = node as ComputationRequisiteNode
                            def calculator = new FormulaCalculator(requisiteNode.formula)

                            Map<String, List> fullFilterList = [:]
                            Map<String, String> fullTemplateIdList = [:]
                            def parameterFilters  = []
                            def breakdownFilters = []
                            String parameterSortingType = ''
                            Integer filterListSize = 0

                            def dataSet = calculator.variableNames.collectEntries {
                                Map filterMap = getInfoAboutFilters(it, request)

                                parameterSortingType = diagramType == DiagramType.TABLE ? '' : filterMap.parameterSortingType
                                parameterFilters = filterMap.parameterFilters
                                breakdownFilters = filterMap.breakdownFilters
                                fullTemplateIdList.put(it, templateUUID)
                                filterListSize = filterMap.filterListSize

                                List filters = filterListSize > 0 ? prepareFilters(filterListSize, diagramType, requestContent, parameterFilters, breakdownFilters) : []
                                fullFilterList.put(it, filters)

                                return [(it): request.data[it]]
                            } as Map<String, RequestData>

                            if(filterListSize == 0)
                            {
                                parameterSortingType = diagramType == DiagramType.TABLE ?  null : dataSet.values().head().groups.find()?.sortingType
                                return getNoFilterListDiagramData(node, request, aggregationCnt, top, notBlank, onlyFilled, diagramType, requestContent, ignoreLimits, user, paginationSettings)
                            }

                            List<Integer> listIdsOfNormalAggregations = [0]
                            aggregationCnt = 1
                            List notAggregatedAttributes = []
                            def variables = dataSet.collect{ key, data ->
                                def filtering = fullFilterList.get(key)
                                return filtering.collect { filters ->
                                    RequestData newData = data.clone()
                                    newData.filters = filters
                                    Closure postProcess = this.&formatGroupSet.rcurry(newData as RequestData, listIdsOfNormalAggregations, diagramType)
                                    def res = dashboardQueryWrapperUtils.getData(newData as RequestData, top,currentUserLocale, user, notBlank, diagramType, ignoreLimits.parameter ?: false, templateUUID, paginationSettings)
                                    if(!res && !onlyFilled)
                                    {
                                        def tempRes = ['']*(newData.groups.size() + notAggregatedAttributes.size())
                                        listIdsOfNormalAggregations.each { id-> tempRes.add(id, 0) }
                                        res = [tempRes]
                                    }
                                    [(key): res.with(postProcess)]  as Map<String, List>
                                }
                            }.transpose().collect{ it.sum() }

                            int i = 0
                            def groups = dataSet.values().head().groups
                            def aggregations = dataSet.values().head().aggregations
                            String aggregationSortingType = aggregations.find()?.sortingType
                            Boolean hasStateOrTimer = groups?.any { value -> Attribute.getAttributeType(value?.attribute) in [AttributeType.STATE_TYPE,  AttributeType.TIMER_TYPE]} ||
                                               aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) in [AttributeType.STATE_TYPE,  AttributeType.TIMER_TYPE] }
                            def res = variables.withIndex().collectMany { totalVar, j ->
                                def res = groups?.size() || notAggregatedAttributes.size() ?
                                    findUniqueGroups([0], totalVar).collect { group ->
                                        def resultCalculation = calculator.execute { variable ->
                                            hasStateOrTimer
                                                ? (totalVar[variable as String].sum {
                                                def value = it[1..-1]
                                                group == value ? it[0] as Double : 0
                                            } ?: 0) as Double
                                                : (totalVar[variable as String].findResult {
                                                def value = it[1..-1]
                                                group == value ? it[0] : null
                                            } ?: 0) as Double
                                        }
                                        group.add(0, resultCalculation)
                                        return group
                                    } : [[calculator.execute { key ->
                                    totalVar[key as String].find().find() as Double ?: 0
                                }]]

                                def title = fullFilterList.find().value.title.grep()
                                def id = fullFilterList.find().value.id.grep()
                                res = formatAggregationSet(
                                    res,
                                    listIdsOfNormalAggregations,
                                    request,
                                    diagramType,
                                    onlyFilled,
                                    getPercentCntAggregationIndexes(request)
                                )

                                def filtersTitle = title.any {it[0] != ''}
                                    ? (title[i] as Set)?.withIndex().findResults { val, idx ->
                                    return val.findResults {
                                        return diagramType in DiagramType.SortableTypes && it
                                            ? "${it}#${id[i][idx].find()}"
                                            : it
                                    }
                                }
                                    : []
                                i++
                                Map total = [(filtersTitle): res]
                                res = onlyFilled && !res ? [] : formatResult(total, aggregationCnt)
                                filterListSize = checkTableForSize(filterListSize, requestContent, diagramType)
                                return prepareResultListListForTop(res, filterListSize, top, parameterFilters, breakdownFilters, j)
                            }
                            def parameter = dataSet.values().head().groups.find()
                            String parameterAttributeType = parameter?.attribute?.type
                            Boolean parameterWithDateOrDtInterval = parameterAttributeType in [*AttributeType.DATE_TYPES, AttributeType.DT_INTERVAL_TYPE]
                            Boolean parameterWithDate = parameterAttributeType in AttributeType.DATE_TYPES
                            if(top)
                            {
                                res = getTop(res, top, parameterFilters, breakdownFilters, false, parameterWithDate ? parameter : null,  parameterSortingType, aggregationSortingType)
                            }

                            if (!parameterWithDateOrDtInterval &&
                                (aggregationSortingType || parameterSortingType) && diagramType in DiagramType.SortableTypes)
                            {
                                return sortResList(res, aggregationSortingType, parameterSortingType, parameterFilters, breakdownFilters, getPercentCntAggregationIndexes(request))
                            }
                            return res
                    }
                }
            }
        }

        /**
         * Метод по подготовке фильтров в запросе
         * @param filterListSize - количество списков с фильтрами
         * @param diagramType - тип диаграммы
         * @param requestContent - тело запроса
         * @param parameterFilters - фильтры из параметра/ов
         * @param breakdownFilters - фильтры из разбивки
         * @return подготовленный список фильтров
         */
        List prepareFilters(Integer filterListSize, DiagramType diagramType, def requestContent, List parameterFilters = [], List breakdownFilters = [])
        {
            filterListSize = checkTableForSize(filterListSize, requestContent, diagramType)
            Integer countOfCustomsInFirstSource
            Integer countOfCustomsInFullRequest
            if (diagramType == DiagramType.TABLE)
            {
                countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(requestContent)
                countOfCustomsInFullRequest = countDataForManyCustomGroupsInParameters(requestContent, false)
            }

            if(filterListSize == 1)
            {
                return parameterFilters ?: breakdownFilters
            }
            else
            {
                if (diagramType == DiagramType.TABLE && (countOfCustomsInFirstSource > 1 || countOfCustomsInFullRequest > 1))
                {
                    return breakdownFilters
                        ? parameterFilters.collectMany { parameterFilter ->
                        breakdownFilters.collect {
                            [*parameterFilter, it]
                        }
                    }*.inject { first, second ->
                        first + second
                    } : parameterFilters*.inject { first, second -> first + second }//фильтры могут быть от разных параметров, поэтому можно взять их уже в готовом виде
                }
                else
                {
                    return parameterFilters.collectMany { parameterFilter ->
                        return breakdownFilters.collect {
                            [parameterFilter, it]
                        }
                    }*.inject { first, second ->
                        first + second
                    }
                }
            }
        }

        /**
         * Метод по подготовке датасета к получению из него top-a
         * @param res - текущий датасет
         * @param filterListSize - количество списков фильтров
         * @param top - топ
         * @param parameterFilters - список фильтров из параметра
         * @param breakdownFilters - список фильтров из разбивки
         * @param i - индекс текущего фильтра (для одного списка)
         * @return - готовый датасет для получения top-а
         */
        List prepareResultListListForTop(List res, Integer filterListSize,  Integer top, List parameterFilters = [], List breakdownFilters = [], Integer i = 0)
        {
            if (top && res.size() > top)
            {
                return res[0..top - 1]
            }
            if ((parameterFilters && i < top) || !top)
            {
                return res
            }
            else if (breakdownFilters && top)
            {
                return res.size() > top ? res[0..top - 1] : res
            }
            else
            {
                return []
            }
        }

        /**
         * Метод получения информации о фильтрах в запросе
         * @param dataKey - ключ к данным в запросе
         * @param request - весь запрос
         * @return
         */
        Map<String, Object> getInfoAboutFilters(String dataKey, DiagramRequest request)
        {
            def filterList = request.data[dataKey].source.filterList.grep()
            Integer filterListSize = filterList.filters.grep().size()
            def parameterInfo = filterList.find { it?.place == 'parameter' }

            List parameterFilters = parameterInfo?.filters
            String parameterSortingType = parameterInfo?.sortingType ?: request.data[dataKey].groups?.find()?.sortingType //если фильтры в разбивке, а упорядочиваем по параметру
            List breakdownFilters = filterList.find { it?.place == 'breakdown' }?.filters

            return [parameterSortingType: parameterSortingType,
                    parameterFilters : parameterFilters,
                    breakdownFilters: breakdownFilters,
                    filterListSize: filterListSize ]
        }

        /**
         * Метод проверки диаграммы на настоящее количество реальных фильтров в ней
         * @param filterListSize - текущее количество списков с фильтрами
         * @param requestContent - тело запроса
         * @param diagramType - тип диаграммы
         * @return настоящее количество фильтров в диаграмме
         */
        Integer checkTableForSize(Integer filterListSize, def requestContent, DiagramType diagramType)
        {
            if (diagramType == DiagramType.TABLE)
            {
                Integer countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(requestContent)
                Integer countOfCustomsInFullRequest = countDataForManyCustomGroupsInParameters(requestContent, false)
                if  (countOfCustomsInFirstSource > 1 || countOfCustomsInFullRequest > 1 )
                {
                    return 2
                }
            }
            return filterListSize
        }

        /**
         * Метод по упорядочиванию итоговых датасетов для комбо
         * @param list - список для сортировки
         * @param sortingDataIndex -  индекс датасета, который будет в основе комбо-диаграммы
         * @return упорядоченный список итоговых датасетов
         */
        List sortListsForCombo(List list, Integer sortingDataIndex)
        {
            if(sortingDataIndex > 0)
            {
                //убрали его с текущего места
                def toSort = list.remove(sortingDataIndex)
                //поставили первым, тк по нему будут выстроены все остальные
                list.add(0, toSort)
            }
            return list
        }

        /**
         * Метод по получению индекса датасета, который будет в основе комбо-диаграммы
         * @param requestContent - тело запроса
         * @return индекс датасета, который будет в основе комбо-диаграммы
         */
        Integer getSortingDataIndex(def requestContent)
        {
            def dataKeyForSorting = requestContent.sorting?.dataKey
            return requestContent.data.findIndexOf {it.dataKey == dataKeyForSorting }
        }

        /**
         * Метод проверки списка группировок на соответствие единому типу атрибута
         * @param listRequest - список запросов на построение диаграмм
         * @return true\false "соответствует"\"не соответствует"
         */
        private boolean checkGroupTypes(Collection<RequestData> listRequest)
        {
            def standard = listRequest.head().groups?.collect {
                it.type
            }
            def  noGroupsAnywhere = !(standard.any() && listRequest.tail()*.groups?.any())
            return noGroupsAnywhere ?: listRequest.tail().every { el ->
                def groups = el.groups?.collect {
                    it.type
                }
                standard?.size() == groups?.size() && standard?.containsAll(groups)
            }
        }

        /**
         * Метод получения уникальных группировок
         * @param variables - результат выборки
         * @return список группировок
         */
        private Collection<Collection<String>> findUniqueGroups (List ids, def variables)
        {
            return ids.collectMany { id ->
                variables.values().collect { el ->
                    if(el)
                    {
                        def value = id > 0
                            ? el.transpose()[0..id-1] + el.transpose()[(id + 1)..el.transpose().size()-1]
                            : el.transpose().tail()
                        return value.transpose()
                    }
                    else
                    {
                        return []
                    }
                }.inject([]) { first, second ->
                    first + second
                }.unique() as Collection<Collection<String>>
            }
        }

        /**
         * Метод округления числовых результатов
         * @param listOfLists - список данных
         * @param listIdsOfNormalAggregations - список индексов агрегаций в датасете
         * @param request - запрос
         * @param diagramType  - тип диаграммы
         * @param exceptNulls - убирать 0
         * @param percentCntAggregationIndexes - индексы агрегации типа PERCENT_CNT
         * @return список округлённых числовых значений
         */
        List formatAggregationSet(List listOfLists,
                                  List listIdsOfNormalAggregations,
                                  DiagramRequest request,
                                  DiagramType diagramType,
                                  Boolean exceptNulls = false,
                                  Collection<Integer> percentCntAggregationIndexes = []
                                 )
        {
            Boolean diagramTypeStacked = (diagramType == DiagramType.BAR_STACKED) || (diagramType == DiagramType.COLUMN_STACKED)
            Boolean isTypeMetaClass = request?.data?.any { key, value -> value.aggregations.any { it.type == Aggregation.PERCENT }}
            if (listIdsOfNormalAggregations.size() < 1)
            {
                return listOfLists
            }
            return listOfLists.findResults { List list ->
                if (exceptNulls && list[listIdsOfNormalAggregations*.toLong()].every { !it })
                {
                    return null
                }

                if (listIdsOfNormalAggregations.size() > 0)
                {
                    listIdsOfNormalAggregations.each { index ->
                        List<String> countAndPercentValuesForTable
                        if (index in percentCntAggregationIndexes && list[index] in String)
                        {
                            countAndPercentValuesForTable = list[index].split(' ')
                            list[index] = countAndPercentValuesForTable[1]
                        }
                        if (!(diagramTypeStacked && isTypeMetaClass))
                        {
                            if (list[index] in String && list[index].contains(','))
                            {
                                list[index] = list[index].replaceAll(',', '.')
                            }
                            list[index] = list[index] && !(
                                list[index].toDouble().isNaN() || list[index].toDouble().isInfinite())
                                ? DECIMAL_FORMAT.format(list[index] as Double)
                                : DECIMAL_FORMAT.format(0)
                            if (index in percentCntAggregationIndexes && countAndPercentValuesForTable)
                            {
                                list[index] = countAndPercentValuesForTable[0] + ' ' + list[index]
                            }
                        }
                        else
                        {
                            list[index] = (list[index] as Double)
                        }
                    }
                    return list
                }
            }
        }

        /**
         * Метод получения индексов агрегации типа PERCENT_CNT
         * @param request - запрос
         * @return индексы агрегации типа PERCENT_CNT
         */
        Collection<Integer> getPercentCntAggregationIndexes(DiagramRequest request)
        {
            Collection<Integer> percentCntAggregationIndexes = request?.data?.collect { key, value ->
                value?.aggregations?.withIndex()?.collect { val, index ->
                    if (val.type == Aggregation.PERCENT_CNT)
                    {
                        return index
                    }
                    return null
                }
            }.flatten()

            return percentCntAggregationIndexes
        }

        /**
         * Метод получения индексов агрегаций определенного типа для таблицы без параметра
         * @param request - запрос
         * @param aggregationFormat - тип аггрегации
         * @return - индексы агрегаций
         */
        Collection<Integer> getIndexesForTableWithNoParametersByAggregationType(DiagramRequest request, Aggregation aggregationFormat)
        {
            Collection<Integer> percentCntAggregationIndexes = []
            request?.data?.eachWithIndex{ entry, index ->
                entry.value?.aggregations?.each {
                    if (it.type == aggregationFormat)
                    {
                        return percentCntAggregationIndexes << index
                    }
                }
            }
            return percentCntAggregationIndexes
        }

        /**
         * Метод приведения значений группировок к читаемому для человека виду
         * @param tempList - результат выборки
         * @param data - данные запроса
         * @param listIdsOfNormalAggregations - список индексов нормальных агрегаций
         * @param diagramType - тип диаграммы
         * @return результат выборки с изменёнными значениями группировки
         */
        List formatGroupSet(List tempList, RequestData data, List listIdsOfNormalAggregations, DiagramType diagramType)
        {
            List list = []
            list.addAll(tempList)

            def countGroup = data.groups.grep().size()
            def countNA = data.aggregations?.count { it?.type == Aggregation.NOT_APPLICABLE }
            if (countGroup == 0 && countNA == 0)
            {
                return list
            }
            else
            {
                List notAggregated = data.aggregations.findAll {it.type == Aggregation.NOT_APPLICABLE }  //ищем агрегации n/a
                List requestGroups = updateNotAggregatedToGroups(notAggregated) + data.groups
                Source source = data.source
                return list.collect { el ->
                    def groups = []
                    groups.addAll(el) //резервируем значения для групп
                    def elAggregations = el[listIdsOfNormalAggregations] //резервируем значения для агрегаций
                    elAggregations.each { groups.remove(groups.indexOf(it)) } //убираем в группах агрегации

                    //обрабатываем группы
                    def totalGroupValues = groups.withIndex().collect { group, i ->
                        return formatGroup(requestGroups[i] as GroupParameter,
                                           requestGroups[i]?.attribute?.attrChains()?.last()?.metaClassFqn,
                                           source, group, diagramType,
                                           requestGroups[i]?.title == 'n/a',
                                           requestGroups[i]?.title == 'breakdown')
                    }
                    //возвращаем агрегации в нужные места
                    elAggregations.eachWithIndex() {aggr, i -> totalGroupValues.add(listIdsOfNormalAggregations[i], aggr) }
                    //возвращаем итог
                    return totalGroupValues
                }
            }
        }

        /**
         * Метод по преобразованию агрегаций N/A  к группировкам
         * @param notAggregated - список агрегаций N/A
         * @return преобразованные агрегации N/A  к группировкам
         */
        List updateNotAggregatedToGroups(List notAggregated)
        {
            return notAggregated.collect {
                def groupType = GroupType.OVERLAP
                if(Attribute.getAttributeType(it.attribute) == AttributeType.DT_INTERVAL_TYPE)
                {
                    groupType = GroupType.HOUR_INTERVAL
                }
                new GroupParameter( type: groupType, title: 'n/a', attribute: it?.attribute)
            }
        }

        /**
         * Метод преобразования значения группировки в зависимости от типа
         * @param parameter - тип группировки
         * @param fqnClass - класс атрибута группировки
         * @param value - значение группировки
         * @param fromNA - флаг на обработку атрибута из агрегации N/a
         * @param fromBreakdown - флаг на обработку атрибута из разбивки
         * @return человеко читаемое значение группировки
         */
        private String formatGroup(GroupParameter parameter, String fqnClass, Source source, def value, DiagramType diagramType, Boolean fromNA = false, Boolean fromBreakdown = false)
        {
            GroupType type = parameter.type

            switch (type)
            {
                case GroupType.OVERLAP:
                    def uuid = null
                    if (diagramType == DiagramType.TABLE|| Attribute.getAttributeType(parameter.attribute) == AttributeType.META_CLASS_TYPE)
                    {
                        if (value && !(parameter?.attribute?.type in AttributeType.DATE_TYPES ))
                        {
                            (value, uuid) = ObjectMarshaller.unmarshal(value.toString())
                        }
                    }
                    switch (Attribute.getAttributeType(parameter.attribute))
                    {
                        case AttributeType.DT_INTERVAL_TYPE:
                            if (parameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE))
                            {
                                return value
                            }
                            if(value == null)
                            {
                                return getNullValue(diagramType, fromBreakdown)
                            }
                            return TimeUnit.MILLISECONDS.toHours(value as long)
                        case AttributeType.STATE_TYPE:
                            fqnClass -= '__Evt' //убираем Evt, если источник из ЖЦ
                            def (stateValue, stateCase) = StateMarshaller.unmarshal(value, StateMarshaller.delimiter)
                            String totalFqn = (fqnClass.contains('$') || !stateCase) ? "${fqnClass}" : "${fqnClass}\$${stateCase}"
                            String userEq = stateValue ? metainfo.getStateTitle(totalFqn, stateValue) : null
                            return userEq ? StateMarshaller.marshal(userEq, stateValue) : ""
                        case AttributeType.META_CLASS_TYPE:
                            def userEq = metainfo.getMetaClass(value).title
                            return MetaClassMarshaller.marshal(userEq, value)
                        case AttributeType.BOOL_TYPE:
                            String viewMode = metainfo.getMetaClass(fqnClass)
                                                      .getAttribute(parameter.attribute.code)
                                                      .viewPresentation
                            if (viewMode == "Presentation 'yesNo'") {
                                return utils.formatters.yesNoFormatter(value.toBoolean())
                            } else {
                                return utils.formatters.oneZeroFormatter(value.toBoolean())
                            }
                        case AttributeType.TIMER_TYPES:
                            if(value == null)
                            {
                                return getNullValue(diagramType, fromBreakdown)
                            }
                            if(parameter.attribute.attrChains()?.last()?.timerValue == TimerValue.VALUE)
                            {
                                value = new Long(value) * 1000
                                return getTimerValue(value)
                            }
                            return (value as TimerStatus).getRussianName()
                        case AttributeType.DATE_TYPES:
                            if(!value)
                            {
                                return getNullValue(diagramType, fromBreakdown)
                            }
                            if(value instanceof Date)
                            {
                                return value.format('dd.MM.yyyy HH:mm')
                            }
                            //данные при таком подходе приходят строкой, поэтому метод format не поможет
                            String[] dateParts = value.split()
                            dateParts[0] = dateParts[0].tokenize('./')*.padLeft(2, '0').join('.')
                            dateParts[1] = dateParts[1].tokenize(':/')*.padLeft(2, '0').join(':')
                            value = "${dateParts[0]}, ${dateParts[1]}"
                            if (diagramType == DiagramType.TABLE)
                            {
                                if(value && uuid)
                                {
                                    value = ObjectMarshaller.marshal(value, uuid)
                                }
                            }
                            return value
                        case [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE]:
                            if(!value)
                            {
                                return getNullValue(diagramType, fromBreakdown)
                            }
                            if(fromNA)
                            {
                                if(value && uuid)
                                {
                                    return ObjectMarshaller.marshal(value, uuid)
                                }
                                return value
                            }
                            else
                            {
                                def (tempValue, tempUuid) = diagramType == DiagramType.TABLE ? [value, uuid]: LinksAttributeMarshaller.unmarshal(value)
                                def code = utils.get(tempUuid).code
                                return LinksAttributeMarshaller.marshalCatalog(tempValue, code, tempUuid)
                            }
                        default:
                            //прийти в качестве значения может, как UUID, так и просто id
                            if (parameter.attribute?.attrChains()?.last()?.code == 'UUID' && !fromNA)
                            {
                                value = value.toString().split('\\$', 2).last() ?: value
                            }
                            if (diagramType == DiagramType.TABLE)
                            {
                                if(value && uuid)
                                {
                                    value = ObjectMarshaller.marshal(value, uuid)
                                }
                            }
                        value = (value == null || value.equals('')) ? getNullValue(diagramType, fromBreakdown) : value
                            return value.toString().replaceAll("[^<a-zA-Z0-9А-Яа-я >]","")
                    }
                case GroupType.DAY:
                    if(!value)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    String format = parameter.format
                    switch (format) {
                        case 'dd':
                            return value + '-й'
                        case 'dd.mm.YY':
                            value = value.tokenize('./')*.padLeft(2, '0').join('.')
                            return value
                        case 'dd.mm.YY hh':
                            String[] dateParts = value.split()
                            dateParts[0] = dateParts[0].tokenize('./')*.padLeft(2, '0').join('.')
                            dateParts[1] = dateParts[1].padLeft(2, '0')
                            return "${dateParts[0]}, ${dateParts[1]}ч"
                        case 'dd.mm.YY hh:ii':
                            return value.format('dd.MM.yyyy HH:mm')
                        case 'WD':
                            String[] weekDayNames = ['понедельник', 'вторник', 'среда',
                                                     'четверг', 'пятница', 'суббота', 'воскресенье']
                            return weekDayNames[(value as int) - 1]
                        default:
                            def (day, month) = value.split('/', 2)
                            String monthName = GENITIVE_RUSSIAN_MONTH[(month as int) - 1]
                            return "$day $monthName"
                    }
                    break
                case GroupType.MONTH:
                    if(!value)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    String format = parameter.format
                    switch(format) {
                        case 'MM YY':
                            String[] date = value.split('/')
                            String monthNum = date[0]
                            value = NOMINATIVE_RUSSIAN_MONTH[(monthNum as int) - 1] + ' ' + date[1]
                            return value
                        default:
                            return NOMINATIVE_RUSSIAN_MONTH[(value as int) - 1]
                    }
                case GroupType.QUARTER:
                    if(!value)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    String format = parameter.format
                    switch(format) {
                        case 'QQ YY':
                            return value.toString()
                        default:
                            return "$value кв-л"
                    }
                case [GroupType.WEEK, GroupType.YEAR]:
                    if(!value)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    String format = parameter.format
                    switch (format) {
                        case 'ww':
                            return value.toString() + '-я'
                        default:
                            return value.toString()
                    }
                case GroupType.SEVEN_DAYS:
                    if(value == null)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    def russianLocale = new Locale("ru")
                    SimpleDateFormat specialDateFormatter = new SimpleDateFormat("dd.MM.yy", russianLocale)
                    def minDate

                    if(parameter.attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE))
                    {
                        def tempAttr = parameter.attribute.deepClone()
                        tempAttr.title = TotalValueMarshaller.unmarshal(tempAttr.code).last()
                        minDate = dashboardQueryWrapperUtils.getMinDateDynamic(tempAttr, source)
                    }else
                    {
                        parameter.attribute = dashboardQueryWrapperUtils.updateRefAttributeCode(parameter.attribute)
                        minDate = DashboardUtils.getMinDate(
                            parameter.attribute.attrChains().code.join('.'),
                            parameter.attribute.sourceCode,
                            source.descriptor
                        )
                    }
                    def countDays = (value as int) * 7
                    String startDate = Calendar.instance.with {
                        setTime(minDate)
                        add(DAY_OF_MONTH, countDays)
                        specialDateFormatter.format(getTime())
                    }
                    String endDate = Calendar.instance.with {
                        setTime(minDate)
                        add(DAY_OF_MONTH, countDays + 6)
                        specialDateFormatter.format(getTime())
                    }
                    return "$startDate - $endDate"
                case GroupType.MINUTES:
                    if(value == null)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    return value.toString().padLeft(2, '0') + ' мин'
                case GroupType.HOURS:
                    if(value == null)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    value = value.toString().tokenize(':/')*.padLeft(2, '0').join(':')
                    return value
                case GroupType.getTimerTypes():
                    if(!value)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    return (value as TimerStatus).getRussianName()
                case GroupType.SECOND_INTERVAL:
                case GroupType.MINUTE_INTERVAL:
                case GroupType.HOUR_INTERVAL:
                case GroupType.DAY_INTERVAL:
                case GroupType.WEEK_INTERVAL:
                    if(value == null)
                    {
                        return getNullValue(diagramType, fromBreakdown)
                    }
                    return getCorrectIntervalType(value, type)
                default:
                    String message = messageProvider.getMessage(NOT_SUPPORTED_GROUP_TYPE_ERROR, currentUserLocale, type: type)
                    utils.throwReadableException("$message#${NOT_SUPPORTED_GROUP_TYPE_ERROR}")
            }
        }

        /**
         * Метод получения значения счетчика для пользователя в формате чч:мм
         * @param value - значение в миллисекундах из БД
         * @return
         */
        private String getTimerValue(Long value)
        {
            def hours = TimeUnit.MILLISECONDS.toHours(value)
            def minutes = TimeUnit.MILLISECONDS.toMinutes(value) - TimeUnit.MINUTES.toMinutes(TimeUnit.MILLISECONDS.toHours(value))
            def seconds = TimeUnit.MILLISECONDS.toSeconds(value) - TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(value))
            def temp = "${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}"
        }

        /**
         * Метод по получению корректного значения временного интервала для предложенного типа
         * @param millis - значение из БД в миллисекундах
         * @param type - тип, в который нужно привести
         * @return значение временного интервала для предложенного типа
         */
        private String getCorrectIntervalType(def millis, GroupType type)
        {
            def tempValue = DashboardUtils.convertValueToInterval(millis as Long, type)
            Boolean tempValueLessOne = tempValue < 1
            //число может быть меньше или больше единицы и дробным
            if(tempValueLessOne || !(tempValue instanceof Integer))
            {
                if(tempValueLessOne)
                {
                    tempValue = getRealValueFromDB(millis as Long, type)
                }

                def fullParts = Double.toString(tempValue).tokenize('.')

                String integerPart

                if(tempValueLessOne)
                {
                    //если значение меньше нуля, то в целой части будет 0
                    integerPart = '#'
                }
                else
                {
                    //иначе получаем количество символов в целой части
                    integerPart = '#' * fullParts?.find()?.size()
                }

                //получаем долю
                def fractionalPart = fullParts.last() //берем часть после точки
                def roundIdx = fractionalPart.contains('E') //значение может быть в экспоненциальной записи
                    ? fractionalPart.dropWhile { it != '-' }.toCharArray()[-1].toString() as Long //тогда берем число после нее - ровно столько нулей стоит до числа
                    : fractionalPart.takeWhile{it == '0'}.size() + 1 //иначе идём по числу до тех пор, пока не пройдут все нули и берем + 1 значение
                roundIdx += 1 //округляем наконец до двух чисел после всех нулей в дробной части

                String formatStr = '#' * roundIdx

                def dtIntervalDecimalFormat = new DecimalFormatSymbols().with {
                    setDecimalSeparator('.' as char)
                    new DecimalFormat("${integerPart}.${formatStr}", it)
                }
                tempValue = dtIntervalDecimalFormat.format(tempValue)
            }
            return DtIntervalMarshaller.marshal(tempValue.toString(), type, millis.toString())
        }

        /**
         * Метод получения реального значение интервала для типа из хранилища
         * @param value - значение в миллисекундах
         * @param type - тип, в который нужно перевести
         * @return дробное значение интервала
         */
        Double getRealValueFromDB(def value, def type)
        {
            switch (type)
            {
                case GroupType.SECOND_INTERVAL:
                    return value/1000
                case GroupType.MINUTE_INTERVAL:
                    return value/60000
                case GroupType.HOUR_INTERVAL:
                    return value/3600000
                case GroupType.DAY_INTERVAL:
                    return value/86400000
                case GroupType.WEEK_INTERVAL:
                    return value/604800000
            }
        }

        /**
         * Метод получения пустого значения
         * @param diagramType - тип диаграммы
         * @param fromBreakdown - флаг на получение значения для разбивки
         * @return пустое значение в зависимости от типа диаграммы
         */
        private String getNullValue(DiagramType diagramType, Boolean fromBreakdown)
        {
            //в таблице важно фронту отправлять пустую строку
            if(diagramType == DiagramType.TABLE && !fromBreakdown)
            {
                return ''
            }
            else if((diagramType in DiagramType.NullableTypes) || fromBreakdown)
            {
                return blankData
            }
        }


        /**
         * Метод по подготовке данных из Бд после запроса, при наличии дин атрибутов
         * @param res - результат запроса данных из БД
         * @param templateUUID - uuid шаблона атрибута
         * @param requestData - данные, по которым строился запрос в БД
         * @param diagramType - тип диаграммы, для которой готовим данные
         * @return итоговый датасет
         */
        private List<List> formatSetWithDynamicValues(List<List> res, String templateUUID, RequestData requestData, DiagramType diagramType)
        {
            if(templateUUID)
            {
                GroupParameter dynInGroups = requestData.groups?.find {
                    it?.attribute?.property == AttributeType.TOTAL_VALUE_TYPE
                }
                AggregationParameter dynInAggregations = requestData.aggregations?.find {
                    it?.attribute?.property == AttributeType.TOTAL_VALUE_TYPE
                }

                Integer aggregationsCount = requestData?.aggregations?.size()

                if(dynInGroups)
                {
                    Integer realDynAttributeIndex = requestData.groups.findIndexOf { it == dynInGroups } + aggregationsCount
                    return res.collect { row ->
                        def dynValue = row[0]
                        row.remove(0)
                        row.add(realDynAttributeIndex, dynValue)
                        return row
                    }
                }

                if(dynInAggregations && diagramType == DiagramType.TABLE)
                {
                    Integer realDynAttributeIndex = requestData.aggregations.findIndexOf { it == dynInAggregations }
                    return res.collect { row ->
                        def dynValue = row[0]
                        row.remove(0)
                        row.add(realDynAttributeIndex, dynValue)
                        return row
                    }
                }
                return res
            }
            return res
        }

        /**
         * Метод приведения результата выборки к единой структуре
         * @param data - результат выполнения запроса на получение данных диаграммы
         * @return результат запроса данных диаграммы
         */
        private def formatResult(Map data, Integer aggregationCnt = 1)
        {
            return data ? data.collect { key, list ->
                key ? list?.collect {
                    if (aggregationCnt > 1)
                    {
                        return it.size() > aggregationCnt
                            ? [it[0..aggregationCnt-1] ?: DECIMAL_FORMAT.format(0), key, it[aggregationCnt..-1]].flatten()
                            : [it[0..aggregationCnt-1] ?: DECIMAL_FORMAT.format(0), key].flatten()
                    }
                    else
                    {
                        //формат данных нестабилен, потому оставлен flatten
                        return [it.head() ?: DECIMAL_FORMAT.format(0), key, it.tail()].flatten()
                    }
                } ?: [[DECIMAL_FORMAT.format(0), key].flatten()] : list
            }.inject { first, second -> first + second
            } : []
        }

        /**
         * Метод получения всех агрегаций после суммирования по паре название(код)
         * @param resValue - итоговое значение для обработки
         * @param aggregationCnt - число агрегаций
         * @return итоговй список агрегаций
         */
        List getTotalAggregation(List resValue, int aggregationCnt)
        {
            def aggregations = resValue[0]
            def value = aggregations[0]
            def manyAggregationsByPare = aggregations.size() - 1 > 1 ? 1..-1 : 1
            if (aggregations.size() > 1)
            {
                if(manyAggregationsByPare instanceof Collection)
                {
                    return value.withIndex().collect { num, i ->
                        num = num as Double
                        aggregations[manyAggregationsByPare].each {
                            num += (it[i] as Double)
                        }
                        return DECIMAL_FORMAT.format(num)
                    }
                }
                else {
                    return value.withIndex().collect { num, i ->
                        num = num as Double
                        num += aggregations[manyAggregationsByPare][i] as Double
                        return DECIMAL_FORMAT.format(num)
                    }
                }
            }
            else
            {
                return value
            }
        }

        /**
         * Метод подготовки данных, среди которых есть значения статуса
         * @param res - сет данных
         * @param aggregationCnt - количество агрегаций в запросе
         * @param resWithPercentCnt - флаг, является ли текущий результат с типом агрегации PERCENT_CNT
         * @return обновленный сет данных
         */
        private List prepareRequestWithStates(List res, List listIdsOfNormalAggregations, Boolean resWithPercentCnt = false)
        {
            def list = res
            Set stateValues = []
            list.each { el ->
                def elAggregations = el[listIdsOfNormalAggregations]
                stateValues << el.minus(elAggregations)
            }
            Integer aggregationCnt = listIdsOfNormalAggregations.size()
            if (aggregationCnt > 0)
            {
                return stateValues.collect { value ->
                    def aggergationSet = []
                    def resValue = []
                    res.each {
                        def tempResValue = it
                        def elAggregations = tempResValue[listIdsOfNormalAggregations]
                        tempResValue = tempResValue.minus(elAggregations)
                        //сравниваем значение с тем, что есть в текущей паре "название статуса (код)"
                        if (tempResValue == value)
                        {
                            //если оно совпадает берём у всего значения агрегацию
                            aggergationSet << [it[listIdsOfNormalAggregations]]
                            resValue = [aggergationSet.collectMany{ it }, *tempResValue]
                        }
                    }
                    List totalAggregation = aggregationCnt > 1
                        ? getTotalAggregation(resValue, aggregationCnt)
                        : [!resWithPercentCnt ? DECIMAL_FORMAT.format(resValue[0].sum { it[0] as Double }) : resValue[0][0][0]]
                    resValue = resValue[1..-1]
                    totalAggregation.eachWithIndex() {aggr, i -> resValue.add(listIdsOfNormalAggregations[i], aggr) }
                    return resValue
                }
            }
            return stateValues.toList()
        }

        /**
         * Метод преобразования результата выборки к стандартной диаграмме
         * @param list - данные диаграмы
         * @param legendName - легенда
         * @param reverseGroups - флаг на изменение выбора групп в датасете
         * @param changeLabels - флаг на изменение порядка лейблов
         * @param reverseLabels - флаг на обратный порядок
         * @param format - формат дат
         * @param groupFormat - формат группировки для дат
         * @return StandardDiagram
         */
        private StandardDiagram mappingStandardDiagram(List list, String legendName,
                                                       Boolean reverseGroups, Boolean changeLabels,
                                                       Boolean reverseLabels, String format, String groupFormat,
                                                       Integer countTotals)
        {
            def resultDataSet = list.head() as List<List>
            def transposeDataSet = resultDataSet.transpose()
            switch (transposeDataSet.size())
            {
                case 0: // если результирующее множество пустое
                    return new StandardDiagram()
                case 2:
                    def (aggregationResult, groupResult) = transposeDataSet
                    def series = [new Series(name: legendName, data: aggregationResult as List)]
                    return new StandardDiagram(labels: groupResult, series: series, countTotals: countTotals)
                case 3:
                    def (groupResult, breakdownResult) = transposeDataSet.tail()
                    checkAggregationAndBreakdownListSize(groupResult as Set, breakdownResult as Set)
                    def labels = groupResult?.findAll() as Set
                    StandardDiagram standardDiagram
                    if (reverseGroups)
                    {
                        def series = (breakdownResult?.findAll() as Set)
                        series = getLabelsInCorrectOrder(series, groupFormat, format, reverseLabels)
                        def labelsForDiagram = breakdownResult?.findAll() as Set
                        def seriesForDiagram = labels.collect { labelsValue ->
                            def data = series.collect {
                                seriesValue ->
                                    (list.head() as List<List>).findResult { el->
                                        el.tail() == [labelsValue, seriesValue] ? el.head() : null
                                    } ?: 0
                            }
                            new Series(name: labelsValue, data: data)
                        }
                        labelsForDiagram = getTotalLabelsForDiagram(labelsForDiagram, groupFormat, format, changeLabels, reverseLabels)
                        standardDiagram = new StandardDiagram(
                            labels: labelsForDiagram,
                            series: seriesForDiagram
                        )
                    }
                    else
                    {
                        def series = (breakdownResult as Set).findResults { breakdownValue ->
                            if(breakdownValue)
                            {
                                def data = labels.collect { groupValue ->
                                    (list.head() as List<List>).findResult { el ->
                                        el.tail() == [groupValue, breakdownValue] ? el.head() : null
                                    } ?: 0
                                }
                                return new Series(name: breakdownValue, data: data)
                            }
                        }
                        labels = getTotalLabelsForDiagram(labels, groupFormat, format, changeLabels, reverseLabels)
                        standardDiagram = new StandardDiagram(labels: labels, series: series, countTotals: countTotals)
                    }
                    return standardDiagram
                default:
                    String message = messageProvider.getConstant(INVALID_RESULT_DATA_SET_ERROR, currentUserLocale)
                    utils.throwReadableException("$message#${INVALID_RESULT_DATA_SET_ERROR}")
            }
        }

        /**
         * Метод проверки пришедших данных на превышение по количеству
         * @param groupResult - данные по группам
         * @param breakdownResult - данные по разбивкам
         * @param dataSetNum - количество датасетов, участвующих в проверке
         */
        private void checkAggregationAndBreakdownListSize(Set groupResult, Set breakdownResult, Integer dataSetNum = 1)
        {
            def maxSize = maxDiagramDataSize * dataSetNum
            if ((groupResult.size() * breakdownResult.size()) >= maxSize)
            {
                String message = messageProvider.getConstant(OVERFLOW_DATA_ERROR, currentUserLocale)
                utils.throwReadableException("$message#${ OVERFLOW_DATA_ERROR }")
            }
        }

        /**
         * Метод получения итоговых лейблов для диаграммы
         * @param labels - текущие лейблы
         * @param groupFormat - формат группы
         * @param format - формат
         * @param changeLabels - флаг на необходимость изменения
         * @param reverseLabels - флаг на обратный порядок
         * @return список итоговых лейблов для диаграммы
         */
        private def getTotalLabelsForDiagram(def labels, String groupFormat, String format, Boolean changeLabels, Boolean reverseLabels)
        {
            if (groupFormat && changeLabels)
            {
                Boolean labelsHaveEmptyValue = blankData in labels
                if(labelsHaveEmptyValue)
                {
                    labels -= blankData
                }
                labels = getLabelsInCorrectOrder(labels, groupFormat, format, reverseLabels)
                if(labelsHaveEmptyValue)
                {
                    labels += blankData
                }
            }
            return labels
        }
        /**
         * Метод преобразования результата выборки к круговой диаграмме
         * @param list - данные диаграмы
         * @param isAggregationTypePercentCnt - флаг, является ли тип агрегации PERCENT_CNT
         * @return RoundDiagram
         */
        private RoundDiagram mappingRoundDiagram(List list, Integer countTotals, Boolean isAggregationTypePercentCnt)
        {
            def resultDataSet = list.head() as List<List>
            def transposeDataSet = resultDataSet.transpose()
            switch (transposeDataSet.size())
            {
                case 0: // если результирующее множество пустое
                    return new RoundDiagram()
                case 2:
                    def (aggregationResult, groupResult) = transposeDataSet
                    checkAggregationAndBreakdownListSize(aggregationResult as Set, groupResult as Set)
                    return new RoundDiagram(series: (aggregationResult as List).collect {
                        isAggregationTypePercentCnt ? it : it as Double
                    }, labels: groupResult, countTotals: countTotals)
                default:
                    String message = messageProvider.getConstant(INVALID_RESULT_DATA_SET_ERROR, currentUserLocale)
                    utils.throwReadableException("$message#${INVALID_RESULT_DATA_SET_ERROR}")
            }
        }

        /**
         * Метод преобразования результата выборки к сводке
         * @param list - данные диаграмы
         * @param diagramType - тип диаграммы
         * @param minValue - минимальное значение
         * @param maxValue - максимальное значение
         * @return SummaryDiagram
         */
        private SummaryDiagram mappingSummaryDiagram(List list, DiagramType diagramType, String minValue, String maxValue)
        {
            List<List> resultDataSet = list.head() as List<List>
            switch (resultDataSet.size())
            {
                case 0: // если результирующее множество пустое
                    return new SummaryDiagram()
                case 1:
                    def (value, title) = resultDataSet.head()
                    if(diagramType == DiagramType.SPEEDOMETER)
                    {
                        return new SpeedometerDiagram(title: title,
                                                      total: value,
                                                      min: minValue,
                                                      max: maxValue)
                    }
                    return new SummaryDiagram(title: title,
                                              total: value)
                default:
                    String message = messageProvider.getConstant(INVALID_RESULT_DATA_SET_ERROR, currentUserLocale)
                    utils.throwReadableException("$message#${INVALID_RESULT_DATA_SET_ERROR}")
            }
        }

        /**
         * Метод формирования таблицы
         * @param list - список данных из БД
         * @param totalColumn - флаг на подсчёт итоговой колонки
         * @param showRowNum - флаг для вывода номера строки
         * @param rowCount - количество строк в полном запросе
         * @param tableTop - настройки топа для таблицы
         * @param pagingSettings - настройки пагинации
         * @param sorting - настройки сортировки
         * @param reverseRowCount - обратный порядок
         * @param requestContent - тело запроса с фронта
         * @param request - тело обработанного запроса
         * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
         * @param countTotals - итог по количеству данных на виджете
         * @param tableTotals - итоговые данные по таблице
         * @param sourceRowNames - список заголовков для источников
         * @param diagramType - тип диаграммы
         * @param user - текущий пользователь системы
         * @return сформированная таблица
         */
        private TableDiagram mappingTableDiagram(List list,
                                                 boolean totalColumn,
                                                 boolean showRowNum,
                                                 Integer rowCount,
                                                 Integer tableTop,
                                                 PaginationSettings paginationSettings,
                                                 Sorting sorting,
                                                 Boolean reverseRowCount,
                                                 def requestContent,
                                                 DiagramRequest request,
                                                 IgnoreLimits ignoreLimits = new IgnoreLimits(),
                                                 Integer countTotals = 0,
                                                 List tableTotals = [],
                                                 List sourceRowNames = [],
                                                 DiagramType diagramType,
                                                 IUUIDIdentifiable user)
        {
            Boolean hasBreakdown = checkForBreakdown(requestContent)
            List<List> resultDataSet
            if (sourceRowNames)
            {
                if (hasBreakdown)
                {
                    List breakdownValues = []
                    list.each {
                        if (it && !breakdownValues)
                        {
                            breakdownValues = it.collect {
                                it.tail().first()
                            }
                        }
                    }

                    Integer i = 0
                    resultDataSet = list.collectMany {
                        if (it)
                        {
                            it.each { results ->
                                results << results[results.size() - 1]
                                results[results.size() - 2] = sourceRowNames[i]
                            }
                        }
                        else
                        {
                            breakdownValues.eachWithIndex { breakDownValue, index ->
                                it[index] = []
                                it[index][0] = 0
                                it[index][1] = sourceRowNames[i]
                                it[index][2] = breakDownValue
                            }
                        }
                        i++
                        return it
                    } as List<List>
                }
                else
                {
                    resultDataSet = list.collect {
                        it ? it.head() : [0]
                    } as List<List>
                }
            }
            else
            {
                resultDataSet = list.head() as List<List>
            }
            def transposeDataSet = resultDataSet.transpose()
            Integer aggregationCnt = getSpecificAggregationsList(requestContent).count { it.aggregation !=  Aggregation.NOT_APPLICABLE }
            List<Map> attributes = getAttributeNamesAndValuesFromRequest(requestContent)

            if (sourceRowNames)
            {
                attributes = attributes[(aggregationCnt - 1)..-1]
                // берем название самого первого показателя
                attributes.head().name = requestContent.data.head().indicators.head().attribute.title ?: ''
            }

            List<String> allAggregationAttributes = getSpecificAggregationsList(requestContent).name
            if (transposeDataSet.size() == 0)
            {
                return new TableDiagram()
            }
            else
            {
                Set<Map> innerCustomGroupNames = getInnerCustomGroupNames(requestContent)

                List<String> attributeNames = attributes.name
                List customValuesInBreakdown = []
                if (innerCustomGroupNames)
                {
                    //для работы необходим учет именно основных группировок, а для колонок идут внутреннние группировки группы
                    resultDataSet = prepareResultDataSet(resultDataSet, attributeNames, innerCustomGroupNames)
                    transposeDataSet = resultDataSet.transpose()
                    if(hasBreakdown)
                    {
                        customValuesInBreakdown = innerCustomGroupNames.findAll { it.attributeName == attributeNames.last() }.value
                    }
                }

                return mappingTable(
                    resultDataSet,
                    transposeDataSet,
                    attributes,
                    totalColumn,
                    showRowNum,
                    rowCount,
                    tableTop,
                    paginationSettings,
                    sorting,
                    reverseRowCount,
                    innerCustomGroupNames,
                    hasBreakdown,
                    customValuesInBreakdown,
                    aggregationCnt,
                    allAggregationAttributes,
                    ignoreLimits,
                    request, countTotals, tableTotals, sourceRowNames, diagramType, user
                )
            }
        }

        /**
         * Метод подготовки колонок таблицы
         * @param attributes - список атрибутов
         * @param hasBreakdown - флаг на наличие разбивки
         * @param breakdownValues - список значений разбивки
         * @return Collection<Column>
         */
        Collection<Column> collectColumns(List<Map> attributes, Boolean hasBreakdown = false, List breakdownValues = [])
        {
            if (hasBreakdown)
            {
                def breakdownAttributeValue = attributes.find { it.type == ColumnType.BREAKDOWN }
                Collection <Column> parameterColumns = attributes.findResults { attrValue ->
                                def attributeSecondLevel = attrValue.attribute?.ref
                                def accessorAndAtribut
                                if(attributeSecondLevel != null){
                                    accessorAndAtribut = attrValue.name +" (" + attributeSecondLevel?.title + ")"
                                }
                                else{
                                    accessorAndAtribut = attrValue.name
                                }
                                if (attrValue.type == ColumnType.PARAMETER)
                    {
                        return new Column(
                            footer:      "",
                            accessor:    accessorAndAtribut,
                            header:      accessorAndAtribut,
                            attribute:   attrValue.attribute,
                            type:        attrValue.type,
                            group:       attrValue.group,
                            tooltip: 	 attrValue?.tooltip
                        )
                    }
                    if (attrValue.type == ColumnType.INDICATOR)
                    {
                        return new AggregationColumn(
                            footer:      "",
                            accessor:    accessorAndAtribut,
                            header:      accessorAndAtribut,
                            attribute:   attrValue.attribute,
                            type:        attrValue.type,
                            aggregation: attrValue.aggregation,
                            tooltip: 	 attrValue?.tooltip,
                            columns: getBreakdownColumns(attrValue.aggregation, breakdownValues, breakdownAttributeValue, attrValue)
                        )
                    }
                }
                return parameterColumns
            }
            return attributes.collect { attrValue ->
                        def attributeSecondLevel = attrValue.attribute?.ref
                        def accessorAndAtribut
                        if(attributeSecondLevel != null){
                            accessorAndAtribut = attrValue.name +" (" + attributeSecondLevel?.title + ")"
                        }
                        else{
                            accessorAndAtribut = attrValue.name
                        }
                return new Column(
                    footer: "",
                    accessor: attrValue.key ?: attrValue.aggregation? accessorAndAtribut + "#" + "${attrValue.aggregation}" : attrValue.name,
                    header: accessorAndAtribut,
                    attribute: attrValue.attribute,
                    type: attrValue.type,
                    group: attrValue.group,
                    aggregation: attrValue.aggregation,
                    tooltip: attrValue?.tooltip
                )
            }
        }

        /**
         * Мтод получения колонок со значениями разбивки
         * @param breakdownValues - значения разбивки
         * @param breakdownAttributeValue - значение атрибута разбивки
         * @param parentAttributeName - название атрибута агрегации
         * @param accessor - поле для сопоставления значения и колонки
         * @return - колонки со значениями разбивки
         */
        List<AggregationBreakdownColumn> getBreakdownColumns(def aggregation, List breakdownValues, def breakdownAttributeValue, def aggregationAttributeValue, String accessor = null)
        {
            return breakdownValues.collect { value ->
                return new AggregationBreakdownColumn(
                    footer:      "",
                    accessor: breakdownAttributeValue.type == ColumnType.INDICATOR ?
                        "${ accessor ?: aggregationAttributeValue.name }\$${ value }" :
                        "${ accessor ?: aggregationAttributeValue.name }#${ aggregation }\$${ value }", //Возможно надо будет добавить проверку для условия, когда ColumnType.PARAMETER
                    header:      value,
                    attribute:   breakdownAttributeValue.attribute,
                    type:        breakdownAttributeValue.type,
                    group:       breakdownAttributeValue.group,
                    indicator:   new Indicator (aggregation: aggregationAttributeValue.aggregation,
                                                attribute: aggregationAttributeValue.attribute)
                )
            }
        }

        /**
         * Метод по проверке наличия разбивки в запросе
         * @param requestContent - текущий запрос
         * @return разбивка или пустой маp
         */
        Boolean checkForBreakdown(def requestContent)
        {
            def tempData = requestContent.data
            return tempData.any { v -> v?.breakdown?.any() }
        }

        /**
         * Метод подготовки датасета из Бд
         * @param resultDataSet - датасет из Бд
         * @param attributeNames - список названий
         * @param innerCustomGroupNames - список названий кастомных группировок
         * @return подготовленный датасет
         */
        List prepareResultDataSet(List resultDataSet, List<String> attributeNames, Set<Map> innerCustomGroupNames)
        {
            resultDataSet.each { row ->
                int newIndex = 0
                int currentIndex = 0
                row.each { value ->
                    if (value in innerCustomGroupNames.value)
                    {
                        currentIndex = row.indexOf(value)
                        def attributeName = innerCustomGroupNames.find{ it.value == value }.attributeName
                        newIndex = attributeNames.indexOf(attributeName)
                    }
                }
                def valueToPast = row[currentIndex]
                row.remove(valueToPast)
                row.add(newIndex, valueToPast)
            }
            return resultDataSet
        }

        /**
         * Метод получения названия атрибутов с агрегацией N/A
         * @param attributes - все атрибуты запроса
         * @return список названий атрибутов с агрегацией N/A
         */
        List<String> notAggregationAttributeNames(List attributes)
        {
            return attributes.findResults{
                it.aggregation == Aggregation.NOT_APPLICABLE ? it.name : null
            }
        }

        /**
         * Метод получения "детей" по "родителю"
         * @param parent - родитель
         * @param tree - дерево для поиска
         * @return список "детей"
         */
        List getChildrenByParent (ResRow parent, List tree)
        {
            List children = []
            tree.each { child ->
                def tempParent = new ResRow(key: parent.key, value: parent.value, parent:parent.parent, count: null)
                boolean correctParent = JsonOutput.toJson(child?.parent) == JsonOutput.toJson(tempParent)
                boolean unique = !children.any { it?.value == child?.value && it?.key == child?.key && it?.count == child?.count}

                if (correctParent && unique)
                {
                    children << child
                }
            }
            return children
        }

        /**
         * Метод получения названий атрибутов агрегации в исходном порядке
         * @param request - тело запроса
         * @return список названий атрибутов агрегации в исходном порядке
         */
        List<String> getAggregationAttributeNames(DiagramRequest request)
        {
            return request.data.collectMany { value ->
                value.aggregations.collect { aggregation ->
                    return aggregation?.attribute?.title
                }
            }.unique()
        }

        /**
         * Метод получения агрегаций из запроса
         * @param widgetSettings - настройки виджета
         * @param isCompute - флаг на получение всех агрегаций (null), обычных агрегаций (false), агрегаций с вычислениями (true)
         * @return  список агрегаций из запроса
         */
        List<Map<String, Object>> getSpecificAggregationsList(Widget widgetSettings, Boolean isCompute = null)
        {
            def tempWidgetSettings = mapper.convertValue(widgetSettings, widgetSettings.getClass())
            def fullIndicatorsList = getFullElementListInWidgetSettings(widgetSettings, 'indicators')
            SourceValue mainSourceValue = tempWidgetSettings?.data?.findResult { value ->
                if (!value.sourceForCompute)
                {
                    return value.source.value
                }
            }
            String mainSource = mainSourceValue.value

            return tempWidgetSettings?.data?.collectMany { value ->
                if (!value.sourceForCompute && value?.indicators)
                {
                    return value?.indicators?.findResults { indicator ->
                        Boolean conditionTrue = true
                        if (isCompute != null)
                        {
                            conditionTrue = !(isCompute ^ indicator?.attribute?.type == 'COMPUTED_ATTR')//xor
                        }

                        if (conditionTrue)
                        {
                            BaseAttribute attribute = indicator?.attribute
                            String currentSource = value.source.value.value
                            String currentSourceName = currentSource != mainSource ? value.source.value.label.trim() : mainSourceValue.label.trim()

                            if((fullIndicatorsList.count { it?.attribute?.title == attribute?.title } > 1) && !attribute?.title?.contains(currentSourceName))
                            {
                                if (currentSourceName)
                                {
                                    attribute?.title = "${attribute?.title} (${currentSourceName})"
                                }
                            }
                            return [name       : attribute?.title,
                                    attribute  : attribute,
                                    type       : ColumnType.INDICATOR,
                                    aggregation: indicator?.aggregation,
                                    tooltip    : indicator?.tooltip,
                                    key        : indicator?.key]
                        }
                        else
                        {
                            return null
                        }
                    }
                }
                else
                {
                    return []
                }
            }
        }

        /**
         * Метод преобразования всех датасетов различных данных к одному
         * @param list - исходных датасет
         * @param requestContent - тело запроса
         * @param showNulls - флаг на отображение нулей
         * @param hasBreakdown - флаг на наличие разбивки
         * @return итоговый датасет
         */
        List prepareDataSet(List list, def requestContent, Boolean showNulls, Boolean hasBreakdown)
        {
            List compAggregations = getSpecificAggregationsList(requestContent, true)
            List usualAggregations = getSpecificAggregationsList(requestContent, false)
            List aggregations = getSpecificAggregationsList(requestContent)

            List usual = list[0] //на первом месте в списке  результатов, нужно внедрить на нужные места данные из результатов вычислений

            if (!(aggregations.size() == compAggregations.size() && compAggregations.size() == 1)) // если результат не состоит из одного вычисления
            {
                List indexesOfComputeInRequest = aggregations.findIndexValues { it.name in compAggregations.name }

                List indexesOfNotAggregatedInRequest = usualAggregations.findIndexValues { it.aggregation == Aggregation.NOT_APPLICABLE }

                int usualAggregationSize = usualAggregations.size()
                //количество всех агрегаций равно количеству всех вычислений
                if (aggregations.size() == compAggregations.size())
                {
                    usualAggregationSize = 1 //чтобы корректно достучаться до элемента в массиве
                    indexesOfComputeInRequest = indexesOfComputeInRequest[1..-1] //на первом месте уже стоит результат первого вычисления
                }

                list[1..-1].eachWithIndex { listRow, i -> //идем по другим спискам, где уже есть вычисления, результат хранится на первом месте, i покажет место, где хранится индекс подстановки числа из вычислений
                    usual.each { row ->
                        def range = usualAggregationSize + i..-1
                        def tempRow = indexesOfNotAggregatedInRequest
                            ? row[*indexesOfNotAggregatedInRequest, range]
                            : row[range]
                        tempRow = tempRow.collect { it ?: 0}.sort()
                        def num = listRow.find {
                            it[1..-1].collect { it ?: 0}.sort() == tempRow
                        }.find() ?: 0 //при последующей итерации число агрегаций увеличивается на 1
                        row.add(indexesOfComputeInRequest[i] as int, num)
                    }
                }
            }

            if (!showNulls)
            {
                //убираем null-ы в итоговом датасете
                int aggregationSize = aggregations.size()
                //убираем null-ы в итоговом датасете
                if (hasBreakdown)
                {
                    def removed = usual.findAll { it[0..aggregationSize-1].every { !it || it == "0"}}
                    usual -= removed
                    usual = usual.collectMany { value ->
                        [*removed.findAll{it[aggregationSize..-2] == value[aggregationSize..-2]}, value]
                    }
                }
                else
                {
                    usual -= usual.findAll { it[0..aggregationSize-1].any { !it || it == "0"} || it[aggregationSize..-1].every { it == ""}}
                }
            }
            return [usual]
        }

        /**
         * Метод преобразования всех датасетов различных данных к одному для таблиц без параметра
         * @param list - исходных датасет
         * @param requestContent - тело запроса
         * @return итоговый датасет
         */
        List prepareDataSetForTableWithoutParameters(List list, Widget requestContent)
        {
            List listsGroupedBySources = []
            List sourcesList = []
            List dataSet
            Integer sourcesCount = requestContent.data.sourceRowName.findAll().size()
            Integer elementsPerSource = list.size() / sourcesCount
            list.eachWithIndex { value, index ->
                sourcesList << value
                if ((index + 1) % (elementsPerSource as Double) == 0)
                {
                    listsGroupedBySources << sourcesList
                    sourcesList = []
                }
            }

            List compAggregations = getSpecificAggregationsList(requestContent, true)
            List aggregations = getSpecificAggregationsList(requestContent)

            if (compAggregations.size() == aggregations.size() && compAggregations.size() == 1)
            {
                dataSet = list
            }
            else
            {
                List indexesOfComputeInRequest = aggregations.findIndexValues {
                    it.name in compAggregations.name
                }
                dataSet = listsGroupedBySources.collect { groupedList ->
                    def usual = groupedList[0]
                    def computeResults = groupedList[1..-1]

                    computeResults.eachWithIndex { currentComputations, i1 ->
                        int indexOfCurrentComputation = indexesOfComputeInRequest[i1]
                        currentComputations.eachWithIndex { it, i2 ->
                            usual[i2].add(indexOfCurrentComputation, it[0])
                        }
                    }
                    return usual
                }
            }

            return dataSet
        }

        /**
         * Метод получения количества уникальных значений по атрибуту из БД
         * @param attributeValue - значение арибута с его группировкой и тд
         * @param classFqn - метакласс источника
         * @param user - текущий пользователь системы
         * @return количество уникальных значений
         */
        Integer countDistinct(def attributeValue, String classFqn, IUUIDIdentifiable user)
        {
            Attribute attribute = attributeValue.attribute.deepClone()
            String attributeType = Attribute.getAttributeType(attribute)
            if(attributeType in AttributeType.DATE_TYPES)
            {
                //у атрибута типа дата важно учитывать формат, в котором пользователь ожидает его увидеть,
                //записей может быть много, а по месяцу, например, может быть только 12 значений
                Source source = new Source(classFqn: classFqn)
                def wrapper = QueryWrapper.build(source)
                attribute = dashboardQueryWrapperUtils.updateRefAttributeCode(attribute)
                def parameter = buildSystemGroup(attributeValue.group, attribute)
                wrapper.processGroup(
                    wrapper,
                    wrapper.criteria,
                    false,
                    parameter,
                    DiagramType.TABLE,
                    source,
                    user
                )

                return wrapper.getResult(true, DiagramType.TABLE, false)?.unique()?.size()
            }
            else
            {
                dashboardQueryWrapperUtils.prepareAttribute(attribute, true)
                List attrCodesList = attribute.attrChains()*.code
                if(attribute.type in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE])
                {
                    //если всё же информация пришла с фронта
                    attrCodesList = attrCodesList.collect { it == 'title' ? 'code' : it }
                }
                String attrCode = attrCodesList.collect { it.replace('metaClass', 'metaClassFqn') }.join('.')
                def s = selectClause
                def criteria = db.createCriteria().addSource(classFqn)
                if(attributeType == AttributeType.META_CLASS_TYPE)
                {
                    criteria.addColumn(s.property(attrCode))
                            .addGroupColumn(s.property(attrCode))
                    return db.query(criteria).list().size()
                }
                criteria.addColumn(s.countDistinct(s.property(attrCode)))
                return db.query(criteria).list().head() as Integer
            }
        }

        /**
         * Метод по подготовке таблицы к отображению
         * @param resultDataSet - итоговый датасет
         * @param transposeDataSet - транспонированный итоговый датасет
         * @param attributes - список атрибутов
         * @param totalColumn - флаг на подсчёт итогов в колонках
         * @param showRowNum - флаг на отображение номера строки
         * @param rowCount - итоговое количество строк
         * @param tableTop - настройки топа для таблицы
         * @param paginationSettings - настройки пагинации
         * @param sorting - настройки сортировки
         * @param reverseRowCount - обратный порядок
         * @param innerCustomGroupNames - список названий кастомных группировок
         * @param hasBreakdown - наличие разбивки
         * @param customValuesInBreakdown - значения кастомных группировок в разбивке
         * @param aggregationCnt - количество агрегаций
         * @param allAggregationAttributes - названия всех атрибутов агрегации
         * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
         * @param request - тело обработанного запроса
         * @param countTotals - итоговое значение
         * @param tableTotals - итоговые значения таблицы
         * @param sourceRowNames - список заголовков для источников
         * @param user - текущий пользователь системы
         * @param diagramType - тип диаграммы
         * @return TableDiagram
         */
        private TableDiagram mappingTable(List resultDataSet,
                                          List transposeDataSet,
                                          List attributes,
                                          Boolean totalColumn,
                                          Boolean showRowNum,
                                          Integer rowCount,
                                          Integer tableTop,
                                          PaginationSettings paginationSettings,
                                          Sorting sorting,
                                          Boolean reverseRowCount,
                                          Set<Map> innerCustomGroupNames,
                                          Boolean hasBreakdown,
                                          List customValuesInBreakdown,
                                          Integer aggregationCnt,
                                          List<String> allAggregationAttributes,
                                          IgnoreLimits ignoreLimits,
                                          DiagramRequest request,
                                          Integer countTotals,
                                          List tableTotals = [],
                                          List sourceRowNames = [],
                                          DiagramType diagramType,
                                          IUUIDIdentifiable user)
        {
            List breakdownValues = hasBreakdown ? transposeDataSet.last().findAll().unique() : []
            Boolean valuesInBasicBreakdownExceedLimit = !customValuesInBreakdown && breakdownValues.size() > DashboardUtils.tableBreakdownLimit && !ignoreLimits.breakdown
            breakdownValues = valuesInBasicBreakdownExceedLimit
                ? breakdownValues[0..DashboardUtils.tableBreakdownLimit - 1]
                : breakdownValues

                Collection<Column> columns = collectColumns(attributes, hasBreakdown, customValuesInBreakdown ?: breakdownValues)

                if (diagramType == DiagramType.PIVOT_TABLE)
                {
                    String requestDataKey = request.data.keySet().first()
                    RequestData requestData = request.data[requestDataKey]
                    addIndicatorBreakdownColumns(resultDataSet, requestData, columns)
                }

                List<String> attributeNames = attributes.collect{ attribut ->
                    def secondAttribut = attribut?.attribute?.ref?.title
                    if(secondAttribut != null){
                        return  attribut.name + " (" + attribut?.attribute?.ref?.title+ ")"
                    }
                    return attribut.key ?:  attribut.aggregation? attribut.name + "#" + "${attribut.aggregation}" : attribut.name
                }

                if (sourceRowNames && hasBreakdown) {
                attributeNames << attributeNames[attributeNames.size() - 1]
                attributeNames[attributeNames.size() - 2] = 'Источник'
            }
            int cnt = attributeNames.size()

            List notAggregatedAttributeNames = notAggregationAttributeNames(attributes)
            Integer notAggregatedAttributeSize = notAggregatedAttributeNames.size()
            List<Map<String, Object>> tempMaps = getTempMaps(resultDataSet, attributeNames, cnt)
            List data = []
            int id
            if (paginationSettings)
            {
                id = reverseRowCount ? rowCount - paginationSettings.firstElementIndex : paginationSettings.firstElementIndex
            }

            if (sourceRowNames)
            {
                aggregationCnt = 1
            }

            Integer parameterIndex = aggregationCnt + notAggregatedAttributeSize //индекс, с которого в строке начинаются значения параметров

            //подготовка данных
            if (hasBreakdown)
            {
                Integer indexToFind = 2 //берём до предпоследнего значения в строке, на последнем месте - разбивка
                def groups = tempMaps.groupBy { it[parameterIndex..-(indexToFind)] }//группируем данные по параметрам (их значениям)
                data = formatDataForTableWithBreakdown(groups, valuesInBasicBreakdownExceedLimit, breakdownValues,
                                                        aggregationCnt, notAggregatedAttributeNames, parameterIndex, showRowNum)
                rowCount = data.size()
                if(tableTop && tableTop < rowCount)
                {
                    PaginationSettings tempPaginationSettings = new PaginationSettings(pageSize: tableTop, firstElementIndex: 0)
                    data = getDataSetWithPagination(data, tempPaginationSettings)
                    rowCount = tableTop
                }
                if(reverseRowCount)
                {
                    //теперь изначально нам количество данных неизвестно, заменяем вручную
                    Integer reverseId = rowCount
                    data.each {
                        it.ID = reverseId--
                    }
                }

                if (sourceRowNames)
                {
                    Map<String, List> dataGroupedBySources = data.groupBy { it['Источник'] }
                    Integer dataId = 1
                    data = dataGroupedBySources.collect {
                        Map dataItem = [:]
                        it.value.each { dataItem += it }
                        dataItem['ID'] = dataId++
                        return dataItem
                    }
                }
            }
            else
            {
                if(innerCustomGroupNames ||
                   (sorting?.accessor &&
                    attributes.find {it?.name?.trim() == sorting?.accessor?.trim() }
                              ?.attribute instanceof ComputedAttr ) || tableTop)
                {
                    tempMaps = sortTableDataSetWithMaps(tempMaps, attributes, sorting)
                    tempMaps = getDataSetWithPagination(tempMaps, paginationSettings)
                }

                if (sourceRowNames)
                {
                    aggregationCnt = 1
                }

                data = tempMaps.collect { map ->
                    def value = map[0..aggregationCnt - 1].collect {
                        it.findResult { k, v -> [(k): v ?: "0"]
                        }
                    }
                    if (map.size() >= aggregationCnt + 1)
                    {
                        value = map[aggregationCnt..-1] + value
                    }

                    if(showRowNum && paginationSettings)
                    {
                        return [ID: reverseRowCount ? id-- : ++id, *:value.sum()]
                    }
                    else
                    {
                        return [*:value.sum()]
                    }
                }

                if (sourceRowNames)
                {
                    data.eachWithIndex { value, i ->
                        value['Источник'] = sourceRowNames[i]
                    }
                }
            }

            Collection<Column> aggregationColumns
            if (!sourceRowNames)
            {
                //подготовка колонок
                List takenAggregationColumns = []
                aggregationColumns = allAggregationAttributes.findResults { name ->
                    columns.find {
                        Boolean match = it.attribute.title == name && !takenAggregationColumns.contains(it)
                        if (match)
                        {
                            takenAggregationColumns << it
                        }
                        return match
                    }
                }
                //убираем, чтобы потом подставить правильно
                columns -= aggregationColumns
            }
            else
            {
                aggregationColumns = [columns.find()]
            }

            Collection<Integer> percentAggregationIndexes = getIndexesForTableWithNoParametersByAggregationType(request, Aggregation.PERCENT)
            if (totalColumn)
            {
                columns[-1].footer = 'Итого'
                aggregationColumns.withIndex().each { aggrCol, i ->
                    def totalCount = 0
                    if (hasBreakdown)
                    {
                        List childrenColumns = aggrCol.columns
                        childrenColumns.each { childCol ->
                            String keyName = "${ aggrCol.header }\$${ childCol.header }"
                            if (aggrCol.aggregation == 'NOT_APPLICABLE')
                            {
                                totalCount = data.count {
                                    it.findAll { k, v -> k == keyName && v != ""
                                    }
                                }
                            }
                            else
                            {
                                if (sourceRowNames && percentAggregationIndexes)
                                {
                                    totalCount = '-'
                                }
                                else
                                {
                                    totalCount = data.sum {
                                        it.entrySet().sum {
                                            Object value
                                            if (it.value in String)
                                            {
                                                Collection potentialValuesForPercentCntAggregation = it.value.split(' ')
                                                String countInPercentCntAggregation = potentialValuesForPercentCntAggregation.head()
                                                if (countInPercentCntAggregation.isNumber()
                                                    && potentialValuesForPercentCntAggregation.size() == 2)
                                                {
                                                    value = countInPercentCntAggregation
                                                }
                                            }

                                            if (!value)
                                            {
                                                value = it.value
                                            }
                                            it.key == keyName ? value as Double : 0
                                        }
                                    }
                                }
                            }
                            if (totalCount in String && !totalCount.isNumber())
                            {
                                childCol.footer = totalCount
                            }
                            else
                            {
                                childCol.footer = DECIMAL_FORMAT.format(totalCount)
                            }
                        }
                    }
                    else
                    {
                        if (tableTotals)
                        {
                            if (sourceRowNames)
                            {
                                if (percentAggregationIndexes)
                                {
                                    totalCount = '-'
                                }
                                else
                                {
                                    totalCount = tableTotals.sum()
                                }
                            }
                            else
                            {
                                totalCount = tableTotals[i]
                            }
                        }
                        else
                        {
                            totalCount = aggrCol.aggregation == 'NOT_APPLICABLE'
                                ? data.count { it[aggrCol.header] != "" }
                                : data.sum { it[aggrCol.header] as Double }
                        }
                        if (totalCount in String && !totalCount.isNumber())
                        {
                            aggrCol.footer = totalCount
                        }
                        else
                        {
                            aggrCol.footer = DECIMAL_FORMAT.format(totalCount)
                        }
                    }
                }
            }

            if (!sourceRowNames)
            {
                //агрегация всегда стоит в конце
                columns += aggregationColumns
            }

            if(hasBreakdown)
            {
                data = getDataSetWithPagination(data, paginationSettings)
            }

            if(showRowNum)
            {
                columns.add(0, new NumberColumn(header: "", accessor: "ID", footer: "", show: showRowNum))
            }

            if (sourceRowNames)
            {
                columns.add(1, new NumberColumn(header: "", accessor: "Источник", footer: totalColumn ? 'Итого' : ''))
            }

            def source = request.data.findResult { k, v -> v.source }

            def parameterAttribute = attributes[parameterIndex]
            boolean isDynamicParameter = parameterAttribute?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            Boolean customValuesInParameter = innerCustomGroupNames.any { it.attributeName == attributeNames[parameterIndex] }
            Boolean limitParameter = false
            if(!customValuesInParameter && parameterAttribute)
            {
                limitParameter = !ignoreLimits?.parameter &&
                                 isDynamicParameter
                    ? dashboardQueryWrapperUtils.countDistinctTotalValue(source,
                                                                         parameterAttribute.attribute.code.tokenize('_').last()) >
                      DashboardUtils.tableParameterLimit
                    : countDistinct(parameterAttribute,
                                    parameterAttribute.attribute.sourceCode, user) >
                      DashboardUtils.tableParameterLimit
                if(isDynamicParameter)
                {
                    //динамические атрибуты ищутся по-особому, их нужно проверять отдельно
                    limitParameter = checkForDateInAttribute(parameterAttribute, limitParameter)
                }
            }

            def breakdownAttribute = hasBreakdown ? attributes.last() : null
            Boolean limitBreakdown = false
            boolean isDynamicBreakdown = breakdownAttribute?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if(breakdownAttribute && !customValuesInBreakdown)
            {
                limitBreakdown = !ignoreLimits.breakdown &&
                                 isDynamicBreakdown
                    ? dashboardQueryWrapperUtils.countDistinctTotalValue(source,
                                                                         breakdownAttribute.attribute.code.tokenize('_').last()) >
                      DashboardUtils.tableBreakdownLimit
                    : countDistinct(breakdownAttribute,
                                    breakdownAttribute.attribute.sourceCode, user) >
                      DashboardUtils.tableBreakdownLimit
                if(isDynamicBreakdown)
                {
                    limitBreakdown = checkForDateInAttribute(breakdownAttribute, limitBreakdown)
                }
            }

            LimitExceeded limitsExceeded = new LimitExceeded(parameter: limitParameter, breakdown: limitBreakdown)

            List<Map<String, Object>> rowsInfo = null
            if (sourceRowNames)
            {
                rowsInfo = getRowsInfoForTablesWithoutParameter(request)
            }

            if (diagramType == DiagramType.PIVOT_TABLE)
            {
                String requestDataKey = request.data.keySet().first()
                RequestData requestData = request.data[requestDataKey]
                formatIndicatorBreakdownValues(data, requestData)
            }

            return new TableDiagram(
                columns: columns.findAll(),
                data: data,
                limitsExceeded: limitsExceeded,
                total: rowCount,
                countTotals: countTotals,
                rowsInfo: rowsInfo
            )
        }

        /**
         * Метод форматирования значений разбивок на показателе
         * @param data - данные
         * @param requestData - запрос
         */
        private void formatIndicatorBreakdownValues(Collection<Map<String, Object>> data, RequestData requestData)
        {
            requestData.aggregations.eachWithIndex { aggregation, aggregationIndex ->
                if (aggregation.breakdown)
                {
                    String accessor = aggregation.key
                    data.each { dataItem ->
                        List notFormattedValues = dataItem[accessor] != '0' ? dataItem[accessor] : []
                        notFormattedValues.each {
                            dataItem[(accessor + '$' + it[1])] = it[0]
                        }
                        dataItem.remove(accessor)
                    }
                }
            }
        }

        /**
         * Метод создания колонок для разбивки на показателе
         * @param resultDataSet - данные
         * @param requestData - запрос
         * @param columns - колонки
         */
        private void addIndicatorBreakdownColumns(List resultDataSet,
                                                  RequestData requestData,
                                                  Collection<Column> columns)
        {
            requestData.aggregations.eachWithIndex { aggregation, aggregationIndex ->
                if (aggregation.breakdown)
                {
                    List breakdownValues = []
                    resultDataSet.each {
                        it[aggregationIndex].each {
                            breakdownValues << it[1]
                        }
                    }
                    breakdownValues = breakdownValues.unique()

                    if (aggregation.breakdown?.group?.format == 'MM YY')
                    {
                        List tempBreakdownValues = []
                        for (int i = 0; i < NOMINATIVE_RUSSIAN_MONTH.size(); i++)
                        {
                            for (int j = 1; j < breakdownValues.size(); j++)
                            {
                                if (NOMINATIVE_RUSSIAN_MONTH[i].equals(
                                    breakdownValues[j].split(" ")[0]
                                ))
                                {
                                    tempBreakdownValues.add(breakdownValues[j])
                                }
                            }
                        }
                        tempBreakdownValues.sort { a, b
                            ->
                            (a.split(" ")[1] as Integer) <=> (b.split(" ")[1] as Integer)
                        }
                        breakdownValues = tempBreakdownValues
                    }

                    Map breakdownAttributeValue = [
                        name       : aggregation.attribute?.title,
                        attribute  : aggregation.attribute,
                        type       : ColumnType.INDICATOR,
                        aggregation: aggregation.type
                    ]

                    String name = aggregation.breakdown?.group?.way == Way.CUSTOM
                        ? aggregation.breakdown?.group?.data?.name
                        : aggregation.breakdown?.attribute?.title
                    Group group = aggregation.breakdown?.group
                    group = updateCustomGroupInfo(group)
                    Map attributeValue = [name: name, attribute: aggregation.breakdown?.attribute,
                                          type: ColumnType.BREAKDOWN, group: group]

                    List<AggregationBreakdownColumn> breakdownColumns = getBreakdownColumns(
                        breakdownAttributeValue.aggregation,
                        breakdownValues,
                        breakdownAttributeValue,
                        attributeValue,
                        aggregation.key
                    )

                    Column column = columns.find {
                        it.attribute == aggregation.attribute && it.accessor == aggregation.key
                    }

                    column.columns = breakdownColumns
                    column.accessor = aggregation.key
                }
            }
        }

        /**
         * Метод получения данных о строках для таблицы без параметра
         * @param request - запрос диаграммы
         * @return данные о строках
         */
        private List<Map<String, Object>> getRowsInfoForTablesWithoutParameter(DiagramRequest request)
        {
            List<Map<String, Object>> rowsInfo = []

            request.data.each {
                RequestData requestData = it.value
                Map<String, Object> rowInfo = [
                    'indicator': requestData.aggregations.head(),
                    'breakdown': requestData.groups ? requestData.groups.head() : null,
                    'source': requestData.source
                ]
                rowsInfo << rowInfo
            }

            return rowsInfo
        }

        /**
         * Метод для корректной обработки данных с разбивкой
         * @param groups - группы словарей данных
         * @param valuesInBasicBreakdownExceedLimit - флаг на превышение предела
         * @param breakdownValues - значения разбивки, которые попадают в пределы
         * @param aggregationCnt - количество агрегаций
         * @param notAggregatedAttributeNames - названия атрибутов с агрегацией N/A
         * @param parameterIndex - индекс, с которого в строке начинаются значения параметров
         * @param showRowNum - флаг на отображение номера строки
         * @return корректно обработанные данные с разбивкой
         */
        private List<Map<String, Object>> formatDataForTableWithBreakdown(def groups, boolean valuesInBasicBreakdownExceedLimit,
                                                                          List breakdownValues, int aggregationCnt, List notAggregatedAttributeNames,
                                                                          int parameterIndex, boolean showRowNum)
        {
            int id = 0
            return groups.collect { parameters, group ->
                if (valuesInBasicBreakdownExceedLimit)
                {
                    //если предел по значениям кастомной группировки превышен,
                    // то нужно взять лишь те группы значений, где в разбивке значения из ограничения
                    group = group.findAll { it.last().values().head() in breakdownValues }
                }
                List<Map> aggregations = []
                if (group)
                {
                    aggregations = updateAggregations(group, aggregationCnt, notAggregatedAttributeNames)
                }

                Integer attributesCntWithoutParameters = parameterIndex + 1 //parameterIndex - количество агрегаций в запросе + 1 - разбивка, остальное параметры
                def tempAggregations = aggregations.collate(attributesCntWithoutParameters)
                def repeatableBreakdowns = tempAggregations.groupBy { it.last() }.findResults { k, v -> v.size() > 1 ? k : null }
                def listOfAggregations = repeatableBreakdowns.collect { breakdownValue ->
                    return tempAggregations.findAll { it.last() == breakdownValue }
                }

                if (listOfAggregations)
                {
                    def baseMap = [:]
                    aggregations -= listOfAggregations.flatten()
                    if (aggregations)
                    {
                        if (showRowNum)
                        {
                            baseMap = [ID: ++id]
                        }
                        //могли остаться и не повторяющиеся значения разбивки, готовим для них базовую строку
                        (parameters + aggregations).each { baseMap << it }
                    }
                    return listOfAggregations.collectMany { list ->
                        return list.withIndex().collect { val, i ->
                            def tempAggregationMap = [:]
                            if (i == 0 && aggregations)
                            {
                                //базовая строка должна пополниться первым значением с повтором
                                tempAggregationMap << baseMap
                            }
                            //остальные повторы по разбивке добавляем отдельно
                            if (showRowNum && (i > 0 || !aggregations))
                            {
                                tempAggregationMap = [ID: ++id]
                            }
                            (parameters + val).each { tempAggregationMap << it }
                            return tempAggregationMap
                        }
                    }
                }
                else
                {
                    def map = [:]
                    if (showRowNum)
                    {
                        map = [ID: ++id]
                    }
                    (parameters + aggregations).each {
                        map << it
                    }
                    return map
                }
            }.flatten()
        }

        /**
         * Метод, позволяющий сортировать значения для таблицы по нужному параметру/показателю
         * @param tempMaps - список временных мап (название параметра/показателя/разбивки:значение)
         * @param attributes - список атрибутов, участвующих в запросе
         * @param tableSorting - настройки сортировки в таблице
         * @return отсортированный список значений
         */
        def sortTableDataSetWithMaps(def tempMaps, List attributes, Sorting tableSorting)
        {
            def attrValue = tableSorting?.accessor ? attributes.find {it?.name?.trim() == tableSorting.accessor.trim()} : null

            if(attrValue)
            {
                def valueType = attrValue?.aggregation != Aggregation.NOT_APPLICABLE && attrValue.type == ColumnType.INDICATOR
                    ? ColumnType.INDICATOR
                    : ColumnType.PARAMETER

                switch(valueType)
                {
                    case ColumnType.INDICATOR:
                        def factor = tableSorting.type == SortingType.DESC ? -1 : 1
                        return tempMaps.sort { factor * it[attrValue.name]?.findResult {it}?.toDouble() }
                    case ColumnType.PARAMETER:
                        def total = tempMaps.sort { it[attrValue.name]?.find()?.toLowerCase() }
                        return tableSorting.type == SortingType.DESC ? total.reverse() : total
                }
            }
            else return tempMaps
        }

        /**
         * Метод на проверку даты в атрибуте, который нужно проверить на выход за пределы
         * @param attributeValue - значение атрибута и его группы
         * @param flag - текущий флаг на выход за ограничения
         * @return - флаг/false
         */
        Boolean checkForDateInAttribute(Map attributeValue, Boolean flag)
        {
            return (!(attributeValue.attribute.type in AttributeType.DATE_TYPES) ||
                    (attributeValue.group.way == Way.SYSTEM &&
                     attributeValue.group.data as GroupType == GroupType.DAY &&
                     attributeValue.group.format in ['dd.mm.YY hh:ii', 'dd.mm.YY hh', 'dd', 'dd.mm.YY', 'dd MM'])) ? flag : false
        }

        /**
         * Метод получения групп значений агрегации и разбивки по параметрам
         * @param tempMaps - текущие мапы значений
         * @param aggregationCnt - количество агргегаций в запросе
         * @return группы значений агрегации и разбивки по параметрам
         */
        List getGroupsByTempMaps(List<Map> tempMaps, Integer aggregationCnt)
        {
            List groups = []
            Integer indexToFind = 2 //берём до предпоследнего значения в строке, на последнем месте - разбивка
            tempMaps.each  {
                def valueToFind = it
                List equalParameterValues = tempMaps.findAll {
                    it[aggregationCnt..-(indexToFind)] == valueToFind[aggregationCnt..-(indexToFind)]
                }
                if (equalParameterValues)
                {
                    groups << equalParameterValues
                    tempMaps -= equalParameterValues
                }
            }
            return groups
        }

        /**
         * Метод преобразования агрегации с включением в неё значений разбивки
         * @param group - текущие группа данных по идентичным значениям параметров
         * @param aggregationCnt - количество агрегаций в запросе
         * @param notAggregatedAttributeNames - список названий атрибутов с агрегацией N/A
         * @return преобразованная агрегация с включением в неё значений разбивки
         */
        List<Map> updateAggregations(List<Map> group, Integer aggregationCnt, List notAggregatedAttributeNames)
        {
            return group.collectMany { value ->
                return (0..aggregationCnt - 1).collect {
                    def aggregation = value[it].findResult { k, v -> [k, v] }
                    def breakdownValue = value.last().findResult { k, v -> [k, v] }
                    if (!aggregation[1])
                    {
                        aggregation[1] = notAggregatedAttributeNames?.contains(aggregation[0]) ? "" : "0"
                    }
                    return [("${aggregation[0]}\$${breakdownValue[1]}"): aggregation[1]]
                }
            }
        }

        /**
         * Метод на подготовку строк с разбивкой внутри
         * @param rows - текущие строки
         * @param aggregationCnt - количество агрегаций
         * @param attributeNames - список названия атрибутов
         * @param breakdownValues - список значений разбивки
         * @return - новые строки на отправку в таблицу
         */
        List<Map> prepareRowsWithBreakdown(List<Map> rows, Integer aggregationCnt, List<String> attributeNames, List<String> notAggregatedAttributeNames,  List<String> breakdownValues)
        {
            List listAttributes = []
            if (aggregationCnt > 0)
            {
                listAttributes = aggregationCnt > 1
                    ? attributeNames[0..aggregationCnt - 1]
                    : attributeNames[0..0]
            }
            return rows.collect { row->
                //изменяем существующие агрегации в строке
                listAttributes.each { aggregationName ->
                    List aggregations = row.findResults { it[aggregationName] }
                    //сами значения агргегации на удаление из списка
                    List removeAggregations =  row.findAll { it[aggregationName] }
                    List newAggregations = breakdownValues.collect { value ->
                        def num = aggregations.findResult{ it[value] }
                        if (aggregationName in notAggregatedAttributeNames)
                        {
                            num = num ?: ""
                        }
                        else
                        {
                            num = num ?: "0"
                        }
                        return [("$aggregationName\$$value"): num]
                    }
                    row -= removeAggregations
                    row += newAggregations
                }
                //возвращаем ту же строку
                return row
            }
        }

        /**
         * Метод получения мап атрибут/значение
         * @param resultDataSet - итоговый датасет
         * @param attributeNames - список названий атрибутов
         * @param cnt - количество атрибутов
         * @return список временных мап
         */
        List<Map<String, Object>> getTempMaps(List resultDataSet, List<String> attributeNames, int cnt)
        {
            return resultDataSet.collectMany { groupValue ->
                int i = 0
                return groupValue.collect { value ->
                    [(attributeNames[i++]): value]
                }.collate(cnt)
            }
        }

        /**
         * Метод создания строки дерева
         * @param map - мапа
         * @param row - строка мап
         * @param attributeNames - список названий атрибутов
         * @param aggregationCnt - количество агрегаций
         * @return строка дерева
         */
        ResRow createResRow(Map map, List<Map> row, List<String> attributeNames, int aggregationCnt)
        {
            def key = map.keySet().find()
            int index = attributeNames.indexOf(key)//индекс первого родителя
            int id = 0
            def fullRow = []
            attributeNames[aggregationCnt..index].each { parentKey ->
                def tempParent = row[parentKey].grep().find()
                def previousParent = fullRow.any() ? fullRow[id++] : null
                fullRow << new ResRow(key: parentKey, value: tempParent, parent: previousParent, count: null)
            }
            def totalRow = fullRow.last()
            totalRow.count = index == attributeNames.size() - 1 && aggregationCnt > 0 ? row[0..aggregationCnt - 1] : null
            return totalRow
        }

        /**
         * Метод получения всех листьев по дереву
         * @param totalRows - список всех листьев по дереву
         * @param parent - родитель
         * @param tempTree - временное дерево
         * @return список всех листьев по дереву
         */
        List getFullRowsNew(List totalRows, ResRow parent, List tempTree)
        {
            totalRows = totalRows + parent
            List children = getChildrenByParent(parent, tempTree)
            return [parent] + children.collectMany { getFullRowsNew(totalRows, it, tempTree) }
        }

        /**
         * Метод получения названий и самих основных атрибутов настроек виджета
         * @param widgetSettings - настройки виджета
         * @return список названий атрибутов
         */
        private List<Map<String, Object>> getAttributeNamesAndValuesFromRequest(Widget widgetSettings)
        {
            def tempWidgetSettings = mapper.convertValue(widgetSettings, widgetSettings.getClass())
            SourceValue mainSourceValue = tempWidgetSettings?.data?.findResult { value ->
                if (!value.sourceForCompute)
                {
                    return value.source.value
                }
            }
            String mainSource = mainSourceValue.value
            def aggregations = getSpecificAggregationsList(widgetSettings)
            def fullParametersList = getFullElementListInWidgetSettings(widgetSettings, 'parameters')

            def parameterAttributes = tempWidgetSettings.data.collectMany { value ->
                if (!value.sourceForCompute)
                {
                    String currentSource = value.source.value.value
                    String currentSourceName = currentSource != mainSource ? value.source.value.label.trim() : mainSourceValue.label.trim()

                    value.parameters.collect { parameter ->
                        if(fullParametersList.count { it?.attribute?.title == parameter?.attribute?.title } > 1)
                        {
                            if(currentSourceName)
                            {
                                parameter?.attribute?.title = "${parameter?.attribute?.title} (${currentSourceName})"
                            }
                        }

                        def name = parameter?.group?.way == Way.CUSTOM
                            ? parameter?.group?.data?.name
                            : parameter?.attribute?.title

                        def group = parameter?.group
                        group = updateCustomGroupInfo(group)
                        return [name : name, attribute : parameter?.attribute,
                                type : ColumnType.PARAMETER, group : group]
                    }
                }
                else
                {
                    return []
                }
            }

            def breakdownAttributes = tempWidgetSettings.data.collectMany { value ->
                if (!value.sourceForCompute)
                {
                    value.breakdown.collect { breakdown ->
                        def name = breakdown?.group?.way == Way.CUSTOM
                            ? breakdown?.group?.data?.name
                            : breakdown?.attribute?.title
                        def group = breakdown?.group
                        group = updateCustomGroupInfo(group)
                        return [name : name, attribute : breakdown?.attribute,
                                type : ColumnType.BREAKDOWN, group : group]
                    }
                }
                else
                {
                    return []
                }
            }

            Boolean isSourceForEachRow = widgetSettings.data.sourceRowName.findAll() && (widgetSettings.type as DiagramType) == DiagramType.TABLE
            if (isSourceForEachRow && breakdownAttributes)
            {
                breakdownAttributes = [breakdownAttributes.head()]
            }

            return (aggregations + parameterAttributes + breakdownAttributes).grep()
        }

        /**
         * Метод получения данных по элементам поля data всех настроек виджета
         * @param widgetSettings - настройки виджета
         * @param fieldName - название поля, данные по которому хотим получить
         * @return данные по полю
         */
        def getFullElementListInWidgetSettings(def widgetSettings, String fieldName)
        {
            return widgetSettings.data.collectMany { value ->
                if (!value.sourceForCompute && value[fieldName])
                {
                    return value[fieldName]
                }
                else
                {
                    return []
                }
            }
        }

        /**
         * Метод обновления настроек для кастомных группировок
         * @param group - группировка
         * @return - кастомная группировка в корректном виде
         */
        Group updateCustomGroupInfo(Group group)
        {
            if(group?.way == Way.CUSTOM)
            {
                group.data = group.data.id
            }
            return group
        }

        /**
         * Метод получения названий внутренних групп из основных группировок
         * @param requestContent - запрос
         * @return список названий
         */
        private Set<Map> getInnerCustomGroupNames(def requestContent)
        {
            Set<Map> attributeMaps = []
            requestContent.data.each { value ->
                value.parameters.each { parameter ->
                    if (parameter?.group?.way == Way.CUSTOM)
                    {
                        parameter?.group?.data?.subGroups?.each { sub ->
                            attributeMaps << [attributeName: parameter?.group?.data?.name, value: sub?.name]
                        }
                    }
                }

                value.breakdown?.each { breakdown ->
                    if (breakdown?.group?.way == Way.CUSTOM)
                    {
                        breakdown?.group?.data?.subGroups?.each { sub ->
                            attributeMaps << [attributeName: breakdown?.group?.data?.name, value: sub?.name]
                        }
                    }
                }
            }
            return attributeMaps
        }

        /**
         * Метод преобразования результата выборки к комбо диаграме
         * @param list - данные диаграмы
         * @param additionals - дополнительные данные
         * @param groupFormat - формат группы даты['DAY']
         * @param format - формат данных группы даты ['dd MM']
         * @param changeLabels - флаг на изменение списка лейблов (лейблы идут из параметров)
         * @param reverseLabels - флаг на обратный порядок лейблов
         * @param customsInBreakdown - список флагов на наличие кастомных группировок в разбивке в разных источниках
         * @param sortingDataIndex - индекс датасета, который будет в основе комбо-диаграммы
         * @return ComboDiagram
         */
        private ComboDiagram mappingComboDiagram(List list, List<Map> additionals, String groupFormat,
                                                 String format, Boolean changeLabels, Boolean reverseLabels,
                                                 List<Boolean> customsInBreakdown, Integer sortingDataIndex,
                                                 Integer countTotals)
        {
            List transposeSets = list.collect { (it as List<List>)?.transpose() ?: [] }

            Set labels = transposeSets.withIndex().collectMany { set, i ->
                if (customsInBreakdown[i])
                {
                    return set[2]?.findAll() ?: [] //значения параметра стоят на 3-м месте в результатах запроса, если группировка в разбивке кастомная
                }
                else
                {
                    return set[1]?.findAll() ?: [] //иначе на 2-м
                }
            }

            labels = getTotalLabelsForDiagram(labels, groupFormat, format, changeLabels, reverseLabels)

            Set diagramLabels = transposeSets.withIndex().collectMany { set, i ->
                if (customsInBreakdown[i])
                {
                    return set[1]?.findAll() ?: [] //значения кастомной группировки из разбивки стоят на 2-м месте в результатах запроса
                }
                else {
                    return set[2]?.findAll() ?: [] //если группировка разбивки обычная, то на 3-м
                }
            }
            //максимальный размер транспонированных датасетов из всех, что пришли из БД
            Integer globalMaxSize = transposeSets.collect{ it?.size() }?.max()
            Closure getsSeries = { Set labelSet, List<List> dataSet, Map additionalData, Set labelDiagramSet, boolean customGroupFromBreak,
                Integer listSize ->
                def transposeData = dataSet?.transpose() ?: []
                switch (transposeData.size()) {
                    case 0:
                        if(globalMaxSize == 0)
                        {
                            return []
                        }
                        //нужно отправить источник, даже если данных по нему нет
                        def result = new SeriesCombo(
                            type: additionalData.type as String,
                            breakdownValue: additionalData.breakdown as String,
                            data: [],
                            name: additionalData.name as String,
                            dataKey: additionalData.dataKey as String
                        )
                        return [result]
                    case 2:
                        Collection data = labelSet.collect { group ->
                            dataSet.findResult { it[1] == group ? it[0] : null } ?: '0'
                        }
                        def result = new SeriesCombo(
                            type: additionalData.type as String,
                            breakdownValue: additionalData.breakdown as String,
                            data: data,
                            name: additionalData.name as String,
                            dataKey: additionalData.dataKey as String
                        )
                        return [result]
                    case 3:
                        checkAggregationAndBreakdownListSize(labelSet, labelDiagramSet, listSize)
                        if (customGroupFromBreak) {
                            return labelSet.collect { label ->
                                new SeriesCombo(
                                    type: additionalData.type as String,
                                    breakdownValue: label as String,
                                    data: labelDiagramSet.collect { group ->
                                        dataSet.findResult {
                                            it.tail() == [label, group] ? it.head() : null
                                        } ?: '0'
                                    },
                                    name: label as String,
                                    dataKey: additionalData.dataKey as String
                                )
                            }
                        } else {
                            return (labelDiagramSet).collect { breakdown ->
                                new SeriesCombo(
                                    type: additionalData.type as String,
                                    breakdownValue: breakdown as String,
                                    data: labelSet.collect { group ->
                                        dataSet.findResult {
                                            it.tail() == [group, breakdown] ? it.head() : null
                                        } ?: '0'
                                    },
                                    name: breakdown as String,
                                    dataKey: additionalData.dataKey as String
                                )
                            }
                        }
                    default:
                        String message = messageProvider.getConstant(INVALID_RESULT_DATA_SET_ERROR, currentUserLocale)
                        utils.throwReadableException("$message#${INVALID_RESULT_DATA_SET_ERROR}")
                }
            }

            List fullSeries = []
            Integer listCount = list.size()
            list.eachWithIndex { dataSet, i ->
                fullSeries += getsSeries(customsInBreakdown[i] ? diagramLabels : labels,
                                         dataSet, additionals[i], customsInBreakdown[i] ? labels : diagramLabels,
                                         customsInBreakdown[i], listCount)
            }
            if (sortingDataIndex > 0)
            {
                SeriesCombo moveBack = fullSeries[0]
                fullSeries -= moveBack
                fullSeries.add(sortingDataIndex, moveBack)
            }
            return new ComboDiagram(labels: labels, series: fullSeries, countTotals: countTotals)
        }

        /**
         * Метод получения подписей по датам в корректном виде
         * @param labels - исходные подписи по датам
         * @param format - формат дат
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set getLabelsInCorrectOrder(Set labels, String group, String format, Boolean reverse)
        {
            switch (group as GroupType)
            {
                case [GroupType.MINUTES, GroupType.HOURS]: return minutesAndHoursInCorrectOrder(labels, format, reverse)
                case GroupType.DAY : return daysInCorrectOrder(labels, format, reverse)
                case GroupType.SEVEN_DAYS: return sevenDaysInCorretOrder(labels, reverse)
                case GroupType.MONTH : return monthsInCorrectOrder(labels, format, reverse)
                case [GroupType.WEEK, GroupType.YEAR] : return weeksInCorrectOrder(labels, format, reverse)
                case GroupType.QUARTER : return quartersInCorrectOrder(labels, format, reverse)
            }
            return labels
        }

        /**
         * Метод получения подписей по минутам и часам в корректном виде
         * @param labels - исходные подписи по датам
         * @param format - формат дат 11
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set minutesAndHoursInCorrectOrder(Set labels, String format, Boolean reverse)
        {
            //это формат ii, форматтер изменится только, если придёт формат часов
            SimpleDateFormat formatter = new SimpleDateFormat("mm мин", new Locale("ru"))
            switch(format)
            {
                case 'hh':
                    formatter = new SimpleDateFormat("HH", new Locale("ru"))
                    break
                case 'hh:ii':
                    formatter = new SimpleDateFormat("hh:mm", new Locale("ru"))
                    break
            }
            return labels.sort { reverse ? - formatter.parse(it).getTime() : formatter.parse(it) }
        }

        /**
         * Метод получения подписей по дням в корректном виде
         * @param labels - исходные подписи по датам
         * @param format - формат дат
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set daysInCorrectOrder(Set labels, String format, Boolean reverse)
        {
            //данный формат dd MM, но на старых версиях виджетов формата может не быть,
            // а этот использовался по умолчанию
            SimpleDateFormat formatter = new SimpleDateFormat("dd LLLL", new Locale("ru"))
            switch(format)
            {
                case 'dd.mm.YY hh:ii':
                    formatter = new SimpleDateFormat("dd.MM.yyyy HH:mm", new Locale("ru"))
                    break
                case 'dd.mm.YY hh':
                    formatter = new SimpleDateFormat("dd.MM.yyyy, HHч", new Locale("ru"))
                    break
                case 'dd.mm.YY':
                    formatter = new SimpleDateFormat("dd.MM.yyyy", new Locale("ru"))
                    break
                case 'dd':
                    formatter = new SimpleDateFormat("dd-й", new Locale("ru"))
                    break
                case 'WD':
                    formatter = new SimpleDateFormat("EEEE", new Locale("ru"))
                    break
            }
            if (format == 'WD')
            {
                return labels.sort { Calendar.getInstance().setTime(formatter.parse(it))}
            }
            return labels.sort { reverse ? - formatter.parse(it).getTime() : formatter.parse(it) }
        }

        /**
         * Метод получения подписей по 7-ми дням в корректном виде
         * @param labels - исходные подписи по датам
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set sevenDaysInCorretOrder(Set labels, Boolean reverse)
        {
            SimpleDateFormat formatter = new SimpleDateFormat("dd.MM.yyyy", new Locale("ru"))
            return labels.sort { reverse ?
                - formatter.parse(it.tokenize('-').find()).getTime()
                : formatter.parse(it) }
        }

        /**
         * Метод получения подписей по месяцам в корректном виде
         * @param labels - исходные подписи по датам
         * @param format - формат дат
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set monthsInCorrectOrder(Set labels, String format, Boolean reverse)
        {
            //данный формат MM, но на старых версиях виджетов формата может не быть,
            // а этот использовался по умолчанию
            SimpleDateFormat formatter = new SimpleDateFormat("LLLL", new Locale("ru"))
            if (format == 'MM YY')
            {
                formatter = new SimpleDateFormat("LLLL yyyy", new Locale("ru"))
            }
            return labels.sort { reverse ? - formatter.parse(it).getTime() : formatter.parse(it) }
        }

        /**
         * Метод получения подписей по неделям в корректном виде
         * @param labels - исходные подписи по датам
         * @param format - формат дат
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set weeksInCorrectOrder(Set labels, String format, Boolean reverse)
        {
            SimpleDateFormat formatter = new SimpleDateFormat(format, new Locale("ru"))
            if (format == 'WW YY')
            {
                formatter = new SimpleDateFormat('ww неделя yyyy', new Locale("ru"))
            }
            return labels.sort { reverse ? - formatter.parse(it.replace('-я', '')).getTime() : formatter.parse(it) }
        }

        /**
         * Метод получения подписей по кварталам в корректном виде
         * @param labels - исходные подписи по датам
         * @param format - формат дат
         * @param reverse - флаг на упорядочивание в обратном порядке
         * @return подписи в правильном порядке
         */
        Set quartersInCorrectOrder(Set labels, String format, Boolean reverse)
        {
            SimpleDateFormat formatter = new SimpleDateFormat("MM", new Locale("ru"))
            if (format == 'QQ YY')
            {
                formatter = new SimpleDateFormat("MM кв-л yyyy", new Locale("ru"))
            }
            return labels.sort { reverse ? - formatter.parse(it.replace(' кв-л ', '')).getTime() : formatter.parse(it) }
        }

        /**
         * Метод добавления атирбута title для ссылочных аттрибутов. Исспользовать только для вычислений формул
         * @param attr - атрибут
         * @return атрибут
         */
        private setTitleInLinkAttribute(def attr)
        {
            def validTypes = AttributeType.LINK_TYPES
            return attr.type in validTypes
                ? attr + [ref: [code: 'title', type: 'string', title: 'Название']]
                : attr
        }

        /**
         * Метод извлечение id из uuid объекта
         * @param uuid - уникальный идетнификатор
         * @return id
         */
        private long extractIDFromUUID(String uuid)
        {
            return uuid.split('\\$', 2)[1] as long
        }

        /**
         * Метод для проверки является ли кастомная группировка группировкой из разбивки
         * @param requestContent - тело запроса
         * @param diagramType - тип диаграммы
         * @return флаг или список флагов
         */
        private def isCustomGroupFromBreakdown(def requestContent, DiagramType diagramType = DiagramType.COLUMN)
        {
            def requestData = requestContent.data
            List<Boolean> customsInBreakdown = requestData.findResults { data ->
                def parameter = data.parameters.find()
                def isSystemParameterGroup = parameter?.group?.way == Way.SYSTEM
                def isCustomBreakdownGroup = data.breakdown?.group?.way.find() == Way.CUSTOM
                boolean sourceForCompute = data.sourceForCompute
                sourceForCompute == false ? isSystemParameterGroup && isCustomBreakdownGroup : null
            }
            return diagramType == DiagramType.COMBO ? customsInBreakdown : customsInBreakdown.find()
        }

        /**
         * Метод для создания кастомной группировки для динамического атрибута
         * @param dynamicAttribute - динамический атрибут
         * @return кастомная группировка для динамического атрибута
         */
        NewParameter mappingDynamicAttributeCustomGroup(Attribute dynamicAttribute)
        {
            if (dynamicAttribute?.property == AttributeType.TOTAL_VALUE_TYPE)
            {
                String uuidForTemplate = TotalValueMarshaller.unmarshal(dynamicAttribute.code).last()
                def groupType = AttributeType.OBJECT_TYPE
                def groupName = 'totalValueGroup'
                dynamicAttribute = new Attribute(code: 'linkTemplate', type: AttributeType.OBJECT_TYPE)

                def subGroupData = new SubGroupData(data: [title: 'Шаблон атрибута', uuid: uuidForTemplate],
                                                    type: 'CONTAINS')
                def subGroup = new SubGroup(data: [[subGroupData]], name: '')
                def customGroup = new CustomGroup(name: groupName,
                                                  subGroups: [subGroup],
                                                  type: groupType,
                                                  id: '')

                def group = new CustomGroupInfo(data:customGroup, way: Way.CUSTOM)
                return new NewParameter(attribute:dynamicAttribute, group:group)
            }
            return null
        }

        /**
         * Метод получения списка фильтров
         * @param parameter - значение параметра
         * @param subjectUUID - идентификатор "текущего объекта"
         * @param place - место, откуда была создана кастомная группировка
         * @param source - источник запроса
         * @param offsetUTCMinutes - смещение часового пояса пользователя относительно серверного времени
         * @param sortingType - тип сортировки
         * @return - список фильтров
         */
        private FilterList getFilterList(NewParameter parameter, String subjectUUID, String place, Source source, Integer offsetUTCMinutes, SortingType sortingType = null)
        {
            if(parameter?.group)
            {
                def customGroup = parameter?.group?.data

                def filterList = customGroup?.subGroups?.collect { subGroup ->
                    String attributeType = Attribute.getAttributeType(parameter.attribute).split('\\$', 2).head()
                    parameter.attribute.attrChains().last().type = attributeType
                    Closure<Collection<Collection<FilterParameter>>> mappingFilters = getMappingFilterMethodByType(attributeType, subjectUUID, source, offsetUTCMinutes)
                    def filters = mappingFilters(
                        subGroup.data as List<List>,
                        parameter.attribute,
                        subGroup.name,
                        subGroup.id
                    )
                    return filters
                }
                FilterList filter = new FilterList(filters: filterList, place: place, sortingType: sortingType)
                return filter
            }
            return null
        }

        /**
         * Метод по получению TOP Х данных
         * @param currentRes - текущий результат запроса из БД
         * @param top - количество данных, которое нужно получить
         * @param parameterFilters - фильтры для параметра из кастомных группировок
         * @param breakdownFilters - фильтры для показателя из кастомных группировок
         * @param fromNoOrTwoFiltersList - флаг на результат работы 0 или 1 списка фильтров
         * @param parameterWithDate - параметр, если в списке параметров есть атрибут даты
         * @param parameterOrderWithDates - порядок для параметра, содержащего дату
         * @param aggregationOrderWithDates - порядок для показателя в запросе, где в параметре дата
         * @return TOP Х данных
         */
        List getTop(List currentRes, Integer top, List parameterFilters = [], List breakdownFilters = [],
                    Boolean fromNoOrTwoFiltersList = false, def parameterWithDate = null,
                    String parameterOrderWithDates = '', String aggregationOrderWithDates = '')
        {
            Integer paramIndex = 1 //индекс, на котором расположены значения параметра (первого параметра для таблицы)
            Integer aggregationIndex = 0 //индекс, на котором расположены значения показателя (первого показателя для таблицы)
            if((parameterFilters || breakdownFilters) && currentRes.find()?.size() > 2)
            {
                paramIndex = parameterFilters ? 1 : 2
            }
            //суммируем данные по группам - подсчитываем значения первого показателя и выставляем в порядке по убыванию
            def tempResult = currentRes.groupBy { it[paramIndex] }.collect{ k, v -> [k, v]}
            //берём из этих групп первые по top или все группы, если данных меньше
            if(tempResult.size() > top && fromNoOrTwoFiltersList)
            {
                tempResult = tempResult[0..top - 1]
            }
            if(parameterWithDate && aggregationOrderWithDates == 'ASC')
            {
							Collections.reverse(tempResult)
            }
            tempResult = tempResult*.get(0)

            if(parameterWithDate && !aggregationOrderWithDates)
            {
                def labels = tempResult as Set
                Boolean labelsHaveEmptyValue = blankData in labels
                if(labelsHaveEmptyValue)
                {
                    labels -= blankData
                }
                tempResult = getLabelsInCorrectOrder(labels,
                                                     parameterWithDate.type as String,
                                                     parameterWithDate.format,
                                                     parameterOrderWithDates != 'ASC').toList()
                if(labelsHaveEmptyValue)
                {
                    tempResult += blankData
                }
            }
            //находим соответсвия данных с теми группами, что получили, и выводим их
            return tempResult.collectMany { value -> currentRes.findAll {it[paramIndex] == value} }
        }

        /**
         * Метод сортировки итоговых значений в БД
         * @param res - итоговый датасет из БД
         * @param aggregationSortingType - тип сортировки показателя
         * @param parameterSortingType - тип сортировки параметра
         * @param parameterFilters - список фильтров параметра
         * @param breakdownFilters - список фильтров разбивки
         * @param percentCntAggregationIndexes - список индексов аггрегаций PERCENT_CNT
         * @return - итоговый датасет в отсортированном виде
         */
        List sortResList(List res, String aggregationSortingType = '', parameterSortingType = '', parameterFilters = [], breakdownFilters = [], List percentCntAggregationIndexes = [])
        {
            int paramIndex = !breakdownFilters ? 1 : 2 // место, с которого начинаются значения параметра
            Integer aggregationIndex = 0 //место, где находятся значения агрегации
            if(aggregationSortingType)
            {
                if(res.find()?.size() > 2)
                {
                    def tempResult = res.groupBy {
                        it[paramIndex]
                    }.collect { k, v ->
                        [k, v.sum {
                            String value = it[aggregationIndex]
                            if (aggregationIndex in percentCntAggregationIndexes)
                            {
                                value = value.split(' ')[0]
                            }
                            value as Double
                        }]
                    }
                                        .sort {
                                            String value = it[1]
                                            if (aggregationIndex in percentCntAggregationIndexes)
                                            {
                                                value = value.split(' ')[0]
                                            }
                                            aggregationSortingType == 'ASC' ? value.toDouble() :
                                                -value.toDouble()
                                        }
                                        *.get(0)
                    //находим соответсвия данных с теми группами, что получили, и выводим их
                    return tempResult.collectMany { value -> res.findAll {it[paramIndex] == value} }
                }
                else
                {
                    return res.sort {
                        String value = it[0]
                        if (aggregationIndex in percentCntAggregationIndexes)
                        {
                            value = value.split(' ')[0]
                        }
                        aggregationSortingType == 'ASC' ? value.toDouble() :  -value.toDouble()
                    }
                }
            }

            if(parameterSortingType)
            {
                res = res.sort { it[paramIndex].toUpperCase() }
                return parameterSortingType == 'ASC' ? res : res.reverse()
            }
            return res
        }

        /**
         * Метод получения данных для диаграмм без списков фильтров
         * @param node - нода реквизита запроса
         * @param request - запрос
         * @param aggregationCnt - количество агрегаций
         * @param top - количество записей, которое нужно вывести
         * @param notBlank - флаг на получение только заполненных данных, без null
         * @param onlyFilled - флаг на отображение данных, в которых пришли/не пришли данные по агрегации
         * @param diagramType  - тип диаграммы
         * @param requestContent - тело запроса
         * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
         * @param user - текущий пользователь системы
         * @return сырые данные для построения диаграм
         */
        private List getNoFilterListDiagramData(Object node,
                                                DiagramRequest request,
                                                Integer aggregationCnt,
                                                Integer top,
                                                Boolean notBlank,
                                                Boolean onlyFilled,
                                                DiagramType diagramType,
                                                Object requestContent,
                                                IgnoreLimits ignoreLimits,
                                                IUUIDIdentifiable user,
                                                PaginationSettings paginationSettings = null)
        {
            Boolean isSourceForEachRow = requestContent?.data?.sourceRowName?.findAll() && diagramType == DiagramType.TABLE
            String nodeType = node.type
            Boolean isDiagramTypeTable = diagramType in [DiagramType.TABLE, DiagramType.PIVOT_TABLE]
            switch (nodeType.toLowerCase())
            {
                case 'default':
                    def requisiteNode = node as DefaultRequisiteNode
                    RequestData requestData = request.data[requisiteNode.dataKey]

                    List attributes = []
                    List<String> notAggregatedAttributes = []
                    Boolean tableHasBreakdown
                    if (requestContent)
                    {
                        attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                        notAggregatedAttributes = notAggregationAttributeNames(attributes)
                        tableHasBreakdown = checkForBreakdown(requestContent)
                    }
                    def listIdsOfNormalAggregations = isDiagramTypeTable
                        ? request?.data?.findResult { key, value ->
                        value?.aggregations?.withIndex().findResults { val, i -> if(val.type != Aggregation.NOT_APPLICABLE) return i }
                    } : [0]

                    String aggregationSortingType = requestData.aggregations.find()?.sortingType
                    def parameter = requestData.groups.find()
                    String parameterSortingType = isDiagramTypeTable && !top ? '' : parameter?.sortingType
                    String parameterAttributeType = Attribute.getAttributeType(parameter?.attribute)
                    Boolean parameterWithDateOrDtInterval = parameterAttributeType in [*AttributeType.DATE_TYPES, AttributeType.DT_INTERVAL_TYPE]
                    Boolean parameterWithDate = parameterAttributeType in AttributeType.DATE_TYPES

                    //важно для таблицы
                    Closure formatAggregation = this.&formatAggregationSet.rcurry(
                        listIdsOfNormalAggregations,
                        request,
                        diagramType,
                        diagramType in DiagramType.CountTypes ? false : onlyFilled,
                        getPercentCntAggregationIndexes(request)
                    )
                    Closure formatGroup = this.&formatGroupSet.rcurry(requestData, listIdsOfNormalAggregations, diagramType)
                    def res = dashboardQueryWrapperUtils.getData(requestData, top, currentUserLocale, user, notBlank, diagramType, ignoreLimits?.parameter, '', paginationSettings)
                                                        .with(formatGroup)
                                                        .with(formatAggregation)
                    def total = res ? [(requisiteNode.title): res] : [:]
                    total = formatResult(total, aggregationCnt)
                    Boolean hasStateOrTimer = requestData?.groups?.any { value -> Attribute.getAttributeType(value?.attribute) in [AttributeType.STATE_TYPE, AttributeType.TIMER_TYPE] } ||
                                       requestData?.aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) in [AttributeType.STATE_TYPE, AttributeType.TIMER_TYPE] }
                    if (hasStateOrTimer)
                    {
                        Boolean resWithPercentCnt
                        Collection<Integer> percentCntAggregationIndexes
                        Integer dataSetIndex = request.requisite.findIndexOf {
                            it.nodes.first().dataKey == node.dataKey
                        }
                        if (isSourceForEachRow)
                        {
                            percentCntAggregationIndexes = getIndexesForTableWithNoParametersByAggregationType(request, Aggregation.PERCENT_CNT)
                        }
                        else
                        {
                            percentCntAggregationIndexes = getPercentCntAggregationIndexes(request)
                        }

                        resWithPercentCnt = dataSetIndex in percentCntAggregationIndexes
                        total = prepareRequestWithStates(total, listIdsOfNormalAggregations, resWithPercentCnt)
                    }
                    return totalPrepareForNoFiltersResult(top, isDiagramTypeTable, tableHasBreakdown, total, parameter,
                                                          parameterWithDate, parameterSortingType, aggregationSortingType, parameterWithDateOrDtInterval, diagramType, getPercentCntAggregationIndexes(request))
                case 'computation':
                    def requisiteNode = node as ComputationRequisiteNode
                    def calculator = new FormulaCalculator(requisiteNode.formula)
                    def dataSet = calculator.variableNames.collectEntries {
                        [(it): request.data[it]]
                    } as Map<String, RequestData>
                    if (!checkGroupTypes(dataSet.values()))
                    {
                        String message = messageProvider.getConstant(WRONG_GROUP_TYPES_IN_CALCULATION_ERROR, currentUserLocale)
                        utils.throwReadableException("$message#${WRONG_GROUP_TYPES_IN_CALCULATION_ERROR}")
                    }

                    List attributes = []
                    List<String> notAggregatedAttributes = []
                    Boolean tableHasBreakdown
                    if (requestContent)
                    {
                        attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                        notAggregatedAttributes = notAggregationAttributeNames(attributes)
                        tableHasBreakdown = checkForBreakdown(requestContent)
                    }
                    def listIdsOfNormalAggregations = [0]
                    aggregationCnt = 1
                    def variables = dataSet.collectEntries { key, data ->
                        Closure postProcess =
                            this.&formatGroupSet.rcurry(data as RequestData, listIdsOfNormalAggregations, diagramType)
                        Collection result = dashboardQueryWrapperUtils.getData(data as RequestData, top, currentUserLocale, user, notBlank, diagramType, ignoreLimits.parameter, '', paginationSettings)
                                                                .with(postProcess)

                        if (result.size() == 0 || result.first() in Collection && result.first().size() == 0)
                        {
                            result[0] = [0]
                        }

                        [(key): result]
                    } as Map<String, List>

                    //Вычисление формулы. Выглядит немного костыльно...
                    Boolean hasState = dataSet.values().head().groups?.any { value -> Attribute.getAttributeType(value?.attribute) == AttributeType.STATE_TYPE } ||
                                       dataSet.values().head().aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) == AttributeType.STATE_TYPE }
                    String aggregationSortingType = dataSet.values().head().aggregations.find()?.sortingType
                    def parameter = dataSet.values().head().groups.find()
                    String parameterSortingType = isDiagramTypeTable ? '' : parameter?.sortingType
                    String parameterAttributeType = Attribute.getAttributeType(parameter?.attribute)
                    Boolean parameterWithDateOrDtInterval = parameterAttributeType in [*AttributeType.DATE_TYPES, AttributeType.DT_INTERVAL_TYPE]
                    Boolean parameterWithDate = parameterAttributeType in AttributeType.DATE_TYPES

                    def res = dataSet.values().head().groups?.size() ?
                        findUniqueGroups([0], variables).collect { group ->
                            def resultCalculation = calculator.execute { variable ->
                                hasState
                                    ? (variables[variable as String].sum {
                                    def value =  it[1..-1]
                                    group == value ? it[0]  as Double : 0
                                } ?: 0) as Double
                                    : (variables[variable as String].findResult {
                                    def value =  it[1..-1]
                                    group == value ? it[0] : null
                                } ?: 0) as Double
                            }
                            group.add(0, resultCalculation)
                            return group
                        } : [[calculator.execute { key ->
                        variables[key as String].head().head() as Double
                    }]]
                    Map total = [(node.title): formatAggregationSet(
                        res,
                        listIdsOfNormalAggregations,
                        request,
                        diagramType,
                        diagramType in DiagramType.CountTypes ? false : onlyFilled,
                        getPercentCntAggregationIndexes(request)
                    )]
                    return totalPrepareForNoFiltersResult(top, isDiagramTypeTable, tableHasBreakdown, formatResult(total, aggregationCnt), parameter,
                                                          parameterWithDate, parameterSortingType, aggregationSortingType, parameterWithDateOrDtInterval, diagramType, getPercentCntAggregationIndexes(request))
                default:
                    String message = messageProvider.getMessage(REQUISITE_IS_NOT_SUPPORTED_ERROR, currentUserLocale, nodeType: nodeType)
                    utils.throwReadableException("$message#${REQUISITE_IS_NOT_SUPPORTED_ERROR}")
            }
        }

        /**
         * Метод применения окончательных настроек для итогов запроса
         * @param top - настройки по ТОПу
         * @param isDiagramTypeTable - флаг на то, что диаграмма - таблица
         * @param tableHasBreakdown - наличие разбивки в таблице
         * @param total - итоговый датасет
         * @param parameter - значение параметра
         * @param parameterWithDate - флаг на наличие параметра с датой
         * @param parameterSortingType - сортировка параметра
         * @param aggregationSortingType - сортировка показателя
         * @param parameterWithDateOrDtInterval - флаг на наличие параметра с датой или временным интервалом
         * @param diagramType - тип диаграммы
         * @return готовый датасет
         */
        private List totalPrepareForNoFiltersResult(Integer top, Boolean isDiagramTypeTable,
                                                    Boolean tableHasBreakdown,
                                                    List total,
                                                    def parameter,
                                                    Boolean parameterWithDate,
                                                    String parameterSortingType,
                                                    String aggregationSortingType,
                                                    Boolean parameterWithDateOrDtInterval,
                                                    DiagramType diagramType,
                                                    List percentCntAggregationIndexes)
        {
            if (top)
            {
                if (isDiagramTypeTable && !tableHasBreakdown)
                {
                    def tempPaginationSettings = new PaginationSettings(pageSize: top,firstElementIndex: 0)
                    total = getDataSetWithPagination(total, tempPaginationSettings)
                }
                else
                {
                    total = getTop(total, top, [], [], true,
                                   parameterWithDate ? parameter : null,
                                   parameterSortingType, aggregationSortingType)
                }
            }

            Boolean nessecaryToSort = !parameterWithDateOrDtInterval &&
                                      (aggregationSortingType || parameterSortingType) &&
                                      (diagramType in DiagramType.SortableTypes || (top && isDiagramTypeTable))
            if (nessecaryToSort)
            {
                total = sortResList(total, aggregationSortingType, parameterSortingType, [], [], percentCntAggregationIndexes)
            }
            return total
        }
    }

    /**
     * Модель данных для диаграмм BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE
     */
    @TupleConstructor
    class StandardDiagram implements IHasTotals
    {
        /**
         * список значений для оси x
         */
        Collection<Object> labels = []
        /**
         * список значений Series
         */
        Collection<Series> series = []
    }

    /**
     * Модель данных для значений по y с разбивкой
     */
    @TupleConstructor
    class Series
    {
        /**
         * Значение разбивки
         */
        Object name = null
        /**
         * Список значений для y оси
         */
        Collection<Object> data = []
    }

    /**
     * Модель данных для диаграмм DONUT, PIE
     */
    @TupleConstructor
    class RoundDiagram implements IHasTotals
    {
        /**
         * список меток для построения диаграммы
         */
        Collection<Object> labels = []
        /**
         * список значений для построения диаграммы
         */
        Collection<Object> series = []
    }

    /**
     * Модель данных для диаграммы SUMMARY
     */
    @TupleConstructor
    class SummaryDiagram
    {
        /**
         * Название атрибута
         */
        String title
        /**
         * Значение атрибута с учетом выбранной агрегации
         */
        Object total
    }

    /**
     * Модель данных для диаграммы SPEEDOMETER
     */
    class SpeedometerDiagram extends SummaryDiagram
    {
        /**
         * Значение атрибута с учетом выбранной агрегации
         */
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Object min

        /**
         * Значение атрибута с учетом выбранной агрегации
         */
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Object max
    }

    /**
     * Модель данных для диаграммы TABLE
     */
    @TupleConstructor
    class TableDiagram implements IHasTotals
    {
        /**
         * Список значений Column
         */
        Collection<Column> columns = [new Column("", "breakdownTitle", "")]
        /**
         * Список значений строки
         */
        Collection<Map<String, Object>> data = []
        /**
         * Объект, отображающий превышения по пределам ограничений
         */
        LimitExceeded limitsExceeded
        /**
         * Количество строк в полном запросе
         */
        Integer total = 0
        /**
         * Данные о строках для таблицы без параметра
         */
        List<Map<String, Object>> rowsInfo
    }

    /**
     * Класс, описывающий флаги на превышение данных в БД относительно ограничений
     */
    class LimitExceeded
    {
        /**
         * флаг на превышение по параметру
         */
        Boolean parameter

        /**
         * флаг на превышение по разбивке
         */
        Boolean breakdown
    }

    /**
     * Модель для значений по column
     */
    @TupleConstructor
    class Column
    {
        /**
         * Заголовок Column
         */
        String header
        /**
         * Тип
         */
        String accessor
        /**
         * Итого по Column
         */
        String footer
        /**
         * Атрибут колонки
         */
        BaseAttribute attribute
        /**
         * Тип атрибута колонки
         */
        ColumnType type
        /**
         * Группа (есть у параметров/разбивки)
         */
        Group group
        /**
         * Агрегация (есть у показателей)
         */
        String aggregation
        /**
         * Настройки тултипа для показателя
         */
        TooltipSettings tooltip
        /**
         * Список колонок детей - значений разбивки
         */
        List<AggregationBreakdownColumn> columns
    }

    class NumberColumn extends Column
    {
        /**
         * флаг отображения колонки
         */
        boolean show
    }

    class AggregationColumn extends Column
    {
    }

    class AggregationBreakdownColumn extends Column
    {
        /**
         * Показатель, у которого берётся разбивка
         */
        Indicator indicator
    }

    class Indicator
    {
        /**
         * Агрегация (есть у показателей)
         */
        String aggregation
        /**
         * Атрибут показателя
         */
        BaseAttribute attribute
    }

    /**
     * Модель данных для диаграммы COMBO
     */
    @TupleConstructor
    class ComboDiagram implements IHasTotals
    {
        /**
         * список меток для построения диаграммы
         */
        Collection<Object> labels = []
        /**
         * список значений для построения диаграммы
         */
        Collection<SeriesCombo> series = []
    }

    /**
     * Модель данных для значений по y с разбивкой
     */
    @TupleConstructor
    class SeriesCombo
    {
        /**
         * Значение разбивки
         */
        String name = ""
        /**
         * Список значений для y оси
         */
        Collection<Object> data = []
        /**
         * Тип диаграммы
         */
        String type = ""
        /**
         * Uuid набора данных
         */
        String dataKey = ""
        /**
         * Значение разбивки
         */
        String breakdownValue = ""
    }

    class ResRow
    {
        /**
         * перечисления количеств [[уникальный ид: кол-во]]
         */
        List<Map> count
        /**
         * название Параметра
         */
        String key
        /**
         * значение Параметра
         */
        String value
        /**
         * родитель
         */
        ResRow parent
    }

    trait IHasTotals
    {
        /**
         *
         */
        Integer countTotals = 0
    }
