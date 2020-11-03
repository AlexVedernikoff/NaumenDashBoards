// @flow
import type {Context} from 'types/api';
import type {Controls} from 'types/controls';
import {GEOLOCATION_EVENTS} from './constants';
import type {Params} from 'types/params';
import type {GroupCode, Point, PointType, StaticGroup} from 'types/point';

type SetContext = {
	type: typeof GEOLOCATION_EVENTS.SET_CONTEXT,
	payload: Context
};
type SetParams = {
	type: typeof GEOLOCATION_EVENTS.SET_PARAMS,
	payload: Object
};

type RecordGeolocationError = {
	type: typeof GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR,
	payload: null
};

type SetDataGeolocation = {
	type: typeof GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION,
	payload: Object
};

type ReloadActivePoint = {
	type: typeof GEOLOCATION_EVENTS.RELOAD_ACTIVE_POINT,
	payload: Object
};

type SetTab = {
	type: typeof GEOLOCATION_EVENTS.SET_TAB,
	payload: PointType
};

type SetSinglePoint = {
	type: typeof GEOLOCATION_EVENTS.SET_SINGLE_POINT,
	payload: Point
};

type ResetSinglePoint = {
	type: typeof GEOLOCATION_EVENTS.RESET_SINGLE_POINT
};

type ToggleGroup = {
	type: typeof GEOLOCATION_EVENTS.TOGGLE_GROUP,
	payload: GroupCode
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
	type: typeof GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION,
	payload: null
};

export type GeolocationAction =
	| ReloadActivePoint
	| RecordGeolocationError
	| ResetAllGroups
	| ResetSinglePoint
	| SelectAllGroups
	| SetContext
	| SetDataGeolocation
	| SetParams
	| SetSinglePoint
	| SetTab
	| ToggleFilter
	| ToggleGroup
	| TogglePanel
	| UnknownGeolocationAction
;

export type GeolocationState = {
	context: Context | Object,
	controls: Controls,
	dynamicPoints: Array<Point>,
	error: boolean,
	loading: boolean,
	panelShow: PointType,
	params: Params,
	showSinglePoint: boolean,
	singlePoint: Point | null,
	staticGroups: Array<StaticGroup>,
	staticPoints: Array<Point>,
	success: boolean,
	timeUpdate: number
};
