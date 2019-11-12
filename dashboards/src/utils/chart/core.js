// @flow
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {CHART_TYPES, CHART_VARIANTS} from './constants';
import {createOrderName} from 'utils/widget';
import type {DiagramData} from 'store/widgets/diagrams/types';
import {drillDownBySelection} from './methods';
import {FIELDS, VALUES} from 'components/organisms/WidgetFormPanel';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import type {Widget} from 'store/widgets/data/types';

/**
 * Проверяем является ли переменная объектом
 * @param {any} item - проверяемая переменная
 * @returns {boolean}
 */
const isObject = (item: any): boolean => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Расширяем опции графика, объединяя объекты
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
 * Дефолтная примесь графиков (bar, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisChart = (horizontal: boolean = false, stacked: boolean = false) => (widget: Widget, chart: DiagramData): ApexOptions => {
	const {aggregation, showXAxis, showYAxis, xAxis, yAxis} = widget;
	const stackedIsPercent = stacked && aggregation && aggregation.value === VALUES.DEFAULT_AGGREGATION.PERCENT;
	let xAxisAttr = horizontal ? yAxis : xAxis;
	let yAxisAttr = horizontal ? xAxis : yAxis;

	const options: ApexOptions = {
		chart: {
			stacked
		},
		dataLabels: {
			formatter: (val: number) => val > 0 ? val : ''
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
		tooltip: {
			intersect: true,
			shared: false
		},
		xaxis: {
			categories: chart.categories
		},
		yaxis: {
			forceNiceScale: !stackedIsPercent,
			max: undefined,
			min: 0
		}
	};

	if (aggregation && aggregation.value === VALUES.DEFAULT_AGGREGATION.PERCENT) {
		if (stacked) {
			options.chart.stackType = '100%';
		} else {
			/*
			 * Условие стоит, т.к функция форматирования применяется как для значений диаграмм, так и для значений оси Y;
			 * В случае когда opts - объект, это значение оси Y.
 			 */
			options.yaxis.labels = {
				formatter: (val: number, opts: any) => typeof opts !== 'object' ? val : `${val}%`
			};

			options.dataLabels.formatter = (val: number) => val > 0 ? `${val}%` : '';
		}
	}

	if (showXAxis && xAxisAttr) {
		options.xaxis.title = {
			text: xAxisAttr.title
		};
	}

	if (showYAxis && yAxisAttr) {
		options.yaxis.title = {
			text: yAxisAttr.title
		};
	}

	return options;
};

/**
 * Дефолтная примесь графиков (combo)
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const comboChart = (widget: Widget, chart: DiagramData) => {
	const {series} = chart;
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
		tooltip: {
			intersect: true,
			shared: false
		},
		yaxis: {
			forceNiceScale: true,
			max: undefined,
			min: 0
		}
	};

	if (percentDataKeys.length > 0) {
		options.dataLabels.formatter = (val: number, {seriesIndex}: any) => {
			if (val === 0) {
				return '';
			}

			return percentDataKeys.includes(series[seriesIndex].dataKey) ? `${val}%` : val;
		};
	}

	return options;
};

/**
 * Дефолтная примесь графиков (pie, donut)
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

	if (aggregation && aggregation.value !== VALUES.DEFAULT_AGGREGATION.PERCENT) {
		options.dataLabels = {
			formatter: function (val, opts) {
				return opts.w.config.series[opts.seriesIndex];
			}
		};
	}

	return options;
};

/**
 * Получаем ф-цию для генерации необходимой примеси опций
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
 * Генерируем базовый набор опций и объединяем с необходимой примесью
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
		},
		stroke: {
			width: 0
		}
	};

	return extend(options, resolveMixin(widget.type.value)(widget, chart));
};

/**
 * Получаем набор данных по оси Y
 * @param {Widget} widget - виджет
 * @param {DiagramData} chart - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Widget, chart: DiagramData): ApexAxisChartSeries => {
	const {series} = chart;

	if (widget.type.value === CHART_VARIANTS.COMBO && series.length > 0) {
		series.forEach(s => {
			s.type = s.type === CHART_VARIANTS.LINE || s.type === CHART_TYPES.line ? CHART_TYPES.line : CHART_TYPES.bar;
		});
	}

	return series;
};

/**
 * Генерируем опции и данные осей по данным виджета и графика.
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

/**
 * Проверяем относится ли переданый селект к круговым диаграммам
 * @param {SelectValue | null} chart - атрибут класса
 * @returns {boolean}
 */
const typeOfCircleCharts = (chart: SelectValue | null) => {
	const {PIE, DONUT} = CHART_VARIANTS;
	const circleVariants = [PIE, DONUT];

	return chart && circleVariants.includes(chart.value);
};

export {
	getChartType,
	getConfig,
	typeOfCircleCharts
};
