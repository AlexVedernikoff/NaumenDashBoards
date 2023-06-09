// @flow
const ADD_SIGNATURE: 'ADD_SIGNATURE' = "ADD_SIGNATURE";
const HIDE_LOADER: 'HIDE_LOADER' = 'HIDE_LOADER';
const SEND_SIGNATURE: 'SEND_SIGNATURE' = 'SEND_SIGNATURE';
const SET_CONTEXT: 'SET_CONTEXT' = "SET_CONTEXT";
const SET_ERROR: 'SET_ERROR' = 'SET_ERROR';
const SET_PARAMS: 'SET_PARAMS' = 'SET_PARAMS';
const SET_STATE: 'SET_STATE' = "SET_STATE";
const SHOW_LOADER: 'SHOW_LOADER' = 'SHOW_LOADER';
const UNKNOWN_SIGNATURE_ACTION: 'UNKNOWN_SIGNATURE_ACTION' = 'UNKNOWN_SIGNATURE_ACTION';

const SIGNATURE_EVENTS = {
	ADD_SIGNATURE,
	HIDE_LOADER,
	SEND_SIGNATURE,
	SET_CONTEXT,
	SET_ERROR,
	SET_PARAMS,
	SET_STATE,
	SHOW_LOADER,
	UNKNOWN_SIGNATURE_ACTION
};

const EDIT_STATE: 'EDIT_STATE' = 'EDIT_STATE';
const ERROR_STATE: 'ERROR_STATE' = 'ERROR_STATE';
const FINAL_STATE: 'FINAL_STATE' = 'FINAL_STATE';
const START_STATE: 'START_STATE' = 'START_STATE';

const SIGNATURE_STATE = {
	EDIT_STATE,
	ERROR_STATE,
	FINAL_STATE,
	START_STATE
};


export {SIGNATURE_EVENTS, SIGNATURE_STATE};
