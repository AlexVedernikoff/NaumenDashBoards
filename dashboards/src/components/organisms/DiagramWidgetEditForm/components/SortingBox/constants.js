// @flow
import {SORTING_VALUES} from 'store/widgets/data/constants';

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

export {
	SORTING_OPTIONS
};
