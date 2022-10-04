// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getColumnWidth, getSeriesData, parseColumns, parseColumnsFlat, parseMetadata} from './pivot.helpers';
import {getPivotFormatter} from './formater';
import {getPivotWidget} from './helpers';
import {makeGeneratorPivotDrillDownOptions} from './drillDown.helpers';
import type {PivotOptions} from './types';
import type {Widget} from 'store/widgets/data/types';

const getOptions = (
	widget: Widget,
	rawData: DiagramBuildData,
	container: HTMLDivElement
): $Shape<PivotOptions> => {
	const pivotWidget = getPivotWidget(widget);

	if (pivotWidget) {
		const {pivot: {body: bodyStyle, columnHeader: headerStyle}} = pivotWidget;
		const buildDataSet = getBuildSet(pivotWidget);

		if (buildDataSet) {
			const metadata = parseMetadata(rawData);
			const data = getSeriesData(rawData, metadata);
			const {columns: headers, totalHeight: headHeight} = parseColumns(pivotWidget, data, metadata.breakdown);
			const columnsList = parseColumnsFlat(headers);
			const columnWidth = getColumnWidth(columnsList, container);
			const formatters = getPivotFormatter(pivotWidget, data, container);
			const getDrillDownOptions = makeGeneratorPivotDrillDownOptions(pivotWidget, rawData);

			return {
				bodyStyle,
				columnWidth,
				columnsList,
				data,
				formatters,
				getDrillDownOptions,
				headHeight,
				headerStyle,
				headers,
				type: 'PivotOptions'
			};
		}
	}

	return {};
};

export default getOptions;
