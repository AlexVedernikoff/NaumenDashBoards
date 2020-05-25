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

package ru.naumen.modules

import groovy.transform.AutoClone
import groovy.transform.TupleConstructor

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
    TABLE
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
    WEEK_INTERVAL
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
    MDN('%s') //TODO: Тут должна была быть медиана.

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
    EQUAL_REMOVED,
    NOT_EQUAL_REMOVED
}

enum AttributeType
{
    BOOL,
    INTEGER,
    DOUBLE,
    STRING,
    LOCALIZED_TEXT,

    OBJECT,
    BO_LINKS,
    BACK_BO_LINKS,
    CATALOG_ITEM,
    CATALOG_ITEM_SET,

    STATE,
    META_CLASS,

    DATE,
    DATE_TIME,
    DT_INTERVAL,
    TIMER,
    BACK_TIMER

    static List<AttributeType> getLinkTypes()
    {
        return [
                OBJECT,
                BO_LINKS,
                CATALOG_ITEM_SET,
                BACK_BO_LINKS,
                CATALOG_ITEM
        ]
    }

    static List<AttributeType> getNumberTypes()
    {
        return [INTEGER, DOUBLE]
    }

    static List<AttributeType> getDateTypes()
    {
        return [DATE, DATE_TIME]
    }

    static AttributeType[] getTimerTypes()
    {
        return [TIMER, BACK_TIMER]
    }
}

//endregion

//region КЛАССЫ
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
    AttributeType type
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
     * Вложенный атрибут
     */
    Attribute ref

    static Attribute fromMap(Map<String, Object> data)
    {
        return data ? new Attribute(
                title: data.title as String,
                code: data.code as String,
                type: data.type as AttributeType,
                property: data.property as String,
                metaClassFqn: data.metaClassFqn as String,
                sourceName: data.sourceName as String,
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
                ref: this.ref?.deepClone())
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
        } else {
            this.ref = attribute
        }
    }
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
}

abstract class Parameter<T>
{
    String title
    T type
    Attribute attribute
}

class AggregationParameter extends Parameter<Aggregation> {}

class GroupParameter extends Parameter<GroupType> {}

class FilterParameter extends Parameter<Comparison>
{
    def value
}

//endregion
return