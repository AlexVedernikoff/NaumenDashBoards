// @flow
import {CONDITION_TYPES} from 'store/customGroups/constants';

const OPERAND_OPTIONS = [
	{
		label: 'с ...по',
		value: CONDITION_TYPES.BETWEEN
	},
	{
		label: 'за последние "n" дней ',
		value: CONDITION_TYPES.LAST
	},
	{
		label: 'в ближайшие "n" дней',
		value: CONDITION_TYPES.NEAR
	},
	{
		label: 'Сегодня',
		value: CONDITION_TYPES.TODAY
	}
];

export {
	OPERAND_OPTIONS
};
