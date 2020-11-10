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
     * @return Json с элементами типа {@link SelectItem}
     */
    String getLocations()

    /**
     * Возвращает список календарей в локации с id = locationUuid
     * @param locationUuid - id локации
     * @return Json с элементами типа {@link SelectItem}
     */
    String getCalendars(String locationUuid)

    /**
     * Возвращает список состояний событий и соответствующие им цвета
     * @return Json с элементами типа {@link StateColor}
     */
    String getEventStatesColors();

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
    String getEventStatesColors()
    {
        return toJson(service.getEventStatesColors())
    }

    @Override
    String getEvents(String calendarFilterUuid, String startDateString, String endDateString)
    {
        final String dateFormat = 'yyyy-MM-dd\'T\'hh:mm:ss.S'
        Date startDate = Date.parse(dateFormat, startDateString)
        Date endDate = Date.parse(dateFormat, endDateString).plus(1)
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
    private static final String TYPE_TIMESLOT = 'persReception$prTimeSlot'
    private static final String TYPE_BOOKING = 'persReception$prTimeBooking'

    // Префикс для типа "Тайм-слот"
    private static final String TIME_SLOT_TYPE = 'time-slot'
    // Префикс для типа "Запись на приём"
    private static final String APPOINTMENT_TYPE = 'appointment'

    /**
     * Метод возвращает допустимые значения в выпадающем списке "Локации личного приема" (persReception$prLocation)
     * @return список локаций личного приема
     */
    List<SelectItem> getLocations()
    {
        def result = api.utils.find(TYPE_LOCATION, [state: REGISTERED_STATE])
                .collect(this.& toSelectItem)
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
                .collect(this.& toSelectItem)
        return result
    }

    /**
     * Возвращает список состояний событий и их цвета
     * @return Список элементов {@link StateColor}
     */
    List<StateColor> getEventStatesColors()
    {
        def appointments = getStatesColors(TYPE_BOOKING, APPOINTMENT_TYPE)
        def slots = getStatesColors(TYPE_TIMESLOT, TIME_SLOT_TYPE)
        return appointments + slots
    }

    /**
     * Метод возвращает список событий в формате json, для выбранного календаря и диапазона дат
     * @param calendarFilterUuid - id календаря
     * @param startDate - начало диапазона
     * @param endDate - конец диапазона
     * @return список событий
     */
    List<Event> getEvents(String calendarFilterUuid, Date startDate, Date endDate, ZoneId userTimeZone)
    {
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
     * Преобразует Тайм-слот в {@link Event}
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
            event.type = "${APPOINTMENT_TYPE}_${booking.state}"
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
            event.type = "${TIME_SLOT_TYPE}_${timeSlot.state}"
            event.color = api.wf.state(timeSlot).color?.html()
            event.description = api.wf.state(timeSlot).title
            event.link = timeSlot.UUID
        }

        return event
    }

    /**
     * Возвращает список {@link StateColor}, где в value записывается тип события вида "${eventType}_${state.code}"),
     * а в color - цвет события
     * @param fqn - FQN типа, для которого необходимо получить состояния и их цвета
     * @param eventType - суффикс, который добавится в поле value
     * @return озвращает список {@link StateColor}
     */
    private List<StateColor> getStatesColors(String fqn, String eventType)
    {
        return api.metainfo.getMetaClass(fqn)
                .workflow
                .states
                .collect{new StateColor(it.color?.html(), "${eventType}_${it.code}")}
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
     * Helper для создания {@link SelectItem} из ISDtObject
     * @param object - полученный из системы объект
     * @return SelectItem с id == object.UUID и value == object.title
     */
    private static SelectItem toSelectItem(ISDtObject object)
    {
        return new SelectItem(object.UUID, object.title)
    }

    /**
     * Конвертирует ZonedDateTime в строку согласно формату DATE_FORMAT
     * @param date - дата для конвертации
     * @return дату формата yyyy-MM-dd'T'hh:mm:ss.SZ
     */
    private static String zonedDateToString(ZonedDateTime date)
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
    /**
     * Тип события
     */
    String type
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

/**
 * Модель для списка состояний событий и их цветов
 */
@TupleConstructor
class StateColor
{
    /**
     * Цвет состояния, например '#E70505'
     */
    String color
    /**
     * Состояние
     */
    String value
}

