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

import groovy.json.JsonOutput
import groovy.transform.Field
import groovy.transform.TupleConstructor

import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.text.SimpleDateFormat
import java.util.concurrent.TimeUnit
import com.amazonaws.util.json.Jackson

import ru.naumen.core.server.script.api.injection.InjectApi

import static DiagramType.*

@Field @Lazy @Delegate DashboardDataSet dashboardDataSet = new DashboardDataSetImpl()

interface DashboardDataSet
{
    /**
     * Получение данных для диаграмм. Нужен для обратной совместимости.
     * @param requestContent тело запроса в формате @link RequestGetDataForDiagram
     * @param cardObjectUuid - идентификатор "текущего объекта"
     * @param widgetFilters - список пользовательских фильтров для виджетов
     * @return данные для построения диаграммы
     */
    String getDataForCompositeDiagram(String dashboardKey, String widgetKey, String cardObjectUuid, def widgetFilters)

    /**
     * Получение данных для таблиц. Нужен для обратной совместимости.
     * @param dashboardKey - ключ дашборда для построения виджета
     * @param widgetKey - ключ виджета
     * @param cardObjectUuid - уникальный идентификатор текущего объекта
     * @param tableRequestSettings - настройки для запроса по таблице
     * @param widgetFilters - список пользовательских фильтров для виджетов
     * @return данные для построения таблицы
     */
    String getDataForTableDiagram(String dashboardKey, String widgetKey, String cardObjectUuid,  def tableRequestSettings, def widgetFilters)
}

@InjectApi
class DashboardDataSetImpl implements DashboardDataSet
{
    DashboardDataSetService service = DashboardDataSetService.instance

    Object run()
    {
        return null
    }

    @Override
    String getDataForCompositeDiagram(String dashboardKey, String widgetKey, String cardObjectUuid, def widgetFilters)
    {
        if(widgetFilters)
        {
            widgetFilters = WidgetFilterResponse.getWidgetFiltersCollection(widgetFilters)
        }
        return api.tx.call {
            service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid, widgetFilters)
        }.with(JsonOutput.&toJson)
    }

    @Override
    String getDataForTableDiagram(String dashboardKey, String widgetKey, String cardObjectUuid,  def tableRequestSettings, def widgetFilters)
    {
        tableRequestSettings = new TableRequestSettings(tableRequestSettings)
        if(widgetFilters)
        {
            widgetFilters = WidgetFilterResponse.getWidgetFiltersCollection(widgetFilters)
        }
        return api.tx.call {
            service.buildDiagram(dashboardKey, widgetKey, cardObjectUuid, widgetFilters, tableRequestSettings)
        }.with(JsonOutput.&toJson)
    }
}

@InjectApi
@Singleton
class DashboardDataSetService
{
    DashboardSettingsService dashboardSettingsService = DashboardSettingsService.instance

    private static final List<String> NOMINATIVE_RUSSIAN_MONTH = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                                                                  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
    private static final List<String> GENITIVE_RUSSIAN_MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                                                                'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormatSymbols().with {
        setDecimalSeparator('.' as char)
        new DecimalFormat("#.##", it)
    }

    private static final String blankData = 'Не заполнено'

    /**
     * Метод по получению тела запроса по метаданным из хранилища по ключу дашборда и виджета
     * @param dashboardKey - ключ дашборда
     * @param widgetKey - ключ виджета
     * @return тело запроса
     */
    Widget getWidgetSettingsByDashboardAndWidgetKey(String dashboardKey, String widgetKey)
    {
        DashboardSettingsClass dbSettings = dashboardSettingsService.getDashboardSetting(dashboardKey)
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
            throw new IllegalArgumentException('Widget is not found!')
        }
    }

    /**
     * Метод построения диаграмм.
     * @param dashboardKey - ключ дашборда
     * @param widgetKey - ключ виджета
     * @param subjectUUID - идентификатор "текущего объекта"
     * @param widgetFilters - список пользовательских фильтров для виджета
     * @param tableRequestSettings - настройки для запроса по таблице
     * @return Типизированниые данные для построения диаграмм
     */
    private def buildDiagram(String dashboardKey,
                             String widgetKey,
                             String subjectUUID,
                             Collection<WidgetFilterResponse> widgetFilters = [],
                             TableRequestSettings tableRequestSettings = null)
    {
        def widgetSettings = getWidgetSettingsByDashboardAndWidgetKey(dashboardKey, widgetKey)
        def diagramType = widgetSettings.type as DiagramType
        String templateUUID = getTemplateUUID(widgetSettings)
        def request
        def res
        Integer rowCount
        PaginationSettings paginationSettings
        def tableSorting
        Boolean reverseRowCount = false
        if (diagramType == DiagramType.TABLE)
        {
            Boolean requestHasBreakdown = checkForBreakdown(widgetSettings)
            Boolean showTableNulls = widgetSettings.showEmptyData
            Integer pageSize
            Integer firstElementIndex
            paginationSettings

            if(tableRequestSettings)
            {
                pageSize = tableRequestSettings.pageSize
                firstElementIndex = pageSize * (tableRequestSettings.pageNumber - 1)
                paginationSettings = new PaginationSettings(pageSize: pageSize, firstElementIndex: firstElementIndex)
            }
            Boolean computationInTableRequest = widgetSettings?.data?.any { it.indicators?.any { it?.attribute?.any { it.type == 'COMPUTED_ATTR'} } }
            Integer tableTop = widgetSettings.top?.show ? widgetSettings.top?.count as Integer : null
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
                                            widgetFilters, showTableNulls,
                                            computationInTableRequest, tableTop, tableSorting)
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

            Boolean noPaginationInSQL = requestHasBreakdown || innerCustomGroupNames || sortingValueIsComputationAttribute
            res = getDiagramData(request, diagramType, templateUUID, aggregationCnt, widgetSettings,
                                 tableRequestSettings?.ignoreLimits, noPaginationInSQL ? null : paginationSettings)
            rowCount = requestHasBreakdown && computationInTableRequest
                ? rowCount
                : getDiagramData(request, diagramType, templateUUID,
                                 aggregationCnt, widgetSettings,
                                 tableRequestSettings?.ignoreLimits)?.find()?.size() //получаем данные,
            //чтобы получить актуальное количество строк для таблицы

            if (computationInTableRequest)
            {
                //а здесь уже важно знать, выводить пустые значения или нет
                showTableNulls = widgetSettings.showEmptyData
                res = prepareDataSet(res, widgetSettings, showTableNulls, requestHasBreakdown)

                rowCount = requestHasBreakdown
                    ? rowCount
                    : prepareDataSet(getDiagramData(request, diagramType, templateUUID,
                                                    aggregationCnt, widgetSettings,
                                                    tableRequestSettings?.ignoreLimits), widgetSettings,
                                                    showTableNulls, requestHasBreakdown)?.find()?.size()
            }
        }
        else
        {
            request = mappingDiagramRequest(widgetSettings, subjectUUID, diagramType, widgetFilters)
            res = getDiagramData(request, diagramType, templateUUID)
        }
        switch (diagramType)
        {
            case [*DiagramType.StandardTypes]:
                String key = request.data.keySet().head()
                String legend = request.data[key].aggregations.attribute.sourceName.head()
                Boolean reverseGroups = isCustomGroupFromBreakdown(widgetSettings)
                Boolean changeLabels = widgetSettings?.sorting?.value == SortingValue.PARAMETER
                Boolean reverseLabels = widgetSettings?.sorting?.type == SortingType.DESC && changeLabels

                String format = getValueFromParameter(widgetSettings, 'format')
                String groupFormat =  getValueFromParameter(widgetSettings, 'data')

                return mappingStandardDiagram(res, legend, reverseGroups, changeLabels, reverseLabels, format, groupFormat)
            case DiagramType.RoundTypes:
                return mappingRoundDiagram(res)
            case DiagramType.CountTypes:
                return mappingSummaryDiagram(res)
            case TABLE:
                def (totalColumn, showRowNum) = [widgetSettings.calcTotalColumn,
                                                 widgetSettings.table.body.showRowNum]

                return mappingTableDiagram(res, totalColumn as boolean,
                                           showRowNum as boolean, rowCount,
                                           paginationSettings, tableSorting, reverseRowCount,
                                           widgetSettings, request, tableRequestSettings?.ignoreLimits)
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
                                           changeLabels, reverseLabels, customsInBreakdown, sortingDataIndex)
            default: throw new IllegalArgumentException("Not supported diagram type: $diagramType")
        }
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
            if (xAxis.attribute.type in AttributeType.DATE_TYPES && xAxis.group.way == Way.SYSTEM)
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
            if(groups instanceof Map)
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
                    def attr = group.attribute.deepClone()
                    attr.code = "${it?.source?.classFqn}.${attr.code}"
                    group.attribute = attr
                    return group
                }
            }
            return groups ? groups : []
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
            def tempRequestData = requestData.clone()
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
     * @param showTableNulls - флаг на отображение пустых значений, если диаграмма типа таблица
     * @param computationInTableRequest - флаг на наличие вычислений в запросе, если диаграмма типа таблица
     * @param tableTop - количество записей, которое нужно вывести, если диаграмма типа таблица
     * @param tableSorting - сортировка на таблице
     * @return DiagramRequest
     */
    private DiagramRequest mappingDiagramRequest(def widgetSettings, String subjectUUID,
                                                 DiagramType diagramType, Collection<WidgetFilterResponse> widgetFilters,
                                                 Boolean showTableNulls = false,
                                                 Boolean computationInTableRequest = false, Integer tableTop = 0,
                                                 Sorting tableSorting = null)
    {
        def sorting
        def uglyRequestData = widgetSettings.data
        Boolean isDiagramTypeTable = diagramType == DiagramType.TABLE
        Boolean hasTableNotOnlyBaseSources = (widgetSettings?.data*.source.value.value as Set).size() > 1
        Boolean isDiagramTypeNotCount = !(diagramType in [DiagramType.CountTypes, DiagramType.RoundTypes])
        Boolean isDiagramTypeCount = diagramType in DiagramType.CountTypes
        def commonBreakdown
        if(!isDiagramTypeCount && !isDiagramTypeTable)
        {
            sorting = widgetSettings.sorting
        }
        def intermediateData = [:]
        uglyRequestData.each { data ->
            def descriptor = DashboardMarshaller.substitutionCardObject(data.source.descriptor as String, subjectUUID)
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
                    sortingType: sortingType
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
            breakdownMap = isDiagramTypeTable && !hasTableNotOnlyBaseSources && !mayBeBreakdown && commonBreakdown
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
                        breakdownMap = mayBeBreakdown.collectEntries { el ->
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
                        throw new IllegalArgumentException("Does not match group types: $groupTypes")
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
            if (dynamicInBreakdown)
            {
                breakdownCustomGroup = dynamicGroup
            }
            FilterList breakdownFilter = getFilterList(breakdownCustomGroup, subjectUUID, 'breakdown')
            if ((dynamicInAggregate || dynamicInParameter) && !parameterFilters)
            {
                parameterFilters << getFilterList(dynamicGroup,
                                                  subjectUUID,
                                                  'parameter',
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
                Boolean showBlank = isDiagramTypeTable ? false : data.showBlankData as Boolean
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
                              widgetSettings?.data*.sourceForCompute?.count { !it } > 1 &&
                              hasTableNotOnlyBaseSources
        def prevData = intermediateData
        if(manySources)
        {
            Integer countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(widgetSettings)
            intermediateData = updateIntermediateDataToOneSource(intermediateData, computationInTableRequest, countOfCustomsInFirstSource)
        }
        if(computationInTableRequest)
        {
            intermediateData = updateIntermediateData(intermediateData)
            def request = buildDiagramRequest(intermediateData, subjectUUID, diagramType)

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
                if(api.metainfo.checkAttributeExisting(currentSource.classFqn, prevDataSource.classFqn))
                {
                    request?.data[it?.currentKey]?.source = prevDataSource
                }
            }
            return request
        }
        return buildDiagramRequest(intermediateData, subjectUUID, diagramType)
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
        if(baseDescriptorAttributes - userDescriptorAttributes && !(userDescriptorAttributes - baseDescriptorAttributes))
        {
            def filters = descriptorMap.filters
            def userFilters = userDescriptorMap.filters
            descriptorMap.filters = putUserFiltersIntoBase(userFilters, filters, userDescriptorAttributes)
        }
        else if(userDescriptorAttributes - baseDescriptorAttributes && !(baseDescriptorAttributes - userDescriptorAttributes))
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
    List<List> putUserFiltersIntoBase(def userFilters, def filters, List userDescriptorAttributes)
    {
        return filters.collect { filterValue->
            filterValue.each { filtering ->
                def attribute = filtering.properties.attributeFqn
                if(attribute in userDescriptorAttributes)
                {
                    def newFilter = userFilters.collectMany {userFilterValue->
                        userFilterValue.findResults { filter ->
                            if(filter.properties.attributeFqn == attribute)
                            {
                                return filter
                            }
                        }
                    }
                    filterValue = newFilter
                }
            }
            return filterValue
        }
    }

    /**
     * Метод по получению fqn-кодов атрибутов из фильтра источника
     * @param descriptor - фильтр источника
     * @return список fqn-кодов атрибутов
     */
    private List<String> getAttributesFqnFromDescriptor(String descriptor)
    {
        List descriptorAttributes = []
        def iDesciptor = api.listdata.createListDescriptor(descriptor).wrapped

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
        return groupType?.way == Way.SYSTEM ? new GroupParameter(
            title: title,
            type: Attribute.getAttributeType(attr) == AttributeType.DT_INTERVAL_TYPE
                ? DashboardUtils.getDTIntervalGroupType(groupType.data as String)
                : groupType.data as GroupType,
            attribute: attr,
            format: groupType.format
        ) : null
    }

    /**
     * Метод создания запроса для QueryWrapper
     * @param intermediateData - промежуточные данные сгруппированые по первичному признаку
     * @param subjectUUID - идентификатор "текущего объекта"
     * @param diagramType - тип диаграммы
     * @return DiagramRequest
     */
    private DiagramRequest buildDiagramRequest(Map<String, Map> intermediateData, String subjectUUID, DiagramType diagramType = DiagramType.COMBO)
    {
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
        return new DiagramRequest(requisite: requisite, data: resultRequestData)
    }

    /**
     * Метод обработки вычислений
     * @param getData - функция получения источника данных по ключю
     * @param diagramType - тип диаграммы
     * @param map - данные для вычислений
     * @return сгруппированные данные по названию переменной и источнику данных
     */
    private Map<String, RequestData> produceComputationData(Closure getData, DiagramType diagramType, Map map)
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
                if (attributeType in AttributeType.LINK_TYPES)
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
                if (attributeType in AttributeType.LINK_TYPES)
                {
                    attribute.attrChains().last().ref = new Attribute(title: 'Название', code: 'title', type: 'string')
                }
                def dataKey = comp.dataKey as String
                // этот ключ указывает на источник вместе с группировками
                def requestData = getData(dataKey) as RequestData
                def newRequestData = requestData.clone()
                def group = comp.group as GroupParameter
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
     * @return функция преобразования настроек пользовательской группировки
     */
    private Closure<Collection<Collection<FilterParameter>>> getMappingFilterMethodByType(String type, String subjectUUID)
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
                return this.&mappingDateTypeFilters
            case AttributeType.STATE_TYPE:
                return this.&mappingStateTypeFilters.curry(subjectUUID)
            case [AttributeType.BO_LINKS_TYPE, AttributeType.BACK_BO_LINKS_TYPE, AttributeType.OBJECT_TYPE]:
                return this.&mappingLinkTypeFilters.curry(subjectUUID)
            case [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE]:
                return this.&mappingCatalogItemTypeFilters.curry(subjectUUID)
            case AttributeType.META_CLASS_TYPE:
                return this.&mappingMetaClassTypeFilters.curry(subjectUUID)
            case AttributeType.TIMER_TYPES:
                return this.&mappingTimerTypeFilters
            default:
                throw new IllegalArgumentException("Not supported attribute type: $type in custom group")
        }
    }

    /**
     * Метод преодбразований настроек группировки для динамических атрибутов
     * @param subjectUUID - идентификатор "текущего объекта"
     * @param data - настройки группировки
     * @param attribute - атрибут к которому привязана группировка
     * @param title - название группировки
     * @return настройки группировки в удобном формате
     */
    private List<List<FilterParameter>> getDynamicFilter(List<List> data, Attribute attribute, String title, String id)
    {
        String templateUUID = TotalValueMarshaller.unmarshal(attribute?.code).last()
        return mappingFilter(data) { condition ->
            def value = api.utils.get(templateUUID)
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
        def possibleFilter = mappingFilter(data) { condition ->
            String conditionType = condition.type
            switch (conditionType.toLowerCase())
            {
                case 'empty':
                    return new FilterParameter(
                        value: null,
                        title: title,
                        id: id,
                        type: Comparison.IS_NULL,
                        attribute: attribute
                    )
                case 'not_empty':
                    return new FilterParameter(
                        value: null,
                        title: title,
                        id: id,
                        type: Comparison.NOT_NULL,
                        attribute: attribute
                    )
                case 'contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    def value = api.utils.get(uuid)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL,
                        attribute: attribute
                    )
                case 'not_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    def value = api.utils.get(uuid)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.NOT_EQUAL,
                        attribute: attribute
                    )
                case 'contains_any':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def uuids = condition.data*.uuid
                    def values = uuids.collect { uuid -> api.utils.get(uuid)
                    }
                    return new FilterParameter(
                        value: values,
                        title: title,
                        id: id,
                        type: Comparison.IN,
                        attribute: attribute
                    )
                case 'title_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    return new FilterParameter(
                        value: condition.data,
                        title: title,
                        id: id,
                        type: Comparison.CONTAINS,
                        attribute: attribute
                    )
                case 'title_not_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    return new FilterParameter(
                        value: condition.data,
                        title: title,
                        id: id,
                        type: Comparison.NOT_CONTAINS,
                        attribute: attribute
                    )
                case 'contains_current_object':
                    def value = api.utils.get(subjectUUID)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL,
                        attribute: attribute
                    )
                case ['contains_attr_current_object', 'equal_attr_current_object']:
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def code = condition.data.code
                    def value = api.utils.get(subjectUUID)[code]
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL,
                        attribute: attribute
                    )
                default:
                    throw new IllegalArgumentException("Not supported condition type: $conditionType")
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
        def possibleFilter = mappingFilter(data) { condition ->
            String conditionType = condition.type
            switch (conditionType.toLowerCase())
            {
                case 'empty':
                    return new FilterParameter(
                        value: null,
                        title: title,
                        id: id,
                        type: Comparison.IS_NULL,
                        attribute: attribute
                    )
                case 'not_empty':
                    return new FilterParameter(
                        value: null,
                        title: title,
                        id: id,
                        type: Comparison.NOT_NULL,
                        attribute: attribute
                    )
                case 'contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    def value = api.utils.get(uuid)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL,
                        attribute: attribute
                    )
                case 'not_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    def value = api.utils.get(uuid)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.NOT_EQUAL,
                        attribute: attribute
                    )
                case 'in':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def uuids = condition.data*.uuid
                    def values = uuids.collect { uuid -> api.utils.get(uuid)
                    }
                    return new FilterParameter(
                        value: values,
                        title: title,
                        id: id,
                        type: Comparison.IN,
                        attribute: attribute
                    )
                case 'title_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    return new FilterParameter(
                        value: condition.data,
                        title: title,
                        id: id,
                        type: Comparison.CONTAINS,
                        attribute: attribute
                    )
                case 'title_not_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    return new FilterParameter(
                        value: condition.data,
                        title: title,
                        id: id,
                        type: Comparison.NOT_CONTAINS,
                        attribute: attribute
                    )
                case 'contains_including_archival':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    def value = api.utils.get(uuid)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL_REMOVED,
                        attribute: attribute
                    )
                case 'not_contains_including_archival':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def value = condition.data.uuid
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.NOT_EQUAL_REMOVED,
                        attribute: attribute
                    )
                case 'contains_including_nested':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    def value = api.utils.get(uuid)
                    def nestedVaues =  api.utils.getNested(value)
                    return new FilterParameter(
                        value: [value, *nestedVaues],
                        title: title,
                        id: id,
                        type: Comparison.IN,
                        attribute: attribute
                    )
                case 'contains_any':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def uuids = condition.data*.uuid
                    def values = uuids.collect { uuid -> api.utils.get(uuid)
                    }
                    return new FilterParameter(
                        value: values,
                        title: title,
                        id: id,
                        type: Comparison.IN,
                        attribute: attribute
                    )
                case ['contains_current_object', 'equal_current_object']:
                    def value = api.utils.get(subjectUUID)
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL,
                        attribute: attribute
                    )
                case ['equal_attr_current_object', 'contains_attr_current_object']:
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def code = condition.data.code
                    def value = api.utils.get(subjectUUID)[code]
                    return new FilterParameter(
                        value: value,
                        title: title,
                        id: id,
                        type: Comparison.EQUAL,
                        attribute: attribute
                    )
                default:
                    throw new IllegalArgumentException("Not supported condition type: $conditionType")
            }
        }
        return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
    }

    /**
     * Метод преодбразований настроек группировки для временных интервалов
     * @param data - настройки группировки
     * @param attribute - атрибут к которому привязана группировки
     * @param title - название группировки
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
                    ? api.types.newDateTimeInterval([interval.value as long, interval.type as String])
                    : null
                //Важный момент. Обязательно извлекать милисекунды, так как критерия не может это сделать сама.
                new FilterParameter(value: value, title: title,
                                    id: id, type: type, attribute: attribute)
            }
            switch (conditionType.toLowerCase())
            {
                case 'empty':
                    return buildFilterParameterFromCondition(Comparison.IS_NULL)
                case 'not_empty':
                    return buildFilterParameterFromCondition(Comparison.NOT_NULL)
                case 'equal':
                    return buildFilterParameterFromCondition(Comparison.EQUAL)
                case 'not_equal':
                    return buildFilterParameterFromCondition(Comparison.NOT_EQUAL)
                case 'greater':
                    return buildFilterParameterFromCondition(Comparison.GREATER)
                case 'less':
                    return buildFilterParameterFromCondition(Comparison.LESS)
                default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
            }
        }
        return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
    }

    /**
     * Метод преодбразований настроек группировки для строковых типов
     * @param data - настройки группировки
     * @param attribute - атрибут к которому привязана группировки
     * @param title - название группировки
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
            switch (conditionType.toLowerCase())
            {
                case 'contains':
                    return buildFilterParameterFromCondition(Comparison.CONTAINS)
                case 'not_contains_including_empty':
                    return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS_INCLUDING_EMPTY)
                case 'not_contains':
                    return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS)
                case 'empty':
                    return buildFilterParameterFromCondition(Comparison.IS_NULL)
                case 'not_empty':
                    return buildFilterParameterFromCondition(Comparison.NOT_NULL)
                default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
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
            switch (conditionType.toLowerCase())
            {
                case 'equal':
                    return buildFilterParameterFromCondition(Comparison.EQUAL) as FilterParameter
                case 'not_equal_not_empty':
                    return buildFilterParameterFromCondition(Comparison.NOT_EQUAL_AND_NOT_NULL) as FilterParameter
                case 'not_equal':
                    return buildFilterParameterFromCondition(Comparison.NOT_EQUAL) as FilterParameter
                case 'greater':
                    return buildFilterParameterFromCondition(Comparison.GREATER) as FilterParameter
                case 'less':
                    return buildFilterParameterFromCondition(Comparison.LESS) as FilterParameter
                case 'empty':
                    return buildFilterParameterFromCondition(Comparison.IS_NULL) as FilterParameter
                case 'not_empty':
                    return buildFilterParameterFromCondition(Comparison.NOT_NULL) as FilterParameter
                default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
            }
        }
        return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
    }

    /**
     * Метод преодбразований настроек группировки для dateTime типов
     * @param valueConverter - функция преодразования строки в число
     * @param data - настройки группировки
     * @param attribute - атрибут к которому привязана группировки
     * @param title - название группировки
     * @return настройки группировки в удобном формате
     */
    private List<List<FilterParameter>> mappingDateTypeFilters(List<List> data, Attribute attribute, String title, String id)
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
            Closure<FilterParameter> buildFilterParameterFromCondition = { value, type ->
                return new FilterParameter(
                    title: title,
                    id: id,
                    type: type,
                    attribute: attribute,
                    value: value
                )
            }
            switch (conditionType.toLowerCase())
            {
                case 'empty':
                    return buildFilterParameterFromCondition(null, Comparison.IS_NULL)
                case 'not_empty':
                    return buildFilterParameterFromCondition(null, Comparison.NOT_NULL)
                case 'today':
                    return buildFilterParameterFromCondition(null, Comparison.TODAY)
                case 'last':
                    def count = condition.data as int
                    return buildFilterParameterFromCondition(count, Comparison.LAST_N_DAYS)
                case 'last_hours':
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
                    return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                case 'near':
                    def count = condition.data as int
                    def start = Calendar.instance.with {
                        set(HOUR_OF_DAY, 0)
                        set(MINUTE, 0)
                        set(SECOND, 0)
                        set(MILLISECOND, 0)
                        getTime()
                    }
                    def end = Calendar.instance.with {
                        add(DAY_OF_MONTH, count)
                        set(HOUR_OF_DAY, 23)
                        set(MINUTE, 59)
                        set(SECOND, 59)
                        set(MILLISECOND, 999)
                        getTime()
                    }
                    return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                case 'near_hours':
                    def count = condition.data as int
                    def start = Calendar.instance.with {
                        set(HOUR_OF_DAY, 0)
                        set(MINUTE, 0)
                        set(SECOND, 0)
                        set(MILLISECOND, 0)
                        getTime()
                    }
                    def end = Calendar.instance.with {
                        add(DAY_OF_MONTH, 0)
                        set(HOUR_OF_DAY, count)
                        set(MINUTE, 59)
                        set(SECOND, 59)
                        set(MILLISECOND, 999)
                        getTime()
                    }
                    return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                case 'between':
                    def dateSet = condition.data as Map<String, Object> // тут будет массив дат или одна из них
                    def start
                    if(dateSet.startDate)
                    {
                        String dateFormat = DashboardUtils.getDateFormatByDate(dateSet.startDate)
                        start = Date.parse(dateFormat, dateSet.startDate as String)
                    }
                    else
                    {
                        if(attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE))
                        {
                            def tempAttr = attribute.deepClone()
                            tempAttr.title = TotalValueMarshaller.unmarshal(tempAttr.code).last()
                            minDate = DashboardUtils.getMinDateDynamic(tempAttr,source)
                        }else
                        {
                            minDate = DashboardUtils.getMinDate(attribute.code.attrChains().join('.'), attribute.sourceCode)
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
                    return buildFilterParameterFromCondition([start, end], Comparison.BETWEEN)
                default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
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
     * @return настройки группировки в удобном формате
     */
    private List<List<FilterParameter>> mappingStateTypeFilters(String subjectUUID,List<List> data, Attribute attribute, String title, String id)
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
            switch (conditionType.toLowerCase()) {
                case 'contains':
                    return buildFilterParameterFromCondition(Comparison.EQUAL, attribute, condition.data.uuid)
                case 'not_contains':
                    return buildFilterParameterFromCondition(Comparison.NOT_EQUAL, attribute, condition.data.uuid)
                case 'contains_any':
                    return buildFilterParameterFromCondition(Comparison.IN, attribute, condition.data.uuid)
                case 'title_contains':
                    return buildFilterParameterFromCondition(Comparison.STATE_TITLE_CONTAINS, attribute, condition.data)
                case 'title_not_contains':
                    return buildFilterParameterFromCondition(Comparison.STATE_TITLE_NOT_CONTAINS, attribute, condition.data)
                case ['equal_subject_attribute', 'equal_attr_current_object']:
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def code = condition.data.code
                    def value = api.utils.get(subjectUUID)[code]
                    def subjectAttribute = condition.data
                    def subjectAttributeType = subjectAttribute.type
                    if (subjectAttributeType != attribute.type)
                    {
                        throw new IllegalArgumentException("Does not match attribute type: $subjectAttributeType")
                    }
                    return new FilterParameter(value: value, title: title,
                                               id: id, type: Comparison.EQUAL, attribute: attribute)
                default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
            }
        }
        return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
    }

    /**
     * Метод преодбразований настроек группировки для таймеров
     * @param data - настройки группировки
     * @param attribute - атрибут к которому привязана группировки
     * @param title - название группировки
     * @return настройки группировки в удобном формате
     */
    private List<List<FilterParameter>> mappingTimerTypeFilters(List<List> data, Attribute attribute, String title, String id)
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
                return new FilterParameter(title: title,
                                           id: id, type: comparison, attribute: attr, value: value)
            }
            switch (conditionType.toLowerCase())
            {
                case 'status_contains':
                    def status = condition.data.value.toString()
                    String value = status.toLowerCase().charAt(0)
                    def temAttribute = attribute.deepClone()
                    temAttribute.addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                    return buildFilterParameterFromCondition(Comparison.CONTAINS, temAttribute, value)
                case 'status_not_contains':
                    def status = condition.data.value.toString()
                    String value = status.toLowerCase().charAt(0)
                    def temAttribute = attribute.deepClone()
                    temAttribute.addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                    return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS, temAttribute, value)
                case 'expiration_contains':
                    def comparison = condition.data.value == 'EXCEED'
                        ? Comparison.CONTAINS
                        : Comparison.NOT_CONTAINS
                    def temAttribute = attribute.deepClone()
                    temAttribute.addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                    return buildFilterParameterFromCondition(comparison, temAttribute, 'e')
                case 'expires_between': // Время окончания в диапазоне
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

                        if(attribute.code.contains(AttributeType.TOTAL_VALUE_TYPE))
                        {
                            def tempAttr = attribute.deepClone()
                            tempAttr.title = TotalValueMarshaller.unmarshal(tempAttr.code).last()
                            minDate = DashboardUtils.getMinDateDynamic(tempAttr,source)
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
                default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
            }
        }
        return attrIsDynamic ? dynamicFilter + possibleFilter : possibleFilter
    }

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
        def possibleFilter = mappingFilter(data) { condition ->
            String conditionType = condition.type
            switch (conditionType.toLowerCase())
            {
                case 'contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    return new FilterParameter(value: uuid, title: title,
                                               id: id, type: Comparison.CONTAINS, attribute: attribute)
                case 'not_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    String uuid = condition.data.uuid
                    return new FilterParameter(value: uuid, title: title,
                                               id: id, type: Comparison.NOT_CONTAINS, attribute: attribute)
                case 'contains_any':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def uuids = condition.data*.uuid
                    return new FilterParameter(value: uuids, title: title,
                                               id: id, type: Comparison.CONTAINS, attribute: attribute)
                case 'title_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    return new FilterParameter(value: condition.data, title: title,
                                               id: id, type: Comparison.METACLASS_TITLE_CONTAINS, attribute: attribute)
                case 'title_not_contains':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    return new FilterParameter(value: condition.data, title: title,
                                               id: id, type: Comparison.METACLASS_TITLE_NOT_CONTAINS, attribute: attribute)
                case 'equal_attr_current_object':
                    if (!condition.data)
                    {
                        throw new IllegalArgumentException("Condition data is null or empty")
                    }
                    def code = condition.data.code
                    def value = api.utils.get(subjectUUID)[code]
                    return new FilterParameter(value: value, title: title,
                                               id: id, type: Comparison.EQUAL, attribute: attribute)
                default:
                    throw new IllegalArgumentException("Not supported condition type: $conditionType")
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
     * @param diagramType - тип диаграммы
     * @param templateUUID - ключ шаблона для динамических атрибутов
     * @param aggregationCnt - количество агрегаций
     * @param requestContent - тело запроса
     * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
     * @param paginationSettings - настройки для пагинации в таблице
     * @return сырые данные из Бд по запросу
     */
    private def getDiagramData(DiagramRequest request, DiagramType diagramType = DiagramType.DONUT,
                               String templateUUID = '',
                               Integer aggregationCnt = 1, def requestContent = null,
                               IgnoreLimits ignoreLimits = new IgnoreLimits(),
                               PaginationSettings paginationSettings = null)
    {
        assert request: "Empty request!"
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
                        def listIdsOfNormalAggregations = diagramType == DiagramType.TABLE
                            ? request?.data?.findResult { key, value ->
                            value?.aggregations?.withIndex()?.findResults { val, i ->
                                if (val.type != Aggregation.NOT_APPLICABLE)
                                    return i
                            }
                        } : [0]
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
                        if(!filtering)
                        {
                            return getNoFilterListDiagramData(node, request, aggregationCnt, top, notBlank, onlyFilled, diagramType, requestContent, ignoreLimits, paginationSettings)
                        }
                        RequestData newRequestData = requestData.clone()
                        Closure formatAggregation = this.&formatAggregationSet.rcurry(listIdsOfNormalAggregations, onlyFilled)
                        Closure formatGroup = this.&formatGroupSet.rcurry(newRequestData, listIdsOfNormalAggregations, diagramType)
                        def res = filtering?.withIndex()?.collectMany { filters, i ->
                            newRequestData.filters = filters
                            def res = DashboardQueryWrapperUtils.getData(newRequestData, top, notBlank, diagramType, ignoreLimits.parameter ?: false, templateUUID, paginationSettings)
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
                            def partial = (customInBreakTable || onlyFilled) && !res ? [:] :[(filtersTitle): res]

                            partial = formatResult(partial, aggregationCnt + notAggregatedAttributes.size())
                            Boolean hasState = newRequestData?.groups?.any { value -> Attribute.getAttributeType(value?.attribute) == AttributeType.STATE_TYPE } ||
                                               newRequestData?.aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) == AttributeType.STATE_TYPE  }
                            if (hasState)
                            {
                                partial = prepareRequestWithStates(partial, listIdsOfNormalAggregations)
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
                            return sortResList(res, aggregationSortingType, parameterSortingType, parameterFilters, breakdownFilters)
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
                            return getNoFilterListDiagramData(node, request, aggregationCnt, top, notBlank, onlyFilled, diagramType, requestContent, ignoreLimits, paginationSettings)
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
                                def res = DashboardQueryWrapperUtils.getData(newData as RequestData, top, notBlank, diagramType, ignoreLimits.parameter ?: false, templateUUID, paginationSettings)
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
                        Boolean hasState = groups?.any { value -> Attribute.getAttributeType(value?.attribute) == AttributeType.STATE_TYPE } ||
                                           aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) == AttributeType.STATE_TYPE }
                        def res = variables.withIndex().collectMany { totalVar, j ->
                            def res = groups?.size() || notAggregatedAttributes.size() ?
                                findUniqueGroups([0], totalVar).collect { group ->
                                    def resultCalculation = calculator.execute { variable ->
                                        hasState
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
                            res = formatAggregationSet(res, listIdsOfNormalAggregations, onlyFilled)
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
                            return sortResList(res, aggregationSortingType, parameterSortingType, parameterFilters, breakdownFilters)
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
        if(filterListSize == 1)
        {
            if ((parameterFilters && i < top) || !top)
            {
                return res
            }
            else if(breakdownFilters && top)
            {
                return res.size() > top ? res[0..top-1] : res
            }
            else
            {
                return []
            }
        }
        else
        {
            if (top && res.size() > top)
            {
                return res[0..top - 1]
            }
            return res
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
        return requestContent.data.findIndexOf {it == dataKeyForSorting }
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
     * @param exceptNulls - убирать 0
     * @return список округлённых числовых значений
     */
    private List formatAggregationSet(List listOfLists, List listIdsOfNormalAggregations, Boolean exceptNulls = false)
    {
        if (listIdsOfNormalAggregations.size() < 1)
        {
            return listOfLists
        }

        return listOfLists.findResults { List list ->
            if (exceptNulls && list[listIdsOfNormalAggregations*.toLong()].every { !it || it == 0 })
            {
                return null
            }

            if (listIdsOfNormalAggregations.size() > 0)
            {
                listIdsOfNormalAggregations.each { index ->
                    list[index] = list[index] = list[index] && !(list[index].toDouble().isNaN() || list[index].toDouble().isInfinite())
                        ? DECIMAL_FORMAT.format(list[index] as Double)
                        : DECIMAL_FORMAT.format(0)
                }
                return list
            }
        }
    }

    /**
     * Метод приведения значений группировок к читаемому для человека виду
     * @param data - данные запроса
     * @param list - результат выборки
     * @param data - данные запроса
     * @param listIdsOfNormalAggregations - список индексов нормальных агрегаций
     * @param diagramType - тип диаграммы
     * @return результат выборки с изменёнными значениями группировки
     */
    private List formatGroupSet(List list, RequestData data, List listIdsOfNormalAggregations, DiagramType diagramType)
    {
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
                def groups = el //резервируем значения для групп
                def elAggregations = el[listIdsOfNormalAggregations] //резервируем значения для агрегаций
                elAggregations.each { groups.remove (groups.indexOf(it)) } //убираем в группах агрегации

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
                        String userEq = stateValue ? api.metainfo.getStateTitle(totalFqn, stateValue) : null
                        return userEq ? StateMarshaller.marshal(userEq, stateValue) : ""
                    case AttributeType.META_CLASS_TYPE:
                        def userEq = api.metainfo.getMetaClass(value).title
                        return MetaClassMarshaller.marshal(userEq, value)
                    case AttributeType.BOOL_TYPE:
                        String viewMode = api.metainfo.getMetaClass(fqnClass)
                                             .getAttribute(parameter.attribute.code)
                                             .viewPresentation
                        if (viewMode == "Presentation 'yesNo'") {
                            return api.utils.formatters.yesNoFormatter(value.toBoolean())
                        } else {
                            return api.utils.formatters.oneZeroFormatter(value.toBoolean())
                        }
                    case AttributeType.TIMER_TYPES:
                        if(!value)
                        {
                            return getNullValue(diagramType, fromBreakdown)
                        }
                        return (value as TimerStatus).getRussianName()
                    case AttributeType.DATE_TYPES:
                        if(!value)
                        {
                            return getNullValue(diagramType, fromBreakdown)
                        }
                        if(value instanceof Date)
                        {
                            return value.format('dd.MM.yyyy hh:mm')
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
                        value = value ?: getNullValue(diagramType, fromBreakdown)
                        return value.toString().replaceAll("\\<.*?>","")
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
                        return value.format('dd.MM.yyyy hh:mm')
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
                    minDate = DashboardUtils.getMinDateDynamic(tempAttr, source)
                }else
                {
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
            default: throw new IllegalArgumentException("Not supported type: $type")
        }
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

        if(tempValue < 1)
        {
            tempValue = getRealValueFromDB(millis as Long, type)
            //получаем долю
            def fractionalPart = Double.toString(tempValue).tokenize('.').last() //берем часть после точки
            def roundIdx = fractionalPart.contains('E') //значение может быть в экспоненциальной записи
                ? fractionalPart.dropWhile { it != '-' }.toCharArray()[-1].toString() as Long //тогда берем число после нее - ровно столько нулей стоит до числа
                : fractionalPart.takeWhile{it == '0'}.size() + 1 //иначе идём по числу до тех пор, пока не пройдут все нули и берем + 1 значение
            roundIdx += 1 //округляем наконец до двух чисел после всех нулей в дробной части

            String formatStr = '#' * roundIdx

            def dtIntervalDecimalFormat = new DecimalFormatSymbols().with {
                setDecimalSeparator('.' as char)
                new DecimalFormat("#.${formatStr}", it)
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

            //TODO: может понадобиться
            // Integer groupsCount = requestData?.groups?.size()
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
     * @return обновленный сет данных
     */
    private List prepareRequestWithStates(List res, List listIdsOfNormalAggregations)
    {
        def list = res
        Set stateValues = list.findResults { el ->
            def elAggregations = el[listIdsOfNormalAggregations]
            return el.minus(elAggregations)
        }
        Integer aggregationCnt = listIdsOfNormalAggregations.size()
        if (aggregationCnt > 0)
        {
            return stateValues.collect { value ->
                def aggergationSet = []
                def resValue = res.findResults { resValue ->
                    def tempResValue = resValue
                    def elAggregations = tempResValue[listIdsOfNormalAggregations]
                    tempResValue = tempResValue.minus(elAggregations)
                    //сравниваем значение с тем, что есть в текущей паре "название статуса (код)"
                    if (tempResValue == value)
                    {
                        //если оно совпадает берём у всего значения агрегацию
                        aggergationSet << [resValue[listIdsOfNormalAggregations]]
                        return [aggergationSet.collectMany{ it }, *tempResValue]
                    }
                }.last()
                List totalAggregation = aggregationCnt > 1
                    ? getTotalAggregation(resValue, aggregationCnt)
                    : [DECIMAL_FORMAT.format(resValue[0].sum { it[0] as Double })]
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
                                                   Boolean reverseLabels, String format, String groupFormat)
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
                return new StandardDiagram(labels: groupResult, series: series)
            case 3:
                def (groupResult, breakdownResult) = transposeDataSet.tail()
                def labels = groupResult?.findAll() as Set
                StandardDiagram standardDiagram = new StandardDiagram()
                if (reverseGroups)
                {
                    def series = (breakdownResult?.findAll() as Set)
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
                    standardDiagram = new StandardDiagram(labels: labels, series: series)
                }
                return standardDiagram
            default: throw new IllegalArgumentException("Invalid format result data set")
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
     * @return RoundDiagram
     */
    private RoundDiagram mappingRoundDiagram(List list)
    {
        def resultDataSet = list.head() as List<List>
        def transposeDataSet = resultDataSet.transpose()
        switch (transposeDataSet.size())
        {
            case 0: // если результирующее множество пустое
                return new RoundDiagram()
            case 2:
                def (aggregationResult, groupResult) = transposeDataSet
                return new RoundDiagram(series: (aggregationResult as List).collect {
                    it as Double
                }, labels: groupResult)
            default: throw new IllegalArgumentException("Invalid format result data set")
        }
    }

    /**
     * Метод преобразования результата выборки к сводке
     * @param list - данные диаграмы
     * @return SummaryDiagram
     */
    private SummaryDiagram mappingSummaryDiagram(List list)
    {
        List<List> resultDataSet = list.head() as List<List>
        switch (resultDataSet.size())
        {
            case 0: // если результирующее множество пустое
                return new SummaryDiagram()
            case 1:
                def (value, title) = resultDataSet.head()
                return new SummaryDiagram(title: title, total: value)
            default: throw new IllegalArgumentException("Invalid format result data set")
        }
    }

    /**
     * Метод формирования таблицы
     * @param list - список данных из БД
     * @param totalColumn - флаг на подсчёт итоговой колонки
     * @param showRowNum - флаг для вывода номера строки
     * @param rowCount - количество строк в полном запросе
     * @param pagingSettings -
     * @param requestContent - тело запроса с фронта
     * @param request - тело обработанного запроса
     * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
     * @return сформированная таблица
     */
    private TableDiagram mappingTableDiagram(List list,
                                             boolean totalColumn,
                                             boolean  showRowNum,
                                             Integer rowCount,
                                             PaginationSettings paginationSettings,
                                             Sorting sorting,
                                             Boolean reverseRowCount,
                                             def requestContent,
                                             DiagramRequest request,
                                             IgnoreLimits ignoreLimits = new IgnoreLimits())
    {
        def resultDataSet = list.head() as List<List>
        def transposeDataSet = resultDataSet.transpose()
        Integer aggregationCnt = getSpecificAggregationsList(requestContent).count { it.aggregation !=  Aggregation.NOT_APPLICABLE }
        List<Map> attributes = getAttributeNamesAndValuesFromRequest(requestContent)
        List<String> allAggregationAttributes = getSpecificAggregationsList(requestContent).name
        if (transposeDataSet.size() == 0)
        {
            return new TableDiagram()
        }
        else
        {
            Set<Map> innerCustomGroupNames = getInnerCustomGroupNames(requestContent)
            Boolean hasBreakdown = checkForBreakdown(requestContent)

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

            return mappingTable(resultDataSet,
                                transposeDataSet,
                                attributes,
                                totalColumn,
                                showRowNum,
                                rowCount,
                                paginationSettings,
                                sorting,
                                reverseRowCount,
                                innerCustomGroupNames,
                                hasBreakdown,
                                customValuesInBreakdown,
                                aggregationCnt,
                                allAggregationAttributes,
                                ignoreLimits,
                                request)
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
                if (attrValue.type == ColumnType.PARAMETER)
                {
                    return new Column(
                        footer:      "",
                        accessor:    attrValue.name,
                        header:      attrValue.name,
                        attribute:   attrValue.attribute,
                        type:        attrValue.type,
                        group:       attrValue.group
                    )
                }
                if (attrValue.type == ColumnType.INDICATOR)
                {
                    return new AggregationColumn(
                        footer:      "",
                        accessor:    attrValue.name,
                        header:      attrValue.name,
                        attribute:   attrValue.attribute,
                        type:        attrValue.type,
                        aggregation: attrValue.aggregation,
                        columns: getBreakdownColumns(breakdownValues, breakdownAttributeValue, attrValue)
                    )
                }
            }
            return parameterColumns
        }
        return attributes.collect { attrValue ->
            return new Column(
                footer:      "",
                accessor:    attrValue.name,
                header:      attrValue.name,
                attribute:   attrValue.attribute,
                type:        attrValue.type,
                group:       attrValue.group,
                aggregation: attrValue.aggregation,
                )
        }
    }

    /**
     * Мтод получения колонок со значениями разбивки
     * @param breakdownValues - значения разбивки
     * @param breakdownAttributeValue - значение атрибута разбивки
     * @param parentAttributeName - название атрибута агрегации
     * @return - колонки со значениями разбивки
     */
    List<AggregationBreakdownColumn> getBreakdownColumns(List breakdownValues, def breakdownAttributeValue, def aggregationAttributeValue)
    {
        return breakdownValues.collect { value ->
            return new AggregationBreakdownColumn(
                footer:      "",
                accessor:    "${aggregationAttributeValue.name}\$${value}",
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
     * @param requestContent - тело запроса
     * @param isCompute - флаг на получение всех агрегаций (null), обычных агрегаций (false), агрегаций с вычислениями (true)
     * @return  список агрегаций из запроса
     */
    List getSpecificAggregationsList (def requestContent, Boolean isCompute = null)
    {
        String mainSource = requestContent?.data?.findResult { value -> if (!value.sourceForCompute) return value.source.value.value }
        return requestContent?.data?.collectMany { value ->
            if (!value.sourceForCompute)
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

                        if (currentSource != mainSource)
                        {
                            String currentSourceName = api.metainfo.getMetaClass(mainSource)
                                                          .getAttribute(currentSource).title
                            if(!attribute?.title?.contains(currentSourceName))
                            {
                                attribute?.title = "${attribute?.title} (${currentSourceName})"
                            }
                        }
                        return [name : attribute?.title, attribute : attribute,
                                type : ColumnType.INDICATOR,
                                aggregation : indicator?.aggregation]
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

        if (!(aggregations.size() == compAggregations.size() && compAggregations.size() == 1))
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
     * Метод получения количества уникальных значений по атрибуту из БД
     * @param attributeValue - значение арибута с его группировкой и тд
     * @param classFqn - метакласс источника
     * @return количество уникальных значений
     */
    Integer countDistinct(def attributeValue, String classFqn)
    {
        Attribute attribute = attributeValue.attribute
        String attributeType = attribute.type
        if(Attribute.getAttributeType(attribute) in AttributeType.DATE_TYPES)
        {
            //у атрибута типа дата важно учитывать формат, в котором пользователь ожидает его увидеть,
            //записей может быть много, а по месяцу, например, может быть только 12 значений
            def wrapper = QueryWrapper.build(new Source(classFqn: classFqn))
            def parameter = buildSystemGroup(attributeValue.group, attribute)
            wrapper.group(wrapper.criteria, false, parameter, DiagramType.TABLE)

            return wrapper.getResult(true, DiagramType.TABLE, false)?.unique()?.size()
        }
        else
        {
            DashboardQueryWrapperUtils.prepareAttribute(attribute, true)
            List attrCodesList = attribute.attrChains()*.code
            if(attributeType in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE])
            {
                //если всё же информация пришла с фронта
                attrCodesList = attrCodesList.collect { it == 'title' ? 'code' : it }
            }
            String attrCode = attrCodesList.collect { it.replace('metaClass', 'metaClassFqn') }.join('.')
            def s = api.selectClause
            def criteria = api.db.createCriteria().addSource(classFqn)
            if(attributeType == AttributeType.META_CLASS_TYPE)
            {
                criteria.addColumn(s.property(attrCode))
                        .addGroupColumn(s.property(attrCode))
                return api.db.query(criteria).list().size()
            }
            criteria.addColumn(s.countDistinct(s.property(attrCode)))
            return api.db.query(criteria).list().head() as Integer
        }
    }

    /**
     * Метод по подготовке таблицы к отображению
     * @param resultDataSet - итоговый датасет
     * @param transposeDataSet - транспонированный итоговый датасет
     * @param attributes - список атрибутов
     * @param totalColumn - флаг на подсчёт итогов в колонках
     * @param showRowNum - флаг на отображение номера строки
     * @param customValuesInBreakdown - значения кастомной группировки в разбивке
     * @param aggregationCnt - количество агрегаций в запросе
     * @param allAggregationAttributes - названия всех атрибутов агрегации
     * @param ignoreLimits - map с флагами на игнорирование ограничений из БД
     * @param request тело обработанного запроса
     * @return TableDiagram
     */
    private TableDiagram mappingTable(List resultDataSet, List transposeDataSet, List attributes, Boolean totalColumn,
                                      Boolean showRowNum, Integer rowCount, PaginationSettings paginationSettings, Sorting sorting,
                                      Boolean reverseRowCount, Set<Map> innerCustomGroupNames, Boolean hasBreakdown, List customValuesInBreakdown,
                                      Integer aggregationCnt, List<String> allAggregationAttributes, IgnoreLimits ignoreLimits,
                                      DiagramRequest request)
    {
        List breakdownValues = hasBreakdown ? transposeDataSet.last().findAll().unique() : []
        Boolean valuesInBasicBreakdownExceedLimit = !customValuesInBreakdown && breakdownValues.size() > DashboardUtils.tableBreakdownLimit && !ignoreLimits.breakdown
        breakdownValues = valuesInBasicBreakdownExceedLimit
            ? breakdownValues[0..DashboardUtils.tableBreakdownLimit - 1]
            : breakdownValues

        Collection <Column> columns = collectColumns(attributes, hasBreakdown, customValuesInBreakdown ?: breakdownValues)

        int cnt = attributes.size()
        List<String> attributeNames = attributes.name
        List notAggregatedAttributeNames = notAggregationAttributeNames(attributes)
        Integer notAggregatedAttributeSize = notAggregatedAttributeNames.size()
        List<Map<String, Object>> tempMaps = getTempMaps(resultDataSet, attributeNames, cnt)
        List data = []
        int id = reverseRowCount ? rowCount - paginationSettings.firstElementIndex : paginationSettings.firstElementIndex
        Integer parameterIndex = aggregationCnt + notAggregatedAttributeSize //индекс,
        // с которого в строке начинаются значения параметров
        //подготовка данных
        if (hasBreakdown)
        {
            Integer indexToFind = 2 //берём до предпоследнего значения в строке, на последнем месте - разбивка
            def groups = tempMaps.groupBy { it[parameterIndex..-(indexToFind)] }//группируем данные по параметрам (их значениям)
            rowCount = groups.size()
            id = reverseRowCount ? rowCount - paginationSettings.firstElementIndex : paginationSettings.firstElementIndex
            groups = getDataSetWithPagination(groups, paginationSettings)
            data = groups.collect { parameters, group ->
                if (valuesInBasicBreakdownExceedLimit)
                {
                    //если предел по значениям кастомной группировки превышен,
                    // то нужно взять лишь те группы значений, где в разбивке значения из ограничения
                    group = group.findAll { it.last().values().head() in breakdownValues }
                }
                List<Map> aggregations = []
                if(group)
                {
                    aggregations = updateAggregations(group, aggregationCnt, notAggregatedAttributeNames)
                }
                def map = [:]
                if (showRowNum)
                {
                    map = [ID: reverseRowCount ? id-- : ++id]
                }
                (parameters + aggregations).each {
                    map << it
                }
                return map
            }
        }
        else
        {
            if(innerCustomGroupNames ||
               (sorting?.accessor &&
                attributes.find {it?.name?.trim() == sorting?.accessor?.trim() }
                          ?.attribute instanceof ComputedAttr ))
            {
                tempMaps = sortTableDataSetWithMaps(tempMaps, attributes, sorting)
                tempMaps = getDataSetWithPagination(tempMaps, paginationSettings)
            }
            data = tempMaps.collect { map ->
                def value = map[aggregationCnt..-1] + map[0..aggregationCnt -1].collect { it.findResult {k,v -> [(k): v ?: "0"]} }
                if(showRowNum)
                {
                    return [ID: reverseRowCount ? id-- : ++id, *:value.sum()]
                }
                else
                {
                    return [*:value.sum()]
                }
            }
        }

        //подготовка колонок
        Collection<Column> aggregationColumns = allAggregationAttributes.collect { name -> columns.find { it.header == name } }
        //убираем, чтобы потом подставить правильно
        columns -= aggregationColumns
        if (totalColumn)
        {
            columns[-1].footer = 'Итого'
            aggregationColumns.each { aggrCol ->
                def totalCount = 0
                if (hasBreakdown)
                {
                    List childrenColumns = aggrCol.columns
                    childrenColumns.each { childCol ->
                        String keyName = "${aggrCol.header}\$${childCol.header}"
                        totalCount = aggrCol.aggregation == 'NOT_APPLICABLE'
                            ? data.count { it.findAll{ k, v -> k == keyName && v != "" } }
                            : data.sum{it.entrySet().sum{ it.key == keyName ? it.value as Double : 0 }}
                        childCol.footer = DECIMAL_FORMAT.format(totalCount)
                    }
                }
                else
                {
                    totalCount = aggrCol.aggregation == 'NOT_APPLICABLE'
                        ? data.count { it[aggrCol.header] != "" }
                        : data.sum { it[aggrCol.header] as Double }
                    aggrCol.footer = DECIMAL_FORMAT.format(totalCount)
                }
            }
        }
        //агрегация всегда стоит в конце
        columns += aggregationColumns
        if(showRowNum)
        {
            columns.add(0, new NumberColumn(header: "", accessor: "ID", footer: "", show: showRowNum))
        }

        def source = request.data.findResult { k, v -> v.source }

        def parameterAttribute = attributes[parameterIndex]
        boolean isDynamicParameter = parameterAttribute?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
        Boolean customValuesInParameter = innerCustomGroupNames.any { it.attributeName == attributeNames[parameterIndex] }
        Boolean limitParameter = false
        if(!customValuesInParameter)
        {
            limitParameter = !ignoreLimits?.parameter &&
              isDynamicParameter
            ? DashboardQueryWrapperUtils.countDistinctTotalValue(source,
                                                                 parameterAttribute.attribute.code.tokenize('_').last()) >
              DashboardUtils.tableParameterLimit
            : countDistinct(parameterAttribute,
                            parameterAttribute.attribute.sourceCode) >
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
                ? DashboardQueryWrapperUtils.countDistinctTotalValue(source,
                                                                     breakdownAttribute.attribute.code.tokenize('_').last()) >
                  DashboardUtils.tableBreakdownLimit
                : countDistinct(breakdownAttribute,
                                breakdownAttribute.attribute.sourceCode) >
                  DashboardUtils.tableBreakdownLimit
            if(isDynamicBreakdown)
            {
                limitBreakdown = checkForDateInAttribute(breakdownAttribute, limitBreakdown)
            }
        }

        LimitExceeded limitsExceeded = new LimitExceeded(parameter: limitParameter, breakdown: limitBreakdown)

        return new TableDiagram(columns: columns, data: data, limitsExceeded: limitsExceeded, total: rowCount)
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
     * @param i - индекс
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
     * Метод получения названий и самих основных атрибутов запроса
     * @param requestContent - тело запроса
     * @return список названий атрибутов
     */
    private List<Map> getAttributeNamesAndValuesFromRequest(def requestContent)
    {
        def aggregations = getSpecificAggregationsList(requestContent)

        def parameterAttributes = requestContent.data.collectMany { value ->
            if (!value.sourceForCompute)
            {
                value.parameters.collect { parameter ->
                    def name = parameter?.group?.way == Way.CUSTOM
                        ? parameter?.group?.data?.name
                        : parameter?.attribute?.title
                    return [name : name, attribute : parameter?.attribute,
                            type : ColumnType.PARAMETER,group : parameter?.group]
                }
            }
            else
            {
                return []
            }
        }

        def breakdownAttributes = requestContent.data.collectMany { value ->
            if (!value.sourceForCompute)
            {
                value.breakdown.collect { breakdown ->
                    def name = breakdown?.group?.way == Way.CUSTOM
                        ? breakdown?.group?.data?.name
                        : breakdown?.attribute?.title
                    return [name : name, attribute : breakdown?.attribute,
                            type : ColumnType.BREAKDOWN, group : breakdown?.group]
                }
            }
            else
            {
                return []
            }
        }

        return (aggregations + parameterAttributes + breakdownAttributes).grep()
    }

    /**
     * Метод получения названий внутренних групп из основных группировок
     * @param request - запрос
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
                                             List<Boolean> customsInBreakdown, Integer sortingDataIndex)
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
        Closure getsSeries = { Set labelSet, List<List> dataSet, Map additionalData, Set labelDiagramSet, boolean customGroupFromBreak ->
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
                default: throw new IllegalArgumentException('Invalid format result data set')
            }
        }

        List fullSeries = []
        list.eachWithIndex { dataSet, i ->
            fullSeries += getsSeries(customsInBreakdown[i] ? diagramLabels : labels,
                                     dataSet, additionals[i], customsInBreakdown[i] ? labels : diagramLabels,
                                     customsInBreakdown[i])
        }
        if (sortingDataIndex > 0)
        {
            SeriesCombo moveBack = fullSeries[0]
            fullSeries -= moveBack
            fullSeries.add(sortingDataIndex, moveBack)
        }
        return new ComboDiagram(labels: labels, series: fullSeries)
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
        SimpleDateFormat formatter = new SimpleDateFormat("dd MMM", new Locale("ru"))
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
        SimpleDateFormat formatter = new SimpleDateFormat("MMM", new Locale("ru"))
        if (format == 'MM YY')
        {
            formatter = new SimpleDateFormat("MMM yyyy", new Locale("ru"))
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
     * @param customGroup - кастомная группировка для построения фильтра
     * @param subjectUUID - идентификатор "текущего объекта"
     * @param place - место, откуда была создана кастомная группировка
     * @param sortingType - тип сортировки
     * @return - список фильтров
     */
    private FilterList getFilterList(NewParameter parameter, String subjectUUID, String place, SortingType sortingType = null) {
        if(parameter?.group)
        {
            def customGroup = parameter?.group?.data

            def filterList = customGroup?.subGroups?.collect { subGroup ->
                String attributeType = Attribute.getAttributeType(parameter.attribute).split('\\$', 2).head()
                parameter.attribute.attrChains().last().type = attributeType
                Closure<Collection<Collection<FilterParameter>>> mappingFilters = getMappingFilterMethodByType(attributeType, subjectUUID)
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
        def tempResult = currentRes.groupBy { it[paramIndex] }.collect{ k, v ->
            [k, v.sum{ it[aggregationIndex] as Double } ]
        }.sort {
            -it[1] as Double
        }
        //берём из этих групп первые по top или все группы, если данных меньше
        if(tempResult.size() > top && fromNoOrTwoFiltersList)
        {
            tempResult = tempResult[0..top - 1]
        }
        if(parameterWithDate && aggregationOrderWithDates == 'ASC')
        {
            tempResult.sort {it[1] as Double}
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
     * @return - итоговый датасет в отсортированном виде
     */
    List sortResList(List res,String aggregationSortingType = '', parameterSortingType = '', parameterFilters = [], breakdownFilters = [])
    {
        int paramIndex = !breakdownFilters ? 1 : 2 // место, с которого начинаются значения параметра
        Integer aggregationIndex = 0 //место, где находятся значения агрегации
        if(aggregationSortingType)
        {
            if(res.find()?.size() > 2)
            {
                def tempResult = res.groupBy { it[paramIndex] }.collect{ k, v -> [k, v.sum{ it[aggregationIndex] as Double } ] }
                                    .sort { aggregationSortingType == 'ASC' ? it[1].toDouble() :  -it[1].toDouble() }
                                    *.get(0)
                //находим соответсвия данных с теми группами, что получили, и выводим их
                return tempResult.collectMany { value -> res.findAll {it[paramIndex] == value} }
            }
            else
            {
                return res.sort { aggregationSortingType == 'ASC' ? it[0].toDouble() :  -it[0].toDouble() }
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
     * @return сырые данные для построения диаграм
     */
    private List getNoFilterListDiagramData(def node, DiagramRequest request, Integer aggregationCnt, Integer top, Boolean notBlank, Boolean onlyFilled,  DiagramType diagramType, def requestContent, IgnoreLimits ignoreLimits, PaginationSettings paginationSettings = null)
    {
        String nodeType = node.type
        switch (nodeType.toLowerCase())
        {
            case 'default':
                def requisiteNode = node as DefaultRequisiteNode
                RequestData requestData = request.data[requisiteNode.dataKey]
                List attributes = []
                List<String> notAggregatedAttributes = []
                if (requestContent)
                {
                    attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                    notAggregatedAttributes = notAggregationAttributeNames(attributes)
                }
                def listIdsOfNormalAggregations = diagramType == DiagramType.TABLE
                    ? request?.data?.findResult { key, value ->
                    value?.aggregations?.withIndex().findResults { val, i -> if(val.type != Aggregation.NOT_APPLICABLE) return i }
                } : [0]

                String aggregationSortingType = requestData.aggregations.find()?.sortingType
                def parameter = requestData.groups.find()
                String parameterSortingType = diagramType == DiagramType.TABLE ? '' : parameter?.sortingType
                String parameterAttributeType = Attribute.getAttributeType(parameter?.attribute)
                Boolean parameterWithDateOrDtInterval = parameterAttributeType in [*AttributeType.DATE_TYPES, AttributeType.DT_INTERVAL_TYPE]
                Boolean parameterWithDate = parameterAttributeType in AttributeType.DATE_TYPES

                //важно для таблицы
                Closure formatAggregation = this.&formatAggregationSet.rcurry(listIdsOfNormalAggregations, diagramType in DiagramType.CountTypes ? false : onlyFilled)
                Closure formatGroup = this.&formatGroupSet.rcurry(requestData, listIdsOfNormalAggregations, diagramType)
                def res = DashboardQueryWrapperUtils.getData(requestData, top, notBlank, diagramType, ignoreLimits?.parameter, '', paginationSettings)
                                                    .with(formatGroup)
                                                    .with(formatAggregation)
                def total = res ? [(requisiteNode.title): res] : [:]
                total = formatResult(total, aggregationCnt)
                Boolean hasState = requestData?.groups?.any { value -> Attribute.getAttributeType(value?.attribute) == AttributeType.STATE_TYPE } ||
                                   requestData?.aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) == AttributeType.STATE_TYPE }
                if (hasState)
                {
                    total = prepareRequestWithStates(total, listIdsOfNormalAggregations)
                }
                if (top)
                {
                    total = getTop(total, top, [], [], true, parameterWithDate ? parameter : null, parameterSortingType, aggregationSortingType)
                }
                if (!parameterWithDateOrDtInterval &&
                    (aggregationSortingType || parameterSortingType) &&
                    diagramType in DiagramType.SortableTypes)
                {
                    return sortResList(total, aggregationSortingType, parameterSortingType)
                }
                return total
            case 'computation':
                def requisiteNode = node as ComputationRequisiteNode
                def calculator = new FormulaCalculator(requisiteNode.formula)
                def dataSet = calculator.variableNames.collectEntries {
                    [(it): request.data[it]]
                } as Map<String, RequestData>
                if (!checkGroupTypes(dataSet.values()))
                {
                    throw new IllegalArgumentException(
                        "Wrong group types in calculation!"
                    )
                }

                List attributes = []
                List<String> notAggregatedAttributes = []
                if (requestContent)
                {
                    attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                    notAggregatedAttributes = notAggregationAttributeNames(attributes)
                }
                def listIdsOfNormalAggregations = [0]
                aggregationCnt = 1
                def variables = dataSet.collectEntries { key, data ->
                    Closure postProcess =
                        this.&formatGroupSet.rcurry(data as RequestData, listIdsOfNormalAggregations, diagramType)
                    [(key): DashboardQueryWrapperUtils.getData(data as RequestData, top, notBlank, diagramType, ignoreLimits.parameter, '', paginationSettings)
                                                      .with(postProcess)]
                } as Map<String, List>

                //Вычисление формулы. Выглядит немного костыльно...
                Boolean hasState = dataSet.values().head().groups?.any { value -> Attribute.getAttributeType(value?.attribute) == AttributeType.STATE_TYPE } ||
                                   dataSet.values().head().aggregations?.any { it?.type == Aggregation.NOT_APPLICABLE && Attribute.getAttributeType(it?.attribute) == AttributeType.STATE_TYPE }
                String aggregationSortingType = dataSet.values().head().aggregations.find()?.sortingType
                def parameter = dataSet.values().head().groups.find()
                String parameterSortingType = diagramType == DiagramType.TABLE ? '' : parameter?.sortingType
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
                def total = [(node.title): formatAggregationSet(res, listIdsOfNormalAggregations, diagramType in DiagramType.CountTypes ? false : onlyFilled)]
                total = formatResult(total, aggregationCnt)
                if (top)
                {
                    total = getTop(total, top, [], [], true, parameterWithDate ? parameter : null, parameterSortingType, aggregationSortingType)
                }

                if (!parameterWithDateOrDtInterval &&
                    (aggregationSortingType || parameterSortingType) &&
                    diagramType in DiagramType.SortableTypes)
                {
                    return sortResList(total, aggregationSortingType, parameterSortingType)
                }
                return total
            default: throw new IllegalArgumentException("Not supported requisite type: $nodeType")
        }
    }
}

/**
 * Модель данных для диаграмм BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE
 */
@TupleConstructor
class StandardDiagram
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
class RoundDiagram
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
 * Модель данных для диаграммы TABLE
 */
@TupleConstructor
class TableDiagram
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
    /**
     * Список колонок детей - значений разбивки
     */
    List<AggregationBreakdownColumn> columns
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
class ComboDiagram
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