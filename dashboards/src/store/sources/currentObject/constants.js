// @flow
const RECEIVE_CURRENT_OBJECT_NODES: 'RECEIVE_CURRENT_OBJECT_NODES' = 'RECEIVE_CURRENT_OBJECT_NODES';
const RECEIVE_CURRENT_OBJECT_ROOTS: 'RECEIVE_CURRENT_OBJECT_ROOTS' = 'RECEIVE_CURRENT_OBJECT_ROOTS';
const RECORD_CURRENT_OBJECT_NODES_ERROR: 'RECORD_CURRENT_OBJECT_NODES_ERROR' = 'RECORD_CURRENT_OBJECT_NODES_ERROR';
const RECORD_CURRENT_OBJECT_ROOTS_ERROR: 'RECORD_CURRENT_OBJECT_ROOTS_ERROR' = 'RECORD_CURRENT_OBJECT_ROOTS_ERROR';
const REQUEST_CURRENT_OBJECT_NODES: 'REQUEST_CURRENT_OBJECT_NODES' = 'REQUEST_CURRENT_OBJECT_NODES';
const REQUEST_CURRENT_OBJECT_ROOTS: 'REQUEST_CURRENT_OBJECT_ROOTS' = 'REQUEST_CURRENT_OBJECT_ROOTS';
const UNKNOWN_CURRENT_OBJECT_ACTION: 'UNKNOWN_CURRENT_OBJECT_ACTION' = 'UNKNOWN_CURRENT_OBJECT_ACTION';

const CURRENT_OBJECT_EVENTS = {
	RECEIVE_CURRENT_OBJECT_NODES,
	RECEIVE_CURRENT_OBJECT_ROOTS,
	RECORD_CURRENT_OBJECT_NODES_ERROR,
	RECORD_CURRENT_OBJECT_ROOTS_ERROR,
	REQUEST_CURRENT_OBJECT_NODES,
	REQUEST_CURRENT_OBJECT_ROOTS,
	UNKNOWN_CURRENT_OBJECT_ACTION
};

const NESTED_LEVEL_LIMIT = 3;

export {
	CURRENT_OBJECT_EVENTS,
	NESTED_LEVEL_LIMIT
};
