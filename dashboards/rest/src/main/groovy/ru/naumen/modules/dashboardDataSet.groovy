/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Бекенд для получения данных и построения графиков в встроенном приложении "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль

package ru.naumen.modules

import groovy.transform.TupleConstructor

import static groovy.json.JsonOutput.toJson
import ru.naumen.core.server.hquery.HCriteria;
import ru.naumen.core.server.hquery.HHelper;
import ru.naumen.core.server.hquery.HRestrictions

//region enum
/**
 * Типы агрегации даннных для диаграмм. SUM, AVG, MAX, MIN, MDN только для числовых типов
 */
enum AggregationType
{
    COUNT_CNT('COUNT(%s)'),
    PERCENT('COUNT(%s)*100/(Select Count(*) From %s)'),
    SUM('SUM(%s)'),
    AVG('AVG(%s)'),
    MAX('MAX(%s)'),
    MIN('MIN(%s)'),
    MDN('%s')

    AggregationType(String aggregationFormat)
    {
        this.aggregationFormat = aggregationFormat
    }

    String aggregationFormat

    String get(String... codes)
    {
        return String.format(aggregationFormat, codes)
    }
}
//endregion

//region КЛАССЫ
/**
 * Модель тело запроса - Полученик данных для диаграммы
 */
@TupleConstructor
class RequestGetDataForDiagram
{
    /**
     * Тип диаграммы
     */
    Diagram type
    /**
     * Код источника данных
     */
    String source
    /**
     * Атрибут по x оси
     */
    Attribute xAxis = null
    /**
     * Атрибут для y оси
     */
    Attribute yAxis = null
    /**
     * Атрибут для разбивки
     */
    Attribute breakdown = null
    /**
     * Атрибут для показателя
     */
    Attribute indicator = null
    /**
     * Тип группировки данных
     */
    GroupType group = "OVERLAP"
    /**
     * Тип агрегации данных
     */
    AggregationType aggregation = "COUNT_CNT"
    /**
     * Рычаг подсчитывать итоги для column
     */
    Boolean calcTotalColumn = null
    /**
     * Рычаг подсчитывать итоги для row
     */
    Boolean calcTotalRow = null
    /**
     * Атрибут для column
     */
    Attribute column = null
    /**
     * Атрибут для row
     */
    Attribute row = null

    /**
     * Json дескриптор
     */
    String descriptor
}

/**
 * Модель тело запроса - Полученик данных для диаграммы
 */
@TupleConstructor
class RequestGetDataForComboDiagram
{
    Collection<RequestGetDataForDiagram> charts
    String type
}

/**
 * Модель данных для диаграмм BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE
 */
@TupleConstructor
class StandardDiagram
{
    /**
     * список значений для оси x
     */
    Collection<Object> categories = []
    /**
     * список значений Series
     */
    Collection<Series> series = []
}

/**
 * Модель данных для значений по y с разбивкой
 */
@TupleConstructor
class Series
{
    /**
     * Значение разбивки
     */
    Object name = null
    /**
     * Список значений для y оси
     */
    Collection<Object> data = []
}

/**
 * Модель данных для диаграмм DONUT, PIE
 */
@TupleConstructor
class RoundDiagram
{
    /**
     * список меток для построения диаграммы
     */
    Collection<Object> labels = []
    /**
     * список значений для построения диаграммы
     */
    Collection<Object> series = []
}

/**
 * Модель данных для диаграммы SUMMARY
 */
@TupleConstructor
class SummaryDiagram
{
    /**
     * Название атрибута
     */
    String title
    /**
     * Значение атрибута с учетом выбранной агрегации
     */
    Object total
}
//endregion

//region REST-МЕТОДЫ
/**
 * Получение данных для диаграмм
 * @param requestContent тело запроса в формате {@link RequestGetDataForDiagram}
 * @return данные для построения диаграммы
 */
String getDataForDiagram(Map<String, Object> requestContent)
{
    def request = new RequestGetDataForDiagram(requestContent)

    HCriteria criteria = request.descriptor ? getQueryFromDescriptor(deserializeDescriptor(request.descriptor)) :
            HHelper.create().addSource(request.source)

    switch (request.type) {
        case Diagram.with{[BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, LINE]} :
            return toJson(getDataStandardDiagram(criteria, request))
        case Diagram.with{[DONUT, PIE]} :
            return getDataRoundDiagram(criteria, request)
        case Diagram.SUMMARY :
            return getDataSummaryDiagram(criteria, request)
        default:
            throw new Exception(toJson([error: "Not supported diagram type: ${request.type}"]))
    }
}
//endregion

//region ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
/**
 * Группировка данных для диаграммы
 * @param criteria HCriteria основной таблицы
 * @param groupType тип группировки
 * @param xAxis атрибут для группировки
 */
private void group(HCriteria criteria, GroupType groupType, Attribute xAxis, String source)
{
    String attributeCode = getAttributeCodeByType(criteria, xAxis)
    String nameMonth = " WHEN '1' THEN 'Января' " +
            " WHEN '2' THEN 'Февраля' " +
            " WHEN '3' THEN 'Марта' " +
            " WHEN '4' THEN 'Апреля' " +
            " WHEN '5' THEN 'Мая' " +
            " WHEN '6' THEN 'Июня' " +
            " WHEN '7' THEN 'Июля' " +
            " WHEN '8' THEN 'Августа' " +
            " WHEN '9' THEN 'Сентября' " +
            " WHEN '10' THEN 'Октября' " +
            " WHEN '11' THEN 'Ноября' " +
            " WHEN '12' THEN 'Декабря' " +
            " END "
    switch (groupType)
    {
        case GroupType.OVERLAP:
            criteria.addColumn(attributeCode)
            criteria.addGroupColumn(attributeCode)
            break
        case GroupType.DAY:
            String md = "concat(" +
                    "DAY(${attributeCode}), ' ', CASE MONTH(${attributeCode}) ${nameMonth})"
            criteria.addColumn(md)
            criteria.addGroupColumn(md)
            break
        case GroupType.WEEK:
            criteria.addColumn("extract(WEEK from ${attributeCode})")
            criteria.addGroupColumn("extract(WEEK from ${attributeCode})")
            break
        case GroupType.MONTH:
            criteria.addColumn("MONTH(${attributeCode})")
            criteria.addGroupColumn("MONTH(${attributeCode})")
            break
        case GroupType.QUARTER:
            criteria.addColumn("extract(QUARTER from ${attributeCode})")
            criteria.addGroupColumn("extract(QUARTER from ${attributeCode})")
            break
        case GroupType.YEAR:
            criteria.addColumn("YEAR(${attributeCode})")
            criteria.addGroupColumn("YEAR(${attributeCode})")
            break
        case GroupType.SEVEN_DAYS:
            def cteSource = HHelper.create().addSource(source)
            cteSource.addColumn("min(${cteSource.getAlias()}.${xAxis.code})", 'cteMinDate')
            HCriteria cteCriteria = criteria.addCTESource(cteSource)
            criteria.addGroupColumn("round(abs((day(${attributeCode} " +
                    "- ${cteCriteria.getProperty('cteMinDate')}) - 0.5)) / 7)")
            criteria.addColumn("CONCAT(" +
                    "DAY(MIN(${attributeCode})), '.', CASE MONTH(MIN(${attributeCode})) ${nameMonth}," +
                    "'-'," +
                    "DAY(MAX(${attributeCode})), '.', CASE MONTH(MAX(${attributeCode})) ${nameMonth})")
            break
    }
}

/**
 * Агрегация данных для диаграммы
 * @param criteria HCriteria основной таблицы
 * @param aggregationType тип агрегации
 * @param attribute атрибут для агрегирования
 * @param source источник данных для PERCENT
 * @return данные для диаграммы в формате SummaryDiagram
 */
private void aggregation(HCriteria criteria,
                         AggregationType aggregationType,
                         Attribute attribute,
                         String source)
{
    String attributeCode = getAttributeCodeByType(criteria, attribute)
    aggregationType == AggregationType.PERCENT
            ? criteria.addColumn(aggregationType.get(attributeCode, source))
            : criteria.addColumn(aggregationType.get(attributeCode))
}

/**
 * Разбивка данных для диаграммы
 * @param criteria HCriteria основной таблицы
 * @param breakdown атрибут для разбивки
 */
private void breakdown(HCriteria criteria, Attribute breakdown)
{
    String attributeCode = getAttributeCodeByType(criteria, breakdown)
    findNotNullAttribute(criteria, breakdown)
    criteria.addColumn(attributeCode)
    criteria.addGroupColumn(attributeCode)
}

/**
 * Получение данных для линейных диаграмм
 * @param criteria HCriteria основной таблицы
 * @param request параметры диаграммы
 * @return данные для диаграммы в формате StandardDiagram
 */
private StandardDiagram getDataStandardDiagram(HCriteria criteria, RequestGetDataForDiagram request)
{
    group(criteria, request.group, request.xAxis, request.source)
    aggregation(criteria, request.aggregation, request.yAxis, request.source)
    request.breakdown ? breakdown(criteria, request.breakdown) : null
    findNotNullAttribute(criteria, request.xAxis)
    Collection<Object> list = getQuery(criteria).list()
    return mappingToStandardDiagram(list, request.breakdown)
}

/**
 * Получение данных для круговых диаграмм
 * @param criteria HCriteria основной таблицы
 * @param request параметры диаграммы
 * @return данные для диаграммы в формате RoundDiagram
 */
private String getDataRoundDiagram(HCriteria criteria, RequestGetDataForDiagram request)
{
    String attributeCode = getAttributeCodeByType(criteria, request.indicator)
    criteria.addGroupColumn(attributeCode)
    aggregation(criteria, request.aggregation, request.indicator, request.source)
    breakdown(criteria, request.breakdown)
    Collection<Object> list = getQuery(criteria).list()
    return toJson(new RoundDiagram(list*.getAt(1), list*.getAt(0)))
}

/**
 * Получение данных для диаграммы сводки
 * @param criteria HCriteria основной таблицы
 * @param request параметры диаграммы
 * @return данные для диаграммы в формате SummaryDiagram
 */
private String getDataSummaryDiagram(HCriteria criteria, RequestGetDataForDiagram request)
{
    aggregation(criteria, request.aggregation, request.indicator, request.source)
    Collection<Object> list = getQuery(criteria).list()
    return toJson(new SummaryDiagram(request.indicator.title, list[0]))
}

/**
 * Маппинг данных в формат для построения линейных диаграмм
 * @param list список значений
 * @param breakdown атрибут разбивки
 * @return данные для диаграммы в формате StandardDiagram
 */
private StandardDiagram mappingToStandardDiagram(Collection<Object> list, Attribute breakdown)
{
    StandardDiagram standardDiagram = new StandardDiagram()
    standardDiagram.categories = list.toUnique{it[0]}*.getAt(0)
    if(breakdown)
    {
        list.toUnique{it[2]}.each{
            standardDiagram.series << new Series(it[2],[0].multiply(standardDiagram.categories.size))
        }
        standardDiagram.categories.eachWithIndex { element, index ->
            list.findAll{ c-> c[0] == element }
                    .each{ standardDiagram.series.find{p -> p.name == it[2]}.data[index] = it[1]}}
    }
    else
    {
        standardDiagram.series << new Series("", list.toUnique{it[0]}*.getAt(1))
    }
    return standardDiagram
}

/**
 * Формирование кода атрибута для выборки из бд в зависимости от его типа
 * @param criteria HCriteria основной таблицы
 * @param attribute атрибут для формирования кода
 * @return код атрибута для запроса
 */
private String getAttributeCodeByType(HCriteria criteria, Attribute attribute)
{
    switch (attribute.type)
    {
        case ['boLinks', 'backBOLinks']:
            return "${criteria.addInnerJoin(attribute.code).getAlias()}.title"
        case 'catalogItemSet':
            // TODO добавить локаль пользователя api.employee.getPersonalSettings(user.UUID)?.locale после стабилизации диаграмм
            return "${criteria.addInnerJoin(attribute.code).getAlias()}.title.ru"
        case 'object':
            return "${criteria.getAlias()}.${attribute.code}.title"
        case 'catalogItem':
            // TODO добавить локаль пользователя api.employee.getPersonalSettings(user.UUID)?.locale после стабилизации диаграмм
            return "${criteria.getAlias()}.${attribute.code}.title.ru"
        default:
            return "${criteria.getAlias()}.${attribute.code}"
    }
}

/**
 * Метод добавления условия отсеивания null значений атрибута
 * @param criteria HCriteria основной таблицы
 * @param attribute атрибут для отсеивания null значений атрибута
 */
private void findNotNullAttribute(HCriteria criteria, Attribute attribute)
{
    String attributeCode = getAttributeCodeByType(criteria, attribute)
    criteria.add(HRestrictions.isNotNull(HHelper.getColumn(attributeCode)))
}

/**
 * Создание запроса на основе дескриптора
 * @param descriptor - сущность фильтрации
 * @return сущность запрос
 */
private HCriteria getQueryFromDescriptor(def descriptor)
{
    return api.actionContext.createCriteria(descriptor)
}

/**
 * Метод исполнения запросов
 * @param criteria - запрос в базу данных
 * @return сущность ответа
 */
private def getQuery(HCriteria criteria)
{
    criteria.addGroupColumn('id') //TODO: костыль который решит проблему ошибки при применении фильтров
    def currentSession = beanFactory.getBean('sessionFactory').getCurrentSession()
    return criteria.createQuery(currentSession)//TODO: в дальнейшем заменить на: api.db.query(criteria)
}

/**
 * Метод десериализации сущности дескриптора.
 * @param jsonString - сериализованный объект дескриптора
 * @return сущность дескриптора
 */
private def deserializeDescriptor(String jsonString) //TODO: костыль. В дальнейшем будет заменено
{
    def context = createContext(jsonString)
    context.clientSettings.visibleAttrCodes = new HashSet() // жёсткий костыль
    def descriptor = ru.naumen.objectlist.shared.ListDescriptorFactory.create(context)
    return descriptor
}

private def createContext(String json)
{
    def factory = com.google.web.bindery.autobean.vm.AutoBeanFactorySource.create(ru.naumen.core.shared.autobean.wrappers.AdvlistSettingsAutoBeanFactory.class)
    def autoBean = com.google.web.bindery.autobean.shared.AutoBeanCodex.decode(factory, ru.naumen.core.shared.autobean.wrappers.IReducedListDataContextWrapper.class, json)
    return ru.naumen.core.shared.autobean.wrappers.ReducedListDataContext.createObjectListDataContext(autoBean.as())
}
//endregion
