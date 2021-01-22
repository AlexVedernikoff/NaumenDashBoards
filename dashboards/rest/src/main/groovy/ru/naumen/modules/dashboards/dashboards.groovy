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
import ru.naumen.core.server.script.api.metainfo.IAttributeWrapper

import static groovy.json.JsonOutput.toJson

//region КОНСТАНТЫ
// TODO: добавить aggregate, responsible,
@Field private static final String MAIN_FQN = 'abstractBO'
//endregion

//region КЛАССЫ
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
//endregion

//region REST-МЕТОДЫ
/**
 * Отдает список источников данных с детьми
 * @param classFqn код метакласса
 * @return json список источников данных {заголовок, код, дети}
 */
String getDataSources(classFqn = MAIN_FQN)
{
    def children = getMetaClassChildren(classFqn as String)
    Collection<DataSource> dataSources = mappingDataSource(children)
    return toJson(dataSources)
}

/**
 * Отдает список атрибутов для источника данных
 * @param requestContent запрос с кодом метакласса и типами атрибутов
 * @return json список атрибутов {заголовок, код, тип атрибута}
 */
@Deprecated
String getAttributesDataSources(requestContent)
{
    String classFqn = requestContent.classFqn.toString()
    List<String> types = requestContent?.types
    def metaInfo = api.metainfo.getMetaClass(classFqn)
    List attributes = types ? metaInfo?.attributes?.findResults {
        it.type.code in types ? it : null
    } : metaInfo?.attributes?.toList()
    Collection<Attribute> mappingAttributes = attributes ?
        mappingAttribute(attributes, metaInfo.title, metaInfo.code) : []
    return toJson(mappingAttributes)
}

/**
 * Отдает список атрибутов для источника данных
 * @param requestContent запрос с кодом метакласса и типами атрибутов
 * @return json список атрибутов {заголовок, код, тип атрибута}
 */
def getDataSourceAttributes(requestContent, Boolean parseToJson = true)
{
    String classFqn = requestContent.classFqn.toString()
    String parentClassFqn = requestContent.parentClassFqn
    List<String> types = requestContent?.types

    def metaInfo = api.metainfo.getMetaClass(parentClassFqn ?: classFqn)
    String attributeTitle = ""
    if (parentClassFqn)
    {
        //источником является ссылочный атрибут верхнего источника с кодом parentClassFqn
        def attribute = metaInfo?.getAttribute(classFqn)
        String relatedMetaClass = attribute?.type?.relatedMetaClass
        metaInfo = relatedMetaClass ? api.metainfo.getMetaClass(relatedMetaClass) : metaInfo
        attributeTitle = attribute?.title
    }

    List attributes = types ? metaInfo?.attributes?.findResults {
        it.type.code in types ? it : null
    } : metaInfo?.attributes?.toList()

    Collection<Attribute> mappingAttributes = attributes ?
        mappingAttribute(attributes, attributeTitle ?: metaInfo.title, parentClassFqn ? classFqn : metaInfo.code) : []
    return parseToJson ? toJson(mappingAttributes) : mappingAttributes
}

/**
 * Отдаёт список атрибутов метакласа ссылочного типа атрибута
 * @param requestContent - Запрос на получение атрибутов
 * @return json список атрибутов {заголовок, код, тип атрибута}
 */
String getAttributesFromLinkAttribute(requestContent)
{
    def linkAttribute = requestContent.attribute as Map
    String attributeType = linkAttribute.type
    if (!(attributeType in AttributeType.LINK_TYPES))
    {
        throw new Exception( "Not supported type: ${ attributeType }" )
    }

    String attributeClassFqn = linkAttribute.property
    boolean deep = requestContent?.deep
    List<String> types = requestContent?.types ?: AttributeType.ATTRIBUTE_TYPES_WITHOUT_TIMER

    def metaInfo = api.metainfo.getMetaClass(attributeClassFqn)

    if (attributeClassFqn == AttributeType.TOTAL_VALUE_TYPE) {
        Attribute attribute = new Attribute(
            code: 'textValue',
            title: metaInfo.getAttribute('textValue').title,
            type: 'string',
            property: AttributeType.TOTAL_VALUE_TYPE,
            metaClassFqn: metaInfo.getAttribute('textValue').getMetaClass(),
            sourceName: metaInfo.title,
            sourceCode: AttributeType.TOTAL_VALUE_TYPE
        )
        return toJson([attribute])
    }

    Collection<Attribute> result = metaInfo.attributes.findResults {
        !it.computable && it.type.code in types
            ? buildAttribute(it, metaInfo.title, metaInfo.code)
            : null
    }.sort {
        it.title
    }

    if (deep)
    {
        List childrenClasses = api.metainfo.getTypes(attributeClassFqn)?.toList()

        Collection<Attribute> attributeList = []
        childrenClasses.each {
            def metainfo = api.metainfo.getMetaClass(it)
            def attributes = metainfo?.attributes
            attributeList += attributes ? attributes.findResults {
                !result*.code.find { x -> x == it.code
                } && !attributeList*.code.find { x -> x == it.code
                } && !it.computable && it.type.code in types
                    ? buildAttribute(it, metaInfo.title, metaInfo.code) : null
            } : []
        }
        result += attributeList
        result.sort {
            it.title
        }
    }
    return toJson(result)
}

String getAttributeObject(Map requestContent)
{
    String uuid = requestContent.parentUUID
    boolean removed = requestContent.removed
    String sourceCode = requestContent.sourceCode
    String attributeCode = requestContent.attribute.code
    //получили списки типов
    def metaClass = api.metainfo.getMetaClass(sourceCode)
    List types = getPermittedTypes(metaClass, attributeCode).toList()
    def count = requestContent.count as int
    def offset = requestContent.offset as int
    def condition = removed ? [:] : [removed: false]

    //на первом месте стоит тип, по которому будет поиск значений
    def intermediateData = uuid ?: types.collectMany {classFqn -> getTop(classFqn.toString(), condition) }.unique { it.find() }
    List values = uuid
        ? types.collectMany { classFqn -> api.utils.find(classFqn, condition + [parent: uuid]) }.unique { it?.UUID }
        : getObjects(intermediateData, count, offset)

    types = uuid ? types : intermediateData*.find()
    def result = values?.collect { object ->
        [
            title   : object.title,
            uuid    : object.UUID,
            property: object.metaClass as String,
            children: api.metainfo.getMetaClass(object.metaClass.id).hasAttribute('parent')
                ? types.sum { api.utils.count(it, [parent: object.UUID]) as int }
                : 0
        ]
    }
    return toJson(result)
}

/**
 * Метод по получению типов и класса атрибута из метакласса источника
 * @param mc - метакласс источника
 * @param attrCode - код атрибута
 * @return список типов и класса атрибута
 */
Set getPermittedTypes(def mc, String attrCode)
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
 * Метод асинхронного поиска значения на всех уровнях
 * @param requestContent - тело запроса
 * @return объекты с таким значением
 */
String searchValue(Map requestContent)
{
    String sourceCode = requestContent.sourceCode
    String attributeCode = requestContent.attribute.code
    def value = requestContent.value
    Boolean removed = requestContent.removed ?: false

    def metaClass = api.metainfo.getMetaClass(sourceCode)
    def types = getPermittedTypes(metaClass, attributeCode).toList().collectMany { classFqn ->
        return getPossibleParentTypes(api.metainfo.getMetaClass(classFqn))
    }.unique { it.getFqn()}

    def bottomValues = types.collectMany {
        api.utils.find(it.toString(), [title: op.like("%${value}%"), removed: removed], sp.ignoreCase())
    }.unique { it.UUID }

    def withParentsBottoms = []
    def independentBottoms = []
    Boolean attributeClassHasParent = types.every { api.metainfo.getMetaClass(it).hasAttribute('parent') }
    if(attributeClassHasParent)
    {
        bottomValues.removeAll {it.parent == null}
    }

    def childrenInBottomValues = []
    bottomValues.each { bottom ->
        Boolean bottomClassHasParent = api.metainfo.getMetaClass(bottom.metaClass.id).hasAttribute('parent')
        def parents = bottomClassHasParent ? getParents(bottom) : []
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
            independentBottoms << basicMap(bottom, bottomClassHasParent ? getChildrenTree(bottom, childrenInBottomValues, sourceCode) : [], sourceCode)
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
    return toJson(independentBottoms + withParentsBottoms)
}

/**
 * Метод, возвращающий всех "родителей" объекта
 * @param bottom - объект "на дне"
 * @return - список всех "родителей"
 */
def getParents(def bottom)
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
def getChildrenTree(def parent, List bottomValuesWithChildren, String fqn)
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
Map basicMap(def value, def children = [], String fqn = '')
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
Boolean checkForChildren(def value)
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

String getCatalogObject(Map requestContent)
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
    def result = getAllCatalogValues(api.utils.find(classFqn, removeCondition + parentCondition, searchParameter),
                                     classFqn,
                                     removeCondition)
    return toJson(result)
}

/**
 * Метод получения данных справочника по всем уровням
 * @param firstLevelValues - значения первого уровня
 * @param classFqn - тип объекта
 * @param removeCondition - условие удаления
 * @return многоуровневый список значений [title: ..., uuid: ..., children:...]
 */
List<Map> getAllCatalogValues(def firstLevelValues, String classFqn, def removeCondition)
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

String getCatalogItemObject(Map requestContent)
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

    def result = getAllCatalogValues(api.utils.find(classFqn, removeCondition + parentCondition, searchParameter),
                                     classFqn,
                                     removeCondition)
    return toJson(result)
}

/**
 * Метод получения статусов объекта
 * @param classFqn - тип объекта
 * @return список статусов
 */
String getStates(String classFqn)
{
    String maxMetaCase = getMaxMetaCaseId(classFqn)
    String totalClass = "${classFqn}\$${maxMetaCase}"
    def result = api.metainfo.getMetaClass(totalClass)
                    ?.workflow
                    ?.states
                    ?.sort {
                        it.title
                    }
                    ?.collect {
                        [title: it.title, uuid: it.code]
                    } ?: []
    return toJson(result)
}

String getTimerStatuses()
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
String getMetaClasses(String classFqn)
{
    def result = api.metainfo.getMetaClass(classFqn)
                    ?.with(this.&getChildrenMetaClass)
                    ?.flatten()
                    ?.collect {
                        [title: it.title, uuid: it.code]
                    } ?: []
    return toJson(result)
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
private List getTop(String classFqn, Map condition)
{
    return getPossibleParentTypes(api.metainfo.getMetaClass(classFqn)).collect { metaClass ->
        def parentMetaInfo = getAttributeParent(metaClass)
        def additionalCondition = parentMetaInfo ? [parent: op.isNull()] : [:]
        int count = api.utils.count(metaClass.code, condition + additionalCondition)
        [metaClass.code, condition + additionalCondition, count]
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
 * етод поиска уникальных цепочекь метаклассов наследников
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
    return api.metainfo.getMetaClass(fqn)?.children?.collectMany {
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
            it.title,
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
        !it.computable && it.type.code in AttributeType.ATTRIBUTE_TYPES_WITHOUT_TIMER ? buildAttribute(it, sourceName, sourceCode) : null
    }.sort { it.title }
}

private Attribute buildAttribute(def value, String sourceName, String sourceCode)
{
    return new Attribute(
        code: value.code,
        title: value.title,
        type: value.type.code as String,
        property: value.type.relatedMetaClass as String,
        metaClassFqn: value.declaredMetaClass.code,
        sourceName: sourceName,
        sourceCode: sourceCode
    )
}

/**
 * Метод получения динамических атрибутов
 * @param groupUUID - уникальный идентификатор группы
 * @return список динамических атрибутов в JSON-формате
 */
String getDynamicAttributes(String groupUUID)
{
    List<String> templateUUIDS = getUUIDSForTemplates(groupUUID)
    List<Attribute> attributes = templateUUIDS?.collect { templateUUID ->
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

    return toJson(attributes ?: [])
}

/**
 * Метод получения UUID-ов для шаблонов динамических атрибутов
 * @param groupUUID - уникальный идентификатор группы
 * @return список уникальных идентификаторов шаблонов атрибутов
 */
List<String> getUUIDSForTemplates(String groupUUID)
{
    return groupUUID ? api.utils.get(groupUUID).listTempAttr*.UUID : null
}

/**
 * Метод получения типа динамического атрибута
 * @param templateUUID - уникальный идентификатор шаблона атрибута
 * @return тип представления динамического атрибута (может быть один из AttributeType)
 */
String getDynamicAttributeType(String templateUUID)
{
    def template = api.utils.get(templateUUID)
    String attrFormatToFind = template.visor
        ? "${template.metaClass}_${template.visor.code}"
        : "${template.metaClass}"
    attrFormatToFind = attrFormatToFind.replace('_unitsLinks', '')
    String totalValueFormatKey = modules.dynamicFields.getAttrToTotalValueMap()[attrFormatToFind]

    String dinType = api.metainfo.getMetaClass(totalValueFormatKey)
                        ?.attributes.findResult { it.code == 'value' ? it : null}
                        ?.getType()
    dinType = dinType?.replace("'", '')?.replace('AttributeType', '')?.trim()
    dinType = replaceDynamicAttributeType(dinType)
    return (dinType in AttributeType.DYNAMIC_ATTRIBUTE_TYPES)
        ? dinType
        : null
}

/**
 * Получение групп динамических атрибутов по условию фильтрации (дескриптора)
 * @param descriptor - условия фильтрации (дескриптор)
 * @return - список групп динамических атрибутов
 */
List getDescriptorGroups(descriptor)
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
    }
}

/**
 * Метод подмены дополнительных типов динамических атрибутов на стандартные типы
 * @param currentType - текущий тип динамического атрибута
 * @return корректный тип динамического атрибута
 */
String replaceDynamicAttributeType(String currentType)
{
    return (currentType in ['richtext', 'hyperlink', 'dtInterval']) ? AttributeType.STRING_TYPE : currentType
}

/**
 * Метод получения источника группы динамических атрибутов
 * @param group - группа динамических атрибутов
 * @return ассоциативный массив их названия и UUID-а источника динамической группы
 */
Map<String, Object> getDynamicGroupSource(def group)
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
 * Метод получения групп динамических атрибутов
 * @param descriptor - дескриптор из виджета
 * @param aggregateToJson - флаг возврата данных в JSON-формате
 * @return список групп динамических атрибутов
 */
def getDynamicAttributeGroups(def descriptor, boolean aggregateToJson = true)
{
    def slurper = new groovy.json.JsonSlurper()
    descriptor = slurper.parseText(descriptor)
    List<DynamicGroup> groups = getDescriptorGroups(descriptor)?.collect {
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

    return aggregateToJson ? toJson(groups ?: []) : groups ?: []
}

/**
 * Метод проверки наличия динамических атрибутов
 * @param fqn - код метакласса для проверки
 * @return флаг на наличие динамических атрибутов
 */
boolean checkForDynamicAttributes(String fqn)
{
    List types = api.metainfo.getTypes(fqn).toList() + api.metainfo.getMetaClass(fqn)

    List typesWithDynamic = types.collect {
        it.attributes.any {
            it.code == AttributeType.TOTAL_VALUE_TYPE
        }
    }
    return typesWithDynamic.any { it == true }
}

/**
 * Метод получения связанных источников
 * @param requestContent - тело запроса
 * @return - список связанных источников
 */
String getLinkedDataSources(requestContent)
{
    def linkAttributes = getDataSourceAttributes(requestContent, false)
    def sources = mappingDataSource(linkAttributes, true)
    return toJson(sources)
}

/**
 * Метод получения максимального id типа у класса (необходимо при получении названий статусов у класса и его типов)
 * @param classFqn - fqn основного класса
 * @return id потомка, который использовался при запросе в БД
 */
String getMaxMetaCaseId(String classFqn)
{
    return api.db.query("select max(metaCaseId) from ${classFqn}").list().head()
}

/**
 * Метод получения карточки объекта по UUID-у
 * @param value - значение объекта типа (значение - UUID)
 * @return ссылка на карточку объекта в Json-формате
 */
String getCardObject(String value)
{
    if (value && ObjectMarshaller.unmarshal(value).size() > 1)
    {
        String objectUUID = ObjectMarshaller.unmarshal(value).last()
        def link = api.web.open(objectUUID)
        return toJson([link: link])
    }
}

/**
 * Метод проверки, является ли первый источник родительским классом для другого
 * (для таблицы источники с 2 по n-й - ссылочные атрибуты первого)
 * @param parentClassFqn - код класса предполагаемого родительского источника
 * @param childClassFqn - код предполагаемого дочернего источника (атрибут первого)
 * @return флаг true/false в json-формате
 */
String checkForParent(String parentClassFqn, String childClassFqn)
{
    //при проверке этим методом вернётся пустая строка, если атрибут есть, или сообщение об ошибке
    Boolean isParent = api.metainfo.checkAttributeExisting(parentClassFqn, childClassFqn).isEmpty()
    return toJson([result: isParent])
}

/**
 * Метод формирования ссылки для перехода на дашборд
 * @param dashboardCode - код дашборда целиком (fqn объекта, создавшего дб_uuid дашборда)
 * @return ссылка на на страницу с дошбордом в json-формате.
 */
String getDashboardLink(String dashboardCode)
{
    def root = api.utils.findFirst('root', [:])
    if (root.hasProperty('dashboardCode') && root.dashboardCode)
    {
        def appCode = root.dashboardCode
        def(subjectFqn, dashboardUUID) = DashboardCodeMarshaller.unmarshal(dashboardCode)

        def db = api.apps.listContents(appCode).find {
            it.contentUuid == dashboardUUID
        }
        String usedUUID = (user && user.metaClass?.toString() == subjectFqn) ? user.UUID : api.utils.findFirst(subjectFqn, ['removed': false]).UUID
        def link = api.web.openTab(usedUUID, db.tabUuid).replace('?anchor=', '#')
        return toJson([link: link])
    }
    throw new Exception('Для получения списка виджетов заполните корректно атрибут Компании dashboardCode')
}
//endregion