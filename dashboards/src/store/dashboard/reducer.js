// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';
import {defaultDashboardAction, initialDashboardState} from './init';
import {setAutoUpdateFunction} from './helpers';

const reducer = (state: DashboardState = initialDashboardState, action: DashboardAction = defaultDashboardAction): DashboardState => {
	switch (action.type) {
		case DASHBOARD_EVENTS.CHANGE_AUTO_UPDATE_SETTINGS:
			return {
				...state,
				autoUpdate: {...state.autoUpdate, ...action.payload}
			};
		case DASHBOARD_EVENTS.RECEIVE_DASHBOARD:
			return {
				...state,
				error: false,
				loading: false
			};
		case DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		case DASHBOARD_EVENTS.REQUEST_DASHBOARD:
			return {
				...state,
				error: false,
				loading: true
			};
		case DASHBOARD_EVENTS.RECEIVE_USER_ROLE:
			return {
				...state,
				role: action.payload
			};
		case DASHBOARD_EVENTS.SET_AUTO_UPDATE_FUNCTION:
			setAutoUpdateFunction(state, action.payload);
			return state;
		case DASHBOARD_EVENTS.SET_CONTEXT:
			return {
				...state,
				context: action.payload
			};
		case DASHBOARD_EVENTS.SET_EDITABLE:
			return {
				...state,
				editable: action.payload
			};
		default:
			return state;
	}
};

export default reducer;
