/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Бекенд для работы с настройками встроенного приложения "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль
package ru.naumen.modules

import groovy.json.JsonSlurper
import groovy.transform.Field
import groovy.transform.TupleConstructor

import static groovy.json.JsonOutput.toJson

//region КОНСТАНТЫ
//TODO: хорошему нужно разделить на несколько пространств для настроек: виджетов, кастомных группировок, дашбордов
@Field private static final String DASHBOARD_NAMESPACE = 'dashboards'
@Field private static final String CUSTOM_GROUP_NAMESPACE = 'custom_groups'
@Field private static final String WIDGET_NAMESPACE = 'widgets'
@Field private static final String GROUP_MASTER_DASHBOARD = 'MasterDashbordov'
@Field private static final String ROLE_SUPERUSER = 'ROLE_SUPERUSER'
//endregion

//region КЛАССЫ
/**
 * Модель настроек дашборда в бд
 */
@TupleConstructor
class DashboardSettings
{
    AutoUpdate autoUpdate
    Collection<String> widgetIds = []
    Collection<String> customGroupIds = []
}

/**
 * Модель сущности автообновления
 */
class AutoUpdate
{
    private boolean enabled
    int interval

    AutoUpdate(Map map)
    {
        this.enabled = map.enabled as boolean
        this.interval = map.interval as int
    }

    AutoUpdate(int interval)
    {
        this.enabled = true
        this.interval = interval
    }

    void disable()
    {
        this.enabled = false
    }
    void enable()
    {
        this.enabled = true
    }

    void setEnabled(boolean enabled)
    {
        //NOP
    }
}

/**
 * Модель тело ответа - настроек виджета
 */
@TupleConstructor
class WidgetSettings
{
    String key
    Map<String, Object> value
}
//endregion

//region REST-МЕТОДЫ
/**
 * Получение настроек дашборда и виджетов
 * @param requestContent - параметры запроса (classFqn, contentCode, isPersonal)
 * @param user        - БО текущего пользователя
 * @return настройки автообновления вместе с настройками виджетов
 */
String getSettings(Map<String, Object> requestContent, def user)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    Boolean isPersonal = requestContent.isPersonal
    if(isPersonal && !user?.login)
    {
        throw new Exception("Login is null, not found personal dashboard")
    }
    Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(classFqn, contentCode)

    def defaultDashboard = getSettingByLogin()
    def personalDashboard = getSettingByLogin(user?.login as String)
    def result
    if (isPersonal) {
        result = personalDashboard ? [
                autoUpdate   : personalDashboard?.autoUpdate,
                widgets      : personalDashboard?.widgetIds?.findResults(this.&getWidgetSettings) ?: [],
                customGroups : personalDashboard?.customGroupIds?.collectEntries {
                    key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE) )]
                } + defaultDashboard?.customGroupIds?.collectEntries {
                    key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE))]
                }
        ] : [
                autoUpdate   : defaultDashboard?.autoUpdate,
                widgets      : defaultDashboard?.widgetIds?.findResults(this.&getWidgetSettings) ?: [],
                customGroups : defaultDashboard?.customGroupIds?.collectEntries {
                    key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE))]
                }
        ]
    } else {
        result = [
                autoUpdate   : defaultDashboard?.autoUpdate,
                //TODO: из-за архитектурной особенности возможны ситуации при которых настройки виджета пропадут.
                // В таких случаях просто пропускаем пустые настройки
                // ключи виджетов с пустыми настройками будут удалены после сброса настроек.
                // Пользователь этого даже не заметит
                widgets      : defaultDashboard?.widgetIds?.findResults(this.&getWidgetSettings) ?: [],
                customGroups : defaultDashboard?.customGroupIds?.collectEntries {
                    key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE))]
                }
        ]
    }
    return toJson(result)
}

/**
 * Метод обновления состояния автообновления
 * @param requestContent - тело запроса (classFqn, contentCode, autoUpdate)
 * @param user           - БО текущего пользователя
 * @return true|false
 */
String saveAutoUpdateSettings(Map<String, Object> requestContent, def user) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    def autoUpdate = requestContent.autoUpdate as AutoUpdate
    boolean isPersonal = requestContent.isPersonal
    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)
    def settings = getDashboardSetting(personalDashboardKey)
            ?: getDashboardSetting(defaultDashboardKey)
            ?: new DashboardSettings()
    settings.autoUpdate = autoUpdate
    return saveJsonSettings(isPersonal ? personalDashboardKey : defaultDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
}

/**
 * Метод сохранения настроек кастомных группировок.
 * Сохраняет в персональный дашборд.
 * @param requestContent - тело запроса
 * @param user - пользователь
 * @return ключь кастомной группировки
 */
String saveCustomGroup(Map<String, Object> requestContent, def user) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    boolean isPersonal = requestContent.isPersonal
    def group = requestContent.group as Map<String, Object>
    if (isPersonal && !(user.login)) throw new Exception("Login is null, not found personal dashboard")

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    String keyCustomGroup = UUID.nameUUIDFromBytes(toJson(group).bytes)
    String jsonCustomGroup = toJson(group + [id: keyCustomGroup])

    if (!saveJsonSettings(keyCustomGroup, jsonCustomGroup, CUSTOM_GROUP_NAMESPACE)) throw new Exception("Custom group settings not saved!")

    Closure<String> saveDashboard = { String dashboardKey, DashboardSettings settings ->
        if (saveJsonSettings(dashboardKey, toJson(settings), DASHBOARD_NAMESPACE)) {
            return keyCustomGroup
        } else {
            throw new Exception("Dashboard settings not saved!")
        }
    }

    if (isPersonal) {
        def dashboard = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
        dashboard.customGroupIds += keyCustomGroup
        saveDashboard(personalDashboardKey, dashboard)
    } else {
        def dashboard = getDashboardSetting(defaultDashboardKey) ?: new DashboardSettings()
        dashboard.customGroupIds += keyCustomGroup
        saveDashboard(defaultDashboardKey, dashboard)
    }
}

String updateCustomGroup(Map<String, Object> requestContent, def user) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String groupKey = requestContent.groupKey
    boolean isPersonal = requestContent.isPersonal
    def group = requestContent.group
    if (isPersonal && !(user.login)) throw new Exception("Login is null, not found personal dashboard")
    if (!group) throw new IllegalArgumentException("Group settings is null!")

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    def dashboard = isPersonal ? getDashboardSetting(personalDashboardKey) : getDashboardSetting(defaultDashboardKey)

    if (groupKey in dashboard.customGroupIds) {
        if (saveJsonSettings(groupKey, toJson(group), CUSTOM_GROUP_NAMESPACE)) {
            return groupKey
        } else {
            throw new Exception("Custom group settings not saved!")
        }
    } else {
        throw new Exception("group not contains in dashboard")
    }
}

/**
 * Метод удаления настроек группировки.
 * @param requestContent - тело запроса
 * @param user - пользователь
 * @return ключь кастомной группировки
 */
String deleteCustomGroup(Map<String, Object> requestContent, def user) {
    //TODO: изменить
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String groupKey = requestContent.groupKey
    boolean isPersonal = requestContent.isPersonal
    if (isPersonal && !(user.login)) throw new Exception("Login is null, not found personal dashboard")

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    def dashboard = isPersonal ? getDashboardSetting(personalDashboardKey) : getDashboardSetting(defaultDashboardKey)

    if (groupKey in dashboard.customGroupIds) {
        if (deleteJsonSettings(groupKey, CUSTOM_GROUP_NAMESPACE)) {
            dashboard.customGroupIds -= groupKey
            if (saveJsonSettings(personalDashboardKey, toJson(dashboard), DASHBOARD_NAMESPACE)) {
                return groupKey
            } else {
                throw new Exception("Dashboard settings not saved!")
            }
        } else {
            throw new Exception("group settings not removed!")
        }
    } else {
        throw new Exception("group not contains in dashboard")
    }
}

/**
 * Метод включение автообновлений дашборда
 * @param requestContent - параметры запроса (classFqn, contentCode, interval)
 * @param user           - БО текущего пользователя
 * @return true|false
 */
String enableAutoUpdate(Map<String, Object> requestContent, def user)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    int interval = requestContent.interval as int

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)
    def settings = getDashboardSetting(personalDashboardKey)
            ?: getDashboardSetting(defaultDashboardKey)
            ?: new DashboardSettings()
    //Этой настройки может и не быть
    settings.autoUpdate = new AutoUpdate(interval)
    return saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
}

/**
 * Метод отключения автообновлений дашборда
 * @param requestContent - параметры запроса (classFqn, contentCode)
 * @param user           - БО текущего пользователя
 * @return true|false
 */
String disableAutoUpdate(Map<String, Object> requestContent, def user)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)
    def settings = getDashboardSetting(personalDashboardKey)?: getDashboardSetting(defaultDashboardKey)
    if (!settings) throw new Exception("Not found dashboard settings: $defaultDashboardKey")
    settings.autoUpdate?.disable()
    return saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
}

/**
 * Метод создания персонального дашборда.
 * @param requestContent - тело запроса (editable, classFqn, contentCode)
 * @param user - пользователь
 * @return true|false
 */
String createPersonalDashboard(Map<String, Object> requestContent, def user)
{
    checkRightsOnEditDashboard(requestContent.editable)
    if(!user?.login)
    {
        throw new Exception("Login or user should not be null")
    }
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)
    def settings = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
    return saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
}

/**
 * Создание виджета в дашборде
 * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
 * @param user БО текущего пользователя
 * @return ключ созданного виджета
 */
String createWidget(Map<String, Object> requestContent, def user)
{
    validateName(requestContent)
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    def widget = requestContent.widget
    boolean isPersonal = requestContent.isPersonal
    DashboardSettings dashboardSettings = null
    String dashboardKey = null
    if(isPersonal)
    {
        checkRightsOnEditDashboard(requestContent.editable)
        if(!user?.login)
        {
            throw new Exception("Login or user should not be null by personal widget")
        }
        Closure createDashboardKeyFromLogin = this.&generateDashboardKey.curry(classFqn, contentCode)
        dashboardKey = createDashboardKeyFromLogin(user.login as String)
        dashboardSettings = getDashboardSetting(dashboardKey)
                ?: getDashboardSetting(createDashboardKeyFromLogin(null))
    }
    else
    {
        checkRightsOnDashboard(user, "create")
        dashboardKey = generateDashboardKey(classFqn, contentCode)
        dashboardSettings = getDashboardSetting(dashboardKey)
                ?: new DashboardSettings()
    }

    def generateKey = this.&generateWidgetKey.curry(
            dashboardSettings.widgetIds,
            classFqn,
            contentCode,
            isPersonal ? user?.login as String : null)

    return saveWidgetSettings(widget, generateKey).with { key ->
        dashboardSettings.widgetIds += key
        saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
        toJson(key)
    }
}

/**
 * Редактирование виджета в дашборде
 * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
 * @param user БО текущего пользователя
 * @return ключ отредактированного виджета
 */
String editWidget(Map<String, Object> requestContent, def user)
{
    def widget = requestContent.widget
    String widgetKey = widget.id
    validateName(requestContent, widgetKey)
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    if(requestContent.isPersonal as boolean)
    {
        checkRightsOnEditDashboard(requestContent.editable)
        Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(classFqn, contentCode)
        if (user && isPersonalWidget(widgetKey, user))
        {
            return saveWidgetSettings(widget) { widgetKey }
        }
        else
        {
            DashboardSettings dashboardSettings = getSettingByLogin(user.login as String) ?: getSettingByLogin(null)
            String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user.login as String)
            def generateKey = this.&generateWidgetKey.curry(dashboardSettings.widgetIds,
                    classFqn,
                    contentCode,
                    user.login as String,
                    widgetKey)
            return saveWidgetSettings(widget, generateKey).with { key ->
                dashboardSettings.widgetIds = dashboardSettings.widgetIds - widgetKey + key
                if (!saveJsonSettings(personalDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE))
                {
                    throw new Exception("Widget $key not saved in dashboard $personalDashboardKey")
                }
                toJson(key)
            }
        }
    }
    else
    {
        checkRightsOnDashboard(user, "edit")
        if (user && isPersonalWidget(widgetKey, user))
        {
            widgetKey -= "_${user.login}"
            def closureReplaceWidgetKey = { String login ->
                String dashboardKey = generateDashboardKey(
                        classFqn,
                        contentCode,
                        login)
                DashboardSettings dashboardSettings = getDashboardSetting(dashboardKey)
                dashboardSettings.widgetIds.remove(widgetKey)
                if (!(widgetKey in dashboardSettings.widgetIds))
                {
                    dashboardSettings.widgetIds << widgetKey
                }
                saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
            }
            closureReplaceWidgetKey(user.login as String)
            closureReplaceWidgetKey(null)
            deleteJsonSettings(widgetKey, WIDGET_NAMESPACE)
        }
        def widgetDb = setUuidInSettings(widget, widgetKey)
        saveJsonSettings(widgetKey, toJson(widgetDb), WIDGET_NAMESPACE)
        return toJson(widgetKey)
    }
}

/**
 * Массовое редактирование виджетов в дашборде
 * @param requestContent - тело запроса ()
 * @param user БО текущего пользователя
 * @return список ключей отредактированнных виджетов
 */
String editLayouts(Map<String, Object> requestContent, def user)
{
    def  layouts = requestContent.layouts as List<Map>
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    boolean isPersonal = requestContent.isPersonal

    String dashboardKey = isPersonal
            ? generateDashboardKey(classFqn, contentCode, user.login as String)
            : generateDashboardKey(classFqn, contentCode)
    def settings = getDashboardSetting(dashboardKey)

    def widgetKeySet = layouts.collect { Map layoutSetting ->
        String widgetKey = layoutSetting.key
        def value = layoutSetting.value
        if (value) {
            if (widgetKey in settings.widgetIds) {
                def widgetSettings = getWidgetSettings(widgetKey)
                widgetSettings.layout = value
                if (saveJsonSettings(widgetKey, toJson(widgetSettings), WIDGET_NAMESPACE)) {
                    return widgetKey
                } else {
                    throw new IllegalStateException("Widget $widgetKey not saved in dashboard: $dashboardKey")
                }
            } else {
                logger.warn("Widget $widgetKey not belongs dashboard $dashboardKey")
                return null
            }
        } else {
            String message = "Empty layout settings from widget: $widgetKey"
            logger.error(message)
            throw new IllegalArgumentException(message)
        }
    }
    return widgetKeySet
}

/**
 * Метод удаления виджета
 * @param requestContent - тело запроса (classFqn, contentCode, widgetId, editable, isPersonal)
 * @param user           - пользователь
 * @return успех | провал
 */
String deleteWidget(Map<String, Object> requestContent, def user)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String widgetId = requestContent.widgetId
    if(requestContent.isPersonal)
    {
        return deletePersonalWidget(classFqn, contentCode, widgetId, requestContent.editable as Boolean, user)
    }
    else
    {
        return deleteDefaultWidget(classFqn, contentCode, widgetId, user)
    }
}

/**
 * Сброс персонального дашборда в дашборд по умолчанию
 * @param classFqn    - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param user        - БО текущего пользователя
 * @return статус сообщение
 */
String deletePersonalDashboard(String classFqn, String contentCode, def user)
{
    //TODO: добавить локализацию в дальнейшем
    if (!user) throw new Exception([message: "Super-user can't reset dashboard settings!"])
    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user.login as String)
    DashboardSettings personalDashboard = getDashboardSetting(personalDashboardKey)
    return personalDashboard ? deleteJsonSettings(personalDashboardKey, DASHBOARD_NAMESPACE).with { resultOfRemoving ->
        if (resultOfRemoving)
        {
            personalDashboard.widgetIds
                    .findAll(this.&isPersonalWidget.ncurry(1, user))
                    .each(this.&deleteJsonSettings.ncurry(1, WIDGET_NAMESPACE))
            return toJson([status: "OK", message: "Установлены настройки по умолчанию"])
        }
        else
        {
            logger.warn("Personal dashboard: $personalDashboardKey not found!")
            return toJson([status: "ERROR", message: "Не удалось сбросить настройки. Попробуйте позже"])
        }
    } : toJson([status: "OK", message: "Установлены настройки по умолчанию"])
}

/**
 * Получение данных о пользователе для дашборда
 * @param requestContent - параметры запроса (classFqn, contentCode)
 * @param user БО текущего пользователя
 * @return параметры пользователя
 */
String getUserData(Map<String, Object> requestContent, def user)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String groupUser = getUserGroup(user)
    Boolean hasPersonalDashboard = user && getDashboardSetting(classFqn, contentCode, user.login as String)
    return toJson([groupUser: groupUser, hasPersonalDashboard: hasPersonalDashboard])
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Метод удаления виджета с дашборда. Бросает исключение если удаление не удалось.
 * @param dashboardKey - уникальный идентификатор дашборда
 * @param widgetKey    - уникальный идентификатор виджета
 * @return уникальный идентификатор удалённого дашборда
 */
private String removeWidgetFromDashboard(String dashboardKey, String widgetKey)
{
    if (!excludeWidgetsFromDashboard(dashboardKey, [widgetKey]))
    {
        throw new Exception("Widget $widgetKey not removed from dashboard: $dashboardKey!")
    }
    return dashboardKey
}

/**
 * Метод удаления настроек виджета. Бросает исключение если удаление не удалось.
 * @param widgetKey - уникальный идентификатор виджета
 * @return уникальный идентификатор удалённого виджета
 */
private String removeWidgetSettings(String widgetKey)
{
    if (!deleteJsonSettings(widgetKey, WIDGET_NAMESPACE))
    {
        throw new Exception("widget settings $widgetKey not removed!")
    }
    return widgetKey
}

/**
 * Метод исключение виджетов из настрок дашборда
 * @param dashboardKey - уникальный идентификатор дашборда
 * @param widgets      - уникальные идентификаторы виджетов
 * @return успех|провал
 */
private boolean excludeWidgetsFromDashboard(String dashboardKey, Collection<String> widgets)
{
    def dashboardSettings = getDashboardSetting(dashboardKey)
    if (!dashboardSettings)
    {
        throw new Exception("Dashboard: $dashboardKey not found!")
    }
    dashboardSettings.widgetIds -= widgets
    return saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
}

/**
 * Метод сохранения виджета. В случае неудачи, бросает исключение
 * @param settings     - настройки виджета
 * @param generateCode - метод генерации ключа виджета
 * @return сгенерированнй ключ нового виджета
 */
private String saveWidgetSettings(Map settings, Closure<String> generateCode) {
    String key = generateCode()
    if(!saveJsonSettings(key, toJson(setUuidInSettings(settings, key)), WIDGET_NAMESPACE)) {
        throw new Exception("Widget $key not saved!")
    }
    return key
}

/**
 * Генерация ключа для сохранения настроек виджета
 * @param keys существующие ключи
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param login логин пользователя или пустое значение если сохранение по умолчанию
 * @param oldWidgetKey старый ключ виджета
 * @return сгенированный ключ для виджета
 */
private String generateWidgetKey(Collection<String> keys,
                                 String classFqn,
                                 String contentCode,
                                 String login = null,
                                 String oldWidgetKey = null)
{
    String type = api.utils.get(classFqn)?.metaClass?.toString()
    def loginKeyPart = login ? "_${login}" : ''
    String uuidWidget
    while ({
        if (oldWidgetKey)
        {
            uuidWidget = oldWidgetKey.endsWith(loginKeyPart)
                    ? oldWidgetKey
                    : "${oldWidgetKey}${loginKeyPart}"
        }
        else
        {
            uuidWidget = "${type}_${contentCode}_${UUID.randomUUID()}${loginKeyPart}"
        }
        (keys.contains(uuidWidget) &&
                loadJsonSettings(uuidWidget, WIDGET_NAMESPACE))
    }()) continue
    return uuidWidget
}

/**
 * Получение настроек дашборда
 * @param classFqn    - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param login       - логин текущего пользователя
 * @return настройки дашборда
 */
private DashboardSettings getDashboardSetting(String classFqn, String contentCode, String login = null)
{
    return getDashboardSetting(generateDashboardKey(classFqn, contentCode, login))
}

/**
 * Генерация ключа для сохранения настроек дашборда
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param login логин пользователя или пустое значение если сохранение по умолчанию
 * @return сгенированный ключ для дашборда
 */
private String generateDashboardKey(String classFqn, String contentCode, String login = null)
{
    String type = api.utils.get(classFqn)?.metaClass?.toString()
    String loginKeyPart = login ? "_${login}" : ''
    return "${type}_${contentCode}${loginKeyPart}"
}

/**
 * Получение настроек дашборда
 * @param dashboardKey - уникальный идентификатор дашборда
 * @return настройки дашборда
 */
private DashboardSettings getDashboardSetting(String dashboardKey)
{
    return getSettingsFromJson(loadJsonSettings(dashboardKey, DASHBOARD_NAMESPACE)) as DashboardSettings
}

/**
 * Получение настроек виджета
 * @param widgetKey ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджета
 */
private Map<String, Object> getWidgetSettings(String widgetKey)
{
    return getSettingsFromJson(loadJsonSettings(widgetKey, WIDGET_NAMESPACE)) as Map<String, Object>
}

/**
 * Проверка пользователя на наличие группы мастер дашбордов
 * @param user БО текущего пользователя
 * @param messageError сообщение о ошибке
 */
private checkRightsOnDashboard(def user, String messageError)
{
    if (!checkUserOnMasterDashboard(user))
    {
        throw new Exception(toJson([error: "User is not a dashboard master, " +
                "${messageError} default widget is not possible"]))
    }
}

/**
 * Метод проверки пользователя на мастера дашборда
 * @param user
 * @return
 */
private boolean checkUserOnMasterDashboard(def user)
{
    user?.UUID ? GROUP_MASTER_DASHBOARD in api.utils.get(user.UUID).all_Group*.code : true
}

/**
 * Проверка на право редактирования настроек дашборда
 * @param editable - переменная разрешения на редактирование настроек пользователю
 */
private void checkRightsOnEditDashboard(def editable)
{
    if (!editable)
    {
        throw new Exception(toJson([error: "Personal settings are disabled!"]))
    }
}

/**
 * Метод проверки, является ли данный виджет персональным
 * @param widgetKey - уникальный мдентификатор виджета
 * @param user      - пользователь
 * @return true | false
 */
boolean isPersonalWidget(String widgetKey, def user)
{
    return user ? widgetKey.endsWith("_${user.login}") : false
}

/**
 * Пробросить сгенерированный ключ в настройки виджета
 * @param widgetSettings - настройки виджета
 * @param key            - сгенерированный uuid ключ
 * @return настройки виджета с ключом
 */
private def setUuidInSettings(def widgetSettings, String key)
{
    //widgetSettings является неизменяемым, поэтому создаём ноый объект и копируем все значения
    //Преобразоване в LinkedHashMap необходимо так как, не у всех реализаций интерфейса Map реализован метод клоне
    def settings = (widgetSettings as LinkedHashMap).clone() as Map
    settings.id = key
    //так как копирование было не глубокое, копируем ещё
    def layout = (settings.layout as LinkedHashMap).clone() as Map
    layout.i = key
    settings.layout = layout
    return settings
}

/**
 * Метод поиска настроек по частичному ключу
 * @param keyPart   - частичный ключ
 * @param predicate - метод дополнительной фильтрации
 * @return коллекцию ключей и настроек
 */
private Map<String, String> findJsonSettings(String keyPart, String namespace, Closure<Boolean> predicate = { key, value -> true })
{
    return api.keyValue.find(namespace, keyPart, predicate)
}

/**
 * Метод загрузки настроек по ключу объекта
 * @param key - уникальный идентификатор объекта
 * @return сериализованные настройки объекта
 */
private String loadJsonSettings(String key, String namespace)
{
    return api.keyValue.get(namespace, key)
}

/**
 * Метод сохранения настроек объекта
 * @param key       - уникальный идентификатор объекта
 * @param jsonValue - ыериализованные настройки объекта
 * @return true/false успешное/провалльное сохранение
 */
private Boolean saveJsonSettings(String key, String jsonValue, String namespace)
{
    return api.keyValue.put(namespace, key, jsonValue)
}

/**
 * Метод удаления настроек объекта
 * @param key - уникальный идентификатор объекта
 * @return true/false успешное/провалльное удаление
 */
private Boolean deleteJsonSettings(String key, String namespace)
{
    return api.keyValue.delete(namespace, key)
}

/**
 * Метод извлечения настроек из json объекта
 * @param jsonSettings - настройки в формате json
 * @return настройки или null
 */
private def getSettingsFromJson(String jsonSettings)
{
    return jsonSettings ? fromJson(jsonSettings) : null
}
/**
 * Метод десериализации json строки
 * @param json - сериализованный объект
 * @return десериализованный объект
 */
private def fromJson(String json)
{
    JsonSlurper jsonSlurper = new JsonSlurper()
    return jsonSlurper.parseText(json)
}

/**
 * Метод получения группы пользователя
 * @param user - пользователь
 * @return группа
 */
private String getUserGroup(user)
{
    if (!user)
    {
        return "SUPER"
    }
    else if (checkUserOnMasterDashboard(user))
    {
        return "MASTER"
    }
    else
    {
        return "REGULAR"
    }
}

/**
 * Метод удаления персонального виджета
 * @param classFqn - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param widgetId - код виджета
 * @param editable - параметр редактируемости
 * @param user - пользователь
 * @return успех | провал
 */
private String deletePersonalWidget(String classFqn,
                                    String contentCode,
                                    String widgetId,
                                    Boolean editable,
                                    def user)
{
    if (!(checkUserOnMasterDashboard(user) || editable))
    {
        throw new Exception("No rights on remove widget")
    }

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    if (isPersonalWidget(widgetId, user))
    {
        Closure<String> removeWidgetFromPersonalDashboard = this.&removeWidgetFromDashboard.curry(personalDashboardKey)
        return toJson(removeWidgetSettings(widgetId).with(removeWidgetFromPersonalDashboard) as boolean)
    }
    else
    {
        def settings = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
        settings.widgetIds -= widgetId
        def res = saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
        if (!res)
        {
            throw new Exception("Widget ${widgetId} not removed from dashboard: $personalDashboardKey!")
        }
        return toJson(res)
    }
}

/**
 * Метод удаления виджета по умолчанию
 * @param classFqn - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param widgetId - код виджета
 * @param user - пользователь
 * @return успех | провал
 */
private String deleteDefaultWidget(String classFqn,
                                   String contentCode,
                                   String widgetId,
                                   def user)
{
    def dashboardKeyByLogin = this.&generateDashboardKey.curry(classFqn, contentCode)
    if (!user)
    {
        // значит это супер пользователь! нет персональных виджетов и персональных дашбордов
        Closure<String> removeWidgetFromDefaultDashboard = this.&removeWidgetFromDashboard.curry(dashboardKeyByLogin())
        def resultOfRemoving = removeWidgetSettings(widgetId).with(removeWidgetFromDefaultDashboard) as boolean
        return toJson(resultOfRemoving)
    }
    else
    {
        if(!checkUserOnMasterDashboard(user))
        {
            throw new Exception("No rights on remove widget")
        }

        if (isPersonalWidget(widgetId, user))
        {
            String personalDashboardKey = dashboardKeyByLogin(user.login as String)
            String defaultWidget = widgetId - "_${user.login}"
            Closure<String> removeFromPersonalDashboard = this.&removeWidgetFromDashboard.curry(personalDashboardKey)
            def resultOfRemoving = removeWidgetSettings(widgetId).with(removeFromPersonalDashboard) as boolean
            if (findJsonSettings(defaultWidget, WIDGET_NAMESPACE))
            {
                //По воле случая может получиться так, что виджета по умолчанию уже нет(например удалён другим мастером)
                Closure<String> removeFromDefaultDashboard = this.&removeWidgetFromDashboard.curry(dashboardKeyByLogin())
                removeWidgetSettings(defaultWidget).with(removeFromDefaultDashboard)
            }
            else
            {
                logger.warn("default widget $defaultWidget not exist")
            }
            return toJson(resultOfRemoving)
        }
        else
        {
            def resultOfRemoving = removeWidgetSettings(widgetId).with { String widgetKey ->
                // По возможности удалить и персональный виджет, если он есть
                String personalDashboardKey = dashboardKeyByLogin(user.login as String)
                loadJsonSettings(personalDashboardKey, DASHBOARD_NAMESPACE) // проверка на существование персонального дашборда
                        ?.with { removeWidgetFromDashboard(personalDashboardKey, widgetKey) }
                removeWidgetFromDashboard(dashboardKeyByLogin(), widgetKey) as boolean
            }
            return toJson(resultOfRemoving)
        }
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
    return objKeys?.collectEntries { key ->
        def value = api.keyValue.get(namespace, key)
        return value ? [ (key) : value ] : Collections.emptyMap()
    }
}

/**
 * Метод получения ключей необходимых объектов
 * @param namespace - название неймспейса
 * @param dashboardKey - ключ дашборда для поиска
 * @param objToFind - код объекта для поиска
 * @return массив из ключей объектов
 */
private def getObjectIdsFromDashboard(String namespace, String dashboardKey, String objToFind)
{
    def dashboard =  api.keyValue.get(namespace, dashboardKey)
    return dashboard ? fromJson(dashboard)?.get(objToFind) : null
}

/**
 * Метод получения названий всех виджетов
 * @param widgets - ассоциативный массив из ключей и значений виджетов
 * @return список названий виджетов
 */
private List<String> getWidgetNames(Map<String, Object> widgets)
{
    return widgets.values().collect {
        def widget = fromJson(it as String)
        return widget.name.toString()
    }.toList()
}

/**
 * Метод проверки уникальности названия виджета в рамках текущего дашборда
 * @param requestContent - запрос на построение/редактирование виджета
 * @param widgetKey - ключ виджета (нужен при редактировании виджета)
 * @return список названий виджетов
 */
private void validateName(Map<String, Object> requestContent, String widgetKey = null) {
    String name = requestContent.widget.name.toString()
    String dashKey = generateDashboardKey(requestContent.classFqn, requestContent.contentCode)
    def  widgetIds = getObjectIdsFromDashboard(DASHBOARD_NAMESPACE, dashKey, 'widgetIds')
    widgetIds = widgetKey ? (widgetIds - widgetKey) : widgetIds
    def widgets = getMapForObject(widgetIds, WIDGET_NAMESPACE)
    List<String> widgetsNames = widgets ? getWidgetNames(widgets as Map<String, Object>) : null
    if (name in widgetsNames)
    {
        throw new Exception(
            toJson([
                errors: [
                    "name" : "Виджет с названием \"$name\" не может быть сохранен. " +
                            "Название виджета должно быть уникально в рамках дашборда."]
            ])
        )
    }
}
//endregion