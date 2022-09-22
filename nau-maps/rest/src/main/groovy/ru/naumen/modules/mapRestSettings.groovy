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
import static com.amazonaws.util.json.Jackson.toJsonString as toJson
import org.jsoup.Jsoup
import org.jsoup.select.Elements
import org.jsoup.nodes.Document
import ru.naumen.core.server.script.spi.ScriptDtOList
import com.google.gson.internal.LinkedTreeMap

//БЛОК REST АПИ--------------------------------------------------------

/**
 * Метод для получения данных об объектах для вывода на карту
 * @param objectUuid - uuid текущего объекта
 * @param contentUuid - uuid карточки объекта
 * @param userUuid - информация о текущем пользователе
 * @return данные о трассах в json формате
 */
String getMapObjects(String subjectUuid, String contentUuid, LinkedTreeMap userUuid)
{
    Object subjectObject = api.utils.get(subjectUuid)
    Object userObject = userUuid['admin'] ?: api.utils.get(userUuid['uuid'])
    LinkedHashMap<String, Object> bindings = userUuid['admin'] ? ['subject': subjectObject] :
        ['subject': subjectUuid, 'user': userObject]
    saveBindingsDataToKeyValue(bindings)
    ScriptDtObject object = utils.get(subjectUuid)
    return getMapInfo(object, contentUuid, bindings)
}

//СЛУЖЕБНЫЙ БЛОК--------------------------------------------------------------
/**
 * Метод, позволяющий получить информацию для вывода на карту
 * @param object - текущий объект, карточка которого открыта
 * @param contentUuid - uuid карточки объекта
 * @param bindings дополнительные параметры контекста выполнения скрипта
 * @return данные о трассах в json формате
 */
private String getMapInfo(ScriptDtObject object,
                          String contentUuid,
                          LinkedHashMap<String, Object> bindings)
{
    MapSettings getSettingsWizardSettings = new SettingsProvider().getSettings()
    APISettings mapApiKey = getSettingsWizardSettings?.apiSettings
    Collection<String> errors = []
    Collection<LinkedHashMap> objects =
        callParamsSettingsMethod(errors, 'Нет данных для отображения', [], contentUuid, bindings)
    LinkedHashMap aggregations = [objects: objects, errors: errors, mapApiKey: mapApiKey]
    return new ObjectMapper().writeValueAsString(aggregations)
}

/**
 * Метод вызовы метода, заложенного в настройках ВП
 * @param errors - список ошибок
 * @param errorText - текст ошибки
 * @param defaultValue - значение по умолчанию на случай, если произошла ошибка
 * @param contentUuid - uuid карточки объекта
 * @param bindings дополнительные параметры контекста выполнения скрипта
 * @return результат вызова метода с названием methodName или значение по умолчанию, ошибку в списке и информацию в логе
 */
private Collection<LinkedHashMap> callParamsSettingsMethod(Collection<String> errors,
                                                           String errorText,
                                                           Collection defaultValue,
                                                           String contentUuid,
                                                           LinkedHashMap<String, Object> bindings)
{
    try
    {
        return new DataGeneration().getDataDisplayMap(contentUuid, bindings) ?: defaultValue
    }
    catch (Exception ex)
    {
        errors.add(errorText)
        logger.error("#mapRestSettings> ${ ex.message }", ex)
    }
    return defaultValue
}

/**
 * Метод сохранения в keyValue хранилеще данные о дополнительных параметрах контекста
 * @param bindings дополнительные параметры контекста выполнения скрипта
 */
void saveBindingsDataToKeyValue(LinkedHashMap<String, Object> bindings)
{
    String namespace = 'mapDataElementSystem'
    String key = 'mapData'
    String value = new ObjectMapper().writeValueAsString(bindings)
    api.keyValue.put(namespace, key, value)
}

//БЛОК СКРИПТОВОГО АПИ--------------------------------------------------------
@InjectApi
class ElementsMap
{
    public static final String AREA_A = 'Площадка А'
    public static final String AREA_B = 'Площадка Б'
    public static final String GO_TO_CARD = 'Перейти на карточку'
    public static final String NOT_SPECIFIED = 'не указано'
    public static final String DATA_TYPE_HYPERLINK = 'hyperlink'
    public static final String DATA_TYPE_BO_LINKS = 'boLinks'
    public static final String DATA_TYPE_CATALOGITEMSET = 'catalogItemSet'
    public static final String DATA_TYPE_BOOLEAN = 'bool'
    public static final String DATA_TYPE_DT_INTERVAL = 'dtInterval'
    public static final String DATA_TYPE_RICHTEXT = 'richtext'

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
        String color = dbTrail.hasProperty(strategie?.color) && dbTrail[strategie?.color] ?
            dbTrail[strategie?.color] : defaultSettingsWizardSettings?.colorLineMap
        String width = dbTrail.hasProperty(strategie?.weight) && dbTrail[strategie?.weight] ?
            dbTrail[strategie?.weight] : defaultSettingsWizardSettings?.width
        String opacity = dbTrail.hasProperty(strategie?.opacity) && dbTrail[strategie?.opacity] ?
            dbTrail[strategie?.opacity] : defaultSettingsWizardSettings?.opacity
        String lineStyle = strategie.lineStyle ?: defaultSettingsWizardSettings.lineStyle
        String dataDisplayPointA
        String dataDisplayPointB

        if (strategie.displayingLinesDots)
        {
            dataDisplayPointA =
                dbTrail.hasProperty(strategie?.pathToIconA) && dbTrail[strategie?.pathToIconA] ?
                    "${ api.web.getBaseUrl() }${ 'download?uuid=' }${ dbTrail[strategie?.pathToIconA].UUID.first() }" :
                    null
            dataDisplayPointB =
                dbTrail.hasProperty(strategie?.pathToIconB) && dbTrail[strategie?.pathToIconB] ?
                    "${ api.web.getBaseUrl() }${ 'download?uuid=' }${ dbTrail[strategie?.pathToIconB].UUID.first() }" :
                    null
        }

        TrailBuilder trailBuilder =
            dbTrail && dbTrail.siteA && dbTrail.siteB && dbTrail.title && dbTrail.gradLongA
                ? createTrailBuilder(dbTrail)
                .setHeader(dbTrail.title)
                .setColor(color)
                .setOpacity(opacity)
                .setWidth(width)
                .setLineStyle(lineStyle)
                .setGeopositions(dbTrail)
                .setDisplayingLinesDots(strategie.displayingLinesDots)
                .setIconFirst(dataDisplayPointA)
                .setIconSecond(dataDisplayPointB)
                .setParts(dbTrail)
                .setEquipments(dbTrail)
                .addAction(GO_TO_CARD, api.web.open(dbTrail.UUID))
                : null
        Collection attributesFromGroup =
            getSetAttributesOutputCharacteristics(defaultSettingsWizardSettings)
        addOptionsElementsOnMap(
            trailBuilder,
            dbTrail,
            attributesFromGroup,
            strategie.metaClassObject
        )
        return trailBuilder
    }

    /**
     * Получение списка дефолтных характеристик для вывода в списке объектов
     * @param defaultSettingsWizardSettings - дефолтные настройки из мастера настроек
     * @return список дефолтных характеристик
     */
    Collection getSetAttributesOutputCharacteristics(Object defaultSettingsWizardSettings)
    {
        Collection<DataCharacteristicDisplayListObjects> dataCharacteristicDisplayListObjects = []
        defaultSettingsWizardSettings.points.each {
            dataCharacteristicDisplayListObjects.add(
                new DataCharacteristicDisplayListObjects(
                    it.metaClassObject.id,
                    it.attributeGroup
                )
            )
        }
        Collection<MetaclassNameAndAttributeList> attributesFromGroup = []
        dataCharacteristicDisplayListObjects.each {
            Collection listattributes =
                api.metainfo.getMetaClass(it.metaClassData)
                   .getAttributeGroup(it.groupAttribute).attributes
            attributesFromGroup
                .add(new MetaclassNameAndAttributeList(it.metaClassData, listattributes))
        }
        return attributesFromGroup
    }

    /**
     * Добавление опций для вывода списка атрибутов на картах
     * @param builder - объект с данными об элементе на карте
     * @param dbTrail - объект трассы из БД
     * @param attributesFromGroup - список атрибутов
     * @param metaClassObject - имя используемого в вкладке матакласса
     */
    void addOptionsElementsOnMap(Object builder,
                                 ISDtObject dbTrail,
                                 Collection attributesFromGroup,
                                 String metaClassObject)
    {
        attributesFromGroup.each { characteristicsDisplayObjects ->
            if (characteristicsDisplayObjects.metaclassName == metaClassObject)
            {
                characteristicsDisplayObjects.listAttribute.each { currentAttribute ->
                    String valueLabel
                    String linkElement
                    try
                    {
                        valueLabel = dbTrail[currentAttribute.code] ?: NOT_SPECIFIED
                        if (currentAttribute.type == 'object')
                        {
                            linkElement = api.web.open(dbTrail[currentAttribute.code].UUID)
                        }
                    }
                    catch (Exception ex)
                    {
                    }
                    if (valueLabel && builder)
                    {
                        if (currentAttribute.type.code ==
                            DATA_TYPE_HYPERLINK && valueLabel != NOT_SPECIFIED)
                        {
                            Document doc = Jsoup.parse(valueLabel)
                            Elements links = doc.select("a[href]")
                            builder
                                .addOption(
                                    currentAttribute.title,
                                    new Value(label: doc.text(), url: links.attr("href"))
                                )
                        }
                        else if (currentAttribute.type.code == 'state')
                        {
                            valueLabel = api.metainfo.getStateTitle(dbTrail)
                            builder
                                .addOption(
                                    currentAttribute.title,
                                    new Value(label: valueLabel, url: linkElement)
                                )
                        }
                        else
                        {

                            builder
                                .addOption(
                                    currentAttribute.title,
                                    new Value(
                                        label: formattedValueLabel(
                                            valueLabel,
                                            currentAttribute.type.code
                                        ), url: linkElement
                                    )
                                )
                        }
                    }
                }
            }
        }
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
                    AREA_A,
                    new Value(label: dbPart.siteA.title, url: api.web.open(dbPart.siteA.UUID))
                )
                .addOption(
                    AREA_B,
                    new Value(label: dbPart.siteB.title, url: api.web.open(dbPart.siteB.UUID))
                )
                .setGeopositions(
                    dbPart.gradLatA,
                    dbPart.gradLongA,
                    dbPart.gradLatB,
                    dbPart.gradLongB
                )
                .addAction(GO_TO_CARD, api.web.open(dbPart.UUID))
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
                    AREA_A,
                    new Value(label: section.siteA.title, url: api.web.open(section.siteA.UUID))
                )
                .addOption(
                    AREA_B,
                    new Value(label: section.siteB.title, url: api.web.open(section.siteB.UUID))
                )
                .setGeopositions(section)
                .addAction(GO_TO_CARD, api.web.open(section.UUID))
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
        Object defaultSettingsWizardSettings = new SettingsProvider()
            .getSettings()?.defVisualization
        CharacteristicsDisplayListObjects settings = new SettingsProvider()
            .getSettings()?.defVisualization?.points?.first()
        String codeAttributeGroup = settings?.attributeGroup
        String codeMetaClass = settings?.metaClassObject.id
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
                .addAction(GO_TO_CARD, api.web.open(equipment.UUID))

            Set attributesFromGroup =
                getSetAttributesOutputCharacteristics(defaultSettingsWizardSettings)
            addOptionsElementsOnMap(
                formedEquipmentObject,
                equipment,
                attributesFromGroup,
                strategie.metaClassObject
            )
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
                .addAction(GO_TO_CARD, api.web.open(pointObject.UUID))
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

    String formattedValueLabel(String valueLabel, String dataType)
    {
        LinkedHashMap<String, Collection> unitMeasurementTime = ['SECOND': ['секунда', 'секунды', 'секунд'], 'MINUTE': ['минута', 'минуты', 'минут'], 'HOUR': ['час', 'часа', 'часов'], 'DAY': ['день', 'дня', 'дней'], 'WEEK': ['неделя', 'недели', 'недель'], 'YEAR': ['год', 'года', 'лет']]
        if (valueLabel[0] == '[' && valueLabel[valueLabel.length() - 1] == ']')
        {
            valueLabel = valueLabel.substring(1, valueLabel.length() - 1)
        }
        else if (valueLabel instanceof ScriptDtObject)
        {
            valueLabel = valueLabel.title
        }
        else if (dataType == DATA_TYPE_BOOLEAN)
        {
            valueLabel = valueLabel == 'true' ? 'да' : 'нет'
        }
        else if (dataType == DATA_TYPE_DT_INTERVAL)
        {
            if (unitMeasurementTime[valueLabel.split(' ').last()])
            {
                valueLabel = fixNumerical(
                    valueLabel.split(' ')[0].toInteger(),
                    unitMeasurementTime[valueLabel.split(' ').last()]
                )
            }
        }
        else if (dataType == DATA_TYPE_RICHTEXT)
        {
            valueLabel = Jsoup.parse(valueLabel).text()
        }
        return valueLabel
    }

    String fixNumerical(Integer numberHours, Collection arr)
    {
        String result
        Integer num100 = numberHours % 100
        if (num100 > 4 && num100 < 21)
        {
            result = arr[2]
        }
        else
        {
            Integer num10 = num100 % 10
            if (num10 == 1)
            {
                result = arr[0]
            }
            else if (num10 > 1 && num10 < 5)
            {
                result = arr[1]
            }
            else
            {
                result = arr[2]
            }
        }
        return "${ numberHours } ${ result }"
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

class DataCharacteristicDisplayListObjects
{
    /**
     * Метакласс
     */
    String metaClassData

    /**
     * Группа атрибутов
     */
    String groupAttribute

    DataCharacteristicDisplayListObjects(String metaClassData, String groupAttribute)
    {
        this.metaClassData = metaClassData
        this.groupAttribute = groupAttribute
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

    /**
     * Информация по отображению иконки
     */
    Boolean displayingLinesDots
    /**
     * Ссылка на иконку А
     */
    String iconFirst
    /**
     * Ссылка на иконку B
     */
    String iconSecond

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

    TrailBuilder setDisplayingLinesDots(Boolean displayingLinesDots)
    {
        this.displayingLinesDots = displayingLinesDots
        return this
    }

    TrailBuilder setIconFirst(String iconFirst)
    {
        this.iconFirst = iconFirst
        return this
    }

    TrailBuilder setIconSecond(String iconSecond)
    {
        this.iconSecond = iconSecond
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
        if (dbPart && dbPart.siteA && dbPart.siteB)
        {
            geopositions.add(
                new Geoposition(
                    latitude: dbPart.siteA.gradLat,
                    longitude: dbPart.siteA.gradLong
                )
            )
            geopositions.add(
                new Geoposition(
                    latitude: dbPart.siteB.gradLat,
                    longitude: dbPart.siteB.gradLong
                )
            )
        }

        this.geopositions = geopositions
        return this
    }

    SectionBuilder setGeopositions(Double latitudeA,
                                   Double longitudeA,
                                   Double latitudeB,
                                   Double longitudeB)
    {
        if (latitudeA && latitudeB && longitudeA && longitudeB)
        {
            this.geopositions.add(new Geoposition(latitude: latitudeA, longitude: longitudeA))
            this.geopositions.add(new Geoposition(latitude: latitudeB, longitude: longitudeB))
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
            latitude: dbEquip[strategie.pathLatitudeCoordinates],
            longitude: dbEquip[strategie.pathLongitudeCoordinates]
        )
            : null
        if (geoposition)
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
        if (geoposition)
        {
            this.geopositions = [geoposition]
        }
        return this
    }

    BasePointBuilder setIcon(def dbEquip)
    {
        String fileUuid = dbEquip?.classification?.icon?.find()?.UUID ?: ''
        this.icon = fileUuid ? "/sd/operator/download?uuid=${ fileUuid }" : ''
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

    public MapObjectBuilder addOption(String label,
                                      Value value,
                                      PresentationType presentation =
                                          PresentationType.RIGHT_OF_LABEL)
    {
        this.options.add(
            new Option(
                label: label,
                value: value,
                presentation: presentation.name().toLowerCase()
            )
        )

        return this
    }

    public MapObjectBuilder addAction(Action action)
    {
        this.actions.add(action)

        return this
    }

    public MapObjectBuilder addAction(String name, String link, boolean inPlace = false)
    {
        this.actions.add(
            new OpenLinkAction(
                name: name,
                link: link,
                inPlace: inPlace,
                type: ActionType.OPEN_LINK
            )
        )

        return this
    }

    MapObjectBuilder setActions(List<Action> actions)
    {
        this.actions = actions

        return this
    }
}

class MetaclassNameAndAttributeList
{
    /**
     *  Имя метакласса
     */
    String metaclassName

    /**
     *  Список атрибутов
     */
    Collection listAttribute

    MetaclassNameAndAttributeList(String metaclassName, Collection listAttribute)
    {
        this.metaclassName = metaclassName
        this.listAttribute = listAttribute
    }
}