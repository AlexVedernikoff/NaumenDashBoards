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

import groovy.transform.Field
import groovy.transform.Immutable
import groovy.transform.InheritConstructors
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.server.script.api.metainfo.IAttributeWrapper

import static groovy.json.JsonOutput.toJson
import ru.naumen.core.server.script.api.injection.InjectApi

@Field @Lazy @Delegate Dashboards dashboards = new DashboardsImpl(binding)

interface Dashboards
{
    /**
     * Отдает список источников данных с детьми
     * @param classFqn код метакласса
     * @return json список источников данных {заголовок, код, дети}
     */
    String getDataSources()

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
     * Отдаёт список атрибутов метакласа ссылочного типа атрибута
     * @param requestContent - Запрос на получение атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    String getAttributesFromLinkAttribute(requestContent)

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
     * @param descriptor - дескриптор из виджета
     * @param aggregateToJson - флаг возврата данных в JSON-формате
     * @return список групп динамических атрибутов
     */
    String getDynamicAttributeGroups(def descriptor)

    /**
     * Метод получения связанных источников
     * @param requestContent - тело запроса
     * @return - список связанных источников
     */
    String getLinkedDataSources(requestContent)

    /**
     * Метод получения карточки объекта по UUID-у
     * @param value - значение объекта типа (значение - UUID)
     * @return ссылка на карточку объекта в Json-формате
     */
    String getCardObject(String value)

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
     * @param dashboardCode - код дашборда целиком (fqn объекта, создавшего дб_uuid дашборда)
     * @return ссылка на на страницу с дошбордом в json-формате.
     */
    String getDashboardLink(String dashboardCode)
}

@InheritConstructors
class DashboardsImpl extends Script implements Dashboards
{
    DashboardsService service = DashboardsService.instance

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
    @Deprecated
    String getAttributesDataSources(requestContent)
    {
        return toJson(service.getAttributesDataSources(requestContent))
    }

    @Override
    String getDataSourceAttributes(requestContent)
    {
        return toJson(service.getDataSourceAttributes(requestContent))
    }

    @Override
    String getAttributesFromLinkAttribute(requestContent)
    {
        return toJson(service.getAttributesFromLinkAttribute(requestContent))
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
    String getDynamicAttributeGroups(def descriptor)
    {
        return toJson(service.getDynamicAttributeGroups(descriptor))
    }

    @Override
    String getLinkedDataSources(requestContent)
    {
        return toJson(service.getLinkedDataSources(requestContent))
    }

    @Override
    String getCardObject(String value)
    {
        return toJson(service.getCardObject(value))
    }

    @Override
    String checkForParent(String parentClassFqn, String childClassFqn)
    {
        return toJson(service.checkForParent(parentClassFqn, childClassFqn))
    }

    @Override
    String getDashboardLink(String dashboardCode)
    {
        return toJson(service.getDashboardLink(dashboardCode, user))
    }
}

@InjectApi
@Singleton
class DashboardsService
{
    private static final String MAIN_FQN = 'abstractBO'
    private static final String LC_PARENT_FQN = 'abstractSysObj'
    private static final String LC_FQN = 'abstractEvt'

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
    * Отдает список атрибутов для источника данных
    * @param requestContent запрос с кодом метакласса и типами атрибутов
    * @return json список атрибутов {заголовок, код, тип атрибута}
    */
    @Deprecated
    Collection<Attribute> getAttributesDataSources(requestContent)
    {
        String classFqn = requestContent.classFqn.toString()
        List<String> types = requestContent?.types
        def metaInfo = api.metainfo.getMetaClass(classFqn)
        List attributes = types ? metaInfo?.attributes?.findResults {
            it.type.code in types ? it : null
        } : metaInfo?.attributes?.toList()
        return attributes
            ? mappingAttribute(attributes, metaInfo.title, metaInfo.code)
            : []
    }

    /**
    * Отдает список атрибутов для источника данных
    * @param requestContent запрос с кодом метакласса и типами атрибутов
    * @return json список атрибутов {заголовок, код, тип атрибута}
    */
    Collection<Attribute> getDataSourceAttributes(requestContent)
    {
        String classFqn = requestContent.classFqn.toString()
        String parentClassFqn = requestContent.parentClassFqn
        List<String> types = requestContent?.types

        def metaInfo = api.metainfo.getMetaClass(parentClassFqn ?: classFqn)
        def metaClassTypes = parentClassFqn ? [] : api.metainfo.getTypes(classFqn)
        String attributeTitle = ""
        if (parentClassFqn && parentClassFqn != classFqn)
        {
            //источником является ссылочный атрибут верхнего источника с кодом parentClassFqn
            def attribute = metaInfo?.getAttribute(classFqn)
            String relatedMetaClass = attribute?.type?.relatedMetaClass
            metaClassTypes = relatedMetaClass ? api.metainfo.getTypes(relatedMetaClass) : []
            metaInfo = relatedMetaClass ? api.metainfo.getMetaClass(relatedMetaClass) : metaInfo
            attributeTitle = attribute?.title
        }

        return ([metaInfo] + metaClassTypes).collectMany { mc ->
            def attributes = types
                ? mc?.attributes?.findAll { it.type.code in types ? it : null }
                : mc?.attributes?.toList()

            return attributes
                ? mappingAttribute(attributes, attributeTitle ?: mc.title, parentClassFqn ? classFqn : mc.code)
                : []
        }.unique { it.code }.sort { it.title }
    }

    /**
    * Отдаёт список атрибутов метакласа ссылочного типа атрибута
    * @param requestContent - Запрос на получение атрибутов
    * @return json список атрибутов {заголовок, код, тип атрибута}
    */
    List<Attribute> getAttributesFromLinkAttribute(requestContent)
    {
        def linkAttribute = requestContent.attribute as Map
        String attributeType = linkAttribute.type
        if (!(attributeType in AttributeType.LINK_TYPES))
        {
            throw new Exception( "Not supported type: ${ attributeType }" )
        }

        String attributeClassFqn = linkAttribute.property
        boolean deep = requestContent?.deep
        List<String> types = requestContent?.types ?: AttributeType.ALL_ATTRIBUTE_TYPES

        def metaInfo = api.metainfo.getMetaClass(attributeClassFqn)
        List attributeTypes = linkAttribute.metaClassFqn && linkAttribute.metaClassFqn != AttributeType.TOTAL_VALUE_TYPE
            ? getPermittedTypes(api.metainfo.getMetaClass(linkAttribute.metaClassFqn), linkAttribute.code)?.toList()
            : []
        List metaInfos = attributeTypes?.collect { api.metainfo.getMetaClass(it.toString()) }

        if (attributeClassFqn == AttributeType.TOTAL_VALUE_TYPE)
        {
            String metaClass = api.utils.get(TotalValueMarshaller.unmarshal(linkAttribute.code).last()).metaClass.toString()
            metaInfo = api.metainfo.getMetaClass(metaClass)
        }

        Collection<Attribute> result = [metaInfo, *metaInfos].collectMany { meta ->
            return meta ? meta.attributes.findResults {
                !it.computable && it.type.code in types
                    ? buildAttribute(it, metaInfo.title, metaInfo.code)
                    : null
            } : []
        }.unique{ it.code }.sort { it.title }

        if (deep)
        {
            List childrenClasses = api.metainfo.getTypes(attributeClassFqn)?.toList()

            Collection<Attribute> attributeList = []
            childrenClasses.each {
                def metainfo = api.metainfo.getMetaClass(it)
                def attributes = metainfo?.attributes
                attributeList += attributes
                    ? attributes.findResults {
                        !(it.code in result*.code) &&
                        !(it.code in attributeList*.code) &&
                        !it.computable && it.type.code in types
                            ? buildAttribute(it, metaInfo.title, metaInfo.code)
                        : null
                    }
                : []
            }
            result += attributeList
            result.sort {
                it.title
            }
        }
        return result
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
        def metaClass = api.metainfo.getMetaClass(sourceCode)
        Boolean attrIsDynamic = attr.metaClassFqn.contains(AttributeType.TOTAL_VALUE_TYPE)
        List types
        if (attr.ref)
        {
            String firstAttributeCode = attr.code
            //на последнем месте стоит нужный нам атрибут
            String lastAttributeCode = attr.attrChains().last().code
            types = getPermittedTypes(metaClass, firstAttributeCode).toList()
            def metaClasses = types.collect { api.metainfo.getMetaClass(it) }
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
        def intermediateData = uuid ?: types.collectMany {classFqn -> getTop(classFqn.toString(), condition) }.unique { it.find() }
        List values = uuid
            ? types.collectMany { classFqn -> api.utils.find(classFqn, condition + [parent: uuid]) }.unique { it?.UUID }
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
                children: api.metainfo.getMetaClass(object.metaClass.id).hasAttribute('parent')
                    ? types.sum { attrIsDynamic && !api.metainfo.getMetaClass(it.toString()).hasAttribute('parent')
                    ? api.utils.count(object.metaClass.id, [parent: object.UUID]) as int
                    : api.utils.count(it, [parent: object.UUID]) as int }
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
        def metaClass = api.metainfo.getMetaClass(sourceCode)
        def types
        if (attr.ref)
        {
            String firstAttributeCode = attr.code
            //на последнем месте стоит нужный нам атрибут
            String lastAttributeCode = attr.attrChains().last().code
            types = getPermittedTypes(metaClass, firstAttributeCode).toList()
            def metaClasses = types.collect { api.metainfo.getMetaClass(it) }
            //по последнему атрибуту берем правильные типы дял получения данных
            types = metaClasses.collectMany { getPermittedTypes(it, lastAttributeCode) }.collectMany { classFqn ->
                return getPossibleParentTypes(api.metainfo.getMetaClass(classFqn))
            }.unique { it.getFqn()}
        }
        else
        {
            //получили списки типов
            types = attrIsDynamic
                ? getPermittedTypes(metaClass, AttributeType.TOTAL_VALUE_TYPE)
                : getPermittedTypes(metaClass, attributeCode).collectMany { classFqn ->
                return getPossibleParentTypes(api.metainfo.getMetaClass(classFqn))
            }.unique { it.getFqn()}
        }
        def bottomValues
        if(attrIsDynamic)
        {
            def condition = removed
                ? [:]
                : [removed: false, linkTemplate: TotalValueMarshaller.unmarshal(attributeCode).last()]
            //на первом месте стоит тип, по которому будет поиск значений

            bottomValues = types.collectMany { classFqn ->api.utils.find(classFqn.toString(), condition) }
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
                api.utils.find(it.toString(), [title: op.like("%${value}%")] + condition, sp.ignoreCase())
            }.unique { it.UUID }
        }
        def withParentsBottoms = []
        def independentBottoms = []

        def childrenInBottomValues = []
        bottomValues.each { bottom ->
            Boolean bottomClassHasParent = api.metainfo.getMetaClass(bottom.metaClass.id).hasAttribute('parent')
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
        return independentBottoms + withParentsBottoms
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
        return getAllCatalogValues(api.utils.find(classFqn, removeCondition + parentCondition, searchParameter),
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

        return getAllCatalogValues(api.utils.find(classFqn, removeCondition + parentCondition, searchParameter),
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
        String maxMetaCase = getMaxMetaCaseId(classFqn)
        String totalClass = "${classFqn}\$${maxMetaCase}"
        return api.metainfo.getMetaClass(totalClass)
                        ?.workflow
                        ?.states
                        ?.sort {
                            it.title
                        }
                        ?.collect {
                            [title: it.title, uuid: it.code]
                        } ?: []
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
        return api.metainfo.getMetaClass(classFqn)
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
        return templateUUIDS?.collect { templateUUID ->
            return getDynamicAttributeType(templateUUID) ? new Attribute(
                code: "${AttributeType.TOTAL_VALUE_TYPE}_${templateUUID}",
                title: api.utils.get(templateUUID).title,
                type: getDynamicAttributeType(templateUUID),
                property: AttributeType.TOTAL_VALUE_TYPE,
                metaClassFqn: AttributeType.TOTAL_VALUE_TYPE,
                sourceName: api.utils.get(groupUUID).title,
                sourceCode: groupUUID
            ) : null
        }?.grep().toList()
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
        return getDescriptorGroups(descriptor)?.collect {
            def dynamicSource = getDynamicGroupSource(it)
            def templateUUIDS = getUUIDSForTemplates(it.UUID)
            boolean anyAttributes = templateUUIDS.any { getDynamicAttributeType(it) }
            if (dynamicSource && anyAttributes) {
                return new DynamicGroup(
                    code: it.UUID,
                    title: "${it.title} (${dynamicSource?.name})"
                )
            }
        }?.grep()?.toList()
    }

    /**
    * Метод получения связанных источников
    * @param requestContent - тело запроса
    * @return - список связанных источников
    */
    Collection<DataSource> getLinkedDataSources(requestContent)
    {
        def linkAttributes = getDataSourceAttributes(requestContent)
        return mappingDataSource(linkAttributes, true)
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
            def link = api.web.open(objectUUID)
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
        Boolean isParent = parentClassFqn == childClassFqn || api.metainfo.checkAttributeExisting(parentClassFqn, childClassFqn).isEmpty()
        return [result : isParent]
    }

    /**
    * Метод формирования ссылки для перехода на дашборд
    * @param dashboardCode - код дашборда целиком (fqn объекта, создавшего дб_uuid дашборда)
    * @return ссылка на на страницу с дошбордом в json-формате.
    */
    Map getDashboardLink(String dashboardCode, user)
    {
        def root = api.utils.findFirst('root', [:])
        if (root.hasProperty('dashboardCode') && root.dashboardCode)
        {
            def appCode = root.dashboardCode
            def(subjectFqn, dashboardUUID) = DashboardCodeMarshaller.unmarshal(dashboardCode)

            def db = api.apps.listContents(appCode).find {
                it.contentUuid == dashboardUUID && it.subjectFqn == subjectFqn
            }
            String usedUUID = (user && user.metaClass?.toString() == subjectFqn) ? user.UUID : api.utils.findFirst(subjectFqn, ['removed': false]).UUID
            def webApi = api.web
            def link
            if(webApi.metaClass.respondsTo(webApi, 'openContent'))
            {
                link = webApi.openContent(usedUUID, db.tabUuid, db.contentUuid)
            } else
            {
                link = webApi.openTab(usedUUID, db.tabUuid).replace('?anchor=', '#')
            }
            return [link: link]
        }
        throw new Exception('Для получения списка виджетов заполните корректно атрибут Компании dashboardCode')
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
                children: getAllCatalogValues(api.utils.find(classFqn, removeCondition + [parent: el.UUID]),
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
        def hasParents = api.metainfo.getMetaClass(classFqn).hasAttribute('parent')
        def fqnsToCount = []

        if(hasParents && classFqn != 'employee')
        {
            fqnsToCount << classFqn
        }
        if(classFqn == 'ou')
        {
            fqnsToCount << 'employee'
        }
        return hasParents ? fqnsToCount.any{ api.utils.findFirst(it, [parent: value]) } : false
    }

    /**
     * Метод по получению списка типов атрибута
     * @param attributeCode - код атрибута
     * @param sourceCode - источник атрибута
     * @return типы атрибута
     */
    private List getAttributeTypes(String attributeCode, String sourceCode)
    {
        return api.metainfo.getMetaClass(sourceCode).getAttribute(attributeCode).type.attributeType.permittedTypes.toList()
    }

    private List getTop(String classFqn, Map condition)
    {
        return getPossibleParentTypes(api.metainfo.getMetaClass(classFqn)).findResults { metaClass ->
            if(metaClass)
            {
                def parentMetaInfo = getAttributeParent(metaClass)
                def additionalCondition = parentMetaInfo ? [parent: op.isNull()] : [:]
                int count = api.utils.count(metaClass.code, condition + additionalCondition)
                return [metaClass.code, condition + additionalCondition, count]
            }
        }
    }

    private List getChildren(String classFqn, String uuid, Map condition)
    {
        def parentType = api.utils.get(uuid).metaClass
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
            int count = api.utils.count(clazz, condition)
            [clazz, condition, count]
        }
    }

    /**
     * Метод получения всех цеочек типов учавствующих в наследований объектов
     * @return список метаклассов
     */
    private Collection getAllInheritanceChains(String classFqn = MAIN_FQN)
    {
        return api.metainfo.getMetaClass(classFqn)
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
            def result = mainCount ? api.utils.find(classFqn, condition, sp.limit(realCount).offset(requiredOffset)) : []
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
            def parentFqn = parentAttribute.type.relatedMetaClass.with(api.metainfo.&getMetaClass)
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
     * Временное решение для получения списка метаклассов и типов
     * @param fqn код метакласса
     * @return список детей 1 уровня
     */
    private def getMetaClassChildren(String fqn)
    {
        Closure classValidator = { clazz ->
            !clazz.@metaClass.isHidden() && clazz.@metaClass.status.name() != 'REMOVED'
        }
        def  lcMetaClass = api.metainfo.getMetaClass(LC_PARENT_FQN)?.children.find { it?.code == LC_FQN }
        def fqns = [lcMetaClass]
        fqns << api.metainfo.getMetaClass(fqn)?.children?.collectMany {
            if (classValidator.call(it))
            {
                return [it]
            }
            else if (it.toString() == 'userEntity')
            {
                return it.children.findAll(classValidator)
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
            new DataSource(
                it.code,
                it.title?.replace('Event for ', ''),
                fromAttribute ? [] : mappingDataSource(it.children),
                fromAttribute ? false : checkForDynamicAttributes(it.code)
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
            !it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES ? buildAttribute(it, sourceName?.replace('Event for ', ''), sourceCode) : null
        }.sort { it.title }
    }

    private Attribute buildAttribute(def value, String sourceName, String sourceCode)
    {
        return new Attribute(
            code: value.code,
            title: value.title,
            type: value.type.code as String,
            property: value.type.relatedMetaClass as String,
            metaClassFqn: value.metaClass.code,
            declaredMetaClass: value.declaredMetaClass,
            sourceName: sourceName,
            sourceCode: sourceCode
        )
    }

    /**
     * Метод получения UUID-ов для шаблонов динамических атрибутов
     * @param groupUUID - уникальный идентификатор группы
     * @return список уникальных идентификаторов шаблонов атрибутов
     */
    private List<String> getUUIDSForTemplates(String groupUUID)
    {
        return groupUUID ? api.utils.get(groupUUID).listTempAttr*.UUID : null
    }

    /**
     * Метод получения типа динамического атрибута
     * @param templateUUID - уникальный идентификатор шаблона атрибута
     * @return тип представления динамического атрибута (может быть один из AttributeType)
     */
    private String getDynamicAttributeType(String templateUUID)
    {
        String totalValueFormatKey = DashboardUtils.getFormatKeyForTemplateOfDynamicAttribute(templateUUID)

        String dinType = api.metainfo.getMetaClass(totalValueFormatKey)
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
    private List getDescriptorGroups(descriptor)
    {
        return descriptor?.filters?.collectMany { filter ->
            if (filter['properties'].attrTypeCode.find() in AttributeType.LINK_TYPES) {
                def metaClasses = filter.dtObjectWrapper.collect { [metaInfo: it?.fqn, uuid: it?.uuid] }
                return metaClasses?.collectMany { metaClass ->
                    boolean hasAttribute = api.metainfo.getMetaClass(metaClass.metaInfo)?.attributes.any {
                        it.code == 'additAttrsG'
                    }
                    if (hasAttribute)
                    {
                        return api.utils.get(metaClass.uuid).additAttrsG?.findResults {
                            it.state == 'active' ? it : null
                        }
                    }
                }
            }
            else return []
        }
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
            return [name: api.metainfo.getMetaClass(routeSource?.metaClass).title, code:
                routeSource?.UUID]
        }
        else if (serviceSource)
        {
            return [name: api.metainfo.getMetaClass(serviceSource?.metaClass).title, code:
                serviceSource?.UUID]
        }
        else if (compSource)
        {
            return [name: api.metainfo.getMetaClass(compSource?.metaClass).title, code:
                compSource?.UUID]
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
        List types = api.metainfo.getTypes(fqn).toList() + api.metainfo.getMetaClass(fqn)

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
        return api.db.query("select max(metaCaseId) from ${classFqn}").list().head()
    }
}

/**
 * Модель для источника данных
 */
@Immutable
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

}