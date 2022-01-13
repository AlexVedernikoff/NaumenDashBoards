// @flow
import {addMethod, array, lazy, number, object, string} from 'yup';
import {AVAILABLE_DATE_FORMATS} from './components/BetweenOrCondition/constants';
import moment from 'utils/moment.config';
import type {OrCondition} from 'GroupModal/types';
import type {Schema} from 'components/types';
import t from 'localization';

addMethod(string, 'name', function () {
	return this.test(
		'check-name',
		t('GroupModal::scheme::NotEmpty'),
		value => string().required().isValidSync(value)
	);
});

addMethod(string, 'isString', function () {
	return this.test(
		'check-string',
		t('GroupModal::scheme::EnterValue'),
		value => string().required().isValidSync(value)
	);
});

addMethod(number, 'isFloat', function () {
	return this.test(
		'check-float',
		t('GroupModal::scheme::FloatField'),
		value => number().required().isValidSync(value)
	);
});

addMethod(number, 'isInteger', function () {
	return this.test(
		'check-integer',
		t('GroupModal::scheme::IntField'),
		value => number().integer().required().isValidSync(value)
	);
});

addMethod(object, 'between', function () {
	return this.test(
		'check-between-date',
		t('GroupModal::scheme::DateRangeField'),
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
		t('GroupModal::scheme::IntField'),
		data => number().integer().isValidSync(data?.value)
	);
});

addMethod(array, 'intervalArray', function () {
	return this.test(
		'check-interval',
		t('GroupModal::scheme::FloatField'),
		data => array().required().of(object({value: number().required()})).isValidSync(data)
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
	array,
	createSchema,
	number,
	object,
	string
};
