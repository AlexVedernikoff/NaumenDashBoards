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
import com.google.gson.internal.LinkedTreeMap
import org.jsoup.select.Elements
import org.jsoup.nodes.Document

/**
 * Метод для получения данных об объектах для вывода на cхему
 * @param objectUuid - uuid текущего объекта
 * @param contentUuid - uuid карточки объекта
 * @param userUuid - информация о текущем пользователе
 * @return данные для схемы в json формате
 */
private String getSchemeData(String objectUuid, String contentUuid, LinkedTreeMap userUuid = null)
{
    Collection<LinkedHashMap> defaultValue = []
    LinkedHashMap aggregations = []
    Object subjectObject = api.utils.get(objectUuid)
    Object userObject = userUuid['admin'] ?: api.utils.get(userUuid['uuid'])
    LinkedHashMap<String, Object> bindings = userUuid['admin'] ? ['subject': subjectObject] :
        ['subject': subjectUuid, 'user': userObject]
    try
    {
        Collection<LinkedHashMap> getData =
            modules.schemeParamsSettings.getDataDisplayScheme(contentUuid, bindings) ?: defaultValue
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
    public static final String NOT_SPECIFIED = 'не указано'
    public static final String DATA_TYPE_HYPERLINK = 'hyperlink'
    public static final String DATA_TYPE_BOOLEAN = 'bool'
    public static final String DATA_TYPE_DT_INTERVAL = 'dtInterval'
    public static final String DATA_TYPE_RICHTEXT = 'richtext'

    public HierarchyCommunicationBuilder createPointObjectBuilder()
    {
        return new HierarchyCommunicationBuilder()
    }
    Collection settingsСharacteristicsСommunicationHierarchy = new SettingsProviderSchemes()
        .getSettings()
        ?.abstractSchemesCharacteristics
        ?.first()?.strategies?.characteristicsOutputDiagram
    Collection settingsdefaultVisualization = new SettingsProviderSchemes()
        .getSettings()
        ?.defaultVisualizationSchemes

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
        String mainText = settingsСharacteristicsСommunicationHierarchy.first()?.mainText?.first()
        String additionalText =
            settingsСharacteristicsСommunicationHierarchy.first()?.additionalText?.first()

        String descData = mainText ? scriptData[mainText] : 'Не заполнено'
        String titleData = additionalText ? scriptData[additionalText] : 'Не заполнено'

        HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
        hierarchyCommunicationBuilder.setDesc(descData)
        if (id == 1)
        {
            hierarchyCommunicationBuilder.setFrom(null)
        }
        else
        {
            hierarchyCommunicationBuilder.setFrom(from)
        }
        hierarchyCommunicationBuilder.setId(id)
        hierarchyCommunicationBuilder.setTitle(titleData)
        hierarchyCommunicationBuilder.setType('point')
        hierarchyCommunicationBuilder.setUUID(scriptData.UUID)
        hierarchyCommunicationBuilder.setHeader(scriptData.title)
        hierarchyCommunicationBuilder
            .addAction('Перейти на карточку', api.web.open(scriptData.UUID))

        Collection attributesFromGroup =
            getSetAttributesOutputCharacteristics(settingsСharacteristicsСommunicationHierarchy)
        gettingDataForValueAndLinkElement(
            hierarchyCommunicationBuilder,
            scriptData,
            attributesFromGroup
        )

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
        hierarchyCommunicationBuilder
            .addAction('Перейти на карточку', api.web.open(scriptData.UUID))

        Collection attributesFromGroup =
            getSetAttributesOutputCharacteristics(settingsСharacteristicsСommunicationHierarchy)
        gettingDataForValueAndLinkElement(
            hierarchyCommunicationBuilder,
            scriptData,
            attributesFromGroup
        )
        return hierarchyCommunicationBuilder
    }

    /**
     * Добавление опций для вывода списка атрибутов на схеме
     * @param builder - объект с данными об элементе на карте
     * @param dbTrail - объект трассы из БД
     * @param attributesFromGroup - список атрибутов
     */
    void gettingDataForValueAndLinkElement(Object builder,
                                           ScriptDtObject dbTrail,
                                           Collection attributesFromGroup)
    {
        Object metaClassObject = new SettingsProviderSchemes()
            .getSettings()
            ?.abstractSchemesCharacteristics
            ?.first()?.strategies.first()?.metaclassObjects?.id
        attributesFromGroup.each { characteristicsDisplayObjects ->
            if (characteristicsDisplayObjects.metaclassName == metaClassObject)
            {
                characteristicsDisplayObjects.listAttribute.each { currentAttribute ->
                    String valueLabel
                    String linkElement
                    try
                    {
                        valueLabel = dbTrail[currentAttribute.code] ?: NOT_SPECIFIED
                        if (currentAttribute.type == 'object')
                        {
                            linkElement = api.web.open(dbTrail[currentAttribute.code].UUID)
                        }
                    }
                    catch (Exception ex)
                    {
                        logger
                            .error("Metaclass ${ dbTrail.UUID.split('\\$').first() } does not contain this attribute - ${ currentAttribute.code } \n${ ex.message }")
                    }
                    if (valueLabel && builder)
                    {
                        if (currentAttribute.type.code ==
                            DATA_TYPE_HYPERLINK && valueLabel != NOT_SPECIFIED)
                        {
                            Document doc = Jsoup.parse(valueLabel)
                            Elements links = doc.select('a[href]')
                            builder
                                .addOption(
                                    currentAttribute.title,
                                    new ValueSchemes(label: doc.text(), url: links.attr('href'))
                                )
                        }
                        else if (currentAttribute.type.code == 'state')
                        {
                            valueLabel = api.metainfo.getStateTitle(dbTrail)
                            builder
                                .addOption(
                                    currentAttribute.title,
                                    new ValueSchemes(label: valueLabel, url: linkElement)
                                )
                        }
                        else
                        {

                            builder
                                .addOption(
                                    currentAttribute.title,
                                    new ValueSchemes(
                                        label: formattedValueLabel(
                                            valueLabel,
                                            currentAttribute.type.code
                                        ), url: linkElement
                                    )
                                )
                        }
                    }
                }
            }
        }
    }

    /**
     * Получение списка характеристик для вывода в списке объектов
     * @param defaultSettingsWizardSettings - дефолтные настройки из мастера настроек
     * @return список дефолтных характеристик
     */
    Collection getSetAttributesOutputCharacteristics(def settingsСharacteristicsСommunicationHierarchy)
    {
        logger.info("LOGGER231 ${ settingsdefaultVisualization.getClass() }")
        logger.info("LOGGER232 ${ settingsСharacteristicsСommunicationHierarchy.getClass() }")

        Collection dataCharacteristicDisplayListObjects = []
        if (settingsСharacteristicsСommunicationHierarchy)
        {
            settingsСharacteristicsСommunicationHierarchy.first().each {
                dataCharacteristicDisplayListObjects.add(
                    new DataCharacteristicDisplayListObjectsSchemes(
                        it.metaclassObjects.id,
                        it.attributeGroup
                    )
                )
            }
        }
        else
        {
            settingsdefaultVisualization.each {
                dataCharacteristicDisplayListObjects.add(
                    new DataCharacteristicDisplayListObjectsSchemes(
                        it.metaClassObject.id,
                        it.attributeGroup
                    )
                )
            }
        }
        Collection<MetaclassNameAndAttributeListSchemes> attributesFromGroup = []
        dataCharacteristicDisplayListObjects.each {
            if (it.metaClassData && it.groupAttribute)
            {
                Collection listattributes =
                    api.metainfo.getMetaClass(it.metaClassData)
                       .getAttributeGroup(it.groupAttribute).attributes
                attributesFromGroup
                    .add(new MetaclassNameAndAttributeListSchemes(it.metaClassData, listattributes))
            }
        }
        return attributesFromGroup
    }

    /**
     * Метод по проверке и форматированию данных перед отправкой на фронт
     * @param valueLabel - значение атрибута
     * @param dataType - тип данных
     * @return правильно отформатированная строка
     */
    String formattedValueLabel(String valueLabel, String dataType)
    {
        LinkedHashMap<String, Collection> unitMeasurementTime = ['SECOND': ['секунда', 'секунды', 'секунд'], 'MINUTE': ['минута', 'минуты', 'минут'], 'HOUR': ['час', 'часа', 'часов'], 'DAY': ['день', 'дня', 'дней'], 'WEEK': ['неделя', 'недели', 'недель'], 'YEAR': ['год', 'года', 'лет']]
        if (valueLabel.matches('^\\[.+\\]$'))
        {
            valueLabel = valueLabel.substring(1, valueLabel.length() - 1)
        }
        else if (valueLabel instanceof ScriptDtObject)
        {
            valueLabel = valueLabel.title
        }
        else if (dataType == DATA_TYPE_BOOLEAN)
        {
            valueLabel = valueLabel == 'true' ? 'да' : 'нет'
        }
        else if (dataType == DATA_TYPE_DT_INTERVAL)
        {
            if (unitMeasurementTime[valueLabel.split(' ').last()])
            {
                valueLabel = fixNumerical(
                    valueLabel.split(' ').first().toInteger(),
                    unitMeasurementTime[valueLabel.split(' ').last()]
                )
            }
        }
        else if (dataType == DATA_TYPE_RICHTEXT)
        {
            valueLabel = Jsoup.parse(valueLabel).text()
        }
        return valueLabel
    }

    /**
     * Метод подбора правильного окончания для Русских числительных
     * @param numberHours - числительное для подбора окончания
     * @param arr - набор варинатов для заполнения строки
     * @return правильно отформатированная строка
     */
    String fixNumerical(Integer numberHours, Collection arr)
    {
        String result
        Integer num100 = numberHours % 100
        if (num100 > 4 && num100 < 21)
        {
            result = arr[2]
        }
        else
        {
            Integer num10 = num100 % 10
            if (num10 == 1)
            {
                result = arr[0]
            }
            else if (num10 > 1 && num10 < 5)
            {
                result = arr[1]
            }
            else
            {
                result = arr[2]
            }
        }
        return "${ numberHours } ${ result }"
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

class MetaclassNameAndAttributeListSchemes
{
    /**
     *  Имя метакласса
     */
    String metaclassName

    /**
     *  Список атрибутов
     */
    Collection listAttribute

    MetaclassNameAndAttributeListSchemes(String metaclassName, Collection listAttribute)
    {
        this.metaclassName = metaclassName
        this.listAttribute = listAttribute
    }
}

class DataCharacteristicDisplayListObjectsSchemes
{
    /**
     * Метакласс
     */
    String metaClassData

    /**
     * Группа атрибутов
     */
    String groupAttribute

    DataCharacteristicDisplayListObjectsSchemes(String metaClassData, String groupAttribute)
    {
        this.metaClassData = metaClassData
        this.groupAttribute = groupAttribute
    }
}
