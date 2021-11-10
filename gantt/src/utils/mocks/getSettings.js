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
				'title': 'Другое?'
			},
			{
				'code': 'd951f9',
				'show': false,
				'title': 'Дата'
			}
		],
		'rollUp': false,
		'scale': 'DAY'
	},
	'diagramKey': 'testGantt',
	'resourceAndWorkSettings': [
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "removalDate",
							"declaredMetaClass": "abstractBO",
							"metaClassFqn": "serviceCall$serviceCall",
							"property": null,
							"ref": null,
							"sourceCode": "serviceCall$serviceCall",
							"sourceName": "Инцидент",
							"title": "Дата архивирования",
							"type": "dateTime"
						},
						"code": "d951f9"
					},
					{
						"attribute": {
							"code": "linkedSC",
							"declaredMetaClass": "serviceCall",
							"metaClassFqn": "serviceCall$serviceCall",
							"property": "serviceCall",
							"ref": null,
							"sourceCode": "serviceCall$serviceCall",
							"sourceName": "Инцидент",
							"title": "Головной запрос"
						},
						"code": "d951f7"
					},
					{
						"attribute": null,
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"nested": false,
				"source": {
					"descriptor": "123",
					"value": {
						"label": "Обращение",
						"value": "serviceCall$call"
					}
				},
				"id": "123456789",
				"parent": "",
				"level": 0,
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": {
					"code": "d951f7",
					"title": "Название"
				},
				"nested": true,
				"source": {
					"descriptor": "",
					"value": {
						"label": "Шаблон",
						"value": "template"
					}
				},
				"id": "567876543456",
				"parent": "123456789",
				"level": 1,
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"property": null,
							"title": "test",
							"declaredMetaClass": null,
							"type": null,
							"metaClassFqn": "service",
							"sourceCode": null,
							"ref": null,
							"sourceName": null
						},
						"code": "d951f7"
					}
				],
				"communicationResourceAttribute": {
					"code": "template",
					"declaredMetaClass": null,
					"property": "serviceCall",
					"metaClassFqn": "service",
					"title": "Шаблон",
					"ref": null,
					"type": null,
					"sourceCode": null,
					"sourceName": null
				},
				"endWorkAttribute": null,
				"nested": false,
				"source": {
					"descriptor": "",
					"value": {
						"label": "Шаблон задач",
						"value": "template$templateTask"
					}
				},
				"startWorkAttribute": {
					"code": "Атрибут",
					"declaredMetaClass": null,
					"metaClassFqn": "service",
					"property": "serviceCall",
					"ref": null,
					"sourceCode": null,
					"title": "test date",
					"sourceName": null,
					"type": "date"
				},
				"communicationWorkAttribute": null,
				"id": "a099865",
				"parent": "567876543456",
				"level": 2,
				"type": "WORK"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "f48bb0c2-e51f-4a03-9647-c927ad07c47d",
				"level": 1,
				"nested": true,
				"parent": "123456789",
				"source": {
					"descriptor": "",
					"value": {
						"label": "1Настраиваемый лог",
						"value": "log"
					}
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "690d5937-9491-4062-b751-7c40a6df1c44",
				"level": 2,
				"nested": true,
				"parent": "f48bb0c2-e51f-4a03-9647-c927ad07c47d",
				"source": {
					"descriptor": "",
					"value": {
						"label": "2Настраиваемый лог",
						"value": "log"
					}
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "3f646ff7-6180-49be-8b96-2e282e76116d",
				"level": 2,
				"nested": true,
				"parent": "f48bb0c2-e51f-4a03-9647-c927ad07c47d",
				"source": {
					"descriptor": "",
					"value": {
						"label": "3Настраиваемый лог",
						"value": "log"
					}
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "db14a929-e6af-41b2-8eb5-05c8df462cc6",
				"level": 2,
				"nested": true,
				"parent": "f48bb0c2-e51f-4a03-9647-c927ad07c47d",
				"source": {
					"descriptor": "",
					"value": {
						"label": "4Настраиваемый лог",
						"value": "log"
					}
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "7097f9e6-81b7-4e09-8e7e-e38905481cdf",
				"level": 1,
				"nested": true,
				"parent": "123456789",
				"source": {
					"descriptor": "",
					"value": null
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "fe7c2b14-c74d-4d34-8365-7095528c5499",
				"level": 2,
				"nested": true,
				"parent": "7097f9e6-81b7-4e09-8e7e-e38905481cdf",
				"source": {
					"descriptor": "",
					"value": null
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "11fe24ff-267c-484e-a4cc-710d5408a4d1",
				"level": 0,
				"nested": false,
				"parent": "",
				"source": {
					"descriptor": "",
					"value": {
						"label": "Документ",
						"value": "document"
					}
				},
				"type": "RESOURCE"
			},
			{
				"attributeSettings": [
					{
						"attribute": {
							"code": "title",
							"title": ""
						},
						"code": "d951f959-640b-4b47-b7ed-2f0daf7867"
					}
				],
				"communicationResourceAttribute": null,
				"communicationWorkAttribute": null,
				"id": "a89b1ec6-00bb-4da1-baf0-2c58b3161db8",
				"level": 0,
				"nested": false,
				"parent": "",
				"source": {
					"descriptor": "",
					"value": null
				},
				"type": "RESOURCE"
			}
	]
};
