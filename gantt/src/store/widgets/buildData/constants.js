// @flow
const RECEIVE_BUILD_DATA: 'RECEIVE_BUILD_DATA' = 'RECEIVE_BUILD_DATA';
const RECORD_BUILD_DATA_ERROR: 'RECORD_BUILD_DATA_ERROR' = 'RECORD_BUILD_DATA_ERROR';
const REQUEST_BUILD_DATA: 'REQUEST_BUILD_DATA' = 'REQUEST_BUILD_DATA';
const UNKNOWN_BUILD_DATA_ACTION: 'UNKNOWN_BUILD_DATA_ACTION' = 'UNKNOWN_BUILD_DATA_ACTION';
const UPDATE_BUILD_DATA: 'UPDATE_BUILD_DATA' = 'UPDATE_BUILD_DATA';

const BUILD_DATA_EVENTS = {
	RECEIVE_BUILD_DATA,
	RECORD_BUILD_DATA_ERROR,
	REQUEST_BUILD_DATA,
	UNKNOWN_BUILD_DATA_ACTION,
	UPDATE_BUILD_DATA
};

// Используется для разделения лейбла и uuid в значениях метакласса. Необходимо для перехода на список объектов
const SEPARATOR = '#';
// Используется для разделения title и code в значениях метакласса. Необходимо для перехода на список объектов
const TITLE_SEPARATOR = '◀️▶️';

// Настройки для игнорирования лимита получаемых данных по параметру и показателю для построения таблицы
const IGNORE_TABLE_DATA_LIMITS_SETTINGS = {
	breakdown: false,
	parameter: false
};

const BREAKDOWN: 'BREAKDOWN' = 'BREAKDOWN';
const INDICATOR: 'INDICATOR' = 'INDICATOR';
const PARAMETER: 'PARAMETER' = 'PARAMETER';

// Типы колонок таблицы
const COLUMN_TYPES = {
	BREAKDOWN,
	INDICATOR,
	PARAMETER
};

export {
	BUILD_DATA_EVENTS,
	COLUMN_TYPES,
	IGNORE_TABLE_DATA_LIMITS_SETTINGS,
	SEPARATOR,
	TITLE_SEPARATOR
};
