//Автор: Tkacen-ko
//Дата создания: 03.06.2021
//Код: chartSettingsWizard
//Назначение:
/**
 *  Мастер настройки для ВП I итерация
 */

//Версия: 1.0
//Категория: скриптовый модуль
package ru.naumen.modules.chart

import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import groovy.transform.Canonical
import com.amazonaws.util.json.Jackson
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import ru.naumen.jsonschema.annotations.*
import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.server.script.api.ea.IAppContentInfo
import ru.naumen.metainfo.shared.ClassFqn

class ConstantSchemes
{
    final static String NAME_MECHANISM_SETTINGS = 'schemes'
    final static String EMBEDDED_APPLICATION_CODE = 'nauScheme'
    final static String ACTUAL_VERSION = 'actualVersion'
    final static String FIRST_PART_STRATEGY_CODE = 'schemesStrategy'
}

@MechanismSettings(name = 'schemes-initial')
@JsonSchemaMeta(
    title = 'Нажмите "Сохранить", чтобы продолжить',
    description = 'Нажмите "Сохранить", чтобы продолжить'
)

/**
 * Артефакт от портала, обязательно нужны какие-то инициирующие настройки
 */
class SchemesInitialSettings
{
    @JsonSchemaMeta(title = 'Инициирование настроек')
    SchemesInitialContainer container = new SchemesInitialContainer()
}

class SettingsWithTimeStampSchemes
{
    SchemesSettings settings
    Long timestamp
}

@Canonical
class MetaClassObjectSchemes
{
    String id = ''
    String caseId = ''

    @Override
    String toString()
    {
        if (!id)
        {
            return ''
        }
        if (!caseId)
        {
            return id
        }
        return "$id\$$caseId"
    }

    static MetaClassObjectSchemes fromString(String fqn)
    {
        Collection<String> fqnParts = fqn.tokenize('$')
        String id = fqnParts[0]
        String caseId = fqnParts.size() > 1 ? fqnParts[1] : ''
        return new MetaClassObjectSchemes(id, caseId)
    }
}

/**
 * Артефакт от портала первый уровень полей - вкладки, поэтому значащие поля, на втором уровне
 */
class SchemesInitialContainer
{
    @JsonSchemaMeta(title = 'Соглашаюсь настраивать инвентори', description = 'Обязательный шаг, без этого настройки не проинициализируются')
    Boolean enable
}

@MechanismSettings(name = ConstantSchemes.NAME_MECHANISM_SETTINGS)
class SchemesSettings
{
    @JsonSchemaMeta(title = 'Стратегии вывода объектов')
    Collection<AbstractSchemesCharacteristics> abstractSchemesCharacteristics = [new HierarchyCommunicationSettings(), new ObjecRelationshipsSettings()]
    @JsonSchemaMeta(title = 'Визуализация по умолчанию')
    Collection<DefaultVisualizationSchemes> defaultVisualizationSchemes = [new DefaultVisualizationSchemes()]
    @JsonSchemaMeta(title = 'Действия с объектами')
    Collection<ActionsWithObjects> actionsWithObjects = [new ActionsWithObjects()]
}

/**
 * Настройки для владки 'Стратегии вывода объектов'
 */
@JsonSchemaOneOf(key = 'typeSchemes', classes = [HierarchyCommunicationSettings,
    ObjecRelationshipsSettings])
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = 'typeSchemes',
    visible = true
)
@JsonSubTypes([
    @JsonSubTypes.Type(value =
    HierarchyCommunicationSettings, name = 'hierarchyCommunicationSettings' ),
    @JsonSubTypes.Type(value = ObjecRelationshipsSettings, name = 'objecRelationshipsSettings')])
abstract class AbstractSchemesCharacteristics
{
    @UiSchemaMeta(hidden = 'All')
    String typeSchemes = ''
}

@CustomProperty(name = 'typeSchemes', value = 'hierarchyCommunicationSettings')
@JsonSchemaMeta(title = 'Иерархия связи')
class HierarchyCommunicationSettings extends AbstractSchemesCharacteristics
{
    {
        typeSchemes = 'hierarchyCommunicationSettings'
    }
    @JsonSchemaMeta(title = ' ')
    Collection<ContentHierarchyCommunicationSettings> strategies = [new ContentHierarchyCommunicationSettings()]
}

@JsonSchemaMeta(requiredFields = ['hierarchyNameStrategy', 'hierarchyCodeStrategy', 'scriptText', 'metaClassObjects', 'pathCoordinateLongitude', 'pointA', 'pointB'], title = ' ')
class ContentHierarchyCommunicationSettings
{
    @JsonSchemaMeta(title = 'Название стратегии', nullable = false)
    String hierarchyNameStrategy = ''
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии', nullable = false)
    String hierarchyCodeStrategy = 'schemesStrategy'

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Скрипт возвращает объект для построения иерархической связи. Возможно использование переменной subject, которая содержит объект, на карточке которого размещен контент с приложением.', nullable = false)
    String scriptText = ''

    @UiSchemaMeta(widget = 'metaClass-select', includeNested = 'enable')
    @JsonSchemaMeta(title = 'Метакласс', nullable = false)
    MetaClassObjectSchemes metaClassObjects = new MetaClassObjectSchemes('', '')

    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Атрибут связи', nullable = false)
    String pathCoordinateLongitude = ""
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Точка А', nullable = false)
    String pointA = ""
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Точка Б', nullable = false)
    String pointB = ""

    @JsonSchemaMeta(title = 'Не выводить объекты без связи')
    Boolean displayingEndLineDots = false

    @JsonSchemaMeta(title = 'Характеристики для вывода на схеме')
    Collection<CharacteristicsOutputDiagram> characteristicsOutputDiagram = [new CharacteristicsOutputDiagram()]

    @UiSchemaMeta(widget = 'abstract-select', source = 'getContentTitle')
    @JsonSchemaMeta(title = 'Места использования')
    Collection<String> listStrategy = []
}

@CustomProperty(name = 'typeSchemes', value = 'objecRelationshipsSettings')
@JsonSchemaMeta(title = 'Связь выбранных объектов')
class ObjecRelationshipsSettings extends AbstractSchemesCharacteristics
{
    {
        typeSchemes = 'objecRelationshipsSettings'
    }
    @JsonSchemaMeta(title = ' ')
    Collection<ContentObjecRelationshipsSettings> strategies = [new ContentObjecRelationshipsSettings()]
}

@JsonSchemaMeta(requiredFields = ['objectNameStrategy', 'objectCodeStrategy', 'scriptText'], title = ' ')
class ContentObjecRelationshipsSettings
{
    @JsonSchemaMeta(title = 'Название стратегии', nullable = false)
    String objectNameStrategy = ''
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии', nullable = false)
    String objectCodeStrategy = 'schemesStrategy'

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Скрипт должен возвращать единый список объектов для построения связи.  Возможно использование переменной subject, которая содержит объект, на карточке которого размещен контент с приложением.', nullable = false)
    String scriptText = ''

    @JsonSchemaMeta(title = 'Правила связывания объектов схемы')
    Collection<RulesLinkingSchemaObjects> rulesLinkingSchemaObjects = [new RulesLinkingSchemaObjects()]

    @JsonSchemaMeta(title = 'Не выводить объекты без связи')
    Boolean displayingEndLineDots = false

    @JsonSchemaMeta(title = 'Характеристики для вывода на схеме')
    Collection<CharacteristicsOutputDiagram> characteristicsOutputDiagram = [new CharacteristicsOutputDiagram()]

    @UiSchemaMeta(widget = 'abstract-select', source = 'getContentTitle')
    @JsonSchemaMeta(title = 'Места использования')
    Collection<String> listStrategy = []
}

/**
 * Настройки для владки 'Визуализация по умолчанию'
 */
@JsonSchemaMeta(requiredFields = ['metaClassObjects'], title = ' ')
class DefaultVisualizationSchemes
{
    @UiSchemaMeta(widget = 'metaClass-select', includeNested = 'enable')
    @JsonSchemaMeta(title = 'Метакласс', nullable = false)
    MetaClassObjectSchemes metaClassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Главный текст')
    String mainText = ''
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Дополнительный текст')
    String additionalText = ''
    @UiSchemaMeta(widget = 'attrGroup-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Группа атрибутов')
    String attributeGroup = ''
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Иконка')
    String icon = ''
}

/**
 * Настройки для владки 'Действия с объектами'
 */
@JsonSchemaMeta(title = 'Действия с объектами')
class ActionsWithObjects
{
    @UiSchemaMeta(widget = 'metaClass-select', includeNested = 'enable')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaClassObjects = new MetaClassObjectSchemes('', '')

    @JsonSchemaMeta(title = 'Код формы редактирования')
    String codeEditingForm = ''
}

@JsonSchemaMeta(requiredFields = ['metaClassObjects', 'pathCoordinateLongitude'], title = ' ')
class RulesLinkingSchemaObjects
{
    @UiSchemaMeta(widget = 'metaClass-select', includeNested = 'enable')
    @JsonSchemaMeta(title = 'Метакласс', nullable = false)
    MetaClassObjectSchemes metaClassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Атрибут связи', nullable = false)
    String pathCoordinateLongitude = ""
}

@JsonSchemaMeta(requiredFields = ['metaClassObjects'], title = ' ')
class CharacteristicsOutputDiagram
{
    @UiSchemaMeta(widget = 'metaClass-select', includeNested = 'enable')
    @JsonSchemaMeta(title = 'Метакласс', nullable = false)
    MetaClassObjectSchemes metaClassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Главный текст')
    String mainText = ''
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Дополнительный текст')
    String additionalText = ''
    @UiSchemaMeta(widget = 'attrGroup-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Группа атрибутов')
    String attributeGroup = ''
    @UiSchemaMeta(widget = 'attr-tree-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Иконка')
    String icon = ''
}

@JsonSchemaMeta(requiredFields = ['metaClassObjects', 'pathCoordinateLongitude'], title = ' ')
class RulesLinkingObjects
{
    @UiSchemaMeta(widget = 'metaClass-select', includeNested = 'enable')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaClassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaClassObjects')
    @JsonSchemaMeta(title = 'Атрибут связи', nullable = false)
    String pathCoordinateLongitude = ""
}

/**
 * Настройки для владки 'Интерфейс'
 */
@JsonSchemaMeta(title = 'Доступ к API')
class APISettingsSchema
{
    @JsonSchemaMeta(title = 'Ключ API Яндекс Карты')
    String yandex = ''
    @JsonSchemaMeta(title = 'Ключ API Google Maps')
    String google = ''
}

Object getDefaultSettings(def initSettings)
{
    return new SchemesSettings()
}

Object getInitSettings()
{
    return new SchemesInitialSettings()
}

void saveSettings(SchemesSettings settings)
{
    String nameSpace = ConstantSchemes.NAME_MECHANISM_SETTINGS
    Integer actualVersion =
        api.keyValue.get(nameSpace, ConstantSchemes.ACTUAL_VERSION) as Integer ?: 0

    String settingsJson = Jackson.toJsonString(
        new SettingsWithTimeStampSchemes(
            settings: settings,
            timestamp: new Date().time
        )
    )

    actualVersion++
    api.keyValue.put(nameSpace, "settings$actualVersion", settingsJson)
    api.keyValue.put(nameSpace, ConstantSchemes.ACTUAL_VERSION, actualVersion.toString())
}

String getContents()
{
    Integer level = 0
    return Jackson.toJsonString(
        api.apps.listContents(ConstantSchemes.EMBEDDED_APPLICATION_CODE).collect {
            [title: it.contentTitle, uuid: it.contentUuid, level: level++, selectable: true]
        }
    )
}

String getAttributesChildMetaclass()
{
    SchemesSettings settings = new SettingsProviderSchemes().getSettings()
    HierarchyCommunicationSettings hierarchyCommunicationSettings =
        settings?.abstractSchemesCharacteristics.first() ?:
            [] as Collection<HierarchyCommunicationSettings>
    Collection listAttributes = []
    hierarchyCommunicationSettings.each {
        it.strategies.each { code ->
            if (code.metaClassObjects && code.pathCoordinateLongitude)
            {
                String nameMetaclass = "${ code.metaClassObjects.id }\$${ code.metaClassObjects.caseId }"
                String attributeName = code.pathCoordinateLongitude
                ClassFqn metaclass =
                    api.metainfo.getMetaClass(nameMetaclass)
                       .getAttribute(attributeName).type.relatedMetaClass
                api.metainfo.getMetaClass(metaclass)?.attributes.each {
                    listAttributes << [title     : it.title,
                                       uuid      : it.code,
                                       level     : 1,
                                       selectable: true]
                }
            }
        }
    }
    return Jackson.toJsonString(listAttributes)
}

String getContentTitle()
{
    Collection<IAppContentInfo> contentInfo =
        api.apps.listContents(ConstantSchemes.EMBEDDED_APPLICATION_CODE)
    Collection<LinkedHashMap> argum = []
    contentInfo.collect {
        String uuidData = "${ it.subjectFqn }_${ it.contentUuid }".toString()
        argum << [selectable: true, title: it.contentTitle, uuid:
            uuidData, level : 0, extra: uuidData]
    }
    return Jackson.toJsonString(argum)
}

@InjectApi
class SettingsProviderSchemes
{
    SchemesSettings getSettings()
    {
        String nameSpace = ConstantSchemes.NAME_MECHANISM_SETTINGS
        String actualVersion = api.keyValue.get(nameSpace, ConstantSchemes.ACTUAL_VERSION)
        if (actualVersion != null)
        {
            int actualVersionNumber = actualVersion as Integer

            if (actualVersionNumber > -1)
            {
                String settingsJson = api.keyValue.get(nameSpace, "settings$actualVersion")
                SettingsWithTimeStampSchemes settings =
                    Jackson.fromJsonString(settingsJson, SettingsWithTimeStampSchemes)
                return settings.settings
            }
        }
        return null
    }
}

void postSaveActions()
{
    SchemesSettings settings = new SettingsProviderSchemes().getSettings()

    HierarchyCommunicationSettings hierarchyCommunicationSettings =
        settings?.abstractSchemesCharacteristics.first() ?:
            [] as Collection<HierarchyCommunicationSettings>
    ObjecRelationshipsSettings objecRelationshipsSettings =
        settings?.abstractSchemesCharacteristics.last() ?:
            [] as Collection<ObjecRelationshipsSettings>

    hierarchyCommunicationSettings.each {
        it.strategies.each { code ->
            String codeStrategy = code?.hierarchyCodeStrategy
            String nameStrategy = code?.hierarchyNameStrategy
            if ((codeStrategy == ConstantSchemes.FIRST_PART_STRATEGY_CODE || codeStrategy == "") &&
                nameStrategy != "")
            {
                Integer hashCode = nameStrategy.hashCode() > 0 ? nameStrategy.hashCode() :
                    (nameStrategy.hashCode() * -1)
                code?.hierarchyCodeStrategy = ConstantSchemes.FIRST_PART_STRATEGY_CODE + hashCode
            }
        }
    }
    objecRelationshipsSettings.each {
        it.strategies.each { code ->
            String codeStrategy = code?.objectCodeStrategy
            String nameStrategy = code?.objectNameStrategy
            if ((codeStrategy == ConstantSchemes.FIRST_PART_STRATEGY_CODE || codeStrategy == "") &&
                nameStrategy != "")
            {
                Integer hashCode = nameStrategy.hashCode() > 0 ? nameStrategy.hashCode() :
                    (nameStrategy.hashCode() * -1)
                code?.objectCodeStrategy = ConstantSchemes.FIRST_PART_STRATEGY_CODE + hashCode
            }
        }
    }
    saveSettings(settings)
}
