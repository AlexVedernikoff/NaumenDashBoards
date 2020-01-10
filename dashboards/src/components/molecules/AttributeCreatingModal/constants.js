// @flow
import {BracketLeftIcon, BracketRightIcon, DivisionIcon, MinusIcon, MultiplyIcon, PlusIcon} from 'icons/controls';

const CONSTANT: 'CONSTANT' = 'CONSTANT';
const OPERATOR: 'OPERATOR' = 'OPERATOR';
const SOURCE: 'SOURCE' = 'SOURCE';

const TYPES = {
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
	next: TEMPLATE_NAMES.SOURCE,
	prev: '',
	type: TYPES.OPERATOR,
	value: null
};

const SOURCE_TEMPLATE = {
	name: TEMPLATE_NAMES.SOURCE,
	next: '',
	prev: TEMPLATE_NAMES.OPERATOR,
	type: TYPES.SOURCE,
	value: null
};

const CONSTANT_TEMPLATE = {
	name: TEMPLATE_NAMES.CONSTANT,
	next: '',
	prev: TEMPLATE_NAMES.OPERATOR,
	type: TYPES.CONSTANT,
	value: null
};

const TEMPLATES = {
	CONSTANT_TEMPLATE,
	OPERATOR_TEMPLATE,
	SOURCE_TEMPLATE
};

const OPERATORS = [
	{
		icon: BracketLeftIcon,
		value: '('
	},
	{
		icon: BracketRightIcon,
		value: ')'
	},
	{
		icon: PlusIcon,
		value: '+'
	},
	{
		icon: MinusIcon,
		value: '-'
	},
	{
		icon: MultiplyIcon,
		value: '*'
	},
	{
		icon: DivisionIcon,
		value: '/'
	}
];

export {
	OPERATORS,
	TEMPLATE_NAMES,
	TEMPLATES,
	TYPES
};
