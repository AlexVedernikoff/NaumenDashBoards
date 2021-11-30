// @flow
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import type {LayoutsAction, LayoutsState} from './types';
import {LAYOUTS_EVENTS} from './constants';

export const initialLayoutsState: LayoutsState = {
	changed: false,
	error: false,
	loading: false,
	[LAYOUT_MODE.MOBILE]: {
		lg: [],
		sm: []
	},
	[LAYOUT_MODE.WEB]: {
		lg: [],
		sm: []
	}
};

export const defaultLayoutsAction: LayoutsAction = {
	type: LAYOUTS_EVENTS.UNKNOWN_LAYOUTS_ACTION
};
