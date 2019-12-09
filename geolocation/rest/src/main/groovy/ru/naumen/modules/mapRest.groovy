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

import groovy.transform.TupleConstructor;
import groovy.transform.Field;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.text.SimpleDateFormat;

//БЛОК REST АПИ--------------------------------------------------------

def getPoints(def user, String methodName, String objectUuid)
{
   def object = utils.get(objectUuid);
   def points = [];

   try
   {
       points = modules.mapParams."${methodName}"(object, user);
   }
   catch (Exception ex)
   {
       logger.error("#mapRest> ${ex.message}", ex);
   }

   return getObjectMapper(user).writeValueAsString(points);
}

def getLastGeopositions(def user, boolean requestCurrentGeoposition, long locationUpdateFrequency, String... employeeUuids)
{
  	def currentDate = new Date();
    def geopositions = [];
  
    for (def employeeUuid : employeeUuids)
    {
    	def userGeoposition = getLastGeoposition(employeeUuid)
      	
      	if (requestCurrentGeoposition && (!userGeoposition || (currentDate.time - userGeoposition.date.time) > locationUpdateFrequency * 1000))
      	{
        	api.location.getMobileLocation(employeeUuid);
        }
      
    	geopositions += new DynamicPointGeoposition(employeeUuid, userGeoposition);
    }
  
    return getObjectMapper(user).writeValueAsString(geopositions);
}

//БЛОК СКРИПТОВОГО АПИ--------------------------------------------------------

public StaticPoint createStaticPoint()
{
    return new StaticPoint();
}

public DynamicPoint createDynamicPoint(def employee)
{
    return new DynamicPoint(employee, getLastGeoposition(employee.UUID));
}

public String formatDate(def user, Date date, String format = null)
{
  if (!date)
  {
    return "";
  }
  
  return getDateFormatter(user, format).format(date);
}

//СЛУЖЕБНЫЙ БЛОК--------------------------------------------------------

private DynamicGeoposition getLastGeoposition(String employeeUuid)
{
    def lastGeoposition = api.db.query('''
        SELECT latitude, longitude, dataAccuracy, date 
        FROM geo_history_sys 
            WHERE objectUUID=:uuid 
            ORDER BY date desc
    ''').setMaxResults(1).set('uuid', employeeUuid).list();

    return (!lastGeoposition.isEmpty()) 
            ? new DynamicGeoposition(lastGeoposition[0][0], lastGeoposition[0][1], lastGeoposition[0][2], lastGeoposition[0][3])
            : null
}

private SimpleDateFormat getDateFormatter(def user, String format = null)
{
  	def dateFormat = new SimpleDateFormat((format) ? format : "dd.MM.yyyy HH:mm:ss");
  	
    if (user)
  	{
      	def timeZoneId = api.employee.getPersonalSettings(user.UUID).timeZone;
      	if (timeZoneId)
      	{
        	dateFormat.setTimeZone(TimeZone.getTimeZone(timeZoneId))
        }
    }
  
    return dateFormat;
}

private getObjectMapper(def user)
{
  	return new ObjectMapper()
  		.setVisibility(PropertyAccessor.FIELD, Visibility.ANY)
  		.setDateFormat(getDateFormatter(user));
}

enum MapPointType
{
    DYNAMIC,
    STATIC,
}

@TupleConstructor()
class Option
{
  	@JsonInclude(Include.NON_NULL)
    String label;
    String value;
}

@TupleConstructor()
class Action
{
    String name;
    String link;
}

@TupleConstructor()
class Geoposition
{
    Double latitude;
    Double longitude;
}

class DynamicGeoposition extends Geoposition
{
  	private Double accuracy;
    private Date date;
  
  	DynamicGeoposition(Double latitude, Double longitude, Double accuracy, Date date)
    {
        super(latitude, longitude);
      
      	this.accuracy = accuracy;
      	this.date = date;
    }
  
  	public Double getAccuracy()
  	{
    	return accuracy;
    }
  
  	public Date getDate()
  	{
    	return date;
    }
}

class PointGeoposition
{
    @JsonInclude(Include.NON_NULL)
    private Geoposition geoposition = null;
    @JsonInclude(Include.NON_NULL)
    private String errorMessage = 'Нет данных о местоположении';

    protected PointGeoposition setGeoposition(Geoposition geoposition)
    {
        if (geoposition != null)
        {
            this.geoposition = geoposition;
            this.errorMessage = null;
        }        

        return this;
    }

    public Geoposition getGeoposition()
  	{
        return geoposition;
    }
}

class MapPoint extends PointGeoposition
{
    private final MapPointType type;
	private String header;
    
    private List<Option> options = new ArrayList<>();
    private List<Action> actions = new ArrayList<>();

    protected MapPoint(MapPointType type)
    {
        this.type = type;
    }

    public MapPoint setHeader(String header)
    {
        this.header = header;

        return this;
    }

    public MapPoint addOption(String label, String value)
    {
        this.options.add(new Option(label, value));

        return this;
    }
  
  	public MapPoint addOption(String value)
    {
        this.options.add(new Option(null, value));

        return this;
    }

    public MapPoint addAction(String name, String link)
    {
        this.actions.add(new Action(name, link));

        return this;
    }

    public String getType()
    {
        return type.toString().toLowerCase();
    }
}

class StaticPoint extends MapPoint
{
    StaticPoint()
    {
        super(MapPointType.STATIC);
    }

    public MapPoint setGeoposition(Double latitude, Double longitude)
    {
      	def geoposition = null;
      	if (latitude != null && longitude != null)
      	{
        	geoposition = new Geoposition(latitude, longitude)
        }
      
        return setGeoposition(geoposition);
    }
}

class DynamicPoint extends MapPoint
{
    private final String uuid;

    DynamicPoint(def employee, DynamicGeoposition geoposition)
    {
        super(MapPointType.DYNAMIC);
        
        this.uuid = employee.UUID;
        setHeader(employee.title);
        setGeoposition(geoposition)
    }
}

class DynamicPointGeoposition extends PointGeoposition
{
    private final String uuid;

    DynamicPointGeoposition(def uuid, DynamicGeoposition geoposition)
    {
        super();

        this.uuid = uuid;
        setGeoposition(geoposition)
    }
}