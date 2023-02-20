// @flow
import {DEFAULT_FONT, TEXT_HANDLERS} from 'store/widgets/data/constants';

const BLOCK: 'BLOCK' = 'BLOCK';
const INLINE: 'INLINE' = 'INLINE';

export const LEGEND_DISPLAY_TYPES = {
	BLOCK,
	INLINE
};

const bottom: 'bottom' = 'bottom';
const left: 'left' = 'left';
const right: 'right' = 'right';
const top: 'top' = 'top';

export const LEGEND_POSITIONS = {
	bottom,
	left,
	right,
	top
};

const LEFT: 'left' = 'left';
const CENTER: 'center' = 'center';
const RIGHT: 'right' = 'right';

export const LEGEND_ALIGN = {
	CENTER,
	LEFT,
	RIGHT
};

const HORIZONTAL: 'horizontal' = 'horizontal';
const VERTICAL: 'vertical' = 'vertical';

export const LEGEND_LAYOUT = {
	HORIZONTAL,
	VERTICAL
};

const TOP: 'top' = 'top';
const MIDDLE: 'middle' = 'middle';
const BOTTOM: 'bottom' = 'bottom';

export const LEGEND_VERTICAL_ALIGN = {
	BOTTOM,
	MIDDLE,
	TOP
};

export const LEGEND_HEIGHT = 100;
export const LEGEND_WIDTH_PERCENT = 0.2;

export const DEFAULT_LEGEND = {
	align: LEGEND_ALIGN.CENTER,
	layout: LEGEND_LAYOUT.HORIZONTAL,
	show: false,
	style: {},
	textHandler: 'CROP',
	verticalAlign: LEGEND_VERTICAL_ALIGN.MIDDLE
};

export const XAXIS_MAX_WIDTH = 120;

const MULTILINE: 'MULTILINE' = 'MULTILINE';
const ROTATE: 'ROTATE' = 'ROTATE';
const SINGLELINE: 'SINGLELINE' = 'SINGLELINE';
const TRIM: 'TRIM' = 'TRIM';

export const LABEL_DRAW_MODE = {
	MULTILINE,
	ROTATE,
	SINGLELINE,
	TRIM
};

export const EMPTY_CHART_OPTIONS = {
	type: 'EmptyChartOptions'
};

export const RULER_WIDTH = 13;

export const AXIS_FONT_SIZE = 12;

export const X_AXIS_HEIGHT = 8;

export const ROTATE_AXIS_COEFFICIENT = 0.6;

export const DEFAULT_WIDGET_WIDTH = 320;

export const DEFAULT_DATA_LABEL_COLOR = '#323232';

export const SUB_TOTAL_POSITION = {
	INNER: 'INNER',
	OUTER: 'OUTER'
};

export const DEFAULT_CHART_SETTINGS = {
	axis: {
		fontFamily: DEFAULT_FONT,
		fontSize: 12,
		show: true,
		showName: false
	},
	dataLabels: {
		disabled: false,
		fontColor: DEFAULT_DATA_LABEL_COLOR,
		fontFamily: DEFAULT_FONT,
		fontSize: 14,
		show: true,
		showShadow: false
	},
	legend: {
		displayType: LEGEND_DISPLAY_TYPES.BLOCK,
		fontFamily: DEFAULT_FONT,
		fontSize: 14,
		position: LEGEND_POSITIONS.right,
		show: false,
		textHandler: TEXT_HANDLERS.CROP
	}
};

export const PIVOT_COLUMN_MIN_WIDTH = 158;

export const PIVOT_COLUMN_TYPE = {
	EMPTY_GROUP: 'EMPTY_GROUP',
	GROUP: 'GROUP',
	PARAMETER: 'PARAMETER',
	SUM: 'SUM',
	TOTAL_SUM: 'TOTAL_SUM',
	VALUE: 'VALUE'
};
