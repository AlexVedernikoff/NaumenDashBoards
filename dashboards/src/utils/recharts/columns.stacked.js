// @flow
import type {AxisChartOptions, ContainerSize} from './types';
import {
	canShowSubTotal,
	getAxisWidget,
	getDataLabels,
	getLegendOptions,
	getSeriesData,
	getSeriesInfo,
	getXAxisCategory,
	makeSubTotalGetter
} from './helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getAxisFormatter} from './formater';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getYAxisNumber, normalizeSeries} from './columns.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {hasPercent} from 'store/widgets/helpers';
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
			let {data: seriesData, percentStore} = getSeriesData(rawData);
			const formatters = getAxisFormatter(axisWidget, labels, percentStore);
			const getDrillDownOptions = makeGeneratorAxisDrillDownOptions(axisWidget);
			const {indicators, xAxisName, yAxisName} = buildDataSet;
			const {aggregation, attribute: indicatorAttribute} = indicators[0];
			const usesPercent = hasPercent(indicatorAttribute, aggregation);
			const showSubTotal = canShowSubTotal(aggregation); // #SMRMEXT-13872
			const subTotalGetter = showSubTotal ? makeSubTotalGetter(axisWidget, seriesData, usesPercent) : null;
			const legend = getLegendOptions(container, axisWidget.legend);
			const xAxis = getXAxisCategory(axisWidget, container, labels.map(formatters.parameter), xAxisName);
			const yAxis = getYAxisNumber(axisWidget, container, xAxis, legend, rawData, formatters.indicator, yAxisName, usesPercent);

			if (usesPercent) {
				seriesData = normalizeSeries(seriesData);
			}

			return {
				data: seriesData,
				dataLabels: getDataLabels(axisWidget),
				formatters,
				getDrillDownOptions,
				legend,
				series: getSeriesInfo(axisWidget, rawData, globalColorsSettings),
				stackId: 'stacked',
				stackOffset: usesPercent ? 'expand' : 'none',
				stacked: true,
				subTotalGetter,
				type: 'AxisChartOptions',
				xAxis,
				yAxis
			};
		}
	}

	return {};
};

export default getOptions;
