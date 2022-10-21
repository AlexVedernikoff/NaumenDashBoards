// @flow
import type {CircleChartOptions, ContainerSize} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {DIAGRAM_WIDGET_TYPES} from 'store/widgets/data/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getCircleFormatter} from './formater';
import {getCircleSeriesData, getCircleWidget, getDataLabels, getLegendOptions} from './helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {makeGeneratorCircleDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	rawData: DiagramBuildData,
	container: ContainerSize,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<CircleChartOptions> => {
	const circleWidget = getCircleWidget(widget);

	if (circleWidget) {
		const buildDataSet = getBuildSet(circleWidget);

		if (buildDataSet) {
			const {data, percentStore} = getCircleSeriesData(circleWidget, rawData, globalColorsSettings);
			const formatters = getCircleFormatter(circleWidget, rawData.labels, percentStore);
			const getDrillDownOptions = makeGeneratorCircleDrillDownOptions(circleWidget);

			return {
				data,
				dataLabels: getDataLabels(circleWidget),
				formatters,
				getDrillDownOptions,
				innerRadius: widget.type === DIAGRAM_WIDGET_TYPES.PIE ? 0 : '40%',
				legend: getLegendOptions(container, circleWidget.legend),
				type: 'CircleChartOptions'
			};
		}
	}

	return {};
};

export default getOptions;
