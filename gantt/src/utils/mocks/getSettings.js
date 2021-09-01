/* eslint-disable */

export default {
	'commonSettings': {
		'columnSettings': [
			{
				'code': 'd951f959-640b-4b47-b7ed-2f0daf7867',
				'show': true,
				'title': 'Название'
			},
			{
				'code': 'd951f7',
				'show': true,
				'title': 'Другое'
			},
			{
				'code': 'd951f9',
				'show': false,
				'title': 'Дата'
			}
		],
		'rollUp': false,
		'scale': 'MONTH'
	},
	'diagramKey': 'testGantt',
	'resourceAndWorkSettings': [
		{
			'attributeSettings': [
				{
					'attribute': {
						'code': "removalDate",
						'declaredMetaClass': "abstractBO",
						'metaClassFqn': "serviceCall$serviceCall",
						'property': null,
						'ref': null,
						'sourceCode': "serviceCall$serviceCall",
						'sourceName': "Инцидент",
						'title': "Дата архивирования",
						'type': "dateTime"
					},
					'code': "d951f9",
				},
				{
					'attribute': {
						'code': "linkedSC",
						'declaredMetaClass': "serviceCall",
						'metaClassFqn': "serviceCall$serviceCall",
						'property': "serviceCall",
						'ref': null,
						'sourceCode': "serviceCall$serviceCall",
						'sourceName': "Инцидент",
						'title': "Головной запрос"
					},
					'code': "d951f7",
				},
				{
					'attribute': null,
					'code': "d951f959-640b-4b47-b7ed-2f0daf7867",
				}
			],
			'communicationResourceAttribute': null,
			'nested': false,
			'source': {
				'descriptor': '',
				'value': {
					'label': 'Обращение',
					'value': 'serviceCall$call'
				}
			},
			'id': '123456789',
			'parent': '',
			'level': 0,
			'type': 'RESOURCE'
		},
		{
			'attributeSettings': [
				{
					'attribute': {
						'code': 'title',
						'title': '',
					},
					'code': 'd951f959-640b-4b47-b7ed-2f0daf7867',
				}
			],
			'communicationResourceAttribute': {
				'code': 'd951f7',
				'title': 'Название'
			},
			'nested': true,
			'source': {
				'descriptor': '',
				'value': {
					'label': 'Шаблон',
					'value': 'template'
				}
			},
			'id': '567876543456',
			'parent': '123456789',
			'level': 1,
			'type': 'RESOURCE'
		},
		{
			'attributeSettings': [
				{
					'attribute': {
						'code': 'title',
						'property': null,
						'title': 'test',
						'declaredMetaClass': null,
						'type': null,
						'metaClassFqn': 'service',
						'sourceCode': null,
						'ref': null,
						'sourceName': null
					},
					'code': 'd951f7',
				}
			],
			'communicationResourceAttribute': {
				'code': 'template',
				'declaredMetaClass': null,
				'property': 'serviceCall',
				'metaClassFqn': 'service',
				'title': 'Шаблон',
				'ref': null,
				'type': null,
				'sourceCode': null,
				'sourceName': null
			},
			'endWorkAttribute': null,
			'nested': true,
			'source': {
				'descriptor': '',
				'value': {
					'label': 'Шаблон задач',
					'value': 'template$templateTask'
				}
			},
			'startWorkAttribute': {
				'code': 'Атрибут',
				'declaredMetaClass': null,
				'metaClassFqn': 'service',
				'property': 'serviceCall',
				'ref': null,
				'sourceCode': null,
				'title': 'test date',
				'sourceName': null,
				'type': 'date',
			},
			'communicationWorkAttribute': null,
			'id': 'a099865',
			'parent': '567876543456',
			'level': 2,
			'type': 'WORK'
		}
	]
};
