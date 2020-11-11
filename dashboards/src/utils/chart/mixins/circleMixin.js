// @flow
import type {ApexOptions} from 'apexcharts';
import type {CircleWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getLegendOptions, getMetaClassLabel, valueFormatter} from './helpers';
import {hasMSInterval, hasMetaClass, hasPercent} from 'store/widgets/helpers';

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
const circleMixin = (widget: CircleWidget, chart: DiagramBuildData, container: HTMLDivElement): ApexOptions => {
	const {legend} = widget;
	const set = getBuildSet(widget);

	if (set && !set.sourceForCompute) {
		const usesMetaClass = hasMetaClass(set, FIELDS.breakdown);
		const usesMSInterval = hasMSInterval(set);
		const usesPercent = hasPercent(set);

		return {
			dataLabels: {
				formatter: dataLabelsFormatter(usesMSInterval, usesPercent)
			},
			labels: chart.labels,
			legend: getLegendOptions(legend, container, usesMetaClass),
			tooltip: {
				y: {
					formatter: valueFormatter(usesMSInterval, usesPercent),
					title: {
						formatter: usesMetaClass && getMetaClassLabel
					}
				}
			}
		};
	}
};

export default circleMixin;
