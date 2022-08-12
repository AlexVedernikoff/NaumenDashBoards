//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: schemeParamsSettings
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Schemes".
 * Содержит методы, определяющие данные для передачи на схему
 */
//Версия SMP: 4.11
package ru.naumen.modules.inventory

import ru.naumen.core.server.script.spi.ScriptDtOList

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

    Collection<MapObjectBuilder> pointData = []

    String scriptAttributeData = "${ pointScriptText.first() }.${ linkAttribute }"
    try
    {
        ScriptDtOList dataAttribute = api.utils.executeScript(scriptAttributeData)
        if (dataAttribute instanceof ArrayList)
        {
            pointData += dataAttribute.findResults {
                collectingData(it)
            }
        }
        else
        {
            pointData += collectingData(dataAttribute)
        }
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
 * @param dataAttribute - данные по атрибуту объекта
 * @return колекцию данных для отображения заданных на вкладе
 */
Collection<HierarchyCommunicationBuilder> collectingData(def dataAttribute)
{
    Collection<HierarchyCommunicationBuilder> pointData = []
    Collection<HierarchyCommunicationBuilder> lineData = []
    Integer id = 0;
    pointData += dataAttribute.findResults {
        modules.schemeRestSettings.createHierarchyCommunicationPoint(it, ++id)
               ?.with(this.&schemeHierarchy)
    }
    for (int i = 1; i < pointData.size(); i++)
    {
        lineData +=
            modules.schemeRestSettings.createHierarchyCommunicationLine(pointData[i], ++id, i)
                   ?.with(this.&schemeHierarchy)
    }
    return pointData + lineData
}

/**
 * Метод по "обрамлению" объекта трассы в правильный формат для фронта
 * @param trailBuilder - объект трассы собственного формата
 * @return "обрамленный" объект трассы
 */
private def schemeHierarchy(def hierarchyCommunicationBuilder)
{
    return hierarchyCommunicationBuilder ? [desc : hierarchyCommunicationBuilder.desc,
                                            from : hierarchyCommunicationBuilder.from,
                                            id   : hierarchyCommunicationBuilder.id,
                                            title: hierarchyCommunicationBuilder.title,
                                            to   : hierarchyCommunicationBuilder.to,
                                            type : hierarchyCommunicationBuilder.type] : [:]
}



