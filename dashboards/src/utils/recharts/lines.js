// @flow
import type {AxisChartOptions, ContainerSize} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getAxisFormatter} from './formater';
import {getAxisWidget, getDataLabels, getLegendOptions, getSeriesData, getSeriesInfo, getXAxisCategory} from './helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getYAxisNumber} from './columns.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {makeGeneratorAxisDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	rawData: DiagramBuildData,
	container: ContainerSize,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<AxisChartOptions> => {
	const axisWidget = getAxisWidget(widget);

	if (axisWidget) {
		const buildDataSet = getBuildSet(axisWidget);

		if (buildDataSet) {
			const {labels} = rawData;
			const {data, percentStore} = getSeriesData(rawData);
			const formatters = getAxisFormatter(axisWidget, labels, percentStore);
			const {xAxisName, yAxisName} = buildDataSet;
			const getDrillDownOptions = makeGeneratorAxisDrillDownOptions(axisWidget);
			const legend = getLegendOptions(container, axisWidget.legend);
			const xAxis = getXAxisCategory(axisWidget, container, labels.map(formatters.parameter), xAxisName);
			const yAxis = getYAxisNumber(axisWidget, container, xAxis, legend, rawData, formatters.indicator, yAxisName);

			return {
				data,
				dataLabels: getDataLabels(axisWidget),
				formatters,
				getDrillDownOptions,
				legend,
				series: getSeriesInfo(axisWidget, rawData, globalColorsSettings),
				stacked: false,
				type: 'AxisChartOptions',
				xAxis,
				yAxis
			};
		}
	}

	return {};
};

export default getOptions;
