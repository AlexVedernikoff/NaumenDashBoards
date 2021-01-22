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

import groovy.transform.AutoClone
import groovy.transform.TupleConstructor
import groovy.transform.Field

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
    TABLE

    static List<DiagramType> StandardTypes = [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE]
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
    MINUTES

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
 * Тип параметра колонки
 */
enum ColumnType
{
    PARAMETER,
    INDICATOR,
    BREAKDOWN
}
//endregion

//region МЕТОДЫ

/**
 * Метод получения минимальной даты из Бд
 * @param code - код атрибута
 * @param classFqn - класс источника
 * @param descriptor - фильтр для источника
 * @return минимальная дата по данному атрибуту
 */
Date getMinDate(String code, String classFqn, String descriptor = '')
{
    if(descriptor)
    {
        def sc = api.selectClause
        def apiDescr = api.listdata.createListDescriptor(descriptor)
        def dateCriteria = api.listdata.createCriteria(apiDescr)
                              .addColumn(sc.min(sc.property(code)))
        return api.db.query(dateCriteria).list().head() as Date
    }
    return api.db.query("select min(${code}) from ${classFqn}").list().head() as Date
}

/**
 * Метод получения количества уникальных значений по атрибуту из Бд
 * @return - количество уникальных значений по данному атрибуту
 */
Integer countDistinct(Attribute attribute, String classFqn)
{
    String attributeType = attribute.type
    List attrCodesList = attribute.attrChains()*.code
    String attrCode = attrCodesList.collect { it == 'UUID' ? 'id' : it.replace('metaClass', 'metaClassFqn') }.join('.')
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

//endregion

//region КОНСТАНТЫ
/**
 * предел значений по количеству строк в таблице
 */
@Field private static final Integer tableParameterLimit = 10000
/**
 * предел значений по количеству значений разбивки в таблице
 */
@Field private static final Integer tableBreakdownLimit = 30

//endregion

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
@TupleConstructor
class Attribute
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
    Attribute attribute
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
return