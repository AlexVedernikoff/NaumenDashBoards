// @flow
import {BACK_TIMER_EXCEED_STATUSES, TIMER_STATUSES} from 'store/widgets/constants';
import {createSchema, object} from 'GroupModal/schema';
import type {LangType} from 'localization/localize_types';
import type {OrCondition} from 'GroupModal/types';
import {OR_CONDITION_TYPES} from 'store/customGroups/constants';

const TIMER_OR_CONDITION_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	{
		label: 'GroupModal::StatusContains',
		value: OR_CONDITION_TYPES.STATUS_CONTAINS
	},
	{
		label: 'GroupModal::StatusNotContains',
		value: OR_CONDITION_TYPES.STATUS_NOT_CONTAINS
	}
];

const BACK_TIMER_OR_CONDITION_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	...TIMER_OR_CONDITION_OPTIONS,
	{
		label: 'GroupModal::ExpirationContains',
		value: OR_CONDITION_TYPES.EXPIRATION_CONTAINS
	},
	{
		label: 'GroupModal::ExpiresBetween',
		value: OR_CONDITION_TYPES.EXPIRES_BETWEEN
	}
];

const TIMER_STATUS_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	{
		label: 'GroupModal::NotStarted',
		value: TIMER_STATUSES.NOT_STARTED
	},
	{
		label: 'GroupModal::Active',
		value: TIMER_STATUSES.ACTIVE
	},
	{
		label: 'GroupModal::Paused',
		value: TIMER_STATUSES.PAUSED
	},
	{
		label: 'GroupModal::Stopped',
		value: TIMER_STATUSES.STOPPED
	}
];

const BACK_TIMER_STATUS_OPTIONS: Array<{hasReferenceToCurrentObject?: boolean, label: LangType, value: string}> = [
	...TIMER_STATUS_OPTIONS,
	{
		label: 'GroupModal::TimeOver',
		value: BACK_TIMER_EXCEED_STATUSES.EXCEED
	}
];

const EXCEED_OPTIONS: Array<{label: LangType, value: $Keys<typeof BACK_TIMER_EXCEED_STATUSES>}> = [
	{
		label: 'GroupModal::Exceed',
		value: BACK_TIMER_EXCEED_STATUSES.EXCEED
	},
	{
		label: 'GroupModal::NotExceed',
		value: BACK_TIMER_EXCEED_STATUSES.NOT_EXCEED
	}
];

const SCHEMA = createSchema((condition: OrCondition) => {
	const {EXPIRES_BETWEEN} = OR_CONDITION_TYPES;

	switch (condition.type) {
		case EXPIRES_BETWEEN:
			return object().between();
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
