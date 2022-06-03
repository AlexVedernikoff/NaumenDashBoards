// @flow
import type {AxisChartOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getAxisFormatter} from './formater';
import {getAxisWidget, getDataLabels, getLegendOptions, getSeriesData, getSeriesInfo, getTotalCalculator, makeSubTotalGetter} from './helpers';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getXAxisNumber, getYAxisCategory, normalizeSeries} from './bar.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {hasPercent} from 'store/widgets/helpers';
import {makeGeneratorAxisDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	data: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<AxisChartOptions> => {
	const axisWidget = getAxisWidget(widget);

	if (axisWidget) {
		const buildDataSet = getBuildSet(axisWidget);

		if (buildDataSet) {
			const totalCalculator = getTotalCalculator(data);
			const formatters = getAxisFormatter(axisWidget, data.labels, container, totalCalculator);
			const {xAxisName, yAxisName} = buildDataSet;
			const getDrillDownOptions = makeGeneratorAxisDrillDownOptions(axisWidget);
			const {indicators} = buildDataSet;
			const {aggregation, attribute: indicatorAttribute} = indicators[0];
			const usesPercent = hasPercent(indicatorAttribute, aggregation);
			let seriesData = getSeriesData(data);
			const subTotalGetter = makeSubTotalGetter(axisWidget, seriesData, usesPercent);

			if (usesPercent) {
				seriesData = normalizeSeries(seriesData);
			}

			return {
				data: seriesData,
				dataLabels: getDataLabels(axisWidget),
				formatters,
				getDrillDownOptions,
				legend: getLegendOptions(container, axisWidget.legend),
				series: getSeriesInfo(axisWidget, data, globalColorsSettings),
				stackId: 'stacked',
				stackOffset: usesPercent ? 'expand' : 'none',
				stacked: true,
				subTotalGetter,
				type: 'AxisChartOptions',
				xaxis: getXAxisNumber(axisWidget, yAxisName),
				yaxis: getYAxisCategory(axisWidget, container, data.labels.map(formatters.parameter), xAxisName)
			};
		}
	}

	return {};
};

export default getOptions;
