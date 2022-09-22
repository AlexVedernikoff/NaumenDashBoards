//Автор: Tkacen-ko
//Дата создания: 18.05.2021
//Код: mapRest
//Назначение:
/**
 *
 * Мастер настройки для ВП Карта Inventory
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
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import groovy.json.JsonSlurper

class ConstantMap
{
    public static final String NAME_MECHANISM_SETTINGS = 'map'
    public static final String EMBEDDED_APPLICATION_CODE = 'testSvg'
    public static final String ACTUAL_VERSION = 'actualVersion'
    public static final String FIRST_PART_STRATEGY_CODE = 'mapStrategy'
}

@MechanismSettings(name = 'map-initial')
@JsonSchemaMeta(
    title = 'Нажмите "Сохранить", чтобы продолжить',
    description = 'Нажмите "Сохранить", чтобы продолжить'
)
class MapInitialSettings
{
    @JsonSchemaMeta(title = 'Инициирование настроек')
    PointInventoryInitialContainer container = new PointInventoryInitialContainer()
}

@Canonical
class MetaClassObject
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

    static MetaClassObject fromString(String fqn)
    {
        Collection<String> fqnParts = fqn.tokenize('$')
        String id = fqnParts[0]
        String caseId = fqnParts.size() > 1 ? fqnParts[1] : ''
        return new MetaClassObject(id, caseId)
    }
}

@InheritConstructors
class MapSettingsWithTimeStamp
{
    MapSettings settings
    Long timestamp
}

class PointInventoryInitialContainer
{
    @JsonSchemaMeta(title = 'Соглашаюсь настраивать инвентори', description = 'Обязательный шаг, без этого настройки не проинициализируются')
    Boolean enable
}

@MechanismSettings(name = ConstantMap.NAME_MECHANISM_SETTINGS)
class MapSettings
{
    @JsonSchemaMeta(title = 'Стратегии вывода объектов')
    Collection<AbstractPointCharacteristics> abstractPointCharacteristics = [new PointSettings(), new LinesSettings()]
    @JsonSchemaMeta(title = 'Визуализация по умолчанию')
    DefaultVisualization defVisualization = new DefaultVisualization()
    @JsonSchemaMeta(title = 'API')
    APISettings apiSettings = new APISettings()
}

/**
 * Абстрактный класс необходимый для отображения подвложенностей 'Точки' и 'Линии'
 */
@JsonSchemaOneOf(key = 'typeMap', classes = [PointSettings, LinesSettings])
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = 'typeMap',
    visible = true
)
@JsonSubTypes([
    @JsonSubTypes.Type(value = PointSettings, name = 'pointSettings'),
    @JsonSubTypes.Type(value = LinesSettings, name = 'linesSettings')])
abstract class AbstractPointCharacteristics
{
    @UiSchemaMeta(hidden = 'All')
    String typeMap = ''
}

/**
 * Настройки для вкладки 'Точки'
 */
@CustomProperty(name = 'typeMap', value = 'pointSettings')
@JsonSchemaMeta(title = 'Точки')
class PointSettings extends AbstractPointCharacteristics
{
    {
        typeMap = 'pointSettings'
    }
    @JsonSchemaMeta(title = ' ')
    Collection<ContentPointSettings> strategies = [new ContentPointSettings()]
}

@JsonSchemaMeta(requiredFields = ['nameStrategy', 'metaClassObject'], title = ' ')
class ContentPointSettings
{
    @JsonSchemaMeta(title = 'Название стратегии', nullable = false)
    String nameStrategy = 'TP'
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии')
    String codeStrategy = ''
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс объектов', nullable = false)
    MetaClassObject metaClassObject = new MetaClassObject('', '')

    @JsonSchemaMeta(title = 'Координаты')
    CoordinatesSettings coordinatesSettings = new CoordinatesSettings()
    @JsonSchemaMeta(title = 'Характеристики точки')
    PointCharacteristics pointCharacteristics = new PointCharacteristics()
    @JsonSchemaMeta(title = 'Стратегия определения объектов для отображения на карте ')
    StrategyDeterminingObjectsMap strategyDeterminingObjectsMap = new StrategyDeterminingObjectsMap()

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Применяется только при стратегии "Скрипт"')
    String scriptText = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContentTitleMap')
    @JsonSchemaMeta(title = 'Места использования')
    Collection<String> placesOfUsePoint = []
}

/**
 * Настройки для встройки 'Координаты'
 */
@JsonSchemaMeta(requiredFields = ['pathCoordinatLatitude', 'pathCoordinatLongitud'])
class CoordinatesSettings
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к координатам широты')
    String pathCoordinatLatitude = ""
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к координатам долготы')
    String pathCoordinatLongitud = ""
}

/**
 * Настройки для встройки 'Характеристики точки'
 */
@JsonSchemaMeta(requiredFields = ['pathIcon'], title = 'Характеристики точки')
class PointCharacteristics
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к иконке')
    String pathIcon = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к тексту для всплывающей подсказки')
    String pathTextTooltip = ''
}

/**
 * Настройки для встройки 'Стратегия определения объектов для отображения на карт'
 */
@JsonSchemaMeta(requiredFields = ['strategyDisplayingMap'], title = 'Стратегия определения объектов для отображения на карте')
class StrategyDeterminingObjectsMap
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Стратегия', nullable = false)
    StrategyDisplayingMap strategyDisplayingMap
}

/**
 * Настройки для владки 'Линии'
 */
@CustomProperty(name = 'typeMap', value = 'linesSettings')
@JsonSchemaMeta(title = 'Линии')
class LinesSettings extends AbstractPointCharacteristics
{
    {
        typeMap = 'linesSettings'
    }
    @JsonSchemaMeta(title = ' ')
    Collection<ContentLinesSettings> strategies = [new ContentLinesSettings()]
}

@JsonSchemaMeta(requiredFields = ['nameStrategy', 'metaClassObject'], title = ' ')
class ContentLinesSettings
{
    @JsonSchemaMeta(title = 'Название стратегии', nullable = false)
    String nameStrategy = ''
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии')
    String codeStrategy = ''
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс объектов', nullable = false)
    MetaClassObject metaClassObject = new MetaClassObject('', '')

    @JsonSchemaMeta(title = 'Характеристики линии')
    CharacteristicsLine characteristicsLine = new CharacteristicsLine()
    @JsonSchemaMeta(title = 'Координаты')
    CoordinatesLine coordinatesLine = new CoordinatesLine()

    @JsonSchemaMeta(title = 'Отображение окончания линии точками')
    Boolean displayingEndLineDots = null
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к иконке А', description = 'Иконка для окончания линии. Если не указана, используется иконка по умолчанию для графического объекта Точка')
    String pathIconA = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к иконке Б', description = 'Иконка для окончания линии. Если не указана, используется иконка по умолчанию для графического объекта Точка')
    String pathIconB = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaClassObject')
    @JsonSchemaMeta(title = 'Путь для всплывающей подсказки')
    String pathTooltip = ''

    @JsonSchemaMeta(title = 'Стратегия определения обьектов для отображения на карте')
    StrategyDeterminingObjectsMapLines strategyDeterminingObjectsMapLines = new StrategyDeterminingObjectsMapLines()

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта')
    String scriptText = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContentTitleMap')
    @JsonSchemaMeta(title = 'Места использования')
    Collection<String> placesOfUseLines = []
}

/**
 * Настройки для встройки 'Характеристики линии'
 */
class CharacteristicsLine
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Цвет')
    String colour = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Толщина')
    String width = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Прозрачность (%)')
    String opacity = ''

    @JsonSchemaMeta(title = 'Стиль')
    DrawingLineStyle drawingLineStyle
}

/**
 * Настройки для встройки 'Координаты'
 */
@JsonSchemaMeta(requiredFields = ['pathCoordinatesLatitudeA', 'pathCoordinatesLongitudA', 'pathCoordinatesLatitudeB', 'pathCoordinatesLongitudB'])
class CoordinatesLine
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к координатам широты А')
    String pathCoordinatesLatitudeA = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к координатам долготы А')
    String pathCoordinatesLongitudA = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к координатам широты Б')
    String pathCoordinatesLatitudeB = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Путь к координатам долготы Б')
    String pathCoordinatesLongitudB = ''
}

/**
 * Настройки для встройки 'Стратегия определения объектов для отображения на карте '
 */
@JsonSchemaMeta(requiredFields = ['strategyDisplayingMap'], title = 'Стратегия определения обьектов для отображения на карте ')
class StrategyDeterminingObjectsMapLines
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaClassObject')
    @JsonSchemaMeta(title = 'Стратегия', nullable = false)
    StrategyDisplayingMap strategyDisplayingMap
}

/**
 * Настройки для вкладки 'Визуализация по умолчанию'
 */
@JsonSchemaMeta(requiredFields = ['colorLineMap', 'width', 'opacity', 'lineStyle'], title = ' ')
class DefaultVisualization
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getListColors')
    @JsonSchemaMeta(title = 'Цвет')
    String colorLineMap = ''
    @JsonSchemaMeta(title = 'Толщина')
    String width = ''
    @JsonSchemaMeta(title = 'Прозрачность (%)')
    String opacity = ''
    @JsonSchemaMeta(title = 'Стиль')
    DrawingLineStyle lineStyle
    @JsonSchemaMeta(title = 'Характеристики для вывода в списке объектов')
    Collection<CharacteristicsDisplayListObjects> points = [new CharacteristicsDisplayListObjects()]
}

/**
 * Настройки для списка 'Стиль'-ей линии
 */
enum DrawingLineStyle
{
    @UiTitle(title = 'сплошная')
    solidLine,
    @UiTitle(title = 'штриховая')
    dashedLine
}

/**
 * Настройки для списка 'Стиль'-ей линии
 */
enum StrategyDisplayingMap
{
    @UiTitle(title = 'скрипт')
    script
}

/**
 * Настройки для встройки 'Характеристики для вывода в списке объектов'
 */
@JsonSchemaMeta(requiredFields = ['metaClassObject', 'attributeGroup'], title = ' ')
class CharacteristicsDisplayListObjects
{
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    MetaClassObject metaClassObject = new MetaClassObject('', '')

    @UiSchemaMeta(widget = 'attrGroup-select', paramsPath = '../metaClassObject')
    @JsonSchemaMeta(title = 'Группа атрибутов')
    String attributeGroup = ''
}

/**
 * Настройки для владки 'Интерфейс'
 */
@JsonSchemaMeta(title = 'Доступ к API')
class APISettings
{
    @JsonSchemaMeta(title = 'Ключ API Яндекс Карты')
    String yandex = ''
    @JsonSchemaMeta(title = 'Ключ API Google Maps')
    String google = ''
}

Object getDefaultSettings(def initSettings)
{
    return new MapSettings()
}

Object getInitSettings()
{
    return new MapInitialSettings()
}

String getListColors()
{
    return JsonOutput.toJson(
        utils.find('colors', [:]).collect {
            [title: it.title, uuid: '#' + it.color.string, selectable: true]
        }
    )
}

String getContentTitleMap()
{
    Collection<IAppContentInfo> contentInfo =
        api.apps.listContents(ConstantMap.EMBEDDED_APPLICATION_CODE)
    Collection<LinkedHashMap> argum = []
    contentInfo.collect {
        argum << [selectable     : true, title: it.contentTitle, uuid:
            it.contentUuid, level: 0, extra: 'тест']
    }
    return toJson(argum)
}

@InjectApi
class SettingsProvider
{
    MapSettings getSettings()
    {
        String nameSpace = ConstantMap.NAME_MECHANISM_SETTINGS
        String actualVersion = api.keyValue.get(nameSpace, ConstantMap.ACTUAL_VERSION)
        if (actualVersion != null)
        {
            int actualVersionNumber = actualVersion as Integer
            if (actualVersionNumber > -1)
            {
                String settingsJson = api.keyValue.get(nameSpace, "settings$actualVersion")
                MapSettingsWithTimeStamp settings =
                    Jackson.fromJsonString(settingsJson, MapSettingsWithTimeStamp)
                return settings.settings
            }
        }
        return null
    }
}

void saveSettings(MapSettings settings)
{
    String nameSpace = ConstantMap.NAME_MECHANISM_SETTINGS
    Integer actualVersion = api.keyValue.get(nameSpace, ConstantMap.ACTUAL_VERSION) as Integer ?: 0
    String settingsJson = Jackson.toJsonString(
        new MapSettingsWithTimeStamp(
            settings: settings,
            timestamp: new Date().time
        )
    )
    actualVersion++
    api.keyValue.put(nameSpace, "settings$actualVersion", settingsJson)
    api.keyValue.put(nameSpace, ConstantMap.ACTUAL_VERSION, actualVersion.toString())
}

void postSaveActions()
{
    MapSettings settings = new SettingsProvider().getSettings()
    installStrategyCode(settings?.abstractPointCharacteristics.first())
    installStrategyCode(settings?.abstractPointCharacteristics.last())
    saveSettings(settings)
}

/**
 * Метод генерирующий код для формы "Код стратегии"
 * @param contentSettings - данные с настройками из мастера
 */
void installStrategyCode(AbstractPointCharacteristics contentSettings)
{
    contentSettings.each {
        it.strategies.each { code ->
            String codeStrategy = code?.codeStrategy
            String nameStrategy = code?.nameStrategy
            if ((codeStrategy == ConstantMap.FIRST_PART_STRATEGY_CODE || codeStrategy == "") &&
                nameStrategy != "")
            {
                Integer hashCode = nameStrategy.hashCode() > 0 ? nameStrategy.hashCode() :
                    (nameStrategy.hashCode() * -1)
                code?.codeStrategy = ConstantMap.FIRST_PART_STRATEGY_CODE + hashCode
            }
            checkingCorrectnessScript(code.scriptText)
        }
    }
}

void checkingCorrectnessScript(String scriptText)
{
    if (scriptText != '')
    {
        try
        {
            LinkedHashMap<String, Object> bindings = new JsonSlurper()
                .parseText(getDataOnBindings())
            api.utils.executeScript(scriptText, bindings)
        }
        catch (Exception ex)
        {
            api
                .utils
                .throwReadableException("Invalid script passed: '${ scriptText }' \n${ ex.message }")
        }
    }
}

String getDataOnBindings()
{
    String namespace = 'mapDataElementSystem'
    String key = 'mapData'
    return api.keyValue.get(namespace, key)
}
