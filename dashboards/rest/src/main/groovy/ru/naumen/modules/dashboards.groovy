package ru.naumen.modules

import groovy.transform.Field

/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Бекенд для встроенного приложения "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль

//region КОНСТАНТЫ
@Field private static final String EXAMPLE_CONST = 'Hello'
//endregion

//region REST-МЕТОДЫ
String methodForInvokeFromRest(String name)
{
    return "$EXAMPLE_CONST, ${methodForInternalUsage(name)}"
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
String methodForInternalUsage(String param)
{
    return param.toUpperCase()
}
//endregion
