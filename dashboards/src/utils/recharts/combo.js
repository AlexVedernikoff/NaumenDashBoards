// @flow
import type {ComboChartOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getComboFormatter} from './formater';
import {getComboSeriesData, getComboWidget, getDataLabels, getLegendOptions, getTotalCalculator, getXAxisCategory} from './helpers';
import {getComboSeriesInfo, getYAxisesNumber} from './combo.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {makeGeneratorComboDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	data: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<ComboChartOptions> => {
	const comboWidget = getComboWidget(widget);

	if (comboWidget) {
		const buildDataSet = getBuildSet(comboWidget);
		const totalCalculator = getTotalCalculator(data);
		const formatters = getComboFormatter(comboWidget, data.labels, container, totalCalculator);

		if (buildDataSet) {
			const {xAxisName} = buildDataSet;
			const series = getComboSeriesInfo(comboWidget, data, globalColorsSettings);
			const getDrillDownOptions = makeGeneratorComboDrillDownOptions(comboWidget);

			return {
				data: getComboSeriesData(data),
				dataLabels: getDataLabels(comboWidget),
				formatters,
				getDrillDownOptions,
				legend: getLegendOptions(container, comboWidget.legend),
				series,
				type: 'ComboChartOptions',
				xaxis: getXAxisCategory(comboWidget, container, data.labels.map(formatters.parameter), xAxisName),
				yaxis: getYAxisesNumber(comboWidget, data, series)
			};
		}
	}

	return {};
};

export default getOptions;
