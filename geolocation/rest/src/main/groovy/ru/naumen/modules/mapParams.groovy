//Автор: dpanishev
//Дата создания: 15.10.2019
//Дата обновления: 08.12.2020
//Код: mapParams
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Карта".
 * Содержит методы, определяющие список подвижных и неподвижных точек для отображения на карте и в панели,
 * методы группирования статических точек.
 * Ориентирован на схему данных ITSM365.
 */
//Версия SMP: 4.11
package ru.naumen.modules.geolocation

import groovy.transform.Memoized

/**
 * Возвращает группы для статических точек Заявок.
 *
 * Если вы хотите группировать заявки на карте,
 * то укажите название этого метода в параметре контента с ВП "Название метода группировки неподвижных точек"
 */
@Memoized
def serviceCallGroups()
{
    return [
        // при создании группы задаётся функция, которая определяет принадлежность точки к группе,
        // point - бизнес объект, переданный в createStaticPoint при создании точки,
        // в данном случае - при создании точки Заявки
        modules.mapRest.createGroup({ point -> point.responsibleEmployee == null })
            // название группы
            .setName('Без ответственного')
            // код группы, обязательный для работы ВП
            .setCode('red')
            // цвет группы
            .setColor('#EB5757'),
        // функция определяющая принадлежность к группе
        modules.mapRest.createGroup({ point -> point.responsibleEmployee != null })
            // название группы
            .setName('С ответственным')
            // код группы, обязательный для работы ВП
            .setCode('green')
            // цвет группы
            .setColor('#21B45E'),
    ]
}

/**
 * Метод возвращает список из
 * - подвижных точек - участников команды, ответственной за Заявку, или ответственного сотрудника;
 * - неподвижной точки с адресом контрагента Заявки.
 *
 * Этот метод можно использовать как метод получения точек для ВП на карточке Заявки.
 */
def employeesByServiceCall(def serviceCall, def user)
{
    def points = []

    // Добавляем на карту статическую точку с данными Запроса
    points += createServiceCallPoint(serviceCall)

    // Добавляем на карту динамические точки с данными сотрудников
    if (serviceCall.responsibleEmployee)
    {
        points += createEmployeePoint(serviceCall.responsibleEmployee, user)
    }
    else
    {
        for (def employee : serviceCall.responsibleTeam.members)
        {
            points += createEmployeePoint(employee, user)
        }
    }

    return points
}

/**
 * Метод возвращает список из
 * - подвижных точек - участников команды;
 * - неподвижных точек - запросов в ответственности команды.
 *
 * Этот метод можно использовать как метод получения точек для ВП на карточке Команды.
 */
def employeesByTeam(def team, def user)
{
    def points = []

    // Добавляем на карту статические точки с данными Запросов
    for (def serviceCall : team.respForSCs)
    {
        points += createServiceCallPoint(serviceCall)
    }

    // Добавляем на карту динамические точки с сотрудниками
    for (def employee : team.members)
    {
        points += createEmployeePoint(employee, user)
    }

    return points
}

/**
 * Метод возвращает список из
 * - подвижной точки сотрудника;
 * - неподвижных точек - запросов в ответственности сотрудника.
 *
 * Этот метод можно использовать как метод получения точек для ВП на карточке Сотрудника.
 */
def serviceCallsByEmployee(def employee, def user)
{
    def points = []

    // Добавляем на карту статические точки с данными Запросов
    for (def serviceCall : employee.respForSCs)
    {
        points += createServiceCallPoint(serviceCall)
    }

      // Добавляем на карту динамическую точку с сотрудником
    points += createEmployeePoint(employee, user)

    return points
}

/**
 * Метод формирует неподвижную точку Заявки
 */
private def createServiceCallPoint(def serviceCall)
{
    def clientOU = serviceCall.clientOU

    // в метод createStaticPoint передаётся бизнес объект, для которого выводится точка, в данном случае - Заявка
    return modules.mapRest.createStaticPoint(serviceCall)
        // заголовок: тип запроса + номер
        .setHeader(api.metainfo.getMetaClassTitle(serviceCall.metaClass) + '-' + serviceCall.number)
        // геопозиция отдела-контрагента
        .setGeoposition(clientOU?.latitude, clientOU?.longitude)
        // тема Заявки;
        // представление для отображения: на всю ширину
        .addOption('Тема', "${serviceCall?.shortDescr}", modules.mapRest.presentation.fullLength())
        // статус заявки;
        // представление для отображения: справа от названия
        .addOption('Статус', api.metainfo.getStateTitle(serviceCall), modules.mapRest.presentation.rightOfLabel())
        // контактное лицо по Заявке;
        // представление для отображения: под названием
        .addOption('Контактное лицо', "${serviceCall.clientName}", modules.mapRest.presentation.underLabel())
        // телефон контактного лица, если он указан;
        // представление для отображения: под названием
        .addOption('Телефон', "${serviceCall?.clientPhone ?: 'телефон не указан'}", modules.mapRest.presentation.underLabel())
        // перейти по ссылке, в данном случае - на карточку Заявки
        .addAction(modules.mapRest.action.openLink('Перейти на карточку', api.web.open(serviceCall)))
        // открыть форму Смены ответственного
        .addAction(modules.mapRest.action.changeResponsible('Сменить ответственного'))
        // открыть форму Смены статуса, на форме будет доступен переход в статусы "В работе", "Закрыт"
        .addAction(modules.mapRest.action.changeState('Сменить статус', ['inprogress', 'closed']))
}

/**
 * Метод формирует подвижную точку Сотрудника
 */
private def createEmployeePoint(def employee, def user)
{
    // по умолчанию в заголовок выводится ФИО сотрудника,
    // координаты метки на карте - последняя геопозиция сотрудника
    def point = modules.mapRest.createDynamicPoint(employee)
        // телефон сотрудника, если он указан;
        // представление для отображения: под названием
        .addOption('Телефон', employee.mobilePhoneNumber ?: 'Телефон не указан', modules.mapRest.presentation.underLabel())
        // перейти по ссылке, в данном случае - на карточку Сотрудника
        .addAction(modules.mapRest.action.openLink('Перейти на карточку', api.web.open(employee)))

    // метка времени последней геопозиции сотрудника;
    // представление для отображения: на всю ширину
    point.addOption('Последняя геопозиция', modules.mapRest.formatDate(user, point.geoposition?.date, 'dd.MM.yyyy HH:mm'), modules.mapRest.presentation.underLabel())

    return point
}
