// @flow
import type {LayoutBreakpoint, LayoutMode} from 'store/dashboard/settings/types';
import {LAYOUTS_EVENTS} from './constants';
import type {Widget} from 'store/widgets/data/types';

export type Layout = {
	h: number,
	i: string,
	w: number,
	x: number,
	y: number
};

export type WidgetLayoutPosition = {
	breakpoint: LayoutBreakpoint,
	layoutMode: LayoutMode,
	x: number,
	y: number
};

export type Layouts = {
	[breakpoint: LayoutBreakpoint]: Array<Layout>
};

export type LayoutsPayloadForAdd = {
	widgetId: string,
	widgetPosition: ?WidgetLayoutPosition,
	widgets: Array<Widget>
};

type AddLayouts = {
	payload: LayoutsPayloadForAdd,
	type: typeof LAYOUTS_EVENTS.ADD_LAYOUTS
};

export type LayoutPayloadForChange = {
	layout: $Shape<Layout>,
	layoutMode: LayoutMode
};

type ChangeLayout = {
	payload: LayoutPayloadForChange,
	type: typeof LAYOUTS_EVENTS.CHANGE_LAYOUT
};

export type LayoutsPayloadForChange = {
	layoutMode: LayoutMode,
	layouts: Layouts
};

type ChangeLayouts = {
	payload: LayoutsPayloadForChange,
	type: typeof LAYOUTS_EVENTS.CHANGE_LAYOUTS
};

type RecordSaveLayoutsError = {
	type: typeof LAYOUTS_EVENTS.RECORD_SAVE_LAYOUTS_ERROR
};

type RemoveLayouts = {
	payload: string,
	type: typeof LAYOUTS_EVENTS.REMOVE_LAYOUTS
};

export type ReplaceLayoutsIdPayload = {
	from: string,
	to: string
};

type ReplaceLayoutsId = {
	payload: ReplaceLayoutsIdPayload,
	type: typeof LAYOUTS_EVENTS.REPLACE_LAYOUTS_ID
};

type RequestSaveLayouts = {
	type: typeof LAYOUTS_EVENTS.REQUEST_SAVE_LAYOUTS
};

type ResponseSaveLayouts = {
	type: typeof LAYOUTS_EVENTS.RESPONSE_SAVE_LAYOUTS
};

type UnknownLayoutsAction = {
	type: typeof LAYOUTS_EVENTS.UNKNOWN_LAYOUTS_ACTION
};

export type LayoutsAction =
	| AddLayouts
	| ChangeLayout
	| ChangeLayouts
	| RecordSaveLayoutsError
	| RemoveLayouts
	| ReplaceLayoutsId
	| RequestSaveLayouts
	| ResponseSaveLayouts
	| UnknownLayoutsAction
;

export type LayoutsState = {
	changed: boolean,
	error: boolean,
	loading: boolean,
	MOBILE: Layouts,
	WEB: Layouts
};
