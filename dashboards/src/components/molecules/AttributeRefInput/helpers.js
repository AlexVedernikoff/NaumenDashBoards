// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DATETIME_GROUP_OPTIONS, DEFAULT_AGGREGATION_OPTIONS, DEFAULT_GROUP_OPTIONS, INTEGER_AGGREGATION_OPTIONS} from './constants';
import {TYPES} from 'store/sources/attributes/constants';

const getAggregateOptions = (attribute: Attribute | null) => {
	return attribute && TYPES.INTEGER.includes(attribute.type)
		? [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS]
		: DEFAULT_AGGREGATION_OPTIONS;
};

const getGroupOptions = (attribute: Attribute | null) => {
	if (attribute && TYPES.DATE.includes(attribute.type)) {
		return DATETIME_GROUP_OPTIONS;
	}

	return DEFAULT_GROUP_OPTIONS;
};

export {
	getAggregateOptions,
	getGroupOptions
};
