// @flow
import {AXIS_FONT_SIZE, DEFAULT_Y_AXIS_MIN} from 'utils/chart/constants';
import type {ComboData, ComboWidget} from 'store/widgets/data/types';
import type {ComboNumberFormatter, ComboValueFormatter} from './formater/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getComboFormatter} from 'utils/chart/mixins/formater';
import {
	getLegendOptions,
	getMaxStackedValue,
	getMaxValue,
	getNiceScale,
	getXAxisOptions
} from './helpers';
import type {Options} from 'utils/chart/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Устанавливает настройки оси Y
 *
 * @param {Options} options - опции графика
 * @param {ComboWidget} widget - виджет
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {ComboData} dataSet - набор данных виджета, относительно которого настраивается ось
 * @param {number} index - индекс набора данных виджета
 * @param {boolean} forceHide - указывает на необходимость скрывать ось.
 * @param {ComboNumberFormatter} indicatorFormatter - форматер для значений на оси
 * @param {ComboValueFormatter} tooltipFormatter - форматер значений индикаторов для подсказки
 * @returns {Options}
 */
const setYAxis = (
	options: Options,
	widget: ComboWidget,
	chart: DiagramBuildData,
	dataSet: ComboData,
	index: number,
	forceHide: boolean,
	indicatorFormatter: ComboNumberFormatter | ComboValueFormatter,
	tooltipFormatter: ComboNumberFormatter | ComboValueFormatter
): Options => {
	const {colorsSettings, indicator} = widget;
	const {series} = chart;
	const {dataKey, type, yAxisName: name} = dataSet;
	const color = colorsSettings.auto.colors[index];
	const stacked = type === WIDGET_TYPES.COLUMN_STACKED;
	let {max, min = DEFAULT_Y_AXIS_MIN, show, showName, fontSize, fontFamily} = indicator;
	let maxValue;

	if (widget.indicator.showDependent) {
		maxValue = getMaxValue(series, stacked);
	} else if (stacked) {
		maxValue = getMaxStackedValue(series);
	}

	if (min) {
		min = Number(min);
	}

	if (max) {
		max = Number(max);
	} else if (maxValue) {
		/**
		 * Множитель для увеличения значения от максимального. Необходим для корректной отрисовки элементов, что находятся
		 * чуть выше максимального значения.
		 * @type {number}
		 */
		const increasingFactor = 1.25;

		max = getNiceScale(maxValue) * increasingFactor;
	}

	const ctx = {seriesIndex: index, w: {config: {series}}};
	const bindIndicatorFormatter = val => indicatorFormatter(val, ctx);

	const yaxis = {
		axisBorder: {
			color,
			show: true
		},
		axisTicks: {
			show: true
		},
		forceNiceScale: true,
		labels: {
			formatter: bindIndicatorFormatter,
			maxWidth: 140,
			style: {
				colors: color,
				fontFamily,
				fontSize: fontSize ?? AXIS_FONT_SIZE
			}
		},
		max,
		min,
		opposite: index > 0,
		seriesName: dataKey,
		show: !forceHide && show,
		title: {
			style: {
				color
			},
			text: showName ? name : undefined
		}
	};

	const yTooltip = {
		formatter: indicatorFormatter,
		title: {
			formatter: tooltipFormatter
		}
	};

	return {
		...options,
		chart: {
			...options.chart,
			stacked: options.chart.stacked || stacked
		},
		tooltip: {
			...options.tooltip,
			y: [...options.tooltip.y, yTooltip]
		},
		yaxis: [...options.yaxis, yaxis]
	};
};

/**
 * Устанавливает настройки осей Y относительно каждого объекта данных series
 *
 * @param {Options} options - опции графика
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {ComboNumberFormatter} indicatorFormatter - форматер для значений на оси
 * @param {ComboValueFormatter} tooltipFormatter - форматер значений индикаторов для подсказки
 * @returns {Options}
 */
const setYAxises = (
	options: Options,
	widget: ComboWidget,
	chart: DiagramBuildData,
	indicatorFormatter: ComboNumberFormatter | ComboValueFormatter,
	tooltipFormatter: ComboNumberFormatter | ComboValueFormatter
): Options => {
	const usedDataKeys = [];
	let extendedOptions = options;

	chart.series.forEach((s, i) => {
		const {dataKey} = s;
		const dataSet = widget.data.find(dataSet => dataSet.dataKey === dataKey);

		if (dataSet) {
			/**
			 * Настройка осей идет относительно объектов series, но на графике должно отображаться количество осей относительно
			 * количества источников (в случае разбивки на 1 источник приходит n-е количество данных series). По этому ось
			 * отрисовывается только относительно первого набора значений разбивки. Остальные оси разбивки по источнику скрываются.
			 * @type {boolean}
			 */
			let forceHide = false;

			if (usedDataKeys.includes(dataKey)) {
				forceHide = true;
			} else {
				usedDataKeys.push(dataKey);
			}

			extendedOptions = setYAxis(extendedOptions, widget, chart, dataSet, i, forceHide, indicatorFormatter, tooltipFormatter);
		}
	});

	return extendedOptions;
};

/**
 * Примесь combo-графиков
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} data - данные конкретного графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {Options}
 */
export const comboMixin = (widget: ComboWidget, data: DiagramBuildData, container: HTMLDivElement): Options => {
	const {legend, parameter} = widget;
	const {labels, series} = data;
	const buildDataSet = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getComboFormatter(widget, labels, container);
		const {hasOverlappedLabel} = formatter.options;
		const strokeWidth = series.find(dataSet => dataSet.type.toUpperCase() === WIDGET_TYPES.LINE) ? 4 : 0;
		const {xAxisName} = buildDataSet;
		const xAxisProps = {...parameter, name: xAxisName};

		const xaxis = {
			labels: {
				formatter: formatter.parameter.overlapped,
				style: {
					fontFamily: xAxisProps.fontFamily,
					fontSize: xAxisProps.fontSize ?? AXIS_FONT_SIZE
				}
			},
			tickPlacement: 'between'
		};

		let options = {
			chart: {
				stacked: false
			},
			dataLabels: {
				formatter: formatter.dataLabel
			},
			labels: labels,
			legend: getLegendOptions(legend, container, formatter.legend.cropped),
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
				shared: false,
				x: {
					formatter: formatter.tooltip.title
				},
				y: []
			},
			xaxis: extend(xaxis, getXAxisOptions(xAxisProps, hasOverlappedLabel)),
			yaxis: []
		};

		options = setYAxises(options, widget, data, formatter.tooltip.data, formatter.tooltip.title);

		return options;
	}
};

export default comboMixin;
