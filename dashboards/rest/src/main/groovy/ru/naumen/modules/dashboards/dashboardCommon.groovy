/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Технический модуль для приложения "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль

package ru.naumen.modules.dashboards

import com.fasterxml.jackson.annotation.JsonAlias
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.TreeNode
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.databind.node.BooleanNode
import com.fasterxml.jackson.databind.node.DoubleNode
import com.fasterxml.jackson.databind.node.IntNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.databind.DatabindContext
import com.fasterxml.jackson.databind.JavaType
import com.fasterxml.jackson.databind.jsontype.impl.TypeIdResolverBase
import com.fasterxml.jackson.databind.type.TypeFactory
import com.fasterxml.jackson.databind.node.TextNode
import com.amazonaws.util.json.Jackson
import groovy.transform.AutoClone
import groovy.transform.TupleConstructor
import groovy.transform.Canonical
import static groovy.json.JsonOutput.toJson
import java.lang.reflect.Method

import ru.naumen.core.server.script.api.injection.InjectApi

import static Constants.*

//region enum
/**
 * Типы диаграмм
 */
enum DiagramType
{
    NONE,
    BAR,
    BAR_STACKED,
    COLUMN,
    COLUMN_STACKED,
    COMBO,
    DONUT,
    LINE,
    PIE,
    SUMMARY,
    SPEEDOMETER,
    TABLE,
    TEXT

    static List<DiagramType> StandardTypes = [COLUMN, COLUMN_STACKED, LINE, BAR, BAR_STACKED]
    static List<DiagramType> RoundTypes = [DONUT, PIE]
    static List<DiagramType> CountTypes = [SUMMARY, SPEEDOMETER]
    static List<DiagramType> NullableTypes = [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE, COMBO, DONUT, PIE]
    static List<DiagramType> SortableTypes = [*StandardTypes, *RoundTypes, COMBO]
}

/**
 * Типы группировки даннных для диаграмм. DAY, WEEK, MONTH, QUARTER, YEAR, SEVEN_DAYS только для дат
 */
enum GroupType
{
    NONE,
    DAY,
    WEEK,
    MONTH,
    QUARTER,
    YEAR,
    SEVEN_DAYS,
    OVERLAP,

    SECOND_INTERVAL,
    MINUTE_INTERVAL,
    HOUR_INTERVAL,
    DAY_INTERVAL,
    WEEK_INTERVAL,

    ACTIVE,
    NOT_STARTED,
    PAUSED,
    STOPPED,
    EXCEED,

    HOURS,
    MINUTES,
    HOUR,
    MINUTE

    static List<GroupType> getTimerTypes()
    {
        return [
            ACTIVE,
            NOT_STARTED,
            PAUSED,
            STOPPED,
            EXCEED
        ]
    }
}

enum Aggregation
{
    NONE(''),
    COUNT_CNT('COUNT(%s)'),
    PERCENT('COUNT(%s)*100.00/%s'),
    SUM('SUM(%s)'),
    AVG('AVG(%s)'),
    MAX('MAX(%s)'),
    MIN('MIN(%s)'),
    MDN('%s'), //TODO: Тут должна была быть медиана.
    NOT_APPLICABLE('')

    Aggregation(String aggregationFormat)
    {
        this.aggregationFormat = aggregationFormat
    }

    String aggregationFormat

    String apply(String... codes)
    {
        return String.format(aggregationFormat, codes)
    }
}

enum Comparison
{
    NONE,
    IS_NULL,
    NOT_NULL,
    EQUAL,
    NOT_EQUAL,
    GREATER,
    LESS,
    GREATER_OR_EQUAL,
    LESS_OR_EQUAL,
    BETWEEN,
    IN,
    CONTAINS,
    NOT_CONTAINS,
    NOT_CONTAINS_AND_NOT_NULL,
    NOT_EQUAL_AND_NOT_NULL,
    NOT_CONTAINS_INCLUDING_EMPTY,
    EQUAL_REMOVED,
    NOT_EQUAL_REMOVED,
    STATE_TITLE_CONTAINS,
    STATE_TITLE_NOT_CONTAINS,
    METACLASS_TITLE_CONTAINS,
    METACLASS_TITLE_NOT_CONTAINS
}
/**
 * Типы статусов для атрибутов типа счётчик и обратный счётчик
 */
enum TimerStatus
{
    a('Активен'),
    p('Приостановлен'),
    s('Остановлен'),
    n('Ожидает начала'),
    e('Кончился запас времени')

    String russianName

    TimerStatus(String russianName) {
        this.russianName = russianName
    }

    static TimerStatus getByName(String russianName) {
        return values().find { it.russianName == russianName }
    }
}

enum MCDisplayMode
{
    MOBILE,
    ANY
}

/**
 * все виды отображения на экране
 */
enum DisplayMode
{
    MOBILE,
    ANY,
    WEB
}

/**
 * Тип параметра колонки
 */
enum ColumnType
{
    PARAMETER,
    INDICATOR,
    BREAKDOWN
}

/**
 * позиция
 */
enum Position
{
    top,
    right,
    bottom,
    left
}

/**
 * тип расположения на дисплее
 */
enum DisplayType
{
    BLOCK,
    INLINE
}

enum TextHandler
{
    CROP,
    WRAP
}

/**
 * тип кастомной группировки
 */
enum Way
{
    SYSTEM,
    CUSTOM
}

/**
 * Тип сортировки
 */
enum SortingType
{
    ASC,
    DESC
}

/**
 * Значение для сортировки
 */
enum SortingValue
{
    DEFAULT,
    INDICATOR,
    PARAMETER
}

/**
 * Тип графика в комбо-диаграмме
 */
enum ComboType
{
    COLUMN,
    COLUMN_STACKED,
    LINE
}

/**
 * Тип границ
 */
enum RangesType
{
    ABSOLUTE,
    PERCENT
}

/**
 * расположение текста
 */
enum TextAlign
{
    left,
    right,
    center
}

/**
 * расположение заголовка
 */
enum HeaderPosition
{
    BOTTOM,
    TOP
}

/**
 * перечисление значений по умолчанию для пустых полей в таблице
 */
enum DefaultValueEnum
{
    EMPTY_ROW,
    DASH,
    NULL,
    ZERO
}

/**
 * Тип параметра для настроек цвета
 */
enum CustomLabelType
{
    LABEL,
    BREAKDOWN
}

/**
 * Тип настройки цвета
 */
enum ColorType
{
    AUTO,
    CUSTOM
}
//endregion

@InjectApi
class DashboardUtils
{
    /**
     * предел значений по количеству строк в таблице
     */
    static final Integer tableParameterLimit = 10000
    /**
     * предел значений по количеству значений разбивки в таблице
     */
    static final Integer tableBreakdownLimit = 30

    /**
     * Метод получения минимальной даты из Бд
     * @param code - код атрибута
     * @param classFqn - класс источника
     * @param descriptor - фильтр для источника
     * @return минимальная дата по данному атрибуту
     */
    static Date getMinDate(String code, String classFqn, String descriptor = '')
    {
        if(descriptor)
        {
            def sc = getApi().selectClause
            def apiDescr = getApi().listdata.createListDescriptor(descriptor)
            def dateCriteria = getApi().listdata.createCriteria(apiDescr)
                                       .addColumn(sc.min(sc.property(code)))
            return getApi().db.query(dateCriteria).list().head() as Date
        }
        return getApi().db.query("select min(${code}) from ${classFqn}").list().head() as Date
    }

    /**
     * Метод по преобразованию поля data к новому формату
     * @param dataOrZeroWidget - поле data от старого виджета или виджет целиком
     * @param clazz - класс формата виджета
     * @return поле data обновленного формата
     */
    static Collection updateDataToNewFormat(def dataOrZeroWidget, Class clazz)
    {
        switch (clazz)
        {
            case AxisZero:
                def dataKey = UUID.randomUUID()
                return [new DiagramNewData(
                    indicators: [new NewIndicator(aggregation: dataOrZeroWidget.aggregation, attribute: dataOrZeroWidget.yAxis)],
                    parameters: [new NewParameter(group: dataOrZeroWidget.group, attribute: dataOrZeroWidget.xAxis)],
                    breakdown: getNewFormatBreakdownOrNull(dataOrZeroWidget.breakdown, dataOrZeroWidget.breakdownGroup, dataKey),
                    dataKey: dataKey,
                    sourceForCompute: dataOrZeroWidget.sourceForCompute,
                    source: new NewSourceValue(value: dataOrZeroWidget.source, descriptor: dataOrZeroWidget.descriptor),
                    top: new Top(),
                    type: dataOrZeroWidget.type)]
            case [AxisPrev, CirclePrev, SummaryPrev]:
                return dataOrZeroWidget
            case AxisCurrentAndNew:
                if(dataOrZeroWidget.find() instanceof AxisCurrentData)
                {
                    return dataOrZeroWidget.collect {
                        new DiagramNewData(
                            indicators: [new NewIndicator(aggregation: it.aggregation, attribute: it.yAxis)],
                            parameters: [new NewParameter(group: it.group, attribute: it.xAxis)],
                            breakdown: getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey),
                            dataKey: it.dataKey,
                            showEmptyData: it.showEmptyData,
                            showBlankData: it.showBlankData,
                            sourceForCompute: it.sourceForCompute,
                            source: new NewSourceValue(value: it.source, descriptor: it.descriptor),
                            top: it.top,
                            type: it.type)
                    }
                }
                else return dataOrZeroWidget
            case CircleZero:
            case SummaryZero:
                def dataKey = UUID.randomUUID()
                return [new DiagramNewData(
                    breakdown: getNewFormatBreakdownOrNull(dataOrZeroWidget.breakdown, dataOrZeroWidget.breakdownGroup, dataKey),
                    indicators: [new NewIndicator(aggregation:  dataOrZeroWidget.aggregation, attribute: dataOrZeroWidget.indicator)],
                    source: new NewSourceValue(value: dataOrZeroWidget.source, descriptor: dataOrZeroWidget.descriptor),
                    sourceForCompute: dataOrZeroWidget.sourceForCompute,
                    dataKey: dataKey,
                    top: new Top()
                )]
            case [CircleCurrentAndNew, SummaryCurrentAndNew, SpeedometerCurrentAndNew] :
                if(dataOrZeroWidget.find() instanceof CircleAndSummaryCurrentData) //почему-то не работает со списком
                {
                    return dataOrZeroWidget.collect {new DiagramNewData(
                        breakdown: getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey),
                        indicators: [new NewIndicator(aggregation: it.aggregation, attribute: it.indicator)],
                        source: new NewSourceValue(value: it.source, descriptor: it.descriptor),
                        sourceForCompute: it.sourceForCompute,
                        showEmptyData: it.showEmptyData,
                        showBlankData: it.showBlankData,
                        dataKey: it.dataKey,
                        top: clazz == CircleCurrentAndNew ? new Top() : null
                    )}
                }
                else return dataOrZeroWidget
            case TablePrevAndCurrentAndNew:
                if(dataOrZeroWidget.find() instanceof TablePrevData)
                {
                    return dataOrZeroWidget
                }
                else if (dataOrZeroWidget.find() instanceof TableCurrentData)
                {
                    return dataOrZeroWidget.collect {
                        new DiagramNewData(
                            indicators: it.indicators,
                            parameters: it.parameters,
                            breakdown: getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey),
                            dataKey: it.dataKey,
                            sourceForCompute: it.sourceForCompute,
                            source: new NewSourceValue(value: it.source, descriptor: it.descriptor),
                            )
                    }
                }
                else return dataOrZeroWidget

        }
    }

    /**
     * Метод по получению разбивки нового формата
     * @param oldBreakdown - старая разбивка
     * @param breakdownGroup - группировка для разбивки
     * @param dataKey - ключ для конкретных данных на построение
     * @return разбивка нового формата
     */
    static Collection<NewBreakdown> getNewFormatBreakdownOrNull(def oldBreakdown, Group breakdownGroup, String dataKey)
    {
        if(!oldBreakdown)
        {
            return null
        }
        //уже новый формат, который готов
        if(oldBreakdown.find().properties.keySet().toList().any { it == 'dataKey'})
        {
            return oldBreakdown
        }
        return oldBreakdown
            ? oldBreakdown.findResults { new NewBreakdown(attribute: it, group: breakdownGroup, dataKey: dataKey) }
            : null
    }

    /**
     * Метод по приведению виджета старого формата к новому формату
     * @param oldFormatWidget - виджет старого формата
     * @return виджет нового формата
     */
    static Widget convertWidgetToNewFormat(Widget oldFormatWidget)
    {
        if(!oldFormatWidget)
        {
            return null
        }

        String diagramType = oldFormatWidget.diagramType
        def widgetCurrentClazz = oldFormatWidget.getClass()

        def oldDataFormat = oldFormatWidget.data.head()?.getClass()
        Boolean calcTotalColumn
        if(widgetCurrentClazz == TablePrevAndCurrentAndNew)
        {
            calcTotalColumn = oldFormatWidget.calcTotalColumn
        }
        if (oldDataFormat == TablePrevData)
        {
            calcTotalColumn =oldFormatWidget.data.head().calcTotalColumn
        }

        Boolean diagramTypeHasNoDataField = widgetCurrentClazz in [AxisZero, SummaryZero, CircleZero]
        def newDataForOld
        if(diagramTypeHasNoDataField)
        {
            //в самых старых форматах с постфиксом Zero поля data не было совсем, отталкиваемся от полей всего виджета
            // и добавляем данные в итоговом конструкторе
            newDataForOld = updateDataToNewFormat(oldFormatWidget, widgetCurrentClazz)
        }
        else
        {
            //если поле data было, обновляем поле data
            oldFormatWidget.data = updateDataToNewFormat(oldFormatWidget.data, widgetCurrentClazz)
        }

        switch (widgetCurrentClazz)
        {
        //AxisPrev, CirclePrev хранят в себе order поле, которое влияет на поле data, обрабоаттное выше, поэтому эти форматы можно обработать вместе
        //в круговых и осевых диаграммах естьь поле colors, legend и тд
            case [AxisZero, AxisPrev, CircleZero, CirclePrev]:
                IndicatorOrParameter indicator = widgetCurrentClazz in [AxisZero, AxisPrev]
                    ? new IndicatorOrParameter(showName: oldFormatWidget.showYAxis)
                    : null
                IndicatorOrParameter parameter = widgetCurrentClazz in [AxisZero, AxisPrev]
                    ? new IndicatorOrParameter(showName: oldFormatWidget.showXAxis)
                    : null
                Legend legend = new Legend(show: oldFormatWidget.showLegend, position: oldFormatWidget.legendPosition)
                DataLabels dataLabels = new DataLabels(show: oldFormatWidget.showValue)
                Header header = new Header(show: oldFormatWidget.showName)
                return widgetCurrentClazz in [AxisZero, AxisPrev]
                    ? new AxisCurrentAndNew(
                    indicator: indicator,
                    parameter: parameter,
                    data: diagramTypeHasNoDataField
                        ? newDataForOld
                        : oldFormatWidget.data as Collection<DiagramNowData>,
                    computedAttrs: oldFormatWidget.computedAttrs as Collection<ComputedAttr>,
                    dataLabels: dataLabels,
                    displayMode: oldFormatWidget.displayMode as DisplayMode,
                    header: header,
                    navigation: new Navigation(),
                    legend: legend,
                    sorting: new Sorting(),
                    templateName: oldFormatWidget.templateName,
                    name: oldFormatWidget.name,
                    id: oldFormatWidget.id,
                    type: oldFormatWidget.type as DiagramType,
                    colors: oldFormatWidget.colors,
                    diagramType: oldFormatWidget.diagramType
                )
                    : new CircleCurrentAndNew(
                    data: diagramTypeHasNoDataField
                        ? newDataForOld
                        : oldFormatWidget.data as Collection<DiagramNowData>,
                    computedAttrs: oldFormatWidget.computedAttrs as Collection<ComputedAttr>,
                    dataLabels: dataLabels,
                    displayMode: oldFormatWidget.displayMode as DisplayMode,
                    header: header,
                    navigation: new Navigation(),
                    legend: legend,
                    sorting: new Sorting(),
                    templateName: oldFormatWidget.templateName,
                    name: oldFormatWidget.name,
                    id: oldFormatWidget.id,
                    type: oldFormatWidget.type as DiagramType,
                    colors: oldFormatWidget.colors,
                    diagramType: oldFormatWidget.diagramType
                )
            case [SpeedometerCurrentAndNew, CircleCurrentAndNew, AxisCurrentAndNew]:
                if(widgetCurrentClazz == AxisCurrentAndNew && oldDataFormat == AxisCurrentData)
                {
                    oldFormatWidget?.indicator?.name = null
                    oldFormatWidget?.parameter?.name = null
                }
                return oldFormatWidget //здесь формат был стабилен, кроме поле data которе изменили выше
            case [SummaryZero, SummaryPrev, SummaryCurrentAndNew]:
                return new SummaryCurrentAndNew(
                    computedAttrs: oldFormatWidget.computedAttrs as Collection<ComputedAttr>,
                    displayMode: oldFormatWidget.displayMode as DisplayMode,
                    header: oldFormatWidget.header as Header ?: new Header(),
                    name: oldFormatWidget.name,
                    id: oldFormatWidget.id,
                    indicator: oldFormatWidget.indicator as SpeedometerIndicator ?: new SpeedometerIndicator(),
                    data: diagramTypeHasNoDataField
                        ? newDataForOld
                        : oldFormatWidget.data as Collection<DiagramNowData>,
                    navigation: oldFormatWidget.navigation as Navigation ?: new Navigation(),
                    templateName: oldFormatWidget.templateName,
                    type: oldFormatWidget.type as DiagramType,
                    diagramType: oldFormatWidget.diagramType
                )
            case TablePrevAndCurrentAndNew:
                return new TablePrevAndCurrentAndNew(
                    computedAttrs: oldFormatWidget.computedAttrs as Collection<ComputedAttr>,
                    calcTotalColumn: calcTotalColumn,
                    diagramName: oldFormatWidget.diagramName,
                    navigation: oldFormatWidget.navigation as Navigation,
                    templateName: oldFormatWidget.templateName,
                    name: oldFormatWidget.name,
                    id: oldFormatWidget.id,
                    displayMode: oldFormatWidget.displayMode as DisplayMode,
                    header: oldFormatWidget.header as Header,
                    columnsRatioWidth: oldFormatWidget.columnsRatioWidth,
                    showEmptyData: oldFormatWidget.showEmptyData,
                    showBlankData: oldFormatWidget.showBlankData,
                    showRowNum: oldFormatWidget.showRowNum,
                    sorting: oldFormatWidget.sorting as Sorting,
                    table: oldFormatWidget.table as TableObject,
                    data: oldFormatWidget.data as Collection<DiagramNowData>,
                    top: oldFormatWidget.top as Top,
                    type: oldFormatWidget.type as DiagramType,
                    diagramType: oldFormatWidget.diagramType
                )
        }
    }
}

//region КЛАССЫ
/**
 * Типы атрибутов даннных для диаграмм
 */
class AttributeType {

    static final Collection<String> ALL_ATTRIBUTE_TYPES = [OBJECT_TYPE, TIMER_TYPE, BACK_TIMER_TYPE, BO_LINKS_TYPE, BACK_BO_LINKS_TYPE,
                                                           CATALOG_ITEM_TYPE, CATALOG_ITEM_SET_TYPE, META_CLASS_TYPE, DT_INTERVAL_TYPE, DATE_TYPE,
                                                           DATE_TIME_TYPE, STRING_TYPE, INTEGER_TYPE, DOUBLE_TYPE, STATE_TYPE,
                                                           LOCALIZED_TEXT_TYPE, BOOL_TYPE].asImmutable()

    static final Collection<String> ATTRIBUTE_TYPES_WITHOUT_TIMER = [OBJECT_TYPE, BO_LINKS_TYPE, BACK_BO_LINKS_TYPE, CATALOG_ITEM_TYPE,
                                                                     CATALOG_ITEM_SET_TYPE, META_CLASS_TYPE, DT_INTERVAL_TYPE, DATE_TYPE,
                                                                     DATE_TIME_TYPE, STRING_TYPE, INTEGER_TYPE, DOUBLE_TYPE, STATE_TYPE,
                                                                     LOCALIZED_TEXT_TYPE, BOOL_TYPE].asImmutable()

    static final Collection<String> TIMER_TYPES = [TIMER_TYPE, BACK_TIMER_TYPE].asImmutable()

    static final Collection<String> LINK_TYPES_WITHOUT_CATALOG = [OBJECT_TYPE, BO_LINKS_TYPE, BACK_BO_LINKS_TYPE].asImmutable()

    static final Collection<String> LINK_TYPES = [OBJECT_TYPE,  CATALOG_ITEM_TYPE, CATALOG_ITEM_SET_TYPE, BO_LINKS_TYPE, BACK_BO_LINKS_TYPE].asImmutable()

    static final Collection<String> LINK_SET_TYPES = [CATALOG_ITEM_SET_TYPE, BO_LINKS_TYPE, BACK_BO_LINKS_TYPE].asImmutable()

    static final Collection<String> ONLY_LINK_TYPES = [BO_LINKS_TYPE, BACK_BO_LINKS_TYPE].asImmutable()

    static final Collection<String> SIMPLE_TYPES = [ DT_INTERVAL_TYPE, DATE_TYPE, DATE_TIME_TYPE, STRING_TYPE, INTEGER_TYPE, STATE_TYPE,
                                                     DOUBLE_TYPE, BOOL_TYPE, TIMER_TYPE, BACK_TIMER_TYPE, LOCALIZED_TEXT_TYPE].asImmutable()

    static final Collection<String> NUMBER_TYPES = [INTEGER_TYPE, DOUBLE_TYPE].asImmutable()

    static final Collection<String> DATE_TYPES = [DATE_TYPE, DATE_TIME_TYPE].asImmutable()

    static final Collection<String> DYNAMIC_ATTRIBUTE_TYPES = [DATE_TYPE, DATE_TIME_TYPE, DT_INTERVAL_TYPE, STRING_TYPE].asImmutable()

    static final Collection<String> HAS_UUID_TYPES = [*LINK_TYPES, STATE_TYPE, META_CLASS_TYPE]

    static final String OBJECT_TYPE = 'object'

    static final String TIMER_TYPE ='timer'
    static final String BACK_TIMER_TYPE ='backTimer'
    static final String BO_LINKS_TYPE = 'boLinks'
    static final String CATALOG_ITEM_SET_TYPE ='catalogItemSet'

    static final String BACK_BO_LINKS_TYPE ='backBOLinks'
    static final String CATALOG_ITEM_TYPE ='catalogItem'
    static final String META_CLASS_TYPE = 'metaClass'
    static final String DT_INTERVAL_TYPE = 'dtInterval'

    static final String DATE_TYPE = 'date'
    static final String DATE_TIME_TYPE ='dateTime'
    static final String STRING_TYPE ='string'
    static final String INTEGER_TYPE ='integer'

    static final String DOUBLE_TYPE ='double'
    static final String STATE_TYPE ='state'
    static final String LOCALIZED_TEXT_TYPE ='localizedText'
    static final String BOOL_TYPE = 'bool'
    static final String TOTAL_VALUE_TYPE = 'totalValue'
}

/**
 * Модель для атрибута
 */
@Canonical
@JsonInclude(JsonInclude.Include.NON_NULL)
class Attribute extends BaseAttribute
{
    /**
     * Свойство атрибута (метаклассы ссылочных атрибутов, значения элементов справочника и т.д)
     */
    String property
    /**
     * метакласс атрибута
     */
    String metaClassFqn
    /**
     * Имя источника
     */
    String sourceName
    /**
     * Код источника
     */
    String sourceCode

    /**
     * Вложенный атрибут
     */
    Attribute ref

    static Attribute fromMap(Map<String, Object> data)
    {
        return data ? new Attribute(
            title: data.title as String,
            code: data.code as String,
            type: data.type as String,
            property: data.property as String,
            metaClassFqn: data.metaClassFqn as String,
            sourceName: data.sourceName as String,
            sourceCode: data.sourceCode as String,
            ref: fromMap(data.ref as Map<String, Object>)
        ) : null
    }

    /**
     * Метод получения цепочки атрибутов списком
     * @return Список атрибутов.
     */
    List<Attribute> attrChains()
    {
        return this.ref ? [this] + this.ref.attrChains() : [this]
    }

    /**
     * Полное копирование атрибута включая вложенные
     * @return
     */
    Attribute deepClone()
    {
        return new Attribute(
            code: this.code,
            title: this.title,
            type: this.type,
            property: this.property,
            metaClassFqn: this.metaClassFqn,
            sourceName: this.sourceName,
            sourceCode: this.sourceCode,
            ref: this.ref?.deepClone()
        )
    }

    /**
     * Добавление атрибута последним в цепочке
     * @param attribute - атрибут
     */
    void addLast(Attribute attribute)
    {
        if (this.ref)
        {
            this.ref.addLast(attribute)
        }
        else
        {
            this.ref = attribute
        }
    }
}

class DynamicGroup
{
    /**
     * UUID группы
     */
    String code
    /**
     * Название группы
     */
    String title
}

class DiagramRequest
{
    Collection<Requisite> requisite
    Map<String, RequestData> data
}

class Requisite
{
    String title
    Collection<RequisiteNode> nodes
    Boolean showNulls
    Boolean showBlank
    Integer top
}

class RequisiteNode
{
    String title
    def type
}

class DefaultRequisiteNode extends RequisiteNode
{
    String dataKey
}

class ComputationRequisiteNode extends RequisiteNode
{
    String formula
}

@AutoClone
class RequestData
{
    Source source
    Collection<AggregationParameter> aggregations
    Collection<GroupParameter> groups
    Collection<Collection<FilterParameter>> filters
}

class Source
{
    String classFqn
    String descriptor
    Collection<FilterList> filterList
}

abstract class Parameter<T>
{
    String title
    T type
    BaseAttribute attribute
    String sortingType
}

class AggregationParameter extends Parameter<Aggregation> {}

class GroupParameter extends Parameter<GroupType>
{
    String format
}

class FilterParameter extends Parameter<Comparison>
{
    def value
    String id
}

/**
 * Список всех фильтров для реквизита
 */
class FilterList
{
    Collection<Collection<FilterParameter>> filters
    String place
    String sortingType
}

/**
 * Класс для преобразования/получения значения статуса
 */
class StateMarshaller
{
    /**
     * делитель для значения из Бд
     */
    static String delimiter = '$'

    /**
     * делитель для значения
     */
    static String valueDelimiter = '()'

    /**
     * Метод получения значения для пользователя
     * @param localizedTitle - название статуса, полученный по коду
     * @param stateValue - значение статуса (код)
     * @return название статуса (код)
     */
    static String marshal(String localizedTitle, String stateValue)
    {
        return "${localizedTitle} (${stateValue})"
    }

    /**
     * Метод для парсинга значения
     * @param value - значение целиком
     * @param delimiter - разделитель для значения
     * @return [название статуса, код статуса]
     */
    static Collection<String> unmarshal(String value, String delimiter)
    {
        return value ? value.tokenize(delimiter) : []
    }
}

/**
 * Класс для преобразования/получения значения метакласса
 */
class MetaClassMarshaller
{
    /**
     * делитель для значения
     */
    static String delimiter = '#'

    /**
     * Метод получения значения для пользователя
     * @param localizedTitle - название метакласа, полученное по коду
     * @param stateValue - значение метакласса (код)
     * @return название метакласа delimiter код
     */
    static String marshal(String localizedTitle, String value)
    {
        return "${localizedTitle}${delimiter}${value}"
    }

    /**
     * Метод для парсинга значения
     * @param value - значение целиком
     * @return [название метакласса, код метакласса]
     */
    static Collection<String> unmarshal(String value)
    {
        return value ? value.tokenize(delimiter) : []
    }
}

/**
 * Класс для преобразования/получения значения объекта для вывода карточки объекта
 */
class ObjectMarshaller
{
    /**
     * делитель для значения
     */
    static String delimiter = '#'

    /**
     * Метод получения значения для пользователя
     * @param value - значение объекта
     * @param uuid - uuid объекта
     * @return  значение объекта delimiter uuid объекта
     */
    static String marshal(String value, String uuid)
    {
        return "${value}${delimiter}${uuid}"
    }

    /**
     * Метод для парсинга значения
     * @param value - значение целиком
     * @return [значение объекта, uuid объекта]
     */
    static List<String> unmarshal(String value)
    {
        return value ? value.tokenize(delimiter) : []
    }
}

/**
 * Класс для преобразования/получения значения объекта для вывода кода дашборда
 */
class DashboardCodeMarshaller
{
    /**
     * делитель для значения
     */
    static String delimiter = '_'

    /**
     * Метод получения значения для пользователя
     * @param value - Fqn объекта, под которым был создан дашборд
     * @param uuid - uuid дашборда
     * @return  значение объекта delimiter uuid объекта
     */
    static String marshal(String value, String uuid)
    {
        return "${value}${delimiter}${uuid}"
    }

    /**
     * Метод для парсинга значения
     * @param value - значение дашборда целиком
     * @return [ Fqn объекта, под которым был создан дашборд (root/employee), uuid дашборда]
     */
    static List<String> unmarshal(String value)
    {
        return value ? value.tokenize(delimiter) : []
    }
}

/**
 * Класс для преобразования/получения значения объекта для атрибута типа НБО и НОБО
 */
class LinksAttributeMarshaller
{
    /**
     * делитель для значения
     */
    static String delimiter = '#'

    /**
     * делитель для запроса в БД
     */
    static String valueDelimiter = '.'

    /**
     * Метод получения значения для пользователя
     * @param value - название объекта типа boLinks или backBOLinks
     * @param uuid - uuid этого объекта
     * @return  название объекта delimiter uuid объекта
     */
    static String marshal(String value, String uuid)
    {
        return "${value}${valueDelimiter}${uuid}"
    }

    /**
     * Метод для парсинга значения
     * @param value - значение объекта вместе с uuid-ом
     * @return [ название объекта, uuid объекта]
     */
    static List<String> unmarshal(String value)
    {
        return value ? value.tokenize(delimiter) : []
    }
}
//endregion

//region Dashboards And Widgets Settings
class Constants {
    static final String defaultFontFamily = 'Roboto'
    static final String blackColor = 'black'
    static final String whiteColor = 'white'
    static final String autoSize = 'auto'
    static final String fontStyle = 'BOLD'
}

/**
 * Категория расширяющая возможности Jackson
 */
class JacksonUtils
{
    /**
     * Получить значение из {@link TreeNode}
     * @param self узел json-документа
     * @return значение
     */
    static <T> T getValue(TreeNode self)
    {
        def value = null
        switch (self)
        {
            case TextNode:
                value = ((TextNode) self).textValue()
                break
            case IntNode:
                value = ((IntNode) self).intValue()
                break
            case DoubleNode:
                value = ((DoubleNode) self).doubleValue()
                break
            case BooleanNode:
                value = ((BooleanNode) self).booleanValue()
                break
            case ArrayNode:
                value = ((ArrayNode) self)?.get(0)
                break
            default:
                value = ((JsonNode) self).asText()
        }
        return (T) value
    }

    /**
     * Получение значения из {@link TreeNode} по имени свойства
     * Сделано для поддержки синтаксита node['keyName']
     * @param self узел json-документа
     * @param key имя свойства
     * @return значение указанного свойства
     */
    static <T> T getAt(TreeNode self, String key)
    {
        def node = self.get(key)
        return node != null ? getValue(node) : null
    }

    /**
     * Возвращает имена полей в {@link TreeNode}
     * @param self узел json-документа
     * @return имена полей
     */
    static Collection<String> getFieldNames(TreeNode self)
    {
        return self.fieldNames().toList()
    }

    /**
     * Проверяет наличие поля в {@link TreeNode} по его имени
     * @param self узел json-документа
     * @param key имя свойства
     * @return true если поле есть
     */
    static Boolean hasField(TreeNode self, String key)
    {
        return key in getFieldNames(self)
    }
}

/**
 * Класс-десериализатор для настроек дашборда
 */
class DashboardSettingsDeseializer extends StdDeserializer
{
    DashboardSettingsDeseializer() {
        this(null);
    }

    DashboardSettingsDeseializer(Class<?> vc) {
        super(vc);
    }
    /**
     * Метод по преобразованию излишне экранированных объектов в дашборде к правильному формату(классу)
     * @param fields - поля настроек дашборда в исходном виде
     * @param fieldNameToChange - поля, формат которых нужно поменять
     * @param clazz - класс, в который превратятся исходные настройки
     * @return поля настроек дашборда, как объекты нужного класса
     */
    Map updateMapWithTextFields(Map fields, String fieldNameToChange, TypeReference clazz)
    {
        ObjectMapper mapper = new ObjectMapper()
        if(fields[fieldNameToChange] && (fields[fieldNameToChange].find() instanceof String || fields[fieldNameToChange].find() instanceof TextNode))
        {
            fields[fieldNameToChange] = fields[fieldNameToChange].findResults { it ? mapper.readTree(it) : null }
        }
        fields[fieldNameToChange] = mapper.convertValue(fields[fieldNameToChange], clazz)
        return fields
    }

    @Override
    DashboardSettingsClass deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)

        Map<String, Object> fields = mapper.convertValue(obj, Map)

        updateMapWithTextFields(fields, 'widgets', new TypeReference<Collection<Widget>>() {})
        updateMapWithTextFields(fields, 'customGroups', new TypeReference<Collection<CustomGroup>>() {})

        fields.layouts = mapper.convertValue(fields.layouts, Layout)
        fields.mobileLayouts = mapper.convertValue(fields.mobileLayouts, Layout)
        fields.customColorsSettings = fields.customColorsSettings ? mapper.convertValue(fields.customColorsSettings,
                                                                                        new TypeReference<Collection<CustomChartSettingsData>>() {}) : []
        return DashboardSettingsClass.fromMap(fields)
    }
}

/**
 * Класс, описывающий настройки дашборда
 */
@JsonDeserialize(using = DashboardSettingsDeseializer)
class DashboardSettingsClass
{
    /**
     * настройка автообновления дашборда
     */
    AutoUpdate autoUpdate
    /**
     * Коллекция виджетов дашборда
     */
    Collection<Widget> widgets = []
    /**
     * Коллекция кастомных группировок дашборда
     */
    Collection<CustomGroup> customGroups = []
    /**
     * Настройка расположений виджетов в основной версии
     */
    Layout layouts = null
    /**
     * Настройка расположений виджетов в мобильной версии
     */
    Layout mobileLayouts = null
    /**
     * Ключ дашборда
     */
    String dashboardKey

    Collection<CustomChartSettingsData> customColorsSettings = []

    static fromMap(Map fields)
    {
        return fields ?
            new DashboardSettingsClass(autoUpdate: fields.autoUpdate as AutoUpdate,
                                       widgets: fields.widgets as Collection<Widget>,
                                       customGroups: fields.customGroups as Collection<CustomGroup>,
                                       layouts: fields.layouts as Layout,
                                       mobileLayouts: fields.mobileLayouts as Layout,
                                       customColorsSettings: fields.customColorsSettings as Collection<CustomChartSettingsData>)
            : null
    }
}

/**
 * Класс, описывающий внутренности таблицы для фронта
 */
class TableObject
{
    /**
     * Объект, описывающий тело таблицы для фронта
     */
    TableBody body = new TableBody()
    /**
     * Объект, описывающий заголовки колонок таблицы для фронта
     */
    ColumnHeader columnHeader = new ColumnHeader()
}

/**
 * Класс, описывающий заголовок колонки таблицы для фронта
 */
class ColumnHeader
{
    /**
     * Цвет текста
     */
    String fontColor = blackColor
    /**
     * Расположение текста
     */
    TextAlign textAlign = TextAlign.center
    /**
     * Способ обработки текста
     */
    TextHandler textHandler = TextHandler.CROP
}

/**
 * Класс, описывающий тело таблицы
 */
class TableBody
{
    /**
     * Значение по умолчанию для ячеек, где пришёл null
     */
    DefaultValue defaultValue = new DefaultValue()
    /**
     * Настройки показателя
     */
    IndicatorOrParameterSettings indicatorSettings = new IndicatorOrParameterSettings()
    /**
     * Количество строк на странице
     */
    Integer pageSize = 20
    /**
     * Настройки параметра
     */
    IndicatorOrParameterSettings parameterSettings = new IndicatorOrParameterSettings()
    /**
     * Флаг на показ номера строки
     */
    Boolean showRowNum = true
    /**
     * Расположение текста в ячейках
     */
    TextAlign textAlign = TextAlign.left
    /**
     * Способ обработки текста
     */
    TextHandler textHandler = TextHandler.CROP
}

/**
 * Значение по умолчанию для ячеек, где пришёл null
 */
class DefaultValue
{
    /**
     * Фраза для отображения
     */
    String label = 'Показывать " "'
    /**
     * Значение для отображения
     */
    DefaultValueEnum value = DefaultValueEnum.EMPTY_ROW
}

/**
 * Настройки параметра/показателя
 */
class IndicatorOrParameterSettings
{
    /**
     * Цвет текста
     */
    String fontColor = blackColor
}

/**
 * Расположение виджетов
 */
class Layout
{
    /**
     * Коллекция настроек расположений виджетов на больших экранах
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Collection<LayoutSettings> lg
    /**
     * Коллекция настроек расположений виджетов на маленьких экранах
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Collection<LayoutSettings> sm

    static Layout fromMap(Map fields)
    {
        return fields ?
            new Layout(lg: LayoutSettings.fromListOfMap(fields.lg), sm: LayoutSettings.fromListOfMap(fields.sm))
            :null
    }
}

/**
 * Настройка расположений виджетов
 */
class LayoutSettings
{
    /**
     * Координаты высоты
     */
    Integer h
    /**
     * Ключ виджета
     */
    String i
    /**
     * Координаты ширины
     */
    Integer w
    /**
     * Координаты относительно оси х
     */
    Integer x
    /**
     * Координаты относительно оси y
     */
    Integer y
    /**
     * бул
     */
    Boolean moved = false
    /**
     * бул
     */
    @JsonProperty('static')
    Boolean staticMode = false

    static LayoutSettings fromMap(Map fields)
    {
        return fields
            ? new LayoutSettings(h: fields.h,
                                 i: fields.i,
                                 w: fields.w,
                                 x: fields.x,
                                 y: fields.y,
                                 moved: fields.moved,
                                 staticMode: fields.staticMode)
            : null
    }

    static Collection<LayoutSettings> fromListOfMap(Collection fields)
    {
        return fields ? fields.findResults { fromMap(it) } : []
    }
}

/**
 * Автообновление дашборда
 */
class AutoUpdate
{
    /**
     * флаг на включение автообновления
     */
    private boolean enabled
    /**
     * интервал обновления
     */
    int interval

    AutoUpdate(Map map)
    {
        this.enabled = map.enabled as boolean
        this.interval = map.interval as int
    }

    AutoUpdate(int interval)
    {
        this.enabled = true
        this.interval = interval
    }

    /**
     * выключить автообновление
     */
    void disable()
    {
        this.enabled = false
    }

    /**
     * включить автообновление
     */
    void enable()
    {
        this.enabled = true
    }

    /**
     * установить автообновление
     */
    void setEnabled(boolean enabled)
    {
        //NOP
    }
}

/**
 * Класс-десериализатор атрибута показателя
 * @param <T> - класс итогового показателя
 */
class BaseAttributeCustomDeserializer<T> extends StdDeserializer<T>
{
    /**
     * словарь отличительных особенностей
     */
    private Map<Class, Closure<Boolean>> predictors = [
        (Attribute) : { value ->
            return use(JacksonUtils) {
                value.hasField('metaClassFqn')
            }
        },
        (ComputedAttr) : {
            value ->
                return use(JacksonUtils) {
                    value.hasField('computeData')
                }
        }
    ]

    BaseAttributeCustomDeserializer()
    {
        this(null);
    }

    BaseAttributeCustomDeserializer(Class<?> vc)
    {
        super(vc);
    }

    @Override
    T deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)

        Class clazz = predictors.find{clazz, predictor -> predictor(obj)}.key
        Map<String, Object> fields = mapper.convertValue(obj, Map)
        Method fromMapMethod = clazz.getMethod('fromMap', Map)
        fromMapMethod.invoke(null, fields)
    }
}

/**
 * Класс атрибута, содержащего агрегацию
 */
@JsonDeserialize(using = BaseAttributeCustomDeserializer)
@Canonical
class BaseAttribute
{
    /**
     * Код атрибута
     */
    String code
    /**
     * Название атрибута
     */
    String title
    /**
     * Тип атрибута
     */
    String type
}

/**
 * Класс для атрибута агрегации с вычислениями
 */
@Canonical
class ComputedAttr extends BaseAttribute
{
    /**
     * Код атрибута
     */
    String code
    /**
     * Название атрибута
     */
    String title
    /**
     * Тип атрибута
     */
    String type
    //прописала заново, тк поля супера не хотели заполняться

    /**
     * Словарь [ключ данных для построения: информаця о данных для вычисления]
     */
    Map<String, ComputeData> computeData
    /**
     * Описание состояния атрибута
     */
    String state
    /**
     * Формула для вычисления
     */
    String stringForCompute

    static ComputedAttr fromMap(Map fields)
    {
        return fields
            ?  new ComputedAttr(code: fields.code,
                                title: fields.title,
                                type: fields.type,
                                computeData: ComputeData.fromMap(fields.computeData),
                                state: fields.state,
                                stringForCompute: fields.stringForCompute)
            : null
    }
}

/**
 * Информаця о данных для вычисления
 */
class ComputeData
{
    /**
     * Тип агрегации
     */
    Aggregation aggregation
    /**
     * Атрибут-показатель в формуле
     */
    Attribute attr
    /**
     * Ключ данных для построения, откуда взят показатель
     */
    String dataKey

    static Map<String, ComputeData> fromMap(Map fields)
    {
        return fields ?
            fields.collectEntries { k, v ->
                def data = new ComputeData(aggregation: v.aggregation as Aggregation,
                                           attr: Attribute.fromMap(v.attr),
                                           dataKey: v.dataKey)
                return [(k): data]
            }
            : [:]
    }
}

/**
 * Новый формат источника
 */
class NewSourceValue
{
    /**
     * фильтрация на источник
     */
    String descriptor

    /**
     * значение источника
     */
    SourceValue value
}

/**
 * Значение источника (старый формат, замена - NewSourceValue)
 * @deprecated использовать {@link NewSourceValue} вместо него.
 */
@Deprecated
class SourceValue extends ValueWithLabel<String>
{
    /**
     * value - classFqn источника
     */
}

/**
 * Базовый класс для классов с полями label и value
 * @param <T> - тип поля value
 */
class ValueWithLabel<T>
{
    /**
     * Название
     */
    String label
    /**
     * Значение
     */
    T value
}

trait IHasFontSettings
{
    /**
     * Шрифт
     */
    String fontFamily = defaultFontFamily

    /**
     * Размер шрифта
     */
    Integer fontSize = 16
}

/**
 * Метки данных
 */
class DataLabels implements IHasFontSettings
{
    {
        fontSize = 14
    }
    /**
     * Цвет текста
     */
    String fontColor = whiteColor
    /**
     * Флаг на отображение
     */
    Boolean show = true
    /**
     * Флаг на тень
     */
    Boolean showShadow = true
}

/**
 * Легенда для графика
 */
class Legend implements IHasFontSettings
{
    {
        fontSize = 14
    }
    /**
     * Расположение на дисплее
     */
    DisplayType displayType = DisplayType.BLOCK
    /**
     * Позиция легенды
     */
    Position position = Position.right
    /**
     * Флаг на отображение
     */
    Boolean show = true
    /**
     * Способ отображения
     */
    TextHandler textHandler = TextHandler.CROP
}

/**
 * Заголовок графика
 */
class Header implements IHasFontSettings
{
    /**
     * Цвет текста
     */
    String fontColor = '#323232'
    /**
     * Название графика
     */
    String name = ''
    /**
     * Расположение заголовка
     */
    HeaderPosition position = HeaderPosition.BOTTOM
    /**
     * Флаг на отображение
     */
    Boolean show = true
    /**
     * Шаблон названия
     */
    String template = ''
    /**
     * Расположение текста
     */
    TextAlign textAlign = TextAlign.left
    /**
     * Способ обработки текста
     */
    TextHandler textHandler = TextHandler.CROP
    /**
     * Флаг на использование названия
     */
    Boolean useName = true
}

/**
 * Навигация с виджета
 */
class Navigation
{
    /**
     * Объект навигации: дашборд
     */
    NavigationDashboardOrWidget dashboard
    /**
     * Флаг на отображение
     */
    Boolean show = false
    /**
     * Флаг на использование подсказок
     */
    Boolean showTip = false
    /**
     * Текст подсказки
     */
    String tip = ''
    /**
     * Объект навигации: виджет
     */
    NavigationDashboardOrWidget widget
}

/**
 * Объект навигации: дашборд/виджет
 */
class NavigationDashboardOrWidget extends ValueWithLabel<String> { }

/**
 * Топ х
 */
class Top
{
    /**
     * Количество значений для топа
     */
    Integer count = 5
    /**
     * Флаг на отображение топа
     */
    Boolean show = false
}

/**
 * Новый формат разбивки
 */
class NewBreakdown extends BaseBreakdown
{
    /**
     * Группировка для разбивки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Group group

    /**
     * Атрибут разбивки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonAlias(["attribute", "value"])
    Attribute attribute

    /**
     * Ключ данных, где используется разбивка
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String dataKey

    static NewBreakdown fromMap(Map fields, String attributeField)
    {
        return fields ?
            new NewBreakdown(group: fields.group as Group,
                             attribute: fields[attributeField] as Attribute,
                             dataKey: fields.dataKey)
            : null
    }
}

/**
 * Базовая разбивка
 * @deprecated использовать {@link NewBreakdown} вместо него
 */
@JsonDeserialize(using = BreakdownCustomDeserializer)
@Deprecated
class BaseBreakdown extends Attribute
{
    //разбивка содержала лишь атрибут, поэтому класс лишь наследует класс Attribute
}

/**
 * Класс-десериализатор для разбивки
 * @param <T> - тип разбивки, в который будет преобразована json-строка
 */
class BreakdownCustomDeserializer<T> extends StdDeserializer<T>
{
    BreakdownCustomDeserializer()
    {
        this(null);
    }

    BreakdownCustomDeserializer(Class<?> vc)
    {
        super(vc);
    }

    @Override
    T deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)

        Map<String, Object> fields = mapper.convertValue(obj, Map)

        if ('attribute' in fields.keySet() || 'value' in fields.keySet())
        {
            fields.group = mapper.convertValue(fields.group, Group)
            String attributeField = 'attribute' in fields.keySet() ? 'attribute' : 'value'
            return NewBreakdown.fromMap(fields, attributeField)
        }
        else if('code' in fields.keySet())
        {
            return Attribute.fromMap(fields)
        }
        else
        {
            throw new IllegalArgumentException("${fields.keySet()} - Неправильный набор полей!")
        }
    }
}

/**
 * Показатель нового формата
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class NewIndicator
{
    /**
     * Тип агрегации
     */
    Aggregation aggregation
    /**
     * Атрибут - показатель
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    BaseAttribute attribute
}

/**
 * Параметр нового формата
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class NewParameter
{
    /**
     * Группировка параметра
     */
    Group group
    /**
     * Атрибут - параметр
     */
    Attribute attribute
}

/**
 * Класс-десериализатор для группировок параметра/разбивки
 * @param <T> - класс, в который будет преобразована json-строка
 */
class GroupCustomDeserializer<T> extends StdDeserializer<T>
{
    /**
     * словарь отличительных особенностей
     */
    private Map<Class, Closure<Boolean>> predictors = [
        (SystemGroupInfo) : { value ->
            return use(JacksonUtils) {
                value['way'] == 'SYSTEM'
            }
        },
        (CustomGroupInfo): { value ->
            return use(JacksonUtils) {
                value['way'] == 'CUSTOM'
            }
        }
    ]

    GroupCustomDeserializer() {
        this(null);
    }

    GroupCustomDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    T deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)

        Class<? extends T> clazz = predictors.find{clazz, predictor -> predictor(obj)}?.key

        if(!clazz)
        {
            throw ctxt.instantiationException(SystemGroupInfo, "проверьте данные о группе!")
        }

        Map<String, Object> fields = mapper.convertValue(obj, Map)
        return clazz.fromMap(fields)
    }
}

/**
 * Класс группировки для параметра/разбивки
 */
@Canonical
@JsonDeserialize(using = GroupCustomDeserializer)
class Group
{
    /**
     * Тип группировки
     */
    Way way
    @JsonInclude(JsonInclude.Include.NON_NULL)
    /**
     * Формат группировки
     */
    String format

    /**
     * Метод для подробного описания группировки
     * @param group - группировка
     * @param customGroups - набор кастомных группировок дашборда
     * @param noBreakInTable - флаг на отсутствие разбивки (иногда фронт хранил группировку, хотя её не было)
     * @return более подробно описанная группировка
     */
    static Group mappingGroup(Group group, def customGroups, Boolean noBreakInTable = false)
    {
        if(noBreakInTable)
        {
            return null
        }
        if(group)
        {
            if(group.way == Way.CUSTOM)
            {
                def groupKey = group.data
                def groupInfo = customGroups.find { it.id == groupKey }
                group.data = groupInfo
            }
        }
        return group
    }
}

/**
 * Информация о системной группировке
 */
@Canonical
class SystemGroupInfo extends Group
{
    /**
     * Тип системной группировки
     */
    GroupType data

    static SystemGroupInfo fromMap(def fields)
    {
        if(fields instanceof String)
        {
            //в старых форматах была строка, обозначающая тип системной группировки
            return new SystemGroupInfo(data: fields as GroupType, way: Way.SYSTEM)
        }

        return fields instanceof Map
            ? new SystemGroupInfo(data: fields.data as GroupType,
                                  way: fields.way as Way,
                                  format: fields.format)
            : null
    }
}

/**
 * Информация о кастомной группировке
 */
@Canonical
class CustomGroupInfo extends Group
{
    /**
     * Данные группировки (сначала это ключ кастомной группировки, потом это сама кастомная группировка)
     */
    def data

    CustomGroupInfo(def data, def way)
    {
        super(way: way as Way)
        this.data = data
    }
    CustomGroupInfo(def map)
    {
        this.data = map.data
        this.way = map.way
    }

    static CustomGroupInfo fromMap(Map fields)
    {
        return fields
            ? new CustomGroupInfo(fields)
            : null
    }
}

/**
 * Класс позиции легенды
 */
class LegendPosition extends ValueWithLabel<Position> { }

/**
 * Класс информации о параметре/показателе
 */
@Canonical
class IndicatorOrParameter
{
    /**
     * Название параметра/показателя
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String name
    /**
     * Флаг на отображение
     */
    Boolean show = true
    /**
     * Флаг на отоюражение названия
     */
    Boolean showName = false
}

/**
 * Класс информации о показателе в комбо диаграмме
 */
@Canonical
class ComboIndicator extends IndicatorOrParameter
{
    /**
     * Предел максимума
     */
    Integer max
    /**
     * Предел минимума
     */
    Integer min
    /**
     * Флаг на отображение датасетов зависимо
     */
    Boolean showDependent
}

/**
 * Класс, описывающий сортировку
 */
class Sorting
{
    /**
     * Порядок сортировки
     */
    SortingType type = SortingType.ASC
    /**
     * Значение для сортировки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    SortingValue value
    /**
     * Ключ датасета для сортировки (для комбо диаграммы)
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String dataKey
    /**
     * Название для доступа в таблице
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String accessor
}

/**
 * Класс-десириализатор для кастомных группировок дашборда
 */
class CustomGroupDeserializer extends StdDeserializer
{
    CustomGroupDeserializer()
    {
        this(null);
    }

    CustomGroupDeserializer(Class<?> vc)
    {
        super(vc);
    }

    @Override
    CustomGroup deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)
        Map<String, Object> fields = mapper.convertValue(obj, Map)

        return CustomGroup.fromMap(fields)
    }
}

/**
 * Класс кастомной группировки дашбора
 */
@JsonDeserialize(using = CustomGroupDeserializer)
class CustomGroup
{
    /**
     * Ключ кастомной группировки
     */
    String id
    /**
     * Название кастомной группировки
     */
    String name
    /**
     * Коллекция внутренних групп
     */
    Collection<SubGroup> subGroups
    /**
     * Тип кастомной группировки
     */
    String type

    static CustomGroup fromMap(Map fields)
    {
        return fields ?
            new CustomGroup(id: fields.id,
                            name: fields.name,
                            subGroups: SubGroup.fromListOfMap(fields.subGroups),
                            type: fields.type)
            :null
    }

}

/**
 * Класс внутренней группы
 */
class SubGroup
{
    /**
     * Данные внутренней группы
     */
    Collection<Collection<SubGroupData>> data
    /**
     * Название внутренней группы
     */
    String name
    /**
     * Индекс подгруппы
     */
    String id

    static SubGroup fromMap(Map fields)
    {
        return fields
            ? new SubGroup(data: SubGroupData.fromListOfMap(fields.data), name: fields.name, id: fields.id ?: UUID.randomUUID())
            : null
    }

    static Collection<SubGroup> fromListOfMap(Collection<Map> fields)
    {
        return fields ? fields.findResults { return fromMap(it) } : []
    }

}

/**
 * Класс данных внутренней группировки
 */
class SubGroupData
{
    /**
     * Данные внутренней группы
     */
    def data
    /**
     * Тип условия
     */
    String type

    static SubGroupData fromMap(Map fields)
    {
        return fields
            ? new SubGroupData(data: fields.data, type: fields.type)
            : null
    }

    static Collection<SubGroupData> fromListOfMap(Collection<Collection<Map>> fields)
    {
        return fields ? fields.findResults {
            return it.findResults {
                return fromMap(it)
            }
        } : []
    }
}

/**
 * Класс нулевого формата осевых графиков
 * @deprecated использовать {@link AxisCurrentAndNew} вместо него
 */
@Deprecated
class AxisZero extends OldDiagrams
{
    /**
     * Тип агрегации показателя
     */
    Aggregation aggregation
    /**
     * Атрибут разбивки
     */
    Attribute breakdown
    /**
     * Группировка разбивки
     */
    Group breakdownGroup
    /**
     * Фильтрация источника
     */
    String descriptor
    /**
     * Группировка показателя
     */
    Group group
    /**
     * Источник данных
     */
    SourceValue source
    /**
     * Параметр
     */
    Attribute xAxis
    /**
     * Показатель
     */
    BaseAttribute yAxis

    static fromMap(Map fields)
    {
        return fields ?
            new AxisZero(
                colorsSettings: fields.colorsSettings as ColorsSettings,
                aggregation: fields.aggregation as Aggregation,
                breakdown: fields.breakdown as Attribute,
                breakdownGroup: fields.breakdownGroup as Group,
                descriptor: fields.descriptor,
                group: fields.group  as Group,
                source: fields.source as SourceValue,
                xAxis: fields.xAxis as Attribute,
                yAxis: fields.yAxis as BaseAttribute,
                name: fields.name,
                diagramName: fields.diagramName,
                id: fields.id,
                showValue: fields.showValue,
                showName: fields.showName ,
                showYAxis: fields.showYAxis ,
                showXAxis: fields.showXAxis ,
                showLegend: fields.showLegend ,
                legendPosition: fields.legendPosition,
                type: fields.type,
                diagramType: fields.diagramType
            )
            :null
    }
}

/**
 * Общий класс для диаграмм формата prev
 * @deprecated использовать {@link DiagramNewData} вместо него
 */
@Deprecated
class DiagramsPrev extends OldDiagrams
{
    /**
     * Коллекция атрибутов для вычислений
     */
    Collection<ComputedAttr> computedAttrs
    /**
     * Порядок использования данных
     */
    Collection<Integer> order
    /**
     * Коллекция данных
     */
    Collection<DiagramNowData> data
}

/**
 * Класс предыдущего формата осевых графиков
 */
class AxisPrev extends DiagramsPrev
{
    static AxisPrev fromMap(Map fields)
    {
        return fields ?
            new AxisPrev(
                colorsSettings: fields.colorsSettings as ColorsSettings,
                computedAttrs: fields.computedAttrs  as Collection<ComputedAttr>,
                name: fields.name,
                diagramName: fields.diagramName,
                id: fields.id,
                showValue: fields.showValue,
                showName: fields.showName,
                showYAxis: fields.showYAxis,
                showXAxis: fields.showXAxis,
                showLegend: fields.showLegend,
                legendPosition: fields.legendPosition as LegendPosition,
                order: fields.order,
                data: fields.data as Collection<DiagramNowData>,
                type: fields.type,
                diagramType: fields.diagramType
            )
            : null
    }

}

/**
 * Класс-десериализатор для виджетов дашборда
 * @param <T> - класс объекта, в который будет преобразована json-строка
 */
class WidgetCustomDeserializer<T> extends StdDeserializer<T>
{
    /**
     * словарь отличительных особенностей
     */
    private Map<Class, Closure<Boolean>> predictors = [
        (AxisZero) : { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'AxisZero' ||
                (
                    !value.hasField('data') &&
                    !value.hasField('order') &&
                    ((value['type'] as DiagramType) in [*DiagramType.StandardTypes,
                                                        DiagramType.COMBO])
                )
            }

        },
        (AxisPrev): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'AxisPrev' ||
                (
                    value.hasField('order') &&
                    ((value['type'] as DiagramType) in [*DiagramType.StandardTypes,
                                                        DiagramType.COMBO])
                )
            }
        },
        (AxisCurrentAndNew): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'AxisCurrentAndNew' ||
                (
                    value.hasField('data') &&
                    ((value['type'] as DiagramType) in [*DiagramType.StandardTypes, DiagramType.COMBO]) &&
                    (value['data'].hasField('parameters') || value['data'].hasField('xAxis'))
                )
            }
        },
        (CircleZero): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'CircleZero' ||
                (
                    !value.hasField('data') &&
                    !value.hasField('order') &&
                    ((value['type'] as DiagramType) in DiagramType.RoundTypes)
                )
            }

        },
        (CirclePrev): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'CirclePrev' ||
                (
                    value.hasField('order') && ((value['type'] as DiagramType) in DiagramType.RoundTypes)
                )
            }
        },
        (CircleCurrentAndNew): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'CircleCurrentAndNew' ||
                (
                    value.hasField('data') &&
                    ((value['type'] as DiagramType) in DiagramType.RoundTypes) &&
                    (value['data'].hasField('indicator') || value['data'].hasField('indicators'))
                )
            }
        },
        (SpeedometerCurrentAndNew): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'SpeedometerCurrentAndNew' ||
                (value['type'] as DiagramType) == DiagramType.SPEEDOMETER
            }
        },
        (SummaryZero): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'SummaryZero' ||
                (
                    !value.hasField('data') && !value.hasField('order') &&
                    (value['type'] as DiagramType) == DiagramType.SUMMARY
                )
            }
        },
        (SummaryPrev): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'SummaryPrev' ||
                (
                    value.hasField('order') &&
                    (value['type'] as DiagramType) == DiagramType.SUMMARY
                )
            }
        },
        (SummaryCurrentAndNew): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'SummaryCurrentAndNew' ||
                (
                    value.hasField('data') &&
                    (value['type'] as DiagramType) == DiagramType.SUMMARY
                )
            }
        },
        (TablePrevAndCurrentAndNew): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'TablePrevAndCurrentAndNew' ||
                (value['type'] as DiagramType) == DiagramType.TABLE
            }
        },
        (Text): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'Text' ||
                value.hasField('textSettings')
            }
        }
    ]

    WidgetCustomDeserializer() {
        this(null);
    }

    WidgetCustomDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    T deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)
        String widgetId = obj.path('id').asText()
        Class<? extends T> clazz = predictors.find{clazz, predictor -> predictor(obj)}.key
        if(!clazz)
        {
            throw ctxt.instantiationException(Widget, "проверьте тип виджета ${widgetId}!")
        }
        obj.put('diagramType', clazz.getName())

        Map<String, Object> fields = mapper.convertValue(obj, Map)
        if(clazz == Text)
        {
            return Text.fromMap(fields)
        }
        if(clazz in [AxisPrev, CirclePrev, SummaryPrev])
        {
            fields = updatePrevTypes(fields)
        }

        fields.computedAttrs = mapper.convertValue(fields.computedAttrs, new TypeReference<Collection<ComputedAttr>>() {})

        //прошлый формат придет в поле colors
        String colorField = 'colors'
        if('colorsSettings' in fields.keySet().toList())
        {
            colorField = 'colorsSettings'
        }
        //но новый формат ставим в новое поле
        fields.colorsSettings = fields[colorField] ? mapper.convertValue(fields[colorField], ColorsSettings) : null

        fields.data = mapper.convertValue(fields.data, new TypeReference<Collection<DiagramNowData>>() {})

        return clazz.fromMap(fields)
    }
}

/**
 * Метод по преобразованию данных диаграм с форматом prev к поддерживаемому формату
 * @param fields - текущие поля из хранилища
 * @return преобразованные поля
 */
static Map updatePrevTypes(Map fields)
{
    if (fields)
    {
        return null
    }
    else
    {
        def data
        if((fields.type as DiagramType) in [*DiagramType.StandardTypes, DiagramType.COMBO])
        {
            data = fields.order.collect { index ->
                def dataKey = fields."dataKey_$index"
                def parameters = [[attribute: fields."xAxis_$index", group: fields."group$index"]]
                def indicators = [[aggregation : fields."aggregation_$index", attribute:
                    fields."yAxis_$index", type: fields."type_$index"]]

                def source = fields."source_$index".value
                def descriptor = fields."descriptor_$index"
                def sourceForCompute = fields."sourceForCompute_$index"
                def top = fields.top
                def type = fields."type_$index"

                Map dataBody = [descriptor       : descriptor,
                                parameters       :parameters,
                                source           : source,
                                sourceForCompute : sourceForCompute, indicators:indicators,
                                breakdown        : fields."breakdown_$index",
                                breakdownGroup   : fields."breakdownGroup_$index",
                                top              : top?.show ? top?.count : null,
                                type             : type,
                                showEmptyData    : fields.showEmptyData,
                                showBlankData    : fields.showBlankData]
                return [(dataKey): dataBody]
            }
        }
        else if((fields.type as DiagramType) in [*DiagramType.RoundTypes, *DiagramType.CountTypes])
        {
            data = fields.order.collect { index ->
                def dataKey = fields."dataKey_$index"
                def indicators = [[aggregation: fields."aggregation_$index", attribute: fields."indicator_$index"]]

                def source =  fields."source_$index".value
                def descriptor = fields."descriptor_$index"
                def sourceForCompute = fields."sourceForCompute_$index"
                def top = fields.top

                Map dataBody = [descriptor      : descriptor,
                                parameters      : [],
                                source          : source,
                                sourceForCompute: sourceForCompute,
                                indicators      : indicators,
                                breakdown       : fields."breakdown_$index",
                                breakdownGroup  : fields."breakdownGroup_$index",
                                top             : top?.show ? top?.count : null,
                                showEmptyData   : fields.showEmptyData,
                                showBlankData   : fields.showBlankData]
                data = [(dataKey): dataBody]
            }
        }
        else if((fields.type as DiagramType) == DiagramType.TABLE)
        {
            data = fields.order.collect { index ->
                def dataKey = fields."dataKey_$index"
                def parameters = [[attribute: fields."row_$index", group: fields."group$index"]]
                def indicators = [[aggregation: fields."aggregation_$index", attribute: fields."column_$index"]]

                def source =  fields."source_$index".value
                def descriptor = fields."descriptor_$index"
                def sourceForCompute = fields."sourceForCompute_$index"

                def top = fields.top

                Map requestContent = [descriptor      : descriptor,
                                      parameters      : parameters,
                                      source          : source,
                                      sourceForCompute: sourceForCompute,
                                      indicators      : indicators,
                                      breakdown       : fields."breakdown_$index",
                                      breakdownGroup  : fields."breakdownGroup_$index",
                                      top             : top?.show ? top?.count : null,
                                      showEmptyData   : fields.showEmptyData,
                                      showBlankData   : fields.showBlankData,
                                      calcTotalColumn : fields."calcTotalColumn_$index",
                                      calcTotalRow    : fields."calcTotalRow_$index"]

                return [(dataKey): requestContent]
            }
        }
        else
        {
            throw new IllegalArgumentException("Проверьте ${fields.type}!")
        }
        fields.data = data
        return fields
    }
}

/**
 * Класс общих настроек для всех виджетов
 */
@JsonDeserialize(using = WidgetCustomDeserializer)
@Canonical
abstract class Widget
{
    /**
     * Коллекция цветов диаграммы
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    /**
     * Настройки цветов
     */
    @JsonAlias(['colors', 'colorsSettings'])
    ColorsSettings colorsSettings
    /**
     * Название диаграммы
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String name
    /**
     * Уникальный идентификатор виджета
     */
    String id
    /**
     * Тип диаграммы на построение
     */
    DiagramType type
    /**
     * Название диаграммы
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String diagramName
    /**
     * Тип диаграммы, описывающий класс самого виджета
     */
    @JsonIgnore
    String diagramType
}

/**
 * Класс, описывающий общие настройки для новых виджетов
 */
@Canonical
class NewDiagrams extends Widget
{
    /**
     * Коллекция атрибутов для вычисления
     */
    Collection<ComputedAttr> computedAttrs
    /**
     * Настройки меток данных
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    DataLabels dataLabels
    /**
     * Тип отображения на экране
     */
    DisplayMode displayMode
    /**
     * Заголовок диаграммы
     */
    Header header

    /**
     * Настройки навигации с виджета
     */
    Navigation navigation = new Navigation()
    /**
     * Настройки легенды
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Legend legend
    /**
     * Настройки сортировки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Sorting sorting
    /**
     * Название-шаблон виджета
     */
    String templateName
    /**
     * Название виджета
     */
    String name
}

/**
 * Класс, описывающий общие настройки старых форматов виджетов
 * @deprecated использовать {@link NewDiagrams} вместо него
 */
@Deprecated
@Canonical
class OldDiagrams extends Widget
{
    /**
     * Флаг на отображение значений
     */
    Boolean showValue
    /**
     * Флаг на отображение название
     */
    Boolean showName
    /**
     * Флаг на отображение показателя
     */
    Boolean showYAxis
    /**
     * Флаг на отображение параметра
     */
    Boolean showXAxis
    /**
     * Флаг на отображение легенды
     */
    Boolean showLegend
    /**
     * Настройка позиции легенды
     */
    LegendPosition legendPosition
}

/**
 * Класс-десериализатор на преобразование данных на построение
 * @param <T> класс объекта, в которых будет преобразована json-строка
 */
class DiagramNowDataDeserializer<T> extends StdDeserializer<T>
{
    /**
     * словарь отличительных особенностей
     */
    Map<Class, Closure<Boolean>> predictors = [
        (AxisCurrentData): { value ->
            return use(JacksonUtils) {
                value.hasField('xAxis')
            }
        },
        (DiagramNewData) : { value ->
            return use(JacksonUtils) {
                (value.hasField('indicators') || value['sourceForCompute']) && !value.hasField('descriptor')
            }
        },
        (TableCurrentData): { value ->
            return use(JacksonUtils) {
                value.hasField('parameters') && value.hasField('descriptor')
            }
        },
        (CircleAndSummaryCurrentData): { value ->
            return use(JacksonUtils) {
                (value.hasField('indicator') || value['sourceForCompute']) && value.hasField('descriptor')
            }
        },
        (TablePrevData) : {
            value ->
                return use(JacksonUtils) {
                    value.hasField('row') && value.hasField('descriptor')
                }
        }
    ]

    DiagramNowDataDeserializer()
    {
        this(null);
    }

    DiagramNowDataDeserializer(Class<?> vc)
    {
        super(vc);
    }

    @Override
    T deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        ObjectNode obj = (ObjectNode) mapper.readTree(jp)

        Class<? extends T> clazz = predictors.find{clazz, predictor -> predictor(obj)}?.key
        Map<String, Object> fields = mapper.convertValue(obj, Map)

        fields.breakdown = fields.breakdown instanceof Collection
            ? mapper.convertValue(fields.breakdown, new TypeReference<Collection<BaseBreakdown>>() {})
            : fields.breakdown ? [mapper.convertValue(fields.breakdown, BaseBreakdown)] : null
        fields.breakdownGroup = mapper.convertValue(fields.breakdownGroup, Group)
        if(!clazz)
        {
            throw ctxt.instantiationException(AxisCurrentData, "проверьте входные данные в поле data!")
        }
        if(clazz in [AxisCurrentData, TablePrevData])
        {
            fields.group = mapper.convertValue(fields.group, Group)
        }
        if(clazz == AxisCurrentData)
        {
            fields.yAxis = mapper.convertValue(fields.yAxis, BaseAttribute)

        }
        if(clazz == CircleAndSummaryCurrentData)
        {
            fields.indicator = mapper.convertValue(fields.indicator, BaseAttribute)
        }
        if(clazz in [TableCurrentData, DiagramNewData])
        {
            fields.indicators = mapper.convertValue(fields.indicators, new TypeReference<Collection<NewIndicator>>() {})
            fields.parameters = mapper.convertValue(fields.parameters, new TypeReference<Collection<NewParameter>>() {})
        }

        if(clazz == TablePrevData)
        {
            fields.column = mapper.convertValue(fields.column, BaseAttribute)
        }
        return clazz.fromMap(fields)
    }
}

/**
 * Класс, описывающий формат для текущих и новых осевых диаграмм
 */
class AxisCurrentAndNew extends NewDiagrams
{
    /**
     * Настройки показателя
     */
    IndicatorOrParameter indicator
    /**
     * Настройки параметра
     */
    IndicatorOrParameter parameter
    /**
     * Коллекция данных на построение
     */
    Collection<DiagramNowData> data

    static AxisCurrentAndNew fromMap(Map fields)
    {
        new AxisCurrentAndNew(
            indicator: fields.indicator as IndicatorOrParameter,
            parameter: fields.parameter as IndicatorOrParameter,
            data:fields.data as Collection<DiagramNowData>,
            computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
            dataLabels: fields.dataLabels as DataLabels,
            displayMode:fields.displayMode as DisplayMode,
            header: fields.header as Header,
            navigation: (fields.navigation as Navigation) ?: new Navigation(),
            legend: fields.legend as Legend,
            sorting: fields.sorting as Sorting,
            templateName: fields.templateName,
            name:fields.name,
            id: fields.id,
            type: fields.type as DiagramType,
            colorsSettings: fields.colorsSettings as ColorsSettings,
            diagramType: fields.diagramType)
    }
}


/**
 * Класс, описывающий общие поля текущих данных на построение
 */
@Canonical
@JsonDeserialize(using = DiagramNowDataDeserializer)
class DiagramNowData
{
    /**
     * Флаг на отображение пустых значений
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Boolean showEmptyData = false

    /**
     * Флаг на использование незаполненных значений
     */
    Boolean showBlankData = false
    /**
     * Флаг на данные только для построения
     */
    Boolean sourceForCompute = false
    /**
     * Ключ датасета
     */
    String dataKey
    /**
     * Настройки для вывода топ х данных
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Top top
    /**
     * Коллекция разбивок
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    Collection<BaseBreakdown> breakdown
    /**
     * Группировка разбивки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Group breakdownGroup
}

/**
 * Класс, описывающий текущие данные для построения осевых графиков
 */
@Canonical
class AxisCurrentData extends DiagramNowData
{
    /**
     * Тип агрегации показателя
     */
    Aggregation aggregation
    /**
     * Фильтрация источника
     */
    String descriptor
    /**
     * Группировка параметра
     */
    Group group
    /**
     * Источник данных
     */
    SourceValue source
    /**
     * Параметр
     */
    Attribute  xAxis
    /**
     * Показатель
     */
    BaseAttribute yAxis
    /**
     * Тип отображения датасета (для комбо-графиков)
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    ComboType type

    @JsonInclude(JsonInclude.Include.NON_NULL)
    String yAxisName

    static AxisCurrentData fromMap(Map fields)
    {
        return fields ?
            new AxisCurrentData(aggregation: fields.aggregation as Aggregation,
                                breakdownGroup:fields.breakdownGroup as Group,
                                breakdown: fields.breakdown as Collection<BaseBreakdown>,
                                descriptor: fields.descriptor,
                                showEmptyData: fields.showEmptyData,
                                showBlankData: fields.showBlankData,
                                sourceForCompute: fields.sourceForCompute,
                                dataKey: fields.dataKey,
                                top: fields.top as Top,
                                group: fields.group as Group,
                                source: fields.source as SourceValue,
                                xAxis: fields.xAxis as Attribute,
                                yAxis: fields.yAxis as BaseAttribute,
                                yAxisName: fields.yAxisName,
                                type: fields.type as ComboType)
            : null
    }
}

/**
 * Класс, описывающий общие поля для диаграмм нового формата
 */
@Canonical
class DiagramNewData extends DiagramNowData
{
    /**
     * Коллекции показателей
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    Collection<NewIndicator> indicators
    /**
     * Коллекции параметров
     */
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    Collection<NewParameter> parameters
    /**
     * Источник данных нового формата
     */
    NewSourceValue source

    /**
     * Название параметра (для осевых графиков
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String xAxisName
    /**
     * Название показателя для осевых графиков
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String yAxisName

    @JsonInclude(JsonInclude.Include.NON_NULL)
    ComboType type

    static DiagramNewData fromMap(Map fields)
    {
        return fields ?
            new DiagramNewData(
                breakdown: fields.breakdown as Collection<BaseBreakdown>,
                indicators: fields.indicators as Collection<NewIndicator>,
                parameters: fields.parameters as Collection<NewParameter>,
                source: fields.source as NewSourceValue,
                dataKey: fields.dataKey,
                showEmptyData: fields.showEmptyData,
                showBlankData: fields.showBlankData,
                sourceForCompute: fields.sourceForCompute,
                xAxisName: fields.xAxisName,
                yAxisName: fields.yAxisName,
                type : fields.type as ComboType,
                top: fields.top as Top
            )
            : null
    }
}

/**
 * Класс, описывающий текущие данные для построения таблицы
 */
class TableCurrentData extends DiagramNowData
{
    /**
     * Коллекция показателей
     */
    Collection<NewIndicator> indicators
    /**
     * Коллекция параметров
     */
    Collection<NewParameter> parameters
    /**
     * Источник старого формата
     */
    SourceValue source
    /**
     * Фильтрация источника
     */
    String descriptor

    static TableCurrentData fromMap(Map fields)
    {
        return fields ?
            new TableCurrentData(
                dataKey: fields.dataKey,
                top: fields.top as Top,
                breakdown: fields.breakdown as Collection<BaseBreakdown>,
                breakdownGroup: fields.breakdownGroup as Group,
                indicators: fields.indicators as Collection<NewIndicator>,
                parameters: fields.parameters as Collection<NewParameter>,
                descriptor: fields.descriptor,
                sourceForCompute: fields.sourceForCompute,
                source: fields.source as SourceValue)
            : null
    }
}

/**
 * Класс, описывающий данные для построения круговых диаграмм и диаграмм для подсчёта
 */
@Canonical
class CircleAndSummaryCurrentData extends DiagramNowData
{
    /**
     * Тип агрегации
     */
    Aggregation aggregation
    /**
     * Источник данных старого формата
     */
    SourceValue source
    /**
     * Фильтрация источника
     */
    String descriptor
    /**
     * Группировка разбивки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    /**
     * Класс, описывающий общие поля для диаграмм нового формата
     */
    Group breakdownGroup
    /**
     * Показатель
     */
    BaseAttribute indicator

    static fromMap(Map fields)
    {
        return fields ?
            new CircleAndSummaryCurrentData(
                aggregation: fields.aggregation as Aggregation,
                breakdown: fields.breakdown as Collection<BaseBreakdown>,
                breakdownGroup: fields.breakdownGroup as Group,
                dataKey: fields.dataKey,
                descriptor: fields.descriptor,
                source: fields.source as SourceValue,
                showEmptyData: fields.showEmptyData,
                showBlankData: fields.showBlankData,
                sourceForCompute: fields.sourceForCompute,
                indicator: fields.indicator as BaseAttribute,
                top: fields.top as Top)
            : null
    }
}

/**
 * Класс, описывающий данные для построения таблицы прошлого формата
 */
@Canonical
class TablePrevData extends DiagramNowData
{
    /**
     * Тип агрегации
     */
    Aggregation aggregation
    /**
     * Группировка для разбивки
     */
    Group breakdownGroup
    /**
     * Флаг на подсчет в колонках
     */
    Boolean calcTotalColumn
    /**
     * Показатель
     */
    BaseAttribute column
    /**
     * Группировка для параметра
     */
    Group group
    /**
     * Параметр
     */
    Attribute row
    /**
     * Флаг на данные только для вычисления
     */
    Boolean sourceForCompute
    /**
     * Источник старого формата
     */
    SourceValue source

    static TablePrevData fromMap(Map fields)
    {
        return fields ?
            new TablePrevData(
                aggregation:  fields.aggregation as Aggregation,
                breakdown: fields.breakdown as Collection<BaseBreakdown>, // <- Разбивка только у первого источника
                breakdownGroup: fields.breakdownGroup as Group,
                calcTotalColumn: fields.calcTotalColumn,
                column: fields.column as BaseAttribute,
                group: fields.group as Group,
                row: Attribute.fromMap(fields.row),
                sourceForCompute: fields.sourceForCompute,
                source: fields.source as Source
            )
            : null
    }
}

/**
 * Класс, описывающий круговые диаграммы старого формата
 * @deprecated использовать {@link CircleCurrentAndNew} вместо него
 */
@Deprecated
class CircleZero extends OldDiagrams
{
    /**
     * Тип агрегации
     */
    Aggregation aggregation
    /**
     * Разбивка
     */
    Attribute breakdown
    /**
     * Группировка разбивки
     */
    Group breakdownGroup
    /**
     * Фильтрация источника
     */
    String descriptor
    /**
     * Источник данных старого формата
     */
    SourceValue source
    /**
     * Показатель
     */
    BaseAttribute indicator

    static CircleZero fromMap(Map fields)
    {
        return fields ?
            new CircleZero(
                colorsSettings: fields.colorsSettings as ColorsSettings,
                aggregation: fields.aggregation as Aggregation,
                breakdown: fields.breakdown as Collection<BaseBreakdown>,
                breakdownGroup: fields.breakdownGroup as Group,
                descriptor: fields.descriptor,
                source: fields.source as SourceValue,
                sourceForCompute: fields.sourceForCompute,
                indicator: fields.indicator as Attribute,
                name: fields.name,
                diagramName: fields.diagramName,
                id: fields.id,
                showValue: fields.showValue,
                showName: fields.showName,
                showLegend: fields.showLegend,
                legendPosition: fields.legendPosition as LegendPosition,
                type: fields.type,
                diagramType: fields.diagramType)
            : null
    }
}

/**
 * Класс, описывающий круговые диаграммы прошлого формата
 */
class CirclePrev extends DiagramsPrev
{
    static CirclePrev fromMap(Map fields)
    {
        return fields ?
            new CirclePrev(
                colorsSettings: fields.colorsSettings as ColorsSettings,
                computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
                name: fields.name,
                diagramName: fields.diagramName,
                id: fields.id,
                showValue: fields.showValue,
                showName: fields.showName,
                showLegend: fields.showLegend,
                legendPosition:fields.legendPosition,
                order: fields.order,
                data: fields.data as Collection<DiagramNowData>,
                type: fields.type as DiagramType,
                diagramType: fields.diagramType
            ) : null
    }
}

/**
 * Класс, описывающий круговые диаграммы текущего формата
 */
class CircleCurrentAndNew extends NewDiagrams
{
    /**
     * Коллекция данных на построение
     */
    Collection<DiagramNowData> data

    static CircleCurrentAndNew fromMap(fields)
    {
        return fields ?
            new CircleCurrentAndNew(
                colorsSettings: fields.colorsSettings as ColorsSettings,
                computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
                dataLabels: fields.dataLabels as DataLabels,
                displayMode: fields.displayMode as DisplayMode,
                header: fields.header as Header,
                name: fields.name,
                id: fields.id,
                data: fields.data as Collection<DiagramNowData>,
                navigation: (fields.navigation as Navigation) ?: new Navigation(),
                legend: fields.legend as Legend,
                sorting: fields.sorting as Sorting,
                templateName: fields.templateName,
                type: fields.type,
                diagramType: fields.diagramType)
            : null
    }
}

/**
 * Данные о границах на шкале
 */
class Borders
{
    /**
     * Максимальное значение
     */
    String max
    /**
     * Минимальное значение
     */
    String min
}

/**
 * Показатель на виджете типа спидометр
 */
class SpeedometerIndicator
{
    /**
     * Цвет текста
     */
    String fontColor = '#323232'
    /**
     * Шрифт
     */
    String fontFamily = defaultFontFamily
    /**
     * Размер шрифта
     */
    def fontSize = autoSize
    /**
     * Стиль шрифта
     */
    String fontStyle = fontStyle
    /**
     * Флаг на отображение
     */
    Boolean show = true
}

/**
 * Данные о диапазонах
 */
class RangesData
{
    /**
     * Цвет диапазона
     */
    String color
    /**
     * Начало диапазона
     */
    def from
    /**
     * Конец диапазона
     */
    def to
}

/**
 * Данные о диапазонах
 */
class Ranges
{
    /**
     * Коллекция данных о диапазонах
     */
    Collection<RangesData> data
    /**
     * Тип диапазона
     */
    RangesType type
    /**
     * Флаг на использование
     */
    Boolean use
}

/**
 * Класс, описывающий диаграммы типа спидометр на построение
 */
class SpeedometerCurrentAndNew extends Widget
{
    /**
     * Данные о границах на шкале
     */
    Borders borders
    /**
     * Коллекция атрибутов для вычисления
     */
    Collection<ComputedAttr> computedAttrs
    /**
     * Данные о показателе
     */
    SpeedometerIndicator indicator
    /**
     * Данные на построение
     */
    Collection<DiagramNowData> data
    /**
     * Тип отображения на экране
     */
    DisplayMode displayMode
    /**
     * Заголовок
     */
    Header header
    /**
     * Настройки навигации
     */
    Navigation navigation
    /**
     * Данные о диапазонах
     */
    Ranges ranges
    /**
     * Шаблон-название
     */
    String templateName

    static fromMap(Map fields)
    {
        return fields ?
            new SpeedometerCurrentAndNew(
                borders: fields.borders as Borders ,
                computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
                name: fields.name,
                id: fields.id,
                indicator: fields.indicator as SpeedometerIndicator ,
                data: fields.data as Collection<DiagramNowData>,
                displayMode: fields.displayMode as DisplayMode,
                header: fields.header as Header,
                navigation: (fields.navigation as Navigation) ?: new Navigation(),
                ranges: fields.ranges as Ranges,
                templateName: fields.templateName,
                type: fields.type as DiagramType,
                diagramType: fields.diagramType
            )
            :null

    }
}

/**
 * Класс, описывающий диаграммы-сводки старого формата
 * @deprecated использовать {@link SummaryCurrentAndNew} вместо него
 */
@Deprecated
class SummaryZero extends Widget
{
    /**
     * Тип агрегации
     */
    Aggregation aggregation
    /**
     * Фильтрация источника
     */
    String descriptor
    /**
     * Источник старого формата
     */
    SourceValue source
    /**
     * Флаг на использование источника для вычислений
     */
    Boolean sourceForCompute
    /**
     * Показатель
     */
    BaseAttribute indicator

    static SummaryZero fromMap(Map fields)
    {
        return fields ?
            new SummaryZero(
                name: fields.name,
                id: fields.id,
                aggregation: fields.aggregation as Aggregation,
                descriptor: fields.descriptor,
                source: fields.source as SourceValue,
                sourceForCompute: fields.sourceForCompute,
                indicator: fields.indicator,
                type: fields.type,
                diagramType: fields.diagramType
            )
            : null
    }
}

/**
 * Класс, описывающий диаграммы-сводки предыдущего формата
 */
class SummaryPrev extends DiagramsPrev
{
    static SummaryPrev fromMap(Map fields)
    {
        return fields ?
            new SummaryPrev(
                computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
                name: fields.name,
                data: fields.data as Collection<DiagramNowData>,
                id: fields.id,
                order: fields.order,
                type: fields.type,
                diagramType: fields.diagramType
            )
            : null
    }
}

/**
 * Класс, описывающий диаграммы-сводки текущего формата
 */
class SummaryCurrentAndNew extends NewDiagrams
{
    /**
     * Информация о показателе
     */
    SpeedometerIndicator indicator
    /**
     * Коллекиця данных на построение
     */
    Collection<DiagramNowData> data

    static SummaryCurrentAndNew fromMap(Map fields)
    {
        return fields ?
            new SummaryCurrentAndNew(
                computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
                displayMode: fields.displayMode as DisplayMode,
                header: fields.header as Header,
                name: fields.name,
                id: fields.id,
                indicator: fields.indicator as SpeedometerIndicator,
                data: fields.data as Collection<DiagramNowData>,
                navigation: (fields.navigation as Navigation) ?: new Navigation(),
                templateName: fields.templateName,
                type: fields.type as DiagramType,
                diagramType: fields.diagramType
            )
            :null
    }
}

/**
 * Класс, описывающий диаграммы-таблицы предыдущего, текущего и нового формата
 */
class TablePrevAndCurrentAndNew extends NewDiagrams
{
    /**
     * Флаг на подсчёт в колонках
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Boolean calcTotalColumn
    /**
     * Коллекция данных на построение
     */
    Collection<DiagramNowData> data
    /**
     * Флаг на использование пустых значений
     */
    Boolean showEmptyData

    /**
     * Флаг на использование незаполненных значений
     */
    Boolean showBlankData
    /**
     * Настройки ширины колонок
     */
    def columnsRatioWidth = {}
    /**
     * Внутренности таблицы для фронта
     */
    TableObject table = new TableObject()
    /**
     * Флаг на отображение номера строки
     */
    Boolean showRowNum = false
    /**
     * Настройка топ х
     */
    Top top
    /**
     * Настройка игнорирования ограничений
     */
    IgnoreLimits ignoreLimits = new IgnoreLimits()

    static TablePrevAndCurrentAndNew fromMap(Map fields)
    {
        return fields ?
            new TablePrevAndCurrentAndNew(
                computedAttrs: fields.computedAttrs as Collection<ComputedAttr>,
                calcTotalColumn: fields.calcTotalColumn,
                showRowNum: fields.showRowNum,
                diagramName: fields.diagramName,
                navigation: (fields.navigation as Navigation) ?: new Navigation(),
                templateName: fields.templateName,
                name: fields.name,
                id: fields.id,
                displayMode: fields.displayMode as DisplayMode,
                header: fields.header as Header,
                columnsRatioWidth: fields.columnsRatioWidth,
                showEmptyData: fields.showEmptyData,
                showBlankData: fields.showBlankData,
                sorting: fields.sorting as Sorting,
                table: fields.table as TableObject,
                data: fields.data as Collection<DiagramNowData> ,
                top: fields.top as Top,
                ignoreLimits: fields.ignoreLimits as IgnoreLimits,
                type: fields.type as DiagramType,
                diagramType: fields.diagramType
            ) : null
    }
}

/**
 * Класс, описывающий настройку игнорирования ограничений датасета
 */
class IgnoreLimits
{
    /**
     * Флаг на игнорирование ограничений по параметру
     */
    Boolean parameter = false
    /**
     * Флаг на игнорирование ограничений по разбивке
     */
    Boolean breakdown = false
}

/**
 * Класс, описывающий виджет типа текст
 */
class Text extends Widget
{
    /**
     * Формат отображения на экране
     */
    DisplayMode displayMode
    /**
     * Текст в виджете
     */
    String text
    /**
     * Настройки текста
     */
    TextSettings textSettings
    /**
     * Тип диаграммы
     */
    DiagramType type
    /**
     * Переменные для текста виджета
     */
    Map<String, Object> variables

    static Text fromMap(Map fields)
    {
        return fields
            ? new Text( displayMode: fields.displayMode as DisplayMode,
                        text: fields.text,
                        textSettings: TextSettings.fromMap(fields.textSettings),
                        type: fields.type as DiagramType,
                        variables: fields.variables as Map<String, Object>)
            :null
    }
}

/**
 * Настройки текста для текствого виджета
 */
class TextSettings
{
    /**
     * Контент (лучше не трогать, нужно фронту)
     */
    def content
    /**
     * Стилевой словарь (нужно фронту)
     */
    Map<String, Object> styleMap
    /**
     * Расположение текста
     */
    TextAlign textAlign

    static TextSettings fromMap(Map fields)
    {
        return fields
            ? new TextSettings(fields)
            : null
    }
}

/**
 * Настройки цвета для параметра
 */
class ChartColorSettings
{
    /**
     * Цвет
     */
    String color
    /**
     * Ключ параметра
     */
    String key

    static ChartColorSettings fromMap(Map fields)
    {
        return fields ?
            new ChartColorSettings(fields)
            : null
    }

    static Collection<ChartColorSettings> fromColorCollection(Collection colorMapCollection)
    {
        return colorMapCollection
            ? colorMapCollection.findResults { return fromMap(it) } : []
    }
}

/**
 * Данные настроек цвета для параметра
 */
class CustomChartSettingsData
{
    /**
     * Коллекция настроек цвета для параметра
     */
    Collection<ChartColorSettings> colors
    /**
     * Ключ для настроек
     */
    String key
    /**
     * Тип данных, для которых предназначены настройки
     */
    CustomLabelType type
    /**
     * Код цвета по умолчанию
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String defaultColor

    static CustomChartSettingsData fromMap(Map fields)
    {
        return fields ?
            new CustomChartSettingsData(colors: ChartColorSettings.fromColorCollection(fields.colors),
                                        key: fields.key,
                                        type: fields.type as CustomLabelType,
                                        defaultColor: fields.defaultColor)
            :null
    }
}

/**
 * Класс по преобразования json-строки в объект класса
 */
class ColorsSettingsDeserializer extends StdDeserializer
{
    ColorsSettingsDeserializer() {
        this(null);
    }

    ColorsSettingsDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    ColorsSettings deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        def obj = mapper.readTree(jp)

        if(obj.fieldNames().toList().any { it == 'auto'})
        {
            Map<String, Object> fields = mapper.convertValue(obj, Map)
            return ColorsSettings.fromMap(fields)
        }
        else
        {
            //если настройки пришли старого формата, переделываем их в объект нового
            return new ColorsSettings(auto: new AutoColors(colors: obj?.elements()*.textValue()), type: ColorType.AUTO, custom: new CustomColors())
        }
    }
}

/**
 * Данные настроек цвета для параметра
 */
@JsonDeserialize(using = ColorsSettingsDeserializer)
class ColorsSettings
{
    /**
     * Данные автоматических настроек цвета
     */
    AutoColors auto
    /**
     * Данные пользовательских цвета
     */
    CustomColors custom
    /**
     * Тип цвета для применения
     */
    ColorType type

    static ColorsSettings fromMap(Map fields)
    {
        return fields ? new ColorsSettings(auto: AutoColors.fromMap(fields.auto),
                                           custom: fields.custom ? CustomColors.fromMap(fields.custom) : new CustomColors(),
                                           type: fields.type as ColorType) : null
    }
}

/**
 * Автоматические настройки цвета
 */
class AutoColors
{
    /**
     * Список цветов
     */
    Collection<String> colors

    static AutoColors fromMap(Map fields)
    {
        return fields ? new AutoColors(colors: fields.colors) : null
    }
}

/**
 * Пользовательские настройки цвета
 */
class CustomColors
{
    /**
     * данные о настройках
     */
    CustomChartSettingsData data
    /**
     * флаг на использование во всем дашборде
     */
    Boolean useGlobal = false

    static CustomColors fromMap(Map fields)
    {
        return fields ?
            new CustomColors(data: CustomChartSettingsData.fromMap(fields.data),
                             useGlobal: fields.useGlobal)
            : null
    }
}
//endregion
return