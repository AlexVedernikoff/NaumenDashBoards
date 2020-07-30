// @flow
import type {LayoutMode} from 'store/dashboard/settings/types';
import {LAYOUTS_EVENTS} from './constants';

export type Layout = {
	h: number,
	i: string,
	w: number,
	x: number,
	y: number
};

export type Layouts = {
	[breakpoint: string]: Array<Layout>
};

type AddLayouts = {
	payload: string,
	type: typeof LAYOUTS_EVENTS.ADD_LAYOUTS
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
	| ChangeLayouts
	| RecordSaveLayoutsError
	| RemoveLayouts
	| ReplaceLayoutsId
	| RequestSaveLayouts
	| ResponseSaveLayouts
	| UnknownLayoutsAction
;

export type LayoutsState = {
	error: boolean,
	loading: boolean,
	MOBILE: Layouts,
	WEB: Layouts
};