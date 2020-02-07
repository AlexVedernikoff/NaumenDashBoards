// @flow
import {array, object, string} from 'yup';
import {CONDITION_TYPES} from 'store/customGroups/constants';
import {FIELDS} from './constants';

const NAME_RULE = string().required('Поле должно быть заполнено');

const BETWEEN_CONDITION_RULE = object().when(FIELDS.type, {
	is: CONDITION_TYPES.BETWEEN,
	then: object().test(
		'between-condition',
		'Поля должны содержать 2 даты, первая дата должна быть не больше второй',
		(value) => value && typeof value === 'object' && new Date(value.startDate) < new Date(value.endDate)
	)
}).nullable();

const schema = object().shape({
	name: NAME_RULE,
	subGroups: array().of(
		object({
			data: array().of(
				array().of(object({
					data: BETWEEN_CONDITION_RULE
				}))
			),
			name: NAME_RULE
		})
	)
});

export default schema;
