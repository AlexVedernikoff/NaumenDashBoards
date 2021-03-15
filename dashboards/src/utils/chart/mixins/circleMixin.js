// @flow
import type {ApexOptions} from 'apexcharts';
import type {CircleWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getLabelWithoutUUID, getLegendOptions, valueFormatter} from './helpers';
import {getMainDataSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels} from 'store/widgets/helpers';
import type {Options} from 'utils/chart/types';

const dataLabelsFormatter = (usesMSInterval: boolean, usesPercent: boolean) => (val, options) => {
	return valueFormatter(usesMSInterval, usesPercent)(options.w.config.series[options.seriesIndex]);
};

/**
 * Примесь круговых графиков (pie, donut)
 * @param {CircleWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {ApexOptions}
 */
const circleMixin = (widget: CircleWidget, chart: DiagramBuildData, container: HTMLDivElement): Options => {
	const {legend} = widget;
	const {breakdown, indicators} = getMainDataSet(widget.data);
	const {aggregation, attribute} = indicators[0];
	const {attribute: breakdownAttribute, group} = breakdown[0];
	const usesUUIDs = hasUUIDsInLabels(breakdownAttribute, group);
	const usesMSInterval = hasMSInterval(attribute, aggregation);
	const usesPercent = hasPercent(attribute, aggregation);

	return {
		dataLabels: {
			formatter: dataLabelsFormatter(usesMSInterval, usesPercent)
		},
		labels: chart.labels,
		legend: getLegendOptions(legend, container, usesUUIDs),
		tooltip: {
			y: {
				formatter: valueFormatter(usesMSInterval, usesPercent),
				title: {
					formatter: usesUUIDs && getLabelWithoutUUID
				}
			}
		}
	};
};

export default circleMixin;
