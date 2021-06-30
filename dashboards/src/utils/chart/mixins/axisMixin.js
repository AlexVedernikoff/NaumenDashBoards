// @flow
import type {AxisData, AxisWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {extend} from 'helpers';
import {getAxisFormatter} from 'utils/chart/mixins/formater';
import {getBuildSet} from 'store/widgets/data/helpers';
import {
	getLegendOptions,
	getXAxisOptions,
	getYAxisOptions
} from './helpers';
import {hasPercent} from 'store/widgets/helpers';
import type {Options} from 'utils/chart/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Создает примесь для осевых графиков
 * @param {AxisWidget} widget - виджет
 * @param {DiagramBuildData} data - данные графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {Options}
 */
const axisMixin = (widget: AxisWidget, data: DiagramBuildData, container: HTMLDivElement): Options => {
	const {indicator: indicatorSettings, legend, parameter, type} = widget;
	const {labels} = data;
	const buildDataSet: AxisData = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getAxisFormatter(widget, labels, container);
		const {hasOverlappedLabel, horizontal, stacked} = formatter.options;
		const {indicators, xAxisName, yAxisName} = buildDataSet;
		const {aggregation, attribute: indicatorAttribute} = indicators[0];
		const usesPercent = hasPercent(indicatorAttribute, aggregation);
		const stackType = usesPercent && stacked ? '100%' : 'normal';
		const strokeWidth = type === WIDGET_TYPES.LINE ? 4 : 0;
		const xAxisSettings = {...parameter, name: xAxisName};
		const yAxisSettings = {...indicatorSettings, name: yAxisName};
		const xAxisProps = horizontal ? yAxisSettings : xAxisSettings;
		const yAxisProps = horizontal ? xAxisSettings : yAxisSettings;

		const xaxis = {
			labels: {
				formatter: horizontal ? formatter.indicator : formatter.parameter.overlapped
			},
			title: {}
		};
		const yaxis = {
			forceNiceScale: !stacked && !usesPercent,
			labels: {
				formatter: horizontal ? formatter.parameter.overlapped : formatter.indicator,
				maxWidth: 140
			}
		};

		const result = {
			chart: {
				stackType,
				stacked
			},
			dataLabels: {
				formatter: formatter.dataLabel
			},
			labels,
			legend: getLegendOptions(legend, container, formatter.legend),
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
					formatter: formatter.indicator,
					title: {
						formatter: stacked ? formatter.legend : formatter.parameter.default
					}
				}
			},
			xaxis: extend(xaxis, getXAxisOptions(xAxisProps, hasOverlappedLabel, horizontal)),
			yaxis: extend(yaxis, getYAxisOptions(yAxisProps))
		};
		return result;
	}
};

export default axisMixin;
