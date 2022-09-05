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

/**
 * Метод по получению данных из БД через Мастер настроек
 * @param nameContent - имя контента
 * @return список данных из БД
 */
Object getDataDisplayScheme(String nameContent)
{
    SchemesSettings settings = new SettingsProviderSchemes().getSettings()
    Collection<AbstractSchemesCharacteristics> abstractCharacteristicsData =
        settings?.abstractSchemesCharacteristics
    Collection<String> pointScriptText = getListScript(abstractCharacteristicsData.first())
    String linkAttribute =
        abstractCharacteristicsData.first()?.strategies?.pathCoordinatLongitud.first()
    String pointA = abstractCharacteristicsData.first()?.strategies?.pointA.first()
    String pointB = abstractCharacteristicsData.first()?.strategies?.pointB.first()

    Collection<MapObjectBuilder> pointData = []

    String scriptLineAttributeData = "${ pointScriptText.first() }.${ linkAttribute }"
    String scriptPointAAttributeData = "${ pointScriptText.first() }.${ linkAttribute }.${ pointA }"
    String scriptPointBAttributeData = "${ pointScriptText.first() }.${ linkAttribute }.${ pointB }"
    try
    {
        ScriptDtOList dataLine = api.utils.executeScript(scriptLineAttributeData)
        Collection dataPointA = api.utils.executeScript(scriptPointAAttributeData)
        Collection dataPointB = api.utils.executeScript(scriptPointBAttributeData)

        pointData += collectingData(dataLine, dataPointA, dataPointB)
    }
    catch (Exception ex)
    {
        logger.info("Передан неверный скрипт!")
    }
    return pointData
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
 * Метод сохранения данных о линиях и точках для отображения на карте
 * @param dataLine - данные по атрибуту объекта
 * @param dataPointA - данные по связанному атрибуту по точке А
 * @param dataPointB - данные по связанному атрибуту по точке B
 * @return колекцию данных для отображения заданных на вкладе
 */
Collection<HierarchyCommunicationBuilder> collectingData(ScriptDtOList dataLine,
                                                         Collection dataPointA,
                                                         Collection dataPointB)
{
    Set<HierarchyCommunicationBuilder> pointData = []
    Collection settings = new SettingsProviderSchemes()
        .getSettings()
        ?.abstractSchemesCharacteristics?.first()?.strategies?.characteristicsOutputDiagram?.first()
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