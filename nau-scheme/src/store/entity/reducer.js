// @flow
import {defaultVerifyAction, initialVerifyState} from './init';
import type {EntityState} from './types';
import {VERIFY_EVENTS} from './constants';

const reducer = (state: EntityState = initialVerifyState, action: defaultVerifyAction): EntityState => {
	switch (action.type) {
		case VERIFY_EVENTS.SHOW_LOADER_DATA:
			return {
				...state,
				error: false,
				loading: true
			};
		case VERIFY_EVENTS.HIDE_LOADER_DATA:
			return {
				...state,
				loading: false
			};
		case VERIFY_EVENTS.SET_DATA:
			return {
				...state,
				data: action.payload
			};
		case VERIFY_EVENTS.SET_ERROR_DATA:
			return {
				...state,
				error: action.payload
			};
		case VERIFY_EVENTS.SET_ACTIVE_ELEMENT:
			return {
				...state,
				activeElement: action.payload
			};
		case VERIFY_EVENTS.SET_SCALE:
			return {
				...state,
				scale: action.payload
			};
		case VERIFY_EVENTS.SET_EXPORT_TO:
			return {
				...state,
				exportTo: action.payload
			};
		default:
			return state;
	}
};

export default reducer;
