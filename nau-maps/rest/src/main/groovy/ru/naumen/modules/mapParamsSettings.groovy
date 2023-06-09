//Автор: atulisova
//Дата создания: 20.05.2021
//Код: mapParamsSettings
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Inventory".
 * Содержит методы, определяющие список трасс, участков и оборудования
 */
package ru.naumen.modules.inventory

import ru.naumen.core.server.script.spi.ScriptDtOList
import ru.naumen.core.server.script.api.injection.InjectApi
import com.fasterxml.jackson.annotation.JsonIgnore
import ru.naumen.core.shared.dto.ISDtObject
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import com.fasterxml.jackson.databind.ObjectMapper

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
     * @param bindings - дополнительные параметры контекста выполнения скрипта
     * @return список данных из БД
     */
    Object getDataDisplayMap(String nameContent, LinkedHashMap<String, Object> bindings)
    {
        Collection<AbstractPointCharacteristics> abstractCharacteristicsData = new SettingsProvider()
            .getSettings()?.abstractPointCharacteristics
        Collection<OutputObjectStrategies> strategiesPoint =
            getSettingsFromWizardSettingsPoint(abstractCharacteristicsData.first())
        Collection<OutputObjectStrategies> strategiesLine =
            getSettingsFromWizardSettingsLine(abstractCharacteristicsData.last())

        Collection<MapObjectBuilder> pointData = []
        pointData += collectingData(strategiesPoint, nameContent, true, bindings)
        pointData += collectingData(strategiesLine, nameContent, false, bindings)
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
        data?.strategies?.each {
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
        data?.strategies?.each {
            OutputObjectStrategies strategies = new StrategiesPoint()
                .setMetaClassObject(it?.metaClassObject?.id)
                .setScriptText(it?.scriptText)
                .setPlacesOfUse(it?.placesOfUsePoint)
                .setPathLatitudeCoordinates(it?.coordinatesSettings?.pathCoordinatLatitude)
                .setPathLongitudeCoordinates(it?.coordinatesSettings?.pathCoordinatLongitud)
                .setTooltip(it?.pointCharacteristics?.pathTextTooltip)
                .setPathIcon(it?.pointCharacteristics?.pathIcon)
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
        data?.strategies?.each {
            OutputObjectStrategies strategies = new StrategiesLine()
                .setMetaClassObject(it?.metaClassObject?.id)
                .setScriptText(it?.scriptText)
                .setPlacesOfUse(it?.placesOfUseLines)
                .setColor(it?.characteristicsLine?.colour)
                .setOpacity(it?.characteristicsLine?.opacity)
                .setWeight(it?.characteristicsLine?.width)
                .setLineStyle(it?.characteristicsLine?.drawingLineStyle.toString())
                .setPathCoordinatesLatitudeA(it?.coordinatesLine?.pathCoordinatesLatitudeA)
                .setPathCoordinatesLongitudA(it?.coordinatesLine?.pathCoordinatesLongitudA)
                .setPathCoordinatesLatitudeB(it?.coordinatesLine?.pathCoordinatesLatitudeB)
                .setPathCoordinatesLongitudB(it?.coordinatesLine?.pathCoordinatesLongitudB)
                .setTooltip(it?.pathTooltip)
                .setDisplayingLinesDots(it?.displayingEndLineDots)
                .setPathToIconA(it?.pathIconA)
                .setPathToIconB(it?.pathIconB)
            dataWizardSettings.add(strategies)
        }
        return dataWizardSettings
    }

    /**
     * Метод сохранения данных о линиях и точках для отображения на карте
     * @param strategies - набор настроек из мастера
     * @param nameContent - имя контента
     * @param isDataAboutPointsOrLines - данные о точках или линиях
     * @param bindings - дополнительные параметры контекста выполнения скрипта
     * @return коллекция данных для отображения данных на вкладке
     */
    Collection collectingData(Collection<OutputObjectStrategies> strategies,
                              String nameContent,
                              Boolean isDataAboutPointsOrLines,
                              LinkedHashMap<String, Object> bindings)
    {
        ElementsMap elementsMap = new ElementsMap()
        Collection dataToDisplay = []
        strategies?.each { strategie ->
            strategie?.placesOfUse?.each { place ->
                if (place == nameContent)
                {
                    Collection executeScript =
                        api.utils.executeScript(strategie.scriptText, bindings)
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
                        executeScript.each { currentObject ->
                            if (elementsMap.createTrail(currentObject, strategie))
                            {
                                dataToDisplay += new LinkedOnMap(
                                    elementsMap.createTrail(currentObject, strategie)
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

    /**
     * Текст всплывающей подсказки
     */
    String tooltip

    /**
     * Код формы редактирования
     */
    String codeEditingForm

    PointsOnMap(BasePointBuilder basePointBuilder)
    {
        this.type = MapObjectType.POINT
        this.geopositions = basePointBuilder?.geopositions
        this.codeEditingForm = basePointBuilder?.codeEditingForm
        this.icon = basePointBuilder?.icon
        this.data = basePointBuilder
        this.color = settingsWizardSettings?.colorLineMap
        this.opacity = settingsWizardSettings?.opacity
        this.weight = settingsWizardSettings?.width
        this.lineStyle = settingsWizardSettings?.lineStyle
        this.tooltip = basePointBuilder?.tooltip
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
    /**
     * Признак отображения иконки
     */
    Boolean isIcon
    /**
     * Ссылка на иконку А
     */
    String iconFirst
    /**
     * Ссылка на иконку B
     */
    String iconSecond

    /**
     * Текст всплывающей подсказки
     */
    String tooltip

    /**
     * Код формы редактирования
     */
    String codeEditingForm

    LinkedOnMap(TrailBuilder trailBuilder)
    {
        this.color = trailBuilder.color
        this.opacity = trailBuilder.opacity
        this.weight = trailBuilder.width
        this.lineStyle = trailBuilder.lineStyle
        this.codeEditingForm = trailBuilder?.codeEditingForm
        this.type = trailBuilder.type
        this.geopositions = trailBuilder.geopositions
        this.iconFirst = trailBuilder.iconFirst
        this.iconSecond = trailBuilder.iconSecond
        this.isIcon = trailBuilder.displayingLinesDots
        this.tooltip = trailBuilder.tooltip
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
                                 lineStyle   : this.lineStyle,
                                 iconFirst   : this.iconFirst,
                                 iconSecond  : this.iconSecond,
                                 isIcon      : this.isIcon,
                                 tooltip     : this.tooltip] : [:]
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
                                   lineStyle   : this.lineStyle,
                                   iconFirst   : this.iconFirst,
                                   iconSecond  : this.iconSecond,
                                   isIcon      : this.isIcon,
                                   tooltip     : this.tooltip] : [:]
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
