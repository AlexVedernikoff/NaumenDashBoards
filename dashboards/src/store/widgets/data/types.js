// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Layout, LayoutItem} from 'utils/layout/types';
import type {NewWidget} from 'entities';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {WIDGETS_EVENTS} from './constants';

export type Widget = {
	aggregate?: SelectValue,
	areAxisesNamesShown?: boolean,
	areAxisesLabelsShown?: boolean,
	areAxisesMeaningsShown?: boolean,
	breakdown?: Attribute | null,
	desc?: string,
	group?: SelectValue | null,
	id: string,
	isNameShown?: boolean,
	isLegendShown?: boolean;
	layout: LayoutItem,
	legendPosition?: SelectValue,
	name: string,
	source?: SelectValue,
	type: SelectValue,
	xAxis?: Attribute,
	yAxis?: Attribute,
};

export type AddWidget = {
	type: typeof WIDGETS_EVENTS.ADD_WIDGET,
	payload: number
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
	| RecordWidgetSaveError
	| RecordWidgetsError
	| RequestLayoutSave
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
	error: boolean,
	layoutSaveError: boolean,
	loading: boolean,
	map: WidgetMap,
	newWidget: NewWidget | null,
	saveError: boolean,
	updating: boolean,
	selectedWidget: string
};
