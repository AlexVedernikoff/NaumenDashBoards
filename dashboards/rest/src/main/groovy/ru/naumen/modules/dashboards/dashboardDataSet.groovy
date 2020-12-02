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

import static DiagramType.*

//region КЛАССЫ
/**
 * Модель данных для диаграмм BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE
 */
@TupleConstructor
class StandardDiagram
{
    /**
     * список значений для оси x
     */
    Collection<Object> categories = []
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
    Attribute attribute
    /**
     * Тип атрибута колонки
     */
    ColumnType type
    /**
     * Группа (есть у параметров/разбивки)
     */
    Map<String, Object> group
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
    Attribute attribute
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
//endregion

//region КОНСТАНТЫ
@Field private static final List<String> NOMINATIVE_RUSSIAN_MONTH = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                                                                     'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
@Field private static final List<String> GENITIVE_RUSSIAN_MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                                                                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

@Field private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormatSymbols().with {
    setDecimalSeparator('.' as char)
    new DecimalFormat("#.##", it)
}
//endregion

//region REST-МЕТОДЫ
/**
 * Метод получения данных для нескольких диаграмм
 * @param requestContent - тело запроса
 * @param cardObjectUuid - идентификатор "текущего объекта"
 * @return ассоциативный массив из ключа виджета и данных диаграммы
 */
String getDataForDiagrams(Map<String, Object> requestContent, String cardObjectUuid)
{
    return requestContent.collectEntries { key, value ->
        api.tx.call {
            try
            {
                return [(key): buildDiagram(
                    transformRequest(value as Map<String, Object>, cardObjectUuid), cardObjectUuid
                )]
            }
            catch (Exception ex)
            {
                logger.error("error in widget: $key", ex)
                return [(key): null]
            }
        }
    }.with(JsonOutput.&toJson)
}

/**
 * Получение данных для диаграмм. Нужен для обратной совместимости.
 * @param requestContent тело запроса в формате @link RequestGetDataForDiagram
 * @param cardObjectUuid - идентификатор "текущего объекта"
 * @return данные для построения диаграммы
 */
@Deprecated
String getDataForCompositeDiagram(Map<String, Object> requestContent, String cardObjectUuid)
{
    return getDataForDiagram(requestContent, cardObjectUuid)
}

/**
 * Получение данных для диаграмм. С поддержкой вычислений.
 * @param requestContent тело запроса в формате @link RequestGetDataForDiagram
 * @param cardObjectUuid - идентификатор "текущего объекта"
 * @return данные для построения диаграммы
 */
String getDataForDiagram(Map<String, Object> requestContent, String cardObjectUuid)
{
    return api.tx.call {
        buildDiagram(transformRequest(requestContent, cardObjectUuid), cardObjectUuid)
    }.with(JsonOutput.&toJson)
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Метод построения диаграмм.
 * @param requestContent - запрос на построение диаграмы
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return Типизированниые данные для построения диаграмм
 */
private def buildDiagram(Map<String, Object> requestContent, String subjectUUID)
{
    def diagramType = requestContent.type as DiagramType
    switch (diagramType)
    {
        case DiagramType.StandardTypes:
            def request = mappingStandardDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(request, diagramType)
            String key = request.data.keySet().head()
            String legend = request.data[key].aggregations.attribute.sourceName.head()
            Boolean reverseGroups = isCustomGroupFromBreakdown(requestContent)
            return mappingStandardDiagram(res, legend, reverseGroups)
        case DiagramType.RoundTypes:
            def request = mappingRoundDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(request)
            return mappingRoundDiagram(res)
        case DiagramType.CountTypes:
            def request = mappingSummaryDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(request)
            return mappingSummaryDiagram(res)
        case TABLE:
            Boolean showNulls = requestContent.showEmptyData
            Boolean computationInRequest = requestContent?.data?.values()?.indicators?.any { it?.attribute?.any { it.type == 'COMPUTED_ATTR'} }
            if (computationInRequest)
            {
                //вернём всё из бд, после сагрегируем
                showNulls = true
            }
            def request = mappingTableDiagramRequest(requestContent, subjectUUID, showNulls, computationInRequest)
            Integer aggregationCnt = request?.data?.findResult { key, value ->
                value?.aggregations?.count { it.type != Aggregation.NOT_APPLICABLE }
            }
            def res = getDiagramData(request, diagramType, aggregationCnt, requestContent)
            if (computationInRequest)
            {
                //а здесь уже важно знать, выводить пустые значения или нет
                showNulls = requestContent.showEmptyData
                Boolean requestHasBreakdown = checkForBreakdown(requestContent)
                res = prepareDataSet(res, requestContent, showNulls, requestHasBreakdown)
            }
            def (totalColumn, totalRow, showRowNum) = [requestContent.calcTotalColumn,
                                                       requestContent.calcTotalRow,
                                                       requestContent.showRowNum]

            return mappingTableDiagram(res, totalColumn as boolean, totalRow as boolean,
                                       showRowNum as boolean, requestContent)
        case COMBO:
            def request = mappingComboDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(request, diagramType)
            List<Map> additionals = (requestContent.data as Map)
                .findResults { key, value ->
                    if (!(value.sourceForCompute))
                    {
                        return [
                            type     : value.type,
                            breakdown: value.yAxis.title,
                            name     : value.yAxis.title,
                            dataKey  : key
                        ]
                    }
                }

            String format = requestContent.data.findResult { key, value ->
                if (value.xAxis.type in AttributeType.DATE_TYPES && value.group.way == 'SYSTEM')
                {
                    return value.group.format
                }
            }
            String group =  requestContent.data.findResult { key, value ->
                if (value.xAxis.type in AttributeType.DATE_TYPES && value.group.way == 'SYSTEM')
                {
                    return value.group.data
                }
            }
            Boolean changeLabels = requestContent?.sorting?.value == 'PARAMETER'
            Boolean reverseLabels = requestContent?.sorting?.type == 'DESC' && changeLabels
            List<Boolean> customsInBreakdown = isCustomGroupFromBreakdown(requestContent, diagramType)
            return mappingComboDiagram(res, additionals, group, format,
                                       changeLabels, reverseLabels, customsInBreakdown)
        default: throw new IllegalArgumentException("Not supported diagram type: $diagramType")
    }
}

/**
 * Метод приведения запроса на построение стандартных диаграм к единому формату
 * @param requestContent - запрос на построеине стандатной диаграмы
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return DiagramRequest
 */
private DiagramRequest mappingStandardDiagramRequest(Map<String, Object> requestContent,
                                                     String subjectUUID)
{
    def demoSorting = requestContent.sorting as Map<String, Object>
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)
        def yAxis = data.yAxis as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
            title: 'yAxis',
            type: data.aggregation as Aggregation,
            attribute: mappingAttribute(yAxis),
            sortingType: demoSorting.value == 'INDICATOR' ? demoSorting.type : null
        )
        def dynamicGroup = null
        def xAxis = data.xAxis as Map<String, Object>
        boolean dynamicInAggregation = aggregationParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
        if (dynamicInAggregation)
        {
            dynamicGroup = mappingDynamicAttributeCustomGroup(mappingAttribute(yAxis))
        }
        def group = data.group as Map<String, Object>
        def groupParameter = buildSystemGroup(group, xAxis)
        groupParameter?.sortingType = demoSorting.value == 'PARAMETER' ? demoSorting.type : null
        boolean dynamicInParameter = groupParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
        if (dynamicInParameter)
        {
            dynamicGroup = mappingDynamicAttributeCustomGroup(mappingAttribute(xAxis))
        }

        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        def breakdown = null
        boolean dynamicInBreakdown = false

        if (mayBeBreakdown instanceof Collection)
        {
            def groupTypes = data.breakdown*.group as Set
            // Это список типов группировок.
            // По хорошему они должны быть одинаковыми.
            // Не знаю почему фронт шлёт их на каждый атрибут...
            if (groupTypes.size() == 1)
            {
                //Группировка одного типа можно продолжать
                breakdownMap = mayBeBreakdown.collectEntries { el ->
                    dynamicInBreakdown = el?.value?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    if(dynamicInBreakdown)
                    {
                        dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(el.value))
                    }
                    [(el.dataKey): buildSystemGroup(el.group as Map, el.value as Map)]
                }
            }
            else
            {
                throw new IllegalArgumentException("Does not match group types: $groupTypes")
            }
        }
        else
        {
            //это обычная разбивка... Ну или кастомная
            breakdown = mayBeBreakdown?.with {
                buildSystemGroup(
                    data.breakdownGroup as Map<String, Object>,
                    it as Map<String, Object>
                )
            }
            dynamicInBreakdown = breakdown?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if (dynamicInBreakdown)
            {
                dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(mayBeBreakdown))
            }

        }
        def res = new RequestData(
            source: source,
            aggregations: [aggregationParameter],
            groups: [groupParameter, breakdown].grep()
        )

        def comp = yAxis?.stringForCompute?.with {
            def compData = yAxis.computeData as Map
            [
                formula    : it as String,
                title      : yAxis.title as String,
                computeData: compData.collectEntries { k, v ->
                    String dataKey = v.dataKey
                    def br = breakdownMap[dataKey] as GroupParameter
                    def aggr = new AggregationParameter(
                        title: 'aggregation',
                        type: v.aggregation as Aggregation,
                        attribute: mappingAttribute(v.attr as Map),
                        sortingType: demoSorting.value == 'INDICATOR' ? demoSorting.type : null
                    )
                    [(k): [aggregation: aggr, group: br, dataKey: dataKey]]
                }
            ]
        }

        def parameterCustomGroup = group.way == 'CUSTOM'
            ? [attribute: mappingAttribute(xAxis)] + (group.data as Map<String, Object>)
            : null
        if (dynamicInParameter)
        {
            parameterCustomGroup = dynamicGroup
        }
        FilterList parameterFilter = getFilterList(parameterCustomGroup, subjectUUID, 'parameter')

        def breakdownAttribute
        def breakdownGroupData
        boolean isBreakdownGroupCustom = false
        if(mayBeBreakdown instanceof Collection) {
            breakdownAttribute = mayBeBreakdown?.value.find()
            breakdownGroupData = mayBeBreakdown?.group?.data.find()
            isBreakdownGroupCustom = mayBeBreakdown?.group?.way.find() == 'CUSTOM'
        }
        else {
            breakdownAttribute = mayBeBreakdown
            breakdownGroupData = data?.breakdownGroup?.data
            isBreakdownGroupCustom = data?.breakdownGroup?.way == 'CUSTOM'
        }
        def breakdownCustomGroup =  isBreakdownGroupCustom
            ? [attribute: mappingAttribute(breakdownAttribute), *: breakdownGroupData]
            : null
        if (dynamicInBreakdown)
        {
            breakdownCustomGroup =  dynamicGroup
        }
        FilterList breakdownFilter = getFilterList(breakdownCustomGroup, subjectUUID, 'breakdown')

        if (dynamicInAggregation) {

            dynamicFilter = getFilterList(dynamicGroup, subjectUUID, 'parameter')
            if(!parameterFilter?.filters) {
                parameterFilter?.filters = dynamicFilter.filters
            } else if (parameterFilter?.filters) {
                //Если у нас есть фильтры в параметре и при этом есть дин. атрибут в агрегации,
                // необходимо его фильтр так же объединить с исходными фильтрами. Для этого переходим на
                // второй уровень вложенности и производим сложение условий через операцию и.
                parameterFilter?.filters = parameterFilter?.filters.collectMany {
                    [it.collectMany { [it, dynamicFilter.filters[0][0]] }]
                }
            }
            else if(!breakdownFilter?.filters) {
                breakdownFilter?.filters = dynamicFilter.filters
            }

        }
        def requisite
        Boolean showNulls = data.showEmptyData as Boolean
        if (data.sourceForCompute)
        {
            requisite = null
        }
        else
        {
            def requisiteNode = comp
                ? new ComputationRequisiteNode(
                title: null,
                type: 'COMPUTATION',
                formula: comp.formula
            )
                : new DefaultRequisiteNode(title: null, type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode], filterList: [parameterFilter, breakdownFilter], showNulls: showNulls)
        }

        [(key): [requestData: res, computeData: comp?.computeData, customGroup:
            null, requisite: requisite]]
    } as Map<String, Map>
    return buildDiagramRequest(intermediateData, subjectUUID)
}

/**
 * Метод приведения запроса на построение круговых диаграм к единому формату
 * @param requestContent - запрос на построеине круговой диаграмы
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return DiagramRequest
 */
private DiagramRequest mappingRoundDiagramRequest(Map<String, Object> requestContent,
                                                  String subjectUUID)
{
    def demoSorting = requestContent.sorting as Map<String, Object>
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)

        def indicator = data.indicator as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
            title: 'indicator',
            type: data.aggregation as Aggregation,
            attribute: mappingAttribute(indicator),
            sortingType: demoSorting.value == 'INDICATOR' ? demoSorting.type : null
        )
        def dynamicGroup
        boolean dynamicInAggregation = aggregationParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
        if (dynamicInAggregation)
        {
            dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(indicator))
        }

        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        GroupParameter breakdown = null
        boolean dynamicInBreakdown = false

        if (mayBeBreakdown instanceof Collection)
        {
            def groupTypes = data.breakdown*.group as Set
            // Это список типов группировок.
            // По хорошему они должны быть одинаковыми.
            // Не знаю почему фронт шлёт их на каждый атрибут...
            if (groupTypes.size() == 1)
            {
                //Группировка одного типа можно продолжать
                breakdownMap = mayBeBreakdown.collectEntries { el ->
                    dynamicInBreakdown = el?.value?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    if(dynamicInBreakdown) {
                        dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(el.value))
                    }
                    [(el.dataKey): buildSystemGroup(el.group as Map, el.value as Map)]
                }
            }
            else
            {
                throw new IllegalArgumentException("Does not match group types: $groupTypes")
            }
        }
        else
        {
            //это обычная разбивка... Ну или кастомная
            breakdown = mayBeBreakdown?.with {
                buildSystemGroup(
                    data.breakdownGroup as Map<String, Object>,
                    it as Map<String, Object>
                )
            }
            dynamicInBreakdown = breakdown?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if (dynamicInBreakdown)
            {
                dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(mayBeBreakdown))
            }
        }

        def res = new RequestData(
            source: source,
            aggregations: [aggregationParameter],
            groups: [breakdown].grep()
        )

        def comp = indicator?.stringForCompute?.with {
            def compData = indicator.computeData as Map
            [
                formula    : it as String,
                title      : indicator.title as String,
                computeData: compData.collectEntries { k, v ->
                    String dataKey = v.dataKey
                    def br = breakdownMap[dataKey] as GroupParameter
                    def aggr = new AggregationParameter(
                        title: 'aggregation',
                        type: v.aggregation as Aggregation,
                        attribute: mappingAttribute(v.attr as Map),
                        sortingType: demoSorting.value == 'INDICATOR' ? demoSorting.type : null
                    )
                    [(k): [aggregation: aggr, group: br, dataKey: dataKey]]
                }
            ]
        }


        def breakdownCustomGroup
        if(dynamicInBreakdown)
        {
            breakdownCustomGroup = dynamicGroup
        }
        else
        {
            breakdownCustomGroup = data.breakdownGroup?.way == 'CUSTOM'
                ? [attribute: mappingAttribute(mayBeBreakdown), *: data.breakdownGroup.data]
                : null
        }

        FilterList breakdownFilter = getFilterList(breakdownCustomGroup, subjectUUID, 'breakdown')
        FilterList aggregationFilter = null
        if (dynamicInAggregation)
        {
            aggregationFilter = getFilterList(dynamicGroup, subjectUUID, 'parameter')
        }
        def requisite
        Boolean showNulls = data.showEmptyData as Boolean
        if (data.sourceForCompute)
        {
            requisite = null
        }
        else
        {
            def requisiteNode = comp
                ? new ComputationRequisiteNode(
                title: null,
                type: 'COMPUTATION',
                formula: comp.formula
            )
                : new DefaultRequisiteNode(title: null, type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode], filterList: [breakdownFilter, aggregationFilter], showNulls: showNulls)
        }

        [(key): [requestData: res, computeData: comp?.computeData, customGroup:
            null, requisite: requisite]]
    } as Map<String, Map>
    return buildDiagramRequest(intermediateData, subjectUUID)
}

/**
 * Метод приведения запроса на построение сводки к единому формату
 * @param requestContent - запрос на построеине сводки
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return DiagramRequest
 */
private DiagramRequest mappingSummaryDiagramRequest(Map<String, Object> requestContent,
                                                    String subjectUUID)
{
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)

        def indicator = data.indicator as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
            title: 'indicator',
            type: data.aggregation as Aggregation,
            attribute: mappingAttribute(indicator)
        )
        def dynamicGroup
        if (aggregationParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE))
        {
            dynamicGroup = mappingDynamicAttributeCustomGroup(aggregationParameter.attribute)
            dynamicGroup.subGroups*.name = aggregationParameter.attribute.title
        }
        def res = new RequestData(source: source, aggregations: [aggregationParameter])

        def comp = indicator?.stringForCompute?.with {
            def compData = indicator.computeData as Map
            [
                formula    : it as String,
                title      : indicator.title as String,
                computeData: compData.collectEntries { k, v ->
                    String dataKey = v.dataKey
                    def aggr = new AggregationParameter(
                        title: 'aggregation',
                        type: v.aggregation as Aggregation,
                        attribute: mappingAttribute(v.attr as Map)
                    )
                    [(k): [aggregation: aggr, dataKey: dataKey]]
                }
            ]
        }
        String attributeTitle = indicator?.title
        FilterList dynamicFilter = getFilterList(dynamicGroup, subjectUUID, 'parameter')
        def requisite
        if (data.sourceForCompute)
        {
            requisite = null
        }
        else
        {
            def requisiteNode = comp
                ? new ComputationRequisiteNode(
                title: comp.title,
                type: 'COMPUTATION',
                formula: comp.formula
            )
                : new DefaultRequisiteNode(title: attributeTitle, type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode], filterList: [dynamicFilter], showNulls: true)
        }

        [(key): [requestData: res, computeData: comp?.computeData, customGroup: null, requisite:
            requisite]]
    } as Map<String, Map>
    return buildDiagramRequest(intermediateData, subjectUUID)
}

/**
 * Метод приведения запроса на построение таблицы к единому формату
 * @param requestContent - запрос на построеине таблицы
 * @param subjectUUID - идентификатор "текущего объекта"
 * @param showNulls - флаг на отображение пустых значений
 * @param computationInRequest - флаг на наличие вычислений в запросе
 * @return DiagramRequest
 */
private DiagramRequest mappingTableDiagramRequest(Map<String, Object> requestContent, String subjectUUID,
                                                  Boolean showNulls, Boolean computationInRequest)
{
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)
        def dynamicGroup = null

        List<Map<String, Object>> indicators = data.indicators as List<Map>
        List<AggregationParameter> aggregationParameters = indicators.collect { indicator ->
            String aggregation = indicator.aggregation
            Map attribute = indicator.attribute
            return new AggregationParameter(
                title: 'column',
                type: aggregation as Aggregation,
                attribute: mappingAttribute(attribute)
            )
        }

        boolean dynamicInAggregate
        aggregationParameters.each { aggregationParameter ->
            dynamicInAggregate = aggregationParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if (dynamicInAggregate)
            {
                dynamicGroup = mappingDynamicAttributeCustomGroup(mappingAttribute(aggregationParameter.attribute))
            }
        }

        List<Map<String, Object>> parameters = data.parameters as List<Map>
        List groupParameters = []
        List parameterFilters = []
        //cчитаем только параметры с группировкой, среди всех параметров
        int groupParameterId = 0
        parameters.each {
            Map attribute = it.attribute
            Map<String, Object> group = it.group

            if (group.way == 'SYSTEM')
            {
                def groupParameter = buildSystemGroup(group, attribute, 'parameter')
                groupParameters << groupParameter
            }
            else
            {
                def customGroup = [attribute: mappingAttribute(attribute), *:group.data]
                def newParameterFilterList = getFilterList(customGroup, subjectUUID, 'parameter')
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
                    def filterList = new FilterList(place: 'parameter', filters: parameterListFilters)
                    parameterFilters = [filterList]
                }
                else
                {
                    parameterFilters << newParameterFilterList
                }
                groupParameterId++
            }
        }

        boolean dynamicInParameter
        groupParameters.each {groupParameter ->
            dynamicInParameter = groupParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if (dynamicInParameter) {
                dynamicGroup = mappingDynamicAttributeCustomGroup(mappingAttribute(groupParameter.attribute))
            }
        }

        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        def breakdownParameter = null
        boolean dynamicInBreakdown = false

        if (mayBeBreakdown instanceof Collection)
        {
            def groupTypes = data.breakdown*.group as Set
            // Это список типов группировок.
            // По хорошему они должны быть одинаковыми.
            // Не знаю почему фронт шлёт их на каждый атрибут...
            if (groupTypes.size() == 1)
            {
                //Группировка одного типа можно продолжать
                breakdownMap = mayBeBreakdown.collectEntries { el ->
                    dynamicInBreakdown = el?.value?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    if(dynamicInBreakdown)
                    {
                        dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(el.value))
                    }
                    [(el.dataKey): buildSystemGroup(el.group as Map, el.value as Map)]
                }
            }
            else
            {
                throw new IllegalArgumentException("Does not match group types: $groupTypes")
            }
        }
        else
        {
            //это обычная разбивка... Ну или кастомная
            breakdownParameter = mayBeBreakdown?.with {
                buildSystemGroup(
                    data.breakdownGroup as Map<String, Object>,
                    it as Map<String, Object>
                )
            }
            dynamicInBreakdown = breakdownParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if (dynamicInBreakdown)
            {
                dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(mayBeBreakdown))
            }
        }

        def res = new RequestData(
            source: source,
            aggregations: aggregationParameters,
            groups: groupParameters + [breakdownParameter].grep()
        )

        int compIndicatorId = 0
        //ведём подсчёт только показателей с вычислениями; не все показатели могут быть с вычислениями
        def comp = indicators?.findResults { indicator ->
            if (indicator?.attribute?.stringForCompute)
            {
                def compData = indicator.attribute.computeData as Map
                def computeData = compData.collectEntries { k, v ->
                    String dataKey = "сompute-data_${compIndicatorId}"
                    def br = breakdownMap[v.dataKey] as GroupParameter
                    def aggr = new AggregationParameter(
                        title: indicator?.attribute?.title,
                        type: v.aggregation as Aggregation,
                        attribute: mappingAttribute(v.attr as Map)
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
        }

        def breakdownAttribute
        def breakdownGroupData
        boolean isBreakdownGroupCustom = false
        if(mayBeBreakdown instanceof Collection)
        {
            breakdownAttribute = mayBeBreakdown?.value.find()
            breakdownGroupData = mayBeBreakdown?.group?.data.find()
            isBreakdownGroupCustom = mayBeBreakdown?.group?.way.find() == 'CUSTOM'
        }
        else {
            breakdownAttribute = mayBeBreakdown
            breakdownGroupData = data?.breakdownGroup?.data
            isBreakdownGroupCustom = data?.breakdownGroup?.way == 'CUSTOM'
        }
        def breakdownCustomGroup =  isBreakdownGroupCustom
            ? [attribute: mappingAttribute(breakdownAttribute), *: breakdownGroupData]
            : null
        if (dynamicInBreakdown)
        {
            breakdownCustomGroup =  dynamicGroup
        }
        FilterList breakdownFilter = getFilterList(breakdownCustomGroup, subjectUUID, 'breakdown')
        if (dynamicInAggregate)
        {
            parameterFilters << getFilterList(dynamicGroup, subjectUUID, 'parameter')
        }

        def requisite
        if (data.sourceForCompute)
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
                requisiteNode = comp
                    ? new ComputationRequisiteNode(
                    title: null,
                    type: 'COMPUTATION',
                    formula: comp.formula
                )
                    : new DefaultRequisiteNode(title: null, type: 'DEFAULT', dataKey: key)
            }
            requisite = new Requisite(title: 'DEFAULT', nodes: (computeCheck) ? requisiteNode : [requisiteNode], filterList: [breakdownFilter, *parameterFilters], showNulls: showNulls)
        }

        [(key): [requestData: res, computeData: comp?.computeData, customGroup:
            null, requisite: requisite]]
    } as Map<String, Map>
    Boolean manySources = requestContent?.data?.values()?.sourceForCompute.count { !it } > 1
    if(manySources)
    {
        Integer countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(requestContent)
        intermediateData = updateIntermediateDataToOneSource(intermediateData, computationInRequest, countOfCustomsInFirstSource)
    }
    if(computationInRequest)
    {
        intermediateData = updateIntermediateData(intermediateData)
    }
    return buildDiagramRequest(intermediateData, subjectUUID, DiagramType.TABLE)
}

/**
 * Метод подсчёта кастомных группировок в запросе
 * @param requestContent - тело запроса
 * @param inFirstSource - флаг на подсчёт только в первом источнике
 * @return количество кастомных группировок
 */
Integer countDataForManyCustomGroupsInParameters(Map<String, Object> requestContent, Boolean inFirstSource = true)
{
    def tempData = requestContent.data as Map<String, Object>
    if (inFirstSource)
    {
        def data = tempData.findResult {k, v -> v} //берем данные первого источника
        return data?.parameters?.count { it?.group?.way == 'CUSTOM' }
    }
    else
    {
        def data = tempData.findResults {k, v -> v} //берем данные всех источников
        return data?.parameters?.sum { return it?.count { it?.group?.way == 'CUSTOM' } }
    }
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
    List computationData = intermediateData.collectMany { key, value -> value.computeData ?: []  }
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
            return value?.requisite?.filterList
        }
        else
        {
            return []
        }
    }
    //наличие фильтров в разных источниках
    int cnt = filterList.count {
        it.place == 'parameter'
    }
    //если фильтры есть больше, чем в одном источнике
    if (cnt > 1)
    {
        //берём фильтры первого источника
        def parameterFilters = filterList.find {
            it.place == 'parameter'
        }?.filters
        //идём по фильтрам остальных источников (со второго по последний)
        filterList.findAll { it.place == 'parameter' }[1..-1].each { tempFilterList ->
            List tempFilters = tempFilterList?.filters
            parameterFilters = parameterFilters?.collectMany { parameterFilter ->
                tempFilters.collect {
                    (countOfCustomsInFirstSource > 1) ? [*parameterFilter, it] : [parameterFilter, it]
                }
            }
        }
        parameterFilters = new FilterList(place: 'parameter', filters: parameterFilters)
        FilterList breakdownFilterList = filterList.find {
            it.place == 'breakdown' && it.filters
        }
        originalRequisite.filterList = breakdownFilterList ? [parameterFilters] + [breakdownFilterList] : [parameterFilters]
    }
    else
    {
        originalRequisite.filterList = filterList.findAll { it.filters }
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
            return groups.collect { group ->
                group.attribute.code = "${it?.source?.classFqn}.${group.attribute.code}"
                return group
            }
        }
        return groups
    }

    List fullAggregations = requestData?.aggregations?.collectMany {
        computationInRequest ? it : it?.collect { aggr -> prepareAggregation(aggr, mainSource.classFqn)}
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
            filterList: originalRequisite.filterList ,
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
            filterList: originalRequisite.filterList,
            showNulls: originalRequisite.showNulls
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
 * Метод приведения запроса на построение комбо диаграм к единому формату
 * @param requestContent - запрос на построеине комбо диаграмы
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return DiagramRequest
 */
private DiagramRequest mappingComboDiagramRequest(Map<String, Object> requestContent,
                                                  String subjectUUID)
{
    def demoSorting = requestContent.sorting as Map<String, Object>
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)
        def yAxis = data.yAxis as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
            title: 'yAxis',
            type: data.aggregation as Aggregation,
            attribute: mappingAttribute(yAxis),
            sortingType: demoSorting.value == 'INDICATOR' ? demoSorting.type : null
        )
        def xAxis = data.xAxis as Map<String, Object>
        def group = data.group as Map<String, Object>
        def dynamicGroup = null
        boolean dynamicInAggregation = aggregationParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
        if (dynamicInAggregation)
        {
            dynamicGroup = mappingDynamicAttributeCustomGroup(mappingAttribute(yAxis))
        }

        def groupParameter = buildSystemGroup(group, xAxis)
        groupParameter?.sortingType = demoSorting.value == 'PARAMETER' ? demoSorting.type : null
        boolean dynamicInParameter = groupParameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
        if (dynamicInParameter)
        {
            dynamicGroup = mappingDynamicAttributeCustomGroup(mappingAttribute(xAxis))
        }

        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        def breakdown = null
        boolean dynamicInBreakdown = false

        if (mayBeBreakdown instanceof Collection)
        {
            def groupTypes = data.breakdown*.group as Set
            // Это список типов группировок.
            // По хорошему они должны быть одинаковыми.
            // Не знаю почему фронт шлёт их на каждый атрибут...
            if (groupTypes.size() == 1)
            {
                //Группировка одного типа можно продолжать
                breakdownMap = mayBeBreakdown.collectEntries { el ->
                    dynamicInBreakdown = el?.value?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    if (dynamicInBreakdown)
                    {
                        dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(el.value))
                    }
                    [(el.dataKey): buildSystemGroup(el.group as Map, el.value as Map)]
                }
            }
            else
            {
                throw new IllegalArgumentException("Does not match group types: $groupTypes")
            }
        }
        else
        {
            //это обычная разбивка... Ну или кастомная
            breakdown = mayBeBreakdown?.with {
                buildSystemGroup(
                    data.breakdownGroup as Map<String, Object>,
                    it as Map<String, Object>,
                    'usual_breakdown'
                )
            }
            dynamicInBreakdown = breakdown?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            if (dynamicInBreakdown)
            {
                dynamicGroup =  mappingDynamicAttributeCustomGroup(mappingAttribute(mayBeBreakdown))
            }
        }

        def res = new RequestData(
            source: source,
            aggregations: [aggregationParameter],
            groups: [groupParameter, breakdown].grep()
        )

        def comp = !(data.sourceForCompute) ? yAxis.stringForCompute?.with {
            def compData = yAxis.computeData as Map
            [
                formula    : it as String,
                title      : yAxis.title as String,
                computeData: compData.collectEntries { k, v ->
                    String dataKey = v.dataKey
                    def br = breakdownMap[dataKey] as GroupParameter
                    def aggr = new AggregationParameter(
                        title: 'aggregation',
                        type: v.aggregation as Aggregation,
                        attribute: mappingAttribute(v.attr as Map),
                        sortingType: demoSorting.value == 'INDICATOR' ? demoSorting.type : null
                    )
                    [(k): [aggregation: aggr, group: br, dataKey: dataKey]]
                }
            ]
        } : null

        def parameterCustomGroup = group.way == 'CUSTOM'
            ? [attribute: mappingAttribute(xAxis)] + (group.data as Map<String, Object>)
            : null
        if (dynamicInParameter)
        {
            parameterCustomGroup = dynamicGroup
        }

        FilterList parameterFilter = getFilterList(parameterCustomGroup, subjectUUID, 'parameter')

        def breakdownAttribute
        def breakdownGroupData
        boolean isBreakdownGroupCustom = false
        if (mayBeBreakdown instanceof Collection)
        {
            breakdownAttribute = mayBeBreakdown?.value.find()
            breakdownGroupData = mayBeBreakdown?.group?.data.find()
            isBreakdownGroupCustom = mayBeBreakdown?.group?.way.find() == 'CUSTOM'
        }
        else
        {
            breakdownAttribute = mayBeBreakdown
            breakdownGroupData = data?.breakdownGroup?.data
            isBreakdownGroupCustom = data?.breakdownGroup?.way == 'CUSTOM'
        }
        def breakdownCustomGroup =  isBreakdownGroupCustom
            ? [attribute: mappingAttribute(breakdownAttribute), *: breakdownGroupData]
            : null
        if (dynamicInBreakdown)
        {
            breakdownCustomGroup = dynamicGroup
        }
        FilterList breakdownFilter = getFilterList(breakdownCustomGroup, subjectUUID, 'breakdown')

        if (dynamicInAggregation) {

            dynamicFilter = getFilterList(dynamicGroup, subjectUUID, 'parameter')
            if (!parameterFilter?.filters)
            {
                parameterFilter?.filters = dynamicFilter.filters
            }
            else if (parameterFilter?.filters)
            {
                //Если у нас есть фильтры в параметре и при этом есть дин. атрибут в агрегации,
                // необходимо его фильтр так же объединить с исходными фильтрами. Для этого переходим на
                // второй уровень вложенности и производим сложение условий через операцию и.
                parameterFilter?.filters = parameterFilter?.filters.collectMany {
                    [it.collectMany { [it, dynamicFilter.filters[0][0]] }]
                }
            }
            else if (!breakdownFilter?.filters)
            {
                breakdownFilter?.filters = dynamicFilter.filters
            }
        }
        def requisite
        Boolean showNulls = data.showEmptyData as Boolean
        if (data.sourceForCompute)
        {
            requisite = null
        }
        else
        {
            def requisiteNode = comp
                ? new ComputationRequisiteNode(
                title: null,
                type: 'COMPUTATION',
                formula: comp.formula
            )
                : new DefaultRequisiteNode(title: null, type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode], filterList: [parameterFilter, breakdownFilter], showNulls: showNulls)
        }

        [(key): [requestData: res, computeData: comp?.computeData, customGroup:
            parameterCustomGroup ? parameterCustomGroup : breakdownCustomGroup, requisite: requisite]]
    } as Map<String, Map>
    return buildDiagramRequest(intermediateData, subjectUUID)
}

/**
 * Метод создания параметра группировки основанного только на системных группировках
 * @param groupType - объект описывающий группировку
 * @param attr - атрибут
 * @param title - название места, откуда пришла группа
 * @return параметр группировки
 */
private GroupParameter buildSystemGroup(Map<String, Object> groupType, Map<String, Object> attr, String title = 'breakdown')
{
    return groupType?.way == 'SYSTEM' ? new GroupParameter(
        title: title,
        type: attr.type == AttributeType.DT_INTERVAL_TYPE
            ? getDTIntervalGroupType(groupType.data as String)
            : groupType.data as GroupType,
        attribute: mappingAttribute(attr),
        format: groupType.format
    ) : null
}

/**
 * Метод определения типа группировки для атрибута типа "временной интервал"
 * @param groupType - декларируемая группировка временного интервала
 * @return фактическая группировка временного интервала
 */
private GroupType getDTIntervalGroupType(String groupType)
{
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
            throw new IllegalArgumentException("Not supported group type in dateTimeInterval attribute: $groupType")
    }
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
    Closure getRequestData = { String key -> intermediateData[key].requestData
    }
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
            def attributeType = attribute?.type
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
            List computeAggregationIds = []
            newRequestData.aggregations.eachWithIndex { aggr, id ->
                if(aggr?.attribute?.type == 'COMPUTED_ATTR')
                {
                    computeAggregationIds += id
                }
            }
            computeAggregationIds.each { id ->
                newRequestData.aggregations -= newRequestData.aggregations[id]
                newRequestData.aggregations.add(id, aggregation)
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
            def attributeType = attribute?.type
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
 * Метод преобразования кастомных группировок к формату подходящего для QueryWrapper
 * @param getData - функция получения данных запроса по ключу
 * @param key - ключь для получения данных запроса
 * @param value - настройки кастомной группировки
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return возвращает новую пару ключ, данные запроса
 */
private Map<String, List<List>> convertCustomGroup(Closure getData,
                                                   String subjectUUID,
                                                   String key,
                                                   Map value)
{
    def customGroup = value.customGroup as Map<String, Object>
    String attributeCompositeType = customGroup.type
    String attributeType = attributeCompositeType.split('\\$', 2).head()
    Closure<Collection<Collection<FilterParameter>>> mappingFilters =
        getMappingFilterMethodByType(attributeType, subjectUUID)
    def subGroups = customGroup.subGroups as Collection // интересующие нас группы.
    def requestData = getData.call(key as String) as RequestData
    def attribute = customGroup.attribute as Attribute
    List<List> dataSet = subGroups.collect { el ->
        def group = el as Map<String, Object>
        String groupName = group.name // название группы. Должно оказаться в записе реквизита
        def filters = mappingFilters(group.data as List<List>, attribute, groupName)
        def newRequestData = requestData.clone()
        newRequestData.filters = filters
        String newKey = UUID.randomUUID() // шанс колизии ключей очень мал
        [groupName, newKey, newRequestData]
    }
    return [(key): dataSet]
}

/**
 * Метод получения функции преобразования пользовательской группировки в удобный формат
 * @param type - тип пользовательской группировки
 * @param subjectUUID - идентификатор "текущего объекта"
 * @return функция преобразования настроек пользовательской группировки
 */
private Closure<Collection<Collection<FilterParameter>>> getMappingFilterMethodByType(String type,
                                                                                      String subjectUUID)
{
    switch (type)
    {
        case AttributeType.DT_INTERVAL_TYPE:
            return this.&mappingDTIntervalTypeFilters
        case AttributeType.STRING_TYPE:
            return this.&mappingStringTypeFilters
        case AttributeType.INTEGER_TYPE:
            return this.&mappingNumberTypeFilters.curry(
                {
                    it as long
                }
            )
        case AttributeType.DOUBLE_TYPE:
            return this.&mappingNumberTypeFilters.curry(
                {
                    it as double
                }
            )
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
 * Метод преодбразований настроек группировки для каталогов
 * @param subjectUUID - идентификатор "текущего объекта"
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingCatalogItemTypeFilters(String subjectUUID,
                                                                  List<List> data,
                                                                  Attribute attribute,
                                                                  String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        switch (conditionType.toLowerCase())
        {
            case 'empty':
                return new FilterParameter(
                    value: null,
                    title: title,
                    type: Comparison.IS_NULL,
                    attribute: attribute
                )
            case 'not_empty':
                return new FilterParameter(
                    value: null,
                    title: title,
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
                    type: Comparison.NOT_CONTAINS,
                    attribute: attribute
                )
            case 'contains_current_object':
                def value = api.utils.get(subjectUUID)
                return new FilterParameter(
                    value: value,
                    title: title,
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
                def subjectAttribute = condition.data
                def subjectAttributeType = subjectAttribute.type
                if (subjectAttributeType != attribute.type)
                {
                    throw new IllegalArgumentException("Does not match attribute type: $subjectAttributeType")
                }
                return new FilterParameter(
                    value: value,
                    title: title,
                    type: Comparison.EQUAL,
                    attribute: attribute
                )
            default:
                throw new IllegalArgumentException("Not supported condition type: $conditionType")
        }
    }
}

/**
 * Метод преодбразований настроек группировки для ссылочных типов
 * @param subjectUUID - идентификатор "текущего объекта"
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingLinkTypeFilters(String subjectUUID,
                                                           List<List> data,
                                                           Attribute attribute,
                                                           String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        switch (conditionType.toLowerCase())
        {
            case 'empty':
                return new FilterParameter(
                    value: null,
                    title: title,
                    type: Comparison.IS_NULL,
                    attribute: attribute
                )
            case 'not_empty':
                return new FilterParameter(
                    value: null,
                    title: title,
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
                    type: Comparison.IN,
                    attribute: attribute
                )
            case ['contains_current_object', 'equal_current_object']:
                def value = api.utils.get(subjectUUID)
                String metaClass = value.metaClass
                String subjectType = metaClass.takeWhile { ch -> ch != '$'
                }
                String attributeType = attribute.property?.takeWhile { ch -> ch != '$'
                }
                if (subjectType != attributeType)
                {
                    throw new IllegalArgumentException( "Does not match subject type: $subjectType and attribute type: ${ attribute.property }" )
                }
                return new FilterParameter(
                    value: value,
                    title: title,
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
                def subjectAttribute = condition.data
                def subjectAttributeType = subjectAttribute.type
                if (subjectAttributeType != attribute.type)
                {
                    throw new IllegalArgumentException("Does not match attribute type: $subjectAttributeType")
                }
                return new FilterParameter(
                    value: value,
                    title: title,
                    type: Comparison.EQUAL,
                    attribute: attribute
                )
            default:
                throw new IllegalArgumentException("Not supported condition type: $conditionType")
        }
    }
}

/**
 * Метод преодбразований настроек группировки для временных интервалов
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingDTIntervalTypeFilters(List<List> data,
                                                                 Attribute attribute,
                                                                 String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        Closure<FilterParameter> buildFilterParameterFromCondition = { Comparison type ->
            def interval = condition.data as Map
            // тут будет лежать значение временного интервала
            def value = interval
                ? api.types.newDateTimeInterval([interval.value as long, interval.type as String])
                : null
            //Важный момент. Обязательно извлекать милисекунды, так как критерия не может это сделать сама.
            new FilterParameter(value: value, title: title, type: type, attribute: attribute)
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
}

/**
 * Метод преодбразований настроек группировки для строковых типов
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingStringTypeFilters(List<List> data,
                                                             Attribute attribute,
                                                             String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        Closure buildFilterParameterFromCondition = { Comparison type ->
            new FilterParameter(
                value: condition.data,
                title: title,
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
}

/**
 * Метод преодбразований настроек группировки для числовых типов
 * @param valueConverter - функция преодразования строки в число
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingNumberTypeFilters(Closure valueConverter,
                                                             List<List> data,
                                                             Attribute attribute,
                                                             String title)
{
    return mappingFilter(data) { Map condition ->
        Closure buildFilterParameterFromCondition = { Comparison type ->
            new FilterParameter(
                value: condition.data?.with(valueConverter),
                title: title,
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
                return buildFilterParameterFromCondition(
                    Comparison.NOT_EQUAL_AND_NOT_NULL
                ) as FilterParameter
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
}

/**
 * Метод преодбразований настроек группировки для dateTime типов
 * @param valueConverter - функция преодразования строки в число
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingDateTypeFilters(List<List> data, Attribute attribute, String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        Closure<FilterParameter> buildFilterParameterFromCondition = { value ->
            return new FilterParameter(
                title: title,
                type: Comparison.BETWEEN,
                attribute: attribute,
                value: value
            )
        }
        switch (conditionType.toLowerCase())
        {
            case 'today':
                def start = Calendar.instance.with {
                    set(HOUR_OF_DAY, 0)
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
                return buildFilterParameterFromCondition([start, end])
            case 'last':
                def count = condition.data as int
                def start = Calendar.instance.with {
                    add(DAY_OF_MONTH, -count)
                    set(HOUR_OF_DAY, 0)
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
                return buildFilterParameterFromCondition([start, end])
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
                return buildFilterParameterFromCondition([start, end])
            case 'between':
                String dateFormat = 'yyyy-MM-dd'
                def dateSet = condition.data as Map<String, Object> // тут будет массив дат или одна из них
                def start
                if(dateSet.startDate)
                {
                    start = Date.parse(dateFormat, dateSet.startDate as String)
                }
                else
                {
                    Date minDate = modules.dashboardCommon.getMinDate(
                        attribute.code,
                        attribute.sourceCode
                    )
                    start = new Date(minDate.time).clearTime()
                }
                def end
                if (dateSet.endDate)
                {
                    end = Date.parse(dateFormat, dateSet.endDate as String)
                }
                else
                {
                    end = new Date().clearTime()
                }
                return buildFilterParameterFromCondition([start, end])
            default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
        }
    }
}

/**
 * Метод преодбразований настроек группировки для статусов
 * @param subjectUUID - идентификатор "текущего объекта"
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingStateTypeFilters(String subjectUUID,List<List> data, Attribute attribute, String title) {
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        Closure buildFilterParameterFromCondition = { Comparison comparison, Attribute attr, value ->
            return new FilterParameter(title: title, type: comparison, attribute: attr, value: value)
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
                return new FilterParameter(value: value, title: title, type: Comparison.EQUAL, attribute: attribute)
            default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
        }
    }
}

/**
 * Метод преодбразований настроек группировки для таймеров
 * @param data - настройки группировки
 * @param attribute - атрибут к которому привязана группировки
 * @param title - название группировки
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingTimerTypeFilters(List<List> data,
                                                            Attribute attribute,
                                                            String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        Closure buildFilterParameterFromCondition = { Comparison comparison, Attribute attr, value ->
            return new FilterParameter(title: title, type: comparison, attribute: attr, value: value)
        }
        switch (conditionType.toLowerCase())
        {
            case 'status_contains':
                def status = condition.data.value.toString()
                String value = status.toLowerCase().charAt(0)
                def temAttribute = attribute.deepClone()
                temAttribute.addLast(
                    new Attribute(
                        title: 'статус',
                        code: 'statusCode',
                        type: 'string'
                    )
                )
                return buildFilterParameterFromCondition(Comparison.CONTAINS, temAttribute, value)
            case 'status_not_contains':
                def status = condition.data.value.toString()
                String value = status.toLowerCase().charAt(0)
                def temAttribute = attribute.deepClone()
                temAttribute.addLast(
                    new Attribute(
                        title: 'статус',
                        code: 'statusCode',
                        type: 'string'
                    )
                )
                return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS,
                                                         temAttribute, value)
            case 'expiration_contains':
                def comparison = condition.data.value == 'EXCEED'
                    ? Comparison.CONTAINS
                    : Comparison.NOT_CONTAINS
                def temAttribute = attribute.deepClone()
                temAttribute.addLast(
                    new Attribute(
                        title: 'статус',
                        code: 'statusCode',
                        type: 'string'
                    )
                )
                return buildFilterParameterFromCondition(comparison, temAttribute, 'e')
            case 'expires_between': // Время окончания в диапазоне
                def temAttribute = attribute.deepClone()
                temAttribute.addLast(
                    new Attribute(
                        title: 'время окончания',
                        code: 'deadLineTime',
                        type: 'integer'
                    )
                )
                String dateFormat = 'yyyy-MM-dd'
                def dateSet = condition.data as Map<String, Object> // тут будет массив дат
                def start = Date.parse(dateFormat, dateSet.startDate as String)
                def end = Date.parse(dateFormat, dateSet.endDate as String)
                return buildFilterParameterFromCondition(
                    Comparison.BETWEEN,
                    temAttribute,
                    [start.getTime(), end.getTime()]
                )
            default: throw new IllegalArgumentException("Not supported condition type: $conditionType")
        }
    }
}

private List<List<FilterParameter>> mappingMetaClassTypeFilters(String subjectUUID,
                                                                List<List> data,
                                                                Attribute attribute,
                                                                String title)
{
    return mappingFilter(data) { Map condition ->
        String conditionType = condition.type
        switch (conditionType.toLowerCase())
        {
            case 'contains':
                if (!condition.data)
                {
                    throw new IllegalArgumentException("Condition data is null or empty")
                }
                String uuid = condition.data.uuid
                return new FilterParameter(
                    value: uuid,
                    title: title,
                    type: Comparison.CONTAINS,
                    attribute: attribute
                )
            case 'not_contains':
                if (!condition.data)
                {
                    throw new IllegalArgumentException("Condition data is null or empty")
                }
                String uuid = condition.data.uuid
                //def value = api.utils.get(uuid)
                return new FilterParameter(
                    value: uuid,
                    title: title,
                    type: Comparison.NOT_CONTAINS,
                    attribute: attribute
                )
            case 'contains_any':
                if (!condition.data)
                {
                    throw new IllegalArgumentException("Condition data is null or empty")
                }
                def uuids = condition.data*.uuid
                return new FilterParameter(
                    value: uuids,
                    title: title,
                    type: Comparison.CONTAINS,
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
                    type: Comparison.METACLASS_TITLE_CONTAINS,
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
                    type: Comparison.METACLASS_TITLE_NOT_CONTAINS,
                    attribute: attribute
                )
            case 'equal_attr_current_object':
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
                return new FilterParameter(
                    value: value,
                    title: title,
                    type: Comparison.EQUAL,
                    attribute: attribute
                )
            default:
                throw new IllegalArgumentException("Not supported condition type: $conditionType")
        }
    }
}

/**
 * Метод обхода настроек пользовательской группировки
 * @param data - настройки пользовательской группировки
 * @param mapFilter - функция преобразования данных в удобный формат
 * @return настройки группировки в удобном формате
 */
private List<List<FilterParameter>> mappingFilter(List<List> data,
                                                  Closure<FilterParameter> mapFilter)
{
    return data.collect { andCondition ->
        andCondition.collect { orCondition ->
            mapFilter(orCondition as Map<String, Object>)
        }
    }
}

/**
 * Метод получения данных для диаграмм
 * @param request - запрос на получение данных
 * @param diagramType - тип диаграммы
 * @param aggregationCnt - количество агрегаций
 * @param requestContent - тело запроса
 * @return сырые данные из Бд по запросу
 */
private def getDiagramData(DiagramRequest request, DiagramType diagramType = DiagramType.DONUT, Integer aggregationCnt = 1, Map<String, Object> requestContent = [:])
{
    //TODO: уже сверхкостыльно получается. Нужно придумать решение по лучше
    assert request: "Empty request!"
    return request.requisite.collect { requisite ->
        Boolean onlyFilled = !requisite.showNulls
        return requisite.nodes.collectMany { node ->
            def filterList = requisite.filterList.grep()
            def filterListSize = requisite.filterList.filters.grep().size()
            def parameterFilters = filterList.find {
                it.place == 'parameter'
            }?.filters
            def breakdownFilters = filterList.find {
                it.place == 'breakdown'
            }?.filters

            if (diagramType == DiagramType.TABLE)
            {
                Integer countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(requestContent)
                Integer countOfCustomsInFullRequest = countDataForManyCustomGroupsInParameters(requestContent, false)
                if  (countOfCustomsInFirstSource > 1 || countOfCustomsInFullRequest > 1 )
                {
                    filterListSize = 2
                }
            }
            switch (filterListSize)
            {
                case 0:
                    return getNoFilterListDiagramData(node, request, aggregationCnt, onlyFilled, diagramType, requestContent)
                case 1:
                    return getOneFilterListDiagramData(
                        node, request, aggregationCnt,
                        parameterFilters, breakdownFilters,
                        onlyFilled, diagramType, requestContent)
                case 2:
                    return getTwoFilterListDiagramData(
                        node, request, aggregationCnt,
                        parameterFilters, breakdownFilters,
                        onlyFilled, diagramType, requestContent)
            }
        }
    }
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
        return list.collect { el ->
            def groups = el //резервируем значения для групп
            def elAggregations = el[listIdsOfNormalAggregations] //резервируем значения для агрегаций
            elAggregations.each { groups.remove (groups.indexOf(it)) } //убираем в группах агрегации
            List notAggregated = data.aggregations.findAll {it.type == Aggregation.NOT_APPLICABLE }  //ищем агрегации n/a
            List requestGroups = updateNotAggregatedToGroups(notAggregated) + data.groups

            //обрабатываем группы
            def totalGroupValues = groups.withIndex().collect { group, i ->
                return formatGroup(requestGroups[i] as GroupParameter,
                                   data.source.classFqn, group, diagramType, requestGroups[i]?.title == 'n/a')
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
        new GroupParameter( type:GroupType.OVERLAP, title: 'n/a', attribute: it?.attribute)
    }
}

/**
 * Метод преобразования значения группировки в зависимости от типа
 * @param parameter - тип группировки
 * @param fqnClass - класс атрибута группировки
 * @param value - значение группировки
 * @param fromNA - флаг на обработку атрибута из агрегации N/a
 * @return человеко читаемое значение группировки
 */
private String formatGroup(GroupParameter parameter, String fqnClass, def value, DiagramType diagramType, Boolean fromNA = false)
{
    GroupType type = parameter.type

    switch (type)
    {
        case GroupType.OVERLAP:
            def uuid = null
            if (diagramType == DiagramType.TABLE)
            {
                if (value)
                {
                    (value, uuid) = ObjectMarshaller.unmarshal(value.toString())
                }
            }
            switch (parameter.attribute.attrChains().last()?.type)
            {
                case AttributeType.DT_INTERVAL_TYPE:
                    if (parameter?.attribute?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)) {
                        return value
                    }
                    return TimeUnit.MILLISECONDS.toHours(value as long)
                case AttributeType.STATE_TYPE:
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
                    return (value as TimerStatus).getRussianName()
                default:
                    //прийти в качестве значения может, как UUID, так и просто id
                    if (parameter.attribute?.attrChains()?.last()?.code == 'UUID' && !fromNA)
                    {
                        value = value.split('\\$', 2).last() ?: value
                    }
                    if (diagramType == DiagramType.TABLE)
                    {
                        if(value && uuid)
                        {
                            value = ObjectMarshaller.marshal(value, uuid)
                        }
                        //в таблице важно фронту отправлять пустую строку
                        value = value ?: ""
                    }
                    else if( diagramType in DiagramType.NullableTypes)
                    {
                        value = value ?: "Не заполнено"
                    }
                    return value.toString().replaceAll("\\<.*?>","")
            }
        case GroupType.DAY:
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
            String format = parameter.format
            switch(format) {
                case 'QQ YY':
                    return value.toString()
                default:
                    return "$value кв-л"
            }
        case [GroupType.WEEK, GroupType.YEAR]:
            String format = parameter.format
            switch (format) {
                case 'ww':
                    return value.toString() + '-я'
                default:
                    return value.toString()
            }
        case GroupType.SEVEN_DAYS:
            def russianLocale = new Locale("ru")
            SimpleDateFormat standardDateFormatter = new SimpleDateFormat("yyyy-MM-dd", russianLocale)
            SimpleDateFormat specialDateFormatter = new SimpleDateFormat("dd.MM.yy", russianLocale)
            def (star, numberWeek) = value.split("#", 2)
            def minDate = standardDateFormatter.parse(star as String)
            def countDays = (numberWeek as int) * 7
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
            return value.toString().padLeft(2, '0') + ' мин'
        case GroupType.HOURS:
            value = value.toString().tokenize(':/')*.padLeft(2, '0').join(':')
            return value
        case GroupType.getTimerTypes():
            return (value as TimerStatus).getRussianName()
        case GroupType.SECOND_INTERVAL:
        case GroupType.MINUTE_INTERVAL:
        case GroupType.HOUR_INTERVAL:
        case GroupType.DAY_INTERVAL:
        case GroupType.WEEK_INTERVAL:
            return value.toString().replaceAll("\\<.*?>","")
        default: throw new IllegalArgumentException("Not supported type: $type")
    }
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
 * @return StandardDiagram
 */
private StandardDiagram mappingStandardDiagram(List list, String legendName, Boolean reverseGroups)
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
            return new StandardDiagram(categories: groupResult, series: series)
        case 3:
            def (groupResult, breakdownResult) = transposeDataSet.tail()
            def categories = groupResult?.findAll() as Set
            StandardDiagram standardDiagram = new StandardDiagram()
            if (reverseGroups) {
                def series = (breakdownResult?.findAll() as Set)
                def categoriesForDiagram = breakdownResult?.findAll() as Set
                def seriesForDiagram = categories.collect { categoriesValue ->
                    def data = series.collect {
                        seriesValue ->
                            (list.head() as List<List>).findResult { el->
                                el.tail() == [categoriesValue, seriesValue] ? el.head() : null
                            } ?: 0
                    }
                    new Series(name: categoriesValue, data: data)
                }
                standardDiagram = new StandardDiagram(
                    categories: categoriesForDiagram,
                    series: seriesForDiagram
                )
            } else {
                def series = (breakdownResult as Set).findResults { breakdownValue ->
                    if(breakdownValue)
                    {
                        def data = categories.collect { groupValue ->
                            (list.head() as List<List>).findResult { el ->
                                el.tail() == [groupValue, breakdownValue] ? el.head() : null
                            } ?: 0
                        }
                        return new Series(name: breakdownValue, data: data)
                    }
                }
                standardDiagram = new StandardDiagram(categories: categories, series: series)
            }
            return standardDiagram
        default: throw new IllegalArgumentException("Invalid format result data set")
    }
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
 * @param totalRow - флаг для подсчёта итоговой строки
 * @param showRowNum - флаг для вывода номера строки
 * @param request - запрос
 * @param requestContent - тело запроса с фронта
 * @return сформированная таблица
 */
private TableDiagram mappingTableDiagram(List list,
                                         boolean totalColumn,
                                         boolean totalRow,
                                         boolean  showRowNum,
                                         Map<String, Object> requestContent)
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
        Boolean requestHasBreakdown = checkForBreakdown(requestContent)

        return mappingManyColumnsTableDiagram(
            resultDataSet, transposeDataSet, totalColumn,
            totalRow, showRowNum, requestHasBreakdown, aggregationCnt, attributes,
            innerCustomGroupNames, allAggregationAttributes
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
Boolean checkForBreakdown(Map<String, Object> requestContent)
{
    def tempData = requestContent.data as Map<String, Object>
    return tempData.any { k, v -> v?.breakdown }
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
 * Метод преобразования результата к таблице с несколькими колонками
 * @param resultDataSet - итоговый датасет
 * @param transposeDataSet - транспонированный датасет
 * @param totalColumn - флаг на подсчёт итоговой колонки
 * @param totalRow - флаг для подсчёта итоговой строки
 * @param showRowNum - флаг для вывода номера строки
 * @param hasBreakdown - флаг на наличие разбивки в запросе
 * @param aggregationCnt - количество реальных агрегаций
 * @param attributes - атрибуты
 * @param innerCustomGroupNames - названия значений кастомных группировок
 * @param allAggregationAttributes - все атрибуты агрегации
 * @return TableDiagram
 */
private TableDiagram mappingManyColumnsTableDiagram(List resultDataSet, def transposeDataSet,
                                                    Boolean totalColumn,
                                                    Boolean totalRow,
                                                    Boolean showRowNum,
                                                    Boolean hasBreakdown,
                                                    Integer aggregationCnt,
                                                    List<Map> attributes = null,
                                                    Set<Map> innerCustomGroupNames = [],
                                                    List<String> allAggregationAttributes = [])
{
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
                        totalRow,
                        showRowNum,
                        hasBreakdown,
                        customValuesInBreakdown,
                        aggregationCnt,
                        allAggregationAttributes)
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
    return request.data.collectMany { key, value ->
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
    String mainSource = requestContent?.data?.findResult { key, value -> if (!value.sourceForCompute) return value.source }
    return requestContent?.data?.collectMany { key, value ->
        if (!value.sourceForCompute)
        {
            return value?.indicators?.findResults{ aggregation ->
                Boolean conditionTrue = true
                if (isCompute != null)
                {
                    conditionTrue = !(isCompute ^ aggregation?.attribute?.type == 'COMPUTED_ATTR')//xor
                }

                if (conditionTrue)
                {

                    Attribute attribute = mappingAttribute(aggregation?.attribute)
                    String currentSource = value.source
                    if (currentSource != mainSource)
                    {
                        String currentSourceName = api.metainfo.getMetaClass(mainSource)
                                                      .getAttribute(currentSource).title
                        attribute?.title = "${attribute?.title} (${currentSourceName})"
                    }
                    return [name : attribute?.title, attribute : attribute,
                            type : ColumnType.INDICATOR,
                            aggregation : aggregation?.aggregation as Aggregation]
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

    if (aggregations.size() == compAggregations.size() && compAggregations.size() == 1)
    {
        //уже всё готово, возвращаем список без изменений
        return list
    }

    List indexesOfComputeInRequest = aggregations.findIndexValues { it.name in compAggregations.name }

    List indexesOfNotAggregatedInRequest = usualAggregations.findIndexValues { it.aggregation == Aggregation.NOT_APPLICABLE }

    int usualAggregationSize = usualAggregations.size()
    //количество всех агрегаций равно количеству всех вычислений
    if (aggregations.size() == compAggregations.size())
    {
        usualAggregationSize = 1 //чтобы корректно достучаться до элемента в массиве
        indexesOfComputeInRequest = indexesOfComputeInRequest[1..-1] //на первом месте уже стоит результат первого вычисления
    }
    List usual = list[0] //на первом месте в списке  результатов, нужно внедрить на нужные места данные из результатов вычислений

    list[1..-1].eachWithIndex { listRow, i -> //идем по другим спискам, где уже есть вычисления, результат хранится на первом месте, i покажет место, где хранится индекс подстановки числа из вычислений
        usual.each { row ->
            def range = usualAggregationSize + i..-1
            def tempRow = indexesOfNotAggregatedInRequest
                ? row[*indexesOfNotAggregatedInRequest, range]
                : row[range]
            tempRow = tempRow.collect { it ?: 0}.sort()
            def num = listRow.find {
                it[1..-1].collect { it ?: 0}.sort() == tempRow
            }.find() //при последующей итерации число агрегаций увеличивается на 1
            row.add(indexesOfComputeInRequest[i]  as int, num)
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
 * Метод по подготовке таблицы к отображению
 * @param resultDataSet - итоговый датасет
 * @param transposeDataSet - транспонированный итоговый датасет
 * @param attributes - список атрибутов
 * @param totalColumn - флаг на подсчёт итогов в колонках
 * @param totalRow  - флаг на подсчёт итогов в строках
 * @param showRowNum - флаг на отображение номера строки
 * @param customValuesInBreakdown - значения кастомной группировки в разбивке
 * @param aggregationCnt - количество агрегаций в запросе
 * @param allAggregationAttributes - названия всех атрибутов агрегации
 * @return TableDiagram
 */
private TableDiagram mappingTable(List resultDataSet,
                                  List transposeDataSet,
                                  List attributes,
                                  Boolean totalColumn,
                                  Boolean totalRow,
                                  Boolean showRowNum,
                                  Boolean hasBreakdown,
                                  List customValuesInBreakdown,
                                  Integer aggregationCnt,
                                  List<String> allAggregationAttributes)
{
    List breakdownValues = hasBreakdown ? transposeDataSet.last().findAll().unique() : []
    Collection <Column> columns = collectColumns(attributes, hasBreakdown, customValuesInBreakdown ?: breakdownValues)

    int cnt = attributes.size()
    List<String> attributeNames = attributes.name
    List notAggregatedAttributeNames = notAggregationAttributeNames(attributes)
    Integer notAggregatedAttributeSize = notAggregatedAttributeNames.size()
    List<Map<String, Object>> tempMaps = getTempMaps(resultDataSet, attributeNames, cnt)
    List data = []
    //подготовка данных
    if (hasBreakdown)
    {

        List<Map> rows = getFullRows(tempMaps, aggregationCnt + notAggregatedAttributeSize)
        rows = prepareRowsWithBreakdown(rows, aggregationCnt + notAggregatedAttributeSize, attributeNames, notAggregatedAttributeNames, breakdownValues)
        data = rows.withIndex().collect { map, id->
            return [ID: ++id, *:map.sum()]
        }
    }
    else
    {
        data = tempMaps.withIndex().collect { map, id->
            def value = map[aggregationCnt..-1] + map[0..aggregationCnt -1].collect { it.findResult {k,v -> [(k): v ?: "0"]} }
            return [ID: ++id, *:value.sum()]
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
    columns.add(0, new NumberColumn(header: "", accessor: "ID", footer: "", show: showRowNum))
    return new TableDiagram(columns: columns, data: data)
}

/**
 * метод получения всех строк
 * @param tempMaps - текущие мапы из всего датасета
 * @param aggregationCnt - количество агрегаций в запросе
 * @return список итоговых строк
 */
List<Map> getFullRows(List<Map> tempMaps, Integer aggregationCnt)
{
    List groupsByParameters = getGroupsByTempMaps(tempMaps, aggregationCnt)
    return aggregationCnt > 0
        ? collectMapListsWithAggregations(groupsByParameters, aggregationCnt)
        : groupsByParameters
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
 * Метод получения списков мап с преобразованными агрегациями
 * @param groups - текущие группы данных по идентичным значениям параметров
 * @param aggregationCnt - количество агрегаций в запросе
 * @return списки мап с преобразованными агрегациями
 */
List<Map> collectMapListsWithAggregations(List groups, Integer aggregationCnt)
{
    return groups.collect { group ->
        //берём первый список мап (название атрибута - значение
        List<Map> firstMapList = group[0]
        //из него берём значения только для параметров - они останутся неизменными
        List<Map> parameters = firstMapList[aggregationCnt..-2]
        List<Map> aggregations = updateAggregations(group, aggregationCnt)
        return parameters + aggregations
    }
}

/**
 * Метод преобразования агрегации с включением в неё значений разбивки
 * @param group - текущие группа данных по идентичным значениям параметров
 * @param aggregationCnt - количество агрегаций в запросе
 * @return преобразованная агрегация с включением в неё значений разбивки
 */
List<Map> updateAggregations(List<Map> group, Integer aggregationCnt)
{
    return group.collectMany { value ->
        return (0..aggregationCnt - 1).collect {
            def aggregation = value[it].findResult { k, v -> [k, v] }
            def breakdownValue = value.last().findResult { k, v -> [k, v] }
            return [(aggregation[0]) : [(breakdownValue[1]): aggregation[1]]]
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
private List<Map> getAttributeNamesAndValuesFromRequest(Map<String, Object> requestContent)
{
    def aggregations = getSpecificAggregationsList(requestContent)

    def parameterAttributes = requestContent.data.collectMany { key, value ->
        if (!value.sourceForCompute)
        {
            value.parameters.collect { parameter ->
                def name = parameter?.group?.way == 'CUSTOM'
                    ? parameter?.group?.data?.name
                    : parameter?.attribute?.title
                Map<String, Object> group = parameter?.group
                return [name : name, attribute : parameter?.attribute,
                        type : ColumnType.PARAMETER,group : group]
            }
        }
        else
        {
            return []
        }
    }

    def breakdownAttributes = requestContent.data.findResult { key, value ->
        def name = value?.breakdownGroup?.way == 'CUSTOM'
            ? value?.breakdownGroup?.data?.name
            : value?.breakdown?.title
        Map<String, Object> group =  value?.breakdownGroup
        return  group ? [name : name, attribute : value?.breakdown,
                         type: ColumnType.BREAKDOWN, group : group] : null
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
    requestContent.data.values().each { value ->
        value.parameters.each { parameter ->
            if (parameter?.group?.way == 'CUSTOM')
            {
                parameter?.group?.data?.subGroups?.each { sub ->
                    attributeMaps << [attributeName: parameter?.group?.data?.name, value: sub?.name]
                }
            }
        }

        if (value?.breakdownGroup?.way == 'CUSTOM')
        {
            value?.breakdownGroup?.data?.subGroups?.each { sub ->
                attributeMaps << [attributeName: value?.breakdownGroup?.data?.name, value: sub?.name]
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
 * @return ComboDiagram
 */
private ComboDiagram mappingComboDiagram(List list,
                                         List<Map> additionals,
                                         String groupFormat,
                                         String format,
                                         Boolean changeLabels,
                                         Boolean reverseLabels,
                                         List<Boolean> customsInBreakdown)
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

    if (groupFormat && changeLabels)
    {
        labels = getLabelsInCorrectOrder(labels, groupFormat, format, reverseLabels)
    }

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
    Closure getsSeries = { Set labelSet,
                           List<List> dataSet,
                           Map additionalData,
                           Set labelDiagramSet,
                           boolean customGroupFromBreak ->
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
        fullSeries += getsSeries(
            customsInBreakdown[i] ? diagramLabels : labels ,
            dataSet,
            additionals[i],
            customsInBreakdown[i] ? labels : diagramLabels,
            customsInBreakdown[i]
        )
    }
    return new ComboDiagram(
        labels: labels,
        series: fullSeries
    )
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
 * Метод для изменения запроса с целью подмены объекта фильтрации
 * @param requestContent - запрос на построение диаграммы
 * @param cardObjectUuid - фактическое значение идентификатора "текущего объекта"
 * @return изменённый запрос
 */
private Map<String, Object> transformRequest(Map<String, Object> requestContent,
                                             String cardObjectUuid)
{
    return requestContent.data
        ? transformRequestWithComputation(requestContent, cardObjectUuid)
        : transformRequestWithoutComputation(requestContent, cardObjectUuid)
}

/**
 * Метод для изменения запроса с целью подмены объекта фильтрации в запросах с поддержкой вычислений
 * @param requestContent - запрос на построение диаграммы
 * @param cardObjectUuid - фактическое значение идентификатора "текущего объекта"
 * @return изменённый запрос
 */
private Map<String, Object> transformRequestWithComputation(Map<String, Object> requestContent,
                                                            String cardObjectUuid)
{
    Closure<Map<String, Object>> transform = { Map<String, Object> map ->
        def data = map.data as Map<String, Object>
        def newData = data.collectEntries { key, value ->
            def dataForDiagram = [:] << (value as Map<String, Object>)
            dataForDiagram.descriptor = DashboardMarshaller.substitutionCardObject(
                dataForDiagram.descriptor as String, cardObjectUuid
            )
            return [(key): dataForDiagram]
        }
        return [type: map.type, data: newData, sorting: map.sorting,
                showEmptyData: map.showEmptyData, calcTotalColumn: map.calcTotalColumn,
                calcTotalRow : map.calcTotalRow, showRowNum: map.showRowNum]
    }
    return cardObjectUuid ? transform(requestContent) : requestContent
}

/**
 * Метод для изменения запроса с целью подмены объекта фильтрации в запросах без поддержки вычислений
 * @param requestContent - запрос на построение диаграммы
 * @param cardObjectUuid - фактическое значение идентификатора "текущего объекта"
 * @return изменённый запрос
 */
private Map<String, Object> transformRequestWithoutComputation(Map<String, Object> requestContent, String cardObjectUuid)
{
    Closure<Map<String, Object>> transform = { Map<String, Object> map ->
        def res = [:] << map
        res.descriptor =
            DashboardMarshaller.substitutionCardObject(res.descriptor as String, cardObjectUuid)
        return res
    }
    return cardObjectUuid ? transform(requestContent) : requestContent
}

private def isCustomGroupFromBreakdown(Map<String, Object> requestContent, DiagramType diagramType = DiagramType.COLUMN)
{
    def requestData = requestContent.data as Map<String, Object>
    List<Boolean> customsInBreakdown = requestData.findResults { key, value ->
        def data = value as Map<String, Object>
        def group = data.group as Map<String, Object>
        def isSystemParameterGroup = group?.way == 'SYSTEM'
        def isCustomBreakdownGroup = data.breakdownGroup?.way == 'CUSTOM' ||
                                     data.breakdown?.group?.way.find() == 'CUSTOM'
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
Map<String, Object> mappingDynamicAttributeCustomGroup(Attribute dynamicAttribute)
{
    if (dynamicAttribute?.property == AttributeType.TOTAL_VALUE_TYPE)
    {
        def (dynAttrCode, uuidForTemplate) = dynamicAttribute.code.split('_', 2)
        dynamicAttribute.code = dynAttrCode
        def groupType = 'object'
        def groupName = 'totalValueGroup'
        dynamicAttribute.attrChains().head().type = AttributeType.OBJECT_TYPE
        dynamicAttribute.attrChains().last().ref = new Attribute(code: 'linkTemplate', type: 'string')

        def subGroupsData = [[data: [title: 'Шаблон атрибута',
                                     uuid: uuidForTemplate],
                              type: 'CONTAINS']]
        def subGroups = [data: [subGroupsData], name: '']

        return [attribute: dynamicAttribute, name: groupName,
                subGroups: [subGroups], type: groupType, id: ''] as Map<String, Object>
    }
    return [:] as Map<String, Object>
}

/**
 * Метод получения списка фильтров
 * @param customGroup - кастомная группировка для построения фильтра
 * @param subjectUUID - идентификатор "текущего объекта"
 * @param place - место, откуда была создана кастомная группировка
 * @return - список фильтров
 */
private FilterList getFilterList(Map<String, Object> customGroup, String subjectUUID, String place) {
    def filterList = customGroup?.subGroups?.collect { subGroup ->
        String attributeType = customGroup.attribute.type.split('\\$', 2).head()
        customGroup.attribute.type = attributeType
        Closure<Collection<Collection<FilterParameter>>> mappingFilters =
            getMappingFilterMethodByType(attributeType, subjectUUID)
        String groupName = subGroup.name
        def filters = mappingFilters(
            subGroup.data as List<List>,
            customGroup.attribute,
            groupName
        )
        return filters
    }
    FilterList filter = new FilterList(
        filters: filterList,
        place: place
    )
    return filter
}

/**
 * Метод получения данных для диаграмм без списков фильтров
 * @param node - нода реквизита запроса
 * @param request - запрос
 * @param aggregationCnt - количество агрегаций
 * @param onlyFilled - флаг на получение только заполненных данных, без null
 * @param diagramType  - тип диаграммы
 * @param requestContent - тело запроса
 * @return сырые данные для построения диаграм
 */
private List getNoFilterListDiagramData(def node, DiagramRequest request, Integer aggregationCnt,  Boolean onlyFilled,  DiagramType diagramType, Map<String,Object> requestContent)
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

            Closure formatAggregation = this.&formatAggregationSet.rcurry(listIdsOfNormalAggregations, onlyFilled)
            Closure formatGroup = this.&formatGroupSet.rcurry(requestData, listIdsOfNormalAggregations, diagramType)
            def res = modules.dashboardQueryWrapper.getData(requestData, onlyFilled, diagramType)
                             .with(formatGroup)
                             .with(formatAggregation)
            def total = res ? [(requisiteNode.title): res] : [:]
            total = formatResult(total, aggregationCnt)
            Boolean hasState = requestData?.groups?.any { value -> value?.attribute?.type == AttributeType.STATE_TYPE } ||
                               requestData?.aggregations.findAll {it.type == Aggregation.NOT_APPLICABLE }
                                          .any { value -> value?.attribute?.type == AttributeType.STATE_TYPE  }
            if (hasState)
            {
                total = prepareRequestWithStates(total, listIdsOfNormalAggregations)
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
                [(key): modules.dashboardQueryWrapper.getData(data as RequestData, onlyFilled, diagramType).with(postProcess)]
            } as Map<String, List>

            //Вычисление формулы. Выглядит немного костыльно...
            Boolean hasState = dataSet.values().head().groups?.any { value -> value?.attribute?.type == AttributeType.STATE_TYPE } ||
                               dataSet.values().head().aggregations?.findAll {it.type == Aggregation.NOT_APPLICABLE }
                                      .any { value -> value?.attribute?.type == AttributeType.STATE_TYPE  }
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
            def total = [(node.title): formatAggregationSet(res, listIdsOfNormalAggregations, onlyFilled)]
            return formatResult(total, aggregationCnt)
        default: throw new IllegalArgumentException("Not supported requisite type: $nodeType")
    }
}

/**
 * Метод получения данных для диаграмм с одним списком фильтров
 * @param node - нода реквизита запроса
 * @param request - запрос
 * @param aggregationCnt - количество агрегаций
 * @param parameterFilters - список фильтров из параметра
 * @param breakdownFilters - список фильтров из разбивки
 * @param onlyFilled - флаг на получение только заполненных данных, без null
 * @param diagramType  - тип диаграммы
 * @param requestContent - тело запроса
 * @return сырые данные для построения диаграм
 */
private List getOneFilterListDiagramData(def node,
                                         DiagramRequest request,
                                         Integer aggregationCnt,
                                         List parameterFilters,
                                         List breakdownFilters,
                                         Boolean onlyFilled,
                                         DiagramType diagramType,
                                         Map<String,Object> requestContent)
{
    String nodeType = node.type
    def filtering = parameterFilters ? parameterFilters : breakdownFilters
    switch (nodeType.toLowerCase())
    {
        case 'default':
            def requisiteNode = node as DefaultRequisiteNode
            RequestData requestData = request.data[requisiteNode.dataKey]
            RequestData newRequestData = requestData.clone()
            List attributes = []
            List<String> notAggregatedAttributes = []
            Boolean customInBreakTable = false
            if (requestContent)
            {
                attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                notAggregatedAttributes = notAggregationAttributeNames(attributes)
                String attrInCustoms = getInnerCustomGroupNames(requestContent).find().attributeName
                String possibleBreakdownAttribute = attributes.last().name
                customInBreakTable = possibleBreakdownAttribute == attrInCustoms
            }
            def listIdsOfNormalAggregations = diagramType == DiagramType.TABLE
                ? request?.data?.findResult { key, value ->
                    value?.aggregations?.withIndex().findResults { val, i -> if(val.type != Aggregation.NOT_APPLICABLE) return i }
                } : [0]
            Closure formatAggregation = this.&formatAggregationSet.rcurry(listIdsOfNormalAggregations, onlyFilled)
            Closure formatGroup = this.&formatGroupSet.rcurry(newRequestData, listIdsOfNormalAggregations, diagramType)
            return filtering*.get(0)?.collectMany {
                newRequestData.filters = [it]
                def res = modules.dashboardQueryWrapper.getData(newRequestData, onlyFilled, diagramType)
                                 .with(formatGroup)
                                 .with(formatAggregation)

                if(!res && !onlyFilled && !customInBreakTable)
                {
                    def tempRes = ['']*(newRequestData.groups.size() + notAggregatedAttributes.size())
                    listIdsOfNormalAggregations.each { id-> tempRes.add(id, 0) }
                    res = [tempRes]
                }
                def partial = (customInBreakTable || onlyFilled) && !res ? [:] :[(it.title.grep() as Set): res]

                partial = formatResult(partial, aggregationCnt + notAggregatedAttributes.size())
                Boolean hasState = newRequestData?.groups?.any { value -> value?.attribute?.type == AttributeType.STATE_TYPE } ||
                                   newRequestData?.aggregations?.findAll {it.type == Aggregation.NOT_APPLICABLE }
                                                 .any { value -> value?.attribute?.type == AttributeType.STATE_TYPE  }
                if (hasState)
                {
                    partial = prepareRequestWithStates(partial, listIdsOfNormalAggregations)
                }
                return partial
            }
        case 'computation':
            def requisiteNode = node as ComputationRequisiteNode
            def calculator = new FormulaCalculator(requisiteNode.formula)
            def dataSet = calculator.variableNames.collectEntries {
                [(it): request.data[it]]
            } as Map<String, RequestData>

            List attributes = []
            List<String> notAggregatedAttributes = []
            if (requestContent)
            {
                attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                notAggregatedAttributes = notAggregationAttributeNames(attributes)
            }
            def listIdsOfNormalAggregations = [0]
            aggregationCnt = 1
            def variables = filtering*.get(0).collect { filter ->
                return dataSet.collectEntries { key, data ->
                    RequestData newData = data.clone()
                    newData.filters = [filter]
                    Closure postProcess = this.&formatGroupSet.rcurry(newData as RequestData, listIdsOfNormalAggregations, diagramType)
                    def res = modules.dashboardQueryWrapper.getData(newData as RequestData, onlyFilled, diagramType)
                    if(!res && !onlyFilled)
                    {
                        def tempRes = ['']*(newData.groups.size() + notAggregatedAttributes.size())
                        listIdsOfNormalAggregations.each { id-> tempRes.add(id, 0) }
                        res = [tempRes]
                    }
                    [(key): res.with(postProcess)]  as Map<String, List>
                }
            }
            int i = 0
            return variables.collectMany { totalVar ->
                Boolean hasState = dataSet.values().head().groups?.any { value -> value?.attribute?.type == AttributeType.STATE_TYPE } ||
                                   dataSet.values().head().aggregations?.findAll {it.type == Aggregation.NOT_APPLICABLE }
                                          .any { value -> value?.attribute?.type == AttributeType.STATE_TYPE  }
                def res = dataSet.values().head().groups?.size() || notAggregatedAttributes.size() ?
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
                    totalVar[key as String].head().head() as Double
                }]]
                def title = filtering*.get(0).title.grep()
                Map total = [( title.any {it[0] != ''} ? title[i++] as Set : ''): formatAggregationSet(res, listIdsOfNormalAggregations, onlyFilled)]
                return onlyFilled && !res ? [] : formatResult(total, aggregationCnt)
            }

        default: throw new IllegalArgumentException("Not supported requisite type: $nodeType")
    }
}

/**
 * Метод получения данных для диаграмм с двумя списками фильтров
 * @param node - нода реквизита запроса
 * @param request - запрос
 * @param aggregationCnt - количество агрегаций
 * @param parameterFilters - список фильтров из параметра
 * @param breakdownFilters - список фильтров из разбивки
 * @param onlyFilled - флаг на получение только заполненных данных, без null
 * @param diagramType  - тип диаграммы
 * @param requestContent - тело запроса
 * @return сырые данные для построения диаграм
 */
private List getTwoFilterListDiagramData(def node,
                                         DiagramRequest request,
                                         Integer aggregationCnt,
                                         List parameterFilters,
                                         List breakdownFilters,
                                         Boolean onlyFilled,
                                         DiagramType diagramType,
                                         Map<String, Object> requestContent)
{
    String nodeType = node.type
    def pareFilters
    Integer countOfCustomsInFirstSource
    Integer countOfCustomsInFullRequest
    if (diagramType == DiagramType.TABLE)
    {
        countOfCustomsInFirstSource = countDataForManyCustomGroupsInParameters(requestContent)
        countOfCustomsInFullRequest = countDataForManyCustomGroupsInParameters(requestContent, false)
    }
    if (diagramType == DiagramType.TABLE && countOfCustomsInFirstSource > 1 || countOfCustomsInFullRequest > 1 )
    {
        pareFilters = breakdownFilters
            ? parameterFilters.collectMany { parameterFilter ->
            breakdownFilters.collect {
                [*parameterFilter, it]
            }
        }
            : parameterFilters//фильтры могут быть от разных параметров, поэтому можно взять их уже в готовом виде
    }
    else
    {
        pareFilters = parameterFilters.collectMany { parameterFilter ->
            breakdownFilters.collect {
                [parameterFilter, it]
            }
        }
    }
    switch (nodeType.toLowerCase())
    {
        case 'default':
            def listIdsOfNormalAggregations = diagramType == DiagramType.TABLE
                ? request?.data?.findResult { key, value ->
                value?.aggregations?.withIndex().findResults { val, i -> if(val.type != Aggregation.NOT_APPLICABLE) return i }
            }
                : [0]
            return pareFilters.collectMany { condition ->
                def requisiteNode = node as DefaultRequisiteNode
                RequestData requestData = request.data[requisiteNode.dataKey]
                RequestData newRequestData = requestData.clone()
                //объединяем попарно фильтр-условие из параметра и группировки
                newRequestData.filters = condition.inject { first, second ->
                    first + second
                }

                List attributes = []
                List<String> notAggregatedAttributes = []
                if (requestContent)
                {
                    attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                    notAggregatedAttributes = notAggregationAttributeNames(attributes)
                }
                Closure formatAggregation = this.&formatAggregationSet.rcurry(listIdsOfNormalAggregations, onlyFilled)
                Closure formatGroup = this.&formatGroupSet.rcurry(newRequestData as RequestData, listIdsOfNormalAggregations, diagramType)
                def res = modules.dashboardQueryWrapper.getData(newRequestData, onlyFilled, diagramType)
                                 .with(formatGroup)
                                 .with(formatAggregation)
                if(!res && !onlyFilled)
                {
                    def tempRes = ['']*(newRequestData.groups.size() + notAggregatedAttributes.size())
                    listIdsOfNormalAggregations.each { id-> tempRes.add(id, 0) }
                    res = [tempRes]
                }
                def total = res ? [(condition.title.flatten().grep() as Set): res] : [:]
                total = formatResult(total, aggregationCnt + notAggregatedAttributes.size())
                Boolean hasState = newRequestData?.groups?.any { value -> value?.attribute?.type == AttributeType.STATE_TYPE } ||
                                   newRequestData?.aggregations?.findAll {it.type == Aggregation.NOT_APPLICABLE }
                                                 .any { value -> value?.attribute?.type == AttributeType.STATE_TYPE  }
                if (hasState)
                {
                    total = prepareRequestWithStates(total, listIdsOfNormalAggregations)
                }
                return total
            }
        case 'computation':
            def requisiteNode = node as ComputationRequisiteNode
            def calculator = new FormulaCalculator(requisiteNode.formula)
            def dataSet = calculator.variableNames.collectEntries {
                [(it): request.data[it]]
            } as Map<String, RequestData>
            aggregationCnt = 1
            def listIdsOfNormalAggregations = [0]
            List attributes = []
            List<String> notAggregatedAttributes = []
            if (requestContent)
            {
                attributes = getAttributeNamesAndValuesFromRequest(requestContent)
                notAggregatedAttributes = notAggregationAttributeNames(attributes)
            }

            def variables = pareFilters.collect { condition ->
                return dataSet.collectEntries { key, data ->
                    RequestData newData = data.clone()
                    newData.filters = condition.inject { first, second ->
                        first + second
                    }
                    Closure postProcess = this.&formatGroupSet.rcurry(newData as RequestData, listIdsOfNormalAggregations, diagramType)
                    def res = modules.dashboardQueryWrapper.getData( newData as RequestData, onlyFilled, diagramType)
                    [(key): res.with(postProcess)]  as Map<String, List>
                }
            }
            def title = pareFilters.title
            return variables.withIndex().collectMany { totalVar, i ->
                Boolean hasState = dataSet.values().head().groups?.any { value -> value?.attribute?.type == AttributeType.STATE_TYPE }||
                                   dataSet.values().head().aggregations?.findAll {it.type == Aggregation.NOT_APPLICABLE }
                                          .any { value -> value?.attribute?.type == AttributeType.STATE_TYPE  }
                def res = dataSet.values().head().groups?.size() || notAggregatedAttributes.size()?
                    findUniqueGroups([0], totalVar).collect { group ->
                        def resultCalculation = calculator.execute { variable ->
                            hasState
                                ? (totalVar[variable as String].sum {
                                        def value = it[1..-1]
                                        group == value ? it[0]  as Double : 0
                                    }?: 0) as Double
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
                Map total = res ? [( title.any {it[0] != ''} ? title[i].flatten() : ''): formatAggregationSet(res, listIdsOfNormalAggregations, onlyFilled)] : [:]
                return formatResult(total, aggregationCnt)
            }
        default: throw new IllegalArgumentException("Not supported requisite type: $nodeType")
    }
}
//endregion