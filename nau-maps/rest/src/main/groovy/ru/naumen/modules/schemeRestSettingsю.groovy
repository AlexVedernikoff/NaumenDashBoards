//Автор: Tkacen-ko
//Дата создания: 04.08.2022
//Код: schemeRestSettings
//Назначение:
/**
 * Лицензионный скриптовый модуль встроенного приложения "Schemes".
 *
 * Содержит служебные методы для получения данных ВП Scheme
 */
//Версия: 1.0

package ru.naumen.modules.inventory

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Canonical

/**
 * Метод для получения данных об объектах для вывода на cхему
 * @param contentUuid - uuid карточки объекта
 * @return данные для схемы в json формате
 */
private String getSchemeData(String contentUuid = "schemesName")
{
    Collection<LinkedHashMap> defaultValue = []
    LinkedHashMap aggregations = []
    try
    {
        Collection<LinkedHashMap> getData =
            modules.schemeParamsSettings.getDataDisplayScheme(contentUuid) ?: defaultValue
        aggregations = [entities: getData]

    }
    catch (Exception ex)
    {
        logger.error("#schemeRestSettings> ${ ex.message }", ex)
    }
    return new ObjectMapper().writeValueAsString(aggregations)
}

public HierarchyCommunication createPointObjectBuilder()
{
    return new HierarchyCommunication()
}

/**
 * Метод для получения данных о точках на схеме
 * @param scriptData - данные из скрипта
 * @param id - уникальный номер сущности
 * @return сформированный объект оборудования
 */
HierarchyCommunication createHierarchyCommunicationPoint(def scriptData, Integer id)
{
    HierarchyCommunication hierarchyCommunicationBuilder = createPointObjectBuilder()
    hierarchyCommunicationBuilder.setDesc(scriptData.title)
    hierarchyCommunicationBuilder.setFrom(id, 'point')
    hierarchyCommunicationBuilder.setId(id)
    hierarchyCommunicationBuilder.setTitle(scriptData.title.split(':').first())
    hierarchyCommunicationBuilder.setType("point")
    return hierarchyCommunicationBuilder
}

/**
 * Метод для получения данных о связях между точками
 * @param equipment - оборудование из БД
 * @param id -Уникальный номер сущности
 * @return данные по линиям между точками
 */
HierarchyCommunication createHierarchyCommunicationLine(def scriptData,
                                                        Integer id,
                                                        Long idPoint)
{
    HierarchyCommunication hierarchyCommunicationBuilder = createPointObjectBuilder()
    hierarchyCommunicationBuilder.setDesc(scriptData.title)
    hierarchyCommunicationBuilder.setFrom(idPoint, 'line')
    hierarchyCommunicationBuilder.setTo(idPoint + 1)
    hierarchyCommunicationBuilder.setId(id)
    hierarchyCommunicationBuilder.setTitle(scriptData.title.split(':').first())
    hierarchyCommunicationBuilder.setType("line")
    return hierarchyCommunicationBuilder
}

/**
 * Тип действия
 */
enum ActionTypeSheme
{
    OPEN_LINK,
    CHANGE_RESPONSIBLE,
    CHANGE_STATE
}

/**
 * Класс, описывающий действие
 */
@Canonical
class ActionSheme
{
    /**
     * Тип дейстивя
     */
    ActionTypeSheme type
    /**
     * Название действия
     */
    String name

    public String getType()
    {
        return type.toString().toLowerCase()
    }

    public String getName()
    {
        return name
    }
}

class HierarchyCommunication
{
    /**
     * Описание элемента
     */
    String desc

    /**
     * Номер родителя у всех сущностей
     */
    Long from

    /**
     * Уникальный номер сущности
     */
    Long id

    /**
     * Имя элемента
     */
    String title

    /**
     * Только у линий, это номер точки к которой надо прикрепиться
     */
    Long to

    /**
     * тип сущности(точка или линия)
     */
    String type

    /**
     * Список возможных действий с объектом (для меню справа)
     */
    List<ActionSheme> actions = []

    public HierarchyCommunication setDesc(String desc)
    {
        this.desc = desc

        return this
    }

    public HierarchyCommunication setTitle(String title)
    {
        this.title = title
        return this
    }

    public HierarchyCommunication setType(String type)
    {
        this.type = type
        return this
    }

    public HierarchyCommunication setFrom(Long id, String type)
    {
        if (type == 'line')
        {
            this.from = id
            return this
        }
        if (id == 1)
        {
            this.from = null
        }
        else
        {
            this.from = id - 1
        }
        return this
    }

    public HierarchyCommunication setId(id)
    {
        this.id = id
        return this
    }

    public HierarchyCommunication setTo(to)
    {
        this.to = to
        return this
    }

    public HierarchyCommunication addAction(String name,
                                            String link,
                                            boolean inPlace = false)
    {
        this.actions.add(
            new OpenLinkAction(
                name: name,
                link: link,
                inPlace: inPlace,
                type: ActionTypeSheme.OPEN_LINK
            )
        )

        return this
    }
}
