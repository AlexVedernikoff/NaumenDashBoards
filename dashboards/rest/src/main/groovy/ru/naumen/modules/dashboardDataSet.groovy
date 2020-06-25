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

package ru.naumen.modules

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
    Collection<Column> columns = [new Column("", "breakdownTitle", 0)]
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
    Double footer
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
        case [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE]:
            def normRequest = mappingStandardDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(normRequest)
            String key = normRequest.data.keySet().head()
            String legend = normRequest.data[key].aggregations.attribute.sourceName.head()
            return mappingStandardDiagram(res, legend)
        case [DONUT, PIE]:
            def normRequest = mappingRoundDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(normRequest)
            return mappingRoundDiagram(res)
        case SUMMARY:
            def normRequest = mappingSummaryDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(normRequest)
            return mappingSummaryDiagram(res)
        case TABLE:
            def normRequest = mappingTableDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(normRequest)
            def (totalColumn, totalRow) = requestContent.data
                                                        .findResult { key, value ->
                                                            !(value.sourceForCompute) ? value : null
                                                        }
                                                        .with {
                                                            [it.calcTotalColumn, it.calcTotalRow]
                                                        }
            return mappingTableDiagram(res, totalColumn as boolean, totalRow as boolean)
        case COMBO:
            def normRequest = mappingComboDiagramRequest(requestContent, subjectUUID)
            def res = getDiagramData(normRequest)
            def (firstAdditionalData, secondAdditionalData) = (requestContent.data as Map)
                .findAll { key, value -> !(value.sourceForCompute)
                }
                .collect { key, value ->
                    [
                        type     : value.type,
                        breakdown: value.yAxis.title,
                        name     : value.yAxis.title,
                        dataKey  : key
                    ]
                }
            return mappingComboDiagram(res, firstAdditionalData as Map, secondAdditionalData as Map)
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
        def xAxis = data.xAxis as Map<String, Object>
        def group = data.group as Map<String, Object>
        def groupParameter = buildSystemGroup(group, xAxis)
        groupParameter?.sortingType = demoSorting.value == 'PARAMETER' ? demoSorting.type : null

        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        def breakdown = null

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

        def requisite
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
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = group.way == 'CUSTOM'
            ? [attribute: mappingAttribute(xAxis)] + (group.data as Map<String, Object>)
            : null

        if (!customGroup && data.breakdownGroup?.way == 'CUSTOM')
        {
            customGroup = [attribute: mappingAttribute(mayBeBreakdown)]
                        + (data.breakdownGroup.data as Map<String, Object>)
        }
        [(key): [requestData: res, computeData: comp?.computeData, customGroup:
            customGroup, requisite: requisite]]
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

        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        GroupParameter breakdown = null

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

        def requisite
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
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = data.breakdownGroup?.way == 'CUSTOM'
            ? [attribute: mappingAttribute(mayBeBreakdown)] + (
            data.breakdownGroup.data as Map<String, Object>)
            : null

        [(key): [requestData      : res, computeData: comp?.computeData, customGroup:
            customGroup, requisite: requisite]]
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
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
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
 * @return DiagramRequest
 */
private DiagramRequest mappingTableDiagramRequest(Map<String, Object> requestContent,
                                                  String subjectUUID)
{
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)
        def column = data.column as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
            title: 'column',
            type: data.aggregation as Aggregation,
            attribute: mappingAttribute(column)
        )
        def row = data.row as Map<String, Object>

        //в таблице группировка по строке всегда обычная.
        def groupParameter = new GroupParameter(
            title: 'row',
            type: GroupType.OVERLAP,
            attribute: mappingAttribute(row)
        )

        //а вот разбивка может быть кастомной.
        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        def breakdownParameter = null

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
        }

        def res = new RequestData(
            source: source,
            aggregations: [aggregationParameter],
            groups: [groupParameter, breakdownParameter].grep()
        )

        def comp = column?.stringForCompute?.with {
            def compData = column.computeData as Map
            [
                formula    : it as String,
                title      : column.title as String,
                computeData: compData.collectEntries { k, v ->
                    String dataKey = v.dataKey
                    def br = breakdownMap[dataKey] as GroupParameter
                    def aggr = new AggregationParameter(
                        title: 'aggregation',
                        type: v.aggregation as Aggregation,
                        attribute: mappingAttribute(v.attr as Map)
                    )
                    [(k): [aggregation: aggr, group: br, dataKey: dataKey]]
                }
            ]
        }

        def requisite
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
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = data.breakdownGroup?.way == 'CUSTOM'
            ? [attribute: mappingAttribute(mayBeBreakdown)] + (
            data.breakdownGroup.data as Map<String, Object>)
            : null

        [(key): [requestData      : res, computeData: comp?.computeData, customGroup:
            customGroup, requisite: requisite]]
    } as Map<String, Map>
    return buildDiagramRequest(intermediateData, subjectUUID)
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

        def groupParameter = buildSystemGroup(group, xAxis)
        groupParameter?.sortingType = demoSorting.value == 'PARAMETER' ? demoSorting.type : null
        def mayBeBreakdown = data.breakdown
        def breakdownMap = [:]
        def breakdown = null

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

        def requisite
        if (data.sourceForCompute)
        {
            requisite = null
        }
        else
        {
            //TODO: Важный момент. Названия записей специально заполнены нулами.
            // На названиях подвязана логика работы с кастомными группировками
            def requisiteNode = comp
                ? new ComputationRequisiteNode(
                title: null,
                type: 'COMPUTATION',
                formula: comp.formula
            )
                : new DefaultRequisiteNode(title: null, type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = group.way == 'CUSTOM'
            ? [attribute: mappingAttribute(xAxis)] + (group.data as Map<String, Object>)
            : null

        if (!customGroup && data.breakdownGroup?.way == 'CUSTOM')
        {
            customGroup = [attribute: mappingAttribute(mayBeBreakdown)]
                        + (data.breakdownGroup.data as Map<String, Object>)
        }
        [(key): [requestData: res, computeData: comp?.computeData, customGroup:
            customGroup, requisite: requisite]]
    } as Map<String, Map>
    return buildDiagramRequest(intermediateData, subjectUUID)
}

/**
 * Метод создания параметра группировки основанного только на системных группировках
 * @param groupType - объект описывающий группировку
 * @param attr - атрибут
 * @return параметр группировки
 */
private GroupParameter buildSystemGroup(Map<String, Object> groupType, Map<String, Object> attr)
{
    return groupType?.way == 'SYSTEM' ? new GroupParameter(
        title: 'breakdown',
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
 * @return
 */
private DiagramRequest buildDiagramRequest(Map<String, Map> intermediateData, String subjectUUID)
{
    // доводим запрос до совершенства/ шлифуем вычисления
    Closure getRequestData = { String key -> intermediateData[key].requestData
    }
    def computationDataRequest = intermediateData
        .findResults { key, value -> value.computeData ? value : null
        }
        ?.collectEntries(this.&produceComputationData.curry(getRequestData)) ?: [:]

    def defaultDataRequest = intermediateData.findResults { key, map ->
        map.requisite && !(map.computeData) ? [(key): map.requestData] : null
    }?.collectEntries() ?: [:]

    def resultRequestData = (
        defaultDataRequest + computationDataRequest) as Map<String, RequestData>

    // Реквизиты
    Collection<Requisite> requisite = intermediateData.findResults { key, value ->
        value.requisite as Requisite
    }

    // доводим запрос до совершенства/ шлифуем кастомную группировку
    Map<String, List<List>> splitData = intermediateData
        .findAll { key, value -> value.customGroup
        }
        ?.collectEntries(this.&convertCustomGroup.curry(getRequestData, subjectUUID))

    def groupKeyMap = splitData?.collect { key, list ->
        def newDataSet = list.collectEntries { el ->
            def (newKey, dataSet) = el.tail()
            [(newKey): dataSet]
        } as Map<String, RequestData>
        resultRequestData.remove(key)
        resultRequestData.putAll(newDataSet)

        list.collect { el ->
            def (String groupName, String newKey) = el
            [groupName, key, newKey]
        }
    }

    requisite.each { req ->
        def node = req.nodes.head()
        String nodeType = node.type
        Closure<RequisiteNode> mappingRequisiteNodes

        switch (nodeType)
        {
            case 'COMPUTATION':
                mappingRequisiteNodes = { String group, List<List<String>> list ->
                    String formula = (node as ComputationRequisiteNode).formula
                    String newFormula = list.inject(formula) { string, keySet ->
                        def (oldKey, newKey) = keySet.tail()
                        string.replace(oldKey as String, newKey as String)
                    }
                    new ComputationRequisiteNode(
                        title: group,
                        type: 'COMPUTATION',
                        formula: newFormula
                    )
                }
                break
            case 'DEFAULT':
                mappingRequisiteNodes = { String group, List<List<String>> list ->
                    def key = list.find { l -> l[1] == (node as DefaultRequisiteNode).dataKey
                    }[2]
                    new DefaultRequisiteNode(title: group, type: 'DEFAULT', dataKey: key)
                }
                break
            default: throw new IllegalArgumentException("Not supported requisite type: $nodeType")
        }
        if (groupKeyMap)
        {
            groupKeyMap.inject { first, second ->
                first + second
            }.groupBy {
                it.head()
            }.collect { group, list ->
                mappingRequisiteNodes(group, list)
            }.with {
                req.title = 'partial'
                req.nodes = it
            }
        }
    }
    return new DiagramRequest(requisite: requisite, data: resultRequestData)
}

/**
 * Метод обработки вычислений
 * @param getData - функция получения источника данных по ключю
 * @param map - данные для вычислений
 * @return сгруппированные данные по названию переменной и источнику данных
 */
private Map<String, RequestData> produceComputationData(Closure getData, Map map)
{
    def computeData = map.computeData as Map<String, Object>
    // делаем предположение. Если есть вычисление значит реквизиты точно есть
    def req = map.requisite as Requisite
    //в записи лежит формула
    def node = req.nodes.head()
    //по идее на этом этапе у нас только один реквизит и у него одна запись
    def formula = (node as ComputationRequisiteNode).formula
    def variableNames = new FormulaCalculator(formula).variableNames

    variableNames.collectEntries { variableName ->
        def comp = computeData[variableName] as Map<String, Object>

        def attribute = comp?.aggregation?.attribute
        def attributeType = attribute?.type
        if (attributeType in AttributeType.LINK_TYPES)
        {
            attribute.attrChains().last().ref = new Attribute(title: 'Название', code: 'title', type: 'string')
        }

        def dataKey = comp.dataKey as String
        // этот ключь указывает на источник вместе с группировками

        def requestData = getData(dataKey) as RequestData
        def group = comp.group as GroupParameter
        def aggregation = comp.aggregation as AggregationParameter
        requestData.aggregations = [aggregation]
        // предполагаем что количество агрегаций будет не больше одной
        requestData.groups = (requestData.groups || group) ? (requestData.groups + group).grep() :
            null
        // группировку нужно будет добавить к существующим
        requestData.groups = requestData.groups as Set
        [(variableName): requestData]
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
                String uuid = condition.data.uuid
                def value = api.utils.get(uuid)
                return new FilterParameter(
                    value: value,
                    title: title,
                    type: Comparison.NOT_EQUAL_REMOVED,
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
            case 'not_contains_not_empty':
                return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS_AND_NOT_NULL)
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
                def dateSet = condition.data as Map<String, Object> // тут будет массив дат
                def start = Date.parse(dateFormat, dateSet.startDate as String)
                def end = Date.parse(dateFormat, dateSet.endDate as String)
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
                def titleAttribute = new Attribute(title: 'название', code: 'title', type: 'string')
                def tempAttribute = attribute.deepClone()
                tempAttribute.addLast(titleAttribute)
                return buildFilterParameterFromCondition(Comparison.CONTAINS, tempAttribute, condition.data)
            case 'title_not_contains':
                def titleAttribute = new Attribute(title: 'название', code: 'title', type: 'string')
                def tempAttribute = attribute.deepClone()
                tempAttribute.addLast(titleAttribute)
                return buildFilterParameterFromCondition(Comparison.NOT_CONTAINS, tempAttribute, condition.data)
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
                temAttribute.
                    addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                return buildFilterParameterFromCondition(Comparison.CONTAINS, temAttribute, value)
            case 'status_not_contains':
                def status = condition.data.value.toString()
                String value = status.toLowerCase().charAt(0)
                def temAttribute = attribute.deepClone()
                temAttribute.
                    addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
                return
                buildFilterParameterFromCondition(Comparison.NOT_CONTAINS, temAttribute, value)
            case 'expiration_contains':
                def comparison =
                    condition.data.value == 'EXCEED' ? Comparison.CONTAINS : Comparison.NOT_CONTAINS
                def temAttribute = attribute.deepClone()
                temAttribute.
                    addLast(new Attribute(title: 'статус', code: 'statusCode', type: 'string'))
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
                attribute.attrChains().last().ref = new Attribute(
                    title: 'Название',
                    code: 'title',
                    type: 'string'
                )
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
 * @return сырые данные для построения диаграм
 */
private def getDiagramData(DiagramRequest request)
{
    //TODO: уже сверхкостыльно получается. Нужно придумать решение по лучше
    assert request: "Empty request!"
    return request.requisite.collect { requisite ->
        def result = requisite.nodes.collectEntries { node ->
            String nodeType = node.type
            switch (nodeType.toLowerCase())
            {
                case 'default':
                    def requisiteNode = node as DefaultRequisiteNode
                    RequestData requestData = request.data[requisiteNode.dataKey]
                    Closure formatAggregation = this.&formatAggregationSet
                    Closure formatGroup = this.&formatGroupSet.curry(requestData)
                    def res = modules.dashboardQueryWrapper.getData(requestData).with(formatGroup).with(formatAggregation)
                    return res ? [(requisiteNode.title): res] : [:]
                case 'computation':
                    def requisiteNode = node as ComputationRequisiteNode
                    def calculator = new FormulaCalculator(requisiteNode.formula)
                    def dataSet = calculator.variableNames.collectEntries {
                        [(it): request.data[it]]
                    } as Map<String, RequestData>
                    if (!checkGroupTypes(dataSet.values()))
                    {
                        throw new IllegalArgumentException("Wrong group types in calculation!")
                    }
                    def variables = dataSet.collectEntries { key, data ->
                        Closure postProcess = this.&formatGroupSet.curry(data as RequestData)
                        [(key): modules.dashboardQueryWrapper.getData(data as RequestData).with(
                            postProcess
                        )]
                    } as Map<String, List>

                    //Вычисление формулы. Выглядит немного костыльно...
                    def res = dataSet.values().head().groups?.size() ?
                        findUniqueGroups(variables).collect { group ->
                            def resultCalculation = calculator.execute { variable ->
                                (variables[variable as String].findResult {
                                    group == it.tail() ? it.head() : null
                                } ?: 0) as Double
                            }
                            return [resultCalculation, group].flatten()
                        } : [[calculator.
                        execute { key -> variables[key as String].head().head() as Double
                        }]]
                    return [(node.title): formatAggregationSet(res)]
                default: throw new IllegalArgumentException("Not supported requisite type: $nodeType")
            }
        }
        return formatResult(result)
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
    return listRequest.tail().every { el ->
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
private Collection<Collection<String>> findUniqueGroups(def variables)
{ // работает только с методами которые имеют группировки. В противном случае бросает исключение
    return variables.values().collect { el ->
        el ? el.transpose().tail().transpose() : []
    }.inject([]) { first, second ->
        first + second
    }.unique() as Collection<Collection<String>>
}

/**
 * Метод округления числовых результатов
 * @param list - список числовых значений
 * @return список округлённых числовых значений
 */
private List formatAggregationSet(List list)
{
    return list.collect { [DECIMAL_FORMAT.format((it as List).head() as Double), (it as List).tail()].flatten() }
}

/**
 * Метод приведения значений группировок к читаемому для человека виду
 * @param data - данные запроса
 * @param list - результат выборки
 * @return результат выборки с изменёнными значениями группировки
 */
private List formatGroupSet(RequestData data, List list)
{
    assert data.aggregations.grep().size() == 1: "Not supported data format"
    def countGroup = data.groups.grep().size()
    assert countGroup < 3: "Not supported data format"

    // работатет только при одной агрегации и группировкам не больше 2
    switch (countGroup)
    {
        case 0:
            return list
        case 1:
            return list.collect { el ->
                def (value, String group) = el
                Closure formatGroup = this.&formatGroup.curry(data.groups[0], data.source.classFqn)
                [value, formatGroup(group)]
            }
        case 2:
            return list.collect { el ->
                def (value, String group, String breakdown) = el
                Closure formatGroup =
                    this.&formatGroup.curry(data.groups[0] as GroupParameter, data.source.classFqn)
                Closure formatBreakdown =
                    this.&formatGroup.curry(data.groups[1] as GroupParameter, data.source.classFqn)
                [value, formatGroup(group), formatBreakdown(breakdown)]
            }
    }
}

/**
 * Метод преобразования значения группировки в зависимости от типа
 * @param parameter - тип группировки
 * @param fqnClass - класс атрибута группировки
 * @param value - значение группировки
 * @return человеко читаемое значение группировки
 */
private String formatGroup(GroupParameter parameter, String fqnClass, String value)
{
    GroupType type = parameter.type
    //TODO: дополнить новыми типами группировки
    switch (type)
    {
        case GroupType.OVERLAP:
            switch (parameter.attribute.type)
            {
                case AttributeType.DT_INTERVAL_TYPE:
                    return TimeUnit.MILLISECONDS.toHours(value as long)
                case AttributeType.STATE_TYPE:
                    return api.metainfo.getStateTitle(fqnClass, value)
                case AttributeType.META_CLASS_TYPE:
                    return api.metainfo.getMetaClass(value).title
                default:
                    return parameter.attribute?.code == 'UUID' ? value.split('\\$', 2)[1] : value
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
                String[] dateParts = value.split(', ')
                dateParts[0] = dateParts[0].tokenize('./')*.padLeft(2, '0').join('.')
                dateParts[1] = dateParts[1].padLeft(2, '0')
                return "${dateParts[0]}, ${dateParts[1]}ч"
            case 'dd.mm.YY hh:ii':
                return value
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
                    return value
                default:
                    return "$value кв-л"
            }
        case [GroupType.WEEK, GroupType.YEAR]:
            String format = parameter.format
            switch (format) {
                case 'ww':
                    return value + '-я'
                default:
                    return value
            }
        case GroupType.SEVEN_DAYS:
            def russianLocale = new Locale("ru")
            SimpleDateFormat standardDateFormatter = new SimpleDateFormat("yyyy-MM-dd", russianLocale)
            SimpleDateFormat specialDateFormatter = new SimpleDateFormat("dd MMMM", russianLocale)
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
            return value.padLeft(2, '0')
        case GroupType.HOURS:
            value = value.tokenize(':/')*.padLeft(2, '0').join(':')
            return value
        case GroupType.SECOND_INTERVAL:
        case GroupType.MINUTE_INTERVAL:
        case GroupType.HOUR_INTERVAL:
        case GroupType.DAY_INTERVAL:
        case GroupType.WEEK_INTERVAL:
        case GroupType.getTimerTypes():
            return value
        default: throw new IllegalArgumentException("Not supported type: $type")
    }
}

/**
 * Метод приведения результата выборки к единой структуре
 * @param data - результат выполнения запроса на получение данных диаграммы
 * @return результат запроса данных диаграммы
 */
private def formatResult(Map data)
{
    return data ? data.collect { key, list ->
        key ? list?.collect {
            [it.head() ?: 0, key, it.tail()].flatten()
        } ?: [[0, key]] : list
    }.inject { first, second -> first + second
    } : []
}

/**
 * Метод преобразования результата выборки к стандартной диаграмме
 * @param list - данные диаграмы
 * @return StandardDiagram
 */
private StandardDiagram mappingStandardDiagram(List list, String legendName)
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
            return new StandardDiagram(categories: groupResult as Set, series: series)
        case 3:
            def (groupResult, breakdownResult) = transposeDataSet.tail()
            def categories = groupResult as Set
            def series = (breakdownResult as Set).collect { breakdownValue ->
                def data = categories.collect { groupValue ->
                    (list.head() as List<List>).findResult { el ->
                        el.tail() == [groupValue, breakdownValue] ? el.head() : null
                    } ?: 0
                }
                new Series(name: breakdownValue, data: data)
            }
            return new StandardDiagram(categories: categories, series: series)
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
            }, labels: groupResult as Set)
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
 * Метод преобразования результата выборки к таблице
 * @param list - данные диаграмы
 * @return TableDiagram
 */
private TableDiagram mappingTableDiagram(List list, boolean totalColumn, boolean totalRow)
{
    def resultDataSet = list.head() as List<List>
    def transposeDataSet = resultDataSet.transpose()
    switch (transposeDataSet.size())
    {
        case 0: // если результирующее множество пустое
            return new TableDiagram()
        case 3:
            def (aggregationSet, breakdownSet, groupSet) = transposeDataSet
            Collection<Column> columns = (groupSet as Set<String>).collect { group ->
                Double total = totalColumn ? resultDataSet.sum { el ->
                    el[2] == group ? el.head() as double : 0
                }.with(DECIMAL_FORMAT.&format) as Double : 0
                new Column(header: group, accessor: group.replace('.', ' '), footer: total)
            }

            columns.add(0, new Column(header: '', accessor: 'breakdownTitle', footer: 0))

            List<Map<Object, Object>> data = (breakdownSet as Set<String>).collect { breakdown ->
                def res = resultDataSet.findAll {
                    it[1] == breakdown
                }.collectEntries { dataList ->
                    def (aggregationResult, _, groupResult) = dataList
                    def key = (groupResult as String).replace('.', ' ')
                    [(key): aggregationResult as String]
                }
                [breakdownTitle: breakdown.replace('.', ' ')] + res
            }

            if (totalRow)
            {
                Double totalResult = totalColumn
                    ? (aggregationSet as List).sum {
                    it as double
                }.with(DECIMAL_FORMAT.&format) as Double
                    : 0
                columns += new Column('Итого', 'total', totalResult)
                data.each { el ->
                    el << [total: el.values().tail().sum(DECIMAL_FORMAT.&parse).with(
                        DECIMAL_FORMAT.&format
                    ) as Double]
                }
            }
            return new TableDiagram(columns: columns, data: data)
        default: throw new IllegalArgumentException('Invalid format result data set')
    }
}

/**
 * Метод преобразования результата выборки к комбо диаграме
 * @param list - данные диаграмы
 * @return ComboDiagram
 */
private ComboDiagram mappingComboDiagram(List list,
                                         Map firstAdditionalData,
                                         Map secondAdditionalData)
{
    def (firstResultDataSet, secondResultDataSet) = list
    def firstTransposeDataSet = (firstResultDataSet as List<List>)?.transpose() ?: []
    def secondTransposeDataSet = (secondResultDataSet as List<List>)?.transpose() ?: []

    Set labels = (firstTransposeDataSet[1] ?: []) + (secondTransposeDataSet[1] ?: [])

    Closure getsSeries = { Set labelSet, List<List> dataSet, Map additionalData ->
        def transposeData = dataSet?.transpose() ?: []
        switch (transposeData.size())
        {
            case 0:
                return []
            case 2:
                Collection data = labelSet.collect { group ->
                    dataSet.findResult {
                        it[1] == group ? it[0] : null
                    } ?: '0'
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
                return (transposeData[2] as Set).collect { breakdown ->
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
            default: throw new IllegalArgumentException('Invalid format result data set')
        }
    }

    def firstSeries = getsSeries(labels, firstResultDataSet as List<List>, firstAdditionalData)
    def secondSeries = getsSeries(labels, secondResultDataSet as List<List>, secondAdditionalData)

    return new ComboDiagram(labels: labels, series: firstSeries + secondSeries)
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
        return [type: map.type, data: newData, sorting: map.sorting]
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
//endregion
