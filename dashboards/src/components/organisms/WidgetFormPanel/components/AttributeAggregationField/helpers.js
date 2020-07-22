// @flow
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {DEFAULT_AGGREGATION_OPTIONS, INTEGER_AGGREGATION_OPTIONS, REF_AGGREGATION_OPTIONS} from './constants';

const getAggregationOptions = (attribute: Object | null) => {
	if (attribute) {
		const {type} = attribute;

		if (type in ATTRIBUTE_SETS.NUMBER || type === ATTRIBUTE_TYPES.dtInterval) {
			return [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS];
		}

		if (type === ATTRIBUTE_TYPES.catalogItem) {
			return REF_AGGREGATION_OPTIONS;
		}
	}

	return DEFAULT_AGGREGATION_OPTIONS;
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
