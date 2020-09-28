export default {
	staticPoints:
	[
		{
			type: 'static',
			geoposition:
			{
				latitude: 46.5663,
				longitude: 60.7702
			},
			data: [
				{
					type: 'static',
					uuid: 'serviceCall$2409391',
					header: 'Инцидент nextQuestion',
					group: 'white',
					options:
					[
						{
							label: 'Клиент',
							value: 'Оргтехника66',
							presentation: 'right_of_label'
						},
						{
							label: 'Описание',
							value: null,
							presentation: 'full_length'
						},
						{
							label: 'Адрес',
							value: 'г. Екатеринбург, ул. Фрунзе 12, подъезд 3',
							presentation: 'under_label'
						}
					],
					actions:
					[
						{
							type: 'open_link',
							name: 'Перейти на карточку',
							link: 'http://map-dev.nsd.naumen.ru/sd/operator/#uuid:employee$2283702',
							inPlace: false
						}
					]
				},
				{
					type: 'static',
					uuid: 'serviceCall$2409393',
					header: 'Инцидент 123 Инцидент-125ОЧЕНЬ СРОЧНО поменять картридж в принтере. Нужно сделать до 29.sdfsd08',
					group: 'white',
					options:
						[
							{
								label: 'Клиент',
								value: 'Оргтехника66',
								presentation: 'right_of_label'
							},
							{
								label: 'Описание',
								value: null,
								presentation: 'full_length'
							},
							{
								label: 'Адрес',
								value: 'г. Екатеринбург, ул. Фрунзе 12, подъезд 3',
								presentation: 'under_label'
							}
						],
					actions:
					[
						{
							type: 'open_link',
							name: 'Перейти на карточку',
							link: 'http://map-dev.nsd.naumen.ru/sd/operator/?anchor=uuid:serviceCall$2309303',
							inPlace: false
						},
						{
							type: 'change_responsible',
							name: 'Сменить ответственного'
						},
						{
							type: 'change_state',
							name: 'Сменить статус',
							states: [
								'waitClientAnswer', 'resolved', 'deffered'
							]
						}
					]
				}
			]
		},
		{
			type: 'static',
			geoposition: null,
			data: [
				{
					type: 'static',
					uuid: 'serviceCall$2509393',
					header: 'Инцидент 123',
					group: 'red',
					options:
					[
						{
							label: 'Клиент',
							value: 'Оргтехника66',
							presentation: 'right_of_label'
						},
						{
							label: 'Описание',
							value: null,
							presentation: 'full_length'
						},
						{
							label: 'Адрес',
							value: 'г. Екатеринбург, ул. Фрунзе 12, подъезд 3',
							presentation: 'under_label'
						}
					],
					actions:
					[
						{
							type: 'open_link',
							name: 'Перейти на карточку',
							link: 'http://map-dev.nsd.naumen.ru/sd/operator/?anchor=uuid:serviceCall$2309303',
							inPlace: false
						},
						{
							type: 'change_responsible',
							name: 'Сменить  ответственно гоответственного ответственного '
						},
						{
							type: 'change_state',
							name: 'Сменить статус',
							states: ['waitClientAnswer', 'resolved', 'deffered']
						}
					]
				}
			]
		},
		{
			type: 'static',
			geoposition:
			{
				latitude: 56.5633,
				longitude: 63.7202
			},
			data: [
				{
					type: 'static',
					uuid: 'serviceCall$2509397',
					header: 'Инцидент test',
					group: null,
					options:
					[
						{
							label: 'Клиент',
							value: 'Оргтехника66',
							presentation: 'right_of_label'
						},
						{
							label: 'Описание',
							value: null,
							presentation: 'full_length'
						},
						{
							label: 'Адрес',
							value: 'г. Екатеринбург, ул. Фрунзе 12, подъезд 3',
							presentation: 'under_label'
						}
					],
					actions:
					[
						{
							type: 'open_link',
							name: 'Перейти на карточку',
							link: 'http://map-dev.nsd.naumen.ru/sd/operator/?anchor=uuid:serviceCall$2309303',
							inPlace: false
						},
						{
							type: 'change_responsible',
							name: 'Сменить  ответственно гоответственного ответственного '
						},
						{
							type: 'change_state',
							name: 'Сменить статус',
							states: ['waitClientAnswer', 'resolved', 'deffered']
						}
					]
				}
			]
		}
	],
	staticGroups: [
		{
			name: 'Красная',
			color: '#FA1010',
			code: 'red'
		},
		{
			name: 'Белая длинная группа для теста которая не помещается',
			color: '#FFFFFF',
			code: 'white'
		}
	],
	dynamicPoints: [
		{
			type: 'dynamic',
			geoposition:
		{
			latitude: 16.3863,
			longitude: 20.8470,
			accuracy: 65.0,
			date: '11.10.2020 12:15'
		},
			data: [
				{
					type: 'dynamic',
					uuid: 'employee$752501',
					header: 'Администратор',
					options:
				[
					{
						label: 'Мобильный телефон',
						value: 83436657809,
						presentation: 'right_of_label'
					},
					{
						label: 'Компетенции',
						value: 'Wi-fi, оргтехника, сетевые технологии',
						presentation: 'under_label'
					},
					{
						label: 'Компетенции',
						value: 'Wi-fi, оргтехника, сетевые технологии',
						presentation: 'full_length'
					}
				],
					actions:
				[
					{
						type: 'open_link',
						name: 'Перейти на карточку',
						link: 'http://map-dev.nsd.naumen.ru/sd/operator/#uuid:employee$2283702',
						inPlace: false
					}
				]
				}
			]
		}
	],
	errors: []
};
