// @flow
import {DEFAULT_AGGREGATION, INTEGER_AGGREGATION} from 'store/widgets/constants';

const DEFAULT_AGGREGATION_OPTIONS = [
	{
		label: 'CNT',
		value: DEFAULT_AGGREGATION.COUNT
	},
	{
		label: '%',
		value: DEFAULT_AGGREGATION.PERCENT
	}
];

const INTEGER_AGGREGATION_OPTIONS = [
	{
		label: 'SUM',
		value: INTEGER_AGGREGATION.SUM
	},
	{
		label: 'AVG',
		value: INTEGER_AGGREGATION.AVG
	},
	{
		label: 'MAX',
		value: INTEGER_AGGREGATION.MAX
	},
	{
		label: 'MIN',
		value: INTEGER_AGGREGATION.MIN
	}
];

const REF_AGGREGATION_OPTIONS = [
  ...DEFAULT_AGGREGATION_OPTIONS,
  {
    label: 'AVG',
    value: INTEGER_AGGREGATION.AVG
  }
];

export {
	DEFAULT_AGGREGATION_OPTIONS,
	INTEGER_AGGREGATION_OPTIONS,
	REF_AGGREGATION_OPTIONS
};
