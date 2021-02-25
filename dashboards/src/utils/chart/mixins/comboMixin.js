// @flow
import type {ApexOptions} from 'apexcharts';
import {
	axisLabelFormatter,
	checkLabelsForOverlap,
	getLegendOptions,
	getMaxStackedValue,
	getMaxValue,
	getNiceScale,
	getXAxisLabels,
	getXAxisOptions,
	valueFormatter
} from './helpers';
import type {ComboData, ComboWidget} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_Y_AXIS_MIN} from 'utils/chart/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const dataLabelsFormatter = (widget: ComboWidget, showZero: boolean) => (value: number, ctx: Object) => {
	const {seriesIndex, w} = ctx;
	const {series} = w.config;

	const buildDataSet = widget.data.find(dataSet => dataSet.dataKey === series[seriesIndex].dataKey);
	let formattedValue = value;

	if (buildDataSet) {
		const indicator = buildDataSet.indicators[0];
		const {aggregation, attribute} = indicator;
		const usesMSInterval = hasMSInterval(attribute, aggregation);
		const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
		formattedValue = valueFormatter(usesMSInterval, usesPercent, showZero)(value);
	}

	return formattedValue;
};

/**
 * Устанавливает настройки оси Y
 * @param {ApexOptions} options - опции графика
 * @param {ComboWidget} widget - виджет
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {ComboData} dataSet - набор данных виджета, относительно которого настраивается ось
 * @param {number} index - индекс набора данных виджета
 * @param {boolean} forceHide - указывает на необходимость скрывать ось.
 * @returns {ApexOptions}
 */
const setYAxis = (options: ApexOptions, widget: ComboWidget, chart: DiagramBuildData, dataSet: ComboData, index: number, forceHide: boolean): ApexOptions => {
	const {colors, indicator} = widget;
	const {series} = chart;
	const {breakdown, dataKey, indicators, showEmptyData, type, yAxisName: name} = dataSet;
	const {aggregation, attribute} = indicators[0];
	const usesMSInterval = hasMSInterval(attribute, aggregation);
	const usesPercent = hasPercent(attribute, aggregation);
	const usesUUIDs = Array.isArray(breakdown) && hasUUIDsInLabels(breakdown[0].attribute);
	const color = colors[index];
	const stacked = type === WIDGET_TYPES.COLUMN_STACKED;
	let {max, min = DEFAULT_Y_AXIS_MIN, show, showName} = indicator;
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
			formatter: valueFormatter(usesMSInterval, usesPercent, showEmptyData),
			maxWidth: 140,
			style: {
				colors: color
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
		formatter: valueFormatter(usesMSInterval, usesPercent),
		title: {
			formatter: axisLabelFormatter(usesUUIDs)
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
 * @param {ApexOptions} options - опции графика
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const setYAxises = (options: ApexOptions, widget: ComboWidget, chart: DiagramBuildData): ApexOptions => {
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

			extendedOptions = setYAxis(extendedOptions, widget, chart, dataSet, i, forceHide);
		}
	});

	return extendedOptions;
};

/**
 * Примесь combo-графиков
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {ApexOptions}
 */
const comboMixin = (widget: ComboWidget, chart: DiagramBuildData, container: HTMLDivElement): ApexOptions => {
	const {legend, parameter} = widget;
	const {labels, series} = chart;
	const strokeWidth = series.find(dataSet => dataSet.type.toUpperCase() === WIDGET_TYPES.LINE) ? 4 : 0;
	const buildDataSet = getBuildSet(widget);
	const {showEmptyData, xAxisName} = buildDataSet;
	const xAxisProps = {
		...parameter,
		name: xAxisName
	};
	let parameterUsesUUIDs = false;
	let breakdownUsesUUIDs = false;

	widget.data.forEach(dataSet => {
		if (!dataSet.sourceForCompute) {
			const {breakdown, parameters} = dataSet;

			parameterUsesUUIDs = !parameterUsesUUIDs || hasUUIDsInLabels(parameters[0].attribute);

			if (breakdown) {
				breakdownUsesUUIDs = !breakdownUsesUUIDs || (!Array.isArray(breakdown) && hasUUIDsInLabels(breakdown.attribute));
			}
		}
	});

	const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend);
	const xaxis = {
		labels: {
			formatter: axisLabelFormatter(parameterUsesUUIDs)
		},
		tickPlacement: 'between'
	};

	let options = {
		chart: {
			stacked: false
		},
		dataLabels: {
			formatter: dataLabelsFormatter(widget, showEmptyData)
		},
		grid: {
			padding: {
				bottom: 20
			}
		},
		labels: getXAxisLabels(widget, labels, !hasOverlappedLabel),
		legend: getLegendOptions(legend, container, breakdownUsesUUIDs),
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
			y: []
		},
		xaxis: extend(xaxis, getXAxisOptions(xAxisProps, hasOverlappedLabel)),
		yaxis: []
	};

	options = setYAxises(options, widget, chart);

	return options;
};

export default comboMixin;
