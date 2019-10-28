// @flow
import type {Attribute} from 'store/sources/attributes/types';
import OPTIONS from './constants/options';
import type {SelectValue} from './types';
import TYPES from './constants/types';

const getAggregateOptions = (option: Attribute | null): SelectValue[] => {
	const {DEFAULT_AGGREGATIONS, INTEGER_AGGREGATIONS} = OPTIONS;

	return option && TYPES.INTEGER.includes(option.type) ? [...INTEGER_AGGREGATIONS, ...DEFAULT_AGGREGATIONS] : DEFAULT_AGGREGATIONS;
};

const getGroupOptions = (xAxis: Attribute | null): SelectValue[] => {
	const {DATETIME_GROUPS, DEFAULT_GROUPS} = OPTIONS;

	if (xAxis && TYPES.DATE.includes(xAxis.type)) {
		return DATETIME_GROUPS;
	}

	return DEFAULT_GROUPS;
};

export {
	getAggregateOptions,
	getGroupOptions
};
