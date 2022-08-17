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

public HierarchyCommunicationBuilder createPointObjectBuilder()
{
    return new HierarchyCommunicationBuilder()
}

/**
 * Метод для получения данных о точках на схеме
 * @param scriptData - данные из скрипта
 * @param id - уникальный номер сущности
 * @param from - точка к которой привязываеться текущий элемент
 * @return сформированный объект оборудования
 */
HierarchyCommunicationBuilder createHierarchyCommunicationPoint(def scriptData,
                                                                Integer id,
                                                                Long from = id)
{
    Collection settings = new SettingsProviderSchemes()
        .getSettings()
        ?.abstractSchemesCharacteristics?.first()?.strategies?.characteristicsOutputDiagram?.first()

    String descData =
        settings?.mainText?.first() ? scriptData."${ settings?.mainText?.first() }" : ''
    String titleData =
        settings?.additionalText?.first() ? scriptData."${ settings?.additionalText?.first() }" : ''

    HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
    hierarchyCommunicationBuilder.setDesc(descData)
    id == 1 ? hierarchyCommunicationBuilder.setFrom(1) : hierarchyCommunicationBuilder.setFrom(from)
    hierarchyCommunicationBuilder.setId(id)
    hierarchyCommunicationBuilder.setTitle(titleData)
    hierarchyCommunicationBuilder.setType("point")
    return hierarchyCommunicationBuilder
}

/**
 * Метод для получения данных о связях между точками
 * @param equipment - оборудование из БД
 * @param id -Уникальный номер сущности
 * @param from - точка к которой привязываеться текущий элемент
 * @return данные по линиям между точками
 */
HierarchyCommunicationBuilder createHierarchyCommunicationLine(def scriptData,
                                                               Integer id,
                                                               Long from = id)
{
    HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
    hierarchyCommunicationBuilder.setDesc(scriptData.title)
    hierarchyCommunicationBuilder.setFrom(from)
    hierarchyCommunicationBuilder.setTo(id + 1)
    hierarchyCommunicationBuilder.setId(id)
    hierarchyCommunicationBuilder.setTitle(scriptData.title)
    hierarchyCommunicationBuilder.setType("line")
    return hierarchyCommunicationBuilder
}

/**
 * Тип действия
 */
enum ActionTypeScheme
{
    OPEN_LINK,
    CHANGE_RESPONSIBLE,
    CHANGE_STATE
}

/**
 * Класс, описывающий действие
 */
@Canonical
class ActionScheme
{
    /**
     * Тип дейстивя
     */
    ActionTypeScheme type
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

class HierarchyCommunicationBuilder
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
    List<ActionScheme> actions = []

    public HierarchyCommunicationBuilder setDesc(String desc)
    {
        this.desc = desc

        return this
    }

    public HierarchyCommunicationBuilder setTitle(String title)
    {
        this.title = title
        return this
    }

    public HierarchyCommunicationBuilder setType(String type)
    {
        this.type = type
        return this
    }

    public HierarchyCommunicationBuilder setFrom(Long from)
    {
        this.from = from
        return this
    }

    public HierarchyCommunicationBuilder setId(id)
    {
        this.id = id
        return this
    }

    public HierarchyCommunicationBuilder setTo(to)
    {
        this.to = to
        return this
    }

    public HierarchyCommunicationBuilder addAction(String name,
                                                   String link,
                                                   boolean inPlace = false)
    {
        this.actions.add(
            new OpenLinkAction(
                name: name,
                link: link,
                inPlace: inPlace,
                type: ActionTypeScheme.OPEN_LINK
            )
        )
        return this
    }

}
