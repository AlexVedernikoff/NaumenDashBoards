// @flow
import {array, lazy, number, object, string} from 'yup';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {OPERAND_TYPES} from 'store/customGroups/constants';

const NAME_RULE = string().required('Поле должно быть заполнено');

const betweenDateRule = () => object().test(
	'between-condition',
	'Поля должны содержать 2 даты, первая дата должна быть не больше второй',
	(value) => value && typeof value === 'object' && new Date(value.startDate) < new Date(value.endDate)
).nullable();

const floatRule = () => {
	const message = 'Поле должно содержать вещетсвенное число';
	return number().required(message).typeError(message).nullable();
};

const integerRule = () => {
	const message = 'Поле должно содержать целое число';
	return number().integer(message).required(message).typeError(message).nullable();
};

const intervalRule = () => object({
	value: floatRule()
});

const resolveConditionRule = (condition: Object, context: Object) => {
	const {type} = condition;
	const {attribute} = context;
	const {
		BETWEEN,
		EQUAL,
		GREATER,
		LESS,
		NOT_EQUAL,
		NOT_EQUAL_NOT_EMPTY
	} = OPERAND_TYPES;
	let rule;

	if (type === BETWEEN) {
		rule = betweenDateRule();
	}

	if (attribute.type in ATTRIBUTE_SETS.NUMBER && [EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY].includes(type)) {
		rule = attribute.type === ATTRIBUTE_TYPES.integer ? integerRule() : floatRule();
	}

	if (attribute.type === ATTRIBUTE_TYPES.dtInterval && [EQUAL, GREATER, LESS, NOT_EQUAL].includes(type)) {
		rule = intervalRule();
	}

	return object({
		data: rule
	}).nullable();
};

const schema = object().shape({
	name: NAME_RULE,
	subGroups: array().of(
		object({
			data: array().of(
				array().of(lazy(resolveConditionRule))
			),
			name: NAME_RULE
		})
	)
});

export default schema;
