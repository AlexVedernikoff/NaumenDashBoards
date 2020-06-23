// @flow
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {axisMixin, circleMixin, comboMixin} from './mixins';
import type {Chart, DataLabels, Legend} from 'store/widgets/data/types';
import {CHART_TYPES, DEFAULT_COLORS, LEGEND_POSITIONS} from './constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDownBySelection} from './methods';
import {extend} from 'src/helpers';
import {TEXT_HANDLERS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {usesUnsupportedDrillDownGroup} from 'store/widgets/helpers';

/**
 * Функция возвращает примесь опций в зависимости от переданного типа графика
 * @param {Chart} widget - тип графика выбранный пользователем
 * @param {DiagramBuildData} data - тип графика выбранный пользователем
 * @returns {Function}
 */
const resolveMixin = (widget: Chart, data: DiagramBuildData): Function => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = WIDGET_TYPES;

	switch (widget.type) {
		case BAR:
			return axisMixin(true)(widget, data);
		case BAR_STACKED:
			return axisMixin(true, true)(widget, data);
		case COLUMN:
			return axisMixin(false)(widget, data);
		case COLUMN_STACKED:
			return axisMixin(false, true)(widget, data);
		case COMBO:
			return comboMixin(widget, data);
		case DONUT:
		case PIE:
			return circleMixin(widget, data);
		case LINE:
			return axisMixin(false)(widget, data);
	}
};

const getLegendCroppingFormatter = (width: number, fontSize: number) => {
	const length = Math.round(width / fontSize);

	return function (legend: string) {
		if (legend) {
			return legend.length > length ? `${legend.substr(0, length)}...` : legend;
		}

		return '';
	};
};

const getLegendOptions = (settings: Legend, widgetWidth: number) => {
	const {fontFamily, fontSize, position, show, textHandler} = settings;
	const {bottom, top} = LEGEND_POSITIONS;
	const options = {
		fontFamily,
		fontSize,
		itemMargin: {
			horizontal: 5
		},
		position,
		show,
		showForSingleSeries: true
	};
	let formatter;
	let height;
	let width;

	if (position === bottom || position === top) {
		width = widgetWidth;
		height = 100;
	} else {
		width = getLegendWidth(widgetWidth);
	}

	if (textHandler === TEXT_HANDLERS.CROP) {
		formatter = getLegendCroppingFormatter(width, fontSize);
	}

	return {
		...options,
		formatter,
		height,
		width
	};
};

const getDataLabelsOptions = (settings: DataLabels) => {
	const {fontColor, fontFamily, fontSize, show, showShadow} = settings;
	const options: Object = {
		enabled: show,
		style: {
			colors: [fontColor],
			fontFamily,
			fontSize
		}
	};

	if (showShadow) {
		options.dropShadow = {
			blur: 0.5,
			enabled: true,
			left: 1,
			opacity: 0.9,
			top: 1
		};
	}

	return options;
};

/**
 * Функция преобразует набор данных в требуемый формат
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Chart, data: DiagramBuildData): ApexAxisChartSeries => {
	const {series} = data;

	if (widget.type === WIDGET_TYPES.COMBO && series.length > 0) {
		series.forEach(s => {
			s.type = s.type.toUpperCase() === WIDGET_TYPES.LINE ? CHART_TYPES.line : CHART_TYPES.bar;
		});
	}

	return series;
};

/**
 * Функция возвращет объединенный набор базовых и типовых опций
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @param {number} width - ширина графика
 * @returns {ApexOptions}
 */
const getOptions = (widget: Chart, data: DiagramBuildData, width: number): ApexOptions => {
	const {colors, type} = widget;
	const chartColors = colors || DEFAULT_COLORS;
	const {dataLabels, legend} = widget;
	const isSupportedDrillDown = !usesUnsupportedDrillDownGroup(widget);

	const options: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			background: 'white',
			events: {
				dataPointSelection: isSupportedDrillDown ? drillDownBySelection(widget, data) : undefined
			},
			height: '100%',
			toolbar: {
				show: false
			},
			type: type === WIDGET_TYPES.COMBO ? CHART_TYPES.line : getChartType(type),
			width: '100%'
		},
		colors: [...chartColors],
		dataLabels: getDataLabelsOptions(dataLabels),
		legend: getLegendOptions(legend, width),
		series: getSeries(widget, data)
	};

	return extend(options, resolveMixin(widget, data));
};

const getChartType = (type: string) => {
	const {DONUT, LINE, PIE} = WIDGET_TYPES;
	const {bar, donut, line, pie} = CHART_TYPES;

	switch (type) {
		case DONUT:
			return donut;
		case LINE:
			return line;
		case PIE:
			return pie;
		default:
			return bar;
	}
};

/**
 * Получаем ширину легенды относительно общей ширины графика
 * @param {number} width - ширина графика
 * @returns {number}
 */
const getLegendWidth = (width: number) => width * 0.2;

export {
	getChartType,
	getLegendCroppingFormatter,
	getLegendWidth,
	getOptions
};
