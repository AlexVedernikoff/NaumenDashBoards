/* eslint-disable */

import {deepClone} from "../../helpers";

const data = {
	"attributesMap": {
		"employee": [
			{"code": "search_unlic", "title": "Атрибуты результатов поиска для нелицензированных пользователей"},
			{"code": "0f31f516-1b18-4863-829c-d36c462ab0d7", "title": "Для формы добавления заявки"}
		],
		"serviceCall": [
			{"code": "DlyaSlozhnoiFormyDobavleniyaVDublyah", "title": "Для сложной формы добавления в дублях"},
			{"code": "11eaebc5-dd95-4ea0-88fc-7304c034d1a0", "title": "Для карточки команды-ответственной"}
		]
	},
	"commonSettings":{
		"columnSettings":[
			{
				"title":"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",
				"code":"code1",
				"show":true,
				"editor":{
					"type": "date"
				}
			},
			{
				"title":"\u0422\u0438\u043f",
				"code":"5af9985a-79b4-42b9-9d0f-635f6d80561e",
				"show":true,
				"editor":{
					"type": "select", 
					"map_to": "priority", 
					"options": [
						{"label": "Сбор требований", "value": "PMProject$2449401"},
						{"label": "Сбор требований", "value": "PMProject$2449401"},
						{"label": "Разработка прототипа", "value": "PMProject$2460603"}
					]
				}
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
			// 	"title":"Добавить работу",
			// 	"code":"add",
			// 	"show":true
			// },
		],
		"rollUp":false,
		"scale":"MONTH"
	},
	"diagramKey":"root_gant2",
	"mandatoryAttributes" : {
		"employee": [
			{code: "parent", title: "Отдел"},
			{code: "creationDate", title: "Дата создания"}
		],
		"serviceCall": [
			{code: "metaClass", title: "Тип объекта"},
			{code: "creationDate", title: "Дата создания"}
		]
	},
	'milestonesCheckbox' : false,
	'tasks': [
		{
			"id":"serviceCall$2361601_cf19df0a-b957-4d6a-95e4-e70f438d1a0a",
			"text":"INC63",
			"code1":"INC63",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442",
			"start_date":"2021-11-11T12:55:26",
			"end_date": "2021-11-13T12:55:26",
			"level":0,
			"editor": {"map_to": "text", "type": "text"},
			"progress":0.8,
			"type":"RESOURCE",
			"workOfLink":"1",
			"editable": true,
			"name": "INC63"
		},
		{
			"id":"serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887",
			"text":"SD111",
			"code1":"SD111",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e": false,
			"start_date":"2021-11-11T11:55:26",
			"end_date": "2021-11-13T11:55:26",
			"level": 0,
			"type":"project",
			"workOfLink":"1",
			"editable": true,
			"name": "SD111"
		},
		{
			"id":"employee$752501_d63f121f-0c59-43a9-8b6a-145a0927041c",
			"text":"\u0418\u0432\u0430\u043d\u043e\u0432 \u0418\u0432\u0430\u043d",
			"code1":"\u0418\u0432\u0430\u043d\u043e\u0432 \u0418\u0432\u0430\u043d",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a",
			"parent":"serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887",
			"start_date":"2021-11-11T11:55:26",
			"end_date": "2021-11-13T11:55:26",
			"level":1,
			"type":"WORK",
			"workOfLink":"1",
			"editable": true,
			"name": "\u0418\u0432\u0430\u043d\u043e\u0432 \u0418\u0432\u0430\u043d"
		},
		{
			"id":"serviceCall$2419102_0c0310d7-f454-4baf-8eea-7f38066a317c",
			"text":"112",
			"code1":"112",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435",
			"level":0,
			"type":"RESOURCE",
			"editable": true
		},
		{
			"id":"serviceCall$2418501_572397e3-0c6a-4ef9-bd45-c3d2cd64b99d",
			"text":"INC109",
			"code1":"INC109",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442",
			"level":0,
			"type":"RESOURCE",
			"editable": true
		},
		{
			"id":"serviceCall$2418501_572397e3-0c6a-4ef9-bd45-c3d2cd64b99d211",
			"text":"Промежуточная точка",
			"code1":"точка",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442",
			"level":0,
			"hide_bar": false,
			"type":"milestone",
			"completed": true,
			"start_date":"2021-11-11T11:55:26",
			"editable": true
		},

		{
			"id":"serviceCall$2418501_572397e3-0c6a-4ef9-bd45-c3d2cd64b99d21",
			"text":"Контрольная точка",
			"code1":"точка2",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442",
			"level":1,
			"hide_bar": false,
			"type":"milestone",
			"completed" : true,
			"start_date":"2021-11-13T12:55:26",
			"parent": "serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887",
			"editable": true
		},
	],
	"workRelations":[
        { 
			"source":"serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887", 
			"target":"serviceCall$2361601_cf19df0a-b957-4d6a-95e4-e70f438d1a0a", 
			"type":"1",
			"editable": true
		}
    ],
	"progressCheckbox": false,
	"workRelationCheckbox": false,
	"startDate": "10.01.2021, 15:17:45",
	"endDate": "11.12.2021, 15:17:45",
	"currentInterval": {"label": "сегодня", "value": "NEXTDAYS"},
};

export const getDiagramData = () => {
	const a = deepClone(data);

	if (data && data.tasks) {
		data.tasks.push(
			{
				'id': '4567fghgfd891' + Math.random(),
				'code1': 'Второе2' + Math.random(),
				'parent': '4567890',
				'd951f7': '4556',
				'text': 'Название на календарной сетке1',
				'start_date': '2021-10-14T00:00:50+0000',
				'end_date': '2021-10-14T00:01:50+0000',
			}
		);
	}

	return a;
};
