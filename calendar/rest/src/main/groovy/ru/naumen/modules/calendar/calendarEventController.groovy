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

import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
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
    String getEventStatesColors()

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
                     List<String> statuses,
                     String userId)

    /**
     * Возвращает ссылку на объект и title объекта
     * @param objectUuid - UUID объекта
     * @return {@link ObjectLink}
     */
    String getObjectLink(String objectUuid)
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
                     List<String> statuses,
                     String userId)
    {

        Instant startDate =
            ZonedDateTime.parse(startDateString, DateTimeFormatter.ISO_DATE_TIME).toInstant()
        Instant endDate =
            ZonedDateTime.parse(endDateString, DateTimeFormatter.ISO_DATE_TIME).plusDays(1).
                toInstant()
        def user = getUserById(userId)
        return toJson(
            service.
                getEvents(calendarFilterUuid, startDate, endDate, statuses, user)
        )
    }

    @Override
    String getObjectLink(String objectUuid)
    {
        def object = api.utils.get(objectUuid)
        return toJson(new ObjectLink(object?.title, api.web.open(objectUuid)))
    }

    private def getUserById(String id)
    {
        return api.utils.load(id)
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

    // Код группы СОДФУ Виртуальная приёмная КЦ
    private static final String GROUP_KC = 'SODFUVirtualnayaPriemnayaKC'
    // Код группы СОДФУ Виртуальная приёмная Запись на приём
    private static final String GROUP_LPFG1 = 'SODFUVirtualnayaPriemnayaZapisNaPriem'
    // Код группы СОДФУ Виртуальная приёмная Приём заявителей
    private static final String GROUP_LPFG2 = 'SODFUVirtualnayaPriemnayaPriemZayavitelei'

    private static final Set GROUPS = [GROUP_KC, GROUP_LPFG1, GROUP_LPFG2]

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
                          Instant startDate,
                          Instant endDate,
                          List<String> statuses,
                          def user)
    {
        String locationUuid = parseLocationId(calendarFilterUuid);
        // Выбираем все тайм-слоты из локации, или из календаря
        def timeSlots = locationUuid ? getLocationTimeSlots(locationUuid) :
            getCalendarTimeSlots(calendarFilterUuid)
        if (!timeSlots)
        {
            return null
        }
        // Убираем из результата слоты в статусах "Временно заблокирован для записи" (blocked)
        // и "Запись не ведётся" (stopped)
        timeSlots = timeSlots.findAll {
            !(it.state in [BLOCKED_STATE, STOPPED_STATE])
        }

        /// Объединяем слоты в статусе 'registered' с одинаковым временем начала и окончания
        timeSlots = timeSlots
            .groupBy {
                [state                                                           : (
                    it.state == REGISTERED_STATE ? it.state : it.UUID), startDate:
                     it.startDate, endDate                                       : it.endDate]
            }
            .collect { k, v -> v.find()
            }

        HashSet<String> states = Set.of(statuses);
        final boolean isMonth = periodIsMonth(startDate, endDate)
        def events = timeSlots.findResults {
            if (
            filterByState(it, states) &&
            filterMonthAppointments(it, isMonth) &&
            filterRegisteredAppointments(it) &&
            filterByDate(it, startDate, endDate) &&
            filterByUserGroup(it, user)
            )
            {
                return toEvent(it)
            }
            return null
        }
        return events
    }

    /**
     * Фильтрация слотов по группам пользователя
     * @param slot слот
     * @param user пользователь
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterByUserGroup(def slot, def user)
    {
        // Если пользователь - admin, или если статус != registere, то отображаем слот
        if (!user || (slot.state != REGISTERED_STATE))
        {
            return true
        }
        // Если пльзователь не состоит ни в одной из групп, то отображаем все слоты
        if (GROUPS.disjoint(user.employeeSecGroups*.code))
        {
            return true
        };
        def matches = user.employeeSecGroups.collect {
            switch (it.code)
            {
                case GROUP_KC: return filterSlotsForKcEmployee(slot)
                case GROUP_LPFG1: return filterSlotsForLpfgEmployee(slot)
                case GROUP_LPFG2: return filterSlotsForLpfgEmployee(slot)
                default: return false
            }
        }
        return matches.contains(true)
    }

    /**
     * Определяет видимость слота для пользователя группы СОДФУ Виртуальная приёмная КЦ
     * @param slot слот
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterSlotsForKcEmployee(def slot)
    {
        if (!slot.lastBookingLK && !slot.advBookingLK)
        {
            return false
        }
        Instant now = Instant.now()
        boolean ok = true
        if (slot.lastBookingLK && slot.lastBookingLK.toInstant() > now)
        {
            ok = false
        }
        else if (slot.advBookingLK && slot.advBookingLK.toInstant() < now)
        {
            ok = false
        }
        return ok
    }

    /**
     * Определяет видимость слота для пользователя групп "СОДФУ Виртуальная приёмная Запись на приём"
     * и "Виртуальная приёмная Приём заявителей"
     * @param slot слот
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterSlotsForLpfgEmployee(def slot)
    {
        if (!slot.lastBookingSOO && !slot.advBookingSOO)
        {
            return false
        }
        Instant now = Instant.now()
        boolean ok = true
        if (slot.lastBookingSOO && slot.lastBookingSOO.toInstant() > now)
        {
            ok = false
        }
        else if (slot.advBookingSOO && slot.advBookingSOO.toInstant() < now)
        {
            ok = false
        }
        return ok
    }

    /**
     * Фильтрация занятых тайм-слотов
     * @param slot
     * @param hideAppointments
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterByState(def slot, HashSet<String> states)
    {
        return states.contains(slot.state) || states.isEmpty()
    }

    /**
     * При отображении расписания на месяц не отображаем занятые тайм-слоты
     * @param slot
     * @param isMonth
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterMonthAppointments(def slot, boolean isMonth)
    {
        return !(isMonth && slot.state != CLOSED_STATE)
    }

    /**
     * Если есть запись на прием, то отфильтровываем по ее состоянию
     * @param slot
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterRegisteredAppointments(def slot)
    {
        if (slot.state == CLOSED_STATE)
        {
            def booking = slot.prTimeBookings?.find {
                it.state == REGISTERED_STATE
            }
            if (!booking)
            {
                return false
            }
        }
        return true;
    }

    /**
     * Фильтрация слотов по времени
     * @param slot
     * @param startDate
     * @param endDate
     * @return true, если пользователю можно отобразить слот, иначе - false
     */
    private boolean filterByDate(def slot, Instant startDate, Instant endDate)
    {
        return slot.endDate.toInstant() >= Instant.now() && datesRangesIntersect(
            startDate,
            endDate,
            slot.startDate.toInstant(),
            slot.endDate.toInstant()
        )
    }

    /**
     * Определяет, пересекаются ли 2 временных отрезка
     * @param dateFrom1 начало первого отрезка
     * @param dateTo1 окончание первого отрезка
     * @param dateFrom2 начало второго отрезка
     * @param dateTo2 окончание второго отрезка
     * @return true, если отрезки пересекаются, иначе - false
     */
    private boolean datesRangesIntersect(Instant dateFrom1,
                                         Instant dateTo1,
                                         Instant dateFrom2,
                                         Instant dateTo2)
    {
        return !(dateFrom2 > dateTo1 || dateTo2 < dateFrom1)
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

    /**
     * Возвращает все тайм-слоты для указанного календаря
     * @param calendarUuid - UUID календаря
     * @return список тайм-слотов в календаре
     */
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
        event.start = dateToIsoString(timeSlot.startDate)
        event.end = dateToIsoString(timeSlot.endDate)
        //Есть запись на прием
        if (timeSlot.state == CLOSED_STATE)
        {
            def booking = timeSlot.prTimeBookings?.find {
                it.state == REGISTERED_STATE
            }
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
        return "${ timeSlot.title } ${ api.wf.state(timeSlot).title }"
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
    private boolean periodIsMonth(Instant startDate, Instant endDate)
    {
        Date start = Date.from(startDate)
        Date end = Date.from(endDate)
        use(TimeCategory) {
            return (start + 1.month) == end
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

    private String dateToIsoString(Date date)
    {
        ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(date.toInstant(), ZoneId.of('UTC'))
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.S'Z'");
        return zonedDateTime.format(formatter);
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

