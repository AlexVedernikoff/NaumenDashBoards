/*! UTF-8 */
//Автор: nordclan
//Дата создания: 01.06.2020
//Код:
//Назначение:
/**
 * Скрипт по перемещению виджетов и кастомных группировкок непосредственно к их дашбордам
 */
//Версия: 4.10.0.15
//Категория: Консольный скрипт

import static groovy.json.JsonOutput.toJson

//region КОНСТАНТЫ
String DASHBOARD_NAMESPACE = 'dashboards'
String CUSTOM_GROUP_NAMESPACE = 'custom_groups'
String WIDGET_NAMESPACE = 'widgets'
//endregion

//region МЕТОДЫ
/**
 * Метод получения ключей дашбордов
 * @param namespace - название неймспейса
 * @return массив из ключей дашбордов
 */
List getDashboardKeys(String namespace)
{
    def slurper = new groovy.json.JsonSlurper()

    return api.keyValue.find(namespace, '') { key, value ->
        def settings = slurper.parseText(value)
        settings.containsKey('widgetIds')
    }.keySet().toList()
}

/**
 * Метод по удалению значений из хранилища
 * @param valuesIds - индексы значений
 * @param namespace - хранилище
 */
void deleteValuesInOldNameSpaces(List valuesIds, String namespace)
{
    valuesIds.each { id ->
        if(api.keyValue.delete(namespace, id))
        {
            logger.info("object with id: ${id} was deleted successfully")
        }
        else
        {
            logger.info("object with id: ${id} wasn't deleted")
        }
    }
}
//endregion

//region ОСНОВНОЙ БЛОК
List dashboardKeys = getDashboardKeys(DASHBOARD_NAMESPACE)

dashboardKeys.each { dashboardKey ->
    def slurper = new groovy.json.JsonSlurper()
    def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
    dashboardSettings = dashboardSettings ? slurper.parseText(dashboardSettings) : null

    List widgetKeys = dashboardSettings.widgetIds
    logger.info(
        "full count of widgets - ${ widgetKeys.size() } on dashboard ${ dashboardKey }"
    )
    dashboardSettings.widgets = widgetKeys.collect { widgetKey ->
        return api.keyValue.get(WIDGET_NAMESPACE, widgetKey)
    }

    List customGroupKeys = dashboardSettings.customGroupIds
    logger.info(
        "full count of groups - ${ customGroupKeys.size() } on dashboard ${ dashboardKey }"
    )
    dashboardSettings.customGroups = customGroupKeys.collect { customGroupKey ->
        return api.keyValue.get(CUSTOM_GROUP_NAMESPACE, customGroupKey)
    }

    if(api.keyValue.put(DASHBOARD_NAMESPACE, dashboardKey, toJson(dashboardSettings)))
    {
        logger.info(
            "dashboard with dashboardKey ${dashboardKey} was updated successfully"
        )
        deleteValuesInOldNameSpaces(widgetKeys, WIDGET_NAMESPACE)
        deleteValuesInOldNameSpaces(customGroupKeys, CUSTOM_GROUP_NAMESPACE)
    }
    else
    {
        logger.info(
            "dashboard with dashboardKey ${dashboardKey} wasn't updated"
        )
    }
}

//endregion