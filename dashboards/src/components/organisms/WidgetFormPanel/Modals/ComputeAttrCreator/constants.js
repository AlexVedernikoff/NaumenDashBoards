// @flow
const AGGREGATION: 'AGGREGATION' = 'AGGREGATION';
const ATTRIBUTE: 'ATTRIBUTE' = 'ATTRIBUTE';
const CONSTANT: 'CONSTANT' = 'CONSTANT';
const OPERATOR: 'OPERATOR' = 'OPERATOR';
const SOURCE: 'SOURCE' = 'SOURCE';

const TYPES = {
	AGGREGATION,
	ATTRIBUTE,
	CONSTANT,
	OPERATOR,
	SOURCE
};

const operators = [
	{
		label: '(',
		value: '('
	},
	{
		label: ')',
		value: ')'
	},
	{
		label: '+',
		value: '+'
	},
	{
		label: '-',
		value: '-'
	},
	{
		label: '*',
		value: '*'
	},
	{
		label: '/',
		value: '/'
	}
];

export {
	operators,
	TYPES
};
