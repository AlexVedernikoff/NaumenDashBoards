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
@Field private static final String NAMESPACE = 'dashboards'
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

abstract class Request
{
    String classFqn
    String contentCode
}

abstract class EditRequest extends Request
{
    Boolean editable
}

/**
 * Модель тело запроса - создание настроек виджета
 */
class RequestCreateWidgetSettings extends EditRequest
{
    Map<String, Object> widgetSettings
}

/**
 * Модель тело запроса - редактирование настроек виджета
 */
class RequestEditWidgetSettings extends EditRequest
{
    String widgetKey
    Map<String, Object> widgetSettings
}

/**
 * Модель тело запроса - редактирование настроек виджетов
 */
class RequestEditWidgetsSettings extends EditRequest
{
    Collection<WidgetSettings> layoutsSettings
}

/**
 * Модель тело запроса - удаление настроек виджетов
 */
class RequestDeleteWidgetSettings extends EditRequest
{
    String widgetId
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
 * @param classFqn    - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param user        - БО текущего пользователя
 * @return настройки автообновления вместе с настройками виджетов
 */
String getSettings(String classFqn, String contentCode, def user)
{
    Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(classFqn, contentCode)
    DashboardSettings dashboardSettings = getSettingByLogin(user?.login as String) ?: getSettingByLogin(null)
    def result = [
            autoUpdate: dashboardSettings?.autoUpdate,
            //TODO: из-за архитектурной особенности возможны ситуации при которых настройки виджета пропадут.
            // В таких случаях просто пропускаем пустые настройки
            // ключи виджетов с пустыми настройками будут удалены после сброса настроек.
            // Пользователь этого даже не заметит
            widgets   : dashboardSettings?.widgetIds?.findResults(this.&getWidgetSettings) ?: []
    ]
    return toJson(result)
}

/**
 * Метод обновления состояния автообновления
 * @param requestContent - тело запроса
 * @param user           - БО текущего пользователя
 * @return true|false
 */
String saveAutoUpdateSettings(Map<String, Object> requestContent, def user) {
    String classFqn = requestContent.classFqn
    String contentCode = requestContent.contentCode
    def autoUpdate = requestContent.autoUpdate as AutoUpdate

    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
    String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

    def settings = getDashboardSetting(personalDashboardKey)
            ?: getDashboardSetting(defaultDashboardKey)
            ?: new DashboardSettings()
    settings.autoUpdate = autoUpdate
    return saveJsonSettings(personalDashboardKey, toJson(settings))
}

/**
 * Метод включение автообновлений дашборда
 * @param requestContent - тео запроса
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
    return saveJsonSettings(personalDashboardKey, toJson(settings))
}

/**
 * Метод отключения автообновлений дашборда
 * @param requestContent - тело запроса
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
    return saveJsonSettings(personalDashboardKey, toJson(settings))
}

/**
 * Создание виджета в дашборде по умолчанию
 * @param requestContent json в формате RequestCreateWidgetSettings
 * @param user БО текущего пользователя
 * @return ключ созданного виджета
 */
String createDefaultWidgetSettings(Map<String, Object> requestContent, def user)
{
    checkRightsOnDashboard(user, "create")
    def request = requestContent as RequestCreateWidgetSettings
    String defaultDashboardKey = generateDashboardKey(request.classFqn, request.contentCode)
    DashboardSettings dashboardSettings = getDashboardSetting(defaultDashboardKey) ?: new DashboardSettings()
    def generateKey = this.&generateWidgetKey.curry(
            dashboardSettings.widgetIds,
            request.classFqn,
            request.contentCode,
            user?.login as String)
    return saveWidgetSettings(request.widgetSettings, generateKey).with { key ->
        dashboardSettings.widgetIds += key
        saveJsonSettings(defaultDashboardKey, toJson(dashboardSettings))
        toJson(key)
    }
}

/**
 * Массовое редактирование виджетов в дашборде по умолчанию
 * @param requestContent json в формате RequestEditWidgetsSettings
 * @param user БО текущего пользователя
 * @return список ключей отредактированнных виджетов
 */
String bulkEditDefaultWidget(Map<String, Object> requestContent, def user)
{
    def request = requestContent as RequestEditWidgetsSettings
    return request.layoutsSettings.collect {
        def widgetSettings = setLayoutInSettings(it)
        Map<String, Object> widgetRequest = [
                classFqn      : request.classFqn,
                contentCode   : request.contentCode,
                widgetKey     : it.key,
                widgetSettings: widgetSettings]
        editDefaultWidget(widgetRequest, user)
    }
}

/**
 * Массовое редактирование виджетов в дашборде
 * @param requestContent json в формате RequestEditWidgetsSettings
 * @param user БО текущего пользователя
 * @return список ключей отредактированнных виджетов
 */
String bulkEditWidget(Map<String, Object> requestContent, def user)
{
    def request = requestContent as RequestEditWidgetsSettings
    return request.layoutsSettings.collect {
        def widgetSettings = setLayoutInSettings(it)
        Map<String, Object> widgetRequest = [
                editable      : true,
                classFqn      : request.classFqn,
                contentCode   : request.contentCode,
                widgetKey     : it.key,
                widgetSettings: widgetSettings]
        editPersonalWidgetSettings(widgetRequest, user)
    }
}

/**
 * Редактирование виджета в дашборде по умолчанию
 * @param requestContent json в формате RequestEditWidgetSettings
 * @param user БО текущего пользователя
 * @return ключ отредактированного виджета
 */
String editDefaultWidget(Map<String, Object> requestContent, def user)
{
    checkRightsOnDashboard(user, "edit")
    def request = requestContent as RequestEditWidgetSettings
    String widgetKey = request.widgetKey
    if (user && isPersonalWidget(request.widgetKey, user))
    {
        widgetKey -= "_${user.login}"
        def closureReplaceWidgetKey = { String login ->
            String dashboardKey = generateDashboardKey(
                    request.classFqn,
                    request.contentCode,
                    login)
            DashboardSettings dashboardSettings = getDashboardSetting(dashboardKey)
            dashboardSettings.widgetIds.remove(request.widgetKey)
            if (!(widgetKey in dashboardSettings.widgetIds))
            {
                dashboardSettings.widgetIds << widgetKey
            }
            saveJsonSettings(dashboardKey, toJson(dashboardSettings))
        }
        closureReplaceWidgetKey(user.login as String)
        closureReplaceWidgetKey(null)
        deleteJsonSettings(request.widgetKey)
    }
    def widgetSettings = setUuidInSettings(request.widgetSettings, widgetKey)
    saveJsonSettings(widgetKey, toJson(widgetSettings))
    return toJson(widgetKey)
}

/**
 * Редактирование настроек виджета
 * @param requestContent - json в формате RequestEditWidgetSettings
 * @param user - БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ отредактированного виджета
 */
String editPersonalWidgetSettings(Map<String, Object> requestContent, def user)
{
    def request = requestContent as RequestEditWidgetSettings
    checkRightsOnEditDashboard(request.editable)
    Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(request.classFqn, request.contentCode)
    if (user && isPersonalWidget(request.widgetKey, user))
    {
        return saveWidgetSettings(request.widgetSettings) { request.widgetKey }
    }
    else
    {
        DashboardSettings dashboardSettings = getSettingByLogin(user.login as String) ?: getSettingByLogin(null)
        String personalDashboardKey = generateDashboardKey(request.classFqn, request.contentCode, user.login as String)
        def generateKey = this.&generateWidgetKey.curry(dashboardSettings.widgetIds,
                request.classFqn,
                request.contentCode,
                user.login as String,
                request.widgetKey)
        return saveWidgetSettings(request.widgetSettings, generateKey).with { key ->
            dashboardSettings.widgetIds = dashboardSettings.widgetIds - request.widgetKey + key
            if (!saveJsonSettings(personalDashboardKey, toJson(dashboardSettings)))
            {
                throw new Exception("Widget $key not saved in dashboard $personalDashboardKey")
            }
            toJson(key)
        }
    }
}

/**
 * Сохранение настроек виджета
 * @param requestContent - json в формате RequestCreateWidgetSettings
 * @param user           - БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ созданного виджета
 */
String createPersonalWidgetSettings(Map<String, Object> requestContent, def user)
{
    def request = requestContent as RequestCreateWidgetSettings
    checkRightsOnEditDashboard(request.editable)
    Closure createDashboardKeyFromLogin = this.&generateDashboardKey.curry(request.classFqn, request.contentCode)
    String dashboardKey = createDashboardKeyFromLogin(user.login as String)
    def dashboardSettings = getDashboardSetting(dashboardKey)
            ?: getDashboardSetting(createDashboardKeyFromLogin(null))

    def generateKey = this.&generateWidgetKey.curry(
            dashboardSettings.widgetIds,
            request.classFqn,
            request.contentCode,
            user?.login as String)
    return saveWidgetSettings(request.widgetSettings, generateKey).with { key ->
        dashboardSettings.widgetIds += key
        saveJsonSettings(dashboardKey, toJson(dashboardSettings))
        toJson(key)
    }
}

/**
 * Метод удаления персонального виджета
 * @param requestContent - тело запроса
 * @param user           - пользователь
 * @return успех | провал
 */
String deletePersonalWidget(Map<String, Object> requestContent, def user)
{
    RequestDeleteWidgetSettings request = requestContent as RequestDeleteWidgetSettings

    String personalDashboardKey = generateDashboardKey(request.classFqn, request.contentCode, user.login as String)
    String defaultDashboardKey = generateDashboardKey(request.classFqn, request.contentCode)

    if (checkUserOnMasterDashboard(user) || request.editable)
    {
        if (isPersonalWidget(request.widgetId, user))
        {
            Closure<String> removeWidgetFromPersonalDashboard = this.&removeWidgetFromDashboard.curry(personalDashboardKey)
            return toJson(removeWidgetSettings(request.widgetId).with(removeWidgetFromPersonalDashboard) as boolean)
        }
        else
        {
            def settings = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
            settings.widgetIds -= request.widgetId
            def res = saveJsonSettings(personalDashboardKey, toJson(settings))
            if (!res)
            {
                throw new Exception("Widget ${request.widgetId} not removed from dashboard: $personalDashboardKey!")
            }
            return toJson(res)
        }
    }
    else
    {
        throw new Exception("No rights on remove widget")
    }
}

/**
 * Метод удаления виджета по умолчанию
 * @param requestContent - тело запроса
 * @param user           - пользователь
 * @return успех | провал
 */
String deleteWidget(Map<String, Object> requestContent, def user)
{
    def request = requestContent as RequestDeleteWidgetSettings
    def dashboardKeyByLogin = this.&generateDashboardKey.curry(request.classFqn, request.contentCode)
    if (!user)
    {
        // значит это супер пользователь!
        // нет персональных виджетов и персональных дашбордов
        Closure<String> removeWidgetFromDefaultDashboard = this.&removeWidgetFromDashboard.curry(dashboardKeyByLogin())
        def resultOfRemoving = removeWidgetSettings(request.widgetId).with(removeWidgetFromDefaultDashboard) as boolean
        return toJson(resultOfRemoving)
    }
    else if (checkUserOnMasterDashboard(user))
    {
        if (isPersonalWidget(request.widgetId, user))
        {
            String personalDashboardKey = dashboardKeyByLogin(user.login as String)
            String defaultWidget = request.widgetId - "_${user.login}"
            Closure<String> removeFromPersonalDashboard = this.&removeWidgetFromDashboard.curry(personalDashboardKey)
            def resultOfRemoving = removeWidgetSettings(request.widgetId).with(removeFromPersonalDashboard) as boolean
            if (findJsonSettings(defaultWidget))
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
            def resultOfRemoving = removeWidgetSettings(request.widgetId).with { String widgetKey ->
                // По возможности удалить и персональный виджет, если он есть
                String personalDashboardKey = dashboardKeyByLogin(user.login as String)
                loadJsonSettings(personalDashboardKey) // проверка на существование персонального дашборда
                        ?.with { removeWidgetFromDashboard(personalDashboardKey, widgetKey) }
                removeWidgetFromDashboard(dashboardKeyByLogin(), widgetKey) as boolean
            }
            return toJson(resultOfRemoving)
        }
    }
    else
    {
        throw new Exception("No rights on remove widget")
    }
}

/**
 * Сброс персонального дашборда в дашборд по умолчанию
 * @param classFqn    - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param user        - БО текущего пользователя
 * @return статус сообщение
 */
String resetPersonalDashboard(String classFqn, String contentCode, def user)
{
    //TODO: добавить локализацию в дальнейшем
    if (!user) throw new Exception([message: "Super-user can't reset dashboard settings!"])
    String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user.login as String)
    DashboardSettings personalDashboard = getDashboardSetting(personalDashboardKey)
    return personalDashboard ? deleteJsonSettings(personalDashboardKey).with { resultOfRemoving ->
        if (resultOfRemoving)
        {
            personalDashboard.widgetIds
                    .findAll(this.&isPersonalWidget.ncurry(1, user))
                    .each(this.&deleteJsonSettings)
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
 * Есть ли группа мастер дашбордов у пользователя
 * @param user БО текущего пользователя
 * @return наличие | отсутствие группы
 */
String getUserRole(def user)
{
    if (!user)
    {
        return "super"
    }
    else if (checkUserOnMasterDashboard(user))
    {
        return "master"
    }
    else
    {
        return null
    }
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
    if (!deleteJsonSettings(widgetKey))
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
    return saveJsonSettings(dashboardKey, toJson(dashboardSettings))
}

/**
 * Метод сохранения виджета. В случае неудачи, бросает исключение
 * @param settings     - настройки виджета
 * @param generateCode - метод генерации ключа виджета
 * @return сгенерированнй ключ нового виджета
 */
private String saveWidgetSettings(Map settings, Closure<String> generateCode) {
    String key = generateCode()
    if(!saveJsonSettings(key, toJson(setUuidInSettings(settings, key)))) {
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
    String type = utils.get(classFqn)?.metaClass?.toString()
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
                loadJsonSettings(uuidWidget))
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
    String type = utils.get(classFqn)?.metaClass?.toString()
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
    return getSettingsFromJson(loadJsonSettings(dashboardKey)) as DashboardSettings
}

/**
 * Получение настроек виджета
 * @param widgetKey ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджета
 */
private Map<String, Object> getWidgetSettings(String widgetKey)
{
    return getSettingsFromJson(loadJsonSettings(widgetKey)) as Map<String, Object>
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
    user?.UUID ? GROUP_MASTER_DASHBOARD in utils.get(user.UUID).all_Group*.code : true
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
    def settings = [:] << (widgetSettings)
    settings.id = key
    //так как копирование было не глубокое, копируем ещё
    def layout = [:] << settings.layout
    layout.i = key
    settings.layout = layout
    return settings
}

/**
 * Добавить layout в настройки
 * @param responseWidgetSettings настройки виджета в формате ResponseWidgetSettings
 * @return настройки виджета с обновленным layout
 */
private def setLayoutInSettings(Map<String, Object> settings)
{ //TODO: а зачем вообще нужен этот метод?
    WidgetSettings widgetSettings = settings as WidgetSettings
    def newSettings = getSettingsFromJson(loadJsonSettings(widgetSettings.key))
    newSettings.layout = widgetSettings.value
    return newSettings

}

/**
 * Метод поиска настроек по частичному ключу
 * @param keyPart   - частичный ключ
 * @param predicate - метод дополнительной фильтрации
 * @return коллекцию ключей и настроек
 */
private Map<String, String> findJsonSettings(String keyPart, Closure<Boolean> predicate = { key, value -> true })
{
    return api.keyValue.find(NAMESPACE, keyPart, predicate)
}

/**
 * Метод загрузки настроек по ключу объекта
 * @param key - уникальный идентификатор объекта
 * @return сериализованные настройки объекта
 */
private String loadJsonSettings(String key)
{
    return api.keyValue.get(NAMESPACE, key)
}

/**
 * Метод сохранения настроек объекта
 * @param key       - уникальный идентификатор объекта
 * @param jsonValue - ыериализованные настройки объекта
 * @return true/false успешное/провалльное сохранение
 */
private Boolean saveJsonSettings(String key, String jsonValue)
{
    return api.keyValue.put(NAMESPACE, key, jsonValue)
}

/**
 * Метод удаления настроек объекта
 * @param key - уникальный идентификатор объекта
 * @return true/false успешное/провалльное удаление
 */
private Boolean deleteJsonSettings(String key)
{
    return api.keyValue.delete(NAMESPACE, key)
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
//endregion