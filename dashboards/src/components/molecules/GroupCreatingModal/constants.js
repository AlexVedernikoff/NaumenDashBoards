// @flow
import {DATETIME_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';

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
const way: 'way' = 'way';

const FIELDS = {
	attributeTitle,
	data,
	endDate,
	name,
	startDate,
	systemValue,
	type,
	way
};

// Базовый путь валидации кастомных группировок
const BASE_VALIDATION_SUBGROUP_PATH = 'subGroups';

// Опции выбора системной группировки к атрибуту типа дата\время
const DATETIME_SYSTEM_OPTIONS = [
	{
		label: 'День',
		value: DATETIME_SYSTEM_GROUP.DAY
	},
	{
		label: 'Неделя',
		value: DATETIME_SYSTEM_GROUP.WEEK
	},
	{
		label: '7 дней',
		value: DATETIME_SYSTEM_GROUP.SEVEN_DAYS
	},
	{
		label: 'Месяц',
		value: DATETIME_SYSTEM_GROUP.MONTH
	},
	{
		label: 'Квартал',
		value: DATETIME_SYSTEM_GROUP.QUARTER
	},
	{
		label: 'Год',
		value: DATETIME_SYSTEM_GROUP.YEAR
	}
];

export {
	BASE_VALIDATION_SUBGROUP_PATH,
	DATETIME_SYSTEM_OPTIONS,
	LOCAL_PREFIX_ID,
	FIELDS,
	IS_NEW,
	TYPE_OPTIONS
};
