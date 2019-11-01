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

import groovy.transform.TupleConstructor

import java.util.regex.Pattern
import java.util.regex.Matcher

import static groovy.json.JsonOutput.toJson
import ru.naumen.core.server.hquery.HCriteria;
import ru.naumen.core.server.hquery.HHelper;
import ru.naumen.core.server.hquery.HRestrictions
import ru.naumen.core.server.hquery.HOrders

import static Diagram.*

//region enum
/**
 * Типы агрегации даннных для диаграмм. SUM, AVG, MAX, MIN, MDN только для числовых типов
 */
enum AggregationType
{
    COUNT_CNT('COUNT(%s)'),
    PERCENT('cast(COUNT(%s)*100.00/%s as big_decimal)'),
    SUM('SUM(%s)'),
    AVG('AVG(%s)'),
    MAX('MAX(%s)'),
    MIN('MIN(%s)'),
    MDN('%s')

    AggregationType(String aggregationFormat)
    {
        this.aggregationFormat = aggregationFormat
    }

    String aggregationFormat

    String get(String... codes)
    {
        return String.format(aggregationFormat, codes)
    }
}
//endregion

//region КЛАССЫ
/**
 * Модель тело запроса - Полученик данных для диаграммы
 */
@TupleConstructor
class RequestGetDataForDiagram
{
    /**
     * Тип диаграммы
     */
    Diagram type
    /**
     * Код источника данных
     */
    String source
    /**
     * Атрибут по x оси
     */
    Attribute xAxis = null
    /**
     * Атрибут для y оси
     */
    Attribute yAxis = null
    /**
     * Атрибут для разбивки
     */
    Attribute breakdown = null
    /**
     * Тип группировки для разбивки
     */
    GroupType breakdownGroup = GroupType.OVERLAP
    /**
     * Атрибут для показателя
     */
    Attribute indicator = null
    /**
     * Тип группировки данных
     */
    GroupType group = GroupType.OVERLAP
    /**
     * Тип агрегации данных
     */
    AggregationType aggregation = AggregationType.COUNT_CNT

    /**
     * Json дескриптор
     */
    String descriptor
    /**
     * Код источника данных
     */
    String sourceForCompute
}

/**
 * Модель тело запроса - Полученик данных для диаграмм
 */
@TupleConstructor
class RequestGetDataForCompositeDiagram
{
    /**
     * Тип диаграммы
     */
    Diagram type

    /**
     * данные комбодиаграммы
     */
    Map<String, DataForCompositeDiagram> data
}

/**
 * Модель тело запроса - Полученик данных для диаграмм
 */
@TupleConstructor
class DataForCompositeDiagram
{
    /**
     * Тип агрегации данных
     */
    AggregationType aggregation = AggregationType.COUNT_CNT
    /**
     * Json дескриптор
     */
    String descriptor
    /**
     * Атрибут для показателя
     */
    Attribute indicator = null
    /**
     * Код источника данных
     */
    String source
    /**
     * Код источника данных
     */
    String sourceForCompute
    /**
     * Рычаг подсчитывать итоги для column
     */
    Boolean calcTotalColumn = null
    /**
     * Рычаг подсчитывать итоги для row
     */
    Boolean calcTotalRow = null
    /**
     * Атрибут для column
     */
    Attribute column = null
    /**
     * Атрибут для row
     */
    Attribute row = null
    /**
     * Атрибут для разбивки
     */
    Attribute breakdown = null
    /**
     * Тип группировки для разбивки
     */
    GroupType breakdownGroup = GroupType.OVERLAP
    /**
     * Атрибут по x оси
     */
    Attribute xAxis = null
    /**
     * Атрибут для y оси
     */
    Attribute yAxis = null
    /**
     * Тип диаграммы
     */
    Diagram type
    /**
     * Тип группировки данных
     */
    GroupType group = GroupType.OVERLAP
}

/**
 * Модель тело запроса - Полученик данных для диаграммы
 */
@TupleConstructor
class RequestGetDataForComboDiagram
{
    Collection<RequestGetDataForDiagram> charts
    String type
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
}
//endregion

//region REST-МЕТОДЫ
/**
 * Получение данных для диаграмм
 * @param requestContent тело запроса в формате {@link RequestGetDataForDiagram}
 * @return данные для построения диаграммы
 */
String getDataForDiagram(Map<String, Object> requestContent)
{
    def request = new RequestGetDataForDiagram(requestContent)
    switch (request.type)
    {
        case [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE] :
            return toJson(getDataStandardDiagram(request))
        case [DONUT, PIE] :
            return toJson(getDataRoundDiagram(request))
        default:
            throw new Exception(toJson([error: "Not supported diagram type: ${request.type}"]))
    }
}

/**
 * Получение данных для диаграмм Summary, Table, Combo
 * @param requestContent тело запроса в формате @link RequestGetDataForDiagram
 * @return данные для построения диаграммы
 */
String getDataForCompositeDiagram(Map<String, Object> requestContent)
{
    def request = new RequestGetDataForCompositeDiagram(requestContent)
    switch (request.type)
    {
        case SUMMARY:
            return toJson(getCalculateDataForSummaryDiagram(request))
        case TABLE:
            return toJson(getCalculateDataForTableDiagram(request))
        case COMBO:
            return toJson(getCalculationForComboDiagram(request))
        default:
            throw new Exception(toJson([error: "Not supported diagram type: ${request.type}"]))
    }
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Получение данных для линейных диаграмм
 * @param request параметры диаграммы
 * @return данные для диаграммы в формате StandardDiagram
 */
private StandardDiagram getDataStandardDiagram(RequestGetDataForDiagram request)
{
    String descriptor = request.descriptor
    String source = request.source
    Attribute breakdown = request.breakdown
    HCriteria criteria = createHCriteria(descriptor, source)
    group(criteria, request.group as GroupType, request.xAxis as Attribute, source, descriptor)
    aggregation(criteria,
            request.aggregation as AggregationType,
            request.yAxis as Attribute,
            source, descriptor,
            request.xAxis,
            request.breakdown)
    if (breakdown)
    {
        group(criteria, request.breakdownGroup as GroupType, breakdown as Attribute, source, descriptor)
    }
    findNotNullAttributes(criteria, request.xAxis, request.breakdown)
    Collection<Object> list = getQuery(criteria).list()
    return mappingToStandardDiagram(list, breakdown)
}

/**
 * Получение данных для круговых диаграмм
 * @param request параметры диаграммы
 * @return данные для диаграммы в формате RoundDiagram
 */
private RoundDiagram getDataRoundDiagram(RequestGetDataForDiagram request)
{
    HCriteria criteria = createHCriteria(request.descriptor, request.source)
    aggregation(criteria,
            request.aggregation as AggregationType,
            request.indicator as Attribute,
            request.source,
            request.descriptor,
            request.breakdown)
    group(criteria, request.breakdownGroup as GroupType, request.breakdown as Attribute, request.source, request.descriptor)
    findNotNullAttributes(criteria, request.breakdown)
    Collection<Object> list = getQuery(criteria).list()
    return new RoundDiagram(list*.getAt(1), list*.getAt(0))
}

/**
 * Метод построения сводки с обработкой вычеслений
 * @param request - запрос на построение сводки
 * @return результат вычислений
 */
private SummaryDiagram getCalculateDataForSummaryDiagram(RequestGetDataForCompositeDiagram request)
{
    def currentData = request.data.find({ key, value -> !(value?.indicator?.sourceForCompute) }).value
    String source = currentData.source
    String descriptor = currentData.descriptor
    String formula = currentData.indicator.stringForCompute
    HCriteria criteria = createHCriteria(descriptor, source)
    if (formula)
    {
        String sqlFormula = prepareFormula(formula) { key ->
            def computeData = currentData.indicator.computeData.get(key)
            AggregationType aggregationType = computeData.aggregation
            Attribute attr = computeData.attr
            String attributeCode = getAttributeCodeByTypeForCompute(criteria, attr)
            aggregationType == AggregationType.PERCENT
                    ? getPercentColumn(descriptor, source, attr, aggregationType)
                    : aggregationType.get(attributeCode)
        }
        criteria.addColumn(sqlFormula) //Вставить в запрос
    }
    else
    {
        aggregation(criteria,
                currentData.aggregation as AggregationType,
                currentData.indicator as Attribute,
                currentData.source,
                currentData.descriptor)
    }
    def res = getQuery(criteria).list().head()
    return new SummaryDiagram(currentData.indicator.title, res)
}

/**
 * Метод построения таблицы с обработкгой вычеслений
 * @param request - запрос на построение таблицы
 * @return - результат построения таблицы
 */
private TableDiagram getCalculateDataForTableDiagram(RequestGetDataForCompositeDiagram request)
{
    // предполагаем что запись только одна и единственно верная
    def currentData = request.data.find({ key, value -> !(value.sourceForCompute) }).value
    String source = currentData.source
    String descriptor = currentData.descriptor
    HCriteria criteria = createHCriteria(descriptor, source)
    group(criteria, currentData.breakdownGroup as GroupType, currentData.breakdown as Attribute, source, descriptor)
    String formula = currentData.column.stringForCompute
    if (formula)
    {
        String sqlFormula = prepareFormula(formula) { key ->
            def computeData = currentData.column.computeData.get(key)
            AggregationType aggregationType = computeData.aggregation
            Attribute attr = computeData.attr
            String attributeCode = getAttributeCodeByTypeForCompute(criteria, attr)
            aggregationType == AggregationType.PERCENT
                    ? getPercentColumn(descriptor,
                        source,
                        attr,
                        aggregationType,
                        currentData.breakdown as Attribute,
                        currentData.row as Attribute)
                    : aggregationType.get(attributeCode)
        }
        criteria.addColumn(sqlFormula)
    }
    else
    {
        aggregation(criteria,
                currentData.aggregation as AggregationType,
                currentData.column as Attribute,
                source,
                descriptor,
                currentData.breakdown as Attribute,
                currentData.row as Attribute)
    }
    String rowCode = getAttributeCodeByType(criteria, currentData.row as Attribute)
    criteria.addColumn(rowCode)
    criteria.addGroupColumn(rowCode)
    findNotNullAttributes(criteria, currentData.breakdown as Attribute, currentData.row as Attribute)
    Collection<Object> list = getQuery(criteria).list()
    return mappingToTableDiagram(list, currentData.calcTotalColumn, currentData.calcTotalRow)
}

/**
 * Метод построения комбинированных диаграмм с применением вычислений
 * @param request - запрос на построение диаграмм
 * @return результат построения диаграмм
 */
private ComboDiagram getCalculationForComboDiagram(RequestGetDataForCompositeDiagram request)
{
    Collection<Collection<Object>> list = request.data
            .findAll { key, value -> !(value.sourceForCompute) } //TODO: эта проверка много где фигурирует
            .collect { currentKey, currentData ->
                String source = currentData.source
                String descriptor = currentData.descriptor
                HCriteria criteria = createHCriteria(descriptor, source)
                group(criteria, currentData.group as GroupType, currentData.xAxis as Attribute, source, descriptor)
                String formula = currentData.yAxis.stringForCompute
                if (formula)
                {
                    String sqlFormula = prepareFormula(formula) { variable ->
                        def computeData = currentData.yAxis.computeData.get(variable)
                        AggregationType aggregationType = computeData.aggregation
                        def attr = computeData.attr
                        String resVariable
                        if (request.data.get(computeData.dataKey).source == source)
                        {
                            String attributeCode = getAttributeCodeByTypeForCompute(criteria, attr as Attribute)
                            resVariable = AggregationType.PERCENT
                                    ? getPercentColumn(
                                        descriptor,
                                        source,
                                        attr as Attribute,
                                        aggregationType,
                                        currentData.breakdown as Attribute,
                                        currentData.xAxis as Attribute)
                                    : aggregationType.get(attributeCode)
                        }
                        else
                        {
                            HCriteria subCriteria = request.data.get(computeData.dataKey).with {
                                createHCriteria(descriptor, source)
                            }
                            String attributeCode = getAttributeCodeByTypeForCompute(subCriteria, attr as Attribute)
                            String aggregation = AggregationType.PERCENT
                                    ? getPercentColumn(
                                        descriptor,
                                        source,
                                        attr as Attribute,
                                        aggregationType,
                                        currentData.breakdown as Attribute,
                                        currentData.xAxis as Attribute)
                                    : aggregationType.get(attributeCode)
                            subCriteria.addColumn(aggregation)
                            getQuery(subCriteria).list().head()
                            resVariable = getQuery(subCriteria).list().head() as String
                        }
                        return resVariable
                    }
                    criteria.addColumn(sqlFormula)
                }
                else
                {
                    aggregation(criteria,
                            currentData.aggregation as AggregationType,
                            currentData.yAxis as Attribute,
                            source,
                            descriptor,
                            currentData.xAxis as Attribute,
                            currentData.breakdown as Attribute)
                }

                currentData.breakdown ?
                        group(criteria,
                                currentData.breakdownGroup as GroupType,
                                currentData.breakdown as Attribute,
                                source,
                                descriptor)
                        : null
                findNotNullAttributes(criteria,
                        currentData.xAxis as Attribute,
                        currentData.breakdown as Attribute)
                return getQuery(criteria).list()
            }
    return mappingToComboDiagram(list, request)
}

/**
 * Метод преобразования формулы для отправки в БД
 * @param formula - формула с переменными
 * @param getAggregationByKey - функция замены переменной
 * @return формула готовая для отправки в запросе
 */
private String prepareFormula(String formula, Closure<String> getAggregationByKey)
{
    String res = formula
    Pattern pattern = ~/(\{.+?\})/
    Matcher matcher = pattern.matcher(formula)
    while (matcher.find())
    {
        String key = matcher.toMatchResult().group(1)
        String data = getAggregationByKey.call(key.replaceAll(~/[}{]/, ''))
        res = res.replace(key, data)
    }
    return res
}

/**
 * Агрегация данных для диаграммы
 * @param criteria HCriteria основной таблицы
 * @param aggregationType тип агрегации
 * @param attribute атрибут для агрегирования
 * @param source источник данных для PERCENT
 * @return данные для диаграммы в формате SummaryDiagram
 */
private void aggregation(HCriteria criteria,
                         AggregationType aggregationType,
                         Attribute attribute,
                         String source,
                         String descriptor,
                         Attribute... notNullAttribute)
{
    String attributeCode = getAttributeCodeByType(criteria, attribute)
    aggregationType == AggregationType.PERCENT
            ? addPercentColumn(criteria, descriptor, source, attribute, aggregationType, notNullAttribute)
            : criteria.addColumn(aggregationType.get(attributeCode))
}

/**
 * Группировка данных для диаграммы
 * @param criteria HCriteria основной таблицы
 * @param groupType тип группировки
 * @param xAxis атрибут для группировки
 */
private void group(HCriteria criteria, GroupType groupType, Attribute xAxis, String source, String descriptor)
{
    String attributeCode = getAttributeCodeByType(criteria, xAxis)
    String nameDayMonth = " WHEN '1' THEN 'Января' " +
            " WHEN '2' THEN 'Февраля' " +
            " WHEN '3' THEN 'Марта' " +
            " WHEN '4' THEN 'Апреля' " +
            " WHEN '5' THEN 'Мая' " +
            " WHEN '6' THEN 'Июня' " +
            " WHEN '7' THEN 'Июля' " +
            " WHEN '8' THEN 'Августа' " +
            " WHEN '9' THEN 'Сентября' " +
            " WHEN '10' THEN 'Октября' " +
            " WHEN '11' THEN 'Ноября' " +
            " WHEN '12' THEN 'Декабря' " +
            " END "
    String nameMonth = " WHEN '1' THEN 'Январь' " +
            " WHEN '2' THEN 'Февраль' " +
            " WHEN '3' THEN 'Март' " +
            " WHEN '4' THEN 'Апрель' " +
            " WHEN '5' THEN 'Май' " +
            " WHEN '6' THEN 'Июнь' " +
            " WHEN '7' THEN 'Июль' " +
            " WHEN '8' THEN 'Август' " +
            " WHEN '9' THEN 'Сентябрь' " +
            " WHEN '10' THEN 'Октябрь' " +
            " WHEN '11' THEN 'Ноябрь' " +
            " WHEN '12' THEN 'Декабрь' " +
            " END "
    switch (groupType)
    {
        case GroupType.OVERLAP:
            criteria.addColumn(attributeCode)
            criteria.addGroupColumn(attributeCode)
            criteria.addOrder(HOrders.asc(HHelper.getColumn(attributeCode)))
            break
        case GroupType.DAY:
            String md = "concat(" +
                    "DAY(${attributeCode}), ' ', CASE MONTH(${attributeCode}) ${nameDayMonth})"
            criteria.addColumn(md)
            criteria.addGroupColumn("MONTH(${attributeCode}), DAY(${attributeCode})")
            criteria.addOrder(HOrders.asc(HHelper.getColumn("MONTH(${attributeCode}), DAY(${attributeCode})")))
            break
        case GroupType.WEEK:
            criteria.addColumn("extract(WEEK from ${attributeCode})")
            criteria.addGroupColumn("extract(WEEK from ${attributeCode})")
            criteria.addOrder(HOrders.asc(HHelper.getColumn("extract(WEEK from ${attributeCode})")))
            break
        case GroupType.MONTH:
            criteria.addColumn("CASE MONTH(${attributeCode}) ${nameMonth}")
            criteria.addGroupColumn("MONTH(${attributeCode})")
            criteria.addOrder(HOrders.asc(HHelper.getColumn("MONTH(${attributeCode})")))
            break
        case GroupType.QUARTER:
            criteria.addColumn("concat(extract(QUARTER from ${attributeCode}), ' кв-л')")
            criteria.addGroupColumn("concat(extract(QUARTER from ${attributeCode}), ' кв-л')")
            criteria.addOrder(HOrders.asc(HHelper.getColumn("concat(extract(QUARTER from ${attributeCode}), ' кв-л')")))
            break
        case GroupType.YEAR:
            criteria.addColumn("YEAR(${attributeCode})")
            criteria.addGroupColumn("YEAR(${attributeCode})")
            criteria.addOrder(HOrders.asc(HHelper.getColumn("YEAR(${attributeCode})")))
            break
        case GroupType.SEVEN_DAYS:
            def cteSource = createHCriteria(descriptor, source)
            cteSource.addColumn("min(${getAttributeCodeByType(cteSource, xAxis)})", 'cteMinDate')
            HCriteria cteCriteria = criteria.addCTESource(cteSource)
            criteria.addGroupColumn("round(abs((day(${attributeCode} " +
                    "- ${cteCriteria.getProperty('cteMinDate')}) - 0.5)) / 7)")
            criteria.addColumn("CONCAT(" +
                    "DAY(MIN(${attributeCode})), '.', CASE MONTH(MIN(${attributeCode})) ${nameDayMonth}," +
                    "'-'," +
                    "DAY(MAX(${attributeCode})), '.', CASE MONTH(MAX(${attributeCode})) ${nameDayMonth})")
            criteria.addOrder(HOrders.asc(HHelper.getColumn("round(abs((day(${attributeCode} " +
                    "- ${cteCriteria.getProperty('cteMinDate')}) - 0.5)) / 7)")))
            break
    }
}

private void addPercentColumn(HCriteria criteria,
                              String descriptor,
                              String source,
                              Attribute attributeCalc,
                              AggregationType aggregationType,
                              Attribute... notNullAttributes)
{
    criteria.addColumn(getPercentColumn(descriptor, source, attributeCalc, aggregationType, notNullAttributes))
}

private String getPercentColumn(String descriptor,
                                String source,
                                Attribute attributeCalc,
                                AggregationType aggregationType,
                                Attribute... notNullAttributes)
{
    HCriteria calcCriteria = createHCriteria(descriptor, source)
    String attributeCode = getAttributeCodeByType(calcCriteria, attributeCalc)
    calcCriteria.addColumn("COUNT(${attributeCode})")
    calcCriteria.add(HRestrictions.isNotNull(HHelper.getColumn(attributeCode)))
    findNotNullAttributes(calcCriteria, notNullAttributes)
    String calcCount = getQuery(calcCriteria).list()[0]
    return aggregationType.get(attributeCode, calcCount)
}

/**
 * Маппинг данных в формат для построения линейных диаграмм
 * @param list список значений
 * @param breakdown атрибут разбивки
 * @return данные для диаграммы в формате StandardDiagram
 */
private StandardDiagram mappingToStandardDiagram(Collection<Object> list, Attribute breakdown)
{
    int categoryIndex = 0
    int dataIndex = 1
    int breakdownIndex = 2
    StandardDiagram standardDiagram = new StandardDiagram()
    standardDiagram.categories = list.toUnique { it[categoryIndex] }*.getAt(categoryIndex)
    if (breakdown)
    {
        list.toUnique { it[breakdownIndex] }.each {
            standardDiagram.series << new Series(it[breakdownIndex], [0].multiply(standardDiagram.categories.size()))
        }
        standardDiagram.categories.eachWithIndex { category, index ->
            list.findAll { element -> element[categoryIndex] == category }.each { currentElement ->
                standardDiagram.series
                        .find { element -> element.name == currentElement[breakdownIndex] }
                        .data[index] = currentElement[dataIndex]
            }
        }
    }
    else
    {
        standardDiagram.series << new Series("", list.toUnique { it[categoryIndex] }*.getAt(dataIndex))
    }
    return standardDiagram
}

/**
 * Маппинг данных в формат для построения табличных диаграмм
 * @param list список значений
 * @return данные для диаграммы в формате StandardDiagram
 */
private TableDiagram mappingToTableDiagram(Collection<Object> list,
                                           Boolean calcColumn,
                                           Boolean calcRow)
{
    int columnTitleIndex = 0
    int dataIndex = 1
    int rowTitleIndex = 2
    TableDiagram tableDiagram = new TableDiagram()
    Closure<String> capriceFront = { String str -> str.replace('.', '') } // требуется для библиотеки на фронте
    tableDiagram.columns += list.toUnique { it[columnTitleIndex] }.collect { currentCell ->
        String columnTitle = currentCell[columnTitleIndex]
        String resultValue = calcColumn ? list.findAll({ cell -> cell[columnTitleIndex] == columnTitle }).sum { it[dataIndex] as double } : ""
        new Column(columnTitle, capriceFront(columnTitle), resultValue)
    }
    list.toUnique { it[rowTitleIndex] }.collectEntries {
        tableDiagram.data << [breakdownTitle: it[rowTitleIndex]]
    }
    list.collect { currentCell ->
        def rowTitle = currentCell[rowTitleIndex]
        tableDiagram.data.find { cell ->
            cell["breakdownTitle"] == rowTitle
        } << [(capriceFront(currentCell[columnTitleIndex])): currentCell[dataIndex]]
    }
    if (calcRow)
    {
        tableDiagram.columns << new Column("Итого", "total", "")
        tableDiagram.data.collect { cell ->
            cell << [total: cell.values().tail().sum {it as double}]
        }
    }

    if(calcRow && calcColumn)
    {
        double columnTotalResult = tableDiagram.columns.findResults({ it.footer != '' ? it.footer as double : null }).sum()
        String totalResult = columnTotalResult
        tableDiagram.columns.find({ it.accessor == 'total' }).footer = totalResult
    }

    if (calcColumn)
    {
        tableDiagram.columns.find({ it.accessor == 'breakdownTitle' }).footer = 'Итого'
    }
    return tableDiagram
}

/**
 * Маппинг данных в формат для построения комбо диаграмм
 * @param list список результатов звпроса на построение диаграммы
 * @return данные для диаграммы в формате ComboDiagram
 */
private ComboDiagram mappingToComboDiagram(Collection<Collection<Object>> lists, RequestGetDataForCompositeDiagram request)
{
    final int labelIndex = 0
    final int dataIndex = 1
    final int breakdownIndex = 2
    def dataForNotCompute = request.data.findAll { key, source -> !(source.sourceForCompute) } //отбрасываем источники для вычисления
    ComboDiagram comboDiagram = new ComboDiagram()
    comboDiagram.labels = lists.collect { it*.getAt(labelIndex) }.flatten().unique()
    lists.eachWithIndex { resultOfQuery, index ->
        String currentKey = dataForNotCompute.keySet()[index]
        def currentSource = dataForNotCompute.values()[index]
        Closure<SeriesCombo> buildComboDiagram = { String title, Collection<Object> resultValues ->
            Collection<Object> data = [0].multiply(comboDiagram.labels.size()) // подготавливаем почву для результата
            resultValues.each { row ->
                int resultIndex = comboDiagram.labels.indexOf(row[labelIndex])
                data[resultIndex] = row[dataIndex]
            }
            new SeriesCombo(title, data, currentSource.type as String, currentKey)
        }
        if (currentSource.breakdown)
        {
            def breakdowns = resultOfQuery.collect({ it[breakdownIndex] }).unique()
            breakdowns.each { breakdown ->
                String title = "${currentSource.yAxis.title} ($breakdown)"
                def resultValues = resultOfQuery.findAll { row -> row[breakdownIndex] == breakdown }
                comboDiagram.series << buildComboDiagram(title, resultValues)
            }
        }
        else
        {
            String title = "${currentSource.yAxis.title}"
            comboDiagram.series << buildComboDiagram(title, resultOfQuery)
        }
    }
    return comboDiagram
}

/**
 * Формирование кода атрибута для выборки из бд в зависимости от его типа
 * @param criteria HCriteria основной таблицы
 * @param attribute атрибут для формирования кода
 * @return код атрибута для запроса
 */
private String getAttributeCodeByType(HCriteria criteria, Attribute attribute)
{
    switch (attribute.type)
    {
        case ['boLinks', 'backBOLinks']:
            return "${criteria.addInnerJoin(attribute.code).getAlias()}.title"
        case 'catalogItemSet':
            // TODO добавить локаль пользователя api.employee.getPersonalSettings(user.UUID)?.locale после стабилизации диаграмм
            return "${criteria.addInnerJoin(attribute.code).getAlias()}.title.ru"
        case 'object':
            return "${criteria.getAlias()}.${attribute.code}.title"
        case 'catalogItem':
            // TODO добавить локаль пользователя api.employee.getPersonalSettings(user.UUID)?.locale после стабилизации диаграмм
            return "${criteria.getAlias()}.${attribute.code}.title.ru"
        case 'state':
            return "${criteria.getAlias()}.${attribute.code}"
        default:
            return "${criteria.getAlias()}.${attribute.code}"
    }
}

private String getAttributeCodeByTypeForCompute(HCriteria criteria, Attribute attribute)
{
    switch (attribute.type)
    {
        case ['boLinks', 'backBOLinks']:
            return "${criteria.addInnerJoin(attribute.code).getAlias()}.title"
        case 'catalogItemSet':
            return "${criteria.addInnerJoin(attribute.code).getAlias()}.title"
        case 'object':
            return "${criteria.addLeftJoin(attribute.code).getAlias()}.title"
        case 'catalogItem':
            return "${criteria.getAlias()}.${attribute.code}.title.ru"
        case 'state':
            return "${criteria.getAlias()}.${attribute.code}"
        default:
            return "${criteria.getAlias()}.${attribute.code}"
    }
}

/**
 * Метод добавления условия отсеивания null значений атрибута
 * @param criteria HCriteria основной таблицы
 * @param attribute атрибут для отсеивания null значений атрибута
 */
private void findNotNullAttributes(HCriteria criteria, Attribute... attributes)
{
    attributes.each{
        if(it)
        {
            String attributeCode = getAttributeCodeByType(criteria, it)
            criteria.add(HRestrictions.isNotNull(HHelper.getColumn(attributeCode)))
        }
    }
}

/**
 * Метод исполнения запросов
 * @param criteria - запрос в базу данных
 * @return сущность ответа
 */
private def getQuery(HCriteria criteria)
{
    return api.db.query(criteria)
}

/**
 * Создание HCriteria
 */
private HCriteria createHCriteria(String descriptor, String source)
{
    HCriteria criteria = descriptor ? getCriteriaFromDescriptor(deserializeDescriptor(descriptor)) :
            HHelper.create().addSource(source)
    criteria.getOrders().clear()
    return criteria
}

/**
 * Создание запроса на основе дескриптора
 * @param descriptor - сущность фильтрации
 * @return сущность запрос
 */
private HCriteria getCriteriaFromDescriptor(def descriptor)
{
    return api.actionContext.createCriteria(descriptor)
}

/**
 * Метод десериализации сущности дескриптора.
 * @param jsonString - сериализованный объект дескриптора
 * @return сущность дескриптора
 */
private def deserializeDescriptor(String jsonString) //TODO: костыль. В дальнейшем будет заменено
{
    def context = createContext(jsonString)
    context.clientSettings.visibleAttrCodes = new HashSet() // жёсткий костыль
    def descriptor = ru.naumen.objectlist.shared.ListDescriptorFactory.create(context)
    return descriptor
}

/**
 * Метод получение контекста из json
 * @param json - json
 * @return контекст
 */
private def createContext(String json)
{
    def factory = com.google.web.bindery.autobean.vm.AutoBeanFactorySource.create(ru.naumen.core.shared.autobean.wrappers.AdvlistSettingsAutoBeanFactory.class)
    def autoBean = com.google.web.bindery.autobean.shared.AutoBeanCodex.decode(factory, ru.naumen.core.shared.autobean.wrappers.IReducedListDataContextWrapper.class, json)
    return ru.naumen.core.shared.autobean.wrappers.ReducedListDataContext.createObjectListDataContext(autoBean.as())
}
//endregion