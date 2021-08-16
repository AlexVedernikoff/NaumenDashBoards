// @flow
import {getBuildSet} from 'store/widgets/data/helpers';
import {getTotalFormatter} from './formater';
import type {Options} from 'utils/chart/types';
import type {SummaryWidget} from 'store/widgets/data/types';

const axisMixin = (widget: SummaryWidget, container: HTMLDivElement): Options => {
	const buildDataSet = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getTotalFormatter(widget, container);
		const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
		return {
			data: {
				formatter: formatter.data
			},
			style: {
				color: fontColor,
				fontFamily,
				fontSize,
				fontStyle
			}
		};
	}
};

export default axisMixin;
