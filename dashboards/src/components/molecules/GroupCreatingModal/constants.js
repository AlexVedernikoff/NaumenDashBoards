// @flow
import {GROUP_TYPES} from 'store/widgets/constants';

const TYPE_OPTIONS = [
	{
		label: 'Системная',
		value: GROUP_TYPES.SYSTEM
	},
	{
		label: 'Пользовательская',
		value: GROUP_TYPES.CUSTOM
	}
];

const IS_NEW = Symbol('new');

// название полей
const attributeTitle: 'attributeTitle' = 'attributeTitle';
const data: 'data' = 'data';
const endDate: 'endDate' = 'endDate';
const name: 'name' = 'name';
const startDate: 'startDate' = 'startDate';
const systemValue: 'systemValue' = 'systemValue';
const type: 'type' = 'type';

const FIELDS = {
	attributeTitle,
	data,
	endDate,
	name,
	startDate,
	systemValue,
	type
};

const BASE_VALIDATION_SUBGROUP_PATH = 'subGroups';

export {
	BASE_VALIDATION_SUBGROUP_PATH,
	FIELDS,
	IS_NEW,
	TYPE_OPTIONS
};
