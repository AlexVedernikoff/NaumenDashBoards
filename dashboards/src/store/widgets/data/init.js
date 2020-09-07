// @flow
import type {WidgetsAction, WidgetsDataState} from './types';
import {WIDGETS_EVENTS} from './constants';

export const initialWidgetsState: WidgetsDataState = {
	copying: {
		error: false,
		loading: false
	},
	deleting: {
		error: false,
		loading: false
	},
	map: {},
	saving: {
		error: false,
		loading: false
	},
	selectedWidget: '',
	validatingToCopy: {
		error: false,
		loading: false
	}
};

export const defaultAction: WidgetsAction = {
	payload: null,
	type: WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION
};
