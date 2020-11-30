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
     * @param hideAppointments - Не отображать записи на прием - true, отображать - false
     * @return Json со списком событий за указанный период
     */
    String getEvents(String calendarFilterUuid,
                     String startDate,
                     String endDate,
                     boolean hideAppointments)

    // Для совместимости со прежней версией ui, которая принимает 3 аргумента
    String getEvents(String calendarFilterUuid, String startDate, String endDate)

    /**
     * Возвращает ссылку на объект и title объекта
     * @param objectUuid - UUID объекта
     * @return {@link ObjectLink}
     */
    String getObjectLink(String objectUuid);
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
    String getEvents(String calendarFilterUuid,
                     String startDateString,
                     String endDateString,
                     boolean hideAppointments = false)
    {
        final String dateFormat = 'yyyy-MM-dd\'T\'HH:mm:ss.S'
        Date startDate = Date.parse(dateFormat, startDateString)
        Date endDate = Date.parse(dateFormat, endDateString).plus(1)
        return toJson(
            service.
                getEvents(calendarFilterUuid, startDate, endDate, hideAppointments)
        )
    }

    @Override
    String getObjectLink(String objectUuid)
    {
        def object = api.utils.get(objectUuid)
        return toJson(new ObjectLink(object?.title, api.web.open(objectUuid)))
    }
}

/**
 * Сервис для получения событий календаря, списка локаций и календарей
 */
@InjectApi
@Singleton
class CalendarService
{
    // Статус "Есть запись на прием"
    private static final String CLOSED_STATE = 'closed'
    // Статус "Временно заблокирован для записи"
    private static final String BLOCKED_STATE = 'blocked'
    // Статус "Запись не ведётся"
    private static final String STOPPED_STATE = 'stopped'

    private static final String BOOKING_STATE_CANCELED_BY_CL = 'canceledByCl'
    private static final String BOOKING_STATE_CANCELED_BY_USER = 'canceledByUser'
    private static final String BOOKING_STATE_CLOSED = 'closed'
    private static final String BOOKING_STATE_NOT_HAPPENED = 'notHappened'
    // Тайм-слоты с записями в перечисленных состояниях не отображаются
    private static final Set BOOKING_STATE_FILTER = [BOOKING_STATE_CANCELED_BY_CL,
                                                     BOOKING_STATE_CANCELED_BY_USER,
                                                     BOOKING_STATE_CLOSED,
                                                     BOOKING_STATE_NOT_HAPPENED]

    private static final String REGISTERED_STATE = 'registered'
    private static final String TYPE_LOCATION = 'persReception$prLocation'
    private static final String TYPE_CALENDAR = 'persReception$prCalendar'
    private static final String TYPE_TIMESLOT = 'persReception$prTimeSlot'
    private static final String TYPE_BOOKING = 'persReception$prTimeBooking'

    // Префикс для типа "Тайм-слот"
    private static final String TIME_SLOT_TYPE = 'time-slot'
    // Префикс для типа "Запись на приём"
    private static final String APPOINTMENT_TYPE = 'appointment'
    // Идентификатор для получения тайм-слотов всех календарей
    private static final String ALL_CALENDARS_ID = "all_calendars_of"
    // Заголовок для элемента выбора всех календарей
    private static final String ALL_CALENDARS_TITLE = "Все календари"

    /**
     * Метод возвращает допустимые значения в выпадающем списке "Локации личного приема" (persReception$prLocation)
     * @return список локаций личного приема
     */
    List<SelectItem> getLocations()
    {
        def result = api.utils.find(TYPE_LOCATION, [state: REGISTERED_STATE])
                        .collect(this.&toSelectItem)
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
                        .collect(this.&toSelectItem)
        result.
            add(0, new SelectItem("${ ALL_CALENDARS_ID }_${ locationUuid }", ALL_CALENDARS_TITLE))
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
     * @param hideAppointments - отображать записи на прием
     * @return список событий
     */
    List<Event> getEvents(String calendarFilterUuid,
                          Date startDate,
                          Date endDate,
                          boolean hideAppointments)
    {
        String locationUuid = parseLocationId(calendarFilterUuid);
        // Выбираем все тайм-слоты из локации, или из календаря
        def timeSlots = locationUuid ? getLocationTimeSlots(locationUuid) :
            getCalendarTimeSlots(calendarFilterUuid)
        if (!timeSlots)
        {
            return null
        }
        final boolean isMonth = periodIsMonth(startDate, endDate)
        def events = timeSlots.findResults {
            // Не отображать записи на прием
            if (hideAppointments && it.state == CLOSED_STATE)
            {
                return null
            }
            // При отображении расписания на месяц не отображаем занятые тайм-слоты
            if (isMonth && it.state != CLOSED_STATE)
            {
                return null
            }
            // Если есть запись на прием, то отфильтровываем по ее состоянию
            def booking = it.prTimeBookings?.find()
            if (BOOKING_STATE_FILTER.contains(booking?.state))
            {
                return null
            }
            if (it.startDate >= startDate && it.endDate <= endDate)
            {
                return toEvent(it)
            }
            return null
        }
        return events
    }

    /**
     * Возвращает id локации
     * @param allCalendarsId - id выбранного элемента в поле "Календари"
     * @return id локации или null, если в allCalendarsId не найден id локации
     */
    private static String parseLocationId(String allCalendarsId)
    {
        if (!allCalendarsId.contains(ALL_CALENDARS_ID))
        {
            return null;
        }
        return allCalendarsId.substring(ALL_CALENDARS_ID.length() + 1);
    }

    /**
     * Возвращает все тайм-слоты из календарей (где state = registered) в локации с UUID = locationUuid
     * @param locationUuid - UUID локации
     * @return список тайм-слотов в локации
     */
    private def getLocationTimeSlots(String locationUuid)
    {
        def location = api.utils.get(locationUuid)
        if (!location)
        {
            return null
        }
        def calendars =
            api.utils.find(TYPE_CALENDAR, [state: REGISTERED_STATE, prLocation: location])
        return calendars.collectMany {
            it.ptTimeSlots
        }
    }

    private def getCalendarTimeSlots(String calendarUuid)
    {
        def calendar = api.utils.get(calendarUuid)
        return calendar?.ptTimeSlots;
    }

    /**
     * Преобразует Тайм-слот в {@link Event}
     */
    private Event toEvent(def timeSlot)
    {
        def event = new Event()
        event.start = timeSlot.startDate
        event.end = timeSlot.endDate
        //Есть запись на прием
        if (timeSlot.state == CLOSED_STATE)
        {
            def booking = timeSlot.prTimeBookings?.find()
            if (!booking)
            {
                return null
            }
            event.type = "${ APPOINTMENT_TYPE }_${ booking.state }"
            event.color = api.wf.state(booking).color?.html()
            event.link = booking.UUID
            def clients = []
            if (booking.clientFL)
            {
                clients << booking.clientFL.fio.trim()
            }
            if (booking.clientTL)
            {
                clients << booking.clientTL.fio.trim()
            }
            event.description = clients.join(', ')
        }
        //Свободный тайм-слот
        else
        {
            event.type = "${ TIME_SLOT_TYPE }_${ timeSlot.state }"
            event.color = api.wf.state(timeSlot).color?.html()
            event.description = getTimeSlotTitle(timeSlot)
            event.link = timeSlot.UUID
        }

        return event
    }

    /**
     * Возвращает название тайм-слота в зависимости от его статуса
     * @param timeSlot
     * @return Нзвание тайм-слота
     */
    private String getTimeSlotTitle(def timeSlot)
    {
        String title = timeSlot.title;
        // Не указываем status для
        if (timeSlot.state == BLOCKED_STATE || timeSlot.state == STOPPED_STATE)
        {
            return title;
        }
        return "${ title } ${ api.wf.state(timeSlot).title }"
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
                  .collect {
                      new StateColor(it.color?.html(), "${ eventType }_${ it.code }")
                  }
    }

    /**
     * Определяет, что указанный диапазон дат составляет ровно 1 месяц
     * @param startDate - начало диапазона
     * @param endDate - конец диапазона
     * @return true, если указанный диапазон дат составляет ровно 1 месяц, иначе - false
     */
    private boolean periodIsMonth(Date startDate, Date endDate)
    {
        use(TimeCategory) {
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
    Date start
    /**
     * Время окончания события
     */
    Date end
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

@TupleConstructor
class ObjectLink
{
    /**
     * Название объекта
     */
    String title
    /**
     * Ссылка
     */
    String link
}

