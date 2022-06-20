// @flow
import type {ComboChartOptions} from './types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getComboFormatter} from './formater';
import {getComboSeriesData, getComboWidget, getDataLabels, getLegendOptions, getXAxisCategory} from './helpers';
import {getComboSeriesInfo, getYAxisesNumber} from './combo.helpers';
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import {makeGeneratorComboDrillDownOptions} from './drillDown.helpers';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	rawData: DiagramBuildData,
	container: HTMLDivElement,
	globalColorsSettings: GlobalCustomChartColorsSettings
): $Shape<ComboChartOptions> => {
	const comboWidget = getComboWidget(widget);

	if (comboWidget) {
		const buildDataSet = getBuildSet(comboWidget);
		const {labels} = rawData;
		const {data, percentStore} = getComboSeriesData(rawData);
		const formatters = getComboFormatter(comboWidget, labels, container, percentStore);

		if (buildDataSet) {
			const {xAxisName} = buildDataSet;
			const series = getComboSeriesInfo(comboWidget, rawData, globalColorsSettings);
			const getDrillDownOptions = makeGeneratorComboDrillDownOptions(comboWidget);

			return {
				data,
				dataLabels: getDataLabels(comboWidget),
				formatters,
				getDrillDownOptions,
				legend: getLegendOptions(container, comboWidget.legend),
				series,
				type: 'ComboChartOptions',
				xaxis: getXAxisCategory(comboWidget, container, labels.map(formatters.parameter), xAxisName),
				yaxis: getYAxisesNumber(comboWidget, rawData, series)
			};
		}
	}

	return {};
};

export default getOptions;
