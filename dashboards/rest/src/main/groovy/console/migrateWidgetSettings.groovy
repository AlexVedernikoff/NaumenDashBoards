/*! UTF-8 */
//Автор: nordclan
//Дата создания: 01.06.2020
//Код:
//Назначение:
/**
 * Скрипт по разделению namespace-ов для дашбордов, виджетов, кастомных группировок
 */
//Версия: 4.10.0.15
//Категория: Консольный скрипт

//region КОНСТАНТЫ
String DASHBOARD_NAMESPACE = 'dashboards'
String CUSTOM_GROUP_NAMESPACE = 'custom_groups'
String WIDGET_NAMESPACE = 'widgets'
//endregion

//region МЕТОДЫ
/**
 * Метод получения ключей необходимых объектов
 * @param objName - навазние объекта
 * @param namespace - название неймспейса
 * @return массив из ключей объектов
 */
List getObjectKeys(String objName, String namespace)
{
    def slurper = new groovy.json.JsonSlurper()

    return api.keyValue.find(namespace, '') { key, value ->
        def settings = slurper.parseText(value)
        settings.containsKey(objName)
    }.values().collectMany { el ->
        return slurper.parseText(el).get(objName)
    }
}


/**
 * Метод получения ключей дашбордов
 * @param objName - навазние объекта
 * @param namespace - название неймспейса
 * @return массив из ключей дашбордов
 */
List getDashboardKeys(String objName, String namespace)
{
    def slurper = new groovy.json.JsonSlurper()

    return api.keyValue.find(namespace, '') { key, value ->
        def settings = slurper.parseText(value)
        settings.containsKey(objName)
    }.keySet().toList()
}

/**
 * Метод получения ключей и значений необходимых объектов
 * @param objKeys - список ключей объкта
 * @param namespace - название неймспейса
 * @return ассоциативный массив из ключей и значений необходимых объектов
 */
def getMapForObject(List objKeys, String namespace)
{
    return objKeys.findResults { key ->
        def value = api.keyValue.get(namespace, key)
        return value ? [ (key) : value ] : null
    }.collectEntries()
}
//endregion

//region ОСНОВНОЙ БЛОК
//CREATING WIDGETS' AND GROUPS' MAPS
List keysForWidgets = getObjectKeys("widgetIds", DASHBOARD_NAMESPACE)
def widgtesMap = getMapForObject(keysForWidgets, DASHBOARD_NAMESPACE)
logger.info(
    "full count of widgets - ${ keysForWidgets.size() } | count of not null widgets - ${ widgtesMap.size()}"
)

List keysForGroups = getObjectKeys("customGroupIds", DASHBOARD_NAMESPACE)
def groupsMap = getMapForObject(keysForGroups, DASHBOARD_NAMESPACE)
logger.info( "full count of groups - ${ keysForGroups.size() } | count of not null groups - ${ groupsMap.size() }" )

//PUTTING VALUES INTO NEW NAMESPACES
List putWidgetsResults = widgtesMap.collect { key, value -> api.keyValue.put(WIDGET_NAMESPACE, key, value) }
logger.info(
    "count of widgets to put: ${ widgtesMap.size() } | successfull puted: ${ putWidgetsResults.findAll { x -> x == true }.size() }, " +
    "not deleted ${ putWidgetsResults.findAll { x -> x == false }.size()} "
)

List putGroupsResults = groupsMap.collect { key, value -> api.keyValue.put(CUSTOM_GROUP_NAMESPACE, key, value) }
logger.info(
    "count of groups to put: ${ groupsMap.size() } | successfull puted: ${ putGroupsResults.findAll { x -> x == true }.size() }, " +
    "not deleted ${ putGroupsResults.findAll { x -> x == false }.size() } "
)

//DELETING VALUES IN OLD NAMESPACE
Set keysForDashboards = getDashboardKeys("widgetIds", DASHBOARD_NAMESPACE)
Set allKeys = api.keyValue.find( DASHBOARD_NAMESPACE, '', { key, value -> true}).keySet()
Set notDashboards = allKeys - keysForDashboards
logger.info( "total count of objects in dashboards: ${ allKeys.size() }; " +
             "count of dashboars: ${ keysForDashboards.size() } ; count of others : ${ notDashboards.size() }"
)

List deleteResults = notDashboards.collect { key -> api.keyValue.delete(DASHBOARD_NAMESPACE, key) }

logger.info( "count of objects to delete: ${ notDashboards.size() } | successfull deleted: ${ deleteResults.findAll { x -> x == true }.size() }, " +
             "not deleted ${ deleteResults.findAll { x -> x == false }.size() }"
)
//endregion