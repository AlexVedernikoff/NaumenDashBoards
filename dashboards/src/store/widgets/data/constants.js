// @flow
import type {
	AxisFormat,
	ChartColorsSettings,
	DTIntervalAxisFormat,
	DataTopSettings,
	Header,
	LabelAxisFormat,
	NumberAxisFormat
} from './types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';

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
const PIVOT_TABLE: 'PIVOT_TABLE' = 'PIVOT_TABLE';
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
	PIVOT_TABLE,
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
const DEFAULT_FONT = 'Roboto';
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

// типы диапазонов спидометра
const CURVE: 'CURVE' = 'CURVE';
const LEGEND: 'LEGEND' = 'LEGEND';

const RANGES_POSITION = {
	CURVE,
	LEGEND
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

const MODE_OF_TOP = {
	MAX: 'MAX',
	MIN: 'MIN'
};

const DEFAULT_TOP_SETTINGS: DataTopSettings = Object.freeze({
	count: null,
	modeOfTop: MODE_OF_TOP.MAX,
	show: false
});

const DEFAULT_TOP_SETTINGS_INIT: DataTopSettings = Object.freeze({
	count: 5,
	modeOfTop: MODE_OF_TOP.MAX,
	show: true
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
	'#E88428',
	'#F7D250',
	'#48914F',
	'#56BF53',
	'#32D1AB',
	'#109CA4',
	'#65B7E9',
	'#4389D7',
	'#B6A2F0',
	'#8256E0',
	'#B446DB',
	'#BA3F72',
	'#6C84A4',
	'#AEC1DB',
	'#F4A2A2',
	'#F44F4F'
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
		data: null,
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
	fontFamily: DEFAULT_FONT,
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

// Лимит на отображение меток на графике
const DATA_LABELS_LIMIT = 250;

// Лимит виджетов на дашборде
const DASHBOARD_WIDGET_COUNT_LIMIT = 30;

const LIMITS = {
	DASHBOARD_WIDGET_COUNT_LIMIT,
	DATA_LABELS_LIMIT
};

const AXIS_FORMAT_TYPE = {
	DT_INTERVAL_FORMAT: 'DT_INTERVAL_FORMAT',
	INTEGER_FORMAT: 'INTEGER_FORMAT',
	LABEL_FORMAT: 'LABEL_FORMAT',
	NUMBER_FORMAT: 'NUMBER_FORMAT'
};

const DT_INTERVAL_PERIOD = {
	DAY: 'DAY',
	HOURS: 'HOURS',
	MINUTES: 'MINUTES',
	NOT_SELECTED: 'NOT_SELECTED',
	SECONDS: 'SECONDS',
	WEEK: 'WEEK'
};

const TITLE: 'TITLE' = 'TITLE';

const CODE: 'CODE' = 'CODE';

const TITLE_CODE: 'TITLE_CODE' = 'TITLE_CODE';

const LABEL_FORMATS = {
	CODE,
	TITLE,
	TITLE_CODE
};

const THOUSAND: 'THOUSAND' = 'THOUSAND';
const MILLION: 'MILLION' = 'MILLION';
const BILLION: 'BILLION' = 'BILLION';
const TRILLION: 'TRILLION' = 'TRILLION';

const NOTATION_FORMATS = {
	BILLION,
	MILLION,
	THOUSAND,
	TRILLION
};

const DEFAULT_LABEL_AXIS_FORMAT: LabelAxisFormat = {
	labelFormat: LABEL_FORMATS.TITLE,
	type: AXIS_FORMAT_TYPE.LABEL_FORMAT
};

const DEFAULT_NUMBER_AXIS_FORMAT: NumberAxisFormat = {
	additional: null,
	notation: null,
	splitDigits: false,
	symbolCount: 0,
	type: AXIS_FORMAT_TYPE.NUMBER_FORMAT
};

const DEFAULT_INTEGER_AXIS_FORMAT: NumberAxisFormat = {
	additional: null,
	notation: null,
	splitDigits: false,
	type: AXIS_FORMAT_TYPE.INTEGER_FORMAT
};

const DEFAULT_DT_INTERVAL_AXIS_FORMAT: DTIntervalAxisFormat = {
	quotient: DT_INTERVAL_PERIOD.HOURS,
	remainder: DT_INTERVAL_PERIOD.SECONDS,
	symbolCount: 0,
	type: AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT
};

const DEFAULT_AXIS_FORMAT: $Shape<{[key: $Values<typeof AXIS_FORMAT_TYPE>]: AxisFormat}> = {
	[AXIS_FORMAT_TYPE.LABEL_FORMAT]: DEFAULT_LABEL_AXIS_FORMAT,
	[AXIS_FORMAT_TYPE.NUMBER_FORMAT]: DEFAULT_NUMBER_AXIS_FORMAT,
	[AXIS_FORMAT_TYPE.INTEGER_FORMAT]: DEFAULT_INTEGER_AXIS_FORMAT,
	[AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT]: DEFAULT_DT_INTERVAL_AXIS_FORMAT
};

const PREVIOUS_DAY: 'PREVIOUS_DAY' = 'PREVIOUS_DAY';
const PREVIOUS_WEEK: 'PREVIOUS_WEEK' = 'PREVIOUS_WEEK';
const PREVIOUS_MONTH: 'PREVIOUS_MONTH' = 'PREVIOUS_MONTH';
const PREVIOUS_YEAR: 'PREVIOUS_YEAR' = 'PREVIOUS_YEAR';
const CUSTOM: 'CUSTOM' = 'CUSTOM';

const COMPARE_PERIOD = {
	CUSTOM,
	PREVIOUS_DAY,
	PREVIOUS_MONTH,
	PREVIOUS_WEEK,
	PREVIOUS_YEAR
};

const DEFAULT_COMPARE_PERIOD_FORMAT = {
	down: '#E08A85',
	up: '#70C292'
};

const DEFAULT_COMPARE_PERIOD = {
	allow: false,
	format: DEFAULT_COMPARE_PERIOD_FORMAT,
	period: COMPARE_PERIOD.PREVIOUS_DAY,
	show: false
};

const DEFAULT_TOOLTIP_SETTINGS = {
	fontFamily: DEFAULT_FONT,
	fontSize: 13,
	show: false,
	text: '',
	title: ''
};

const GROUP_INDICATOR_INFO = 'GROUP_INDICATOR_INFO';
const INDICATOR_INFO = 'INDICATOR_INFO';

const INDICATOR_GROUPING_TYPE = {
	GROUP_INDICATOR_INFO,
	INDICATOR_INFO
};

export {
	AXIS_FORMAT_TYPE,
	CHART_COLORS_SETTINGS_TYPES,
	COMBO_TYPES,
	COMPARE_PERIOD,
	COPY_WIDGET_ERRORS,
	DEFAULT_AXIS_FORMAT,
	DEFAULT_AXIS_SORTING_SETTINGS,
	DEFAULT_BREAKDOWN_COLOR,
	DEFAULT_CHART_COLORS,
	DEFAULT_CIRCLE_SORTING_SETTINGS,
	DEFAULT_COLORS_SETTINGS,
	DEFAULT_COMPARE_PERIOD,
	DEFAULT_DT_INTERVAL_AXIS_FORMAT,
	DEFAULT_FONT,
	DEFAULT_HEADER_SETTINGS,
	DEFAULT_INTEGER_AXIS_FORMAT,
	DEFAULT_LABEL_AXIS_FORMAT,
	DEFAULT_NAVIGATION_SETTINGS,
	DEFAULT_NUMBER_AXIS_FORMAT,
	DEFAULT_TABLE_VALUE,
	DEFAULT_TOOLTIP_SETTINGS,
	DEFAULT_TOP_SETTINGS_INIT,
	DEFAULT_TOP_SETTINGS,
	DIAGRAM_WIDGET_TYPES,
	DISPLAY_MODE,
	DT_INTERVAL_PERIOD,
	FONT_FAMILIES,
	FONT_SIZE_AUTO_OPTION,
	FONT_SIZE_OPTIONS,
	FONT_STYLES,
	HEADER_POSITIONS,
	INDICATOR_GROUPING_TYPE,
	LABEL_FORMATS,
	LIMITS,
	MAX_FONT_SIZE,
	MODE_OF_TOP,
	NOTATION_FORMATS,
	RANGES_POSITION,
	RANGES_TYPES,
	SORTING_TYPES,
	SORTING_VALUES,
	TEXT_ALIGNS,
	TEXT_HANDLERS,
	WIDGET_SETS,
	WIDGET_TYPES
};
