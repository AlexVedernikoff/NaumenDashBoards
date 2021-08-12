/* eslint-disable */

export default {
	'commonSettings': {
		'columnSettings': [
			{
				'code': 'd951f959-640b-4b47-b7ed-6b2f0daf7867',
				'show': true,
				'title': 'Название'
			}
		],
		'rollUp': false,
		'scale': 'MONTH'
	},
	'diagramKey': null,
	'resourceAndWorkSettings': [
		{
			'attributeSettings': [
				{
					'attribute': {
						'code': 'title',
						'property': null,
						'title': 'test',
						'declaredMetaClass': null,
						'type': null,
						'metaClassFqn': 'serviceCall',
						'sourceCode': null,
						'ref': null,
						'sourceName': null
					},
					'code': 'title',
					'title': 'name'
				}
			],
			'communicationResourceAttribute': null,
			'communicationWorkAttribute': null,
			'nested': true,
			'source': {
				'descriptor': '',
				'value': {
					'label': 'Запрос',
					'value': 'serviceCall'
				}
			},
			'level': 1,
			'type': 'WORK'
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
					'code': 'title',
					'title': 'name'
				}
			],
			'communicationResourceAttribute': {
				'code': 'test_test',
				'declaredMetaClass': null,
				'property': 'serviceCall',
				'metaClassFqn': 'service',
				'title': 'test',
				'ref': null,
				'type': null,
				'sourceCode': null,
				'sourceName': null
			},
			'nested': true,
			'source': {
				'descriptor': '',
				'value': {
					'label': 'Шаблон',
					'value': 'template'
				}
			},
			'level': 5,
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
					'code': 'title',
					'title': 'name'
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
			'endWorkAttribute': {
				'code': 'test_end_date',
				'declaredMetaClass': null,
				'property': 'serviceCall',
				'metaClassFqn': 'service',
				'title': 'test date',
				'ref': null,
				'type': 'date',
				'sourceCode': null,
				'sourceName': null
			},
			'nested': true,
			'source': {
				'descriptor': '',
				'value': {
					'label': 'Шаблон задач',
					'value': 'template$templateTask'
				}
			},
			'startWorkAttribute': {
				'code': 'test_date',
				'declaredMetaClass': null,
				'metaClassFqn': 'service',
				'property': 'serviceCall',
				'ref': null,
				'sourceCode': null,
				'title': 'test date',
				'sourceName': null,
				'type': 'date'
			},
			'level': 2,
			'type': 'WORK'
		}
	]
};
