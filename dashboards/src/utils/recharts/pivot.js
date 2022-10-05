// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import {getBuildSet} from 'store/widgets/data/helpers';
import {getColumnsWidth, getSeriesData, parseColumns, parseMetadata} from './pivot.helpers';
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
			const data = getSeriesData(rawData, metadata, pivotWidget.showTotalAmount);
			const {columns: headers, columnsList, totalHeight: headHeight} = parseColumns(
				pivotWidget,
				data,
				metadata.breakdown,
				metadata.tooltips
			);
			const columnsWidth = getColumnsWidth(columnsList, container);
			const formatters = getPivotFormatter(pivotWidget, data, container);
			const showTotal = pivotWidget.showTotalAmount;
			const getDrillDownOptions = makeGeneratorPivotDrillDownOptions(pivotWidget, rawData);

			return {
				bodyStyle,
				columnsList,
				columnsWidth,
				data,
				formatters,
				getDrillDownOptions,
				headHeight,
				headerStyle,
				headers,
				showTotal,
				type: 'PivotOptions'
			};
		}
	}

	return {};
};

export default getOptions;
