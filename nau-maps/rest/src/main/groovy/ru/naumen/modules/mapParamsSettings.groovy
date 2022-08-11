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
Object getObjects(def object, def user)
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
Object test(def object, def user)
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
 * Метод получения колекции всех стриптов
 * @param data данные из мастера настроек
 * @return колекция скриптов
 */
Collection<String> getListScript(AbstractPointCharacteristics data)
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
 * @param listStrategy - список всех стратегий вкладки
 * @param nameContent - имя контента
 * @param scriptText - список всех скриптов вкладки
 * @param dataAboutPpointsOrLines - данные о точках или линиях
 * @return колекцию данных для отображения данных на вкладе
 */
Collection<MapObjectBuilder> collectingData(Collection<String> listStrategy,
                                            String nameContent,
                                            Collection<String> scriptText,
                                            Boolean dataAboutPpointsOrLines)
{
    Collection<MapObjectBuilder> pointData = []
    listStrategy.each { strategy ->
        Collection<IAppContentInfo> contentInfo = api.apps.listContents(strategy).contentUuid
        contentInfo.each { contentMasters ->
            if (contentMasters == nameContent)
            {
                scriptText.each { script ->
                    String executeScriptText = script
                    try
                    {

                        ScriptDtOList executeScript = api.utils.executeScript(executeScriptText)
                        if (dataAboutPpointsOrLines)
                        {
                            pointData += executeScript.findResults {
                                modules.mapRestSettings.createEquipmentPoint(it)
                                       ?.with(this.&mapPoint)
                            }

                        }
                        else
                        {
                            pointData += executeScript.findResults {
                                modules.mapRestSettings.createTrail(it)?.with(this.&mapTrail)
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
    return pointData
}

/**
 * Метод по "обрамлению" объекта трассы в правильный формат для фронта
 * @param trailBuilder - объект трассы собственного формата
 * @return "обрамленный" объект трассы
 */
private LinkedHashMap mapTrail(TrailBuilder trailBuilder)
{
    Object getSettingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
    return trailBuilder ? [type        : trailBuilder.type,
                           geopositions: trailBuilder.geopositions,
                           parts       : trailBuilder.parts.findResults { mapSection(it) },
                           equipments  : trailBuilder.equipments.findResults { mapPoint(it) },
                           data        : trailBuilder,
                           color       : getSettingsWizardSettings?.colorLineMap,
                           opacity     : getSettingsWizardSettings?.opacity,
                           weight      : getSettingsWizardSettings?.width,
                           lineStyle   : getSettingsWizardSettings?.lineStyle] : [:]
}

/**
 * Метод по "обрамлению" объекта участка трассы в правильный формат для фронта
 * @param partBuilder - объект участка трассы собственного формата
 * @return "обрамленный" объект участка трассы
 */
private LinkedHashMap mapSection(SectionBuilder sectionBuilder)
{
    Object getSettingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
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
    Object getSettingsWizardSettings = new SettingsProvider().getSettings()?.defVisualization
    return basePointBuilder ? [type        : MapObjectType.POINT,
                               geopositions: basePointBuilder?.geopositions,
                               icon        : basePointBuilder?.icon,
                               data        : basePointBuilder,
                               color       : getSettingsWizardSettings?.colorLineMap,
                               opacity     : getSettingsWizardSettings?.opacity,
                               weight      : getSettingsWizardSettings?.width,
                               lineStyle   : getSettingsWizardSettings?.lineStyle] : [:]
}
