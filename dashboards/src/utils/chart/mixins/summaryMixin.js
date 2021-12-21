// @flow
import {getBuildSet} from 'store/widgets/data/helpers';
import {getTotalFormatter} from './formater';
import type {Options} from 'utils/chart/types';
import type {SummaryData, SummaryWidget} from 'store/widgets/data/types';

const axisMixin = (widget: SummaryWidget, container: HTMLDivElement): Options => {
	const buildDataSet: SummaryData = getBuildSet(widget);

	if (buildDataSet) {
		const formatter = getTotalFormatter(widget, container);
		const {indicator} = widget;
		const {fontColor, fontFamily, fontSize, fontStyle} = indicator;
		const widgetTooltip = buildDataSet.indicators?.[0]?.tooltip;
		const tooltip = widgetTooltip && widgetTooltip.show ? widgetTooltip.title : null;

		return {
			data: {
				formatter: formatter.data,
				tooltip
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
