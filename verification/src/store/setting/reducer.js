// @flow
import {defaultSettingAction, initialSettingState} from './init';
import type {SettingAction, SettingState} from './types';
import {SETTING_EVENTS} from './constants';

const reducer = (state: SettingState = initialSettingState, action: SettingAction = defaultSettingAction): SettingState => {
	switch (action.type) {
		case SETTING_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				error: false,
				loading: true
			};
		case SETTING_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loading: false
			};
		case SETTING_EVENTS.SET_SETTING_DATA:
			return {
				...state,
				setting: action.payload
			};
		case SETTING_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				error: true
			};
		default:
			return state;
	}
};

export default reducer;
