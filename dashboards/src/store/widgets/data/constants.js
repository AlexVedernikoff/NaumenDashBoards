// @flow
import type {ChartColorsSettings, DataTopSettings, Header} from './types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';

const ADD_WIDGET: 'ADD_WIDGET' = 'ADD_WIDGET';
const DELETE_WIDGET: 'DELETE_WIDGET' = 'DELETE_WIDGET';
const RECORD_WIDGET_COPY_ERROR: 'RECORD_WIDGET_COPY_ERROR' = 'RECORD_WIDGET_COPY_ERROR';
const RECORD_WIDGET_DELETE_ERROR: 'RECORD_WIDGET_DELETE_ERROR' = 'RECORD_WIDGET_DELETE_ERROR';
const RECORD_WIDGET_SAVE_ERROR: 'RECORD_WIDGET_SAVE_ERROR' = 'RECORD_WIDGET_SAVE_ERROR';
const RECORD_VALIDATE_TO_COPY_ERROR: 'RECORD_VALIDATE_TO_COPY_ERROR' = 'RECORD_VALIDATE_TO_COPY_ERROR';
const REQUEST_WIDGET_COPY: 'REQUEST_WIDGET_COPY' = 'REQUEST_WIDGET_COPY';
const REQUEST_WIDGET_DELETE: 'REQUEST_WIDGET_DELETE' = 'REQUEST_WIDGET_DELETE';
const REQUEST_WIDGET_SAVE: 'REQUEST_WIDGET_SAVE' = 'REQUEST_WIDGET_SAVE';
const REQUEST_VALIDATE_TO_COPY: 'REQUEST_VALIDATE_TO_COPY' = 'REQUEST_VALIDATE_TO_COPY';
const RESPONSE_VALIDATE_TO_COPY: 'RESPONSE_VALIDATE_TO_COPY' = 'RESPONSE_VALIDATE_TO_COPY';
const RESPONSE_WIDGET_COPY: 'RESPONSE_WIDGET_COPY' = 'RESPONSE_WIDGET_COPY';
const RESET_WIDGET: 'RESET_WIDGET' = 'RESET_WIDGET';
const SET_CREATED_WIDGET: 'SET_CREATED_WIDGET' = 'SET_CREATED_WIDGET';
const SET_FOCUSED_WIDGET: 'SET_FOCUSED_WIDGET' = 'SET_FOCUSED_WIDGET';
const SET_SELECTED_WIDGET: 'SET_SELECTED_WIDGET' = 'SET_SELECTED_WIDGET';
const SET_WIDGETS: 'SET_WIDGETS' = 'SET_WIDGETS';
const UNKNOWN_WIDGETS_ACTION: 'UNKNOWN_WIDGETS_ACTION' = 'UNKNOWN_WIDGETS_ACTION';
const UPDATE_WIDGET: 'UPDATE_WIDGET' = 'UPDATE_WIDGET';
const WIDGET_CLEAR_WARNING: 'WIDGET_CLEAR_WARNING' = 'WIDGET_CLEAR_WARNING';
const WIDGET_SET_WARNING: 'WIDGET_SET_WARNING' = 'WIDGET_SET_WARNING';

const WIDGETS_EVENTS = {
	ADD_WIDGET,
	DELETE_WIDGET,
	RECORD_VALIDATE_TO_COPY_ERROR,
	RECORD_WIDGET_COPY_ERROR,
	RECORD_WIDGET_DELETE_ERROR,
	RECORD_WIDGET_SAVE_ERROR,
	REQUEST_VALIDATE_TO_COPY,
	REQUEST_WIDGET_COPY,
	REQUEST_WIDGET_DELETE,
	REQUEST_WIDGET_SAVE,
	RESET_WIDGET,
	RESPONSE_VALIDATE_TO_COPY,
	RESPONSE_WIDGET_COPY,
	SET_CREATED_WIDGET,
	SET_FOCUSED_WIDGET,
	SET_SELECTED_WIDGET,
	SET_WIDGETS,
	UNKNOWN_WIDGETS_ACTION,
	UPDATE_WIDGET,
	WIDGET_CLEAR_WARNING,
	WIDGET_SET_WARNING
};

// Типы виджетов
const BAR: 'BAR' = 'BAR';
const BAR_STACKED: 'BAR_STACKED' = 'BAR_STACKED';
const COLUMN: 'COLUMN' = 'COLUMN';
const COLUMN_STACKED: 'COLUMN_STACKED' = 'COLUMN_STACKED';
const DONUT: 'DONUT' = 'DONUT';
const LINE: 'LINE' = 'LINE';
const PIE: 'PIE' = 'PIE';
const COMBO: 'COMBO' = 'COMBO';
const SPEEDOMETER: 'SPEEDOMETER' = 'SPEEDOMETER';
const SUMMARY: 'SUMMARY' = 'SUMMARY';
const TABLE: 'TABLE' = 'TABLE';
const TEXT: 'TEXT' = 'TEXT';

const DIAGRAM_WIDGET_TYPES = {
	BAR,
	BAR_STACKED,
	COLUMN,
	COLUMN_STACKED,
	COMBO,
	DONUT,
	LINE,
	PIE,
	SPEEDOMETER,
	SUMMARY,
	TABLE
};

const WIDGET_TYPES = {
	...DIAGRAM_WIDGET_TYPES,
	TEXT
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

// Круговые графики
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

const FONT_SIZE_AUTO_OPTION = 'auto';

// Достопная размерность шрифтов
const FONT_SIZE_OPTIONS = [13, 14, 15, 16, 17];

// Максимальный размер шрифта
const MAX_FONT_SIZE = 180;

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

const DEFAULT: 'DEFAULT' = 'DEFAULT';
const INDICATOR: 'INDICATOR' = 'INDICATOR';
const PARAMETER: 'PARAMETER' = 'PARAMETER';

const SORTING_VALUES = {
	DEFAULT,
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

// типы диапазонов спидометра
const ABSOLUTE: 'ABSOLUTE' = 'ABSOLUTE';
const PERCENT: 'PERCENT' = 'PERCENT';

const RANGES_TYPES = {
	ABSOLUTE,
	PERCENT
};

// Режимы отображения
const ANY: 'ANY' = 'ANY';

const DISPLAY_MODE = {
	...LAYOUT_MODE,
	ANY
};

// Позиция заголовка виджета
const BOTTOM: 'BOTTOM' = 'BOTTOM';
const TOP: 'TOP' = 'TOP';

const HEADER_POSITIONS = {
	BOTTOM,
	TOP
};

const DEFAULT_NAVIGATION_SETTINGS = Object.freeze({
	dashboard: null,
	show: false,
	showTip: false,
	tip: '',
	widget: null
});

const DEFAULT_TOP_SETTINGS: DataTopSettings = Object.freeze({
	count: 5,
	show: false
});

/**
 * Типы настройки цветов графика
 */
const CHART_COLORS_SETTINGS_TYPES = {
	AUTO: 'AUTO',
	CUSTOM: 'CUSTOM'
};

/**
 * Цвета графиков по умолчанию
 */
const DEFAULT_CHART_COLORS = [
	'#EA3223',
	'#999999',
	'#2C6FBA',
	'#4EAD5B',
	'#DE5D30',
	'#67369A',
	'#F6C142',
	'#4CAEEA',
	'#A1BA66',
	'#B02318',
	'#536130',
	'#DCA5A2',
	'#928A5B',
	'#9BB3D4',
	'#8C4A1C',
	'#FFFE55'
];

/**
 * Цвет значения разбивки по умолчанию. Используется, когда для значения заранее не настроен цвет
 * @type {string}
 */
const DEFAULT_BREAKDOWN_COLOR = '#9b9b9b';

const DEFAULT_COLORS_SETTINGS: ChartColorsSettings = Object.freeze({
	auto: {
		colors: DEFAULT_CHART_COLORS
	},
	custom: {
		useGlobal: false
	},
	type: CHART_COLORS_SETTINGS_TYPES.AUTO
});

// Ошибки копирования
const HAS_SUBJECT_FILTERS: 'hasSubjectFilters' = 'hasSubjectFilters';
const HAS_CUSTOM_GROUPS_WITH_RELATIVE_CRITERIA: 'hasCustomGroupsWithRelativeCriteria' = 'hasCustomGroupsWithRelativeCriteria';
const HAS_ONLY_RELATIVE_CRITERIA_CUSTOM_GROUPS: 'hasOnlyRelativeCriteriaCustomGroups' = 'hasOnlyRelativeCriteriaCustomGroups';

const COPY_WIDGET_ERRORS = {
	HAS_CUSTOM_GROUPS_WITH_RELATIVE_CRITERIA,
	HAS_ONLY_RELATIVE_CRITERIA_CUSTOM_GROUPS,
	HAS_SUBJECT_FILTERS
};

// Настройки заголовка виджета по умолчанию
const DEFAULT_HEADER_SETTINGS: Header = {
	fontColor: '#323232',
	fontFamily: FONT_FAMILIES[0],
	fontSize: 16,
	fontStyle: undefined,
	name: '',
	position: HEADER_POSITIONS.TOP,
	show: true,
	template: '',
	textAlign: TEXT_ALIGNS.left,
	textHandler: TEXT_HANDLERS.CROP,
	useName: true
};

// Свыше - предлагаем отключить отображение ???
const DATA_LABELS_LIMIT = 250;

// Лимит виджетов на дашборде
const DASHBOARD_WIDGET_COUNT_LIMIT = 30;

const LIMITS = {
	DASHBOARD_WIDGET_COUNT_LIMIT,
	DATA_LABELS_LIMIT
};

export {
	CHART_COLORS_SETTINGS_TYPES,
	COMBO_TYPES,
	COPY_WIDGET_ERRORS,
	DEFAULT_AXIS_SORTING_SETTINGS,
	DEFAULT_BREAKDOWN_COLOR,
	DEFAULT_CIRCLE_SORTING_SETTINGS,
	DEFAULT_CHART_COLORS,
	DEFAULT_COLORS_SETTINGS,
	DEFAULT_HEADER_SETTINGS,
	DEFAULT_NAVIGATION_SETTINGS,
	DEFAULT_TABLE_VALUE,
	DEFAULT_TOP_SETTINGS,
	DIAGRAM_WIDGET_TYPES,
	DISPLAY_MODE,
	FONT_FAMILIES,
	FONT_SIZE_AUTO_OPTION,
	FONT_SIZE_OPTIONS,
	FONT_STYLES,
	HEADER_POSITIONS,
	LIMITS,
	MAX_FONT_SIZE,
	RANGES_TYPES,
	SORTING_TYPES,
	SORTING_VALUES,
	TEXT_ALIGNS,
	TEXT_HANDLERS,
	WIDGETS_EVENTS,
	WIDGET_SETS,
	WIDGET_TYPES
};
