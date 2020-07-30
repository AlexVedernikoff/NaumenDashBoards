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
	saveError: false,
	selectedWidget: '',
	updating: false
};

export const defaultAction: WidgetsAction = {
	payload: null,
	type: WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION
};
