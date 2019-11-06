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
    Boolean editable
    String classFqn
    String contentCode
    Map<String, Object> widgetSettings
}

/**
 * Модель тело запроса - редактирование настроек виджета
 */
class RequestEditWidgetSettings
{
    Boolean editable
    String classFqn
    String contentCode
    String widgetKey
    Map<String, Object> widgetSettings
}

/**
 * Модель тело запроса - редактирование настроек виджетов
 */
class RequestEditWidgetsSettings
{
    Boolean editable
    String classFqn
    String contentCode
    Collection<ResponseWidgetSettings> layoutsSettings
}

/**
 * Модель тело запроса - удаление настроек виджетов
 */
class RequestDeleteWidgetSettings {
    Boolean editable
    String classFqn
    String contentCode
    String widgetKey
}

/**
 * Модель тело ответа - настроек виджета
 */
@TupleConstructor
class ResponseWidgetSettings
{
    String key
    Map<String, Object> value
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
    Closure<DashboardSettings> getSettingFromLogin = this.&getDashboardSetting.curry(classFqn, contentCode)
    DashboardSettings dashboardSettings = getSettingFromLogin(user?.login) ?: getSettingFromLogin(null)
    return toJson(getAllWidgetsSettings(dashboardSettings))
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
    RequestCreateWidgetSettings request = new RequestCreateWidgetSettings(requestContent)
    String dashboardKey = generateDashboardKey(request.classFqn, request.contentCode, null)
    String dashboardJsonSettings = loadJsonSettings(dashboardKey)
    DashboardSettings dashboardSettings = getSettingsFromJson(dashboardJsonSettings)
    return toJson(createWidget(request, dashboardKey, dashboardSettings, null))
}

/**
 * Массовое редактирование виджетов в дашборде по умолчанию
 * @param requestContent json в формате RequestEditWidgetsSettings
 * @param user БО текущего пользователя
 * @return список ключей отредактированнных виджетов
 */
String bulkEditDefaultWidget(Map<String, Object> requestContent, def user)
{
    RequestEditWidgetsSettings request = new RequestEditWidgetsSettings(requestContent)
    return request.layoutsSettings.collect {
        def widgetSettings = setLayoutInSettings(it)
        Map<String, Object> widgetRequest = [
                classFqn: request.classFqn,
                contentCode: request.contentCode,
                widgetKey: it.key,
                widgetSettings: widgetSettings]
        editDefaultWidget(widgetRequest, user)
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
    RequestEditWidgetSettings request = new RequestEditWidgetSettings(requestContent)
    String widgetKey = request.widgetKey
    def widgetSettings = setUuidInSettings(request.widgetSettings, widgetKey)
    saveJsonSettings(widgetKey, toJson(widgetSettings))
    return toJson(widgetKey)
}

/**
 * Массовое редактирование виджетов в дашборде
 * @param requestContent json в формате RequestEditWidgetsSettings
 * @param user БО текущего пользователя
 * @return список ключей отредактированнных виджетов
 */
String bulkEditWidget(Map<String, Object> requestContent, def user)
{
    RequestEditWidgetsSettings request = new RequestEditWidgetsSettings(requestContent)
    return request.layoutsSettings.collect {
        def widgetSettings = setLayoutInSettings(it)
        Map<String, Object> widgetRequest = [
                editable: true,
                classFqn: request.classFqn,
                contentCode: request.contentCode,
                widgetKey: it.key,
                widgetSettings: widgetSettings]
        editPersonalWidgetSettings(widgetRequest, user)
    }
}

/**
 * Редактирование настроек виджета
 * @param requestContent    - json в формате RequestEditWidgetSettings
 * @param user              - БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ отредактированного виджета
 */
String editPersonalWidgetSettings(Map<String, Object> requestContent, def user)
{
    RequestEditWidgetSettings request = new RequestEditWidgetSettings(requestContent)
    checkRightsOnEditDashboard(request.editable)
    Closure<String> createDashboardKeyFromLogin = this.&generateDashboardKey.curry(request.classFqn, request.contentCode)
    if(request.widgetKey.endsWith("_${user.login}"))
    {
        String widgetKey = request.widgetKey
        def widgetSettings = setUuidInSettings(request.widgetSettings, widgetKey)
        saveJsonSettings(widgetKey, toJson(widgetSettings))
        return toJson(widgetKey)
    }
    else
    {
        String dashboardKey = createDashboardKeyFromLogin(user.login)
        String dashboardJsonSettings = loadJsonSettings(dashboardKey)
                ?: loadJsonSettings(createDashboardKeyFromLogin(null))
        DashboardSettings dashboardSettings = getSettingsFromJson(dashboardJsonSettings)
        return toJson(editWidget(request, dashboardKey, dashboardSettings, user))
    }
}

/**
 * Сохранение настроек виджета
 * @param requestContent    - json в формате RequestCreateWidgetSettings
 * @param user              - БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ созданного виджета
 */
String createPersonalWidgetSettings(Map<String, Object> requestContent, def user)
{
    RequestCreateWidgetSettings request = new RequestCreateWidgetSettings(requestContent)
    checkRightsOnEditDashboard(request.editable)
    Closure createDashboardKeyFromLogin = this.&generateDashboardKey.curry(request.classFqn, request.contentCode)
    String dashboardKey = createDashboardKeyFromLogin(user.login)
    String dashboardJsonSettings = loadJsonSettings(dashboardKey)
            ?: loadJsonSettings(createDashboardKeyFromLogin(null))
    DashboardSettings dashboardSettings = getSettingsFromJson(dashboardJsonSettings)
    return toJson(createWidget(request, dashboardKey, dashboardSettings, user))
}

/**
 * Удаление виджета по умолчанию мастером дашбордов
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param user БО текущего пользователя
 * @param widgetKey ключ виджета
 * @return успех | провал удаления
 */
String deleteDefaultWidget(String classFqn, String contentCode, def user, String key)
{
    String widgetKey = key
    checkRightsOnDashboard(user, "delete")
    DashboardSettings dashboardSettings = getDashboardSetting(classFqn, contentCode, null)
    dashboardSettings.widgetIds.remove(widgetKey)
    saveDashboard(classFqn, contentCode, dashboardSettings.widgetIds, null)
    return deleteJsonSettings(widgetKey)
}

/**
 * Удаление виджета
 * @param requestContent    - тело запроса
 * @return успех | провал удаления
 */
String deleteWidget(Map<String, Object> requestContent, def user)
{
    RequestDeleteWidgetSettings request = new RequestDeleteWidgetSettings(requestContent)
    String widgetKey = request.widgetKey
    checkRightsOnEditDashboard(request.editable)
    Closure<DashboardSettings> getDashboardSettingsFromLogin =
            this.&getDashboardSetting.curry(request.classFqn, request.contentCode)
    DashboardSettings dashboardSettings = getDashboardSettingsFromLogin(user.login)
    if(!dashboardSettings && !widgetKey.endsWith("_${user.login}"))
    {
        dashboardSettings = getDashboardSettingsFromLogin(null)
    }
    else if(widgetKey.endsWith("_${user.login}"))
    {
        deleteJsonSettings(widgetKey)
    }
    dashboardSettings.widgetIds.remove(widgetKey)
    String dashboardKey = generateDashboardKey(request.classFqn, request.contentCode, user.login)
    return saveJsonSettings(dashboardKey, toJson(dashboardSettings))
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
        it.endsWith("_${user.login}") ? deleteJsonSettings(it) : null
    }
    return deleteJsonSettings(generateDashboardKey(classFqn, contentCode, user.login))
}

/**
 * Есть ли группа мастер дашбордов у пользователя
 * @param user БО текущего пользователя
 * @return наличие | отсутствие группы
 */
String getAvailabilityGroupMasterDashboard(def user)
{
    return toJson(checkUserOnMasterDashboard(user))
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Сохранение дашборда со списком ключей виджетов
 * @param classFqn код типа куда выведено встроенное приложение
 * @param contentCode код контента встроенного приложения
 * @param widgetKeys список ключей виджетов для данного дашборда
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return успех|провал сохранения/обновления
 */
private String saveDashboard(String classFqn, String contentCode, Collection<String> widgetKeys, def user)
{
    String dashboardKey = generateDashboardKey(classFqn, contentCode, user?.login)
    String dashboardJsonSettings = toJson(new DashboardSettings(widgetKeys))
    return toJson(saveJsonSettings(dashboardKey, dashboardJsonSettings))
}

/**
 * Создание виджета
 * @param request данные для создания виджета
 * @param dashboardKey ключ дашборда
 * @param dashboardSettings настройки дашборда
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ созданного виджета
 */
private String createWidget(RequestCreateWidgetSettings request,
                            String dashboardKey,
                            DashboardSettings dashboardSettings,
                            def user)
{
    dashboardSettings = dashboardSettings ?: new DashboardSettings([])
    String widgetKey = generateWidgetKey(dashboardSettings.widgetIds, user?.login)
    def widgetSettings = setUuidInSettings(request.widgetSettings, widgetKey)
    String widgetJsonSettings = toJson(widgetSettings)
    saveJsonSettings(widgetKey, widgetJsonSettings)
    dashboardSettings.widgetIds << widgetKey
    saveJsonSettings(dashboardKey, toJson(dashboardSettings))
    return widgetKey
}

/**
 * Изменение виджета
 * @param request данные для редактирования виджета
 * @param dashboardKey ключ дашборда
 * @param dashboardSettings настройки дашборда
 * @param user БО текущего пользователя или null если сохранение по умолчанию
 * @return ключ отредактированного виджета
 */
private String editWidget(RequestEditWidgetSettings request,
                          String dashboardKey,
                          DashboardSettings dashboardSettings,
                          def user)
{
    String widgetKey = generateWidgetKey(dashboardSettings.widgetIds, user.login)
    def widgetSettings = setUuidInSettings(request.widgetSettings, widgetKey)
    saveJsonSettings(widgetKey, toJson(widgetSettings))
    dashboardSettings.widgetIds << widgetKey
    dashboardSettings.widgetIds.remove(request.widgetKey)
    saveJsonSettings(dashboardKey, toJson(dashboardSettings))
    return widgetKey
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
    String type = utils.get(classFqn)?.metaClass?.toString()
    String loginKeyPart = login ? "_${login}" : ''
    return "${type}_${contentCode}${loginKeyPart}"
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
                loadJsonSettings(uuidWidget))
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
    String dashboardJsonSettings = loadJsonSettings(generateDashboardKey(classFqn, contentCode, login))
    return getSettingsFromJson(dashboardJsonSettings)
}

/**
 * Получение настроек всех виджетов дашборда
 * @param key ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджетов
 */
private Collection<ResponseWidgetSettings> getAllWidgetsSettings(DashboardSettings dashboardSettings)
{
    return dashboardSettings?.widgetIds?.collect { getWidgetSettings(it) }
}

/**
 * Получение настроек виджета
 * @param widgetKey ключ в формате
 * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
 * @return настройки виджета
 */
private ResponseWidgetSettings getWidgetSettings(String widgetKey)
{
    String widgetJsonSettings = loadJsonSettings(widgetKey)
    def widgetSettings = getSettingsFromJson(widgetJsonSettings)
    return new ResponseWidgetSettings(widgetKey, widgetSettings)
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
    user?.UUID ? GROUP_MASTER_DASHBOARD in utils.get(user.UUID).all_Group*.code : false
}

/**
 * Проверка на право редактирования настроек дашборда
 * @param editable  - переменная разрешения на редактирование настроек пользователю
 */
private checkRightsOnEditDashboard(def editable)
{
    if (!editable) {
        throw new Exception(toJson([error: "Personal settings are disabled!"]))
    }
}

/**
 * Пробросить сгенерированный ключ в настройки виджета
 * @param widgetSettings    - настройки виджета
 * @param key               - сгенерированный uuid ключ
 * @return настройки виджета с ключом
 */
private def setUuidInSettings(def widgetSettings, String key)
{
    //widgetSettings является неизменяемым, поэтому создаём ноый объект и копируем все значения
    def settings = [:] << (widgetSettings)
    settings.id = key
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
private def setLayoutInSettings(Map<String, Object> widgetSettings)
{
    ResponseWidgetSettings responseWidgetSettings = new ResponseWidgetSettings(widgetSettings)
    String widgetJsonSettings = loadJsonSettings(responseWidgetSettings.key)
    def settings = getSettingsFromJson(widgetJsonSettings)
    def layout = responseWidgetSettings.value
    settings.layout = layout
    return settings

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