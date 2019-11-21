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

import ru.naumen.objectlist.shared.ListDescriptorFactory
import com.google.web.bindery.autobean.vm.AutoBeanFactorySource
import ru.naumen.core.shared.autobean.wrappers.AdvlistSettingsAutoBeanFactory
import com.google.web.bindery.autobean.shared.AutoBeanCodex
import ru.naumen.core.shared.autobean.wrappers.IReducedListDataContextWrapper
import ru.naumen.core.shared.autobean.wrappers.ReducedListDataContext


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
}
return