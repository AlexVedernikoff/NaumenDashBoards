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
    private String template = "DlyaDashbordov"

    /**
     * время жизни ссылки в днях
     */
    private int liveDays = 30

    private def api

    private Map<String, Integer> genitiveRussianMonth = Calendar.with {
        [
                'января': JANUARY,
                'февраля': FEBRUARY,
                'марта': MARCH,
                'апреля': APRIL,
                'мая': MAY,
                'июня': JUNE,
                'июля': JULY,
                'августа': AUGUST,
                'сентября': SEPTEMBER,
                'октября': OCTOBER,
                'ноября': NOVEMBER,
                'декабря': DECEMBER
        ]
    }

    private Map<String, Integer> nominativeRussianMonth = Calendar.with {
        [
                'январь': JANUARY,
                'февраль': FEBRUARY,
                'март': MARCH,
                'апрель': APRIL,
                'май': MAY,
                'июнь': JUNE,
                'июль': JULY,
                'август': AUGUST,
                'сентябрь': SEPTEMBER,
                'октябрь': OCTOBER,
                'ноябрь': NOVEMBER,
                'декабрь': DECEMBER
        ]
    }

    /**
     * перечень
     */
    private final DATE_ATTRIBUTES = ['date', 'dateTime']

    Link(Map<String, Object> map, def api) {
        this.api = api
        this.classFqn = map.classFqn
        this.title = map.title ?: "Список элементов ${this.classFqn}"
        this.attrGroup = 'forDashboards' in this.api.metainfo.getMetaClass(this.classFqn).getAttributeGroupCodes()
                ? 'forDashboards'
                : 'system'
        this.descriptor = map.descriptor
        this.cases = map.cases as Collection
        this.attrCodes = map.attrCodes as Collection
        this.filters = map.filters as Collection
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
                .setTemplate(template)
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
            createContext(descriptor).listFilter.elements.collect { orFilter ->
                orFilter.elements.collect { filter ->
                    String attribute = (filter.getAttributeFqn() as String).split('@', 2).tail().head()
                    String condition = filter.getProperties().conditionCode
                    def value = filter.getValue()
                    filterBuilder.OR(attribute, condition, value)
                }
            }.each { orFilters ->
                filterBuilder.AND(*orFilters)
            }
        }

        if (filters)
        {
            filters.groupBy {it.attr}.collect { attr, filters -> //на случай если атрибуты одинаковые
                String type = attr.type
                String code = attr.code
                def context = filters.collect { [ (it.group as GroupType) : [it.value] ] }.inject([:]) { first, second ->
                    GroupType.with {
                        second.containsKey(OVERLAP) && first.containsKey(OVERLAP)
                                ? first << [(OVERLAP) : first.get(OVERLAP) + (second.get(OVERLAP))]
                                : first << second
                    }
                }

                def simpleFilter = context.remove(GroupType.OVERLAP).collect { value ->
                    getOrFilter(type, code, value, filterBuilder)
                }

                if (context)
                {
                    simpleFilter.add(filterBuilder.OR(code, 'fromTo', getRange(context)))
                }
                simpleFilter
            }.flatten().inject(filterBuilder) { first, second -> first.AND(second) }
        }
    }

    private def getOrFilter(String type, String code, def value, def filterBuilder)
    {
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        switch (type)
        {
            case ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem']:
                return filterBuilder.OR(code, 'titleContains', value)
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
     * Вспомогательный метод по формированию диапазона дат
     * @return диапазон дат
     */
    private List<Date> getRange(Map<Object, Object> context)
    {
        def year = context.get(GroupType.YEAR)?.head()
        def quarter = context.get(GroupType.QUARTER)?.head()
        def month = context.get(GroupType.MONTH)?.head()
        def sevenDays = context.get(GroupType.SEVEN_DAYS)?.head()
        def week = context.get(GroupType.WEEK)?.head()
        def day = context.get(GroupType.DAY)?.head()

        def calendar = Calendar.instance

        def rangeMonth = [Calendar.JANUARY, Calendar.DECEMBER]
        def rangeDay = [1, 31]
        def rangeHour = [0, 23]
        def rangeMinute = [0, 59]
        def rangeSecond = [0, 59]

        Closure setInterval = { List oldInterval, List newInterval ->
            if (newInterval[0] > oldInterval[0])
                oldInterval[0] = newInterval[0]

            if (newInterval[1] < oldInterval[1])
                oldInterval[1] = newInterval[1]
        }

        if (year) 
        { // если год не указан, считаем что текущий
            calendar.set(Calendar.YEAR, year as int)
        }

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
            def (lowerLimit, upperLimit) = (sevenDays as String).split(" - ", 2).collect { dayAndMonth ->
                def (int d, int m) = dayAndMonth.split(" ", 2)
                [m, d]
            }
            def (int lowerLimitMonth, int lowerLimitDay) = lowerLimit
            def (int upperLimitMonth, int upperLimitDay) = upperLimit
            setInterval(rangeMonth, [lowerLimitMonth, upperLimitMonth])
            setInterval(rangeDay, [lowerLimitDay, upperLimitDay])
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
            def (int currentDay, String nameMonth) = (day as String).split()
            int currentMonth = genitiveRussianMonth.get(nameMonth.toLowerCase())
            setInterval(rangeMonth, [currentMonth, currentMonth])
            setInterval(rangeDay, [currentDay, currentDay])
        }

        Calendar start = calendar.clone()
        Calendar end = calendar.clone()
        start.with {
            set(MONTH, rangeMonth[0])
            set(DAY_OF_MONTH, rangeDay[0])
            set(HOUR_OF_DAY, rangeHour[0])
            set(MINUTE, rangeMinute[0])
            set(SECOND, rangeSecond[0])
        }
        end.with {
            set(MONTH, rangeMonth[1])
            set(DAY_OF_MONTH, rangeDay[1])
            set(HOUR_OF_DAY, rangeHour[1])
            set(MINUTE, rangeMinute[1])
            set(SECOND, rangeSecond[1])
        }

        return [start.getTime(), end.getTime()]
    }

    def createContext(String json)
    {
        def factory = com.google.web.bindery.autobean.vm.AutoBeanFactorySource.create(ru.naumen.core.shared.autobean.wrappers.AdvlistSettingsAutoBeanFactory.class)
        def autoBean = com.google.web.bindery.autobean.shared.AutoBeanCodex.decode(factory, ru.naumen.core.shared.autobean.wrappers.IReducedListDataContextWrapper.class, json)
        return ru.naumen.core.shared.autobean.wrappers.ReducedListDataContext.createObjectListDataContext(autoBean.as())
    }
}
//endregion

//region REST-МЕТОДЫ
/**
 * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
 * @param requestContent - параметры запроса
 * @return ссылка на на страницу с произвольным списком объектов.
 */
String getLink(Map<String, Object> requestContent)
{
    Link link = new Link(requestContent, api)
    def linkBuilder = link.getBuilder()
    return api.web.list(linkBuilder)
}
//endregion