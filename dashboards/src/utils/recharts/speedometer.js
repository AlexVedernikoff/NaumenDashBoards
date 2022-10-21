// @flow
import type {ContainerSize, SpeedometerOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getSpeedometerFormatter} from './formater';
import {getSpeedometerWidget} from './helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import type {NumberFormatter} from './formater/types';
import type {SpeedometerWidget, Widget} from 'store/widgets/data/types';

const getBorders = (widget: SpeedometerWidget, data: DiagramBuildData, formatter: NumberFormatter): Object => {
	const {borders} = widget;
	const {style} = borders;
	const {show} = style ?? {};
	const {max, min} = data;

	return {formatter, max, min, show, style};
};

const getOptions = (
	widget: Widget,
	data: DiagramBuildData,
	container: ContainerSize,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<SpeedometerOptions> => {
	const speedometerWidget = getSpeedometerWidget(widget);

	if (speedometerWidget) {
		const buildDataSet = getBuildSet(widget);

		if (buildDataSet) {
			const formatter = getSpeedometerFormatter(speedometerWidget);
			const {indicator, ranges} = speedometerWidget;
			const {title, total} = data;
			const tooltip = buildDataSet.indicators?.[0]?.tooltip;
			const {height, width} = container;

			return {
				borders: getBorders(speedometerWidget, data, formatter.borders),
				data: {
					formatter: formatter.total,
					style: indicator,
					title,
					tooltip,
					total
				},
				ranges: {
					...ranges,
					formatter: formatter.ranges
				},
				size: {height, width},
				type: 'SpeedometerOptions'
			};
		}
	}

	return {};
};

export default getOptions;
