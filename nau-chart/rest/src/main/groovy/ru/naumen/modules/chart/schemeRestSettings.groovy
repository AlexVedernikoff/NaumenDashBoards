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

package ru.naumen.modules.chart

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
import ru.naumen.core.shared.dto.ISDtObject
import groovy.transform.Canonical
import ru.naumen.core.server.script.api.metainfo.MetaClassWrapper
import org.jsoup.Jsoup

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
    contentUuid = "${api.utils.get(objectUuid).getMetainfo()}_${contentUuid}".toString()
    LinkedHashMap<String, Object> bindings = userUuid['admin'] ? ['subject': subjectObject] :
        ['subject': subjectObject, 'user': userObject]
    try
    {
        Collection<Collection<HierarchyCommunicationBuilder>> getData =
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
    public static final String DATA_TYPE_BO_LINKS = 'boLinks'
    public static final String DATA_TYPE_BACK_BO_LINKS = 'backBOLinks'
    public static final String DATA_TYPE_BOOLEAN = 'bool'
    public static final String DATA_TYPE_DT_INTERVAL = 'dtInterval'
    public static final String DATA_TYPE_RICHTEXT = 'richtext'
    public static final String DATA_TYPE_METACLASS = 'metaClass'

    public HierarchyCommunicationBuilder createPointObjectBuilder()
    {
        return new HierarchyCommunicationBuilder()
    }
    Collection settingsCharacteristicsCommunicationHierarchy = new SettingsProviderSchemes()
        .getSettings()
        ?.abstractSchemesCharacteristics
        ?.first()?.strategies?.characteristicsOutputDiagram
    Collection settingsDefaultVisualization = new SettingsProviderSchemes()
        .getSettings()
        ?.defaultVisualizationSchemes

    /**
     * Метод для получения данных о точках на схеме
     * @param scriptData - данные из скрипта
     * @param currentStrategy - текущая вкладка настроек из мастера
     * @param id - уникальный номер сущности
     * @param from - точка, к которой привязывается текущий элемент
     * @return сформированный объект оборудования
     */
    HierarchyCommunicationBuilder createHierarchyCommunicationPoint(ISDtObject scriptData,
                                                                    Object currentStrategy,
                                                                    Long id,
                                                                    Long from = id)
    {
        HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
        hierarchyCommunicationBuilder.setTitle(scriptData.title)
        if (id == 1)
        {
            hierarchyCommunicationBuilder.setFrom(null)
        }
        else
        {
            hierarchyCommunicationBuilder.setFrom(from)
        }
        hierarchyCommunicationBuilder.setId(id)
        hierarchyCommunicationBuilder.setType('point')
        hierarchyCommunicationBuilder
            .setCodeEditingForm(getCodeEditingForm(api.metainfo.getMetaClass(scriptData)))
        hierarchyCommunicationBuilder.setUUID(scriptData.UUID)

        hierarchyCommunicationBuilder
            .addAction('Перейти на карточку', api.web.open(scriptData.UUID))

        MetaclassNameAndAttributeListSchemes attributesFromGroup =
            getAttributesFromGroup(scriptData, currentStrategy)
        hierarchyCommunicationBuilder
            .setDesc(getTextToElement(attributesFromGroup, scriptData).additionalText)
        hierarchyCommunicationBuilder
            .setHeader(getTextToElement(attributesFromGroup, scriptData).mainText)
        hierarchyCommunicationBuilder.setIcon(getIconToPoint(attributesFromGroup, scriptData))
        gettingDataForValueAndLinkElement(
            hierarchyCommunicationBuilder,
            scriptData,
            attributesFromGroup
        )

        return hierarchyCommunicationBuilder
    }

    /**
     * Метод для получения данных о связях между точками
     * @param scriptData - оборудование из БД
     * @param currentStrategy - текущая вкладка настроек из мастера
     * @param id -Уникальный номер сущности
     * @param from - точка, к которой привязывается текущий элемент
     * @return данные по линиям между точками
     */
    HierarchyCommunicationBuilder createHierarchyCommunicationLine(ISDtObject scriptData,
                                                                   Object currentStrategy,
                                                                   Long id,
                                                                   Long from = id,
                                                                   Long to = id + 1)
    {
        HierarchyCommunicationBuilder hierarchyCommunicationBuilder = createPointObjectBuilder()
        hierarchyCommunicationBuilder.setUUID(scriptData?.UUID)
        hierarchyCommunicationBuilder.setTitle(scriptData?.title)
        hierarchyCommunicationBuilder
            .setCodeEditingForm(getCodeEditingForm(api.metainfo.getMetaClass(scriptData)))
        hierarchyCommunicationBuilder.setFrom(from)
        hierarchyCommunicationBuilder.setTo(to)
        hierarchyCommunicationBuilder.setId(id)
        hierarchyCommunicationBuilder.setType('line')
        if (scriptData)
        {
            hierarchyCommunicationBuilder
                .addAction('Перейти на карточку', api.web.open(scriptData?.UUID))
        }

        MetaclassNameAndAttributeListSchemes attributesFromGroup =
            getAttributesFromGroup(scriptData, currentStrategy)
        hierarchyCommunicationBuilder
            .setDesc(getTextToElement(attributesFromGroup, scriptData).additionalText)
        hierarchyCommunicationBuilder
            .setHeader(getTextToElement(attributesFromGroup, scriptData).mainText)
        hierarchyCommunicationBuilder.setIcon(getIconToPoint(attributesFromGroup, scriptData))
        gettingDataForValueAndLinkElement(
            hierarchyCommunicationBuilder,
            scriptData,
            attributesFromGroup
        )
        return hierarchyCommunicationBuilder
    }

    /**
     * Получить данные с информацией о группе атрибутов
     * @param scriptData - оборудование из БД
     * @param currentStrategy - текущая вкладка настроек из мастера
     * @return информация о группе атрибутов
     */
    MetaclassNameAndAttributeListSchemes getAttributesFromGroup(ISDtObject scriptData,
                                                                Object currentStrategy)
    {
        MetaclassNameAndAttributeListSchemes attributesFromGroup
        if (scriptData && currentStrategy?.characteristicsOutputDiagram)
        {
            attributesFromGroup = characteristicsOutputDiagram(
                scriptData,
                currentStrategy?.characteristicsOutputDiagram
            )
        }
        if (!attributesFromGroup && settingsDefaultVisualization)
        {
            attributesFromGroup =
                characteristicsOutputDiagram(scriptData, settingsDefaultVisualization)
        }
        return attributesFromGroup
    }

    /**
     * Получить данные о главном и дополнительном тексте
     * @param attributesFromGroup - информация о группе атрибутов
     * @param scriptData - оборудование из БД
     * @return данные о главном и дополнительном тексте
     */
    Map getTextToElement(MetaclassNameAndAttributeListSchemes attributesFromGroup,
                         ISDtObject scriptData)
    {
        String mainText
        String additionalText
        if (attributesFromGroup && scriptData.hasProperty(attributesFromGroup.mainTextAttribute))
        {
            mainText = scriptData[attributesFromGroup.mainTextAttribute] ?
                scriptData[attributesFromGroup.mainTextAttribute].toString() : null
        }
        if (attributesFromGroup &&
            scriptData.hasProperty(attributesFromGroup.additionalTextAttribute))
        {
            additionalText = scriptData[attributesFromGroup.additionalTextAttribute] ?
                scriptData[attributesFromGroup.additionalTextAttribute].toString() : null
        }
        return ['mainText': mainText, 'additionalText': additionalText]
    }

    /**
     * Получить ссылку на иконку
     * @param attributesFromGroup - информация о группе атрибутов
     * @param scriptData - оборудование из БД
     * @return ссылка на иконку
     */
    String getIconToPoint(MetaclassNameAndAttributeListSchemes attributesFromGroup,
                          ISDtObject scriptData)
    {
        String basisForLinkIcon = "${ api.web.getBaseUrl() }${ 'download?uuid=' }"
        String linkToIcon = api.utils.findFirst('root', [:]).hasProperty('defPointIcon') &&
                            api.utils.findFirst('root', [:])?.defPointIcon ?
            "${ basisForLinkIcon }${ api.utils.findFirst('root', [:])?.defPointIcon?.UUID?.first() }" :
            null
        if (attributesFromGroup &&
            scriptData.hasProperty(attributesFromGroup.iconAttribute) &&
            scriptData[attributesFromGroup.iconAttribute])
        {
            linkToIcon = "${ basisForLinkIcon }${ scriptData[attributesFromGroup.iconAttribute].UUID.first() }"
        }
        return linkToIcon
    }

    /**
     * Метод получения кода редактирования, при его наличии в мастере
     * @param scriptData - оборудование из БД
     * @return код формы редактирования
     */
    String getCodeEditingForm(MetaClassWrapper scriptData)
    {
        if (!scriptData)
        {
            return null
        }

        Collection<ActionsWithObjects> actionsWithObjects = new SettingsProviderSchemes()
            .getSettings()?.actionsWithObjects
        String codeParent
        String codeSystemObject = scriptData.code

        ActionsWithObjects action = actionsWithObjects.find {
            getCodeMetaClass(it) == codeSystemObject
        }

        if (!action)
        {
            action = actionsWithObjects.find {
                getCodeMetaClass(it) == scriptData?.parent?.code
            }
        }

        if (!action)
        {
            action = actionsWithObjects.find {
                getCodeMetaClass(it) == codeSystemObject.tokenize('$')?.first()
            }
        }

        if (!action)
        {
            codeParent = getCodeEditingForm(scriptData.parent)
        }

        return action ? action.codeEditingForm : codeParent
    }

    /**
     * Добавление опций для вывода списка атрибутов на схеме
     * @param builder - объект с данными об элементе на карте
     * @param dbTrail - объект трассы из БД
     * @param attributesFromGroup - список атрибутов
     */
    void gettingDataForValueAndLinkElement(Object builder,
                                           ISDtObject dbTrail,
                                           MetaclassNameAndAttributeListSchemes attributesFromGroup)
    {
        if (attributesFromGroup)
        {
            attributesFromGroup.listAttributes.each { currentAttribute ->
                String valueLabel
                String linkElement
                Collection<ValueSchemes> boLinkTypeAttribute = []
                if (dbTrail.hasProperty(currentAttribute.code) && builder)
                {
                    valueLabel = dbTrail[currentAttribute.code] ?: NOT_SPECIFIED
                    if (currentAttribute.type.code == 'object' && dbTrail[currentAttribute.code])
                    {
                        linkElement = api.web.open(dbTrail[currentAttribute.code].UUID)
                    }
                    if (currentAttribute.type.code in [DATA_TYPE_BO_LINKS, DATA_TYPE_BACK_BO_LINKS])
                    {
                        dbTrail[currentAttribute.code].each {
                            boLinkTypeAttribute
                                .add(new ValueSchemes(label: it.title, url: api.web.open(it.UUID)))
                        }
                    }
                    if (valueLabel)
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
                        else if (currentAttribute.type.code in [DATA_TYPE_BO_LINKS,
                                                                DATA_TYPE_BACK_BO_LINKS])
                        {
                            if (!boLinkTypeAttribute)
                            {
                                boLinkTypeAttribute
                                    .add(new ValueSchemes(label: NOT_SPECIFIED, url: null))
                            }
                            builder.addOption(currentAttribute.title, boLinkTypeAttribute)
                        }
                        else if (currentAttribute.type.code in DATA_TYPE_METACLASS)
                        {
                            builder.addOption(
                                currentAttribute.title,
                                new ValueSchemes(
                                    label: api.metainfo.getMetaClass(dbTrail).title,
                                    url: null
                                )
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
     * @param scriptData - данные из скрипта
     * @param characteristics - характеристик из мастера
     * @return список характеристик
     */
    MetaclassNameAndAttributeListSchemes characteristicsOutputDiagram(ISDtObject scriptData,
                                                                      Object characteristics)
    {
        Object dataCharacteristicDisplay = findingMetaclassMatches(
            api.metainfo.getMetaClass(scriptData),
            characteristics
        )
        MetaclassNameAndAttributeListSchemes attributesFromGroup
        if (dataCharacteristicDisplay)
        {
            String metaClassData =
                dataCharacteristicDisplay?.metaClassObjects?.caseId ? String.join(
                    '$',
                    dataCharacteristicDisplay?.metaClassObjects?.id,
                    dataCharacteristicDisplay?.metaClassObjects?.caseId
                ) :
                    dataCharacteristicDisplay?.metaClassObjects?.id
            Collection listAttributes = []
            if (dataCharacteristicDisplay?.attributeGroup)
            {
                listAttributes =
                    api.metainfo.getMetaClass(api.metainfo.getMetaClass(scriptData).code)
                       .getAttributeGroup(dataCharacteristicDisplay?.attributeGroup).attributes
            }
            attributesFromGroup = new MetaclassNameAndAttributeListSchemes(
                metaClassData,
                dataCharacteristicDisplay.mainText,
                dataCharacteristicDisplay.additionalText,
                listAttributes,
                dataCharacteristicDisplay.icon
            )
        }

        return attributesFromGroup
    }

    /**
     * Получение соответствующего объекту набора характеристик для вывода в списке объектов
     * @param metaClassInfo - метаинформация об объекте
     * @param characteristicsForOutput - список всех характеристик из мастера
     * @return характеристика для объекта
     */
    Object findingMetaclassMatches(MetaClassWrapper metaClassInfo,
                                   Collection characteristicsForOutput)
    {
        Object characteristicsDisplay
        if (!metaClassInfo)
        {
            return null
        }
        characteristicsDisplay = characteristicsForOutput.find {
            metaClassInfo?.code == getCodeMetaClass(it)
        }
        if (!characteristicsDisplay)
        {
            characteristicsForOutput.each {
                if (metaClassInfo?.parent?.code ==
                    getCodeMetaClass(it) &&
                    it?.metaClassObjects?.id == metaClassInfo?.code?.tokenize('$')?.first())
                {
                    characteristicsDisplay = it
                }
                else if (metaClassInfo?.code == getCodeMetaClass(it))
                {
                    characteristicsDisplay = it
                }
                else
                {
                    characteristicsDisplay =
                        findingMetaclassMatches(metaClassInfo.parent, characteristicsForOutput)
                }
            }
        }
        return characteristicsDisplay
    }

    /**
     * Метод получения кода метакласса из мастера настроек
     * @param wizardSettingsElement - текущая вкладка настроек мастера
     * @return код метакласса
     */
    String getCodeMetaClass(Object wizardSettingsElement)
    {
        return wizardSettingsElement?.metaClassObjects?.caseId ? String.join(
            '$',
            wizardSettingsElement?.metaClassObjects?.id,
            wizardSettingsElement?.metaClassObjects?.caseId
        ) : wizardSettingsElement?.metaClassObjects?.id
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
    Collection<ValueSchemes> value
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

@Canonical
class OpenLinkActionScheme extends ActionScheme
{
    /**
     * Ссылка
     */
    String link
    /**
     * Флаг на открытие в текущей вкладке
     */
    boolean inPlace
}

@Canonical
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

    /**
     * Код формы редактирования
     */
    String codeEditingForm

    /**
     * Ссылка на иконку
     */
    String icon

    HierarchyCommunicationBuilder setCodeEditingForm(String codeEditingForm)
    {
        this.codeEditingForm = codeEditingForm
        return this
    }

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

    public HierarchyCommunicationBuilder setId(Long id)
    {
        this.id = id
        return this
    }

    public HierarchyCommunicationBuilder setTo(Long to)
    {
        this.to = to
        return this
    }

    public HierarchyCommunicationBuilder addAction(String name,
                                                   String link,
                                                   boolean inPlace = false)
    {
        this.actions.add(
            new OpenLinkActionScheme(
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
                value: [value],
                presentation: 'RIGHT_OF_LABEL'
            )
        )

        return this
    }

    public HierarchyCommunicationBuilder addOption(String label, Collection<ValueSchemes> value)
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

    public HierarchyCommunicationBuilder setIcon(String icon)
    {
        this.icon = icon
        return this
    }
}

@Canonical
class MetaclassNameAndAttributeListSchemes
{
    /**
     *  Имя метакласса
     */
    String metaclassName

    /**
     *  Атрибут главного текста
     */
    String mainTextAttribute

    /**
     *  Атрибут дополнительного текста
     */
    String additionalTextAttribute

    /**
     *  Список атрибутов
     */
    Collection listAttributes

    /**
     *  Атрибут иконки
     */
    String iconAttribute

}

@Canonical
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
}
