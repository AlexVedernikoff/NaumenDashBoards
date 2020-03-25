// @flow
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import type {Attribute} from 'store/sources/attributes/types';
import type {AxisWidget, Chart, CircleWidget, ComboWidget, MixedAttribute} from 'store/widgets/data/types';
import {CHART_TYPES, DEFAULT_COLORS, LEGEND_POSITIONS} from './constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {drillDownBySelection} from './methods';
import {getBuildSet} from 'store/widgets/data/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

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
const getAttrTitle = (attr: MixedAttribute) => {
	let current = attr;

	if (current.ref) {
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
const createAxisMixin = (horizontal: boolean = false, stacked: boolean = false) => (widget: AxisWidget, chart: DiagramBuildData): ApexOptions => {
	const {showXAxis, showYAxis, type} = widget;
	const set = getBuildSet(widget);

	if (set) {
		const {aggregation, xAxis, yAxis} = set;
		const stackedIsPercent = stacked && aggregation === DEFAULT_AGGREGATION.PERCENT;
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
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
				categories: chart.categories,
				labels: {
					hideOverlappingLabels: true,
					rotate: -60
				},
				title: {
					offsetY: 10
				}
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
			options.xaxis.title.text = getAttrTitle(xAxisAttr);
		}

		if (showYAxis && yAxisAttr) {
			options.yaxis.title = {
				text: getAttrTitle(yAxisAttr)
			};
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
	const {series} = chart;
	const strokeWidth = series.find(s => s.type.toUpperCase() === WIDGET_TYPES.LINE) ? 4 : 0;
	let stacked = false;
	let percentDataKeys = [];

	widget.data
		.filter(set => !set.sourceForCompute)
		.forEach(set => {
			const {aggregation, type} = set;

			if (!stacked && type === WIDGET_TYPES.COLUMN_STACKED) {
				stacked = true;
			}

			if (aggregation && aggregation === DEFAULT_AGGREGATION.PERCENT) {
				percentDataKeys.push(set.dataKey);
			}
		});

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
 * @param {CircleWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const createCircleMixin = (widget: CircleWidget, chart: DiagramBuildData): ApexOptions => {
	const set = getBuildSet(widget);

	if (set) {
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

/**
 * Функция возвращет объединенный набор базовых и типовых опций
 * @param {Chart} widget - виджет
 * @param {DiagramBuildData} data - данные графика виджета
 * @param {number} width - ширина графика
 * @returns {ApexOptions}
 */
const getOptions = (widget: Chart, data: DiagramBuildData, width: number): ApexOptions => {
	const {colors, legendPosition, showLegend, showValue, type} = widget;
	const chartColors = colors || DEFAULT_COLORS;

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
			position: legendPosition,
			show: showLegend,
			showForSingleSeries: true
		},
		series: getSeries(widget, data)
	};

	if (legendPosition === LEGEND_POSITIONS.left || legendPosition === LEGEND_POSITIONS.right) {
		options.legend.width = getLegendWidth(width);
	} else {
		options.legend.height = 100;
	}

	return extend(options, resolveMixin(widget, data));
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
	getLegendWidth,
	getOptions
};
