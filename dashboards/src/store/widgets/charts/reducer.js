// @flow
import {defaultAction, initialChartsState} from './init';
import type {ChartsAction, ChartsState} from './types';
import {CHARTS_EVENTS} from './constants';
import {setChart, setChartError, setRequestChart} from './helpers';

const reducer = (state: ChartsState = initialChartsState, action: ChartsAction = defaultAction): ChartsState => {
	switch (action.type) {
		case CHARTS_EVENTS.REQUEST_CHART:
			return setRequestChart(state, action);
		case CHARTS_EVENTS.RECEIVE_CHART:
			return setChart(state, action);
		case CHARTS_EVENTS.RECORD_CHART_ERROR:
			return setChartError(state, action);
		default:
			return state;
	}
};

export default reducer;
