// @flow
import type {ApexAxisChartSeries, ApexOptions} from 'apexcharts';
import type {Chart, ChartData} from 'store/widgets/charts/types';
import {CHART_VARIANTS} from './constansts';
import {DEFAULT_VARIANTS} from 'utils/aggregate/constansts';
import type {Widget} from 'store/widgets/data/types';

/**
 * Проверяем является ли переменная объектом
 * @param {any} item - проверяемая переменная
 * @returns {boolean}
 */
const isObject = (item: any): boolean => item && typeof item === 'object' && !Array.isArray(item);

/**
 * Проверяем есть ли в объекте данных графика, данные нужной оси. Если есть то возвращаем,
 * иначе возвращаем пустой массив
 * @param {?ChartData} data - объект данных графика
 * @param {string} key - ключ необходимой оси
 * @returns {Array<number>}
 */
const getAxisData = (data: ?ChartData, key: string): Array<number> => data && data[key] ? data[key] : [];

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
 * @param {Chart} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const defaultChart = (chart: Chart): ApexOptions => {
	return {
		tooltip: {
			x: {
				show: false
			}
		},
		xaxis: {
			categories: getAxisData(chart.data, 'xAxis')
		}
	};
};

/**
 * Получаем ф-цию для генерации необходимой примеси опций
 * @param {string} variant - тип графика выбранный пользователем
 * @returns {Function}
 */
const resolveMixin = (variant: string): Function => {
	const variants = {
		[CHART_VARIANTS.BAR]: defaultChart,
		[CHART_VARIANTS.LINE]: defaultChart
	};

	return variants[variant];
};

/**
 * Генерируем базовый набор опций и объединяем с необходимой примесью
 * @param {Widget} widget - виджет
 * @param {Chart} chart - данные графика виджета
 * @returns {ApexOptions}
 */
const getOptions = (widget: Widget, chart: Chart): ApexOptions => {
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

	if (widget.aggregate.value === DEFAULT_VARIANTS.PERCENT) {
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

	return extend(options, resolveMixin(widget.chart.value)(chart));
};

/**
 * Получаем набор данных по оси Y
 * @param {Widget} widget - виджет
 * @param {Chart} chart - данные графика виджета
 * @returns {ApexAxisChartSeries}
 */
const getSeries = (widget: Widget, chart: Chart): ApexAxisChartSeries => {
	return [
		{
			data: getAxisData(chart.data, 'yAxis'),
			name: widget.yAxis.title
		}
	];
};

/**
 * Генерируем опции и данные осей по данным виджета и графика.
 * @param {Widget} widget - виджет
 * @param {Chart} chart - данные графика виджета
 * @returns {{series: ApexAxisChartSeries, options: ApexOptions}}
 */
const getConfig = (widget: Widget, chart: Chart) => {
	const options = getOptions(widget, chart);
	const series = getSeries(widget, chart);

	return {
		options,
		series
	};
};

export default getConfig;
