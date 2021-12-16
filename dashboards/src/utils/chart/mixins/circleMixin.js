// @flow
import type {CircleData, CircleWidget} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getCircleFormatter} from './formater';
import {getLegendOptions} from './helpers';
import type {Options} from 'utils/chart/types';

/**
 * Примесь круговых графиков (pie, donut)
 * @param {CircleWidget} widget - данные виджета
 * @param {DiagramBuildData} data - данные конкретного графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {Options}
 */
export const circleMixin = (widget: CircleWidget, data: DiagramBuildData, container: HTMLDivElement): Options => {
	const {legend} = widget;
	const {labels} = data;
	const buildDataSet: CircleData = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getCircleFormatter(widget, labels, container);

		return {
			dataLabels: {
				formatter: formatter.dataLabel
			},
			labels: labels,
			legend: getLegendOptions(legend, container, formatter.legend),
			tooltip: {
				y: {
					formatter: formatter.tooltip.data,
					title: {
						formatter: formatter.tooltip.title
					}
				}
			}
		};
	}
};

export default circleMixin;
