// @flow
import type {DashboardsAction, DashboardsState} from './types';
import {DASHBOARDS_EVENTS} from './constants';
import {defaultAction, initialState} from './init';

const reducer = (state: DashboardsState = initialState, action: DashboardsAction = defaultAction): DashboardsState => {
	switch (action.type) {
		case DASHBOARDS_EVENTS.REQUEST_DASHBOARDS:
			return {
				...state,
				error: false,
				loading: true
			};
		case DASHBOARDS_EVENTS.RESPONSE_DASHBOARDS:
			return {
				...state,
				items: action.payload,
				loading: false,
				uploaded: true
			};
		case DASHBOARDS_EVENTS.RECORD_DASHBOARDS_ERROR:
			return {
				...state,
				error: true,
				loading: false
			};
		default:
			return state;
	}
};

export default reducer;
