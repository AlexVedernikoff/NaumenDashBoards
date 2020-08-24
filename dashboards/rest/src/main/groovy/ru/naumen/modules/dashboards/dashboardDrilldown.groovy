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
package ru.naumen.modules.dashboards
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

    private Map<String, Integer> russianWeekDay =
        [
            'понедельник': 1,
            'вторник'    : 2,
            'среда'      : 3,
            'четверг'    : 4,
            'пятница'    : 5,
            'суббота'    : 6,
            'воскресенье': 7
        ]

    /**
     * перечень
     */
    private String subjectUUID

    Link(Map<String, Object> map, String cardObjectUuid)
    {
        this.subjectUUID = cardObjectUuid
        this.classFqn = map.classFqn
        def metaInfo = api.metainfo.getMetaClass(this.classFqn)
        this.title = map.title ?: "Список элементов '${ this.classFqn }'"
        this.attrGroup = 'forDashboards' in metaInfo.getAttributeGroupCodes()
            ? 'forDashboards'
            : 'system'
        this.descriptor = map.descriptor
        this.cases = map.cases as Collection
        this.attrCodes = map.attrCodes as Collection
        this.filters = map.filters as Collection
        this.template = metaInfo.attributes.find {
            it.code == 'dashboardTemp'
        }?.with {
            api.utils.findFirst(this.classFqn, [(it.code): op.isNotNull()])?.get(it.code)
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
        if (descriptor)
        {
            def slurper = new groovy.json.JsonSlurper()
            def UUID = slurper.parseText(descriptor).cardObjectUuid
            builder.setUuid(UUID)
        }
        template?.with(builder.&setTemplate)
        def filterBuilder = builder.filter()
        addDescriptorInFilter(filterBuilder, descriptor)
        formatFilter(filterBuilder)
        return builder
    }

    /**
     * Применеине дескриптора в фильтре
     * @param filterBuilder - билдер для фильтра
     * @param descriptor - объект фильтрации
     */
    private void addDescriptorInFilter(def filterBuilder, String descriptor)
    {
        if (descriptor)
        {
            def iDescriptor = DashboardMarshaller.createContext(descriptor)
            iDescriptor.listFilter.elements.collect { orFilter ->
                orFilter.elements.collect { filter ->
                    String attribute = filter.getAttributeFqn() as String
                    String condition = filter.getProperties().conditionCode
                    def value = filter.getValue()
                    if (condition == 'containsSubject')
                    { // костыль. так как дескриптор статичный, а условие должно быть динамичным
                        def uuidSubject =
                            api.utils.get(iDescriptor.clientSettings.formObjectUuid as String)
                        filterBuilder.OR(attribute, 'contains', uuidSubject)
                    }
                    else
                    {
                        if (condition.toLowerCase().contains('subject'))
                        {
                            def (metaClass, subjectAttribute) = value?.getUUID()?.split('@')
                            value = api.metainfo.getMetaClass(metaClass)
                                       .getAttribute(subjectAttribute)
                                       .getAttributeFqn()
                        }
                        filterBuilder.OR(attribute, condition, value)
                    }
                }
            }.inject(filterBuilder) { first, second -> first.AND(*second)
            }
        }
    }

    /**
     * Вспомогательный метод для формирования фильтра
     * @param filterBuilder - билдер для фильтра
     */
    private void formatFilter(def filterBuilder)
    {
        if (filters)
        {
            filters.groupBy {
                Attribute.fromMap(it.attribute as Map)
            }.collect { Attribute attr, Collection<Map> filter ->
                Collection<Collection> result = []
                String attributeType = attr.type as String

                def contextValue = filter.findResults { map ->
                    def group = map.group as Map
                    def value = map.value
                    String groupWay = group.way
                    GroupType groupType = groupWay.toLowerCase() == 'system'
                        ? attributeType == AttributeType.DT_INTERVAL_TYPE ? GroupType.OVERLAP :
                        group.data as GroupType
                        : null
                    String format =
                        attributeType == AttributeType.DT_INTERVAL_TYPE ? group.data : group.format
                    def returnValue = null
                    if (groupType)
                    {
                        if (attributeType in AttributeType.DATE_TYPES
                              || attributeType == AttributeType.DT_INTERVAL_TYPE)
                        {
                            returnValue = [(groupType):
                                               attributeType == AttributeType.DT_INTERVAL_TYPE
                                                   ? [[value, format]]
                                                   : [value, format]
                            ]
                        }
                        else
                        {
                            returnValue = [(groupType): [value]]
                        }
                    }
                    returnValue
                }

                //Тут находим нужную подгруппу пользовательской группировки
                def customSubGroupSet = filter.findResults { map ->
                    def group = map.group as Map
                    String value = map.value
                    if (group.way.toLowerCase() == 'custom')
                    {
                        def customGroup = group.data as Map
                        def subGroupSet = customGroup.subGroups as Collection
                        return subGroupSet.findResult { el ->
                            def subgroup = el as Map
                            subgroup.name == value ? subgroup.data as Collection<Collection<Map>> :
                                null
                        }
                    }
                    else
                    {
                        return null
                    }
                }

                def context = createContext(contextValue)
                context.remove(GroupType.OVERLAP).each { value ->
                    if (attr?.code?.contains(AttributeType.TOTAL_VALUE_TYPE))
                    {
                        attr.code = AttributeType.TOTAL_VALUE_TYPE
                        result << [filterBuilder.OR(attr.code, 'notNull', null)]
                        attr.ref = new Attribute(
                            code: 'textValue',
                            type: 'string',
                            property: AttributeType.TOTAL_VALUE_TYPE
                        )
                        def objects = findObjects(attr.ref, attr.property, value)
                        result << [filterBuilder.OR(attr.code, 'containsInSet', objects)]
                    }
                    else
                    {
                        if (attributeType in AttributeType.LINK_TYPES)
                        {
                            def objects = findObjects(attr.ref, attr.property, value)
                            result << [filterBuilder.OR(attr.code, 'containsInSet', objects)]
                        }
                        else
                        {
                            result << [getOrFilter(attributeType, attr.code, value, filterBuilder)]
                        }
                    }
                }
                if (context)
                {
                    //Тут обработка только группировок по датам
                    context.keySet().each { groupType ->
                        def value = context.get(groupType)
                        def format = value.last()
                        String stringValue = value.head()
                        getDateFilters(groupType, format, stringValue, filterBuilder, attr)
                    }
                }
                for (customSubGroupCondition in customSubGroupSet)
                {
                    switch (attributeType)
                    {
                        case AttributeType.DT_INTERVAL_TYPE:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    String condition = getFilterCondition(it.type as String)
                                    def interval = it.data as Map
                                    def value = interval
                                        ? api.types.newDateTimeInterval([interval.value as long,
                                                                         interval.type as String])
                                        : null
                                    //TODO: до конца не уверен. Нужно ли извлекать милисекунды или нет
                                    filterBuilder.OR(attr.code, condition, value)
                                }
                            }
                            break
                        case AttributeType.STRING_TYPE:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    String condition = getFilterCondition(it.type as String)
                                    String value = it.data
                                    filterBuilder.OR(attr.code, condition, value)
                                }
                            }
                            break
                        case AttributeType.INTEGER_TYPE:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    String condition = getFilterCondition(it.type as String)
                                    def value = it.data ? it.data as int : null
                                    filterBuilder.OR(attr.code, condition, value)
                                }
                            }
                            break
                        case AttributeType.DOUBLE_TYPE:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    String condition = getFilterCondition(it.type as String)
                                    def value = it.data ? it.data as double : null
                                    filterBuilder.OR(attr.code, condition, value)
                                }
                            }
                            break
                        case AttributeType.DATE_TYPES:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    switch (it.type.toLowerCase())
                                    {
                                        case 'today':
                                            return filterBuilder.OR(attr.code, 'today', null)
                                        case 'last':
                                            return filterBuilder.OR(attr.code, 'lastN', it.data as int)
                                        case 'near':
                                            return filterBuilder.OR(attr.code, 'nextN', it.data as int)
                                        case 'between':
                                            String dateFormat = 'yyyy-MM-dd'
                                            def dateSet = it.data as Map<String, Object> // тут будет массив дат или одна из них
                                            def start
                                            if(dateSet.startDate)
                                            {
                                                start = Date.parse(dateFormat, dateSet.startDate as String)
                                            }
                                            else
                                            {
                                                Date minDate = modules.dashboardCommon.getMinDate(
                                                    attr.code,
                                                    attr.sourceCode
                                                )
                                                start = new Date(minDate.time).clearTime()
                                            }
                                            def end
                                            if (dateSet.endDate)
                                            {
                                                end = Date.parse(dateFormat, dateSet.endDate as String)
                                            }
                                            else
                                            {
                                                end = new Date().clearTime()
                                            }
                                            return filterBuilder.OR(attr.code, 'fromTo', [start, end])
                                        default: throw new IllegalArgumentException("Not supported")
                                    }
                                }
                            }
                            break
                        case AttributeType.STATE_TYPE:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    switch (it.type.toLowerCase())
                                    {
                                        case 'contains':
                                            return filterBuilder.OR(attr.code, 'contains', it.data.uuid)
                                        case 'not_contains':
                                            return filterBuilder.OR(attr.code, 'notContains', it.data.uuid)
                                        case 'contains_any':
                                            return filterBuilder.OR(attr.code, 'containsInSet', it.data*.uuid)
                                        case 'title_contains':
                                            return filterBuilder.OR(attr.code, 'titleContains', it.data)
                                        case 'title_not_contains':
                                            return filterBuilder.OR(attr.code, 'titleNotContains', it.data)
                                        case ['equal_subject_attribute', 'equal_attr_current_object']:
                                            return filterBuilder.OR(attr.code, 'contains', it.data.uuid)
                                        default: throw new IllegalArgumentException(
                                            "Not supported condition type: ${ it.type }"
                                        )
                                    }
                                }
                            }
                            break
                        case AttributeType.LINK_TYPES:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    switch (it.type.toLowerCase())
                                    {
                                        case 'empty':
                                            return filterBuilder.OR(attr.code, 'null', null)
                                        case 'not_empty':
                                            return filterBuilder.OR(attr.code, 'notNull', null)
                                        case 'contains':
                                            def value = api.utils.get(it.data.uuid)
                                            return filterBuilder.OR(attr.code, 'contains', value)
                                        case 'not_contains':
                                            def value = api.utils.get(it.data.uuid)
                                            return filterBuilder.OR(attr.code, 'notContains', value)
                                        case 'title_contains':
                                            def value = it.data
                                            return filterBuilder.OR(
                                                attr.code,
                                                'titleContains',
                                                value
                                            )
                                        case 'title_not_contains':
                                            def value = it.data
                                            return filterBuilder.OR(
                                                attr.code,
                                                'titleNotContains',
                                                value
                                            )
                                        case 'contains_including_archival':
                                            def value = api.utils.get(it.data.uuid)
                                            return filterBuilder.OR(
                                                attr.code,
                                                'containsWithRemoved',
                                                value
                                            )
                                        case 'not_contains_including_archival':
                                            def value = api.utils.get(it.data.uuid)
                                            return filterBuilder.OR(
                                                attr.code,
                                                'notContainsWithRemoved',
                                                value
                                            )
                                        case 'contains_any':
                                            def uuids = it.data*.uuid
                                            def values = uuids.collect { uuid ->
                                                api.utils.get(uuid)
                                            }
                                            return filterBuilder.OR(
                                                attr.code,
                                                'containsInSet',
                                                values
                                            )
                                        case ['contains_current_object', 'equal_current_object']:
                                            return filterBuilder.OR(
                                                attr.code,
                                                'contains',
                                                subjectUUID
                                            )
                                        case ['contains_attr_current_object',
                                              'equal_attr_current_object']:
                                            def subjectAttribute = it.data
                                            def code = subjectAttribute.code
                                            def subjectType = subjectAttribute.type
                                            if (subjectType != attributeType)
                                            {
                                                throw new IllegalArgumentException(
                                                    "Does not match attribute type: " +
                                                    "$subjectType and $attributeType"
                                                )
                                            }
                                            def value = api.utils.get(subjectUUID)[code]
                                            return filterBuilder.OR(attr.code, 'contains', value)
                                        default: throw new IllegalArgumentException(
                                            "Not supported condition type: ${ it.type }"
                                        )
                                    }
                                }
                            }
                            break
                        case AttributeType.TIMER_TYPES:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    switch (it.type.toLowerCase())
                                    {
                                        case 'status_contains':
                                            String code = it.data.value?.toLowerCase()?.take(1)
                                            return filterBuilder.
                                                OR(attr.code, 'timerStatusContains', [code])
                                        case 'status_not_contains':
                                            String code = it.data.value?.toLowerCase()?.take(1)
                                            return filterBuilder.
                                                OR(attr.code, 'timerStatusNotContains', [code])
                                        case 'expires_between':
                                            String dateFormat = 'yyyy-MM-dd'
                                            def dateSet = it.data as Map
                                            def start =
                                                Date.parse(dateFormat, dateSet.startDate as String)
                                            def end =
                                                Date.parse(dateFormat, dateSet.endDate as String)
                                            return filterBuilder.OR(
                                                attr.code,
                                                'backTimerDeadLineFromTo',
                                                [start, end]
                                            )
                                        case 'expiration_contains':
                                            String conditionType = it.data.value == 'EXCEED'
                                                ? 'timerStatusContains'
                                                : 'timerStatusNotContains'
                                            return filterBuilder.OR(attr.code, conditionType, ['e'])
                                        default: throw new IllegalArgumentException(
                                            "Not supported condition type: ${ it.type }"
                                        )
                                    }
                                }
                            }
                            break
                        default: throw new IllegalArgumentException(
                            "Not supported attribute type: ${ attributeType }"
                        )
                    }
                }
                result
            }.each { it ->
                it.inject(filterBuilder) { first, second -> first.AND(*second)
                }
            }
        }
    }

    private String getFilterCondition(String condition)
    {
        switch (condition.toLowerCase())
        {
            case 'empty':
                return 'null'
            case 'not_empty':
                return 'notNull'
            case ['equal', 'contains']:
                return 'contains'
            case ['not_contains', 'not_equal', 'not_contains_not_empty']:
                return 'notContains'
            case ['not_contains_including_empty', 'not_equal_not_empty']:
                return 'notContainsIncludeEmpty'
            case 'greater':
                return 'greater'
            case 'less':
                return 'less'
            default: throw new IllegalArgumentException("Not Supported condition type $condition")
        }
    }

    private GroupType getDTIntervalGroupType(String groupType)
    {
        switch (groupType.toLowerCase())
        {
            case 'overlap':
                return GroupType.OVERLAP
            case 'second':
                return GroupType.SECOND_INTERVAL
            case 'minute':
                return GroupType.MINUTE_INTERVAL
            case 'hour':
                return GroupType.HOUR_INTERVAL
            case 'day':
                return GroupType.DAY_INTERVAL
            case 'week':
                return GroupType.WEEK_INTERVAL
            default:
                throw new IllegalArgumentException("Not supported group type in dateTimeInterval attribute: $groupType")
        }
    }

    private def getOrFilter(String type, String code, def value, def filterBuilder)
    {
        //TODO: хорошему нужно вынести все эти методы в enum. Можно прям в этом модуле
        // Список доступных условий фильтрации: "notContainsIncludeEmpty", "nextN", "containsInSet",
        // "beforeUserAttribute", "beforeSubjectAttribute", "afterUserAttribute", "afterSubjectAttribute",
        // "containsWithNested", "incorrect", "contains", "notContains", "null", "notNull", "greater", "less",
        // "fromTo", "lastN", "today", "timerStatusContains", "timerStatusNotContains", "backTimerDeadLineFromTo",
        // "backTimerDeadLineContains", "titleContains", "titleNotContains", "containsWithRemoved",
        // "notContainsWithRemoved", "containsUser", "containsSubject", "containsUserAttribute", "containsSubjectAttribute"
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        switch (type)
        {
            case [AttributeType.STATE_TYPE, AttributeType.META_CLASS_TYPE]:
                return filterBuilder.OR(code, 'titleContains', value as String)
            case AttributeType.DATE_TYPES:
                return filterBuilder.OR(code, 'contains', Date.parse(dateFormat, value as String))
            case AttributeType.DT_INTERVAL_TYPE:
                def (intervalValue, intervalType) = value
                def interval = api.types.newDateTimeInterval([intervalValue as long, intervalType as String])
                return filterBuilder.OR(code, 'contains', interval)
            case AttributeType.TIMER_TYPES:
                String statusCode = TimerStatus.getByName(value)
                return filterBuilder.OR(code, 'timerStatusContains', [statusCode])
            case AttributeType.BOOL_TYPE:
                if (!value.isInteger()) {
                    value = value.toLowerCase() == 'да' ? '1' : '0'
                }
                return filterBuilder.OR(code, 'contains', value)
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
        return attr.ref ?
            api.utils.find(fqnClass, [(attr.code): findObjects(attr.ref, attr.property, value)])
            : api.utils.find(fqnClass, [(attr.code): value]).collect()
    }
    /**
     * Метод создания контекста из из списка фильтров сгруппированных по атрибуту
     * @param data - список фильтров сгруппированных по одному атрибуту
     * @return комбинацыя типа группировки и списка значения фильтра
     */
    private Map<GroupType, Collection> createContext(Collection<Map<GroupType, Object>> data)
    {
        Map<GroupType, Collection> result = [:]
        data.each {
            it.containsKey(GroupType.OVERLAP) && result.containsKey(GroupType.OVERLAP)
                ? result << [(GroupType.OVERLAP):
                                 result.get(GroupType.OVERLAP) + it.get(GroupType.OVERLAP)]
                : result << it
        }
        return result
    }

    /**
     * Вспомогательный метод по формированию диапазона дат
     * @return диапазон дат
     */
    private List<List<Date>> getRanges(Map<Object, Object> context, Closure<Date> findMinimum = {
        null
    })
    {
        def year = context.get(GroupType.YEAR)?.head()
        def quarter = context.get(GroupType.QUARTER)?.head()
        def month = context.get(GroupType.MONTH)?.head()
        def sevenDays = context.get(GroupType.SEVEN_DAYS)?.head()
        def week = context.get(GroupType.WEEK)?.head()
        def day = context.get(GroupType.DAY)?.head()

        def dayFormat = context.get(GroupType.DAY)?.last()
        def weekFormat = context.get(GroupType.WEEK)?.last()

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
            {
                oldInterval[0] = newInterval[0]
            }

            if (newInterval[1] < oldInterval[1])
            {
                oldInterval[1] = newInterval[1]
            }
        }

        def result = calendars.collect { calendar ->
            def rangeMonth = [Calendar.JANUARY, Calendar.DECEMBER]
            def rangeDay = [1, 31]
            def rangeHour = [0, 23]
            def rangeMinute = [0, 59]
            def rangeSecond = [0, 59]

            if (quarter)
            {
                def q = (quarter as String).replace(' кв-л', '').split(' ')
                int startMonth = ((q[0] as int) - 1) * 3
                int endMonth = startMonth + 2
                int necessaryYear = q.size() > 1 ? q[1] as int : null
                setInterval(rangeMonth, [startMonth, endMonth])

                Calendar monthCalendar = calendar.clone()
                int endDay = monthCalendar.with {
                    if (necessaryYear) {
                        set(Calendar.YEAR, necessaryYear)
                    }
                    set(MONTH, endMonth)
                    getActualMaximum(DAY_OF_MONTH)
                }
                setInterval(rangeDay, [1, endDay])
            }

            if (month)
            {
                String[] monthValue = month.split()
                int m = nominativeRussianMonth.get((monthValue[0] as String).toLowerCase())
                setInterval(rangeMonth, [m, m])

                Calendar monthCalendar = calendar.clone()
                int endDay = monthCalendar.with {
                    if (monthValue.size() > 1) {
                        set(YEAR, monthValue[1] as int)
                    }
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
                def weekValue = (week as String).contains('-я')
                    ? week.replace('-я', '').split()
                    : week.replace(' неделя', '').split()
                if (weekFormat == 'WW YY') {
                    int necessaryYear = weekValue[1] as int
                    calendar.set(Calendar.YEAR, necessaryYear)
                }
                Calendar weekCalendar = calendar.clone()

                weekCalendar.set(Calendar.WEEK_OF_YEAR, weekValue[0] as int)
                int currentMonth = weekCalendar.get(Calendar.MONTH)
                def range = weekCalendar.with {
                    Calendar start = it.clone()
                    Calendar end = it.clone()
                    if (weekFormat == 'WW YY') {
                        weekCalendar.set(Calendar.YEAR, weekValue[1] as int)
                    }

                    start.set(DAY_OF_WEEK, MONDAY)
                    end.set(DAY_OF_WEEK, SUNDAY)

                    [start.get(DAY_OF_MONTH), end.get(DAY_OF_MONTH)]
                }
                calendar.set(Calendar.WEEK_OF_YEAR, weekValue[0] as int)
                setInterval(rangeMonth, [currentMonth, currentMonth])
                setInterval(rangeDay, range)
            }

            if (day)
            {
                switch (dayFormat) {
                    case 'dd.mm.YY':
                        List<String> splitDate = (day as String).replace('.', '/').split('/')

                        int dateDay =  splitDate[0] as int
                        int dateMonth =  splitDate[1] as int
                        int dateYear = splitDate[2] as int

                        calendar.set(Calendar.YEAR, dateYear)
                        setInterval(rangeMonth, [dateMonth - 1, dateMonth - 1])
                        setInterval(rangeDay, [dateDay, dateDay])
                        break
                    case 'dd.mm.YY hh':
                        List<String> fullDate = (day as String).replace('ч', '')
                                                               .replace(',', '')
                                                               .split()
                        String date = fullDate[0]
                        String[] splitDate = date.replace('.', '/').split('/')

                        int dateDay =  splitDate[0] as int
                        int dateMonth =  splitDate[1] as int
                        int dateYear = splitDate[2] as int

                        int dateHour = fullDate[1] as int
                        calendar.set(Calendar.YEAR, dateYear)

                        setInterval(rangeMonth, [dateMonth - 1, dateMonth - 1])
                        setInterval(rangeDay, [dateDay, dateDay])
                        setInterval(rangeHour, [dateHour, dateHour])
                        break
                    case 'dd.mm.YY hh:ii':
                        List<String> fullDate = (day as String).split()
                        String date = fullDate[0]
                        String[] splitDate = date.replace('.', '/').split('/')

                        int dateDay =  splitDate[0] as int
                        int dateMonth =  splitDate[1] as int
                        int dateYear = splitDate[2] as int

                        String[] dateTime = fullDate[1].split(':')
                        int dateHour = dateTime[0] as int
                        int dateMinute = dateTime[1] as int
                        calendar.set(Calendar.YEAR, dateYear)

                        setInterval(rangeMonth, [dateMonth-1, dateMonth-1])
                        setInterval(rangeDay, [dateDay, dateDay])
                        setInterval(rangeHour, [dateHour, dateHour])
                        setInterval(rangeMinute, [dateMinute, dateMinute])
                        break
                    default:
                        def (String currentDay, String nameMonth) = (day as String).split()
                        int currentMonth = genitiveRussianMonth.get(nameMonth.toLowerCase())
                        setInterval(rangeMonth, [currentMonth, currentMonth])
                        setInterval(rangeDay, [currentDay as int, currentDay as int])
                }
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

    /**
     * Метод получения фильтров по дате
     * @param groupType - тип системной группировки по дате
     * @param format - формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getDateFilters(GroupType groupType, String format, String value,
                       def filterBuilder, Attribute attr)
    {
        if(attr?.code?.contains(AttributeType.TOTAL_VALUE_TYPE))
        {
            attr.code = AttributeType.TOTAL_VALUE_TYPE
            filterBuilder.AND(filterBuilder.OR(attr.code, 'notNull', null))
            attr.ref = new Attribute(code: 'textValue',
                                     type: 'string',
                                     property: AttributeType.TOTAL_VALUE_TYPE)
            def objects = findObjects(attr.ref, attr.property, value)
            filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', objects))
        }
        switch (groupType) {
            case GroupType.DAY:
                return getDayFilters(format, value, filterBuilder, attr)
            case GroupType.WEEK:
                return getWeekFilters(format, value, filterBuilder, attr)
            case GroupType.MONTH:
                return getMonthFilters(format, value, filterBuilder, attr)
            case GroupType.QUARTER:
                return getQuarterFilters(format, value, filterBuilder, attr)
            case GroupType.YEAR:
                return getYearFilters(format, value, filterBuilder, attr)
            case GroupType.SEVEN_DAYS:
                return getSevenDaysFilters(format, value, filterBuilder, attr)
            case GroupType.HOURS:
                return getHourFilters(format, value, filterBuilder, attr)
            case GroupType.MINUTES:
                return getMinuteFilters(format, value, filterBuilder, attr)
            default: throw new IllegalArgumentException("Not supported group type: $groupType")
        }
    }

    /**
     * Метод получения фильтра по дням
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getDayFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case 'dd':
                def datePoint = api.date.createDateTimePoint("DAY", value.replace('-й', '') as int)
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePoint, datePoint]))
            case 'WD':
                def datePoint = api.date.createDateTimePoint("WEEKDAY", russianWeekDay.get(value))
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePoint, datePoint]))
            case 'dd.mm.YY':
                List<String> splitDate = value.replace('.', '/').split('/')
                def (day, month, year) = splitDate

                def datePointDay = api.date.createDateTimePoint("DAY", day as int)
                def datePointMonth = api.date.createDateTimePoint("MONTH", month as int)
                def datePointYear = api.date.createDateTimePoint("YEAR", year as int)

                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointDay, datePointDay]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMonth, datePointMonth]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointYear, datePointYear]))

            case 'dd.mm.YY hh':
                List<String> fullDate = value.replace('ч', '').replace(',', '').split()
                def (date, hour) = fullDate
                String[] splitDate = date.replace('.', '/').split('/')
                def (day, month, year) = splitDate

                def datePointDay = api.date.createDateTimePoint("DAY", day as int)
                def datePointMonth = api.date.createDateTimePoint("MONTH", month as int)
                def datePointYear = api.date.createDateTimePoint("YEAR", year as int)
                def datePointHour = api.date.createDateTimePoint("HOUR", hour as int)

                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointDay, datePointDay]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMonth, datePointMonth]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointYear, datePointYear]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointHour, datePointHour]))
            case 'dd.mm.YY hh:ii':
                List<String> fullDate = value.split()
                def(date, dateTime) = fullDate
                String[] splitDate = date.replace('.', '/').split('/')
                def (day, month, year) = splitDate
                def(hour, minute) = dateTime.split(':')

                def datePointDay = api.date.createDateTimePoint("DAY", day as int)
                def datePointMonth = api.date.createDateTimePoint("MONTH", month as int)
                def datePointYear = api.date.createDateTimePoint("YEAR", year as int)
                def datePointHour = api.date.createDateTimePoint("HOUR", hour as int)
                def datePointMinute = api.date.createDateTimePoint("MINUTE", minute as int)

                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointDay, datePointDay]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMonth, datePointMonth]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointYear, datePointYear]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointHour, datePointHour]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMinute, datePointMinute]))

            case 'dd MM':
            default:
                def (String day, String monthName) = value.split()
                int month = genitiveRussianMonth.get(monthName.toLowerCase()) + 1
                def datePointDay = api.date.createDateTimePoint("DAY", day as int)
                def datePointMonth = api.date.createDateTimePoint("MONTH", month as int)
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointDay, datePointDay]))
                                    .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMonth, datePointMonth]))
        }
    }

    /**
     * Метод получения фильтра по неделям
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getWeekFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case ['ww', 'WW YY']:
            default:
                def weekValue = value.contains('-я')
                    ? value.replace('-я', '').split()
                    : value.replace(' неделя', '').split()
                def week = weekValue[0] as int
                def year = weekValue.size() > 1 ? weekValue[1] as int : null
                def datePointWeek = api.date.createDateTimePoint("WEEK", week)
                def datePointYear = year ? api.date.createDateTimePoint("YEAR", year) : null
                def filters = year
                    ? filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointWeek, datePointWeek]))
                                   .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointYear, datePointYear]))
                    : filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointWeek, datePointWeek]))
                return filters
        }
    }

    /**
     * Метод получения фильтра по месяцам
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getMonthFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case ['MM', 'MM YY']:
            default:
                def monthValue = value.split(' ')
                def month = nominativeRussianMonth.get(monthValue[0]) + 1
                def year = monthValue.size() > 1 ? monthValue[1] as int : null
                def datePointMonth = api.date.createDateTimePoint("MONTH", month)
                def datePointYear = year ? api.date.createDateTimePoint("YEAR", year) : null
                def filters = year
                    ? filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMonth, datePointMonth]))
                                   .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointYear, datePointYear]))
                    : filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMonth, datePointMonth]))
                return filters
        }
    }

    /**
     * Метод получения фильтра по кварталам
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getQuarterFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case ['QQ', 'QQ YY']:
            default:
                def quarterValue = value.replace(' кв-л', '').split(' ')
                def quarter = quarterValue[0] as int
                def year = quarterValue.size() > 1 ? quarterValue[1] as int : null
                def datePointQuarter = api.date.createDateTimePoint("QUARTER", quarter)
                def datePointYear = year ? api.date.createDateTimePoint("YEAR", year) : null
                def filters = year
                    ? filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointQuarter, datePointQuarter]))
                                   .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointYear, datePointYear]))
                    : filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointQuarter, datePointQuarter]))
                return filters
        }
    }

    /**
     * Метод получения фильтра по годам
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getYearFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case 'yyyy':
                def datePoint = api.date.createDateTimePoint("YEAR", value as int)
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePoint, datePoint]))
            default: throw new IllegalArgumentException("Not supported year format: $format")
        }
    }

    /**
     * Метод получения фильтра по 7 дней
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getSevenDaysFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case 'dd mm - dd mm':
            default:
                def (day, month) = value.split(" - ", 2).collect { dayAndMonth ->
                    def (d, m) = dayAndMonth.split(" ", 2)
                    [d as int, genitiveRussianMonth.get(m) + 1]
                }.transpose()
                def datePointStartDay = api.date.createDateTimePoint("DAY", day[0])
                def datePointEndDay = api.date.createDateTimePoint("DAY", day[1])
                def datePointStartMonth = api.date.createDateTimePoint("MONTH", month[0])
                def datePointEndMonth = api.date.createDateTimePoint("MONTH", month[1])
                filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointStartDay, datePointEndDay]))
                             .AND(filterBuilder.OR(attr.code,'fromToDatePoint',[datePointStartMonth, datePointEndMonth]))
                return filterBuilder
        }
    }

    /**
     * Метод получения фильтра по часам
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getHourFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case 'hh:ii':
                def hoursANDmins = value.tokenize(':/')
                def datePointHour = api.date.createDateTimePoint("HOUR", hoursANDmins[0] as int)
                def datePointMin = api.date.createDateTimePoint("MINUTE", hoursANDmins[1] as int)
                filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointHour, datePointHour]))
                             .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePointMin, datePointMin]))
                return filterBuilder
            case 'hh':
            default:
                def datePoint = api.date.createDateTimePoint("HOUR", value as int)
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePoint, datePoint]))
        }
    }

    /**
     * Метод получения фильтра по минутам
     * @param format -  формат отображения данных
     * @param value - значение для фильтра
     * @param filterBuilder - конструктор фильтра
     * @param attr - атрибут фильтрации
     * @return - готовые фильтры по дате в Дриллдаун
     */
    def getMinuteFilters(String format, String value, def filterBuilder, Attribute attr)
    {
        switch (format)
        {
            case 'ii':
            default:
                def datePoint = api.date.createDateTimePoint("MINUTE", value as int)
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', [datePoint, datePoint]))
        }
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
    Link link = new Link(transformRequest(requestContent, cardObjectUuid), cardObjectUuid)
    def linkBuilder = link.getBuilder()
    return api.web.list(linkBuilder)
}
//endregion

//region вспомогательных методов
/**
 * Метод для изменения запроса с целью подмены объекта фильтрации в запросах
 * @param requestContent - фактическое значение идентификатора "текущего объекта"
 * @param cardObjectUuid - запрос на построение диаграммы
 * @return Изменённый запрос
 */
private Map<String, Object> transformRequest(Map<String, Object> requestContent,
                                             String cardObjectUuid)
{
    Closure<Map<String, Object>> transform = { Map<String, Object> request ->
        Map<String, Object> res = [:] << request
        res.descriptor = DashboardMarshaller.substitutionCardObject(
            request.descriptor as String,
            cardObjectUuid
        )
        return res
    }
    return cardObjectUuid ? transform(requestContent) : requestContent
}
//endregion