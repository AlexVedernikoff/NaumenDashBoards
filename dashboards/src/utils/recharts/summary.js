// @flow
import type {ContainerSize, SummaryOptions} from './types';
import {DEFAULT_COMPARE_PERIOD} from 'store/widgets/data/constants';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getDiffValues} from './summary.helpers';
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
			const {format = DEFAULT_COMPARE_PERIOD.format} = summaryWidget.comparePeriod ?? {};
			const {total: value} = data;
			const diff = getDiffValues(data, summaryWidget);

			return {
				data: {
					diffFormatter: formatter.diff,
					formatter: formatter.data,
					tooltip: widgetTooltip
				},
				diff,
				style: {
					color: fontColor,
					diff: format,
					fontFamily,
					fontSize,
					fontStyle
				},
				type: 'SummaryOptions',
				value: value || 0
			};
		}
	}

	return {};
};

export default getOptions;
