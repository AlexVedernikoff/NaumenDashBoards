// @flow
import type {AxisChartOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getAxisFormatter} from './formater';
import {getAxisWidget, getDataLabels, getLegendOptions, getSeriesData, getSeriesInfo} from './helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getXAxisNumber, getYAxisCategory} from './bar.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {makeGeneratorAxisDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	rawData: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<AxisChartOptions> => {
	const axisWidget = getAxisWidget(widget);

	if (axisWidget) {
		const buildDataSet = getBuildSet(axisWidget);

		if (buildDataSet) {
			const {labels} = rawData;
			const {data, percentStore} = getSeriesData(rawData);
			const formatters = getAxisFormatter(axisWidget, labels, container, percentStore);
			const {xAxisName, yAxisName} = buildDataSet;
			const getDrillDownOptions = makeGeneratorAxisDrillDownOptions(axisWidget);

			return {
				data,
				dataLabels: getDataLabels(axisWidget),
				formatters,
				getDrillDownOptions,
				legend: getLegendOptions(container, axisWidget.legend),
				series: getSeriesInfo(axisWidget, rawData, globalColorsSettings),
				stacked: false,
				type: 'AxisChartOptions',
				xaxis: getXAxisNumber(axisWidget, yAxisName),
				yaxis: getYAxisCategory(axisWidget, container, labels.map(formatters.parameter), xAxisName)
			};
		}
	}

	return {};
};

export default getOptions;
