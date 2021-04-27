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
import com.fasterxml.jackson.annotation.JsonCreator
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
import com.fasterxml.jackson.databind.module.SimpleModule
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
import static DeserializationHelper.mapper
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
    MINUTE,
    SECOND

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
     * Неймспейс для хранения источников
     */
    static final String SOURCE_NAMESPACE = 'sources'

    /**
     * Метод получения минимальной даты из Бд
     * @param code - код атрибута
     * @param classFqn - класс источника
     * @param descriptor - фильтр для источника
     * @return минимальная дата по данному атрибуту
     */
    static Date getMinDate(String code, String classFqn, String descriptor = '')
    {
        def res
        if(descriptor)
        {
            def sc = getApi().selectClause
            def apiDescr = getApi().listdata.createListDescriptor(descriptor)
            def dateCriteria = getApi().listdata.createCriteria(apiDescr)
                                       .addColumn(sc.min(sc.property(code)))
            res = getApi().db.query(dateCriteria).list().head()
        }
        res = getApi().db.query("select min(${code}) from ${classFqn}").list().head()
        return res instanceof Long ? new Date(res) : res as Date
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

        if(widgetCurrentClazz == Text)
        {
            return oldFormatWidget
        }
        Boolean diagramTypeHasNoDataField = widgetCurrentClazz in [AxisZero, SummaryZero, CircleZero]
        def oldDataFormat = diagramTypeHasNoDataField ? null : oldFormatWidget.data.head()?.getClass()
        Boolean calcTotalColumn
        if(widgetCurrentClazz == TablePrevAndCurrentAndNew)
        {
            calcTotalColumn = oldFormatWidget.calcTotalColumn
        }
        if (oldDataFormat == TablePrevData)
        {
            calcTotalColumn =oldFormatWidget.data.head().calcTotalColumn
        }

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

    /**
     * Метод получения формата обработки даты по той, что пришла с фронта
     * @param date - дата строкой
     * @return формат для преобразования строки в дату
     */
    static String getDateFormatByDate(String date)
    {
        if(date.contains('-'))
        {
            return 'yyyy-MM-dd' //старый формат данных
        }
        else if (date.contains(':'))
        {
            return 'dd.MM.yy HH:mm' //для атрибутов типа дата/время
        }
        else if(date.contains('.'))
        {
            return 'dd.MM.yy'
        }
        else
        {
            throw new IllegalArgumentException('Неправильная дата!')
        }
    }

    /**
     * Метод по получению настроек для фильтров для источника из хранилища
     * @param queryFilters - возможные фильтры на получаемые данные
     * @return список фильтров для источника из хранилища
     */
    static Collection<SourceFilter> getSourceFiltersFromStorage(Collection<Map> queryFilters = [])
    {
        return getApi().keyValue.find(SOURCE_NAMESPACE, '') { key, value -> true }?.values()?.findResults {
            def filter = Jackson.fromJsonString(it, SourceFilter)
            if(queryFilters)
            {
                Boolean correctObject = queryFilters.every {
                    filter[it.key] == it.value
                }
                filter = correctObject ? filter : null
            }
            return filter
        }
    }
}

//region КЛАССЫ
/**
 * Класс, определяющий десериализаторы на основе предикторов для различных классов
 * @param <T> - класс, для которого будет использована десериализация
 */
class PredictorBasedPolymorphicDeserializer<T> extends StdDeserializer<T>
{
    Map<Class, Closure<Boolean>> predictors = [:]

    PredictorBasedPolymorphicDeserializer()
    {
        this(null)
    }

    PredictorBasedPolymorphicDeserializer(Class<?> vc)
    {
        super(vc)
    }

    @Override
    T deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException
    {
        ObjectMapper mapper = (ObjectMapper) jp.getCodec()
        def object = mapper.readTree(jp)

        def clazz = predictors.find { clazz, predictor -> predictor(object)}?.key

        return (T) jp.codec.treeToValue(object, clazz)
    }
}

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

    /**
     * Метод, возвращающий тип атрибута
     * @param attr - атрибут
     * @return тип атрибута
     */
    static String getAttributeType(Attribute attr)
    {
        return attr?.attrChains()?.last()?.type
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

    /**
     * словарь отличительных особенностей виджетов
     */
    static final Map<Class, Closure<Boolean>> widgetPredictors = [
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

    static final Map<Class, Closure<Boolean>> diagramNowDataPredictors = [
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
        (TablePrevData) : { value ->
            return use(JacksonUtils) {
                value.hasField('row') && value.hasField('descriptor')
            }
        }
    ]
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
 * Класс, в котором зарегестрированы все десериализаторы для objectMapper-а
 */
class DeserializationHelper
{
    /**
     * поле, определяющее маппер для десериализации
     */
    private static final ObjectMapper mapper

    static {
        mapper = new ObjectMapper()
        SimpleModule module = new SimpleModule()

        def baseAttributeDeserializer = new PredictorBasedPolymorphicDeserializer()
        baseAttributeDeserializer.predictors = [
            (Attribute) : { value ->
                return use(JacksonUtils) {
                    value.hasField('metaClassFqn')
                }
            },
            (ComputedAttr) : { value ->
                return use(JacksonUtils) {
                    value.hasField('computeData')
                }
            }
        ]
        module.addDeserializer(BaseAttribute, baseAttributeDeserializer)

        def baseBreakdowndeserializer = new PredictorBasedPolymorphicDeserializer()
        baseBreakdowndeserializer.predictors = [
            (BaseBreakdown) : { 'code' in it.fields.keySet() },
            (NewBreakdown) : { 'attribute' in fields.keySet() || 'value' in fields.keySet() }
        ]
        module.addDeserializer(BaseBreakdown, baseBreakdowndeserializer)

        def groupDeserializer = new PredictorBasedPolymorphicDeserializer()
        groupDeserializer.predictors = [
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
        module.addDeserializer(Group, groupDeserializer)

        def widgetBaseDeserializer = new PredictorBasedPolymorphicDeserializer()
        widgetBaseDeserializer.predictors = widgetPredictors
        module.addDeserializer(Widget, widgetBaseDeserializer)

        def widgetDataDeserializer = new PredictorBasedPolymorphicDeserializer()
        widgetDataDeserializer.predictors = diagramNowDataPredictors
        module.addDeserializer(DiagramNowData, widgetDataDeserializer)

        mapper.registerModule(module)
    }
}

/**
 * Класс, описывающий настройки дашборда
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
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

    @JsonCreator
    static DashboardSettingsClass create(String json) {
        return mapper.readValue(json, DashboardSettingsClass)
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
 * Класс атрибута, содержащего агрегацию
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
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

    @JsonCreator
    static BaseAttribute create(String json) {
        return mapper.readValue(json, BaseAttribute)
    }
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

    /**
     * Ключ глобального фильтра
     */
    String filterId

    /**
     * Метод по формированию источника виджета, если для него используется сохраненный источник
     * @param source - источник виджета
     * @return сформированный с сохраненным источником источник виджета
     */
    static mappingSource(NewSourceValue source)
    {
        if(source)
        {
            if(source.filterId)
            {
                def storageFilter = DashboardUtils.getSourceFiltersFromStorage([[key: 'id', value: source.filterId]]).find()
                source.descriptor = storageFilter
            }
        }
        return source
    }
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
class NewBreakdown extends BaseBreakdown implements IHasGroup
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
}

/**
 * Базовая разбивка
 * @deprecated использовать {@link NewBreakdown} вместо него
 */
@Deprecated
@JsonIgnoreProperties(ignoreUnknown = true)
class BaseBreakdown extends Attribute
{
    //разбивка содержала лишь атрибут, поэтому класс лишь наследует класс Attribute
    @JsonCreator
    static BaseBreakdown create(String json) {
        return mapper.readValue(json, BaseBreakdown)
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
class NewParameter implements IHasGroup
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
 * Интерфейс, описывающий взаимодействие с группами в параметрах/разбивках
 */
interface  IHasGroup
{
    Group getGroup()
}

/**
 * Класс группировки для параметра/разбивки
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
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
     * Метод по проверке и преобразованию json-а
     * (если пришла очень старая группа, она представляла собой
     * лишь тип группировки строкой)
     * @param json - json группировки
     * @return либо старая группировка, преобразованная к новой системной,
     * либо null, чтобы преобразовать json в системную или кастомную группировку
     */
    static Group checkAndUpdateJson(def json)
    {
        if(json instanceof TextNode || json instanceof String)
        {
            return new SystemGroupInfo(data: json, way: Way.SYSTEM)
        }
        else return null
    }

    @JsonCreator
    static Group create(String json) {
        return checkAndUpdateJson(json) ?: mapper.readValue(json, Group)
    }

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

    /**
     * Предел максимума
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Integer max
    /**
     * Предел минимума
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Integer min
    /**
     * Флаг на отображение датасетов зависимо
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
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
 * Класс кастомной группировки дашбора
 */
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

    @JsonCreator
    static CustomGroup create(String json) {
        return mapper.readValue(json, CustomGroup)
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
    Collection<Collection<SubGroupData>> data = []
    /**
     * Название внутренней группы
     */
    String name
    /**
     * Индекс подгруппы
     */
    String id = UUID.randomUUID()
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
}

/**
 * Класс нулевого формата осевых графиков
 * @deprecated использовать {@link AxisCurrentAndNew} вместо него
 */
@JsonIgnoreProperties(ignoreUnknown = true)
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
@JsonIgnoreProperties(ignoreUnknown = true)
class AxisPrev extends DiagramsPrev{ }

/**
 * Класс общих настроек для всех виджетов
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
abstract class Widget
{
    /**
     * Коллекция цветов диаграммы
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
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
     * Метод по преобразованию json-а в правильный формат, который точно скушает creator
     * @param json - json виджета
     * @return json виджета правильного формата
     */
    static String updateJsonToCorrectFormat(String json)
    {
        ObjectNode obj = (ObjectNode) mapper.readTree(json)
        String widgetId = obj.path('id').asText()
        Class clazz = widgetPredictors.find{clazz, predictor -> predictor(obj)}.key
        if(!clazz)
        {
            throw new IllegalArgumentException(Widget, "проверьте тип виджета ${widgetId}!")
        }
        obj.put('diagramType', clazz.simpleName)

        Map<String, Object> fields = mapper.convertValue(obj, Map)
        if(clazz == Text)
        {
            return Jackson.toJsonString(fields)
        }
        if(clazz in [AxisPrev, CirclePrev, SummaryPrev])
        {
            fields = updatePrevTypes(fields)
        }

        //прошлый формат придет в поле colors
        String colorField = 'colors'
        if('colorsSettings' in fields.keySet().toList())
        {
            colorField = 'colorsSettings'
        }
        //заменим его на новый
        if(fields[colorField] && colorField == 'colors')
        {
            fields.colorsSettings = new ColorsSettings(auto: new AutoColors(colors: fields[colorField]), type: ColorType.AUTO, custom: new CustomColors())
        }

        return Jackson.toJsonString(fields)
    }

    /**
     * Метод по преобразованию json-а из хранилища в объект определенного класса виджета
     * @param json - json из хранилища
     * @return объект определенного класса виджета
     */
    @JsonCreator
    static Widget create(def json) {
        if(json instanceof Map)
        {
            json = Jackson.toJsonString(json)
        }
        json = updateJsonToCorrectFormat(json)
        return mapper.readValue(json, Widget)
    }
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
 * Класс, описывающий формат для текущих и новых осевых диаграмм
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
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
}


/**
 * Класс, описывающий общие поля текущих данных на построение
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
abstract class DiagramNowData
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

    @JsonCreator
    static DiagramNowData create(def json)
    {
        json = updateJsonToCorrectFormat(json)
        return mapper.readValue(json, DiagramNowData)
    }

    /**
     * Метод по преобразованию json-а в правильный формат, который точно скушает creator
     * @param json - json поля data виджета
     * @return json поля data виджета правильного формата
     */
    static String updateJsonToCorrectFormat(def json)
    {
        ObjectNode obj = (ObjectNode) mapper.valueToTree(json)
        Class clazz = diagramNowDataPredictors.find{clazz, predictor -> predictor(obj)}?.key
        Map<String, Object> fields = mapper.convertValue(obj, Map)

        fields.breakdown = fields.breakdown instanceof Collection
            ? fields.breakdown
            : fields.breakdown ? [fields.breakdown] : null
        if(!clazz)
        {
            throw new IllegalAccessException(DiagramNowData, "проверьте входные данные в поле data!")
        }
        return Jackson.toJsonString(fields)
    }
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
}

/**
 * Класс, описывающий текущие данные для построения таблицы
 */
@Canonical
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
}

/**
 * Класс, описывающий данные для построения таблицы прошлого формата
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
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
}

/**
 * Класс, описывающий круговые диаграммы старого формата
 * @deprecated использовать {@link CircleCurrentAndNew} вместо него
 */
@Canonical
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
}

/**
 * Класс, описывающий круговые диаграммы прошлого формата
 */
@Canonical
class CirclePrev extends DiagramsPrev { }

/**
 * Класс, описывающий круговые диаграммы текущего формата
 */
@Canonical
class CircleCurrentAndNew extends NewDiagrams
{
    /**
     * Коллекция данных на построение
     */
    Collection<DiagramNowData> data
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
@Canonical
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
}

/**
 * Класс, описывающий диаграммы-сводки старого формата
 * @deprecated использовать {@link SummaryCurrentAndNew} вместо него
 */
@Canonical
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
}

/**
 * Класс, описывающий диаграммы-сводки предыдущего формата
 */
@Canonical
class SummaryPrev extends DiagramsPrev { }

/**
 * Класс, описывающий диаграммы-сводки текущего формата
 */
@Canonical
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
}

/**
 * Класс, описывающий диаграммы-таблицы предыдущего, текущего и нового формата
 */
@Canonical
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
@Canonical
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
}

/**
 * Настройки текста для текствого виджета
 */
@Canonical
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
}

/**
 * Настройки цвета для параметра
 */
@Canonical
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

}

/**
 * Данные настроек цвета для параметра
 */
@Canonical
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
}

/**
 * Данные настроек цвета для параметра
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class ColorsSettings
{
    /**
     * Данные автоматических настроек цвета
     */
    AutoColors auto
    /**
     * Данные пользовательских цвета
     */
    CustomColors custom = new CustomColors()
    /**
     * Тип цвета для применения
     */
    ColorType type

    @JsonCreator
    static ColorsSettings create(String json) {
        return mapper.readValue(json, ColorsSettings)
    }
}

/**
 * Автоматические настройки цвета
 */
@Canonical
class AutoColors
{
    /**
     * Список цветов
     */
    Collection<String> colors
}

/**
 * Пользовательские настройки цвета
 */
@Canonical
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

}

/**
 * Объект, описывающий фильтр источника
 */
class SourceFilter extends ValueWithLabel<String>
{
    /**
     * Настройки фильтра
     */
    String descriptor
    /**
     * Уникальный индентификатор
     */
    String id
}
//endregion
return