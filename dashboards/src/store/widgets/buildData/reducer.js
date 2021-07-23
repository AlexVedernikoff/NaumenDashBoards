// @flow
import type {BuildDataAction, BuildDataState} from './types';
import {BUILD_DATA_EVENTS} from './constants';
import {defaultAction, initialBuildDataState} from './init';
import {updateWidgetData} from './helpers';
import {WIDGETS_EVENTS} from 'store/widgets/data/constants';

const reducer = (state: BuildDataState = initialBuildDataState, action: BuildDataAction = defaultAction): BuildDataState => {
	switch (action.type) {
		case WIDGETS_EVENTS.UPDATE_WIDGET:
			return updateWidgetData(state, action.payload);
		case BUILD_DATA_EVENTS.REQUEST_BUILD_DATA:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					error: false,
					loading: true,
					type: action.payload.type,
					updating: false
				}
			};
		case BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA:
			return {
				...state,
				[action.payload.id]: {
					...state[action.payload.id],
					data: action.payload.data,
					loading: false,
					updating: false
				}
			};
		case BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					data: null,
					error: true,
					loading: false
				}
			};
		case BUILD_DATA_EVENTS.UPDATE_BUILD_DATA:
			return {
				...state,
				[action.payload]: {
					...state[action.payload],
					updating: true
				}
			};
		default:
			return state;
	}
};

export default reducer;
