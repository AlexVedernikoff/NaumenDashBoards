// @flow
import type {ContainerSize, SummaryOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getSummaryWidget} from './helpers';
import {getTotalFormatter} from './formater';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import type {SummaryData, Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	data: DiagramBuildData,
	container: ContainerSize,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<SummaryOptions> => {
	const summaryWidget = getSummaryWidget(widget);

	if (summaryWidget) {
		const buildDataSet: SummaryData = getBuildSet(widget);

		if (buildDataSet) {
			const formatter = getTotalFormatter(summaryWidget);
			const {indicator} = summaryWidget;
			const {fontColor, fontFamily, fontSize, fontStyle} = indicator;
			const widgetTooltip = buildDataSet.indicators?.[0]?.tooltip ?? {show: false};

			return {
				data: {
					formatter: formatter.data,
					tooltip: widgetTooltip
				},
				style: {
					color: fontColor,
					fontFamily,
					fontSize,
					fontStyle
				},
				type: 'SummaryOptions'
			};
		}
	}

	return {};
};

export default getOptions;
