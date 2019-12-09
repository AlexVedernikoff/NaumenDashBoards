//Автор: dpanishev
//Дата создания: 15.10.2019
//Код: mapParams
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Карта".
 * Содержит методы, определяющие список подвижных и неподвижных точек для отображения на карте, информацию для отображения в попапе. 
 * Ориентирован на схему данных ITSM365.
 */
//Версия SMP: 4.11

// Указать название этого метода в настройках контента ВП на карточке Заявки
// Метод возвращает список из 
// - подвижных точек - участников команды, ответственной за заявку, или ответственного сотрудника;
// - неподвижной точки с адресом контрагента запроса.
def employeesByServiceCall(def serviceCall, def user)
{
    def points = [];

    // Добавляем на карту статическую точку с данными Запроса
    points += createServiceCallPoint(serviceCall);
    
    // Добавляем на карту динамические точки с данными сотрудников
  	if (serviceCall.responsibleEmployee)
  	{
    	points += createEmployeePoint(serviceCall.responsibleEmployee, user);
    }
  	else
    {
    	for (def employee : serviceCall.responsibleTeam.members)
      	{
        	points += createEmployeePoint(employee, user);
      	}
    }

    return points;
}

// Указать название этого метода в настройках контента ВП на карточке Команды
// Метод возвращает список из 
// - подвижных точек - участников команды;
// - неподвижных точек - запросов в ответственности команды.
def employeesByTeam(def team, def user)
{
    def points = [];

    // Добавляем на карту статические точки с данными Запросов
  	def sortedSCs = team.respForSCs.sort(false, { it.sort })

    for (def serviceCall : sortedSCs)
  	{
    	points += createServiceCallPoint(serviceCall);
    }
  
    // Добавляем на карту динамические точки с сотрудниками
  	for (def employee : team.members)
    {
      	points += createEmployeePoint(employee, user);
    }

    return points;
}

// Указать название этого метода в настройках контента ВП на карточке Сотрудника
// Метод возвращает список из 
// - подвижной точки сотрудника;
// - неподвижных точек - запросов в ответственности сотрудника.
def serviceCallsByEmployee(def employee, def user)
{
    def points = [];
  
    // Добавляем на карту статические точки с данными Запросов
    for (def serviceCall : employee.respForSCs)
  	{
    	points += createServiceCallPoint(serviceCall);
    }
  
  	// Добавляем на карту динамическую точку с сотрудником
  	points += createEmployeePoint(employee, user);

    return points;
}

// Метод формирования неподвижной точки
private def createServiceCallPoint(def serviceCall)
{
    def client = serviceCall.client;
    def clientOU = serviceCall.clientOU;
    return modules.mapRest.createStaticPoint()
        .setHeader(api.metainfo.getMetaClassTitle(serviceCall.metaClass) + "-" + serviceCall.number) // заголовок попапа: тип запроса + номер
        .setGeoposition(clientOU?.latitude, clientOU?.longitude)    // координаты метки на карте, если координаты контрагента null, метка не отобразится
  		.addOption(serviceCall.shortDescr ?: '')      				// тема заявки
  		.addOption("Клиент", clientOU?.title)	      				// контрагент заявки
  		.addOption("Адрес", "${clientOU?.adress ?: ''}") 			// адрес контрагента
        .addOption("Контактное лицо", "${serviceCall.clientName}")  // контактное лицо по заявке
  		.addOption("Телефон", "${serviceCall?.clientPhone ?: 'телефон не указан'}") // телефон контактного лица
        .addAction("Перейти на карточку", api.web.open(serviceCall)); // ссылка на карточку заявки
}	

// Метод формирования подвижной точки
private def createEmployeePoint(def employee, def user)
{
    def point = modules.mapRest.createDynamicPoint(employee)				   // по умолчанию в заголовок попапа выводится ФИО сотрудника
  																			   // координаты метки на карте - последняя геопозиция сотрудника
  		    .addOption(employee.mobilePhoneNumber ?: 'Телефон не указан')	   // телефон сотрудника
            .addAction("Перейти на карточку", api.web.open(employee)); 		   // ссылка на карточку сотрудника
  
    point.addOption(modules.mapRest.formatDate(user, point.geoposition?.date, 'dd.MM.yyyy HH:mm')) // Метка времени последней геопозиции сотрудника
    return point;
}


