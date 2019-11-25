// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Layout, LayoutItem} from 'utils/layout/types';
import type {NewWidget} from 'entities';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {WIDGETS_EVENTS} from './constants';

export type Widget = {
	aggregation?: string,
	breakdown?: Attribute | null,
	breakdownGroup?: string,
	calcTotalColumn?: boolean,
	calcTotalRow?: boolean,
	chart?: SelectValue | null,
	colors?: Array<string>,
	column?: Attribute,
	descriptor: ?string,
	diagramName: string,
	group?: string,
	id: string,
	indicator?: Attribute | null,
	layout: LayoutItem,
	legendPosition?: SelectValue,
	order?: Array<number>,
	name: string,
	row?: Attribute,
	showLegend?: boolean;
	showName?: boolean,
	showValue?: boolean,
	showXAxis?: boolean,
	showYAxis?: boolean,
	source?: SelectValue,
	type: string,
	withBreakdown: boolean,
	xAxis?: Attribute,
	yAxis?: Attribute,
};

export type AddWidget = {
	type: typeof WIDGETS_EVENTS.ADD_WIDGET,
	payload: NewWidget
};

export type UpdateWidget = {
	type: typeof WIDGETS_EVENTS.UPDATE_WIDGET,
	payload: Widget
};

export type SetCreatedWidget = {
	type: typeof WIDGETS_EVENTS.SET_CREATED_WIDGET,
	payload: Widget
};

export type DeleteWidget = {
	type: typeof WIDGETS_EVENTS.DELETE_WIDGET,
	payload: string
};

export type EditLayout = {
	type: typeof WIDGETS_EVENTS.EDIT_LAYOUT,
	payload: Layout
};

export type SelectWidget = {
	type: typeof WIDGETS_EVENTS.SET_SELECTED_WIDGET,
	payload: string
};

export type ResetWidget = {
	type: typeof WIDGETS_EVENTS.RESET_WIDGET,
};

export type RecordWidgetSaveError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR,
};

export type RecordLayoutSaveError = {
	type: typeof WIDGETS_EVENTS.RECORD_LAYOUT_SAVE_ERROR,
};

export type RequestLayoutSave = {
	type: typeof WIDGETS_EVENTS.REQUEST_LAYOUT_SAVE,
};

export type RequestWidgetDelete = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_DELETE,
};

export type RequestWidgetSave = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGET_SAVE,
};

export type RequestWidgets = {
	type: typeof WIDGETS_EVENTS.REQUEST_WIDGETS
};

export type ReceiveWidgets = {
	type: typeof WIDGETS_EVENTS.RECEIVE_WIDGETS,
	payload: Widget[]
};

export type RecordWidgetsError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGETS_ERROR,
};

export type RecordWidgetDeleteError = {
	type: typeof WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR
}

type UnknownWidgetsAction = {
	type: typeof WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION,
	payload: null
};

export type WidgetsAction =
	| AddWidget
	| DeleteWidget
	| EditLayout
	| ReceiveWidgets
	| RecordLayoutSaveError
	| RecordWidgetDeleteError
	| RecordWidgetSaveError
	| RecordWidgetsError
	| RequestLayoutSave
	| RequestWidgetDelete
	| RequestWidgetSave
	| RequestWidgets
	| ResetWidget
	| SelectWidget
	| SetCreatedWidget
	| UpdateWidget
	| UnknownWidgetsAction
;

export type WidgetMap = {
	[key: string]: Widget;
};

export type WidgetsDataState = {
	deleteError: boolean,
	deleting: boolean,
	error: boolean,
	layoutSaveError: boolean,
	loading: boolean,
	map: WidgetMap,
	newWidget: NewWidget | null,
	saveError: boolean,
	updating: boolean,
	selectedWidget: string
};
