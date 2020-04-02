// @flow
import {array, lazy, number, object, string} from 'yup';

const messages = {
	float: 'Поле должно содержать вещетсвенное число',
	integer: 'Поле должно содержать целое число'
};

const NAME_RULE = string().required('Поле должно быть заполнено');

const BETWEEN_RULE = object().test(
	'between-condition',
	'Поля должны содержать 2 даты, первая дата должна быть не больше второй',
	(value) => value && typeof value === 'object' && new Date(value.startDate) < new Date(value.endDate)
).nullable();

const FLOAT_RULE = number().required(messages.float).typeError(messages.float);

const INTEGER_RULE = number().integer(messages.integer).required(messages.integer).typeError(messages.integer);

const INTERVAL_RULE = object({
	value: INTEGER_RULE
});

const STRING_RULE = string().required('Введите значение');

const schema = object().shape({
	name: NAME_RULE,
	subGroups: array().of(
		object({
			data: array().of(
				array().of(
					lazy((condition: Object, {resolveRule}: Object) => object({
						data: resolveRule(condition)
					}))
				)
			),
			name: NAME_RULE
		})
	)
});

export {
	BETWEEN_RULE,
	FLOAT_RULE,
	INTEGER_RULE,
	INTERVAL_RULE,
	STRING_RULE
};

export default schema;
