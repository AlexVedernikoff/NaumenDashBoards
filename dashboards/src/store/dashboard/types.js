// @flow
import {DASHBOARD_EVENTS} from './constants';
import type {Layout} from 'types/layout';
import type {Widget} from 'entities';

type AddWidget = {
	type: typeof DASHBOARD_EVENTS.ADD_WIDGET,
	payload: Widget
};

type CloseWidgetPanel = {
	type: typeof DASHBOARD_EVENTS.CLOSE_WIDGET_PANEL
};

type EditWidget = {
	type: typeof DASHBOARD_EVENTS.EDIT_WIDGET,
	payload: string
};

type EditLayout = {
	type: typeof DASHBOARD_EVENTS.EDIT_LAYOUT,
	payload: Layout
};

type UnknownAction = {
	type: typeof DASHBOARD_EVENTS.UNKNOWN,
	payload: null
};

export type updateInfo = {key: string, value: string | boolean};

type UpdateWidget = {
	type: typeof DASHBOARD_EVENTS.UPDATE_WIDGET,
	payload: updateInfo
};

export type DashboardAction =
	| AddWidget
	| CloseWidgetPanel
	| EditLayout
	| EditWidget
	| UpdateWidget
	;

export type DashboardState = {
	editedWidgetId: ?string,
	widgets: Array<Widget>
};
