// @flow
import {buildUrl, client} from 'utils/api';
import type {CompositeFields, ReceiveDiagramPayload} from './types';
import {DIAGRAMS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {CHART_VARIANTS} from 'utils/chart';
// TODO: это для сборки с фронтом
import generateData from './dataGenerator';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {OptionType} from 'react-select/src/types';
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

const createCompositeData = ({common, deep}: CompositeFields) => (widget: Widget) => {
	const {order} = widget;
	const data = {
		type: getValue(widget[type]),
		data: {}
	};

	if (Array.isArray(order)) {
		order.forEach(num => {
			let chartItem = {};

			deep.forEach(baseName => {
				chartItem[baseName] = getValue(widget[createName(baseName, num)]);
			});

			common.forEach(baseName => {
				chartItem[baseName] = widget[createName(baseName, num)];
			});

			data.data[widget[createName(dataKey, num)]] = chartItem;
		});
	}

	return data;
};

const {
	aggregation,
	breakdown,
	calcTotalColumn,
	calcTotalRow,
	column,
	dataKey,
	descriptor,
	group,
	indicator,
	row,
	source,
	sourceForCompute,
	type,
	xAxis,
	yAxis
} = FIELDS;

const comboFields: CompositeFields = {
	common: [breakdown, descriptor, sourceForCompute, xAxis, yAxis],
	deep: [aggregation, group, source, type]
};

const summaryFields: CompositeFields = {
	common: [descriptor, indicator, sourceForCompute],
	deep: [aggregation, source]
};

const tableFields: CompositeFields = {
	common: [breakdown, calcTotalColumn, calcTotalRow, column, descriptor, row, sourceForCompute],
	deep: [aggregation, source]
};

const resolvePostDataCreator = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;

	const creators = {
		[BAR]: createAxisChartData,
		[BAR_STACKED]: createAxisChartData,
		[COLUMN]: createAxisChartData,
		[COLUMN_STACKED]: createAxisChartData,
		[COMBO]: createCompositeData(comboFields),
		[DONUT]: createCircleChartData,
		[LINE]: createAxisChartData,
		[PIE]: createCircleChartData,
		[SUMMARY]: createCompositeData(summaryFields),
		[TABLE]: createCompositeData(tableFields)
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
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;
	const {COMBO} = CHART_VARIANTS;

	try {
		const type = widget.type.value;
		const postData = resolvePostDataCreator(type)(widget);
		const method = [COMBO, SUMMARY, TABLE].includes(type) ? 'getDataForCompositeDiagram' : 'getDataForDiagram';
		const {data} = await client.post(buildUrl('dashboardDataSet', method, 'requestContent'), postData);
		// TODO: это для сборки с фронтом
		//const data = generateData(widget);
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
