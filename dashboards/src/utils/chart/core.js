// @flow
import type {DiagramData} from 'store/widgets/diagrams/types';
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import {CHART_TYPES, CHART_VARIANTS} from './constants';
import {DEFAULT_VARIANTS} from 'utils/aggregate/constansts';
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
 * @param {boolean} horizontal - данные конкретного графика
 * @returns {ApexOptions}
 */
const axisChart = (horizontal: boolean = false) => (chart: DiagramData): ApexOptions => {
	return {
		tooltip: {
			x: {
				show: false
			}
		},
		plotOptions: {
			bar: {
				horizontal
			}
		},
		xaxis: {
			categories: chart.categories
		}
	};
};

/**
 * Дефолтная примесь графиков (bar, line)
 * @param {boolean} horizontal - данные конкретного графика
 * @returns {ApexOptions}
 */
const stackedAxisChart = (horizontal: boolean = false) => (chart: DiagramData): ApexOptions => {
	return {
		tooltip: {
			x: {
				show: false
			},
			y: {
				show: false
			}
		},
		chart: {
			stacked: true,
			toolbar: {
				show: false
			},
			zoom: {
				enabled: true
			}
		},
		responsive: [{
			breakpoint: 480,
			options: {
				legend: {
					offsetX: -10,
					offsetY: 0,
					position: 'bottom'
				}
			}
		}],
		plotOptions: {
			bar: {
				horizontal
			}
		},
		xaxis: {
			categories: chart.categories
		},
		legend: {
			offsetY: 40,
			position: 'right'
		},
		fill: {
			opacity: 1
		}
	};
};

/**
 * Дефолтная примесь графиков (combo)
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const comboChart = (chart: DiagramData) => ({
		labels: chart.labels
});

/**
 * Дефолтная примесь графиков (pie, donut)
 * @param {DiagramData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const circleChart = (chart: DiagramData): ApexOptions => {
	return {
		labels: chart.labels
	};
};

/**
 * Получаем ф-цию для генерации необходимой примеси опций
 * @param {string} variant - тип графика выбранный пользователем
 * @returns {Function}
 */
const resolveMixin = (variant: string): Function => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;

	const variants = {
		[BAR]: axisChart(true),
		[BAR_STACKED]: stackedAxisChart(true),
		[COLUMN]: axisChart(false),
		[COLUMN_STACKED]: stackedAxisChart(false),
		[COMBO]: comboChart,
		[DONUT]: circleChart,
		[LINE]: axisChart(false),
		[PIE]: circleChart
	};

	return variants[variant];
};

/**
 * Генерируем базовый набор опций и объединяем с необходимой примесью
 * @param {Widget} widget - виджет
 * @param {DiagramData} chart - данные графика виджета
 * @returns {ApexOptions}
 */
const getOptions = (widget: Widget, chart: DiagramData): ApexOptions => {
	const options: ApexOptions = {
		chart: {
			toolbar: {
				show: false
			}
		},
		stroke: {
			curve: 'straight'
		},
		yaxis: {
			max: undefined,
			min: 0
		}
	};

	if (widget.isNameShown) {
		options.title = {
			offsetY: 10,
			text: widget.name
		};
	}

	if (widget.aggregate && widget.aggregate.value === DEFAULT_VARIANTS.PERCENT) {
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

	return extend(options, resolveMixin(widget.type.value)(chart));
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
