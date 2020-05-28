// @flow
import {BACK_TIMER_SYSTEM_GROUP, TIMER_SYSTEM_GROUP} from 'store/widgets/constants';
import {OPERAND_TYPES} from 'store/customGroups/constants';

const CUSTOM_TIMER_OPTIONS = [
	{
		label: 'Статус содержит',
		value: OPERAND_TYPES.STATUS_CONTAINS
	},
	{
		label: 'Статус не содержит',
		value: OPERAND_TYPES.STATUS_NOT_CONTAINS
	}
];

const CUSTOM_BACK_TIMER_OPTIONS = [
	...CUSTOM_TIMER_OPTIONS,
	{
		label: 'Просроченность содержит',
		value: OPERAND_TYPES.EXPIRATION_CONTAINS
	},
	{
		label: 'Время окончания с .. по',
		value: OPERAND_TYPES.EXPIRES_BETWEEN
	}
];

const SYSTEM_TIMER_OPTIONS = [
	{
		label: 'Ожидает начала ',
		value: TIMER_SYSTEM_GROUP.NOT_STARTED
	},
	{
		label: 'Активен',
		value: TIMER_SYSTEM_GROUP.ACTIVE
	},
	{
		label: 'Приостановлен',
		value: TIMER_SYSTEM_GROUP.PAUSED
	},
	{
		label: 'Остановлен',
		value: TIMER_SYSTEM_GROUP.STOPPED
	}
];

const SYSTEM_BACK_TIMER_OPTIONS = [
	...SYSTEM_TIMER_OPTIONS,
	{
		label: 'Кончился запас времени',
		value: BACK_TIMER_SYSTEM_GROUP.EXCEED
	}
];

const EXCEED_OPTIONS = [
	{
		label: 'Просрочен',
		value: BACK_TIMER_SYSTEM_GROUP.EXCEED
	},
	{
		label: 'Не просрочен',
		value: BACK_TIMER_SYSTEM_GROUP.NOT_EXCEED
	}
];

export {
	CUSTOM_BACK_TIMER_OPTIONS,
	CUSTOM_TIMER_OPTIONS,
	EXCEED_OPTIONS,
	SYSTEM_TIMER_OPTIONS,
	SYSTEM_BACK_TIMER_OPTIONS
};
