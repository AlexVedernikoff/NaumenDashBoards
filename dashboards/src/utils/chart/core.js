// @flow
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import type {
	AxisIndicator,
	AxisParameter,
	AxisWidget,
	Chart,
	CircleWidget,
	ComboWidget,
	DataLabels,
	Legend
} from 'store/widgets/data/types';
import {CHART_TYPES, DEFAULT_COLORS, LEGEND_POSITIONS} from './constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDownBySelection} from './methods';
import {extend} from 'src/helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {TEXT_HANDLERS, WIDGET_TYPES} from 'store/widgets/data/constants';

const yAxisLabelFormatter = (showPercent: boolean) => (val: number | string, param?: Object | number) => {
	/**
	 * toFixed необходимо использовать только для значений оси Y. Но т.к в библиотеке можно указать только одну
	 * функцию форматирования значений, необходимо ориентироваться по параметру param. Только в случае когда функция
	 * используется для значения оси, param - не undefined.
	 */
	if (param && typeof val === 'number') {
		if (!Number.isInteger(val)) {
			val = val.toFixed(2);
		}

		if (showPercent) {
			val = `${val}%`;
		}
	}

	if (typeof val === 'string' && val.length > 25) {
		val = `${val.substring(0, 20)}...`;
	}

	return val;
};

const getXAxisOptions = (parameter: AxisParameter, categories: Array<string> = []) => {
	const {name, show, showName} = parameter;

	const options: Object = {
		categories,
		labels: {
			hideOverlappingLabels: true,
			rotate: -60,
			show
		},
		title: {
			offsetY: 10
		}
	};

	if (showName) {
		options.title.text = name;
	}

	return options;
};

const getYAxisOptions = (indicator: AxisIndicator, stacked: boolean, aggregation?: string) => {
	const {max, min, name, show, showName, tickAmount} = indicator;
	const forceNiceScale = !(stacked && aggregation === DEFAULT_AGGREGATION.PERCENT);
	const showPercent = aggregation === DEFAULT_AGGREGATION.PERCENT && !stacked;

	const options: Object = {
		decimalsInFloat: 2,
		forceNiceScale,
		labels: {
			formatter: yAxisLabelFormatter(showPercent),
			// Если проставить значение, то уплывает название оси на легенду
			maxWidth: undefined
		},
		max: (currentMax: number) => {
			if (max) {
				currentMax = Number(max);
			}

			if (min && min > currentMax) {
				currentMax = min + 1;
			}

			return currentMax > 0 ? Math.ceil(currentMax) : 1;
		},
		min: Number(min) || 0,
		show,
		tickAmount: tickAmount || 1
	};

	if (showName) {
		options.title = {
			text: name
		};
	}

	return options;
};

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const createAxisMixin = (horizontal: boolean = false, stacked: boolean = false) => (widget: AxisWidget, chart: DiagramBuildData): ApexOptions => {
	const {indicator, parameter, type} = widget;
	const set = getBuildSet(widget);
	let {tickAmount: yTickAmount} = indicator;

	if (set && !set.sourceForCompute) {
		const {aggregation} = set;
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;

		const options: ApexOptions = {
			chart: {
				stacked
			},
			markers: {
				hover: {
					size: 8
				},
				size: 5
			},
			plotOptions: {
				bar: {
					horizontal
				}
			},
			stroke: {
				width: strokeWidth
			},
			tooltip: {
				intersect: true,
				shared: false
			},
			xaxis: getXAxisOptions(parameter, chart.categories),
			yaxis: getYAxisOptions(indicator, stacked, aggregation)
		};

		if (horizontal) {
			options.xaxis.tickAmount = yTickAmount;
		}

		if (aggregation === DEFAULT_AGGREGATION.PERCENT) {
			if (stacked) {
				options.chart.stackType = '100%';
			} else {
				options.dataLabels = {
					formatter: (val: number) => val > 0 ? `${val.toFixed(2)}%` : ''
				};
			}
		}

		return options;
	}
};

/**
 * Примесь combo-графиков
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const createComboMixin = (widget: ComboWidget, chart: DiagramBuildData) => {
	const {indicator, parameter} = widget;
	const {labels, series} = chart;
	const strokeWidth = series.find(s => s.type.toUpperCase() === WIDGET_TYPES.LINE) ? 4 : 0;
	let stacked = false;
	let percentDataKeys = [];

	widget.data.forEach(set => {
		if (!set.sourceForCompute) {
			const {aggregation, type} = set;

			if (!stacked && type === WIDGET_TYPES.COLUMN_STACKED) {
				stacked = true;
			}

			if (aggregation && aggregation === DEFAULT_AGGREGATION.PERCENT) {
				percentDataKeys.push(set.dataKey);
			}
		}
	});

	const options: ApexOptions = {
		chart: {
			stacked
		},
		dataLabels: {
			formatter: (val: number) => val > 0 ? val : ''
		},
		labels,
		markers: {
			hover: {
				size: 8
			},
			size: 5
		},
		stroke: {
			width: strokeWidth
		},
		tooltip: {
			intersect: true,
			shared: false
		},
		xaxis: getXAxisOptions(parameter),
		yaxis: getYAxisOptions(indicator, stacked)
	};

	if (percentDataKeys.length > 0) {
		options.dataLabels.formatter = (val: number, {seriesIndex}: any) => {
			if (val === 0) {
				return '';
			}

			return percentDataKeys.includes(series[seriesIndex].dataKey) ? `${val.toFixed(2)}%` : val;
		};
	}

	return options;
};

/**
 * Примесь круговых графиков (pie, donut)
 * @param {CircleWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const createCircleMixin = (widget: CircleWidget, chart: DiagramBuildData): ApexOptions => {
	const set = getBuildSet(widget);

	if (set && !set.sourceForCompute) {
		const {aggregation} = set;
		const options: ApexOptions = {
			labels: chart.labels
		};

		if (aggregation !== DEFAULT_AGGREGATION.PERCENT) {
			options.dataLabels = {
				formatter: function (val, options) {
					return options.w.config.series[options.seriesIndex];
				}
			};
		}

		return options;
	}
};

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
			return createAxisMixin(true)(widget, data);
		case BAR_STACKED:
			return createAxisMixin(true, true)(widget, data);
		case COLUMN:
			return createAxisMixin(false)(widget, data);
		case COLUMN_STACKED:
			return createAxisMixin(false, true)(widget, data);
		case COMBO:
			return createComboMixin(widget, data);
		case DONUT:
		case PIE:
			return createCircleMixin(widget, data);
		case LINE:
			return createAxisMixin(false)(widget, data);
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

	const options: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			background: 'white',
			events: {
				dataPointSelection: drillDownBySelection(widget, data)
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
