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

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Field
import com.fasterxml.jackson.core.type.TypeReference
import ru.naumen.core.server.script.api.criteria.*
import ru.naumen.core.server.script.IListLinkDefinition
import ru.naumen.core.server.script.api.IDateApi
import ru.naumen.core.server.script.api.IDbApi
import ru.naumen.core.server.script.api.IFiltersApi
import ru.naumen.core.server.script.api.IListDataApi
import ru.naumen.core.server.script.api.IMetainfoApi
import ru.naumen.core.server.script.api.ISelectClauseApi
import ru.naumen.core.server.script.api.ITypesApi
import ru.naumen.core.server.script.api.IWebApi
import ru.naumen.core.server.script.spi.IScriptConditionsApi
import ru.naumen.core.server.script.api.IWhereClauseApi
import ru.naumen.core.server.script.api.metainfo.IMetaClassWrapper
import ru.naumen.core.server.script.spi.IScriptUtils

import java.text.SimpleDateFormat
import static groovy.json.JsonOutput.toJson
import com.amazonaws.util.json.Jackson
import groovy.transform.InheritConstructors
import static DeserializationHelper.mapper
import ru.naumen.core.shared.IUUIDIdentifiable
import org.apache.commons.lang3.time.DateUtils
import static MessageProvider.*

@Field @Lazy @Delegate DashboardDrilldown dashboardDrilldown = new DashboardDrilldownImpl(binding,
                                                                                          new DashboardDrilldownService(api.utils,
                                                                                                                        api.metainfo,
                                                                                                                        api.listdata,
                                                                                                                        api.types,
                                                                                                                        api.selectClause,
                                                                                                                        api.whereClause,
                                                                                                                        api.filters,
                                                                                                                        api.db,
                                                                                                                        api.date,
                                                                                                                        api.web,
                                                                                                                        api.op,
                                                                                                                        new DashboardUtils(),
                                                                                                                        new DashboardDataSetService(api.utils,
                                                                                                                                                    api.metainfo,
                                                                                                                                                    api.listdata,
                                                                                                                                                    api.types,
                                                                                                                                                    api.selectClause,
                                                                                                                                                    api.db,
                                                                                                                                                    api.auth,
                                                                                                                                                    new DashboardUtils(),
                                                                                                                                                    new DashboardQueryWrapperUtils(),
                                                                                                                                                    new DashboardSettingsService(api.metainfo,
                                                                                                                                                                                 api.apps,
                                                                                                                                                                                 api.utils,
                                                                                                                                                                                 api.db,
                                                                                                                                                                                 api.keyValue,
                                                                                                                                                                                 new DashboardUtils(),
                                                                                                                                                                                 logger),
                                                                                                                                                    logger),
                                                                                                                        new DashboardSettingsService(api.metainfo,
                                                                                                                                                     api.apps,
                                                                                                                                                     api.utils,
                                                                                                                                                     api.db,
                                                                                                                                                     api.keyValue,
                                                                                                                                                     new DashboardUtils(),
                                                                                                                                                     logger),
                                                                                                                        logger,
                                                                                                                        beanFactory))

interface DashboardDrilldown
{
    /**
     * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
     * @param requestContent - параметры запроса
     * @return ссылка на на страницу с произвольным списком объектов в json-формате.
     */
    String getLink(Map<String, Object> requestContent, IUUIDIdentifiable user)
}

@InheritConstructors
class DashboardDrilldownImpl extends BaseController implements DashboardDrilldown
{
    private final DashboardDrilldownService service

    DashboardDrilldownImpl(Binding binding, DashboardDrilldownService service)
    {
        super(binding)
        this.service = service
    }

    @Override
    String getLink(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson([link: service.getLink(requestContent, user)])
    }
}

class DashboardDrilldownService
{
    private final IScriptUtils utils
    private final IMetainfoApi metainfo
    private final IListDataApi listdata
    private final ITypesApi types
    private final ISelectClauseApi selectClause
    private final IWhereClauseApi whereClause
    private final IFiltersApi filters
    private final IDbApi db
    private final IDateApi date
    private final IWebApi web
    private final IScriptConditionsApi op
    private final DashboardUtils dashboardUtils
    private final DashboardDataSetService dashboardDataSetService
    private final DashboardSettingsService dashboardSettingsService
    private final def logger
    private final def beanFactory

    private String currentUserLocale

    MessageProvider messageProvider = MessageProvider.instance

    DashboardDrilldownService(IScriptUtils utils,
                              IMetainfoApi metainfo,
                              IListDataApi listdata,
                              ITypesApi types,
                              ISelectClauseApi selectClause,
                              IWhereClauseApi whereClause,
                              IFiltersApi filters,
                              IDbApi db,
                              IDateApi date,
                              IWebApi web,
                              IScriptConditionsApi op,
                              DashboardUtils dashboardUtils,
                              DashboardDataSetService dashboardDataSetService,
                              DashboardSettingsService dashboardSettingsService,
                              def logger,
                              def beanFactory)
    {
        this.utils = utils
        this.metainfo = metainfo
        this.listdata = listdata
        this.types = types
        this.selectClause = selectClause
        this.whereClause = whereClause
        this.db = db
        this.filters = filters
        this.date = date
        this.web = web
        this.op = op
        this.dashboardUtils = dashboardUtils
        this.dashboardDataSetService = dashboardDataSetService
        this.dashboardSettingsService = dashboardSettingsService
        this.logger = logger
        this.beanFactory = beanFactory
    }

    /**
     * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
     * @param request - параметры запроса
     * @return ссылка на на страницу с произвольным списком объектов в json-формате.
     */
    String getLink(Map<String, Object> request, IUUIDIdentifiable user)
    {
        // Вычисляем смещение часового пояса по настройкам пользователя системы и настройкам клиента у фронта.
        GetLinkRequest requestContent = new ObjectMapper().convertValue(request, GetLinkRequest)
        String userUUID = user?.UUID
        currentUserLocale = dashboardUtils.getUserLocale(userUUID)
        def offsetMinutes = dashboardUtils.getOffsetUTCMinutes(userUUID, requestContent.offsetUTCMinutes)
        Boolean showBlankData = requestContent.showBlankData
        String cardObjectUuid = requestContent.cardObjectUuid

        if(requestContent.filterId)
        {
            requestContent.descriptor = dashboardUtils.getSourceFiltersFromStorage([[key:'id', value: requestContent.filterId]]).find()
        }
        if(requestContent.widgetDescriptor)
        {
            requestContent.descriptor = dashboardDataSetService.prepareWidgetDescriptor(requestContent.descriptor, requestContent.widgetDescriptor)
        }

        if (requestContent.widgetFilters)
        {
            def widgetFilters = requestContent.widgetFilters
            WidgetFilterResponse userFilter = WidgetFilterResponse.getWidgetFiltersCollection(widgetFilters).find()
            String userDescriptor = userFilter.descriptor
            def baseDescriptor = requestContent.descriptor
            baseDescriptor = dashboardDataSetService.prepareWidgetDescriptor(baseDescriptor, userDescriptor)
            requestContent.descriptor = baseDescriptor
        }

        if(requestContent.filters)
        {
            requestContent.filters = updateRequestFiltersWithNA(requestContent.filters)
        }

        def attrCases = requestContent?.filters?.attribute?.findResults { attr ->
            if(!attr?.code?.contains(AttributeType.TOTAL_VALUE_TYPE) && attr?.type != 'COMPUTED_ATTR')
            {
                //если атрибут из типа использован на первом уровне, то нужно привести работу,
                //аналогично работе при построении диаграмм - подготовить список типов,
                //которыми должен быть ограничен запрос
                def metainfo = metainfo.getMetaClass(attr.metaClassFqn)
                return metainfo.getAttribute(attr.code).declaredMetaClass.fqn.isClass() ? null : metainfo.fqnCase
            }
        } ?: []
        requestContent.cases += attrCases

        if (requestContent.descriptor)
        {
            def casesFromDescriptor = listdata.createListDescriptor(requestContent.descriptor)
            def listOfCasesFromDescriptor = casesFromDescriptor.fqns.code
            listOfCasesFromDescriptor.each { code ->
                IMetaClassWrapper metaClass = metainfo.getMetaClass(code)?.parent
                if (metaClass && metaClass.code != 'abstractBO')
                {
                    requestContent.cases << code
                }
            }
        }

        DashboardSettingsClass dbSettings = dashboardSettingsService.getDashboardSetting(requestContent.dashboardKey)
        cardObjectUuid = dashboardDataSetService.getCardObjectUUID(dbSettings, user) ?: cardObjectUuid
        Link link = new Link(transformRequest(requestContent, cardObjectUuid), cardObjectUuid, metainfo.getMetaClass(requestContent.classFqn), utils, op)

        Boolean anyFiltersWithCustomGroupKey = link.filters.any { it?.group?.way == Way.CUSTOM}

        if(anyFiltersWithCustomGroupKey)
        {
            link.filters.each {
                if(it?.group?.way == Way.CUSTOM)
                {
                    it.group = Group.mappingGroup(it.group, dbSettings?.customGroups)
                }

            }
        }
        Boolean conditionForDataSet = !link.filters && !showBlankData && (
            requestContent.diagramTypeFromRequest != (DiagramType.TABLE || DiagramType.PIVOT_TABLE))
        IListLinkDefinition linkBuilder =
            getLinkBuilder(link, offsetMinutes, requestContent.parameters, conditionForDataSet)
        return web.list(linkBuilder)
    }

    /**
     * Метод преобразования данных по агрегациям NA к атрибутам с системными группировками
     * @param filters - список текущих фильтров
     * @return список, где изменены фильтры с агрегацией NA в атрибуты с системными группировками
     */
    private List updateRequestFiltersWithNA(List filters)
    {
        def naFilters = filters?.findAll {it?.aggregation == 'NOT_APPLICABLE'}
        if(naFilters)
        {
            filters -= naFilters

            naFilters.each { filter ->
                if (filter)
                {
                    def attribute = filter.attribute
                    filter.group = new SystemGroupInfo(way: Way.SYSTEM, data: GroupType.OVERLAP)
                    if(attribute.type == AttributeType.CATALOG_ITEM_TYPE)
                    {
                        def tempValue = filter.value
                        def (value, uuid) = LinksAttributeMarshaller.unmarshal(tempValue)
                        tempValue = utils.get(uuid).get(attribute.code)
                        filter.value = ObjectMarshaller.marshal(tempValue.title, tempValue.UUID)
                    }
                    if(attribute.type in AttributeType.DATE_TYPES)
                    {
                        filter.group = new SystemGroupInfo(way: Way.SYSTEM, data: GroupType.DAY, format: 'dd.mm.YY hh:ii')
                    }
                    filter.remove('aggregation')
                }
            }

            return filters + naFilters
        }
        return filters

    }

    /**
     * Метод для изменения запроса с целью подмены объекта фильтрации в запросах
     * @param requestContent - фактическое значение идентификатора "текущего объекта"
     * @param cardObjectUuid - запрос на построение диаграммы
     * @return Изменённый запрос
     */
    private GetLinkRequest transformRequest(GetLinkRequest requestContent,
                                            String cardObjectUuid)
    {
        Closure<GetLinkRequest> transform = { GetLinkRequest request ->
            request.descriptor = DashboardMarshallerClass.substitutionCardObject(
                request.descriptor as String,
                cardObjectUuid
            )
            return request
        }
        return cardObjectUuid ? transform(requestContent) : requestContent
    }

    /**
     * Метод получения сконструированного билдера
     * @param api - интерфейс формирования ссылок
     * @param offsetMinutes - интерфейс формирования ссылок
     * @param parameters - список параметров группировки
     * @param conditionForDataSet - флаг условий для датасета
     * @return сконструированный билдер
     */
    private def getLinkBuilder(Link link,
                               Integer offsetMinutes,
                               List parameters,
                               Boolean conditionForDataSet)
    {
        def builder = web.defineListLink(false)
                         .setTitle(link.title)
                         .setClassCode(link.classFqn)
                         .setCases(link.cases)
                         .setAttrGroup(link.attrGroup)
                         .setAttrCodes(link.attrCodes)
                         .setDaysToLive(link.liveDays)
        if(link.descriptor)
        {
            def slurper = new groovy.json.JsonSlurper()
            def UUID = slurper.parseText(link.descriptor).cardObjectUuid
            String listType = slurper.parseText(link.descriptor).contentType
            builder.setUuid(UUID)
            if (listType == "RelObjectList")
            {
                builder.setListType(listType)
            }
        }
        link.template?.with(builder.&setTemplate)
        def filterBuilder = builder.filter()
        addDescriptorInFilter(filterBuilder, link.descriptor, builder)
        formatFilter(filterBuilder, link.filters, link.classFqn, link.cases, link.descriptor, offsetMinutes, link.diagramType)
        filterTotalDataSetWithoutBlankData(filterBuilder, conditionForDataSet, parameters)
        return builder
    }

    /**
     * Метод проверки данных на возможный перегруз количества информации для фильтра containsInSet
     * @param values - данные, полученные при поиске
     */
    private void checkValuesSize(def values)
    {
        if(values?.size() > dashboardUtils.maxValuesCount)
        {
            String message = messageProvider.getConstant(OVERFLOW_DATA_ERROR, currentUserLocale)
            utils.throwReadableException("${message}#${OVERFLOW_DATA_ERROR}")
        }
    }

    /**
     * Применеине дескриптора в фильтре
     * @param filterBuilder - билдер для фильтра
     * @param descriptor - объект фильтрации
     * @param linkBuilder - билдер для ссылки
     */
    private void addDescriptorInFilter(Object filterBuilder, String descriptor, IListLinkDefinition linkBuilder)
    {
        if (descriptor)
        {
            Object listDescriptor = listdata.createListDescriptor(descriptor)

            Object iDescriptor
            if (listDescriptor.hasProperty('wrapped'))
            {
                iDescriptor = listDescriptor.wrapped
            }
            else
            {
                iDescriptor = listDescriptor.context
            }

            iDescriptor.listFilter.elements.collect { orFilter ->
                orFilter.elements.collect { filter ->
                    String attribute = filter.getAttributeFqn() as String
                    String condition = filter.getProperties().conditionCode
                    Boolean attrTypeIsSet = filter.getProperties().attrTypeCode in AttributeType.LINK_SET_TYPES
                    def value = filter.getValue()
                    if (condition == 'containsSubject')
                    { // костыль. так как дескриптор статичный, а условие должно быть динамичным
                        def uuidSubject = utils.get(iDescriptor.clientSettings.formObjectUuid as String)
                        if(attrTypeIsSet)
                        {
                            uuidSubject = [uuidSubject]
                        }
                        return filterBuilder.OR(attribute, 'contains', uuidSubject)
                    }
                    else
                    {
                        if (condition.toLowerCase().contains('subject'))
                        {
                            if(value?.getUUID()?.contains('.'))
                            {
                                def values = value?.getUUID()?.tokenize('.')?.collect {
                                    return it?.tokenize('@')?.last()
                                }
                                value = utils.get(subjectUUID)
                                //проходим по каждому значению из переменной вплоть до последнего уровня
                                values.each { value = value[it] }
                                //делаем список значений плоским
                                value = value.flatten()
                                checkValuesSize(value)
                                return filterBuilder.OR(attribute, 'containsInSet', value)
                            }
                            else
                            {
                                def (metaClass, subjectAttribute) = value?.getUUID()?.split('@')
                                value = metainfo.getMetaClass(metaClass)
                                                .getAttribute(subjectAttribute)
                                                .getAttributeFqn()
                            }
                        }
                        return  filterBuilder.OR(attribute, condition, value)
                    }
                }
            }.inject(filterBuilder) { first, second -> first.AND(*second) }
            addChainFilters(iDescriptor, linkBuilder)
        }
    }

    /**
     * Метод формирования фильтров на цепочку атрибутов
     * @param iDescriptor - настройки дескриптора
     * @param linkBuilder - билдер для ссылки
     * @return измененные настройки фильтрации
     */
    private void addChainFilters(Object iDescriptor, IListLinkDefinition linkBuilder)
    {
        if (iDescriptor?.content?.getProperties()?.keySet()?.any {
            it.toString() == 'attrsChain'
        })
        {
            def attrsChain = iDescriptor?.content?.attrsChain
            linkBuilder.attrChain()
                       .attributesChain(*attrsChain.collect { it.toString() })
                       .attrLinkCode(iDescriptor?.content?.attrLinkCode)
                       .nestedHierarchyAttrFqn(iDescriptor?.content?.nestedHierarchyAttrFqn)
                       .nestedAttrLinkFqn(iDescriptor?.content?.nestedAttrLinkFqn.toString())
        }
    }

    /**
     * Получение данных для фильтра
     * @param dataAttrs - атрибуты для получения данных
     * @param value - значение, к которому может быть применен атрибут
     * @return данные по атрибуту
     */
    private List getDataForAttrs(List dataAttrs, def value)
    {
        return dataAttrs.collect {
            return value[it.attrForData.code]
        }.flatten().unique()
    }

    /**
     * Получение словаря с атрибутом для фильтрации в списке связанных объектов
     * @param systemAttr - системный атрибут
     * @return словарь с атрибутом для фильтрации в списке связанных объектов
     */
    private Map getAttributeForAttrChain(def systemAttr)
    {
        def totalAttribute
        def fqn
        if (systemAttr.type.code == AttributeType.BACK_BO_LINKS_TYPE)
        {
            systemAttr = systemAttr.@attribute
            totalAttribute = beanFactory.getBean('flexHelper').getBackLinkRelatedAttribute(systemAttr)
            fqn = totalAttribute?.fqn
        }
        else
        {
            def sourceMC = systemAttr?.type?.relatedMetaClass
            def attrFqn = systemAttr?.attributeFqn
            if (sourceMC)
            {
                totalAttribute = metainfo.getMetaClass(sourceMC?.code).attributes.find { attr ->
                    attr.type.code == AttributeType.BACK_BO_LINKS_TYPE &&
                    beanFactory.getBean('flexHelper').getBackLinkRelatedAttribute(attr.@attribute).fqn == attrFqn
                }
            }
        }
        return totalAttribute ? ['attribute': totalAttribute,
                                 'fqn': fqn.toString(),
                                 'attrForData': systemAttr.type.code != AttributeType.BACK_BO_LINKS_TYPE ? systemAttr : null] : [:]
    }

    /**
     * Вспомогательный метод для формирования фильтра
     * @param filterBuilder - билдер для фильтра
     * @param filters - фильтры
     * @param classFqn - код класса, которому принадлежат объекты списка
     * @param cases - список разршенных типов
     * @param descriptor - дескриптор
     * @param offsetMinutes - смещение часового пояса пользователя относительно серверного времени
     * @param diagramType - тип диаграммы
     */
    private void formatFilter(IListLinkDefinition.IFilter filterBuilder, Collection<DrilldownFilter> filters, String classFqn, Collection<String> cases, String descriptor, Integer offsetMinutes, DiagramType diagramType = null)
    {
        if (filters)
        {
            String indicatorsCode
            filters.groupBy {
                Jackson.toJsonString(it.attribute)
            }.collect {
                def attr, Collection<Map> filter ->
                    attr = Jackson.fromJsonString(attr, Attribute)
                    Collection<Collection> result = []
                    String attributeType = Attribute.getAttributeType(attr)
                    Boolean attrIsDynamic = attr?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
                    //обрабатывается ситуация для атрибута нижнего уровня
                    attr = DashboardQueryWrapperUtils.updateRefAttributeCode(attr)
                    //выглядит костыльно, но это необходимо, чтобы обойти ситуацию,
                    // когда основной источник запроса - дочерний к classFqn,
                    // когда у нас сама диаграмма типа таблица
                    //и для дат это неприменимо
                    if (!attrIsDynamic && attr?.sourceCode && attr?.sourceCode != classFqn &&
                        !(StateMarshaller.unmarshal(attr?.sourceCode, '$')?.last() in cases) &&
                        diagramType == DiagramType.TABLE)
                    {
                        if(attr.type in AttributeType.DATE_TYPES)
                        {
                            def highLevelAttr = new Attribute(code: attr.sourceCode,
                                                              sourceCode: classFqn,
                                                              title: attr?.title,
                                                              type: 'object', ref: attr)
                            attr = highLevelAttr
                        }
                        else
                        {
                            //если атрибут из другого источника (атрибута), указываем его код в начале
                            attr?.code = "${attr?.sourceCode}.${attr?.code}"
                        }
                    }

                    def contextValue = filter.findResults { map ->
                        def group = map.group
                        def value = map.value
                        def aggregation = map.aggregation
                        if (aggregation)
                        {
                            if(attr.type != 'COMPUTED_ATTR')
                            {
                                indicatorsCode = attr.code
                                result << [filterBuilder.OR(attr.code, 'notNull', null)]
                            }
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
                            def objects = []
                            if(attributeType in AttributeType.LINK_TYPES)
                            {
                                if (value == 'Не заполнено')
                                {
                                    List elements = getElementsByCriteriaToFilter(
                                        attr,
                                        classFqn,
                                        descriptor,
                                        indicatorsCode
                                    )
                                    checkValuesSize(elements)
                                    result << [filterBuilder.OR(
                                        indicatorsCode, 'contains', elements.collect {
                                        it as String
                                    }
                                    )]
                                }
                                else
                                {
                                    QueryWrapper wrapper = new MainDateFilterProvider()
                                        .getWrapperForDynamicAttr(attr, classFqn, descriptor)
                                    wrapper.totalValueCriteria.add(
                                        this.filters.attrValueEq(
                                            'value',
                                            utils.get(
                                                LinksAttributeMarshaller.unmarshal(value).last()
                                            )
                                        )
                                    )
                                    objects =
                                        wrapper
                                            .getResult(true, DiagramType.TABLE, true, true)
                                            .flatten()
                                    checkValuesSize(objects)
                                    attr.code = AttributeType.TOTAL_VALUE_TYPE
                                    result << [filterBuilder.OR(attr.code, 'notNull', null)]
                                    result << [filterBuilder.OR(
                                        attr.code, 'containsInSet', objects.collect {
                                        it.hasProperty('UUID') ? it.UUID : it
                                    }
                                    )]
                                }
                            }
                            else
                            {
                                attr.ref = new Attribute(
                                    code: 'textValue',
                                    type: 'string',
                                    property: AttributeType.TOTAL_VALUE_TYPE
                                )
                                objects = findObjects(attr.ref, attr.property, value)
                                checkValuesSize(objects)
                                attr.code = AttributeType.TOTAL_VALUE_TYPE
                                result << [filterBuilder.OR(attr.code, 'notNull', null)]
                                result << [filterBuilder.OR(
                                    attr.code, 'containsInSet', objects.collect {
                                    it.hasProperty('UUID') ? it.UUID : it
                                }
                                )]
                            }
                        }
                        else
                        {
                            if (attr.code.contains('.'))
                            {
                                String currentAttrCode = attr.code
                                def (sourceAttrCode, attrCode) = currentAttrCode.tokenize('.')
                                String metaForAttr = metainfo.getMetaClass(classFqn)
                                                             .getAttribute(sourceAttrCode)
                                                             .type.relatedMetaClass

                                attr.code = attrCode
                                def objects = findObjects(attr, metaForAttr, value)
                                result << [filterBuilder.OR(sourceAttrCode, 'containsInSet', objects.collect { it.UUID })]
                            }
                            else
                            {
                                switch(attributeType)
                                {
                                    case AttributeType.LINK_TYPES:
                                        if (value == 'Не заполнено')
                                        {
                                            if(attr.ref)
                                            {
                                                def values = getValuesForRefAttr(attr, null)
                                                checkValuesSize(values)
                                                result << [filterBuilder.OR(attr.code, 'containsInSet', values)]
                                            }
                                            else
                                            {
                                                result << [filterBuilder.OR(attr.code, 'null', null)]
                                            }
                                        }
                                        else
                                        {
                                            List objects = []
                                            if(attr.attrChains().count {it.type in AttributeType.LINK_TYPES} > 1)
                                            {
                                                //двухуровневый ссылочный
                                                objects = findObjects(attr.ref,attr.property, LinksAttributeMarshaller.unmarshal(value).last())
                                            }
                                            else
                                            {
                                                if(!attr.ref)
                                                {
                                                    attr.ref = AttributeType in [AttributeType.CATALOG_ITEM_TYPE, AttributeType.CATALOG_ITEM_SET_TYPE]
                                                        ? new Attribute(code:'code', type:'string')
                                                        : new Attribute(code:'title', type:'string')
                                                }
                                                objects = findObjects(attr.ref, attr.property, LinksAttributeMarshaller.unmarshal(value).last(), true)
                                            }
                                            result << [filterBuilder.OR(attr.code, 'containsInSet', objects.collect { it.UUID })]
                                        }
                                        break
                                    case AttributeType.STATE_TYPE:
                                        getStateFilters(attr, value, filterBuilder)
                                        break
                                    case AttributeType.TEXT_TYPE:
                                        Boolean conditionRelatedObj =
                                            metainfo
                                                .getMetaClass(attr.sourceCode)
                                                .getAttribute(attr.code)
                                                .type.attributeType.isAttributeOfRelatedObject()
                                        if (conditionRelatedObj)
                                        {
                                            String message =
                                                messageProvider.getConstant(
                                                    NO_DETAIL_DATA_ERROR,
                                                    currentUserLocale
                                                )
                                            utils
                                                .throwReadableException("${ message }#${ NO_DETAIL_DATA_ERROR }")
                                        }
                                    default:
                                        result << [getOrFilter(attributeType, attr, value, filterBuilder)]
                                }
                            }
                        }
                    }
                    if (context)
                    {
                        def filterProvider = new MainDateFilterProvider()

                        //Тут обработка только группировок по датам
                        context.keySet().each { groupType ->
                            def value = context.get(groupType)
                            def format = value?.last()
                            String stringValue = value?.head()
                            result << [filterProvider.getFilter(
                                groupType,
                                format,
                                stringValue,
                                filterBuilder,
                                attr,
                                classFqn,
                                descriptor
                            )]
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
                            Closure<Collection<Collection<FilterParameter>>> mappingFilters = dashboardDataSetService.getMappingFilterMethodByType(attributeType, subjectUUID, source)
                            def groupFilters = mappingFilters(
                                customSubGroupCondition as List<List>,
                                attr,
                                data instanceof Map ? data.title : data,
                                "test"
                            )
                            def filterParam = groupFilters?.find {it?.attribute?.code?.find() == 'value' }
                            def wrapper = QueryWrapper.build(source, templateUUID)

                            wrapper.totalValueCriteria.add(this.filters.attrValueEq('linkTemplate', templateUUID))
                                   .addColumn(selectClause.property('UUID'))
                            wrapper.filtering(wrapper.totalValueCriteria, true, filterParam)

                            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
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
                                            def uuids = getValuesForRefAttrInCustomGroup(attr, it.data, customSubGroupCondition)
                                            return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                        }
                                        String condition = getFilterCondition(it.type as String)
                                        def interval = it.data as Map
                                        def value = interval
                                            ? types.newDateTimeInterval([interval.value as long,
                                                                         interval.type as String])
                                            : null
                                        //TODO: до конца не уверен. Нужно ли извлекать милисекунды или нет
                                        filterBuilder.OR(attr.code, condition, value)
                                    }
                                }
                                break
                            case AttributeType.TEXT_TYPE:
                                Boolean conditionRelatedObj =
                                    metainfo
                                        .getMetaClass(attr.sourceCode)
                                        .getAttribute(attr.code)
                                        .type.attributeType.isAttributeOfRelatedObject()
                                if (conditionRelatedObj)
                                {
                                    String message =
                                        messageProvider
                                            .getConstant(NO_DETAIL_DATA_ERROR, currentUserLocale)
                                    utils
                                        .throwReadableException("${ message }#${ NO_DETAIL_DATA_ERROR }")
                                }
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
                                        if(attr.ref)
                                        {
                                            def uuids = getValuesForRefAttrInCustomGroup(attr, it.data, customSubGroupCondition)
                                            return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                        }
                                        switch (Condition.getByTitle(it.type.toLowerCase()))
                                        {
                                            case Condition.EMPTY:
                                                return filterBuilder.OR(attr.code, 'null', null)
                                            case Condition.NOT_EMPTY:
                                                return filterBuilder.OR(attr.code, 'notNull', null)
                                            case Condition.TODAY:
                                                return filterBuilder.OR(attr.code, 'today', null)
                                            case Condition.LAST:
                                                return filterBuilder.OR(attr.code, 'lastN', it.data as int)
                                            case Condition.LAST_HOURS:
                                                Double hours = it.data as Double
                                                hours += (offsetMinutes / 60)
                                                return filterBuilder.OR(attr.code, 'lastNHours', hours)
                                            case Condition.NEAR:
                                                return filterBuilder.OR(attr.code, 'nextN', it.data as int)
                                            case Condition.NEAR_HOURS:
                                                Double hours = it.data as Double
                                                hours += (offsetMinutes / 60)
                                                return filterBuilder.OR(attr.code, 'nextNHours', hours)
                                            case Condition.BETWEEN:
                                                String dateFormat
                                                def dateSet = it.data as Map<String, Object> // тут будет массив дат или одна из них
                                                def start
                                                if(dateSet.startDate)
                                                {
                                                    dateFormat = dashboardUtils.getDateFormatByDate(dateSet.startDate as String)
                                                    start = Date.parse(dateFormat, dateSet.startDate as String)
                                                }
                                                else
                                                {
                                                    Date minDate = dashboardUtils.getMinDate(
                                                        attr.code,
                                                        attr.sourceCode
                                                    )
                                                    start = new Date(minDate.time).clearTime()
                                                }
                                                def end
                                                if (dateSet.endDate)
                                                {
                                                    dateFormat = dashboardUtils.getDateFormatByDate(dateSet.endDate as String)
                                                    end = Date.parse(dateFormat, dateSet.endDate as String)
                                                    if(Attribute.getAttributeType(attr) == AttributeType.DATE_TIME_TYPE)
                                                    {
                                                        def dateScope = 86399000 //+23 ч 59 мин 59с
                                                        end = new Date(end.getTime() + dateScope)
                                                    }
                                                }
                                                else
                                                {
                                                    end = new Date()
                                                }
                                                // Сдвиг для учета часового пояса пользователя.
                                                start = DateUtils.addMinutes(start, offsetMinutes)
                                                end = DateUtils.addMinutes(end, offsetMinutes)
                                                return filterBuilder.OR(attr.code, 'fromTo', [start, end])
                                            default:
                                                String message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: it.type)
                                                utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
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
                                            def uuids = getValuesForRefAttrInCustomGroup(attr, it.data, customSubGroupCondition)
                                            return filterBuilder.AND(
                                                filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                            )
                                        }
                                        Closure buildStateFilter = { String code, String condition, String stateCode ->
                                            if(sourceCode.contains('$'))
                                            {
                                                return filterBuilder.AND(
                                                    filterBuilder.OR(code, condition, "$sourceCode:$stateCode".toString())
                                                )
                                            }
                                            def classTypes = metainfo.getTypes(sourceCode).code
                                            if (condition == 'contains')
                                            {
                                                return filterBuilder.AND(
                                                    *classTypes.collect {
                                                        filterBuilder.OR(code, condition, "$it:$stateCode".toString())
                                                    }
                                                )
                                            }
                                            else
                                            {
                                                classTypes.each { filterBuilder.AND(
                                                    filterBuilder.OR(
                                                        code,
                                                        condition,
                                                        "$it:$stateCode".toString()))
                                                }
                                                return filterBuilder
                                            }
                                        }
                                        switch (Condition.getByTitle(it.type.toLowerCase()))
                                        {
                                            case Condition.CONTAINS:
                                                return buildStateFilter(attr.code, 'contains', it.data.uuid)
                                            case Condition.NOT_CONTAINS:
                                                return buildStateFilter(attr.code, 'notContains', it.data.uuid)
                                            case Condition.CONTAINS_ANY:
                                                List objectsToFilter = it.data*.uuid.collectMany { stateCode ->
                                                    if (sourceCode.contains('$'))
                                                    {
                                                        return ["$sourceCode:$stateCode".toString()]
                                                    }
                                                    else
                                                    {
                                                        def classTypes = metainfo.getTypes(sourceCode).code
                                                        return classTypes.collect {
                                                            "$it:$stateCode".toString()
                                                        }
                                                    }
                                                }
                                                return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', objectsToFilter))
                                            case Condition.TITLE_CONTAINS:
                                                return filterBuilder.AND(filterBuilder.OR(attr.code, 'titleContains', it.data))
                                            case Condition.TITLE_NOT_CONTAINS:
                                                return filterBuilder.AND(filterBuilder.OR(attr.code, 'titleNotContains', it.data))
                                            case [Condition.EQUAL_SUBJECT_ATTRIBUTE, Condition.EQUAL_ATTR_CURRENT_OBJECT]:
                                                return filterBuilder.AND(filterBuilder.OR(attr.code, 'contains', it.data.uuid))
                                            default:
                                                String message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: it.type)
                                                utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
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
                                        switch (Condition.getByTitle(it.type.toLowerCase()))
                                        {
                                            case Condition.EMPTY:
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = utils.find(attr.property, [(lastAttr.code): null])
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects
                                                    )
                                                }
                                                return filterBuilder.OR(attr.code, 'null', null)
                                            case Condition.NOT_EMPTY:
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = utils.find(attr.property, [(lastAttr.code): op.not(null)])
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects
                                                    )
                                                }
                                                return filterBuilder.OR(attr.code, 'notNull', null)
                                            case Condition.CONTAINS:
                                                def value = utils.get(it.data.uuid)
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = findObjects(attr.ref, attr.property, value)
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects.collect { it.UUID }
                                                    )
                                                }
                                                if (attributeTypeIsSet)
                                                {
                                                    value = [value]
                                                }

                                                return filterBuilder.OR(attr.code, 'contains', value)
                                            case Condition.NOT_CONTAINS:
                                                def value = utils.get(it.data.uuid)
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = utils.find(attr.property, [(lastAttr.code): op.not(value)])
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
                                                filterBuilder.AND(filterBuilder.OR(attr.code, 'notNull', value))
                                                return filterBuilder.OR(attr.code, 'notContains', value)
                                            case Condition.TITLE_CONTAINS:
                                                def value = it.data
                                                if(twoLinkAttrs)
                                                {
                                                    def lowValues = utils.find(lastAttr.property, ['title': op.like("%${value}%")])
                                                    def highValues = utils.find(attr.property, [(lastAttr.code) : op.in(lowValues)])
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
                                            case Condition.TITLE_NOT_CONTAINS:
                                                def value = it.data
                                                if(twoLinkAttrs)
                                                {
                                                    def lowValues = utils.find(lastAttr.property, ['title': op.not("%${value}%")])
                                                    def highValues = utils.find(attr.property, [(lastAttr.code) : op.in(lowValues)])
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
                                            case Condition.CONTAINS_INCLUDING_ARCHIVAL:
                                                def value = utils.get(it.data.uuid)
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = findObjects(attr.ref, attr.property, value)
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects.collect { it.UUID }
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
                                            case Condition.NOT_CONTAINS_INCLUDING_ARCHIVAL:
                                                def value = utils.get(it.data.uuid)
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = utils.find(attr.property, [(lastAttr.code): op.not(value)])
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
                                            case Condition.CONTAINS_INCLUDING_NESTED:
                                                def value = utils.get(it.data.uuid)
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = findObjects(attr.ref, attr.property, value)
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects.collect { it.UUID }
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
                                            case Condition.CONTAINS_ANY:
                                                def uuids = it.data*.uuid
                                                def values = uuids.collect { uuid -> utils.get(uuid) }
                                                if(twoLinkAttrs)
                                                {
                                                    values = values.collectMany{ value -> findObjects(attr.ref, attr.property, value)}
                                                }
                                                checkValuesSize(values)
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'containsInSet',
                                                    values.collect { it.UUID }
                                                )
                                            case [Condition.CONTAINS_CURRENT_OBJECT, Condition.EQUAL_CURRENT_OBJECT]:
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = findObjects(attr.ref, attr.property, subjectUUID)
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects.collect { it.UUID }
                                                    )
                                                }
                                                return filterBuilder.OR(
                                                    attr.code,
                                                    'contains',
                                                    subjectUUID
                                                )
                                            case [Condition.CONTAINS_ATTR_CURRENT_OBJECT,
                                                  Condition.EQUAL_ATTR_CURRENT_OBJECT]:
                                                def subjectAttribute = it.data
                                                def code = subjectAttribute.code
                                                def subjectType = subjectAttribute.type
                                                if (subjectType != attributeType)
                                                {
                                                    String message = messageProvider.getMessage(SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_EROOR, currentUserLocale, subjectType: subjectType, attributeType: attributeType)
                                                    utils.throwReadableException("$message#${SUBJECT_TYPE_AND_ATTRIBUTE_TYPE_NOT_EQUAL_EROOR}")
                                                }
                                                def value = utils.get(subjectUUID)[code]
                                                if(twoLinkAttrs)
                                                {
                                                    def objects = findObjects(attr.ref, attr.property, value)
                                                    checkValuesSize(objects)
                                                    return filterBuilder.OR(
                                                        attr.code,
                                                        'containsInSet',
                                                        objects.collect { it.UUID }
                                                    )
                                                }
                                                return filterBuilder.OR(attr.code, 'contains', value)
                                            default:
                                                String message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: it.type)
                                                utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                                        }
                                    }
                                }
                                break
                            case AttributeType.TIMER_TYPES:
                                if (attr.timerValue == TimerValue.VALUE)
                                {
                                    List values = getValuesForRefAttrInCustomGroup(attr, null, customSubGroupCondition)
                                    result += [[filterBuilder.OR('UUID', 'contains', values)]]
                                }
                                else
                                {
                                    result += customSubGroupCondition.collect { orCondition ->
                                        orCondition.collect {
                                            if(attr.ref)
                                            {
                                                Collection uuids = getValuesForRefAttrInCustomGroup(attr, it.data, customSubGroupCondition)
                                                return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                            }
                                            switch (Condition.getByTitle(it.type.toLowerCase()))
                                            {
                                                case Condition.STATUS_CONTAINS:
                                                    String code = it.data.value?.toLowerCase()?.take(1)
                                                    return filterBuilder.
                                                        OR(attr.code, 'timerStatusContains', [code])
                                                case Condition.STATUS_NOT_CONTAINS:
                                                    String code = it.data.value?.toLowerCase()?.take(1)
                                                    return filterBuilder.
                                                        OR(attr.code, 'timerStatusNotContains', [code])
                                                case Condition.EXPIRES_BETWEEN:
                                                    String dateFormat
                                                    Map<String, Object> dateSet = it.data as Map<String, Object> // тут будет массив дат или одна из них
                                                    Date start
                                                    if(dateSet.startDate)
                                                    {
                                                        dateFormat = dashboardUtils.getDateFormatByDate(dateSet.startDate as String)
                                                        start = Date.parse(dateFormat, dateSet.startDate as String)
                                                    }
                                                    else
                                                    {
                                                        String attrCode = "${attr.code}.deadLineTime"
                                                        Date minDate = dashboardUtils.getMinDate(
                                                            attrCode,
                                                            attr.sourceCode,
                                                            this.descriptor
                                                        )
                                                        start = new Date(minDate.time).clearTime()
                                                    }
                                                    Date end
                                                    if (dateSet.endDate)
                                                    {
                                                        dateFormat = dashboardUtils.getDateFormatByDate(dateSet.endDate as String)
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
                                                case Condition.EXPIRATION_CONTAINS:
                                                    String conditionType = it.data.value == 'EXCEED'
                                                        ? 'timerStatusContains'
                                                        : 'timerStatusNotContains'
                                                    return filterBuilder.OR(attr.code, conditionType, ['e'])
                                                case Condition.EQUAL:
                                                case Condition.NOT_EQUAL:
                                                case Condition.GREATER:
                                                case Condition.LESS:
                                                case Condition.EMPTY:
                                                case Condition.NOT_EMPTY:
                                                    String message = messageProvider.getConstant(NO_DETAIL_DATA_ERROR, currentUserLocale)
                                                    utils.throwReadableException("${message}#${NO_DETAIL_DATA_ERROR}")
                                                default:
                                                    String message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: it.type)
                                                    utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                                            }
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
                                            def uuids = getValuesForRefAttrInCustomGroup(attr, it.data, customSubGroupCondition)
                                            return filterBuilder.OR(attr.code, 'containsInSet', uuids)
                                        }
                                        switch (Condition.getByTitle(it.type.toLowerCase()))
                                        {
                                            case Condition.CONTAINS:
                                                return filterBuilder.OR(attr.code, 'contains', it.data.uuid)
                                            case Condition.NOT_CONTAINS:
                                                return filterBuilder.OR(attr.code, 'notContains', it.data.uuid)
                                            case Condition.CONTAINS_ANY:
                                                return filterBuilder.OR(attr.code, 'containsInSet', it.data*.uuid)
                                            case Condition.TITLE_CONTAINS:
                                                return filterBuilder.OR(attr.code, 'titleContains', it.data)
                                            case Condition.TITLE_NOT_CONTAINS:
                                                return filterBuilder.OR(attr.code, 'titleNotContains', it.data)
                                            case [Condition.EQUAL_SUBJECT_ATTRIBUTE, Condition.EQUAL_ATTR_CURRENT_OBJECT]:
                                                return filterBuilder.OR(attr.code, 'contains', it.data.uuid)
                                            default:
                                                String message = messageProvider.getMessage(NOT_SUPPORTED_CONDITION_TYPE_ERROR, currentUserLocale, conditionType: it.type)
                                                utils.throwReadableException("$message#${NOT_SUPPORTED_CONDITION_TYPE_ERROR}")
                                        }
                                    }
                                }
                                break
                            default:
                                String message = messageProvider.getMessage(NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR, currentUserLocale, attributeType: attributeType)
                                utils.throwReadableException("$message#${NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR}")
                        }
                    }
                    result
            }.each { it ->
                it.inject(filterBuilder) { first, second -> first.AND(*second)
                }
            }
        }
    }

    /**
     * Метод получения элементов по критерии для фильтрации динамических атрибутов
     * @param attr - аттрибут целиком
     * @param classFqn - метакласс запроса
     * @param descriptor - дескриптор
     * @param indicatorsCode - код из фильтра индикатора
     * @return список элементов полученный из критерии
     */
    private List getElementsByCriteriaToFilter(Attribute attr,
                                               String classFqn,
                                               String descriptor,
                                               String indicatorsCode)
    {
        String templateUUID =
            TotalValueMarshaller.unmarshal(attr.code).last()
        Source source = new Source(
            classFqn: classFqn,
            descriptor: descriptor
        )
        QueryWrapper wrapper = QueryWrapper.build(source)
        IApiCriteria criteria = wrapper.criteria
        String totalValueFormatKey =
            DashboardUtils
                .getFormatKeyForTemplateOfDynamicAttribute(
                    templateUUID
                )
        IApiCriteria totalValueCriteria =
            criteria.subquery().addSource(totalValueFormatKey)
        Object linkedScId =
            selectClause.property(totalValueCriteria, 'linkedSc.id')
        totalValueCriteria.addColumn(linkedScId)
        totalValueCriteria.add(
            this.filters.attrValueEq('linkTemplate', templateUUID)
        )
                          .add(whereClause.isNotNull(linkedScId))
        criteria.add(
            whereClause.notIn(selectClause.property('id'), totalValueCriteria)
        ).addColumn(selectClause.property(indicatorsCode)).addGroupColumn(
            selectClause.property(indicatorsCode)
        )
        return db.query(criteria).list()
    }

    private String getFilterCondition(String condition)
    {
        switch (Condition.getByTitle(condition.toLowerCase()))
        {
            case Condition.EMPTY:
                return 'null'
            case Condition.NOT_EMPTY:
                return 'notNull'
            case [Condition.EQUAL, Condition.CONTAINS]:
                return 'contains'
            case [Condition.NOT_CONTAINS, Condition.NOT_EQUAL, Condition.NOT_CONTAINS_NOT_EMPTY]:
                return 'notContains'
            case [Condition.NOT_CONTAINS_INCLUDING_EMPTY, Condition.NOT_EQUAL_NOT_EMPTY]:
                return 'notContainsIncludeEmpty'
            case Condition.GREATER:
                return 'greater'
            case Condition.LESS:
                return 'less'
            default:
                String message = messageProvider.getMessage(NOT_SUPPORTED_FILTER_CONDITION_ERROR, currentUserLocale, condition: condition)
                utils.throwReadableException("$message#${NOT_SUPPORTED_FILTER_CONDITION_ERROR}")
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
                filterBuilder.OR(code, 'contains', "$sourceCode:$state".toString())
            )
        }
        def cases = metainfo.getTypes(sourceCode).code
        return filterBuilder.AND(
            *cases.collect{filterBuilder.OR(code, 'contains', "$it:$state".toString())}
        )
    }

    /**
     * Метод получения данных из БД по атрибуту второго уровня
     * @param attr - атрибут целиком
     * @param DBvalue - значение, для фильтрации в БД
     * @param descriptor - дескриптор
     * @return список uuid-ов для атрибута первого уровня и фильтрации containsInSet
     */
    private Collection getValuesForRefAttr(Attribute attr, def DBvalue, String descriptor = null)
    {
        def sc = selectClause
        def criteria = descriptor
            ? descriptor.with(listdata.&createListDescriptor).with(listdata.&createCriteria)
            : db.createCriteria().addSource(attr.sourceCode)
        criteria.addColumn(sc.property("${attr.code}.UUID"))
                .add(filters.attrValueEq((Attribute.getAttributeType(attr) in AttributeType.TIMER_TYPES)
                                                ?  attr.attrChains().code.join('.') + getTimerAttrCode(attr)
                                                : attr.attrChains().code.join('.'), DBvalue))
        return db.query(criteria).list()
    }

    /**
     * Метод получения кода для второго атрибута в запросе по счетчикам
     * @param attr - атрибут типа счетчик
     * @return код для второго атрибута в запросе по счетчикам
     */
    private String getTimerAttrCode(Attribute attr)
    {
        if(attr.timerValue == TimerValue.VALUE)
        {
            return '.elapsed'
        }
        return '.statusCode'
    }

    /**
     * Метод получения данныз из БД по атрибуту второго уровня, если на него настроена кастомная группировка
     * @param attr - атрибут целиком
     * @param data - данные о кастомной группировке
     * @param customSubGroupCondition - условия кастомной группировки
     * @param fromSystemGroup - флаг на системную группировку
     * @return список uuid-ов для атрибута первого уровня и фильтрации containsInSet
     */
    private Collection getValuesForRefAttrInCustomGroup(Attribute attr, def data, List<List> customSubGroupCondition, Boolean fromSystemGroup = false)
    {
        Source source = new Source(classFqn: attr.sourceCode, descriptor: '')
        def attributeType = Attribute.getAttributeType(attr)
        Closure<Collection<Collection<FilterParameter>>> mappingFilters = dashboardDataSetService.getMappingFilterMethodByType(attributeType, '', source, 240, fromSystemGroup)
        def filters = mappingFilters(
            customSubGroupCondition,
            attr,
            'test',
            'test'
        )
        def filterParam = filters?.find()
        def wrapper = QueryWrapper.build(source)

        String fullAttributeCode
        if (attr.type in AttributeType.TIMER_TYPES && attr.timerValue == TimerValue.VALUE)
        {
            fullAttributeCode = 'UUID'
        }
        else
        {
            fullAttributeCode = attr.code + '.UUID'
        }

        wrapper.criteria.addColumn(selectClause.property(fullAttributeCode))
        wrapper.filtering(wrapper.criteria, false, filterParam)

        def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
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
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        def values = []
        if(attr.ref)
        {
            //пришли из ссылочного атрибута
            def lastAttr = attr.attrChains().last()
            code = lastAttr.code
            if (value == 'Не заполнено' || value == 'EMPTY')
            {
                return filterBuilder.OR(attr.code, 'null', null)
            }
            switch (type)
            {
                case AttributeType.META_CLASS_TYPE:
                    def DBvalue = MetaClassMarshaller.unmarshal(value).last()
                    values = getValuesForRefAttr(attr, DBvalue)
                    break
                case AttributeType.DT_INTERVAL_TYPE:
                    def (intervalValue, intervalType) = DtIntervalMarshaller.unmarshal(value.find())
                    if(intervalValue == 'Не заполнено')
                    {
                        return filterBuilder.OR(attr.code, 'null', null)
                    }
                    intervalValue = dashboardUtils.convertValueToInterval(intervalValue as Long, dashboardDataSetService.getDTIntervalGroupType(intervalType))
                    def interval = types.newDateTimeInterval([intervalValue as long, intervalType as String])
                    values = getValuesForRefAttr(attr, interval)
                    break
                case AttributeType.TIMER_TYPES:
                    if (attr?.attrChains()?.last()?.timerValue == TimerValue.VALUE)
                    {
                        value = value?.split(':')
                        if (value)
                        {
                            //формируем условие как для кастомной группировки
                            def customSubGroupCondition = [[[
                                                                'type': 'equal',
                                                                'data': [
                                                                    'label': '',
                                                                    'value': [
                                                                        ['type': 'HOUR', 'value': value[0]],
                                                                        ['type': 'MINUTE', 'value': value[1]],
                                                                        ['type': 'SECOND', 'value': value[2]]
                                                                    ]
                                                                ]
                                                            ]]]

                            values = getValuesForRefAttrInCustomGroup(attr, null, customSubGroupCondition)
                        }
                    }
                    else
                    {
                        String statusCode = TimerStatus.getByName(value)
                        values = getValuesForRefAttr(attr, statusCode)
                    }
                    break
                case AttributeType.BOOL_TYPE:
                    if (!value.isInteger()) {
                        value = value.toLowerCase() == 'да' ? '1' : '0'
                    }
                    values = findObjects(attr.ref, attr.property, value)
                    break
                default:
                    if(attr?.attrChains()?.last()?.code == 'title' && value.contains('#'))
                    {
                        //пришло значение с uuid-ом, поэтому поиск будет по uuid-у
                        values = findObjects(attr.ref, attr.property, LinksAttributeMarshaller.unmarshal(value).last(), true)
                    }
                    else
                    {
                        values = findObjects(attr.ref, attr.property, value)
                    }
                    break
            }
            checkValuesSize(values)
            return filterBuilder.OR(attr.code, 'containsInSet', values.collect { it.UUID })
        }
        if (value == 'Не заполнено' || value == 'EMPTY')
        {
            return filterBuilder.OR(code, 'null', null)
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
                if(intervalValue == 'Не заполнено')
                {
                    return filterBuilder.OR(attr.code, 'null', null)
                }
                intervalValue = dashboardUtils.convertValueToInterval(intervalValue as Long, dashboardDataSetService.getDTIntervalGroupType(intervalType))
                def interval = api.types.newDateTimeInterval([intervalValue as long, intervalType as String])
                return filterBuilder.OR(code, 'contains', interval)
            case AttributeType.TIMER_TYPES:
                if (attr.timerValue == TimerValue.VALUE)
                {
                    value = value?.split(':')
                    if (value)
                    {
                        //формируем условие как для кастомной группировки
                        List<List<Map<String, Object>>> customSubGroupCondition = [[[
                                                            'type': 'equal',
                                                            'data': [
                                                                'label': '',
                                                                'value': [
                                                                    ['type': 'HOUR', 'value': value[0]],
                                                                    ['type': 'MINUTE', 'value': value[1]],
                                                                    ['type': 'SECOND', 'value': value[2]]
                                                                ]
                                                            ]
                                                        ]]]

                        values = getValuesForRefAttrInCustomGroup(attr, null, customSubGroupCondition, true)
                        return filterBuilder.OR('UUID', 'contains', values)
                    }
                    else
                    {
                        String message = messageProvider.getMessage(NO_DETAIL_DATA_ERROR, currentUserLocale)
                        api.utils.throwReadableException("$message#${NO_DETAIL_DATA_ERROR}")
                    }
                }
                else
                {
                    String statusCode = TimerStatus.getByName(value)
                    return filterBuilder.OR(code, 'timerStatusContains', [statusCode])
                }
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
     * @param fromLinks - метод вызван для атрибута типа boLinks, backBOLinks
     * @return список объектов
     */
    private List<Object> findObjects(Attribute attr, String fqnClass, def value, Boolean fromLinks = false)
    {
        String searchField = fromLinks ? DashboardQueryWrapperUtils.UUID_CODE : attr.code
        return attr.ref ?
            utils.find(fqnClass, [(attr.code): findObjects(attr.ref, attr.property, value)])
            : utils.find(fqnClass, [(searchField): value]).collect()
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
                ? result << [(GroupType.OVERLAP): result.get(GroupType.OVERLAP) + it.get(GroupType.OVERLAP)]
                : result << it
        }
        return result
    }

    /**
     * Метод фильтрации итогового датасета без учета незаполненных данных
     * @param filterBuilder - билдер для фильтра
     * @param conditionForDataSet - флаг условия для датасета
     * @param parameters - список параметров группировки
     */
    private void filterTotalDataSetWithoutBlankData(IListLinkDefinition.IFilter filterBuilder,
                                                    Boolean conditionForDataSet,
                                                    List parameters)
    {
        if (conditionForDataSet)
        {
            parameters.each { data ->
                Attribute attr = data.attribute
                filterBuilder.AND(filterBuilder.OR(attr.code, 'notNull', null))
            }
        }
    }

    interface FilterProvider
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
    }

    class MainDateFilterProvider
    {
        Map<String, FilterProvider> filterProviders

        private static Map<String, Integer> genitiveRussianMonth = Calendar.with {
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

        private static Map<String, Integer> nominativeRussianMonth = Calendar.with {
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

        private static Map<String, Integer> russianWeekDay =
            [
                'понедельник': 1,
                'вторник'    : 2,
                'среда'      : 3,
                'четверг'    : 4,
                'пятница'    : 5,
                'суббота'    : 6,
                'воскресенье': 7
            ]


        MainDateFilterProvider()
        {
            registerFilterProviders()
        }

        /**
         * Метод для получения ключа на соответствующий метод из словаря registerFilterProviders
         * @param groupType - тип группировки
         * @param attr - атрибут
         * @return ключ для словаря registerFilterProviders
         */
        String getProviderKey(GroupType groupType, String format, Attribute attr)
        {
            def attrIsDynamic = attr?.code?.contains(AttributeType.TOTAL_VALUE_TYPE)
            Boolean attrRef = attr.ref
            format = format ? format.replace(' - ', '_').replace(' ', '_').replace(':', '_').replace('.', '_') + '_' : ''
            return "${format}${groupType.toString().toLowerCase()}_${attrIsDynamic ? 'dynamic' : attrRef ? 'static_ref' : 'static'}"
        }

        /**
         * Метод, подготавливающий заготовку для объекта на запрос в БД по динамическим атрибутам
         * @param attr - динамический атрибут
         * @return заготовка для объекта на запрос в БД по динамическим атрибутам
         */
        QueryWrapper getWrapperForDynamicAttr(Attribute attr, String classFqn, String descriptor)
        {
            String templateUUID = TotalValueMarshaller.unmarshal(attr.code).last()
            Source source = new Source(classFqn: classFqn, descriptor: descriptor)
            def wrapper = QueryWrapper.build(source, templateUUID)
            wrapper.totalValueCriteria.add(filters.attrValueEq('linkTemplate', templateUUID)).addColumn(selectClause.property('UUID'))
            return wrapper
        }

        /**
         * Метод, предоставляющий подготвленную для фильтра критерию
         * @param attr - атрибут
         * @param classFqn - метакласс запроса
         * @param descriptor - фильтр на источнике запроса
         * @return подготвленная для фильтра критерия
         */
        def getCriteria(def attr, String classFqn, String descriptor)
        {
            def sc = selectClause
            def criteria = descriptor
                ? descriptor.with(listdata.&createListDescriptor).with(listdata.&createCriteria)
                : db.createCriteria().addSource(classFqn)
            criteria.addColumn(sc.property("${attr.code}.UUID"))
            return criteria
        }

        FilterProvider ddDynamicFilter = { String format, String value, def filterBuilder,
                                           Attribute attr, String classFqn, String descriptor ->

            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            int intValue = value.replace('-й', '') as int
            wrapper.totalValueCriteria.add(w.eq(s.day(s.property('value')), intValue))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider ddStaticFilter = {String format, String value, def filterBuilder,
                                         Attribute attr, String classFqn, String descriptor ->
            int intValue = value.replace('-й', '') as int
            def datePoint = date.createDateTimePointPredicates(['DAY', intValue, 'EQ'], ['DAY', intValue, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider ddStaticRefFilter = {String format, String value, def filterBuilder,
                                            Attribute attr, String classFqn, String descriptor ->
            int intValue = value.replace('-й', '') as int
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)
                .add(w.eq(s.day(s.property(attr.attrChains().code.join('.'))),intValue))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }


        FilterProvider wdDynamicFilter = {String format, String value, def filterBuilder,
                                          Attribute attr, String classFqn, String descriptor ->

            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            int intValue = MainDateFilterProvider.russianWeekDay.get(value)
            wrapper.totalValueCriteria.add(w.eq(s.dayOfWeek(s.property('value')), intValue))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider wdStaticFilter = {String format, String value, def filterBuilder,
                                         Attribute attr, String classFqn, String descriptor ->
            int intValue = MainDateFilterProvider.russianWeekDay.get(value)
            def datePoint = date.createDateTimePointPredicates(['WEEKDAY', intValue, 'EQ'], ['WEEKDAY', intValue, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider wdStaticRefFilter = { String format, String value, def filterBuilder,
                                             Attribute attr, String classFqn, String descriptor ->
            int intValue = MainDateFilterProvider.russianWeekDay.get(value)
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)
                .add(w.eq(s.dayOfWeek(s.property(attr.attrChains().code.join('.'))),intValue))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider ddMmYyyyDynamicFilter = { String format, String value, def filterBuilder,
                                                 Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            Date date = new SimpleDateFormat("dd.MM.yyyy").parse(value)
            if(Attribute.getAttributeType(attr) == AttributeType.DATE_TYPE)
            {
                wrapper.totalValueCriteria.add(w.eq(s.property('value'), date))
            }
            else
            {
                def dateScope = 86399000 //+23 ч 59 мин 59с
                Date endDate = new Date(date.getTime() + dateScope)
                wrapper.totalValueCriteria.add(w.between(s.property('value'), date, endDate))
            }
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider ddMmYyyyStaticFilter = { String format, String value, def filterBuilder,
                                                Attribute attr, String classFqn, String descriptor ->
            List<String> splitDate = value.replace('.', '/').split('/')
            def (day, month, year) = splitDate
            def datePoint = date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                               ['MONTH', month as int, 'EQ'],
                                                               ['YEAR', year as int, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider ddMmYyyyStaticRefFilter = { String format, String value, def filterBuilder,
                                                   Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            Date date = new SimpleDateFormat("dd.MM.yyyy").parse(value)
            if(Attribute.getAttributeType(attr) == AttributeType.DATE_TYPE)
            {
                criteria.add(w.eq(s.property(attr.attrChains().code.join('.')), date))
            }
            else
            {
                def dateScope = 86399000 //+23 ч 59 мин 59с
                Date endDate = new Date(date.getTime() + dateScope)
                criteria.add(w.between(s.property(attr.attrChains().code.join('.')), date, endDate))
            }
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider ddMmYyyyHhDynamicFilter = { String format, String value, def filterBuilder,
                                                   Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            Date dateToFind = new SimpleDateFormat('dd.MM.yyyy, HHч').parse(value)
            long hourScope = 3599000; //+59 мин 59 с
            Date anotherDate = new Date(dateToFind.getTime() + hourScope)

            wrapper.totalValueCriteria.add(w.between(s.property('value'), dateToFind, anotherDate))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider ddMmYyyyHhStaticFilter = { String format, String value, def filterBuilder,
                                                  Attribute attr, String classFqn, String descriptor ->
            List<String> fullDate = value.replace('ч', '').replace(',', '').split()
            def (dateString, hour) = fullDate
            String[] splitDate = dateString.tokenize('.')
            def (day, month, year) = splitDate

            def datePoint = date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                               ['MONTH', month as int, 'EQ'],
                                                               ['YEAR', year as int, 'EQ'],
                                                               ['HOUR', hour as int, 'EQ']
            )
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider ddMmYyyyHhStaticRefFilter = { String format, String value, def filterBuilder,
                                                     Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            Date dateToFind = new SimpleDateFormat('dd.MM.yyyy, HHч').parse(value)
            long hourScope = 3599000; //+59 мин 59 с
            Date anotherDate = new Date(dateToFind.getTime() + hourScope)

            criteria.add(w.between(s.property(attr.attrChains().code.join('.')), dateToFind, anotherDate))

            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider ddMmYyyyHhIiDynamicFilter = { String format, String value, def filterBuilder,
                                                     Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            Date date = new SimpleDateFormat('dd.MM.yyyy HH:mm').parse(value)
            wrapper.totalValueCriteria.add(w.eq(s.property('value'), date))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider ddMmYyyyHhIiStaticFilter = { String format, String value, def filterBuilder,
                                                    Attribute attr, String classFqn, String descriptor ->
            List<String> fullDate = value.split()
            def(dateString, dateTime) = fullDate
            String[] splitDate = dateString.tokenize('.')
            def (day, month, year) = splitDate

            def(hour, minute) = dateTime.split(':')

            def datePoint = date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                               ['MONTH', month as int, 'EQ'],
                                                               ['YEAR', year as int, 'EQ'],
                                                               ['HOUR', hour as int, 'EQ'],
                                                               ['MINUTE', minute as int, 'EQ']
            )
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider ddMmYyyyHhIiStaticRefFilter = { String format, String value, def filterBuilder,
                                                       Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            Date date = new SimpleDateFormat('dd.MM.yyyy HH:mm').parse(value)
            criteria.add(w.eq(s.property(attr.attrChains().code.join('.')), date))

            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider ddMMDynamicFilter = { String format, String value, def filterBuilder,
                                             Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            def (String day, String monthName) = value.split()
            int month = MainDateFilterProvider.genitiveRussianMonth.get(monthName.toLowerCase()) + 1

            wrapper.totalValueCriteria.add(w.eq(s.day(s.property('value')), day as int))
                   .add(w.eq(s.month(s.property('value')), month as int))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider ddMMStaticFilter = { String format, String value, def filterBuilder,
                                            Attribute attr, String classFqn, String descriptor ->
            def (String day, String monthName) = value.split()
            int month = MainDateFilterProvider.genitiveRussianMonth.get(monthName.toLowerCase()) + 1
            def datePoint = date.createDateTimePointPredicates(['DAY', day as int, 'EQ'],
                                                               ['MONTH', month as int, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider ddMMStaticRefFilter = { String format, String value, def filterBuilder,
                                               Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            def (String day, String monthName) = value.split()
            int month = MainDateFilterProvider.genitiveRussianMonth.get(monthName.toLowerCase()) + 1

            criteria.add(w.eq(s.day(s.property(attr.attrChains().code.join('.'))), day as int))
                    .add(w.eq(s.month(s.property(attr.attrChains().code.join('.'))), month as int))

            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider yearDynamicFilter = {  String format, String value, def filterBuilder,
                                              Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause
            wrapper.totalValueCriteria.add(w.eq(s.year(s.property('value')), value as int))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider yearStaticFilter = {String format, String value, def filterBuilder,
                                           Attribute attr, String classFqn, String descriptor ->
            def datePoint = date.createDateTimePointPredicates(['YEAR', value as int, 'EQ'], ['YEAR', value as int, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider yearStaticRefFilter = { String format, String value, def filterBuilder,
                                               Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)
            criteria.add(w.eq(s.year(s.property(attr.attrChains().code.join('.'))), value as int))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider hhIIHourDynamicFilter = { String format, String value, def filterBuilder,
                                                 Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            def hoursANDmins = value.tokenize(':/')
            wrapper.totalValueCriteria.add(w.eq(s.extract(s.property('value'), 'HOUR'), hoursANDmins[0] as int))
                   .add(w.eq(s.extract(s.property('value'), 'MINUTE'), hoursANDmins[1] as int))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider hhIIHourStaticFilter = { String format, String value, def filterBuilder,
                                                Attribute attr, String classFqn, String descriptor ->
            def hoursANDmins = value.tokenize(':/')
            def datePoint = date.createDateTimePointPredicates(['HOUR', hoursANDmins[0] as int, 'EQ'],
                                                               ['MINUTE', hoursANDmins[1] as int, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider hhIIHourStaticRefFilter = { String format, String value, def filterBuilder,
                                                   Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)
            def hoursANDmins = value.tokenize(':/')
            criteria.add(w.eq(s.extract(s.property(attr.attrChains().code.join('.')), 'HOUR'), hoursANDmins[0] as int))
                    .add(w.eq(s.extract(s.property(attr.attrChains().code.join('.')), 'MINUTE'), hoursANDmins[1] as int))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider hhHourDynamicFilter = { String format, String value, def filterBuilder,
                                               Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            wrapper.totalValueCriteria.add(w.eq(s.extract(s.property('value'), 'HOUR'), value as int))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider hhHourStaticFilter = { String format, String value, def filterBuilder,
                                              Attribute attr, String classFqn, String descriptor ->
            def datePoint = date.createDateTimePointPredicates(['HOUR', value as int, 'EQ'], ['HOUR', value as int, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider hhHourStaticRefFilter = { String format, String value, def filterBuilder,
                                                 Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            criteria.add(w.eq(s.extract(s.property(attr.attrChains().code.join('.')), 'HOUR'), value as int))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider minuteDynamicFilter = { String format, String value, def filterBuilder,
                                               Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            value = value.replace(' мин', '')
            wrapper.totalValueCriteria.add(w.eq(s.extract(s.property('value'), 'MINUTE'), value as int))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider  minuteStaticFilter = { String format, String value, def filterBuilder,
                                               Attribute attr, String classFqn, String descriptor ->
            value = value.replace(' мин', '')
            def datePoint = date.createDateTimePointPredicates(['MINUTE', value as int, 'EQ'], ['MINUTE', value as int, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }

        FilterProvider  minuteStaticRefFilter = { String format, String value, def filterBuilder,
                                                  Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            value = value.replace(' мин', '')
            criteria.add(w.eq(s.extract(s.property(attr.attrChains().code.join('.')), 'MINUTE'), value as int))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        FilterProvider sevenDaysDynamicFilter = { String format, String value, def filterBuilder,
                                                  Attribute attr, String classFqn, String descriptor ->
            def wrapper = getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause

            def russianLocale = new Locale('ru')
            def(startDate, endDate) = value.tokenize('-').collect { dayAndMonth ->
                SimpleDateFormat parser = new SimpleDateFormat('dd.MM.yy', russianLocale)
                return parser.parse(dayAndMonth)
            }
            wrapper.totalValueCriteria.add(w.between(s.property('value'), startDate, endDate))
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }

        FilterProvider sevenDaysStaticFilter = { String format, String value, def filterBuilder,
                                                 Attribute attr, String classFqn, String descriptor ->
            def russianLocale = new Locale('ru')
            def (day,month, year) = value.tokenize('-').collect { dayAndMonth ->
                SimpleDateFormat parser = new SimpleDateFormat('dd.MM.yy', russianLocale)
                parser.parse(dayAndMonth)
                SimpleDateFormat formatter = new SimpleDateFormat('dd.MM.yyyy')
                dayAndMonth = formatter.format(parser.parse(dayAndMonth))
                def (d, m, y) = dayAndMonth.tokenize('.')
                [d as int, m as int, y as int]
            }.transpose()
            def datePointStart = date.createDateTimePointPredicates(['DAY',  day[0], 'GE'],
                                                                    ['MONTH', month[0], 'EQ'],
                                                                    ['YEAR', year[0], 'EQ'])
            def datePointEnd = date.createDateTimePointPredicates(['DAY',  day[1], 'LE'],
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

        FilterProvider sevenDaysStaticRefFilter = { String format, String value, def filterBuilder,
                                                    Attribute attr, String classFqn, String descriptor ->
            def s = selectClause
            def w = whereClause
            def criteria = getCriteria(attr, classFqn, descriptor)

            def russianLocale = new Locale('ru')
            def(startDate, endDate) = value.tokenize('-').collect { dayAndMonth ->
                SimpleDateFormat parser = new SimpleDateFormat('dd.MM.yy', russianLocale)
                return parser.parse(dayAndMonth)
            }
            criteria.add(w.between(s.property(attr.attrChains().code.join('.')), startDate, endDate))
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }

        void registerFilterProviders()
        {
            filterProviders = [
                dd_day_dynamic                   : ddDynamicFilter,
                dd_day_static                    : ddStaticFilter,
                dd_day_static_ref                : ddStaticRefFilter,

                WD_day_dynamic                   : wdDynamicFilter,
                WD_day_static                    : wdStaticFilter,
                WD_day_static_ref                : wdStaticRefFilter,

                dd_mm_YY_day_dynamic             : ddMmYyyyDynamicFilter,
                dd_mm_YY_day_static              : ddMmYyyyStaticFilter,
                dd_mm_YY_day_static_ref          : ddMmYyyyStaticRefFilter,

                dd_mm_YY_hh_day_dynamic          : ddMmYyyyHhDynamicFilter,
                dd_mm_YY_hh_day_static           : ddMmYyyyHhStaticFilter,
                dd_mm_YY_hh_day_static_ref       : ddMmYyyyHhStaticRefFilter,

                dd_mm_YY_hh_ii_day_dynamic       : ddMmYyyyHhIiDynamicFilter,
                dd_mm_YY_hh_ii_day_static        : ddMmYyyyHhIiStaticFilter,
                dd_mm_YY_hh_ii_day_static_ref    : ddMmYyyyHhIiStaticRefFilter,

                dd_MM_day_dynamic                : ddMMDynamicFilter,
                day_dynamic                      : ddMMDynamicFilter,
                dd_MM_day_static                 : ddMMStaticFilter,
                day_static                       : ddMMStaticFilter,
                dd_MM_day_static_ref             : ddMMStaticRefFilter,
                day_static_ref                   : ddMMStaticRefFilter,

                ww_week_dynamic                  : new WeekDynamicFilter(),
                ww_week_static                   : new WeekStaticFilter(),
                ww_week_static_ref               : new WeekStaticRefFilter(),

                week_dynamic                     : new WeekDynamicFilter(),
                week_static                      : new WeekStaticFilter(),
                week_static_ref                  : new WeekStaticRefFilter(),

                WW_YY_week_dynamic               : new WeekDynamicFilter(),
                WW_YY_week_static                : new WeekStaticFilter(),
                WW_YY_week_static_ref            : new WeekStaticRefFilter(),

                MM_month_dynamic                 : new MonthDynamicFilter(),
                MM_month_static                  : new MonthStaticFilter(),
                MM_month_static_ref              : new MonthStaticRefFilter(),

                MM_YY_month_dynamic              : new MonthDynamicFilter(),
                MM_YY_month_static               : new MonthStaticFilter(),
                MM_YY_month_static_ref           : new MonthStaticRefFilter(),

                month_dynamic                    : new MonthDynamicFilter(),
                month_static                     : new MonthStaticFilter(),
                month_static_ref                 : new MonthStaticRefFilter(),

                QQ_quarter_dynamic               : new QuarterDynamicFilter(),
                QQ_quarter_static                : new QuarterStaticFilter(),
                QQ_quarter_static_ref            : new QuarterStaticRefFilter(),

                QQ_YY_quarter_dynamic            : new QuarterDynamicFilter(),
                QQ_YY_quarter_static             : new QuarterStaticFilter(),
                QQ_YY_quarter_static_ref         : new QuarterStaticRefFilter(),

                quarter_dynamic                  : new QuarterDynamicFilter(),
                quarter_static                   : new QuarterStaticFilter(),
                quarter_static_ref               : new QuarterStaticRefFilter(),

                yyyy_year_dynamic                : yearDynamicFilter,
                yyyy_year_static                 : yearStaticFilter,
                yyyy_year_static_ref             : yearStaticRefFilter,

                year_dynamic                     : yearDynamicFilter,
                year_static                      : yearStaticFilter,
                year_static_ref                  : yearStaticRefFilter,

                hh_ii_hours_dynamic               : hhIIHourDynamicFilter,
                hh_ii_hours_static                : hhIIHourStaticFilter,
                hh_ii_hours_static_ref            : hhIIHourStaticRefFilter,

                hh_hours_dynamic                  : hhHourDynamicFilter,
                hh_hours_static                   : hhHourStaticFilter,
                hh_hours_static_ref               : hhHourStaticRefFilter,

                hours_dynamic                     : hhHourDynamicFilter,
                hours_static                      : hhHourStaticFilter,
                hours_static_ref                  : hhHourStaticRefFilter,

                ii_minute_dynamic                : minuteDynamicFilter,
                ii_minutes_static                : minuteStaticFilter,
                ii_minute_static_ref             : minuteStaticRefFilter,

                minute_dynamic                   : minuteDynamicFilter,
                minute_static                    : minuteStaticFilter,
                minute_static_ref                : minuteStaticRefFilter,

                dd_mm_dd_mm_seven_days_dynamic   : sevenDaysDynamicFilter,
                dd_mm_dd_mm_seven_days_static    : sevenDaysStaticFilter,
                dd_mm_dd_mm_seven_days_static_ref: sevenDaysStaticRefFilter,

                seven_days_dynamic               : sevenDaysDynamicFilter,
                seven_days_static                : sevenDaysStaticFilter,
                seven_days_static_ref            : sevenDaysStaticRefFilter
            ]
        }

        /**
         * Метод для получения фильтра по дате
         * @param groupType - тип группировки по дате
         * @param format - формат данных
         * @param value - значение
         * @param filterBuilder - текущий объект с фильтрацией
         * @param attr - атрибут
         * @return фильтр по дате
         */
        def getFilter(GroupType groupType, String format, String value,
                      def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            String providerKey = getProviderKey(groupType, format, attr)
            if (value == 'Не заполнено' || value == 'EMPTY')
            {
                if(providerKey.contains('static_ref'))
                {
                    def values = getValuesForRefAttr(attr, null)
                    checkValuesSize(values)
                    return filterBuilder.OR(attr.code, 'containsInSet', values)
                }
                else if(providerKey.contains('static'))
                {
                    return filterBuilder.OR(attr.code, 'null', null)
                }
            }
            def provider = filterProviders[providerKey]
            return provider.getFilter(format, value, filterBuilder, attr, classFqn, descriptor)
        }
    }

    abstract class WeekFilterProviderBase implements FilterProvider
    {
        Map<String, Integer> prepareValue(def value)
        {
            def weekValue = value.contains('-я')
                ? value.replace('-я', '').split()
                : value.replace(' неделя', '').split()
            def week = weekValue[0] as int
            def year = weekValue.size() > 1 ? weekValue[1] as int : null

            return [week: week, year: year]
        }
    }

    class WeekDynamicFilter extends WeekFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            def wrapper = new MainDateFilterProvider().getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause
            Map<String, Integer> valueMap = prepareValue(value)
            wrapper.totalValueCriteria.add(w.eq(s.week(s.property('value')), valueMap.week))
            if(valueMap.year)
            {
                wrapper.totalValueCriteria.add(w.eq(s.year(s.property('value')), valueMap.year))
            }
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }
    }

    class WeekStaticFilter extends WeekFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            Map<String, Integer> valueMap = prepareValue(value)
            def datePoint = valueMap.year ? date.createDateTimePointPredicates(['WEEK', valueMap.week, 'EQ'],
                                                                               ['YEAR', valueMap.year, 'EQ'])
                : date.createDateTimePointPredicates(['WEEK', valueMap.week, 'EQ'], ['WEEK', valueMap.week, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))
        }
    }

    class WeekStaticRefFilter extends WeekFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            def s = selectClause
            def w = whereClause
            def criteria = new MainDateFilterProvider().getCriteria(attr, classFqn, descriptor)

            Map<String, Integer> valueMap = prepareValue(value)
            criteria.add(w.eq(s.week(s.property(attr.attrChains().code.join('.'))), valueMap.week))
            if(valueMap.year)
            {
                criteria.add(w.eq(s.year(s.property(attr.attrChains().code.join('.'))), valueMap.year))
            }

            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }
    }


    abstract class MonthFilterProviderBase implements FilterProvider
    {
        Map<String, Object> prepareValue(def value)
        {
            def monthValue = value.split(' ')
            def month = MainDateFilterProvider.nominativeRussianMonth.get(monthValue[0]) + 1
            def year = monthValue.size() > 1 ? monthValue[1] as int : null

            return [month: month, year: year]
        }
    }

    class MonthDynamicFilter extends MonthFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            def wrapper = new MainDateFilterProvider().getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause
            Map<String, Object> valueMap = prepareValue(value)
            wrapper.totalValueCriteria.add(w.eq(s.month(s.property('value')), valueMap.month as int))
            if(valueMap.year)
            {
                wrapper.totalValueCriteria.add(w.eq(s.year(s.property('value')), valueMap.year as int))
            }
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }
    }

    class MonthStaticFilter extends MonthFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            Map<String, Object> valueMap = prepareValue(value)
            def datePoint = valueMap.year ? date.createDateTimePointPredicates(['MONTH', valueMap.month as int, 'EQ'],
                                                                               ['YEAR', valueMap.year, 'EQ'])
                : date.createDateTimePointPredicates(['MONTH', valueMap.month as int, 'EQ'], ['MONTH', valueMap.month as int, 'EQ'])
            return filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint)
        }
    }

    class MonthStaticRefFilter extends MonthFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            def s = selectClause
            def w = whereClause
            def criteria = new MainDateFilterProvider().getCriteria(attr, classFqn, descriptor)

            Map<String, Integer> valueMap = prepareValue(value)
            criteria.add(w.eq(s.month(s.property(attr.attrChains().code.join('.'))), valueMap.month))
            if(valueMap.year)
            {
                criteria.add(w.eq(s.year(s.property(attr.attrChains().code.join('.'))), valueMap.year))
            }
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }
    }

    abstract class QuarterFilterProviderBase implements FilterProvider
    {
        Map<String, Object> prepareValue(def value)
        {
            def quarterValue = value.replace(' кв-л', '').split(' ')
            def quarter = quarterValue[0] as int
            def year = quarterValue.size() > 1 ? quarterValue[1] as int : null

            return [quarter: quarter, year: year]
        }
    }

    class QuarterDynamicFilter extends QuarterFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr,
                      String classFqn, String descriptor)
        {
            def wrapper = new MainDateFilterProvider().getWrapperForDynamicAttr(attr, classFqn, descriptor)
            def w = whereClause
            def s = selectClause
            Map<String, Object>  valueMap = prepareValue(value)
            wrapper.totalValueCriteria.add(w.eq(s.quarter(s.property('value')), valueMap.quarter))
            if(valueMap.year)
            {
                wrapper.totalValueCriteria.add(w.eq(s.year(s.property('value')), valueMap.year))
            }
            def uuids = wrapper.getResult(true, DiagramType.TABLE, true, true).flatten()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR('totalValue', 'containsInSet', uuids))
        }
    }

    class QuarterStaticFilter extends QuarterFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr,
                      String classFqn, String descriptor)
        {
            Map<String, Object>  valueMap = prepareValue(value)
            def datePoint = valueMap.year ? date.createDateTimePointPredicates(['QUARTER', valueMap.quarter, 'EQ'],
                                                                               ['YEAR', valueMap.year as int, 'EQ'])
                : date.createDateTimePointPredicates(['QUARTER', valueMap.quarter, 'EQ'], ['QUARTER', valueMap.quarter, 'EQ'])
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'fromToDatePoint', datePoint))

        }
    }

    class QuarterStaticRefFilter extends QuarterFilterProviderBase
    {
        def getFilter(String format, String value, def filterBuilder, Attribute attr, String classFqn, String descriptor)
        {
            def s = selectClause
            def w = whereClause
            def criteria = new MainDateFilterProvider().getCriteria(attr, classFqn, descriptor)

            Map<String, Integer> valueMap = prepareValue(value)
            criteria.add(w.eq(s.quarter(s.property(attr.attrChains().code.join('.'))), valueMap.quarter))
            if(valueMap.year)
            {
                criteria.add(w.eq(s.year(s.property(attr.attrChains().code.join('.'))), valueMap.year))
            }
            def uuids = db.query(criteria).list()
            checkValuesSize(uuids)
            return filterBuilder.AND(filterBuilder.OR(attr.code, 'containsInSet', uuids))
        }
    }
}

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

    /**
     * перечень
     */
    private String subjectUUID

    /**
     * @param map - данные запроса
     * @param cardObjectUuid - UUID карточки объекта
     * @param metaInfo - метакласс объектов
     * @param utils - api для получения объектов
     * @param op - api для условий поиска
     */
    Link(GetLinkRequest map, String cardObjectUuid, def metaInfo, IScriptUtils utils, IScriptConditionsApi op)
    {
        this.subjectUUID = cardObjectUuid
        this.classFqn = map.classFqn
        this.title = map.title ?: "Список элементов '${ this.classFqn }'"
        if(map.groupCode)
        {
            this.attrGroup = map.groupCode
        }
        else
        {
            this.attrGroup = 'forDashboards' in metaInfo.getAttributeGroupCodes()
                ? 'forDashboards'
                : 'system'
        }
        this.descriptor = map.descriptor
        this.cases = map.cases as Collection
        this.attrCodes = map.attrCodes as Collection
        this.filters = mapper.convertValue(map.filters, new TypeReference<Collection<DrilldownFilter>>() {})
        this.diagramType = map.diagramTypeFromRequest
        this.template = metaInfo.attributes.find { it.code == 'dashboardTemp' }?.with {
            utils.findFirst(this.classFqn, [(it.code): op.isNotNull()])?.get(it.code)
        }
    }
}
