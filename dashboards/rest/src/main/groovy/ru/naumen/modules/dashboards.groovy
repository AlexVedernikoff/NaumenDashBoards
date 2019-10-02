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
        ['aggregate', 'object', 'dtInterval', 'date', 'dateTime', 'boLinks', 'catalogItemSet',
         'backBOLinks', 'string', 'integer', 'catalogItem']
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
    String fqnCode
    /**
     * Название источника данных
     */
    String title
    /**
     * Дети источника даннных
     */
    Collection<DataSource> children
}

/**
 * Модель для атрибута
 */
@Immutable
class Attribute
{
    /**
     * Код атрибута
     */
    String code
    /**
     * Название атрибута
     */
    String title
    /**
     * Тип атрибута
     */
    String type
    /**
     * Свойство атрибута (метаклассы ссылочных атрибутов, значения элементов справочника и т.д)
     */
    String property
}
//endregion

//region REST-МЕТОДЫ
/**
 * Отдает список источников данных с детьми
 * @param fqnCode код метакласса
 * @return json список источников данных {заголовок, код, дети}
 */
String getDataSources(fqnCode = MAIN_FQN)
{
    def children = getMetaClassChildren(fqnCode)
    Collection<DataSource> dataSources = mappingDataSource(children)
    return toJson(dataSources)
}

/**
 * Отдает список атрибутов для источника данных
 * @param fqnCode код метакласса
 * @return json список атрибутов {заголовок, код, тип атрибута}
 */
String getAttributesDataSources(fqnCode){
    def attributes = api.metainfo.getMetaClass(fqnCode).attributes
    Collection<Attribute> mappingAttributes = mappingAttribute(attributes)
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
}

/**
 * Маппинг из коллекция кодов всех атрибутов метакласса в Collection<Attribute>
 * Collection<fqnAttr> -> Collection<Attribute>
 */
private Collection<Attribute> mappingAttribute(def attributes)
{
    return attributes
            .findResults{ it.type.code in VALID_TYPE_ATTRIBUTE
                    ? new Attribute(it.code,
                        it.title,
                        it.type.code,
                        it.type.relatedMetaClass?.code as String)
                    : null
            }
}
//endregion
