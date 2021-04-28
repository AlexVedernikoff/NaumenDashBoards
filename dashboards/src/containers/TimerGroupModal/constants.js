// @flow
import {BACK_TIMER_EXCEED_STATUSES, TIMER_STATUSES} from 'store/widgets/constants';
import {createSchema, object} from 'GroupModal/schema';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const TIMER_OR_CONDITION_OPTIONS = [
	{
		label: 'Статус содержит',
		value: OR_CONDITION_TYPES.STATUS_CONTAINS
	},
	{
		label: 'Статус не содержит',
		value: OR_CONDITION_TYPES.STATUS_NOT_CONTAINS
	}
];

const BACK_TIMER_OR_CONDITION_OPTIONS = [
	...TIMER_OR_CONDITION_OPTIONS,
	{
		label: 'Просроченность содержит',
		value: OR_CONDITION_TYPES.EXPIRATION_CONTAINS
	},
	{
		label: 'Время окончания с .. по',
		value: OR_CONDITION_TYPES.EXPIRES_BETWEEN
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

const SCHEMA = createSchema((condition: OrCondition) => {
	const {EXPIRES_BETWEEN} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case EXPIRES_BETWEEN:
			return object.between();
	}
});

export {
	BACK_TIMER_OR_CONDITION_OPTIONS,
	TIMER_OR_CONDITION_OPTIONS,
	TIMER_STATUS_OPTIONS,
	BACK_TIMER_STATUS_OPTIONS,
	EXCEED_OPTIONS,
	SCHEMA
};
