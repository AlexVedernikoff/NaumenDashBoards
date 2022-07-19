// @flow
import type {CustomChartColorsSettingsData} from 'store/widgets/data/types';
import {EVENTS} from './constants';
import type {ThunkAction} from 'store/types';

export type GlobalCustomChartColorsSettings = CustomChartColorsSettingsData | null;

export type Item = {
	data: GlobalCustomChartColorsSettings,
	removing: {
		error: boolean,
		loading: boolean
	},
	saving: {
		error: boolean,
		loading: boolean
	}
};

type Key = string;

export type Map = {
	[key: string]: Item
};

type RemoveFulfilled = {
	payload: Key,
	type: typeof EVENTS.REMOVE_FULFILLED
};

type RemovePending = {
	payload: Key,
	type: typeof EVENTS.REMOVE_PENDING
};

type RemoveRejected = {
	payload: Key,
	type: typeof EVENTS.REMOVE_REJECTED
};

type SaveFulfilled = {
	payload: CustomChartColorsSettingsData,
	type: typeof EVENTS.SAVE_FULFILLED
};

type SavePending = {
	payload: Key,
	type: typeof EVENTS.SAVE_PENDING
};

type SaveRejected = {
	payload: Key,
	type: typeof EVENTS.SAVE_REJECTED
};

export type SettingsMap = {
	[Key]: CustomChartColorsSettingsData
};

type Set = {
	payload: SettingsMap,
	type: typeof EVENTS.SET
};

type UnknownAction = {
	type: typeof EVENTS.UNKNOWN
};

export type Action =
	| RemoveFulfilled
	| RemovePending
	| RemoveRejected
	| SaveFulfilled
	| SavePending
	| SaveRejected
	| Set
	| UnknownAction
;

export type State = Map;

export type SaveCustomChartColorsSettingsAction = (settings: CustomChartColorsSettingsData) => ThunkAction;

export type RemoveCustomChartColorsSettingAction = (key: Key) => ThunkAction;
