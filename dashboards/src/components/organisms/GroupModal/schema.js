// @flow
import {addMethod, array, lazy, number, object, string} from 'yup';
import {AVAILABLE_DATE_FORMATS} from './components/BetweenOrCondition/constants';
import moment from 'utils/moment.config';
import type {OrCondition} from 'GroupModal/types';
import type {Schema} from 'components/types';

addMethod(string, 'name', function () {
	return this.test(
		'check-name',
		'Поле должно быть заполнено',
		value => string().required().isValidSync(value)
	);
});

addMethod(string, 'isString', function () {
	return this.test(
		'check-string',
		'Введите значение',
		value => string().required().isValidSync(value)
	);
});

addMethod(number, 'isFloat', function () {
	return this.test(
		'check-float',
		'Поле должно содержать вещественное число',
		value => number().required().isValidSync(value)
	);
});

addMethod(number, 'isInteger', function () {
	return this.test(
		'check-integer',
		'Поле должно содержать целое число',
		value => number().integer().required().isValidSync(value)
	);
});

addMethod(object, 'between', function () {
	return this.test(
		'check-between-date',
		'Поля должны содержать даты, первая дата должна быть не больше второй',
		value => {
			const isValidDate = date => date && moment(date, AVAILABLE_DATE_FORMATS, true).isValid();
			const {endDate, startDate} = value;

			return (startDate && isValidDate(startDate) && !endDate)
				|| (!startDate && endDate && isValidDate(endDate))
				|| (isValidDate(startDate) && isValidDate(endDate))
				|| moment(startDate, AVAILABLE_DATE_FORMATS) < moment(endDate, AVAILABLE_DATE_FORMATS);
		}
	).nullable().default({endData: '', startDate: ''});
});

addMethod(object, 'interval', function () {
	return this.test(
		'check-interval',
		'Поле должно содержать целое число',
		data => number().integer().isValidSync(data.value)
	);
});

const createSchema = (getOrConditionRule: (condition: OrCondition) => ?Schema) => object().shape({
	name: string().name(),
	subGroups: array().of(
		object({
			data: array().of(
				array().of(
					lazy((condition: OrCondition) => object({
						data: getOrConditionRule(condition)
					}))
				)
			),
			name: string().name()
		})
	)
});

export {
	createSchema,
	number,
	object,
	string
};
