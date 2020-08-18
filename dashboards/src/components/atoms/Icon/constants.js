// @flow
const ACCEPT: 'ACCEPT' = 'ACCEPT';
const ALIGN_CENTER: 'ALIGN_CENTER' = 'ALIGN_CENTER';
const ALIGN_LEFT: 'ALIGN_LEFT' = 'ALIGN_LEFT';
const ALIGN_RIGHT: 'ALIGN_RIGHT' = 'ALIGN_RIGHT';
const ARROW_BOTTOM: 'ARROW_BOTTOM' = 'ARROW_BOTTOM';
const ARROW_TOP: 'ARROW_TOP' = 'ARROW_TOP';
const ASC: 'ASC' = 'ASC';
const BAR_CHART: 'BAR_CHART' = 'BAR_CHART';
const BASKET: 'BASKET' = 'BASKET';
const BOLD: 'BOLD' = 'BOLD';
const BRACKET_LEFT: 'BRACKET_LEFT' = 'BRACKET_LEFT';
const BRACKET_RIGHT: 'BRACKET_RIGHT' = 'BRACKET_RIGHT';
const CALENDAR: 'CALENDAR' = 'CALENDAR';
const CANCEL: 'CANCEL' = 'CANCEL';
const CARET: 'CARET' = 'CARET';
const CHECKBOX: 'CHECKBOX' = 'CHECKBOX';
const CHECKBOX_CHECKED: 'CHECKBOX_CHECKED' = 'CHECKBOX_CHECKED';
const CHEVRON: 'CHEVRON' = 'CHEVRON';
const CLOSE: 'CLOSE' = 'CLOSE';
const COLUMN_CHART: 'COLUMN_CHART' = 'COLUMN_CHART';
const COMBO_CHART: 'COMBO_CHART' = 'COMBO_CHART';
const CROP: 'CROP' = 'CROP';
const DATA: 'DATA' = 'DATA';
const DESC: 'DESC' = 'DESC';
const DIVISION: 'DIVISION' = 'DIVISION';
const DONE: 'DONE' = 'DONE';
const DONUT_CHART: 'DONUT_CHART' = 'DONUT_CHART';
const DOWNLOAD: 'DOWNLOAD' = 'DOWNLOAD';
const EDIT: 'EDIT' = 'EDIT';
const ELLIPSIS: 'ELLIPSIS' = 'ELLIPSIS';
const EXPAND: 'EXPAND' = 'EXPAND';
const FILTER: 'FILTER' = 'FILTER';
const INFO: 'INFO' = 'INFO';
const ITALIC: 'ITALIC' = 'ITALIC';
const KEBAB: 'KEBAB' = 'KEBAB';
const LEFT_ANGLE: 'LEFT_ANGLE' = 'LEFT_ANGLE';
const LINE_CHART: 'LINE_CHART' = 'LINE_CHART';
const NUMBER: 'NUMBER' = 'NUMBER';
const MAIL: 'MAIL' = 'MAIL';
const MINUS: 'MINUS' = 'MINUS';
const MOBILE: 'MOBILE' = 'MOBILE';
const MULTIPLY: 'MULTIPLY' = 'MULTIPLY';
const ONE_TO_ONE: 'ONE_TO_ONE' = 'ONE_TO_ONE';
const PAN: 'PAN' = 'PAN';
const PIE_CHART: 'PIE_CHART' = 'PIE_CHART';
const PLUS: 'PLUS' = 'PLUS';
const POSITION_BOTTOM: 'POSITION_BOTTOM' = 'POSITION_BOTTOM';
const POSITION_LEFT: 'POSITION_LEFT' = 'POSITION_LEFT';
const POSITION_RIGHT: 'POSITION_RIGHT' = 'POSITION_RIGHT';
const POSITION_TOP: 'POSITION_TOP' = 'POSITION_TOP';
const PRINT: 'PRINT' = 'PRINT';
const RADIO: 'RADIO' = 'RADIO';
const RADIO_CHECKED: 'RADIO_CHECKED' = 'RADIO_CHECKED';
const REFRESH: 'REFRESH' = 'REFRESH';
const REMOVE: 'REMOVE' = 'REMOVE';
const RIGHT_ANGLE: 'RIGHT_ANGLE' = 'RIGHT_ANGLE';
const SEARCH: 'SEARCH' = 'SEARCH';
const SPEEDOMETER: 'SPEEDOMETER' = 'SPEEDOMETER';
const STACKED_BAR_CHART: 'STACKED_BAR_CHART' = 'STACKED_BAR_CHART';
const STACKED_COLUMN_CHART: 'STACKED_COLUMN_CHART' = 'STACKED_COLUMN_CHART';
const SQUARE: 'SQUARE' = 'SQUARE';
const SQUARE_REMOVE: 'SQUARE_REMOVE' = 'SQUARE_REMOVE';
const SUMMARY: 'SUMMARY' = 'SUMMARY';
const TABLE: 'TABLE' = 'TABLE';
const TEXT: 'TEXT' = 'TEXT';
const TIMER: 'TIMER' = 'TIMER';
const TIMER_OFF: 'TIMER_OFF' = 'TIMER_OFF';
const TOGGLE_COLLAPSED: 'TOGGLE_COLLAPSED' = 'TOGGLE_COLLAPSED';
const TOGGLE_EXPANDED: 'TOGGLE_EXPANDED' = 'TOGGLE_EXPANDED';
const TOUCH_CALENDAR: 'TOUCH_CALENDAR' = 'TOUCH_CALENDAR';
const TOUCH_NUMBER: 'TOUCH_NUMBER' = 'TOUCH_NUMBER';
const TOUCH_TEXT: 'TOUCH_TEXT' = 'TOUCH_TEXT';
const UNDERLINE: 'UNDERLINE' = 'UNDERLINE';
const WEB: 'WEB' = 'WEB';
const WEB_MK: 'WEB_MK' = 'WEB_MK';
const WRAP: 'WRAP' = 'WRAP';
const ZOOM: 'ZOOM' = 'ZOOM';

const ICON_NAMES = {
	ACCEPT,
	ALIGN_CENTER,
	ALIGN_LEFT,
	ALIGN_RIGHT,
	ARROW_BOTTOM,
	ARROW_TOP,
	ASC,
	BAR_CHART,
	BASKET,
	BOLD,
	BRACKET_LEFT,
	BRACKET_RIGHT,
	CALENDAR,
	CANCEL,
	CARET,
	CHECKBOX,
	CHECKBOX_CHECKED,
	CHEVRON,
	CLOSE,
	COLUMN_CHART,
	COMBO_CHART,
	CROP,
	DATA,
	DESC,
	DIVISION,
	DONE,
	DONUT_CHART,
	DOWNLOAD,
	EDIT,
	ELLIPSIS,
	EXPAND,
	FILTER,
	INFO,
	ITALIC,
	KEBAB,
	LEFT_ANGLE,
	LINE_CHART,
	MAIL,
	MINUS,
	MOBILE,
	MULTIPLY,
	NUMBER,
	ONE_TO_ONE,
	PAN,
	PIE_CHART,
	PLUS,
	POSITION_BOTTOM,
	POSITION_LEFT,
	POSITION_RIGHT,
	POSITION_TOP,
	PRINT,
	RADIO,
	RADIO_CHECKED,
	REFRESH,
	REMOVE,
	RIGHT_ANGLE,
	SEARCH,
	SPEEDOMETER,
	SQUARE,
	SQUARE_REMOVE,
	STACKED_BAR_CHART,
	STACKED_COLUMN_CHART,
	SUMMARY,
	TABLE,
	TEXT,
	TIMER,
	TIMER_OFF,
	TOGGLE_COLLAPSED,
	TOGGLE_EXPANDED,
	TOUCH_CALENDAR,
	TOUCH_NUMBER,
	TOUCH_TEXT,
	UNDERLINE,
	WEB,
	WEB_MK,
	WRAP,
	ZOOM
};

const NORMAL: 'NORMAL' = 'NORMAL';
const LARGE: 'LARGE' = 'LARGE';

const ICON_SIZES = {
	LARGE,
	NORMAL
};

const ICON_PROPS = {
	[LARGE]: {
		height: 24,
		viewBox: '0 0 24 24',
		width: 24
	},
	[NORMAL]: {
		height: 16,
		viewBox: '0 0 16 16',
		width: 16
	}
};

const WIDGET_SUB_COLOR = '#B390E0';

export {
	ICON_NAMES,
	ICON_PROPS,
	ICON_SIZES,
	WIDGET_SUB_COLOR
};
