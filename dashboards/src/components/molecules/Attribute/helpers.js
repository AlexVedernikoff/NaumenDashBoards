// @flow
import {
	DATETIME_GROUP_OPTIONS,
	DEFAULT_AGGREGATION_OPTIONS,
	DEFAULT_GROUP_OPTIONS,
	INTEGER_AGGREGATION_OPTIONS
} from './constants';
import {TYPES} from 'store/sources/attributes/constants';

const getAggregateOptions = (attribute: Object | null) => {
	return attribute && TYPES.INTEGER.includes(attribute.type)
		? [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS]
		: DEFAULT_AGGREGATION_OPTIONS;
};

const getAggregationLabel = (aggregation: string) => {
	const value = [
		...INTEGER_AGGREGATION_OPTIONS,
		...DEFAULT_AGGREGATION_OPTIONS
	].find(o => o.value === aggregation);
	return value ? value.label : aggregation;
};

const getGroupOptions = (attribute: Object | null) => {
	if (attribute && TYPES.DATE.includes(attribute.type)) {
		return DATETIME_GROUP_OPTIONS;
	}

	return DEFAULT_GROUP_OPTIONS;
};

export {
	getAggregateOptions,
	getAggregationLabel,
	getGroupOptions
};
