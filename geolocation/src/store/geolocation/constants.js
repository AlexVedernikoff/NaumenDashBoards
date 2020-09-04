// @flow
const SET_CONTEXT: 'SET_CONTEXT' = 'SET_CONTEXT';
const SET_PARAMS: 'SET_PARAMS' = 'SET_PARAMS';
const SET_DATA_GEOLOCATION: 'SET_DATA_GEOLOCATION' = 'SET_DATA_GEOLOCATION';
const RELOAD_ACTIVE_POINT: 'RELOAD_GEOLOCATION_POINT' = 'RELOAD_GEOLOCATION_POINT';
const RECORD_GEOLOCATION_ERROR: 'RECORD_GEOLOCATION_ERROR' = 'RECORD_GEOLOCATION_ERROR';
const UNKNOWN_GEOLOCATION_ACTION: 'UNKNOWN_GEOLOCATION_ACTION' = 'UNKNOWN_GEOLOCATION_ACTION';
const TOGGLE_FILTER: 'TOGGLE_FILTER' = 'TOGGLE_FILTER';
const TOGGLE_PANEL: 'TOGGLE_PANEL' = 'TOGGLE_PANEL';

const GEOLOCATION_EVENTS = {
	RELOAD_ACTIVE_POINT,
	RECORD_GEOLOCATION_ERROR,
	SET_CONTEXT,
	SET_PARAMS,
	SET_DATA_GEOLOCATION,
	TOGGLE_FILTER,
	TOGGLE_PANEL,
	UNKNOWN_GEOLOCATION_ACTION
};

export {GEOLOCATION_EVENTS};
