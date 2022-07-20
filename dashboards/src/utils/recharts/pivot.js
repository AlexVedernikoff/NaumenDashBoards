// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getColumnWidth, getSeriesData, parseColumns} from './pivot.helpers';
import {getPivotWidget} from './helpers';
import type {PivotOptions} from './types';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	rawData: DiagramBuildData,
	container: HTMLDivElement
): $Shape<PivotOptions> => {
	const pivotWidget = getPivotWidget(widget);

	if (pivotWidget) {
		const buildDataSet = getBuildSet(pivotWidget);
		const data = getSeriesData(rawData);
		const headers = parseColumns(pivotWidget, data);
		const columnsList = parseColumns(pivotWidget, data);
		const columnWidth = getColumnWidth(columnsList, container);

		if (buildDataSet) {
			return {
				columnWidth,
				columnsList,
				headers,
				type: 'PivotOptions'
			};
		}
	}

	return {};
};

export default getOptions;
