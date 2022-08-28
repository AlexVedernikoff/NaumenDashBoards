//Автор: atulisova
//Дата создания: 20.05.2021
//Код: mapParamsSettings
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Inventory".
 * Содержит методы, определяющие список трасс, участков и оборудования
 */
//Версия SMP: 4.11
package ru.naumen.modules.inventory


import ru.naumen.core.server.script.spi.ScriptDtOList
import ru.naumen.core.server.script.api.injection.InjectApi
import com.fasterxml.jackson.annotation.JsonIgnore

/**
 * Метод по получению данных из БД о трассах и точках(их участках и оборудовании на учасках)
 * @param object - UUID объекта
 * @param user - UUID пользователя
 * @return список данных из БД
 */
Object getObjects(ISDtObject object, Object user)
{
	logger.info("ksimagina 1 ${ object?.UUID } || ${ user?.UUID }")

	Collection<MapObjectBuilder> trails = api.utils.find('link$vols', [:]).findResults {
		modules.mapRestSettings.createTrail(it)?.with(this.&mapTrail)
	}
	Collection<MapObjectBuilder> additionalEquipment = api.utils.find('cmdb', [:]).findResults {
		modules.mapRestSettings.createEquipmentPoint(it)?.with(this.&mapPoint)
	}

	Collection<MapObjectBuilder> points = api.utils.find('location', [:]).findResults {
		modules.mapRestSettings.createPoint(it)?.with(this.&mapPoint)
	}
	Collection<MapObjectBuilder> additionalSections =
		api.utils.find('link$cable', [:]).findResults {
			modules.mapRestSettings.createSection(it)?.with(this.&mapSection)
		}
	return trails + additionalEquipment + points + additionalSections
}
/**
 * Метод по получению данных из БД о точках(их участках и оборудовании на учасках)
 * @param object - UUID объекта
 * @param user - UUID пользователя
 * @return список данных из БД
 */
Object test(ISDtObject object, Object user)
{
	logger.info("ksimagina 2 ${ object?.UUID } || ${ user?.UUID }")
	Collection<MapObjectBuilder> additionalEquipment = api.utils.find('cmdb', [:]).findResults {
		modules.mapRestSettings.createEquipmentPoint(it)?.with(this.&mapPoint)
	}

	Collection<MapObjectBuilder> points = api.utils.find('location', [:]).findResults {
		modules.mapRestSettings.createPoint(it)?.with(this.&mapPoint)
	}
	return points + additionalEquipment
}

@InjectApi
class DataGeneration
{
    /**
     * Метод по получению данных из БД через Мастер настроек
     * @param nameContent - имя контента
     * @return список данных из БД
     */
    Object getDataDisplayMap(String nameContent)
    {
        Collection<AbstractPointCharacteristics> abstractCharacteristicsData = new SettingsProvider()
            .getSettings()?.abstractPointCharacteristics

        Collection<OutputObjectStrategies> strategiesPoint =
            getSettingsFromWizardSettingsPoint(abstractCharacteristicsData.first())
        Collection<OutputObjectStrategies> strategiesLine =
            getSettingsFromWizardSettingsLine(abstractCharacteristicsData.last())

        Collection<MapObjectBuilder> pointData = []
        pointData += collectingData(strategiesPoint, nameContent, true)
        pointData += collectingData(strategiesLine, nameContent, false)

        return pointData
    }

    /**
     * Метод получения коллекции всех скриптов
     * @param data данные из мастера настроек
     * @return коллекция скриптов
     */
    Collection<String> getListScript(AbstractPointCharacteristics data)
    {
        Collection<String> dataScriptText = []
        data?.strategies?.each
            {
                String currentScript = it?.scriptText
                dataScriptText.add(currentScript)
            }
        return dataScriptText
    }

    /**
     * Метод получения списка данных для точек
     * @param data данные из мастера настроек
     * @return коллекция скриптов
     */
    Collection<OutputObjectStrategies> getSettingsFromWizardSettingsPoint(
        AbstractPointCharacteristics data)
    {
        Collection<OutputObjectStrategies> dataWizardSettings = []
        data?.strategies?.each
            {
                OutputObjectStrategies strategies = new StrategiesPoint()
                    .setScriptText(it?.scriptText)
                    .setPlacesOfUse(it?.placesOfUse)
                    .setPathLatitudeCoordinates(it?.coordinatesSettings?.pathCoordinatLongitud)
                    .setPathLongitudeCoordinates(it?.coordinatesSettings?.pathCoordinatLatitude)
                dataWizardSettings.add(strategies)
            }
        return dataWizardSettings
    }

    /**
     * Метод получения списка данных для линий
     * @param data данные из мастера настроек
     * @return коллекция скриптов
     */
    Collection<OutputObjectStrategies> getSettingsFromWizardSettingsLine(
        AbstractPointCharacteristics data)
    {
        Collection<OutputObjectStrategies> dataWizardSettings = []
        data?.strategies?.each
            {
                OutputObjectStrategies strategies = new StrategiesLine()
                    .setScriptText(it?.scriptText)
                    .setPlacesOfUse(it?.placesOfUse)
                    .setColor(it?.characteristicsLine?.colour)
                    .setOpacity(it?.characteristicsLine?.opacity)
                    .setWeight(it?.characteristicsLine?.width)
                    .setLineStyle(it?.characteristicsLine?.drawingLineStyle.toString())
                    .setPathCoordinatesLatitudeA(it?.coordinatesLine?.pathCoordinatesLatitudeA)
                    .setPathCoordinatesLongitudA(it?.coordinatesLine?.pathCoordinatesLongitudA)
                    .setPathCoordinatesLatitudeB(it?.coordinatesLine?.pathCoordinatesLatitudeB)
                    .setPathCoordinatesLongitudB(it?.coordinatesLine?.pathCoordinatesLongitudB)
                dataWizardSettings.add(strategies)
            }
        return dataWizardSettings
    }

    /**
     * Метод сохранения данных о линиях и точках для отображения на карте
     * @param placesOfUse - места использования настроек из мастера
     * @param nameContent - имя контента
     * @param scriptText - список всех скриптов вкладки
     * @param isDataAboutPointsOrLines - данные о точках или линиях
     * @return коллекцию данных для отображения данных на вкладке
     */
    Collection collectingData(Collection<OutputObjectStrategies> strategies,
                              String nameContent,
                              Boolean isDataAboutPointsOrLines)
    {
        ElementsMap elementsMap = new ElementsMap()
        Collection dataToDisplay = []
        strategies?.each { strategie ->
            strategie?.placesOfUse?.each { place ->
                if (place == nameContent.toLowerCase())
                {
                    String executeScriptText = strategie.scriptText
                    ScriptDtOList executeScript = api.utils.executeScript(executeScriptText)
                    if (isDataAboutPointsOrLines)
                    {
                        executeScript.eachWithIndex { num, idx ->
                            if (elementsMap.createEquipmentPoint(num, strategie, idx))
                            {
                                dataToDisplay += new PointsOnMap(
                                    elementsMap.createEquipmentPoint(num, strategie, idx)
                                )
                                return dataToDisplay
                            }
                        }
                    }
                    else
                    {
                        executeScript.findResults {
                            if (elementsMap.createTrail(it, strategie))
                            {
                                dataToDisplay += new LinkedOnMap(
                                    elementsMap.createTrail(it, strategie)
                                )
                            }
                        }
                    }
                }
            }
        }
        return dataToDisplay
    }

}

@InjectApi
class PointsOnMap
{
    @JsonIgnore
    Object settingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
    /**
     * Тип объекта
     */
    MapObjectType type = MapObjectType.POINT
    /**
     * Геопозиции начала и конца участка
     */
    List<Geoposition> geopositions
    /**
     * Иконка для отображения (ссылкой)
     */
    String icon
    /**
     * Класс, описывающий в целом все объекты, которые будут на карте
     */
    BasePointBuilder data
    /**
     * Цвет элемента
     */
    String color
    /**
     * Прозрачность элемента
     */
    String opacity
    /**
     * Толщина линии
     */
    String weight
    /**
     * Тип линии
     */
    String lineStyle

    PointsOnMap(BasePointBuilder basePointBuilder)
    {
        this.type = MapObjectType.POINT
        this.geopositions = basePointBuilder?.geopositions
        this.icon = basePointBuilder?.icon
        this.data = basePointBuilder
        this.color = settingsWizardSettings?.colorLineMap
        this.opacity = settingsWizardSettings?.opacity
        this.weight = settingsWizardSettings?.width
        this.lineStyle = settingsWizardSettings?.lineStyle
    }
}

@InjectApi
class LinkedOnMap
{
    /**
     * Тип объекта
     */
    Object type
    /**
     * Геопозиции начала и конца участка
     */
    List<Geoposition> geopositions
    /**
     * Элементы участка
     */
    Object parts
    /**
     * Оборудование
     */
    Object equipments
    /**
     * Класс, описывающий в целом все объекты, которые будут на карте
     */
    TrailBuilder data
    /**
     * Цвет элемента
     */
    String color
    /**
     * Прозрачность элемента
     */
    String opacity
    /**
     * Толщина линии
     */
    String weight
    /**
     * Тип линии
     */
    String lineStyle

    LinkedOnMap(TrailBuilder trailBuilder)
    {
        this.color = trailBuilder.color
        this.opacity = trailBuilder.opacity
        this.weight = trailBuilder.width
        this.lineStyle = trailBuilder.lineStyle
        this.type = trailBuilder.type
        this.geopositions = trailBuilder.geopositions
        this.parts = trailBuilder.parts.findResults {
            mapSection(it)
        }
        this.equipments = trailBuilder.equipments.findResults {
            mapPoint(it)
        }
        this.data = trailBuilder
    }

    private LinkedHashMap mapSection(SectionBuilder sectionBuilder)
    {
        return sectionBuilder ? [type        : sectionBuilder.type,
                                 geopositions: sectionBuilder.geopositions,
                                 data        : sectionBuilder,
                                 color       : this.color,
                                 opacity     : this.opacity,
                                 weight      : this.weight,
                                 lineStyle   : this.lineStyle] : [:]
    }

    private LinkedHashMap mapPoint(BasePointBuilder basePointBuilder)
    {
        return basePointBuilder ? [type        : MapObjectType.POINT,
                                   geopositions: basePointBuilder?.geopositions,
                                   icon        : basePointBuilder?.icon,
                                   data        : basePointBuilder,
                                   color       : this.color,
                                   opacity     : this.opacity,
                                   weight      : this.weight,
                                   lineStyle   : this.lineStyle] : [:]
    }
}

class SectionOnMap
{
    Object settingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
    /**
     * Тип объекта
     */
    Object type
    /**
     * Геопозиции начала и конца участка
     */
    List<Geoposition> geopositions
    /**
     * Класс, описывающий в целом все объекты, которые будут на карте
     */
    SectionBuilder data
    /**
     * Цвет элемента
     */
    String color
    /**
     * Прозрачность элемента
     */
    String opacity
    /**
     * Толщина линии
     */
    String weight
    /**
     * Тип линии
     */
    String lineStyle

    SectionOnMap(SectionBuilder sectionBuilder)
    {
        this.type = sectionBuilder.type
        this.geopositions = sectionBuilder.geopositions
        this.data = sectionBuilder
        this.color = settingsWizardSettings?.colorLineMap
        this.opacity = settingsWizardSettings?.opacity
        this.weight = settingsWizardSettings?.width
        this.lineStyle = settingsWizardSettings?.lineStyle
    }
}

@InjectApi
class OutputObjectStrategies
{
    /**
     * Текст скрипта
     */
    String scriptText
    /**
     * Места использования настроек из мастера
     */
    Collection<String> placesOfUse

    OutputObjectStrategies setScriptText(String scriptText)
    {
        this.scriptText = scriptText
        return this
    }

    OutputObjectStrategies setPlacesOfUse(Collection<String> placesOfUse)
    {
        Collection<String> setPlaces = []
        placesOfUse.each {
            setPlaces.add(it)
        }
        this.placesOfUse = setPlaces
        return this
    }
}

class StrategiesLine extends OutputObjectStrategies
{
    /**
     * Цвет элемента
     */
    String color
    /**
     * Прозрачность элемента
     */
    String opacity
    /**
     * Толщина линии
     */
    String weight
    /**
     * Тип линии
     */
    String lineStyle

    /**
     * Путь к координатам широты А
     */
    String pathCoordinatesLatitudeA

    /**
     * Путь к координатам долготы А
     */
    String pathCoordinatesLongitudA

    /**
     * Путь к координатам широты Б
     */
    String pathCoordinatesLatitudeB

    /**
     * Путь к координатам долготы Б
     */
    String pathCoordinatesLongitudB

    /**
     * Отображение окончаний линий точками
     */
    Boolean displayingLineEndingsWithDots

    StrategiesLine setColor(String color)
    {
        this.color = color
        return this
    }

    StrategiesLine setOpacity(String opacity)
    {
        this.opacity = opacity
        return this
    }

    StrategiesLine setWeight(String weight)
    {
        this.weight = weight
        return this
    }

    StrategiesLine setLineStyle(String lineStyle)
    {
        this.lineStyle = lineStyle
        return this
    }

    StrategiesLine setPathCoordinatesLatitudeA(String pathCoordinatesLatitudeA)
    {
        this.pathCoordinatesLatitudeA = pathCoordinatesLatitudeA
        return this
    }

    StrategiesLine setPathCoordinatesLongitudA(String pathCoordinatesLongitudA)
    {
        this.pathCoordinatesLongitudA = pathCoordinatesLongitudA
        return this
    }

    StrategiesLine setPathCoordinatesLatitudeB(String pathCoordinatesLatitudeB)
    {
        this.pathCoordinatesLatitudeB = pathCoordinatesLatitudeB
        return this
    }

    StrategiesLine setPathCoordinatesLongitudB(String pathCoordinatesLongitudB)
    {
        this.pathCoordinatesLongitudB = pathCoordinatesLongitudB
        return this
    }
}

class StrategiesPoint extends OutputObjectStrategies
{
    /**
     * Путь к координатам широты Путь к координатам широты
     */
    String pathLatitudeCoordinates

    /**
     * Путь к координатам широты Путь к координатам долготы
     */
    String pathLongitudeCoordinates

    StrategiesPoint setPathLatitudeCoordinates(String pathLatitudeCoordinates)
    {
        this.pathLatitudeCoordinates = pathLatitudeCoordinates
        return this
    }

    StrategiesPoint setPathLongitudeCoordinates(String pathLongitudeCoordinates)
    {
        this.pathLongitudeCoordinates = pathLongitudeCoordinates
        return this
    }
}
