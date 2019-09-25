// @flow
import type {WidgetsAction, WidgetsDataState} from './types';
import {WIDGETS_EVENTS} from './constants';

export const initialWidgetsState: WidgetsDataState = {
	error: false,
	loading: false,
	map: {},
	newWidget: null,
	selectedWidget: ''
};

export const defaultAction: WidgetsAction = {
	type: WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION,
	payload: null
};
