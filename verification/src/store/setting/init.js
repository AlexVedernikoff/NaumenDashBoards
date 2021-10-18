// @flow
import type {SettingAction, SettingState} from './types';
import {SETTING_EVENTS} from './constants';

export const initialSettingState: SettingState = {
	error: false,
	loading: false,
	setting: {}
};

export const defaultSettingAction: SettingAction = {
	payload: null,
	type: SETTING_EVENTS.EMPTY_DATA
};
