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
const boLinks: 'boLinks' = 'boLinks';
const catalogItem: 'catalogItem' = 'catalogItem';
const catalogItemSet: 'catalogItemSet' = 'catalogItemSet';
const COMPUTED_ATTR: 'COMPUTED_ATTR' = 'COMPUTED_ATTR';
const date: 'date' = 'date';
const dateTime: 'dateTime' = 'dateTime';
const double: 'double' = 'double';
const integer: 'integer' = 'integer';
const object: 'object' = 'object';

const ATTRIBUTE_TYPES = {
	backBOLinks,
	boLinks,
	catalogItem,
	catalogItemSet,
	COMPUTED_ATTR,
	date,
	dateTime,
	double,
	integer,
	object
};

const DATE = [date, dateTime];
const NUMBER = [integer, double];
const OBJECT = [object, boLinks, backBOLinks];
const REF = [...OBJECT, catalogItemSet, catalogItem];

const ATTRIBUTE_SETS = {
	DATE,
	NUMBER,
	OBJECT,
	REF
};

export {
	ATTRIBUTE_TYPES,
	ATTRIBUTES_EVENTS,
	ATTRIBUTE_SETS
};
