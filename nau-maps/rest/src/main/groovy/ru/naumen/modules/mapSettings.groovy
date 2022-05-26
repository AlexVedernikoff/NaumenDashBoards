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

@MechanismSettings(name = 'map')
class MapSettings
{
    @JsonSchemaMeta(title = 'Стратегии вывода объектов')
    Collection<AbstractPointCharacteristics> abstractPointCharacteristics = [new PointSettings(), new LinesSettings()]
    @JsonSchemaMeta(title = 'Визуализация по умолчанию')
    Collection<DefaultVisualization> defaultVisualization = []
    @JsonSchemaMeta(title = 'API')
    Collection<APISettings> interfaceSettings = []
    @UiSchemaMeta(hidden = 'All')
    BugFix commonSettings = new BugFix()
}

class BugFix
{
    String scheme = 'bugfix'
}

/**
 * Настройки для владки 'Стратегии вывода объектов'
 */
@JsonSchemaMeta(requiredFields = ['pathCoordinatLatitude', 'pathCoordinatLongitud'], title = 'Координаты')
class CoordinatesSettings
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к координатам широты')
    String pathCoordinatLatitude = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к координатам долготы')
    String pathCoordinatLongitud = ''
}

@JsonSchemaMeta(requiredFields = ['pathIcon', 'pathTextTooltip'], title = 'Характеристики точки')
class PointCharacteristics
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к иконке')
    String pathIcon = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к тексту для всплывающей подсказки')
    String pathTextTooltip = ''
}

@JsonSchemaMeta(requiredFields = ['strategy'], title = 'Стратегия определения обьектов для отображения на карте ')
class StrategyDeterminingObjectsMap
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Стратегия')
    String strategy = ''
}

@JsonSchemaOneOf(key = 'type', classes = [PointSettings, LinesSettings])
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = 'type',
    visible = true
)
@JsonSubTypes([
    @JsonSubTypes.Type(value = PointSettings, name = 'pointSettings'),
    @JsonSubTypes.Type(value = LinesSettings, name = 'linesSettings')])
abstract class AbstractPointCharacteristics
{
    String type
}

@CustomProperty(name = 'type', value = 'pointSettings')
@JsonSchemaMeta(requiredFields = ['nameStrategy', 'codeStrategy', 'metaclassObjects'], title = 'Точки')
class PointSettings extends AbstractPointCharacteristics
{
    {
        type = 'pointSettings'
    }
    @JsonSchemaMeta(title = 'Название стратегии')
    String nameStrategy = ''
    @JsonSchemaMeta(title = 'Код стратегии')
    String codeStrategy = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Метакласс объектов')
    String metaclassObjects = ''

    CoordinatesSettings coordinatesSettings = null
    PointCharacteristics pointCharacteristics = null
    StrategyDeterminingObjectsMap strategyDeterminingObjectsMap = null

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта', description = 'Применяется только при стратегии "Скрипт"')
    String scriptText = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Места использования')
    String placesUse = ''
}

@CustomProperty(name = 'type', value = 'linesSettings')
@JsonSchemaMeta(requiredFields = ['nameStrategy', 'codeStrategy'], title = 'Линии')
class LinesSettings extends AbstractPointCharacteristics
{
    {
        type = 'linesSettings'
    }
    @JsonSchemaMeta(title = 'Название стратегии')
    String nameStrategy = ''
    @JsonSchemaMeta(title = 'Код стратегии')
    String codeStrategy = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Метакласс объектов')
    String metaclassObjects = ''

    CharacteristicsLine characteristicsLine = null
    CoordinatesLine coordinatesLine = null

    @JsonSchemaMeta(title = 'Отображение окончания линии точками')
    Boolean displayingEndLineDots = null
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к иконке А', description = 'Иконка для окончания линии. Если не указана, используется иконка по умолчанию для графического объекта Точка')
    String pathIconA = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к иконке Б', description = 'Иконка для окончания линии. Если не указана, используется иконка по умолчанию для графического объекта Точка')
    String pathIconB = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь для всплывающей подсказки')
    String pathTooltip = ''

    StrategyDeterminingObjectsMap strategyDeterminingObjectsMap = null

    @UiSchemaMeta(widget = 'textarea')
    @JsonSchemaMeta(title = 'Текст скрипта')
    String scriptText = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Места использования')
    String placesUse = ''
}

@JsonSchemaMeta(title = 'Характеристики линии')
class CharacteristicsLine
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Цвет')
    String colour = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Толщина')
    String width = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Прозрачность (%)')
    String opacity = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Стиль')
    String style = ''
}

@JsonSchemaMeta(requiredFields = ['pathCoordinatLatitude', 'pathCoordinatLongitud'], title = 'Характеристики линии')
class CoordinatesLine
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к координатам широты А')
    String pathCoordinatesLatitudeA = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к координатам долготы А')
    String pathCoordinatesLongitudA = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к координатам широты Б')
    String pathCoordinatesLatitudeB = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Путь к координатам долготы Б')
    String pathCoordinatesLongitudB = ''
}

/**
 * Настройки для владки 'Визуализация по умолчанию'
 */
@JsonSchemaMeta(title = ' ')
class DefaultVisualization
{
    @JsonSchemaMeta(title = 'Цвет')
    String colour = ''
    @JsonSchemaMeta(title = 'Толщина')
    String width = ''
    @JsonSchemaMeta(title = 'Прозрачность (%)')
    String opacity = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Стиль')
    DrawingLineStyle lineStyle = null
    @JsonSchemaMeta(title = 'Характеристики для вывода в списке объектов')
    Collection<CharacteristicsDisplayListObjects> points
}

enum DrawingLineStyle
{
    @UiTitle(title = 'сплошная')
    solidLine,
    @UiTitle(title = 'штриховая')
    dashedLine
}

@JsonSchemaMeta(title = ' ')
class CharacteristicsDisplayListObjects
{
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Метакласс')
    String contentCode6 = ''
    @UiSchemaMeta(widget = 'abstract-select', source = 'getContents')
    @JsonSchemaMeta(title = 'Группа атрибутов')
    String contentCode7 = ''
}

/**
 * Настройки для владки 'Интерфейс'
 */
@JsonSchemaMeta(title = 'Доступ к API')
class APISettings
{
    @JsonSchemaMeta(title = 'Ключ API Яндекс Карты')
    String yandexMapsAPIrey = ''
    @JsonSchemaMeta(title = 'Ключ API Google Maps')
    String googlMapsAPIrey = ''
}

Object getDefaultSettings(def initSettings)
{
    logger.info("LOGI238 getDefaultSettings()")
    return new MapSettings()
}

Object getInitSettings()
{
    return new MapInitialSettings()
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

String getAbstract()
{
    Collection<StrategiesOutputObjects> strategies = settings?.strategiesOutputObjects ?: [] as Collection<StrategiesOutputObjects>
    Integer i = 0
    Object strategyDTOs = strategies.collect {
        [selectable   : true, title: "$it.code ololo ".toString(), uuid: it.code, level:
            i++, extra: 'тест']
    }

    return JsonOutput.toJson(strategyDTOs)
}

String getContents()
{
    Integer level = 0
    return JsonOutput.toJson(
        api.apps.listContents('testSvg').collect {
            [title: it.contentTitle, uuid: it.contentUuid, level: level++, selectable: true]
        }
    )
}

void postSaveActions()
{
    MapSettings settings = new SettingsProvider().getSettings()
    Collection<? extends Object> strategies = settings?.defaultVisualization ?: [] as Collection<StrategiesOutputObjects>
    strategies.each {
        if (!it.colour)
        {
            it.code = "colour${ it.title.hashCode() }"
        }
    }
    saveSettings(settings)
}