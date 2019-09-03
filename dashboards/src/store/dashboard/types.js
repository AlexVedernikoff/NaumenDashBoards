// @flow
import {DASHBOARD_EVENTS} from './constants';
import type {Layout} from 'types/layout';
import type {Widget} from 'entities';

type AddWidget = {
	type: typeof DASHBOARD_EVENTS.ADD_WIDGET,
	payload: Widget
};

type EditLayout = {
	type: typeof DASHBOARD_EVENTS.EDIT_LAYOUT,
	payload: Layout
};

type UnknownAction = {
	type: typeof DASHBOARD_EVENTS.UNKNOWN,
	payload: null
};

export type DashboardAction =
	| AddWidget
	| EditLayout
	| UnknownAction
;

export type DashboardState = {
	widgets: Widget[];
};
