// @flow
import {buildUrl, client} from 'utils/api';
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
	const {aggregation, breakdown, group, source, type, xAxis, yAxis} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		group: getValue(group),
		source: getValue(source),
		type: getValue(type),
		xAxis,
		yAxis
	};
};

const createCircleChartData = (widget: Widget) => {
	const {aggregation, breakdown, indicator, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		indicator,
		source: getValue(source),
		type: getValue(type)
	};
};

const createName = (name: string, num: number) => `${name}_${num}`;

const createComboChartData = (widget: Widget) => {
	const {order} = widget;
	const {aggregation, breakdown, chart, group, source, type, xAxis, yAxis} = FIELDS;
	const data = {
		type: getValue(widget[type])
	};

	if (Array.isArray(order)) {
		order.forEach(num => {
			[aggregation, chart, group, source].forEach(baseName => {
				const name = createName(baseName, num);
				data[name] = getValue(widget[name]);
			});

			[breakdown, xAxis, yAxis].forEach(baseName => {
				const name = createName(baseName, num);
				data[name] = widget[name];
			});
		});
	}

	return data;
};

const createSummaryData = (widget: Widget) => {
	const {aggregation, indicator, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		indicator,
		source: getValue(source),
		type: getValue(type)
	};
};

const createTableData = (widget: Widget) => {
	const {aggregation, breakdown, calcTotalColumn, calcTotalRow, column, row, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		calcTotalColumn,
		calcTotalRow,
		column,
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
		/*
		const postData = resolvePostDataCreator(widget.type.value)(widget);
		const {data} = await client.post(buildUrl('dashboardDataSet', 'getDataForDiagram', 'requestContent'), postData);
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
