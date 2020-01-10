// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {CHART_TYPES, CHART_VARIANTS, LEGEND_POSITIONS} from './constants';
import {createOrdinalName, getMainOrdinalNumber} from 'utils/widget';
import {DEFAULT_AGGREGATION} from 'components/molecules/AttributeRefInput/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDownBySelection} from './methods';
import {FIELDS, VALUES} from 'components/organisms/WidgetFormPanel';
import type {Widget} from 'store/widgets/data/types';

/**
 * Функция проверяет является ли переменная объектом
 * @param {any} item - проверяемая переменная
 * @returns {boolean}
 */
const isObject = (item: any): boolean => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Функция проверяет имеет ли виджета устаревший формат
 * @param {Widget} widget - данные виджета
 * @returns {boolean}
 */
const hasLegacyFormat = (widget: Widget) => !Array.isArray(widget.order);

/**
 * Функция расширяет опции графика
 * @param {ApexOptions} target - основной объект опций
 * @param {ApexOptions} source - дополнительная примесь опций
 * @returns {ApexOptions}
 */
const extend = (target: ApexOptions, source: ApexOptions): ApexOptions => {
	let output = {...target};

	if (isObject(target) && isObject(source)) {
		Object.keys(source).forEach(key => {
			if (isObject(source[key])) {
				if (!(key in target)) {
					output = {...output, [key]: source[key]};
				} else {
					output[key] = extend(target[key], source[key]);
				}
			} else {
				output = {...output, [key]: source[key]};
			}
		});
	}

	return output;
};

/**
 * Функция возвращает title атрибута с учетом вложенности
 * @param {Attribute} attr - атрибут
 * @returns {string}
 */
const getAttrTitle = (attr: Attribute) => {
	let current = attr;

	while (current.ref) {
		current = current.ref;
	}

	return current.title;
};

const yAxisLabelFormatter = (horizontal: boolean) => (val: number, options: any) => {
	/**
	 * toFixed необходимо использовать только для значений оси Y. Но т.к в библиотеке можно указать только одну
	 * функцию форматирования значений, необходимо ориентироваться по параметру options. Только в случае когда функция
	 * используется для значения оси, options - object.
	 */

	if (typeof options === 'object' && !horizontal && typeof val === 'number') {
		return val.toFixed();
	} else if (typeof val === 'string' && val.length > 25) {
		return `${val.substring(0, 20)}...`;
	}

	return val;
};

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisChart = (horizontal: boolean = false, stacked: boolean = false) => (widget: Widget, chart: DiagramBuildData): ApexOptions => {
	const {showXAxis, showYAxis, type} = widget;
	let {aggregation: aggregationName, xAxis: xAxisName, yAxis: yAxisName} = FIELDS;

	if (!hasLegacyFormat(widget)) {
		const mainNumber = getMainOrdinalNumber(widget);
		aggregationName = createOrdinalName(FIELDS.aggregation, mainNumber);
		xAxisName = createOrdinalName(FIELDS.xAxis, mainNumber);
		yAxisName = createOrdinalName(FIELDS.yAxis, mainNumber);
	}

	const aggregation = widget[aggregationName];
	const xAxis = widget[xAxisName];
	const yAxis = widget[yAxisName];
	const stackedIsPercent = stacked && aggregation === DEFAULT_AGGREGATION.PERCENT;
	const strokeWidth = type === CHART_VARIANTS.LINE ? 4 : 0;
	let xAxisAttr = horizontal ? yAxis : xAxis;
	let yAxisAttr = horizontal ? xAxis : yAxis;

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
		xaxis: {
			categories: chart.categories
		},
		yaxis: {
			decimalsInFloat: 2,
			forceNiceScale: !stackedIsPercent,
			labels: {
				formatter: yAxisLabelFormatter(horizontal),
				// Если проставить значение, то уплывает название оси на легенду
				maxWidth: undefined
			},
			max: (max: number) => max > 0 ? Math.ceil(max) : 1,
			min: 0,
			tickAmount: 1
		}
	};

	if (!stacked) {
		options.dataLabels = {
				formatter: (val: number) => val > 0 ? val.toFixed() : ''
		};
	}

	if (aggregation === DEFAULT_AGGREGATION.PERCENT) {
		if (stacked) {
			options.chart.stackType = '100%';
		} else {
			/*
			 * Условие стоит, т.к функция форматирования применяется как для значений диаграмм, так и для значений оси Y;
			 * В случае когда options - объект, это значение оси Y.
 			 */
			options.yaxis.labels = {
				formatter: (val: number, options: any) => typeof val === 'string' || typeof options !== 'object' ? val : `${val.toFixed(2)}%`
			};

			options.dataLabels.formatter = (val: number) => val > 0 ? `${val.toFixed(2)}%` : '';
		}
	}

	if (showXAxis && xAxisAttr) {
		options.xaxis.title = {
			text: getAttrTitle(xAxisAttr)
		};
	}

	if (showYAxis && yAxisAttr) {
		options.yaxis.title = {
			text: getAttrTitle(yAxisAttr)
		};
	}

	return options;
};

/**
 * Примесь combo-графиков
 * @param {Widget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const comboChart = (widget: Widget, chart: DiagramBuildData) => {
	const {series} = chart;
	const strokeWidth = series.find(s => s.type.toUpperCase() === CHART_VARIANTS.LINE) ? 4 : 0;
	let stacked = false;
	let percentDataKeys = [];

	if (Array.isArray(widget.order)) {
		widget.order.filter(number => !widget[createOrdinalName(FIELDS.sourceForCompute, number)])
			.forEach(number => {
				const aggregation = widget[createOrdinalName(FIELDS.aggregation, number)];
				const type = widget[createOrdinalName(FIELDS.type, number)];

				if (!stacked && type.value === CHART_VARIANTS.COLUMN_STACKED) {
					stacked = true;
				}

				if (aggregation && aggregation.value === DEFAULT_AGGREGATION.PERCENT) {
					percentDataKeys.push(widget[createOrdinalName(FIELDS.dataKey, number)]);
				}
			});
	}

	const options: ApexOptions = {
		chart: {
			stacked
		},
		dataLabels: {
			formatter: (val: number) => val > 0 ? val : ''
		},
		labels: chart.labels,
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
		yaxis: {
			decimalsInFloat: 2,
			forceNiceScale: true,
			labels: {
				formatter: yAxisLabelFormatter(false)
			},
			max: (max: number) => max > 0 ? Math.ceil(max) : 1,
			min: 0,
			tickAmount: 1
		}
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
 * @param {Widget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const circleChart = (widget: Widget, chart: DiagramBuildData): ApexOptions => {
	const aggregationName = hasLegacyFormat(widget) ? FIELDS.aggregation : createOrdinalName(FIELDS.aggregation, getMainOrdinalNumber(widget));
	const aggregation = widget[aggregationName];

	const options: Object = {
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
};

/**
 * Функция возвращает примесь опций в зависимости от переданного типа графика
 * @param {string} type - тип графика выбранный пользователем
 * @returns {Function}
 */
const resolveMixin = (type: string): Function => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;

	const charts = {
		[BAR]: axisChart(true),
		[BAR_STACKED]: axisChart(true, true),
		[COLUMN]: axisChart(false),
		[COLUMN_STACKED]: axisChart(false, true),
		[COMBO]: comboChart,
		[DONUT]: circleChart,
		[LINE]: axisChart(false),
		[PIE]: circleChart
	};

	return charts[type];
};

/**
 * Функция возвращет объединенный набор базовых и типовых опций
 * @param {Widget} widget - виджет
 * @param {DiagramBuildData} chart - данные графика виджета
 * @param {number} width - ширина графика
 * @returns {ApexOptions}
 */
const getOptions = (widget: Widget, chart: DiagramBuildData, width: number): ApexOptions => {
	const {colors, legendPosition, showLegend, showValue, type} = widget;
	const chartColors = colors || VALUES.COLORS;
	const legendPositionValue = getLegendPositionValue(legendPosition);

	const options: ApexOptions = {
		chart: {
			background: 'white',
			animations: {
				enabled: false
			},
			height: '100%',
			events: {
				dataPointSelection: drillDownBySelection(widget, chart)
			},
			toolbar: {
				show: false
			},
			type: type === CHART_VARIANTS.COMBO ? CHART_TYPES.line : getChartType(type),
			width: '100%'
		},
		colors: [...chartColors],
		dataLabels: {
			dropShadow: {
				blur: 0.5,
				enabled: true,
				left: 1,
				opacity: 0.9,
				top: 1
			},
			enabled: showValue,
			style: {
				colors: ['white']
			}
		},
		legend: {
			itemMargin: {
				horizontal: 5
			},
			position: legendPositionValue,
			show: showLegend,
			showForSingleSeries: true
		},
		series: getSeries(widget, chart)
	};

	if (legendPositionValue === LEGEND_POSITIONS.left || legendPositionValue === LEGEND_POSITIONS.right) {
		options.legend.width = getLegendWidth(width);
	} else {
		options.legend.height = 100;
	}

	return extend(options, resolveMixin(widget.type)(widget, chart));
};

/**
 * Функция преобразует набор данных в требуемый формат
 * @param {Widget} widget - виджет
 * @param {DiagramBuildData} chart - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Widget, chart: DiagramBuildData): ApexAxisChartSeries => {
	const {series} = chart;

	if (widget.type === CHART_VARIANTS.COMBO && series.length > 0) {
		series.forEach(s => {
			s.type = s.type.toUpperCase() === CHART_VARIANTS.LINE ? CHART_TYPES.line : CHART_TYPES.bar;
		});
	}

	return series;
};

const getChartType = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {bar, donut, line, pie} = CHART_TYPES;

	const types = {
		[BAR]: bar,
		[BAR_STACKED]: bar,
		[COLUMN]: bar,
		[COLUMN_STACKED]: bar,
		[DONUT]: donut,
		[LINE]: line,
		[PIE]: pie
	};

	return types[type];
};

/**
 * Получаем ширину легенды относительно общей ширины графика
 * @param {number} width - ширина графика
 * @returns {number}
 */
const getLegendWidth = (width: number) => width * 0.2;

const getLegendPositionValue = (legendPosition?: Object) => (legendPosition && legendPosition.value) || LEGEND_POSITIONS.bottom;

export {
	getChartType,
	getLegendWidth,
	getOptions
};
