/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Бекенд для встроенного приложения "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль
package ru.naumen.modules.dashboards

import groovy.json.JsonSlurper
import groovy.transform.Canonical
import groovy.transform.Field
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.IDbApi
import ru.naumen.core.server.script.api.IListDataApi
import ru.naumen.core.server.script.api.IMetainfoApi
import ru.naumen.core.server.script.api.ISearchParams
import ru.naumen.core.server.script.api.IWebApi
import ru.naumen.core.server.script.api.ea.IEmbeddedApplicationsApi
import ru.naumen.core.server.script.api.metainfo.IAttributeGroupWrapper
import ru.naumen.core.server.script.api.metainfo.IMetaClassWrapper
import ru.naumen.core.server.script.spi.IScriptConditionsApi
import ru.naumen.core.server.script.spi.IScriptUtils
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.server.script.api.metainfo.IAttributeWrapper
import ru.naumen.core.shared.dto.ISDtObject
import ru.naumen.metainfo.shared.IClassFqn

import static groovy.json.JsonOutput.toJson
import static MessageProvider.*

@Field @Lazy @Delegate Dashboards dashboards = new DashboardsImpl(
    binding,
    new DashboardsService(api.utils, api.listdata, api.metainfo, api.web, api.apps, api.db, op, sp, new DashboardUtils(), logger)
)

interface Dashboards
{
    /**
     * Отдает список источников данных с детьми
     * @param classFqn код метакласса
     * @return json список источников данных {заголовок, код, дети}
     */
    String getDataSources()

    /**
     * Отдает список из источника для дашборда
     * @param dashboardUUID - уникальный идентификатор дашборда
     * @param user - текущий пользователь системы
     * @return json список из одного источника данных с дескриптором
     */
    String getDataSourcesForUser(String dashboardUUID, IUUIDIdentifiable user)

    /**
     * Отдает список атрибутов для источника данных
     * @param requestContent запрос с кодом метакласса и типами атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    @Deprecated
    String getAttributesDataSources(requestContent)

    /**
     * Отдает список атрибутов для источника данных
     * @param requestContent запрос с кодом метакласса и типами атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    String getDataSourceAttributes(requestContent)

    /**
     * Метод изменения атрибута в зависимости от изменения метакласса (попытка найти атрибут с таким же кодом в новом метаклассе)
     * @param requestContent - тело запроса - код метакласса,текущий атрибут
     * @return атрибут по выбранному металклассу или ничего, если атрибут не нашёлся
     */
    String getAttributeByCode(requestContent)

    /**
     * Отдает список атрибутов для источника данных
     * @param requestContent запрос с кодом метакласса и типами атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    String getDataSourceAttributesByGroupCode(requestContent)

    /**
     * Отдаёт список атрибутов метакласа ссылочного типа атрибута
     * @param requestContent - Запрос на получение атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    String getAttributesFromLinkAttribute(requestContent, IUUIDIdentifiable user)

    /**
     * Метод по получению объектов атридутов типа object
     * @param requestContent - Запрос на получение объектов атрибутов
     * @return json список объектов атрибутов
     */
    String getAttributeObject(Map requestContent)

    /**
     * Метод асинхронного поиска значения на всех уровнях
     * @param requestContent - тело запроса
     * @return объекты с таким значением
     */
    String searchValue(Map requestContent)

    /**
     * Метод по получению объектов атридутов типа catalog
     * @param requestContent - Запрос на получение объектов атрибутов
     * @return json список объектов атрибутов
     */
    String getCatalogObject(Map requestContent)

    /**
     * Метод по получению объектов атридутов типа CatalogItem
     * @param requestContent - Запрос на получение объектов атрибутов
     * @return json список объектов атрибутов
     */
    String getCatalogItemObject(Map requestContent)

    /**
     * Метод получения статусов объекта
     * @param classFqn - тип объекта
     * @return список статусов
     */
    String getStates(String classFqn)

    /**
     * Метод получения статусов объекта типа счётчик
     * @param classFqn - тип объекта
     * @return список статусов
     */
    String getTimerStatuses()

    /**
     * Метод получения метаклассов объекта
     * @param classFqn - тип объекта
     * @return список метаклассов
     */
    String getMetaClasses(String classFqn)

    /**
     * Метод получения динамических атрибутов
     * @param groupUUID - уникальный идентификатор группы
     * @return список динамических атрибутов в JSON-формате
     */
    String getDynamicAttributes(String groupUUID)

    /**
     * Метод получения групп динамических атрибутов
     * @param requestContent - [descriptor: дескриптор из виджета]
     * @return список групп динамических атрибутов
     */
    String getDynamicAttributeGroups(Map<String, Object> requestContent)

    /**
     * Метод получения групп динамических атрибутов для пользовательского дашборда
     * @param requestContent - [descriptor: дескриптор из виджета]
     * @return список групп динамических атрибутов
     */
    String getDynamicAttributeGroupsForUser(Map<String, Object> requestContent)

    /**
     * Метод получения связанных источников
     * @param requestContent - тело запроса
     * @return - список связанных источников
     */
    String getLinkedDataSources(requestContent)

    /**
     * Метод получения карточки объекта по UUID-у
     * @param requestContent - [value: значение объекта типа (значение - UUID)]
     * @return ссылка на карточку объекта в Json-формате
     */
    String getCardObject(Map<String, Object> requestContent)

    /**
     * Метод проверки, является ли первый источник родительским классом для другого
     * (для таблицы источники с 2 по n-й - ссылочные атрибуты первого)
     * @param parentClassFqn - код класса предполагаемого родительского источника
     * @param childClassFqn - код предполагаемого дочернего источника (атрибут первого)
     * @return флаг true/false в json-формате
     */
    String checkForParent(String parentClassFqn, String childClassFqn)

    /**
     * Метод формирования ссылки для перехода на дашборд
     * @param requestContent - тело запроса с полем dashboardCode - код дашборда целиком (fqn объекта, создавшего дб_uuid дашборда)
     * @param user - текущий пользователь
     * @return ссылка на на страницу с дашбордом в json-формате.
     */
    String getDashboardLink(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод получения данных атрибутов по группе атрибутов
     * @param classFqn - код класса источника
     * @param attrGroupCode - код группы атрибутов
     * @return список кодов атрибутов группы
     */
    String getNonMetadataAttributesData(String classFqn, String attrGroupCode)

    /**
     * Метод получения списка связанных между метаклассами атрибутов
     * @param parentClassFqn - код класса главного источника
     * @param classFqn - код класса нового источника
     * @return список связанных атрибутов
     */
    String getLinkedAttributes(String parentClassFqn, String classFqn)
}

@InheritConstructors
class DashboardsImpl extends BaseController implements Dashboards
{
    private final DashboardsService service

    DashboardsImpl(Binding binding, DashboardsService service)
    {
        super(binding)
        this.service = service
    }


    Object run()
    {
        return null
    }

    @Override
    String getDataSources()
    {
        return toJson(service.getDataSources())
    }

    @Override
    String getDataSourcesForUser(String dashboardUUID, IUUIDIdentifiable user)
    {
        return toJson(service.getDataSourcesForUser(dashboardUUID, user))
    }

    @Override
    @Deprecated
    String getAttributesDataSources(requestContent)
    {
        return toJson(service.getAttributesDataSources(requestContent))
    }

    @Override
    String getDataSourceAttributes(requestContent)
    {
        String classFqn = requestContent.classFqn
        String parentClassFqn = requestContent.parentClassFqn
        List<String> types = requestContent?.types
        return toJson(service.getDataSourceAttributes(classFqn, parentClassFqn, types))
    }

    @Override
    String getAttributeByCode(requestContent)
    {
        return toJson(service.getAttributeByCode(requestContent))
    }

    @Override
    String getDataSourceAttributesByGroupCode(requestContent)
    {
        return toJson(service.getDataSourceAttributesByGroupCode(requestContent))
    }

    @Override
    String getAttributesFromLinkAttribute(requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.getAttributesFromLinkAttribute(requestContent, user))
    }

    @Override
    String getAttributeObject(Map requestContent)
    {
        return toJson(service.getAttributeObject(requestContent))
    }

    @Override
    String searchValue(Map requestContent)
    {
        return toJson(service.searchValue(requestContent))
    }

    @Override
    String getCatalogObject(Map requestContent)
    {
        return toJson(service.getCatalogObject(requestContent))
    }

    @Override
    String getCatalogItemObject(Map requestContent)
    {
        return toJson(service.getCatalogItemObject(requestContent))
    }
    @Override
    String getStates(String classFqn)
    {
        return toJson(service.getStates(classFqn))
    }

    @Override
    String getTimerStatuses()
    {
        return toJson(service.getTimerStatuses())
    }

    @Override
    String getMetaClasses(String classFqn)
    {
        return toJson(service.getMetaClasses(classFqn))
    }

    @Override
    String getDynamicAttributes(String groupUUID)
    {
        return toJson(service.getDynamicAttributes(groupUUID))
    }

    @Override
    String getDynamicAttributeGroups(Map<String, Object> requestContent)
    {
        def descriptor = requestContent.descriptor
        return toJson(service.getDynamicAttributeGroups(descriptor))
    }

    @Override
    String getDynamicAttributeGroupsForUser(Map<String, Object> requestContent)
    {
        String descriptor = requestContent.descriptor
        return toJson(service.getDynamicAttributeGroupsForUser(descriptor))
    }

    @Override
    String getLinkedDataSources(requestContent)
    {
        String classFqn = requestContent.classFqn
        String parentClassFqn = requestContent.parentClassFqn
        List<String> types = requestContent?.types
        return toJson(service.getLinkedDataSources(classFqn, parentClassFqn, types))
    }

    @Override
    String getCardObject(Map<String, Object> requestContent)
    {
        String value = requestContent.value
        return toJson(service.getCardObject(value))
    }

    @Override
    String checkForParent(String parentClassFqn, String childClassFqn)
    {
        return toJson(service.checkForParent(parentClassFqn, childClassFqn))
    }

    @Override
    String getDashboardLink(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String dashboardCode = requestContent.dashboardCode
        String subjectUUID = requestContent.subjectUUID
        return toJson(service.getDashboardLink(dashboardCode, subjectUUID, user))
    }

    @Override
    String getNonMetadataAttributesData(String classFqn, String attrGroupCode)
    {
        return toJson(service.getNonMetadataAttributesData(classFqn, attrGroupCode))
    }

    @Override
    String getLinkedAttributes(String parentClassFqn, String classFqn)
    {
        return toJson(service.getLinkedAttributes(parentClassFqn, classFqn))
    }
}

class DashboardsService
{
    private final IScriptUtils utils
    private final IListDataApi listdata
    private final IMetainfoApi metainfo
    private final IWebApi web
    private final IEmbeddedApplicationsApi apps
    private final IDbApi db
    private final IScriptConditionsApi op
    private final ISearchParams sp
    private final DashboardUtils dashboardUtils
    private final logger

    DashboardsService(IScriptUtils utils,
                      IListDataApi listdata,
                      IMetainfoApi metainfo,
                      IWebApi web,
                      IEmbeddedApplicationsApi apps,
                      IDbApi db,
                      IScriptConditionsApi op,
                      ISearchParams sp,
                      DashboardUtils dashboardUtils,
                      def logger)
    {
        this.utils = utils
        this.listdata = listdata
        this.metainfo = metainfo
        this.web = web
        this.apps = apps
        this.db = db
        this.op = op
        this.sp = sp
        this.dashboardUtils = dashboardUtils
        this.logger = logger
    }

    private static final String MAIN_FQN = 'abstractBO'
    private static final String LC_PARENT_FQN = 'abstractSysObj'
    private static final String LC_FQN = 'abstractEvt'
    private static final String SOURCE_FILTER_ATTRIBUTE_GROUP = 'forDashAttrList'
    MessageProvider messageProvider = new MessageProvider(utils)

    /**
     * Отдает список источников данных с детьми
     * @param classFqn код метакласса
     * @return json список источников данных {заголовок, код, дети}
     */
    Collection<DataSource> getDataSources(classFqn = MAIN_FQN)
    {
        def children = getMetaClassChildren(classFqn as String)
        return children.collectMany {
            mappingDataSource(it, false)
        }
    }

    /**
     * Отдает список из источника для дашборда
     * @param dashboardUUID - уникальный идентификатор дашборда
     * @param user - текущий пользователь системы
     * @return json список из одного источника данных с дескриптором
     */
    Collection<DataSourceDescriptor> getDataSourcesForUser(String dashboardUUID, IUUIDIdentifiable user)
    {
        def dashboard = utils.get(dashboardUUID)
        def source = dashboard.dataSourceDash
        if(!source)
        {
            def currentUserLocale = dashboardUtils.getUserLocale(user?.UUID)
            String message = messageProvider.getConstant(SOURCE_NOT_FOUND_ERROR, currentUserLocale)
            utils.throwReadableException("$message#${SOURCE_NOT_FOUND_ERROR}")
        }
        def userUUID = user?.UUID ?: dashboard?.userReports?.UUID

        def descriptor = listdata.createListDescriptor(source.typeCode, source.code, userUUID)

        def definition = listdata.defineDescriptorAsJson()
                                 .filters()
                                 .complex().hide()
                                 .restriction().hide()

        Boolean anyOfDescriptorMetaClassesHasDynamicAttributes = descriptor.getFqns().any {
            checkForDynamicAttributes(it.toString())
        }

        // Из дескриптора по "clazz" и "cases" получается код метакласса.
        def listContent = descriptor.unwrap().content
        def clazz = listContent.clazz
        def cases = listContent.cases
        def totalSource = new DataSourceDescriptor(
            classFqn: clazz ?: cases?.find().toString().takeWhile { it != '$' },
            title: source.title,
            children: [],
            hasDynamic: anyOfDescriptorMetaClassesHasDynamicAttributes,
            descriptor: listdata.listDescriptorAsJson(descriptor, definition))
        return [totalSource]
    }

    /**
     * Отдает список атрибутов для источника данных
     * @param requestContent запрос с кодом метакласса и типами атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    @Deprecated
    Collection<Attribute> getAttributesDataSources(requestContent)
    {
        String classFqn = requestContent.classFqn.toString()
        List<String> types = requestContent?.types
        def metaInfo = metainfo.getMetaClass(classFqn)
        List attributes = types ? metaInfo?.attributes?.findResults {
            it.type.code in types ? it : null
        } : metaInfo?.attributes?.toList()
        return attributes
            ? mappingAttribute(attributes, metaInfo.title, metaInfo.code)
            : []
    }

    /**
     * Метод получения списка атрибутов по коду метакласса
     * @param classFqn - код метакласса
     * @param parentClassFqn - код родительского метакласса, если есть
     * @param types - список необходимых типов атрибутов
     * @return список атрибутов метакласса
     */
    Collection<Attribute> getDataSourceAttributes(String classFqn, String parentClassFqn, List<String> types)
    {
        def metaInfo = metainfo.getMetaClass(parentClassFqn ?: classFqn)
        def metaClassTypes = parentClassFqn ? [] : metainfo.getTypes(classFqn)
        String attributeTitle = ""
        if (parentClassFqn && parentClassFqn != classFqn)
        {
            //источником является ссылочный атрибут верхнего источника с кодом parentClassFqn
            def attribute = metaInfo?.getAttribute(classFqn)
            String relatedMetaClass = attribute?.type?.relatedMetaClass
            metaClassTypes = relatedMetaClass ? metainfo.getTypes(relatedMetaClass) : []
            metaInfo = relatedMetaClass ? metainfo.getMetaClass(relatedMetaClass) : metaInfo
            attributeTitle = attribute?.title
        }

        Collection<String> codesOfAddedAttributes = []
        def attributes = ([metaInfo] + metaClassTypes).collectMany { mc ->
            def attributes = types
                ? mc?.attributes?.findAll {!codesOfAddedAttributes.contains(it.code) && it.type.code in types && !isHiddenAttribute(it) ? it : null }
                : mc?.attributes?.findAll {!codesOfAddedAttributes.contains(it.code) }?.toList()

            codesOfAddedAttributes += attributes.collect { it.code }

            return attributes
                ? mappingAttribute(attributes, attributeTitle ?: mc.title, parentClassFqn ? classFqn : mc.code)
                : []
        }

        return getTimerAttributesWithValue(attributes)
    }

    /**
     * Метод получения списка атрибутов с добавленными атрибутами типа счетчик с пометкой на получение значений по атрибуту
     * @param attributes - текущий список атрибутов
     * @return список атрибутов с добавленными атрибутами типа счетчик с пометкой на получение значений по атрибуту
     */
    private Collection<Attribute> getTimerAttributesWithValue(Collection<Attribute> attributes)
    {
        Collection<Attribute> timerAttributesWithValue = []
        attributes.each {
            if (it.type == AttributeType.TIMER_TYPE)
            {
                it.timerValue = TimerValue.STATUS
                def timerAttributeWithValue = it.deepClone()
                timerAttributeWithValue.timerValue = TimerValue.VALUE
                timerAttributesWithValue << timerAttributeWithValue
            }
        }
        return (attributes + timerAttributesWithValue).sort { it.title }
    }

    /**
     * Метод изменения атрибута в зависимости от изменения метакласса (попытка найти атрибут с таким же кодом в новом метаклассе)
     * @param requestContent - тело запроса - код метакласса,текущий атрибут
     * @return атрибут по выбранному металклассу или ничего, если атрибут не нашёлся
     */
    Attribute getAttributeByCode(def requestContent)
    {
        String classFqn = requestContent.classFqn
        Attribute currentAttribute = requestContent.attribute

        if (currentAttribute.metaClassFqn != classFqn)
        {
            if(metainfo.checkAttributeExisting(classFqn, currentAttribute.code).isEmpty())
            {
                def metainfo = metainfo.getMetaClass(classFqn)
                def attrByClassFqn = metainfo.getAttribute(currentAttribute.code)
                def attrRef = currentAttribute.ref
                Boolean ableForAvg = DashboardUtils.checkIfAbleForAvg(classFqn, currentAttribute.code, currentAttribute.type)
                currentAttribute = buildAttribute(attrByClassFqn, metainfo.title, classFqn, ableForAvg)
                if(attrRef)
                {
                    attrRef.ableForAvg = DashboardUtils.checkIfAbleForAvg(attrRef.sourceCode, attrRef.code, attrRef.type)
                    currentAttribute.ref = attrRef
                }
            }
            else
            {
                return null
            }
        }
        return currentAttribute
    }

    /**
     * Метод для получения атрибутов по коду группы
     * @param requestContent - тело запроса [classFqn: код метакласса,groupCode: код группы, cases: код типов метакласса]
     * @return список атрибутов по группе
     */
    Collection<Attribute> getDataSourceAttributesByGroupCode(def requestContent)
    {
        String classFqn = requestContent.classFqn
        String groupCode = requestContent.attrGroupCode
        List<String> cases = requestContent.cases
        List listOfSystemAttribute = []
        def mainMetaClass = classFqn ? metainfo.getMetaClass(classFqn) : null

        if(cases)
        {
            cases = cases.findResults { clazz -> return metainfo.getMetaClass(clazz) }
        }
        else
        {
            if(classFqn)
            {
                cases = [metainfo.getMetaClass(classFqn)] + metainfo.getTypes(classFqn)
            }
        }

        cases?.each { metainfo ->
            Collection systemAttributes = getSystemAttributesByGroupCode(metainfo, groupCode)
            if (systemAttributes)
            {
                listOfSystemAttribute.addAll(systemAttributes)
            }
        }

        def attrs = listOfSystemAttribute?.unique { it?.code }?.findResults {
            Boolean attrInMainClass = classFqn ? metainfo.checkAttributeExisting(classFqn, it.code).isEmpty() : false
            if (!it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES && !isHiddenAttribute(it))
            {
                Boolean ableForAvg = DashboardUtils.checkIfAbleForAvg(attrInMainClass ? classFqn : it.metaClass.code, it.code, it.type.code)
                return buildAttribute(it, attrInMainClass ? mainMetaClass.title : it.metaClass.title, attrInMainClass ? classFqn : it.metaClass.code, ableForAvg)
            }
        }
        if(!attrs.any {it.code == 'UUID'})
        {
            def UUIDAttr = metainfo.getMetaClass(classFqn).getAttribute('UUID')
            Boolean ableForAvg = DashboardUtils.checkIfAbleForAvg(classFqn, UUIDAttr.code, UUIDAttr.type.code)
            UUIDAttr = buildAttribute(UUIDAttr, mainMetaClass.title, classFqn, ableForAvg)
            attrs += UUIDAttr
        }

        attrs = getTimerAttributesWithValue(attrs)
        replaceAttributesTitleForMainMetaClass(attrs, classFqn)
        return attrs
    }

    /**
     * Метод замены названия атрибута в случае, если оно изменено в дочерних метаклассах
     * @param attributes - список атрибутов
     * @param mainClassFqn - код главного метакласса
     */
    void replaceAttributesTitleForMainMetaClass(Collection<Attribute> attributes, String mainClassFqn)
    {
        Collection<IAttributeWrapper> mainMetaClassAttributes = metainfo.getMetaClass(mainClassFqn)?.attributes
        if (mainMetaClassAttributes)
        {
            attributes.each { attribute ->
                IAttributeWrapper mainMetaClassAttribute = mainMetaClassAttributes.find { it.code == attribute.code }
                if (mainMetaClassAttribute)
                {
                    attribute.title = mainMetaClassAttribute.title
                }
            }
        }
    }

    /**
     * Отдаёт список атрибутов метакласа ссылочного типа атрибута
     * @param requestContent - Запрос на получение атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    List<Attribute> getAttributesFromLinkAttribute(requestContent, IUUIDIdentifiable user)
    {
        def linkAttribute = requestContent.attribute as Map
        String attributeType = linkAttribute.type
        if (!(attributeType in AttributeType.LINK_TYPES))
        {
            def currentUserLocale = dashboardUtils.getUserLocale(user?.UUID)
            String message = messageProvider.getMessage(NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR, currentUserLocale, attributeType: attributeType)
            utils.throwReadableException("$message#${NOT_SUPPORTED_ATTRIBUTE_TYPE_ERROR}")
        }

        String attributeClassFqn = linkAttribute.property
        boolean deep = requestContent?.deep
        List<String> types = requestContent?.types ?: AttributeType.ALL_ATTRIBUTE_TYPES

        def metaInfo = metainfo.getMetaClass(attributeClassFqn)
        List attributeTypes = linkAttribute.metaClassFqn && linkAttribute.metaClassFqn != AttributeType.TOTAL_VALUE_TYPE
            ? getPermittedTypes(metainfo.getMetaClass(linkAttribute.metaClassFqn), linkAttribute.code)?.toList()
            : []
        List metaInfos = attributeTypes?.collect { metainfo.getMetaClass(it.toString()) }

        if (attributeClassFqn == AttributeType.TOTAL_VALUE_TYPE)
        {
            String metaClass = utils.get(TotalValueMarshaller.unmarshal(linkAttribute.code).last()).metaClass.toString()
            metaInfo = metainfo.getMetaClass(metaClass)
        }

        List<String> codesOfAddedAttributes = []
        Collection<Attribute> result = [metaInfo, *metaInfos].collectMany { meta ->
            return meta ? meta.attributes.findResults {
                if(!codesOfAddedAttributes.contains(it.code) && !it.computable && it.type.code in types && !isHiddenAttribute(it))
                {
                    Boolean ableForAvg = DashboardUtils.checkIfAbleForAvg(meta.code, it.code, it.type.code)
                    codesOfAddedAttributes << it.code
                    return buildAttribute(it, metaInfo.title, metaInfo.code, ableForAvg)
                }
            } : []
        }.sort { it.title }

        if (deep)
        {
            List childrenClasses = metainfo.getTypes(attributeClassFqn)?.toList()

            Collection<Attribute> attributeList = []
            childrenClasses.each {
                def metainfo = metainfo.getMetaClass(it)
                def attributes = metainfo?.attributes
                attributeList += attributes
                    ? attributes.findResults {
                    if (!(it.code in result*.code) &&
                        !(it.code in attributeList*.code) &&
                        !it.computable && it.type.code in types &&
                        !isHiddenAttribute(it))
                    {
                        Boolean ableForAvg = DashboardUtils.checkIfAbleForAvg(metaInfo.code, it.code, it.type.code)
                        return buildAttribute(it, metaInfo.title, metaInfo.code, ableForAvg)
                    }
                }
                    : []
            }
            result += attributeList
            result.sort {
                it.title
            }
        }
        return getTimerAttributesWithValue(result)
    }

    /**
     * Метод по получению объектов атрибутов
     * @param requestContent - Запрос на получение объектов атрибутов
     * @return список объектов атрибутов
     */
    List<Map> getAttributeObject(Map requestContent)
    {
        String uuid = requestContent.parentUUID
        boolean removed = requestContent.removed
        String sourceCode = requestContent.sourceCode
        def attr =  new Attribute(requestContent.attribute)
        String attributeCode = requestContent.attribute.code
        def metaClass = metainfo.getMetaClass(sourceCode)
        Boolean attrIsDynamic = attr.metaClassFqn.contains(AttributeType.TOTAL_VALUE_TYPE)
        Set types
        if (attr.ref)
        {
            String firstAttributeCode = attr.code
            //на последнем месте стоит нужный нам атрибут
            String lastAttributeCode = attr.attrChains().last().code
            types = getPermittedTypes(metaClass, firstAttributeCode).toList()
            def metaClasses = types.collect { metainfo.getMetaClass(it) }
            //по последнему атрибуту берем правильные типы дял получения данных
            types = metaClasses.collectMany {getPermittedTypes(it, lastAttributeCode).toList()}
        }
        else
        {
            //получили списки типов
            types = attrIsDynamic
                ? getPermittedTypes(metaClass, AttributeType.TOTAL_VALUE_TYPE).toList()
                : getPermittedTypes(metaClass, attributeCode).toList()
        }
        def count = attrIsDynamic ? 20 : requestContent.count as int
        def offset = attrIsDynamic ? 0 : requestContent.offset as int
        def condition = removed ? [:] : [removed: false]
        if(attrIsDynamic)
        {
            condition.put('linkTemplate', TotalValueMarshaller.unmarshal(attributeCode).last())
        }
        //на первом месте стоит тип, по которому будет поиск значений
        def intermediateData = types.collectMany {classFqn -> getTop(classFqn.toString(), condition) }.unique { it.find() }
        if(uuid)
        {
            types += intermediateData*.get(0).findResults {metainfo.getMetaClass(it)?.fqn}
        }
        List values = uuid
            ? types.collectMany { classFqn -> utils.find(classFqn, condition + [parent: uuid]) }.unique { it?.UUID }
            : getObjects(intermediateData, count, offset)

        if(attrIsDynamic)
        {
            if( attr.type in AttributeType.LINK_SET_TYPES)
            {
                values = values.collectMany {it.value}.unique { it.UUID }
            }
            else
            {
                values = values.value
            }
        }

        types = uuid ? types : intermediateData*.find()
        if(attrIsDynamic)
        {
            def trueCount = requestContent.count as int
            def trueOffset = requestContent.offset as int
            values = DashboardDataSetService.instance.sliceCollection(values,
                                                                      new PaginationSettings(pageSize:trueCount,
                                                                                             firstElementIndex:trueOffset))
        }

        return values?.collect { object ->
            [
                title   : object.title,
                uuid    : object.UUID,
                property: object.metaClass as String,
                children: metainfo.getMetaClass(object.metaClass.id).hasAttribute('parent')
                    ? types.sum { attrIsDynamic && !metainfo.getMetaClass(it.toString()).hasAttribute('parent')
                    ? utils.count(object.metaClass.id, [parent: object.UUID]) as int
                    : utils.count(it, [parent: object.UUID]) as int }
                    : 0
            ]
        }
    }

    /**
     * Метод асинхронного поиска значения на всех уровнях
     * @param requestContent - тело запроса
     * @return объекты с таким значением
     */
    List searchValue(Map requestContent)
    {
        String sourceCode = requestContent.sourceCode
        String attributeCode = requestContent.attribute.code
        def value = requestContent.value
        Boolean removed = requestContent.removed ?: false

        def attr =  new Attribute(requestContent.attribute)
        Boolean attrIsDynamic = attr.metaClassFqn.contains(AttributeType.TOTAL_VALUE_TYPE)
        def metaClass = metainfo.getMetaClass(sourceCode)
        def types
        if (attr.ref)
        {
            String firstAttributeCode = attr.code
            //на последнем месте стоит нужный нам атрибут
            String lastAttributeCode = attr.attrChains().last().code
            types = getPermittedTypes(metaClass, firstAttributeCode).toList()
            def metaClasses = types.collect { metainfo.getMetaClass(it) }
            //по последнему атрибуту берем правильные типы дял получения данных
            types = metaClasses.collectMany { getPermittedTypes(it, lastAttributeCode) }.collectMany { classFqn ->
                return getPossibleParentTypes(metainfo.getMetaClass(classFqn))
            }.unique { it.getFqn()}
        }
        else
        {
            //получили списки типов
            types = attrIsDynamic
                ? getPermittedTypes(metaClass, AttributeType.TOTAL_VALUE_TYPE)
                : getPermittedTypes(metaClass, attributeCode).collectMany { classFqn ->
                return getPossibleParentTypes(metainfo.getMetaClass(classFqn))
            }.unique { it.getFqn()}
        }
        def bottomValues
        if(attrIsDynamic)
        {
            def condition = removed
                ? [:]
                : [removed: false, linkTemplate: TotalValueMarshaller.unmarshal(attributeCode).last()]
            //на первом месте стоит тип, по которому будет поиск значений

            bottomValues = types.collectMany { classFqn ->utils.find(classFqn.toString(), condition) }
            if( attr.type in AttributeType.LINK_SET_TYPES)
            {
                bottomValues = bottomValues.collectMany { it.value }.unique { it.UUID }.findAll {it.title.contains(value)}
            }
            else
            {
                bottomValues = bottomValues.value.findAll {it.title.contains(value)}
            }
        }
        else
        {
            def condition = removed ? [:] : [removed: false]
            bottomValues = types.collectMany {
                utils.find(it.toString(), [title: op.like("%${value}%")] + condition, sp.ignoreCase())
            }.unique { it.UUID }
        }
        def withParentsBottoms = []
        def independentBottoms = []

        def childrenInBottomValues = []
        bottomValues.each { bottom ->
            Boolean bottomClassHasParent = metainfo.getMetaClass(bottom.metaClass.id).hasAttribute('parent')
            def parents = bottomClassHasParent && !attrIsDynamic ? getParents(bottom) : []
            if(parents)
            {
                //если в списке есть ближайший родитель объекта, значит, объект появится в списке в любом случае, его можно убрать,чтобы избежать повторного построения списка
                if(bottom.parent in bottomValues)
                {
                    childrenInBottomValues << bottom
                }
                else
                {
                    withParentsBottoms << (parents + bottom)
                }
            }
            else
            {
                independentBottoms << basicMap(bottom, bottomClassHasParent ? getChildrenTree(bottom, childrenInBottomValues, sourceCode) : [])
            }
        }

        withParentsBottoms = withParentsBottoms.groupBy { it[0..-2] }.collect { parentSet, both ->
            def childrenList = both*.last().flatten().collect { child ->
                return basicMap(child,
                                getChildrenTree(child, childrenInBottomValues, sourceCode),
                                sourceCode)
            }
            parentSet.each { bottomParent ->
                childrenList = basicMap(bottomParent, childrenList instanceof Collection ? childrenList : [childrenList])
            }
            return childrenList
        }
        def totalBottoms = independentBottoms + withParentsBottoms

        def repeateableLists = totalBottoms.findAll {tempBottom -> totalBottoms.count {it.uuid == tempBottom.uuid} > 1}.groupBy { it.uuid }

        def keysToDelete = repeateableLists.keySet()
        totalBottoms.removeIf {it.uuid in keysToDelete}

        totalBottoms += repeateableLists.collect { k, rep ->
            //здесь важно получить начало списка - с какого элемента будут отображены все дети
            def base = rep[0]
            def children = rep*.children
            base.children = getChildrenList(children)
            return base
        }

        return totalBottoms
    }

    /**
     * Метод получения "цельного" списка детей на всех уровнях
     * @param notToChangeChildren - списки детей с разными детьми на разных уровнях, но одним родителем
     * @return итоговый список всех детей для одного родителя
     */
    def getChildrenList(def notToChangeChildren)
    {
        if(notToChangeChildren)
        {
            def children = notToChangeChildren.collect {
                return it.collect { return [*:it] }
            }

            def tempChildren = children.collect {
                return it.collect { return [*:it] }
            }

            def firstLevel = children.collect {
                if(it)
                {
                    def withChildren = it.findAll { it.children }
                    it -= withChildren
                    withChildren.each {it.children = [] }
                    it+= withChildren
                }
                return it
            }.unique()

            //сформировали уровень
            def currentChildren = firstLevel.flatten()
            return currentChildren.findResults { tempParent ->
                def possibleChildren = getChildrenList(tempChildren.findAll{tempParent.uuid in it.uuid }.collectMany {it.children})
                if(possibleChildren)
                {
                    tempParent.children = possibleChildren
                }
                return tempParent
            }
        }
        return []
    }

    /**
     * Метод по получению объектов атридутов типа catalog
     * @param requestContent - Запрос на получение объектов атрибутов
     * @return список объектов атрибутов
     */
    List<Map> getCatalogObject(Map requestContent)
    {
        String uuid = requestContent.parentUUID
        String classFqn = requestContent.property
        def count = requestContent.count
        def offset = requestContent.offset
        boolean removed = requestContent.removed

        def removeCondition = removed != null ? [removed: removed as boolean] : [:]
        def parentCondition = uuid ? [parent: uuid] : [parent: op.isNull()]

        //C каталогами не будет такой свистопляски в наследовании как с объектами BO
        // наследорвание тут происходит в пределах одного класса
        def searchParameter = sp.createInstance()
        count?.with {
            searchParameter.limit(it as int)
        }
        offset?.with {
            searchParameter.offset(offset as int)
        }
        return getAllCatalogValues(utils.find(classFqn, removeCondition + parentCondition, searchParameter),
                                   classFqn,
                                   removeCondition)
    }

    /**
     * Метод по получению объектов атридутов типа CatalogItem
     * @param requestContent - Запрос на получение объектов атрибутов
     * @return json список объектов атрибутов
     */
    List<Map> getCatalogItemObject(Map requestContent)
    {
        String uuid = requestContent.parentUUID
        String classFqn = requestContent.property
        def count = requestContent.count
        def offset = requestContent.offset
        boolean removed = requestContent.removed

        def removeCondition = removed != null ? [removed: removed as boolean] : [:]
        def parentCondition = uuid ? [parent: uuid] : [parent: op.isNull()]

        def searchParameter = sp.createInstance()
        count?.with {
            searchParameter.limit(it as int)
        }
        offset?.with {
            searchParameter.offset(offset as int)
        }

        return getAllCatalogValues(utils.find(classFqn, removeCondition + parentCondition, searchParameter),
                                   classFqn,
                                   removeCondition)
    }

    /**
     * Метод получения статусов объекта
     * @param classFqn - тип объекта
     * @return список статусов
     */
    List<Map> getStates(String classFqn)
    {
        classFqn -= '__Evt'
        def types = [metainfo.getMetaClass(classFqn)] + metainfo.getTypes(classFqn)
        def states = []
        types.each { type ->
            type?.workflow
                ?.states
                ?.sort { it.title }
                ?.each {
                    def title = it.title
                    def code = it.code
                    Boolean sameTitle = states.any { it?.baseTitle == title }
                    Boolean sameCode = states.any { it?.uuid == code }
                    Boolean toAdd = !(sameTitle && sameCode)
                    if (toAdd)
                    {
                        if (sameTitle && !sameCode)
                        {
                            title = "${it.title} (${type.title})"
                        }

                        if (!sameTitle && sameCode)
                        {
                            title = "${it.title} (${type.title})"
                        }

                        states << [title: title, uuid: code, baseTitle: it.title]
                    }
                } ?: []
        }
        states.sort {
            it.title
        }*.remove('baseTitle')
        return states
    }

    List<Map> getTimerStatuses()
    {
        return ru.naumen.core.shared.timer.Status.values().collect {
            [title: it.name(), uuid: it.code]
        }
    }

    /**
     * Метод получения метаклассов объекта
     * @param classFqn - тип объекта
     * @return список метаклассов
     */
    List<Map> getMetaClasses(String classFqn)
    {
        return metainfo.getMetaClass(classFqn)
                       ?.with(this.&getChildrenMetaClass)
                       ?.flatten()
                       ?.collect {
                           [title: it.title, uuid: it.code]
                       } ?: []
    }

    /**
     * Метод получения динамических атрибутов
     * @param groupUUID - уникальный идентификатор группы
     * @return список динамических атрибутов в JSON-формате
     */
    List<Attribute> getDynamicAttributes(String groupUUID)
    {
        List<String> templateUUIDS = getUUIDSForTemplates(groupUUID)
        templateUUIDS = getActiveTemplateUUIDS(templateUUIDS)
        Collection<Attribute> attributes = templateUUIDS?.collect { templateUUID ->
            def type = getDynamicAttributeType(templateUUID)
            return type ? new Attribute(
                code: "${AttributeType.TOTAL_VALUE_TYPE}_${templateUUID}",
                title: utils.get(templateUUID).title,
                type: type,
                property: AttributeType.TOTAL_VALUE_TYPE,
                metaClassFqn: AttributeType.TOTAL_VALUE_TYPE,
                sourceName: utils.get(groupUUID).title,
                sourceCode: groupUUID,
                ableForAvg: type in [*AttributeType.NUMBER_TYPES, AttributeType.DT_INTERVAL_TYPE]
            ) : null
        }?.grep().toList()

        return getTimerAttributesWithValue(attributes)
    }

    /**
     * Метод получения групп динамических атрибутов
     * @param descriptor - дескриптор из виджета
     * @param aggregateToJson - флаг возврата данных в JSON-формате
     * @return список групп динамических атрибутов
     */
    List<DynamicGroup> getDynamicAttributeGroups(def descriptor)
    {
        def slurper = new groovy.json.JsonSlurper()
        descriptor = slurper.parseText(descriptor)
        List descriptorGroupsData = getDescriptorGroupsData(descriptor)
        return descriptorGroupsData?.collect {
            def dynamicSource = getDynamicGroupSource(it.group)
            def templateUUIDS = getUUIDSForTemplates(it.group.UUID)
            templateUUIDS = getActiveTemplateUUIDS(templateUUIDS)
            boolean anyAttributes = templateUUIDS.any { getDynamicAttributeType(it) }
            if (dynamicSource && anyAttributes) {
                return new DynamicGroup(
                    code: it.group.UUID,
                    title: "${it.group.title} (${it.title})"
                )
            }
        }?.grep()?.toList()
    }

    /**
     * Метод получения групп динамических атрибутов для пользовательского дашборда
     * @param descriptor - дескриптор из виджета
     * @param aggregateToJson - флаг возврата данных в JSON-формате
     * @return список групп динамических атрибутов
     */
    List<DynamicGroup> getDynamicAttributeGroupsForUser(String descriptor)
    {
        JsonSlurper slurper = new JsonSlurper()
        descriptor = slurper.parseText(descriptor)
        List descriptorGroupsData = getDynamicAttributeGroupsDataForUser(descriptor)
        List<DynamicGroup> result = descriptorGroupsData?.collect {
            Map<String, Object> dynamicSource = getDynamicGroupSource(it.group)
            List<String> templateUUIDS = getUUIDSForTemplates(it.group.UUID)
            templateUUIDS = getActiveTemplateUUIDS(templateUUIDS)
            boolean hasAnyAttributes = templateUUIDS.any { getDynamicAttributeType(it) }
            if (dynamicSource && hasAnyAttributes)
            {
                return new DynamicGroup(
                    code: it.group.UUID,
                    title: "${ it.group.title } (${ it.title })"
                )
            }
        }?.grep()?.toList()
        return result
    }

    /**
     * Метод получения связанных источников
     * @param classFqn - код метакласса
     * @param parentClassFqn - код родительского метакласса, если есть
     * @param types - список типов
     * @return - список связанных источников
     */
    Collection<DataSource> getLinkedDataSources(String classFqn, String parentClassFqn, List<String> types)
    {
        def linkAttributes = getDataSourceAttributes(classFqn, parentClassFqn, types)
        return mappingDataSource(linkAttributes, true).unique { it.classFqn }
    }

    /**
     * Метод получения карточки объекта по UUID-у
     * @param value - значение объекта типа (значение - UUID)
     * @return ссылка на карточку объекта в Json-формате
     */
    Map getCardObject(String value)
    {
        if (value && ObjectMarshaller.unmarshal(value).size() > 1)
        {
            String objectUUID = ObjectMarshaller.unmarshal(value).last()
            def link = web.open(objectUUID)
            return [link: link]
        }
    }

    /**
     * Метод проверки, является ли первый источник родительским классом для другого
     * (для таблицы источники с 2 по n-й - ссылочные атрибуты первого)
     * @param parentClassFqn - код класса предполагаемого родительского источника
     * @param childClassFqn - код предполагаемого дочернего источника (атрибут первого)
     * @return флаг true/false в json-формате
     */
    Map checkForParent(String parentClassFqn, String childClassFqn)
    {
        //n+1-й источник может быть такой же, как и первый
        //при проверке методом checkAttributeExisting вернётся пустая строка, если атрибут есть, или сообщение об ошибке
        Boolean isParent = parentClassFqn == childClassFqn || metainfo.checkAttributeExisting(parentClassFqn, childClassFqn).isEmpty()
        return [result : isParent]
    }

    /**
     * Метод формирования ссылки для перехода на дашборд
     * @param dashboardCode - код дашборда целиком (fqn объекта, создавшего дб_uuid дашборда)
     * @param user - текущий пользователь
     * @param subjectUUID - uuid объекта текущего дашборда
     * @return ссылка на на страницу с дашбордом в json-формате.
     */
    Map getDashboardLink(String dashboardCode, String subjectUUID, IUUIDIdentifiable user)
    {
        def root = utils.findFirst('root', [:])
        if (root.hasProperty('dashboardCode') && root.dashboardCode)
        {
            def appCode = root.dashboardCode
            def(subjectFqn, dashboardUUID) = DashboardCodeMarshaller.unmarshal(dashboardCode)

            def db = apps.listContents(appCode).find {
                it.contentUuid == dashboardUUID && it.subjectFqn == subjectFqn
            }

            def currentDashboardSubjectFqn = utils.get(subjectUUID)?.metaClass as String
            String objUUID
            if (currentDashboardSubjectFqn == subjectFqn)
            {
                objUUID = subjectUUID
            }
            else if (user && user.metaClass?.toString() == subjectFqn)
            {
                objUUID = user.UUID
            }
            else
            {
                objUUID = utils.findFirst(subjectFqn, ['removed': false]).UUID
            }

            def webApi = web
            def link
            if (webApi.metaClass.respondsTo(webApi, 'openContent'))
            {
                link = webApi.openContent(objUUID, db.tabUuid, db.contentUuid)
            }
            else
            {
                link = webApi.openTab(objUUID, db.tabUuid).replace('?anchor=', '#')
            }
            return [link: link]
        }
        def currentUserLocale = dashboardUtils.getUserLocale(user?.UUID)
        String message = messageProvider.getConstant(EMPTY_DASHBOARD_CODE_ERROR, currentUserLocale)
        utils.throwReadableException("$message#${EMPTY_DASHBOARD_CODE_ERROR}")
    }

    /**
     * Метод получения данных атрибутов по группе атрибутов
     * @param classFqn - код класса источника
     * @param attrGroupCode - код группы атрибутов
     * @return список кодов атрибутов группы
     */
    List<Map> getNonMetadataAttributesData(String classFqn, String attrGroupCode = null)
    {
        IMetaClassWrapper metaClass = metainfo.getMetaClass(classFqn)
        Collection<IAttributeWrapper> attributes

        if (attrGroupCode)
        {
            IAttributeGroupWrapper attributeGroup = metaClass.getAttributeGroup(attrGroupCode)
            attributes = attributeGroup.attributes
        }
        else
        {
            attributes = metaClass.attributes
        }

        attributes = attributes.findResults {
            IAttributeWrapper attribute = null

            Boolean hasMetadataTag = it.tags?.any { it.code == 'Metadata' }
            if (!hasMetadataTag)
            {
                attribute = it
            }
            return attribute
        }

        List<Map> attributesData = attributes.collect {
            String[] attributeFqnSplitData = it.attributeFqn.toString().split('@')
            Map attributeData = [
                'metaClassCode': attributeFqnSplitData[0],
                'attributeCode': attributeFqnSplitData[1]
            ]
            return attributeData
        }

        return attributesData
    }

    /**
     * Метод получения списка связанных между метаклассами атрибутов
     * @param parentClassFqn - код класса главного источника
     * @param classFqn - код класса нового источника
     * @return список связанных атрибутов
     */
    Collection<Attribute> getLinkedAttributes(String parentClassFqn, String classFqn)
    {
        IMetaClassWrapper metaClass = metainfo.getMetaClass(parentClassFqn)

        List<IAttributeWrapper> platformAttributes = metaClass.attributes.findAll {
            return it.type.code in [AttributeType.OBJECT_TYPE, AttributeType.BACK_BO_LINKS_TYPE, AttributeType.BO_LINKS_TYPE] &&
                   it.type.relatedMetaClass?.code == classFqn
        }

        return mappingAttribute(platformAttributes, null, parentClassFqn)
    }

    /**
     * Метод для определения скрытого атрибута
     * @param attribute
     * @return скрывать атрибут или нет
     */
    private Boolean isHiddenAttribute(def attribute)
    {
        return attribute.tags?.any { attribute.code == 'Metadata' }
    }

    /**
     * Метод получения атрибутов по коду группы из метакласса
     * @param metainfo - объект метакласса
     * @param groupCode - код группы
     * @return атрибуты по коду группы
     */
    private def getSystemAttributesByGroupCode(def metainfo, String groupCode)
    {
        try
        {
            return metainfo?.getAttributeGroup(groupCode)?.attributes
        }
        catch (Exception ex)
        {
            logger.error("В ${metainfo.title} нет группы атрибутов с кодом ${groupCode}.")
        }
    }

    /**
     * Метод по получению типов и класса атрибута из метакласса источника
     * @param mc - метакласс источника
     * @param attrCode - код атрибута
     * @return список типов и класса атрибута
     */
    private Set getPermittedTypes(def mc, String attrCode)
    {
        def attr = mc.getAttribute(attrCode)
        if (attr in IAttributeWrapper)
        {
            attr = attr.@attribute
        }

        def result = attr?.permittedTypesCache
        if (result)
        {
            return result
        }
        return attr?.type?.permittedTypes
    }

    /**
     * Метод получения данных справочника по всем уровням
     * @param firstLevelValues - значения первого уровня
     * @param classFqn - тип объекта
     * @param removeCondition - условие удаления
     * @return многоуровневый список значений [title: ..., uuid: ..., children:...]
     */
    private List<Map> getAllCatalogValues(def firstLevelValues, String classFqn, def removeCondition)
    {
        return firstLevelValues.collect { el ->
            [
                title   : el.title,
                uuid    : el.UUID,
                children: getAllCatalogValues(utils.find(classFqn, removeCondition + [parent: el.UUID]),
                                              classFqn,
                                              removeCondition)
            ]
        }
    }

    /**
     * Метод, возвращающий всех "родителей" объекта
     * @param bottom - объект "на дне"
     * @return - список всех "родителей"
     */
    private def getParents(def bottom)
    {
        def parentList = []
        while(bottom?.parent)
        {
            parentList += bottom.parent
            bottom = bottom.parent
        }
        return parentList
    }

    /**
     * Метод по получению детей из полученного списка
     * @param parent - текущий родитель
     * @param bottomValuesWithChildren - значения из списка с возмодными детьми
     * @param fqn - класс родителя
     * @return мапа с детьми по всем уровням из найденных
     */
    private def getChildrenTree(def parent, List bottomValuesWithChildren, String fqn)
    {
        def children = bottomValuesWithChildren.findAll { it.parent == parent }
        bottomValuesWithChildren -= children
        return children.collect {
            return basicMap(it, getChildrenTree(it, bottomValuesWithChildren, fqn), fqn)
        }
    }

    /**
     * Метод формирования стандартной мапы
     * @param title - название для мапы
     * @param uuid - uuid для мапы
     * @param property - property для мапы
     * @param children - дети
     * @return базовая мапа
     */
    private Map basicMap(def value, def children = [], String fqn = '')
    {
        Map map = [
            title   : value.title,
            uuid    : value.UUID,
            property: value.metaClass.toString()
        ]
        if(fqn && !children)
        {
            map.putAll(hasChildren: checkForChildren(value))
        }
        else
        {
            map.putAll(children: children)
        }
        return map
    }

    /**
     * Метод проверки наличия детей у значения
     * @param value - значение
     * @return флаг на наличие
     */
    private Boolean checkForChildren(def value)
    {
        def classFqn = value.metaClass.id
        def hasParents = metainfo.getMetaClass(classFqn).hasAttribute('parent')
        def fqnsToCount = []

        if(hasParents && classFqn != 'employee')
        {
            fqnsToCount << classFqn
        }
        if(classFqn == 'ou')
        {
            fqnsToCount << 'employee'
        }
        return hasParents ? fqnsToCount.any{ utils.findFirst(it, [parent: value]) } : false
    }

    /**
     * Метод по получению списка типов атрибута
     * @param attributeCode - код атрибута
     * @param sourceCode - источник атрибута
     * @return типы атрибута
     */
    private List getAttributeTypes(String attributeCode, String sourceCode)
    {
        return metainfo.getMetaClass(sourceCode).getAttribute(attributeCode).type.attributeType.permittedTypes.toList()
    }

    private List getTop(String classFqn, Map condition)
    {
        return getPossibleParentTypes(metainfo.getMetaClass(classFqn)).findResults { metaClass ->
            if(metaClass)
            {
                def parentMetaInfo = getAttributeParent(metaClass)
                def additionalCondition = parentMetaInfo ? [parent: op.isNull()] : [:]
                int count = utils.count(metaClass.code, condition + additionalCondition)
                return [metaClass.code, condition + additionalCondition, count]
            }
        }
    }

    private List getChildren(String classFqn, String uuid, Map condition)
    {
        def parentType = utils.get(uuid).metaClass
        return getAllInheritanceChains().findAll {
            it*.code.contains(classFqn)
        }.collect { set ->
            set.iterator()
               .dropWhile {
                   it.code != classFqn
               }.reverse()
               .dropWhile {
                   it.code != parentType.code
               }.collect {
                it.code
            }
        }.flatten().collect { clazz ->
            int count = utils.count(clazz, condition)
            [clazz, condition, count]
        }
    }

    /**
     * Метод получения всех цеочек типов учавствующих в наследований объектов
     * @return список метаклассов
     */
    private Collection getAllInheritanceChains(String classFqn = MAIN_FQN)
    {
        return metainfo.getMetaClass(classFqn)
                       ?.with(this.&getChildrenMetaClass)
                       ?.findAll(this.&getAttributeParent)
                       ?.collect(this.&getPossibleParentTypes)
                       ?.with(this.&getUniqueTypeSet) ?: []
    }

    /**
     * Метод получения объектов
     * @param data - список кортежей с набором необходимой инвормации
     * @param requiredCount - требуеое колиество объектов
     * @param requiredOffset - требуемое смещение объектов
     * @return список объектов
     */
    private List getObjects(List intermediateData, int requiredCount, int requiredOffset)
    {
        return intermediateData.collectMany { data ->
            if (!data)
            {
                return []
            }
            if (!requiredCount)
            {
                return []
            }
            def (classFqn, condition, int count) = data
            int mainCount = (count - requiredOffset).with {
                it < 0 ? 0 : it
            }

            int realCount = requiredCount < mainCount ? requiredCount : mainCount
            def result = mainCount ? utils.find(classFqn, condition, sp.limit(realCount).offset(requiredOffset)) : []
            return result
        }
    }

    /**
     * Метод для получение всех потомков определённого метакласса
     * @param metaClass - корневой элемент, точка отсчёта
     * @return список метаклассов наследованных от определённого метакласса
     */
    private List getChildrenMetaClass(def metaClass)
    {
        return [metaClass] + metaClass?.children?.collect(this.&getChildrenMetaClass)?.flatten()
    }

    /**
     * Метод обхода всей цепочки наследования и получения эх типов
     * @param classFqn - класс у кторого ищем предков
     * @return список метаклассов
     */
    private Set getPossibleParentTypes(def classFqn)
    {
        def tail = getAttributeParent(classFqn)?.with { parentAttribute ->
            def parentFqn = parentAttribute.type.relatedMetaClass.with(metainfo.&getMetaClass)
            parentFqn.code == classFqn.code ? [] : getPossibleParentTypes(parentFqn)
        } ?: []
        return [classFqn] + tail
    }

    /**
     * Метод поиска уникальных цепочек метаклассов наследников
     * @param chains - цепочки метаклассов наследников
     * @return уникальные цепочки метаклассов наследников
     */
    private Collection getUniqueTypeSet(Collection chains)
    {
        if (!chains)
        {
            return chains
        }
        def set = chains.head() as Set
        def other = chains.tail().with(this.&getUniqueTypeSet)
        return other.any {
            it*.code.containsAll(set*.code)
        } ? other : [set] + other
    }

    /**
     * Метод получения атрибута parent из метакласса
     * @param metaClass - метаклас
     * @return атрибут parent или null
     */
    private def getAttributeParent(def metaClass)
    {
        return metaClass?.attributes?.find {
            (it.code == 'parent')
        }
    }

    /**
     * Метод, возвращающй флаг на то, что метакласс валиден - т.е. не архивирован
     * @param clazz - значение метакласса
     * @return флаг на то, что метакласс валиден - т.е. не архивирован
     */
    Boolean validateClazz(def clazz)
    {
        return !clazz?.@metaClass?.isHidden() && clazz?.@metaClass?.status?.name() != 'REMOVED'
    }

    /**
     * Временное решение для получения списка метаклассов и типов
     * @param fqn код метакласса
     * @return список детей 1 уровня
     */
    def getMetaClassChildren(String fqn)
    {
        def  lcMetaClass = metainfo.getMetaClass(LC_PARENT_FQN)?.children.find { it?.code == LC_FQN }
        def fqns = [lcMetaClass]
        fqns << metainfo.getMetaClass(fqn)?.children?.collectMany {
            if (validateClazz(it))
            {
                return [it]
            }
            else if (it.toString() == 'userEntity')
            {
                return it.children.findAll { validateClazz(it) }
            }
            return []
        }
        return fqns
    }

    /**
     * Маппинг из списка объектов, идентифицирующий метакласс в список источников данных
     * Collection<fqn> -> Collection<DataSource>
     * @param fqns - fqn-ы
     * @param fromAttribute - флаг на получение данных из атрибута, сделанного под источник
     */
    private Collection<DataSource> mappingDataSource(def fqns, Boolean fromAttribute = false)
    {
        return fqns.collect {
            if (it instanceof Attribute)
            {
                it = metainfo.getMetaClass(it.property)
            }
            Collection<String> attributeGroupCodes = it.getAttributeGroupCodes()
            new DataSource(
                classFqn: it.code,
                title: it.title?.replace('Event for ', ''),
                children: fromAttribute ? [] : mappingDataSource(it.children),
                hasDynamic: fromAttribute ? false : checkForDynamicAttributes(it.code),
                sourceFilterAttributeGroup: SOURCE_FILTER_ATTRIBUTE_GROUP in attributeGroupCodes ? SOURCE_FILTER_ATTRIBUTE_GROUP : null
            )
        }.sort { it.title }
    }

    /**
     * Маппинг из коллекция кодов всех атрибутов метакласса в Collection<Attribute>
     * Collection<fqnAttr> -> Collection<Attribute>
     * @param attributes - атрибуты метакласа
     * @param sourceName - название типа объекта
     * @param sourceCode - код типа объекта
     */
    private Collection<Attribute> mappingAttribute(List attributes, String sourceName, String sourceCode)
    {
        return attributes.findResults {
            if (!it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES)
            {
                Boolean ableForAvg = DashboardUtils.checkIfAbleForAvg(it.metaClass.code, it.code, it.type.code)
                buildAttribute(it, sourceName?.replace('Event for ', ''), sourceCode, ableForAvg)
            }
        }.sort { it.title }
    }

    private Attribute buildAttribute(def value, String sourceName, String sourceCode, Boolean ableForAvg, TimerValue timerValue = null)
    {
        return new Attribute(
            code: value.code,
            title: value.title,
            type: value.type.code as String,
            property: value.type.relatedMetaClass?.getId(),
            metaClassFqn: value.metaClass.code,
            declaredMetaClass: value.declaredMetaClass,
            sourceName: sourceName,
            sourceCode: sourceCode,
            ableForAvg: ableForAvg,
            timerValue: timerValue
        )
    }

    /**
     * Метод получения UUID-ов для шаблонов динамических атрибутов
     * @param groupUUID - уникальный идентификатор группы
     * @return список уникальных идентификаторов шаблонов атрибутов
     */
    private List<String> getUUIDSForTemplates(String groupUUID)
    {
        return groupUUID ? utils.get(groupUUID).listTempAttr*.UUID : null
    }

    /**
     * Метод фильтрации шаблонов динамических атрибутов по статусу
     * @param templateUUIDS - UUID-ы шаблонов
     * @return UUID-ы активных шаблонов
     */
    private List<String> getActiveTemplateUUIDS(List<String> templateUUIDS)
    {
        return templateUUIDS?.findAll {
            ISDtObject dynamicAttribute = utils.get(it)
            return dynamicAttribute?.state != 'closed'
        }
    }

    /**
     * Метод получения типа динамического атрибута
     * @param templateUUID - уникальный идентификатор шаблона атрибута
     * @return тип представления динамического атрибута (может быть один из AttributeType)
     */
    private String getDynamicAttributeType(String templateUUID)
    {
        String totalValueFormatKey = DashboardUtils.getFormatKeyForTemplateOfDynamicAttribute(templateUUID)

        String dinType = metainfo.getMetaClass(totalValueFormatKey)
                                 ?.attributes.findResult { it.code == 'value' ? it : null}
                                 ?.getType()
        dinType = dinType?.replace("'", '')?.replace('AttributeType', '')?.trim()
        dinType = replaceDynamicAttributeType(dinType)
        return (dinType in AttributeType.ALL_ATTRIBUTE_TYPES)
            ? dinType
            : null
    }

    /**
     * Получение групп динамических атрибутов по условию фильтрации (дескриптора)
     * @param descriptor - условия фильтрации (дескриптор)
     * @return - список групп динамических атрибутов
     */
    private List getDescriptorGroupsData(descriptor)
    {
        return descriptor?.filters?.collectMany { filter ->
            if (filter['properties'].attrTypeCode.find() in AttributeType.LINK_TYPES) {
                def metaClasses = filter.dtObjectWrapper.collect { [metaInfo: it?.fqn, uuid: it?.uuid] }
                return metaClasses?.collectMany { metaClass ->
                    boolean hasAttribute = metainfo.getMetaClass(metaClass.metaInfo)?.attributes.any {
                        it.code == 'additAttrsG'
                    }
                    if (hasAttribute)
                    {
                        ISDtObject filterSubject = utils.get(metaClass.uuid)
                        List descriptorGroups = filterSubject.additAttrsG?.findResults {
                            it.state == 'active' ? it : null
                        }
                        return descriptorGroups.collect {
                            ['title': filterSubject.title, 'group': it]
                        }
                    }
                    else
                    {
                        return []
                    }
                }
            }
            else return []
        }
    }

    /**
     * Получение групп динамических атрибутов по условию фильтрации (дескриптора)
     * @param descriptor - условия фильтрации (дескриптор)
     * @return - список групп динамических атрибутов
     */
    private List getDynamicAttributeGroupsDataForUser(descriptor)
    {
        Collection attributeGroupsData = descriptor?.filters?.collectMany { filter ->
            if (filter.properties.attrTypeCode.find() in AttributeType.LINK_TYPES)
            {
                return getDescriptorGroupsData(descriptor)
            }
            else
            {
                return []
            }
        }

        if (!attributeGroupsData)
        {
            List dynamicAttributeGroups = utils.find('attrGroups', [:]).findResults {
                it.state == 'active' ? it : null
            }
            attributeGroupsData = dynamicAttributeGroups.collect {
                ['title': it.formInService.title, 'group': it]
            }
        }

        return attributeGroupsData
    }

    /**
     * Метод подмены дополнительных типов динамических атрибутов на стандартные типы
     * @param currentType - текущий тип динамического атрибута
     * @return корректный тип динамического атрибута
     */
    private String replaceDynamicAttributeType(String currentType)
    {
        return (currentType in ['richtext', 'hyperlink']) ? AttributeType.STRING_TYPE : currentType
    }

    /**
     * Метод получения источника группы динамических атрибутов
     * @param group - группа динамических атрибутов
     * @return ассоциативный массив их названия и UUID-а источника динамической группы
     */
    private Map<String, Object> getDynamicGroupSource(def group)
    {
        def routeSource = group.formInRoute.find()
        def serviceSource = group.formInService.find()
        def compSource = group.formInUserCat.find()
        if (routeSource)
        {
            return [name: metainfo.getMetaClass(routeSource?.metaClass).title, code: routeSource?.UUID]
        }
        else if (serviceSource)
        {
            return [name: metainfo.getMetaClass(serviceSource?.metaClass).title, code: serviceSource?.UUID]
        }
        else if (compSource)
        {
            return [name: metainfo.getMetaClass(compSource?.metaClass).title, code: compSource?.UUID]
        }
        return null
    }

    /**
     * Метод проверки наличия динамических атрибутов
     * @param fqn - код метакласса для проверки
     * @return флаг на наличие динамических атрибутов
     */
    private boolean checkForDynamicAttributes(String fqn)
    {
        List types = metainfo.getTypes(fqn).toList() + metainfo.getMetaClass(fqn)

        List typesWithDynamic = types?.collect {
            it?.attributes?.any {
                it.code == AttributeType.TOTAL_VALUE_TYPE
            }
        }
        return typesWithDynamic.any { it == true }
    }

    /**
     * Метод получения максимального id типа у класса (необходимо при получении названий статусов у класса и его типов)
     * @param classFqn - fqn основного класса
     * @return id потомка, который использовался при запросе в БД
     */
    private String getMaxMetaCaseId(String classFqn)
    {
        return db.query("select max(metaCaseId) from ${classFqn}").list().head()
    }
}

/**
 * Модель для источника данных
 */
class DataSource
{
    /**
     * Код типа метакласса
     */
    String classFqn
    /**
     * Название источника данных
     */
    String title
    /**
     * Дети источника даннных
     */
    Collection<DataSource> children
    /**
     * Наличие динамических атрибутов
     */
    boolean hasDynamic
    /**
     * Код группы атрибутов для отображения в форме фильтрации на источнике
     */
    String sourceFilterAttributeGroup
}

/**
 *  Модель для источника данных с дескриптором
 */
class DataSourceDescriptor extends DataSource
{
    /**
     * Дескриптор
     */
    String descriptor
}
