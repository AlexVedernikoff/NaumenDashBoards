// @flow
import type {Context} from 'types/api';
import {GEOLOCATION_EVENTS} from './constants';

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
	| UnknownGeolocationAction
;

export type GeolocationState = {
	context: Context | Object,
	dynamicMarkers: Object,
	error: boolean,
	loading: boolean,
	params: Object,
	staticMarkers: Object,
	success: boolean
};
