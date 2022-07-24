//Автор: Tkacen-ko
//Дата создания: 03.06.2021
//Код: mapSchemes
//Назначение:
/**
 *
 *  Мастер настройки для ВП I итерация
 *
 */
//Версия: 1.0
package ru.naumen.modules.inventory

import com.amazonaws.util.json.Jackson
import groovy.json.JsonOutput
import ru.naumen.jsonschema.annotations.*
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import ru.naumen.core.server.script.api.injection.InjectApi
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.ea.IAppContentInfo
import groovy.transform.Canonical

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
        def fqnParts = fqn.tokenize('$')
        def id = fqnParts[0]
        def caseId = fqnParts.size() > 1 ? fqnParts[1] : ''
        return new MetaClassObjectSchemes(id, caseId)
    }
}

/**
 * Артефакт от портала первый уровень полей - вкладки, поэто значащие поля, на втором уровне
 */
class SchemesInitialContainer
{
    @JsonSchemaMeta(title = 'Соглашаюсь настраивать инвентори', description = 'Обязательный шаг, без этого настройки не проинициализируются')
    Boolean enable
}

@MechanismSettings(name = 'schemes')
class SchemesSettings
{
    @JsonSchemaMeta(title = 'Стратегии вывода объектов')
    Collection<AbstractSchemesCharacteristics> abstractSchemesCharacteristics = [new HierarchyCommunicationSettings(), new ObjecRelationshipsSettings()]
    @JsonSchemaMeta(title = 'Визуализация по умолчанию')
    Collection<DefaultVisualizationSchemes> defaultVisualizationSchemes = [new DefaultVisualizationSchemes()]
    @UiSchemaMeta(hidden = 'All')
    BugFixSchema commonSettings = new BugFixSchema()
}

@JsonSchemaMeta(title = ' ')
class BugFixSchema
{
    @UiSchemaMeta(hidden = 'All')
    String scheme = 'bugfixschema'
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
        HierarchyCommunicationSettings, name = 'hierarchyCommunicationSettings'),
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
    Collection<СontentHierarchyCommunicationSettings> strategies = [new СontentHierarchyCommunicationSettings()]
}

@JsonSchemaMeta(requiredFields = ['hierarchyNameStrategy', 'hierarchyCodeStrategy'], title = ' ')
class СontentHierarchyCommunicationSettings
{
    @JsonSchemaMeta(title = 'Название стратегии')
    String hierarchyNameStrategy = ''
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии')
    String hierarchyCodeStrategy = 'schemesStrategy'

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Применяется только при стратегии "Скрипт"')
    String scriptText = ''

    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaclassObjects = new MetaClassObjectSchemes('', '')

    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Атрибут связи')
    String pathCoordinatLongitud = ""
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Точка А')
    String pointA = ""
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Точка Б')
    String pointB = ""

    @JsonSchemaMeta(title = 'Групировать')
    Boolean group = null

    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Атрибут групировки')
    String groupingAttribute = ""

    @JsonSchemaMeta(title = 'Не выводить объекты без связи')
    Boolean displayingEndLineDots = null

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
    Collection<СontentObjecRelationshipsSettings> strategies = [new СontentObjecRelationshipsSettings()]
}

@JsonSchemaMeta(requiredFields = ['objectNameStrategy', 'objectCodeStrategy', 'scriptText'], title = ' ')
class СontentObjecRelationshipsSettings
{
    @JsonSchemaMeta(title = 'Название стратегии')
    String objectNameStrategy = ''
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии')
    String objectCodeStrategy = 'schemesStrategy'

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Применяется только при стратегии "Скрипт"')
    String scriptText = ''

    @JsonSchemaMeta(title = 'Правила связывания объектов схемы')
    Collection<RulesLinkingSchemaObjects> rulesLinkingSchemaObjects = [new RulesLinkingSchemaObjects()]

    @JsonSchemaMeta(title = 'Не выводить объекты без связи')
    Boolean displayingEndLineDots = null

    @JsonSchemaMeta(title = 'Характеристики для вывода на схеме')
    Collection<CharacteristicsOutputDiagram> characteristicsOutputDiagram = [new CharacteristicsOutputDiagram()]

    @UiSchemaMeta(widget = 'abstract-select', source = 'getContentTitle')
    @JsonSchemaMeta(title = 'Места использования')
    Collection<String> listStrategy = []
}

/**
 * Настройки для владки 'Визуализация по умолчанию'
 */
@JsonSchemaMeta(title = ' ')
class DefaultVisualizationSchemes
{
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaclassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Главный текст')
    String mainText = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Дополнительный текст')
    String additionalText = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Група атрибутов')
    String attributeGroup = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Иконка')
    String icon = ''
}

@JsonSchemaMeta(title = ' ')
class RulesLinkingSchemaObjects
{
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaclassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Атрибут связи')
    String pathCoordinatLongitud = ""
    @JsonSchemaMeta(title = 'Групировать объекты выбранного метакласса')
    Boolean groupObjectsSelectedMetaclass = null
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Атрибут групировки')
    String pointB = ""
}

@JsonSchemaMeta(title = ' ')
class CharacteristicsOutputDiagram
{
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaclassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Главный текст')
    String mainText = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Дополнительный текст')
    String additionalText = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Група атрибутов')
    String attributeGroup = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Иконка')
    String icon = ''
}

@JsonSchemaMeta(requiredFields = ['metaclassObjects'], title = ' ')
class RulesLinkingObjects
{
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObjectSchemes metaclassObjects = new MetaClassObjectSchemes('', '')
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Атрибут связи')
    String pathCoordinatLongitud = ""
    @JsonSchemaMeta(title = 'Групировать объекты выбранного метакласса')
    Boolean groupObjectsSelectedMetaclass = null
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Атрибут групировки')
    String pointB = ""
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

@InjectApi
class SettingsProvider
{
    SchemesSettings getSettings()
    {
        String nameSpace = 'schemes'
        String actualVersion = api.keyValue.get(nameSpace, 'actualVersion')
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

void saveSettings(SchemesSettings settings)
{
    def nameSpace = 'schemes'
    Integer actualVersion = api.keyValue.get(nameSpace, 'actualVersion') as Integer ?: 0

    def settingsJson = Jackson.toJsonString(
        new SettingsWithTimeStampSchemes(
            settings: settings,
            timestamp: new Date().time
        )
    )
    actualVersion++
    api.keyValue.put(nameSpace, "settings$actualVersion", settingsJson)
    api.keyValue.put(nameSpace, 'actualVersion', actualVersion.toString())
}

String getContents()
{
    def level = 0
    return JsonOutput.toJson(
        api.apps.listContents('testSvg').collect {
            [title: it.contentTitle, uuid: it.contentUuid, level: level++, selectable: true]
        }
    )
}

String getContentTitle()
{
    Collection<IAppContentInfo> contentInfo = api.apps.listContents('testSvg')
    def argum = []
    contentInfo.collect {
        argum << [selectable: true, title: it.contentTitle, uuid:
            it.tabUuid, level: 0, extra: 'тест']
    }
    return JsonOutput.toJson(argum)
}

@InjectApi
class SettingsProviderSchemes
{
    SchemesSettings getSettings()
    {
        String nameSpace = 'schemes'
        String actualVersion = api.keyValue.get(nameSpace, 'actualVersion')
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
            def codeStrategy = code?.hierarchyCodeStrategy
            def nameStrategy = code?.hierarchyNameStrategy
            if ((codeStrategy == "schemesStrategy" || codeStrategy == "") && nameStrategy != "")
            {
                def hashCode = nameStrategy.hashCode() > 0 ? nameStrategy.hashCode() :
                    (nameStrategy.hashCode() * -1)
                code?.hierarchyCodeStrategy = "schemesStrategy" + hashCode
            }
        }
    }
    objecRelationshipsSettings.each {
        it.strategies.each { code ->
            def codeStrategy = code?.objectCodeStrategy
            def nameStrategy = code?.objectNameStrategy
            if ((codeStrategy == "schemesStrategy" || codeStrategy == "") && nameStrategy != "")
            {
                def hashCode = nameStrategy.hashCode() > 0 ? nameStrategy.hashCode() :
                    (nameStrategy.hashCode() * -1)
                code?.objectCodeStrategy = "schemesStrategy" + hashCode
            }
        }
    }
    saveSettings(settings)
}

