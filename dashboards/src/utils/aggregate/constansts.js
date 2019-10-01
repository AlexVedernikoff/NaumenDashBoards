// @flow
const AVERAGE: 'AVERAGE' = 'AVERAGE';
const COUNT: 'COUNT_CNT' = 'COUNT_CNT';
const MAX: 'MAX' = 'MAX';
const MEDIAN: 'MEDIAN' = 'MEDIAN';
const MIN: 'MIN' = 'MIN';
const PERCENT: 'PERCENT' = 'PERCENT';
const SUM: 'SUM' = 'SUM';

const DEFAULT_VARIANTS = {
	COUNT,
	PERCENT
};

const INTEGER_VARIANTS = {
	AVERAGE,
	MAX,
	MEDIAN,
	MIN,
	SUM
};

const INTEGER_TYPE: 'integer' = 'integer';

export {
	DEFAULT_VARIANTS,
	INTEGER_TYPE,
	INTEGER_VARIANTS
};
