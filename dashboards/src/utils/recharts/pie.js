// @flow
import type {CircleChartOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {DIAGRAM_WIDGET_TYPES} from 'store/widgets/data/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getCircleFormatter} from './formater';
import {getCircleSeriesData, getCircleWidget, getDataLabels, getLegendOptions} from './helpers';
import {getPieTotalCalculator} from './pie.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {makeGeneratorCircleDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	data: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<CircleChartOptions> => {
	const circleWidget = getCircleWidget(widget);

	if (circleWidget) {
		const buildDataSet = getBuildSet(circleWidget);

		if (buildDataSet) {
			const totalCalculator = getPieTotalCalculator(data);
			const formatters = getCircleFormatter(circleWidget, data.labels, container, totalCalculator);
			const getDrillDownOptions = makeGeneratorCircleDrillDownOptions(circleWidget);

			return {
				data: getCircleSeriesData(circleWidget, data, globalColorsSettings),
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
