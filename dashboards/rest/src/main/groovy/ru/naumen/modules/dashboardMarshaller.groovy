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
package ru.naumen.modules

import groovy.json.JsonSlurper
import ru.naumen.objectlist.shared.ListDescriptorFactory
import com.google.web.bindery.autobean.vm.AutoBeanFactorySource
import ru.naumen.core.shared.autobean.wrappers.AdvlistSettingsAutoBeanFactory
import com.google.web.bindery.autobean.shared.AutoBeanCodex
import ru.naumen.core.shared.autobean.wrappers.IReducedListDataContextWrapper
import ru.naumen.core.shared.autobean.wrappers.ReducedListDataContext

import static groovy.json.JsonOutput.toJson


/**
 * Класс для сериализации и десериализации объектов
 */
class DashboardMarshaller {

    /**
     * Метод для получения дескриптора
     * @param jsonString - дескриптор в формате json
     * @return дескриптор
     */
    static def getDescriptorFromJson(String jsonString) //TODO: костыль. В дальнейшем будет заменено
    {
        def context = createContext(jsonString)
        context.clientSettings.visibleAttrCodes = new HashSet() // жёсткий костыль

        if (context.content.cases) //тоже жёсткий костыль
        {
            context.content.clazz = null
        }

        def descriptor = ListDescriptorFactory.create(context)
        return descriptor
    }
    /**
     * Метод создания контекста
     * @param json - объект
     * @return контекст
     */
    static def createContext(String json)
    {
        def factory = AutoBeanFactorySource.create(AdvlistSettingsAutoBeanFactory)
        def autoBean = AutoBeanCodex.decode(factory, IReducedListDataContextWrapper, json)
        return ReducedListDataContext.createObjectListDataContext(autoBean.as())
    }

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