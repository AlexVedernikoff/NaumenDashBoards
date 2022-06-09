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

@MechanismSettings(name = 'map')
class MapSettings
{
    @JsonSchemaMeta(title = 'Стратегии вывода объектов')
    Collection<AbstractPointCharacteristics> abstractPointCharacteristics = [new PointSettings(), new LinesSettings()]
    @JsonSchemaMeta(title = 'Визуализация по умолчанию')
    Collection<DefaultVisualization> defaultVisualization = [new DefaultVisualization()]
    @JsonSchemaMeta(title = 'API')
    Collection<APISettings> interfaceSettings = [new APISettings()]
    @UiSchemaMeta(hidden = 'All')
    BugsFix commonSettings = new BugsFix()
}

@JsonSchemaMeta(title = ' ')
class BugsFix
{
    @UiSchemaMeta(hidden = 'All')
    String scheme = 'bugsfix'
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
@JsonSchemaMeta(requiredFields = ['nameStrategy', 'codeStrategy', 'metaclassObjects'], title = 'Точки')
class PointSettings extends AbstractPointCharacteristics
{
    {
        typeMap = 'pointSettings'
    }
    @JsonSchemaMeta(title = 'Название стратегии')
    String nameStrategy = 'TP'
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии')
    String codeStrategy = ''
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс объектов')
    String metaclassObjects = ''

    @JsonSchemaMeta(title = 'Координаты')
    CoordinatesSettings coordinatesSettings = new CoordinatesSettings()
    @JsonSchemaMeta(title = 'Характеристики точки')
    PointCharacteristics pointCharacteristics = new PointCharacteristics()
    @JsonSchemaMeta(title = 'Стратегия определения объектов для отображения на карте ')
    StrategyDeterminingObjectsMap strategyDeterminingObjectsMap = new StrategyDeterminingObjectsMap()

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Применяется только при стратегии "Скрипт"')
    String scriptText = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjects')
    @JsonSchemaMeta(title = 'Места использования')
    String placesUse = ''
}

/**
 * Настройки для встройки 'Координаты'
 */
@JsonSchemaMeta(requiredFields = ['pathCoordinatLatitude', 'pathCoordinatLongitud'])
class CoordinatesSettings
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjects')
    @JsonSchemaMeta(title = 'Путь к координатам широты')
    String pathCoordinatLatitude = ""
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjects')
    @JsonSchemaMeta(title = 'Путь к координатам долготы')
    String pathCoordinatLongitud = ""
}

/**
 * Настройки для встройки 'Характеристики точки'
 */
@JsonSchemaMeta(requiredFields = ['pathIcon'], title = 'Характеристики точки')
class PointCharacteristics
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjects')
    @JsonSchemaMeta(title = 'Путь к иконке')
    String pathIcon = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjects')
    @JsonSchemaMeta(title = 'Путь к тексту для всплывающей подсказки')
    String pathTextTooltip = ''
}

/**
 * Настройки для встройки 'Стратегия определения объектов для отображения на карт'
 */
@JsonSchemaMeta(requiredFields = ['strategy'], title = 'Стратегия определения объектов для отображения на карте')
class StrategyDeterminingObjectsMap
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjects')
    @JsonSchemaMeta(title = 'Стратегия', nullable = false)
    String strategy = ''
}

/**
 * Настройки для владки 'Линии'
 */
@CustomProperty(name = 'typeMap', value = 'linesSettings')
@JsonSchemaMeta(requiredFields = ['nameStrategy', 'codeStrategy', 'metaclassObjects', 'typeGraphicObject', 'metaclassObjectsLines'], title = 'Линии')
class LinesSettings extends AbstractPointCharacteristics
{
    {
        typeMap = 'linesSettings'
    }
    @JsonSchemaMeta(title = 'Название стратегии')
    String nameStrategy = ''
    @UiSchemaMeta(disabled = true)
    @JsonSchemaMeta(title = 'Код стратегии')
    String codeStrategy = ''
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс объектов')
    String metaclassObjectsLines = ''
    @JsonSchemaMeta(title = 'Тип графического объекта')
    String typeGraphicObject = ''

    @JsonSchemaMeta(title = 'Характеристики линии')
    CharacteristicsLine characteristicsLine = new CharacteristicsLine()
    @JsonSchemaMeta(title = 'Координаты')
    CoordinatesLine coordinatesLine = new CoordinatesLine()

    @JsonSchemaMeta(title = 'Отображение окончания линии точками')
    Boolean displayingEndLineDots = null
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь к иконке А', description = 'Иконка для окончания линии. Если не указана, используется иконка по умолчанию для графического объекта Точка')
    String pathIconA = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь к иконке Б', description = 'Иконка для окончания линии. Если не указана, используется иконка по умолчанию для графического объекта Точка')
    String pathIconB = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь для всплывающей подсказки')
    String pathTooltip = ''

    @JsonSchemaMeta(title = 'Стратегия определения обьектов для отображения на карте')
    StrategyDeterminingObjectsMapLines strategyDeterminingObjectsMapLines = new StrategyDeterminingObjectsMapLines()

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта')
    String scriptText = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Места использования')
    String placesUse = ''
}

/**
 * Настройки для встройки 'Характеристики линии'
 */
class CharacteristicsLine
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Цвет')
    String colour = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Толщина')
    String width = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
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
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь к координатам широты А')
    String pathCoordinatesLatitudeA = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь к координатам долготы А')
    String pathCoordinatesLongitudA = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь к координатам широты Б')
    String pathCoordinatesLatitudeB = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Путь к координатам долготы Б')
    String pathCoordinatesLongitudB = ''
}

/**
 * Настройки для встройки 'Стратегия определения объектов для отображения на карте '
 */
@JsonSchemaMeta(requiredFields = ['strategy'], title = 'Стратегия определения обьектов для отображения на карте ')
class StrategyDeterminingObjectsMapLines
{
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../../metaclassObjectsLines')
    @JsonSchemaMeta(title = 'Стратегия', nullable = false)
    String strategy = ''
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
    Collection<CharacteristicsDisplayListObjects> points
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
 * Настройки для встройки 'Характеристики для вывода в списке объектов'
 */
@JsonSchemaMeta(requiredFields = ['metaclassCharacteristicsDisplay', 'attributeGroup'], title = ' ')
class CharacteristicsDisplayListObjects
{
    @UiSchemaMeta(widget = 'metaClass-select')
    @JsonSchemaMeta(title = 'Метакласс')
    String metaclassCharacteristicsDisplay = ''
    @UiSchemaMeta(widget = 'attr-select', paramsPath = '../metaclassCharacteristicsDisplay')
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

@InjectApi
class SettingsProvider
{
    MapSettings getSettings()
    {
        String nameSpace = 'map'
        String actualVersion = api.keyValue.get(nameSpace, 'actualVersion')
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
    String nameSpace = 'map'
    Integer actualVersion = api.keyValue.get(nameSpace, 'actualVersion') as Integer ?: 0
    String settingsJson = Jackson.toJsonString(
        new MapSettingsWithTimeStamp(
            settings: settings,
            timestamp: new Date().time
        )
    )
    actualVersion++
    api.keyValue.put(nameSpace, "settings$actualVersion", settingsJson)
    api.keyValue.put(nameSpace, 'actualVersion', actualVersion.toString())
}

void postSaveActions()
{
    def settings = new SettingsProvider().getSettings()
    def strategies = settings?.abstractPointCharacteristics ?: [] as Collection<PointSettings>
    strategies.each {
        if (!it.codeStrategy)
        {
            it.codeStrategy = "codeStrategy"
        }
    }
    saveSettings(settings)
}