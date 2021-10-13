// @flow
import type {DefaultChartSettings} from './types';
import {FONT_FAMILIES, TEXT_HANDLERS} from 'store/widgets/data/constants';

const bar: 'bar' = 'bar';
const donut: 'donut' = 'donut';
const line: 'line' = 'line';
const pie: 'pie' = 'pie';

const CHART_TYPES = {
	bar,
	donut,
	line,
	pie
};

const bottom: 'bottom' = 'bottom';
const left: 'left' = 'left';
const right: 'right' = 'right';
const top: 'top' = 'top';

const LEGEND_POSITIONS = {
	bottom,
	left,
	right,
	top
};

const BLOCK: 'BLOCK' = 'BLOCK';
const INLINE: 'INLINE' = 'INLINE';

const LEGEND_DISPLAY_TYPES = {
	BLOCK,
	INLINE
};

const DEFAULT_COLORS = [
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

const DEFAULT_DATA_LABEL_COLOR = '#323232';

const DEFAULT_CHART_SETTINGS: DefaultChartSettings = {
	axis: {
		show: true,
		showName: false
	},
	dataLabels: {
		disabled: false,
		fontColor: DEFAULT_DATA_LABEL_COLOR,
		fontFamily: FONT_FAMILIES[0],
		fontSize: 14,
		show: true,
		showShadow: false
	},
	legend: {
		displayType: LEGEND_DISPLAY_TYPES.BLOCK,
		fontFamily: FONT_FAMILIES[0],
		fontSize: 14,
		position: LEGEND_POSITIONS.right,
		show: false,
		textHandler: TEXT_HANDLERS.CROP
	}
};

const LOCALES = [{
	name: 'ru',
	options: {
		days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
		months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		shortDays: ['Вос', 'Пон', 'Вт', 'Ср', 'Чет', 'Пят', 'Сб'],
		shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноб', 'Дек'],
		toolbar: {
			download: 'Download SVG',
			pan: 'Перемещение по оси',
			reset: 'Масштаб по умолчанию',
			selectionZoom: 'Выделение области',
			zoomIn: 'Увеличить',
			zoomOut: 'Уменьшить'
		}
	}
}];

const DEFAULT_Y_AXIS_MIN = 0;

const AXIS_FONT_SIZE = 12;

const LEGEND_HEIGHT = 100;

const START: 'start' = 'start';
const MIDDLE: 'middle' = 'middle';
const END: 'end' = 'end';

const DATA_LABELS_TEXT_ANCHOR = {
	END,
	MIDDLE,
	START
};

const ANNOTATION_POINT = {
	label: {
		borderWidth: 0,
		offsetY: 0,
		style: {
			backgroud: 'transparent'
		},
		textAnchor: 'middle'
	},
	marker: {
		size: 0
	}
};

export {
	ANNOTATION_POINT,
	AXIS_FONT_SIZE,
	CHART_TYPES,
	DATA_LABELS_TEXT_ANCHOR,
	DEFAULT_COLORS,
	DEFAULT_CHART_SETTINGS,
	DEFAULT_DATA_LABEL_COLOR,
	DEFAULT_Y_AXIS_MIN,
	LEGEND_DISPLAY_TYPES,
	LEGEND_HEIGHT,
	LEGEND_POSITIONS,
	LOCALES
};
