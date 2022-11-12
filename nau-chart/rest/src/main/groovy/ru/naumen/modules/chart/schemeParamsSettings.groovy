//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: schemeParamsSettings
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Schemes".
 * Содержит методы, определяющие данные для передачи на схему
 */
package ru.naumen.modules.chart

import ru.naumen.core.server.script.spi.ScriptDtOList
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import ru.naumen.core.server.script.api.injection.InjectApi
import groovy.transform.Canonical
import ru.naumen.core.shared.dto.ISDtObject

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
    Collection<Collection<HierarchyCommunicationBuilder>> pointData = []
    if (checkingPlaceUseInSettingsWizard(
        variableDescribingHierarchyCommunicationSettings,
        settings,
        nameContent
    ))
    {
        HierarchyCommunicationSettings settingsForTabHierarchyCommunication =
            settings?.abstractSchemesCharacteristics.find {
                it.typeSchemes == variableDescribingHierarchyCommunicationSettings
            }
        pointData += dataForHierarchyCommunicationSettings(
            settingsForTabHierarchyCommunication,
            nameContent,
            bindings
        )
    }
    if (checkingPlaceUseInSettingsWizard(
        variableDescribingObjectRelationshipsSettings,
        settings,
        nameContent
    ))
    {
        ObjecRelationshipsSettings settingsForObjecRelationshipsSettings =
            settings?.abstractSchemesCharacteristics.find {
                it.typeSchemes == variableDescribingObjectRelationshipsSettings
            }
        pointData += dataForObjectRelationshipsSettings(
            settingsForObjecRelationshipsSettings,
            nameContent,
            bindings
        )
    }
    return pointData.sort {
        it.size()
    }.reverse()
}

/**
 * Метод сохранения данных о линиях и точках для отображения на карте
 * @param settings - данные из мастера настроек
 * @param nameContent - имя контента
 * @param bindings - дополнительные параметры контекста выполнения скрипта
 * @return коллекция данных для отображения заданных на вкладке
 */
Collection<Collection<HierarchyCommunicationBuilder>> dataForHierarchyCommunicationSettings(
    HierarchyCommunicationSettings settings,
    String nameContent,
    LinkedHashMap<String, Object> bindings)
{
    Collection<Collection<HierarchyCommunicationBuilder>> allSchemesAllStrategies = []
    ElementsScheme elementsScheme = new ElementsScheme()
    Long id = 0
    settings.strategies.each { currentStrategy ->
        if (currentStrategy.listStrategy.find { strategy -> strategy == nameContent
        })
        {
            String scriptLineAttributeData = "${ currentStrategy.scriptText }.${ currentStrategy.pathCoordinatLongitud }"
            String scriptPointAAttributeData = "${ currentStrategy.scriptText }.${ currentStrategy.pathCoordinatLongitud }.${ currentStrategy.pointA }"
            String scriptPointBAttributeData = "${ currentStrategy.scriptText }.${ currentStrategy.pathCoordinatLongitud }.${ currentStrategy.pointB }"
            Collection<ISDtObject> dataLine
            Collection<ISDtObject> dataPointA
            Collection<ISDtObject> dataPointB
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
            Set<ISDtObject> allPoint = []
            dataLine.eachWithIndex { region, idx ->
                allPoint.add(dataPointA[idx])
                allPoint.add(dataPointB[idx])
            }
            Collection<HierarchyCommunicationBuilder> allPointsScheme = []
            allPoint.each {
                allPointsScheme += elementsScheme.createHierarchyCommunicationPoint(it, ++id, null)
            }

            allPointsScheme.each { point ->
                String attributeNameA = currentStrategy.pointA
                String attributeNameB = currentStrategy.pointB
                ISDtObject fromPoints = dataLine.find {
                    it[attributeNameB].UUID == point.UUID
                }
                if (fromPoints)
                {
                    Long from = allPointsScheme.find {
                        it.UUID == fromPoints[attributeNameA].UUID
                    }.id
                    point.from = from != point.id ? from : null
                }
            }
            //создаём все линии
            Collection<HierarchyCommunicationBuilder> allLineScheme = []
            dataLine.eachWithIndex { region, idx ->
                Long from = allPointsScheme.find {
                    dataPointA[idx].UUID == it.UUID
                }.id
                Long to = allPointsScheme.find {
                    dataPointB[idx].UUID == it.UUID
                }.id
                allLineScheme +=
                    elementsScheme.createHierarchyCommunicationLine(region, ++id, from, to)
            }

            //распределяем элементы по отдельным массивам со схемами
            Collection<Collection<HierarchyCommunicationBuilder>> allScheme = []
            allPointsScheme.findAll {
                it.from == null
            }.each {
                allScheme.add([it])
            }
            Collection<HierarchyCommunicationBuilder> listRemoveIncorrectLine = []
            allScheme.eachWithIndex { currentScheme, idx ->
                getAllRelatedPoints(
                    allScheme,
                    currentScheme.first(),
                    allPointsScheme,
                    allLineScheme,
                    idx
                )

                //перелопачивание старших id TODO
                currentScheme.findAll {
                    it.id < it.from
                }.each {
                    Long currentId = it.id
                    Long newId = ++id
                    it.id = newId
                    currentScheme.findAll {
                        it.from == currentId
                    }.each {
                        it.from = newId
                    }
                    currentScheme.findAll {
                        it.to == currentId
                    }.each {
                        it.to = newId
                    }
                }
                listRemoveIncorrectLine += currentScheme.findAll {
                    it.type == 'line' && !(it.to in currentScheme.findAll {
                        it.type == 'point'
                    }.id)
                }
            }
            listRemoveIncorrectLine.each { removeLine ->
                allScheme.each { currentScheme ->
                    if (currentScheme.indexOf(removeLine) != -1)
                    {
                        currentScheme.remove(currentScheme.indexOf(removeLine))
                    }
                }
            }

            allSchemesAllStrategies += allScheme
        }
    }
    return allSchemesAllStrategies
}

void getAllRelatedPoints(Collection<Collection<HierarchyCommunicationBuilder>> allScheme,
                         HierarchyCommunicationBuilder currentPoint,
                         Collection<HierarchyCommunicationBuilder> allPointsScheme,
                         Collection<HierarchyCommunicationBuilder> allLineScheme,
                         Integer idx)
{
    Collection<HierarchyCommunicationBuilder> childLines = allLineScheme.findAll {
        it.from == currentPoint.id
    }
    if (!childLines)
    {
        return
    }
    Collection<HierarchyCommunicationBuilder> childPoint = allPointsScheme.findAll {
        it.from == currentPoint.id
    }
    allScheme[idx].addAll(childLines)
    allScheme[idx].addAll(childPoint)
    childPoint.each { currentChildPoint
        ->
        getAllRelatedPoints(allScheme, currentChildPoint, allPointsScheme, allLineScheme, idx)
    }
}

/**
 * Метод получения данных для вкладки мастера 'Связь выбранных объектов'
 * @param settings - данные из мастера настроек
 * @param nameContent - имя контента
 * @param bindings - дополнительные параметры контекста выполнения скрипта
 * @return данные для отображения на схеме
 */
Collection<Collection<HierarchyCommunicationBuilder>> dataForObjectRelationshipsSettings(
    ObjecRelationshipsSettings settings,
    String nameContent,
    LinkedHashMap<String, Object> bindings)
{
    Collection<Collection<HierarchyCommunicationBuilder>> allData = []
    settings.strategies.each { currentStrategy ->
        ElementsScheme elementsScheme = new ElementsScheme()
        try
        {
            scriptedBusinessObjectsSetupWizard = api.utils.executeScript(currentStrategy.scriptText)
        }
        catch (Exception ex)
        {
            logger.info("Передан неверный скрипт!")
            logger.error("#schemeParamsSettings ${ ex.message }", ex)
        }
        Collection listPathCoordinateLongitude =
            currentStrategy.rulesLinkingSchemaObjects.collect {
                it.pathCoordinatLongitud
            }
        Collection<SchemaElement> allElementsScheme =
            getAllElementsScheme(scriptedBusinessObjectsSetupWizard, listPathCoordinateLongitude)
        Collection<Collection<HierarchyCommunicationBuilder>> pointData = []
        allElementsScheme.each {
            pointData << []
        }
        transformationDataDisplayFront(pointData, allElementsScheme, elementsScheme, null)
        allData += pointData
        new SchemaWorkingElements().zeroingId()
    }
    return allData
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
void transformationDataDisplayFront(Collection<Collection<HierarchyCommunicationBuilder>> pointData,
                                    Object allElementsScheme,
                                    ElementsScheme elementsScheme,
                                    Integer idParent)
{
    if (!allElementsScheme)
    {
        return
    }
    SchemaWorkingElements idSchemaElement = new SchemaWorkingElements()
    pointData.eachWithIndex { currentScheme, ind ->
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

/**
 * Получение данных для работы на бэке
 * @param scriptedBusinessObjectsSetupWizard - список скриптовых элементов из мастера
 * @param linkAttributes - ссылочные атрибуты, по которым будут получаться данные
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
    return allElementsScheme
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
    if (attribute in Collection)
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
    Collection flatten = elements?.childElements?.flatten()
    if (flatten?.first()?.level != level)
    {
        return getAllBusinessObjectsCurrentLevel(flatten, level)
    }
    else
    {
        return flatten
    }
}

/**
 * Метод получения коллекции всех скриптов
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
 * @param settings - данные из мастера настроек
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
    return hierarchyCommunicationBuilder ? [desc           : hierarchyCommunicationBuilder.desc,
                                            from           : hierarchyCommunicationBuilder.from,
                                            id             : hierarchyCommunicationBuilder.id,
                                            title          : hierarchyCommunicationBuilder.title,
                                            to             : hierarchyCommunicationBuilder.to,
                                            type           : hierarchyCommunicationBuilder.type,
                                            codeEditingForm:
                                                hierarchyCommunicationBuilder.codeEditingForm,
                                            actions        : hierarchyCommunicationBuilder.actions,
                                            header         : hierarchyCommunicationBuilder.header,
                                            options        : hierarchyCommunicationBuilder.options,
                                            uuid           : hierarchyCommunicationBuilder.UUID
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

    StrategiesDisplayingObjectsSchemas setScriptText(String scriptText)
    {
        this.scriptText = scriptText
        return this
    }

    StrategiesDisplayingObjectsSchemas setPlacesOfUse(Collection<String> placesOfUse)
    {
        Collection<String> setPlaces = []
        placesOfUse.each {
            setPlaces.add(it)
        }
        this.placesOfUse = setPlaces
        return this
    }
}

class CommunicationSettingsHierarchy extends OutputObjectStrategiesSchema
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

    CommunicationSettingsHierarchy setColor(String color)
    {
        this.color = color
        return this
    }

    CommunicationSettingsHierarchy setOpacity(String opacity)
    {
        this.opacity = opacity
        return this
    }

    CommunicationSettingsHierarchy setWeight(String weight)
    {
        this.weight = weight
        return this
    }

    CommunicationSettingsHierarchy setLineStyle(String lineStyle)
    {
        this.lineStyle = lineStyle
        return this
    }
}

class RelationshipsObjectSettings extends OutputObjectStrategiesSchema
{
    /**
     * Путь к координатам широты
     */
    String pathLatitudeCoordinates

    /**
     * Путь к координатам долготы
     */
    String pathLongitudeCoordinates

    RelationshipsObjectSettings setPathLatitudeCoordinates(String pathLatitudeCoordinates)
    {
        this.pathLatitudeCoordinates = pathLatitudeCoordinates
        return this
    }

    RelationshipsObjectSettings setPathLongitudeCoordinates(String pathLongitudeCoordinates)
    {
        this.pathLongitudeCoordinates = pathLongitudeCoordinates
        return this
    }
}

@Canonical
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

@InjectApi
class OutputObjectStrategiesSchema
{
    /**
     * Текст скрипта
     */
    String scriptText
    /**
     * Места использования настроек из мастера
     */
    Collection<String> placesOfUse

    /**
     * Код используемого метакласса
     */
    String metaClassObject

    OutputObjectStrategiesSchema setMetaClassObject(String metaClassObject)
    {
        this.metaClassObject = metaClassObject
        return this
    }

    OutputObjectStrategiesSchema setScriptText(String scriptText)
    {
        this.scriptText = scriptText
        return this
    }

    OutputObjectStrategiesSchema setPlacesOfUse(Collection<String> placesOfUse)
    {
        Collection<String> setPlaces = []
        placesOfUse.each {
            setPlaces.add(it)
        }
        this.placesOfUse = setPlaces
        return this
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
