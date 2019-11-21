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
    String widgetId
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
 * @param classFqn    - код типа куда выведено встроенное приложение
 * @param contentCode - код контента встроенного приложения
 * @param user        - БО текущего пользователя
 * @return список ключей и настроек виджетов в формате ResponseWidgetSettings
 */
String getSettings(String classFqn, String contentCode, def user)
{
    Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(classFqn, contentCode)
    DashboardSettings dashboardSettings = getSettingByLogin(user?.login as String) ?: getSettingByLogin(null)
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
    String defaultDashboardKey = generateDashboardKey(request.classFqn, request.contentCode)
    DashboardSettings dashboardSettings = getDashboardSetting(defaultDashboardKey)
    return toJson(createWidget(request, defaultDashboardKey, dashboardSettings, null))
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
    if(user && isPersonalWidget(request.widgetKey, user))
    {
        widgetKey -= "_${user.login}"
        def closureReplaceWidgetKey = { login ->
            String dashboardKey = generateDashboardKey(
                    request.classFqn,
                    request.contentCode,
                    login)
            DashboardSettings dashboardSettings = getDashboardSetting(dashboardKey)
            dashboardSettings.widgetIds.remove(request.widgetKey)
            if(!(widgetKey in dashboardSettings.widgetIds))
            {
                dashboardSettings.widgetIds << widgetKey
            }
            saveJsonSettings(dashboardKey, toJson(dashboardSettings))
        }
        closureReplaceWidgetKey(user.login)
        closureReplaceWidgetKey(null)
        deleteJsonSettings(request.widgetKey)
    }
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
    Closure<DashboardSettings> getSettingByLogin = this.&getDashboardSetting.curry(request.classFqn, request.contentCode)
    if (user && isPersonalWidget(request.widgetKey, user))
    {
        String widgetKey = request.widgetKey
        def widgetSettings = setUuidInSettings(request.widgetSettings, widgetKey)
        saveJsonSettings(widgetKey, toJson(widgetSettings))
        return toJson(widgetKey)
    }
    else
    {
        DashboardSettings dashboardSettings = getSettingByLogin(user.login as String)
                ?: getSettingByLogin(null)
        String dashboardKey = generateDashboardKey(request.classFqn, request.contentCode, user.login as String)
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
    String dashboardKey = createDashboardKeyFromLogin(user.login as String)
    String dashboardJsonSettings = loadJsonSettings(dashboardKey)
            ?: loadJsonSettings(createDashboardKeyFromLogin(null))
    DashboardSettings dashboardSettings = getSettingsFromJson(dashboardJsonSettings)
    return toJson(createWidget(request, dashboardKey, dashboardSettings, user))
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
            def res = saveWidgetsToDashboard(personalDashboardKey, settings.widgetIds - request.widgetId)
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

//TODO: метод для обратной совместимости. Удалить в дальнейшем!
// Фронту потребовалось название deleteWidget
String deleteDefaultWidget(Map<String, Object> requestContent, def user) {
    return deleteWidget(requestContent, user)
}

/**
 * Метод удаления виджета по умолчанию
 * @param requestContent - тело запроса
 * @param user           - пользователь
 * @return успех | провал
 */
String deleteWidget(Map<String, Object> requestContent, def user)
{
    RequestDeleteWidgetSettings request = requestContent as RequestDeleteWidgetSettings
    String defaultDashboardKey = generateDashboardKey(request.classFqn, request.contentCode)
    if (!user)
    {
        //значит это супер пользователь!
        // нет персональных виджетов и персональных дашбордов
        Closure<String> removeWidgetFromDefaultDashboard = this.&removeWidgetFromDashboard.curry(defaultDashboardKey)
        return removeWidgetSettings(request.widgetId).with(removeWidgetFromDefaultDashboard) as boolean
    }
    String personalDashboardKey = generateDashboardKey(request.classFqn, request.contentCode, user.login as String)
    if (checkUserOnMasterDashboard(user))
    {
        if (isPersonalWidget(request.widgetId, user))
        {
            Closure<String> removeWidgetFromPersonalDashboard =
                    this.&removeWidgetFromDashboard.curry(personalDashboardKey)
            def personalWidgetIsRemoved = removeWidgetSettings(request.widgetId)
                    .with(removeWidgetFromPersonalDashboard)

            String defaultWidget = request.widgetId - "_${user.login}"
            //По воле случая может получиться так, что виджета по умолчанию уже нет(например удалён другим мастером)
            if (findJsonSettings(defaultWidget))
            {
                Closure<String> removeWidgetFromDefaultDashboard =
                        this.&removeWidgetFromDashboard.curry(defaultDashboardKey)
                removeWidgetSettings(defaultWidget).with(removeWidgetFromDefaultDashboard)
            }
            else
            {
                logger.warn("default widget $defaultWidget not exist")
            }
            return toJson(personalWidgetIsRemoved as boolean)
        }
        else
        {
            def resultOfRemoving = removeWidgetSettings(request.widgetId).with { String widgetKey ->
                def resultOfRemovingFromPersonalDashboard = removeWidgetFromDashboard(personalDashboardKey, widgetKey)
                def resultOfRemovingFromDefaultDashboard = removeWidgetFromDashboard(defaultDashboardKey, widgetKey)
                resultOfRemovingFromPersonalDashboard && resultOfRemovingFromDefaultDashboard
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
 * @return успех | провал сброса
 */
String resetPersonalDashboard(String classFqn, String contentCode, def user)
{
    DashboardSettings dashboardSettings = getDashboardSetting(generateDashboardKey(classFqn, contentCode, user.login as String))
    if(!dashboardSettings)
    {
        return "Personal dashboard not found"
    }
    dashboardSettings.widgetIds.each {
        if (it.endsWith("_${user.login}"))
        {
            deleteJsonSettings(it)
        }
    }
    return deleteJsonSettings(generateDashboardKey(classFqn, contentCode, user.login as String))
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
    def widgetsIds = dashboardSettings.widgetIds
    return saveWidgetsToDashboard(dashboardKey, widgetsIds - widgets)
}

/**
 * Сохранение дашборда со списком ключей виджетов
 * @param dashboardKey - уникальный идентификатор дашборда
 * @param widgetKeys   - список ключей виджетов для данного дашборда
 * @return успех|провал сохранения/обновления
 */
private boolean saveWidgetsToDashboard(String dashboardKey, Collection<String> widgetKeys)
{
    String dashboardJsonSettings = toJson(new DashboardSettings(widgetKeys))
    return saveJsonSettings(dashboardKey, dashboardJsonSettings)
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
    String widgetKey = generateWidgetKey(
            dashboardSettings.widgetIds,
            request.classFqn,
            request.contentCode,
            user?.login as String)
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
    String widgetKey = generateWidgetKey(
            dashboardSettings.widgetIds,
            request.classFqn,
            request.contentCode,
            user.login as String,
            request.widgetKey)
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
private String generateDashboardKey(String classFqn, String contentCode, String login = null)
{
    String type = utils.get(classFqn)?.metaClass?.toString()
    String loginKeyPart = login ? "_${login}" : ''
    return "${type}_${contentCode}${loginKeyPart}"
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
private DashboardSettings getDashboardSetting(String classFqn, String contentCode, String login)
{
	String dashboardKey = generateDashboardKey(classFqn, contentCode, login)
	return getDashboardSetting(dashboardKey)
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
    Map<String, Object> widgetSettings = getSettingsFromJson(widgetJsonSettings) as Map<String, Object>
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
    user?.UUID
        ? GROUP_MASTER_DASHBOARD in utils.get(user.UUID).all_Group*.code
        : true
}

/**
 * Проверка на право редактирования настроек дашборда
 * @param editable  - переменная разрешения на редактирование настроек пользователю
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
    return widgetKey.endsWith("_${user.login}")
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
 * Метод поиска настроек по частичному ключу
 * @param keyPart   - частичный ключ
 * @param predicate - метод дополнительной фильтрации
 * @return коллекцию ключей и настроек
 */
private Map<String, String> findJsonSettings(String keyPart, Closure<Boolean> predicate = { key, value -> true})
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