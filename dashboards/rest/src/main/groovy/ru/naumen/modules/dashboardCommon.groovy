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

import groovy.transform.TupleConstructor

//region enum
/**
 * Типы группировки даннных для диаграмм. DAY, WEEK, MONTH, QUARTER, YEAR, SEVEN_DAYS только для дат
 */
enum GroupType
{
    DAY,
    WEEK,
    MONTH,
    QUARTER,
    YEAR,
    SEVEN_DAYS,
    OVERLAP
}

/**
 * Типы диаграмм
 */
enum Diagram
{
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
}
//endregion

return