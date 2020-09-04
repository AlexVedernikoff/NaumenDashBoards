// @flow
import type {Context} from 'types/api';
import type {Controls} from 'types/controls';
import {GEOLOCATION_EVENTS} from './constants';
import type {MultiplePoint} from 'types/multiple';
import type {Params} from 'types/params';
import type {Point} from 'types/point';

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

type TogglePanel = {
	type: typeof GEOLOCATION_EVENTS.TOGGLE_PANEL,
};

type ToggleFilter = {
	type: typeof GEOLOCATION_EVENTS.TOGGLE_FILTER,
};

type UnknownGeolocationAction = {
	type: typeof GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION,
	payload: null
};

export type GeolocationAction =
	| ReloadActivePoint
	| RecordGeolocationError
	| SetContext
	| SetParams
	| SetDataGeolocation
	| ToggleFilter
	| TogglePanel
	| UnknownGeolocationAction
;

export type GeolocationState = {
	context: Context | Object,
	controls: Controls,
	dynamicMarkers: Array<Point>,
	error: boolean,
	multipleMarkers: Array<MultiplePoint>,
	loading: boolean,
	params: Params,
	staticMarkers: Array<Point>,
	success: boolean
};
