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
/**
 * Метод по получению данных из БД о трассах и точках(их участках и оборудовании на учасках)
 * @param object - UUID объекта
 * @param user - UUID пользователя
 * @return список данных из БД
 */
Object getObjects(def object, def user) {
	logger.info("ksimagina 1 ${object?.UUID} || ${user?.UUID}")

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
Object test(def object, def user) {
	logger.info("ksimagina 2 ${object?.UUID} || ${user?.UUID}")
	Collection<MapObjectBuilder> additionalEquipment = api.utils.find('cmdb', [:]).findResults {
		modules.mapRestSettings.createEquipmentPoint(it)?.with(this.&mapPoint)
	}

	Collection<MapObjectBuilder> points = api.utils.find('location', [:]).findResults {
		modules.mapRestSettings.createPoint(it)?.with(this.&mapPoint)
	}
	return points + additionalEquipment
}

/**
 * Метод по получению данных из БД через Мастер настроек
 * @param nameContent - имя контента
 * @return список данных из БД
 */
Object getDataDisplayMap(String nameContent)
{
	MapSettings settings = new SettingsProvider().getSettings()

	Collection<AbstractPointCharacteristics> abstractCharacteristicsData =
		settings?.abstractPointCharacteristics

	Collection<String> pointScriptText = getListScript(abstractCharacteristicsData.first())
	Collection<String> linesScriptText = getListScript(abstractCharacteristicsData.last())

	Collection<String> pointListStrategy =
		abstractCharacteristicsData.first()?.strategies.first()?.listStrategy
	Collection<String> linesListStrategy =
		abstractCharacteristicsData.last()?.strategies.first()?.listStrategy

	Collection<MapObjectBuilder> pointData = []
	pointData += collectingData(pointListStrategy, nameContent, pointScriptText, true)
	pointData += collectingData(linesListStrategy, nameContent, linesScriptText, false)

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
 * Метод сохранения данных о линиях и точках для отображения на карте
 * @param listStrategy - список всех стратегий вкладки
 * @param nameContent - имя контента
 * @param scriptText - список всех скриптов вкладки
 * @param isDataAboutPointsOrLines - данные о точках или линиях
 * @return коллекцию данных для отображения данных на вкладке
 */
Collection collectingData(Collection<String> listStrategy,
				   String nameContent,
				   Collection<String> scriptText,
				   Boolean isDataAboutPointsOrLines)
{
	ElementsMap elementsMap = new ElementsMap(api.web, logger)
	Collection dataToDisplay = []
	listStrategy.each { strategy ->
		Collection<IAppContentInfo> contentInfo = api.apps.listContents(strategy).contentUuid
		contentInfo.each { contentMasters ->
			if (contentMasters == nameContent)
			{
				scriptText.each { script ->
					String executeScriptText = script
					try
					{
						Object executeScript = api.utils.executeScript(executeScriptText)
						if (isDataAboutPointsOrLines)
						{
							pointData += executeScript.findResults {
								elementsMap.createEquipmentPoint(it) {
									dataToDisplay += new PointsOnMap(
										elementsMap.createEquipmentPoint(it)
									)
								}
							}

						}
						else
						{
							pointData += executeScript.findResults {
								if (elementsMap.createTrail(it))
								{
									dataToDisplay += new LinkedOnMap(elementsMap.createTrail(it))
								}
							}
						}
					}
					catch (Exception ex)
					{
						logger.info("Передан неверный скрипт")
					}
				}
			}
		}
	}
	return dataToDisplay
}

class PointsOnMap
{

	Object getSettingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
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
		this.color = getSettingsWizardSettings?.colorLineMap
		this.opacity = getSettingsWizardSettings?.opacity
		this.weight = getSettingsWizardSettings?.width
		this.lineStyle = getSettingsWizardSettings?.lineStyle
	}
}

class LinkedOnMap
{
	Object getSettingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
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
		this.type = trailBuilder.type
		this.geopositions = trailBuilder.geopositions
		this.parts = trailBuilder.parts.findResults {
			mapSection(it)
		}
		this.equipments = trailBuilder.equipments.findResults {
			mapPoint(it)
		}
		this.data = trailBuilder
		this.color = getSettingsWizardSettings?.colorLineMap
		this.opacity = getSettingsWizardSettings?.opacity
		this.weight = getSettingsWizardSettings?.width
		this.lineStyle = getSettingsWizardSettings?.lineStyle
	}

	private LinkedHashMap mapSection(SectionBuilder sectionBuilder)
	{
		return sectionBuilder ? [type        : sectionBuilder.type,
								 geopositions: sectionBuilder.geopositions,
								 data        : sectionBuilder,
								 color       : getSettingsWizardSettings?.colorLineMap,
								 opacity     : getSettingsWizardSettings?.opacity,
								 weight      : getSettingsWizardSettings?.width,
								 lineStyle   : getSettingsWizardSettings?.lineStyle] : [:]
	}

/**
 * Метод по "обрамлению" объекта оборудования в правильный формат для фронта
 * @param basePointBuilder - объект оборудования собственного формата
 * @return "обрамленный" объект оборудования
 */
	private LinkedHashMap mapPoint(BasePointBuilder basePointBuilder)
	{
		return basePointBuilder ? [type        : MapObjectType.POINT,
								   geopositions: basePointBuilder?.geopositions,
								   icon        : basePointBuilder?.icon,
								   data        : basePointBuilder,
								   color       : getSettingsWizardSettings?.colorLineMap,
								   opacity     : getSettingsWizardSettings?.opacity,
								   weight      : getSettingsWizardSettings?.width,
								   lineStyle   : getSettingsWizardSettings?.lineStyle] : [:]
	}
}

class SectionOnMap
{
	Object getSettingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
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
		this.color = getSettingsWizardSettings?.colorLineMap
		this.opacity = getSettingsWizardSettings?.opacity
		this.weight = getSettingsWizardSettings?.width
		this.lineStyle = getSettingsWizardSettings?.lineStyle
	}
}
