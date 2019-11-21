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
import ru.naumen.core.server.hquery.HCriteria
import ru.naumen.core.server.hquery.HHelper
import ru.naumen.core.server.hquery.HOrders
import ru.naumen.core.server.hquery.HRestrictions

import java.text.DecimalFormat
import ru.naumen.core.server.hquery.HCriteria;
import ru.naumen.core.server.hquery.HHelper;
import ru.naumen.core.server.hquery.HRestrictions
import ru.naumen.core.server.hquery.HOrders

import java.text.DecimalFormatSymbols
import java.text.SimpleDateFormat
import java.util.concurrent.TimeUnit

import static Diagram.*
import static groovy.json.JsonOutput.toJson

//region enum
/**
 * Типы агрегации даннных для диаграмм. SUM, AVG, MAX, MIN, MDN только для числовых типов
 */
enum AggregationType
{
    COUNT_CNT('COUNT(%s)'),
    PERCENT('cast(COUNT(%s)*100.00/%s as big_decimal)'),
    SUM('cast(coalesce(SUM(%s), 0)*1.00 as big_decimal)'),
    AVG('cast(coalesce(AVG(%s), 0)*1.00 as big_decimal)'),
    MAX('cast(coalesce(MAX(%s), 0)*1.00 as big_decimal)'),
    MIN('cast(coalesce(MIN(%s), 0)*1.00 as big_decimal)'),
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
    /**
     * Значение разбивки
     */
    String breakdownValue = ""
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
    list = request.group == GroupType.SEVEN_DAYS ? getPeriodSevenDays(list, 0) : list
    list = request.breakdownGroup == GroupType.SEVEN_DAYS ? getPeriodSevenDays(list, 2) : list
    list = request.xAxis.type == 'dtInterval'  ? convertMillisecondToHours(list, 0) : list
    list = request*.breakdown*.type == 'dtInterval'  ? convertMillisecondToHours(list, 2) : list
    list = request.xAxis.type == 'state'  ? convertCodeStatusToNameStatus(list, 0, request.source) : list
    list = request*.breakdown*.type == 'state'  ? convertCodeStatusToNameStatus(list, 2, request.source) : list
    return mappingToStandardDiagram(list, breakdown, request.breakdownGroup as GroupType)
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
    list = request.breakdownGroup == GroupType.SEVEN_DAYS ? getPeriodSevenDays(list, 1) : list
    list = request.breakdown.type == 'dtInterval'  ? convertMillisecondToHours(list, 1) : list
    list = request.breakdown.type == 'state'  ? convertCodeStatusToNameStatus(list, 1, request.source) : list
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
    def currentIndicator = currentData.indicator
    Closure<Object> executeQuery = { DataForCompositeDiagram data,
                                     Attribute attribute,
                                     AggregationType aggregationType ->
        String source = data.source
        String descriptor = data.descriptor
        HCriteria criteria = createHCriteria(descriptor, source)
        aggregation(criteria, aggregationType, attribute, source, descriptor)
        getQuery(criteria).list().head()
    }
    def result
    String formula = currentIndicator.stringForCompute
    if(formula)
    {
        FormulaCalculator calculator = new FormulaCalculator(formula)
        result = calculator.execute { variable ->
            def computeData = currentIndicator.computeData.get(variable)
            def data = request.data.get(computeData.dataKey)
            def attribute = computeData.attr
            executeQuery(
                    data as DataForCompositeDiagram,
                    attribute as Attribute,
                    computeData.aggregation as AggregationType) as double
        }
    }
    else
    {
        result = executeQuery(
                currentData as DataForCompositeDiagram,
                currentIndicator as Attribute,
                currentData.aggregation as AggregationType)
    }

    def numberFormater = new DecimalFormat("#.##");
    return new SummaryDiagram(currentIndicator.title as String, numberFormater.format(result))
}

/**
 * Метод построения таблицы с обработкгой вычеслений
 * @param request - запрос на построение таблицы
 * @return - результат построения таблицы
 */
private TableDiagram getCalculateDataForTableDiagram(RequestGetDataForCompositeDiagram request)
{
    def currentData = request.data.find({ key, value -> !(value.sourceForCompute) }).value
    GroupType breakdownGroup = currentData.breakdownGroup
    Attribute breakdown = currentData.breakdown
    Attribute currentColumn = currentData.column
    Attribute row = currentData.row

    Closure<Collection<Object>> executeQuery = { DataForCompositeDiagram data,
                                                 Attribute column,
                                                 AggregationType aggregationType ->
        String source = data.source
        String descriptor = data.descriptor
        HCriteria criteria = createHCriteria(descriptor, source)
        group(criteria, breakdownGroup, breakdown, source, descriptor)

        aggregation(criteria, aggregationType, column, source, descriptor, breakdown)

        String rowCode = getAttributeCodeByType(criteria, row)
        criteria.addColumn(rowCode)
        criteria.addGroupColumn(rowCode)
        findNotNullAttributes(criteria, breakdown, row)
        getQuery(criteria).list()
    }

    String formula = currentColumn.stringForCompute
    def result
    if(formula)
    {
        def lastResponse
        FormulaCalculator calculator = new FormulaCalculator(formula)
        Collection<Object> resValues = calculator.multipleExecute { variable ->
            def computeData = currentColumn.computeData.get(variable)
            def data = request.data.get(computeData.dataKey)
            lastResponse = executeQuery(
                    data as DataForCompositeDiagram,
                    computeData.attr as Attribute,
                    computeData.aggregation as AggregationType
            )
            lastResponse.collect { it[1] as double }
        }

        result = lastResponse.withIndex().collect { entry, i ->
            entry[1] = resValues[i]
            entry
        }
    }
    else
    {
        result = executeQuery(
                currentData as DataForCompositeDiagram,
                currentColumn,
                currentData.aggregation as AggregationType
        )
    }
    result = currentData.breakdownGroup as GroupType == GroupType.SEVEN_DAYS
            ? getPeriodSevenDays(result, 0)
            : result
    result = currentData.breakdown.type == 'dtInterval'
            ? convertMillisecondToHours(result, 0)
            : result
    result = row.type == 'dtInterval'
            ? convertMillisecondToHours(result, 2)
            : result
    result = currentData.breakdown.type == 'state'
            ? convertCodeStatusToNameStatus(result, 0, currentData.source)
            : result
    result = row.type == 'state'
            ? convertCodeStatusToNameStatus(result, 2, currentData.source)
            : result
    return mappingToTableDiagram(result, currentData.calcTotalColumn, currentData.calcTotalRow)
}

/**
 * Метод построения комбинированных диаграмм с применением вычислений
 * @param request - запрос на построение диаграмм
 * @return результат построения диаграмм
 */
private ComboDiagram getCalculationForComboDiagram(RequestGetDataForCompositeDiagram request)
{
    Closure<Collection<Object>> getResult = { DataForCompositeDiagram currentData ->
        Attribute currentYAxis = currentData.yAxis
        Closure<Collection<Object>> executeQuery = { DataForCompositeDiagram data,
                                                     Attribute attribute,
                                                     AggregationType aggregationType ->
            String source = data.source
            String descriptor = data.descriptor
            HCriteria criteria = createHCriteria(descriptor, source)

            Attribute xAxis = data.xAxis ?: currentData.xAxis
            Attribute breakdown = data.breakdown ?: currentData.breakdown
            GroupType breakdownGroup = data.breakdownGroup ?: currentData.breakdownGroup
            GroupType groupType = data.group ?: currentData.group

            group(criteria, groupType, xAxis, source, descriptor)
            aggregation(criteria, aggregationType, attribute, source, descriptor, xAxis, breakdown)
            if (breakdown)
                group(criteria, breakdownGroup, breakdown, source, descriptor)
            findNotNullAttributes(criteria, xAxis, breakdown)
            Collection<Object> list = getQuery(criteria).list()
            list = currentData.group as GroupType == GroupType.SEVEN_DAYS ? getPeriodSevenDays(list, 0) : list
            list = currentData.breakdownGroup as GroupType == GroupType.SEVEN_DAYS ? getPeriodSevenDays(list, 2) : list
            list = currentData.xAxis.type == 'dtInterval'
                    ? convertMillisecondToHours(list, 0)
                    : list
            list = currentData*.breakdown*.type == 'dtInterval'
                    ? convertMillisecondToHours(list, 2)
                    : list
            list = currentData.xAxis.type == 'state'
                    ? convertCodeStatusToNameStatus(list, 0, source)
                    : list
            list = currentData*.breakdown*.type == 'state'
                    ? convertCodeStatusToNameStatus(list, 2, source)
                    : list
            list
        }

        String formula = currentYAxis.stringForCompute
        if (formula)
        {
            def lastResponse
            def calculator = new FormulaCalculator(formula)
            def resValues = calculator.multipleExecute { variable ->
                def computeData = currentYAxis.computeData.get(variable)
                def data = request.data.get(computeData.dataKey)
                def res = executeQuery(
                        data as DataForCompositeDiagram,
                        computeData.attr as Attribute,
                        computeData.aggregation as AggregationType
                )
                if (res)
                {
                    lastResponse = res
                    return res.collect { it[1] as double }
                }
                else
                {
                    return res
                }
            }

            lastResponse.withIndex().collect { entry, i ->
                entry[1] = resValues[i]
                entry
            }
        }
        else
        {
            executeQuery(
                    currentData as DataForCompositeDiagram,
                    currentYAxis,
                    currentData.aggregation as AggregationType
            ) as Collection<Object>
        }
    }

    Collection<Collection<Object>> list = request.data
            .findResults { key, data -> data.sourceForCompute ? null : getResult(data as DataForCompositeDiagram) }
    return mappingToComboDiagram(list, request)
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
    String nameDayMonth = " WHEN '1' THEN 'января' " +
            " WHEN '2' THEN 'февраля' " +
            " WHEN '3' THEN 'марта' " +
            " WHEN '4' THEN 'апреля' " +
            " WHEN '5' THEN 'мая' " +
            " WHEN '6' THEN 'июня' " +
            " WHEN '7' THEN 'июля' " +
            " WHEN '8' THEN 'августа' " +
            " WHEN '9' THEN 'сентября' " +
            " WHEN '10' THEN 'октября' " +
            " WHEN '11' THEN 'ноября' " +
            " WHEN '12' THEN 'декабря' " +
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
            // Для получения минимальной даты
            def cteSource = createHCriteria(descriptor, source)
            cteSource.addColumn("MIN(CAST(${getAttributeCodeByType(cteSource, xAxis)} AS timestamp))", 'cteMinDate')
            HCriteria cteCriteria = criteria.addCTESource(cteSource)

            // Вывод периода день.месяц-(день.месяц + 7 дней)
            String coefficientForRound = '0.6'
            String groupFormula = "ROUND(ABS((extract(DAY from (CAST(${attributeCode} AS timestamp) " +
                    "- ${cteCriteria.getProperty('cteMinDate')}))- ${coefficientForRound})/ 7))"
            String period = "concat(${cteCriteria.getProperty('cteMinDate')},'--', ${groupFormula})"
            criteria.addColumn("MIN(${period})")

            // Группировка и сортировка по 7 дней от минимальной даты
            criteria.addGroupColumn(groupFormula)
            criteria.addOrder(HOrders.asc(HHelper.getColumn(groupFormula)))
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
private StandardDiagram mappingToStandardDiagram(Collection<Object> list,
                                                 Attribute breakdown,
                                                 GroupType breakdownGroup)
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
    standardDiagram.series = sortSeries(standardDiagram.series, breakdownGroup)
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
    DecimalFormatSymbols otherSymbols = new DecimalFormatSymbols()
    otherSymbols.setDecimalSeparator('.' as char)
    DecimalFormat decimalFormat = new DecimalFormat("#.##", otherSymbols)
    TableDiagram tableDiagram = new TableDiagram()
    Closure<String> capriceFront = { String str -> str.replace('.', '') } // требуется для библиотеки на фронте
    tableDiagram.columns += list.toUnique { it[columnTitleIndex] }.collect { currentCell ->
        def columnTitle = currentCell[columnTitleIndex]
        String resultValue = calcColumn
                ? decimalFormat.format(
                list.sum { it[columnTitleIndex] == columnTitle ? it[dataIndex] : 0 })
                : ""
        new Column(columnTitle as String, capriceFront(columnTitle as String), resultValue)
    }
    list.toUnique { it[rowTitleIndex] }.collectEntries {
        tableDiagram.data << [breakdownTitle: it[rowTitleIndex]]
    }
    list.collect { currentCell ->
        def rowTitle = currentCell[rowTitleIndex]
        tableDiagram.data.find { cell ->
            cell["breakdownTitle"] == rowTitle
        } << [(capriceFront(currentCell[columnTitleIndex] as String)):
                      decimalFormat.format(currentCell[dataIndex])]
    }
    if (calcRow)
    {
        tableDiagram.columns << new Column("Итого", "total", "")
        tableDiagram.data.collect { cell ->
            cell << [total: decimalFormat.format(cell.values().tail().sum{
                decimalFormat.parse(it)})]
        }
    }

    if(calcRow && calcColumn)
    {
        String totalResult = decimalFormat.format(
                tableDiagram.columns*.footer.sum {
                    it != '' ? decimalFormat.parse(it) : 0 })
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
    DecimalFormatSymbols otherSymbols = new DecimalFormatSymbols()
    otherSymbols.setDecimalSeparator('.' as char)
    DecimalFormat decimalFormat = new DecimalFormat("#.##", otherSymbols)
    def dataForNotCompute = request.data.findAll { key, source -> !(source.sourceForCompute) } //отбрасываем источники для вычисления
    ComboDiagram comboDiagram = new ComboDiagram()
    comboDiagram.labels = lists.collect { it*.getAt(labelIndex) }.flatten().unique()
    lists.eachWithIndex { resultOfQuery, index ->
        String currentKey = dataForNotCompute.keySet()[index]
        def currentSource = dataForNotCompute.values()[index]
        Closure<SeriesCombo> buildComboDiagram = {
            String name, String breakdownValue, Collection<Object> resultValues ->
                Collection<Object> data = [0].multiply(comboDiagram.labels.size()) // подготавливаем почву для результата
                resultValues.each { row ->
                    int resultIndex = comboDiagram.labels.indexOf(row[labelIndex])
                    data[resultIndex] = decimalFormat.format(row[dataIndex] as double)
                }
                new SeriesCombo(name, data, currentSource.type as String, currentKey, breakdownValue)
        }
        if (currentSource.breakdown)
        {
            def breakdowns = resultOfQuery.collect({ it[breakdownIndex] }).unique()
            breakdowns.each { breakdown ->
                String name = breakdown
                String breakdownValue = breakdown
                def resultValues = resultOfQuery.findAll { row -> row[breakdownIndex] == breakdown }
                comboDiagram.series << buildComboDiagram(name, breakdownValue, resultValues)
            }
        }
        else
        {
            String title = "${currentSource.yAxis.title}"
            comboDiagram.series << buildComboDiagram(title, "", resultOfQuery)
        }
    }
    comboDiagram.series = sortSeries(comboDiagram.series, request)
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
        case 'dtInterval':
            return "${criteria.getAlias()}.${attribute.code}.ms"
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
        case 'dtInterval':
            return "${criteria.getAlias()}.${attribute.code}.ms"
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
    attributes.each {
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
private def deserializeDescriptor(String jsonString)
{
    return DashboardMarshaller.getDescriptorFromJson(jsonString)
}

/**
 * Метод получения периода для группировки 7 дней
 * @param list список из бд
 * @param индекс столбца в бд
 * @return list преобразованный список из бд
 */
private Collection<Object> getPeriodSevenDays(Collection<Object> list, int indexColumn)
{
    return list.collect {
        def dataForCompute = it[indexColumn].split('--')

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd",
                new Locale("ru"))
        def dateMin = sdf.parse(dataForCompute[0])
        sdf.applyPattern("dd MMMM")

        def formulaFrom = dataForCompute[1].toInteger()*7
        Calendar dateFrom = Calendar.getInstance()
        dateFrom.setTime(dateMin)
        dateFrom.add(Calendar.DAY_OF_MONTH, formulaFrom)

        def formulaTo = formulaFrom + 6
        Calendar dateTo = Calendar.getInstance()
        dateTo.setTime(dateMin)
        dateTo.add(Calendar.DAY_OF_MONTH, formulaTo)

        it[indexColumn] = "${sdf.format(dateFrom.getTime())} - ${sdf.format(dateTo.getTime())}"
        it
    }
}

/**
 * Метод получения периода для группировки 7 дней
 * @param list список из бд
 * @param индекс столбца в бд
 * @return list преобразованный список из бд
 */
private Collection<Object> convertMillisecondToHours(Collection<Object> list, int indexColumn)
{
    return list.collect {
        it[indexColumn] = TimeUnit.MILLISECONDS.toHours(it[indexColumn])
        it
    }
}

/**
 * Метод конвертирования кода для атрибута с типом статус в название статуса
 * @param list список из бд
 * @param indexColumn индекс столбца в бд для изменения
 * @param fqn Код источника данных
 * @return list преобразованный список из бд
 */
private Collection<Object> convertCodeStatusToNameStatus(Collection<Object> list,
                                                         int indexColumn,
                                                         String fqn)
{
    Map<String, String> codeName = list.toUnique { it[indexColumn] }*.getAt(indexColumn).collectEntries {
        [(it): api.metainfo.getStateTitle(fqn, it)]

    }
    return list.collect {
        it[indexColumn] = codeName[it[indexColumn]]
        it
    }.sort{it[indexColumn]}
}

/**
 * Метод сортировки разбивки по name в зависимости от типа группировки для 1 диаграммы
 * @param series список данных по y в форматах {@link Series} или {@link SeriesCombo}
 * @param breakdownGroup Тип группировки для разбивки
 * @return измененный список данных по y в форматах {@link Series} или {@link SeriesCombo}
 */
private Collection<Object> sortSeries(Collection<Object> series, GroupType breakdownGroup)
{
    def closureConvertStringToDate = { pattern, name ->
        new SimpleDateFormat(pattern, new Locale("ru")).parse(name)
    }
    switch(breakdownGroup)
    {
        case [GroupType.OVERLAP, GroupType.WEEK, GroupType.QUARTER, GroupType.YEAR]:
            series = series.sort{ it.name }
            break
        case GroupType.MONTH:
            series = series.sort {
                closureConvertStringToDate("MMMM", it.name)
            }
            break
        case GroupType.DAY:
            series = series.sort {
                closureConvertStringToDate("dd MMMM", it.name)
            }
            break
        case GroupType.SEVEN_DAYS:
            series = series.sort {
                closureConvertStringToDate("dd MMMM - dd MMMM", it.name)
            }
            break
    }
    return series
}

/**
 * Метод сортировки разбивки по name в зависимости от типа группировки для combo диаграммы
 * @param series список данных по y
 * @param request данные для построения combo диаграммы
 * @return измененный список данных по y
 */
private Collection<SeriesCombo> sortSeries(Collection<SeriesCombo> series,
                                           RequestGetDataForCompositeDiagram request)
{
    Collection<SeriesCombo> seriesNew = []
    series.dataKey.toUnique().each{ dataKey ->
        Collection<SeriesCombo> seriesPart = series.findAll{ it.dataKey == dataKey}
        seriesPart = sortSeries(seriesPart, request.data[dataKey].breakdownGroup as GroupType)
        seriesNew.addAll(seriesPart)
    }
    return seriesNew
}
//endregion