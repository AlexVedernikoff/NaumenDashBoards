// @flow
import type {ApexOptions} from 'apexcharts';
import type {CircleWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent} from 'store/widgets/helpers';
import {valueFormatter} from './helpers';

const dataLabelsFormatter = (usesMSInterval: boolean, usesPercent: boolean) => (val, options) => {
	return valueFormatter(usesMSInterval, usesPercent)(options.w.config.series[options.seriesIndex]);
};

/**
 * Примесь круговых графиков (pie, donut)
 * @param {CircleWidget} widget - данные виджета
 * @param {DiagramBuildData} chart - данные конкретного графика
 * @returns {ApexOptions}
 */
const circleMixin = (widget: CircleWidget, chart: DiagramBuildData): ApexOptions => {
	const set = getBuildSet(widget);

	if (set && !set.sourceForCompute) {
		const usesMSInterval = hasMSInterval(set);
		const usesPercent = hasPercent(set);

		return {
			dataLabels: {
				formatter: dataLabelsFormatter(usesMSInterval, usesPercent)
			},
			labels: chart.labels,
			tooltip: {
				y: {
					formatter: valueFormatter(usesMSInterval, usesPercent)
				}
			}
		};
	}
};

export default circleMixin;
