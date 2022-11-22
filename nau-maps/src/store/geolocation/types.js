// @flow
import {Common} from 'types/common';
import type {Context} from 'types/api';
import type {Controls} from 'types/controls';
import {GEOLOCATION_EVENTS} from './constants';
import type {GroupCode, Point, PointType, StaticGroup} from 'types/point';
import type {Params} from 'types/params';

type SetContext = {
	payload: Context,
	type: typeof GEOLOCATION_EVENTS.SET_CONTEXT
};

type SetParams = {
	payload: Object,
	type: typeof GEOLOCATION_EVENTS.SET_PARAMS
};

type RecordGeolocationError = {
	payload: null,
	type: typeof GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR
};

type SetDataGeolocation = {
	payload: Object,
	type: typeof GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION
};

type ReloadActivePoint = {
	payload: Object,
	type: typeof GEOLOCATION_EVENTS.RELOAD_ACTIVE_POINT
};

type SetTab = {
	payload: PointType,
	type: typeof GEOLOCATION_EVENTS.SET_TAB
};

type setSingleObject = {
	payload: Point,
	type: typeof GEOLOCATION_EVENTS.SET_SINGLE_POINT
};

type ResetSingleObject = {
	type: typeof GEOLOCATION_EVENTS.RESET_SINGLE_POINT
};

type ToggleGroup = {
	payload: GroupCode,
	type: typeof GEOLOCATION_EVENTS.TOGGLE_GROUP
};

type ResetAllGroups = {
	type: typeof GEOLOCATION_EVENTS.RESET_ALL_GROUPS
};

type SelectAllGroups = {
	type: typeof GEOLOCATION_EVENTS.SELECT_ALL_GROUPS
};

type TogglePanel = {
	type: typeof GEOLOCATION_EVENTS.TOGGLE_PANEL
};

type ToggleFilter = {
	type: typeof GEOLOCATION_EVENTS.TOGGLE_FILTER
};

type UnknownGeolocationAction = {
	payload: null,
	type: typeof GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION
};

type ChangeZoom = {
	payload: null,
	type: typeof GEOLOCATION_EVENTS.CHANGE_ZOOM
};

type SetMapPanel = {
	payload: null,
	type: typeof GEOLOCATION_EVENTS.SET_MAP_PANEL
};

export type GeolocationAction =
	ChangeZoom
	| ReloadActivePoint
	| RecordGeolocationError
	| ResetAllGroups
	| ResetSingleObject
	| SelectAllGroups
	| SetContext
	| SetDataGeolocation
	| SetParams
	| setSingleObject
	| SetTab
	| SetMapPanel
	| ToggleFilter
	| ToggleGroup
	| TogglePanel
	| UnknownGeolocationAction
;

export type GeolocationState = {
	context: Context | Object,
	controls: Controls,
	editFormCode: string,
	error: boolean,
	goToElement: boolean,
	loading: boolean,
	mapObjects: Array<Common>,
	mapSelect: string,
	mapsKeyList: {[k: string]: string | boolean},
	params: Params,
	searchObjects: Point[],
	searchText: string,
	showSingleObject: boolean,
	singleObject: Point | null,
	staticGroups: Array<StaticGroup>,
	success: boolean,
	timeUpdate: number
};
