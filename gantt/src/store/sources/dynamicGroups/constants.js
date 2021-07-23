// @flow
const RECEIVE_DYNAMIC_ATTRIBUTES: 'RECEIVE_DYNAMIC_ATTRIBUTES' = 'RECEIVE_DYNAMIC_ATTRIBUTES';
const RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS: 'RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS' = 'RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS';
const RECORD_DYNAMIC_ATTRIBUTES_ERROR: 'RECORD_DYNAMIC_ATTRIBUTES_ERROR' = 'RECORD_DYNAMIC_ATTRIBUTES_ERROR';
const RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR: 'RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR' = 'RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR';
const REQUEST_DYNAMIC_ATTRIBUTES: 'REQUEST_DYNAMIC_ATTRIBUTES' = 'REQUEST_DYNAMIC_ATTRIBUTES';
const REQUEST_DYNAMIC_ATTRIBUTE_GROUPS: 'REQUEST_DYNAMIC_ATTRIBUTE_GROUPS' = 'REQUEST_DYNAMIC_ATTRIBUTE_GROUPS';
const UNKNOWN_DYNAMIC_GROUPS_ACTION: 'UNKNOWN_DYNAMIC_GROUPS_ACTION' = 'UNKNOWN_DYNAMIC_GROUPS_ACTION';

const DYNAMIC_GROUPS_EVENTS = {
	RECEIVE_DYNAMIC_ATTRIBUTES,
	RECEIVE_DYNAMIC_ATTRIBUTE_GROUPS,
	RECORD_DYNAMIC_ATTRIBUTES_ERROR,
	RECORD_DYNAMIC_ATTRIBUTE_GROUPS_ERROR,
	REQUEST_DYNAMIC_ATTRIBUTES,
	REQUEST_DYNAMIC_ATTRIBUTE_GROUPS,
	UNKNOWN_DYNAMIC_GROUPS_ACTION
};

export {
	DYNAMIC_GROUPS_EVENTS
};
