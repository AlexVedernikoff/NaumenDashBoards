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
					"type": "date", 
					"map_to": "5af9985a-79b4-42b9-9d0f-635f6d80561e", 
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
			"id":"employee$75250",
			"text":"1",
			"code1":"1",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"2020-11-13T12:55:26",
			"level":0,
			"progress":0.8,
			"type":"RESOURCE",
			"workOfLink":"22",
			"editable": true,
			"name": "1"
		},
		{
			"id":"2",
			"text":"1",
			"code1":"1",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"2020-11-13T12:55:26",
			"start_date": "2015-11-13T12:55:26",
			"end_date": "2022-11-13T12:55:26",
			"level":1,
			"progress":0.8,
			"type":"WORK",
			"workOfLink":"12",
			"editable": true,
			"name": "1",
			"parent": 'employee$75250'
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
	"startDate": "2024-09-02, 00:00:00",
	"endDate": "2024-09-07, 00:00:00",
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
