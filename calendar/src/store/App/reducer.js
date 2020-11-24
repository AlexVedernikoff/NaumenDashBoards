// @flow
import type {ActionType, AppState} from './types';
import {APP_EVENTS} from './constants';
import {initialState} from './init';

const reducer = (
	state: AppState = initialState,
	action: ActionType
): AppState => {
	switch (action.type) {
		case APP_EVENTS.SET_APP_INIT_DATA: {
			const {defaultView, metaClass, subjectId} = action.payload;
			return {
				...state,
				defaultView,
				metaClass,
				subjectId
			};
		}
		case APP_EVENTS.SET_APP_LOADING:
			return {
				...state,
				isLoading: action.payload
			};
		case APP_EVENTS.SET_ERROR:
			return {
				...state,
				error: action.payload
			};
		default:
			return state;
	}
};

export default reducer;
