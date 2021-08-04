export default [
	{
		'children': [
			{
				'children': [],
				'classFqn': 'document$doc',
				'title': 'Документ'
			}
		],
		'classFqn': 'document',
		'title': 'Документ'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'template$templateTask',
				'title': 'Шаблон задач'
			},
			{
				'children': [],
				'classFqn': 'template$templateCom',
				'title': 'Шаблон комментария'
			}
		],
		'classFqn': 'template',
		'title': 'Шаблон'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'agreementRule$agreementRule',
				'title': 'Правило'
			},
			{
				'children': [],
				'classFqn': 'agreementRule$reactRule',
				'title': 'Правило реакции'
			}
		],
		'classFqn': 'agreementRule',
		'title': 'Правило SLA'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'log$concurentLic',
				'title': 'Лог лицензий'
			},
			{
				'children': [],
				'classFqn': 'log$story',
				'title': 'Уведомления на портале'
			}
		],
		'classFqn': 'log',
		'title': 'Настраиваемый лог'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'cmdb$location',
				'title': 'Местоположение'
			},
			{
				'children': [],
				'classFqn': 'cmdb$invUnit',
				'title': 'ОАИ'
			},
			{
				'children': [
					{
						'children': [],
						'classFqn': 'cmdb$interface',
						'title': 'Интерфейс'
					},
					{
						'children': [],
						'classFqn': 'cmdb$components',
						'title': 'Компоненты'
					}
				],
				'classFqn': 'cmdb$ci',
				'title': 'Оборудование'
			},
			{
				'children': [],
				'classFqn': 'cmdb$software',
				'title': 'Програмное обеспечение'
			}
		],
		'classFqn': 'cmdb',
		'title': 'CMDB'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'directory$city',
				'title': 'Город'
			},
			{
				'children': [],
				'classFqn': 'directory$model',
				'title': 'Модель'
			},
			{
				'children': [],
				'classFqn': 'directory$vendor',
				'title': 'Производитель'
			},
			{
				'children': [],
				'classFqn': 'directory$type',
				'title': 'Типы оборудования'
			}
		],
		'classFqn': 'directory',
		'title': 'Справочник CMDB'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'businessRules$baseClassifier',
				'title': 'Базовый классификатор'
			},
			{
				'children': [],
				'classFqn': 'businessRules$respRules',
				'title': 'Правила определения ответственного'
			}
		],
		'classFqn': 'businessRules',
		'title': 'Бизнес-правила'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'negotiation$negotiation',
				'title': 'Согласование запроса на изменение'
			},
			{
				'children': [],
				'classFqn': 'negotiation$approvalReq',
				'title': 'Согласование заявки'
			}
		],
		'classFqn': 'negotiation',
		'title': 'Согласование'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'interviewAnsw$interviewAnsw',
				'title': 'Ответ на опрос'
			}
		],
		'classFqn': 'interviewAnsw',
		'title': 'Ответ на опрос'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'markBase$markBase',
				'title': 'Оценка'
			}
		],
		'classFqn': 'markBase',
		'title': 'Оценка'
	},
	{
		'children': [
			{
				'children': [
					{
						'children': [],
						'classFqn': 'action$headToTemp',
						'title': 'Действие с атрибутом из ГО в шаг'
					},
					{
						'children': [],
						'classFqn': 'action$tempToHead',
						'title': 'Действие с атрибутом из шага в ГО'
					},
					{
						'children': [],
						'classFqn': 'action$tempToTemp',
						'title': 'Действие с атрибутом между шагами'
					},
					{
						'children': [],
						'classFqn': 'action$attrKaseToKase',
						'title': 'Соответствие атрибутов типов объектов'
					}
				],
				'classFqn': 'action$attribute',
				'title': 'Действие с атрибутом'
			},
			{
				'children': [
					{
						'children': [],
						'classFqn': 'action$templateHead',
						'title': 'Изменение головного объекта'
					}
				],
				'classFqn': 'action$head',
				'title': 'Действие с головным объектом'
			},
			{
				'children': [
					{
						'children': [],
						'classFqn': 'action$eventTemplate',
						'title': 'Действие по событию'
					},
					{
						'children': [],
						'classFqn': 'action$templateAction',
						'title': 'Действие со связанным шагом'
					}
				],
				'classFqn': 'action$template',
				'title': 'Действие с шагом'
			}
		],
		'classFqn': 'action',
		'title': 'Действие'
	},
	{
		'children': [
			{
				'children': [
					{
						'children': [],
						'classFqn': 'KB$KBArticleOpen',
						'title': 'Внешняя статья'
					}
				],
				'classFqn': 'KB$KBArticle',
				'title': 'Внутренняя статья'
			},
			{
				'children': [
					{
						'children': [
							{
								'children': [],
								'classFqn': 'KB$KBSubsectionOp',
								'title': 'Внешний подраздел'
							}
						],
						'classFqn': 'KB$KBSectionOpen',
						'title': 'Внешний раздел'
					},
					{
						'children': [
							{
								'children': [],
								'classFqn': 'KB$KBSubsectionPr',
								'title': 'Внутренний подраздел'
							}
						],
						'classFqn': 'KB$KBSectionProt',
						'title': 'Внутренний раздел'
					}
				],
				'classFqn': 'KB$KBSection',
				'title': 'Раздел базы знаний'
			}
		],
		'classFqn': 'KB',
		'title': 'База знаний'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'changenote$eventRecord',
				'title': 'Запись о событии (документ)'
			},
			{
				'children': [],
				'classFqn': 'changenote$dispatchOfNote',
				'title': 'Запись об отправке'
			}
		],
		'classFqn': 'changenote',
		'title': 'Записи изменений'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'vote$vote',
				'title': 'Голосование по запросу на изменение'
			},
			{
				'children': [],
				'classFqn': 'vote$voteR',
				'title': 'Голосование по заявке'
			}
		],
		'classFqn': 'vote',
		'title': 'Голосование'
	},
	{
		'children': [],
		'classFqn': 'events',
		'title': 'События'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'directories$eventType',
				'title': 'Тип события'
			},
			{
				'children': [],
				'classFqn': 'directories$healthLevels',
				'title': 'Уровень здоровья'
			}
		],
		'classFqn': 'directories',
		'title': 'Каталоги'
	},
	{
		'children': [
			{
				'children': [
					{
						'children': [
							{
								'children': [],
								'classFqn': 'metaStorage$eresponsibl',
								'title': 'Ответственный'
							}
						],
						'classFqn': 'metaStorage$eaggregat',
						'title': 'Агрегирующий атрибут'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$edoubl',
						'title': 'Вещественное число'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$ldtInterva',
						'title': 'Временной интервал'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$khyperlin',
						'title': 'Гиперссылка'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$edat',
						'title': 'Дата'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$edateTim',
						'title': 'Дата/время'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$lboo',
						'title': 'Логический'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$tcaseLis',
						'title': 'Набор типов классов'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$tcatalogItemSe',
						'title': 'Набор элементов справочника'
					},
					{
						'children': [
							{
								'children': [],
								'classFqn': 'metaStorage$sboLink',
								'title': 'Набор ссылок на БО'
							},
							{
								'children': [],
								'classFqn': 'metaStorage$sbackBOLink',
								'title': 'Обратная ссылка на БО'
							}
						],
						'classFqn': 'metaStorage$tobjec',
						'title': 'Ссылка на бизнес-объект'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$estat',
						'title': 'Статус'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$gstrin',
						'title': 'Строка'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$rtime',
						'title': 'Счетчик времени'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$rbackTime',
						'title': 'Счетчик времени (обратный)'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$ttex',
						'title': 'Текст'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$trichtex',
						'title': 'Текст в формате RTF'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$esourceCod',
						'title': 'Текст с подсветкой синтаксиса'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$smetaClas',
						'title': 'Тип объекта'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$efil',
						'title': 'Файл'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$rintege',
						'title': 'Целое число'
					},
					{
						'children': [],
						'classFqn': 'metaStorage$mcatalogIte',
						'title': 'Элемент справочника'
					}
				],
				'classFqn': 'metaStorage$attribute',
				'title': 'Атрибут'
			},
			{
				'children': [
					{
						'children': [],
						'classFqn': 'metaStorage$kase',
						'title': 'Тип'
					}
				],
				'classFqn': 'metaStorage$clazz',
				'title': 'Класс'
			},
			{
				'children': [],
				'classFqn': 'metaStorage$status',
				'title': 'Статус жизненного цикла'
			}
		],
		'classFqn': 'metaStorage',
		'title': 'Настройки объектной модели'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'bpm$route',
				'title': 'Маршрут'
			},
			{
				'children': [],
				'classFqn': 'bpm$template',
				'title': 'Шаблон шага'
			}
		],
		'classFqn': 'bpm',
		'title': 'Бизнес процесс'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'news$news',
				'title': 'Новость'
			}
		],
		'classFqn': 'news',
		'title': 'Новость'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'banner$banner',
				'title': 'Баннер'
			}
		],
		'classFqn': 'banner',
		'title': 'Баннер'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'problem$problem',
				'title': 'Проблема'
			}
		],
		'classFqn': 'problem',
		'title': 'Проблема'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'interfaceTour$serviceCall',
				'title': 'Тур по карточке заявки'
			},
			{
				'children': [],
				'classFqn': 'interfaceTour$root',
				'title': 'Тур по карточке компании'
			},
			{
				'children': [],
				'classFqn': 'interfaceTour$ou',
				'title': 'Тур по карточке отдела'
			},
			{
				'children': [],
				'classFqn': 'interfaceTour$agreement',
				'title': 'Тур по карточке соглашения'
			},
			{
				'children': [],
				'classFqn': 'interfaceTour$employee',
				'title': 'Тур по карточке сотрудника'
			},
			{
				'children': [],
				'classFqn': 'interfaceTour$slmService',
				'title': 'Тур по карточке услуги'
			}
		],
		'classFqn': 'interfaceTour',
		'title': 'Тур'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'task$task',
				'title': 'Задача'
			},
			{
				'children': [
					{
						'children': [],
						'classFqn': 'task$ngttnManage',
						'title': 'Контроль исполнения согласований'
					},
					{
						'children': [],
						'classFqn': 'task$bpmHeadActive',
						'title': 'Проверка активностей по головному объекту'
					}
				],
				'classFqn': 'task$bpmService',
				'title': 'Служебная'
			}
		],
		'classFqn': 'task',
		'title': 'Задача'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'changeRequest$changeRequest',
				'title': 'Запрос на изменение'
			}
		],
		'classFqn': 'changeRequest',
		'title': 'Запрос на изменение'
	},
	{
		'children': [],
		'classFqn': 'externalDS',
		'title': 'Внешний источник данных'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'domain$domain',
				'title': 'Доменное имя'
			}
		],
		'classFqn': 'domain',
		'title': 'Домен'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'catalogs$resolutionCode',
				'title': 'Код решения'
			},
			{
				'children': [
					{
						'children': [],
						'classFqn': 'catalogs$eventChangeSt',
						'title': 'Событие - Смена статуса'
					}
				],
				'classFqn': 'catalogs$event',
				'title': 'Событие'
			},
			{
				'children': [],
				'classFqn': 'catalogs$entity',
				'title': 'Сущность'
			}
		],
		'classFqn': 'catalogs',
		'title': 'Справочник BPM'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'workRecord$workRecord',
				'title': 'Запись о работе'
			}
		],
		'classFqn': 'workRecord',
		'title': 'Запись о работе'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'PMProject$project',
				'title': 'Проект'
			},
			{
				'children': [],
				'classFqn': 'PMProject$StageProject',
				'title': 'Этап проекта'
			}
		],
		'classFqn': 'PMProject',
		'title': 'Проекты'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'interview$interviewResul',
				'title': 'Вариант результата опроса'
			},
			{
				'children': [],
				'classFqn': 'interview$interview',
				'title': 'Опрос'
			}
		],
		'classFqn': 'interview',
		'title': 'Опрос'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'agreement$agreement',
				'title': 'Соглашение'
			}
		],
		'classFqn': 'agreement',
		'title': 'Соглашение'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'ou$company',
				'title': 'Компания'
			},
			{
				'children': [],
				'classFqn': 'ou$ou',
				'title': 'Отдел'
			},
			{
				'children': [],
				'classFqn': 'ou$ouRoles',
				'title': 'Хранилище ролей'
			}
		],
		'classFqn': 'ou',
		'title': 'Отдел'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'team$team',
				'title': 'Команда'
			}
		],
		'classFqn': 'team',
		'title': 'Команда'
	},
	{
		'children': [
			{
				'children': [
					{
						'children': [],
						'classFqn': 'employee$relRole',
						'title': 'Относительная роль'
					}
				],
				'classFqn': 'employee$absRole',
				'title': 'Абсолютная роль'
			},
			{
				'children': [],
				'classFqn': 'employee$contactPerson',
				'title': 'Контактное лицо'
			},
			{
				'children': [],
				'classFqn': 'employee$employee',
				'title': 'Сотрудник'
			}
		],
		'classFqn': 'employee',
		'title': 'Сотрудник'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'serviceCall$request',
				'title': 'Запрос на обслуживание'
			},
			{
				'children': [],
				'classFqn': 'serviceCall$serviceCall',
				'title': 'Инцидент'
			},
			{
				'children': [],
				'classFqn': 'serviceCall$call',
				'title': 'Обращение'
			},
			{
				'children': [],
				'classFqn': 'serviceCall$PMTask',
				'title': 'Проектная активность'
			}
		],
		'classFqn': 'serviceCall',
		'title': 'Заявка'
	},
	{
		'children': [],
		'classFqn': 'root',
		'title': 'Компания'
	},
	{
		'children': [
			{
				'children': [],
				'classFqn': 'slmService$slmService',
				'title': 'Услуга'
			}
		],
		'classFqn': 'slmService',
		'title': 'Услуга'
	}
];
