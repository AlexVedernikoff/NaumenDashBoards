
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
     * время жизни ссылки в днях
     */
    int liveDays = 30

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
        filters.each { filter ->
            def attribute = filter.attr as Map<String, Object>
            def value = filter.value
            GroupType group = filter.group as GroupType // задаёт правило фильтрации даты
            String type = attribute.type.code
            String code = attribute.code

            String dateFormat = "yyyy-MM-dd'T'HH:mm:ss"

            filterBuilder.with {
                group ? AND(OR(code, 'fromTo', getRange(group, value as int)))
                        : type in DATE_ATTRIBUTES ? AND(OR(code, 'contains', Date.parse(dateFormat, value as String)))
                        : AND(OR(code, 'contains', value))
            }

        }
    }

    /**
     * Вспомогательный метод по формированию диапазона дат для выбранной группировке
     * @param groupType - тип группировки
     * @param value - значение группировки
     * @return диапазон дат
     */
    private List<Date> getRange(GroupType groupType, int value)
    {
        def start = Calendar.instance
        def end = Calendar.instance

        switch (groupType) {
            case GroupType.DAY:
                start.with { set(DAY_OF_MONTH, value) }
                end.with { set(DAY_OF_MONTH, value) }
                break
            case GroupType.WEEK:
                start.with {
                    set(WEEK_OF_MONTH, value)
                    set(DAY_OF_WEEK, MONDAY)
                }
                end.with {
                    set(WEEK_OF_MONTH, value)
                    set(DAY_OF_WEEK, SUNDAY)
                }
                break
            case GroupType.SEVEN_DAYS:
                start.with { set(DAY_OF_MONTH, value) }
                end.with { set(DAY_OF_MONTH, value + 7) }
                break
            case GroupType.MONTH:
                start.with {
                    set(MONTH, value - 1) // индексация месяца с нуля
                    set(DAY_OF_MONTH, 1)
                }
                end.with {
                    set(MONTH, value - 1) // индексация месяца с нуля
                    set(DAY_OF_MONTH, getActualMaximum(DAY_OF_MONTH))
                }
                break
            case GroupType.QUARTER:
                start.with {
                    set(MONTH, (value - 1) * 3) // индексация месяца с нуля
                    set(DAY_OF_MONTH, 1)
                }
                end.with {
                    set(MONTH, (value - 1) * 3 + 2) // индексация месяца с нуля
                    set(DAY_OF_MONTH, getActualMaximum(DAY_OF_MONTH))
                }
                break
            case GroupType.YEAR:
                start.with {
                    set(YEAR, value)
                    set(MONTH, JANUARY)
                    set(DAY_OF_MONTH, 1)
                }
                end.with {
                    set(YEAR, value)
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