// @flow
const ACCEPT: 'ACCEPT' = 'ACCEPT';
const ALIGN_CENTER: 'ALIGN_CENTER' = 'ALIGN_CENTER';
const ALIGN_LEFT: 'ALIGN_LEFT' = 'ALIGN_LEFT';
const ALIGN_RIGHT: 'ALIGN_RIGHT' = 'ALIGN_RIGHT';
const ARROW_BOTTOM: 'ARROW_BOTTOM' = 'ARROW_BOTTOM';
const ARROW_FULL_DOWN: 'ARROW_FULL_DOWN' = 'ARROW_FULL_DOWN';
const ARROW_FULL_LEFT: 'ARROW_FULL_LEFT' = 'ARROW_FULL_LEFT';
const ARROW_FULL_RIGHT: 'ARROW_FULL_RIGHT' = 'ARROW_FULL_RIGHT';
const ARROW_FULL_UP: 'ARROW_FULL_UP' = 'ARROW_FULL_UP';
const ARROW_TOP: 'ARROW_TOP' = 'ARROW_TOP';
const ASC: 'ASC' = 'ASC';
const BACK_ARROW: 'BACK_ARROW' = 'BACK_ARROW';
const BAR_CHART: 'BAR_CHART' = 'BAR_CHART';
const BASKET: 'BASKET' = 'BASKET';
const BOLD: 'BOLD' = 'BOLD';
const BRACKET_LEFT: 'BRACKET_LEFT' = 'BRACKET_LEFT';
const BRACKET_RIGHT: 'BRACKET_RIGHT' = 'BRACKET_RIGHT';
const BREAKDOWN: 'BREAKDOWN' = 'BREAKDOWN';
const CALENDAR: 'CALENDAR' = 'CALENDAR';
const CANCEL: 'CANCEL' = 'CANCEL';
const CARET: 'CARET' = 'CARET';
const CARET_DOWN: 'CARET_DOWN' = 'CARET_DOWN';
const CARET_UP: 'CARET_UP' = 'CARET_UP';
const CHECKBOX: 'CHECKBOX' = 'CHECKBOX';
const CHECKBOX_CHECKED: 'CHECKBOX_CHECKED' = 'CHECKBOX_CHECKED';
const CHEVRON: 'CHEVRON' = 'CHEVRON';
const CLOSE: 'CLOSE' = 'CLOSE';
const COLUMN: 'COLUMN' = 'COLUMN';
const COLUMN_CHART: 'COLUMN_CHART' = 'COLUMN_CHART';
const COMBO_CHART: 'COMBO_CHART' = 'COMBO_CHART';
const CONNECTION: 'CONNECTION' = 'CONNECTION';
const CROP: 'CROP' = 'CROP';
const DATA: 'DATA' = 'DATA';
const DESC: 'DESC' = 'DESC';
const DIVISION: 'DIVISION' = 'DIVISION';
const DONE: 'DONE' = 'DONE';
const DONUT_CHART: 'DONUT_CHART' = 'DONUT_CHART';
const DOWNLOAD: 'DOWNLOAD' = 'DOWNLOAD';
const DRAWER_CLOSE: 'DRAWER_CLOSE' = 'DRAWER_CLOSE';
const DRAWER_OPEN: 'DRAWER_OPEN' = 'DRAWER_OPEN';
const EDIT: 'EDIT' = 'EDIT';
const ELLIPSIS: 'ELLIPSIS' = 'ELLIPSIS';
const EXPAND: 'EXPAND' = 'EXPAND';
const EXPORT: 'EXPORT' = 'EXPORT';
const EXTERNAL_LINK: 'EXTERNAL_LINK' = 'EXTERNAL_LINK';
const FILLED_FILTER: 'FILLED_FILTER' = 'FILLED_FILTER';
const FILTER: 'FILTER' = 'FILTER';
const INFO: 'INFO' = 'INFO';
const ITALIC: 'ITALIC' = 'ITALIC';
const KEBAB: 'KEBAB' = 'KEBAB';
const LEFT_ANGLE: 'LEFT_ANGLE' = 'LEFT_ANGLE';
const LINE_CHART: 'LINE_CHART' = 'LINE_CHART';
const LINK: 'LINK' = 'LINK';
const NUMBER: 'NUMBER' = 'NUMBER';
const MAIL: 'MAIL' = 'MAIL';
const MINUS: 'MINUS' = 'MINUS';
const MOBILE: 'MOBILE' = 'MOBILE';
const MULTIPLY: 'MULTIPLY' = 'MULTIPLY';
const ONE_TO_ONE: 'ONE_TO_ONE' = 'ONE_TO_ONE';
const PAN: 'PAN' = 'PAN';
const PANEL_TO_LEFT: 'PANEL_TO_LEFT' = 'PANEL_TO_LEFT';
const PANEL_TO_RIGHT: 'PANEL_TO_RIGHT' = 'PANEL_TO_RIGHT';
const PIE_CHART: 'PIE_CHART' = 'PIE_CHART';
const PIVOT_TABLE: 'PIVOT_TABLE' = 'PIVOT_TABLE';
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
const ROW: 'ROW' = 'ROW';
const ROW_COLOR: 'ROW_COLOR' = 'ROW_COLOR';
const SAVE: 'SAVE' = 'SAVE';
const SEARCH: 'SEARCH' = 'SEARCH';
const SIDEBAR_ROUND_LEFT: 'SIDEBAR_ROUND_LEFT' = 'SIDEBAR_ROUND_LEFT';
const SIDEBAR_ROUND_RIGHT: 'SIDEBAR_ROUND_RIGHT' = 'SIDEBAR_ROUND_RIGHT';
const SIDEBAR_ROUND_DOWN: 'SIDEBAR_ROUND_DOWN' = 'SIDEBAR_ROUND_DOWN';
const SIDEBAR_ROUND_UP: 'SIDEBAR_ROUND_UP' = 'SIDEBAR_ROUND_UP';
const SPEEDOMETER: 'SPEEDOMETER' = 'SPEEDOMETER';
const STACKED_BAR_CHART: 'STACKED_BAR_CHART' = 'STACKED_BAR_CHART';
const STACKED_COLUMN_CHART: 'STACKED_COLUMN_CHART' = 'STACKED_COLUMN_CHART';
const SQUARE: 'SQUARE' = 'SQUARE';
const SQUARE_REMOVE: 'SQUARE_REMOVE' = 'SQUARE_REMOVE';
const SUM: 'SUM' = 'SUM';
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
const USER: 'USER' = 'USER';
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
	ARROW_FULL_DOWN,
	ARROW_FULL_LEFT,
	ARROW_FULL_RIGHT,
	ARROW_FULL_UP,
	ARROW_TOP,
	ASC,
	BACK_ARROW,
	BAR_CHART,
	BASKET,
	BOLD,
	BRACKET_LEFT,
	BRACKET_RIGHT,
	BREAKDOWN,
	CALENDAR,
	CANCEL,
	CARET,
	CARET_DOWN,
	CARET_UP,
	CHECKBOX,
	CHECKBOX_CHECKED,
	CHEVRON,
	CLOSE,
	COLUMN,
	COLUMN_CHART,
	COMBO_CHART,
	CONNECTION,
	CROP,
	DATA,
	DESC,
	DIVISION,
	DONE,
	DONUT_CHART,
	DOWNLOAD,
	DRAWER_CLOSE,
	DRAWER_OPEN,
	EDIT,
	ELLIPSIS,
	EXPAND,
	EXPORT,
	EXTERNAL_LINK,
	FILLED_FILTER,
	FILTER,
	INFO,
	ITALIC,
	KEBAB,
	LEFT_ANGLE,
	LINE_CHART,
	LINK,
	MAIL,
	MINUS,
	MOBILE,
	MULTIPLY,
	NUMBER,
	ONE_TO_ONE,
	PAN,
	PANEL_TO_LEFT,
	PANEL_TO_RIGHT,
	PIE_CHART,
	PIVOT_TABLE,
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
	ROW,
	ROW_COLOR,
	SAVE,
	SEARCH,
	SIDEBAR_ROUND_DOWN,
	SIDEBAR_ROUND_LEFT,
	SIDEBAR_ROUND_RIGHT,
	SIDEBAR_ROUND_UP,
	SPEEDOMETER,
	SQUARE,
	SQUARE_REMOVE,
	STACKED_BAR_CHART,
	STACKED_COLUMN_CHART,
	SUM,
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
	USER,
	WEB,
	WEB_MK,
	WRAP,
	ZOOM
};

const WIDGET_SUB_COLOR = '#B390E0';

export {
	ICON_NAMES,
	WIDGET_SUB_COLOR
};
