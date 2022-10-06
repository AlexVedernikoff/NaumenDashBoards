//Автор: Tkacen-ko
//Дата создания: 03.06.2021
//Код: mapSchemes
//Назначение:
/**
 *  Мастер настройки для ВП I итерация
 */

//Версия: 1.0
//Категория: скриптовый модуль
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
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import ru.naumen.metainfo.shared.ClassFqn

@MechanismSettings(name = 'schemes-initial')
@JsonSchemaMeta(
    title = 'Нажмите "Сохранить", чтобы продолжить',
    description = 'Нажмите "Сохранить", чтобы продолжить'
)

class ConstantSchemes
{
    public static final String NAME_MECHANISM_SETTINGS = 'schemes'
    public static final String EMBEDDED_APPLICATION_CODE = 'testScheme'
    public static final String ACTUAL_VERSION = 'actualVersion'
    public static final String FIRST_PART_STRATEGY_CODE = 'schemesStrategy'
}

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
        return new MetaClassObject(id, caseId)
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

@JsonSchemaMeta(requiredFields = ['hierarchyNameStrategy', 'hierarchyCodeStrategy'], title = ' ')
class ContentHierarchyCommunicationSettings
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
    @UiSchemaMeta(widget = 'abstract-select', source = 'getAttributesChildMetaclass')
    @JsonSchemaMeta(title = 'Точка А')
    String pointA = ""
    @UiSchemaMeta(widget = 'abstract-select', source = 'getAttributesChildMetaclass')
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
    Collection<ContentObjecRelationshipsSettings> strategies = [new ContentObjecRelationshipsSettings()]
}

@JsonSchemaMeta(requiredFields = ['objectNameStrategy', 'objectCodeStrategy', 'scriptText'], title = ' ')
class ContentObjecRelationshipsSettings
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
    @UiSchemaMeta(widget = 'attrGroup-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Группа атрибутов')
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
    @UiSchemaMeta(widget = 'attrGroup-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Группа атрибутов')
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
            if (code.metaclassObjects && code.pathCoordinatLongitud)
            {
                String nameMetaclass = "${ code.metaclassObjects.id }\$${ code.metaclassObjects.caseId }"
                String attributeName = code.pathCoordinatLongitud
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
        argum << [selectable : true, title: it.contentTitle, uuid:
            it.tabUuid, level: 0, extra: 'тест']
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
