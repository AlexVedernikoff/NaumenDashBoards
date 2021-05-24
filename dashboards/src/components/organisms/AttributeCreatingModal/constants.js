// @flow
import {ICON_NAMES} from 'components/atoms/Icon';

const CONSTANT: 'CONSTANT' = 'CONSTANT';
const OPERATOR: 'OPERATOR' = 'OPERATOR';
const SOURCE: 'SOURCE' = 'SOURCE';

const CONTROL_TYPES = {
	CONSTANT,
	OPERATOR,
	SOURCE
};

const TEMPLATE_NAME = 'TEMPLATE';

const OPERATOR_TEMPLATE = {
	name: TEMPLATE_NAME,
	type: CONTROL_TYPES.OPERATOR,
	value: null
};

const SOURCE_TEMPLATE = {
	name: TEMPLATE_NAME,
	type: CONTROL_TYPES.SOURCE,
	value: null
};

const CONSTANT_TEMPLATE = {
	name: TEMPLATE_NAME,
	type: CONTROL_TYPES.CONSTANT,
	value: null
};

const TEMPLATES = {
	CONSTANT_TEMPLATE,
	OPERATOR_TEMPLATE,
	SOURCE_TEMPLATE
};

const PLUS = '+';
const MINUS = '-';
const MULTIPLICATION = '*';
const DIVISION = '/';

const MATH_OPERATORS = {
	DIVISION,
	MINUS,
	MULTIPLICATION,
	PLUS
};

const LEFT_BRACKET = '(';
const RIGHT_BRACKET = ')';

const BRACKETS = {
	LEFT_BRACKET,
	RIGHT_BRACKET
};

const OPERATORS = [
	{
		icon: ICON_NAMES.BRACKET_LEFT,
		value: BRACKETS.LEFT_BRACKET
	},
	{
		icon: ICON_NAMES.BRACKET_RIGHT,
		value: BRACKETS.RIGHT_BRACKET
	},
	{
		icon: ICON_NAMES.PLUS,
		value: MATH_OPERATORS.PLUS
	},
	{
		icon: ICON_NAMES.MINUS,
		value: MATH_OPERATORS.MINUS
	},
	{
		icon: ICON_NAMES.MULTIPLY,
		value: MATH_OPERATORS.MULTIPLICATION
	},
	{
		icon: ICON_NAMES.DIVISION,
		value: MATH_OPERATORS.DIVISION
	}
];

export {
	CONTROL_TYPES,
	MATH_OPERATORS,
	OPERATORS,
	TEMPLATE_NAME,
	TEMPLATES
};
