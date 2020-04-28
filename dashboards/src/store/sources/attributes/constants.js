// @flow
const RECEIVE_ATTRIBUTES: 'RECEIVE_ATTRIBUTES' = 'RECEIVE_ATTRIBUTES';
const RECORD_ATTRIBUTES_ERROR: 'RECORD_ATTRIBUTES_ERROR' = 'RECORD_ATTRIBUTES_ERROR';
const REQUEST_ATTRIBUTES: 'REQUEST_ATTRIBUTES' = 'REQUEST_ATTRIBUTES';
const UNKNOWN_ATTRIBUTES_ACTION: 'UNKNOWN_ATTRIBUTES_ACTION' = 'UNKNOWN_ATTRIBUTES_ACTION';

const ATTRIBUTES_EVENTS = {
	RECEIVE_ATTRIBUTES,
	RECORD_ATTRIBUTES_ERROR,
	REQUEST_ATTRIBUTES,
	UNKNOWN_ATTRIBUTES_ACTION
};

// Типы атрибутов
const backBOLinks: 'backBOLinks' = 'backBOLinks';
const backTimer: 'backTimer' = 'backTimer';
const boLinks: 'boLinks' = 'boLinks';
const catalogItem: 'catalogItem' = 'catalogItem';
const catalogItemSet: 'catalogItemSet' = 'catalogItemSet';
const COMPUTED_ATTR: 'COMPUTED_ATTR' = 'COMPUTED_ATTR';
const date: 'date' = 'date';
const dateTime: 'dateTime' = 'dateTime';
const double: 'double' = 'double';
const dtInterval: 'dtInterval' = 'dtInterval';
const integer: 'integer' = 'integer';
const metaClass: 'metaClass' = 'metaClass';
const object: 'object' = 'object';
const state: 'state' = 'state';
const string: 'string' = 'string';
const timer: 'timer' = 'timer';

const SOURCE_ATTRIBUTE_TYPES = {
	backBOLinks,
	backTimer,
	boLinks,
	catalogItem,
	catalogItemSet,
	date,
	dateTime,
	double,
	dtInterval,
	integer,
	metaClass,
	object,
	state,
	string,
	timer
};

const ATTRIBUTE_TYPES = {
	...SOURCE_ATTRIBUTE_TYPES,
	COMPUTED_ATTR
};

const DATE = {
	date,
	dateTime
};
const NUMBER = {
	double,
	integer
};

const OBJECT = {
	backBOLinks,
	boLinks,
	object
};

const REF = {
	...OBJECT,
	catalogItem,
	catalogItemSet
};

const ATTRIBUTE_SETS = {
	DATE,
	NUMBER,
	OBJECT,
	REF
};

export {
	ATTRIBUTE_TYPES,
	ATTRIBUTES_EVENTS,
	ATTRIBUTE_SETS,
	SOURCE_ATTRIBUTE_TYPES
};
