// @flow
const RECEIVE_ATTRIBUTES: 'RECEIVE_ATTRIBUTES' = 'RECEIVE_ATTRIBUTES';
const RECORD_ATTRIBUTES_ERROR: 'RECORD_ATTRIBUTES_ERROR' = 'RECORD_ATTRIBUTES_ERROR';
const REQUEST_ATTRIBUTES: 'REQUEST_ATTRIBUTES' = 'REQUEST_ATTRIBUTES';
const SET_LOADING_STATE_ATTRIBUTES: 'SET_LOADING_STATE_ATTRIBUTES' = 'SET_LOADING_STATE_ATTRIBUTES';
const UNKNOWN_ATTRIBUTES_ACTION: 'UNKNOWN_ATTRIBUTES_ACTION' = 'UNKNOWN_ATTRIBUTES_ACTION';

const ATTRIBUTES_EVENTS = {
	RECEIVE_ATTRIBUTES,
	RECORD_ATTRIBUTES_ERROR,
	REQUEST_ATTRIBUTES,
	SET_LOADING_STATE_ATTRIBUTES,
	UNKNOWN_ATTRIBUTES_ACTION
};

// Типы атрибутов
const backBOLinks: 'backBOLinks' = 'backBOLinks';
const backTimer: 'backTimer' = 'backTimer';
const boLinks: 'boLinks' = 'boLinks';
const catalogItem: 'catalogItem' = 'catalogItem';
const catalogItemSet: 'catalogItemSet' = 'catalogItemSet';
const COMPUTED_ATTR: 'COMPUTED_ATTR' = 'COMPUTED_ATTR';
const PERCENTAGE_RELATIVE_ATTR: 'PERCENTAGE_RELATIVE_ATTR' = 'PERCENTAGE_RELATIVE_ATTR';
const date: 'date' = 'date';
const dateTime: 'dateTime' = 'dateTime';
const double: 'double' = 'double';
const dtInterval: 'dtInterval' = 'dtInterval';
const integer: 'integer' = 'integer';
const localizedText: 'localizedText' = 'localizedText';
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
	localizedText,
	metaClass,
	object,
	state,
	string,
	timer
};

const ATTRIBUTE_TYPES = {
	...SOURCE_ATTRIBUTE_TYPES,
	COMPUTED_ATTR,
	PERCENTAGE_RELATIVE_ATTR
};

const VISOR_CODE_TYPES = {
	DATE: 'date',
	DATE_TIME: 'dateTime',
	FR_CAT: 'stFrCat',
	HYPERLINK: 'attrHyperlink',
	PHONE_STRING: 'phoneString',
	STRING: 'attrString'
};

// Набор типов дат
const DATE = {
	date,
	dateTime
};

// Набор числовых типов
const NUMBER = {
	double,
	integer
};

// Набор типов объекта
const OBJECT = {
	backBOLinks,
	boLinks,
	object
};

// Набор ссылочных типов
const REFERENCE = {
	...OBJECT,
	catalogItem,
	catalogItemSet
};

// Набор ссылок на бизнес-объекты
const BO_LINKS = {
	backBOLinks,
	boLinks
};

const ATTRIBUTE_SETS = {
	BO_LINKS,
	DATE,
	NUMBER,
	OBJECT,
	REFERENCE
};

const DYNAMIC_ATTRIBUTE_PROPERTY = 'totalValue';

const VALUE: 'VALUE' = 'VALUE';
const STATUS: 'STATUS' = 'STATUS';

const TIMER_VALUE = {
	STATUS,
	VALUE
};

export {
	ATTRIBUTE_SETS,
	ATTRIBUTE_TYPES,
	ATTRIBUTES_EVENTS,
	DYNAMIC_ATTRIBUTE_PROPERTY,
	SOURCE_ATTRIBUTE_TYPES,
	TIMER_VALUE,
	VISOR_CODE_TYPES
};
