/*! UTF-8 */
//Автор: nordclan
//Дата создания: 05.08.2021
//Код:
//Назначение:
/**
 * Модуль, описывающий текст ошибок, которые могут выдать другие модули
 */
//Версия: 4.13.1
//Категория: скриптовый модуль
package ru.naumen.modules.dashboards
import ru.naumen.core.server.script.api.injection.InjectApi

/**
 * Сервис работы с локализованными сообщениями
 */
@InjectApi
@Singleton(lazy = true, strict = false)
class MessageProvider
{
    public static final String WIDGET_NOT_FOUND_ERROR = 'widgetNotFound'
    public static final String NOT_SUPPORTED_DIAGRAM_TYPE_ERROR = 'notSupportedDiagramType'
    public static final String GROUP_TYPES_DONT_MATCH_ERROR = 'groupTypesDontMatch'
    public static final String NOT_SUPPORTED_DTINTERVAL_GROUP_TYPE_ERROR = 'notSupportedDTIntervalGroupType'
    public static final String NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP_ERROR = 'notSupportedAttributeTypeForCustomGroup'
    public static final String NO_DATA_FOR_CONDITION_ERROR = 'noDataForCondition'
    public static final String NOT_SUPPORTED_CONDITION_TYPE_ERROR = 'notSupportedConditionType'
    public static final String SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_ERROR = 'subjectTypeAndAttributeTypeNotEqual'
    public static final String NOT_SUPPORTED_GROUP_TYPE_ERROR = 'notSupportedGroupType'
    public static final String INVALID_RESULT_DATA_SET_ERROR = 'invalidResultDataSet'
    public static final String WRONG_GROUP_TYPES_IN_CALCULATION_ERROR = 'wrongGroupTypesInCalculation'
    public static final String REQUISITE_IS_NOT_SUPPORTED_ERROR = 'requisiteIsNotSupported'
    public static final String NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR = 'notSupportedAttributeType'
    public static final String NOT_SUPPORTED_FILTER_CONDITION_ERROR = 'notSupportedFilterCondition'
    public static final String SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_EROOR = 'subjectTypeAndAttributeTypeNotEqual'
    public static final String NOT_SUPPORTED_DATE_FORMAT_ERROR = 'notSupportedDateFormat'
    public static final String EMPTY_REQUEST_DATA_ERROR = 'emptyRequestData'
    public static final String EMPTY_AGGREGATION_ERROR = 'emptyAggregation'
    public static final String EMPTY_SOURCE_ERROR = 'emptySource'
    public static final String INVALID_SOURCE_ERROR = 'invalidSource'
    public static final String ATTRIBUTE_IS_NULL_ERROR = 'attributeIsNull'
    public static final String NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE_ERROR = 'notSuitableAggregationAndAttributeType'
    public static final String NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR = 'notSuitableGroupAndAttributeType'
    public static final String NOT_SUPPORTED_AGGREGATION_TYPE_ERROR ='notSupportedAggregationType'
    public static final String NOT_SUPPORTED_SORTING_TYPE_ERROR = 'notSupportedSortingType'
    public static final String EMPTY_DASHBOARD_CODE_ERROR = 'emptyDashboardCode'
    public static final String USER_EMAIL_IS_NULL_OR_EMPTY_ERROR = 'userEmailIsNullOrEmpty'
    public static final String GROUP_SETTINGS_NULL_ERROR = 'groupSettingsNull'
    public static final String COLORS_NOT_CONTAINS_IN_DASHBOARD_ERROR = 'colorsNotContainsInDashboard'
    public static final String FILTER_NAME_NOT_UNIQUE_ERROR = 'filterNameNotUnique'
    public static final String FILTER_ALREADY_EXISTS_ERROR = 'filterAlreadyExists'
    public static final String  FILTER_MUST_NOT_BE_REMOVED_ERROR = 'filterMustNotBeRemoved'
    public static final String REMOVE_FILTER_FAILED_ERROR = 'removeFilterFailed'
    public static final String LOGIN_MUST_NOT_BE_NULL_ERROR = 'loginMustNotBeNull'
    public static final String EMPTY_LAYOUT_SETTINGS_ERROR = 'emptyLayoutSettings'
    public static final String SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD_ERROR = 'superUserCantResetPersonalDashboard'
    public static final String WIDGET_SETTINGS_ARE_EMPTY_ERROR = 'widgetSettingsAreEmpty'
    public static final String PERSONAL_DASHBOARD_NOT_FOUND_ERROR = 'personalDashboardNotFound'
    public static final String DASHBOARD_SETTINGS_NOT_SAVED_ERROR = 'dashboardSettingsNotSaved'
    public static final String GROUP_NOT_CONTAINS_IN_DASHBOARD_ERROR = 'groupNotContainsInDashboard'
    public static final String WIDGET_NOT_SAVED_ERROR = 'widgetNotSaved'
    public static final String NO_RIGHTS_TO_REMOVE_WIDGET_ERROR = 'noRightsToRemoveWidget'
    public static final String WRONG_ARGUMENT_ERROR = 'wrongArgument'
    public static final String WIDGET_NOT_REMOVED_ERROR = 'widgetNotRemoved'
    public static final String DASHBOARD_NOT_FOUND_ERROR = 'dashboardNotFound'
    public static final String MUST_NOT_ADD_EDIT_WIDGET_ERROR = 'mustNotAddEditWidget'
    public static final String PERSONAL_SETTINGS_DISABLED_ERROR = 'personalSettingsDisabled'
    public static final String NOT_UNIQUE_WIDGET_NAME_ERROR = 'notUniqueWidgetName'

    /**
     * Получение локализованного сообщения
     *
     * @param bindings мапа биндингов в желаемом сообщении
     * @param messageCode код сообщения
     * @param locale необходимая локаль сообщения
     *
     * @return локализованное сообщение
     */
    String getMessage(Map bindings = [:], String messageCode, String locale)
    {
        def message = MESSAGES[messageCode][locale]
        return message ? utils.processTemplate(message, bindings) : null
    }

    /**
     * Получение строковой константы определенной локали
     *
     * @param code код константы
     * @param locale локаль
     *
     * @return локализованная строковая константа
     */
    String getConstant(String code, String locale)
    {
        return MESSAGES[code][locale]
    }

    final Map <String, Map<String, String>> MESSAGES = [
        (WIDGET_NOT_FOUND_ERROR): [
            ru: 'Виджет не найден',
            en: 'Widget is not found',
            de: 'Das Widget wurde nicht gefunden',
            pl: 'Nie znaleziono widżetu'
        ],
        (NOT_SUPPORTED_DIAGRAM_TYPE_ERROR): [
            ru: 'Неподдерживаемый тип диаграммы: ${diagramType}',
            en: 'Not supported diagram type: ${diagramType}',
            de: 'Nicht unterstützter Diagrammtyp: ${diagramType}',
            pl: 'Nieobsługiwany typ wykresu: ${diagramType}'
        ],
        (GROUP_TYPES_DONT_MATCH_ERROR): [
            ru: 'Не соответствуют типы группировок: ${groupTypes}',
            en: 'Group types do not match: ${groupTypes}',
            de: 'Gruppentypen stimmen nicht überein: ${groupTypes}',
            pl: 'Typy grup nie pasują:  ${groupTypes}'
        ],
        (NOT_SUPPORTED_DTINTERVAL_GROUP_TYPE_ERROR): [
            ru: 'Тип группировки не поддерживается в атрибуте временной интервал: ${groupType}',
            en: 'Group type is not supported  in dateTimeInterval attribute: ${groupType}',
            de: 'Der Gruppierungstyp wird im Zeitintervallattribut nicht unterstützt: ${groupType}',
            pl: 'Typ grupowania nie jest obsługiwany w atrybucie przedziału czasu: ${groupType}'
        ],
        (NOT_SUPPORTED_ATTRIBUTE_TYPE_FOR_CUSTOM_GROUP_ERROR): [
            ru: 'Тип атрибута ${type} не поддерживается для формирования кастомной группировки',
            en: 'The ${type} attribute is not supported to form a custom grouping',
            de: 'Der Attributtyp ${type} wird zum Bilden einer benutzerdefinierten Gruppierung nicht unterstützt',
            pl: 'Typ atrybutu ${type} nie jest obsługiwany przy tworzeniu niestandardowego grupowania'
        ],
        (NO_DATA_FOR_CONDITION_ERROR): [
            ru: "Данные о группировке отстутствуют",
            en: "Condition data is null or empty",
            de: "Keine Daten zur Gruppierung",
            pl: "Brak danych o grupowaniu"
        ],
        (NOT_SUPPORTED_CONDITION_TYPE_ERROR): [
            ru: 'Неподдерживаемый тип условия: ${conditionType}',
            en: 'Condition type is not supported: ${conditionType}',
            de: 'Nicht unterstützte Konditionsart: ${conditionType}',
            pl: 'Nieobsługiwany typ warunku: ${conditionType}'
        ],
        (SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_ERROR): [
            ru: 'Тип объекта ${subjectType} и тип атрибута не идентичны ${property}',
            en: 'Subject type: ${subjectType} does not match with attribute type: ${property}',
            de: 'Der Objekttyp ${subjectType} und der Attributtyp ${property} sind nicht identisch mit',
            pl: 'Typ obiektu ${subjectType} i typ atrybutu ${property} nie są identyczn'
        ],
        (NOT_SUPPORTED_GROUP_TYPE_ERROR): [
            ru: 'Неподдерживаемый тип группировки: ${type}',
            en: 'Group type is not supported: ${type}',
            de: 'Nicht unterstützter Gruppierungstyp: ${type}',
            pl: 'Nieobsługiwany typ grupowania: ${type}'
        ],
        (INVALID_RESULT_DATA_SET_ERROR): [
            ru: 'Неверный формат результирующего набора данных',
            en: 'Invalid format result data set',
            de: 'Ungültiges Ergebnisdatensatzformat',
            pl: 'Nieprawidłowy format zbioru danych wyników'
        ],
        (WRONG_GROUP_TYPES_IN_CALCULATION_ERROR): [
            ru: 'Типы группировок атрибутов, участвующих в вычислении, не совпадают!',
            en: 'The types of attribute groupings involved in the calculation are not the same!',
            de: 'Die Arten der Attributgruppierungen, die an der Berechnung beteiligt sind, sind nicht dieselben!',
            pl: 'Rodzaje grup atrybutów biorących udział w obliczeniach nie są takie same!'
        ],
        (REQUISITE_IS_NOT_SUPPORTED_ERROR): [
            ru: 'Тип ревкизита не поддерживается: ${nodeType}',
            en: 'Requisite type is nNot supported: ${nodeType}',
            de: 'Der Revkizit-Typ wird nicht unterstützt: ${nodeType}',
            pl: 'Typ Revkizit nie jest obsługiwany: ${nodeType}'
        ],
        (NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR): [
            ru: 'Неподдерживаемый тип атрибута: ${attributeType}',
            en: 'Not supported type: ${attributeType}',
            de: 'Nicht unterstützter Attributtyp: ${attributeType}',
            pl: 'Nieobsługiwany typ atrybutu: ${attributeType}'
        ],
        (NOT_SUPPORTED_FILTER_CONDITION_ERROR): [
            ru: 'Неподдерживаемый тип условия: ${condition}',
            en: 'Condition type is not supported: ${condition}',
            de: 'Nicht unterstützte Konditionsart: ${condition}',
            pl: 'Nieobsługiwany typ warunku: ${condition}'
        ],
        (SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_EROOR): [
            ru: 'Тип объекта ${subjectType} и тип атрибута не идентичны ${attributeType}',
            en: 'Subject type ${subjectType} does not match with attribute type: ${attributeType}',
            de: 'Der Objekttyp ${subjectType} und der Attributtyp ${attributeType} sind nicht identisch mit',
            pl: '"Typ obiektu ${subjectType} i typ atrybutu ${attributeType} nie są identyczne'
        ],
        (NOT_SUPPORTED_DATE_FORMAT_ERROR): [
            ru: 'Неподдерживаемый формат даты: ${format}',
            en: 'Not supported date format: ${format}',
            de: 'Nicht unterstütztes Datumsformat: ${format}',
            pl: 'Nieobsługiwany format daty: ${format}'
        ],
        (EMPTY_REQUEST_DATA_ERROR): [
            ru: 'Данных для запроса нет',
            en: 'Empty request data',
            de: 'Leere Aggregation',
            pl: 'Puste dane żądania'
        ],
        (EMPTY_AGGREGATION_ERROR): [
            ru: 'Пустая агрегация',
            en: 'Empty aggregation',
            de: 'Das Widget wurde nicht gefunden',
            pl: 'Pusta agregacja'
        ],
        (ATTRIBUTE_IS_NULL_ERROR): [
            ru: 'Атрибут не выбран',
            en: 'Attribute is not selected',
            de: 'Attribut nicht ausgewählt',
            pl: 'Atrybut nie został wybrany'
        ],
        (NOT_SUITABLE_AGGREGATION_AND_ATTRIBUTE_TYPE_ERROR): [
            ru: 'Тип агрегации: ${type} и тип атрибута: ${attributeType} не совместимы',
            en: 'Not suitable aggergation type: ${type} and attribute type: ${attributeType}',
            de: 'Aggregationstyp: ${type} und Attributtyp: ${attributeType} sind nicht kompatibel',
            pl: 'Typ agregacji: ${type} i typ atrybutu: ${attributeType} nie są zgodne'
        ],
        (NOT_SUITABLE_GROUP_AND_ATTRIBUTE_TYPE_ERROR): [
            ru: 'Тип группировки: ${type} и тип атрибута: ${attributeType} не совместимы',
            en: 'Not suitable group type: ${type} and attribute type: ${attributeType}',
            de: 'Gruppierungstyp: ${type} und Attributtyp: ${attributeType} sind nicht kompatibel',
            pl: 'Typ grupowania: ${type} i typ atrybutu: ${attributeType} nie są zgodne'
        ],
        (NOT_SUPPORTED_AGGREGATION_TYPE_ERROR): [
            ru: 'Неподдерживаемый тип агрегации: ${aggregationType}',
            en: 'Not supported aggregation type: ${aggregationType}',
            de: 'Nicht unterstützter Aggregationstyp: ${aggregationType}',
            pl: 'Nieobsługiwany typ agregacji: ${aggregationType}'
        ],
        (NOT_SUPPORTED_SORTING_TYPE_ERROR): [
            ru: 'Неподдерживаемый тип сортировки: ${type}',
            en: 'Not supported sorting type: ${type}',
            de: 'Nicht unterstützter Sortiertyp: ${type}',
            pl: 'Nieobsługiwany typ sortowania: ${type}'
        ],
        (EMPTY_DASHBOARD_CODE_ERROR): [
            ru: "Для получения списка виджетов заполните корректно атрибут Компании dashboardCode",
            en: "Fill in the correct Company attribute dashboardCode to get a list of widgets",
            de: "Um eine Liste der Widgets zu erhalten, geben Sie das richtige Unternehmensattribut dashboardCode ein",
            pl: "Aby uzyskać listę widżetów, wprowadź poprawny kod dashboardCode atrybutu firmy"
        ],
        (USER_EMAIL_IS_NULL_OR_EMPTY_ERROR): [
            ru: 'Электронный адрес пользователя пустой!',
            en: 'User email is null or empty!',
            de: 'Benutzer-E-Mail ist null oder leer!',
            pl: 'Adres e-mail użytkownika jest pusty lub nie ma wartości!'
        ],
        (GROUP_SETTINGS_NULL_ERROR): [
            ru :'Настройки кастомной группировки не заполнены.',
            en :'Custom grouping settings are empty.',
            de :'Benutzerdefinierte Gruppierungseinstellungen sind leer.',
            pl :'Niestandardowe ustawienia grupowania są puste.'
        ],
        (COLORS_NOT_CONTAINS_IN_DASHBOARD_ERROR): [
            ru: 'Данные настройки цветов не найдены среди настроек цветов дашборда.',
            en: 'Color settings data not found among dashboard color settings.',
            de: 'Farbeinstellungsdaten wurden in den Dashboard-Farbeinstellungen nicht gefunden.',
            pl: 'Nie znaleziono danych ustawień kolorów wśród ustawień kolorów pulpitu nawigacyjnego.'
        ],
        (FILTER_NAME_NOT_UNIQUE_ERROR): [
            ru: 'Фильтр с названием ${label} не может быть сохранен. Название фильтра должно быть уникально.',
            en: 'The filter named ${label} could not be saved. The filter name must be unique.',
            de: 'Der Filter mit dem Namen ${label} konnte nicht gespeichert werden. Der Filtername muss eindeutig sein.',
            pl: 'Nie można zapisać filtra o nazwie ${label}. Nazwa filtra musi być unikalna.'
        ],
        (FILTER_ALREADY_EXISTS_ERROR): [
            ru: 'Фильтр с текущими параметрами уже существует: ${label}.',
            en: 'A filter with the current parameters already exists: ${label}.',
            de: 'Ein Filter mit den aktuellen Parametern existiert bereits: ${label}.',
            pl: 'Filtr z bieżącymi parametrami już istnieje: ${label}.'
        ],
        (FILTER_MUST_NOT_BE_REMOVED_ERROR): [
            ru: 'Удаление данного сохраненного фильтра невозможно, т.к. он применен в других виджетах.',
            en: 'It is not possible to delete this saved filter, because it has been applied in other widgets.',
            de: 'Dieser gespeicherte Filter kann nicht gelöscht werden, weil es wurde in anderen Widgets angewendet.',
            pl: 'Nie można usunąć tego zapisanego filtra, ponieważ został zastosowany w innych widżetach.'
        ],
        (REMOVE_FILTER_FAILED_ERROR): [
            ru: 'Удаление фильтра ${sourceFilterUUID} не прошло.',
            en: 'Removing the filter ${sourceFilterUUID} failed.',
            de: 'Das Entfernen des Filters ${sourceFilterUUID} ist fehlgeschlagen.',
            pl: 'Usunięcie filtra ${sourceFilterUUID} nie powiodło się.'
        ],
        (LOGIN_MUST_NOT_BE_NULL_ERROR): [
            ru: 'Логин или данные о пользователе не должны быть пустыми.',
            en: 'Login or user must not be null',
            de: 'Login- oder Benutzerdaten sollten nicht leer sein.',
            pl: 'Dane logowania lub użytkownika nie powinny być puste.'
        ],
        (EMPTY_LAYOUT_SETTINGS_ERROR): [
            ru: 'Настройки расположений пустые в дашборде: ${dashboardKey}',
            en: 'Empty layout settings from dashboard: ${dashboardKey}',
            de: 'Leere Layouteinstellungen aus dem Dashboard: ${dashboardKey}',
            pl: 'Puste ustawienia układu z pulpitu nawigacyjnego: ${dashboardKey}'
        ],
        (SUPER_USER_CANT_RESET_PERSONAL_DASHBOARD_ERROR): [
            ru: 'Суперпользователь не может сбросить настройки личного дашборда!',
            en: 'Super-user can\'t reset dashboard settings!',
            de: 'Super-User kann Dashboard-Einstellungen nicht zurücksetzen!',
            pl: 'Superużytkownik nie może zresetować ustawień pulpitu nawigacyjnego!'
        ],
        (WIDGET_SETTINGS_ARE_EMPTY_ERROR): [
            ru: 'Настройки виджета пустые!',
            en: 'Widget settings are empty!',
            de: 'Widget-Einstellungen sind leer!',
            pl: 'Ustawienia widżetu są puste!'
        ],
        (PERSONAL_DASHBOARD_NOT_FOUND_ERROR): [
            ru: 'Поле логин не заполнено, личный дашборд не найдён.',
            en: 'The "Login" field is not filled in, the personal dashboard is not found.',
            de: 'Das Feld "Login" ist nicht ausgefüllt, das persönliche Dashboard wurde nicht gefunden.',
            pl: 'Pole „Login” nie jest wypełnione, nie znaleziono osobistego pulpitu nawigacyjnego.'
        ],
        (DASHBOARD_SETTINGS_NOT_SAVED_ERROR): [
            ru: 'Настройки дашборда не сохранены!',
            en: 'Dashboard settings not saved!',
            de: 'Dashboard-Einstellungen nicht gespeichert!',
            pl: 'Ustawienia panelu nie zostały zapisane!'
        ],
        (GROUP_NOT_CONTAINS_IN_DASHBOARD_ERROR): [
            ru: 'Данная группировка не найдена среди группировок дашборда.',
            en: 'This grouping was not found among the groupings of the dashboard.',
            de: 'Diese Gruppierung wurde unter den Gruppierungen auf dem Dashboard nicht gefunden.',
            pl: 'Ta grupa nie została znaleziona wśród grup na pulpicie nawigacyjnym.'
        ],
        (WIDGET_NOT_SAVED_ERROR): [
            ru: 'Виджет ${widgetKey} не сохранен на дашборде ${dashboardKey}.',
            en: 'Widget ${widgetKey} not saved in dashboard ${dashboardKey}.',
            de: 'Widget ${widgetKey} nicht im Dashboard ${dashboardKey} gespeichert.',
            pl: 'Widżet ${widgetKey} nie został zapisany w panelu ${dashboardKey}'
        ],
        (NO_RIGHTS_TO_REMOVE_WIDGET_ERROR): [
            ru: 'У Вас нет прав на удаление виджета.',
            en: 'You do not have permission to delete the widget.',
            de: 'Sie sind nicht berechtigt, das Widget zu löschen.',
            pl: 'Nie masz uprawnień do usunięcia widżetu.'
        ],
        (WRONG_ARGUMENT_ERROR): [
            ru: 'Неправильный тип условия для проверки.',
            en: 'Wrong condition type to check.',
            de: 'Falsche Bedingungsart zu prüfen.',
            pl: 'Nieprawidłowy typ warunku do sprawdzenia.'
        ],
        (WIDGET_NOT_REMOVED_ERROR): [
            ru: 'Виджет ${$widgetKey} не удален с дашборда: ${dashboardKey}!',
            en: 'Widget ${$widgetKey} not removed from dashboard: ${dashboardKey}!',
            de: 'Widget ${$widgetKey} nicht aus Dashboard entfernt: ${dashboardKey}!',
            pl: 'Widget ${$widgetKey} nie został usunięty z pulpitu nawigacyjnego: ${dashboardKey}!'
        ],
        (DASHBOARD_NOT_FOUND_ERROR): [
            ru: 'Дашборд: ${dashboardKey} не найден!',
            en: 'Dashboard: ${dashboardKey} not found!',
            de: 'Dashboard: ${dashboardKey} nicht gefunden!',
            pl: 'Pulpit nawigacyjny: nie znaleziono klucza ${dashboardKey}!'
        ],
        (MUST_NOT_ADD_EDIT_WIDGET_ERROR): [
            ru: 'Роль пользователя не мастер дашбордов,${messageError} обычный виджет нельзя',
            en: 'User is not a dashboard master, ${messageError} default widget is not possible',
            de: 'Die Rolle des Benutzers ist kein Dashboard-Master, Sie können kein reguläres Widget ${messageError}',
            pl: 'Rola użytkownika nie jest kreatorem pulpitu nawigacyjnego, nie można ${messageError} zwykłego widżetu'
        ],
        (PERSONAL_SETTINGS_DISABLED_ERROR): [
            ru: 'У Вас нет прав на редактирование дашборда.',
            en: 'You do not have permission to edit the dashboard.',
            de: 'Sie sind nicht berechtigt, das Dashboard zu bearbeiten.',
            pl: 'Nie masz uprawnień do edytowania panelu.'
        ],
        (NOT_UNIQUE_WIDGET_NAME_ERROR): [
            ru: 'Виджет с названием ${name} не может быть сохранен. Название виджета должно быть уникально в рамках дашборда.',
            en: 'The widget named ${name} could not be saved. The name of the widget must be unique within the dashboard.',
            de: 'Das Widget namens ${name} konnte nicht gespeichert werden. Der Name des Widgets muss innerhalb des Dashboards eindeutig sein.',
            pl: 'Nie można zapisać widżetu o nazwie ${name}. Nazwa widżetu musi być unikalna w panelu.'
        ],
    ]
}

return
