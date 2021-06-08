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
 * Метод по получению данных из БД о трассах(их участках и оборудовании на учасках)
 * @return список данных из БД
 */
def getTrails()
{
    return api.utils.find('link$vols', [:]).findResults {
        createTrail(it)?.with { mapTrail(it)}
    }
}

/**
 * Метод по формированию данных о трассе
 * @param dbTrail - объект трассы из БД
 * @return объект с данными о трассе другого формата
 */
private TrailBuilder createTrail(def dbTrail)
{
    return dbTrail && dbTrail.siteA && dbTrail.siteB && dbTrail.title && dbTrail.nestSegmVols
        ? modules.mapRestSettings.createTrailBuilder(dbTrail)
                 .setHeader(dbTrail.title)
                 .setColor(dbTrail.HEXcolor)
                 .addOption('Площадка А',
                            new Value(label: dbTrail.siteA.title, url: api.web.open(dbTrail.siteA.UUID)))
                 .addOption('Площадка Б',
                            new Value(label: dbTrail.siteB.title, url: api.web.open(dbTrail.siteB.UUID)))
                 .setParts(dbTrail.nestSegmVols)
                 .setEquipments(dbTrail.nestSegmVols)
                 .addAction('Перейти на карточку', api.web.open(dbTrail.UUID))
        : null
}

/**
 * Метод по "обрамлению" объекта трассы в правильный формат для фронта
 * @param trailBuilder - объект трассы собственного формата
 * @return "обрамленный" объект трассы
 */
private def mapTrail(TrailBuilder trailBuilder)
{
    return trailBuilder ? [type: trailBuilder.type,
                           parts     : trailBuilder.parts.findResults { mapPart(it) },
                           equipments: trailBuilder.equipments.findResults { mapEquipment(it) },
                           data      : trailBuilder] : [:]
}

/**
 * Метод по "обрамлению" объекта участка трассы в правильный формат для фронта
 * @param partBuilder - объект участка трассы собственного формата
 * @return "обрамленный" объект участка трассы
 */
private def mapPart(PartBuilder partBuilder)
{
    return partBuilder ? [type        : partBuilder.type,
                          geopositions: partBuilder.geopositions,
                          data        : partBuilder] : [:]
}

/**
 * Метод по "обрамлению" объекта оборудования в правильный формат для фронта
 * @param equipmentBuilder - объект оборудования собственного формата
 * @return "обрамленный" объект оборудования
 */
private def mapEquipment(EquipmentBuilder equipmentBuilder)
{
    return equipmentBuilder ? [type       : equipmentBuilder?.type,
                               geoposition: equipmentBuilder?.geoposition,
                               icon       : equipmentBuilder?.icon,
                               data       : equipmentBuilder] : [:]
}