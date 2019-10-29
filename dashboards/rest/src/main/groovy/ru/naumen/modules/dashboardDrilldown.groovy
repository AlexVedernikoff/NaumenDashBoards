
/*! UTF-8 */
//Автор: nordclan
//Дата создания: 03.09.2019
//Код:
//Назначение:
/**
 * Бекенд для формирования ссылок
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль
package ru.naumen.modules

import java.time.LocalDate
import java.time.Year

//region КЛАССЫ
/**
 * Объект помощник для формирования ссылок
 */
class Link
{
    /**
     * Название списка
     */
    String title

    /**
     * код класс, которому принадлежат объекты списка
     */
    String classFqn

    /**
     * коды классов, объекты которых будут отображаться в списке
     */
    Collection<String> cases

    /**
     *  код группы атрибутов
     */
    String attrGroup = 'system' //TODO: в дальнейшем будет заменено на 'forDashboards'

    /**
     * список параметров группировки
     */
    Collection<String> attrCodes

    /**
     * список фильтров
     */
    Collection<Map<Object, Object>> filters

    /**
     * Json дескриптор
     */
    String descriptor

    /**
     * время жизни ссылки в днях
     */
    int liveDays = 30

    private Map<String, Integer> genitiveRussianMonth = Calendar.with {
        [
                'Января': JANUARY,
                'Февраля': FEBRUARY,
                'Марта': MARCH,
                'Апреля': APRIL,
                'Мая': MAY,
                'Июня': JUNE,
                'Июля': JULY,
                'Августа': AUGUST,
                'Сентября': SEPTEMBER,
                'Октября': OCTOBER,
                'Ноября': NOVEMBER,
                'Декабря': DECEMBER
        ]
    }

    private Map<String, Integer> nominativeRussianMonth = Calendar.with {
        [
                'Январь': JANUARY,
                'Февраль': FEBRUARY,
                'Март': MARCH,
                'Апрель': APRIL,
                'Май': MAY,
                'Июнь': JUNE,
                'Июль': JULY,
                'Август': AUGUST,
                'Сентябрь': SEPTEMBER,
                'Октябрь': OCTOBER,
                'Ноябрь': NOVEMBER,
                'Декабрь': DECEMBER
        ]
    }


    /**
     * перечень
     */
    private final DATE_ATTRIBUTES = ['date', 'dateTime']

    /**
     * Метод получения сконструированного билдера
     * @param api - интерфейс формирования ссылок
     * @return сконструированный билдер
     */
    def getBuilder(def api)
    {
        def builder = api.web.defineListLink(false)
                .setTitle(title ?: "Список элементов ${classFqn}")
                .setClassCode(classFqn)
                .setCases(cases)
                .setAttrGroup(attrGroup)
                .setAttrCodes(attrCodes)
                .setDaysToLive(liveDays)
        formatFilter(builder.filter())
        return builder
    }

    /**
     * Вспомогательный метод для формирования фильтра
     * @param filterBuilder - билдер для фильтра
     */
    private void formatFilter(def filterBuilder)
    {
        if(descriptor)
        {
            createContext(descriptor).listFilter.elements.each { orFilter ->
                orFilter.elements.collect { filter ->
                    //getValue, getProperties, conditionCode
                    String attribute = (filter.getAttributeFqn() as String).split('@', 2).tail().head()
                    String condition = filter.getProperties().conditionCode
                    def value = filter.getValue()
                    filterBuilder.OR(attribute, condition, value)
                }.inject(filterBuilder) { first, second ->
                    first.AND(second)
                }
            }
        }

        filters.collect { filter ->
            def attribute = filter.attr as Map<String, Object>
            def value = filter.value
            GroupType group = filter.group as GroupType // задаёт правило фильтрации даты
            String type = attribute.type
            String code = attribute.code
            group = group != GroupType.OVERLAP ? group : null // TODO: костыль. для этой группировки фильтр строится по стандартной логике
            group ? filterBuilder.OR(code, 'fromTo', getRange(group, value)) : getOrFilter(type, code, value, filterBuilder)
        }.inject(filterBuilder) { first, second ->
            first.AND(second)
        }
    }

    private getOrFilter(String type, String code, def value, def filterBuilder)
    {
        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"
        switch (type)
        {
            case 'object':
                return filterBuilder.OR(code, 'titleContains', value)
            case DATE_ATTRIBUTES:
                return filterBuilder.OR(code, 'contains', Date.parse(dateFormat, value as String))
            default:
                return filterBuilder.OR(code, 'contains', value)
        }
    }

    /**
     * Вспомогательный метод по формированию диапазона дат для выбранной группировке
     * @param groupType - тип группировки
     * @param value - значение группировки
     * @return диапазон дат
     */
    private List<Date> getRange(GroupType groupType, def value)
    {
        def start = Calendar.instance
        def end = Calendar.instance

        switch (groupType)
        {
            case GroupType.DAY:
                int day = (value as String).split().head() as int
                String month = (value as String).split().tail().head()
                start.with {
                    set(MONTH, genitiveRussianMonth.get(month))
                    set(DAY_OF_MONTH, day)
                }
                end.with {
                    set(MONTH, genitiveRussianMonth.get(month))
                    set(DAY_OF_MONTH, day)
                }
                break
            case GroupType.WEEK:
                start.with {
                    set(WEEK_OF_YEAR, value as int)
                    set(DAY_OF_WEEK, MONDAY)
                }
                end.with {
                    set(WEEK_OF_YEAR, value as int)
                    set(DAY_OF_WEEK, SUNDAY)
                }
                break
            case GroupType.SEVEN_DAYS:
                String startDate = (value as String).split('-')[0]
                int startDay = startDate.split('\\.')[0] as int
                String startMonth = startDate.split('\\.')[1]
                start.with {
                    set(MONTH, genitiveRussianMonth.get(startMonth))
                    set(DAY_OF_MONTH, startDay)
                }
                String endDate = (value as String).split('-')[1]
                int endDay = endDate.split('\\.')[0] as int
                String endMonth = endDate.split('\\.')[1]
                end.with {
                    set(MONTH, genitiveRussianMonth.get(endMonth))
                    set(DAY_OF_MONTH, endDay)
                }
                break
            case GroupType.MONTH:
                start.with {
                    set(MONTH, nominativeRussianMonth.get(value as String))
                    set(DAY_OF_MONTH, 1)
                }
                end.with {
                    set(MONTH, nominativeRussianMonth.get(value as String))
                    set(DAY_OF_MONTH, getActualMaximum(DAY_OF_MONTH))
                }
                break
            case GroupType.QUARTER:
                int quarter = (value as String).replace(' кв-л', '') as int
                start.with {
                    set(MONTH, (quarter - 1) * 3) // индексация месяца с нуля
                    set(DAY_OF_MONTH, 1)
                }
                end.with {
                    set(MONTH, (quarter - 1) * 3 + 2) // индексация месяца с нуля
                    set(DAY_OF_MONTH, getActualMaximum(DAY_OF_MONTH))
                }
                break
            case GroupType.YEAR:
                start.with {
                    set(YEAR, value as int)
                    set(MONTH, JANUARY)
                    set(DAY_OF_MONTH, 1)
                }
                end.with {
                    set(YEAR, value as int)
                    set(MONTH, DECEMBER)
                    set(DAY_OF_MONTH, getActualMaximum(DAY_OF_MONTH))
                }
                break
        }

        start.with {
            set(HOUR_OF_DAY, 0)
            set(MINUTE, 0)
            set(SECOND, 0)
        }
        end.with {
            set(HOUR_OF_DAY, 23)
            set(MINUTE, 59)
            set(SECOND, 59)
        }
        return [start.getTime(), end.getTime()]
    }

    def createContext(String json)
    {
        def factory = com.google.web.bindery.autobean.vm.AutoBeanFactorySource.create(ru.naumen.core.shared.autobean.wrappers.AdvlistSettingsAutoBeanFactory.class)
        def autoBean = com.google.web.bindery.autobean.shared.AutoBeanCodex.decode(factory, ru.naumen.core.shared.autobean.wrappers.IReducedListDataContextWrapper.class, json)
        return ru.naumen.core.shared.autobean.wrappers.ReducedListDataContext.createObjectListDataContext(autoBean.as())
    }
}
//endregion

//region REST-МЕТОДЫ
/**
 * Метод пролучения ссылки на страницу со списком объектов сформированным из параметров запроса.
 * @param requestContent - параметры запроса
 * @return ссылка на на страницу с произвольным списком объектов.
 */
String getLink(Map<String, Object> requestContent)
{
    Link link = new Link(requestContent)
    def linkBuilder = link.getBuilder(api)
    return api.web.list(linkBuilder)
}
//endregion