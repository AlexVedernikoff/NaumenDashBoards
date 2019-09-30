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
import groovy.transform.Immutable
import groovy.transform.TupleConstructor

import static groovy.json.JsonOutput.toJson

//region КОНСТАНТЫ
@Field private static final String NAMESPACE = 'dashboards'
@Field private static final String GROUP_MASTER_DASHBOARD = 'ROLE_MASTER_DASHBOARDS'
//endregion

//region КЛАССЫ
/**
 * Модель настроек дашборда в бд
 */
@TupleConstructor
class DashboardSettings
{
    Collection<String> widgetIds = []
}

/**
 * Модель тело запроса - создание настроек виджета
 */
class RequestCreateWidgetSettings
{
    String classFqn
    String contentCode
    String widgetSettings
}

/**
 * Модель тело запроса - редактирование настроек виджета
 */
class RequestEditWidgetSettings
{
    String classFqn
    String contentCode
    String widgetKey
    String widgetSettings
}

/**
 * Модель тело запроса - редактирование настроек виджетов
 */
class RequestEditWidgetsSettings
{
    String classFqn
    String contentCode
    Collection<ResponseWidgetSettings> layoutsSettings
}

/**
 * Модель тело ответа - настроек виджета
 */
@TupleConstructor
class ResponseWidgetSettings
{
    String key
    String value
}
//endregion

//region REST-МЕТОДЫ
/**
 * Получение настроек дашборда и виджетов
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param user БО текущего пользователя
 * @return список ключей и настроек виджетов в формате ResponseWidgetSettings
 */
String getSettings(String classFqn, String contentCode, def user)
{
    DashboardSettings dashboardSettings = getDashboardSetting(classFqn, contentCode, user?.login)
    dashboardSettings = dashboardSettings ?: getDashboardSetting(classFqn, contentCode, null)
    return getAllWidgetsSettings(dashboardSettings)
}

/**
 * Создание виджета в дашборде по умолчанию
 * @param requestContent json в формате RequestCreateWidgetSettings
 * @param user БО текущего пользователя
 * @return ключ созданного виджета
 */
String createDefaultWidgetSettings(Map<String, Object> requestContent, def user)
{
    checkRightsOnDashboard(user, "создание")
    def request = new RequestCreateWidgetSettings(requestContent)
    String dashboardKey = generateDashboardKey(
            request.classFqn,
            request.contentCode,
            null)
    String dashboardSettings = api.keyValue.get(NAMESPACE, dashboardKey)
    return toJson(createWidget(request, dashboardKey, dashboardSettings, null))
}

/**
 * Редактирование виджета в дашборде по умолчанию
 * @param requestContent json в формате RequestEditWidgetSettings
 * @param user БО текущего пользователя
 * @return ключ отредактированного виджета
 */
String editDefaultWidget(Map<String, Object> requestContent, def user)
{
    checkRightsOnDashboard(user, "редактирование")
    def request = new RequestEditWidgetSettings(requestContent)
    api.keyValue.put(NAMESPACE,
            request.widgetKey,
            setUuidInSettings(request.widgetSettings, request.widgetKey))
    return toJson(request.widgetKey)
}

/**
 * Массовое редактирование виджетов в дашборде по умолчанию
 * @param requestContent json в формате RequestEditWidgetsSettings
 * @param user БО текущего пользователя
 * @return список ключей отредактированнных виджетов
 */
String bulkEditDefaultWidget(Map<String, Object> requestContent, def user)
{
    def request = new RequestEditWidgetsSettings(requestContent)
    return request.layoutsSettings.collect {
        String widgetSettings = setLayoutInSettings(new ResponseWidgetSettings(it))
        Map<String, Object> widget = [
                classFqn: request.classFqn,
                contentCode: request.contentCode,
                widgetKey: it.key,
                widgetSettings: widgetSettings]
        editDefaultWidget(widget, user)
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
    def request = new RequestEditWidgetsSettings(requestContent)
    return request.layoutsSettings.collect {
        String widgetSettings = setLayoutInSettings(new ResponseWidgetSettings(it))
        Map<String, Object> widget = [
                classFqn: request.classFqn,
                contentCode: request.contentCode,
                widgetKey: it.key,
                widgetSettings: widgetSettings]
        editPersonalWidgetSettings(widget, user)
    }
}

/**
 * Сохранение настроек виджета
 * @param requestContent json в формате RequestCreateWidgetSettings
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ созданного виджета
 */
String createPersonalWidgetSettings(Map<String, Object> requestContent, def user)
{
    def request = new RequestCreateWidgetSettings(requestContent)
    String dashboardKey = generateDashboardKey(request.classFqn, request.contentCode, user.login)
    String dashboardSettings = api.keyValue.get(NAMESPACE, dashboardKey)
    if(!dashboardSettings)
    {
        dashboardSettings = api.keyValue.get(
                NAMESPACE,
                generateDashboardKey(request.classFqn, request.contentCode, null))
    }
    return toJson(createWidget(request, dashboardKey, dashboardSettings, user))
}

/**
 * Редактирование настроек виджета
 * @param requestContent json в формате RequestEditWidgetSettings
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ отредактированного виджета
 */
String editPersonalWidgetSettings(Map<String, Object> requestContent, def user)
{
    def request = new RequestEditWidgetSettings(requestContent)
    if(request.widgetKey.endsWith("_${user.login}"))
    {
        api.keyValue.put(NAMESPACE,
                request.widgetKey,
                setUuidInSettings(request.widgetSettings, request.widgetKey))
        return toJson(request.widgetKey)
    }
    else
    {
        String dashboardKey = generateDashboardKey(
                request.classFqn,
                request.contentCode,
                user.login)
        String dashboardValue = api.keyValue.get(NAMESPACE, dashboardKey)
        if(!dashboardValue)
        {
            dashboardValue = api.keyValue.get(
                    NAMESPACE,
                    generateDashboardKey(request.classFqn, request.contentCode, null))
        }
        return toJson(editWidget(request, dashboardKey, dashboardValue, user))
    }
}

/**
 * Удаление виджета по умолчанию мастером дашбордов
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param user БО текущего пользователя
 * @param key ключ виджета
 * @return успех | провал удаления
 */
String deleteDefaultWidget(String classFqn, String contentCode, def user, String key)
{
    checkRightsOnDashboard(user, "удаление")
    DashboardSettings dashboardSettings = getDashboardSetting(classFqn, contentCode, null)
    dashboardSettings.widgetIds -= key
    saveDashboard(classFqn, contentCode, dashboardSettings.widgetIds, null)
    return api.keyValue.delete(NAMESPACE, key)
}

/**
 * Удаление виджета
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param user БО текущего пользователя
 * @param key ключ виджета
 * @return успех | провал удаления
 */
String deleteWidget(String classFqn, String contentCode, def user, String key)
{
    DashboardSettings boardSettings = getDashboardSetting(classFqn, contentCode, user.login)
    if(!boardSettings && !key.endsWith("_${user.login}"))
    {
        boardSettings = getDashboardSetting(classFqn, contentCode, null)
    }
    else if(key.endsWith("_${user.login}"))
    {
        api.keyValue.delete(NAMESPACE, key)
    }
    boardSettings.widgetIds -= key
    String dashboardKey = generateDashboardKey(classFqn, contentCode, user.login)
    return api.keyValue.put(NAMESPACE, dashboardKey, toJson(boardSettings))
}

/**
 * Сброс персонального дашборда в дашборд по умолчанию
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param user БО текущего пользователя
 * @return успех | провал сброса
 */
String resetPersonalDashboard(String classFqn, String contentCode, def user)
{
    DashboardSettings dashboardSettings = getDashboardSetting(classFqn, contentCode, user.login)
    dashboardSettings.widgetIds.each {
        it.endsWith("_${user.login}") ? api.keyValue.delete(NAMESPACE, it) : null
    }
    return api.keyValue.delete(NAMESPACE, generateDashboardKey(classFqn, contentCode, user.login))
}

/**
 * Есть ли группа мастер дашбордов у пользователя
 * @param user БО текущего пользователя
 * @return наличие | отсутствие группы
 */
String getAvailabilityGroupMasterDashboard(def user)
{
    def employee = utils.get(user.UUID)
    return toJson(GROUP_MASTER_DASHBOARD in employee.all_Group.code[0])
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Сохранение дашборда со списком ключей виджетов
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param keys список ключей виджетов для данного дашборда
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return успех|провал сохранения/обновления
 */
private String saveDashboard(String classFqn, String contentCode, Collection<String> keys, def user)
{
    String key = generateDashboardKey(classFqn, contentCode, user?.login)
    String value = toJson(new DashboardSettings(keys))
    return toJson(api.keyValue.put(NAMESPACE, key, value))
}

/**
 * Создание виджета
 * @param request данные для создания виджета
 * @param dashboardKey ключ дашборда
 * @param dashboardValue настройки дашборда
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ созданного виджета
 */
private String createWidget(RequestCreateWidgetSettings request,
                            String dashboardKey,
                            String dashboardValue,
                            def user)
{
    DashboardSettings dashboardSettings = dashboardValue
            ? new JsonSlurper().parseText(dashboardValue)
            : new DashboardSettings([])
    String key = generateWidgetKey(dashboardSettings.widgetIds, user?.login)
    api.keyValue.put(NAMESPACE, key, setUuidInSettings(request.widgetSettings, key))
    dashboardSettings.widgetIds << key
    api.keyValue.put(NAMESPACE, dashboardKey, toJson(dashboardSettings))
    return key
}

/**
 * Создание виджета
 * @param request данные для редактирования виджета
 * @param dashboardKey ключ дашборда
 * @param dashboardValue настройки дашборда
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ отредактированного виджета
 */
private String editWidget(RequestEditWidgetSettings request,
                          String dashboardKey,
                          String dashboardValue,
                          def user)
{
    DashboardSettings boardSettings = new JsonSlurper().parseText(dashboardValue)
    String key = generateWidgetKey(boardSettings.widgetIds, user.login)
    api.keyValue.put(NAMESPACE, key, setUuidInSettings(request.widgetSettings, key))
    boardSettings.widgetIds << key
    boardSettings.widgetIds -= request.widgetKey
    api.keyValue.put(NAMESPACE, dashboardKey, toJson(boardSettings))
    return key
}

/**
 * Генерация ключа для сохранения настроек дашборда
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param login логин пользователя или пустое значение если сохранение по умолчанию
 * @return сгенированный ключ для дашборда
 */
private String generateDashboardKey(String classFqn, String contentCode, String login)
{
    login = login ?: ''
    return "${classFqn}_${contentCode}${login ? '_' : ''}${login}"
}

/**
 * Генерация ключа для сохранения настроек виджета
 * @param keys существующие ключи
 * @param login логин пользователя или пустое значение если сохранение по умолчанию
 * @return сгенированный ключ для виджета
 */
private String generateWidgetKey(Collection<String> keys, String login)
{
    def loginKeyPart = login ? "_${login}" : ''
    String uuidWidget
    while ({
        uuidWidget = "${UUID.randomUUID()}${loginKeyPart}"
        (keys.contains(uuidWidget) &&
        api.keyValue.get(NAMESPACE, uuidWidget))
    }()) continue
    return uuidWidget
}

/**
 * Получение настроек дашборда со списком ключей виджетов
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param login логин пользователя или пустое значение если сохранение по умолчанию
 * @return настройки дашборда
 */
private DashboardSettings getDashboardSetting(String classFqn, String contentCode, String login)
{
    String keys = api.keyValue.get(NAMESPACE, generateDashboardKey(classFqn, contentCode, login))
    if(keys)
    {
        def dashboardSettings = new JsonSlurper().parseText(keys)
        return dashboardSettings
    }
    return null
}

/**
 * Получение настроек виджета
 * @param key ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджета
 */
private String getWidgetSettings(String key)
{
    String value = api.keyValue.get(NAMESPACE, key)
    return toJson(new ResponseWidgetSettings(key, value))
}

/**
 * Получение настроек всех виджетов дашборда
 * @param key ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджетов
 */
private String getAllWidgetsSettings(DashboardSettings dashboardSettings)
{
    Collection<String> settings = dashboardSettings?.widgetIds?.collect { getWidgetSettings(it) }
    return settings
}

/**
 * Проверка пользователя на наличие группы мастер дашбордов
 * @param user БО текущего пользователя
 * @param messageError сообщение о ошибке
 */
private checkRightsOnDashboard(def user, String messageError)
{
    def employee = utils.get(user.UUID)
    if (!(GROUP_MASTER_DASHBOARD in employee.all_Group.code[0]))
    {
        throw new Exception(toJson([error: "Пользователь не является мастером дашбордов, " +
                "${messageError} виджета по умолчанию не возможно"]))
    }
}

/**
 * Пробросить сгенерированный ключ в настройки виджета
 * @param widgetSettings настройки виджета
 * @return настройки виджета с ключом
 */
private String setUuidInSettings(String widgetSettings, String key)
{
    def settings = new JsonSlurper().parseText(widgetSettings)
    settings.id = key
    settings.layout.i = key
    return toJson(settings)
}

/**
 * Добавить layout в настройки
 * @param responseWidgetSettings настройки виджета в формате ResponseWidgetSettings
 * @return настройки виджета с обновленным layout
 */
private String setLayoutInSettings(ResponseWidgetSettings responseWidgetSettings)
{
    String widgetSettings = api.keyValue.get(NAMESPACE, responseWidgetSettings.key)
    def jsonSlurper = new JsonSlurper()
    def settings = jsonSlurper.parseText(widgetSettings)
    def layout = jsonSlurper.parseText(responseWidgetSettings.value)
    settings.layout = layout
    return toJson(settings)
}
//endregion