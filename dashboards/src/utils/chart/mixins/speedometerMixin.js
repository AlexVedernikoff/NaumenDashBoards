// @flow
import {getBuildSet} from 'store/widgets/data/helpers';
import {getTotalFormatter} from './formater';
import type {Options} from 'utils/chart/types';
import type {SpeedometerWidget} from 'store/widgets/data/types';

const speedometerMixin = (widget: SpeedometerWidget, container: HTMLDivElement): Options => {
	const buildDataSet = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getTotalFormatter(widget, container);
		const {borders, ranges} = widget;
		const {max, min} = borders;

		return {
			borders: {max, min},
			data: {
				formatter: formatter.data
			},
			ranges
		};
	}
};

export default speedometerMixin;
