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
    List<String> types = requestContent?.types
    def metaInfo = api.metainfo.getMetaClass(classFqn)
    List attributes = types ? metaInfo?.attributes?.findResults {
        it.type.code in types ? it : null
    } : metaInfo?.attributes?.toList()
    Collection<Attribute> mappingAttributes = attributes ?
        mappingAttribute(attributes, metaInfo.title, metaInfo.code) : []
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
    List<String> types = requestContent?.types

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

    Collection<Attribute> result = types
        ? metaInfo.attributes
                  .findResults {
                      !it.computable && it.type.code in types ? buildAttribute(it, metaInfo.title, metaInfo.code) : null
                  }
                  .sort {
                      it.title
                  }
        : metaInfo.attributes
                  .findResults {
                      !it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES ? buildAttribute(it, metaInfo.title, metaInfo.code) :
                          null
                  }
                  .sort {
                      it.title
                  }

    if (deep)
    {
        List childrenClasses = api.metainfo.getTypes(attributeClassFqn)?.toList()

        Collection<Attribute> attributeList = []
        childrenClasses.each {
            def metainfo = api.metainfo.getMetaClass(it)
            def attributes = metainfo?.attributes
            attributeList += types
                ? attributes ? attributes.findResults {
                !result*.code.find { x -> x == it.code
                } && !attributeList*.code.find { x -> x == it.code
                } && !it.computable && it.type.code in types
                    ? buildAttribute(it, metaInfo.title, metaInfo.code) : null
            } : []
                : attributes ? attributes.findResults {
                !result*.code.find { x -> x == it.code
                } && !attributeList*.code.find { x -> x == it.code
                } && !it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES ? buildAttribute(it, metaInfo.title, metaInfo.code) :
                    null
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
    String classFqn = requestContent.property
    def count = requestContent.count as int
    def offset = requestContent.offset as int
    def condition = removed ? [:] : [removed: false]

    def intermediateData = uuid
        ? getChildren(classFqn, uuid, condition + [parent: uuid])
        : getTop(classFqn, condition)

    def result = getObjects(intermediateData, count, offset).collect { object ->
        [
            title   : object.title,
            uuid    : object.UUID,
            property: object.metaClass as String,
            children: getAllInheritanceChains()
                .findAll { it*.code.contains(object.metaClass as String) }
                .collect { it*.code as Set }
                .inject([]) { first, second -> first + second }
                .collect { api.utils.count(it, [parent: object.UUID]) as int }
                .inject(0) { first, second -> first + second }
        ]
    }
    return toJson(result)
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
    def result =
        api.utils.find(classFqn, removeCondition + parentCondition, searchParameter).collect { el ->
            [
                title   : el.title,
                uuid    : el.UUID,
                children: api.utils.find(classFqn, removeCondition + [parent: el.UUID]).collect {
                    [
                        title: it.title,
                        uuid : it.UUID,
                    ]
                }
            ]
        }
    return toJson(result)
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

    def result =
        api.utils.find(classFqn, removeCondition + parentCondition, searchParameter).collect {
            [
                title: it.title,
                uuid : it.UUID
            ]
        }
    return toJson(result)
}

/**
 * Метод получения статусов объекта
 * @param classFqn - тип объекта
 * @return список статусов
 */
String getStates(String classFqn)
{
    def result = api.metainfo.getMetaClass(classFqn)
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
private List getObjects(List data, int requiredCount, int requiredOffset)
{
    if (!data)
    {
        return []
    }
    if (!requiredCount)
    {
        return []
    }
    def (classFqn, condition, int count) = data.head()
    int mainCount = (count - requiredOffset).with {
        it < 0 ? 0 : it
    }
    int remainCount = requiredCount - mainCount
    int remainOffset = (requiredOffset - count).with {
        it < 0 ? 0 : it
    }
    int realCount = requiredCount < mainCount ? requiredCount : mainCount
    def result = mainCount ? api.utils.find(
        classFqn, condition, sp.limit(realCount).offset(
        requiredOffset
    )
    ) : []
    return result + getObjects(data.tail(), remainCount, remainOffset)
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
 */
private Collection<DataSource> mappingDataSource(def fqns)
{
    return fqns.collect {
        new DataSource(
            it.code,
            it.title,
            mappingDataSource(it.children),
            checkForDynamicAttributes(it.code)
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
        !it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES ? buildAttribute(it, sourceName, sourceCode) : null
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
    List types = api.metainfo.getTypes(fqn).toList()

    List typesWithDynamic = types.collect {
        it.attributes.any {
            it.code == AttributeType.TOTAL_VALUE_TYPE
        }
    }
    return typesWithDynamic.any { it == true }
}
//endregion