/*! UTF-8 */
//Автор: nordclan
//Дата создания: 05.11.2020
//Код:
//Назначение:
/**
 * Контроллер для доступа к событиям календаря
 */
//Версия: 1.0
//Категория: скриптовый модуль

package ru.naumen.modules.calendar

import java.time.ZoneId
import java.time.ZonedDateTime
import groovy.time.TimeCategory
import groovy.transform.TupleConstructor
import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.shared.dto.ISDtObject

import java.time.format.DateTimeFormatter

import static groovy.json.JsonOutput.toJson

/**
 * Интерфейс контроллера для доступа к событиям календаря
 */
interface EventController
{
    /**
     * Возвращает список доступных локаций
     * @return Json с элементами типа SelectItem
     */
    String getLocations()

    /**
     * Возвращает список календарей в локации с id = locationUuid
     * @param locationUuid - id локации
     * @return Json с элементами типа SelectItem
     */
    String getCalendars(String locationUuid)

    /**
     * Возвращает список событий в указанном календаре за указанный период
     * @param calendarFilterUuid - id календаря
     * @param startDate - начало периода
     * @param endDate - конец периода
     * @return Json со списком событий за указанный период
     */
    String getEvents(String calendarFilterUuid, String startDate, String endDate)
}

trait EventControllerTrait implements EventController
{
    CalendarService service = CalendarService.instance

    @Override
    String getLocations()
    {
        return toJson(service.getLocations())
    }

    @Override
    String getCalendars(String locationUuid)
    {
        return toJson(service.getCalendars(locationUuid))
    }

    @Override
    String getEvents(String calendarFilterUuid, String startDateString, String endDateString)
    {
        final String dateFormat = 'yyyy-MM-dd\'T\'hh:mm:ss.S'
        Date startDate = Date.parse(dateFormat, startDateString).clearTime()
        Date endDate = Date.parse(dateFormat, endDateString).clearTime().plus(1)
        ZoneId userTimeZone = getUserTimeZone(user)
        return toJson(service.getEvents(calendarFilterUuid, startDate, endDate, userTimeZone))
    }

    private ZoneId getUserTimeZone(def user)
    {
        if (!user)
            return ZoneId.of('UTC')
        def zone = api.employee.getTimeZone(user.UUID)
        if (!zone)
            return ZoneId.of('UTC')
        return ZoneId.of(zone.code)
    }
}

/**
 * Сервис для получения событий календаря, списка локаций и календарей
 */
@InjectApi
@Singleton
class CalendarService
{
    private static final String DATE_FORMAT = 'yyyy-MM-dd\'T\'hh:mm:ss.SZ'
    private static final String CLOSED_STATE = 'closed'
    private static final String REGISTERED_STATE = 'registered'
    private static final String TYPE_LOCATION = 'persReception$prLocation'
    private static final String TYPE_CALENDAR = 'persReception$prCalendar'

    /**
     * Метод возвращает допустимые значения в выпадающем списке "Локации личного приема" (persReception$prLocation)
     * @return список локаций личного приема
     */
    List<SelectItem> getLocations()
    {
        def result = api.utils.find(TYPE_LOCATION, [state: REGISTERED_STATE])
                .collect{this.& toSelectItem}
        return result
    }

    /**
     * Метод возвращает  список объектов типа "Календарь личного приема" в укзанной локации
     * @param locationUuid - идентификатор "Локации личного приема"
     * @return список календарей личного приема
     */
    List<SelectItem> getCalendars(String locationUuid)
    {
        def location = api.utils.get(locationUuid)
        def result = api.utils.find(TYPE_CALENDAR, [state: REGISTERED_STATE, prLocation: location])
                .collect{this.& toSelectItem}
        return result;
    }

    /**
     * Метод возвращает список событий в формате json, для выбранного календаря и диапазона дат
     * @param calendarFilterUuid - id календаря
     * @param startDate - начало диапазона
     * @param endDate - конец диапазона
     * @return список событий
     */
    public List<Event> getEvents(String calendarFilterUuid, Date startDate, Date endDate, ZoneId userTimeZone)
    {
        startDate.clearTime()
        endDate.clearTime()
        def calendar = api.utils.get(calendarFilterUuid)
        if (!calendar)
        {
            return null
        }
        final boolean isMonth = periodIsMonth(startDate, endDate)
        def events = calendar.ptTimeSlots.findResults{
            if (isMonth && it.state != CLOSED_STATE)
            {
                return null
            }
            if (it.startDate >= startDate && it.endDate <= endDate)
            {
                return toEvent(it, userTimeZone)
            }
            return null
        }
        return events
    }

    /**
     * Преобразует Тайм-слот в Event
     */
    private Event toEvent(def timeSlot, ZoneId userTimeZone)
    {
        def event = new Event()
        event.start = zonedDateToString(ZonedDateTime.ofInstant(timeSlot.startDate.toInstant(), userTimeZone))
        event.end = zonedDateToString(ZonedDateTime.ofInstant(timeSlot.endDate.toInstant(), userTimeZone))
        if (timeSlot.state == CLOSED_STATE)
        {
            def booking = timeSlot.prTimeBookings?.find()
            if (!booking)
            {
                return null
            }
            event.color = api.wf.state(booking).color?.html()
            def clients = []
            if (booking.clientFL)
            {
                clients << booking.clientFL.fio
            }
            if (booking.clientTL)
            {
                clients << booking.clientTL.fio
            }
            event.description = clients.join(', ')
        }
        else
        {
            event.color = api.wf.state(timeSlot).color?.html()
            event.description = api.wf.state(timeSlot).title
            event.link = timeSlot.UUID
        }

        return event
    }


    /**
     * Определяет, что указанный диапазон дат составляет ровно 1 месяц
     * @param startDate - начало диапазона
     * @param endDate - конец диапазона
     * @return true, если указанный диапазон дат составляет ровно 1 месяц, иначе - false
     */
    private boolean periodIsMonth(Date startDate, Date endDate)
    {
        use(TimeCategory)
        {
            return (startDate + 1.month) == endDate
        }
    }

    /**
     * Helper для создания SelectItem из ISDtObject
     * @param object - полученный из системы объект
     * @return SelectItem с id == object.UUID и value == object.title
     */
    private SelectItem toSelectItem(ISDtObject object)
    {
        return new SelectItem(object.UUID, object.title)
    }

    /**
     * Конвертирует ZonedDateTime в строку согласно формату DATE_FORMAT
     * @param date - дата для конвертации
     * @return дату формата yyyy-MM-dd'T'hh:mm:ss.SZ
     */
    private String zonedDateToString(ZonedDateTime date)
    {
        return date.format(DateTimeFormatter.ofPattern(DATE_FORMAT))
    }
}

/**
 * Модель события
 */
class Event
{
    /**
     * Описание события
     */
    String description
    /**
     * Время начала события
     */
    String start
    /**
     * Время окончания события
     */
    String end
    /**
     * Цвет события (вычисляется из его статуса)
     */
    String color
    /**
     * Данные для формирования ссылки на событие
     */
    String link
}

/**
 * Модель для списка локаций и календарей
 */
@TupleConstructor
class SelectItem
{
    /**
     * Идентификатор записи
     */
    String id
    /**
     * Отображаемый текст
     */
    String value
}
