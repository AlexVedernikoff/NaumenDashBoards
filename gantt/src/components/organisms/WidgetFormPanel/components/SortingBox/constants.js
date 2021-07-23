// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {SORTING_TYPES, SORTING_VALUES} from 'store/widgets/data/constants';

const SORTING_OPTIONS = [
	{
		label: 'По умолчанию',
		value: SORTING_VALUES.DEFAULT
	},
	{
		label: 'Параметр',
		value: SORTING_VALUES.PARAMETER
	},
	{
		label: 'Показатель',
		value: SORTING_VALUES.INDICATOR
	}
];

const SORTING_TYPE_OPTIONS = [
	{
		name: ICON_NAMES.DESC,
		title: 'По убыванию',
		value: SORTING_TYPES.DESC
	},
	{
		name: ICON_NAMES.ASC,
		title: 'По возрастанию',
		value: SORTING_TYPES.ASC
	}
];

export {
	SORTING_OPTIONS,
	SORTING_TYPE_OPTIONS
};
