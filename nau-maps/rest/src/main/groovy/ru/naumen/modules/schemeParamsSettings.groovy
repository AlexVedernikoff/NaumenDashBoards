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
import static groovy.json.JsonOutput.toJson

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
 * @return колекция скриптов
 */
Collection<String> getListScript(AbstractSchemesCharacteristics data)
{
    Collection<String> dataScriptText = []
    data?.strategies?.each
        {
            String stouk = it?.scriptText
            dataScriptText.add(stouk)
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
    Integer id = 0;

    for (int i = 0; i < dataLine.size(); i++)
    {
        if (dataPointB[i] != null)
        {
            if (i == 0)
            {
                pointData +=
                    modules.schemeRestSettings.createHierarchyCommunicationPoint(
                        dataPointA[i],
                        ++id
                    )
                           ?.with(this.&schemeHierarchy)
                pointData += modules.schemeRestSettings.createHierarchyCommunicationLine(
                    dataLine[i],
                    ++id,
                    id - 1
                )?.with(this.&schemeHierarchy)
                pointData += modules.schemeRestSettings.createHierarchyCommunicationPoint(
                    dataPointB[i],
                    ++id,
                    id - 2
                )?.with(this.&schemeHierarchy)
                if (dataLine.size() > 1)
                {
                    pointData += modules.schemeRestSettings.createHierarchyCommunicationLine(
                        dataLine[i],
                        ++id,
                        id - 1
                    )?.with(this.&schemeHierarchy)
                }
            }
            else
            {
                if (dataPointA[i].UUID == dataPointB[i - 1].UUID)
                {
                    pointData += modules.schemeRestSettings.createHierarchyCommunicationPoint(
                        dataPointB[i],
                        ++id,
                        id - 2
                    )?.with(this.&schemeHierarchy)
                    if ((i + 1) != dataLine.size())
                    {
                        if (dataPointB[i].UUID == dataPointA[i + 1].UUID)
                        {
                            pointData +=
                                modules.schemeRestSettings.createHierarchyCommunicationLine(
                                    dataLine[i],
                                    ++id,
                                    id - 1
                                )?.with(this.&schemeHierarchy)
                        }
                        else
                        {
                            pointData.each {
                                String descData = settings?.mainText?.first() ?
                                    dataPointA[i + 1]."${ settings?.mainText?.first() }" : ''
                                if ((it.desc == descData))
                                {
                                    pointData +=
                                        modules.schemeRestSettings.createHierarchyCommunicationLine(
                                            dataLine[i],
                                            ++id,
                                            it.id
                                        )?.with(this.&schemeHierarchy)
                                    pointData +=
                                        modules
                                            .schemeRestSettings.createHierarchyCommunicationPoint(
                                            dataPointB[i + 1],
                                            ++id,
                                            it.id
                                        )?.with(this.&schemeHierarchy)
                                    if ((i + 2) != dataLine.size())
                                    {
                                        pointData +=
                                            modules
                                                .schemeRestSettings
                                                .createHierarchyCommunicationLine(
                                                    dataLine[i],
                                                    ++id,
                                                    id - 1
                                                )?.with(this.&schemeHierarchy)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return pointData
}

/**
 * Метод по "обрамлению" объекта трассы в правильный формат для фронта
 * @param trailBuilder - объект трассы собственного формата
 * @return "обрамленный" объект трассы
 */
private def schemeHierarchy(HierarchyCommunicationBuilder hierarchyCommunicationBuilder)
{
    return hierarchyCommunicationBuilder ? [desc: hierarchyCommunicationBuilder.desc,
                                            from: hierarchyCommunicationBuilder.from,
                                            id: hierarchyCommunicationBuilder.id,
                                            title: hierarchyCommunicationBuilder.title,
                                            to: hierarchyCommunicationBuilder.to,
                                            type: hierarchyCommunicationBuilder.type] : [:]
}