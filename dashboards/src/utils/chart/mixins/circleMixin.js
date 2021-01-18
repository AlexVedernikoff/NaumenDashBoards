// @flow
import type {ApexOptions} from 'apexcharts';
import type {CircleWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getLabelWithoutUUID, getLegendOptions, valueFormatter} from './helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels} from 'store/widgets/helpers';

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
	const dataSet = getBuildSet(widget);

	if (dataSet && !dataSet.sourceForCompute) {
		const usesUUIDs = hasUUIDsInLabels(dataSet.breakdown);
		const usesMSInterval = hasMSInterval(dataSet);
		const usesPercent = hasPercent(dataSet);

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
	}
};

export default circleMixin;
