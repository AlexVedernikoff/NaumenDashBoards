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
import com.fasterxml.jackson.annotation.JsonAutoDetect
import ru.naumen.core.server.script.spi.ScriptDtObject
import static com.amazonaws.util.json.Jackson.toJsonString as toJson

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

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class ElementsScheme
{
    private final Object logger

    ElementsScheme(Object logger)
    {
        this.logger = logger
    }

    public HierarchyCommunicationBuilder createPointObjectBuilder()
    {
        return new HierarchyCommunicationBuilder()
    }
    /**
     * Метод для получения данных о точках на схеме
     * @param scriptData - данные из скрипта
     * @param id - уникальный номер сущности
     * @param from - точка, к которой привязывается текущий элемент
     * @return сформированный объект оборудования
     */
    HierarchyCommunicationBuilder createHierarchyCommunicationPoint(ScriptDtObject scriptData,
                                                                    Integer id,
                                                                    Long from = id)
    {

        Collection settings = new SettingsProviderSchemes()
            .getSettings()
            ?.abstractSchemesCharacteristics
            ?.first()?.strategies?.characteristicsOutputDiagram?.first()

        String mainText = settings?.mainText?.first()
        String additionalText = settings?.additionalText?.first()
        String descData = mainText ? scriptData."${ mainText }" : ''
        String titleData = additionalText ? scriptData."${ additionalText }" : ''

        HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
        hierarchyCommunicationBuilder.setDesc(descData)
        if (id == 1)
        {
            hierarchyCommunicationBuilder.setFrom(1)
        }
        else
        {
            hierarchyCommunicationBuilder.setFrom(from)
        }
        hierarchyCommunicationBuilder.setId(id)
        hierarchyCommunicationBuilder.setTitle(titleData)
        hierarchyCommunicationBuilder.setType('point')
        hierarchyCommunicationBuilder.setUUID(scriptData.UUID)
        return hierarchyCommunicationBuilder
    }

    /**
     * Метод для получения данных о связях между точками
     * @param equipment - оборудование из БД
     * @param id -Уникальный номер сущности
     * @param from - точка, к которой привязывается текущий элемент
     * @return данные по линиям между точками
     */
    HierarchyCommunicationBuilder createHierarchyCommunicationLine(ScriptDtObject scriptData,
                                                                   Integer id,
                                                                   Long from = id)
    {
        HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
        hierarchyCommunicationBuilder.setDesc(scriptData.title)
        hierarchyCommunicationBuilder.setFrom(from)
        hierarchyCommunicationBuilder.setTo(id + 1)
        hierarchyCommunicationBuilder.setId(id)
        hierarchyCommunicationBuilder.setTitle(scriptData.title)
        hierarchyCommunicationBuilder.setType('line')
        return hierarchyCommunicationBuilder
    }
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
     * Все данные
     */
    String UUID

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

    public HierarchyCommunicationBuilder setUUID(String UUID)
    {
        this.UUID = UUID
        return this
    }

}
