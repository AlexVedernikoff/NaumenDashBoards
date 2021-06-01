export default {
	'trails': [
		{
			'type': 'wols',
			'parts': [
				{
					'type': 'part',
					'geopositions': [
						{
							'latitude': 56.79972222222222,
							'longitude': 61.61527777777778
						},
						{
							'latitude': 56.808611111111105,
							'longitude': 60.617777777777775
						}
					],
					'data': {
						'type': 'part',
						'uuid': 'link$4702',
						'header': 'Участок 1: Подвал Южная >> Щорса-37',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4702',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Площадка А',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Площадка Б',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Входит в ВОЛС',
								'value': {
									'label': 'Подвал Южная >> ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701'
								},
								'presentation': 'right_of_label'
							}
						],
						'color': '#4F4FD9'
					}
				},
				{
					'type': 'part',
					'geopositions': [
						{
							'latitude': 56.808611111111105,
							'longitude': 60.617777777777775
						},
						{
							'latitude': 56.791969277777774,
							'longitude': 60.621894805555556
						}
					],
					'data': {
						'type': 'part',
						'uuid': 'link$4703',
						'header': 'Участок 2: Щорса-37 >> ЦОД №1',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4703',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Площадка А',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Площадка Б',
								'value': {
									'label': 'ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3802'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Входит в ВОЛС',
								'value': {
									'label': 'Подвал Южная >> ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701'
								},
								'presentation': 'right_of_label'
							}
						],
						'color': ''
					}
				}
			],
			'equipments': [
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 56.79972222222222,
						'longitude': 60.61527777777778
					},
					'icon': '/sd/operator/download?uuid=file$5801',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$4103',
						'header': 'Муфта SNR-FOSC-D 1505',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4103',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'SNR-FOSC-D',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4401'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'clutch'
					}
				},
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 56.79972222222222,
						'longitude': 60.61527777777778
					},
					'icon': '/sd/operator/download?uuid=file$5802',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$4105',
						'header': 'Оптический кросс. TT 120',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4105',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'TT 120',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4402'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'cross'
					}
				},
				{
					'type': 'active',
					'geoposition': {
						'latitude': 56.79972222222222,
						'longitude': 60.61527777777778
					},
					'icon': '',
					'data': {
						'type': 'active',
						'uuid': 'cmdb$4110',
						'header': 'Маршрутизатор ACX2100',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4110',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'ACX2100',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4407'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							}
						]
					}
				},
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 56.808611111111105,
						'longitude': 60.617777777777775
					},
					'icon': '/sd/operator/download?uuid=file$5801',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$410у1',
						'header': 'Муфта SNR-FOSC-D 1500',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4101',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'SNR-FOSC-D',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4401'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'clutch'
					}
				},
				{
					'type': 'active',
					'geoposition': {
						'latitude': 56.808611111111105,
						'longitude': 60.617777777777775
					},
					'icon': '',
					'data': {
						'type': 'active',
						'uuid': 'cmdb$4109',
						'header': 'Маршрутизатор ASR 903',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4109',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'ASR 903',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4408'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							}
						]
					}
				},
				{
					'type': 'active',
					'geoposition': {
						'latitude': 56.808611111111105,
						'longitude': 60.617777777777775
					},
					'icon': '',
					'data': {
						'type': 'active',
						'uuid': 'cmdb$411а4',
						'header': 'Коммутатор Catalyst 9500-24Q-A7',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4114',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'Catalyst 9500-24Q-A7',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4409'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							}
						]
					}
				},
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 56.808611111111105,
						'longitude': 60.617777777777775
					},
					'icon': '/sd/operator/download?uuid=file$5801',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$4101',
						'header': 'Муфта SNR-FOSC-D 1500',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4101',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'SNR-FOSC-D',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4401'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'clutch'
					}
				},
				{
					'type': 'active',
					'geoposition': {
						'latitude': 56.808611111111105,
						'longitude': 60.617777777777775
					},
					'icon': '',
					'data': {
						'type': 'active',
						'uuid': 'cmdb$4в109',
						'header': 'Маршрутизатор ASR 903',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4109',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'ASR 903',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4408'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							}
						]
					}
				},
				{
					'type': 'active',
					'geoposition': {
						'latitude': 56.808611111111105,
						'longitude': 60.617777777777775
					},
					'icon': '',
					'data': {
						'type': 'active',
						'uuid': 'cmdb$4114',
						'header': 'Коммутатор Catalyst 9500-24Q-A7',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4114',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'Catalyst 9500-24Q-A7',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4409'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							}
						]
					}
				},
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 56.791969277777774,
						'longitude': 60.621894805555556
					},
					'icon': 'https://svgsilh.com/svg/1801287.svg',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$4108',
						'header': 'Оптический кросс. КРС -16d',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4108',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'КРС -16',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4403'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3802'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'cross'
					}
				}
			],
			'data': {
				'type': 'wols',
				'uuid': 'link$4701',
				'header': 'Подвал Южная >> ЦОД №1',
				'actions': [
					{
						'type': 'open_link',
						'name': '1 Перейти на карточку',
						'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701',
						'inPlace': false
					},
					{
						'type': 'open_link',
						'name': '2 Перейти на карточку',
						'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701',
						'inPlace': false
					}
				],
				'options': [
					{
						'label': 'Площадка А',
						'value': {
							'label': 'Подвал Южная',
							'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
						},
						'presentation': 'right_of_label'
					},
					{
						'label': 'Площадка Б',
						'value': {
							'label': 'ЦОД №1',
							'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3802'
						},
						'presentation': 'right_of_label'
					}
				],
				'color': '#4F4FD9'
			}
		},
		{
			'type': 'wols',
			'parts': [
				{
					'type': 'part',
					'geopositions': [
						{
							'latitude': 57.79972222222222,
							'longitude': 61.61527777777778
						},
						{
							'latitude': 57.808611111111105,
							'longitude': 60.617777777777775
						}
					],
					'data': {
						'type': 'part',
						'uuid': 'link$4702',
						'header': 'Участок 1: Подвал Южная >> Щорса-37',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4702',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Площадка А',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Площадка Б',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Входит в ВОЛС',
								'value': {
									'label': 'Подвал Южная >> ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701'
								},
								'presentation': 'right_of_label'
							}
						],
						'color': '#4F4FD9'
					}
				},
				{
					'type': 'part',
					'geopositions': [
						{
							'latitude': 57.808611111111105,
							'longitude': 60.617777777777775
						},
						{
							'latitude': 57.791969277777774,
							'longitude': 60.621894805555556
						}
					],
					'data': {
						'type': 'part',
						'uuid': 'link$4703',
						'header': 'Участок 2: Щорса-37 >> ЦОД №1',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4703',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Площадка А',
								'value': {
									'label': 'Щорса-37',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3803'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Площадка Б',
								'value': {
									'label': 'ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3802'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Входит в ВОЛС',
								'value': {
									'label': 'Подвал Южная >> ЦОД №1',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701'
								},
								'presentation': 'right_of_label'
							}
						],
						'color': ''
					}
				}
			],
			'equipments': [
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 57.79972222222222,
						'longitude': 60.61527777777778
					},
					'icon': '/sd/operator/download?uuid=file$5801',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$4103',
						'header': 'Муфта SNR-FOSC-D 1505',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4103',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'SNR-FOSC-D',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4401'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'clutch'
					}
				},
				{
					'type': 'passive',
					'geoposition': {
						'latitude': 57.79972222222222,
						'longitude': 60.61527777777778
					},
					'icon': '/sd/operator/download?uuid=file$5802',
					'data': {
						'type': 'passive',
						'uuid': 'cmdb$4105',
						'header': 'Оптический кросс. TT 120',
						'actions': [
							{
								'type': 'open_link',
								'name': 'Перейти на карточку',
								'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:cmdb$4105',
								'inPlace': false
							}
						],
						'options': [
							{
								'label': 'Модель',
								'value': {
									'label': 'TT 120',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:ciModel$4402'
								},
								'presentation': 'right_of_label'
							},
							{
								'label': 'Расположение',
								'value': {
									'label': 'Подвал Южная',
									'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
								},
								'presentation': 'right_of_label'
							}
						],
						'equipType': 'cross'
					}
				}
			],
			'data': {
				'type': 'wols',
				'uuid': 'link$47061',
				'header': '23 Южная >> ЦОД №1',
				'actions': [
					{
						'type': 'open_link',
						'name': 'Перейти на карточку',
						'link': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:link$4701',
						'inPlace': false
					}
				],
				'options': [
					{
						'label': 'Площадка А',
						'value': {
							'label': 'Подвал Южная',
							'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3801'
						},
						'presentation': 'right_of_label'
					},
					{
						'label': 'Площадка Б',
						'value': {
							'label': 'ЦОД №1',
							'url': 'https://inventory-nordclan.nsd.naumen.ru/sd/operator/?anchor=uuid:location$3802'
						},
						'presentation': 'right_of_label'
					}
				],
				'color': '#4F4FD9'
			}
		}
	],
	'errors': []
};
