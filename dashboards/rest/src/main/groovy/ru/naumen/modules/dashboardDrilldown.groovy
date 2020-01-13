/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Бекенд для формирования ссылок
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль
package ru.naumen.modules
//region КЛАССЫ
/**
 * Объект помощник для формирования ссылок
 */
@ru.naumen.core.server.script.api.injection.InjectApi
class Link
{
    /**
     * код класс, которому принадлежат объекты списка
     */
    private String classFqn

    /**
     * Название списка
     */
    private String title

    /**
     * значение атрибута группировки
     */
    private String attrGroup

    /**
     * Json дескриптор
     */
    private String descriptor

    /**
     * коды классов, объекты которых будут отображаться в списке
     */
    private Collection<String> cases

    /**
     * список параметров группировки
     */
    private Collection<String> attrCodes

    /**
     * список фильтров
     */
    private Collection<Map<Object, Object>> filters

    /**
     * темплеит
     */
    private String template

    /**
     * время жизни ссылки в днях
     */
    private int liveDays = 30

    private Map<String, Integer> genitiveRussianMonth = Calendar.with {
        [
                'января'  : JANUARY,
                'февраля' : FEBRUARY,
                'марта'   : MARCH,
                'апреля'  : APRIL,
                'мая'     : MAY,
                'июня'    : JUNE,
                'июля'    : JULY,
                'августа' : AUGUST,
                'сентября': SEPTEMBER,
                'октября' : OCTOBER,
                'ноября'  : NOVEMBER,
                'декабря' : DECEMBER
        ]
    }

    private Map<String, Integer> nominativeRussianMonth = Calendar.with {
        [
                'январь'  : JANUARY,
                'февраль' : FEBRUARY,
                'март'    : MARCH,
                'апрель'  : APRIL,
                'май'     : MAY,
                'июнь'    : JUNE,
                'июль'    : JULY,
                'август'  : AUGUST,
                'сентябрь': SEPTEMBER,
                'октябрь' : OCTOBER,
                'ноябрь'  : NOVEMBER,
                'декабрь' : DECEMBER
        ]
    }

    /**
     * перечень
     */
    private final DATE_ATTRIBUTES = ['date', 'dateTime']
    private final LINK_TYPE_ATTRIBUTES = ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem']

    Link(Map<String, Object> map)
    {
        this.classFqn = map.classFqn
        def metaInfo = api.metainfo.getMetaClass(this.classFqn)
        this.title = map.title ?: "Список элементов '${this.classFqn}'"
        this.attrGroup = 'forDashboards' in metaInfo.getAttributeGroupCodes()
                ? 'forDashboards'
                : 'system'
        this.descriptor = map.descriptor
        this.cases = map.cases as Collection
        this.attrCodes = map.attrCodes as Collection
        this.filters = map.filters as Collection
        this.template = metaInfo.attributes.find { it.code == 'dashboardTemp' }?.with {
            utils.findFirst(this.classFqn, [(it.code): op.isNotNull()]).get(it.code)
        }
    }

    /**
     * Метод получения сконструированного билдера
     * @param api - интерфейс формирования ссылок
     * @return сконструированный билдер
     */
    def getBuilder()
    {
        def builder = api.web.defineListLink(false)
                .setTitle(title)
                .setClassCode(classFqn)
                .setCases(cases)
                .setAttrGroup(attrGroup)
                .setAttrCodes(attrCodes)
                .setDaysToLive(liveDays)
        template?.with(builder.&setTemplate)
        formatFilter(builder.filter())
        return builder
    }

    /**
     * Вспомогательный метод для формирования фильтра
     * @param filterBuilder - билдер для фильтра
     */
    private void formatFilter(def filterBuilder)
    {
        if (descriptor)
        {
            def iDescriptor = DashboardMarshaller.createContext(descriptor)
            iDescriptor.listFilter.elements.collect { orFilter ->
                orFilter.elements.collect { filter ->
                    String attribute = filter.getAttributeFqn() as String
                    String condition = filter.getProperties().conditionCode
                    def value = filter.getValue()

                    condition == 'containsSubject'
                            ? filterBuilder.OR(attribute, 'contains', utils.get(iDescriptor.clientSettings.formObjectUuid as String))
                            : filterBuilder.OR(attribute, condition, value)
                }
            }.inject(filterBuilder) { first, second -> first.AND(*second) }
        }

        if (filters)
        {
            filters.groupBy { it.attr as Attribute }.collect { Attribute attr, Collection<Map<Object, Object>> filters ->
                Map<GroupType, Collection<Object>> context = createContextFromFilters(filters)
                Collection<Collection<Object>> result = []
                //финт ушам. Предполагается проверить группировку OVERLAP сформировать по ней фильтр,
                // и после удалить из контекста, чтобы потом передать его для формирования диапазонов времени
                // Но это можно сделать за вызов одного метода
                context.remove(GroupType.OVERLAP).each { value ->
                    if (attr.type in LINK_TYPE_ATTRIBUTES)
                    {
                        def objects = findObjects(attr.ref, attr.property, value)
                        result << [filterBuilder.OR(attr.code, 'containsInSet', objects)]
                    }
                    else
                    {
                        result << [getOrFilter(attr.type, attr.code, value, filterBuilder)]
                    }
                }

                if (context)
                {
                    result << getRanges(context, this.&getMinDate.curry(attr.code)).collect { range ->
                        if (attr.type in LINK_TYPE_ATTRIBUTES)
                        {
                            def (first, second) = range
                            def objects = findObjects(attr.ref, attr.property, op.between(first, second))
                            filterBuilder.OR(attr.code, 'containsInSet', objects)
                        }
                        else
                        {
                            filterBuilder.OR(attr.code, 'fromTo', range)
                        }
                    }
                }
                result
            }.each { it.inject(filterBuilder) { first, second -> first.AND(*second) } }
        }
    }

    private def getOrFilter(String type, String code, def value, def filterBuilder)
    {
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        switch (type)
        {
            case 'state':
                return filterBuilder.OR(code, 'titleContains', value as String)
            case DATE_ATTRIBUTES:
                return filterBuilder.OR(code, 'contains', Date.parse(dateFormat, value as String))
            case 'dtInterval':
                return filterBuilder.OR(code, 'contains', api.types.newDateTimeInterval(value as int, "HOUR"))
            default:
                return filterBuilder.OR(code, 'contains', value)
        }
    }

    /**
     * Метод поиска объектов
     * @param attr - атрибут объекто
     * @param fqnClass - класс объекта
     * @param value - значение атрибута
     * @return список объектов
     */
    private List<Object> findObjects(Attribute attr, String fqnClass, def value)
    {
        return attr.ref ? utils.find(fqnClass, [(attr.code): findObjects(attr.ref, attr.property, value)])
                : utils.find(fqnClass, [(attr.code): value]).collect()
    }
    /**
     * Метод создания контекста из из списка фильтров сгруппированных по атрибуту
     * @param filters - список фильтров сгруппированных по одному атрибуту
     * @return комбинацыя типа группировки и списка значения фильтра
     */
    private Map<GroupType, Collection<Object>> createContextFromFilters(Collection<Map<Object, Object>> filters)
    {
        Map<GroupType, Collection<Object>> result = [:]
        filters.collect { [(it.group as GroupType): [it.value]] }.each {
            it.containsKey(GroupType.OVERLAP) && result.containsKey(GroupType.OVERLAP)
                    ? result << [(GroupType.OVERLAP): result.get(GroupType.OVERLAP) + it.get(GroupType.OVERLAP)]
                    : result << it
        }
        return result
    }

    /**
     * Вспомогательный метод по формированию диапазона дат
     * @return диапазон дат
     */
    private List<List<Date>> getRanges(Map<Object, Object> context, Closure<Date> findMinimum = { null })
    {
        def year = context.get(GroupType.YEAR)?.head()
        def quarter = context.get(GroupType.QUARTER)?.head()
        def month = context.get(GroupType.MONTH)?.head()
        def sevenDays = context.get(GroupType.SEVEN_DAYS)?.head()
        def week = context.get(GroupType.WEEK)?.head()
        def day = context.get(GroupType.DAY)?.head()

        Collection<Calendar> calendars

        if (year)
        {
            def calendar = Calendar.instance
            calendar.getTime()
            calendar.set(Calendar.YEAR, year as int)
            calendars = [calendar]
        }
        else
        {
            def minimumYear = Calendar.instance.with {
                it.setTime(findMinimum())
                it.get(YEAR)
            }
            int currentYear = Calendar.instance.get(Calendar.YEAR)
            calendars = (minimumYear..currentYear).collect {
                def calendar = Calendar.instance
                calendar.set(Calendar.YEAR, it)
                calendar
            }
        }

        Closure setInterval = { List oldInterval, List newInterval ->
            if (newInterval[0] > oldInterval[0])
                oldInterval[0] = newInterval[0]

            if (newInterval[1] < oldInterval[1])
                oldInterval[1] = newInterval[1]
        }

        def result = calendars.collect { calendar ->
            def rangeMonth = [Calendar.JANUARY, Calendar.DECEMBER]
            def rangeDay = [1, 31]
            def rangeHour = [0, 23]
            def rangeMinute = [0, 59]
            def rangeSecond = [0, 59]

            if (quarter) {
                int q = (quarter as String).replace(' кв-л', '') as int
                int startMonth = (q - 1) * 3
                int endMonth = startMonth + 2
                setInterval(rangeMonth, [startMonth, endMonth])

                Calendar monthCalendar = calendar.clone()
                int endDay = monthCalendar.with {
                    set(MONTH, endMonth)
                    getActualMaximum(DAY_OF_MONTH)
                }
                setInterval(rangeDay, [1, endDay])
            }

            if (month)
            {
                int m = nominativeRussianMonth.get((month as String).toLowerCase())
                setInterval(rangeMonth, [m, m])

                Calendar monthCalendar = calendar.clone()
                int endDay = monthCalendar.with {
                    set(MONTH, m)
                    getActualMaximum(DAY_OF_MONTH)
                }
                setInterval(rangeDay, [rangeDay[0], endDay])
            }

            if (sevenDays)
            {
                def (newRangeDay, newRangeMonth) = (sevenDays as String).split(" - ", 2).collect { dayAndMonth ->
                    def (d, m) = dayAndMonth.split(" ", 2)
                    [d as int, genitiveRussianMonth.get(m)]
                }.transpose()
                setInterval(rangeMonth, newRangeMonth)
                setInterval(rangeDay, newRangeDay)
            }

            if (week)
            {
                Calendar weekCalendar = calendar.clone()
                weekCalendar.set(Calendar.WEEK_OF_YEAR, week as int)
                int currentMonth = weekCalendar.get(Calendar.MONTH)
                def range = weekCalendar.with {
                    Calendar start = it.clone()
                    Calendar end = it.clone()

                    start.set(DAY_OF_WEEK, MONDAY)
                    end.set(DAY_OF_WEEK, SUNDAY)

                    [start.get(DAY_OF_MONTH), end.get(DAY_OF_MONTH)]
                }
                setInterval(rangeMonth, [currentMonth, currentMonth])
                setInterval(rangeDay, range)
            }

            if (day)
            {
                def (String currentDay, String nameMonth) = (day as String).split()
                int currentMonth = genitiveRussianMonth.get(nameMonth.toLowerCase())
                setInterval(rangeMonth, [currentMonth, currentMonth])
                setInterval(rangeDay, [currentDay as int, currentDay as int])
            }

            Calendar start = calendar.clone()
            Calendar end = calendar.clone()
            start.with {
                set(MONTH, rangeMonth[0])
                set(DAY_OF_MONTH, rangeDay[0])
                set(HOUR_OF_DAY, rangeHour[0])
                set(MINUTE, rangeMinute[0])
                set(SECOND, rangeSecond[0])
                set(MILLISECOND, -1) // Это необходимо! иначе не корректно отработают фильтры
            }
            end.with {
                set(MONTH, rangeMonth[1])
                set(DAY_OF_MONTH, rangeDay[1])
                set(HOUR_OF_DAY, rangeHour[1])
                set(MINUTE, rangeMinute[1])
                set(SECOND, rangeSecond[1])
                set(MILLISECOND, 999)
            }
            [start.getTime(), end.getTime()]
        }

        return result
    }

    //TODO: Вынести в отдельный модуль
    private Date getMinDate(String attributeCode)
    {
        return api.db.query("select min($attributeCode) from $classFqn").list().head() as Date
    }
}
//endregion

//region REST-МЕТОДЫ
/**
 * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
 * @param requestContent - параметры запроса
 * @return ссылка на на страницу с произвольным списком объектов.
 */
String getLink(Map<String, Object> requestContent, String cardObjectUuid)
{
    Link link = new Link(transformRequest(requestContent, cardObjectUuid))
    def linkBuilder = link.getBuilder()
    return api.web.list(linkBuilder)
}
//endregion

//region вспомогательных методов
/**
 *
 * @param requestContent
 * @param cardObjectUuid
 * @return
 */
private Map<String, Object> transformRequest(Map<String, Object> requestContent, String cardObjectUuid)
{
    Closure<Map<String, Object>> transform = { Map<String, Object> request ->
        Map<String, Object> res = [:] << request
        res.descriptor = DashboardMarshaller.substitutionCardObject(request.descriptor as String, cardObjectUuid)
        return res
    }
    return cardObjectUuid ? transform(requestContent) : requestContent
}
//endregion