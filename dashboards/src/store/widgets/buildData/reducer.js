// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {BUILD_DATA_EVENTS} from './constants';
import {defaultAction, initialBuildDataState} from './init';

const reducer = (state: BuildDataState = initialBuildDataState, action: BuildDataAction = defaultAction): BuildDataState => {
	switch (action.type) {
		case BUILD_DATA_EVENTS.REQUEST_BUILD_DATA:
			return {
				...state,
				[action.payload.id]: {
					data: null,
					error: false,
					loading: true,
					type: action.payload.type
				}
			};
		case BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					data: action.payload.data,
					loading: false
				}
			};
		case BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					error: true,
					loading: false
				}
			};
		default:
			return state;
	}
};

export default reducer;
