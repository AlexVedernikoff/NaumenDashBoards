// @flow
import type {ChartsAction, ChartsState} from './types';
import {CHARTS_EVENTS} from './constants';

export const initialChartsState: ChartsState = {
	map: {}
};

export const defaultAction: ChartsAction = {
	type: CHARTS_EVENTS.UNKNOWN_CHARTS_ACTION,
	payload: null
};
