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
package ru.naumen.modules


import groovy.transform.Field
import groovy.transform.Immutable

import static groovy.json.JsonOutput.toJson

//region КОНСТАНТЫ
// TODO: добавить aggregate, responsible, metaClass,
@Field private static final String MAIN_FQN = 'abstractBO'
@Field private static final Collection<String> VALID_LINK_TYPE_ATTRIBUTE =
        ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem', 'metaClass']
@Field private static final Collection<String> VALID_SIMPLE_TYPE_ATTRIBUTE =
        ['dtInterval', 'date', 'dateTime', 'string', 'integer', 'double', 'state', 'localizedText']
@Field private static final Collection<String> VALID_TYPE_ATTRIBUTE =
        ['object', 'boLinks', 'catalogItemSet', 'backBOLinks', 'catalogItem', 'metaClass',
         'dtInterval', 'date', 'dateTime', 'string', 'integer', 'double', 'state', 'localizedText']
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
 * @param classFqn код метакласса
 * @return json список атрибутов {заголовок, код, тип атрибута}
 */
String getAttributesDataSources(classFqn)
{
    def metaInfo = api.metainfo.getMetaClass(classFqn)
    Collection<Attribute> mappingAttributes = mappingAttribute(metaInfo.attributes, metaInfo.title)
    return toJson(mappingAttributes)
}

/**
 * Отдаёт список атрибутов метакласа ссылочного типа атрибута
 * @param requestContent - Запрос на получение атрибутов
 * @return json список атрибутов {заголовок, код, тип атрибута}
 */
String getAttributesFromLinkAttribute(requestContent)
{
    def linkAttribute = requestContent.linkAttribute as Map
    String attributeType = linkAttribute.type
    if (!(attributeType in VALID_LINK_TYPE_ATTRIBUTE))
        throw new Exception("Not supported type: ${attributeType}")

    String attributeClassFqn = linkAttribute.property
    def metaInfo = api.metainfo.getMetaClass(attributeClassFqn)
    Closure<Attribute> buildAttribute = { obj ->
        new Attribute(
                code: obj.code,
                title: obj.title,
                type: obj.type.code,
                property: obj.type.relatedMetaClass as String,
                metaClassFqn: obj.declaredMetaClass.code,
                sourceName: metaInfo.title)
    }

    Collection<Attribute> result = metaInfo.attributes
            .findResults { !it.computable && it.type.code in VALID_TYPE_ATTRIBUTE ? buildAttribute(it) : null }
            .sort { it.title }

    return toJson(result)
}

String getAttributeObject(Map requestContent) {
    String uuid = requestContent.parentUUID
    boolean removed = requestContent.removed
    String classFqn = requestContent.property
    def count = requestContent.count as int
    def offset = requestContent.offset as int
    def condition = removed ? [:] : [removed: false]

    def intermediateData = uuid
            ? getChildren(classFqn, uuid, condition + [parent: uuid])
            : getTop(classFqn, condition)

    def result = getObjects(intermediateData, count, offset).collect { el ->
        [
                title   : el.title,
                uuid    : el.UUID,
                property: el.metaClass as String,
                children: getAllInheritanceChains()
                        .findAll { it*.code.contains(el.metaClass as String) }
                        .collect { it*.code as Set }
                        .inject { first, second -> first + second }
                        .collect { api.utils.count(it, [parent: el.UUID]) as int }
                        .inject(0) {first, second -> first + second}
        ]
    }
    return toJson(result)
}

String getCatalogObject(Map requestContent) {
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
    count?.with { searchParameter.limit(it as int) }
    offset?.with { searchParameter.offset(offset as int) }
    def result = api.utils.find(classFqn, removeCondition + parentCondition, searchParameter).collect { el ->
        [
                title   : el.title,
                uuid    : el.UUID,
                children: api.utils.find(classFqn, removeCondition + [parent: el.UUID]).collect {
                    [
                            title   : it.title,
                            uuid    : it.UUID,
                    ]
                }
        ]
    }
    return toJson(result)
}

String getCatalogItemObject(Map requestContent) {
    String uuid = requestContent.parentUUID
    String classFqn = requestContent.property
    def count = requestContent.count
    def offset = requestContent.offset
    boolean removed = requestContent.removed

    def removeCondition = removed != null ? [removed: removed as boolean] : [:]
    def parentCondition = uuid ? [parent: uuid] : [parent: op.isNull()]

    def searchParameter = sp.createInstance()
    count?.with { searchParameter.limit(it as int) }
    offset?.with { searchParameter.offset(offset as int) }

    def result = api.utils.find(classFqn, removeCondition + parentCondition, searchParameter).collect { el ->
        [
                title   : el.title,
                uuid    : el.UUID
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
            ?.sort { it.title }
            ?.collect { [title: it.title, uuid: it.code] } ?: []
    return toJson(result)
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
            ?.collect { [title: it.title, uuid: it.code] } ?: []
    return toJson(result)
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
private List getTop(String classFqn, Map condition) {
    return getPossibleParentTypes(api.metainfo.getMetaClass(classFqn)).collect { metaClass ->
        def parentMetaInfo = getAttributeParent(metaClass)
        def additionalCondition = parentMetaInfo ? [parent: op.isNull()] : [:]
        int count = utils.count(metaClass.code, condition + additionalCondition)
        [metaClass.code, condition + additionalCondition, count]
    }
}

private List getChildren(String classFqn, String uuid, Map condition) {
    def parentType = api.utils.get(uuid).metaClass
    return getAllInheritanceChains().findAll { it*.code.contains(classFqn) }.collect { set ->
        set.iterator()
                .dropWhile { it.code != classFqn }.reverse()
                .dropWhile { it.code != parentType.code }.collect { it.code }
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
    if (!data) return []
    if (!requiredCount) return []
    def (classFqn, condition, int count) = data.head()
    int mainCount = (count - requiredOffset).with { it < 0 ? 0 : it }
    int remainCount = requiredCount - mainCount
    int remainOffset = (requiredOffset - count).with { it < 0 ? 0 : it }
    int realCount = requiredCount < mainCount ? requiredCount : mainCount
    def result = mainCount ? api.utils.find(classFqn, condition, sp.limit(realCount).offset(requiredOffset)) : []
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
        return chains
    def set = chains.head() as Set
    def other = chains.tail().with(this.&getUniqueTypeSet)
    return other.any { it*.code.containsAll(set*.code) } ? other : [set] + other
}

/**
 * Метод получения атрибута parent из метакласса
 * @param metaClass - метаклас
 * @return атрибут parent или null
 */
private def getAttributeParent(def metaClass)
{
    return metaClass?.attributes?.find { (it.code == 'parent') }
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
    return fqns.collect { new DataSource(it.code, it.title, mappingDataSource(it.children)) }
            .sort { it.title }
}

/**
 * Маппинг из коллекция кодов всех атрибутов метакласса в Collection<Attribute>
 * Collection<fqnAttr> -> Collection<Attribute>
 * @param attributes - атрибуты метакласа
 * @param sourceName - название типа объекта
 */
private Collection<Attribute> mappingAttribute(def attributes, def sourceName)
{
    Closure<Attribute> buildAttribute = {
        new Attribute(
                code: it.code,
                title: it.title,
                type: it.type.code,
                property: it.type.relatedMetaClass as String,
                metaClassFqn: it.declaredMetaClass.code,
                sourceName: sourceName)
    }
    return attributes
            .findResults { !it.computable && it.type.code in VALID_TYPE_ATTRIBUTE ? buildAttribute(it) : null }
            .sort { it.title }
}
//endregion
