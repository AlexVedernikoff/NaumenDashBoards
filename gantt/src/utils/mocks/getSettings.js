/* eslint-disable */

export default {
	'commonSettings': {
		'columnSettings': [
			{
				"title":"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",
				"code":"d951f959-640b-4b47-b7ed-2f0daf7867",
				"show":true
			},
			{
				"title":"\u0422\u0438\u043f",
				"code":"5af9985a-79b4-42b9-9d0f-635f6d80561e",
				"show":true
			},
			{
				"title":"\u0414\u0430\u0442\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f",
				"code":"f55d87bc-b3ee-4d95-ac5d-144f51cfa8cb",
				"show":false
			},
			{
				"title":"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435\u0435",
				"code":"d951f959-640b-4b47-b7ed-2f0daf78671",
				"show":true
			},
			{
				"title":"\u0422\u0438\u043f\u043f",
				"code":"5af9985a-79b4-42b9-9d0f-635f6d80561e2",
				"show":true
			},
			{
				"title":"\u0414\u0430\u0442\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u044f\u044f",
				"code":"f55d87bc-b3ee-4d95-ac5d-144f51cfa8cb3",
				"show":false
			},
			// Необходимо для следующей итерации
			// {
			// 	"title":"",
			// 	"code":"add",
			// 	"show":true
			// },
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
						"code": "code1"
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
						"code": "code2"
					},
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
				"checkpointStatusAttr": {
					"code": "stateStartTime",
					"declaredMetaClass": "serviceCall$PMTask",
					"label": null,
					"metaClassFqn": "serviceCall$PMTask",
					"property": null,
					"ref": null,
					"sourceCode": "serviceCall$PMTask",
					"sourceName": "Проектная активность",
					"title": "Дата входа в статус",
					"type": "dateTime",
					"value": null
				},
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
				"level": 1,
				"parent": "123456789",
				"type": "WORK"
			},
	],
	"workProgresses": {
		"employee$752501": 0.4891304347826087,
		"serviceCall$2347805": 0.4437299035369775
	}
};
