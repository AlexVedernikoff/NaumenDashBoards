// @flow
import type {DiagramData} from 'store/widgets/diagrams/types';
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {CHART_TYPES, CHART_VARIANTS} from './constants';
import {DEFAULT_VARIANTS} from 'utils/aggregate/constansts';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import type {Widget} from 'store/widgets/data/types';
import VALUES from 'components/organisms/WidgetFormPanel/constants/values';

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

	let options: ApexOptions = {
		chart: {
			stacked
		},
		plotOptions: {
			bar: {
				horizontal
			}
		},
		xaxis: {
			categories: chart.categories
		},
		yaxis: {
			max: undefined,
			min: 0
		}
	};

	if (aggregation && aggregation.value === DEFAULT_VARIANTS.PERCENT) {
		options.yaxis = {
			labels: {
				formatter: (val) => {
					return `${val}%`;
				}
			},
			max: 100,
			min: 0
		};
	}

	if (showXAxis && xAxis) {
		const mixin = {
			xaxis: {
				title: {
					text: xAxis.title
				}
			}
		};

		options = extend(options, mixin);
	}

	if (showYAxis && yAxis) {
		const mixin = {
			yaxis: {
				title: {
					text: yAxis.title
				}
			}
		};

		options = extend(options, mixin);
	}

	return options;
};

/**
 * Дефолтная примесь графиков (combo)
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const comboChart = (widget: Widget, chart: DiagramData) => ({
		labels: chart.labels
});

/**
 * Дефолтная примесь графиков (pie, donut)
 * @param {Widget} widget - данные виджета
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const circleChart = (widget: Widget, chart: DiagramData): ApexOptions => {
	return {
		labels: chart.labels
	};
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
	const {colors, diagramName, legendPosition, showLegend, showName, showValue} = widget;

	const options: ApexOptions = {
		chart: {
			toolbar: {
				show: false
			}
		},
		colors: colors || VALUES.COLORS,
		dataLabels: {
			enabled: showValue
		},
		legend: {
			position: legendPosition ? legendPosition.value : 'bottom',
			show: showLegend
		}
	};

	if (showName) {
		options.title = {
			text: diagramName
		};
	}

	return extend(options, resolveMixin(widget.type.value)(widget, chart));
};

/**
 * Получаем набор данных по оси Y
 * @param {Widget} widget - виджет
 * @param {DiagramData} chart - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Widget, chart: DiagramData): ApexAxisChartSeries => {
	return chart.series;
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
