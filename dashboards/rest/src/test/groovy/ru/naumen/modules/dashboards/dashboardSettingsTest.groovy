package ru.naumen.modules.dashboards

import com.amazonaws.util.json.Jackson
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.json.JsonSlurper
import groovy.transform.Canonical
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Spy
import org.mockito.junit.jupiter.MockitoExtension
import ru.naumen.core.shared.dto.ISDtObject
import ru.naumen.modules.dashboards.DashboardSettingsService
import ru.naumen.modules.dashboards.utils.ApiDependedUnitTest

import static groovy.json.JsonOutput.toJson
import static org.junit.jupiter.api.Assertions.assertThrows
import static org.junit.jupiter.api.Assertions.assertTrue
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.doReturn
import static org.mockito.Mockito.when
import static ru.naumen.modules.dashboards.MessageProvider.*

/**
 * <p>Тестирование методов модуля DashboardSettings.</p>
 *
 * <p><b>Ссылки на задачи:</b></p>
 *
 * <ol>
 *     <li>
 *         <a href="https://naupp.naumen.ru/sd/operator/#uuid:projectTasks$140161710" target="_blank">
 *            SMRMEXT-12792 АТ: разработка юнит тестов на бэк
 *         </a>
 *    </li>
 * </ol>
 *
 *<p><b>Подготовка:</b></p>
 *
 * <ol>
 *     <li>установлены настройки хранилища в зависимости от кейса тестирования;</li>
 *     <li>при получении локали пользователя через dashboardUtils.getUserLocale заранее отправляется локаль ru.</li>
 * </ol>
 *
 * <p><b>Действия и проверки:</b></p>
 *
 * <ol>
 *     <li>whenCreateWidgetThenWidgetKeyContainsDashboardKey - метод createWidget - проверка возвращаемого ключа виджета;</li>
 *     <li>whenEditWidgetThenChangesReturn - метод editWidget - проверка, что изменения внеслись;</li>
 *     <li>whenDashboardInNameSpaceThenFindItsSettings - метод getSettings - проверка получения ожидаемых настроек по ключу дашборда;</li>
 *     <li>whenNoDashboardInNameSpaceThenReturnStartDashboardSettings - метод getSettings - проверка получения настроек дашборда для отображения с незаполненными полями;</li>
 *     <li>whenNoUserThenHasPersonalDashboardEqualsFalse - метод getUserData - проверка отсутствия для супер пользователя личного дашборда;</li>
 *     <li>whenNoUserGroupsThenUserGroupEqualsRegular - метод getUserData - проверка возврата группы REGULAR для обычного пользователя;</li>
 *     <li>whenUserHasLoginAndDashboardThenHasPersonalDashboardEqualsTrue - метод getUserData - проверка положительного ответа, если у обычного пользователя есть личный дашборд;</li>
 *     <li>whenUserHasTitleAndEmailThenUserDataHasEqualNameAndEmail - метод getUserData - проверка корректности данных по пользователю (title, email);</li>
 *     <li>whenCreateWidgetWithNotUniqueNameThenThrowError - метод createWidget - проверка наличия ошибки на попытку добавить виджет с неуникальным названием;</li>
 *     <li>whenCreatePersonalWidgetAndNotEditionAllowedThenThrowError - метод createWidget - проверка наличия ошибки на попытку добавить виджет на личный дашборд без возможности редактирования;</li>
 *     <li>whenCreatePersonalWidgetAndNoUserSpecifiedThenThrowError - метод createWidget - проверка наличия ошибки на попытку добавить виджет на личный дашборд пользователем без логина;</li>
 *     <li>whenCreateWidgetThatIsNotForUserAndUserIsNotDashboardMasterThenThrowError - метод createWidget - проверка наличия ошибки на попытку добавить виджет на общий дашборд обычным пользователем;</li>
 *     <li>whenEditWidgetWithNotUniqueNameThenThrowError - метод editWidget - проверка наличия ошибки на попытку отредактировать виджет, установив неуникальное имя на дашборде.</li>
 * </ol>
 */
@ExtendWith(MockitoExtension)
class DashboardSettingsTest extends ApiDependedUnitTest
{
    @Spy
    @InjectMocks
    private DashboardSettingsService service

    private static final String DASHBOARD_NAMESPACE = 'dashboards'
    private static final String OLD_GROUP_MASTER_DASHBOARD = 'MasterDashbordov'
    private static final String GROUP_MASTER_DASHBOARD = 'sys_dashboardMaster'
    private static final String ROLE_SUPERUSER = 'ROLE_SUPERUSER'

    private static ObjectMapper mapper = new ObjectMapper()
    JsonSlurper slurper = new JsonSlurper()

    /**
     * проверка возвращаемого ключа виджета
     */
    @Test
    void whenCreateWidgetThenWidgetKeyContainsDashboardKey()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenCreateWidgetThenWidgetKeyContainsDashboardKeyWidget.json')
        File file = new File(fileUrl.toURI())
        Map<String, Object> widget = slurper.parseText(file.text)

        String contentCode = 'testContentCode'
        Boolean isForUser = false
        Boolean editable = true
        Boolean isPersonal = false

        String subjectUUID = 'root$401'
        String dashboardKey = "root_${contentCode}"
        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])

        def user = userMap.withTraits(ISDtObject)

        fileUrl = getClass().getClassLoader().getResource('whenCreateWidgetThenWidgetKeyContainsDashboardKeyStorage.json')
        file = new File(fileUrl.toURI())
        String storageBefore = file.text

        when(service.keyValue.get(eq(DASHBOARD_NAMESPACE), eq(dashboardKey))).thenReturn(storageBefore)
        when(service.keyValue.put(eq(DASHBOARD_NAMESPACE), eq(dashboardKey), anyString())).thenReturn(true)

        when(service.dashboardUtils.getUserLocale(eq(user.UUID))).thenReturn('ru')
        String widgetId = service.createWidget(widget, subjectUUID, contentCode, isForUser, editable, isPersonal, user).id
        assert widgetId != null
        assert widgetId.tokenize('_')[0..-2].join('_') == dashboardKey
    }

    /**
     * проверка, что изменения внеслись
     */
    @Test
    void whenEditWidgetThenChangesReturn()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenEditWidgetThenChangesReturnWidget.json')
        File file = new File(fileUrl.toURI())
        Map<String, Object> widget = slurper.parseText(file.text)

        String contentCode = 'testContentCode'
        Boolean isForUser = false
        Boolean editable = true
        Boolean isPersonal = false

        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])

        def user = userMap.withTraits(ISDtObject)

        String subjectUUID = 'root$401'
        String dashboardKey = "root_${contentCode}"

        fileUrl = getClass().getClassLoader().getResource('whenEditWidgetThenChangesReturnStorage.json')
        file = new File(fileUrl.toURI())
        String storageBefore = file.text

        when(service.keyValue.get(eq(DASHBOARD_NAMESPACE), eq(dashboardKey))).thenReturn(storageBefore)
        when(service.keyValue.put(eq(DASHBOARD_NAMESPACE), eq(dashboardKey), anyString())).thenReturn(true)

        when(service.dashboardUtils.getUserLocale(eq(user.UUID))).thenReturn('ru')

        String widgetName = service.editWidget(widget, subjectUUID, contentCode, isForUser, editable, isPersonal, user).templateName
        assert widgetName == 'тест виджета изменение'
    }

    /**
     * проверка получения ожидаемых настроек по ключу дашборда
     */
    @Test
    void whenDashboardInNameSpaceThenFindItsSettings()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenDashboardInNameSpaceThenFindItsSettingsStorage.json')
        File file = new File(fileUrl.toURI())
        String storage = file.text

        String contentCode = 'testContentCode'
        Boolean isForUser = false
        Boolean isPersonal = false
        Boolean isMobile = false
        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])

        def user = userMap.withTraits(ISDtObject)

        String subjectUUID = 'root$401'
        String dashboardKey = "root_${contentCode}"
        String personalDashboardKey = "root_${contentCode}_${user.login}"

        doReturn(storage).when(service.keyValue).get(eq(DASHBOARD_NAMESPACE), eq(dashboardKey))
        doReturn("{}").when(service.keyValue).get(eq(DASHBOARD_NAMESPACE), eq(personalDashboardKey))

        DashboardSettingsClass settings = service.getSettings(subjectUUID, contentCode, isPersonal, isMobile, isForUser, user)
        assert settings.dashboardKey == dashboardKey
    }

    /**
     * проверка получения настроек дашборда для отображения с незаполненными полями
     */
    @Test
    void whenNoDashboardInNameSpaceThenReturnStartDashboardSettings()
    {
        String contentCode = 'testContentCode'
        Boolean isForUser = false
        Boolean isPersonal = false
        Boolean isMobile = false
        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])

        def user = userMap.withTraits(ISDtObject)

        String subjectUUID = 'root$401'
        String dashboardKey = "root_${contentCode}"
        String personalDashboardKey = "root_${contentCode}_${user.login}"

        doReturn("{}").when(service.keyValue).get(eq(DASHBOARD_NAMESPACE), eq(dashboardKey))
        doReturn("{}").when(service.keyValue).get(eq(DASHBOARD_NAMESPACE), eq(personalDashboardKey))

        DashboardSettingsClass settings = service.getSettings(subjectUUID, contentCode, isPersonal, isMobile, isForUser, user)
        assert settings.dashboardKey == dashboardKey
    }

    /**
     * проверка отсутствия для супер пользователя личного дашборда
     */
    @Test
    void whenNoUserThenHasPersonalDashboardEqualsFalse()
    {
        def userData = service.getUserData('test', 'test', null)
        assert userData.hasPersonalDashboard == false
    }

    /**
     * проверка возврата группы REGULAR для обычного пользователя
     */
    @Test
    void whenNoUserGroupsThenUserGroupEqualsRegular()
    {
        Map<String, Object> userMap = [UUID     : 'testUUID2',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: []]
        registerObject(userMap)
        def user = userMap.withTraits(ISDtObject)
        def userData = service.getUserData('test', 'test', user)
        assert userData.groupUser == 'REGULAR'
    }

    /**
     * проверка положительного ответа, если у обычного пользователя есть личный дашборд
     */
    @Test
    void whenUserHasLoginAndDashboardThenHasPersonalDashboardEqualsTrue()
    {
        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])
        def user = userMap.withTraits(ISDtObject)

        def contentCode = 'testContentCode'
        def dashboardKey = "root_${ contentCode }_${ user.login }"

        when(service.keyValue.get(DASHBOARD_NAMESPACE, dashboardKey)).thenReturn("{}")

        def userData = service.getUserData('root$401', contentCode, user)
        assert userData.hasPersonalDashboard == true
    }

    /**
     * проверка корректности данных по пользователю (title, email)
     */
    @Test
    void whenUserHasTitleAndEmailThenUserDataHasEqualNameAndEmail()
    {
        def classFqn = 'root$401'
        def contentCode = 'testContentCode'

        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])
        def user = userMap.withTraits(ISDtObject)

        def userData = service.getUserData(classFqn, contentCode, user)
        assert user.email == userData.email && user.title == userData.name
    }

    /**
     * проверка наличия ошибки на попытку добавить виджет с неуникальным названием
     */
    @Test
    void whenCreateWidgetWithNotUniqueNameThenThrowError()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenCreateWidgetWithNotUniqueNameThenThrowErrorWidget.json')
        File file = new File(fileUrl.toURI())
        Map<String, Object> widget = slurper.parseText(file.text)
        fileUrl = getClass().getClassLoader().getResource('whenCreateWidgetWithNotUniqueNameThenThrowErrorStorage.json')
        file = new File(fileUrl.toURI())
        String storageBefore = file.text

        String contentCode = 'testContentCode'
        Boolean isForUser = false
        Boolean editable = true
        Boolean isPersonal = false

        Map<String, Object> userMap = [UUID     : 'employee$123',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: [new UserGroup()]]
        registerObject(userMap)
        registerObject( [UUID     : 'root$401',
                         title    : 'test',
                         metaClass: 'root'])
        def user = userMap.withTraits(ISDtObject)
        String subjectUUID = 'root$401'
        String dashboardKey = "root_${contentCode}"


        when(service.utils.throwReadableException(any())).thenAnswer(
            {
                throw new RuntimeException(it.getArgument(0))
            }
        )

        when(service.keyValue.get(eq(DASHBOARD_NAMESPACE), eq(dashboardKey))).thenReturn(storageBefore)
        when(service.dashboardUtils.getUserLocale(eq(user.UUID))).thenReturn('ru')
        when(service.utils.processTemplate(anyString(), any())).thenReturn('Виджет с названием тест виджета не может быть сохранен. Название виджета должно быть уникально в рамках дашборда.')

        Exception exception = assertThrows (RuntimeException, { service.createWidget(widget, subjectUUID, contentCode, isForUser, editable, isPersonal, user) })
        assertTrue(exception.getMessage().contains(NOT_UNIQUE_WIDGET_NAME_ERROR))
    }

    /**
     * проверка наличия ошибки на попытку добавить виджет на личный дашборд без возможности редактирования
     */
    @Test
    void whenCreatePersonalWidgetAndNotEditionAllowedThenThrowError()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenCreatePersonalWidgetAndNotEditionAllowedThenThrowErrorWidget.json')
        File file = new File(fileUrl.toURI())
        Map<String, Object> widget = slurper.parseText(file.text)

        when(service.utils.throwReadableException(any())).thenAnswer(
            {
                throw new RuntimeException(it.getArgument(0))
            }
        )

        Exception exception = assertThrows (RuntimeException, { service.createWidget(widget, null, null, false, false, true, null) })
        assertTrue(exception.getMessage().contains(PERSONAL_SETTINGS_DISABLED_ERROR))
    }

    /**
     * проверка наличия ошибки на попытку добавить виджет на личный дашборд пользователем без логина
     */
    @Test
    void whenCreatePersonalWidgetAndNoUserSpecifiedThenThrowError()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenCreatePersonalWidgetAndNoUserSpecifiedThenThrowErrorWidget.json')
        File file = new File(fileUrl.toURI())
        Map<String, Object> widget = slurper.parseText(file.text)

        when(service.utils.throwReadableException(any())).thenAnswer(
            {
                throw new RuntimeException(it.getArgument(0))
            }
        )

        Exception exception = assertThrows (RuntimeException, { service.createWidget(widget, null, null, false, true, true, null) })
        assertTrue(exception.getMessage().contains(LOGIN_MUST_NOT_BE_NULL_ERROR))
    }

    /**
     * проверка наличия ошибки на попытку добавить виджет на общий дашборд обычным пользователем
     */
    @Test
    void whenCreateWidgetThatIsNotForUserAndUserIsNotDashboardMasterThenThrowError()
    {
        def userUUID = 'testUUID2'
        URL fileUrl = getClass().getClassLoader().getResource('whenCreateWidgetThatIsNotForUserAndUserIsNotDashboardMasterThenThrowErrorWidget.json')
        File file = new File(fileUrl.toURI())
        def widget = slurper.parseText(file.text)

        Map<String, Object> userMap = [UUID     : 'testUUID2',
                                       title    : 'Test User',
                                       email    : 'testUser@mail.ru',
                                       login    : 'testtest',
                                       all_Group: []]
        registerObject(userMap)
        def user = userMap.withTraits(ISDtObject)

        when(service.utils.throwReadableException(any())).thenAnswer(
            {
                throw new RuntimeException(it.getArgument(0))
            }
        )

        when(service.dashboardUtils.getUserLocale(any())).thenReturn('ru')

        Exception exception = assertThrows (RuntimeException, { service.createWidget(widget, null, null, false, true, false, user) })
        assertTrue(exception.getMessage().contains(MUST_NOT_ADD_EDIT_WIDGET_ERROR))
    }

    /**
     * проверка наличия ошибки на попытку отредактировать виджет, установив неуникальное имя на дашборде
     */
    @Test
    void whenEditWidgetWithNotUniqueNameThenThrowError()
    {
        URL fileUrl = getClass().getClassLoader().getResource('whenEditWidgetWithNotUniqueNameThenThrowErrorWidget.json')
        File file = new File(fileUrl.toURI())
        def widget = slurper.parseText(file.text)
        DashboardSettingsClass dashboardSettings = new DashboardSettingsClass()
        def widgetObject = Jackson.fromJsonString(toJson(widget), Widget)
        dashboardSettings.widgets = [widgetObject]
        widgetObject.id = '123'
        dashboardSettings.widgets << widgetObject

        doReturn(dashboardSettings).when(service).getDashboardSetting('null_null')

        when(service.utils.throwReadableException(any())).thenAnswer(
            {
                throw new RuntimeException(it.getArgument(0))
            }
        )

        Exception exception = assertThrows (RuntimeException, { service.editWidget(widget, null, null, false, true, false, null) })
        assertTrue(exception.getMessage().contains(NOT_UNIQUE_WIDGET_NAME_ERROR))
    }
}

@Canonical
class UserGroup
{
    String code = 'sys_dashboardMaster'
}