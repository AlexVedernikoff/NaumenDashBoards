// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {DEFAULT_AGGREGATION_OPTIONS, INTEGER_AGGREGATION_OPTIONS} from './constants';

const getAggregationOptions = (attribute: Object | null) => {
	return attribute && ATTRIBUTE_SETS.NUMBER.includes(attribute.type)
		? [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS]
		: DEFAULT_AGGREGATION_OPTIONS;
};

const getAggregationLabel = (aggregation: string) => {
	const value = [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS].find(o => o.value === aggregation);
	return value ? value.label : aggregation;
};

const getDefaultAggregation = (attribute: Object | null) => getAggregationOptions(attribute)[0].value;

export {
	getAggregationLabel,
	getAggregationOptions,
	getDefaultAggregation
};
