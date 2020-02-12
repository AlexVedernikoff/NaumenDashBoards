// @flow
import {array, lazy, number, object, string} from 'yup';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {CONDITION_TYPES} from 'store/customGroups/constants';
import type {OrCondition} from 'store/customGroups/types';

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

const resolveConditionRule = ({type}: OrCondition, context: Object) => {
	const {attribute} = context;
	const {BETWEEN, EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY} = CONDITION_TYPES;
	let rule;

	if (type === BETWEEN) {
		rule = betweenDateRule();
	}

	if ([EQUAL, GREATER, LESS, NOT_EQUAL, NOT_EQUAL_NOT_EMPTY].includes(type)) {
		rule = attribute.type === ATTRIBUTE_TYPES.integer ? integerRule() : floatRule();
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
