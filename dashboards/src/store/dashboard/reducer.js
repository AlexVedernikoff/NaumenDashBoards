// @flow
import type {DashboardAction, DashboardState} from './types';
import {DASHBOARD_EVENTS} from './constants';
import {defaultAction, initialDashboardState} from './init';

const reducer = (state: DashboardState = initialDashboardState, action: DashboardAction = defaultAction): DashboardState => {
	switch (action.type) {
		case DASHBOARD_EVENTS.ADD_WIDGET:
			return {
				...state,
				widgets: [...state.widgets, action.payload]
			};
		case DASHBOARD_EVENTS.EDIT_LAYOUT:
			state.widgets.forEach(w => {
				const newLayout = action.payload.find(l => l.i === w.id);
				if (newLayout) w.layout = newLayout;
			});
			return state;
		default:
			return state;
	}
};

export default reducer;
