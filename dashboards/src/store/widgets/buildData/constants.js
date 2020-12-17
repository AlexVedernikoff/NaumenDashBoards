// @flow
const RECEIVE_BUILD_DATA: 'RECEIVE_BUILD_DATA' = 'RECEIVE_BUILD_DATA';
const RECORD_BUILD_DATA_ERROR: 'RECORD_BUILD_DATA_ERROR' = 'RECORD_BUILD_DATA_ERROR';
const REQUEST_BUILD_DATA: 'REQUEST_BUILD_DATA' = 'REQUEST_BUILD_DATA';
const UNKNOWN_BUILD_DATA_ACTION: 'UNKNOWN_BUILD_DATA_ACTION' = 'UNKNOWN_BUILD_DATA_ACTION';

const BUILD_DATA_EVENTS = {
	RECEIVE_BUILD_DATA,
	RECORD_BUILD_DATA_ERROR,
	REQUEST_BUILD_DATA,
	UNKNOWN_BUILD_DATA_ACTION
};

// Используется для разделения лейбла и uuid в значениях метакласса. Необходимо для перехода на список объектов
const META_CLASS_VALUE_SEPARATOR = '#';

// Используется для разделения лейбла и uuid в значениях, по которым можно перейти на карточку объекта
const CARD_OBJECT_VALUE_SEPARATOR = '#';

// Настройки для игнорирования лимита получаемых данных по параметру и показателю для построения таблицы
const IGNORE_TABLE_DATA_LIMITS_SETTINGS = {
	breakdown: false,
	parameter: false
};

export {
	BUILD_DATA_EVENTS,
	CARD_OBJECT_VALUE_SEPARATOR,
	IGNORE_TABLE_DATA_LIMITS_SETTINGS,
	META_CLASS_VALUE_SEPARATOR
};
