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

const TEMPLATE_NAMES = {
	CONSTANT,
	OPERATOR,
	SOURCE
};

const OPERATOR_TEMPLATE = {
	name: TEMPLATE_NAMES.OPERATOR,
	type: CONTROL_TYPES.OPERATOR,
	value: null
};

const SOURCE_TEMPLATE = {
	name: TEMPLATE_NAMES.SOURCE,
	type: CONTROL_TYPES.SOURCE,
	value: null
};

const CONSTANT_TEMPLATE = {
	name: TEMPLATE_NAMES.CONSTANT,
	type: CONTROL_TYPES.CONSTANT,
	value: null
};

const TEMPLATES = {
	CONSTANT_TEMPLATE,
	OPERATOR_TEMPLATE,
	SOURCE_TEMPLATE
};

const OPERATORS = [
	{
		icon: ICON_NAMES.BRACKET_LEFT,
		value: '('
	},
	{
		icon: ICON_NAMES.BRACKET_RIGHT,
		value: ')'
	},
	{
		icon: ICON_NAMES.PLUS,
		value: '+'
	},
	{
		icon: ICON_NAMES.MINUS,
		value: '-'
	},
	{
		icon: ICON_NAMES.MULTIPLY,
		value: '*'
	},
	{
		icon: ICON_NAMES.DIVISION,
		value: '/'
	}
];

export {
	CONTROL_TYPES,
	OPERATORS,
	TEMPLATE_NAMES,
	TEMPLATES
};
