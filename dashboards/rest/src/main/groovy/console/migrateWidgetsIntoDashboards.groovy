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

String BACKUP_MODULE = 'workerKeyValueStorage'
String ROOT_CLASS_CODE = 'root'
String KEY_VALUE_STORAGE_ATTR_CODE = 'keyValueDataF'

String NEW_DASHBOARD_FIELD_FOR_WIDGETS = 'widgets'
String NEW_DASHBOARD_FIELD_FOR_GROUPS = 'customGroups'
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
//модуля для создания бэкапа может НЕ быть в списке модулей
Boolean hasNoBackupModule = !modules[BACKUP_MODULE]
//checkAttributeExisting() возвращает строку c описанием ошибки, если атрибут НЕ найден
Boolean keyValueDataAttrNotExists = api.metainfo.checkAttributeExisting(ROOT_CLASS_CODE, KEY_VALUE_STORAGE_ATTR_CODE)
if(hasNoBackupModule && keyValueDataAttrNotExists)
{
    throw new Exception('Бэкап создать невозможно.  Обратитесь к администратору для создания нужных атрибутов.')
}
else
{
    //создаём актуальный бэкап
    modules.workerKeyValueStorage.copyAllKeyValueStorageToFile()

    List dashboardKeys = getDashboardKeys(DASHBOARD_NAMESPACE)

    dashboardKeys.each { dashboardKey ->
        def slurper = new groovy.json.JsonSlurper()
        def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
        dashboardSettings = dashboardSettings ? slurper.parseText(dashboardSettings) : null

        if(dashboardSettings)
        {
            List widgetKeys = dashboardSettings.widgetIds
            logger.info( "full count of widgets - ${ widgetKeys?.size() } on dashboard ${ dashboardKey }")

            dashboardSettings.widgets = widgetKeys?.findResults { widgetKey ->
                return api.keyValue.get(WIDGET_NAMESPACE, widgetKey)
            }

            List customGroupKeys = dashboardSettings.customGroupIds
            logger.info( "full count of groups - ${ customGroupKeys?.size() } on dashboard ${ dashboardKey }")

            dashboardSettings.customGroups = customGroupKeys?.findResults { customGroupKey ->
                return api.keyValue.get(CUSTOM_GROUP_NAMESPACE, customGroupKey)
            }

            Boolean dashboardUpdated = false
            Boolean anyWidgetsAndGroupsInKeyValueStorage = (dashboardSettings.widgets || dashboardSettings.customGroups)
            Boolean dashboardFormatIsOld = !dashboardSettings.keySet().any{ it == NEW_DASHBOARD_FIELD_FOR_WIDGETS  || it == NEW_DASHBOARD_FIELD_FOR_GROUPS }

            //сохраняем, если Дб старый, виджетов  и групп нет, но поля добавить нужно, или, если виджеты или группы нашлись для дашборда
            if(anyWidgetsAndGroupsInKeyValueStorage || (!anyWidgetsAndGroupsInKeyValueStorage && dashboardFormatIsOld))
            {
                dashboardUpdated = api.keyValue.put(DASHBOARD_NAMESPACE, dashboardKey, toJson(dashboardSettings))
            }

            if(dashboardUpdated)
            {
                logger.info("dashboard with dashboardKey ${dashboardKey} was updated successfully")

                deleteValuesInOldNameSpaces(widgetKeys, WIDGET_NAMESPACE)
                deleteValuesInOldNameSpaces(customGroupKeys, CUSTOM_GROUP_NAMESPACE)
            }
            else
            {
                logger.info( "dashboard with dashboardKey ${dashboardKey} wasn't updated")
            }
        }
        else
        {
            logger.info("dashboard with dashboardKey ${dashboardKey} has no settings")
        }
    }
}

//endregion