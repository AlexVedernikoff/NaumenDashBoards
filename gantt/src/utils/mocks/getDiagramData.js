/* eslint-disable */

import {deepClone} from "../../helpers";

const data = {
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
	'tasks': [
		{
			'id': '4567890',
			'd951f959-640b-4b47-b7ed-2f0daf7867': 'Первое',
			'd951f7': '123'
		},
		{
			'id': '4567891',
			'd951f959-640b-4b47-b7ed-2f0daf7867': 'Второе',
			'parent': '4567890',
			'd951f7': '4556',
			'text': 'Название на календарной сетке',
			'start_date': "2020-12-06T09:14:26+0000",
			'end_date': '2021-04-14T00:01:50+0000',
		},
		{
			'id': '4567892',
			'd951f959-640b-4b47-b7ed-2f0daf7867': 'ДругоеДругоеДругоеДругое ДругоеДругоеДругое ДругоеДругоеДругое ДругоеДругоеДругое',
			'parent': '4567890',
			'd951f7': '4577777776',
			'd951f9': '16-05-2019',
			'duration': 480,
			'start_date': "2021-05-06T09:14:26+0000",
		}
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
