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
    return pointData.sort { it?.size() }?.reverse()
}

/**
 * Метод получения данных для вкладки мастера 'Иерархия связи'
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

    settings.strategies.each { currentStrategy ->
        if (currentStrategy.listStrategy.find { strategy -> strategy == nameContent
        })
        {
            String scriptLineAttributeData = "${ currentStrategy.scriptText }.${ currentStrategy.pathCoordinateLongitude }"
            String scriptPointAAttributeData = "${ currentStrategy.scriptText }.${ currentStrategy.pathCoordinateLongitude }.${ currentStrategy.pointA }"
            String scriptPointBAttributeData = "${ currentStrategy.scriptText }.${ currentStrategy.pathCoordinateLongitude }.${ currentStrategy.pointB }"
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
            Collection<HierarchyCommunicationBuilder> allPointsScheme =
                createPointsForStrategyHierarchyLink(
                    dataLine,
                    dataPointA,
                    dataPointB,
                    currentStrategy
                )
            Collection<HierarchyCommunicationBuilder> allLineScheme = createLinesAllElementsScheme(
                dataLine,
                dataPointA,
                dataPointB,
                allPointsScheme,
                currentStrategy
            )
            Collection<Collection<HierarchyCommunicationBuilder>> schemesCurrentStrategies =
                distributeElementsIntoSeparateSchemes(allPointsScheme, allLineScheme)
            checkWhetherPointsWithoutLinks(currentStrategy, schemesCurrentStrategies)
            allSchemesAllStrategies += schemesCurrentStrategies
        }
    }
    return allSchemesAllStrategies
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
    Long id = 0
    Collection<Collection<HierarchyCommunicationBuilder>> allSchemeToDisplay = []
    settings.strategies.each { currentStrategy ->
        if (currentStrategy.listStrategy.find { strategy -> strategy == nameContent
        })
        {
            Collection<ISDtObject> scriptedBusinessObjectsSetupWizard = []
            try
            {
                scriptedBusinessObjectsSetupWizard =
                    api.utils.executeScript(currentStrategy.scriptText)
            }
            catch (Exception ex)
            {
                logger.info("Передан неверный скрипт!")
                logger.error("#schemeParamsSettings ${ ex.message }", ex)
            }
            Collection listAttributes =
                currentStrategy.rulesLinkingSchemaObjects.collect {
                    it.pathCoordinateLongitude
                }

            Collection<Set<ISDtObject>> allObjectsToScheme =
                breakRelatedObjectsIntoBlocks(scriptedBusinessObjectsSetupWizard, listAttributes)
            Collection<Collection<HierarchyCommunicationBuilder>> currentSchemeToDisplay =
                addPointsByRelatedObjects(allObjectsToScheme, currentStrategy)
            checkWhetherPointsWithoutLinks(currentStrategy, currentSchemeToDisplay)
            addLineByRelatedObjects(
                currentStrategy,
                currentSchemeToDisplay,
                listAttributes,
                allSchemeToDisplay
            )
        }
    }
    return allSchemeToDisplay
}

/**
 * Метод проверки чекбокса в мастере и удаления объектов без связей
 * @param currentStrategy - текущая вкладка настроек из мастера
 * @param schemesCurrentStrategies - коллекция схем по текущей стратегии
 */
void checkWhetherPointsWithoutLinks(Object currentStrategy,
                                    Collection<Collection<HierarchyCommunicationBuilder>> schemesCurrentStrategies)
{
    if (currentStrategy.displayingEndLineDots)
    {
        schemesCurrentStrategies = schemesCurrentStrategies.findAll {
            it.size() != 1
        }
    }
}

/**
 * Метод распределения элементов по соответствующим схемам
 * @param allPointsScheme - все точки для схемы
 * @param allLineScheme -  все линии для схемы
 * @param id - идентификатор элемента на схеме
 * @return данные для отображения на схеме
 */
Collection<Collection<HierarchyCommunicationBuilder>> distributeElementsIntoSeparateSchemes(
    Collection<HierarchyCommunicationBuilder> allPointsScheme,
    Collection<HierarchyCommunicationBuilder> allLineScheme)
{
    Collection<Collection<HierarchyCommunicationBuilder>> allScheme = []
    allPointsScheme.findAll {
        it.from == null
    }.each {
        allScheme.add([it])
    }
    Collection<HierarchyCommunicationBuilder> listRemoveIncorrectLine = []
    allScheme.eachWithIndex { currentScheme, idx ->
        getAllRelatedPoints(allScheme, currentScheme.first(), allPointsScheme, allLineScheme, idx)
        listRemoveIncorrectLine += currentScheme.findAll {
            it.type == 'line' && !(it.to in currentScheme.findAll {
                it.type == 'point'
            }.id)
        }
    }
    allScheme.flatten().findAll {
        it.type == 'point' && it.id < it.from
    }.each {
        Long currentId = it.id
        Long newId = SchemaWorkingElements.incrementId()
        it.id = newId
        allScheme.flatten().findAll {
            it.from == currentId
        }.each {
            it.from = newId
        }
        allScheme.flatten().findAll {
            it.to == currentId
        }.each {
            it.to = newId
        }
    }
    SchemaWorkingElements.zeroingId()
    listRemoveIncorrectLine.each { removeLine ->
        allScheme.each { currentScheme ->
            if (currentScheme.indexOf(removeLine) != -1)
            {
                currentScheme.remove(currentScheme.indexOf(removeLine))
            }
        }
    }
    return allScheme
}

/**
 * Метод создания всех точек по стратегии 'Иерархия связи'
 * @param dataLine - данные о всех отрезках на схеме
 * @param dataPointA -  данные по начальной точке
 * @param dataPointB - данные по конечной точке
 * @param currentStrategy - текущая вкладка настроек из мастера
 * @return все точки по соответствующей стратегии
 */
Collection<HierarchyCommunicationBuilder> createPointsForStrategyHierarchyLink(Collection<ISDtObject> dataLine,
                                                                               Collection<ISDtObject> dataPointA,
                                                                               Collection<ISDtObject> dataPointB,
                                                                               ContentHierarchyCommunicationSettings currentStrategy)
{
    ElementsScheme elementsScheme = new ElementsScheme()
    Set<ISDtObject> allPoint = []
    dataLine.eachWithIndex { region, idx ->
        if (dataPointA[idx] && dataPointB[idx])
        {
            allPoint.add(dataPointA[idx])
            allPoint.add(dataPointB[idx])
        }
    }

    Collection<HierarchyCommunicationBuilder> allPointsScheme = []
    allPoint.each {
        if (it)
        {
            allPointsScheme += elementsScheme.createHierarchyCommunicationPoint(
                it,
                currentStrategy,
                SchemaWorkingElements.incrementId(),
                null
            )
        }
    }
    allPointsScheme.each { point ->
        String attributeNameA = currentStrategy.pointA
        String attributeNameB = currentStrategy.pointB
        ISDtObject fromPoints = dataLine.find {
            it[attributeNameB] && it[attributeNameB].UUID == point.UUID
        }
        if (fromPoints && fromPoints[attributeNameA])
        {
            Long from = allPointsScheme.find {
                it.UUID == fromPoints[attributeNameA].UUID
            }.id
            point.from = from != point.id ? from : null
        }
    }
    return allPointsScheme
}

/**
 * Метод создания всех линий по стратегии 'Иерархия связи'
 * @param dataLine - данные о всех отрезках на схеме
 * @param dataPointA -  данные по начальной точке
 * @param dataPointB - данные по конечной точке
 * @param allPointsScheme - все точки для схемы
 * @param currentStrategy - текущая вкладка настроек из мастера
 * @return все линии по соответствующей стратегии
 */
Collection<HierarchyCommunicationBuilder> createLinesAllElementsScheme(Collection<ISDtObject> dataLine,
                                                                       Collection<ISDtObject> dataPointA,
                                                                       Collection<ISDtObject> dataPointB,
                                                                       Collection<HierarchyCommunicationBuilder> allPointsScheme,
                                                                       ContentHierarchyCommunicationSettings currentStrategy)
{
    ElementsScheme elementsScheme = new ElementsScheme()
    Collection<HierarchyCommunicationBuilder> allLineScheme = []
    dataLine.eachWithIndex { region, idx ->
        if (dataPointA[idx] && dataPointB[idx])
        {
            Long from = allPointsScheme.find {
                dataPointA[idx].UUID == it.UUID
            }.id
            Long to = allPointsScheme.find {
                dataPointB[idx].UUID == it.UUID
            }.id
            allLineScheme += elementsScheme.createHierarchyCommunicationLine(
                region,
                currentStrategy,
                SchemaWorkingElements.incrementId(),
                from,
                to
            )
        }
    }
    return allLineScheme
}

/**
 * Метод привязки к точке всех связанных с ней элементов схемы
 * @param allScheme - все схемы
 * @param currentPoint -  текущая точка
 * @param allPointsScheme - все точки для схемы
 * @param allLineScheme -  все линии для схемы
 * @param idx -  индекс элемента
 */
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
 * Осуществляет распределение элементов схемы по соответствующим массивам по связи объектов
 * @param scriptedBusinessObjectsSetupWizard - информация о всех точках из мастера настроек
 * @param listAttributes -  список атрибутов
 * @return коллекции наборов со схемами
 */
Collection<Set<ISDtObject>> breakRelatedObjectsIntoBlocks(Collection<ISDtObject> scriptedBusinessObjectsSetupWizard,
                                                          Collection listAttributes)
{
    Collection<Set<ISDtObject>> allObjectsToScheme = []
    scriptedBusinessObjectsSetupWizard.each { objectsByScript ->
        listAttributes.each { attributesName ->
            if (objectsByScript.hasProperty(attributesName))
            {
                Set<ISDtObject> arrayContainingCurrentObject = allObjectsToScheme.find { listObject
                    ->
                    listObject.find { object
                        ->
                        object.UUID ==
                        objectsByScript.UUID || object.UUID in objectsByScript[attributesName]?.UUID
                    }
                }
                if (arrayContainingCurrentObject)
                {
                    arrayContainingCurrentObject += objectsByScript
                    if (objectsByScript[attributesName] in ISDtObject)
                    {
                        if (objectsByScript[attributesName].UUID in
                            scriptedBusinessObjectsSetupWizard.UUID)
                        {
                            arrayContainingCurrentObject += objectsByScript[attributesName]
                        }
                    }
                    else
                    {
                        arrayContainingCurrentObject += objectsByScript[attributesName].findAll {
                            scriptObject
                                ->
                                scriptObject.UUID in scriptedBusinessObjectsSetupWizard.UUID
                        }
                    }
                    Collection<Set<ISDtObject>> temporaryAllObjectsToScheme = []
                    temporaryAllObjectsToScheme += allObjectsToScheme.findAll { listObject
                        ->
                        !listObject.findAll { object
                            ->
                            arrayContainingCurrentObject.UUID.find { currentUuid
                                ->
                                currentUuid == object.UUID
                            }
                        }
                    }
                    temporaryAllObjectsToScheme << arrayContainingCurrentObject
                    allObjectsToScheme = temporaryAllObjectsToScheme
                }
                else
                {
                    Set<ISDtObject> listObjects = []
                    listObjects += objectsByScript
                    listObjects += objectsByScript[attributesName].findAll { scritpObject
                        ->
                        scritpObject.UUID in scriptedBusinessObjectsSetupWizard.UUID
                    }
                    allObjectsToScheme << listObjects
                }
            }

        }
        if (!(objectsByScript.UUID in allObjectsToScheme.flatten().UUID))
        {
            allObjectsToScheme << [objectsByScript]
        }
    }
    return allObjectsToScheme
}

/**
 * Метод добавления всех точек по стратегии 'Связь выбранных объектов'
 * @param allObjectsToScheme - все объекты для отображения на схеме
 * @param currentStrategy - текущая вкладка настроек из мастера
 * @return все линии по соответствующей стратегии
 */
Collection<Set<ISDtObject>> addPointsByRelatedObjects(Collection<Set<ISDtObject>> allObjectsToScheme,
                                                      Object currentStrategy)
{
    ElementsScheme elementsScheme = new ElementsScheme()
    Collection<Collection<HierarchyCommunicationBuilder>> allSchemeToDisplay = []
    allObjectsToScheme.each { currentObjects ->
        Collection<HierarchyCommunicationBuilder> currentScheme = []
        Long indexFirstElementSet
        currentObjects.eachWithIndex { elementsCurrentScheme, idx ->
            if (currentObjects.size() == 1)
            {
                currentScheme << elementsScheme.createHierarchyCommunicationPoint(
                    elementsCurrentScheme,
                    currentStrategy,
                    SchemaWorkingElements.incrementId(),
                    null
                )
            }
            else
            {
                if (idx == 0)
                {
                    indexFirstElementSet = SchemaWorkingElements.getId() + 1
                    currentScheme += elementsScheme.createHierarchyCommunicationPoint(
                        elementsCurrentScheme,
                        currentStrategy,
                        SchemaWorkingElements.incrementId(),
                        null
                    )
                }
                else
                {
                    currentScheme += elementsScheme.createHierarchyCommunicationPoint(
                        elementsCurrentScheme,
                        currentStrategy,
                        SchemaWorkingElements.incrementId(),
                        indexFirstElementSet
                    )
                    if (idx % 12 == 0)
                    {
                        indexFirstElementSet = SchemaWorkingElements.getId()
                    }
                }
            }
        }
        allSchemeToDisplay << currentScheme
    }
    return allSchemeToDisplay
}

/**
 * Метод добавления всех линий по стратегии 'Связь выбранных объектов'
 * @param currentStrategy - текущая вкладка настроек из мастера
 * @param currentSchemeToDisplay - текущая схема
 * @param listAttributes -  список атрибутов
 * @param allSchemeToDisplay - все схемы
 * @return все линии по соответствующей стратегии
 */
void addLineByRelatedObjects(Object currentStrategy,
                             Collection<Collection<HierarchyCommunicationBuilder>> currentSchemeToDisplay,
                             Collection listAttributes,
                             Collection<Collection<HierarchyCommunicationBuilder>> allSchemeToDisplay)
{
    ElementsScheme elementsScheme = new ElementsScheme()
    currentSchemeToDisplay.each { scheme ->
        scheme.each { elementScheme ->
            listAttributes.each { attributesName ->
                ISDtObject objectSystem = api.utils.get(elementScheme.UUID)
                if (objectSystem.hasProperty(attributesName))
                {
                    if (objectSystem[attributesName] in ISDtObject)
                    {
                        HierarchyCommunicationBuilder currentElementsScheme = scheme.find { objects
                            ->
                            objects?.UUID ==
                            objectSystem[attributesName].UUID && objects?.UUID != elementScheme
                        }
                        if (currentElementsScheme)
                        {
                            scheme += elementsScheme.createHierarchyCommunicationLine(
                                null,
                                currentStrategy,
                                SchemaWorkingElements.incrementId(),
                                elementScheme.id,
                                currentElementsScheme.id
                            )
                        }
                    }
                    else
                    {
                        objectSystem[attributesName].each { objectsAttributes ->
                            HierarchyCommunicationBuilder currentElementsScheme = scheme.find {
                                objects
                                    ->
                                    objects?.UUID ==
                                    objectsAttributes?.UUID && objects?.UUID != elementScheme
                            }
                            if (currentElementsScheme)
                            {
                                scheme += elementsScheme.createHierarchyCommunicationLine(
                                    null,
                                    currentStrategy,
                                    SchemaWorkingElements.incrementId(),
                                    elementScheme.id,
                                    currentElementsScheme.id
                                )
                            }
                        }
                    }
                }
            }
        }
        SchemaWorkingElements.zeroingId()
        allSchemeToDisplay << scheme
    }
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

    static Integer incrementId()
    {
        return ++id
    }

    static Integer getId()
    {
        return id
    }

    static void zeroingId()
    {
        id = 0
    }
}
