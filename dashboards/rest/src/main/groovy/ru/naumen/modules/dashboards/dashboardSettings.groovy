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
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import com.fasterxml.jackson.databind.ObjectMapper
import com.amazonaws.util.json.Jackson
import ru.naumen.core.shared.IUUIDIdentifiable
import static MessageProvider.*
import static ru.naumen.modules.dashboards.CurrentUserHolder.*

import static groovy.json.JsonOutput.toJson

@Field @Lazy @Delegate DashboardSettings dashboardSettings = new DashboardSettingsImpl(binding)

/**
 * Интерфейс главного контроллера
 */
interface DashboardSettings
{
    /**
     * Получение настроек дашборда и виджетов
     * @param requestContent - параметры запроса (classFqn, contentCode, isPersonal)
     * @param user - текущий пользователь
     * @return настройки автообновления вместе с настройками виджетов
     */
    String getSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Получение кастомных группировок для дашборда по ключу дашборда
     * @param dashboardKey - ключ дашборда
     * @return список кастомных группировок в json-формате
     */
    String getCustomGroups(String dashboardKey)

    /**
     * Получение кастомной группировки для дашборда по ключу дашборда и группировки
     * @param dashboardKey - ключ дашборда
     * @param customGroupKey - ключ группировки на дб
     * @return кастомная группировка в json-формате
     */
    String getCustomGroup(String dashboardKey, String customGroupKey)

    /**
     * Метод обновления состояния автообновления
     * @param requestContent - тело запроса (classFqn, contentCode, autoUpdate)
     * @param user - текущий пользователь
     * @return true|false
     */
    String saveAutoUpdateSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод сохранения настроек кастомных группировок.
     * Сохраняет в персональный дашборд.
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return ключь кастомной группировки
     */
    String saveCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод обноления кастомной группировки
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return новая кастомная группировка
     */
    String updateCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод удаления настроек группировки.
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return ключь кастомной группировки
     */
    String deleteCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод сохранения настроек кастомных цветов.
     * Сохраняет в персональный дашборд.
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return ключь кастомной группировки
     */
    String saveCustomColors(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод удаления настроек цветов.
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return ключь кастомной группировки
     */
    String deleteCustomColors(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод создания персонального дашборда.
     * @param requestContent - тело запроса (editable, classFqn, contentCode)
     * @param user - текущий пользователь
     * @return true|false
     */
    String createPersonalDashboard(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Создание виджета в дашборде
     * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
     * @param user - текущий пользователь
     * @return ключ созданного виджета
     */
    String createWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Редактирование виджета в дашборде
     * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
     * @param user - текущий пользователь
     * @return ключ отредактированного виджета
     */
    String editWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Массовое редактирование виджетов в дашборде
     * @param requestContent - тело запроса ()
     * @param user - текущий пользователь
     * @return ключ дашборда
     */
    String editLayouts(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод удаления виджета
     * @param requestContent - тело запроса (classFqn, contentCode, widgetId, editable, isPersonal)
     * @param user - текущий пользователь
     * @return успех | провал
     */
    String deleteWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Сброс персонального дашборда в дашборд по умолчанию
     * @param classFqn - код типа куда выведено встроенное приложение
     * @param contentCode - код контента встроенного приложения
     * @param user - текущий пользователь
     * @return статус сообщение
     */
    String deletePersonalDashboard(String classFqn, String contentCode, IUUIDIdentifiable user)

    /**
     * Получение данных о пользователе для дашборда
     * @param requestContent - параметры запроса (classFqn, contentCode)
     * @param user - текущий пользователь
     * @return параметры пользователя
     */
    String getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод получения списка пользователей - ФИО и адрес эл. почты
     * @return [title: ФИО, email: email]
     */
    String getUsers()

    /**
     * Метод получения дерева из информации о дашбордах и виджетах
     * @param convertToJson - флаг на преобразование результата в json
     * @return json или List<DashboardInfo>
     */
    String getDashboardsAndWidgetsTree(IUUIDIdentifiable user)

    /**
     * Метод копирования виджета в другой дашборд
     * @param requestContent - тело запроса
     * @return ключ скопированного виджета
     */
    String copyWidgetToDashboard(requestContent)

    /**
     * Метод проверки виджета для возможности копирования
     * @param requestContent - тело запроса
     * @param user - текущий пользователь системы
     * @return флаг на возможность полного копирования в json-формате
     */
    String widgetIsBadToCopy(def requestContent, IUUIDIdentifiable user)

    /**
     * Метод для проверки подстановки фильтра с неправильными условиями для метакласса контента
     * @param requestContent - тело запроса(dashboardKey - ключ дашборда, sourceFilter - подставляемый фильтр)
     * @return словарь с результатом и новым фильтром, если результат выявил неправильный фильтр
     */
    String filterIsBadToApply(requestContent)

    /**
     * Редактирование отдельных полей в виджете
     * @param requestContent - тело запроса ()
     * @param user - текущий пользователь
     * @return ключ отредактированного виджета
     */
    String editWidgetChunkData(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод по сохранению настроек фильтров на источник
     * @param requestContent - тело запроса для построения фильтра на источник
     * @param user - текущий пользователь системы
     * @return словарь с ключом фильтра на источник, если изменение прошло корректно
     */
    String saveSourceFilters(def requestContent, IUUIDIdentifiable user)

    /**
     * Метод по получению списка фильтров на источник определенного метакласса
     * @param metaClass - тело запроса с метаклассом
     * @return
     */
    String getSourceFilters (String metaClass)

    /**
     * Метод по удалению фильтров из хранилища
     * @param sourceFilterUUID - ключ для удаления
     * @param user - текущий пользователь
     * @return словарь с успешным удалением
     */
    String deleteSourceFilters(String sourceFilterUUID, IUUIDIdentifiable user)
}

@InheritConstructors
class DashboardSettingsImpl extends BaseController implements DashboardSettings
{
    DashboardSettingsService service = DashboardSettingsService.instance

    Object run()
    {
        return null
    }


    @Override
    String getSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return Jackson.toJsonString(service.getSettings(requestContent, user))
    }

    @Override
    String getCustomGroups(String dashboardKey)
    {
        return Jackson.toJsonString(service.getCustomGroups(dashboardKey))
    }

    @Override
    String getCustomGroup(String dashboardKey, String customGroupKey)
    {
        return Jackson.toJsonString(service.getCustomGroup(dashboardKey, customGroupKey))
    }

    @Override
    String saveAutoUpdateSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.saveAutoUpdateSettings(requestContent, user))
    }
    @Override
    String saveCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return Jackson.toJsonString(service.saveCustomGroup(requestContent, user))
    }
    @Override
    String updateCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return Jackson.toJsonString(service.updateCustomGroup(requestContent, user))
    }

    @Override
    String deleteCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.deleteCustomGroup(requestContent, user))
    }

    @Override
    String saveCustomColors(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.saveCustomColors(requestContent, user))
    }

    @Override
    String deleteCustomColors(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.deleteCustomColors(requestContent, user))
    }

    @Override
    String createPersonalDashboard(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.createPersonalDashboard(requestContent, user))
    }

    @Override
    String createWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return Jackson.toJsonString(service.createWidget(requestContent, user))
    }
    @Override
    String editWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return Jackson.toJsonString(service.editWidget(requestContent, user))
    }

    @Override
    String editLayouts(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.editLayouts(requestContent, user))
    }

    @Override
    String deleteWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.deleteWidget(requestContent, user))
    }
    @Override
    String deletePersonalDashboard(String classFqn, String contentCode, IUUIDIdentifiable user)
    {
        return service.deletePersonalDashboard(classFqn, contentCode, user)
            ? toJson([status: "OK", message: "Установлены настройки по умолчанию"])
            : toJson([status: "ERROR", message: "Не удалось сбросить настройки. Попробуйте позже"])
    }

    @Override
    String getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.getUserData(requestContent, user))
    }

    @Override
    String getUsers()
    {
        return toJson(service.getUsers())
    }

    @Override
    String copyWidgetToDashboard(requestContent)
    {
        return Jackson.toJsonString(service.copyWidgetToDashboard(requestContent))
    }

    @Override
    String widgetIsBadToCopy(def requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.widgetIsBadToCopy(requestContent, user))
    }

    @Override
    String filterIsBadToApply(requestContent)
    {
        return toJson(service.filterIsBadToApply(requestContent))
    }

    @Override
    String getDashboardsAndWidgetsTree(IUUIDIdentifiable user)
    {
        return toJson(service.getDashboardsAndWidgetsTree(user))
    }
    @Override
    String editWidgetChunkData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.editWidgetChunkData(requestContent, user))
    }
    @Override
    String saveSourceFilters(def requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.saveSourceFilters(requestContent, user))
    }
    @Override
    String getSourceFilters(String metaClass)
    {
        return toJson(service.getSourceFilters(metaClass))
    }
    @Override
    String deleteSourceFilters(String sourceFilterUUID, IUUIDIdentifiable user)
    {
        return toJson(service.deleteSourceFilters(sourceFilterUUID, user))
    }
}

@InjectApi
@Singleton
class DashboardSettingsService
{
    private static final String DASHBOARD_NAMESPACE = 'dashboards'
    private static final String OLD_GROUP_MASTER_DASHBOARD = 'MasterDashbordov'
    private static final String GROUP_MASTER_DASHBOARD = 'sys_dashboardMaster'
    private static final String ROLE_SUPERUSER = 'ROLE_SUPERUSER'
    private static ObjectMapper mapper = new ObjectMapper()
    MessageProvider messageProvider = MessageProvider.instance

    /**
     * Получение настроек дашборда и виджетов
     * @param requestContent - параметры запроса (classFqn, contentCode, isPersonal)
     * @param user - текущий пользователь
     * @return настройки автообновления вместе с настройками виджетов
     */
    DashboardSettingsClass getSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        Boolean isPersonal = requestContent.isPersonal
        Boolean isMobile = requestContent.isMobile
        Boolean isForUser = requestContent.isForUser

        if (isPersonal && !user?.login)
        {
            def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
            return throwPersonalDashboardNotFoundException(currentUserLocale)
        }
        Closure<DashboardSettingsClass> getSettingByLogin = this.&getDashboardSetting.curry(subjectUUID, contentCode)

        def defaultDashboard = getSettingByLogin(null, isForUser ? subjectUUID : null) ?: new DashboardSettingsClass()
        def personalDashboard = getSettingByLogin(user?.login as String, isForUser ? subjectUUID : null)
        def result
        Map<String, Object> variableMap = [subject: api.utils.get(subjectUUID), user: user]
        if (isPersonal)
        {
            if(personalDashboard)
            {
                personalDashboard.widgets = personalDashboard?.widgets?.findResults { widget ->
                    widget = widget?.type == DiagramType.TEXT
                        ? changeTextInTextWidget(widget, variableMap)
                        : changeTotalWidgetName(widget, variableMap)
                    return widget
                } ?: []

                personalDashboard.layouts = isMobile ? null : personalDashboard?.layouts
                personalDashboard.dashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
                return personalDashboard
            }
            else
            {
                defaultDashboard.widgets = defaultDashboard?.widgets?.findResults { widget ->
                    widget = widget?.type == DiagramType.TEXT
                        ? changeTextInTextWidget(widget, variableMap)
                        : changeTotalWidgetName(widget, variableMap)
                    return widget
                } ?: []

                defaultDashboard?.layouts = isMobile ? null : defaultDashboard?.layouts
                defaultDashboard.dashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
                return defaultDashboard
            }
        }
        else
        {
            defaultDashboard.widgets = defaultDashboard?.widgets?.findResults { widget ->
                widget = widget?.type == DiagramType.TEXT
                    ? changeTextInTextWidget(widget, variableMap)
                    : changeTotalWidgetName(widget, variableMap)
                return widget
            } ?: []

            defaultDashboard?.layouts = isMobile ? null : defaultDashboard?.layouts
            defaultDashboard.dashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)
            return defaultDashboard
        }
    }

    /**
     * Получение кастомных группировок для дашборда по ключу
     * @param dashboardKey - ключ дашборда
     * @return список кастомных группировок
     */
    Collection<CustomGroup> getCustomGroups(String dashboardKey)
    {
        DashboardSettingsClass dashboardSettings = getDashboardSetting(dashboardKey)
        return dashboardSettings?.customGroups
    }

    /**
     * Получение кастомных группировок для дашборда по ключу
     * @param dashboardKey - ключ дашборда
     * @return список кастомных группировок
     */
    CustomGroup getCustomGroup(String dashboardKey, String customGroupKey)
    {
        return getCustomGroups(dashboardKey)?.find { it?.id == customGroupKey }
    }

    /**
     * Метод обновления состояния автообновления
     * @param requestContent - тело запроса (classFqn, contentCode, autoUpdate)
     * @param user - текущий пользователь
     * @return true|false
     */
    Boolean saveAutoUpdateSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        def autoUpdate = requestContent.autoUpdate as AutoUpdate
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser
        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)
        def settings = getDashboardSetting(isPersonal ? personalDashboardKey : defaultDashboardKey)
        settings.autoUpdate = autoUpdate
        return saveJsonSettings(isPersonal ? personalDashboardKey : defaultDashboardKey,
                                toJson(settings ?: new DashboardSettingsClass()),
                                DASHBOARD_NAMESPACE
        )
    }

    /**
     * Метод сохранения настроек кастомных группировок.
     * Сохраняет в персональный дашборд.
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return ключь кастомной группировки
     */
    Map saveCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser
        def group = requestContent.group as Map<String, Object>
        group = mapper.convertValue(group, CustomGroup)

        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (isPersonal && !(user.login))
        {
            return throwPersonalDashboardNotFoundException(currentUserLocale)
        }

        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        String keyCustomGroup = UUID.nameUUIDFromBytes(toJson(group).bytes)
        group.id = keyCustomGroup

        Closure<Map> saveDashboard = { String dashboardKey, DashboardSettingsClass settings ->
            if (saveJsonSettings(dashboardKey, toJson(settings), DASHBOARD_NAMESPACE))
            {
                return [id: keyCustomGroup]
            }
            else
            {
                return throwDashboardSettingsNotSavedException(currentUserLocale)
            }
        }

        if (isPersonal)
        {
            def dashboard = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
            dashboard.customGroups += group
            saveDashboard(personalDashboardKey, dashboard)
        }
        else
        {
            def dashboard = getDashboardSetting(defaultDashboardKey) ?: new DashboardSettingsClass()
            dashboard.customGroups += group
            saveDashboard(defaultDashboardKey, dashboard)
        }
    }

    /**
     * Метод обноления кастомной группировки
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return новая кастомная группировка
     */
    Map updateCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        def group = requestContent.group
        group = mapper.convertValue(group, CustomGroup)
        String groupKey = group.id
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser

        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (isPersonal && !(user?.login))
        {
            return throwPersonalDashboardNotFoundException(currentUserLocale)
        }
        if (!group)
        {
            String message = messageProvider.getConstant(GROUP_SETTINGS_NULL_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${GROUP_SETTINGS_NULL_ERROR}")
        }

        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        def dashboard = isPersonal ? getDashboardSetting(personalDashboardKey) : getDashboardSetting(defaultDashboardKey)

        if (groupKey in dashboard.customGroups.id)
        {
            //если дб персональный, а группировка с общего
            Closure<Map> saveDashboard = { String dashboardKey, DashboardSettingsClass settings ->
                if (saveJsonSettings(dashboardKey, toJson(settings), DASHBOARD_NAMESPACE))
                {
                    return [group: group]
                }
                else
                {
                    return throwDashboardSettingsNotSavedException(currentUserLocale)
                }
            }
            dashboard.customGroups.removeIf { it?.id == groupKey }
            dashboard.customGroups += group
            saveDashboard(isPersonal ? personalDashboardKey : defaultDashboardKey, dashboard)
        }
        else
        {
            return throwGroupNotContainsInDashboardException(currentUserLocale)
        }
    }

    /**
     * Метод удаления настроек группировки.
     * @param requestContent - тело запроса
     * @param user - текущий пользователь
     * @return ключь кастомной группировки
     */
    Map deleteCustomGroup(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String groupKey = requestContent.groupKey
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser

        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (isPersonal && !(user?.login))
        {
            return throwPersonalDashboardNotFoundException(currentUserLocale)
        }

        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        def dashboard = isPersonal
            ? getDashboardSetting(personalDashboardKey)
            : getDashboardSetting(defaultDashboardKey)

        if (groupKey in dashboard.customGroups.id)
        {
            dashboard.customGroups.removeIf { it?.id == groupKey }
            if (saveJsonSettings(personalDashboardKey, toJson(dashboard), DASHBOARD_NAMESPACE))
            {
                return [id: groupKey]
            }
            else
            {
                return throwDashboardSettingsNotSavedException(currentUserLocale)
            }
        }
        else
        {
            return throwGroupNotContainsInDashboardException(currentUserLocale)
        }
    }

    /**
     * Метод по сохранению настроек кастомных цветов диаграммы относительно дашборда
     * @param requestContent - тело запроса
     * @param user - пользователь
     * @return словарь [id]
     */
    Boolean saveCustomColors(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser

        def colorsSettings = requestContent.colorsSettings as Map<String, Object>
        colorsSettings = mapper.convertValue(colorsSettings, CustomChartSettingsData)
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (isPersonal && !(user.login))
        {
            return throwPersonalDashboardNotFoundException(currentUserLocale)
        }

        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        Closure<Map> saveDashboard = { String dashboardKey, DashboardSettingsClass settings ->
            if (saveJsonSettings(dashboardKey, toJson(settings), DASHBOARD_NAMESPACE))
            {
                return true
            }
            else
            {
                return throwDashboardSettingsNotSavedException(currentUserLocale)
            }
        }

        if (isPersonal)
        {
            def dashboard = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
            if(colorsSettings.key in dashboard.customColorsSettings*.key)
            {
                dashboard.customColorsSettings.removeIf { it?.key == colorsSettings.key }
            }
            dashboard.customColorsSettings += colorsSettings
            saveDashboard(personalDashboardKey, dashboard)
        }
        else
        {
            def dashboard = getDashboardSetting(defaultDashboardKey) ?: new DashboardSettingsClass()
            if(colorsSettings.key in dashboard.customColorsSettings*.key)
            {
                dashboard.customColorsSettings.removeIf { it?.key == colorsSettings.key }
            }
            dashboard.customColorsSettings += colorsSettings
            saveDashboard(defaultDashboardKey, dashboard)
        }
    }

    /**
     * Метод по удалению настроек кастомных цветов диаграммы относительно дашборда
     * @param requestContent - тело запроса
     * @param user - пользователь
     * @return словарь [id]
     */
    Map deleteCustomColors(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String colorsKey = requestContent.key
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser

        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (isPersonal && !(user?.login))
        {
            return throwPersonalDashboardNotFoundException(currentUserLocale)
        }

        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        def dashboard = isPersonal
            ? getDashboardSetting(personalDashboardKey)
            : getDashboardSetting(defaultDashboardKey)

        if (colorsKey in dashboard.customColorsSettings*.key)
        {
            dashboard.customColorsSettings.removeIf { it?.key == colorsKey }
            if (saveJsonSettings(personalDashboardKey, toJson(dashboard), DASHBOARD_NAMESPACE))
            {
                return [id: colorsKey]
            }
            else
            {
                return throwDashboardSettingsNotSavedException(currentUserLocale)
            }
        }
        else
        {
            String message = messageProvider.getConstant(COLORS_NOT_CONTAINS_IN_DASHBOARD_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${COLORS_NOT_CONTAINS_IN_DASHBOARD_ERROR}")
        }
    }

    /**
     * Метод по сохранению настроек фильтров на источник
     * @param requestContent - тело запроса для построения фильтра на источник
     * @param user - текущий пользователь системы
     * @return словарь с ключом фильтра на источник, если изменение прошло корректно
     */
    Map saveSourceFilters(def requestContent, IUUIDIdentifiable user)
    {
        def dashboard = requestContent.dashboard
        def subjectUUID = dashboard.classFqn
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)

        SourceFilter sourceFilter = new SourceFilter(requestContent.sourceFilter)
        Collection<SourceFilter> classFqnFilters = DashboardUtils.getSourceFiltersFromStorage()
        Boolean editFilters = sourceFilter.id //проверка, редактируем ли мы фильтры
        Boolean notUniqueName = classFqnFilters.any { it.label == sourceFilter.label }
        if(notUniqueName)
        {
            String message = messageProvider.getMessage(FILTER_NAME_NOT_UNIQUE_ERROR, currentUserLocale, label: sourceFilter.label)
            api.utils.throwReadableException("${message}#${FILTER_NAME_NOT_UNIQUE_ERROR}")
        }
        SourceFilter sourceWithTheSameFilters
        if(!editFilters)
        {
            def slurper = new groovy.json.JsonSlurper()
            //если фильтр не на редактирование, то нужно найти фильтр с похожими настройками
            sourceWithTheSameFilters = classFqnFilters.find {  slurper.parseText(it.descriptor).filters == slurper.parseText(sourceFilter.descriptor).filters }
            String dashboardKey = generateDashboardKey(dashboard.classFqn, dashboard.contentCode)
            //а также фильтр новый, нужно установить ему uuid
            sourceFilter.id = "${ UUID.randomUUID() }_${ dashboardKey.takeWhile { it!='_' } }"
        }

        if(sourceWithTheSameFilters)
        {
            String message = messageProvider.getMessage(FILTER_ALREADY_EXISTS_ERROR, currentUserLocale, label: sourceWithTheSameFilters.label)
            api.utils.throwReadableException("${message}#${FILTER_ALREADY_EXISTS_ERROR}")
        }

        if(saveJsonSettings(sourceFilter.id, toJson(sourceFilter), DashboardUtils.SOURCE_NAMESPACE))
        {
            return [result: sourceFilter.id]
        }
    }

    /**
     * Метод по получению списка фильтров на источник определенного метакласса
     * @param metaClass - тело запроса с метаклассом
     * @return
     */
    Collection getSourceFilters(String metaClass)
    {
        Collection<SourceFilter> filtersForClassFqn = DashboardUtils.getSourceFiltersFromStorage([[key: 'value', value: metaClass]])
        return filtersForClassFqn.collect {
            [label: it.label, descriptor: it.descriptor, id: it.id]
        }
    }

    /**
     * Метод по удалению фильтров из хранилища
     * @param sourceFilterUUID - ключ дял удаления
     * @param user - текущий пользователь
     * @return словарь с успешным удалением
     */
    Map deleteSourceFilters(String sourceFilterUUID, IUUIDIdentifiable user)
    {
        List dashboardKeys = getDashboardKeys()
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        Boolean widgetsUseSourceFilter = dashboardKeys.any { dashboardKey ->
            def dbSettings
            try
            {
                dbSettings = getDashboardSetting(dashboardKey)
            } catch(Exception ex) {
                logger.error("dashboard ${dashboardKey} is not checked")
            }

            return dbSettings?.widgets?.any {
                return it?.type != DiagramType.TEXT ? it?.data?.any {
                    it.source instanceof NewSourceValue
                        ? it.source.filterId == sourceFilterUUID
                        : false
                } : false
            }
        }

        if(widgetsUseSourceFilter)
        {
            String message = messageProvider.getConstant(FILTER_MUST_NOT_BE_REMOVED_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${FILTER_MUST_NOT_BE_REMOVED_ERROR}")
        }

        if(deleteJsonSettings(sourceFilterUUID, DashboardUtils.SOURCE_NAMESPACE))
        {
            return [result: true]
        }
        else
        {
            String message = messageProvider.getMessage(REMOVE_FILTER_FAILED_ERROR, currentUserLocale, sourceFilterUUID: sourceFilterUUID)
            api.utils.throwReadableException("${message}#${REMOVE_FILTER_FAILED_ERROR}")
        }
    }

    /**
     * Метод создания персонального дашборда.
     * @param requestContent - тело запроса (editable, classFqn, contentCode)
     * @param user - текущий пользователь
     * @return true|false
     */
    Boolean createPersonalDashboard(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        checkRightsOnEditDashboard(requestContent.editable, currentUserLocale)
        String subjectUUID = requestContent.classFqn
        if (!user?.login)
        {
            String message = messageProvider.getConstant(LOGIN_MUST_NOT_BE_NULL_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${LOGIN_MUST_NOT_BE_NULL_ERROR}")
        }
        String contentCode = requestContent.contentCode
        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user.login as String)
        String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode)
        def settings = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey) ?: new DashboardSettingsClass()
        settings = prepareDashboardSettings(settings, user.login as String)
        return saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
    }

    /**
     * Создание виджета в дашборде
     * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
     * @param user - текущий пользователь
     * @return ключ созданного виджета
     */
    Widget createWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        def widget = requestContent.widget
        widget = mapper.convertValue(widget, Widget)
        Boolean widgetTypeIsNotText = widget?.type != DiagramType.TEXT
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        boolean isPersonal = requestContent.isPersonal
        if (widgetTypeIsNotText)
        {
            validateName(requestContent, null, isPersonal, user)
        }

        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        Boolean isForUser = requestContent.isForUser
        Map<String, Object> variableMap = [subject: api.utils.get(subjectUUID), user: user]
        def widgetWithCorrectName = widgetTypeIsNotText
            ? changeTotalWidgetName(widget, variableMap)
            : changeTextInTextWidget(widget, variableMap)

        DashboardSettingsClass dashboardSettings = null
        String dashboardKey = null
        if (isPersonal)
        {
            checkRightsOnEditDashboard(requestContent.editable, currentUserLocale)
            if (!user?.login)
            {
                String message = messageProvider.getConstant(LOGIN_MUST_NOT_BE_NULL_ERROR, currentUserLocale)
                api.utils.throwReadableException("${message}#${LOGIN_MUST_NOT_BE_NULL_ERROR}")
            }
            Closure createDashboardKeyFromLogin = this.&generateDashboardKey.curry(subjectUUID, contentCode)
            dashboardKey = createDashboardKeyFromLogin(user?.login as String, isForUser ? subjectUUID : null)
            dashboardSettings = getDashboardSetting(dashboardKey) ?: getDashboardSetting(createDashboardKeyFromLogin(null, isForUser ? subjectUUID : null))
        }
        else
        {
            checkRightsOnDashboard(user, isForUser, "create")
            dashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)
            dashboardSettings = getDashboardSetting(dashboardKey) ?: new DashboardSettingsClass()
        }

        def generateKey = this.&generateWidgetKey.curry(dashboardSettings.widgets*.id, subjectUUID,
                                                        contentCode, isPersonal ? user?.login as String : null, isForUser ? subjectUUID : null)

        return prepareWidgetSettings(widgetWithCorrectName, generateKey).with { totalWidget ->
            dashboardSettings.widgets += totalWidget
            saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
            return totalWidget
        }
    }

    /**
     * Редактирование виджета в дашборде
     * @param requestContent - тело запроса (classFqn, contentCode, widget, editable, isPersonal)
     * @param user - текущий пользователь
     * @return ключ отредактированного виджета
     */
    Widget editWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        def widget = toJson(requestContent.widget)
        widget = Jackson.fromJsonString(widget, Widget)
        String widgetKey = widget.id
        Boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser
        Boolean widgetTypeIsNotText = widget.type != DiagramType.TEXT
        if (widgetTypeIsNotText)
        {
            validateName(requestContent, widgetKey, isPersonal, user)
        }

        Map<String, Object> variableMap = [subject: api.utils.get(subjectUUID), user: user]
        def widgetWithCorrectName = widgetTypeIsNotText
            ? changeTotalWidgetName(widget, variableMap)
            : changeTextInTextWidget(widget, variableMap)
        String contentCode = requestContent.contentCode
        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
        if (isPersonal)
        {
            checkRightsOnEditDashboard(requestContent.editable, currentUserLocale)
            Closure<DashboardSettingsClass> getSettingByLogin = this.&getDashboardSetting.curry(subjectUUID, contentCode)
            if (user && isPersonalWidget(widgetKey, user))
            {
                widgetWithCorrectName = prepareWidgetSettings(widgetWithCorrectName) { widgetKey }
                DashboardSettingsClass dashboardSettings = getSettingByLogin(user?.login as String, isForUser ? subjectUUID : null)
                dashboardSettings.widgets.removeIf { it?.id == widgetKey }
                dashboardSettings.widgets += widgetWithCorrectName
                def key = widgetWithCorrectName.id
                if (!saveJsonSettings(personalDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE))
                {
                    return throwWidgetNotSavedException(currentUserLocale, key, personalDashboardKey)
                }
                return widgetWithCorrectName
            }
            else
            {
                DashboardSettingsClass dashboardSettings = getSettingByLogin(user?.login as String, isForUser ? subjectUUID : null) ?: getSettingByLogin(null, isForUser ? subjectUUID : null)
                def generateKey = this.&generateWidgetKey.curry(dashboardSettings.widgets*.id,
                                                                subjectUUID,
                                                                contentCode,
                                                                user?.login as String,
                                                                isForUser ? subjectUUID : null,
                                                                widgetKey
                )
                return prepareWidgetSettings(widgetWithCorrectName, generateKey).with { totalWidget ->
                    def key = totalWidget.id
                    dashboardSettings.widgets.removeIf { it?.id == widgetKey }
                    dashboardSettings.widgets += widgetWithCorrectName
                    if (!saveJsonSettings(personalDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE))
                    {
                        return throwWidgetNotSavedException(currentUserLocale, key, personalDashboardKey)
                    }
                    return totalWidget
                }
            }
        }
        else
        {
            checkRightsOnDashboard(user, isForUser, "edit")
            if (user && isPersonalWidget(widgetKey, user))
            {
                widgetKey -= "_${ user.login }"
                def closureReplaceWidgetKey = { String login ->
                    String dashboardKey = generateDashboardKey(
                        subjectUUID,
                        contentCode,
                        login
                    )
                    DashboardSettingsClass dashboardSettings = getDashboardSetting(dashboardKey)
                    dashboardSettings.widgets.removeIf { it?.id == widgetKey }
                    dashboardSettings.widgets += widgetWithCorrectName
                    saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
                }
                closureReplaceWidgetKey(user.login as String)
                closureReplaceWidgetKey(null)
            }
            def widgetDb = setUuidInSettings(widgetWithCorrectName, widgetKey)
            String defaultDashboardKey = generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)
            DashboardSettingsClass dashboardSettings = getDashboardSetting(defaultDashboardKey)
            dashboardSettings.widgets.removeIf { it?.id == widgetKey }
            dashboardSettings.widgets += widgetDb
            saveJsonSettings(defaultDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
            return widgetWithCorrectName
        }
    }

    /**
     * Массовое редактирование виджетов в дашборде
     * @param requestContent - тело запроса ()
     * @param user - текущий пользователь
     * @return ключ дашборда
     */
    Map editLayouts(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        def layouts = requestContent.layouts as Map<String, Object>
        def mobileLayouts = requestContent.mobileLayouts as Map<String, Object>

        String subjectUUID = requestContent.classFqn
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)

        String contentCode = requestContent.contentCode
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser

        String dashboardKey = isPersonal
            ? generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
            : generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        DashboardSettingsClass dashboardSettings = getDashboardSetting(dashboardKey)

        if (layouts)
        {
            dashboardSettings.mobileLayouts = new ObjectMapper().convertValue(mobileLayouts, Layout)
            dashboardSettings.layouts = new ObjectMapper().convertValue(layouts, Layout)
            saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
        }
        else
        {
            String message = messageProvider.getMessage(EMPTY_LAYOUT_SETTINGS_ERROR, currentUserLocale, dashboardKey: dashboardKey)
            api.utils.throwReadableException("${message}#${EMPTY_LAYOUT_SETTINGS_ERROR}")
        }
        return [dashboardKey: dashboardKey]
    }

    /**
     * Метод удаления виджета
     * @param requestContent - тело запроса (classFqn, contentCode, widgetId, editable, isPersonal)
     * @param user - текущий пользователь
     * @return успех | провал
     */
    Boolean deleteWidget(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String widgetId = requestContent.widgetId
        Boolean isForUser = requestContent.isForUser
        if (requestContent.isPersonal)
        {
            return deletePersonalWidget(subjectUUID, contentCode, widgetId, requestContent.editable as Boolean, user)
        }
        else
        {
            return deleteDefaultWidget(subjectUUID, contentCode, widgetId, user, isForUser)
        }
    }

    /**
     * Сброс персонального дашборда в дашборд по умолчанию
     * @param subjectUUID - код типа куда выведено встроенное приложение
     * @param contentCode - код контента встроенного приложения
     * @param user - текущий пользователь
     * @return статус сообщение
     */
    Boolean deletePersonalDashboard(String subjectUUID, String contentCode, IUUIDIdentifiable user)
    {
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (!user)
        {
            String message = messageProvider.getConstant(SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD_ERROR}")
        }
        String personalDashboardKey = generateDashboardKey(subjectUUID, contentCode, user?.login as String)
        DashboardSettingsClass personalDashboard = getDashboardSetting(personalDashboardKey)
        return personalDashboard
            ? deleteJsonSettings(personalDashboardKey, DASHBOARD_NAMESPACE).with { resultOfRemoving ->
            if (resultOfRemoving)
            {
                personalDashboard.widgets.removeAll { settings ->
                    isPersonalWidget(settings.id, user)
                }
                return true
            }
            else
            {
                logger.warn("Personal dashboard: $personalDashboardKey not found!")
                return false
            }
        } : true
    }

    /**
     * Получение данных о пользователе для дашборда
     * @param requestContent - параметры запроса (classFqn, contentCode)
     * @param user - текущий пользователь
     * @return параметры пользователя
     */
    Map getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String classFqn = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String groupUser = getUserGroup(user)
        Boolean hasPersonalDashboard = user?.login && getDashboardSetting(classFqn, contentCode, user.login as String)
        return [groupUser : groupUser,
                hasPersonalDashboard: hasPersonalDashboard,
                name: user?.title,
                email: user?.email]
    }

    /**
     * Метод получения списка пользователей - ФИО и адрес эл. почты
     * @return [title: ФИО, email: email]
     */
    List<Map> getUsers()
    {
        return api.db.query("FROM employee WHERE email LIKE '%@%' ORDER BY email")
                  .list()
                  .collect { user ->
                      [id: user.UUID, name: user.title, email: user.email]
                  }
    }

    /**
     * Метод получения дерева из информации о дашбордах и виджетах
     * @return json или List<DashboardInfo>
     */
    List<DashboardInfo> getDashboardsAndWidgetsTree(IUUIDIdentifiable user)
    {
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        return getDashboardsUUIDAndTitle(currentUserLocale).findResults {
            String dashboardUUID = it.uuid
            String dashboardTitle = it.title
            try
            {
                def dashboardSettings = getDashboardSetting(dashboardUUID)
                if (!dashboardSettings)
                {
                    return null
                }
                List widgetsFromDB = dashboardSettings.widgets

                List<WidgetInfo> widgets = widgetsFromDB
                    ? widgetsFromDB.findResults { widget ->
                    return getWidgetInfo(getWidgetSettings(widget))
                } : []
                return new DashboardInfo(label: dashboardTitle, value: dashboardUUID, children: widgets)
            } catch(Exception ex) {
                logger.error("dashboard ${dashboardUUID} is not checked")
            }
        }
    }

    /**
     * Метод копирования виджета в другой дашборд
     * @param requestContent - тело запроса
     * @return ключ скопированного виджета
     */
    Widget copyWidgetToDashboard(requestContent)
    {
        String classFqn = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String widgetKey = requestContent.widgetKey
        String sourceDashboardKey = requestContent.dashboardKey

        DashboardSettingsClass sourceDashboardSettings = getDashboardSetting(sourceDashboardKey)
        Widget widgetSettings = getWidgetSettings(sourceDashboardSettings.widgets.find { it.id == widgetKey})
        String destinationDashboardKey = generateDashboardKey(classFqn, contentCode)
        DashboardSettingsClass dashboardSettings = getDashboardSetting(destinationDashboardKey) ?: new DashboardSettingsClass()
        List currentWidgets = dashboardSettings.widgets

        Closure<String> generateKey = this.&generateWidgetKey.curry(currentWidgets*.id, classFqn, contentCode)
        Widget newWidgetSettings = editWidgetDescriptor(widgetSettings, destinationDashboardKey)
        Collection<CustomGroup> correctCustomGroups = []
        if(destinationDashboardKey != sourceDashboardKey)
        {
            List<String> customGroupsIds = getCustomGroupsIdsFromWidget(widgetSettings)
            Collection<CustomGroup> currentCustomGroups = sourceDashboardSettings.customGroups.findAll { it.id in customGroupsIds }
            Collection<CustomGroup> destinationCustomGroups = dashboardSettings?.customGroups?.findAll { group ->
                customGroupsIds.any { group.id.contains(it) }
            }
            //кастомные группировки на Дб для копирования могут уже существовать, возможно, потребуется сохранить группировку по-новому
            correctCustomGroups = editCustomGroupsToCorrectFormat(currentCustomGroups, destinationCustomGroups, destinationDashboardKey)
            List<String> newCustomGroupIds = correctCustomGroups.id
            newWidgetSettings = editCustomGroupsFromAnotherDBToSystem(newWidgetSettings, currentCustomGroups)
            newWidgetSettings = editCustomGroupKeys(newWidgetSettings, newCustomGroupIds)
        }
        return prepareWidgetSettings(newWidgetSettings, generateKey).with { widget ->
            dashboardSettings.widgets += widget
            dashboardSettings.customGroups += correctCustomGroups
            saveJsonSettings(destinationDashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
            return widget
        }
    }

    /**
     * Метод проверки виджета для возможности копирования
     * @param requestContent - тело запроса
     * @param user - текущий пользователь системы
     * @return флаг на возможность полного копирования в json-формате
     */
    Map widgetIsBadToCopy(def requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String widgetKey = requestContent.widgetKey
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)

        String sourceDashboardKey = requestContent.dashboardKey
        String destinationDashboardKey = generateDashboardKey(subjectUUID, contentCode)
        List reasons = []
        DashboardSettingsClass sourceDashboardSettings = getDashboardSetting(sourceDashboardKey)
        Widget widgetSettings = getWidgetSettings(sourceDashboardSettings.widgets.find { it.id == widgetKey })

        String dashboardKey = generateDashboardKey(subjectUUID, contentCode)

        if (widgetSettings)
        {
            def filtersHasSubject = []
            Boolean widgetContainsRelativeCriteriaCustomGroups = false
            Boolean widgetWithOnlyRelativeCriteriaCustomGroups = false
            widgetSettings.data.collect { dataValue ->
                if(dataValue.source.filterId)
                {
                    dataValue.source = NewSourceValue.mappingSource(dataValue.source)
                }
                def descriptor = dataValue.source.descriptor
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

            if(hasSubjectFilters)
            {
                reasons << 'hasSubjectFilters'
            }

            if(destinationDashboardKey != sourceDashboardKey)
            {
                List customGroupsIds = getCustomGroupsIdsFromWidget(widgetSettings)
                Collection<CustomGroup> currentCustomGroups = sourceDashboardSettings.customGroups.findAll { it.id in customGroupsIds }
                widgetSettings.data.each { dataValue ->
                    widgetContainsRelativeCriteriaCustomGroups = widgetContainsRelativeCriteriaCustomGroups || returnParametersOrBreakdownAnswer(dataValue.parameters, currentCustomGroups, 'any', currentUserLocale)
                    widgetContainsRelativeCriteriaCustomGroups = widgetContainsRelativeCriteriaCustomGroups || returnParametersOrBreakdownAnswer(dataValue.breakdown, currentCustomGroups, 'any', currentUserLocale)

                    widgetWithOnlyRelativeCriteriaCustomGroups = widgetWithOnlyRelativeCriteriaCustomGroups || returnParametersOrBreakdownAnswer(dataValue.parameters, currentCustomGroups, 'every', currentUserLocale)
                    widgetWithOnlyRelativeCriteriaCustomGroups = widgetWithOnlyRelativeCriteriaCustomGroups || returnParametersOrBreakdownAnswer(dataValue.breakdown, currentCustomGroups, 'every', currentUserLocale)
                }
            }
            if(widgetWithOnlyRelativeCriteriaCustomGroups)
            {
                reasons << 'hasOnlyRelativeCriteriaCustomGroups'
            }
            if(widgetContainsRelativeCriteriaCustomGroups && !widgetWithOnlyRelativeCriteriaCustomGroups)
            {
                reasons << 'hasCustomGroupsWithRelativeCriteria'
            }
            return [result: [hasSubjectFilters, widgetContainsRelativeCriteriaCustomGroups, widgetWithOnlyRelativeCriteriaCustomGroups].any {it == true}, reasons: reasons]
        }
        else
        {
            String message = messageProvider.getConstant(WIDGET_SETTINGS_ARE_EMPTY_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${WIDGET_SETTINGS_ARE_EMPTY_ERROR}")
        }
    }

    /**
     * Метод для проверки подстановки фильтра с неправильными условиями для метакласса контента
     * @param requestContent - тело запроса(dashboardKey - ключ дашборда, sourceFilter - подставляемый фильтр)
     * @return словарь с результатом и новым фильтром, если результат выявил неправильный фильтр
     */
    Map filterIsBadToApply(Map requestContent)
    {
        String dashboardKey = requestContent.dashboardKey
        def sourceFilter = new SourceFilter(requestContent.sourceFilter)

        Boolean filterIsBadToApply = false

        if(sourceFilter.id.tokenize('_').last() != dashboardKey.takeWhile { it!='_' })
        {
            Collection filtersHasSubject = []
            def slurper = new groovy.json.JsonSlurper()
            def descriptor = slurper.parseText(sourceFilter.descriptor)
            def valuesToRemove = descriptor.filters.collectMany { filterValue ->
                def conditionCodes = filterValue*.properties.conditionCode
                conditionCodes.collect { conditionCode ->
                    if (conditionCode.toLowerCase().contains('subject'))
                    {
                        return filterValue
                    }
                }
            }.grep()
            filterIsBadToApply = valuesToRemove.any()
            //среди фильтров могут быть значения через ИЛИ, их нужно подчистить от относительных критериев
            def changedValues = valuesToRemove.findResults { values->
                //если значение изменилось, добавить в список
                //данных может не остаться, если было только 1 условие, которое удалили
                if(values.removeIf {it.properties.conditionCode.toLowerCase().contains('subject')}) return values ?: null
            }
            descriptor.filters -= valuesToRemove
            //добавить измененные ИЛИ условия
            descriptor.filters += changedValues
            sourceFilter.descriptor = toJson(descriptor)
        }
        return [result: filterIsBadToApply, correctFilter: filterIsBadToApply ? sourceFilter : null]
    }

    /**
     * Редактирование отдельных полей в виджете
     * @param requestContent - тело запроса ()
     * @param user - текущий пользователь
     * @return ключ отредактированного виджета
     */
    Map editWidgetChunkData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String subjectUUID = requestContent.classFqn
        String contentCode = requestContent.contentCode
        boolean isPersonal = requestContent.isPersonal
        Boolean isForUser = requestContent.isForUser

        String dashboardKey = isPersonal
            ? generateDashboardKey(subjectUUID, contentCode, user?.login as String, isForUser ? subjectUUID : null)
            : generateDashboardKey(subjectUUID, contentCode, null, isForUser ? subjectUUID : null)

        def dashboardSettings = getDashboardSetting(dashboardKey)

        String widgetKey = requestContent.id
        List widgets = dashboardSettings.widgets
        if(widgetKey in widgets*.id)
        {
            def chunkData = requestContent.chunkData as Map<String, Object>
            def fieldsToChange = chunkData.keySet()

            def widgetSettings = widgets.find { it.id == widgetKey }

            fieldsToChange.each { field -> widgetSettings[field] = chunkData[field] }
            dashboardSettings.widgets.removeIf { it?.id == widgetKey }
            dashboardSettings.widgets += widgetSettings
            if (saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)) {
                return [id:widgetKey]
            }
            else
            {
                def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
                return throwWidgetNotSavedException(currentUserLocale, widgetKey, dashboardKey)
            }
        }
        else
        {
            logger.warn("Widget $widgetKey not belongs dashboard $dashboardKey")
            return null
        }
    }

    /**
     * Метод, возвращающий ошибку о том, что личный дашборд нельзя получить без логина пользователя
     * @param currentUserLocale - текущая локаль пользователя
     * @return ошибка о том, что личный дашборд нельзя получить без логина пользователя
     */
    private throwPersonalDashboardNotFoundException(def currentUserLocale)
    {
        String message = messageProvider.getConstant(PERSONAL_DASHBOARD_NOT_FOUND_ERROR, currentUserLocale)
        api.utils.throwReadableException("${message}#${PERSONAL_DASHBOARD_NOT_FOUND_ERROR}")
    }

    /**
     * Метод, возвращающий ошибку о том, что настройки дашборда не были сохранены
     * @param currentUserLocale - текущая локаль пользователя
     * @return ошибка о том, что настройки дашборда не были сохранены
     */
    private throwDashboardSettingsNotSavedException(def currentUserLocale)
    {
        String message = messageProvider.getConstant(DASHBOARD_SETTINGS_NOT_SAVED_ERROR, currentUserLocale)
        api.utils.throwReadableException("${message}#${DASHBOARD_SETTINGS_NOT_SAVED_ERROR}")
    }

    /**
     * Метод, возвращающий ошибку о том, что кастомная группировка на дашборде не найдена
     * @param currentUserLocale - текущая локаль пользователя
     * @return ошибка о том, что кастомная группировка на дашборде не найдена
     */
    private throwGroupNotContainsInDashboardException(def currentUserLocale)
    {
        String message = messageProvider.getConstant(GROUP_NOT_CONTAINS_IN_DASHBOARD_ERROR, currentUserLocale)
        api.utils.throwReadableException("${message}#${GROUP_NOT_CONTAINS_IN_DASHBOARD_ERROR}")
    }

    /**
     * Метод, возвращающий ошибку о том, что виджет не был сохранен на дашборде
     * @param currentUserLocale - текущая локаль пользователя
     * @param widgetKey - ключ виджета
     * @param dashboardKey - ключ дашборда
     * @return ошибка о том, что виджет не был сохранен на дашборде
     */
    private throwWidgetNotSavedException(def currentUserLocale, def widgetKey, def dashboardKey)
    {
        String message = messageProvider.getMessage(WIDGET_NOT_SAVED_ERROR, currentUserLocale, widgetKey: widgetKey, dashboardKey: dashboardKey)
        api.utils.throwReadableException("${message}#${WIDGET_NOT_SAVED_ERROR}")
    }

    /**
     * Метод, возвращающий ошибку о том, что у пользователя нет прав на удаление виджета
     * @param currentUserLocale - текущая локаль пользователя
     * @return ошибка о том, что у пользователя нет прав на удаление виджета
     */
    private throwNoRightsOnRemoveWidget(def currentUserLocale)
    {
        String message = messageProvider.getConstant(NO_RIGHTS_TO_REMOVE_WIDGET_ERROR, currentUserLocale)
        api.utils.throwReadableException("${message}#${NO_RIGHTS_TO_REMOVE_WIDGET_ERROR}")
    }

    /**
     * Метод, возвращающий правильную форму глагола, который будет добавлен в сообщение об ошибке
     * @param messageError - сообщение об ошибке
     * @param currentUserLocale - текущая локаль пользователя
     */
    private getCorrectMessageError(String messageError, def currentUserLocale)
    {
        switch (currentUserLocale.toLowerCase())
        {
            case 'en':
                return messageError
            case 'de':
                return messageError == 'create' ? 'erstellen' : 'bearbeiten'
            case 'pl':
                return messageError == 'create' ? 'utworzyć' : 'edytować'
            case 'ru':
            default:
                return messageError == 'create' ? 'создавать' : 'редактировать'

        }
    }

    /**
     * Метод получения списка ключей кастомных группировок из настроек виджета
     * @param widgetSettings - настройки виджета
     * @return список всех ключей кастомных группировок для виджета
     */
    private List<String> getCustomGroupsIdsFromWidget(Widget widgetSettings)
    {
        List<String> customGroupsIds = []
        widgetSettings.data.each { data ->
            customGroupsIds << getGroupsIds(data.parameters)
            customGroupsIds << getGroupsIds(data.breakdown)
        }
        return customGroupsIds.flatten().grep()
    }

    /**
     *  Метод для получения ключей кастомных группировок из параметров
     * @param elements - список элементов
     * @return  список ключей кастомных группировок
     */
    List<String> getGroupsIds(Collection<IHasGroup> elements)
    {
        return elements?.findResults {
            if (it?.group?.way == Way.CUSTOM)
            {
                return it.group.data
            }
        }
    }

    /**
     * Метод преобразования ключей кастомных группировок до пользовательских
     * @param elements - список элементов
     * @param userLogin - логин пользователя
     * @return список элементов, где ключи кастомных группировок - пользовательские
     */
    Collection<IHasGroup> updateCustomGroupKeysToPersonal(Collection<IHasGroup> elements, String userLogin)
    {
        return elements.collect {
            if (it.group.way == Way.CUSTOM)
            {
                it.group.data += "_${ userLogin }"
            }
            return it
        }
    }

    /**
     * Метод по преобразованию значений атрибутов для кастомных группировок сформированных по старым стандартам
     * @param widget - настройки виджета
     * @param dashboardSettings - настройки дашборда для виджета
     * @return
     */
    private Widget updateWidgetCustomGroup(Widget widget, DashboardSettingsClass dashboardSettings)
    {
        widget.data.each { data ->
            if(data?.parameters)
            {
                data?.parameters = updateAttributeForGroup(data?.parameters, dashboardSettings)
            }
            if(data?.breakdown)
            {
                data?.breakdown = updateAttributeForGroup(data?.breakdown, dashboardSettings)
            }
        }
        return widget
    }

    /**
     * Метод по преобразованию атрибутов, чтобы строилась группировка по новому стандарту
     * @param valuesWithGroup - значения с группировкой
     * @param dashboardSettings - настройки дашборда
     * @return правильные значения с группировкой
     */
    private Collection<IHasGroup> updateAttributeForGroup(Collection<IHasGroup> valuesWithGroup, DashboardSettingsClass dashboardSettings)
    {
        valuesWithGroup?.each { value ->
            if(value?.group?.way == Way.CUSTOM)
            {
                def groupKey = value?.group?.data
                if(groupKey)
                {
                    def group = dashboardSettings?.customGroups?.find { it?.id == groupKey }
                    Boolean oldGroupType = AttributeType.LINK_TYPES.any { group?.type?.contains(it) } &&
                                           !(value?.attribute?.attrChains()?.last()?.type in AttributeType.LINK_TYPES)
                    if(oldGroupType)
                    {
                        value?.attribute?.ref = null
                    }
                }
            }
        }
        return valuesWithGroup
    }

    /**
     * Метод по преобразованию кастомных группировок при копировании виджета на новый дашборд
     * @param groups - кастомные группировки на текущем ДБ
     * @param destinationCustomGroups - кастомные группировки на дб для копирования
     * @param destinationDashboardKey - ключ ДБ для копирования
     * @return коллекция подготовленных кастомных группировок
     */
    private Collection<CustomGroup> editCustomGroupsToCorrectFormat(Collection<CustomGroup> groups, Collection<CustomGroup> destinationCustomGroups,String destinationDashboardKey)
    {
        return groups.collect { group->
            group.subGroups = group.subGroups.findResults {subGroup ->
                subGroup.data = subGroup.data.findResults { dataValue ->
                    return dataValue.findResults {
                        return (it.type.toLowerCase().contains('subject') || it.type.toLowerCase().contains('object')) ? null : it
                    } ?: null
                } ?: null
                return subGroup.data ? subGroup : null
            }
            return prepareGroupIdForNewDashboard(group, destinationCustomGroups, destinationDashboardKey)
        }
    }

    /**
     * Метод по подготовке id кастомной группировки для нового Дб к правильному ключу
     * @param group - группировка, которую хотят скопировать
     * @param destinationCustomGroups - группировки в целевом ДБ для копирования
     * @param destinationDashboardKey - ключ целевого ДБ для копирования
     */
    private CustomGroup prepareGroupIdForNewDashboard(CustomGroup group,
                                                      Collection<CustomGroup> destinationCustomGroups,
                                                      String destinationDashboardKey)
    {
        if(destinationCustomGroups)
        {
            def equalDestinationGroup = destinationCustomGroups.find { toJson(it.subGroups) == toJson(group.subGroups) }
            if(equalDestinationGroup)
            {
                //если есть группировка с таким же настройками, берем её ключ
                group.id = equalDestinationGroup.id
            }
            else
            {
                //иначе добавляем новую группировку с новым ключом
                String newId = group.id
                while(newId in destinationCustomGroups.id)
                {
                    newId += "_${destinationDashboardKey}"
                }
                group.id = newId
            }
        }
        return group
    }

    /**
     * Метод по изменению кастомных группировок на системные
     * @param widgetSettings - настройки виджета
     * @return измененные настройки виджета
     */
    private Widget editCustomGroupsFromAnotherDBToSystem(def widgetSettings, Collection currentCustomGroups)
    {
        widgetSettings.data.each { dataValue ->
            dataValue.parameters = updateCustomGroupsToSystem(dataValue.parameters, currentCustomGroups)
            if(dataValue.breakdown)
            {
                dataValue.breakdown = updateCustomGroupsToSystem(dataValue.breakdown, currentCustomGroups)
            }
        }
        return widgetSettings
    }

    /**
     * Метод по изменению ключей кастомных группировок до новых
     * @param widgetSettings - настройки виджета
     * @param currentCustomGroupsIds - ключи кастомных группировок
     * @return настройки виджета с правильными ключами кастомных группировок
     */
    private Widget editCustomGroupKeys(def widgetSettings, Collection<String> currentCustomGroupsIds)
    {
        widgetSettings.data.each { dataValue ->
            dataValue.parameters = updateCustomGroupKeys(dataValue.parameters, currentCustomGroupsIds)
            if(dataValue.breakdown)
            {
                dataValue.breakdown = updateCustomGroupKeys(dataValue.breakdown, currentCustomGroupsIds)
            }
        }
        return widgetSettings
    }

    /**
     * Метод по преобразованию ключей кастомных группировок в параметрах/разбивке
     * @param valuesWithGroup - значения с группами
     * @param currentCustomGroupsIds - ключи кастомых группировок на дашборде на данный момент
     * @return значения с группировками  справильными клчюами
     */
    private Collection updateCustomGroupKeys(Collection<IHasGroup> valuesWithGroup, Collection<String> currentCustomGroupsIds)
    {
        return valuesWithGroup.collect {
            if(it?.group?.way == Way.CUSTOM)
            {
                def groupKey = it?.group?.data
                //нашли новый ключ, в состав которого входит информация о старом, и подставляем его
                def currentGroupKey = currentCustomGroupsIds.find {it.contains(groupKey)}
                if(currentGroupKey != groupKey)
                {
                    it?.group?.data = currentGroupKey
                }
            }
            return it
        }
    }

    /**
     * Метод по замене групп в списке значений с группами
     * @param valuesWithGroup - список значений с группами
     * @return значения только с системными группами
     */
    private Collection updateCustomGroupsToSystem(Collection valuesWithGroup, Collection currentCustomGroups)
    {
        return valuesWithGroup.collect {
            def groupKey = it?.group?.data
            if(it?.group?.way == Way.CUSTOM &&
               currentCustomGroups.find{ it.id == groupKey }*.subGroups
                                  ?.data
                                  ?.type?.flatten()*.toLowerCase()
                                  ?.every { it.contains('subject') || it.contains('object') })
            {
                it.group = getSystemGroup(it.attribute)
            }
            return it
        }
    }

    /**
     * Метод по получению системной группировки для атрибута
     * @param attribute - атрибут параметра
     * @return системная группировка для атрибута
     */
    private SystemGroupInfo getSystemGroup(def attribute)
    {
        switch (attribute?.type)
        {
            case AttributeType.DT_INTERVAL_TYPE:
                return new  SystemGroupInfo(way: Way.SYSTEM, data: GroupType.WEEK_INTERVAL)
            case AttributeType.DATE_TYPES:
                return new  SystemGroupInfo(way: Way.SYSTEM, data: GroupType.MONTH)
            default:
                return new  SystemGroupInfo(way: Way.SYSTEM, data: GroupType.OVERLAP)
        }
    }

    /**
     * Метод для получения соответсвия условию для некоторой коллекции элементов
     * @param elements - коллекция элементов
     * @param currentCustomGroups - текущие кастомные группировки
     * @param conditionSpread - распространенность условия
     * @parem currentUserLocale - текущая локаль пользователя
     * @return флаг true/false на соответствие
     */
    private Boolean returnParametersOrBreakdownAnswer(Collection elements, Collection currentCustomGroups, String conditionSpread, def currentUserLocale)
    {
        switch (conditionSpread)
        {
            case 'any':
                return elements ? elements?.any { it?.group?.way == Way.CUSTOM && currentCustomGroups*.subGroups?.data?.type?.flatten()*.toLowerCase()?.any {it.contains('subject') || it.contains('object')} } : false
            case 'every':
                return elements ? elements?.every { it?.group?.way == Way.CUSTOM && currentCustomGroups*.subGroups?.data?.type?.flatten()*.toLowerCase()?.every {it.contains('subject') || it.contains('object')} } : false
            default:
                String message = messageProvider.getConstant(WRONG_ARGUMENT_ERROR, currentUserLocale)
                api.utils.throwReadableException("${message}#${WRONG_ARGUMENT_ERROR}")
        }
    }

    /**
     * Метод по добавлению uuid-ов в подгруппы кастомных группировок, если их там ещё нет
     * @param group - кастомная группировка
     * @return кастомная группировка с uuid-ами в подгруппах
     */
    private CustomGroup addUUIDSToSubGroupsIfNotAdded(CustomGroup group)
    {
        group?.subGroups.each {
            if(!it.id)
            {
                it.id = UUID.randomUUID()
            }
        }
        return group
    }

    /**
     * Метод удаления виджета с дашборда. Бросает исключение если удаление не удалось.
     * @param dashboardKey - уникальный идентификатор дашборда
     * @param widgetKey    - уникальный идентификатор виджета
     * @param currentUserLocale - текущая локаль пользователя
     * @return уникальный идентификатор удалённого дашборда
     */
    private String removeWidgetFromDashboard(String dashboardKey, String widgetKey, def currentUserLocale)
    {
        if (!excludeWidgetsFromDashboard(dashboardKey, [widgetKey], currentUserLocale))
        {
            String message = messageProvider.getMessage(WIDGET_NOT_REMOVED_ERROR, currentUserLocale, widgetKey: widgetKey, dashboardKey: dashboardKey)
            api.utils.throwReadableException("${message}#${WIDGET_NOT_REMOVED_ERROR}")
        }
        return dashboardKey
    }

    /**
     * Метод точечного изменения названия виджета
     * @param widgetName - название виджета
     * @param variableMap - словарь [переменная: значение]
     * @return итоговое название виджета
     */
    private String replaceWidgetName(String widgetName, Map<String, Object> variableMap)
    {
        if (variableMap?.keySet()?.any { widgetName?.contains(it)})
        {
            try
            {
                //пользователь может написать несуществующее поле у subject-а
                widgetName = checkWidgetName(widgetName, variableMap)
                def stringTokenize = widgetName.tokenize('{}')
                //находим все части, где есть указание на переменную
                //и добавляем в них перед вызовом атрибута объекта знак на защиту
                // от вызова атрибута по нулевому значению
                List<Map> newValues = stringTokenize.findAll { val ->
                    variableMap.keySet().any { val.contains(it) }
                }.collect { return [key: it, value: "{${it.replace('.', '?.')}}"] }
                //составляем заново строку из измененных значений
                widgetName = stringTokenize.collect { it in newValues*.key
                    ? newValues.find {val -> val.key  == it }.value
                    : it
                }.join('')
                return api.utils.processTemplate(widgetName, variableMap)
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
     * Метод исключение виджетов из настрок дашборда
     * @param dashboardKey - уникальный идентификатор дашборда
     * @param widgets      - уникальные идентификаторы виджетов
     * @param currentUserLocale - текущая локаль пользователя
     * @return успех|провал
     */
    private boolean excludeWidgetsFromDashboard(String dashboardKey, Collection<String> widgets, def currentUserLocale)
    {
        def dashboardSettings = getDashboardSetting(dashboardKey)
        if (!dashboardSettings)
        {
            String message = messageProvider.getMessage(DASHBOARD_NOT_FOUND_ERROR, currentUserLocale, dashboardKey: dashboardKey)
            api.utils.throwReadableException("${message}#${DASHBOARD_NOT_FOUND_ERROR}")
        }
        dashboardSettings.widgets?.removeAll { it?.id in widgets }
        return saveJsonSettings(dashboardKey, toJson(dashboardSettings), DASHBOARD_NAMESPACE)
    }

    /**
     * Метод подготовки виджета перед сохранением в ДБ
     * @param settings - настройки виджета
     * @param generateCode - метод генерации ключа виджета
     * @param userLogin - логин пользователя
     * @return сгенерированнй ключ нового виджета
     */
    private Widget prepareWidgetSettings(Widget widgetSettings, Closure<String> generateCode, String userLogin = '')
    {
        String key = generateCode()
        return setUuidInSettings(widgetSettings, key)
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
                                     String dashboardUUID = null,
                                     String oldWidgetKey = null)
    {
        String type = api.utils.get(classFqn)?.metaClass?.toString()
        def loginKeyPart = login ? "_${login}" : ''
        def dashboardKeyPart = dashboardUUID ? "_${dashboardUUID}": ''
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
                uuidWidget = "${type}_${contentCode}_${UUID.randomUUID()}${loginKeyPart}${dashboardKeyPart}"
            }
            (keys?.contains(uuidWidget))
        }()) continue
        return uuidWidget
    }

    /**
     * Метод полноценного изменения названия виджета
     * @param widgetSettings - настройки виджета
     * @param variableMap - словарь [переменная: значение]
     * @return итоговые настройки виджета
     */
    private Widget changeTotalWidgetName(def widget, Map<String, Object> variableMap)
    {
        if (widget)
        {
            widget?.name = widget?.templateName
                ? replaceWidgetName(widget?.templateName, variableMap)
                : widget?.name
            if (widget?.header)
            {
                def header = widget?.header
                header?.name = header?.template
                    ? replaceWidgetName(header?.template, variableMap)
                    : header?.name
                widget?.header = header
            }
            return widget
        }
        return widget
    }

    /**
     * Метод по замене переменных в тексте виджета типа "Текст"
     * @param widgetSettings - настройки виджета
     * @param variableMap - словарь [переменная: значение]
     * @return итоговые настройки виджета
     */
    private Widget changeTextInTextWidget(Widget widget, Map<String, Object> variableMap)
    {
        if (widget)
        {
            def textInWidget = widget.text
            widget.variables = textInWidget.tokenize().collectEntries { possibleVar ->
                if (possibleVar.contains('${'))
                {
                    def value = replaceWidgetName(possibleVar, variableMap)
                    //условие равенства - значит, такой переменной нет
                    return possibleVar == value ? [:] : [(possibleVar): value]
                }
                return [:]
            }
            return widget
        }
        return widget
    }

    /**
     * Метод подготовки настроек для персонального дашборда
     * @param settings - текущие настройки дашборда
     * @param userLogin - логин пользователя
     * @return - правильные настройки дашборда
     */
    private DashboardSettingsClass prepareDashboardSettings(DashboardSettingsClass settings, String userLogin)
    {
        if (userLogin)
        {
            settings.widgets = settings.widgets.collect { widgetSettings ->
                widgetSettings.id += "_${ userLogin }"
                widgetSettings = prepareWidgetSettings(widgetSettings, { widgetSettings.id } ,userLogin)
                return widgetSettings
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
    private Layout prepareLayouts(Layout layouts, String userLogin)
    {
        layouts?.lg?.each { it?.i += "_${ userLogin }" }
        layouts?.sm?.each { it?.i += "_${ userLogin }" }
        return layouts
    }

    /**
     * Получение настроек дашборда
     * @param classFqn    - код типа куда выведено встроенное приложение
     * @param contentCode - код контента встроенного приложения
     * @param dashboardUUID - уникальный идентификатор экземпляра дашборда
     * @param login       - логин текущего пользователя
     * @return настройки дашборда
     */
    private DashboardSettingsClass getDashboardSetting(String classFqn, String contentCode, String login = null, String dashboardUUID = '')
    {
        return getDashboardSetting(generateDashboardKey(classFqn, contentCode, login, dashboardUUID))
    }

    /**
     * Генерация ключа для сохранения настроек дашборда
     * @param classFqn код типа куда выведено встроенное приложение
     * @param contentCode код контента встроенного приложения
     * @param login логин пользователя или пустое значение если сохранение по умолчанию
     * @return сгенированный ключ для дашборда
     */
    private String generateDashboardKey(String classFqn, String contentCode, String login = null, String dashboardUUID = '')
    {
        String type = api.utils.get(classFqn)?.metaClass?.toString()
        String loginKeyPart = login ? "_${login}" : ''
        String dashboardKeyPart = dashboardUUID ? "_${dashboardUUID}" : ''
        return "${type}_${contentCode}${loginKeyPart}${dashboardKeyPart}"
    }

    /**
     * Получение настроек дашборда
     * @param dashboardKey - уникальный идентификатор дашборда
     * @return настройки дашборда
     */
    private DashboardSettingsClass getDashboardSetting(String dashboardKey)
    {
        def dashboardSettings = api.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)

        DashboardSettingsClass dashboard = Jackson.fromJsonString(dashboardSettings, DashboardSettingsClass)
        if(dashboard)
        {
            dashboard.widgets = dashboard.widgets.findResults { w ->
                def widget = DashboardUtils.convertWidgetToNewFormat(w)
                return widget?.type == DiagramType.TEXT ? widget : updateWidgetCustomGroup(widget, dashboard)
            }
            if(dashboard.dashboardUUID)
            {
                dashboard.type = DashboardType.USER
            }
        }
        return dashboard
    }

    /**
     * Получение настроек виджета
     * @param widgetKey ключ в формате
     * ${код типа куда выведено вп}_${код контента вп}_${опционально логин}_${индентификатор виджета}*
     * @return настройки виджета
     */
    private Widget getWidgetSettings(def settings, Boolean isMobile = false)
    {
        if (settings && isMobile)
        {
            settings = settings.displayMode in MCDisplayMode.values()*.name() ? settings : null
        }
        return settings
    }

    /**
     * Проверка пользователя на наличие группы мастер дашбордов
     * @param user БО текущего пользователя
     * @param isForUser - флаг на работу пользовательского режима
     * @param messageError сообщение о ошибке
     */
    private checkRightsOnDashboard(IUUIDIdentifiable user, Boolean isForUser, String messageError)
    {
        if (!checkUserOnMasterDashboard(user) && !isForUser)
        {
            def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
            messageError = getCorrectMessageError(messageError, currentUserLocale)
            String message = messageProvider.getMessage(MUST_NOT_ADD_EDIT_WIDGET_ERROR, currentUserLocale,messageError: messageError)
            api.utils.throwReadableException("${message}#${MUST_NOT_ADD_EDIT_WIDGET_ERROR}")
        }
    }

    /**
     * Метод проверки пользователя на мастера дашборда
     * @param user
     * @return
     */
    private boolean checkUserOnMasterDashboard(IUUIDIdentifiable user)
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
    private void checkRightsOnEditDashboard(def editable, def currentUserLocale)
    {
        if (!editable)
        {
            String message = messageProvider.getConstant(PERSONAL_SETTINGS_DISABLED_ERROR, currentUserLocale)
            api.utils.throwReadableException("${message}#${PERSONAL_SETTINGS_DISABLED_ERROR}")
        }
    }

    /**
     * Метод проверки, является ли данный виджет персональным
     * @param widgetKey - уникальный мдентификатор виджета
     * @param user      - пользователь
     * @return true | false
     */
    private boolean isPersonalWidget(String widgetKey, IUUIDIdentifiable user)
    {
        return user ? widgetKey?.endsWith("_${user?.login}") : false
    }

    /**
     * Пробросить сгенерированный ключ в настройки виджета
     * @param widgetSettings - настройки виджета
     * @param key            - сгенерированный uuid ключ
     * @return настройки виджета с ключом
     */
    private Widget setUuidInSettings(Widget widgetSettings, String key)
    {
        if (widgetSettings)
        {
            widgetSettings.id = key
            return widgetSettings
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
    private String getUserGroup(IUUIDIdentifiable user)
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
    private Boolean deletePersonalWidget(String classFqn,
                                         String contentCode,
                                         String widgetId,
                                         Boolean editable,
                                         IUUIDIdentifiable user)
    {
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (!(checkUserOnMasterDashboard(user) || editable))
        {
            return throwNoRightsOnRemoveWidget(currentUserLocale)
        }

        String personalDashboardKey = generateDashboardKey(classFqn, contentCode, user?.login as String)
        String defaultDashboardKey = generateDashboardKey(classFqn, contentCode)

        if (isPersonalWidget(widgetId, user))
        {
            return removeWidgetFromDashboard(personalDashboardKey, widgetId, currentUserLocale) as boolean
        }
        else
        {
            def settings = getDashboardSetting(personalDashboardKey) ?: getDashboardSetting(defaultDashboardKey)
            settings.widgets.removeIf {it?.id == widgetId }
            def res = saveJsonSettings(personalDashboardKey, toJson(settings), DASHBOARD_NAMESPACE)
            if (!res)
            {
                String message = messageProvider.getMessage(WIDGET_NOT_REMOVED_ERROR, currentUserLocale, widgetKey: widgetKey, dashboardKey: personalDashboardKey)
                api.utils.throwReadableException("${message}#${WIDGET_NOT_REMOVED_ERROR}")
            }
            return res
        }
    }

    /**
     * Метод удаления виджета по умолчанию
     * @param classFqn - код типа куда выведено встроенное приложение
     * @param contentCode - код контента встроенного приложения
     * @param widgetId - код виджета
     * @param user - пользователь
     * @param isForUser - флаг на включение пользовательского режима
     * @return успех | провал
     */
    private Boolean deleteDefaultWidget(String subjectUUID,
                                        String contentCode,
                                        String widgetId, IUUIDIdentifiable user,
                                        Boolean isForUser)
    {
        def dashboardKeyByLogin = this.&generateDashboardKey.curry(subjectUUID, contentCode)
        def currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
        if (!user)
        {
            // значит это супер пользователь! нет персональных виджетов и персональных дашбордов
            return removeWidgetFromDashboard(dashboardKeyByLogin(null, isForUser ? subjectUUID : null), widgetId, currentUserLocale) as boolean
        }
        else
        {
            if(!checkUserOnMasterDashboard(user) && !isForUser)
            {
                return throwNoRightsOnRemoveWidget(currentUserLocale)
            }

            if (isPersonalWidget(widgetId, user))
            {
                String personalDashboardKey = dashboardKeyByLogin(user.login as String, isForUser ? subjectUUID : null)
                String defaultWidget = widgetId - "_${user?.login}"
                removeWidgetFromDashboard(dashboardKeyByLogin(null, isForUser ? subjectUUID : null), defaultWidget, currentUserLocale)
                return removeWidgetFromDashboard(personalDashboardKey, widgetId, currentUserLocale) as boolean
            }
            else
            {
                // По возможности удалить и персональный виджет, если он есть
                String personalDashboardKey = dashboardKeyByLogin(user?.login as String, isForUser ? subjectUUID : null)
                loadJsonSettings(personalDashboardKey, DASHBOARD_NAMESPACE) // проверка на существование персонального дашборда
                    ?.with { removeWidgetFromDashboard(personalDashboardKey, widgetId, currentUserLocale) }
                return removeWidgetFromDashboard(dashboardKeyByLogin(null, isForUser ? subjectUUID : null), widgetId, currentUserLocale) as boolean
            }
        }
    }

    /**
     * Метод получения ключей дашбордов
     * @param namespace - название неймспейса
     * @return массив из ключей дашбордов
     */
    private List getDashboardKeys()
    {
        def slurper = new groovy.json.JsonSlurper()

        return api.keyValue.find(DASHBOARD_NAMESPACE, '') { key, value ->
            def settings = slurper.parseText(value)
            settings.containsKey('widgets')
        }.keySet().toList()
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
    private List<String> getWidgetNames(List widgets)
    {
        return widgets?.collect {
            return it?.type != DiagramType.TEXT && it?.templateName ? it?.templateName?.toString() : it?.name?.toString()
        }
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
                              IUUIDIdentifiable user = null)
    {
        String name = requestContent?.widget?.templateName ?: requestContent?.widget?.name
        String dashboardKey = isPersonal
            ? generateDashboardKey(requestContent.classFqn, requestContent.contentCode, user?.login as String, requestContent.isForUser ? requestContent.classFqn : null)
            : generateDashboardKey(requestContent.classFqn, requestContent.contentCode, null, requestContent.isForUser ? requestContent.classFqn : null)
        List<String> widgetsNames = getWidgetNamesFromDashboard(dashboardKey, widgetKey)
        if (name in widgetsNames)
        {
            String currentUserLocale = DashboardUtils.getUserLocale(user?.UUID)
            String message = messageProvider.getMessage(NOT_UNIQUE_WIDGET_NAME_ERROR, currentUserLocale, name: name)
            api.utils.throwReadableException("${message}#${NOT_UNIQUE_WIDGET_NAME_ERROR}")
        }
    }

    /**
     * Метод получения итогового списка uuid-ов и названий дашбордов
     * @return список ассоциативных массивов
     */
    private List<Map<String, String>> getDashboardsUUIDAndTitle(def currentUserLocale)
    {
        def root = api.utils.findFirst('root', [:])

        if (root.hasProperty('dashboardCode') && root.dashboardCode)
        {
            def appCode = root.dashboardCode
            def contents = api.apps.listContents(appCode)
            if (contents)
            {
                def res = []
                contents.each{ content ->
                    def fqn = content.subjectFqn

                    // Собираем в список типы класса fqn (необходимо для классов, пронаследованных в тип)
                    List<String> typeFqns = api.metainfo.getTypes(fqn)?.collect { it.code } ?: []

                    // Добавляем сам класс
                    res << [uuid: (DashboardCodeMarshaller.marshal(content.subjectFqn, content.contentUuid)) , title: content.contentTitle]

                    // Добавляем типы класса
                    typeFqns.each{
                        res << [uuid: (DashboardCodeMarshaller.marshal(it, content.contentUuid)) , title: content.contentTitle]
                    }
                }
                return res
            }
        }
        String message = messageProvider.getConstant(EMPTY_DASHBOARD_CODE_ERROR, currentUserLocale)
        api.utils.throwReadableException("${message}#${EMPTY_DASHBOARD_CODE_ERROR}")
    }

    /**
     * Метод получения информации о виджете (для дерева)
     * @param widgetKey - ключ виджета
     * @return WidgetInfo
     */
    private WidgetInfo getWidgetInfo(def widgetSettings)
    {
        return widgetSettings && widgetSettings?.type != DiagramType.TEXT
            ? new WidgetInfo(value: widgetSettings.id, label: widgetSettings.name)
            : null
    }

    /**
     * Метод проверки и изменения фильтрации, если необходимо
     * @param widgetSettings - настройки виджета
     * @param dashboardKey - ключ дашборда, на который хотим отправить виджет
     * @return итоговые настройки виджета
     */
    private Widget editWidgetDescriptor(def widgetSettings, String dashboardKey)
    {
        if (widgetSettings)
        {
            Widget widget = widgetSettings
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
                if(dataValue.source.filterId)
                {
                    dataValue.source = NewSourceValue.mappingSource(dataValue.source)
                }
                def descriptor = dataValue.source.descriptor
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

                        //среди фильтров могут быть значения через ИЛИ, их нужно подчистить от относительных критериев
                        def changedValues = valuesToRemove.findResults { values->
                            //если значение изменилось, добавить в список
                            //данных может не остаться, если было только 1 условие, которое удалили
                            if(values.removeIf {it.properties.conditionCode.toLowerCase().contains('subject')}) return values ?: null
                        }
                        filters -= valuesToRemove
                        //добавить измененные ИЛИ условия
                        filters += changedValues
                        descriptorMap.filters = filters
                    }
                    descriptor = toJson(descriptorMap)
                    dataValue.source.descriptor = descriptor
                    //сохраненный источник уже не применяется
                    if(dataValue.source.filterId)
                    {
                        dataValue.source.filterId = null
                        def metaClass = dataValue.source.value.value
                        dataValue.source.value.label = api.metainfo.getMetaClass(metaClass)?.getTitle()
                    }
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
     * @param variableMap - словарь [переменная: значение]
     * @return нормализованное название виджета
     */
    private String checkWidgetName(String widgetName, Map<String, Object> variableMap)
    {
        int idsCount = widgetName.findAll { it == '{'}.size()
        if (idsCount > 0)
        {
            String tempWidgetName = widgetName
            String subjectFqn = variableMap?.subject?.getMetaClass()?.toString()
            String userFqn = variableMap?.user?.getMetaClass()?.toString()
            List variables = []
            List variableIds = []
            for (int i = 0; i < idsCount; i++)
            {
                def var = tempWidgetName.dropWhile { it != '{'}.takeWhile { it != '}'}.drop(1)
                variables += var
                def varToCheck = var
                variableMap?.keySet()?.each {
                    varToCheck = varToCheck - "${it}."
                }
                Boolean updateValue = varToCheck.tokenize('.').any { check ->
                    return checkAttributeType (check, var.contains('user') ? userFqn : subjectFqn)
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
                tempResult = api.utils.processTemplate("\${${templateVariable}}",  variableMap)
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
    private List<String> getWidgetNamesFromDashboard(String dashboardKey,  String widgetKey = null)
    {
        def widgets = getDashboardSetting(dashboardKey)?.widgets
        if (widgetKey)
        {
            widgets.removeIf {it?.id == widgetKey}
        }
        return widgets ? getWidgetNames(widgets) : null
    }

    /**
     * Метод проверки типа атрибута в переменной в названии виджета на тип caseList
     * @param code - код атрибута
     * @param classFqn - метакласс
     * @return флаг true|false
     */
    private Boolean checkAttributeType(String code, String classFqn)
    {
        def attributeType = api.metainfo.getMetaClass(classFqn)?.getAttribute(code)?.getType()
        return attributeType?.toString()?.contains('caseList')
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