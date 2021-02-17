// @flow
import type {ApexOptions} from 'apexcharts';
import type {AxisData, AxisWidget} from 'store/widgets/data/types';
import {
	axisLabelFormatter,
	checkLabelsForOverlap,
	getLegendOptions,
	getXAxisLabels,
	getXAxisOptions,
	getYAxisOptions,
	valueFormatter
} from './helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisMixin = (horizontal: boolean, stacked: boolean = false) =>
	(widget: AxisWidget, chart: DiagramBuildData, container: HTMLDivElement): ApexOptions => {
	const {indicator: indicatorSettings, legend, parameter, type} = widget;
	const {labels} = chart;
	const buildDataSet: AxisData = getBuildSet(widget);

	if (buildDataSet) {
		const {breakdown, indicators, parameters, showEmptyData, xAxisName, yAxisName} = buildDataSet;
		const {aggregation, attribute} = indicators[0];
		const parameterUsesUUIDs = hasUUIDsInLabels(parameters[0].attribute);
		const breakdownUsesUUIDs = !!breakdown && !Array.isArray(breakdown) && hasUUIDsInLabels(breakdown.attribute);
		const usesUUIDs = parameterUsesUUIDs || breakdownUsesUUIDs;
		const usesMSInterval = hasMSInterval(attribute, aggregation);
		const usesPercent = hasPercent(attribute, aggregation);
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		const xAxisSettings = {
			...parameter,
			name: xAxisName
		};
		const yAxisSettings = {
			...indicatorSettings,
			name: yAxisName
		};
		const xAxisProps = horizontal ? yAxisSettings : xAxisSettings;
		const yAxisProps = horizontal ? xAxisSettings : yAxisSettings;
		const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend, horizontal);

		let xaxis = {
			labels: {
				formatter: horizontal ? valueFormatter(usesMSInterval, usesPercent) : axisLabelFormatter(usesUUIDs)
			}
		};
		let yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? axisLabelFormatter(usesUUIDs) : valueFormatter(usesMSInterval, usesPercent),
				maxWidth: 140
			}
		};

		return {
			chart: {
				stackType,
				stacked
			},
			dataLabels: {
				formatter: valueFormatter(usesMSInterval, usesPercent, showEmptyData)
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
				shared: false,
				y: {
					formatter: valueFormatter(usesMSInterval, usesPercent && !stacked),
					title: {
						formatter: axisLabelFormatter(breakdownUsesUUIDs)
					}
				}
			},
			xaxis: extend(xaxis, getXAxisOptions(xAxisProps, hasOverlappedLabel)),
			yaxis: extend(yaxis, getYAxisOptions(yAxisProps))
		};
	}
};

export default axisMixin;
