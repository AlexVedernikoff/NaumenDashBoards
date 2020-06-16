// @flow
import type {ApexOptions} from 'apexcharts';
import {axisLabelFormatter, getXAxisOptions, getYAxisOptions, valueFormatter} from './helpers';
import type {AxisWidget} from 'store/widgets/data/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisMixin = (horizontal: boolean, stacked: boolean = false) => (widget: AxisWidget, chart: DiagramBuildData): ApexOptions => {
	const {indicator, parameter, type} = widget;
	const {categories} = chart;
	const set = getBuildSet(widget);

	if (set && !set.sourceForCompute) {
		const {aggregation} = set;
		const usesMSInterval = hasMSInterval(set, FIELDS.yAxis);
		const usesPercent = aggregation === DEFAULT_AGGREGATION.PERCENT;
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		const xaxis = {
			categories,
			labels: {
				formatter: horizontal ? valueFormatter(usesMSInterval, usesPercent) : axisLabelFormatter
			}
		};
		const yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? axisLabelFormatter : valueFormatter(usesMSInterval, usesPercent)
			}
		};

		return {
			chart: {
				stackType,
				stacked
			},
			dataLabels: {
				formatter: valueFormatter(usesMSInterval, usesPercent, false)
			},
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
					formatter: valueFormatter(usesMSInterval, usesPercent && !stacked)
				}
			},
			xaxis: extend(xaxis, getXAxisOptions(parameter)),
			yaxis: extend(yaxis, getYAxisOptions(indicator))
		};
	}
};

export default axisMixin;
