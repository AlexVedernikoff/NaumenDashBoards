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
import ru.naumen.core.server.script.api.injection.InjectApi
import groovy.transform.TupleConstructor

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

@InjectApi
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class ElementsScheme
{
    public HierarchyCommunicationBuilder createPointObjectBuilder()
    {
        return new HierarchyCommunicationBuilder()
    }
    Collection settings = new SettingsProviderSchemes()
        .getSettings()
        ?.abstractSchemesCharacteristics
        ?.first()?.strategies?.characteristicsOutputDiagram?.first()
    String metaClassSettingsWizard = settings?.metaclassObjects?.id.first()
    Collection attributesFromGroup =
        api.metainfo.getMetaClass(metaClassSettingsWizard)
           .getAttributeGroup(settings?.attributeGroup.first()).attributes
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
        String mainText = settings?.mainText?.first()
        String additionalText = settings?.additionalText?.first()

        String descData = mainText ? scriptData[mainText] : 'Не заполнено'
        String titleData =  additionalText ? scriptData[additionalText] : 'Не заполнено'

        HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
        hierarchyCommunicationBuilder.setDesc(titleData)
        if (id == 1)
        {
            hierarchyCommunicationBuilder.setFrom(null)
        }
        else
        {
            hierarchyCommunicationBuilder.setFrom(from)
        }
        hierarchyCommunicationBuilder.setId(id)
        hierarchyCommunicationBuilder.setTitle(descData)
        hierarchyCommunicationBuilder.setType('point')
        hierarchyCommunicationBuilder.setUUID(scriptData.UUID)
        hierarchyCommunicationBuilder.setHeader(scriptData.title)
        hierarchyCommunicationBuilder
            .addAction('Перейти на карточку', api.web.open(scriptData.UUID))
        attributesFromGroup.each {
            HashMap valueAndLink =
                gettingDataForValueAndLinkElement(it, scriptData, metaClassSettingsWizard, id)
            hierarchyCommunicationBuilder.addOption(
                it.title,
                new ValueSchemes(label: valueAndLink['value'], url: valueAndLink['link'])
            )
        }
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
        hierarchyCommunicationBuilder.setUUID(scriptData.UUID)
        hierarchyCommunicationBuilder.setHeader(scriptData.title)
        attributesFromGroup.each {
            HashMap valueAndLink =
                gettingDataForValueAndLinkElement(it, scriptData, metaClassSettingsWizard, id)
            hierarchyCommunicationBuilder.addOption(
                it.title,
                new ValueSchemes(label: valueAndLink['value'], url: valueAndLink['link'])
            )
        }
        hierarchyCommunicationBuilder
            .addAction('Перейти на карточку', api.web.open(scriptData.UUID))
        return hierarchyCommunicationBuilder
    }
    /**
     * Метод для получения данных о значении и ссылке на атрибут
     * @param currentAttribute - текущий атрибут в списке
     * @param scriptData - данные из скрипта
     * @param metaClassSettingsWizard - данные о метаклассе из мастера настроек
     * @param id - id текущего элемента
     * @return значение и ссылка на атрибут
     */
    HashMap gettingDataForValueAndLinkElement(Object currentAttribute,
                                              ScriptDtObject scriptData,
                                              String metaClassSettingsWizard,
                                              Integer id)
    {
        HashMap valueAndLink
        String valueLabel
        String linkElement
        try
        {
            valueLabel = scriptData[currentAttribute.code] ?: 'не указано'
            linkElement = api.web.open(scriptData[currentAttribute.code].UUID)
        }
        catch (Exception ex)
        {
            if (api.utils.find(metaСlassSettingsWizard, [:])[id])
            {
                valueLabel =
                    api.utils.find(metaСlassSettingsWizard, [:])[id][currentAttribute.code] ?:
                        'не указано'
                Object resul = api.metainfo.getMetaClass(metaСlassSettingsWizard).attributes.find {
                    attribute
                        ->
                        attribute.code == currentAttribute.code && attribute.type == 'object'
                }

                linkElement = resul ? api.web.open(
                    api.utils.find(metaСlassSettingsWizard, [:])[id][resul.code]?.UUID
                ) : null
            }
        }
        return valueAndLink = ['value': valueLabel, 'link': linkElement]
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
 * Класс, описывающий "опции"(выводимые атрибуты) для объекта (для меню справа)
 */
@TupleConstructor()
class OptionSchemes
{
    /**
     * Название опции
     */
    String label
    /**
     * Значение
     */
    ValueSchemes value
    /**
     * Формат отображения
     */
    String presentation
}

/**
 * Класс, описывающий значение атрибута (для меню справа)
 */
class ValueSchemes
{
    /**
     * Название объекта
     */
    String label = ''
    /**
     * Ссылка на карточку объекта
     */
    String url = ''
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
     * Уникальный идентификатор объекта
     */
    String UUID

    /**
     *  Название
     */
    String header

    /**
     * Список возможных действий с объектом (для меню справа)
     */
    List<ActionScheme> actions = []

    /**
     * Список возможных данных об объекте (для меню справа)
     */
    List<OptionSchemes> options = []

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
                type: 'OPEN_LINK'
            )
        )
        return this
    }

    public HierarchyCommunicationBuilder setUUID(String UUID)
    {
        this.UUID = UUID
        return this
    }

    public HierarchyCommunicationBuilder setHeader(String header)
    {
        this.header = header
        return this
    }

    public HierarchyCommunicationBuilder addOption(String label, ValueSchemes value)
    {
        this.options.add(
            new OptionSchemes(
                label: label,
                value: value,
                presentation: 'RIGHT_OF_LABEL'
            )
        )

        return this
    }
}
