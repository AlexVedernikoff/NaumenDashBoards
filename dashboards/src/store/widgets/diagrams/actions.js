// @flow
// TODO: это для сборки с бэком
// import {buildUrl, client} from 'utils/api';
import {DIAGRAMS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {CHART_VARIANTS} from 'utils/chart';
import generateData from './dataGenerator';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {OptionType} from 'react-select/src/types';
import type {ReceiveDiagramPayload} from './types';
import type {Widget} from 'store/widgets/data/types';
import {WIDGET_VARIANTS} from 'utils/widget';

const getValue = (option: OptionType) => option && option.value;

const createAxisChartData = (widget: Widget) => {
	const {aggregation, breakdown, descriptor, group, source, type, xAxis, yAxis} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		descriptor,
		group: getValue(group),
		source: getValue(source),
		type: getValue(type),
		xAxis,
		yAxis
	};
};

const createCircleChartData = (widget: Widget) => {
	const {aggregation, breakdown, descriptor, indicator, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		descriptor,
		indicator,
		source: getValue(source),
		type: getValue(type)
	};
};

const createName = (name: string, num: number) => `${name}_${num}`;

const createComboChartData = (widget: Widget) => {
	const {order} = widget;
	const {aggregation, breakdown, chart, descriptor, group, source, type, xAxis, yAxis} = FIELDS;
	const data = {
		type: getValue(widget[type]),
		charts: []
	};

	if (Array.isArray(order)) {
		order.forEach(num => {
			let chartItem = {};
			[aggregation, group, source].forEach(baseName => {
				chartItem[baseName] = getValue(widget[createName(baseName, num)]);
			});

			[breakdown, descriptor, xAxis, yAxis].forEach(baseName => {
				chartItem[baseName] = widget[createName(baseName, num)];
			});

			chartItem[type] = getValue(widget[createName(chart, num)]);

			data.charts.push(chartItem);
		});
	}

	return data;
};

const createSummaryData = (widget: Widget) => {
	const {aggregation, descriptor, indicator, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		descriptor,
		indicator,
		source: getValue(source),
		type: getValue(type)
	};
};

const createTableData = (widget: Widget) => {
	const {aggregation, breakdown, calcTotalColumn, calcTotalRow, column, descriptor, row, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		calcTotalColumn,
		calcTotalRow,
		column,
		descriptor,
		row,
		source: getValue(source),
		type: getValue(type)
	};
};

const resolvePostDataCreator = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;

	const creators = {
		[BAR]: createAxisChartData,
		[BAR_STACKED]: createAxisChartData,
		[COLUMN]: createAxisChartData,
		[COLUMN_STACKED]: createAxisChartData,
		[COMBO]: createComboChartData,
		[DONUT]: createCircleChartData,
		[LINE]: createAxisChartData,
		[PIE]: createCircleChartData,
		[SUMMARY]: createSummaryData,
		[TABLE]: createTableData
	};

	return creators[type];
};

/**
 * Получаем данные графика для конкретного виджета
 * @param {Widget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchDiagramData = (widget: Widget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestDiagram(widget.id));

	try {
		// TODO: это для сборки с бэком
		/*
		const type = widget.type.value;
		const postData = resolvePostDataCreator(type)(widget);
		const method = type === CHART_VARIANTS.COMBO ? 'getDataForCompositeDiagram' : 'getDataForDiagram';
		const {data} = await client.post(buildUrl('dashboardDataSet', method, 'requestContent'), postData);
		*/

		const data = generateData(widget);
		dispatch(
			receiveDiagram({data, id: widget.id})
		);
	} catch (e) {
		dispatch(recordDiagramError(widget.id));
	}
};

const requestDiagram = (payload: string) => ({
	type: DIAGRAMS_EVENTS.REQUEST_DIAGRAM,
	payload
});

const receiveDiagram = (payload: ReceiveDiagramPayload) => ({
	type: DIAGRAMS_EVENTS.RECEIVE_DIAGRAM,
	payload
});

const recordDiagramError = (payload: string) => ({
	type: DIAGRAMS_EVENTS.RECORD_DIAGRAM_ERROR,
	payload
});

export {
	fetchDiagramData
};
