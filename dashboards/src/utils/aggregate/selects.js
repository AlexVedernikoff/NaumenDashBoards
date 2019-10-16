// @flow
import {DEFAULT_VARIANTS, INTEGER_VARIANTS} from './constansts';

const DEFAULT_SELECTS = [
	{
		label: 'CNT',
		value: DEFAULT_VARIANTS.COUNT
	},
	{
		label: '%',
		value: DEFAULT_VARIANTS.PERCENT
	}
];

const INTEGER_SELECTS = [
	{
		label: 'SUM',
		value: INTEGER_VARIANTS.SUM
	},
	{
		label: 'AVG',
		value: INTEGER_VARIANTS.AVERAGE
	},
	{
		label: 'MAX',
		value: INTEGER_VARIANTS.MAX
	},
	{
		label: 'MIN',
		value: INTEGER_VARIANTS.MIN
	},
	{
		label: 'MED',
		value: INTEGER_VARIANTS.MEDIAN
	}
];

const AGGREGATE_SELECTS = {
	DEFAULT_SELECTS,
	INTEGER_SELECTS
};

export {
	AGGREGATE_SELECTS
};
