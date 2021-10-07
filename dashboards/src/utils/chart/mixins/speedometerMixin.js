// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getSpeedometerFormatter} from './formater';
import type {NumberFormatter} from './formater/types';
import type {Options} from 'utils/chart/types';
import type {SpeedometerWidget} from 'store/widgets/data/types';

const getBorders = (widget: SpeedometerWidget, data: DiagramBuildData, formatter: NumberFormatter): Options => {
	const {borders} = widget;
	const {style} = borders;
	const {show} = style ?? {};
	const {max, min} = data;
	return {formatter, max, min, show, style};
};

/**
 * Примесь спидометра
 * @param {SpeedometerWidget} widget - данные виджета
 * @param {DiagramBuildData} data - данные конкретного графика
 * @param {HTMLDivElement} container - контейнер, где размещен график
 * @returns {Options}
 */
const speedometerMixin = (widget: SpeedometerWidget, data: DiagramBuildData, container: HTMLDivElement): Options => {
	const buildDataSet = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getSpeedometerFormatter(widget, container);
		const {indicator, ranges} = widget;
		const {title, total} = data;

		return {
			borders: getBorders(widget, data, formatter.borders),
			data: {formatter: formatter.total, style: indicator, title, total},
			ranges: {
				...ranges,
				formatter: formatter.ranges
			}
		};
	}
};

export default speedometerMixin;
