// @flow
import type {ApexOptions} from 'apexcharts';
import {axisLabelFormatter, getXAxisLabels, getXAxisOptions, getYAxisOptions, valueFormatter} from './helpers';
import type {ComboWidget} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const dataLabelsFormatter = (widget: ComboWidget, showZero: boolean) => (value: number, ctx: Object) => {
	const {seriesIndex, w} = ctx;
	const {series} = w.config;

	const set = widget.data.find(set => set.dataKey === series[seriesIndex].dataKey);
	let formattedValue = value;

	if (set && !set.sourceForCompute) {
		const {aggregation} = set;
		const usesMSInterval = hasMSInterval(set, FIELDS.yAxis);
		const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
		formattedValue = valueFormatter(usesMSInterval, usesPercent, showZero)(value);
	}

	return formattedValue;
};

const getYAxis = (set: Object, index: number, widget: Object) => {
	const {colors, indicator} = widget;
	const {aggregation, dataKey, source, yAxis} = set;
	const usesMSInterval = hasMSInterval(set, FIELDS.yAxis);
	const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
	const customOptions = getYAxisOptions(indicator);
	const {show} = customOptions;
	const color = colors[index];
	const text = `${getProcessedValue(yAxis, 'title')} (${source.label})`;
	let options = {
		axisBorder: {
			color,
			show: true
		},
		axisTicks: {
			show: true
		},
		labels: {
			formatter: valueFormatter(usesMSInterval, usesPercent),
			style: {
				colors: color
			}
		},
		seriesName: dataKey,
		show,
		title: {
			style: {
				color
			},
			text
		}
	};

	if (show) {
		options = {
			...extend(options, getYAxisOptions(indicator)),
			opposite: index > 0
		};
	}

	return options;
};

/**
 * Примесь combo-графиков
 * @param {ComboWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const comboMixin = (widget: ComboWidget, chart: DiagramBuildData): ApexOptions => {
	const {labels, series} = chart;
	const strokeWidth = series.find(s => s.type.toUpperCase() === WIDGET_TYPES.LINE) ? 4 : 0;
	const stacked = widget.data.findIndex(set => set.type && set.type === WIDGET_TYPES.COLUMN_STACKED) !== -1;

	const xaxis = {
		labels: {
			formatter: axisLabelFormatter
		}
	};

	return {
		chart: {
			stacked
		},
		dataLabels: {
			formatter: dataLabelsFormatter(widget, false)
		},
		grid: {
			padding: {
				bottom: 20
			}
		},
		labels: getXAxisLabels(widget, labels),
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
		xaxis: extend(xaxis, getXAxisOptions(widget)),
		yaxis: widget.data.filter(s => !s.sourceForCompute).map((s, i) => getYAxis(s, i, widget))
	};
};

export default comboMixin;
