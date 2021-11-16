/* eslint-disable */

import {deepClone} from "../../helpers";

const data = {
	"commonSettings":{
		"columnSettings":[
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
				"show":true
			},
			{
				"title":"\u041e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439",
				"code":"c1bac275-f9ec-47b6-af1a-6288f593d0d6",
				"show":true
			},
			{
				"title":"\u0421\u0442\u0430\u0442\u0443\u0441",
				"code":"897b5f7e-c415-4225-bdc8-aa0fca5327ed",
				"show":true
			}
		],
		"rollUp":false,
		"scale":"MONTH"
	},
	"diagramKey":"root_gant2",
	'tasks': [
		{
			"id":"serviceCall$2361601_cf19df0a-b957-4d6a-95e4-e70f438d1a0a",
			"text":"INC63",
			"d951f959-640b-4b47-b7ed-2f0daf7867":"INC63",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442",
			"level":0,
			"type":"RESOURCE"
		},
		{
			"id":"serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887",
			"text":"SD111",
			"d951f959-640b-4b47-b7ed-2f0daf7867":"SD111",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u041e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u0435",
			"level":0,
			"type":"project"
		},
		{
			"id":"employee$752501_d63f121f-0c59-43a9-8b6a-145a0927041c",
			"text":"\u0418\u0432\u0430\u043d\u043e\u0432 \u0418\u0432\u0430\u043d",
			"d951f959-640b-4b47-b7ed-2f0daf7867":"\u0418\u0432\u0430\u043d\u043e\u0432 \u0418\u0432\u0430\u043d",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a",
			"parent":"serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887",
			"start_date":"2021-11-11T11:55:26",
			"end_date": "2021-11-13T11:55:26",
			"level":1,
			"type":"WORK"
		},
		{
			"id":"serviceCall$2419102_0c0310d7-f454-4baf-8eea-7f38066a317c",
			"text":"112",
			"d951f959-640b-4b47-b7ed-2f0daf7867":"112",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0417\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u0435",
			"level":0,
			"type":"RESOURCE"
		},
		{
			"id":"serviceCall$2418501_572397e3-0c6a-4ef9-bd45-c3d2cd64b99d",
			"text":"INC109",
			"d951f959-640b-4b47-b7ed-2f0daf7867":"INC109",
			"5af9985a-79b4-42b9-9d0f-635f6d80561e":"\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442",
			"level":0,
			"type":"RESOURCE"
		},
	]
};

export const getDiagramData = () => {
  const a = deepClone(data);

  if (data && data.tasks) {
		data.tasks.push(
			{
				'id': '4567fghgfd891' + Math.random(),
				'd951f959-640b-4b47-b7ed-2f0daf7867': 'Второе2' + Math.random(),
				'parent': '4567890',
				'd951f7': '4556',
				'text': 'Название на календарной сетке1',
				'start_date': '2021-04-14T00:00:50+0000',
				'end_date': '2021-04-14T00:01:50+0000',
			},
			{
				'id': '456789jk2' + Math.random(),
				'd951f959-640b-4b47-b7ed-2f0daf7867': 'Другое23456789' + Math.random(),
				'd951f7': '4577777776',
				'd951f9': '16-04-2019',
				'duration': 480,
				'start_date': null
			});

		if (Math.random() < 0.3) {
			data.tasks.splice(1, 1)
		}
	}

	return a;
};
