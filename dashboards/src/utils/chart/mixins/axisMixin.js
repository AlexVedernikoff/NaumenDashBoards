// @flow
import type {ApexOptions} from 'apexcharts';
import {
	axisLabelFormatter,
	getLegendOptions,
	getMetaClassLabel,
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
import {hasMSInterval, hasMetaClass, hasPercent} from 'store/widgets/helpers';
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
	const {categories} = chart;
	const buildDataSet = getBuildSet(widget);

	if (buildDataSet) {
		const {showEmptyData} = buildDataSet;
		const parameterUsesMetaClass = hasMetaClass(buildDataSet, FIELDS.xAxis);
		const breakdownUsesMetaClass = hasMetaClass(buildDataSet, FIELDS.breakdown);
		const usesMSInterval = hasMSInterval(buildDataSet, FIELDS.yAxis);
		const usesPercent = hasPercent(buildDataSet, FIELDS.yAxis);
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		const xAxisSettings = horizontal ? indicator : parameter;
		const yAxisSettings = horizontal ? parameter : indicator;
		let xaxis = {
			categories: getXAxisLabels(widget, categories),
			labels: {
				formatter: horizontal ? valueFormatter(usesMSInterval, usesPercent) : axisLabelFormatter(parameterUsesMetaClass)
			}
		};
		let yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? axisLabelFormatter(parameterUsesMetaClass) : valueFormatter(usesMSInterval, usesPercent)
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
			legend: getLegendOptions(legend, container, breakdownUsesMetaClass),
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
						formatter: breakdownUsesMetaClass && getMetaClassLabel
					}
				}
			},
			xaxis: extend(xaxis, getXAxisOptions(xAxisSettings)),
			yaxis: extend(yaxis, getYAxisOptions(yAxisSettings))
		};
	}
};

export default axisMixin;
