// @flow
import type {ApexOptions} from 'apexcharts';
import {axisLabelFormatter, getXAxisLabels, getXAxisOptions, getYAxisOptions, valueFormatter} from './helpers';
import type {AxisWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasMetaClass, hasPercent} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Примесь графиков по умолчанию (bar, column, line)
 * @param {boolean} horizontal - положение графика
 * @param {boolean} stacked - накопление данных
 * @returns {ApexOptions}
 */
const axisMixin = (horizontal: boolean, stacked: boolean = false) => (widget: AxisWidget, chart: DiagramBuildData): ApexOptions => {
	const {indicator, type} = widget;
	const {categories} = chart;
	const set = getBuildSet(widget);

	if (set && !set.sourceForCompute) {
		const usesMetaClass = hasMetaClass(set, FIELDS.xAxis);
		const usesMSInterval = hasMSInterval(set, FIELDS.yAxis);
		const usesPercent = hasPercent(set, FIELDS.yAxis);
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		const xaxis = {
			categories: getXAxisLabels(widget, categories),
			labels: {
				formatter: horizontal ? valueFormatter(usesMSInterval, usesPercent) : axisLabelFormatter(usesMetaClass)
			}
		};
		const yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? axisLabelFormatter(usesMetaClass) : valueFormatter(usesMSInterval, usesPercent)
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
			grid: {
				padding: {
					bottom: 20
				}
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
			xaxis: extend(xaxis, getXAxisOptions(widget)),
			yaxis: extend(yaxis, getYAxisOptions(indicator))
		};
	}
};

export default axisMixin;
