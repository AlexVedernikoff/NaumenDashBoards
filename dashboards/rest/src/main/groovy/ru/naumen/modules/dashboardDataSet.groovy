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
 * @return ассоциативный массив из ключа виджета и данных диаграммы
 */
String getDataForDiagrams(Map<String, Object> requestContent, String cardObjectUuid)
{
    return requestContent.collectEntries { key, value ->
        api.tx.call {
            try
            {
                return [(key): buildDiagram(transformRequest(value as Map<String, Object>, cardObjectUuid))]
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
 * @return данные для построения диаграммы
 */
String getDataForDiagram(Map<String, Object> requestContent, String cardObjectUuid)
{
    return api.tx.call {
        buildDiagram(transformRequest(requestContent, cardObjectUuid))
    }.with(JsonOutput.&toJson)
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Метод построения диаграмм.
 * @param requestContent - запрос на построение диаграмы
 * @return Типизированниые данные для построения диаграмм
 */
private def buildDiagram(Map<String, Object> requestContent)
{
    def diagramType = requestContent.type as DiagramType
    switch (diagramType)
    {
        case [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE]:
            def normRequest = mappingStandardDiagramRequest(requestContent)
            def res = getDiagramData(normRequest)
            return mappingStandardDiagram(res)
        case [DONUT, PIE]:
            def normRequest = mappingRoundDiagramRequest(requestContent)
            def res = getDiagramData(normRequest)
            return mappingRoundDiagram(res)
        case SUMMARY:
            def normRequest = mappingSummaryDiagramRequest(requestContent)
            def res = getDiagramData(normRequest)
            return mappingSummaryDiagram(res, normRequest.requisite.head().title)
        case TABLE:
            def normRequest = mappingTableDiagramRequest(requestContent)
            def res = getDiagramData(normRequest)
            def (totalColumn, totalRow) = requestContent.data
                    .findResult { key, value -> !(value.sourceForCompute) ? value : null }
                    .with { [it.calcTotalColumn, it.calcTotalRow] }
            return mappingTableDiagram(res, totalColumn as boolean, totalRow as boolean)
        case COMBO:
            def normRequest = mappingComboDiagramRequest(requestContent)
            def res = getDiagramData(normRequest)

            def (firstAdditionalData, secondAdditionalData) = (requestContent.data as Map)
                    .findAll { key, value -> !(value.sourceForCompute) }
                    .collect { key, value ->
                        [
                                type     : value.type,
                                breakdown: value.yAxis.title,
                                name     : value.yAxis.title,
                                dataKey  : key
                        ]
                    }
            return mappingComboDiagram(res, firstAdditionalData as Map, secondAdditionalData as Map)
        default: throw new Exception("Not supported diagram type: $diagramType")
    }
}

/**
 * Метод приведения запроса на построение стандартных диаграм к единому формату
 * @param requestContent - запрос на построеине стандатной диаграмы
 * @return DiagramRequest
 */
private DiagramRequest mappingStandardDiagramRequest(Map<String, Object> requestContent)
{
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)
        def yAxis = data.yAxis as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
                title: 'yAxis',
                type: data.aggregation as Aggregation,
                attribute: mappingAttribute(yAxis)
        )
        def xAxis = data.xAxis as Map<String, Object>
        def group = data.group as Map<String, Object>
        def groupParameter = group.way == 'SYSTEM'
                ? new GroupParameter(title: 'xAxis', type: group.data as GroupType, attribute: mappingAttribute(xAxis))
                : null
        def breakdown = data.breakdown?.with {
            def breakdownGroup = data.breakdownGroup as Map<String, Object>
            new GroupParameter(
                    title: 'breakdown',
                    type: breakdownGroup.way == 'SYSTEM' ? breakdownGroup.data as GroupType : GroupType.NONE,
                    attribute: mappingAttribute(it as Map<String, Object>)
            )
        }
        def res = new RequestData(
                source: source,
                aggregations: [aggregationParameter],
                groups: [groupParameter, breakdown].grep()
        )

        def comp = yAxis?.stringForCompute?.with {
            [
                    formula    : it as String,
                    title      : yAxis.title as String,
                    computeData: yAxis.computeData as Map<String, Object>
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
                    ? new ComputationRequisiteNode(title: comp.title, type: 'COMPUTATION', formula: comp.formula)
                    : new DefaultRequisiteNode(title: 'main group', type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = group.way == 'CUSTOM'
                ? [attribute: mappingAttribute(xAxis)] + (group.data as Map<String, Object>)
                : null

        [(key): [requestData: res, computeData: comp?.computeData, customGroup: customGroup, requisite: requisite]]
    } as Map<String, Map>

    // Первая часть запроса имеется, но не полная
    Map<String, RequestData> data = intermediateData.collectEntries { key, value ->
        [(key): value.requestData]
    } as Map<String, RequestData>

    // доводим запрос до совершенства/ шлифуем вычисления
    intermediateData.findAll { key, value -> value.computeData }?.each { key, map ->
        def computeData = map.computeData as Map<String, Object>
        def req = map.requisite as Requisite
        def node = req.nodes.head()
        //по идее на этом этапе у нас только один реквизит и у него одна запись
        def formula = (node as ComputationRequisiteNode).formula
        def keys = new FormulaCalculator(formula).variableNames
        keys.collect { computeData[it] }.each { el ->
            def comp = el as Map<String, Object>
            def attribute = comp.attr as Map<String, Object>
            def aggregationType = comp.aggregation as Aggregation
            def dataKey = comp.dataKey as String // этот ключь должен заменить старый в формуле

            // предполагаем, что агрегация может быть только одна
            data[dataKey].aggregations = [new AggregationParameter(title: 'yAxis', type: aggregationType, attribute: mappingAttribute(attribute))]
        }
        def newFormula = keys.collect { variable ->
            [variable, (computeData[variable] as Map<String, Object>).dataKey]
        }.inject(formula) { string, keySet ->
            def (oldKey, newKey) = keySet
            string.replace(oldKey as String, newKey as String)
        }
        req.nodes = [new ComputationRequisiteNode(title: node.title, type: node.type, formula: newFormula)]
        map.requisite = req
    }

    // Реквизиты
    Collection<Requisite> requisite = intermediateData.findResults { key, value ->
        value.requisite as Requisite
    }

    // доводим запрос до совершенства/ шлифуем кастомную группировку
    Map<String, List<List>> splitData = intermediateData
            .findAll { key, value -> value.customGroup }
            ?.collectEntries { key, value ->
                def customGroup = value.customGroup as Map<String, Object>
                customGroup.type // тип атрибута капсом
                def subGroups = customGroup.subGroups as Collection // интересующие нас группы.
                def requestData = data[key as String]
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
                [(key): dataSet]
            }

    def groupKeyMap = splitData?.collect { key, list ->
        def newDataSet = list.collectEntries { el ->
            def (newKey, dataSet) = el.tail()
            [(newKey): dataSet]
        } as Map<String, RequestData>
        data.remove(key)
        data.putAll(newDataSet)

        list.collect { el ->
            def (String groupName, String newKey) = el
            [groupName, key, newKey]
        }
    }

    Closure<RequisiteNode> mappingRequisiteNodes
    def requisiteNode = requisite.head().nodes.head()
    String nodeType = requisiteNode.type
    switch (nodeType)
    {
        case 'COMPUTATION':
            mappingRequisiteNodes = { String group, List<List<String>> list ->
                String formula = (requisiteNode as ComputationRequisiteNode).formula
                String newFormula = list.inject(formula) { string, keySet ->
                    def (oldKey, newKey) = keySet.tail()
                    string.replace(oldKey as String, newKey as String)
                }
                new ComputationRequisiteNode(title: group, type: 'COMPUTATION', formula: newFormula)
            }
            break
        case 'DEFAULT':
            mappingRequisiteNodes = { String group, List<List<String>> list ->
                def key = list.head()[2]
                new DefaultRequisiteNode(title: group, type: 'DEFAULT', dataKey: key)
            }
            break
        default: throw new Exception("Not supported requisite type: $nodeType")
    }

    def newRequisiteNodes = groupKeyMap ? groupKeyMap.inject { first, second ->
        first + second
    }?.groupBy { it.head() }?.collect { group, list ->
        mappingRequisiteNodes(group, list)
    } : null

    newRequisiteNodes?.with {
        requisite = [new Requisite(title: 'partial', nodes: it)]
    }

    return new DiagramRequest(requisite: requisite, data: data)
}

/**
 * Метод приведения запроса на построение круговых диаграм к единому формату
 * @param requestContent - запрос на построеине круговой диаграмы
 * @return DiagramRequest
 */
private DiagramRequest mappingRoundDiagramRequest(Map<String, Object> requestContent)
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

        def breakdown = data.breakdown as Map<String, Object>
        def group = data.breakdownGroup as Map<String, Object>
        def groupParameter = group.way == 'SYSTEM'
                ? new GroupParameter(title: 'breakdown', type: group.data as GroupType, attribute: mappingAttribute(breakdown))
                : null

        def res = new RequestData(
                source: source,
                aggregations: [aggregationParameter],
                groups: [groupParameter].grep()
        )

        def comp = indicator.stringForCompute?.with {
            [
                    formula    : it as String,
                    title      : indicator.title as String,
                    computeData: indicator.computeData as Map<String, Object>
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
                    ? new ComputationRequisiteNode(title: comp.title, type: 'COMPUTATION', formula: comp.formula)
                    : new DefaultRequisiteNode(title: 'main group', type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = group.way == 'CUSTOM'
                ? [attribute: mappingAttribute(breakdown)] + (group.data as Map<String, Object>)
                : null

        [(key): [requestData: res, computeData: comp?.computeData, customGroup: customGroup, requisite: requisite]]
    } as Map<String, Map>

    Map<String, RequestData> data = intermediateData.collectEntries { key, value ->
        [(key): value.requestData]
    } as Map<String, RequestData>

    intermediateData.findAll { key, value -> value.computeData }?.each { key, map ->
        def computeData = map.computeData as Map<String, Object>
        def req = map.requisite as Requisite
        def node = req.nodes.head()
        //по идее на этом этапе у нас только один реквизит и у него одна запись
        def formula = (node as ComputationRequisiteNode).formula
        def keys = new FormulaCalculator(formula).variableNames
        keys.collect { computeData[it] }.each { el ->
            def comp = el as Map<String, Object>
            def attribute = comp.attr as Map<String, Object>
            def aggregationType = comp.aggregation as Aggregation
            def dataKey = comp.dataKey as String // этот ключь должен заменить старый в формуле

            // предполагаем, что агрегация может быть только одна
            data[dataKey].aggregations = [new AggregationParameter(title: 'indicator', type: aggregationType, attribute: mappingAttribute(attribute))]
        }
        def newFormula = keys.collect { variable ->
            [variable, (computeData[variable] as Map<String, Object>).dataKey]
        }.inject(formula) { string, keySet ->
            def (oldKey, newKey) = keySet
            string.replace(oldKey as String, newKey as String)
        }
        req.nodes = [new ComputationRequisiteNode(title: node.title, type: node.type, formula: newFormula)]
        map.requisite = req
    }

    Collection<Requisite> requisite = intermediateData.findResults { key, value ->
        value.requisite as Requisite
    }

    Map<String, List<List>> splitData = intermediateData
            .findAll { key, value -> value.customGroup }
            ?.collectEntries { key, value ->
                def customGroup = value.customGroup as Map<String, Object>
                customGroup.type // тип атрибута капсом
                def subGroups = customGroup.subGroups as Collection // интересующие нас группы.
                def requestData = data[key as String]
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
                [(key): dataSet]
            }

    def groupKeyMap = splitData?.collect { key, list ->
        def newDataSet = list.collectEntries { el ->
            def (newKey, dataSet) = el.tail()
            [(newKey): dataSet]
        } as Map<String, RequestData>
        data.remove(key)
        data.putAll(newDataSet)

        list.collect { el ->
            def (String groupName, String newKey) = el
            [groupName, key, newKey]
        }
    }

    Closure<RequisiteNode> mappingRequisiteNodes
    def requisiteNode = requisite.head().nodes.head()
    String nodeType = requisiteNode.type
    switch (nodeType)
    {
        case 'COMPUTATION':
            mappingRequisiteNodes = { String group, List<List<String>> list ->
                String formula = (requisiteNode as ComputationRequisiteNode).formula
                String newFormula = list.inject(formula) { string, keySet ->
                    def (oldKey, newKey) = keySet.tail()
                    string.replace(oldKey as String, newKey as String)
                }
                new ComputationRequisiteNode(title: group, type: 'COMPUTATION', formula: newFormula)
            }
            break
        case 'DEFAULT':
            mappingRequisiteNodes = { String group, List<List<String>> list ->
                def key = list.head()[2]
                new DefaultRequisiteNode(title: group, type: 'DEFAULT', dataKey: key)
            }
            break
        default: throw new Exception("Not supported requisite type: $nodeType")
    }

    def newRequisiteNodes = groupKeyMap ? groupKeyMap.inject { first, second ->
        first + second
    }?.groupBy { it.head() }?.collect { group, list ->
        mappingRequisiteNodes(group, list)
    } : null

    newRequisiteNodes?.with {
        requisite = [new Requisite(title: 'partial', nodes: it)]
    }

    return new DiagramRequest(requisite: requisite, data: data)
}

/**
 * Метод приведения запроса на построение сводки к единому формату
 * @param requestContent - запрос на построеине сводки
 * @return DiagramRequest
 */
private DiagramRequest mappingSummaryDiagramRequest(Map<String, Object> requestContent)
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

        def comp = indicator.stringForCompute?.with {
            [
                    formula    : it as String,
                    title      : indicator.title as String,
                    computeData: indicator.computeData as Map<String, Object>
            ]
        }
        String attributeTitle = indicator.title
        def requisite
        if (data.sourceForCompute)
        {
            requisite = null
        }
        else
        {
            def requisiteNode = comp
                    ? new ComputationRequisiteNode(title: comp.title, type: 'COMPUTATION', formula: comp.formula)
                    : new DefaultRequisiteNode(title: attributeTitle, type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        [(key): [requestData: res, computeData: comp?.computeData, customGroup: null, requisite: requisite]]
    } as Map<String, Map>


    Map<String, RequestData> data = intermediateData.collectEntries { key, value ->
        [(key): value.requestData]
    } as Map<String, RequestData>

    intermediateData.findAll { key, value -> value.computeData }?.each { key, map ->
        def computeData = map.computeData as Map<String, Object>
        def req = map.requisite as Requisite
        def node = req.nodes.head()
        //по идее на этом этапе у нас только один реквизит и у него одна запись
        def formula = (node as ComputationRequisiteNode).formula
        def keys = new FormulaCalculator(formula).variableNames
        keys.collect { computeData[it] }.each { el ->
            def comp = el as Map<String, Object>
            def attribute = comp.attr as Map<String, Object>
            def aggregationType = comp.aggregation as Aggregation
            def dataKey = comp.dataKey as String // этот ключь должен заменить старый в формуле

            // предполагаем, что агрегация может быть только одна
            data[dataKey].aggregations = [new AggregationParameter(title: 'indicator', type: aggregationType, attribute: mappingAttribute(attribute))]
        }
        def newFormula = keys.collect { variable ->
            [variable, (computeData[variable] as Map<String, Object>).dataKey]
        }.inject(formula) { string, keySet ->
            def (oldKey, newKey) = keySet
            string.replace(oldKey as String, newKey as String)
        }
        req.nodes = [new ComputationRequisiteNode(title: node.title, type: node.type, formula: newFormula)]
        map.requisite = req
    }

    Collection<Requisite> requisite = intermediateData.findResults { key, value ->
        value.requisite as Requisite
    }
    return new DiagramRequest(requisite: requisite, data: data)
}

/**
 * Метод приведения запроса на построение таблицы к единому формату
 * @param requestContent - запрос на построеине таблицы
 * @return DiagramRequest
 */
private DiagramRequest mappingTableDiagramRequest(Map<String, Object> requestContent)
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
        def groupParameter = new GroupParameter(title: 'row', type: GroupType.OVERLAP, attribute: mappingAttribute(row))

        //а вот разбивка может быть кастомной.
        def breakdown = data.breakdown as Map<String, Object>
        def breakdownGroup = data.breakdownGroup as Map<String, Object>

        def breakdownParameter = breakdownGroup.way == 'SYSTEM' ? new GroupParameter(
                title: 'breakdown',
                type: breakdownGroup.data as GroupType,
                attribute: mappingAttribute(breakdown)
        ) : null

        def res = new RequestData(
                source: source,
                aggregations: [aggregationParameter],
                groups: [groupParameter, breakdownParameter].grep()
        )

        def comp = column.stringForCompute?.with {
            [
                    formula    : it as String,
                    title      : column.title as String,
                    computeData: column.computeData as Map<String, Object>
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
                    ? new ComputationRequisiteNode(title: comp.title, type: 'COMPUTATION', formula: comp.formula)
                    : new DefaultRequisiteNode(title: 'main group', type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = breakdownGroup.way == 'CUSTOM'
                ? [attribute: mappingAttribute(breakdown)] + (breakdownGroup.data as Map<String, Object>)
                : null

        [(key): [requestData: res, computeData: comp?.computeData, customGroup: customGroup, requisite: requisite]]
    } as Map<String, Map>

    Map<String, RequestData> data = intermediateData.collectEntries { key, value ->
        [(key): value.requestData]
    } as Map<String, RequestData>

    // доводим запрос до совершенства/ шлифуем вычисления
    intermediateData.findAll { key, value -> value.computeData }?.each { key, map ->
        def computeData = map.computeData as Map<String, Object>
        def req = map.requisite as Requisite
        def node = req.nodes.head()
        //по идее на этом этапе у нас только один реквизит и у него одна запись
        def formula = (node as ComputationRequisiteNode).formula
        def keys = new FormulaCalculator(formula).variableNames
        keys.collect { computeData[it] }.each { el ->
            def comp = el as Map<String, Object>
            def attribute = comp.attr as Map<String, Object>
            def aggregationType = comp.aggregation as Aggregation
            def dataKey = comp.dataKey as String // этот ключь должен заменить старый в формуле

            // предполагаем, что агрегация может быть только одна
            data[dataKey].aggregations = [new AggregationParameter(title: 'column', type: aggregationType, attribute: mappingAttribute(attribute))]
        }
        def newFormula = keys.collect { variable ->
            [variable, (computeData[variable] as Map<String, Object>).dataKey]
        }.inject(formula) { string, keySet ->
            def (oldKey, newKey) = keySet
            string.replace(oldKey as String, newKey as String)
        }
        req.nodes = [new ComputationRequisiteNode(title: node.title, type: node.type, formula: newFormula)]
        map.requisite = req
    }

    // Реквизиты
    Collection<Requisite> requisite = intermediateData.findResults { key, value ->
        value.requisite as Requisite
    }

    // доводим запрос до совершенства/ шлифуем кастомную группировку
    Map<String, List<List>> splitData = intermediateData
            .findAll { key, value -> value.customGroup }
            ?.collectEntries { key, value ->
                def customGroup = value.customGroup as Map<String, Object>
                customGroup.type // тип атрибута капсом
                def subGroups = customGroup.subGroups as Collection // интересующие нас группы.
                def requestData = data[key as String]
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
                [(key): dataSet]
            }

    def groupKeyMap = splitData?.collect { key, list ->
        def newDataSet = list.collectEntries { el ->
            def (newKey, dataSet) = el.tail()
            [(newKey): dataSet]
        } as Map<String, RequestData>
        data.remove(key)
        data.putAll(newDataSet)

        list.collect { el ->
            def (String groupName, String newKey) = el
            [groupName, key, newKey]
        }
    }

    Closure<RequisiteNode> mappingRequisiteNodes
    def requisiteNode = requisite.head().nodes.head()
    String nodeType = requisiteNode.type
    switch (nodeType)
    {
        case 'COMPUTATION':
            mappingRequisiteNodes = { String group, List<List<String>> list ->
                String formula = (requisiteNode as ComputationRequisiteNode).formula
                String newFormula = list.inject(formula) { string, keySet ->
                    def (oldKey, newKey) = keySet.tail()
                    string.replace(oldKey as String, newKey as String)
                }
                new ComputationRequisiteNode(title: group, type: 'COMPUTATION', formula: newFormula)
            }
            break
        case 'DEFAULT':
            mappingRequisiteNodes = { String group, List<List<String>> list ->
                def key = list.head()[2]
                new DefaultRequisiteNode(title: group, type: 'DEFAULT', dataKey: key)
            }
            break
        default: throw new Exception("Not supported requisite type: $nodeType")
    }

    def newRequisiteNodes = groupKeyMap ? groupKeyMap.inject { first, second ->
        first + second
    }?.groupBy { it.head() }?.collect { group, list ->
        mappingRequisiteNodes(group, list)
    } : null

    newRequisiteNodes?.with {
        requisite = [new Requisite(title: 'partial', nodes: it)]
    }

    return new DiagramRequest(requisite: requisite, data: data)
}

/**
 * Метод приведения запроса на построение комбо диаграм к единому формату
 * @param requestContent - запрос на построеине комбо диаграмы
 * @return DiagramRequest
 */
private DiagramRequest mappingComboDiagramRequest(Map<String, Object> requestContent)
{
    def uglyRequestData = requestContent.data as Map<String, Object>
    Map<String, Map> intermediateData = uglyRequestData.collectEntries { key, value ->
        def data = value as Map<String, Object>
        def source = new Source(classFqn: data.source, descriptor: data.descriptor)
        def yAxis = data.yAxis as Map<String, Object>
        def aggregationParameter = new AggregationParameter(
                title: 'yAxis',
                type: data.aggregation as Aggregation,
                attribute: mappingAttribute(yAxis)
        )
        def xAxis = data.xAxis as Map<String, Object>
        def group = data.group as Map<String, Object>
        def groupParameter = group.way == 'SYSTEM'
                ? new GroupParameter(title: 'xAxis', type: group.data as GroupType, attribute: mappingAttribute(xAxis))
                : null
        def breakdown = data.breakdown?.with {
            def breakdownGroup = data.breakdownGroup as Map<String, Object>
            new GroupParameter(
                    title: 'breakdown',
                    type: breakdownGroup.way == 'SYSTEM' ? breakdownGroup.data as GroupType : GroupType.NONE,
                    attribute: mappingAttribute(it as Map<String, Object>)
            )
        }
        def res = new RequestData(
                source: source,
                aggregations: [aggregationParameter],
                groups: [groupParameter, breakdown].grep()
        )

        def comp = yAxis.stringForCompute?.with {
            [
                    formula    : it as String,
                    title      : yAxis.title as String,
                    computeData: yAxis.computeData as Map<String, Object>
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
                    ? new ComputationRequisiteNode(title: comp.title, type: 'COMPUTATION', formula: comp.formula)
                    : new DefaultRequisiteNode(title: 'main group', type: 'DEFAULT', dataKey: key)
            requisite = new Requisite(title: 'DEFAULT', nodes: [requisiteNode])
        }

        def customGroup = group.way == 'CUSTOM'
                ? [attribute: mappingAttribute(xAxis)] + (group.data as Map<String, Object>)
                : null

        [(key): [requestData: res, computeData: comp?.computeData, customGroup: customGroup, requisite: requisite]]
    } as Map<String, Map>

    // Первая часть запроса имеется, но не полная
    Map<String, RequestData> data = intermediateData.collectEntries { key, value ->
        [(key): value.requestData]
    } as Map<String, RequestData>

    // доводим запрос до совершенства/ шлифуем вычисления
    intermediateData.findAll { key, value -> value.computeData }?.each { key, map ->
        def computeData = map.computeData as Map<String, Object>
        def req = map.requisite as Requisite
        def node = req.nodes.head()
        //по идее на этом этапе у нас только один реквизит и у него одна запись
        def formula = (node as ComputationRequisiteNode).formula
        def keys = new FormulaCalculator(formula).variableNames
        keys.collect { computeData[it] }.each { el ->
            def comp = el as Map<String, Object>
            def attribute = comp.attr as Map<String, Object>
            def aggregationType = comp.aggregation as Aggregation
            def dataKey = comp.dataKey as String // этот ключь должен заменить старый в формуле

            // предполагаем, что агрегация может быть только одна
            data[dataKey].aggregations = [new AggregationParameter(title: 'yAxis', type: aggregationType, attribute: mappingAttribute(attribute))]
        }
        def newFormula = keys.collect { variable ->
            [variable, (computeData[variable] as Map<String, Object>).dataKey]
        }.inject(formula) { string, keySet ->
            def (oldKey, newKey) = keySet
            string.replace(oldKey as String, newKey as String)
        }
        req.nodes = [new ComputationRequisiteNode(title: node.title, type: node.type, formula: newFormula)]
        map.requisite = req
    }

    // Реквизиты
    Collection<Requisite> requisite = intermediateData.findResults { key, value ->
        value.requisite as Requisite
    }

    // доводим запрос до совершенства/ шлифуем кастомную группировку
    Map<String, List<List>> splitData = intermediateData
            .findAll { key, value -> value.customGroup }
            ?.collectEntries { key, value ->
                def customGroup = value.customGroup as Map<String, Object>
                customGroup.type // тип атрибута капсом
                def subGroups = customGroup.subGroups as Collection // интересующие нас группы.
                def requestData = data[key as String]
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
                [(key): dataSet]
            }

    def groupKeyMap = splitData?.collect { key, list ->
        def newDataSet = list.collectEntries { el ->
            def (newKey, dataSet) = el.tail()
            [(newKey): dataSet]
        } as Map<String, RequestData>
        data.remove(key)
        data.putAll(newDataSet)

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
                    new ComputationRequisiteNode(title: group, type: 'COMPUTATION', formula: newFormula)
                }
                break
            case 'DEFAULT':
                mappingRequisiteNodes = { String group, List<List<String>> list ->
                    def key = list.head()[2]
                    new DefaultRequisiteNode(title: group, type: 'DEFAULT', dataKey: key)
                }
                break
            default: throw new Exception("Not supported requisite type: $nodeType")
        }
        groupKeyMap ? groupKeyMap.inject { first, second ->
            first + second
        }?.groupBy { it.head() }?.collect { group, list ->
            mappingRequisiteNodes(group, list)
        }?.with {
            req = new Requisite(title: 'partial', nodes: it)
        } : null
    }

    return new DiagramRequest(requisite: requisite, data: data)
}

/**
 * Метод построения атрибута
 * @param data - данные для атрибута
 * @return Attribute
 */
private Attribute mappingAttribute(Map<String, Object> data)
{
    return data ? new Attribute(
            title: data.title as String,
            code: data.code as String,
            type: data.type as String,
            property: data.property as String,
            metaClassFqn: data.metaClassFqn as String,
            sourceName: data.sourceName as String,
            ref: mappingAttribute(data.ref as Map<String, Object>)
    ) : null
}

/**
 * Метод построение фильтров группировок
 * @param data - данные группировок
 * @param attribute - атрибут по которому создаются условия группы
 * @param title - название группы
 * @return список фильтров
 */
private List<List<FilterParameter>> mappingFilters(List<List> data, Attribute attribute, String title)
{
    return data.collect { andCondition ->
        andCondition.collect { orCondition ->
            def condition = orCondition as Map<String, Object>
            String conditionType = condition.type
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
                    return new FilterParameter(
                            title: title,
                            type: 'between',
                            attribute: attribute,
                            value: [start, end]
                    )
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
                    return new FilterParameter(
                            title: title,
                            type: 'between',
                            attribute: attribute,
                            value: [start, end]
                    )
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
                    return new FilterParameter(
                            title: title,
                            type: 'between',
                            attribute: attribute,
                            value: [start, end]
                    )
                case 'between':
                    String dateFormat = 'yyyy-MM-dd'
                    def date = condition.data as Map<String, Object> // тут будет массив дат
                    def start = Date.parse(dateFormat, date.startDate as String)
                    def end = Date.parse(dateFormat, date.endDate as String)
                    return new FilterParameter(
                            title: title,
                            type: 'between',
                            attribute: attribute,
                            value: [start, end]
                    )
                default: throw new Exception("Not supported condition type: $conditionType")
            }
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
                    return [(requisiteNode.title): res]
                case 'computation':
                    def requisiteNode = node as ComputationRequisiteNode
                    def calculator = new FormulaCalculator(requisiteNode.formula)
                    def dataSet = calculator.variableNames.collectEntries { [(it): request.data[it]] } as Map<String, RequestData>
                    if (!checkGroupTypes(dataSet.values())) throw new Exception("Wrong group types in calculation!")
                    def variables = dataSet.collectEntries { key, data ->
                        Closure postProcess = this.&formatGroupSet.curry(data as RequestData)
                        [(key): modules.dashboardQueryWrapper.getData(data as RequestData).with(postProcess)]
                    } as Map<String, List>

                    //Вычисление формулы. Выглядит немного костыльно...
                    def res = dataSet.values().head().groups?.size() ? findUniqueGroups(variables).collect { group ->
                        def resultCalculation = calculator.execute { variable ->
                            (variables[variable as String].findResult { group == it.tail() ? it.head() : null } ?: 0) as Double
                        }
                        return [resultCalculation, group].flatten()
                    } : [[calculator.execute { key -> variables[key as String].head().head() as Double }]]
                    return [(node.title): formatAggregationSet(res)]
                default: throw new Exception("Not supported requisite type: $nodeType")
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
    def standard = listRequest.head().groups?.collect { it.type }
    return listRequest.tail().every { el ->
        def groups = el.groups?.collect { it.type }
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
    return variables.values().collect {
        it.transpose().tail().transpose()
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
                def (value, group) = el
                Closure formatGroup = this.&formatGroup.curry(data.groups[0], data.source.classFqn)
                [value, formatGroup(group as String)]
            }
        case 2:
            return list.collect { el ->
                def (value, group, breakdown) = el
                Closure formatGroup = this.&formatGroup.curry(data.groups[0] as GroupParameter, data.source.classFqn)
                Closure formatBreakdown = this.&formatGroup.curry(data.groups[1] as GroupParameter, data.source.classFqn)
                [value, formatGroup(group as String), formatBreakdown(breakdown as String)]
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
    switch (type)
    {
        case GroupType.OVERLAP:
            switch (parameter.attribute.type)
            {
                case 'dtInterval':
                    return TimeUnit.MILLISECONDS.toHours(value as long)
                case 'state':
                    return api.metainfo.getStateTitle(fqnClass, value)
                default:
                    return value
            }
        case GroupType.DAY:
            def (day, month) = value.split('/', 2)
            String monthName = GENITIVE_RUSSIAN_MONTH[(month as int) - 1]
            return "$day $monthName"
        case GroupType.MONTH:
            return NOMINATIVE_RUSSIAN_MONTH[(value as int) - 1]
        case GroupType.QUARTER:
            return "$value кв-л"
        case [GroupType.WEEK, GroupType.YEAR]:
            return value
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
        default: throw new Exception("Not supported type: $type")
    }
}

/**
 * Метод приведения результата выборки к единой структуре
 * @param data - результат выполнения запроса на получение данных диаграммы
 * @return результат запроса данных диаграммы
 */
private def formatResult(Map data)
{
    return data.size() > 1 ? data.collect { key, list ->
        list.collect { [it.head() ?: 0, key, it.tail()].flatten() }
    }.inject { first, second -> first + second } : data.values().head()
}

/**
 * Метод преобразования результата выборки к стандартной диаграмме
 * @param list - данные диаграмы
 * @return StandardDiagram
 */
private StandardDiagram mappingStandardDiagram(List list)
{
    def resultDataSet = list.head() as List<List>
    def transposeDataSet = resultDataSet.transpose()
    switch (transposeDataSet.size())
    {
        case 2:
            def (aggregationResult, groupResult) = transposeDataSet
            def series = [new Series(name: '', data: aggregationResult as List)]
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
        default: throw new Exception("Invalid format result data set")
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
        case 2:
            def (aggregationResult, groupResult) = transposeDataSet
            return new RoundDiagram(series: (aggregationResult as List).collect { it as Double }, labels: groupResult as Set)
        default: throw new Exception("Invalid format result data set")
    }
}

/**
 * Метод преобразования результата выборки к сводке
 * @param list - данные диаграмы
 * @return SummaryDiagram
 */
private SummaryDiagram mappingSummaryDiagram(List list, String title)
{
    List<List> resultDataSet = list.head() as List<List>
    switch (resultDataSet.size())
    {
        case 1:
            def value = resultDataSet.head().head()
            return new SummaryDiagram(title: '', total: value)
        default: throw new Exception("Invalid format result data set")
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
        case 3:
            def (aggregationSet, breakdownSet, groupSet) = transposeDataSet
            Collection<Column> columns = (groupSet as Set<String>).collect { group ->
                def total = totalColumn ? resultDataSet.sum { el ->
                    el[2] == group ? el.head() as double : 0
                }.with(DECIMAL_FORMAT.&format) : ""
                new Column(header: group, accessor: group.replace('.', ' '), footer: total)
            }

            columns.add(0, new Column(header: '', accessor: 'breakdownTitle', footer: ''))

            List<Map<Object, Object>> data = (breakdownSet as Set<String>).collect { breakdown ->
                def res = resultDataSet.findAll { it[1] == breakdown }.collectEntries { dataList ->
                    def (aggregationResult, _, groupResult) = dataList
                    def key = (groupResult as String).replace('.', ' ')
                    [(key): aggregationResult as String]
                }
                [breakdownTitle: breakdown.replace('.', ' ')] + res
            }

            if (totalRow)
            {
                String totalResult = totalColumn
                        ? (aggregationSet as List).sum { it as double }.with(DECIMAL_FORMAT.&format)
                        : ''
                columns += new Column('Итого', 'total', totalResult)
                data.each { el ->
                    el << [total: el.values().tail().sum(DECIMAL_FORMAT.&parse).with(DECIMAL_FORMAT.&format)]
                }
            }
            return new TableDiagram(columns: columns, data: data)
        default: throw new Exception('Invalid format result data set')
    }
}

/**
 * Метод преобразования результата выборки к комбо диаграме
 * @param list - данные диаграмы
 * @return ComboDiagram
 */
private ComboDiagram mappingComboDiagram(List list, Map firstAdditionalData, Map secondAdditionalData)
{
    def (firstResultDataSet, secondResultDataSet) = list
    def firstTransposeDataSet = (firstResultDataSet as List<List>).transpose()
    def secondTransposeDataSet = (secondResultDataSet as List<List>).transpose()

    if (firstTransposeDataSet.size() != secondTransposeDataSet.size())
        throw new Exception('Invalid format result data set')

    switch (firstTransposeDataSet.size())
    {
        case 2:
            Set labels = firstTransposeDataSet[1] + secondTransposeDataSet[1]
            Collection firstDataSet = labels.collect { group ->
                (firstResultDataSet as List<List>).findResult { el ->
                    return el[1] == group ? el[0] : null
                } ?: '0'
            }
            def firstSeries = new SeriesCombo(
                    type: firstAdditionalData.type as String,
                    breakdownValue: firstAdditionalData.breakdown as String,
                    data: firstDataSet,
                    name: firstAdditionalData.name as String,
                    dataKey: firstAdditionalData.key as String
            )

            Collection secondDataSet = labels.collect { group ->
                (secondResultDataSet as List<List>).findResult { el ->
                    el[1] == group ? el[0] : null
                } ?: '0'
            }
            def secondSeries = new SeriesCombo(
                    type: secondAdditionalData.type as String,
                    breakdownValue: secondAdditionalData.breakdown as String,
                    data: secondDataSet,
                    name: secondAdditionalData.name as String,
                    dataKey: secondAdditionalData.key as String
            )
            def series = [firstSeries, secondSeries]
            return new ComboDiagram(labels: labels, series: series)
        case 3:
            Set labels = firstTransposeDataSet[1] + secondTransposeDataSet[1]
            def firstSeries = (firstTransposeDataSet[2] as Set).collect { breakdown ->
                def first = firstResultDataSet as List<List>
                def data = labels.collect { group ->
                    first.findResult { it.tail() == [group, breakdown] ? it.head() : null } ?: '0'
                }
                new SeriesCombo(
                        type: firstAdditionalData.type as String,
                        breakdownValue: breakdown as String,
                        data: data,
                        name: breakdown as String,
                        dataKey: firstAdditionalData.key as String
                )
            }
            def secondSeries = (secondTransposeDataSet[2] as Set).collect { breakdown ->
                def second = secondResultDataSet as List<List>
                def data = labels.collect { group ->
                    second.findResult { it.tail() == [group, breakdown] ? it.head() : null } ?: '0'
                }
                new SeriesCombo(
                        type: secondAdditionalData.type as String,
                        breakdownValue: breakdown as String,
                        data: data,
                        name: breakdown as String,
                        dataKey: secondAdditionalData.key as String
                )
            }
            def series = firstSeries + secondSeries
            return new ComboDiagram(labels: labels, series: series)
        default: throw new Exception('Invalid format result data set')
    }
}

/**
 * Метод добавления атирбута title для ссылочных аттрибутов. Исспользовать только для вычислений формул
 * @param attr - атрибут
 * @return атрибут
 */
private setTitleInLinkAttribute(def attr)
{
    def validTypes = ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem']
    return attr.type in validTypes ? attr + [ref: [code: 'title', type: 'string', title: 'Название']] : attr
}

/**
 * Метод для изменения запроса с целью подмены объекта фильтрации
 * @param requestContent - запрос на построение диаграммы
 * @param cardObjectUuid - фактическое значение идентификатора "текущего объекта"
 * @return изменённый запрос
 */
private Map<String, Object> transformRequest(Map<String, Object> requestContent, String cardObjectUuid)
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
private Map<String, Object> transformRequestWithComputation(Map<String, Object> requestContent, String cardObjectUuid)
{
    Closure<Map<String, Object>> transform = { Map<String, Object> map ->
        def data = map.data as Map<String, Object>
        def newData = data.collectEntries { key, value ->
            def dataForDiagram = [:] << (value as Map<String, Object>)
            dataForDiagram.descriptor = DashboardMarshaller.substitutionCardObject(dataForDiagram.descriptor as String, cardObjectUuid)
            return [(key): dataForDiagram]
        }
        return [type: map.type, data: newData]
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
        res.descriptor = DashboardMarshaller.substitutionCardObject(res.descriptor as String, cardObjectUuid)
        return res
    }
    return cardObjectUuid ? transform(requestContent) : requestContent
}
//endregion
