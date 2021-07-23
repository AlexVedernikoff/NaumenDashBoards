// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	DEFAULT_AGGREGATION_OPTIONS,
	INTEGER_AGGREGATION_OPTIONS,
	NOT_APPLICABLE_OPTION,
	REF_AGGREGATION_OPTIONS
} from './constants';

const getAggregationOptions = (attribute: Attribute | null, withNotApplicableAggregation: boolean = false) => {
	let options = DEFAULT_AGGREGATION_OPTIONS;

	if (attribute) {
		const {type} = attribute;

		if (type in ATTRIBUTE_SETS.NUMBER || type === ATTRIBUTE_TYPES.dtInterval) {
			options = [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS];
		}

		if (type === ATTRIBUTE_TYPES.catalogItem) {
			options = REF_AGGREGATION_OPTIONS;
		}
	}

	if (withNotApplicableAggregation) {
		options = [...options, NOT_APPLICABLE_OPTION];
	}

	return options;
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