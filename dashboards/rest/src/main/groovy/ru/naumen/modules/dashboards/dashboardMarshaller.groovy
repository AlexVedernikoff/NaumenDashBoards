/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Модуль для сериализации и десериализации объектов
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль
package ru.naumen.modules.dashboards

import groovy.json.JsonSlurper

import static groovy.json.JsonOutput.toJson


/**
 * Класс для сериализации и десериализации объектов
 */
class DashboardMarshaller {

    /**
     * Метод для замены cardObjectUuid в объекте фильтрации. Требуется для корректной работы фильтра containsSubject
     * @param descriptor     - json объекта фильтра
     * @param cardObjectUuid - фактическое значение идентификатора "текущего объекта"
     * @return изменённый json объекта фильтрации
     */
    static String substitutionCardObject(String descriptor, String cardObjectUuid) {
        Closure<String> closure = { String json ->
            def slurper = new JsonSlurper()
            def res = slurper.parseText(json) as Map<String, Object>
            res.put('cardObjectUuid', cardObjectUuid)
            toJson(res)
        }
        return descriptor && cardObjectUuid ? closure(descriptor) : descriptor
    }
}
return