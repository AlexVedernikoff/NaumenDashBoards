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
	getYAxisOptions,
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

const getYAxis = (dataSet: DataSet, index: number, widget: ComboWidget, maxValue?: number) => {
	const {colors, indicator} = widget;
	const {dataKey, showEmptyData, yAxisName: name} = dataSet;
	const usesMSInterval = hasMSInterval(dataSet, FIELDS.yAxis);
	const usesPercent = hasPercent(dataSet, FIELDS.yAxis);
	const color = colors[index];
	let {max, min = DEFAULT_Y_AXIS_MIN} = indicator;

	if (min) {
		min = Number(min);
	}

	if (max) {
		max = Number(max);
	} else if (maxValue) {
		max = getNiceScale(maxValue);
	}

	let options = {
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
			style: {
				colors: color
			}
		},
		max,
		min,
		opposite: index > 0,
		seriesName: dataKey,
		title: {
			style: {
				color
			}
		}
	};

	return extend(options, getYAxisOptions({...indicator, name}));
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

	if (buildDataSet) {
		parameterUsesUUIDs = hasUUIDsInLabels(buildDataSet, FIELDS.xAxis);
		breakdownUsesUUIDs = hasUUIDsInLabels(buildDataSet, FIELDS.breakdown);
	}

	if (widget.indicator.showDependent) {
		maxValue = getMaxValue(series);
	}

	const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend);
	const xaxis = {
		labels: {
			formatter: axisLabelFormatter(parameterUsesUUIDs)
		},
		tickPlacement: 'between'
	};

	return {
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
			shared: false
		},
		xaxis: extend(xaxis, getXAxisOptions(parameter, hasOverlappedLabel)),
		yaxis: widget.data
			.filter(dataSet => !dataSet.sourceForCompute)
			.map((dataSet, i) => getYAxis(dataSet, i, widget, maxValue))
	};
};

export default comboMixin;
