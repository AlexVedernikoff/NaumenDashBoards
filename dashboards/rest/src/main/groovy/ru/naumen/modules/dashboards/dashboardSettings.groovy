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
package ru.naumen.modules.dashboards

import groovy.json.JsonSlurper
import groovy.transform.Field
import groovy.transform.TupleConstructor

import static groovy.json.JsonOutput.toJson

//region КОНСТАНТЫ
//TODO: хорошему нужно разделить на несколько пространств для настроек: виджетов, кастомных группировок, дашбордов
@Field private static final String DASHBOARD_NAMESPACE = 'dashboards'
@Field private static final String CUSTOM_GROUP_NAMESPACE = 'custom_groups'
@Field private static final String WIDGET_NAMESPACE = 'widgets'
@Field private static final String OLD_GROUP_MASTER_DASHBOARD = 'MasterDashbordov'
@Field private static final String GROUP_MASTER_DASHBOARD = 'dashboardMaster'
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
    Map<String, Object> layouts = null
    Map<String, Object> mobileLayouts = null
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

/**
 * Информация о дашборде (для дерева)
 */
class DashboardInfo
{
    String label
    String value
    List<WidgetInfo> children
}

/**
 * Информация о виджете (для дерева)
 */
class WidgetInfo
{
    String label
    String value
}
//endregion

//region REST-МЕТОДЫ
/**
 * Получение настроек дашборда и виджетов
 * @param requestContent - параметры запроса (classFqn, contentCode, isPersonal)
 * @return настройки автообновления вместе с настройками виджетов
 */
String getSettings(Map<String, Object> requestContent)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    Boolean isPersonal = requestContent.isPersonal
    Boolean isMobile = requestContent.isMobile
    if (isPersonal && !user?.login)
    {
        throw new Exception("Login is null, not found personal dashboard")
    }
    Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(
        classFqn, contentCode
    )

    def defaultDashboard = getSettingByLogin()
    def personalDashboard = getSettingByLogin(user?.login as String)
    def result
    if (isPersonal)
    {
        result = personalDashboard ? [
            autoUpdate  : personalDashboard?.autoUpdate,
            widgets     : personalDashboard?.widgetIds?.findResults{ widgetKey ->
                def widget = getWidgetSettings(widgetKey, isMobile)
                return changeTotalWidgetName(widget, classFqn)
            } ?: [],
            customGroups: personalDashboard?.customGroupIds?.collectEntries {
                key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE))]
            },
            mobileLayouts: personalDashboard?.mobileLayouts,
            layouts: isMobile ? null : personalDashboard?.layouts

        ] : [
            autoUpdate  : defaultDashboard?.autoUpdate,
            widgets     : defaultDashboard?.widgetIds?.findResults{ widgetKey ->
                def widget = getWidgetSettings(widgetKey, isMobile)
                return changeTotalWidgetName(widget, classFqn)
            } ?: [],
            customGroups: defaultDashboard?.customGroupIds?.collectEntries {
                key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE))]
            },
            mobileLayouts: defaultDashboard?.mobileLayouts,
            layouts: isMobile ? null : defaultDashboard?.layouts
        ]
    }
    else
    {
        result = [
            autoUpdate  : defaultDashboard?.autoUpdate,
            //TODO: из-за архитектурной особенности возможны ситуации при которых настройки виджета пропадут.
            // В таких случаях просто пропускаем пустые настройки
            // ключи виджетов с пустыми настройками будут удалены после сброса настроек.
            // Пользователь этого даже не заметит
            widgets     : defaultDashboard?.widgetIds?.findResults{ widgetKey ->
                def widget = getWidgetSettings(widgetKey, isMobile)
                return changeTotalWidgetName(widget, classFqn)
            } ?: [],
            customGroups: defaultDashboard?.customGroupIds?.collectEntries {
                key -> [(key): getSettingsFromJson(loadJsonSettings(key, CUSTOM_GROUP_NAMESPACE))]
            },
            mobileLayouts: defaultDashboard?.mobileLayouts,
            layouts: isMobile ? null : defaultDashboard?.layouts
        ]
    }
    return toJson(result)
}

/**
 * Метод точечного изменения названия виджета
 * @param widgetName - название виджета
 * @param classFqn - uuid текущего объекта
 * @return итоговое название виджета
 */
private String replaceWidgetName(String widgetName, def classFqn)
{
    if (widgetName?.contains('subject'))
    {
        def subject = api.utils.get(classFqn)
        try
        {
            //пользователь может написать несуществующее поле у subject-а
            widgetName = checkWidgetName(widgetName, subject)
            return api.utils.processTemplate(widgetName, [subject: subject])
        }
        catch (Exception ex)
        {
            //оставляем название в исходном виде
            return widgetName
        }
    }
    return widgetName
}

/**
 * Метод полноценного изменения названия виджета
 * @param widgetSettings - настройки виджета
 * @param classFqn - uuid текущего объекта
 * @return итоговые настройки виджета
 */
private Map changeTotalWidgetName(Map widgetSettings, String classFqn)
{
    if (widgetSettings)
    {
        def widget = (widgetSettings as LinkedHashMap).clone() as Map
        widget?.name = widget?.templateName
            ? replaceWidgetName(widget?.templateName, classFqn)
            : widget?.name
        if (widget?.header)
        {
            def header = (widget?.header as LinkedHashMap).clone() as Map
            header?.name = header?.template
                ? replaceWidgetName(header?.template, classFqn)
                : header?.name
            widget?.header = header
        }
        return widget
    }
    return widgetSettings
}

/**
 * Метод обновления состояния автообновления
 * @param requestContent - тело запроса (classFqn, contentCode, autoUpdate)
 * @return true|false
 */
String saveAutoUpdateSettings(Map<String, Object> requestContent) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    def autoUpdate = requestContent.autoUpdate as AutoUpdate
    boolean isPersonal = requestContent.isPersonal
    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)
    def settings = getDashboardSetting(isPersonal ? personalDashboardKey : defaultDashboardKey)
    settings.autoUpdate = autoUpdate
    return saveJsonSettings(
        isPersonal ? personalDashboardKey : defaultDashboardKey,
        toJson(settings ?: new DashboardSettings()),
        DASHBOARD_NAMESPACE
    )
}

/**
 * Метод сохранения настроек кастомных группировок.
 * Сохраняет в персональный дашборд.
 * @param requestContent - тело запроса
 * @return ключь кастомной группировки
 */
String saveCustomGroup(Map<String, Object> requestContent) {
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
            return toJson([id: keyCustomGroup])
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

/**
 * Метод обноления кастомной группировки
 * @param requestContent - тело запроса
 * @return новая кастомная группировка
 */
String updateCustomGroup(Map<String, Object> requestContent) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    def group = requestContent.group
    String groupKey = group.id
    boolean isPersonal = requestContent.isPersonal

    if (isPersonal && !(user?.login)) throw new Exception("Login is null, not found personal dashboard")
    if (!group) throw new IllegalArgumentException("Group settings is null!")

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    def dashboard = isPersonal ? getDashboardSetting(personalDashboardKey) : getDashboardSetting(defaultDashboardKey)

    if (groupKey in dashboard.customGroupIds) {
        //если дб персональный, а группировка с общего
        if (isPersonal && !groupKey.contains(user?.login))
        {
            groupKey += "_${user?.login}"
            group.name += '_личная'
            //добавили новый ключ
            dashboard.customGroupIds += groupKey
            saveJsonSettings(personalDashboardKey, toJson(dashboard), DASHBOARD_NAMESPACE)
            group.id = groupKey
        }
        if (saveJsonSettings(groupKey, toJson(group), CUSTOM_GROUP_NAMESPACE)) {
            return toJson([group: group])
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
 * @return ключь кастомной группировки
 */
String deleteCustomGroup(Map<String, Object> requestContent) {
    //TODO: изменить
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String groupKey = requestContent.groupKey
    boolean isPersonal = requestContent.isPersonal
    if (isPersonal && !(user?.login)) throw new Exception("Login is null, not found personal dashboard")

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    def dashboard = isPersonal ? getDashboardSetting(personalDashboardKey) : getDashboardSetting(defaultDashboardKey)

    if (groupKey in dashboard.customGroupIds) {
        if (deleteJsonSettings(groupKey, CUSTOM_GROUP_NAMESPACE)) {
            dashboard.customGroupIds -= groupKey
            if (saveJsonSettings(personalDashboardKey, toJson(dashboard), DASHBOARD_NAMESPACE)) {
                return toJson([id: groupKey])
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
 * @return true|false
 */
String enableAutoUpdate(Map<String, Object> requestContent)
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
 * @return true|false
 */
String disableAutoUpdate(Map<String, Object> requestContent)
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
 * @return true|false
 */
String createPersonalDashboard(Map<String, Object> requestContent)
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
    settings = prepareDashboardSettings(settings, user.login as String)
    return saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
}

/**
 * Метод подготовки настроек для персонального дашборда
 * @param settings - текущие настройки дашборда
 * @param userLogin - логин пользователя
 * @return - правильные настройки дашборда
 */
DashboardSettings prepareDashboardSettings(DashboardSettings settings, String userLogin)
{
    if (userLogin)
    {
        settings.widgetIds = settings.widgetIds.collect { widgetId ->
            def widgetSettings = getWidgetSettings(widgetId)
            widgetId += "_${userLogin}"
            saveWidgetSettings(widgetSettings) { widgetId }
            return widgetId
        }
        settings.layouts = prepareLayouts(settings.layouts, userLogin)
        settings.mobileLayouts = prepareLayouts(settings.mobileLayouts, userLogin)
    }
    return settings
}

/**
 * Метод подготовки положений для виджетов персонального дашборда
 * @param layouts - текущие положения для виджетов
 * @param userLogin - логин пользователя
 * @return - правильные положения для виджетов
 */
Map prepareLayouts(Map layouts, String userLogin)
{
    return layouts.collectEntries { key, value ->
        value = value.collect {
            it.i += "_${userLogin}"
            return it
        }
        [(key): value]
    }
}

/**
 * Создание виджета в дашборде
 * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
 * @return ключ созданного виджета
 */
String createWidget(Map<String, Object> requestContent)
{
    validateName(requestContent)
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    def widget = requestContent.widget
    def widgetWithCorrectName = changeTotalWidgetName(widget, classFqn)
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

    return saveWidgetSettings(widgetWithCorrectName, generateKey).with { totalWidget ->
        def key = totalWidget.id
        dashboardSettings.widgetIds += key
        saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
        toJson(totalWidget)
    }
}

/**
 * Редактирование виджета в дашборде
 * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
 * @return ключ отредактированного виджета
 */
String editWidget(Map<String, Object> requestContent)
{
    String classFqn = requestContent.classFqn
    def widget = requestContent.widget
    String widgetKey = widget.id
    Boolean isPersonal = requestContent.isPersonal
    validateName(requestContent, widgetKey, isPersonal, user)

    def widgetWithCorrectName = changeTotalWidgetName(widget, classFqn)
    String contentCode = requestContent.contentCode
    if(requestContent.isPersonal as boolean)
    {
        checkRightsOnEditDashboard(requestContent.editable)
        Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(classFqn, contentCode)
        if (user && isPersonalWidget(widgetKey, user))
        {
            return saveWidgetSettings(widgetWithCorrectName) { widgetKey }.with { totalWidget -> toJson(totalWidget)}
        }
        else
        {
            DashboardSettings dashboardSettings = getSettingByLogin(user?.login as String) ?: getSettingByLogin(null)
            String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
            def generateKey = this.&generateWidgetKey.curry(dashboardSettings.widgetIds,
                    classFqn,
                    contentCode,
                    user?.login as String,
                    widgetKey)
            return saveWidgetSettings(widgetWithCorrectName, generateKey).with { totalWidget ->
                def key = totalWidget.id
                dashboardSettings.widgetIds = dashboardSettings.widgetIds - widgetKey + key
                if (!saveJsonSettings(personalDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE))
                {
                    throw new Exception("Widget $key not saved in dashboard $personalDashboardKey")
                }
                toJson(totalWidget)
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
        def widgetDb = setUuidInSettings(widgetWithCorrectName, widgetKey)
        saveJsonSettings(widgetKey, toJson(widgetDb), WIDGET_NAMESPACE)
        return toJson(widgetDb)
    }
}

/**
 * Массовое редактирование виджетов в дашборде
 * @param requestContent - тело запроса ()
 * @return ключ дашборда
 */
String editLayouts(Map<String, Object> requestContent)
{
    def layouts = requestContent.layouts as Map<String, Object>
    def mobileLayouts = requestContent.mobileLayouts as Map<String, Object>

    Map<String, Object> dashboardRequestSettings = getDashboardSettingsFromRequest(requestContent, user)
    String dashboardKey = dashboardRequestSettings.dashboardKey
    DashboardSettings dashboardSettings = getDashboardSetting(dashboardKey)

    if (layouts) {
        dashboardSettings.mobileLayouts = mobileLayouts
        dashboardSettings.layouts = layouts
        saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
    }
    else
    {
        String message = "Empty layout settings from dashboard: $dashboardKey"
        logger.error(message)
        throw new IllegalArgumentException(message)
    }
    return  toJson([dashboardKey: dashboardKey])
}

/**
 * Метод удаления виджета
 * @param requestContent - тело запроса (classFqn, contentCode, widgetId, editable, isPersonal)
 * @return успех | провал
 */
String deleteWidget(Map<String, Object> requestContent)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String widgetId = requestContent.widgetId
    if(requestContent.isPersonal)
    {
        return deletePersonalWidget(
            classFqn,
            contentCode,
            widgetId,
            requestContent.editable as Boolean,
            user
        )
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
 * @return статус сообщение
 */
String deletePersonalDashboard(String classFqn, String contentCode)
{
    //TODO: добавить локализацию в дальнейшем
    if (!user) throw new Exception([message: "Super-user can't reset dashboard settings!"])
    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
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
 * @return параметры пользователя
 */
String getUserData(Map<String, Object> requestContent)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String groupUser = getUserGroup(user)
    Boolean hasPersonalDashboard = user && getDashboardSetting(classFqn, contentCode, user?.login as String)
    return toJson([groupUser: groupUser, hasPersonalDashboard: hasPersonalDashboard, name: user?.title, email: user?.email])
}

/**
 * Метод получения списка пользователей - ФИО и адрес эл. почты
 * @return [title: ФИО, email: email]
 */
String getUsers()
{
    List<Map> users = api.db.query("FROM employee WHERE email LIKE '%@%' ORDER BY email")
                         .list()
                         .collect { user ->
                             [id: user.UUID, name: user.title, email: user.email]
                         }
    return toJson(users)
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
private Map saveWidgetSettings(Map settings, Closure<String> generateCode) {
    String key = generateCode()
    def widgetSettings = setUuidInSettings(settings, key)
    if(!saveJsonSettings(key, toJson(widgetSettings), WIDGET_NAMESPACE)) {
        throw new Exception("Widget $key not saved!")
    }
    return widgetSettings
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
        (keys?.contains(uuidWidget) &&
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
    def dashboardSettings = getSettingsFromJson(loadJsonSettings(dashboardKey, DASHBOARD_NAMESPACE))
    return dashboardSettings ?
        new DashboardSettings
            (
                autoUpdate      : dashboardSettings?.autoUpdate,
                widgetIds       : dashboardSettings?.widgetIds ?: [],
                customGroupIds  : dashboardSettings?.customGroupIds ?: [],
                layouts         : dashboardSettings?.layouts,
                mobileLayouts   : dashboardSettings?.mobileLayouts
            ) : null
}

/**
 * Получение настроек виджета
 * @param widgetKey ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджета
 */
private Map<String, Object> getWidgetSettings(String widgetKey, Boolean isMobile = false)
{
    def settings = getSettingsFromJson(
        loadJsonSettings(widgetKey, WIDGET_NAMESPACE)
    ) as Map<String, Object>

    if (settings && isMobile)
    {
        settings = settings.displayMode in MCDisplayMode.values()*.name() ? settings : null
    }
    return settings
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
    return user?.UUID
        ? ((OLD_GROUP_MASTER_DASHBOARD in api.utils.get(user.UUID).all_Group*.code) ||
           (GROUP_MASTER_DASHBOARD in api.utils.get(user.UUID).all_Group*.code))
        : true
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
    return user ? widgetKey?.endsWith("_${user?.login}") : false
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
    if (widgetSettings)
    {
        def settings = (widgetSettings as LinkedHashMap).clone() as Map
        settings.id = key
        return settings
    }
    return widgetSettings
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

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
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
                                   String widgetId, def user)
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
            String defaultWidget = widgetId - "_${user?.login}"
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
                String personalDashboardKey = dashboardKeyByLogin(user?.login as String)
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
        return widget?.templateName ? widget?.templateName?.toString() : widget?.name?.toString()
    }.toList()
}

/**
 * Метод проверки уникальности названия виджета в рамках текущего дашборда
 * @param requestContent - запрос на построение/редактирование виджета
 * @param widgetKey - ключ виджета (нужен при редактировании виджета)
 * @param isPersonal - флаг на персональный дб
 * @param user - текущий пользователь
 * @return список названий виджетов
 */
private void validateName(Map<String, Object> requestContent,
                          String widgetKey = null,
                          Boolean isPersonal = false,
                          def user = null)
{
    String name = requestContent?.widget?.templateName ?: requestContent?.widget?.name
    String dashboardKey = isPersonal
        ? generateDashboardKey(requestContent.classFqn, requestContent.contentCode, user?.login as String)
        : generateDashboardKey(requestContent.classFqn, requestContent.contentCode)
    List<String> widgetsNames = getWidgetNamesFromDashboard(dashboardKey, widgetKey)
    if (name in widgetsNames)
    {
        throw new Exception(
            toJson([
                errors: [
                    "templateName" : "Виджет с названием \"$name\" не может быть сохранен. " +
                            "Название виджета должно быть уникально в рамках дашборда."]
            ])
        )
    }
}

/**
 * Метод получения настроек дашборда из requestContent-a
 * @param requestContent - тело запроса
 * @param user - пользователь
 * @return нужные настройки дашборда
 */
private Map getDashboardSettingsFromRequest(Map<String, Object> requestContent, def user) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    boolean isPersonal = requestContent.isPersonal

    String dashboardKey = isPersonal
        ? generateDashboardKey(classFqn, contentCode, user?.login as String)
        : generateDashboardKey(classFqn, contentCode)

    def settings = getDashboardSetting(dashboardKey)
    return [dashboardKey: dashboardKey, widgetIds: settings.widgetIds ]
}

/**
 * Редактирование отдельных полей в виджете
 * @param requestContent - тело запроса ()
 * @return ключ отредактированного виджета
 */
String editWidgetChunkData(Map<String, Object> requestContent) {
    Map<String, Object> dashboardSettings = getDashboardSettingsFromRequest(requestContent, user)

    String dashboardKey = dashboardSettings.dashboardKey
    String widgetKey = requestContent.id
    if(widgetKey in dashboardSettings.widgetIds) {
        def chunkData = requestContent.chunkData as Map<String, Object>
        def fieldsToChange = chunkData.keySet()

        def widgetSettings = getWidgetSettings(widgetKey)
        fieldsToChange.each { field ->
            widgetSettings.put(field, chunkData[field])
        }

        if (saveJsonSettings(widgetKey, toJson(widgetSettings), WIDGET_NAMESPACE)) {
            return widgetKey
        } else {
            throw new IllegalStateException("Widget $widgetKey not saved in dashboard: $dashboardKey")
        }
    }
    else
    {
        logger.warn("Widget $widgetKey not belongs dashboard $dashboardKey")
        return null
    }
}

/**
 * Метод получения итогового списка uuid-ов и названий дашбордов
 * @return список ассоциативных массивов
 */
List<Map<String, String>> getDashboardsUUIDAndTitle()
{
    def root = api.utils.findFirst('root', [:])
    if (root.hasProperty('dashboardCode') && root.dashboardCode)
    {
        def appCode = root.dashboardCode
        def contents = api.apps.listContents(appCode)
        if (contents)
        {
            return contents.collect {
                [uuid: ("${it.subjectFqn}_${it.contentUuid}".toString()) , title: it.contentTitle]
            }
        }
    }
    throw new Exception('Для получения списка виджетов заполните корректно атрибут Компании dashboardCode')
}

/**
 * Метод получения информации о виджете (для дерева)
 * @param widgetKey - ключ виджета
 * @return WidgetInfo
 */
WidgetInfo getWidgetInfo(String widgetKey)
{
    def widgetSettings = getWidgetSettings(widgetKey)
    return widgetSettings ? new WidgetInfo(value: widgetKey ,label: widgetSettings.name) : null
}

/**
 * Метод получения дерева из информации о дашбордах и виджетах
 * @param convertToJson - флаг на преобразование результата в json
 * @return json или List<DashboardInfo>
 */
def getDashboardsAndWidgetsTree(Boolean convertToJson = true)
{
    List<DashboardInfo> dashboardsInfo = getDashboardsUUIDAndTitle().findResults {
        String dashboardUUID = it.uuid
        String dashboardTitle = it.title

        List widgetIds = getDashboardSetting(dashboardUUID)?.widgetIds
        List<WidgetInfo> widgets = widgetIds
            ? widgetIds.findResults { widgetKey ->
                return getWidgetInfo(widgetKey) }
            : []
        return new DashboardInfo(label: dashboardTitle, value: dashboardUUID, children: widgets)
    }
    return convertToJson ? toJson(dashboardsInfo) : dashboardsInfo
}

/**
 * Метод копирования виджета в другой дашборд
 * @param requestContent - тело запроса
 * @return ключ скопированного виджета
 */
String copyWidgetToDashboard(requestContent)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String widgetKey = requestContent.widgetKey

    Map<String, Object> widgetSettings = getWidgetSettings(widgetKey)

    String destinationDashboardKey = generateDashboardKey(classFqn, contentCode)
    DashboardSettings dashboardSettings = getDashboardSetting(destinationDashboardKey) ?: new DashboardSettings()
    List<String> currentWidgetIds = dashboardSettings.widgetIds

    Closure<String> generateKey = this.&generateWidgetKey.curry(currentWidgetIds, classFqn, contentCode)
    Map<String, Object> newWidgetSettings = editWidgetDescriptor(widgetSettings, destinationDashboardKey)
    return saveWidgetSettings(newWidgetSettings, generateKey).with { widget ->
        def key = widget.id
        dashboardSettings.widgetIds += key
        saveJsonSettings(destinationDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
        return toJson(widget)
    }
}

/**
 * Метод проверки виджета для возможности копирования
 * @param requestContent - тело запроса
 * @return флаг на возможность полного копирования в json-формате
 */
String widgetIsBadToCopy(requestContent)
{
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    String widgetKey = requestContent.widgetKey
    Map<String, Object> widgetSettings = getWidgetSettings(widgetKey)

    String dashboardKey = generateDashboardKey(classFqn, contentCode)

    if (widgetSettings)
    {
        def filtersHasSubject = []
        widgetSettings.data.collect { dataValue ->
            def descriptor = dataValue.descriptor
            if (descriptor)
            {
                def slurper = new groovy.json.JsonSlurper()
                def descriptorMap  = slurper.parseText(descriptor)
                def filters = descriptorMap.filters
                filtersHasSubject += filters?.collectMany { filterValue ->
                    def conditionCodes = filterValue*.properties.conditionCode
                    conditionCodes.collect { conditionCode ->
                        if (conditionCode.toLowerCase().contains('subject'))
                        {
                            if (dashboardKey.tokenize('_').find() != widgetKey.tokenize('_').find())
                            {
                                return true
                            }
                        }
                    }
                }.grep()
            }
        }
        Boolean hasSubjectFilters = filtersHasSubject.any { it == true }
        return toJson([result: hasSubjectFilters])
    }
    else
    {
        throw new Exception("Widget settings are empty!")
    }
}


/**
 * Метод проверки и изменения фильтрации, если необходимо
 * @param widgetSettings - настройки виджета
 * @param dashboardKey - ключ дашборда, на который хотим отправить виджет
 * @return итоговые настройки виджета
 */
private Map<String, Object> editWidgetDescriptor(Map<String, Object> widgetSettings, String dashboardKey)
{
    if (widgetSettings)
    {
        Map<String, Object> widget = (widgetSettings as LinkedHashMap).clone() as Map<String, Object>
        widget.templateName = widget.templateName ? widget.templateName + '_копия' : widget.name + '_копия'
        widget.name += '_копия'
        widget.header?.name += '_копия'
        widget.header?.template = widget.header?.template ? widget.header?.template + '_копия' : widget.header?.name + '_копия'

        List<String> widgetsNames = getWidgetNamesFromDashboard(dashboardKey)
        while(widget.templateName in widgetsNames)
        {
            widget.templateName += '_копия'
            widget.name += '_копия'
            widget.header?.name += '_копия'
            widget.header?.template += '_копия'
        }

        String widgetKey = widget.id
        List newWidgetData = widget.data.collect { dataValue ->
            def descriptor = dataValue.descriptor
            if (descriptor)
            {
                def slurper = new groovy.json.JsonSlurper()
                def descriptorMap  = slurper.parseText(descriptor)
                def filters = descriptorMap.filters
                if (filters)
                {
                    def valuesToRemove = filters.collectMany { filterValue ->
                        def conditionCodes = filterValue*.properties.conditionCode
                        conditionCodes.collect { conditionCode ->
                            if (conditionCode.toLowerCase().contains('subject'))
                            {
                                if (dashboardKey.tokenize('_').find() != widgetKey.tokenize('_').find())
                                {
                                    return filterValue
                                }
                            }
                        }
                    }.grep()

                    filters -= valuesToRemove
                    descriptorMap.filters = filters
                }
                descriptor = toJson(descriptorMap)
                dataValue.descriptor = descriptor
            }
            return dataValue
        }
        widget.data = newWidgetData
        return widget
    }

    widgetSettings?.templateName = widgetSettings?.templateName ? widgetSettings?.templateName + '_копия' : widgetSettings?.name + '_копия'
    widgetSettings?.name += '_копия'
    widgetSettings?.header?.name += '_копия'
    widgetSettings?.header?.template  = widgetSettings?.header?.template ? widgetSettings?.header?.template + '_копия' : widgetSettings?.header?.name + '_копия'
    return widgetSettings
}

/**
 * Метод проверки переменных в названии виджета на наличие вызова атрибута типа caseList
 * @param widgetName - название виджета
 * @param subject - текущий объект
 * @return нормализованное название виджета
 */
String checkWidgetName(String widgetName, def subject)
{
    int idsCount = widgetName.findAll { it == '{'}.size()
    if (idsCount > 0)
    {
        String tempWidgetName = widgetName
        String fqn = subject.getMetaClass().toString()
        List variables = []
        List variableIds = []
        for (int i = 0; i < idsCount; i++)
        {
            def var = tempWidgetName.dropWhile { it != '{'}.takeWhile { it != '}'}.drop(1)
            variables += var
            def varToCheck = var - "subject."
            Boolean updateValue = varToCheck.tokenize('.').any { check ->
                return checkAttributeType (check, fqn)
            }
            if (updateValue)
            {
                variableIds += i
            }
            tempWidgetName -= "\${${var}}"
        }

        def tempResult = null
        variableIds.collect { idx ->
            def templateVariable = variables[idx]
            tempResult = api.utils.processTemplate("\${${templateVariable}}",  [subject: subject])
            tempResult = tempResult.replace('[', '').replace(']', '').tokenize(',')*.trim()
            tempResult = tempResult.collect {
                api.metainfo.getMetaClass(it)?.title
            }.toString().replace('[', '').replace(']', '')
            widgetName = widgetName.replace("\${${templateVariable}}", tempResult)
        }
    }
    return widgetName
}

/**
 * Метод получения списка названий виджетов по конкретному дашборду из хранилища
 * @param dashboardKey - ключ дашборда
 * @param widgetKey - ключ виджета (нужен при редактировании виджета)
 * @return список названий виджетов этого дашборда
 */
List<String> getWidgetNamesFromDashboard(String dashboardKey,  String widgetKey = null)
{
    def widgetIds = getObjectIdsFromDashboard(DASHBOARD_NAMESPACE, dashboardKey, 'widgetIds')
    widgetIds = widgetKey ? widgetIds - widgetKey : widgetIds
    def widgets = getMapForObject(widgetIds, WIDGET_NAMESPACE)
    return widgets ? getWidgetNames(widgets as Map<String, Object>) : null
}

/**
 * Метод проверки типа атрибута в переменной в названии виджета на тип caseList
 * @param code - код атрибута
 * @param classFqn - метакласс
 * @return флаг true|false
 */
Boolean checkAttributeType(String code, String classFqn)
{
    def attributeType = api.metainfo.getMetaClass(classFqn).getAttribute(code).getType()
    return attributeType.toString().contains('caseList')
}
//endregion