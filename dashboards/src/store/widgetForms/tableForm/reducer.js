// @flow
import type {Action} from 'store/widgetForms/types';
import {
	changeValuesByAxisOrComboCharts,
	changeValuesByCircleChart,
	changeValuesByPivot,
	changeValuesBySpeedometerOrSummary
} from 'src/store/widgetForms/tableForm/helpers';
import {EVENTS} from 'store/widgetForms/constants';
import {initialState} from './init';
import type {State} from './types';
import {USER_MODE} from './constants';

const reducer = (state: State = initialState, action: Action): State => {
	switch (action.type) {
		case EVENTS.CHANGE_TABLE_FORM_VALUES:
			return action.payload;
		case EVENTS.CHANGE_AXIS_CHART_FORM_VALUES:
		case EVENTS.CHANGE_COMBO_CHART_FORM_VALUES:
			return changeValuesByAxisOrComboCharts(state, action.payload);
		case EVENTS.CHANGE_CIRCLE_CHART_FORM_VALUES:
			return changeValuesByCircleChart(state, action.payload);
		case EVENTS.CHANGE_SPEEDOMETER_FORM_VALUES:
		case EVENTS.CHANGE_SUMMARY_FORM_VALUES:
			return changeValuesBySpeedometerOrSummary(state, action.payload);
		case EVENTS.CHANGE_PIVOT_FORM_VALUES:
			return changeValuesByPivot(state, action.payload);
		case EVENTS.RESET_FORM:
			return initialState;
		case EVENTS.SET_USER_MODE:
			return {...state, ...USER_MODE};
		default:
			return state;
	}
};

export default reducer;
