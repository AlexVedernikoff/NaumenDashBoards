// @flow
import type {ApexOptions} from 'apexcharts';
import {
	axisLabelFormatter,
	checkLabelsForOverlap,
	getLegendOptions,
	getMaxValue,
	getNiceScale,
	getXAxisLabels,
	getXAxisOptions,
	valueFormatter
} from './helpers';
import type {ComboWidget} from 'store/widgets/data/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_Y_AXIS_MIN} from 'utils/chart/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const dataLabelsFormatter = (widget: ComboWidget, showZero: boolean) => (value: number, ctx: Object) => {
	const {seriesIndex, w} = ctx;
	const {series} = w.config;

	const buildDataSet = widget.data.find(dataSet => dataSet.dataKey === series[seriesIndex].dataKey);
	let formattedValue = value;

	if (buildDataSet && !buildDataSet.sourceForCompute) {
		const {aggregation} = buildDataSet;
		const usesMSInterval = hasMSInterval(buildDataSet, FIELDS.yAxis);
		const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
		formattedValue = valueFormatter(usesMSInterval, usesPercent, showZero)(value);
	}

	return formattedValue;
};

/**
 * Устанавливает настройки оси Y
 * @param {ApexOptions} options - опции графика
 * @param {DataSet} dataSet - набор данных виджета, относительно которого настраивается ось
 * @param {number} index - индекс набора данных виджета
 * @param {ComboWidget} widget - виджет
 * @param {boolean} forceHide - указывает на необходимость скрывать ось.
 * @param {?number} maxValue - максимальное значение
 * @returns {ApexOptions}
 */
const setYAxis = (options: ApexOptions, dataSet: DataSet, index: number, widget: ComboWidget, forceHide: boolean, maxValue?: number): ApexOptions => {
	const {colors, indicator} = widget;
	const {breakdown, dataKey, showEmptyData, yAxisName: name} = dataSet;
	const usesMSInterval = hasMSInterval(dataSet, FIELDS.yAxis);
	const usesPercent = hasPercent(dataSet, FIELDS.yAxis);
	const usesUUIDs = !Array.isArray(breakdown) && hasUUIDsInLabels(breakdown);
	const color = colors[index];
	let {max, min = DEFAULT_Y_AXIS_MIN, show, showName} = indicator;

	if (min) {
		min = Number(min);
	}

	if (max) {
		max = Number(max);
	} else if (maxValue) {
		max = getNiceScale(maxValue);
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
 * @param {?number} maxValue - максимальное значение по оси
 * @returns {ApexOptions}
 */
const setYAxises = (options: ApexOptions, widget: ComboWidget, chart: DiagramBuildData, maxValue?: number): ApexOptions => {
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

			extendedOptions = setYAxis(extendedOptions, dataSet, i, widget, forceHide, maxValue);
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
	const stacked = widget.data.findIndex(dataSet => dataSet.type && dataSet.type === WIDGET_TYPES.COLUMN_STACKED) !== -1;
	const buildDataSet = getBuildSet(widget);
	const {showEmptyData} = buildDataSet;
	let parameterUsesUUIDs = false;
	let breakdownUsesUUIDs = false;
	let maxValue;

	widget.data.forEach(dataSet => {
		if (!dataSet.sourceForCompute) {
			const {breakdown, xAxis} = dataSet;

			parameterUsesUUIDs = !parameterUsesUUIDs || hasUUIDsInLabels(xAxis);
			breakdownUsesUUIDs = !breakdownUsesUUIDs || (!Array.isArray(breakdown) && hasUUIDsInLabels(breakdown));
		}
	});

	if (widget.indicator.showDependent || stacked) {
		maxValue = getMaxValue(series, stacked);
	}

	const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend);
	const xaxis = {
		labels: {
			formatter: axisLabelFormatter(parameterUsesUUIDs)
		},
		tickPlacement: 'between'
	};

	let options = {
		chart: {
			stacked
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
		xaxis: extend(xaxis, getXAxisOptions(parameter, hasOverlappedLabel)),
		yaxis: []
	};

	options = setYAxises(options, widget, chart, maxValue);

	return options;
};

export default comboMixin;
