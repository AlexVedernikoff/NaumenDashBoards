/*! UTF-8 */
//Автор: nordclan
//Дата создания: 05.11.2020
//Код:
//Назначение:
/**
 * Главный контроллер приложения "Календарь ВП"
 */
//Версия: 1.0
//Категория: скриптовый модуль

package ru.naumen.modules.calendar

import groovy.transform.Field
import groovy.transform.InheritConstructors

@Field @Lazy @Delegate CalendarController controller = new CalendarControllerImpl(binding)

/**
 * Главный контроллер
 */
@InheritConstructors
class CalendarControllerImpl  extends Script implements CalendarController, EventControllerTrait
{
    Object run()
    {
        return null
    }
}

/**
 * Интерфейс главного контроллера
 */
interface CalendarController extends EventController
{

}
