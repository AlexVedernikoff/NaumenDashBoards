// @flow
const ADD_WIDGET: 'ADD_WIDGET' = 'ADD_WIDGET';
const DELETE_WIDGET: 'DELETE_WIDGET' = 'DELETE_WIDGET';
const EDIT_LAYOUT: 'EDIT_LAYOUT' = 'EDIT_LAYOUT';
const RECORD_LAYOUT_SAVE_ERROR: 'RECORD_LAYOUT_SAVE_ERROR' = 'RECORD_LAYOUT_SAVE_ERROR';
const RECORD_WIDGET_DELETE_ERROR: 'RECORD_WIDGET_DELETE_ERROR' = 'RECORD_WIDGET_DELETE_ERROR';
const RECORD_WIDGET_SAVE_ERROR: 'RECORD_WIDGET_SAVE_ERROR' = 'RECORD_WIDGET_SAVE_ERROR';
const REQUEST_LAYOUT_SAVE: 'REQUEST_LAYOUT_SAVE' = 'REQUEST_LAYOUT_SAVE';
const REQUEST_WIDGET_DELETE: 'REQUEST_WIDGET_DELETE' = 'REQUEST_WIDGET_DELETE';
const REQUEST_WIDGET_SAVE: 'REQUEST_WIDGET_SAVE' = 'REQUEST_WIDGET_SAVE';
const RESET_WIDGET: 'RESET_WIDGET' = 'RESET_WIDGET';
const SET_CREATED_WIDGET: 'SET_CREATED_WIDGET' = 'SET_CREATED_WIDGET';
const SET_SELECTED_WIDGET: 'SET_SELECTED_WIDGET' = 'SET_SELECTED_WIDGET';
const SET_WIDGETS: 'SET_WIDGETS' = 'SET_WIDGETS';
const UNKNOWN_WIDGETS_ACTION: 'UNKNOWN_WIDGETS_ACTION' = 'UNKNOWN_WIDGETS_ACTION';
const UPDATE_WIDGET: 'UPDATE_WIDGET' = 'UPDATE_WIDGET';

const WIDGETS_EVENTS = {
	ADD_WIDGET,
	DELETE_WIDGET,
	EDIT_LAYOUT,
	RECORD_LAYOUT_SAVE_ERROR,
	RECORD_WIDGET_DELETE_ERROR,
	RECORD_WIDGET_SAVE_ERROR,
	REQUEST_LAYOUT_SAVE,
	REQUEST_WIDGET_DELETE,
	REQUEST_WIDGET_SAVE,
	RESET_WIDGET,
	SET_CREATED_WIDGET,
	SET_SELECTED_WIDGET,
	SET_WIDGETS,
	UNKNOWN_WIDGETS_ACTION,
	UPDATE_WIDGET
};

// Лимит виджетов на дашборде
const LIMIT = 30;

// Типы виджетов
const BAR: 'BAR' = 'BAR';
const BAR_STACKED: 'BAR_STACKED' = 'BAR_STACKED';
const COLUMN: 'COLUMN' = 'COLUMN';
const COLUMN_STACKED: 'COLUMN_STACKED' = 'COLUMN_STACKED';
const DONUT: 'DONUT' = 'DONUT';
const LINE: 'LINE' = 'LINE';
const PIE: 'PIE' = 'PIE';
const COMBO: 'COMBO' = 'COMBO';
const SUMMARY: 'SUMMARY' = 'SUMMARY';
const TABLE: 'TABLE' = 'TABLE';

const WIDGET_TYPES = {
	BAR,
	BAR_STACKED,
	COLUMN,
	COLUMN_STACKED,
	COMBO,
	DONUT,
	LINE,
	PIE,
	SUMMARY,
	TABLE
};

// Возможные подтипы комбо-графика
const COMBO_TYPES = {
	COLUMN,
	COLUMN_STACKED,
	LINE
};

// Графики строящиеся по осям
const AXIS = {
	BAR,
	BAR_STACKED,
	COLUMN,
	COLUMN_STACKED,
	LINE
};

// Груговые графики
const CIRCLE = {
	DONUT,
	PIE
};

const WIDGET_SETS = {
	AXIS,
	CIRCLE
};

/* Данные вкладки стиль */

// Доступные шрифты
const FONT_FAMILIES = ['Roboto', 'Arial'];

// Стили шрифта
const BOLD: 'BOLD' = 'BOLD';
const ITALIC: 'ITALIC' = 'ITALIC';
const UNDERLINE: 'UNDERLINE' = 'UNDERLINE';

const FONT_STYLES = {
	BOLD,
	ITALIC,
	UNDERLINE
};

// Достопная размерность шрифтов
const FONT_SIZE_OPTIONS = [13, 14, 15, 17];

// Позиция текста
const center: 'center' = 'center';
const left: 'left' = 'left';
const right: 'right' = 'right';

const TEXT_ALIGNS = {
	center,
	left,
	right
};

// Способы обработки текста
const CROP: 'CROP' = 'CROP';
const WRAP: 'WRAP' = 'WRAP';

const TEXT_HANDLERS = {
	CROP,
	WRAP
};

// Сортировка данных графиков
const ASC: 'ASC' = 'ASC';
const DESC: 'DESC' = 'DESC';

const SORTING_TYPES = {
	ASC,
	DESC
};

const INDICATOR: 'INDICATOR' = 'INDICATOR';
const PARAMETER: 'PARAMETER' = 'PARAMETER';

const SORTING_VALUES = {
	INDICATOR,
	PARAMETER
};

const DEFAULT_AXIS_SORTING_SETTINGS = {
	type: ASC,
	value: PARAMETER
};

const DEFAULT_CIRCLE_SORTING_SETTINGS = {
	type: ASC,
	value: INDICATOR
};

// Значения для отсутвующих данных в таблице
const EMPTY_ROW: 'EMPTY_ROW' = 'EMPTY_ROW';
const DASH: 'DASH' = 'DASH';
const NULL: 'NULL' = 'NULL';
const ZERO: 'ZERO' = 'ZERO';

const DEFAULT_TABLE_VALUE = {
	DASH,
	EMPTY_ROW,
	NULL,
	ZERO
};

/* Конец данных вкладки стиль */

export {
	COMBO_TYPES,
	DEFAULT_AXIS_SORTING_SETTINGS,
	DEFAULT_CIRCLE_SORTING_SETTINGS,
	DEFAULT_TABLE_VALUE,
	FONT_FAMILIES,
	FONT_SIZE_OPTIONS,
	FONT_STYLES,
	LIMIT,
	SORTING_TYPES,
	SORTING_VALUES,
	TEXT_ALIGNS,
	TEXT_HANDLERS,
	WIDGETS_EVENTS,
	WIDGET_SETS,
	WIDGET_TYPES
};
