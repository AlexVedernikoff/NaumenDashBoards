// @flow
import {array, lazy, number, object, string} from 'yup';
import {AVAILABLE_DATE_FORMATS} from './components/BetweenOperand/constants';
import {isObject} from 'src/helpers';
import moment from 'moment';

const messages = {
	float: 'Поле должно содержать вещественное число',
	integer: 'Поле должно содержать целое число'
};

const NAME_RULE = string().required('Поле должно быть заполнено');

const BETWEEN_RULE = object().test(
	'between-condition',
	'Поля должны содержать даты, первая дата должна быть не больше второй',
	value => {
		const isValidDate = (date) => date && moment(date, AVAILABLE_DATE_FORMATS, true).isValid();
		let valid = false;

		if (isObject(value)) {
			const {endDate, startDate} = value;
			valid = (startDate && isValidDate(startDate) && !endDate)
				|| (!startDate && endDate && isValidDate(endDate))
				|| (isValidDate(startDate) && isValidDate(endDate))
				|| moment(startDate, AVAILABLE_DATE_FORMATS) < moment(endDate, AVAILABLE_DATE_FORMATS);
		}

		return valid;
	}
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
