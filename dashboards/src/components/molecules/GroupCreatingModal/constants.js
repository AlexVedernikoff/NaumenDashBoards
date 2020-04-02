// @flow
import {GROUP_WAYS} from 'store/widgets/constants';

// Опции выбора способа создания группировки
const TYPE_OPTIONS = [
	{
		label: 'Системная',
		value: GROUP_WAYS.SYSTEM
	},
	{
		label: 'Пользовательская',
		value: GROUP_WAYS.CUSTOM
	}
];

// Символьный ключ для отслеживания только что созданных группировок
const IS_NEW = Symbol('new');
// Префикс локального ключа для новой группировки
const LOCAL_PREFIX_ID: 'local_' = 'local_';

// название полей
const attributeTitle: 'attributeTitle' = 'attributeTitle';
const data: 'data' = 'data';
const endDate: 'endDate' = 'endDate';
const name: 'name' = 'name';
const startDate: 'startDate' = 'startDate';
const systemValue: 'systemValue' = 'systemValue';
const type: 'type' = 'type';
const value: 'value' = 'value';
const way: 'way' = 'way';

const FIELDS = {
	attributeTitle,
	data,
	endDate,
	name,
	startDate,
	systemValue,
	type,
	value,
	way
};

export {
	LOCAL_PREFIX_ID,
	FIELDS,
	IS_NEW,
	TYPE_OPTIONS
};
