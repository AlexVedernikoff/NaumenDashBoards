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
@Field private static final String MAIN_FQN = 'abstractBO'
@Field private static final Collection<String> VALID_TYPE_ATTRIBUTE =
        ['object', 'dtInterval', 'date', 'dateTime', 'boLinks', 'catalogItemSet',
         'backBOLinks', 'string', 'integer', 'catalogItem', 'double', 'state']
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
    def children = getMetaClassChildren(classFqn)
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
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
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
            .sort{it.title}
}

/**
 * Маппинг из коллекция кодов всех атрибутов метакласса в Collection<Attribute>
 * Collection<fqnAttr> -> Collection<Attribute>
 * @param attributes - атрибуты метакласа
 * @param sourceName - название типа объекта
 */
private Collection<Attribute> mappingAttribute(def attributes, def sourceName)
{
    return attributes.findAll { it.type.code in VALID_TYPE_ATTRIBUTE && !it.computable}
            .collect {
                new Attribute(
                        it.code,
                        it.title,
                        it.type.code,
                        it.type.relatedMetaClass?.code,
                        it.declaredMetaClass.code,
                        sourceName)
            }.sort{it.title}
}
//endregion
