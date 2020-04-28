// @flow
import type {WidgetsAction, WidgetsDataState} from './types';
import {WIDGETS_EVENTS} from './constants';

export const initialWidgetsState: WidgetsDataState = {
	deleteError: false,
	deleting: false,
	error: false,
	layoutSaveError: false,
	loading: false,
	map: {},
	newWidget: null,
	saveError: false,
	selectedWidget: '',
	updating: false
};

export const defaultAction: WidgetsAction = {
	type: WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION,
	payload: null
};
