// @flow
import type {ChartSorting} from 'store/widgets/data/types';
import {GROUP_WAYS} from 'store/widgets/constants';
import type {Parameter} from 'store/widgetForms/types';
import {SORTING_VALUES} from 'store/widgets/data/constants';

const getSortValue = (parameters: Array<Parameter>, sorting: ChartSorting) => {
	const {group} = parameters[0];
	const {DEFAULT, INDICATOR} = SORTING_VALUES;
	let {value} = sorting;

	if (group.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
		value = DEFAULT;
	} else if (sorting.value === DEFAULT) {
		value = INDICATOR;
	}

	return value;
};

export {
	getSortValue
};
