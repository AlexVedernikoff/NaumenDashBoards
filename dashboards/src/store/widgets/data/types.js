// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Layout, LayoutItem} from 'types/layout';
import type {NewWidget} from 'entities';
import type {SaveFormData, SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {WIDGETS_EVENTS} from './constants';

export type Widget = {
	aggregate: SelectValue,
	areAxisesNamesShown: boolean,
	areAxisesLabelsShown: boolean,
	areAxisesMeaningsShown: boolean,
	desc: string,
	group: SelectValue | null,
	id: string,
	isNameShown: boolean,
	isLegendShown: boolean;
	layout: LayoutItem,
	legendPosition: SelectValue,
	name: string,
	source: SelectValue,
	chart: SelectValue,
	xAxis: Attribute,
	yAxis: Attribute,
};

export type UpdateWidgetPayload = {
	formData: SaveFormData,
	id: string
};

export type AddWidget = {
	type: typeof WIDGETS_EVENTS.ADD_WIDGET,
	payload: number
};

export type UpdateWidget = {
	type: typeof WIDGETS_EVENTS.UPDATE_WIDGET,
	payload: UpdateWidgetPayload
};

export type SetCreatedWidget = {
	type: typeof WIDGETS_EVENTS.SET_CREATED_WIDGET,
	payload: Widget
};

export type DeleteWidget = {
	type: typeof WIDGETS_EVENTS.DELETE_WIDGET,
	payload: string
};

export type SwitchOnStatic = {
	type: typeof WIDGETS_EVENTS.SWITCH_ON_STATIC,
	payload: null
};

export type SwitchOffStatic = {
	type: typeof WIDGETS_EVENTS.SWITCH_OFF_STATIC,
	payload: null
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

type UnknownWidgetsAction = {
	type: typeof WIDGETS_EVENTS.UNKNOWN_WIDGETS_ACTION,
	payload: null
};

export type WidgetsAction =
	| AddWidget
	| DeleteWidget
	| EditLayout
	| ResetWidget
	| SelectWidget
	| SetCreatedWidget
	| SwitchOnStatic
	| SwitchOffStatic
	| UpdateWidget
	| UnknownWidgetsAction
;

export type WidgetMap = {
	[key: string]: Widget;
};

export type WidgetsDataState = {
	error: boolean,
	loading: boolean,
	map: WidgetMap,
	newWidget: NewWidget | null,
	selectedWidget: string
};
