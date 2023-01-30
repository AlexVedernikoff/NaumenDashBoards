//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: chartSettings
//Назначение:
/**
 * Содержит метода общей настройки схем для ВП
 */
//Версия: 1.0

package ru.naumen.modules.chart

import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.shared.dto.ISDtObject

@InjectApi
class Charts
{
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
        Collection<Collection<ElementChart>> pointData = []
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
            it?.size()
        }?.reverse()
    }

    /**
     * Метод получения данных для вкладки мастера 'Иерархия связи'
     * @param settings - данные из мастера настроек
     * @param nameContent - имя контента
     * @param bindings - дополнительные параметры контекста выполнения скрипта
     * @return коллекция данных для отображения заданных на вкладке
     */
    Collection<Collection<ElementChart>> dataForHierarchyCommunicationSettings(
        HierarchyCommunicationSettings settings,
        String nameContent,
        LinkedHashMap<String, Object> bindings)
    {
        Collection<Collection<ElementChart>> allSchemesAllStrategies = []
        SchemaWorkingElements idElements = new SchemaWorkingElements()
        settings.strategies.each { currentStrategy ->
            if (currentStrategy.listStrategy.find { strategy -> strategy == nameContent
            })
            {
                ISDtObject getObjectFromScript
                try
                {
                    getObjectFromScript =
                        api.utils.executeScript(currentStrategy.scriptText, bindings)
                }
                catch (Exception ex)
                {
                    logger.info("Передан неверный скрипт!")
                    logger.error("#schemeParamsSettings ${ ex.message }", ex)
                }

                AttributeHandler attributeHandler = new AttributeHandler()
                Collection<ISDtObject> dataLine = attributeHandler.returnDataByAttributeHierarchy(
                    currentStrategy.pathCoordinateLongitude,
                    getObjectFromScript
                )
                Collection<ISDtObject> dataPointA =
                    attributeHandler
                        .returnDataByAttributeHierarchy(currentStrategy.pointA, dataLine)
                Collection<ISDtObject> dataPointB =
                    attributeHandler
                        .returnDataByAttributeHierarchy(currentStrategy.pointB, dataLine)

                Collection<ElementChart> allPointsScheme =
                    createPointsForStrategyHierarchyLink(
                        dataLine,
                        dataPointA,
                        dataPointB,
                        currentStrategy,
                        idElements
                    )
                Collection<ElementChart> allLineScheme = createLinesAllElementsScheme(
                    dataLine,
                    dataPointA,
                    dataPointB,
                    allPointsScheme,
                    currentStrategy,
                    idElements
                )
                Collection<Collection<ElementChart>> schemesCurrentStrategies =
                    distributeElementsIntoSeparateSchemes(
                        allPointsScheme,
                        allLineScheme,
                        idElements
                    )
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
    Collection<Collection<ElementChart>> dataForObjectRelationshipsSettings(
        ObjecRelationshipsSettings settings,
        String nameContent,
        LinkedHashMap<String, Object> bindings)
    {
        Collection<Collection<ElementChart>> allSchemeToDisplay = []
        SchemaWorkingElements idElements = new SchemaWorkingElements()
        settings.strategies.each { currentStrategy ->
            if (currentStrategy.listStrategy.find { strategy -> strategy == nameContent
            })
            {
                Collection<ISDtObject> scriptedBusinessObjectsSetupWizard = []
                try
                {
                    scriptedBusinessObjectsSetupWizard =
                        api.utils.executeScript(currentStrategy.scriptText, bindings)
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
                    breakRelatedObjectsIntoBlocks(
                        scriptedBusinessObjectsSetupWizard,
                        listAttributes
                    )
                Collection<Collection<ElementChart>> currentSchemeToDisplay =
                    addPointsByRelatedObjects(allObjectsToScheme, currentStrategy, idElements)
                currentSchemeToDisplay =
                    checkWhetherPointsWithoutLinks(currentStrategy, currentSchemeToDisplay)
                addLineByRelatedObjects(
                    currentStrategy,
                    currentSchemeToDisplay,
                    listAttributes,
                    allSchemeToDisplay,
                    idElements
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
    Collection<Collection<ElementChart>> checkWhetherPointsWithoutLinks(Object currentStrategy,
                                                                        Collection<Collection<ElementChart>> schemesCurrentStrategies)
    {
        if (currentStrategy.displayingEndLineDots)
        {
            schemesCurrentStrategies = schemesCurrentStrategies.findAll {
                it.size() != 1
            }
        }
        return schemesCurrentStrategies
    }

    /**
     * Метод распределения элементов по соответствующим схемам
     * @param allPointsScheme - все точки для схемы
     * @param allLineScheme -  все линии для схемы
     * @param idElements - идентификатор элемента на схеме
     * @return данные для отображения на схеме
     */
    Collection<Collection<ElementChart>> distributeElementsIntoSeparateSchemes(
        Collection<ElementChart> allPointsScheme,
        Collection<ElementChart> allLineScheme,
        SchemaWorkingElements idElements
                                                                              )
    {
        Collection<Collection<ElementChart>> allScheme = []
        allPointsScheme.findAll {
            it.from == null
        }.each {
            allScheme.add([it])
        }
        Collection<ElementChart> listRemoveIncorrectLine = []
        allScheme.eachWithIndex { currentScheme, idx ->
            getAllRelatedPoints(
                allScheme,
                currentScheme.first(),
                allPointsScheme,
                allLineScheme,
                idx
            )
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
            Long newId = idElements.incrementId()
            it.id = newId
            allScheme.flatten().findAll {
                it.from == currentId
            }.each {
                it.from = newId
            }
            allScheme.flatten().findAll {
                it.type == 'line' && it.to == currentId
            }.each {
                it?.to = newId
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
        return allScheme
    }

    /**
     * Метод создания всех точек по стратегии 'Иерархия связи'
     * @param dataLine - данные о всех отрезках на схеме
     * @param dataPointA -  данные по начальной точке
     * @param dataPointB - данные по конечной точке
     * @param currentStrategy - текущая вкладка настроек из мастера
     * @param idElements - идентификатор элемента на схеме
     * @return все точки по соответствующей стратегии
     */
    Collection<ElementChart> createPointsForStrategyHierarchyLink(Collection<ISDtObject> dataLine,
                                                                  Collection<ISDtObject> dataPointA,
                                                                  Collection<ISDtObject> dataPointB,
                                                                  ContentHierarchyCommunicationSettings currentStrategy,
                                                                  SchemaWorkingElements idElements
                                                                 )
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

        Collection<ElementChart> allPointsScheme = []
        allPoint.each {
            if (it)
            {
                allPointsScheme += elementsScheme.createHierarchyCommunicationPoint(
                    it,
                    currentStrategy,
                    idElements.incrementId(),
                    null
                )
            }
        }
        allPointsScheme.each { point ->
            dataLine.eachWithIndex { currentLine, idx ->
                if (dataPointA[idx].UUID == point.UUID)
                {
                    allPointsScheme.find {
                        it.UUID == dataPointB[idx].UUID
                    }.from = point.id
                }
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
     * @param idElements - идентификатор элемента на схеме
     * @return все линии по соответствующей стратегии
     */
    Collection<ElementChart> createLinesAllElementsScheme(Collection<ISDtObject> dataLine,
                                                          Collection<ISDtObject> dataPointA,
                                                          Collection<ISDtObject> dataPointB,
                                                          Collection<ElementChart> allPointsScheme,
                                                          ContentHierarchyCommunicationSettings currentStrategy,
                                                          SchemaWorkingElements idElements)
    {
        ElementsScheme elementsScheme = new ElementsScheme()
        Collection<ElementChart> allLineScheme = []
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
                    idElements.incrementId(),
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
    void getAllRelatedPoints(Collection<Collection<ElementChart>> allScheme,
                             ElementChart currentPoint,
                             Collection<ElementChart> allPointsScheme,
                             Collection<ElementChart> allLineScheme,
                             Integer idx)
    {
        Collection<ElementChart> childLines = allLineScheme.findAll {
            it.from == currentPoint.id
        }
        if (!childLines)
        {
            return
        }
        Collection<ElementChart> childPoint = allPointsScheme.findAll {
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
                    Set<ISDtObject> arrayContainingCurrentObject = allObjectsToScheme.find {
                        listObject
                            ->
                            listObject.find { object
                                ->
                                object.UUID ==
                                objectsByScript.UUID ||
                                object.UUID in objectsByScript[attributesName]?.UUID
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
                            arrayContainingCurrentObject +=
                                objectsByScript[attributesName].findAll {
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
                        Set<ISDtObject> setContainingCurrentElement = allObjectsToScheme.find {
                            listObject
                                ->
                                listObject.find { object -> object.UUID == objectsByScript.UUID
                                }
                        }
                        if (setContainingCurrentElement)
                        {
                            arrayContainingCurrentObject.addAll(setContainingCurrentElement)
                        }
                        temporaryAllObjectsToScheme << arrayContainingCurrentObject
                        allObjectsToScheme = temporaryAllObjectsToScheme
                    }
                    else
                    {
                        Set<ISDtObject> listObjects = []
                        listObjects += objectsByScript
                        if (objectsByScript[attributesName] in ISDtObject)
                        {
                            ISDtObject currentObject = objectsByScript[attributesName].UUID in
                                                       scriptedBusinessObjectsSetupWizard.UUID ?
                                objectsByScript[attributesName] : null
                            listObjects << currentObject
                        }
                        else
                        {
                            listObjects += objectsByScript[attributesName].findAll { scritpObject ->
                                scritpObject.UUID in scriptedBusinessObjectsSetupWizard.UUID
                            }
                        }

                        allObjectsToScheme << listObjects
                    }
                }
            }
        }
        scriptedBusinessObjectsSetupWizard.each {
            if (!(it.UUID in allObjectsToScheme.flatten().UUID))
            {
                allObjectsToScheme << [it]
            }
        }
        return allObjectsToScheme
    }

    /**
     * Метод добавления всех точек по стратегии 'Связь выбранных объектов'
     * @param allObjectsToScheme - все объекты для отображения на схеме
     * @param currentStrategy - текущая вкладка настроек из мастера
     * @param idElements - идентификатор элемента на схеме
     * @return все линии по соответствующей стратегии
     */
    Collection<Set<ISDtObject>> addPointsByRelatedObjects(Collection<Set<ISDtObject>> allObjectsToScheme,
                                                          Object currentStrategy,
                                                          SchemaWorkingElements idElements)
    {
        ElementsScheme elementsScheme = new ElementsScheme()
        Collection<Collection<ElementChart>> allSchemeToDisplay = []
        allObjectsToScheme.each { currentObjects ->
            Collection<ElementChart> currentScheme = []
            currentObjects.eachWithIndex { elementsCurrentScheme, idx ->
                currentScheme << elementsScheme.createHierarchyCommunicationPoint(
                    elementsCurrentScheme,
                    currentStrategy,
                    idElements.incrementId(),
                    null
                )
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
     * @param idElements - идентификатор элемента на схеме
     * @return все линии по соответствующей стратегии
     */
    void addLineByRelatedObjects(Object currentStrategy,
                                 Collection<Collection<ElementChart>> currentSchemeToDisplay,
                                 Collection listAttributes,
                                 Collection<Collection<ElementChart>> allSchemeToDisplay,
                                 SchemaWorkingElements idElements
                                )
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
                            ElementChart currentElementsScheme = scheme.find { objects
                                ->
                                objects?.UUID ==
                                objectSystem[attributesName].UUID && objects?.UUID != elementScheme
                            }
                            if (currentElementsScheme)
                            {
                                scheme += elementsScheme.createHierarchyCommunicationLine(
                                    null,
                                    currentStrategy,
                                    idElements.incrementId(),
                                    elementScheme.id,
                                    currentElementsScheme.id
                                )
                            }
                        }
                        else
                        {
                            objectSystem[attributesName].each { objectsAttributes ->
                                ElementChart currentElementsScheme = scheme.find {
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
                                        idElements.incrementId(),
                                        elementScheme.id,
                                        currentElementsScheme.id
                                    )
                                }
                            }
                        }
                    }
                }
            }
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
}