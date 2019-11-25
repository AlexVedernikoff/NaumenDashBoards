// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {CHART_TYPES, CHART_VARIANTS} from './constants';
import {createOrderName} from 'utils/widget';
import type {DiagramData} from 'store/widgets/diagrams/types';
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

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisChart = (horizontal: boolean = false, stacked: boolean = false) => (widget: Widget, chart: DiagramData): ApexOptions => {
	const {aggregation, showXAxis, showYAxis, type, xAxis, yAxis} = widget;
	const stackedIsPercent = stacked && aggregation === VALUES.DEFAULT_AGGREGATION.PERCENT;
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
				formatter: (val: number, opts: any) => typeof opts === 'object' ? val.toFixed() : val
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

	if (aggregation === VALUES.DEFAULT_AGGREGATION.PERCENT) {
		if (stacked) {
			options.chart.stackType = '100%';
		} else {
			/*
			 * Условие стоит, т.к функция форматирования применяется как для значений диаграмм, так и для значений оси Y;
			 * В случае когда opts - объект, это значение оси Y.
 			 */
			options.yaxis.labels = {
				formatter: (val: number, opts: any) => typeof opts !== 'object' ? val : `${val.toFixed(2)}%`
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
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const comboChart = (widget: Widget, chart: DiagramData) => {
	const {series} = chart;
	const strokeWidth = series.find(s => s.type.toUpperCase() === CHART_VARIANTS.LINE) ? 4 : 0;
	let stacked = false;
	let percentDataKeys = [];

	if (Array.isArray(widget.order)) {
		widget.order.filter(num => !widget[createOrderName(num)(FIELDS.sourceForCompute)])
			.forEach(num => {
				const aggregation = widget[createOrderName(num)(FIELDS.aggregation)];
				const type = widget[createOrderName(num)(FIELDS.type)];

				if (!stacked && type.value === CHART_VARIANTS.COLUMN_STACKED) {
					stacked = true;
				}

				if (aggregation && aggregation.value === VALUES.DEFAULT_AGGREGATION.PERCENT) {
					percentDataKeys.push(widget[createOrderName(num)(FIELDS.dataKey)]);
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
				formatter: (val: number, opts: any) => typeof opts === 'object' ? val : val.toFixed()
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
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const circleChart = (widget: Widget, chart: DiagramData): ApexOptions => {
	const {aggregation} = widget;

	const options = {
		dataLabels: {},
		labels: chart.labels
	};

	if (aggregation !== VALUES.DEFAULT_AGGREGATION.PERCENT) {
		options.dataLabels = {
			formatter: function (val, opts) {
				return opts.w.config.series[opts.seriesIndex];
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
 * @param {DiagramData} chart - данные графика виджета
 * @returns {ApexOptions}
 */
const getOptions = (widget: Widget, chart: DiagramData): ApexOptions => {
	const {colors, legendPosition, showLegend, showValue} = widget;
	const chartColors = colors || VALUES.COLORS;

	const options: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			events: {
				dataPointSelection: drillDownBySelection(widget, chart)
			},
			toolbar: {
				show: false
			}
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
			position: legendPosition ? legendPosition.value : 'bottom',
			show: showLegend,
			showForSingleSeries: true
		}
	};

	return extend(options, resolveMixin(widget.type)(widget, chart));
};

/**
 * Функция преобразует набор данных в требуемый формат
 * @param {Widget} widget - виджет
 * @param {DiagramData} chart - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Widget, chart: DiagramData): ApexAxisChartSeries => {
	const {series} = chart;

	if (widget.type === CHART_VARIANTS.COMBO && series.length > 0) {
		series.forEach(s => {
			s.type = s.type.toUpperCase() === CHART_VARIANTS.LINE ? CHART_TYPES.line : CHART_TYPES.bar;
		});
	}

	return series;
};

/**
 * Функция генерирует опции и данные для построения графика.
 * @param {Widget} widget - виджет
 * @param {DiagramData} chart - данные графика виджета
 * @returns {{series: ApexAxisChartSeries, options: ApexOptions}}
 */
const getConfig = (widget: Widget, chart: DiagramData) => {
	const options = getOptions(widget, chart);
	const series = getSeries(widget, chart);

	return {
		options,
		series
	};
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

export {
	getChartType,
	getConfig
};
