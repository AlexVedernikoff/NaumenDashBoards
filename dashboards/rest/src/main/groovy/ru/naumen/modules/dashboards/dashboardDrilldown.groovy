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

import com.fasterxml.jackson.databind.annotation.JsonAppend.Attr
import groovy.transform.Field
import com.fasterxml.jackson.core.type.TypeReference
import java.text.SimpleDateFormat
import ru.naumen.core.shared.dto.SimpleDtObject
import static groovy.json.JsonOutput.toJson
import com.amazonaws.util.json.Jackson
import ru.naumen.core.server.script.api.injection.InjectApi
import static DeserializationHelper.mapper

@Field @Lazy @Delegate DashboardDrilldown dashboardDrilldown = new DashboardDrilldownImpl()

interface DashboardDrilldown
{
    /**
     * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
     * @param requestContent - параметры запроса
     * @param cardObjectUuid - Uuid карточки текущего объекта
     * @param diagramTypeFromRequest - тип диаграммы из запроса (в виде строки)
     * @return ссылка на на страницу с произвольным списком объектов в json-формате.
     */
    String getLink(Map<String, Object> requestContent, String cardObjectUuid, String diagramTypeFromRequest, String dashboardKey)
}

class DashboardDrilldownImpl implements DashboardDrilldown
{
    DashboardDrilldownService service = DashboardDrilldownService.instance

    @Override
    String getLink(Map<String, Object> requestContent, String cardObjectUuid, String diagramTypeFromRequest, String dashboardKey)
    {
        return toJson([link: service.getLink(requestContent, cardObjectUuid, diagramTypeFromRequest, dashboardKey)])
    }
}

@InjectApi
@Singleton
class DashboardDrilldownService
{
    /**
     * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
     * @param requestContent - параметры запроса
     * @param cardObjectUuid - Uuid карточки текущего объекта
     * @param diagramTypeFromRequest - тип диаграммы из запроса (в виде строки)
     * @return ссылка на на страницу с произвольным списком объектов в json-формате.
     */
    String getLink(Map<String, Object> requestContent, String cardObjectUuid, String diagramTypeFromRequest, String dashboardKey)
    {
        DiagramType diagramType = diagramTypeFromRequest as DiagramType
        if(requestContent.filterId)
        {
            requestContent.descriptor = DashboardUtils.getSourceFiltersFromStorage([[key:'id', value: source.filterId]]).find()
        }
        Link link = new Link(transformRequest(requestContent, cardObjectUuid), cardObjectUuid, diagramType)
        Boolean anyFiltersWithCustomGroupKey = link.filters.any { it?.group?.way == Way.CUSTOM}

        if(anyFiltersWithCustomGroupKey)
        {
            DashboardSettingsService dashboardSettingsService = DashboardSettingsService.instance
            DashboardSettingsClass dbSettings = dashboardSettingsService.getDashboardSetting(dashboardKey)
            link.filters.each {
                if(it?.group?.way == Way.CUSTOM)
                {
                    it.group = Group.mappingGroup(it.group, dbSettings?.customGroups)
                }

            }
        }
        def linkBuilder = link.getBuilder()
        return api.web.list(linkBuilder)
    }

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
}
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
    private Collection<DrilldownFilter> filters

    /**
     * темплеит
     */
    private String template

    /**
     * время жизни ссылки в днях
     */
    private int liveDays = 30

    /**
     * Тип диаграммы, для которой генерируется ссылка
     */
    private DiagramType diagramType


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

    Link(Map<String, Object> map, String cardObjectUuid, DiagramType diagramType)
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
        this.filters = mapper.convertValue(map.filters, new TypeReference<Collection<DrilldownFilter>>() {})
        this.diagramType = diagramType
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
        if(descriptor)
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
                    Boolean attrTypeIsSet = filter.getProperties().attrTypeCode in AttributeType.LINK_SET_TYPES
                    def value = filter.getValue()
                    if (condition == 'containsSubject')
                    { // костыль. так как дескриптор статичный, а условие должно быть динамичным
                        def uuidSubject = api.utils.get(iDescriptor.clientSettings.formObjectUuid as String)
                        if(attrTypeIsSet)
                        {
                            uuidSubject = [uuidSubject]
                        }
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
                Jackson.toJsonString(it.attribute)
            }.collect {
                def attr, Collection<Map> filter ->
                attr = Jackson.fromJsonString(attr, Attribute)
                Collection<Collection> result = []
                String attributeType = Attribute.getAttributeType(attr)
                Boolean attrIsDynamic = attr?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)

                //выглядит костыльно, но это необходимо, чтобы обойти ситуацию,
                // когда основной источник запроса - дочерний к classFqn,
                // когда у нас сама диаграмма типа таблица
                //и для дат это неприменимо
                if (!attrIsDynamic && attr?.sourceCode && attr?.sourceCode != classFqn &&
                    !(StateMarshaller.unmarshal(attr?.sourceCode, '$')?.last() in cases) &&
                    diagramType == DiagramType.TABLE &&
                    !(attr.type in AttributeType.DATE_TYPES))
                {
                    //если атрибут из другого источника (атрибута), указываем его код в начале
                    attr?.code = "${attr?.sourceCode}.${attr?.code}"
                }

                def contextValue = filter.findResults { map ->
                    def group = map.group
                    def value = map.value
                    def aggregation = map.aggregation
                    if (aggregation)
                    {
                        result << [filterBuilder.OR(attr.code, 'notNull', null)]
                        return null
                    }
                    Way groupWay = group.way
                    GroupType groupType = groupWay == Way.SYSTEM
                        ? attributeType == AttributeType.DT_INTERVAL_TYPE ? GroupType.OVERLAP : group.data
                        : null

                    String format = attributeType == AttributeType.DT_INTERVAL_TYPE ? group.data : group.format
                    def returnValue = null
                    if (groupType)
                    {
                        if (attributeType in AttributeType.DATE_TYPES
                            || attributeType == AttributeType.DT_INTERVAL_TYPE)
                        {
                            returnValue = [(groupType): attributeType == AttributeType.DT_INTERVAL_TYPE
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
                    def group = map.group
                    String value = map.value
                    if (!map.aggregation && group.way == Way.CUSTOM)
                    {
                        def customGroup = group.data
                        def subGroupSet = customGroup.subGroups
                        return subGroupSet.findResult { el ->
                            def subgroup = el
                            subgroup.name == value ? subgroup.data : null
                        }
                    }
                    else
                    {
                        return null
                    }
                }

                def context = createContext(contextValue)
                context.remove(GroupType.OVERLAP).each { value ->
                    if (attrIsDynamic)
                    {
                        attr.code = AttributeType.TOTAL_VALUE_TYPE
                        result << [filterBuilder.OR(attr.code, 'notNull', null)]
                        attr.ref = new Attribute(
                            code: 'textValue',
                            type: 'string',
                            property: AttributeType.TOTAL_VALUE_TYPE
                        )
                        def objects = findObjects(attr.ref, attr.property, value)
                        checkValuesSize(objects)
                        result << [filterBuilder.OR(attr.code, 'containsInSet', objects)]
                    }
                    else
                    {
                        if (attr.code.contains('.'))
                        {
                            String currentAttrCode = attr.code
                            def (sourceAttrCode, attrCode) = currentAttrCode.tokenize('.')
                            String metaForAttr = api.metainfo.getMetaClass(classFqn)
                                                    .getAttribute(sourceAttrCode)
                                                    .type.relatedMetaClass

                            attr.code = attrCode
                            def objects = findObjects(attr, metaForAttr, value)
                            result << [filterBuilder.OR(sourceAttrCode, 'containsInSet', objects)]
                        }
                        else
                        {
                            switch(attributeType)
                            {
                                case AttributeType.LINK_TYPES:
                                    if (value == 'Не заполнено')
                                    {
                                        result << [filterBuilder.OR(attr.code, 'null', null)]
                                    }
                                    else
                                    {
                                        List objects = []
                                        if(attributeType in AttributeType.ONLY_LINK_TYPES)
                                        {
                                            if(attr.attrChains().count {it.type in AttributeType.LINK_TYPES} > 1)
                                            {
                                                //двухуровневый ссылочный
                                                objects = findObjects(attr.ref,attr.property, LinksAttributeMarshaller.unmarshal(value).last())
                                            }
                                            else
                                            {
                                                if(!attr.ref)
                                                {
                                                    attr.ref = new Attribute(code:'title', type:'string')
                                                }
                                                objects = findObjects(attr.ref, attr.property, LinksAttributeMarshaller.unmarshal(value).last(), true)
                                            }
                                        }
                                        else
                                        {
                                            if(attr.attrChains().count {it.type in AttributeType.LINK_TYPES} > 1)
                                            {
                                                //двухуровневый ссылочный
                                                objects = api.utils.find(attr.ref.property, [title: value])
                                                objects = findObjects(attr.ref, attr.property, objects)
                                            }
                                            else
                                            {
                                                if(!attr.ref)
                                                {
                                                    attr.ref = new Attribute(code:'title', type:'string')
                                                }
                                                objects = findObjects(attr.ref, attr.property, value)
                                            }
                                        }
                                        result << [filterBuilder.OR(attr.code, 'containsInSet', objects)]
                                    }
                                    break
                                case AttributeType.STATE_TYPE:
                                    getStateFilters(attr, value, filterBuilder)
                                    break
                                default:
                                    result << [getOrFilter(attributeType, attr, value, filterBuilder)]
                            }
                        }
                    }
                }
                if (context)
                {
                    //Тут обработка только группировок по датам
                    context.keySet().each { groupType ->
                        def value = context.get(groupType)
                        def format = value?.last()
                        String stringValue = value?.head()
                        getDateFilters(groupType, format, stringValue, filterBuilder, attr)
                    }
                }
                for (customSubGroupCondition in customSubGroupSet)
                {
                    if(attrIsDynamic)
                    {
                        String templateUUID = TotalValueMarshaller.unmarshal(attr.code).last()
                        Source source = new Source(classFqn: classFqn, descriptor: descriptor)
                        def orCondition = customSubGroupCondition.find()
                        def data = orCondition?.find()?.data
                        Closure<Collection<Collection<FilterParameter>>> mappingFilters = DashboardDataSetService.instance.getMappingFilterMethodByType(attributeType, subjectUUID)
                        def filters = mappingFilters(
                            customSubGroupCondition as List<List>,
                            attr,
                            data instanceof Map ? data.title : data,
                            "test"
                        )
                        def filterParam = filters?.find {it?.attribute?.code?.find() == 'value' }
                        def wrapper = QueryWrapper.build(source, templateUUID)

                        wrapper.totalValueCriteria.add(api.filters.attrValueEq('linkTemplate', templateUUID))
                               .addColumn(api.selectClause.property('UUID'))
                        wrapper.filtering(wrapper.totalValueCriteria, true, filterParam)

                        def uuids = wrapper.getResult(true, DiagramType.TABLE, true).flatten()
                        checkValuesSize(uuids)
                        filterBuilder.AND(
                            filterBuilder.OR('totalValue', 'containsInSet', uuids)
                        )
                        continue
                    }
                    switch (attributeType)
                    {
                        case AttributeType.DT_INTERVAL_TYPE:
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    if(attr.ref)
                                    {
                                        def uuids = getValuesForRefAttrInCustomGroup(attr, it.data)
                                        return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                    }
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
                                            String dateFormat
                                            def dateSet = it.data as Map<String, Object> // тут будет массив дат или одна из них
                                            def start
                                            if(dateSet.startDate)
                                            {
                                                dateFormat = DashboardUtils.getDateFormatByDate(dateSet.startDate as String)
                                                start = Date.parse(dateFormat, dateSet.startDate as String)
                                            }
                                            else
                                            {
                                                Date minDate = DashboardUtils.getMinDate(
                                                    attr.code,
                                                    attr.sourceCode
                                                )
                                                start = new Date(minDate.time).clearTime()
                                            }
                                            def end
                                            if (dateSet.endDate)
                                            {
                                                dateFormat = DashboardUtils.getDateFormatByDate(dateSet.endDate as String)
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
                            customSubGroupCondition.each { orCondition ->
                                orCondition.each {
                                    String sourceCode = attr.sourceCode
                                    if(attr.ref)
                                    {
                                        def uuids = getValuesForRefAttrInCustomGroup(attr, it.data)
                                        return filterBuilder.AND(
                                            filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                        )
                                    }
                                    Closure buildStateFilter = { String code, String condition, String stateCode ->
                                        if(sourceCode.contains('$'))
                                        {
                                            def objectToFilter = new SimpleDtObject("$sourceCode:$stateCode", '')
                                            return filterBuilder.AND(
                                                filterBuilder.OR(code, condition, objectToFilter)
                                            )
                                        }
                                        def cases = api.metainfo.getTypes(sourceCode).code
                                        if (condition == 'contains')
                                        {
                                            return filterBuilder.AND(
                                                *cases.collect {
                                                    filterBuilder.OR(code,
                                                                     condition,
                                                                     new SimpleDtObject("$it:$stateCode", ''))
                                                }
                                            )
                                        }
                                        else
                                        {
                                            cases.each { filterBuilder.AND(
                                                filterBuilder.OR(
                                                    code,
                                                    condition,
                                                    new SimpleDtObject("$it:$stateCode", '')))
                                            }
                                            return filterBuilder
                                        }
                                    }
                                    switch (it.type.toLowerCase())
                                    {
                                        case 'contains':
                                            return buildStateFilter(attr.code, 'contains', it.data.uuid)
                                        case 'not_contains':
                                            return buildStateFilter(attr.code, 'notContains', it.data.uuid)
                                        case 'contains_any':
                                            List objectsToFilter = it.data*.uuid.collectMany { stateCode ->
                                                if (sourceCode.contains('$'))
                                                {
                                                    return [new SimpleDtObject("$sourceCode:$stateCode", '')]
                                                }
                                                else
                                                {
                                                    def cases = api.metainfo.getTypes(sourceCode).code
                                                    return cases.collect {
                                                        new SimpleDtObject("$it:$stateCode", '')
                                                    }
                                                }
                                            }
                                            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', objectsToFilter))
                                        case 'title_contains':
                                            return filterBuilder.AND(filterBuilder.OR(attr.code, 'titleContains', it.data))
                                        case 'title_not_contains':
                                            return filterBuilder.AND(filterBuilder.OR(attr.code, 'titleNotContains', it.data))
                                        case ['equal_subject_attribute', 'equal_attr_current_object']:
                                            return filterBuilder.AND(filterBuilder.OR(attr.code, 'contains', it.data.uuid))
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
                                    Boolean attributeTypeIsSet = attributeType in AttributeType.LINK_SET_TYPES
                                    Boolean twoLinkAttrs = attr.attrChains().count { it.type in AttributeType.LINK_TYPES } == 2
                                    def lastAttr = attr.attrChains().last()
                                    switch (it.type.toLowerCase())
                                    {
                                        case 'empty':
                                            if(twoLinkAttrs)
                                            {
                                                def objects = api.utils.find(attr.property, [(lastAttr.code): null])
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            return filterBuilder.OR(attr.code, 'null', null)
                                        case 'not_empty':
                                            if(twoLinkAttrs)
                                            {
                                                def objects = api.utils.find(attr.property, [(lastAttr.code): op.not(null)])
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            return filterBuilder.OR(attr.code, 'notNull', null)
                                        case 'contains':
                                            def value = api.utils.get(it.data.uuid)
                                            if(twoLinkAttrs)
                                            {
                                                def objects = findObjects(attr.ref, attr.property, value)
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            if (attributeTypeIsSet)
                                            {
                                                value = [value]
                                            }

                                            return filterBuilder.OR(attr.code, 'contains', value)
                                        case 'not_contains':
                                            def value = api.utils.get(it.data.uuid)
                                            if(twoLinkAttrs)
                                            {
                                                def objects = api.utils.find(attr.property, [(lastAttr.code): op.not(value)])
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            if (attributeTypeIsSet)
                                            {
                                                value = [value]
                                            }
                                            return filterBuilder.OR(attr.code, 'notContains', value)
                                        case 'title_contains':
                                            def value = it.data
                                            if(twoLinkAttrs)
                                            {
                                                def lowValues = api.utils.find(lastAttr.property, ['title': op.like("%${value}%")])
                                                def highValues = api.utils.find(attr.property, [(lastAttr.code) : op.in(lowValues)])
                                                checkValuesSize(highValues)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    highValues
                                                )
                                            }
                                            return filterBuilder.OR(
                                                attr.code,
                                                'titleContains',
                                                value
                                            )
                                        case 'title_not_contains':
                                            def value = it.data
                                            if(twoLinkAttrs)
                                            {
                                                def lowValues = api.utils.find(lastAttr.property, ['title': op.not("%${value}%")])
                                                def highValues = api.utils.find(attr.property, [(lastAttr.code) : op.in(lowValues)])
                                                checkValuesSize(highValues)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    highValues
                                                )
                                            }
                                            return filterBuilder.OR(
                                                attr.code,
                                                'titleNotContains',
                                                value
                                            )
                                        case 'contains_including_archival':
                                            def value = api.utils.get(it.data.uuid)
                                            if(twoLinkAttrs)
                                            {
                                                def objects = findObjects(attr.ref, attr.property, value)
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            if (attributeTypeIsSet)
                                            {
                                                value = [value]
                                            }
                                            return filterBuilder.OR(
                                                attr.code,
                                                'containsWithRemoved',
                                                value
                                            )
                                        case 'not_contains_including_archival':
                                            def value = api.utils.get(it.data.uuid)
                                            if(twoLinkAttrs)
                                            {
                                                def objects = api.utils.find(attr.property, [(lastAttr.code): op.not(value)])
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            if (attributeTypeIsSet)
                                            {
                                                value = [value]
                                            }
                                            return filterBuilder.OR(
                                                attr.code,
                                                'notContainsWithRemoved',
                                                value
                                            )
                                        case 'contains_including_nested':
                                            def value = api.utils.get(it.data.uuid)
                                            if(twoLinkAttrs)
                                            {
                                                def objects = findObjects(attr.ref, attr.property, value)
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            if (attributeTypeIsSet)
                                            {
                                                value = [value]
                                            }
                                            return filterBuilder.OR(
                                                attr.code,
                                                'containsWithNested',
                                                value
                                            )
                                        case 'contains_any':
                                            def uuids = it.data*.uuid
                                            def values = uuids.collect { uuid ->
                                                api.utils.get(uuid)
                                            }
                                            if(twoLinkAttrs)
                                            {
                                                values = values.collectMany{ value -> findObjects(attr.ref, attr.property, value)}
                                            }
                                            checkValuesSize(values)
                                            return filterBuilder.OR(
                                                attr.code,
                                                'containsInSet',
                                                values
                                            )
                                        case ['contains_current_object', 'equal_current_object']:
                                            if(twoLinkAttrs)
                                            {
                                                def objects = findObjects(attr.ref, attr.property, subjectUUID)
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
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
                                            if(twoLinkAttrs)
                                            {
                                                def objects = findObjects(attr.ref, attr.property, value)
                                                checkValuesSize(objects)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    objects
                                                )
                                            }
                                            if (attributeTypeIsSet)
                                            {
                                                value = [value]
                                            }
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
                                    if(attr.ref)
                                    {
                                        def uuids = getValuesForRefAttrInCustomGroup(attr, it.data)
                                        return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                    }
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
                                            String dateFormat
                                            def dateSet = it.data as Map<String, Object> // тут будет массив дат или одна из них
                                            def start
                                            if(dateSet.startDate)
                                            {
                                                dateFormat = DashboardUtils.getDateFormatByDate(dateSet.startDate as String)
                                                start = Date.parse(dateFormat, dateSet.startDate as String)
                                            }
                                            else
                                            {
                                                String attrCode = "${attr.code}.deadLineTime"
                                                Date minDate = DashboardUtils.getMinDate(
                                                    attrCode,
                                                    attr.sourceCode,
                                                    this.descriptor
                                                )
                                                start = new Date(minDate.time).clearTime()
                                            }
                                            def end
                                            if (dateSet.endDate)
                                            {
                                                dateFormat = DashboardUtils.getDateFormatByDate(dateSet.endDate as String)
                                                end = Date.parse(dateFormat, dateSet.endDate as String)
                                            }
                                            else
                                            {
                                                end = new Date().clearTime()
                                            }
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
                        case AttributeType.META_CLASS_TYPE:
                            //кейс работы с фильтрами для статусов будет переделан, потому для метакласса кейс описан отдельно
                            result += customSubGroupCondition.collect { orCondition ->
                                orCondition.collect {
                                    if(attr.ref)
                                    {
                                        def uuids = getValuesForRefAttrInCustomGroup(attr, it.data)
                                        return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                    }
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

    /**
     * Метод получения фильтров для атрибута типа статус
     * @param attribute - аттрибут
     * @param value - значение
     * @param filterBuilder - текущий filterBuilder
     * @return изменённый filterBuilder
     */
    private def getStateFilters(Attribute attribute, def value, def filterBuilder)
    {
        String sourceCode = attribute.attrChains().last().sourceCode
        sourceCode -= '__Evt'
        String code = attribute.code
        def(title, state) = StateMarshaller.unmarshal(value, StateMarshaller.valueDelimiter)

        if(attribute.ref)
        {
            def values = getValuesForRefAttr(attribute, state)
            checkValuesSize(values)
            return filterBuilder.AND(filterBuilder.OR(code, 'containsInSet', values))
        }
        if(sourceCode.contains('$'))
        {
            return filterBuilder.AND(
                filterBuilder.OR(code, 'contains', new SimpleDtObject("$sourceCode:$state",''))
            )
        }
        def cases = api.metainfo.getTypes(sourceCode).code
        return filterBuilder.AND(
            *cases.collect{filterBuilder.OR(code, 'contains', new SimpleDtObject("$it:$state", ''))}
        )
    }

    /**
     * Метод получения данных из БД по атрибуту второго уровня
     * @param attr - атрибут целиком
     * @param DBvalue - значение, для фильтрации в БД
     * @return список uuid-ов для атрибута первого уровня и фильтрации containsInSet
     */
    Collection getValuesForRefAttr(Attribute attr, def DBvalue)
    {
        def sc = api.selectClause
        def criteria = descriptor
            ? descriptor.with(api.listdata.&createListDescriptor).with(api.listdata.&createCriteria)
            : api.db.createCriteria().addSource(classFqn)
        criteria.addColumn(sc.property("${attr.code}.UUID"))
                .add(api.filters.attrValueEq((Attribute.getAttributeType(attr) in AttributeType.TIMER_TYPES)
                                                 ?  attr.attrChains().code.join('.') + '.statusCode'
                                                 : attr.attrChains().code.join('.'), DBvalue))
        return api.db.query(criteria).list()
    }

    /**
     * Метод получения данныз из БД по атрибуту второго уровня, если на него настроена кастомная группировка
     * @param attr - атрибут целиком
     * @param data - данные о кастомной группировке
     * @return список uuid-ов для атрибута первого уровня и фильтрации containsInSet
     */
    Collection getValuesForRefAttrInCustomGroup(Attribute attr, def data)
    {
        Source source = new Source(classFqn: classFqn, descriptor: descriptor)
        Closure<Collection<Collection<FilterParameter>>> mappingFilters = DashboardDataSetService.instance.getMappingFilterMethodByType(attributeType, subjectUUID)
        def filters = mappingFilters(
            customSubGroupCondition as List<List>,
            attr,
            'test',
            'test'
        )
        def filterParam = filters?.find()
        def wrapper = QueryWrapper.build(source)

        wrapper.criteria.addColumn(api.selectClause.property("${attr.code}.UUID"))
        wrapper.filtering(wrapper.criteria, false, filterParam)

        def uuids = wrapper.getResult(true, DiagramType.TABLE, true).flatten()
        checkValuesSize(uuids)
        return uuids
    }

    private def getOrFilter(String type, Attribute attr, def value, def filterBuilder)
    {
        //TODO: хорошему нужно вынести все эти методы в enum. Можно прям в этом модуле
        // Список доступных условий фильтрации: "notContainsIncludeEmpty", "nextN", "containsInSet",
        // "beforeUserAttribute", "beforeSubjectAttribute", "afterUserAttribute", "afterSubjectAttribute",
        // "containsWithNested", "incorrect", "contains", "notContains", "null", "notNull", "greater", "less",
        // "fromTo", "lastN", "today", "timerStatusContains", "timerStatusNotContains", "backTimerDeadLineFromTo",
        // "backTimerDeadLineContains", "titleContains", "titleNotContains", "containsWithRemoved",
        // "notContainsWithRemoved", "containsUser", "containsSubject", "containsUserAttribute", "containsSubjectAttribute"
        String code = attr.code
        if (value == 'Не заполнено' || value == 'EMPTY')
        {
            return filterBuilder.OR(code, 'null', null)
        }
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        if(attr.ref)
        {
            //пришли из ссылочного атрибута
            def lastAttr = attr.attrChains().last()
            code = lastAttr.code
            def values = []
            switch (type)
            {
                case AttributeType.META_CLASS_TYPE:
                    def DBvalue = MetaClassMarshaller.unmarshal(value).last()
                    values = getValuesForRefAttr(attr, DBvalue)
                    break
                case AttributeType.DT_INTERVAL_TYPE:
                    def (intervalValue, intervalType) = DtIntervalMarshaller.unmarshal(value.find())
                    intervalValue = DashboardUtils.convertValueToInterval(intervalValue as Long, DashboardUtils.getDTIntervalGroupType(intervalType))
                    def interval = api.types.newDateTimeInterval([intervalValue as long, intervalType as String])
                    values = getValuesForRefAttr(attr, interval)
                    break
                case AttributeType.TIMER_TYPES:
                    String statusCode = TimerStatus.getByName(value)
                    values = getValuesForRefAttr(attr, statusCode)
                    break
                case AttributeType.BOOL_TYPE:
                    if (!value.isInteger()) {
                        value = value.toLowerCase() == 'да' ? '1' : '0'
                    }
                    values = findObjects(attr.ref, attr.property, value)
                    break
                default:
                    values = findObjects(attr.ref, attr.property, value)
                    break
            }
            checkValuesSize(values)
            return filterBuilder.OR(attr.code, 'containsInSet', values)
        }
        switch (type)
        {
            case AttributeType.META_CLASS_TYPE:
                def DBvalue = MetaClassMarshaller.unmarshal(value).last()
                return filterBuilder.OR(code, 'contains', DBvalue)
            case AttributeType.DATE_TYPES:
                return filterBuilder.OR(code, 'contains', Date.parse(dateFormat, value as String))
            case AttributeType.DT_INTERVAL_TYPE:
                def (intervalValue, intervalType) = DtIntervalMarshaller.unmarshal(value.find())
                intervalValue = DashboardUtils.convertValueToInterval(intervalValue as Long, DashboardUtils.getDTIntervalGroupType(intervalType))
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
     * Метод проверки данных на возможный перегруз количества информации для фильтра containsInSet
     * @param values - данные, полученные при поиске
     */
    private void checkValuesSize(def values)
    {
        if(values?.size() > DashboardUtils.maxValuesCount)
        {
            throw new Exception("${DashboardUtils.overflowDataException}")
        }
    }

    /**
     * Метод подготовки фильтра для запроса в БД
     * @param filter - исходных фильтр
     * @param attr - атрибут, по которому будет запрос
     * @param value - значение фильтрации
     * @return правильный фильтр для запроса
     */
    String prepareFilter(String filter, def attr, def value = null)
    {
        switch(filter)
        {
            case 'STATUS_CONTAINS':
            case 'TITLE_CONTAINS': return Attribute.getAttributeType(attr) == AttributeType.STATE_TYPE ? 'STATE_TITLE_CONTAINS' : 'CONTAINS'
            case 'STATUS_NOT_CONTAINS':
            case 'TITLE_NOT_CONTAINS': return Attribute.getAttributeType(attr) == AttributeType.STATE_TYPE ? 'STATE_TITLE_NOT_CONTAINS' : 'NOT_CONTAINS'
            case 'CONTAINS': return Attribute.getAttributeType(attr) == AttributeType.STATE_TYPE ? 'EQUAL': filter
            case 'NOT_CONTAINS': return Attribute.getAttributeType(attr) == AttributeType.STATE_TYPE ? 'NOT_EQUAL' : filter
            case 'EMPTY': return 'IS_NULL'
            case 'NOT_EMPTY': return 'NOT_NULL'
            case 'CONTAINS_INCLUDING_ARCHIVAL': return 'EQUAL_REMOVED'
            case 'NOT_CONTAINS_INCLUDING_ARCHIVAL' : return 'NOT_EQUAL_REMOVED'
            case 'CONTAINS_ANY':
            case 'CONTAINS_INCLUDING_NESTED': return Attribute.getAttributeType(attr) == AttributeType.META_CLASS_TYPE ? 'CONTAINS' : 'IN'
            case 'NOT_EQUAL_NOT_EMPTY' : return 'NOT_EQUAL_AND_NOT_NULL'
            case 'NEAR':
            case 'EXPIRES_BETWEEN': return 'BETWEEN'
            case 'EXPIRATION_CONTAINS': return value == 'EXCEED' ? 'CONTAINS' : 'NOT_CONTAINS'
            case 'LAST': return 'LAST_N_DAYS'
            case 'EQUAL_CURRENT_OBJECT':
            case 'CONTAINS_CURRENT_OBJECT': return 'EQUAL'
            default: return filter
        }
    }

    /**
     * Метод преобразования значения фильтрации к правильному виду
     * @param data - текущие данные фильтрации
     * @param attr - атрибут, по которому будет запрос
     * @param filterType - текущий фильтр
     * @return правильное значение для запроса
     */
    def prepareValue(def data, Attribute attr, String filterType, def subjectUUID)
    {
        String attributeType = Attribute.getAttributeType(attr)
        def value

        def start
        def end

        if(data instanceof Map)
        {
            if(data.uuid)
            {
                value = api.utils.get(data.uuid)
            }
            else if(data.startDate || data.endDate)
            {
                if(data.startDate)
                {
                    String dateFormat = DashboardUtils.getDateFormatByDate(data.startDate)
                    start = Date.parse(dateFormat, data.startDate as String)
                }
                else
                {
                    Date minDate = DashboardUtils.getMinDate(attr.code, attr.sourceCode)
                    start = new Date(minDate.time).clearTime()
                }
                if (data.endDate)
                {
                    String dateFormat = DashboardUtils.getDateFormatByDate(data.endDate)
                    end = Date.parse(dateFormat, data.endDate as String)
                }
                else
                {
                    end = new Date().clearTime()
                }
                value = attributeType == AttributeType.TIMER_TYPES ? [start.getTime(), end.getTime()] : [start, end]
            }
        }
        else if(data instanceof String)
        {
            value = data
        }

        if(filterType == 'CONTAINS_INCLUDING_NESTED')
        {
            def nestedVaues =  api.utils.getNested(value)
            value = [value, *nestedVaues]
        }
        if(filterType in ['EQUAL_CURRENT_OBJECT', 'CONTAINS_CURRENT_OBJECT'])
        {
            value = api.utils.get(subjectUUID)
        }
        if((attributeType in [AttributeType.INTEGER_TYPE, AttributeType.DOUBLE_TYPE]) || (attributeType in AttributeType.DATE_TYPES && filterType == 'LAST'))
        {
            if(attributeType == AttributeType.INTEGER_TYPE || attributeType in AttributeType.DATE_TYPES)
            {
                value = value as Long
            }
            else
            {
                value = value as Double
            }
        }
        if(attributeType == AttributeType.DT_INTERVAL_TYPE)
        {
            value = value
                ? api.types.newDateTimeInterval([value.value as long, value.type as String])
                : null
        }
        if(attributeType == AttributeType.TIMER_TYPES && filterType == 'EXPIRATION_CONTAINS')
        {
            value = 'e'
        }
        if(attributeType in AttributeType.DATE_TYPES && filterType == 'NEAR')
        {
            def count = value
            start = Calendar.instance.with {
              set(HOUR_OF_DAY, 0)
              set(MINUTE, 0)
              set(SECOND, 0)
              set(MILLISECOND, 0)
              getTime()
            }
            end = Calendar.instance.with {
            set(HOUR_OF_DAY, 23)
            set(MINUTE, 59)
            set(SECOND, 59)
            set(MILLISECOND, 999)
            add(DAY_OF_MONTH, count)
            getTime()
            }
            value = [start, end]
        }
        return value
    }

    /**
     * Метод поиска объектов
     * @param attr - атрибут объекто
     * @param fqnClass - класс объекта
     * @param value - значение атрибута
     * @param fromLinks - метод вызван для атрибута типа boLinks, backBOLinks
     * @return список объектов
     */
    private List<Object> findObjects(Attribute attr, String fqnClass, def value, Boolean fromLinks = false)
    {
        String searchField = fromLinks ? DashboardQueryWrapperUtils.UUID_CODE : attr.code
        return attr.ref ?
            api.utils.find(fqnClass, [(attr.code): findObjects(attr.ref, attr.property, value)])
            : api.utils.find(fqnClass, [(searchField): value]).collect()
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
            checkValuesSize(objects)
            filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', objects))
        }
        else
        {
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
                int intValue = value.replace('-й', '') as int
                def datePoint = api.date.createDateTimePointPredicates(['DAY', intValue, 'EQ'], ['DAY', intValue, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
            case 'WD':
                int intValue = russianWeekDay.get(value)
                def datePoint = api.date.createDateTimePointPredicates(['WEEKDAY', intValue, 'EQ'], ['WEEKDAY', intValue, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
            case 'dd.mm.YY':
                List<String> splitDate = value.replace('.', '/').split('/')
                def (day, month, year) = splitDate
                def datePoint = api.date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                                       ['MONTH', month as int, 'EQ'],
                                                                       ['YEAR', year as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
            case 'dd.mm.YY hh':
                List<String> fullDate = value.replace('ч', '').replace(',', '').split()

                def (date, hour) = fullDate
                String[] splitDate = date.replace('.', '/').split('/')
                def (day, month, year) = splitDate

                def datePoint = api.date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                                       ['MONTH', month as int, 'EQ'],
                                                                       ['YEAR', year as int, 'EQ'],
                                                                       ['HOUR', hour as int, 'EQ']
                )
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
            case 'dd.mm.YY hh:ii':
                List<String> fullDate = value.split()
                def(date, dateTime) = fullDate
                String[] splitDate = date.replace('.', '/').split('/')
                def (day, month, year) = splitDate

                def(hour, minute) = dateTime.split(':')

                def datePoint = api.date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                                       ['MONTH', month as int, 'EQ'],
                                                                       ['YEAR', year as int, 'EQ'],
                                                                       ['HOUR', hour as int, 'EQ'],
                                                                       ['MINUTE', minute as int, 'EQ']
                )
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))

            case 'dd MM':
            default:
                def (String day, String monthName) = value.split()
                int month = genitiveRussianMonth.get(monthName.toLowerCase()) + 1
                def datePoint = api.date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                                       ['MONTH', month as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
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
                def datePoint = year ? api.date.createDateTimePointPredicates(['WEEK', week, 'EQ'],
                                                                              ['YEAR', year, 'EQ'])
                    : api.date.createDateTimePointPredicates(['WEEK', week, 'EQ'], ['WEEK', week, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
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
                def datePoint = year ? api.date.createDateTimePointPredicates(['MONTH', month as int, 'EQ'],
                                                                              ['YEAR', year, 'EQ'])
                    : api.date.createDateTimePointPredicates(['MONTH', month as int, 'EQ'], ['MONTH', month as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
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
                def datePoint = year ? api.date.createDateTimePointPredicates(['QUARTER', quarter, 'EQ'],
                                                                              ['YEAR', year as int, 'EQ'])
                    : api.date.createDateTimePointPredicates(['QUARTER', quarter, 'EQ'], ['QUARTER', quarter, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
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
            default:
                def datePoint = api.date.createDateTimePointPredicates(['YEAR', value as int, 'EQ'], ['YEAR', value as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
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
                def russianLocale = new Locale('ru')
                def (day,month, year) = value.tokenize('-').collect { dayAndMonth ->
                    SimpleDateFormat parser = new SimpleDateFormat('dd.MM.yy', russianLocale)
                    parser.parse(dayAndMonth)
                    SimpleDateFormat formatter = new SimpleDateFormat('dd.MM.yyyy')
                    dayAndMonth = formatter.format(parser.parse(dayAndMonth))
                    def (d, m, y) = dayAndMonth.tokenize('.')
                    [d as int, m as int, y as int]
                }.transpose()
                def datePointStart = api.date.createDateTimePointPredicates(['DAY',  day[0], 'GE'],
                                                                            ['MONTH', month[0], 'EQ'],
                                                                            ['YEAR', year[0], 'EQ'])
                def datePointEnd = api.date.createDateTimePointPredicates(['DAY',  day[1], 'LE'],
                                                                          ['MONTH',  month[1], 'EQ'],
                                                                          ['YEAR', year[1], 'EQ'])

                if (day[0] > day[1])
                {
                    filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePointStart),
                                      filterBuilder.OR(attr.code,'fromToDatePoint', datePointEnd))
                }
                else
                {
                    filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePointStart))
                                 .AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePointEnd))
                }
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
                def datePoint = api.date.createDateTimePointPredicates(['HOUR', hoursANDmins[0] as int, 'EQ'],
                                                                       ['MINUTE', hoursANDmins[1] as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
            case 'hh':
            default:
                def datePoint = api.date.createDateTimePointPredicates(['HOUR', value as int, 'EQ'], ['HOUR', value as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
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
                value = value.replace(' мин', '')
                def datePoint = api.date.createDateTimePointPredicates(['MINUTE', value as int, 'EQ'], ['MINUTE', value as int, 'EQ'])
                return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }
    }
}
//endregion