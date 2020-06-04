// @flow
import {BACK_TIMER_EXCEED_STATUSES, TIMER_STATUSES} from 'store/widgets/constants';
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

const TIMER_STATUS_OPTIONS = [
	{
		label: 'Ожидает начала ',
		value: TIMER_STATUSES.NOT_STARTED
	},
	{
		label: 'Активен',
		value: TIMER_STATUSES.ACTIVE
	},
	{
		label: 'Приостановлен',
		value: TIMER_STATUSES.PAUSED
	},
	{
		label: 'Остановлен',
		value: TIMER_STATUSES.STOPPED
	}
];

const BACK_TIMER_STATUS_OPTIONS = [
	...TIMER_STATUS_OPTIONS,
	{
		label: 'Кончился запас времени',
		value: BACK_TIMER_EXCEED_STATUSES.EXCEED
	}
];

const EXCEED_OPTIONS = [
	{
		label: 'Просрочен',
		value: BACK_TIMER_EXCEED_STATUSES.EXCEED
	},
	{
		label: 'Не просрочен',
		value: BACK_TIMER_EXCEED_STATUSES.NOT_EXCEED
	}
];

export {
	CUSTOM_BACK_TIMER_OPTIONS,
	CUSTOM_TIMER_OPTIONS,
	EXCEED_OPTIONS,
	BACK_TIMER_STATUS_OPTIONS,
	TIMER_STATUS_OPTIONS
};
