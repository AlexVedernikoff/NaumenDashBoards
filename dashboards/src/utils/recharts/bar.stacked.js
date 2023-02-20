// @flow
import type {AxisChartOptions, ContainerSize} from './types';
import {
	canShowSubTotal,
	getAxisWidget,
	getDataLabels,
	getLegendOptions,
	getSeriesData,
	getSeriesInfo,
	makeSubTotalGetter
} from './helpers';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getAxisFormatter} from './formater';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getXAxisNumber, getYAxisCategory, normalizeSeries} from './bar.helpers';
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
			const {xAxisName, yAxisName} = buildDataSet;
			const getDrillDownOptions = makeGeneratorAxisDrillDownOptions(axisWidget);
			const {indicators} = buildDataSet;
			const {aggregation, attribute: indicatorAttribute} = indicators[0];
			const usesPercent = hasPercent(indicatorAttribute, aggregation);
			const showSubTotal = canShowSubTotal(aggregation); // #SMRMEXT-13872
			const subTotalGetter = showSubTotal ? makeSubTotalGetter(axisWidget, seriesData, usesPercent) : null;

			if (usesPercent) {
				seriesData = normalizeSeries(seriesData);
			}

			const legend = getLegendOptions(container, axisWidget.legend);
			const yAxis = getYAxisCategory(axisWidget, container, labels, formatters.parameter, xAxisName);
			const xAxis = getXAxisNumber(axisWidget, container, [legend, yAxis], yAxisName, usesPercent);

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
