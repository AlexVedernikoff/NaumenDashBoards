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
import groovy.transform.TupleConstructor
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonValue
import com.fasterxml.jackson.annotation.JsonAutoDetect
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Canonical
import ru.naumen.core.server.script.spi.ScriptDtObject
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.shared.dto.ISDtObject
import ru.naumen.core.server.script.api.injection.InjectApi

//БЛОК REST АПИ--------------------------------------------------------

/**
 * Метод для получения данных об объектах для вывода на карту
 * @param objectUuid - uuid текущего объекта
 * @param contentUuid - uuid карточки объекта
 * @return данные о трассах в json формате
 */
String getMapObjects(String objectUuid, String contentUuid)
{
    ScriptDtObject object = utils.get(objectUuid)
    return getMapInfo(object, contentUuid)
}

//СЛУЖЕБНЫЙ БЛОК--------------------------------------------------------------
/**
 * Метод, позволяющий получить информацию для вывода на карту
 * @param object - текущий объект, карточка которого открыта
 * @param contentUuid - uuid карточки объекта
 * @return данные о трассах в json формате
 */
private String getMapInfo(ScriptDtObject object, String contentUuid)
{
    MapSettings getSettingsWizardSettings = new SettingsProvider().getSettings()
    APISettings mapApiKey = getSettingsWizardSettings?.interfaceSettings.first()
    Collection<String> errors = []
    Collection<LinkedHashMap> objects =
        callParamsSettingsMethod(errors, 'Нет данных для отображения', [], contentUuid)
    LinkedHashMap aggregations = [objects: objects, errors: errors, mapApiKey: mapApiKey]
    return new ObjectMapper().writeValueAsString(aggregations)
}

/**
 * Метод вызовы метода, заложенного в настройках ВП
 * @param errors - список ошибок
 * @param errorText - текст ошибки
 * @param defaultValue - значение по умолчанию на случай, если произошла ошибка
 * @param contentUuid - uuid карточки объекта
 * @param objects - список объектов-параметров метода
 * @return результат вызова метода с названием methodName или значение по умолчанию, ошибку в списке и информацию в логе
 */
private Collection<LinkedHashMap> callParamsSettingsMethod(Collection<String> errors,
                                                           String errorText,
                                                           Collection defaultValue,
                                                           String contentUuid)
{
    try
    {
        return new DataGeneration().getDataDisplayMap(contentUuid) ?: defaultValue
    }
    catch (Exception ex)
    {
        errors.add(errorText)
        logger.error("#mapRestSettings> ${ ex.message }", ex)
    }
    return defaultValue
}

//БЛОК СКРИПТОВОГО АПИ--------------------------------------------------------
@InjectApi
class ElementsMap
{
    /**
     * Метод по созданию билдер-объекта трассы
     * @param object - объект трассы из БД
     * @return билдер-объект трассы
     */
    public TrailBuilder createTrailBuilder(ISDtObject object)
    {
        return new TrailBuilder(object)
    }

    /**
     * Метод по формированию данных о трассе
     * @param dbTrail - объект трассы из БД
     * @param strategie - список настроек из мастера для линий
     * @return объект с данными о трассе другого формата
     */
    private TrailBuilder createTrail(ISDtObject dbTrail, OutputObjectStrategies strategie)
    {
        Object defaultSettingsWizardSettings = new SettingsProvider()
            .getSettings()?.defVisualization

        String color = strategie?.color ? dbTrail[strategie?.color] :
            defaultSettingsWizardSettings?.colorLineMap
        String opacity = strategie?.opacity ? dbTrail[strategie?.opacity] :
            defaultSettingsWizardSettings?.opacity
        String width =
            strategie?.weight ? dbTrail[strategie?.weight] : defaultSettingsWizardSettings?.width
        String lineStyle = strategie.lineStyle ?: defaultSettingsWizardSettings.lineStyle

        return dbTrail && dbTrail.siteA && dbTrail.siteB && dbTrail.title
            ? createTrailBuilder(dbTrail)
            .setHeader(dbTrail.title)
            .setColor(color)
            .setOpacity(opacity)
            .setWidth(width)
            .setLineStyle(lineStyle)
            .setGeopositions(dbTrail)
            .addOption(
                'Площадка А',
                new Value(label: dbTrail.siteA.title, url: api.web.open(dbTrail.siteA.UUID))
            )
            .addOption(
                'Площадка Б',
                new Value(label: dbTrail.siteB.title, url: api.web.open(dbTrail.siteB.UUID))
            )
            .setParts(dbTrail)
            .setEquipments(dbTrail)
            .addAction('Перейти на карточку', api.web.open(dbTrail.UUID))
            : null
    }

    /**
     * Метод по созданию билдер-объекта участка трассы
     * @param object - объект участка трассы из БД
     * @return билдер-объект участка трассы
     */
    public SectionBuilder createSectionBuilder(ISDtObject object)
    {
        return new SectionBuilder(object)
    }

    /**
     * Метод формирования объекта - участка трассы
     * @param dbPart - участок трассы из БД
     * @return сформированный участок трассы
     */
    public SectionBuilder createPart(ISDtObject dbPart)
    {
        if (dbPart && dbPart.title && dbPart.siteA && dbPart.siteB)
        {
            return createSectionBuilder(dbPart)
                .setHeader(dbPart.title)
                .setColor(dbPart.HEXcolor)
                .addOption(
                    'Площадка А',
                    new Value(label: dbPart.siteA.title, url: api.web.open(dbPart.siteA.UUID))
                )
                .addOption(
                    'Площадка Б',
                    new Value(label: dbPart.siteB.title, url: api.web.open(dbPart.siteB.UUID))
                )
                .setGeopositions(
                    dbPart.gradLatA,
                    dbPart.gradLongA,
                    dbPart.gradLatB,
                    dbPart.gradLongB
                )
                .addAction('Перейти на карточку', api.web.open(dbPart.UUID))
        }
    }

    /**
     * Метод формирования объекта отрезка(не связанного с трассами)
     * @param section - отрезов из БД
     * @return сформированный объект отрезка
     */
    public SectionBuilder createSection(ISDtObject section)
    {
        if (section && section.title && section.siteA && section.siteB)
        {
            return createSectionBuilder(section)
                .setHeader(section.title)
                .setColor(section.HEXcolor)
                .addOption(
                    'Площадка А',
                    new Value(label: section.siteA.title, url: api.web.open(section.siteA.UUID))
                )
                .addOption(
                    'Площадка Б',
                    new Value(label: section.siteB.title, url: api.web.open(section.siteB.UUID))
                )
                .setGeopositions(section)
                .addAction('Перейти на карточку', api.web.open(section.UUID))
        }
    }

    /**
     * Метод по созданию билдер-объекта оборудования
     * @param type - тип оборудования
     * @param object - объект оборудования из БД
     * @return билдер-объект оборудования
     */
    public BasePointBuilder createPointObjectBuilder(MapObjectType type, ISDtObject object)
    {
        return new BasePointBuilder(type, object)
    }

    /**
     * Метод формирования точечного объекта оборудования
     * @param equipment - оборудование из БД
     * @param strategie - список настроек из мастера
     * @param indexElement - индекс текущего элемента
     * @return сформированный объект оборудования
     */
    BasePointBuilder createEquipmentPoint(ISDtObject equipment,
                                          OutputObjectStrategies strategie,
                                          Integer indexElement = 0)
    {
        CharacteristicsDisplayListObjects settings = new SettingsProvider()
            .getSettings()?.defVisualization?.points?.first()
        String codeAttributeGroup = settings?.attributeGroup
        String codeMetaClass = settings?.metaClassObject.id

        Collection attributesFromGroup =
            api.metainfo.getMetaClass(codeMetaClass)
               .getAttributeGroup(codeAttributeGroup).attributes

        if (equipment && equipment.title && equipment.ciModel && equipment.location)
        {
            Boolean equipIsActive = equipment.getMetaClass().code.toLowerCase().contains('active')
            BasePointBuilder formedEquipmentObject = createPointObjectBuilder(
                equipIsActive
                    ? MapObjectType.ACTIVE
                    : MapObjectType.PASSIVE, equipment
            )
                .setHeader(equipment.title)
                .setIcon(equipment)
                .setGeopositions(equipment, strategie)
                .addAction('Перейти на карточку', api.web.open(equipment.UUID))
            attributesFromGroup.each {
                String valueLabel
                String linkElement
                try
                {
                    valueLabel = equipment[it.code] ?: 'не указано'
                    linkElement = api.web.open(equipment[it.code].UUID)
                }
                catch (Exception ex)
                {
                    valueLabel =
                        api.utils.find(codeMetaClass, [:])[indexElement][it.code] ?: 'не указано'
                    api.metainfo.getMetaClass(codeMetaClass).attributes.each { currentAttribute ->
                        if (currentAttribute.code == it.code && currentAttribute.type == 'object')
                        {
                            linkElement = api.web.open(
                                api.utils.find(codeMetaClass, [:])[indexElement][it.code]?.UUID
                            )
                        }
                    }
                }
                formedEquipmentObject
                    .addOption(it.title, new Value(label: valueLabel, url: linkElement))
            }
            return formedEquipmentObject
        }
    }

    /**
     * Метод для формирования объекта точки(не связанного с трассами)
     * @param pointObject - точенчый объект
     * @return сформированный объект точки
     */
    BasePointBuilder createPoint(ISDtObject pointObject)
    {
        if (pointObject && pointObject.title)
        {
            return createPointObjectBuilder(MapObjectType.POINT, pointObject)
                .setHeader(pointObject.title)
                .setIcon(pointObject)
                .setGeopositions(pointObject.gradLat, pointObject.gradLong)
                .addAction('Перейти на карточку', api.web.open(pointObject.UUID))
                .addOption('Адрес', new Value(label: pointObject?.addressStr ?: 'нет уточнений'))
        }
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
    PASSIVE,
    POINT,
    SECTION

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
    Collection<MapObjectBuilder> objects
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
    String label = ''
    /**
     * Ссылка на карточку объекта
     */
    String url = ''
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
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class ActionBuilder
{
    OpenLinkAction openLink(String name, String link, boolean inPlace = false)
    {
        return new OpenLinkAction(
            name: name,
            link: link,
            inPlace: inPlace,
            type: ActionType.OPEN_LINK
        )
    }
}

/**
 * Класс, описывающий билдер-объект типа отображения подписи
 */
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
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
    Collection<SectionBuilder> parts
    @JsonIgnore
    Collection<BasePointBuilder> equipments
    @JsonInclude(Include.NON_NULL)
    ElementsMap elementsMap = new ElementsMap()
    @JsonInclude(Include.NON_NULL)
    String color

    /**
     * Прозрачность элемента
     */
    String opacity

    /**
     * Толщина линии
     */
    String width

    /**
     * Тип линии
     */
    String lineStyle

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

    TrailBuilder setOpacity(String opacity)
    {
        this.opacity = opacity
        return this
    }

    TrailBuilder setWidth(String width)
    {
        this.width = width
        return this
    }

    TrailBuilder setLineStyle(String lineStyle)
    {
        this.lineStyle = lineStyle
        return this
    }

    TrailBuilder setGeopositions(def dbTrail)
    {
        Collection<Geoposition> geopositions = []
        if (dbTrail && dbTrail.siteA && dbTrail.siteB)
        {
            geopositions.add(
                new Geoposition(
                    latitude: dbTrail.siteA.gradLat,
                    longitude: dbTrail.siteA.gradLong
                )
            )
            geopositions.add(
                new Geoposition(
                    latitude: dbTrail.siteB.gradLat,
                    longitude: dbTrail.siteB.gradLong
                )
            )
        }

        this.geopositions = geopositions
        return this
    }

    TrailBuilder setParts(ISDtObject dbParts)
    {
        if (dbParts && dbParts.title && dbParts.siteA && dbParts.siteB)
        {
            this.parts = [elementsMap.createPart(dbParts)]
        }
        return this
    }

    TrailBuilder setEquipments(ISDtObject dbParts)
    {
        this.equipments = []
        return this
    }

}

/**
 * Класс, огписывающий билдер-объект участка трассы
 */
class SectionBuilder extends MapObjectBuilder
{
    protected SectionBuilder()
    {
        super(MapObjectType.SECTION, null)
    }

    protected SectionBuilder(def object)
    {
        super(MapObjectType.SECTION, object)
    }

    /**
     * Цвет отображаемой линии
     */
    @JsonInclude(Include.NON_NULL)
    String color

    SectionBuilder setGeopositions(ISDtObject dbPart)
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

    SectionBuilder setGeopositions(Double latitudeA, Double longitudeA, Double latitudeB, Double longitudeB)
    {
        if(latitudeA && latitudeB && longitudeA&& longitudeB)
        {
            this.geopositions.add(new Geoposition(latitude:  latitudeA, longitude: longitudeA))
            this.geopositions.add(new Geoposition(latitude:  latitudeB, longitude: longitudeB))
        }
        return this
    }

    SectionBuilder setColor(String color)
    {
        this.color = color
        return this
    }
}

/**
 * Класс, описывающий билдер-объект оборудования
 */
class BasePointBuilder extends MapObjectBuilder
{
    protected BasePointBuilder()
    {
        super(MapObjectType.ACTIVE, null)
    }

    protected BasePointBuilder(MapObjectType type)
    {
        super(type, null)
    }

    protected BasePointBuilder(MapObjectType type, def object)
    {
        super(type, object)
    }
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

    BasePointBuilder setGeopositions(ISDtObject dbEquip, OutputObjectStrategies strategie)
    {
        def geoposition = dbEquip && dbEquip.location
            ? new Geoposition(
            latitude: dbEquip.location[strategie.pathLatitudeCoordinates],
            longitude: dbEquip.location[strategie.pathLongitudeCoordinates]
        )
            : null
        if(geoposition)
        {
            this.geopositions = [geoposition]
        }
        return this
    }

    BasePointBuilder setGeopositions(Double latitude, Double longitude)
    {
        def geoposition = latitude && longitude
            ? new Geoposition(latitude: latitude, longitude: longitude)
            : null
        if(geoposition)
        {
            this.geopositions = [geoposition]
        }
        return this
    }

    BasePointBuilder setIcon(def dbEquip)
    {
        String fileUuid = dbEquip?.classification?.icon?.find()?.UUID ?: ''
        this.icon = fileUuid ? "/sd/operator/download?uuid=${fileUuid}" : ''
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
    List<Action> actions = []
    /**
     * Список возможных данных об объекте (для меню справа)
     */
    List<Option> options = []

    /**
     * Геопозиции начала и конца участка
     */
    @JsonIgnore
    List<Geoposition> geopositions = []

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