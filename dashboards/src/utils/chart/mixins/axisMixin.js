// @flow
import type {ApexOptions} from 'apexcharts';
import {
	axisLabelFormatter,
	checkLabelsForOverlap,
	getLegendOptions,
	getXAxisLabels,
	getXAxisOptions,
	getYAxisOptions,
	valueFormatter
} from './helpers';
import type {AxisWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'DiagramWidgetEditForm';
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
	const {indicator, legend, parameter, type} = widget;
	const {categories: labels} = chart;
	const buildDataSet = getBuildSet(widget);

	if (buildDataSet) {
		const {showEmptyData} = buildDataSet;
		const parameterUsesUUIDs = hasUUIDsInLabels(buildDataSet, FIELDS.xAxis);
		const breakdownUsesUUIDs = hasUUIDsInLabels(buildDataSet, FIELDS.breakdown);
		const usesUUIDs = parameterUsesUUIDs || breakdownUsesUUIDs;
		const usesMSInterval = hasMSInterval(buildDataSet, FIELDS.yAxis);
		const usesPercent = hasPercent(buildDataSet, FIELDS.yAxis);
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		const xAxisSettings = horizontal ? indicator : parameter;
		const yAxisSettings = horizontal ? parameter : indicator;
		const hasOverlappedLabel = checkLabelsForOverlap(labels, container, legend, horizontal);

		let xaxis = {
			labels: {
				formatter: horizontal ? valueFormatter(usesMSInterval, usesPercent) : axisLabelFormatter(usesUUIDs)
			}
		};
		let yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? axisLabelFormatter(usesUUIDs) : valueFormatter(usesMSInterval, usesPercent)
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
			xaxis: extend(xaxis, getXAxisOptions(xAxisSettings, hasOverlappedLabel)),
			yaxis: extend(yaxis, getYAxisOptions(yAxisSettings))
		};
	}
};

export default axisMixin;
