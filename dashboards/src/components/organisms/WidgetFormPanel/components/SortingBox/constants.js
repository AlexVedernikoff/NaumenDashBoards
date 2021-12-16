// @flow
import {ICON_NAMES} from 'components/atoms/Icon';
import {SORTING_TYPES, SORTING_VALUES} from 'store/widgets/data/constants';
import type {SortingValueOption} from './types';

const SORTING_OPTIONS: Array<SortingValueOption> = [
	{
		label: 'SortingBox::SortingByDefault',
		value: SORTING_VALUES.DEFAULT
	},
	{
		label: 'SortingBox::SortingByParameter',
		value: SORTING_VALUES.PARAMETER
	},
	{
		label: 'SortingBox::SortingByIndicator',
		value: SORTING_VALUES.INDICATOR
	}
];

const SORTING_TYPE_OPTIONS = [
	{
		name: ICON_NAMES.DESC,
		title: 'SortingBox::SortingDesc',
		value: SORTING_TYPES.DESC
	},
	{
		name: ICON_NAMES.ASC,
		title: 'SortingBox::SortingAsc',
		value: SORTING_TYPES.ASC
	}
];

export {
	SORTING_OPTIONS,
	SORTING_TYPE_OPTIONS
};
