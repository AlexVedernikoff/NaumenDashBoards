// @flow
const ADD_LAYOUTS: 'ADD_LAYOUTS' = 'ADD_LAYOUTS';
const CHANGE_LAYOUT: 'CHANGE_LAYOUT' = 'CHANGE_LAYOUT';
const CHANGE_LAYOUTS: 'CHANGE_LAYOUTS' = 'CHANGE_LAYOUTS';
const RECORD_SAVE_LAYOUTS_ERROR: 'RECORD_SAVE_LAYOUTS_ERROR' = 'RECORD_SAVE_LAYOUTS_ERROR';
const REMOVE_LAYOUTS: 'REMOVE_LAYOUTS' = 'REMOVE_LAYOUTS';
const REPLACE_LAYOUTS_ID: 'REPLACE_LAYOUTS_ID' = 'REPLACE_LAYOUTS_ID';
const REQUEST_SAVE_LAYOUTS: 'REQUEST_SAVE_LAYOUTS' = 'REQUEST_SAVE_LAYOUTS';
const RESPONSE_SAVE_LAYOUTS: 'RESPONSE_SAVE_LAYOUTS' = 'RESPONSE_SAVE_LAYOUTS';
const UNKNOWN_LAYOUTS_ACTION: 'UNKNOWN_DASHBOARD_ACTION' = 'UNKNOWN_DASHBOARD_ACTION';

const DEFAULT_WIDGET_LAYOUT_SIZE = {
	h: 4,
	w: 4
};

const LAYOUTS_EVENTS = {
	ADD_LAYOUTS,
	CHANGE_LAYOUT,
	CHANGE_LAYOUTS,
	RECORD_SAVE_LAYOUTS_ERROR,
	REMOVE_LAYOUTS,
	REPLACE_LAYOUTS_ID,
	REQUEST_SAVE_LAYOUTS,
	RESPONSE_SAVE_LAYOUTS,
	UNKNOWN_LAYOUTS_ACTION
};

export {
	DEFAULT_WIDGET_LAYOUT_SIZE,
	LAYOUTS_EVENTS
};
