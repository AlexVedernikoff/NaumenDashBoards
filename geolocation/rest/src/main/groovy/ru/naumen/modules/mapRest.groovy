//Автор: dpanishev
//Дата создания: 15.10.2019
//Код: mapRest
//Назначение:
/**
 * Лицензионный скриптовый модуль встроенного приложения "Карта".
 *
 * Содержит служебные методы для получения данных самим ВП:
 * - метод получения списка подвижных и неподвижных точек;
 * - метод получения текущей геопозиции для списка объектов.
 * И методы, использование которых предполагается в mapParams
 */
//Версия: 4.11

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
import java.text.SimpleDateFormat
import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.metainfo.shared.Constants.UI

//БЛОК REST АПИ--------------------------------------------------------

def getMap(String objectUuid, String contentUuid)
{
    def object = utils.get(objectUuid)
    def params = api.apps.contentParameters(object.getMetaClass().toString(), UI.WINDOW_KEY, contentUuid)

    return getMapInt(user, object, params.pointsMethodName, params.groupingMethodName)
}

def getLastGeopositions(String objectUuid, String contentUuid, Collection<String> employeeUuids)
{
    def params = api.apps.contentParameters(utils.get(objectUuid).getMetaClass().toString(), UI.WINDOW_KEY, contentUuid)

    return getLastGeopositionsInt(user, params.requestCurrentGeoposition ?: false, params.locationUpdateFrequency?.ms ?: 0, employeeUuids)
}

//БЛОК СКРИПТОВОГО АПИ--------------------------------------------------------

public StaticPointBuilder createStaticPoint(def object)
{
    return new StaticPointBuilder(object)
}

public DynamicPointBuilder createDynamicPoint(def employee)
{
    return new DynamicPointBuilder(employee, getLastGeoposition(employee.UUID))
}

public GroupBuilder createGroup(Closure<Boolean> pointClassifier)
{
    return new GroupBuilder(pointClassifier)
}

public PresentationBuilder getPresentation()
{
    return new PresentationBuilder()
}

public ActionBuilder getAction()
{
    return new ActionBuilder()
}

public String formatDate(def user, Date date, String format = null)
{
    if (!date)
    {
        return ""
    }

    return getDateFormatter(user, format).format(date)
}

//СЛУЖЕБНЫЙ БЛОК--------------------------------------------------------

private def getMapInt(def user, def object, String pointsMethodName, String groupingMethodName)
{
    def errors = []

    def points = callParamsMethod(errors, 'Нет данных для отображения', [], pointsMethodName, object, user)
    def staticGroups = callParamsMethodIfExists(errors, 'Произошла ошибка при группировке меток', [], groupingMethodName)
    
    def (staticPoints, dynamicPoints) = points.split { it.type == MapPointType.STATIC }

    def groupedStaticPoints = groupPoints(MapPointType.STATIC, staticPoints)
    
    if (staticGroups)
    {
        def groupCount = staticGroups.size()

        groupedStaticPoints.each {
            it.data.each { point ->
                def group = staticGroups.find { it.classifier(point.object) }

                point.applyGroup(group)
            }
        }
    }

    def groupedDynamicPoints = dynamicPoints.collect { mapPoint(MapPointType.DYNAMIC, it.geoposition, [it]) }
        .sort { -(it.geoposition?.date?.time ?: 0) }

    def staticWithoutGeoposition = staticPoints.findAll { !it.geoposition }.collect { it.header }
    if (staticWithoutGeoposition)
    {
        errors.add('Нет информации о местоположении неподвижных меток: ' + staticWithoutGeoposition.join(', '))
    }

    return getObjectMapper(user).writeValueAsString(new Map(groupedStaticPoints, staticGroups, groupedDynamicPoints, errors))
}

private def getLastGeopositionsInt(def user, boolean requestCurrentGeoposition, long locationUpdateFrequency, Collection<String> employeeUuids)
{
    def errors = []
    def geopositions = []
    def withoutGeoposition = []
    def currentDate = new Date()

    for (def employeeUuid : employeeUuids)
    {
        def userGeoposition = getLastGeoposition(employeeUuid)

        if (requestCurrentGeoposition
            && (!userGeoposition || (currentDate.time - userGeoposition.date.time) > locationUpdateFrequency * 1000))
        {
            api.location.getMobileLocation(employeeUuid)
        }

        if (!userGeoposition)
        {
            withoutGeoposition += utils.get(employeeUuid).title
        }

        geopositions += new DynamicPointGeoposition(employeeUuid, userGeoposition)
    }
    
    if (withoutGeoposition)
    {
        errors.add('Нет информации о местоположении подвижных меток: ' + withoutGeoposition.join(', '))
    }

    return getObjectMapper(user).writeValueAsString(new LastGeopositions(geopositions, errors))
}

private DynamicGeoposition getLastGeoposition(String employeeUuid)
{
    def lastGeoposition = api.db.query('''
        SELECT latitude, longitude, dataAccuracy, date
        FROM geo_history_sys
            WHERE objectUUID=:uuid
            ORDER BY date desc
    ''').setMaxResults(1).set('uuid', employeeUuid).list()

    return (!lastGeoposition.isEmpty())
            ? new DynamicGeoposition(lastGeoposition[0][0], lastGeoposition[0][1],
                    lastGeoposition[0][2], lastGeoposition[0][3])
            : null
}

private def groupPoints(MapPointType type, def points)
{
    return points.groupBy { it.geoposition }.collect { geoposition, data -> mapPoint(type, geoposition, data) }
}

private def mapPoint(MapPointType type, def geoposition, def data)
{
    return [
        type: type,
        geoposition: geoposition,
        data: data
    ]
}

private SimpleDateFormat getDateFormatter(def user, String format = null)
{
    def dateFormat = new SimpleDateFormat((format) ? format : "dd.MM.yyyy HH:mm:ss")

    if (user)
    {
        def timeZoneId = api.employee.getPersonalSettings(user.UUID).timeZone
        if (timeZoneId)
        {
            dateFormat.setTimeZone(TimeZone.getTimeZone(timeZoneId))
        }
    }

    return dateFormat
}

private ObjectMapper getObjectMapper(def user, boolean fromPanel = false)
{
    return new ObjectMapper()
        .setVisibility(PropertyAccessor.FIELD, Visibility.ANY)
        .setDateFormat(getDateFormatter(user))
}

private def callParamsMethod(Collection<String> errors, String errorText, def defaultValue, String methodName, Object... objects)
{
    try
    {
        return modules.mapParams."${methodName}"(*objects) ?: defaultValue
    }
    catch (Exception ex)
    {
        errors.add(errorText)
        logger.error("#mapRest> ${ex.message}", ex)
    }

    return defaultValue
}


private def callParamsMethodIfExists(Collection<String> errors, String errorText, def defaultValue, String methodName, Object... objects)
{
    return (methodName) ? callParamsMethod(errors, errorText, defaultValue, methodName, objects) : defaultValue
}

enum MapPointType
{
    DYNAMIC,
    STATIC

    @JsonValue
    public String getType()
    {
        return name().toString().toLowerCase()
    }
}

enum PresentationType
{
    RIGHT_OF_LABEL,
    FULL_LENGTH,
    UNDER_LABEL
}

enum ActionType
{
    OPEN_LINK,
    CHANGE_RESPONSIBLE,
    CHANGE_STATE
}

@TupleConstructor()
class Map
{
    Collection<MapPointBuilder> staticPoints
    Collection<GroupBuilder> staticGroups
    Collection<MapPointBuilder> dynamicPoints
    Collection<String> errors
}

@TupleConstructor()
class LastGeopositions
{
    Collection<DynamicPointGeoposition> geopositions
    Collection<String> errors
}

@TupleConstructor()
class Option
{
    String label
    String value
    String presentation
}

class Action
{
    final ActionType type
    final String name

    protected Action(ActionType type, String name)
    {
        this.type = type
        this.name = name
    }

    public String getType()
    {
        return type.toString().toLowerCase()
    }

    public String getName()
    {
        return name
    }
}

class OpenLinkAction extends Action
{
    private String link
    private boolean inPlace

    OpenLinkAction(String name, String link, boolean inPlace)
    {
        super(ActionType.OPEN_LINK, name)

        this.link = link
        this.inPlace = inPlace
    }
}

class ChangeResponsibleAction extends Action
{
    ChangeResponsibleAction(String name)
    {
        super(ActionType.CHANGE_RESPONSIBLE, name)
    }
}

class ChangeStateAction extends Action
{
    private Collection<String> states

    ChangeStateAction(String name, Collection<String> states)
    {
        super(ActionType.CHANGE_STATE, name)

        this.states = states
    }
}

class ActionBuilder
{
    Action openLink(String name, String link, boolean inPlace = false)
    {
        return new OpenLinkAction(name, link, inPlace)
    }

    Action changeResponsible(String name)
    {
        return new ChangeResponsibleAction(name)
    }

    Action changeState(String name, Collection<String> states)
    {
        return new ChangeStateAction(name, states)
    }
}

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

class GroupBuilder
{
    String name
    String color
    String code
    @JsonIgnore
    final Closure<Boolean> classifier

    GroupBuilder(Closure<Boolean> classifier)
    {
        this.classifier = classifier
    }

    public GroupBuilder setName(String name)
    {
        this.name = name

        return this
    }

    public GroupBuilder setCode(String code)
    {
        this.code = code

        return this
    }

    public GroupBuilder setColor(String color)
    {
        this.color = color

        return this
    }
}

class ConfigurationBuilder
{
    String staticPointsListName
    String dynamicPointsListName

    ConfigurationBuilder()
    {
    }

    public ConfigurationBuilder setStaticPointsListName(String staticPointsListName)
    {
        this.staticPointsListName = staticPointsListName

        return this
    }

    public ConfigurationBuilder setDynamicPointsListName(String dynamicPointsListName)
    {
        this.dynamicPointsListName = dynamicPointsListName

        return this
    }
}


@TupleConstructor()
@EqualsAndHashCode
class Geoposition
{
    Double latitude
    Double longitude
}

class DynamicGeoposition extends Geoposition
{
    private Double accuracy
    private Date date

    DynamicGeoposition(Double latitude, Double longitude, Double accuracy, Date date)
    {
        super(latitude, longitude)

        this.accuracy = accuracy
        this.date = date
    }

    public Double getAccuracy()
    {
        return accuracy
    }

    public Date getDate()
    {
        return date
    }
}

class PointGeoposition
{
    Geoposition geoposition = null

    protected PointGeoposition setGeoposition(Geoposition geoposition)
    {
        if (geoposition != null)
        {
            this.geoposition = geoposition
        }

        return this
    }

    public Geoposition getGeoposition()
    {
        return geoposition
    }
}

class MapPointBuilder extends PointGeoposition
{
    final MapPointType type
    final String uuid
    @JsonIgnore
    final IUUIDIdentifiable object
    String header

    List<Option> options = new ArrayList<>()
    List<Action> actions = new ArrayList<>()

    protected MapPointBuilder(MapPointType type, Object object)
    {
        this.type = type
        this.uuid = object?.UUID
        this.object = object
    }

    public MapPointBuilder setHeader(String header)
    {
        this.header = header

        return this
    }

    public MapPointBuilder addOption(String label, String value, PresentationType presentation = PresentationType.RIGHT_OF_LABEL)
    {
        this.options.add(new Option(label, value, presentation.name().toLowerCase()))

        return this
    }

    public MapPointBuilder addOption(String value)
    {
        return addOption(null, value, PresentationType.FULL_LENGTH)
    }

    public MapPointBuilder addAction(Action action)
    {
        this.actions.add(action)

        return this
    }

    MapPointBuilder setActions(List<Action> actions)
    {
        this.actions = actions

        return this
    }

    MapPointBuilder setOptions(List<Option> options)
    {
        this.options = options

        return this
    }
}

class StaticPointBuilder extends MapPointBuilder
{
    String group

    StaticPointBuilder()
    {
        super(MapPointType.STATIC, null)
    }

    StaticPointBuilder(def object)
    {
        super(MapPointType.STATIC, object)
    }

    public MapPointBuilder setGeoposition(Double latitude, Double longitude)
    {
        def geoposition = null
        if (latitude != null && longitude != null)
        {
            geoposition = new Geoposition(latitude, longitude)
        }

        return setGeoposition(geoposition)
    }

    MapPointBuilder applyGroup(GroupBuilder group)
    {
        this.group = group?.code

        return this
    }
}

class DynamicPointBuilder extends MapPointBuilder
{
    DynamicPointBuilder(def employee, DynamicGeoposition geoposition)
    {
        super(MapPointType.DYNAMIC, employee)

        setHeader(employee.title)
        setGeoposition(geoposition)
    }
}

class DynamicPointGeoposition extends PointGeoposition
{
    private final String uuid

    DynamicPointGeoposition(def uuid, DynamicGeoposition geoposition)
    {
        super()

        this.uuid = uuid
        setGeoposition(geoposition)
    }
}