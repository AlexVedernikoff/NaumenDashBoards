/*! UTF-8 */
//Автор: nordclan
//Автор методов "copyAllKeyValueStorageToFile" и "updateDataInKeyValueStorageFromFile": mnoskov
//Дата создания: 18.08.2021
//Код:
//Назначение:
/**
 * Модуль для настройки функциональности приложения "Дашборды"
 */
//Версия: 4.13.0.4
//Категория: скриптовый модуль

package ru.naumen.modules.dashboards

import com.amazonaws.util.json.Jackson
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import static groovy.json.JsonOutput.toJson
import groovy.json.JsonSlurper
import groovy.transform.Field
import java.sql.Clob
import groovy.json.JsonOutput
import ru.naumen.core.server.hibernate.DDLTool

@Field @Lazy @Delegate DashboardConfig dashboardConfig = new DashboardConfigImpl(binding)

interface DashboardConfig
{
    /**
     * Метод компиляции  модулей в нужном порядке
     * @param codeApp - код встроенного приложения (необходимо указать для лицензионной версии)
     */
    void compileModules()
    void compileModules(String codeApp)

    /**
     * Метод проверки и обновления версий хранения данных приложения "Дашборды"
     */
    void checkVersionAndUpdateWidgetsAndCustomGroups()

    /**
     * Включить/выключить системную группу для приложения "Дашборды"
     * @param isTurnOn - флаг установки системной группы (по умолчанию true)
     */
    void setDashboardMasterGroupEnabled(boolean isTurnOn)

    /**
     * Посмотреть текущий статус системной группы для приложения "Дашборды"
     * @return булевый флаг, включена ли системная группа
     */
    boolean isDashboardMasterGroupEnabled()

    /**
     * Настройка обновления значения статуса счетчика в БД
     * @param delayMs - время в миллисекундах (если нет нагрузки на стенд, лучше выставить 10 мс)
     */
    void setTimerStatusChangeDelay(Integer delayMs)

    /**
     * Актуализация состояния счетчиков
     */
    void updateAllBackTimerStates()

    /**
     * Включение настройки обновления счетчиков на стенде
     * @param isSetTimerRefresh - флаг установки режима обновления (по умолчанию "true")
     */
    void setTimerStatusRefreshEnable(boolean isSetTimerRefresh)

    /**
     * Копирует все данные из таблицы tbl_sys_keyvaluestorage
     * формирует словарь [namespace : [key : value]], и в формате json
     * прикрепляет к атрибуту компании с кодом dashboard
     */
    void copyAllKeyValueStorageToFile()

    /**
     * Обновляет keyValue Storage данными из файла
     * @param file - файл в формате json. Например: [namespace : [key : value]]
     */
    void updateDataInKeyValueStorageFromFile(def file)

    /**
     * Обновляет дескрипторы виджетов у дашбордов в хранилище с применения uuid на применение code
     */
    void setCodeInsteadOfUuidInDashboardsSettings()

    /**
     * Метод получения ошибок по дашбордам
     * @return маппинг ключей дашбордов и текст ошибки
     */
    String getDashboardErrorsData()
}

@InheritConstructors
class DashboardConfigImpl extends BaseController implements DashboardConfig
{
    DashboardConfigService service = DashboardConfigService.instance

    Object run()
    {
        return null
    }

    @Override
    void compileModules(String codeApp = null)
    {
        service.compileModules(codeApp)
    }

    @Override
    void checkVersionAndUpdateWidgetsAndCustomGroups()
    {
        service.checkVersionAndUpdateWidgetsAndCustomGroups()
    }

    @Override
    void setDashboardMasterGroupEnabled(boolean isTurnOn = true)
    {
        service.setDashboardMasterGroupEnabled(isTurnOn)
    }

    @Override
    boolean isDashboardMasterGroupEnabled()
    {
        return service.isDashboardMasterGroupEnabled()
    }

    @Override
    void setTimerStatusChangeDelay(Integer delayMs = 10)
    {
        service.setTimerStatusChangeDelay(delayMs)
    }

    @Override
    void updateAllBackTimerStates()
    {
        service.updateAllBackTimerStates()
    }

    @Override
    void setTimerStatusRefreshEnable(boolean isSetTimerRefresh = true)
    {
        service.setTimerStatusRefreshEnable(isSetTimerRefresh)
    }

    @Override
    void copyAllKeyValueStorageToFile()
    {
        service.copyAllKeyValueStorageToFile()
    }

    @Override
    void updateDataInKeyValueStorageFromFile(def file)
    {
        service.updateDataInKeyValueStorageFromFile(file)
    }

    @Override
    void setCodeInsteadOfUuidInDashboardsSettings()
    {
        service.setCodeInsteadOfUuidInDashboardsSettings()
    }

    /**
     * Метод получения ошибок по дашбордам
     * @return маппинг ключей дашбордов и текст ошибки
     */
    @Override
    String getDashboardErrorsData()
    {
        return toJson(service.getDashboardErrorsData())
    }
}

@InjectApi
@Singleton
class DashboardConfigService
{
    final String DASHBOARD_NAMESPACE = 'dashboards'
    final String CUSTOM_GROUP_NAMESPACE = 'custom_groups'
    final String WIDGET_NAMESPACE = 'widgets'

    final String ROOT_CLASS_CODE = 'root'
    final String KEY_VALUE_STORAGE_ATTR_CODE = 'keyValueDataF'

    final String NEW_DASHBOARD_FIELD_FOR_WIDGETS = 'widgets'
    final String NEW_DASHBOARD_FIELD_FOR_GROUPS = 'customGroups'

    final String FEATURE_CONFIGURATION = 'featureConfiguration'
    final String CONFIGURATION_PROPERTIES = 'configurationProperties'

    private static final String FILE_TITLE = 'keyValue storage data.json'
    private static final String FILE_FORMAT = 'json'
    private static final String FILE_DESCRIPTION = 'Описание'

    private static boolean LOGGING_IS_ENABLED = true
    private static final String LOGGING_PREFIX = "workerKeyValueStorage >>> "
    /**
     * Необходимые неймспейсы, используемые приложением
     */
    private static final Collection<String> DASHBOARDS_REQUIRED_NAMESPACES = ["custom_groups","widgets","dashboards","sources","dashboardsSources"]

    private static final String GET_ALL_KEY_VALUE_STORAGE_SQL = """
        SELECT name_space, key_, value
        FROM tbl_sys_keyvaluestorage
        """
    private static final String CHECK_ON_EXIST_UNIVERSAL_SQL = """SELECT value FROM tbl_sys_keyvaluestorage
                                                          WHERE name_space = '%s'
                                                              AND key_ = '%s'
                                                          FETCH FIRST 1 ROWS ONLY
                                                          """
    private static final String CHECK_ON_EXIST_FOR_MSSQL = """SELECT TOP 1 value FROM tbl_sys_keyvaluestorage
                                                      WHERE name_space = '%s'
                                                      AND key_ = '%s'"""

    def log(def obj)
    {
        if (LOGGING_IS_ENABLED)
        {
            logger.info(LOGGING_PREFIX + obj.toString())
        }
    }

    /**
     * Метод формирует из результатов SQL запроса JSON для сохранения в файл\вывода на экран
     * @param queryResult - результат SQL запроса
     * @param outToConsole - выводить JSON в консоль или в файл
     */
    def processQueryResult(def queryResult, def outToConsole = false)
    {
        def resultMap = [:];
        for (def l : queryResult)
        {
            def namespace = l.getAt(0);
            if (resultMap.get(namespace) == null)
            {
                resultMap.put(namespace, [:]);
            }
            def key = l.getAt(1);
            def value = l.getAt(2);
            //updated: aosvalov 08.04.2020 https://naupp.naumen.ru/sd/operator/#uuid:smrmTask$93383812
            if (value instanceof Clob)
            {
                resultMap.get(namespace).put(key, value.getSubString(1, (int) value.length()));
            }
            else
            {
                resultMap.get(namespace).put(key, value);
            }
        }
        def resJson = toJson(resultMap)
        if (outToConsole)
        {
            log("${JsonOutput.prettyPrint(resJson)}")
            return;
        }

        def root = api.utils.findFirst('root', [:]);
        if (!root.get(KEY_VALUE_STORAGE_ATTR_CODE).isEmpty())
        {
            root.get(KEY_VALUE_STORAGE_ATTR_CODE).UUID.forEach { api.utils.delete(it) }
        }
        api.utils.attachFile(root, KEY_VALUE_STORAGE_ATTR_CODE, FILE_TITLE, FILE_FORMAT, FILE_DESCRIPTION, resJson.getBytes());
    }

    /**
     * Копирует все данные из таблицы tbl_sys_keyvaluestorage
     * формирует мапку [namespace : [key : value]], и в формате json
     * прикрепляет к атрибуту компании
     */
    def copyAllKeyValueStorageToFile()
    {
        def resQuery = executeQuery(GET_ALL_KEY_VALUE_STORAGE_SQL);
        processQueryResult(resQuery);
        log('success copyAllSpaceKeyValueStorage');
    }

    /**
     * Считывает все ключи и значения из указанных неймспейсов keyValue хранилища
     * и либо выводит их в консоль, либо сохраняет в файл
     * @param nameSpaces список неймспейсов для копирования
     * @param outToConsole флаг, true - выводим в консоль, иначе - в файл
     */
    def getNameSpacesKeyValueFromStorage(def nameSpaces = [], def outToConsole = false)
    {
        def sqlQuery = GET_ALL_KEY_VALUE_STORAGE_SQL;
        if (nameSpaces)
        {
            sqlQuery = """SELECT name_space, key_, value
                      FROM tbl_sys_keyvaluestorage
                      WHERE name_space IN ('${ nameSpaces.join("','") }')
        """;
        }

        def resQuery = executeQuery(sqlQuery);
        processQueryResult(resQuery, outToConsole);
        log("success copy ${nameSpaces ? nameSpaces.join(', ') : 'all'} namespaces KeyValueStorage");
    }

    /**
     * Обновляет keyValue Storage данными из файла
     * @param file - файл в формате json Например: [namespace : [key : value]]
     * @param nameSpaces - список неймспейсов для обновления, если не указан - обновляем всё
     */
    def updateDataInKeyValueStorageFromFile(def file, def nameSpaces = [])
    {
        JsonSlurper jsonSlurper = new JsonSlurper()
        def storageRows = jsonSlurper.parseText(new String(api.utils.readFileContent(file)));
        def total = storageRows.get('dashboards')?.size()
        log(storageRows.values().getAt(0).keySet().size())
        def counter = 1;
        for (def namespaceForUpdate : storageRows.keySet())
        {
            if (nameSpaces && !(namespaceForUpdate in nameSpaces))
            {
                //Задан список неймспейсов и текущего нет в этом списке - пропускаем
                log("Неймспейс ${namespaceForUpdate} отсутствует в списке указанных для обновления и будет пропущен!");
                continue;
            }
            def mapInItteration = storageRows.get(namespaceForUpdate);
            for (def keyForUpdate : mapInItteration.keySet())
            {
                def newValue = mapInItteration.get(keyForUpdate);
                /**
                 * Воспользовался SQL, т.к. если попробовать взять значение по ключу, то там может оказаться NULL
                 * и тогда не понятно был ли такой ключ в неймспейсе и значение по нему было равно NULL или
                 * такого ключа не было.
                 */
                log("update ${counter++}/${total}")
                def query = String.format(getCheckOnExistSQL(), namespaceForUpdate, keyForUpdate);
                def currentValue = api.tx.call { executeQuery(query) };
                def resultPut = api.keyValue.put(namespaceForUpdate, keyForUpdate, newValue);
                if (!resultPut)
                {
                    log("ERROR put new value = ${newValue} by key = ${keyForUpdate} in namespace = ${namespaceForUpdate}");
                }
                if (resultPut && currentValue.size() != 0  && !currentValue.getAt(0).equals(newValue))
                {
                    log("In namespace = ${namespaceForUpdate} by key = ${keyForUpdate} new value = ${newValue}")
                }
            }
        }
    }

    //Определение типа БД
    static String getCheckOnExistSQL()
    {
        if (DDLTool.isMSSQL())
        {
            return CHECK_ON_EXIST_FOR_MSSQL;
        }
        else
        {
            return CHECK_ON_EXIST_UNIVERSAL_SQL;
        }
    }

    def executeQuery(def query)
    {
        def sessionFactory = beanFactory.getBean("sessionFactory")
        return sessionFactory.getCurrentSession().createSQLQuery(query).list()
    }

    /**
     * Метод компиляции  модулей в нужном порядке
     * @param codeApp - код встроенного приложения (необходимо указать для лицензионной версии)
     */
    void compileModules(String codeApp = null)
    {
        def scriptService = beanFactory.getBean('scriptServiceImpl')
        List<String> modules = [
            'dashboardCommon',
            'dashboardErrorHandler',
            'dashboardMarshaller',
            'dashboardFormulaCalculator',
            'dashboardQueryWrapper',
            'dashboardSettings',
            'dashboardDataSet',
            'dashboardDrilldown',
            'dashboards',
            'dashboardSendEmail',
            'dashboardConfig'
        ]
        // У встроенного приложения с лицензией код модуля формируется по шаблону: "КодВП_КодМодуля"
        if (codeApp)
        {
            modules = modules.collect { "${codeApp}_${it}".toString() }
        }
        scriptService.reloadModules(modules)
    }

    /**
     * Метод получения ключей дашбордов
     * @param objName - название объекта
     * @param namespace - название неймспейса
     * @return массив из ключей дашбордов
     */
    List getDashboardKeys(String objName, String namespace)
    {
        def slurper = new JsonSlurper()

        return api.keyValue.find(namespace, '') { key, value ->
            def settings = slurper.parseText(value)
            settings.containsKey(objName)
        }.keySet().toList()
    }

    /**
     * Метод получения ключей необходимых объектов
     * @param objName - название объекта
     * @param namespace - название неймспейса
     * @return массив из ключей объектов
     */
    private List getObjectKeys(String objName, String namespace)
    {
        def slurper = new JsonSlurper()

        return api.keyValue.find(namespace, '') { key, value ->
            def settings = slurper.parseText(value)
            return settings != null && settings.containsKey(objName)
        }.values().collectMany { el ->
            return el ? slurper.parseText(el)?.get(objName) : null
        }
    }

    /**
     * Метод получения ключей и значений необходимых объектов
     * @param objKeys - список ключей объекта
     * @param namespace - название неймспейса
     * @return ассоциативный массив из ключей и значений необходимых объектов
     */
    private def getMapForObject(List objKeys, String namespace)
    {
        return objKeys.findResults { key ->
            def value = api.keyValue.get(namespace, key)
            return value ? [(key): value] : null
        }.collectEntries()
    }

    /**
     * Метод разделения неймспейсов для дашбордов, виджетов, кастомных группировок
     * (необходим для перехода на версию выше 4)
     */
    private void migrateWidgetsSettingsInSeparateNamespaces()
    {
        List keysForWidgets = getObjectKeys("widgetIds", DASHBOARD_NAMESPACE)
        def widgetsMap = getMapForObject(keysForWidgets, DASHBOARD_NAMESPACE)
        logger.info("full count of widgets - ${ keysForWidgets.size() } | " +
                    "count of not null widgets - ${ widgetsMap.size() }")

        List keysForGroups = getObjectKeys("customGroupIds", DASHBOARD_NAMESPACE)
        def groupsMap = getMapForObject(keysForGroups, DASHBOARD_NAMESPACE)
        logger.info("full count of groups - ${ keysForGroups.size() } | " +
                    "count of not null groups - ${ groupsMap.size() }")

        // Размещение виджетов и кастомных группировок в отдельные неймспейсы.
        List putWidgetsResults = widgetsMap.collect { key, value ->
            api.keyValue.put(WIDGET_NAMESPACE, key, value)
        }
        logger.info(
            "count of widgets to put: ${ widgetsMap.size() } | " +
            "successfull puted: ${ putWidgetsResults.findAll { x -> x == true }.size() }, " +
            "not deleted ${ putWidgetsResults.findAll { x -> x == false }.size() } "
        )
        List putGroupsResults = groupsMap.collect { key, value ->
            api.keyValue.put(CUSTOM_GROUP_NAMESPACE, key, value)
        }
        logger.info(
            "count of groups to put: ${ groupsMap.size() } | " +
            "successfull puted: ${ putGroupsResults.findAll { x -> x == true }.size() }, " +
            "not deleted ${ putGroupsResults.findAll { x -> x == false }.size() } "
        )

        // Удаление виджетов и кастомных группировок из DASHBOARD_NAMESPACE
        Set keysForDashboards = getDashboardKeys("widgetIds", DASHBOARD_NAMESPACE)
        Set allKeys = api.keyValue.find(DASHBOARD_NAMESPACE, '', { key, value -> true }).keySet()
        Set notDashboards = allKeys - keysForDashboards
        logger.info(
            "total count of objects in dashboards: ${ allKeys.size() }; " +
            "count of dashboars: ${ keysForDashboards.size() } ; " +
            "count of others : ${ notDashboards.size() }"
        )
        List deleteResults = notDashboards.collect { key ->
            api.keyValue.delete(DASHBOARD_NAMESPACE, key)
        }
        logger.info(
            "count of objects to delete: ${ notDashboards.size() } | " +
            "successfull deleted: ${ deleteResults.findAll { x -> x == true }.size() }, " +
            "not deleted ${ deleteResults.findAll { x -> x == false }.size() }"
        )
    }

    /**
     * Метод по удалению значений из хранилища
     * @param valuesIds - индексы значений
     * @param namespace - хранилище
     */
    private void deleteValuesInOldNameSpaces(List valuesIds, String namespace)
    {
        valuesIds.each { id ->
            if (api.keyValue.delete(namespace, id))
            {
                logger.info("object with id: ${ id } was deleted successfully")
            }
            else
            {
                logger.info("object with id: ${ id } wasn't deleted")
            }
        }
    }

    /**
     * Метод перемещения виджетов и кастомных группировок непосредственно к их дашбордам
     * (необходим для перехода на версию выше 8)
     */
    private void migrateWidgetsIntoDashboards()
    {
        // checkAttributeExisting() возвращает строку c описанием ошибки, если атрибут НЕ найден
        Boolean keyValueDataAttrNotExists = api.metainfo.checkAttributeExisting(ROOT_CLASS_CODE,
                                                                                KEY_VALUE_STORAGE_ATTR_CODE)
        if (keyValueDataAttrNotExists)
        {
            throw new Exception(
                'Бэкап создать невозможно. Обратитесь к администратору для создания нужных атрибутов.'
            )
        }
        else
        {
            // Создаём актуальный бэкап
            copyAllKeyValueStorageToFile()

            List dashboardKeys = getDashboardKeys('widgetIds', DASHBOARD_NAMESPACE)

            dashboardKeys.each { dashboardKey ->
                def slurper = new JsonSlurper()
                def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
                dashboardSettings = dashboardSettings ? slurper.parseText(dashboardSettings) : null

                if (dashboardSettings)
                {
                    List widgetKeys = dashboardSettings.widgetIds
                    logger.info("full count of widgets - ${ widgetKeys?.size() } " +
                                "on dashboard ${ dashboardKey }")

                    dashboardSettings.widgets = widgetKeys?.findResults { widgetKey ->
                        return api.keyValue.get(WIDGET_NAMESPACE, widgetKey)
                    }

                    List customGroupKeys = dashboardSettings.customGroupIds
                    logger.info("full count of groups - ${ customGroupKeys?.size() } " +
                                "on dashboard ${ dashboardKey }")

                    dashboardSettings.customGroups = customGroupKeys?.findResults { customGroupKey ->
                        return api.keyValue.get(CUSTOM_GROUP_NAMESPACE, customGroupKey)
                    }

                    Boolean dashboardUpdated = false
                    Boolean anyWidgetsAndGroupsInKeyValueStorage = (
                        dashboardSettings.widgets || dashboardSettings.customGroups)
                    Boolean dashboardFormatIsOld = !dashboardSettings.keySet().any {
                        it == NEW_DASHBOARD_FIELD_FOR_WIDGETS || it == NEW_DASHBOARD_FIELD_FOR_GROUPS
                    }

                    // Сохранение, если дашборд старый, виджетов и групп нет, но поля добавить нужно,
                    // или, если виджеты или группы нашлись для дашборда
                    if (anyWidgetsAndGroupsInKeyValueStorage ||
                        (!anyWidgetsAndGroupsInKeyValueStorage && dashboardFormatIsOld))
                    {
                        dashboardUpdated = api.keyValue.put(
                            DASHBOARD_NAMESPACE,
                            dashboardKey,
                            toJson(dashboardSettings)
                        )
                    }

                    if (dashboardUpdated)
                    {
                        logger.info("dashboard with dashboardKey ${ dashboardKey } was updated success")
                        deleteValuesInOldNameSpaces(widgetKeys, WIDGET_NAMESPACE)
                        deleteValuesInOldNameSpaces(customGroupKeys, CUSTOM_GROUP_NAMESPACE)
                    }
                    else
                    {
                        logger.info("dashboard with dashboardKey ${ dashboardKey } wasn't updated")
                    }
                }
                else
                {
                    logger.info("dashboard with dashboardKey ${ dashboardKey } has no settings")
                }
            }
        }
    }

    /**
     * Метод определения признака, что есть данные приложения "Дашборды",
     * сохраненные в версии выше 4, но ниже 9
     * @return истина, если версия хранения данных от 5 до 8 включительно
     */
    private boolean isVersionFrom5To8()
    {
        List dashboardKeys = getDashboardKeys('widgetIds', DASHBOARD_NAMESPACE)
        def slurper = new JsonSlurper()

        for (key in dashboardKeys)
        {
            def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, key)
            dashboardSettings = dashboardSettings ? slurper.parseText(dashboardSettings) : null

            if (dashboardSettings)
            {
                List widgetKeys = dashboardSettings.widgetIds
                boolean isWidgetKeyInNamespace = widgetKeys?.findResult { k ->
                    api.keyValue.get(WIDGET_NAMESPACE, k)
                }

                List customGroupKeys = dashboardSettings.customGroupIds
                boolean isCustomGroupsInNamespace = customGroupKeys?.findResult { k ->
                    api.keyValue.get(CUSTOM_GROUP_NAMESPACE, k)
                }

                // Истина, если найден хоть один виджет или кастомная группировка в отдельных неймспейсах
                if (isWidgetKeyInNamespace || isCustomGroupsInNamespace)
                {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Метод определения признака, что есть данные приложения "Дашборды", сохраненные в версии ниже 5
     * @return истина, если версия хранения данных ниже 5
     */
    private boolean isVersionLessThan5()
    {
        List keysWidgets = getObjectKeys('widgetIds', DASHBOARD_NAMESPACE)
        boolean isWidgetsInNamespace = keysWidgets.findResult { k ->
            api.keyValue.get(DASHBOARD_NAMESPACE, k)
        }

        List keysGroups = getObjectKeys('customGroupIds', DASHBOARD_NAMESPACE)
        boolean isCustonGroupsInNamespace = keysGroups.findResult { k ->
            api.keyValue.get(DASHBOARD_NAMESPACE, k)
        }

        // Истина, если найден хоть один виджет или кастомная группировка в DASHBOARD_NAMESPACE
        return (isWidgetsInNamespace || isCustonGroupsInNamespace)
    }

    /**
     * Метод определения признака, что есть данные приложения "Дашборды", сохраненные в версии выше 8
     * @return истина, если версия хранения данных выше 8
     */
    private boolean isVersionGreaterThan8()
    {
        List dashboardKeys = getDashboardKeys('widgetIds', DASHBOARD_NAMESPACE)
        def slurper = new JsonSlurper()

        for (key in dashboardKeys)
        {
            def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, key)
            dashboardSettings = dashboardSettings ? slurper.parseText(dashboardSettings) : null

            if (dashboardSettings)
            {
                // Истина, если найден хоть один виджет или кастомная группировка внутри дашборда
                Boolean isNewVersion = dashboardSettings.keySet().any {
                    it == NEW_DASHBOARD_FIELD_FOR_WIDGETS || it == NEW_DASHBOARD_FIELD_FOR_GROUPS
                }
                if(isNewVersion)
                {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Метод проверки и обновления версий хранения данных приложения "Дашборды"
     */
    void checkVersionAndUpdateWidgetsAndCustomGroups()
    {
        final String NAME_PACKAGE = 'ru.naumen.modules.dashboards'
        final String VERSION_START_TOKENS = '1_0_'

        String str = this.getClass().getPackage().getName()
        if (str == NAME_PACKAGE)
        {
            logger.info('Сборка без лицензии, нет возможности определить версию')
            return
        }
        String licInfo = str - NAME_PACKAGE - '_v'

        // Требуемая версия выше 1.0.хх (2.0.0 и выше): проводим обе миграции данных по очереди.
        if (licInfo.substring(0, 4) != VERSION_START_TOKENS)
        {
            if (isVersionLessThan5())
            {
                migrateWidgetsSettingsInSeparateNamespaces()
            }
            if (isVersionFrom5To8())
            {
                migrateWidgetsIntoDashboards()
            }
            return
        }

        // Вычисляем в строке версии третий токен 1.0.x
        licInfo -= VERSION_START_TOKEN
        def tokens = licInfo.tokenize('_')
        Integer versionDataNeeds = tokens[0].toInteger()

        // Первая "миграция" хранения данных
        if ((versionDataNeeds > 4) && isVersionLessThan5())
        {
            migrateWidgetsSettingsInSeparateNamespaces()
        }

        // Вторая "миграция" хранения данных
        if ((versionDataNeeds > 8) && isVersionFrom5To8())
        {
            migrateWidgetsIntoDashboards()
        }
    }

    /**
     * Включить/выключить системную группу для приложения "Дашборды"
     * @param isTurnOn - флаг установки системной группы (по умолчанию true)
     */
    void setDashboardMasterGroupEnabled(boolean isTurnOn = true)
    {
        beanFactory.getBean(FEATURE_CONFIGURATION).setDashboardMasterGroupEnabled(isTurnOn)
    }

    /**
     * Посмотреть текущий статус системной группы для приложения "Дашборды"
     * @return признак того, включена ли системная группа
     */
    boolean isDashboardMasterGroupEnabled()
    {
        return beanFactory.getBean(FEATURE_CONFIGURATION).isDashboardMasterGroupEnabled()
    }

    /**
     * Настройка обновления значения статуса счетчика в БД
     * @param delayMs время в миллисекундах (если нет нагрузки на стенд, лучше выставить 10 мс)
     */
    void setTimerStatusChangeDelay(Integer delayMs = 10)
    {
        beanFactory.getBean(CONFIGURATION_PROPERTIES).setTimerStatusChangeHandlerEnable(true)
        beanFactory.getBean(CONFIGURATION_PROPERTIES).setTimerStatusChangeDelay(delayMs)
    }

    /**
     * Актуализация состояния счетчиков
     */
    void updateAllBackTimerStates()
    {
        api.attrs.updateAllBackTimerStates()
    }

    /**
     * Включение настройки обновления счетчиков на стенде
     * @param isSetTimerRefresh - флаг установки режима обновления (по умолчанию "true")
     */
    void setTimerStatusRefreshEnable(boolean isSetTimerRefresh = true)
    {
        beanFactory.getBean(CONFIGURATION_PROPERTIES).setTimerStatusRefreshEnable(isSetTimerRefresh)
    }

    /**
     * Обновляет дескрипторы виджетов у дашбордов в хранилище с применения uuid на применение code
     */
    void setCodeInsteadOfUuidInDashboardsSettings()
    {
        List dashboardKeys = getDashboardKeys('widgets', DASHBOARD_NAMESPACE)

        dashboardKeys.each { dashboardKey ->
            def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
            DashboardSettingsClass dashboard
            try
            {
                dashboard = Jackson.fromJsonString(dashboardSettings, DashboardSettingsClass)
            }
            catch (Exception ex)
            {
                dashboard = null
                logger.error('Дашборд не был обновлен: ' + dashboardKey)
            }
            if(dashboard)
            {
                dashboard.widgets = dashboard.widgets?.findResults { w ->
                    def widget = DashboardUtils.convertWidgetToNewFormat(w)
                    if(widget)
                    {
                        if(widget.type == DiagramType.TEXT)
                        {
                            return widget
                        }
                        else
                        {
                            try
                            {
                                return DashboardUtils.updateDescriptorWithCodeAndUuid(widget, false)
                            }
                            catch (Exception ex)
                            {
                                logger.error('Виджет не был обновлен: ' + dashboardKey + ' ключ виджета: ' + widget?.id)
                                return widget
                            }
                        }
                    }
                }
                api.keyValue.put(DASHBOARD_NAMESPACE, dashboardKey, Jackson.toJsonString(dashboard))
            }
        }
    }

    /**
     * Метод получения ошибок по дашбордам
     * @return маппинг ключей дашбордов и текст ошибки
     */
    Map<String, Map> getDashboardErrorsData()
    {
        List dashboardKeys = getDashboardKeys('widgets', 'dashboards')
        Map dashboardErrorsData = [:]

        dashboardKeys.each { dashboardKey ->
            String dashboardSettings = api.keyValue.get('dashboards', dashboardKey)
            try
            {
                Jackson.fromJsonString(dashboardSettings, DashboardSettingsClass)
            }
            catch (Exception e)
            {
                Map dashboardErrorData = [
                    'cause': e.cause.message,
                    'dashboard': api.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)
                ]
                dashboardErrorsData[dashboardKey] = dashboardErrorData
            }
        }

        return dashboardErrorsData
    }
}
