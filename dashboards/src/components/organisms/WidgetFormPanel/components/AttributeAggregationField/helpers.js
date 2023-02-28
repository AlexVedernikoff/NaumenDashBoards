// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	AVG_APPLICABLE_OPTION,
	CALCULATE_OPTION,
	DEFAULT_AGGREGATION_OPTIONS,
	INTEGER_AGGREGATION_OPTIONS,
	NOT_APPLICABLE_OPTION,
	PERCENT_APPLICABLE_OPTION,
	PERCENT_COUNT_APPLICABLE_OPTION
} from './constants';

const getAggregationOptions = (
	attribute: Attribute | null,
	hasPercentAggregation: boolean = true,
	withNotApplicableAggregation: boolean = false,
	hasCreateCalculatedFieldButton: boolean = false
) => {
	let result = [...DEFAULT_AGGREGATION_OPTIONS];

	if (attribute) {
		const {ableForAvg, type} = attribute;

		if (type in ATTRIBUTE_SETS.NUMBER || type === ATTRIBUTE_TYPES.dtInterval) {
			result = [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS];
		}

		if (ableForAvg) {
			result.push(AVG_APPLICABLE_OPTION);
		}
	}

	if (withNotApplicableAggregation) {
		result.push(NOT_APPLICABLE_OPTION);
	}

	if (!hasPercentAggregation) {
		const percentTypes = [PERCENT_APPLICABLE_OPTION.value, PERCENT_COUNT_APPLICABLE_OPTION.value];

		result = result.filter(item => !percentTypes.includes(item.value));
	}

	if (hasCreateCalculatedFieldButton) {
		result.push(CALCULATE_OPTION);
	}

	return result;
};

const getAggregationLabel = (aggregation: string) => {
	const fullAggregations = [...INTEGER_AGGREGATION_OPTIONS, ...DEFAULT_AGGREGATION_OPTIONS];
	const value = fullAggregations.find(o => o.value === aggregation);

	return value ? value.label : aggregation;
};

const getDefaultAggregation = (attribute: Object | null) =>
	getAggregationOptions(attribute)[0].value;

export {
	getAggregationLabel,
	getAggregationOptions,
	getDefaultAggregation
};
