// @flow
import type {AxisData, AxisWidget} from 'store/widgets/data/types';
import {
	axisLabelFormatter,
	checkLabelsForOverlap,
	formatLabels,
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
import type {Options} from 'utils/chart/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {Options}
 */
const axisMixin = (horizontal: boolean, stacked: boolean = false) =>
	(widget: AxisWidget, chart: DiagramBuildData, container: HTMLDivElement): Options => {
	const {indicator: indicatorSettings, legend, parameter, type} = widget;
	const {labels} = chart;
	const buildDataSet: AxisData = getBuildSet(widget);

	if (buildDataSet) {
		const {breakdown, indicators, parameters, showEmptyData, xAxisName, yAxisName} = buildDataSet;
		const {aggregation, attribute: indicatorAttribute} = indicators[0];
		const {attribute: parameterAttribute, group: parameterGroup} = parameters[0];
		const firstBreakdown = (Array.isArray(breakdown) && breakdown[0]) || {attribute: undefined, group: undefined};
		const {attribute: breakdownAttribute, group: breakdownGroup} = firstBreakdown;
		const parameterUsesUUIDs = hasUUIDsInLabels(parameterAttribute, parameterGroup);
		const breakdownUsesUUIDs = Array.isArray(breakdown) && hasUUIDsInLabels(breakdownAttribute, breakdownGroup);
		const usesUUIDs = parameterUsesUUIDs || breakdownUsesUUIDs;
		const usesMSInterval = hasMSInterval(indicatorAttribute, aggregation);
		const usesPercent = hasPercent(indicatorAttribute, aggregation);
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
		// TODO: SMRMEXT-12049 - убрать при реализации
		const labelsFormated = formatLabels(widget, labels);
		const hasOverlappedLabel = checkLabelsForOverlap(labelsFormated, container, legend, horizontal);

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
			labels: getXAxisLabels(labelsFormated, !hasOverlappedLabel),
			legend: getLegendOptions(legend, container),
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
