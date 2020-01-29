// @flow
import {OPERAND_TYPES} from 'store/customGroups/constants';

const OPERAND_OPTIONS = [
	{
		label: 'с ...по',
		value: OPERAND_TYPES.BETWEEN
	},
	{
		label: 'за последние "n" дней ',
		value: OPERAND_TYPES.LAST
	},
	{
		label: 'в ближайшие "n" дней',
		value: OPERAND_TYPES.NEAR
	},
	{
		label: 'сегодня',
		value: OPERAND_TYPES.TODAY
	}
];

export {
	OPERAND_OPTIONS
};
