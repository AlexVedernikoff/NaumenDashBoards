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
import ru.naumen.core.shared.dto.ISDtObject
import ru.naumen.core.server.script.api.metainfo.IMetaClassWrapper
import java.util.concurrent.TimeUnit
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
import groovy.transform.InheritConstructors
import groovy.transform.PackageScope
import groovy.transform.TupleConstructor
import groovy.transform.Canonical
import static groovy.json.JsonOutput.toJson
import static DeserializationHelper.mapper
import java.lang.reflect.Method
import org.apache.commons.lang3.exception.ExceptionUtils
import org.apache.http.entity.ContentType
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import ru.naumen.core.shared.IUUIDIdentifiable
import groovy.json.JsonSlurper
import javax.transaction.Transaction
import java.util.stream.Stream
import static org.springframework.web.context.request.RequestContextHolder.getRequestAttributes
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
    TEXT,
    PIVOT_TABLE

    static List<DiagramType> StandardTypes = [COLUMN, COLUMN_STACKED, LINE, BAR, BAR_STACKED]
    static List<DiagramType> RoundTypes = [DONUT, PIE]
    static List<DiagramType> CountTypes = [SUMMARY, SPEEDOMETER]
    static List<DiagramType> NullableTypes = [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE, COMBO, DONUT, PIE]
    static List<DiagramType> SortableTypes = [*StandardTypes, *RoundTypes, COMBO]
    static List<DiagramType> CountableTypes = [*StandardTypes, *RoundTypes, COMBO]
}

/**
 * Типы датасетов
 */
enum DataSetType
{
    AXIS_DATA_SET,
    CIRCLE_DATA_SET,
    COMBO_DATA_SET,
    SUMMARY_DATA_SET,
    SPEEDOMETER_DATA_SET,
    TABLE_DATA_SET,
    PIVOT_DATA_SET
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
    PERCENT_CNT('PERCENT_CNT'),
    PERCENT_CNT_BY_COMMON('PERCENT_CNT_BY_COMMON'),
    PERCENT_CNT_BY_PARAMETERS('PERCENT_CNT_BY_PARAMETERS'),
    SUM('SUM(%s)'),
    AVG('AVG(%s)'),
    MAX('MAX(%s)'),
    MIN('MIN(%s)'),
    MDN('%s'), //TODO: Тут должна была быть медиана.
    NOT_APPLICABLE('')

    static final Collection<String> PERCENT_CNT_TYPES = [PERCENT_CNT,  PERCENT_CNT_BY_COMMON, PERCENT_CNT_BY_PARAMETERS]

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
    NOT_BETWEEN,
    IN,
    CONTAINS,
    TODAY,
    LAST_N_DAYS,
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
 * Позиция числа
 */
enum NumberPosition
{
    LEGEND,
    CURVE
}

/**
 * Тип объекта для изменения формата
 */
enum FormatType
{
    LABEL_FORMAT,
    NUMBER_FORMAT,
    INTEGER_FORMAT,
    DT_INTERVAL_FORMAT
}

/**
 * Типы форматов для параметров
 */
enum LabelFormatType
{
    TITLE,
    TITLE_CODE,
    CODE
}

/**
 * Типы форматов для нотаций
 */
enum NotationType
{
    THOUSAND,
    MILLION,
    BILLION,
    TRILLION
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
    LINE,
    PivotDataSet
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

enum FontStyle
{
    BOLD,
    ITALIC,
    UNDERLINE
}
/**
 * Тип дашборда
 */
enum DashboardType
{
    BASE,
    USER,
    VIEW
}

/**
 * Тип значения у атрибута типа "счетчик"
 */
enum TimerValue
{
    STATUS,
    VALUE
}

/**
 * Типы округлений для счетчиков
 */
enum TIMER_ROUND_TYPE
{
    NO_ROUND,
    ROUND_CEIL_BY_SECONDS,
    ROUND_FLOOR_BY_SECONDS,
    ROUND_CEIL_BY_MINUTES,
    ROUND_FLOOR_BY_MINUTES
}

/**
 * Типы условий пользовательских группировок
 */
enum Condition
{
    STATUS_CONTAINS('status_contains'),
    STATUS_NOT_CONTAINS('status_not_contains'),
    EXPIRATION_CONTAINS('expiration_contains'),
    EXPIRES_BETWEEN('expires_between'),
    LESS('less'),
    GREATER('greater'),
    EQUAL('equal'),
    NOT_EQUAL('not_equal'),
    EMPTY('empty'),
    NOT_EMPTY('not_empty'),
    CONTAINS('contains'),
    NOT_CONTAINS('not_contains'),
    CONTAINS_ANY('contains_any'),
    TITLE_CONTAINS('title_contains'),
    TITLE_NOT_CONTAINS('title_not_contains'),
    EQUAL_ATTR_CURRENT_OBJECT('equal_attr_current_object'),
    EQUAL_SUBJECT_ATTRIBUTE('equal_subject_attribute'),
    BETWEEN('between'),
    NEAR_HOURS('near_hours'),
    NEAR('near'),
    LAST_HOURS('last_hours'),
    LAST('last'),
    TODAY('today'),
    NOT_EQUAL_NOT_EMPTY('not_equal_not_empty'),
    NOT_CONTAINS_INCLUDING_EMPTY('not_contains_including_empty'),
    CONTAINS_ATTR_CURRENT_OBJECT('contains_attr_current_object'),
    CONTAINS_CURRENT_OBJECT('contains_current_object'),
    EQUAL_CURRENT_OBJECT('equal_current_object'),
    CONTAINS_INCLUDING_NESTED('contains_including_nested'),
    NOT_CONTAINS_INCLUDING_ARCHIVAL('not_contains_including_archival'),
    CONTAINS_INCLUDING_ARCHIVAL('contains_including_archival'),
    IN('in'),
    NOT_CONTAINS_NOT_EMPTY('not_contains_not_empty')

    String frontTitle

    Condition(String frontTitle) {
        this.frontTitle = frontTitle
    }

    static Condition getByTitle(String frontTitle) {
        return values().find { it.frontTitle == frontTitle }
    }
}

/**
 * Тип показателя в сводной таблице
 */
enum PivotIndicatorType
{
    GROUP_INDICATOR_INFO,
    INDICATOR_INFO
}

/**
 * Тип формата для параметров интервальных атрибутов
 */
enum DtIntervalFormatType
{
    DAY,
    HOURS,
    MINUTES,
    NOT_SELECTED,
    SECONDS,
    WEEK
}

/**
 * Тип формирования топа
 */
enum ModeOfTop
{
    MAX,
    MIN
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
     *
     */
    static final Integer maxValuesCount = 40000

    /**
     * Неймспейс для хранения дашбордов
     */
    private static final String DASHBOARD_NAMESPACE = 'dashboards'

    /**
     * Метод возвращает смещение часового пояса пользователя относительно серверного времени
     * @param userUUID - уникальный идентификатор пользователя
     * @param offsetUTCMinutesFromBrowser - смещение в минутах относительно 0 часового пояса, полученное с фронта
     * @return смещение в минутах для вычисления запросов в БД
     */
    Integer getOffsetUTCMinutes(String userUUID, Integer offsetUTCMinutesFromBrowser)
    {
        final Integer MS_IN_MINUTES = 60000
        Integer offset

        TimeZone tzServer = TimeZone.getDefault()        // Серверный ЧП (базы данных).

        // Настройка пользователя на платформе.
        def tzUserAPI = api.employee.getTimeZone(userUUID)
        TimeZone tzUser = tzUserAPI ? TimeZone.getTimeZone(tzUserAPI?.code) : null

        // Если на платформе не задан часовой пояс у пользователя, получаем смещение по ЧП с фронта.
        if (!tzUser)
        {
            // Если с фронта не пришло смещение, то используется серверный ЧП (смещение 0).
            // (offsetUTCMinutesFromBrowser == null) в данном случае не тождественно (!offsetUTCMinutesFromBrowser)
            if (offsetUTCMinutesFromBrowser == null)
            {
                offset = 0
            }
            else
            {
                offset = offsetUTCMinutesFromBrowser - (tzServer.getRawOffset() / MS_IN_MINUTES)
            }
        }
        else
        {
            Long timeDifference = tzUser.getRawOffset() - tzServer.getRawOffset()
            offset = timeDifference / MS_IN_MINUTES
        }
        /* Полученное смещение возвращается с отрицательным знаком,
           чтобы можно было прибавлять его методом DateUtils.addMinutes. */
        return -offset
    }

    /**
     * Метод корректировки виджетов, в дескрипторе которых ошибка
     * @param widgetKeys - ключи виджетов, которые нужно скорректировать
     */
    static void correctWidgetsWithDescriptorError(Collection<String> widgetKeys)
    {
        JsonSlurper slurper = new JsonSlurper()
        DashboardConfigService service = DashboardConfigService.instance

        List allDashboardKeys = service.getDashboardKeys('widgets', DASHBOARD_NAMESPACE)
        allDashboardKeys += service.getDashboardKeys('widgetIds', DASHBOARD_NAMESPACE)

        allDashboardKeys.each { dashboardKey ->
            String dashboardSettings = getApi().keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
            Map<String, Object> dashboard = slurper.parseText(dashboardSettings)
            Collection<Map<String, Object>> widgets = dashboard.widgets.findResults {
                if (it in String)
                {
                    return slurper.parseText(it)
                }
                return it
            }

            widgets.each { widget ->
                if (!(widget.id in widgetKeys) || !hasWidgetDescriptorError(widget))
                {
                    return
                }
                widget.data?.each { data ->
                    if (!data.source?.descriptor)
                    {
                        return
                    }
                    Map<String, Object> descriptor = slurper.parseText(data.source.descriptor)
                    String cartObjectMetaClassCode = descriptor.cardObjectUuid.split('\\$').first()
                    ISDtObject existingObject = getUtils().findFirst(cartObjectMetaClassCode, [:])
                    descriptor.cardObjectUuid = existingObject.UUID
                    data.source.descriptor = toJson(descriptor)
                }
            }
            dashboard.widgets = widgets
            getApi().keyValue.put(DASHBOARD_NAMESPACE, dashboardKey, toJson(dashboard))
        }
    }

    /**
     * Метод получения данных о виджетах, в дескрипторе которых ошибка
     * @param getOnlyKeys - флаг на получение только ключей виджетов или более подобрных данных
     * @return данные о виджетах, у которых в дескрипторе ошибка
     */
    static Collection<Object> getWidgetsDataWithDescriptorError(Boolean getOnlyKeys = false)
    {
        JsonSlurper slurper = new JsonSlurper()
        DashboardConfigService service = DashboardConfigService.instance

        List allDashboardKeys = service.getDashboardKeys('widgets', DASHBOARD_NAMESPACE)
        allDashboardKeys += service.getDashboardKeys('widgetIds', DASHBOARD_NAMESPACE)

        Collection<Map<String, Object>> allWidgets = allDashboardKeys.collectMany { dashboardKey ->
            String dashboardSettings = getApi().keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
            Map<String, Object> dashboard = slurper.parseText(dashboardSettings)
            return dashboard.widgets.findResults {
                if (it in String)
                {
                    return slurper.parseText(it)
                }
                return it
            }
        }

        Collection<Map<String, Object>> widgetsWithError =
            allWidgets.findAll(this.&hasWidgetDescriptorError)

        Collection<Object> widgetsWithErrorData
        if (getOnlyKeys)
        {
            widgetsWithErrorData = widgetsWithError.collect {
                return it.id
            }
        }
        else
        {
            widgetsWithErrorData = widgetsWithError.collect {
                Map<String, Object> dataWithDescriptor = getFirstWidgetDataWithDescriptor(it)
                Map<String, Object> descriptor =
                    slurper.parseText(dataWithDescriptor.source.descriptor)

                return [
                    'name'          : it.name,
                    'id'            : it.id,
                    'cartObjectUUID': descriptor.cardObjectUuid
                ]
            }
        }

        return widgetsWithErrorData
    }

    /**
     * Метод проверки объекта, на карточке которого находится виджет
     * @param widget - виджет
     * @return флаг - существует ли объект, на карточке которого находится виджет
     */
    static Boolean hasWidgetDescriptorError(Map<String, Object> widget)
    {
        JsonSlurper slurper = new JsonSlurper()
        Map<String, Object> dataWithDescriptor = getFirstWidgetDataWithDescriptor(widget)
        Boolean isWidgetWithError = false

        if (dataWithDescriptor?.source?.descriptor)
        {
            Map<String, Object> descriptor = slurper.parseText(dataWithDescriptor.source.descriptor)
            isWidgetWithError = !getApi().utils.load(descriptor.cardObjectUuid)
        }

        return isWidgetWithError
    }

    /**
     * Метод получения первой настройки виджета data, у которой есть дескриптор
     * @param widget - виджет
     * @return настройка data
     */
    static Map<String, Object> getFirstWidgetDataWithDescriptor(Map<String, Object> widget)
    {
        return widget.data.find {
            return it.source?.descriptor
        }
    }

    /**
     * Метод определяющий режим отладки
     * @return флаг на включение режима отладки
     */
    static Boolean isDebugMode()
    {
        Boolean isDebugMode = false
        ISDtObject rootObject = getApi().utils.findFirst('root', [:])
        IMetaClassWrapper rootMetaInfo = getApi().metainfo.getMetaClass(rootObject.getMetaClass())

        if (rootMetaInfo.hasAttribute('debugMode'))
        {
            isDebugMode = rootObject.debugMode
        }

        return isDebugMode
    }

    /**
     * Метод логирования данных
     * @param moduleName - названия модуля
     * @param rowNumber - номер строки
     * @param variableName - название переменной
     * @param value - значение
     */
    static void log(String moduleName,
                    Integer rowNumber,
                    String variableName,
                    def value,
                    Boolean convertStringValue = false)
    {
        if (isDebugMode())
        {
            String valueToLog =  convertStringValue ? toJson(value) : value.toString()
            getLogger().info("DASHBOARD_LOG ${ moduleName } ${ rowNumber } ${ variableName } = ${ valueToLog }")
        }
    }

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

        def sc = getApi().selectClause
        if(descriptor)
        {
            def apiDescr = getApi().listdata.createListDescriptor(descriptor)
            def dateCriteria = getApi().listdata.createCriteria(apiDescr)
                                       .addColumn(sc.min(sc.property(code)))
            res = getApi().db.query(dateCriteria).list().head()
        }
        else
        {
            def criteria = getApi().db.createCriteria().addSource(classFqn)
                                   .addColumn(sc.min(sc.property(code)))
            res = getApi().db.query(criteria).list().head()
        }
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
                    indicators: dataOrZeroWidget.sourceForCompute ? [] : [new NewIndicator(aggregation: dataOrZeroWidget.aggregation, attribute: dataOrZeroWidget.yAxis)],
                    parameters: [new NewParameter(group: dataOrZeroWidget.group, attribute: dataOrZeroWidget.xAxis)],
                    breakdown: getNewFormatBreakdownOrNull(dataOrZeroWidget.breakdown, dataOrZeroWidget.breakdownGroup, dataKey),
                    dataKey: dataKey,
                    sourceForCompute: dataOrZeroWidget.sourceForCompute,
                    source: dataOrZeroWidget.source in NewSourceValue ? dataOrZeroWidget.source : new NewSourceValue(value: dataOrZeroWidget.source, descriptor: dataOrZeroWidget.descriptor),
                    top: new Top(),
                    type: dataOrZeroWidget.type)]
            case [AxisPrev, CirclePrev, SummaryPrev]:
                return dataOrZeroWidget
            case AxisCurrentAndNew:
                if(dataOrZeroWidget.find() instanceof AxisCurrentData)
                {
                    return dataOrZeroWidget.collect {
                        new DiagramNewData(
                            indicators: it.sourceForCompute ? [] : [new NewIndicator(aggregation: it.aggregation, attribute: it.yAxis)],
                            parameters: [new NewParameter(group: it.group, attribute: it.xAxis)],
                            breakdown: getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey),
                            dataKey: it.dataKey,
                            showEmptyData: it.showEmptyData,
                            showBlankData: it.showBlankData,
                            sourceForCompute: it.sourceForCompute,
                            source: it.source in NewSourceValue ? it.source : new NewSourceValue(value: it.source, descriptor: it.descriptor),
                            top: it.top,
                            type: it.type)
                    }
                }
                else
                    return dataOrZeroWidget.collect {
                        if(it.sourceForCompute)
                        {
                            it.indicators = []
                        }
                        return it
                    }
            case CircleZero:
            case SummaryZero:
                def dataKey = UUID.randomUUID()
                return [new DiagramNewData(
                    breakdown: getNewFormatBreakdownOrNull(dataOrZeroWidget.breakdown, dataOrZeroWidget.breakdownGroup, dataKey),
                    indicators: dataOrZeroWidget.sourceForCompute ? [] : [new NewIndicator(aggregation:  dataOrZeroWidget.aggregation, attribute: dataOrZeroWidget.indicator)],
                    source: dataOrZeroWidget.source in NewSourceValue ? dataOrZeroWidget.source : new NewSourceValue(value: dataOrZeroWidget.source, descriptor: dataOrZeroWidget.descriptor),
                    sourceForCompute: dataOrZeroWidget.sourceForCompute,
                    dataKey: dataKey,
                    top: new Top()
                )]
            case [CircleCurrentAndNew, SummaryCurrentAndNew, SpeedometerCurrentAndNew] :
                if(dataOrZeroWidget.find() instanceof CircleAndSummaryCurrentData) //почему-то не работает со списком
                {
                    return dataOrZeroWidget.collect {new DiagramNewData(
                        breakdown: getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey),
                        indicators: it.sourceForCompute ? [] : [new NewIndicator(aggregation: it.aggregation, attribute: it.indicator)],
                        source: it.source in NewSourceValue ? it.source : new NewSourceValue(value: it.source, descriptor: it.descriptor),
                        sourceForCompute: it.sourceForCompute,
                        showEmptyData: it.showEmptyData,
                        showBlankData: it.showBlankData,
                        dataKey: it.dataKey,
                        top: clazz == CircleCurrentAndNew ? new Top() : null
                    )}
                }
                else
                    return dataOrZeroWidget.collect {
                        if(it.sourceForCompute)
                        {
                            it.indicators = []
                        }
                        else if (it instanceof  DiagramNewData && it.indicator)
                        {
                            it.indicators = [new NewIndicator(aggregation: it.aggregation, attribute: it.indicator)]
                            it.breakdown = getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey)
                            it.indicator = null
                            it.aggregation = null
                        }
                        return it
                    }
            case [TablePrevAndCurrentAndNew, PivotTable]:
                if(dataOrZeroWidget.find() instanceof TablePrevData)
                {
                    return dataOrZeroWidget
                }
                else if (dataOrZeroWidget.find() instanceof TableCurrentData)
                {
                    return dataOrZeroWidget.collect {
                        new DiagramNewData(
                            indicators: it.sourceForCompute ? [] : it.indicators,
                            parameters: it.parameters,
                            breakdown: getNewFormatBreakdownOrNull(it.breakdown, it.breakdownGroup, it.dataKey),
                            dataKey: it.dataKey,
                            sourceForCompute: it.sourceForCompute,
                            source: it.source in NewSourceValue ? it.source : new NewSourceValue(value: it.source, descriptor: it.descriptor),
                            )
                    }
                }
                else
                    return dataOrZeroWidget.collect {
                        if(it.sourceForCompute)
                        {
                            it.indicators = []
                        }
                        return it
                    }

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
            if(oldFormatWidget.data.find() instanceof AxisCurrentData && widgetCurrentClazz == CircleCurrentAndNew)
            {
                widgetCurrentClazz = AxisCurrentAndNew
                //обновляем поле data в соотстветсвии со столбчатым типом
                oldFormatWidget.data = updateDataToNewFormat(oldFormatWidget.data, widgetCurrentClazz)
                //выставляем сам тип
                oldFormatWidget.type = DiagramType.COLUMN
                //получаем объект правильного класса - это больше не CircleCurrentAndNew
                oldFormatWidget = mapper.convertValue(oldFormatWidget, AxisCurrentAndNew)
                //прописываем отсутствующие поля, которых нет в круговых, но есть в столбчатых
                oldFormatWidget.indicator = new IndicatorOrParameter()
                oldFormatWidget.parameter = new IndicatorOrParameter()
            }
            else
            {
                //если поле data было, обновляем поле data
                oldFormatWidget.data = updateDataToNewFormat(oldFormatWidget.data, widgetCurrentClazz)
            }
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
                    diagramType: oldFormatWidget.diagramType,
                    tooltip: oldFormatWidget?.tooltip
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
                    diagramType: oldFormatWidget.diagramType,
                    tooltip: oldFormatWidget?.tooltip
                )
            case [SpeedometerCurrentAndNew, CircleCurrentAndNew, AxisCurrentAndNew]:
                if(widgetCurrentClazz == AxisCurrentAndNew && oldDataFormat == AxisCurrentData)
                {
                    oldFormatWidget?.indicator?.name = null
                    oldFormatWidget?.parameter?.name = null
                }
                if(widgetCurrentClazz == SpeedometerCurrentAndNew && !oldFormatWidget.navigation)
                {
                    oldFormatWidget.navigation = new Navigation()
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
                    diagramType: oldFormatWidget.diagramType,
                    tooltip: oldFormatWidget?.tooltip
                )
            case PivotTable:
                return new PivotTable(
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
                    showSubTotalAmount: oldFormatWidget.showSubTotalAmount,
                    showTotalAmount: oldFormatWidget.showTotalAmount,
                    showRowNum: oldFormatWidget.showRowNum,
                    sorting: oldFormatWidget.sorting as Sorting,
                    pivot: oldFormatWidget.pivot as PivotTableObject,
                    data: oldFormatWidget.data as Collection<DiagramNowData>,
                    top: oldFormatWidget.top as Top ?: new Top(),
                    type: oldFormatWidget.type as DiagramType,
                    diagramType: oldFormatWidget.diagramType,
                    tooltip: oldFormatWidget?.tooltip,
                    links: oldFormatWidget?.links,
                    indicatorGrouping: oldFormatWidget?.indicatorGrouping,
                    parametersOrder: oldFormatWidget?.parametersOrder,
                    showTotalRowAmount: oldFormatWidget?.showTotalRowAmount
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
                    showSubTotalAmount: oldFormatWidget.showSubTotalAmount,
                    showTotalAmount: oldFormatWidget.showTotalAmount,
                    showRowNum: oldFormatWidget.showRowNum,
                    sorting: oldFormatWidget.sorting as Sorting,
                    table: oldFormatWidget.table as TableObject,
                    data: oldFormatWidget.data as Collection<DiagramNowData>,
                    top: oldFormatWidget.top as Top ?: new Top(),
                    type: oldFormatWidget.type as DiagramType,
                    diagramType: oldFormatWidget.diagramType,
                    tooltip: oldFormatWidget?.tooltip
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
     * Метод по приведению миллисекунд в нужный формат временного интервала
     * @param value - значение в миллисекундах
     * @param format - формат, в который нужно привести
     * @return данные об интервале в правильном формате
     */
    static def convertValueToInterval(Long value, GroupType format)
    {
        switch (format)
        {
            case GroupType.SECOND_INTERVAL:
                return TimeUnit.MILLISECONDS.toSeconds(value)
            case GroupType.MINUTE_INTERVAL:
                return TimeUnit.MILLISECONDS.toMinutes(value)
            case GroupType.HOUR_INTERVAL:
                return TimeUnit.MILLISECONDS.toHours(value)
            case GroupType.DAY_INTERVAL:
                return TimeUnit.MILLISECONDS.toDays(value)
            case GroupType.WEEK_INTERVAL:
                return TimeUnit.MILLISECONDS.toDays(value)/7
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

    /**
     * Метод получения локали текущего пользователя
     * @param subjectUUID - уникальный идентификатор пользователя
     * @return локаль для пользователя
     */
    String getUserLocale(String userUuid)
    {
        def userLocale
        if (userUuid)
        {
            userLocale = api.employee.getPersonalSettings(userUuid).locale
        }

        if (!userLocale)
        {
            userLocale = api.employee.getPersonalSettings('superUser$naumen').locale ?: 'ru'
        }
        return userLocale
    }

    /**
     * Метод для получения ключа формата для шаблона динамического атрибута
     * @param templateUUID - ключ шаблона
     * @return ключ формата
     */
    static String getFormatKeyForTemplateOfDynamicAttribute(String templateUUID)
    {
        def template = getApi().utils.get(templateUUID)
        String attrFormatToFind = template.visor
            ? "${template.metaClass}_${template.visor.code}"
            : "${template.metaClass}"
        attrFormatToFind = attrFormatToFind.replace('_unitsLinks', '')
        attrFormatToFind = attrFormatToFind.replace('_unitsButtons', '')
        attrFormatToFind = attrFormatToFind.replace('_stFrCat', '')
        def dynamicFields = getModules().dynamicFields.hasProperty('controller') ? getModules().dynamicFields.controller : getModules().dynamicFields
        return dynamicFields.getAttrToTotalValueMap()[attrFormatToFind]
    }

    /**
     * Метод проверки на возможность включения для атрибута агрегации AVG
     * @param sourceCode - код источника
     * @param attributeCode - код атрибута
     * @param attributeType - тип атрибута
     * @return флаг на возможность включения агрегации AVG
     */
    static boolean checkIfAbleForAvg(String sourceCode, String attributeCode, String attributeType)
    {
        def metaClass = getApi().metainfo.getMetaClass(sourceCode)
        try
        {
            if (metaClass?.getAttribute(attributeCode)?.type?.attributeType?.isAttributeOfRelatedObject())
            {
                return false
            }
        }
        catch (Exception e)
        {
            return false
        }
        switch (attributeType)
        {
            case AttributeType.NUMBER_TYPES:
            case AttributeType.DT_INTERVAL_TYPE:
            case AttributeType.TIMER_TYPES:
                return true
            case AttributeType.CATALOG_ITEM_TYPE:
                return getApi().utils.findFirst(sourceCode, [(attributeCode): getOp().isNotNull()])?.get(attributeCode)?.code?.isNumber()
            default: return false
        }
    }

    /**
     * Метод получения полей для изменения дескриптора
     * @param dtObjectWrapperKeySet - список ключей в dtObjectWrapper
     * @param attrType - тип атрибута в дескрипторе
     * @param needToReverse - флаг на необходимость возврата данных для обратного превращения
     * @return словарь из полей для удаления/добавления
     */
    static Map<String, String> getFieldToRemoveAndFieldToAdd(List dtObjectWrapperKeySet, String attrType, Boolean needToReverse = true)
    {
        if(attrType == AttributeType.CATALOG_ITEM_TYPE)
        {
            return dtObjectWrapperKeySet.any { it == 'uuid' }
                ? [fieldToRemove: 'uuid', fieldToAdd: 'code']
                : needToReverse ? [fieldToRemove: 'code', fieldToAdd: 'uuid'] : [:]
        }
        else
        {
            return dtObjectWrapperKeySet.any { it == 'uuid' }
                ? [fieldToRemove: 'uuid', fieldToAdd: 'idHolder']
                : needToReverse ? [fieldToRemove: 'idHolder', fieldToAdd: 'uuid'] : [:]
        }
    }

    /**
     * Метод формирования нового значения в рамках фильтра
     * @param obj - объект в условии
     * @param attrType - тип атрибута
     * @param needToReverse - флаг на необходимость возврата данных для обратного превращения
     */
    private static def getFilterForObjectWrapper(def obj, def attrType, boolean needToReverse)
    {
        Map fieldsToRemoveAdd = getFieldToRemoveAndFieldToAdd(obj.keySet().toList(), attrType, needToReverse)
        if (fieldsToRemoveAdd)
        {
            if (obj[fieldsToRemoveAdd.fieldToRemove])
            {
                String fieldToRemove = fieldsToRemoveAdd.fieldToRemove
                String fieldToAdd = fieldsToRemoveAdd.fieldToAdd

                def fqn = obj.fqn
                if(fqn && fqn != "null")
                {
                    Boolean attrClassHasAttrToAdd = false
                    Boolean fqnIsNotActual = !(getApi().metainfo.getMetaClass(fqn))
                    if(fqnIsNotActual)
                    {
                        return null
                    }
                    else
                    {
                        attrClassHasAttrToAdd = fieldToAdd == 'uuid' ?: getApi().metainfo.checkAttributeExisting(fqn, fieldToAdd).isEmpty()
                    }

                    if (attrClassHasAttrToAdd && attrType != AttributeType.STATE_TYPE)
                    {
                        def value

                        try
                        {
                            value = fieldToRemove == 'uuid'
                                ? getApi().utils.load(obj.uuid)?.get(fieldToAdd)
                                : getApi().utils.findFirst( fqn, [(fieldToRemove): obj[fieldToRemove]])?.get(fieldToAdd == 'uuid' ? fieldToAdd.toUpperCase() : fieldToAdd)
                        }
                        catch (Exception ex)
                        {
                            getLogger().error("no object with field ${fieldToRemove} value ${obj[fieldToRemove]}")
                            value = null
                        }

                        if (value)
                        {
                            obj.remove(fieldToRemove)
                            obj << [(fieldToAdd): value]
                        }
                    }
                }

            }
        }
        return obj
    }

    /**
     * Метод изменения полей в дескрипторе
     * @param widget - настройки виджета
     * @param needToReverse - флаг на необходимость возврата данных для обратного превращения
     * @return измененные настройки виджета
     */
    static Widget updateDescriptorWithCodeAndUuid(Widget widget, Boolean needToReverse = true)
    {
        if(widget && widget.type != DiagramType.TEXT)
        {
            JsonSlurper slurper = new JsonSlurper()
            widget?.data?.each { data ->
                def descriptor = data?.source?.descriptor
                if(descriptor)
                {
                    def tempDescriptor = slurper.parseText(descriptor)

                    List filtersToRemove = []
                    tempDescriptor?.filters?.each { filterValue ->
                        filterValue?.each { filter ->
                            def attrType = filter.properties.attrTypeCode
                            if(filter.dtObjectWrapper)
                            {
                                def newDtObjectWrapper = getFilterForObjectWrapper(filter.dtObjectWrapper, attrType, needToReverse)
                                if(newDtObjectWrapper)
                                {
                                    filter.dtObjectWrapper = newDtObjectWrapper
                                }
                                else
                                {
                                    filtersToRemove << filter
                                }
                            }
                            if(filter.dtObjectWrapperList)
                            {
                                filter.dtObjectWrapperList = filter.dtObjectWrapperList.findResults { dtObjectWrapper ->
                                    if (dtObjectWrapper)
                                    {
                                        return getFilterForObjectWrapper(dtObjectWrapper, attrType, needToReverse)
                                    }
                                    else
                                    {
                                        return null
                                    }
                                }
                            }
                        }
                    }

                    tempDescriptor?.filters = tempDescriptor?.filters?.findResults { filter ->
                        filtersToRemove.each {
                            filter -= it
                        }
                        return filter ?: null
                    }
                    data?.source?.descriptor = toJson(tempDescriptor)
                }
            }
        }
        return widget
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
                                                           LOCALIZED_TEXT_TYPE, BOOL_TYPE, TEXT_TYPE].asImmutable()

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

    static final Collection<String> HAS_UUID_TYPES = [OBJECT_TYPE,  CATALOG_ITEM_TYPE, CATALOG_ITEM_SET_TYPE, BO_LINKS_TYPE, BACK_BO_LINKS_TYPE]

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
    static final String TEXT_TYPE = 'text'

    static final String DOUBLE_TYPE ='double'
    static final String STATE_TYPE ='state'
    static final String LOCALIZED_TEXT_TYPE ='localizedText'
    static final String BOOL_TYPE = 'bool'
    static final String TOTAL_VALUE_TYPE = 'totalValue'
    static final String VALUE_TYPE = 'value'
}

/**
 * Описание фильтрации для показателя
 */
@Canonical
class IndicatorFiltration
{
    /**
     * Декриптор фильтрации
     */
    String descriptor
    /**
     * Код метакласса показателя
     */
    String metaClassFqn
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
     * метакласс атрибута(где к нему идёт обращение)
     */
    String metaClassFqn
    /**
     * метакласс атрибута, где он был создан
     */
    String declaredMetaClass
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

    /**
     * Флаг на возможность включения агрегации AVG
     */
    Boolean ableForAvg = false

    /**
     * Тип выводимого значения для атрибута типа счетчик
     */
    TimerValue timerValue

    /**
     * Код представления
     */
    String visorCode = ''

    static Attribute fromMap(Map<String, Object> data)
    {
        return data ? new Attribute(
            title: data.title as String,
            code: data.code as String,
            type: data.type as String,
            property: data.property as String,
            metaClassFqn: data.metaClassFqn as String,
            declaredMetaClass: data.declaredMetaClass as String,
            sourceName: data.sourceName as String,
            sourceCode: data.sourceCode as String,
            ableForAvg: data.ableForAvg as Boolean,
            timerValue: data.timerValue as TimerValue,
            ref: fromMap(data.ref as Map<String, Object>),
            visorCode: data.visor ?: ''
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
            declaredMetaClass: this.declaredMetaClass,
            sourceName: this.sourceName,
            sourceCode: this.sourceCode,
            ableForAvg: this.ableForAvg,
            timerValue: this.timerValue,
            ref: this.ref?.deepClone(),
            visorCode: this.visorCode
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

class DynamicGroupWithAttributes extends DynamicGroup
{
    /**
     * Список динамических атрибутов
     */
    List<Attribute> attributes
}

@AutoClone
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
    Top top
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
    Collection<Source> sources
    Collection<PivotLink> links
}

class Source
{
    String classFqn
    String descriptor
    Collection<FilterList> filterList
    String dataKey

    @Override
    Source clone() throws CloneNotSupportedException
    {
        return new Source(
            classFqn: this.classFqn,
            descriptor: this.descriptor,
            filterList: this.filterList,
            dataKey: this.dataKey
        )
    }
}

abstract class Parameter<T>
{
    String title
    T type
    BaseAttribute attribute
    String sortingType
}

class AggregationParameter extends Parameter<Aggregation>
{
    /**
     * Разбивка на показателе
     */
    NewBreakdown breakdown
    /**
     * Ключ агрегации
     */
    String key
    /**
     * Фильтрация на показателе
     */
    String descriptor
}

class GroupParameter extends Parameter<GroupType>
{
    String format

    GroupParameter deepClone()
    {
        BaseAttribute attribute

        if (this.attribute instanceof Attribute)
        {
            attribute = this.attribute.deepClone()
        }
        else
        {
            attribute = this.attribute
        }

        return new GroupParameter(
            format: this.format,
            title: this.title,
            type: this.type,
            sortingType: this.sortingType,
            attribute: attribute
        )
    }
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
    static String valueDelimiter = '#'

    /**
     * Метод получения значения для пользователя
     * @param localizedTitle - название статуса, полученный по коду
     * @param stateValue - значение статуса (код)
     * @return название статуса (код)
     */
    static String marshal(String localizedTitle, String stateValue)
    {
        return "${localizedTitle}${valueDelimiter}${stateValue}"
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
 * Класс для преобразования/получения значения uuid-а шаблона динамического атрибута для вывода кода дашборда
 */
class TotalValueMarshaller
{
    /**
     * делитель для значения (код атрибута _ uuid шаблона)
     */
    static String delimiter = '_'

    /**
     * Метод получения итогового кода для динамического атрибута
     * @param code - код атрибута, который нужен в запросе
     * @param uuid - uuid шаблона атрибута
     * @return  код атрибута delimiter uuid шаблона атрибута
     */
    static String marshal(String code, String uuid)
    {
        return "${code}${delimiter}${uuid}"
    }

    /**
     * Метод для парсинга кода атрибута с шаблоном
     * @param value - значение целиком
     * @return [код атрибута, uuid шаблона атрибута]
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
 * Класс для преобразования/получения значения объекта для атрибута типа НБО и НБО
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
     * делитель для кода
     */
    static String codeDelimiter = '◀️▶️'

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
     * Метод формирования значения для атрибута типа ЭС и НЭС
     * @param value - значение (название)
     * @param code - код
     * @param uuid - идентификатор
     * @return название_ codeDelimiter_ код_ valueDelimiter_ уникальный идентификатор
     */
    static String marshalCatalog(String value, String code, String uuid)
    {
        return "${value}${codeDelimiter}${code}${delimiter}${uuid}"
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

/**
 * Класс для преобразования/получения значения ошибки вместе с её кодом
 */
class ExceptionMessageMarshaller
{
    /**
     * делитель для значения
     */
    static String delimiter = '#'

    /**
     * Метод получения значения для пользователя
     * @param message - сообщение об ошибке
     * @param exceptionType - тип исключения
     * @return  сообщение об ошибке delimiter тип исключения
     */
    static String marshal(String message, String exceptionType)
    {
        return "${message}${delimiter}${exceptionType}"
    }

    /**
     * Метод для парсинга значения
     * При необходимости метод изменяет текст сообщения
     * @param value - сооббщение вместе с типом ошибки
     * @return [ сообщение об ошибке, тип ошибки]
     */
    static List<String> unmarshal(String value)
    {
        def(message, type) = value ? value.tokenize(delimiter) : []
        if(message?.contains('У Вас нет прав') || message?.contains('You don\'t have permissions') || message?.contains('Sie haben keine Berechtigung'))
        {
            String locale = new DashboardUtils().getUserLocale(CurrentUserHolder.currentUser.get()?.UUID)
            message = MessageProvider.instance.getConstant(MessageProvider.NO_RIGHTS_ERROR, locale)
            type = MessageProvider.NO_RIGHTS_ERROR
        }
        return [message, type]
    }
}

/**
 * Класс для преобразования/получения значения временного интервала
 */
class DtIntervalMarshaller
{
    /**
     * делитель для значения для фронта
     */
    static String delimiter = '#'

    /**
     * делитель для значения для исходного датасета
     */
    static String dbDelimiter = '$'

    /**
     * Метод формирования строки со значением временного интервала
     * @param value - значение(или доля) интервала
     * @param type - тип группировки, для которого значение получено
     * @param dbValue - значение из БД
     * @return значение(доля)_делитель_значение из Бд
     */
    static String marshal(String value, GroupType type, String dbValue)
    {
        value =  getValueWithFormat(value, type)
        return "${value}${delimiter}${dbValue}"
    }

    /**
     *
     * @param value
     * @param type
     * @return
     */
    static String getValueWithFormat(String value, GroupType type)
    {
        switch (type)
        {
            case GroupType.SECOND_INTERVAL:
                return "${value} сек"
            case GroupType.MINUTE_INTERVAL:
                return "${value} мин"
            case GroupType.HOUR_INTERVAL:
                return "${value} час"
            case GroupType.DAY_INTERVAL:
                return "${value} д"
            case GroupType.WEEK_INTERVAL:
                return "${value} нед"
        }
    }

    /**
     * Метод для парсинга значения
     * @param value - значение целиком
     * @return [значение объекта, uuid объекта]
     */
    static List<String> unmarshal(String value)
    {
        value = value?.tokenize(delimiter)?.last()
        return value ? value.tokenize(dbDelimiter) : []
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
        },
        (PivotTable): { value ->
            return use(JacksonUtils) {
                value['diagramType'] == 'PivotTable' ||
                (value['type'] as DiagramType) == DiagramType.PIVOT_TABLE
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
                Boolean dataSetTypeMatch = false
                if (value.hasField('__type') && value['__type'] in DataSetType)
                {
                    dataSetTypeMatch = true
                }
                dataSetTypeMatch || (value.hasField('indicators') || value.hasField('sourceForCompute'))
            }
        },
        (PivotTableData) : { value ->
            return use(JacksonUtils) {
                (value.hasField('__type') && value['__type'] == DataSetType.PIVOT_DATA_SET)
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
            },
            (PercentageRelativeAttr) : { value ->
                return use(JacksonUtils) {
                    value.hasField('descriptor')
                }
            }
        ]
        module.addDeserializer(BaseAttribute, baseAttributeDeserializer)

        def baseBreakdowndeserializer = new PredictorBasedPolymorphicDeserializer()
        baseBreakdowndeserializer.predictors = [
            (Attribute) : { value ->
                return use(JacksonUtils) {
                    value.hasField('code') && !value.hasField('attribute')
                }
            },
            (NewBreakdown) : { value ->
                return use(JacksonUtils) {
                    value.hasField('attribute') || value.hasField('value')
                }
            }
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

        def formatDataWidgetDeserializer = new PredictorBasedPolymorphicDeserializer()
        formatDataWidgetDeserializer.predictors = [
            (LabelFormat) : { value ->
                return use(JacksonUtils) {
                    value['type'] == 'LABEL_FORMAT'
                }
            },
            (NumberFormat): { value ->
                return use(JacksonUtils) {
                    value['type'] in ['NUMBER_FORMAT', 'INTEGER_FORMAT']
                }
            }
        ]
        module.addDeserializer(Format, formatDataWidgetDeserializer)

        StdDeserializer pivotIndicatorTypeDeserializer = new PredictorBasedPolymorphicDeserializer()
        pivotIndicatorTypeDeserializer.predictors = [
            (IndicatorInfo): { value ->
                return use(JacksonUtils) {
                    (value['type'] as PivotIndicatorType) == PivotIndicatorType.INDICATOR_INFO
                }
            },
            (GroupIndicatorInfo): { value ->
                return use(JacksonUtils) {
                    (value['type'] as PivotIndicatorType) == PivotIndicatorType.GROUP_INDICATOR_INFO
                }
            }
        ]
        module.addDeserializer(IndicatorSubject, pivotIndicatorTypeDeserializer)

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
    @JsonInclude(JsonInclude.Include.NON_NULL)
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

    /**
     * Уникальный идентификатор экземпляра дашборда
     */
    String dashboardUUID = ''

    /**
     * Тип дашборда (базово - это обычный дашборд с возможностью редактирования)
     */
    DashboardType type = DashboardType.BASE

    @JsonCreator
    static DashboardSettingsClass create(String json) {
        return mapper.readValue(json, DashboardSettingsClass)
    }
}

/**
 * Класс, описывающий внутренности таблицы для фронта
 */
@JsonIgnoreProperties(ignoreUnknown = true)
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
 * Класс, описывающий внутренности сводной таблицы для фронта
 */
class PivotTableObject extends TableObject
{
    /**
     * Объект, описывающий тело таблицы для фронта
     */
    PivotTableBody body = new PivotTableBody()
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
    /**
     * Стиль текста
     */
    FontStyle fontStyle
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
 * Класс, описывающий тело сводной таблицы
 */
class PivotTableBody extends TableBody
{
    /**
     * Цвет рамки параметра
     */
    String parameterRowColor
    /**
     * Флаг на скрытие групп по умолчанию в сводной таблице
     */
    Boolean collapse = true
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
    /**
     * Стиль текста
     */
    FontStyle fontStyle
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
@Canonical
class AutoUpdate
{
    /**
     * флаг на включение автообновления
     */
    boolean enabled
    /**
     * интервал обновления
     */
    int interval
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
 * Класс для атрибута с вычислением процента относительно источника
 */
@Canonical
class PercentageRelativeAttr extends BaseAttribute
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
    /**
     * Дескриптор индикатора для расчета процента относительно источника
     */
    String descriptor
    /**
     * Код источника
     */
    String sourceCode = ''
    /**
     * Флаг на возможность включения агрегации AVG
     */
    Boolean ableForAvg = false
    /**
     * Атрибут второго уровня
     */
    Attribute ref

    /**
     * Полное копирование атрибута включая вложенные
     * @return
     */
    PercentageRelativeAttr deepClone()
    {
        return new PercentageRelativeAttr(
            code: this.code,
            title: this.title,
            type: this.type,
            descriptor: this.descriptor,
        )
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
    /**
     * Атрибут второго уровня
     */
    Attribute ref
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
 * Опция для фильтра на виджете
 */
class WidgetFilterOption
{
    /**
     * название фильтра
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String label

    /**
     * пользовательский фильтр
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String descriptor

    /**
     * атрибуты для фильтра
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Collection<BaseAttribute> attributes
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
     * Опции для фильтрации обычного пользователя на виджете
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Collection<WidgetFilterOption> widgetFilterOptions

    /**
     * значение источника
     */
    SourceValue value

    /**
     * Ключ глобального фильтра
     */
    String filterId

    /**
     * Название
     */
    String label

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
                source.descriptor = storageFilter.descriptor
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
    SourceValue(String value)
    {
        this.value = value
    }

    SourceValue()
    {
    }

    /**
     * Дескриптор источника
     */
    String descriptor = ''
    /**
     * Ключ глобального фильтра
     */
    String filterId

    Collection<WidgetFilterOption> widgetFilterOptions
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
    String fontSize = 16
}

trait IHasTotalSettings
{
    /*
    * Отображать промежуточные итоги
    */
    Boolean showSubTotalAmount = false
    /*
     * Отображать общую сумму
     */
    Boolean showTotalAmount = false
}

trait IHasSpeedometerStyle
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
 * Метки данных
 */
@JsonIgnoreProperties(ignoreUnknown = true)
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

    /**
     * Флаг на блокировку данных (управляется количеством элементов)
     */
    Boolean disabled = false

    /**
     * Форматирование для меток(данные из показателя)
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    DtIntervalFormat format
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
@JsonIgnoreProperties(ignoreUnknown = true)
class Header implements IHasFontSettings
{
    /**
     * Цвет текста
     */
    String fontColor = '#323232'
    /**
     * Стиль текста
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    FontStyle fontStyle
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
    /**
     * выбор максимального или минимального значения топ
     */
    ModeOfTop modeOfTop = ModeOfTop.MAX

}

/**
 * Новый формат разбивки
 */
@Canonical
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
    /**
     * Настройки подсказки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    TooltipSettings tooltip
    /**
     * Разбивка на показателе
     */
    NewBreakdown breakdown
    /**
     * Ключ показателя
     */
    String key
    /**
     * Фильтрация на показателе
     */
    String descriptor
    /**
     * Формат
     */
    DtIntervalFormat format
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
 * Класс, описывающий состав фильтра для работы drilldown
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class DrilldownFilter extends NewParameter
{
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Aggregation aggregation

    @JsonInclude(JsonInclude.Include.NON_NULL)
    def value
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
                def groupInfo = customGroups?.find { it?.id == groupKey }
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
@JsonIgnoreProperties(ignoreUnknown = true)
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
     * Форматирование для данных
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Format format

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
    /**
     * Тип шрифта на оси
     */
    String fontFamily = defaultFontFamily
    /**
     * Размер шрифта на оси
     */
    String fontSize = 12
}

/**
 * Класс, описывающий факторы форматирования для данных
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
abstract class Format
{
    /**
     * тип данных, для которых идёт форматирование
     */
    FormatType type
}

/**
 * Форматирование для параметров нечисловых атрибутов
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class LabelFormat extends Format
{
    /**
     * Тип форматирования названия
     */
    LabelFormatType labelFormat
}

/**
 * Форматирование для параметров числовых атрибутов
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class NumberFormat extends Format
{
    /**
     * Дополнительное значение
     */
    String additional

    /**
     * Количество знаков после запятой
     */
    Integer symbolCount

    /**
     * Нотация
     */
    NotationType notation

    /**
     * Разделить разряды
     */
    Boolean splitDigits
}

/**
 * Форматирование для параметров интервальных атрибутов
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class DtIntervalFormat extends NumberFormat
{
    /**
     * Первая часть формата
     */
    DtIntervalFormatType quotient
    /**
     * Вторая часть формата
     */
    DtIntervalFormatType remainder
    /**
     * Количество символов
     */
    Integer symbolCount
}

/**
 * Класс, описывающий сортировку
 */
@JsonIgnoreProperties(ignoreUnknown = true)
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
    /**
     * Тип формата атрибута (для атрибутов типа счетчик)
     */
    TimerValue timerValue

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
     * Настройки подсказки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    TooltipSettings tooltip
    /**
     * Тип агрегации, используемый на диаграммах с накоплением
     */
    Aggregation aggregationType = Aggregation.PERCENT_CNT_BY_COMMON

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
                    def parameters = [[attribute: fields."xAxis_$index", group: fields."group_$index"]]

                    def source = fields."source_$index".value
                    def descriptor = fields."descriptor_$index"
                    def sourceForCompute = fields."sourceForCompute_$index"
                    def indicators = sourceForCompute ? [] : [[aggregation : fields."aggregation_$index", attribute:
                        fields."yAxis_$index", type: fields."type_$index"]]
                    def top = fields.top
                    def type = fields."type_$index"

                    Map dataBody = [descriptor       : descriptor,
                                    parameters       :parameters,
                                    source           : source,
                                    sourceForCompute : sourceForCompute, indicators:indicators,
                                    breakdown        : fields."breakdown_$index",
                                    breakdownGroup   : fields."breakdownGroup_$index",
                                    top              : top?.show ? top : null,
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

                    def source =  fields."source_$index".value
                    def descriptor = fields."descriptor_$index"
                    def sourceForCompute = fields."sourceForCompute_$index"
                    def indicators = sourceForCompute ? [] : [[aggregation: fields."aggregation_$index", attribute: fields."indicator_$index"]]
                    def top = fields.top

                    Map dataBody = [descriptor      : descriptor,
                                    parameters      : [],
                                    source          : source,
                                    sourceForCompute: sourceForCompute,
                                    indicators      : indicators,
                                    breakdown       : fields."breakdown_$index",
                                    breakdownGroup  : fields."breakdownGroup_$index",
                                    top             : top?.show ? top : null,
                                    showEmptyData   : fields.showEmptyData,
                                    showBlankData   : fields.showBlankData]
                    data = [(dataKey): dataBody]
                }
            }
            else if((fields.type as DiagramType) in [DiagramType.TABLE, DiagramType.PIVOT_TABLE])
            {
                data = fields.order.collect { index ->
                    def dataKey = fields."dataKey_$index"
                    def parameters = [[attribute: fields."row_$index", group: fields."group_$index"]]

                    def source =  fields."source_$index".value
                    def descriptor = fields."descriptor_$index"
                    def sourceForCompute = fields."sourceForCompute_$index"
                    def indicators = sourceForCompute ? [] : [[aggregation: fields."aggregation_$index", attribute: fields."column_$index"]]
                    def top = fields.top

                    Map requestContent = [descriptor      : descriptor,
                                          parameters      : parameters,
                                          source          : source,
                                          sourceForCompute: sourceForCompute,
                                          indicators      : indicators,
                                          breakdown       : fields."breakdown_$index",
                                          breakdownGroup  : fields."breakdownGroup_$index",
                                          top             : top?.show ? top : null,
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

    static Collection updateDataToCorrectFormat(def fieldsArray)
    {
        fieldsArray.each { fields ->
            fields?.breakdown = fields?.breakdown instanceof Collection
                ? fields?.breakdown
                : fields?.breakdown ? [fields?.breakdown] : []
        }
        return fieldsArray
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

        if(fields.data)
        {
            fields.data = updateDataToCorrectFormat(fields.data)
        }

        if(fields?.header?.fontStyle == "")
        {
            fields?.header?.fontStyle = null
        }

        if(clazz == TablePrevAndCurrentAndNew)
        {
            if(fields?.table?.body?.indicatorSettings?.fontStyle == "")
            {
                fields?.table?.body?.indicatorSettings?.fontStyle = null
            }
            if(fields?.table?.body?.parameterSettings?.fontStyle == "")
            {
                fields?.table?.body?.parameterSettings?.fontStyle= null
            }
            if(!fields?.table?.columnHeader)
            {
                fields?.table?.columnHeader = new ColumnHeader()
            }
            if(fields?.table?.columnHeader?.fontStyle == "")
            {
                fields?.table?.columnHeader?.fontStyle = null
            }
        }

        if(clazz == SpeedometerCurrentAndNew)
        {
            if(!(fields.borders.min instanceof Map || fields.borders.max instanceof Map))
            {
                fields.borders.min = new MinMaxBorder(value: fields.borders.min as Float)
                fields.borders.max = new MinMaxBorder(value: fields.borders.max as Float)
            }
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
@JsonIgnoreProperties(ignoreUnknown = true)
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
     * Формат для разбивки
     */
    Format breakdownFormat
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
class AxisCurrentAndNew extends NewDiagrams implements IHasTotalSettings
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
    /**
     * Заголовок для источника
     */
    String sourceRowName
    /**
     * Типа датасета
     */
    DataSetType __type
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
    NewSourceValue source
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
    /**
     * Тип комбо диаграммы
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    ComboType type
    /**
     * Дескриптор
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String descriptor
    /**
     * Показатель виджета для сочетания виджетами старых версий
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Attribute indicator
    /**
     * Тип агрегации виджета для сочетания с виджетами старых версий
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Aggregation aggregation
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
     * Источник нового формата
     */
    NewSourceValue source
    /**
     * Фильтрация источника
     */
    String descriptor
}

/**
 * Класс, описывающий данные для построения сводной таблицы
 */
@Canonical
class PivotTableData extends DiagramNowData
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
    NewSourceValue source
    /**
     * Фильтрация источника
     */
    String descriptor
    /**
     * Тип датасета
     */
    String type
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
class CircleCurrentAndNew extends NewDiagrams implements IHasTotalSettings
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
    MinMaxBorder max
    /**
     * Минимальное значение
     */
    MinMaxBorder min

    /**
     * Стиль границ
     */
    BorderStyle style = new BorderStyle()
}

/**
 * Минимальная/максимальная граница спидометра
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class MinMaxBorder
{
    /**
     * Значение атрибута (если есть)
     */
    NewIndicator indicator

    /**
     * Флаг на использование чисел для границ
     */
    Boolean isNumber = true

    /**
     * Число для границы
     */
    def value
}

/**
 * Показатель на виджете типа спидометр
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class SpeedometerIndicator implements  IHasSpeedometerStyle
{
    /**
     * Формат числа
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    NumberFormat format
}

/**
 * Стиль границ
 */
class BorderStyle implements IHasSpeedometerStyle {
    /**
     * Формат числа
     */
    NumberFormat format
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
    /**
     * Стиль для данных на диапазонах
     */
    RangesStyle style = new RangesStyle()
}

/**
 * Стиль для данных на диапазонах
 */
class RangesStyle implements IHasFontSettings
{
    {
        fontSize = 16
    }
    /**
     * Расположение на дисплее
     */
    DisplayType displayType = DisplayType.BLOCK
    /**
     * Позиция легенды
     */
    Position legendPosition = Position.right
    /**
     * Позиция числа
     */
    NumberPosition position = NumberPosition.LEGEND
    /**
     * Флаг на отображение
     */
    Boolean show = true
    /**
     * Способ отображения
     */
    TextHandler textHandler = TextHandler.CROP
    /**
     * Формат числа
     */
    NumberFormat format
    /**
     * Цвет текста
     */
    String fontColor = '#323232'
    /**
     * Стиль текста
     */
    String fontStyle
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
    Navigation navigation = new Navigation()
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
@JsonIgnoreProperties(ignoreUnknown = true)
class TablePrevAndCurrentAndNew extends NewDiagrams implements IHasTotalSettings
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
    @JsonInclude(JsonInclude.Include.NON_NULL)
    def columnsRatioWidth
    /**
     * Внутренности таблицы для фронта
     */
    TableObject table = new TableObject()
    /**
     * Флаг на отображение номера строки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Boolean showRowNum
    /**
     * Настройка топ х
     */
    Top top = new Top()
}

/**
 * Класс, описывающий сводные таблицы
 */
@Canonical
@JsonIgnoreProperties(ignoreUnknown = true)
class PivotTable extends TablePrevAndCurrentAndNew
{
    /**
     * Связи между источниками
     */
    Collection<PivotLink> links

    /**
     * Группировки показателей
     */
    Collection<IndicatorSubject> indicatorGrouping

    /**
     * Порядок параметров
     */
    Collection<ParameterOrder> parametersOrder

    /**
     * Настройки стилей таблицы
     */
    PivotTableObject pivot

    /**
     * Флаг - показывать ли сумму по показателям
     */
    Boolean showTotalAmount

    /**
     * Флаг - показывать ли сумму по параметрам
     */
    Boolean showTotalRowAmount
}

/**
 * Класс, описывающий порядок параметров
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class ParameterOrder
{
    /**
     * Ключ показателя
     */
    String dataKey

    /**
     * Параметр
     */
    NewParameter parameter
}

/**
 * Класс, описывающий связь между источниками
 */
class PivotLink
{
    /**
     * Атрибут связи между источниками
     */
    Attribute attribute

    /**
     * Ключ данных первого источника
     */
    String dataKey1

    /**
     * Ключ данных второго источника
     */
    String dataKey2
}

/**
 * Класс, описывающий группу показателей для сводной таблицы
 */
class GroupIndicatorInfo extends IndicatorSubject
{
    /**
     * Список элементов показателей
     */
    Collection<IndicatorSubject> children

    /**
     * Флаг, имеет ли группа показателей сумму
     */
    Boolean hasSum
}

/**
 * Класс, описывающий показатель для сводной таблицы
 */
class IndicatorInfo extends IndicatorSubject
{
    /**
     * Флаг, имеет ли показатель разбивку
     */
    Boolean hasBreakdown
}

/**
 * Класс, описывающий элемент показателя для сводной таблицы
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class IndicatorSubject
{
    /**
     * Ключ элемента
     */
    String key

    /**
     * Название элемента
     */
    String label

    /**
     * Тип показателя
     */
    PivotIndicatorType type
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

/**
 * Объект, который представляет собой сохраняемые пользовательские фильтры на источник
 */
class WidgetFilterResponse
{
    /**
     * ключ данных, для которых нужно применить пользовательский фильтр
     */
    String dataKey

    /**
     * пользовательский фильтр на источник
     */
    String descriptor

    static Collection<WidgetFilterResponse> getWidgetFiltersCollection(def fields)
    {
        JsonSlurper slurper = new JsonSlurper()
        if(fields instanceof String)
        {
            fields =  slurper.parseText(fields)
        }
        def tempWidgetFilters = fields ? fields.findResults {
            new WidgetFilterResponse(it)
        } : []

        def groupedFilters = tempWidgetFilters.groupBy {it.dataKey}

        return groupedFilters.findResults { dataKey, filters ->
            //пользователь может сначала установить фильтр, а затем заменить настройки на "не указано"
            filters = filters.findAll{ slurper.parseText(it.descriptor).filters }
            if(filters?.size() == 0)
            {
                //нет ни одного заполненного фильтра
                return null
            }
            if(filters?.size() > 1)
            {
                //взяли первый дескриптор за основу
                def baseFilterDescriptor = filters.find().descriptor
                if(baseFilterDescriptor)
                {
                    def baseFilterDescriptorMap = slurper.parseText(baseFilterDescriptor) //представили словарём
                    baseFilterDescriptorMap.remove('attrCodes')
                    //дополнили его фильтры фильтрами из других дескрипторов по этому же источнику через условие "И"
                    filters[1..-1].each {
                        def descriptorMap = slurper.parseText(it.descriptor)
                        baseFilterDescriptorMap.filters += descriptorMap.filters
                    }
                    baseFilterDescriptor = toJson(baseFilterDescriptorMap) //вернули обратно к виду строки
                    return new WidgetFilterResponse(dataKey: dataKey, descriptor: baseFilterDescriptor)
                }
            }
            //фильтр может быть настроен всего 1 - возвращаем его
            return filters.find()
        }
    }
}

/**
 * Класс, описывающий запрос для получения данных по диаграмме
 */
@Canonical
class GetGataForCompositeDiagramRequest
{
    /**
     * Ключ дашборда
     */
    String dashboardKey
    /**
     * Ключ виджета
     */
    String widgetKey
    /**
     * Ключ объекта, на карточке которого расположен дашборд
     */
    String cardObjectUuid
    /**
     * Фильтры на виджете
     */
    def widgetFilters
    /**
     * Смещение ЧП
     */
    Integer offsetUTCMinutes
    /**
     * Данные для получения сессионных данных по виджету
     */
    SessionData sessionData
}

/**
 * Класс, описывающий данные для получения сессионных данных по виджету
 */
@Canonical
class SessionData
{
    /**
     * Тип аггрегации
     */
    Aggregation aggregationType
    /**
     * Ключ виджета
     */
    String id
}

/**
 * Класс, описывающий запрос для получения данных по таблице
 */
@Canonical
class GetDataForTableDiagramRequest extends GetGataForCompositeDiagramRequest
{
    /**
     * Настройки для таблицы
     */
    TableRequestSettings tableRequestSettings
}

/**
 * Класс, описывающий запрос по получению ссылки(дриллдаун)
 */
@Canonical
class GetLinkRequest
{
    /**
     * Ключ объекта, на карточке которого расположен дашборд
     */
    String cardObjectUuid
    /**
     * Ключ дескриптора из хранилища
     */
    String filterId
    /**
     * Дескриптор в запросе
     */
    String descriptor
    /**
     * Дескриптор на виджете (пользовательская фильтрация)
     */
    String widgetDescriptor
    /**
     * Список фильтров на виджете
     */
    List widgetFilters
    /**
     * Список фильтров по атрибутам
     */
    List filters
    /**
     * Список типов для метакласа
     */
    List cases
    /**
     * Ключ дашборда
     */
    String dashboardKey
    /**
     * Код группы (для пользовательского дашбординга)
     */
    String groupCode
    /**
     * Код метакласса для запроса
     */
    String classFqn
    /**
     * Название ссылки
     */
    String title
    /**
     * Список кодов атрибутов для получаемой ссылки
     */
    List attrCodes

    /**
     * Смещение ЧП
     */
    Integer offsetUTCMinutes
    /**
     * Тип диаграммы
     */
    DiagramType diagramTypeFromRequest
    /**
     * лист параметров
     */
    List parameters
    /**
     * лист разбивок
     */
    List breakdown
    /**
    * лист показетелей
    */
    List indicators
    /**
     * Флаг незаполенных данных
     */
    Boolean showBlankData
}

/**
 * Настройки для пагинации
 */
class PaginationSettings
{
    /**
     * Количество элементов на странице
     */
    Integer pageSize = 20
    /**
     * Индекс для первого элемента на странице
     */
    Integer firstElementIndex = 0
}

/**
 * Настройки для запроса на построение таблицы
 */
class TableRequestSettings
{
    /**
     * Количество элементов на странице
     */
    Integer pageSize = 20

    /**
     * Номер страницы для отрисовк
     */
    Integer pageNumber = 1

    /**
     * объект с флагами на игнорирование пределов по параметрам/разбивками
     */
    IgnoreLimits ignoreLimits = new IgnoreLimits()

    /**
     * объект, описывающий настройки сортировки
     */
    Sorting sorting = new Sorting()
}

/**
 * Настройки подсказки для виджета
 */
@JsonIgnoreProperties(ignoreUnknown = true)
class TooltipSettings
{
    /**
     * Флаг для отображения/скрытия подсказки
     */
    Boolean show

    /**
     * Текст подсказки
     */
    String title

    /**
     * Размер шрифта
     */
    String fontSize

    /**
     * Шрифт
     */
    String fontFamily

    /**
     * Текст
     */
    String text
}

/**
 * Базовый контроллер, перехватывает вызываемые другими контроллерами методы, в случае выброса исключения, происходит обработка ошибки
 */
@InjectApi
abstract class BaseController extends Script implements GroovyInterceptable
{
    private static final Logger LOG = LoggerFactory.getLogger(BaseController)
    private static final ThreadLocal<String> entrypointMethod = new ThreadLocal<>()

    @SuppressWarnings('unused')
    BaseController()
    {
        this(new Binding([:]))
    }

    BaseController(Binding binding)
    {
        super(binding)
    }

    /**
     * Метод, который перехватывает вызываемые другими контроллерами методы, в случае выброса исключения,
     * происходит обработка ошибки и преобразование её к стандартному виду
     * @param name - название метода
     * @param args - список аргументов
     * @return результат выполнения метода или преобразованная к единому формату ошибка
     */
    def invokeMethod(String name, Object args)
    {
        if(!entrypointMethod.get())
        {
            entrypointMethod.set(name)
            def user = args?.find {
                it instanceof IUUIDIdentifiable && it.metaClass.toString().startsWith('employee')
            } as IUUIDIdentifiable
            CurrentUserHolder.set(user)
        }

        LOG.debug("invoke method $name")

        try
        {
            if(entrypointMethod.get() != name)
            {
                return super.invokeMethod(name, args)
            }
            return api.tx.call{super.invokeMethod(name, args)}
        }
        catch (e)
        {
            if(entrypointMethod.get() != name || isActionNotFromRest(e))
            {
                throw e
            }

            def msg = "An error occurred at invoke method $name"
            LOG.error(msg, e)

            def(message, exceptionType) = ExceptionMessageMarshaller.unmarshal(e.message)

            (requestAttributes as ServletRequestAttributes).response.with {
                status = HttpStatus.INTERNAL_SERVER_ERROR.value()
                contentType = ContentType.APPLICATION_JSON.mimeType
                characterEncoding = ContentType.APPLICATION_JSON.charset
            }
            return toJson(new ErrorReport(message: message, exceptionType: exceptionType))
        }
        finally
        {
            if(entrypointMethod.get() == name)
            {
                entrypointMethod.remove()
            }
            CurrentUserHolder.clear()
        }
    }

    Object run()
    {
        return null
    }
    private static boolean isActionNotFromRest(Exception e)
    {
        return e.getStackTrace().find{ stackTraceElement ->
            stackTraceElement.getClassName() == 'ru.naumen.core.server.rest.RestServiceController'
        } == null
    }
}

/**
 * Отчет об ошибке, содержит отметку времени, код ошибки и информацию об ошибке
 */
@Canonical
class ErrorReport
{
    /**
     * сообщение об ошибке
     */
    String message
    /**
     * тип ошибки
     */
    String exceptionType
}

/**
 * Контейнер для хранения ссылки на пользователя для текущего потока
 * Установка пользователя происходит в {@link BaseController#invokeMethod}
 */
class CurrentUserHolder
{
    private static final Logger LOG = LoggerFactory.getLogger(CurrentUserHolder)
    private static final ThreadLocal<ISDtObject> currentUser = new ThreadLocal<>()

    /**
     * @return текущий пользователь
     */
    static ISDtObject get()
    {
        if (LOG.isTraceEnabled())
        {
            LOG.trace("Get ${currentUser.get()?.UUID}")
        }

        return currentUser.get()
    }

    /**
     * Установить текущего пользователя
     * @param user текущий пользователь
     */
    static void set(IUUIDIdentifiable user)
    {
        if (LOG.isTraceEnabled())
        {
            LOG.trace("Set ${user?.UUID}")
        }

        currentUser.set(user)
    }

    /**
     * Сбросить информацию о текущем пользователе
     */
    static void clear()
    {
        if (LOG.isTraceEnabled())
        {
            LOG.trace("Clear ${currentUser.get()?.UUID}")
        }

        currentUser.remove()
    }
}
//endregion
return