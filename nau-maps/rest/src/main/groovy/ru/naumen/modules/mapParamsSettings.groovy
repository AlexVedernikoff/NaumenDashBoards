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
 * Метод по "обрамлению" объекта трассы в правильный формат для фронта
 * @param trailBuilder - объект трассы собственного формата
 * @return "обрамленный" объект трассы
 */

private def mapTrail(TrailBuilder trailBuilder)
{
    Object getSettingsWizardSettings = new SettingsProvider().getSettings().defaultVisualization
    return trailBuilder ? [type        : trailBuilder.type,
                           geopositions: trailBuilder.geopositions,
                           parts       : trailBuilder.parts.findResults {
                               mapSection(it)
                           },
                           equipments  : trailBuilder.equipments.findResults {
                               mapPoint(it)
                           },
                           data        : trailBuilder,
                           color       : getSettingsWizardSettings?.colorLineMap?.get(0),
                           opacity     : getSettingsWizardSettings?.opacity?.get(0),
                           weight      : getSettingsWizardSettings?.width?.get(0),
                           lineStyle   : getSettingsWizardSettings?.lineStyle?.get(0)] : [:]
}

/**
 * Метод по "обрамлению" объекта участка трассы в правильный формат для фронта
 * @param partBuilder - объект участка трассы собственного формата
 * @return "обрамленный" объект участка трассы
 */
private def mapSection(SectionBuilder sectionBuilder)
{
    Object getSettingsWizardSettings = new SettingsProvider().getSettings().defaultVisualization
    return sectionBuilder ? [type        : sectionBuilder.type,
                             geopositions: sectionBuilder.geopositions,
                             data        : sectionBuilder,
                             color       : getSettingsWizardSettings?.colorLineMap?.get(0),
                             opacity     : getSettingsWizardSettings?.opacity?.get(0),
                             weight      : getSettingsWizardSettings?.width?.get(0),
                             lineStyle   : getSettingsWizardSettings?.lineStyle?.get(0)] : [:]
}

/**
 * Метод по "обрамлению" объекта оборудования в правильный формат для фронта
 * @param basePointBuilder - объект оборудования собственного формата
 * @return "обрамленный" объект оборудования
 */
private def mapPoint(BasePointBuilder basePointBuilder)
{
    Object getSettingsWizardSettings = new SettingsProvider().getSettings().defaultVisualization
    return basePointBuilder ? [type        : MapObjectType.POINT,
                               geopositions: basePointBuilder?.geopositions,
                               icon        : basePointBuilder?.icon,
                               data        : basePointBuilder,
                               color       : getSettingsWizardSettings?.colorLineMap?.get(0),
                               opacity     : getSettingsWizardSettings?.opacity?.get(0),
                               weight      : getSettingsWizardSettings?.width?.get(0),
                               lineStyle   : getSettingsWizardSettings?.lineStyle?.get(0)] : [:]
}
