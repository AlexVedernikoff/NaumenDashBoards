//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: schemeParamsSettings
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Schemes".
 * Содержит методы, определяющие данные для передачи на схему
 */
package ru.naumen.modules.inventory

import ru.naumen.core.server.script.spi.ScriptDtOList
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import ru.naumen.core.server.script.api.injection.InjectApi

/**
 * Метод по получению данных из БД через Мастер настроек
 * @param nameContent - имя контента
 * @param bindings - дополнительные параметры контекста выполнения скрипта
 * @return список данных из БД
 */
Object getDataDisplayScheme(String nameContent, LinkedHashMap<String, Object> bindings)
{
    String variableDescribingHierarchyCommunicationSettings = 'hierarchyCommunicationSettings'
    String variableDescribingObjectRelationshipsSettings = 'objecRelationshipsSettings'
    SchemesSettings settings = new SettingsProviderSchemes().getSettings()
    Collection<MapObjectBuilder> pointData = []
    if (checkingPlaceUseInSettingsWizard(
        variableDescribingHierarchyCommunicationSettings,
        settings,
        nameContent
    ))
    {
        pointData += dataForHierarchyCommunicationSettings(settings, nameContent, bindings)
    }
    if (checkingPlaceUseInSettingsWizard(
        variableDescribingObjectRelationshipsSettings,
        settings,
        nameContent
    ))
    {
        pointData += dataForObjecRelationshipsSettings(settings, nameContent, bindings)
    }
    return pointData
}

/**
 * Метод сохранения данных о линиях и точках для отображения на карте
 * @param settings данные из мастера настроек
 * @param nameContent - имя контента
 * @param bindings - дополнительные параметры контекста выполнения скрипта
 * @return колекцию данных для отображения заданных на вкладе
 */
Collection<HierarchyCommunicationBuilder> dataForHierarchyCommunicationSettings(SchemesSettings settings,
                                                                                String nameContent,
                                                                                LinkedHashMap<String, Object> bindings)
{
    Collection<AbstractSchemesCharacteristics> abstractCharacteristicsData =
        settings?.abstractSchemesCharacteristics
    Collection<String> pointScriptText = getListScript(abstractCharacteristicsData.first())
    String linkAttribute =
        abstractCharacteristicsData.first()?.strategies?.pathCoordinatLongitud.first()
    String pointA = abstractCharacteristicsData.first()?.strategies?.pointA.first()
    String pointB = abstractCharacteristicsData.first()?.strategies?.pointB.first()
    String scriptLineAttributeData = "${ pointScriptText.first() }.${ linkAttribute }"
    String scriptPointAAttributeData = "${ pointScriptText.first() }.${ linkAttribute }.${ pointA }"
    String scriptPointBAttributeData = "${ pointScriptText.first() }.${ linkAttribute }.${ pointB }"
    ScriptDtOList dataLine
    Collection dataPointA
    Collection dataPointB
    try
    {
        dataLine = api.utils.executeScript(scriptLineAttributeData, bindings)
        dataPointA = api.utils.executeScript(scriptPointAAttributeData, bindings)
        dataPointB = api.utils.executeScript(scriptPointBAttributeData, bindings)
    }
    catch (Exception ex)
    {
        logger.info("Передан неверный скрипт!")
        logger.error("#schemeParamsSettings ${ ex.message }", ex)
    }
    Set<HierarchyCommunicationBuilder> pointData = []
    ElementsScheme elementsScheme = new ElementsScheme()
    Integer id = 0
    dataLine.eachWithIndex { num, idx ->
        if (dataPointA[idx] && dataPointB[idx])
        {
            if (idx == 0)
            {
                pointData += elementsScheme.createHierarchyCommunicationPoint(dataPointA[idx], ++id)
            }
            if (!(pointData?.any {
                it.UUID == dataPointA[idx].UUID
            }))
            {
                pointData += elementsScheme.createHierarchyCommunicationPoint(dataPointA[idx], ++id)
                if (!(pointData?.any {
                    it.UUID == dataPointB[idx].UUID
                }))
                {
                    pointData +=
                        elementsScheme.createHierarchyCommunicationLine(dataLine[idx], ++id, id - 1)
                    pointData +=
                        elementsScheme
                            .createHierarchyCommunicationPoint(dataPointB[idx], ++id, id - 2)
                }
            }
            else
            {
                if (!(pointData?.any {
                    it.UUID == dataPointB[idx].UUID
                }))
                {
                    HierarchyCommunicationBuilder pointAInformation = pointData.find {
                        it.UUID == dataPointA[idx].UUID
                    }
                    pointData += elementsScheme.createHierarchyCommunicationLine(
                        dataLine[idx],
                        ++id,
                        pointAInformation?.id
                    )
                    pointData += elementsScheme.createHierarchyCommunicationPoint(
                        dataPointB[idx],
                        ++id,
                        pointAInformation?.id
                    )
                }
            }
        }
    }
    return pointData.collect {
        return schemeHierarchy(it)
    }
}

/**
 * Метод получения данных для вкладки мастера 'Связь выбранных объектов'
 * @param settings данные из мастера настроек
 * @param nameContent - имя контента
 * @param bindings - дополнительные параметры контекста выполнения скрипта
 * @return данные для отображения на схеме
 */
Collection<HierarchyCommunicationBuilder> dataForObjecRelationshipsSettings(SchemesSettings settings,
                                                                            String nameContent,
                                                                            LinkedHashMap<String, Object> bindings)
{
    Collection<AbstractSchemesCharacteristics> abstractCharacteristicsData =
        settings?.abstractSchemesCharacteristics
    Collection<String> pointScriptText = getListScript(abstractCharacteristicsData.last())
    ElementsScheme elementsScheme = new ElementsScheme()
    String scriptLineAttributeData = pointScriptText.first()
    Collection result = []
    try
    {
        scriptedBusinessObjectsSetupWizard = api.utils.executeScript(scriptLineAttributeData)
    }
    catch (Exception ex)
    {
        logger.info("Передан неверный скрипт!")
        logger.error("#schemeParamsSettings ${ ex.message }", ex)
    }
    Collection listPathCoordenadesLongitud =
        abstractCharacteristicsData.last()?.strategies?.first().rulesLinkingSchemaObjects.collect {
            it.pathCoordinatLongitud
        }
    Collection<SchemaElement> allElementsScheme =
        getAllElementsScheme(scriptedBusinessObjectsSetupWizard, listPathCoordenadesLongitud)

    Integer id = 0
    Collection<HierarchyCommunicationBuilder> pointData = []
    allElementsScheme.each { currentElementSchema -> pointData.add([])
    }
    transformationDataDisplayFront(pointData, allElementsScheme, elementsScheme, null)
    new SchemaWorkingElements().zeroingId()
    return pointData.sort {
        it.size()
    }.last()
}

/**
 * Преобразование данных в формат для отображения на фронт
 * @param pointData - список данных для отображения
 * @param id - идентификатор элемента схемы
 * @param allElementsScheme - все элементы для схем в бэковом формате
 * @param elementsScheme - элемент схемы
 * @param idParent - идентификатор родительского элемента
 * @return преобразованные данные
 */
void transformationDataDisplayFront(Collection<HierarchyCommunicationBuilder> pointData,
                                    Object allElementsScheme,
                                    ElementsScheme elementsScheme,
                                    Integer idParent)
{
    SchemaWorkingElements idSchemaElement = new SchemaWorkingElements()
    pointData.eachWithIndex { currentScheme, ind ->
        if (allElementsScheme)
        {

            if (allElementsScheme[ind] && allElementsScheme[ind].level == 0)
            {
                currentScheme.add(
                    elementsScheme.createHierarchyCommunicationPoint(
                        allElementsScheme[ind].systemObject,
                        idSchemaElement.incrementId(),
                        null
                    )
                )
                transformationDataDisplayFront(
                    pointData,
                    allElementsScheme[ind].childElements,
                    elementsScheme,
                    ind
                )
            }
            else
            {
                Integer from
                allElementsScheme.eachWithIndex { schemaElement, indElementsScheme ->
                    if (schemaElement && ind == idParent)
                    {
                        if (!from)
                        {
                            from = idSchemaElement.getId()
                        }
                        currentScheme.add(
                            elementsScheme.createHierarchyCommunicationLine(
                                schemaElement.systemObject,
                                idSchemaElement.incrementId(),
                                from
                            )
                        )
                        currentScheme.add(
                            elementsScheme.createHierarchyCommunicationPoint(
                                schemaElement.systemObject,
                                idSchemaElement.incrementId(),
                                from
                            )
                        )
                        transformationDataDisplayFront(
                            pointData,
                            schemaElement.childElements,
                            elementsScheme,
                            idParent
                        )
                    }
                }
            }
        }
    }
}

/**
 * Получение данных для работы на бэке
 * @param scriptedBusinessObjectsSetupWizard - список скриптовых элементов из мастера
 * @param linkAttributes - ссылочные атрибуты по которым будут получаться данных
 * @return список данных для работы на бэке
 */
Collection<SchemaElement> getAllElementsScheme(Collection scriptedBusinessObjectsSetupWizard,
                                               Collection linkAttributes)
{
    Collection<SchemaElement> allElementsScheme = []
    linkAttributes.eachWithIndex { linkAttribute, idAttribute ->
        if (idAttribute == 0)
        {
            scriptedBusinessObjectsSetupWizard.each { firstLevelElement ->
                Object systemObject = api.utils.get(firstLevelElement.UUID)
                Collection<SchemaElement> childElements = firstLevelElement[linkAttribute] ?
                    listChildElements(
                        firstLevelElement[linkAttribute],
                        idAttribute + 1,
                        ) : null
                String title = systemObject ? systemObject.title : null
                allElementsScheme
                    .add(new SchemaElement(idAttribute, title, systemObject, childElements))
            }
        }
        else
        {
            Collection<SchemaElement> elementsPreviousIteration = []
            elementsPreviousIteration =
                getAllBusinessObjectsCurrentLevel(allElementsScheme, idAttribute)
            elementsPreviousIteration.each { firstLevelElement ->
                if (firstLevelElement)
                {
                    Object systemObject = firstLevelElement.systemObject
                    Collection<SchemaElement> childElements = systemObject[linkAttribute] ?
                        listChildElements(
                            systemObject[linkAttribute],
                            idAttribute + 1,
                            ) : null
                    firstLevelElement.setChildElements(childElements)
                }
            }
        }
    }
    allElementsScheme
}

/**
 * Метод формирования списка дочерних элементов объекта
 * @param attribute - атрибут
 * @param level - уровень элемента
 * @return список дочерних элементов
 */
Collection<SchemaElement> listChildElements(Object attribute, Integer level)
{
    Collection<SchemaElement> childElements = []
    if (attribute instanceof Collection)
    {
        attribute.each {
            String title = it ? it.title : null
            childElements.add(new SchemaElement(level, title, api.utils.get(it.UUID), null))
        }
    }
    else
    {
        String title = attribute ? attribute.title : null
        childElements.add(new SchemaElement(level, title, api.utils.get(attribute.UUID), null))
    }
    return childElements
}

/**
 * Метод формирования списка дочерних элементов объекта
 * @param elements - элемент схемы
 * @param level - уровень элемента
 * @return список дочерних элементов
 */
Collection<SchemaElement> getAllBusinessObjectsCurrentLevel(Collection<SchemaElement> elements,
                                                            Integer level)
{
    if (elements.childElements.flatten() &&
        elements.childElements?.flatten()?.first()?.level == level)
    {
        return elements.childElements.flatten()
    }
    else
    {
        if (elements.childElements.flatten())
        {
            getAllBusinessObjectsCurrentLevel(elements.childElements.flatten(), level)
        }
    }
    return null
}

/**
 * Метод получения колекции всех стриптов
 * @param data данные из мастера настроек
 * @return коллекция скриптов
 */
Collection<String> getListScript(AbstractSchemesCharacteristics data)
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
 * Проверка использования ВП в мастере настроек
 * @param usedTabSettingsWizard имя схемы используемой в мастере
 * @param settings данные из мастера настроек
 * @param nameContent имя используемого контента
 * @return используемость ВП
 */
Boolean checkingPlaceUseInSettingsWizard(String usedTabSettingsWizard,
                                         SchemesSettings settings,
                                         String nameContent)
{
    return settings?.abstractSchemesCharacteristics.find { abstractCharacteristics
        ->
        abstractCharacteristics.typeSchemes == usedTabSettingsWizard
    }.strategies.find { strateg -> strateg.listStrategy.contains(nameContent)
    } ?: false
}

/**
 * Метод по "обрамлению" объекта трассы в правильный формат для фронта
 * @param trailBuilder - объект трассы собственного формата
 * @return "обрамленный" объект трассы
 */
private LinkedHashMap<String, Object> schemeHierarchy(HierarchyCommunicationBuilder hierarchyCommunicationBuilder)
{
    return hierarchyCommunicationBuilder ? [desc   : hierarchyCommunicationBuilder.desc,
                                            from   : hierarchyCommunicationBuilder.from,
                                            id     : hierarchyCommunicationBuilder.id,
                                            title  : hierarchyCommunicationBuilder.title,
                                            to     : hierarchyCommunicationBuilder.to,
                                            type   : hierarchyCommunicationBuilder.type,
                                            actions: hierarchyCommunicationBuilder.actions,
                                            header : hierarchyCommunicationBuilder.header,
                                            options: hierarchyCommunicationBuilder.options,
                                            uuid   : hierarchyCommunicationBuilder.UUID
    ] : [:]
}

@InjectApi
class StrategiesDisplayingObjectsSchemas
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

class CommunicationSettingsHierarchy extends OutputObjectStrategies
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
}

class RelationshipsObjectSettings extends OutputObjectStrategies
{
    /**
     * Путь к координатам широты
     */
    String pathLatitudeCoordinates

    /**
     * Путь к координатам долготы
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

class SchemaElement
{
    /**
     * Уровень отображения на схеме
     */
    Integer level

    /**
     * Имя элемента
     */
    String title

    /**
     * Объект системы
     */
    Object systemObject

    /**
     * Список дочерних элементов
     */
    Collection<SchemaElement> childElements

    SchemaElement(level, title, systemObject, childElements)
    {
        this.level = level
        this.title = title
        this.systemObject = systemObject
        this.childElements = childElements
    }

    void setChildElements(Collection<SchemaElement> childElements)
    {
        this.childElements = childElements
    }
}

class SchemaWorkingElements
{
    /**
     * Идентификатор элемента на схеме
     */
    static Integer id = 0

    Integer incrementId()
    {
        return ++id
    }

    Integer getId()
    {
        return id
    }

    void zeroingId()
    {
        id = 0
    }
}
