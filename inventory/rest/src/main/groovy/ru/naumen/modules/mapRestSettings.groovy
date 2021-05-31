//Автор: atulisova
//Дата создания: 20.05.2021
//Код: mapRest
//Назначение:
/**
 * Лицензионный скриптовый модуль встроенного приложения "Inventory".
 *
 * Содержит служебные методы для получения данных самим ВП:
 * - метод получения списка трасс с участками и оборудованием
 * И методы, использование которых предполагается в mapParamsettings
 */
//Версия: 1.0
package ru.naumen.modules.inventory

import groovy.transform.EqualsAndHashCode
import groovy.transform.Field
import groovy.transform.TupleConstructor
import com.fasterxml.jackson.annotation.PropertyAccessor
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonValue
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Canonical

import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.metainfo.shared.Constants.UI

//БЛОК REST АПИ--------------------------------------------------------

/**
 * Метод для получения данных о трассах, оборудовании и их участках
 * @param objectUuid - uuid текущего объекта
 * @param contentUuid - uuid карточки объекта
 * @return данные о трассах в json формате
 */
def getTrails(String objectUuid, String contentUuid)
{
    def object = utils.get(objectUuid)
    def params = api.apps.contentParameters(object.getMetaClass().toString(), UI.WINDOW_KEY, contentUuid)

    def trails = modules.mapParamsSettings.trails()
    return new ObjectMapper().writeValueAsString(new Map(trails))
}

//БЛОК СКРИПТОВОГО АПИ--------------------------------------------------------

/**
 * Метод по созданию билдер-объекта трассы
 * @param object - объект трассы из БД
 * @return билдер-объект трассы
 */
public TrailBuilder createTrailBuilder(def object)
{
    return new TrailBuilder(object)
}

/**
 * Метод по созданию билдер-объекта участка трассы
 * @param object - объект участка трассы из БД
 * @return билдер-объект участка трассы
 */
public PartBuilder createPartBuilder(def object)
{
    return new PartBuilder(object)
}

/**
 * Метод по созданию билдер-объекта оборудования
 * @param type - тип оборудования
 * @param object - объект оборудования из БД
 * @return билдер-объект оборудования
 */
public EquipmentBuilder createEquipmentBuilder(MapObjectType type, def object)
{
    return new EquipmentBuilder(type, object)
}

/**
 * Метод по созданию билдер-объекта типа отображения
 * @return билдер-объект типа отображения
 */
public PresentationBuilder getPresentation()
{
    return new PresentationBuilder()
}

/**
 * Метод по созданию билдер-объекта действия над объектом
 * @return билдер-объект  действия над объектом
 */
public ActionBuilder getAction()
{
    return new ActionBuilder()
}


//СЛУЖЕБНЫЙ БЛОК--------------------------------------------------------
/**
 * Тип объекта, отображаемого на карте
 */
enum MapObjectType
{
    WOLS,
    PART,
    ACTIVE,
    PASSIVE

    @JsonValue
    public String getType()
    {
        return name().toString().toLowerCase()
    }
}

/**
 * Тип отображения
 */
enum PresentationType
{
    RIGHT_OF_LABEL,
    FULL_LENGTH,
    UNDER_LABEL
}

/**
 * Тип действия
 */
enum ActionType
{
    OPEN_LINK,
    CHANGE_RESPONSIBLE,
    CHANGE_STATE
}

/**
 * Тип оборудования
 */
enum EquipmentType
{
    CLUTCH,
    CROSS,
    OTHER

    @JsonValue
    public String getType()
    {
        return name().toString().toLowerCase()
    }
}

/**
 * Класс, описывающий формат для объектов, отправляемых на фронт
 */
@TupleConstructor()
class Map
{
    /**
     * Список трасс
     */
    Collection<MapObjectBuilder> trails
    /**
     * Список ошибок
     */
    Collection<String> errors
}

/**
 * Класс, описывающий "опции"(выводимые атрибуты) для объекта (для меню справа)
 */
@TupleConstructor()
class Option
{
    /**
     * Название опции
     */
    String label
    /**
     * Значение
     */
    Value value
    /**
     * Формат отображения
     */
    String presentation
}

/**
 * Класс, описывающий значение атрибута (для меню справа)
 */
class Value
{
    /**
     * Название объекта
     */
    String label
    /**
     * Ссылка на карточку объекта
     */
    String url
}

/**
 * Класс, описывающий действие
 */
@Canonical
class Action
{
    /**
     * Тип дейстивя
     */
    ActionType type
    /**
     * Название действия
     */
    String name

    public String getType()
    {
        return type.toString().toLowerCase()
    }

    public String getName()
    {
        return name
    }
}

/**
 * Класс, описывающий действие по открытию ссылки
 */
@Canonical
class OpenLinkAction extends Action
{
    /**
     * Ссылка
     */
    String link
    /**
     * Флаг на открытие в текущей вкладке
     */
    boolean inPlace
}

/**
 * мКласс, описывающий билдер-объект действия над объектом (в меню справа)
 */
class ActionBuilder
{
    OpenLinkAction openLink(String name, String link, boolean inPlace = false)
    {
        return new OpenLinkAction(name: name, link: link,inPlace: inPlace, type:ActionType.OPEN_LINK)
    }
}

/**
 * Класс, описывающий билдер-объект типа отображения подписи
 */
class PresentationBuilder
{
    public PresentationType rightOfLabel()
    {
        return PresentationType.RIGHT_OF_LABEL
    }

    public PresentationType fullLength()
    {
        return PresentationType.FULL_LENGTH
    }

    public PresentationType underLabel()
    {
        return PresentationType.UNDER_LABEL
    }
}

/**
 * Класс, описывающий объект геопозиции
 */
@TupleConstructor()
@EqualsAndHashCode
class Geoposition
{
    /**
     * Широта
     */
    Double latitude
    /**
     * Долгота
     */
    Double longitude
}

/**
 *
 */
@InjectApi
class TrailBuilder extends MapObjectBuilder
{
    @JsonIgnore
    Collection<PartBuilder> parts
    @JsonIgnore
    Collection<EquipmentBuilder> equipments
    @JsonInclude(Include.NON_NULL)
    String color

    protected TrailBuilder()
    {
        super(MapObjectType.WOLS, null)
    }

    protected TrailBuilder(def object)
    {
        super(MapObjectType.WOLS, object)
    }

    TrailBuilder setColor(String color)
    {
        this.color = color
        return this
    }

    TrailBuilder setParts(Collection<IUUIDIdentifiable> dbParts)
    {
        this.parts = dbParts?.findResults {
            if(it && it.title && it.siteA && it.siteB)
            {
                return modules.mapRestSettings.createPartBuilder(it)
                              .setHeader(it.title)
                              .setColor(it.HEXcolor)
                              .addOption('Площадка А',
                                         new Value(label: it.siteA.title, url: api.web.open(it.siteA.UUID)))
                              .addOption('Площадка Б',
                                         new Value(label: it.siteB.title, url: api.web.open(it.siteB.UUID)))
                              .addOption('Входит в ВОЛС',
                                         new Value(label: this.object.title, url: api.web.open(this.object.UUID)))
                              .setGeopositions(it)
                              .addAction('Перейти на карточку', api.web.open(it.UUID))

            }

        }
        return this
    }

    TrailBuilder setEquipments(Collection dbParts)
    {
        this.equipments = dbParts?.collectMany { dbPart ->
            if(dbPart && dbPart.title && dbPart.siteA && dbPart.siteB)
            {
                def dbEquipmetnts = []
                dbEquipmetnts = dbEquipmetnts + dbPart.siteA.cmdb + dbPart.siteB.cmdb

                return dbEquipmetnts?.findResults { equipment ->
                    if(equipment && equipment.title && equipment.ciModel && equipment.location)
                    {
                        Boolean equipIsActive = equipment.getMetaClass().code.toLowerCase().contains('active')
                        return modules.mapRestSettings.createEquipmentBuilder(equipIsActive
                                              ? MapObjectType.ACTIVE
                                              : MapObjectType.PASSIVE , equipment)
                                      .setHeader(equipment.title)
                                      .setIcon(equipment)
                                      .setEquipType(equipIsActive ? null : equipment)
                                      .setGeoposition(equipment)
                                      .addAction('Перейти на карточку', api.web.open(equipment.UUID))
                                      .addOption('Модель',
                                                 new Value(label: equipment.ciModel.title, url: api.web.open(equipment.ciModel.UUID)))
                                      .addOption('Расположение',
                                                 new Value(label: equipment.location.title, url: api.web.open(equipment.location.UUID)))
                    }
                } ?: []
            }
            return []
        }.unique{ it.uuid }
        return this
    }
}

/**
 * Класс, огписывающий билдер-объект участка трассы
 */
class PartBuilder extends MapObjectBuilder
{
    protected PartBuilder()
    {
        super(MapObjectType.PART, null)
    }

    protected PartBuilder(def object)
    {
        super(MapObjectType.PART, object)
    }
    /**
     * Геопозиции начала и конца участка
     */
    @JsonIgnore
    Collection<Geoposition> geopositions

    /**
     * Цвет отображаемой линии
     */
    @JsonInclude(Include.NON_NULL)
    String color

    PartBuilder setGeopositions(def dbPart)
    {
        Collection<Geoposition> geopositions = []
        if(dbPart && dbPart.siteA && dbPart.siteB)
        {
            geopositions.add(new Geoposition(latitude: dbPart.siteA.gradLat, longitude: dbPart.siteA.gradLong))
            geopositions.add(new Geoposition(latitude: dbPart.siteB.gradLat, longitude: dbPart.siteB.gradLong))
        }

        this.geopositions = geopositions
        return this
    }

    PartBuilder setColor(String color)
    {
        this.color = color
        return this
    }
}

/**
 * Класс, описывающий билдер-объект оборудования
 */
class EquipmentBuilder extends MapObjectBuilder
{
    protected EquipmentBuilder()
    {
        super(MapObjectType.ACTIVE, null)
    }

    protected EquipmentBuilder(MapObjectType type)
    {
        super(type, null)
    }

    protected EquipmentBuilder(MapObjectType type, def object)
    {
        super(type, object)
    }
    /**
     * Геопозиция
     */
    @JsonIgnore
    Geoposition geoposition

    /**
     * Тип оборудования
     */
    @JsonInclude(Include.NON_NULL)
    EquipmentType equipType

    /**
     * Иконка для отображения (ссылкой)
     */
    @JsonIgnore
    String icon

    EquipmentBuilder setGeoposition(def dbEquip)
    {
        this.geoposition = dbEquip && dbEquip.location
            ? new Geoposition(latitude: dbEquip.location.gradLat, longitude: dbEquip.location.gradLong)
            : null
        return this
    }

    EquipmentBuilder setIcon(def dbEquip)
    {
        String fileUuid = dbEquip?.classification?.icon?.find()?.UUID ?: ''
        this.icon = fileUuid ? "/sd/operator/download?uuid=${fileUuid}" : ''
        return this
    }

    EquipmentBuilder setEquipType(def dbEquip = null)
    {
        EquipmentType equipType = null
        if(dbEquip)
        {
            if(dbEquip.classification.UUID == 'classification$3605')
            {
                equipType = EquipmentType.CLUTCH
            }
            else if(dbEquip.classification.UUID == 'classification$3604')
            {
                equipType = EquipmentType.CROSS
            }
            else
            {
                equipType = EquipmentType.OTHER
            }
        }
        this.equipType = equipType
        return this
    }
}

/**
 * Класс, описывающий в целом все объекты, которые будут на карте
 */
class MapObjectBuilder
{
    /**
     * Тип объекта
     */
    final MapObjectType type
    /**
     * Уникальный идентификатор объекта
     */
    final String uuid
    /**
     * Сам объект
     */
    @JsonIgnore
    final IUUIDIdentifiable object
    /**
     *  Название
     */
    String header

    /**
     * Список возможных действий с объектом (для меню справа)
     */
    List<Action> actions = new ArrayList<>()
    /**
     * Список возможных данных об объекте (для меню справа)
     */
    List<Option> options = new ArrayList<>()

    protected MapObjectBuilder(MapObjectType type, Object object)
    {
        this.type = type
        this.uuid = object?.UUID
        this.object = object
    }

    public MapObjectBuilder setHeader(String header)
    {
        this.header = header

        return this
    }

    public MapObjectBuilder addOption(String label, Value value, PresentationType presentation = PresentationType.RIGHT_OF_LABEL)
    {
        this.options.add(new Option(label: label, value: value, presentation: presentation.name().toLowerCase()))

        return this
    }

    public MapObjectBuilder addAction(Action action)
    {
        this.actions.add(action)

        return this
    }

    public MapObjectBuilder addAction(String name, String link, boolean inPlace = false)
    {
        this.actions.add(new OpenLinkAction(name: name, link: link, inPlace: inPlace, type:ActionType.OPEN_LINK))

        return this
    }

    MapObjectBuilder setActions(List<Action> actions)
    {
        this.actions = actions

        return this
    }
}