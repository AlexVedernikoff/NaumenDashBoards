// @flow
import {buildUrl, client} from 'utils/api';
import type {CompositeFields, ReceiveDiagramPayload} from './types';
import {createOrderName, WIDGET_VARIANTS} from 'utils/widget';
import {DIAGRAMS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {CHART_VARIANTS} from 'utils/chart';
import {FIELDS, VALUES} from 'components/organisms/WidgetFormPanel';
import type {OptionType} from 'react-select/src/types';
import type {Widget} from 'store/widgets/data/types';

const getValue = (option: OptionType) => option && option.value;

const createAxisChartData = (widget: Widget) => {
	const {BAR_STACKED, COLUMN_STACKED} = CHART_VARIANTS;
	const {COUNT, PERCENT} = VALUES.DEFAULT_AGGREGATION;
	const {aggregation, breakdown, breakdownGroup, descriptor, group, source, type, xAxis, yAxis} = widget;
	let aggregationValue = getValue(aggregation);

	/*
	Когда для графика с накоплением пользователь выбирает агрегацию в процентах,
	нам нужно провести замену значения агрегации для подсчета данных на бэке т.к
	для отображения графику необходимо все также количество.
	*/
	if (aggregationValue === PERCENT && (type.value === BAR_STACKED || type.value === COLUMN_STACKED)) {
		aggregationValue = COUNT;
	}

	return {
		aggregation: aggregationValue,
		breakdown,
		breakdownGroup: getValue(breakdownGroup),
		descriptor,
		group: getValue(group),
		source: getValue(source),
		type: getValue(type),
		xAxis,
		yAxis
	};
};

const createCircleChartData = (widget: Widget) => {
	const {aggregation, breakdown, breakdownGroup, descriptor, indicator, source, type} = widget;

	return {
		aggregation: getValue(aggregation),
		breakdown,
		breakdownGroup: getValue(breakdownGroup),
		descriptor,
		indicator,
		source: getValue(source),
		type: getValue(type)
	};
};

const createCompositeData = (fields: CompositeFields) => (widget: Widget) => {
	const {nested, simple} = fields;
	const {order} = widget;
	const data = {
		type: getValue(widget[type]),
		data: {}
	};

	if (Array.isArray(order)) {
		order.forEach(num => {
			const createName = createOrderName(num);
			let chartItem = {};

			nested.forEach(baseName => {
				chartItem[baseName] = getValue(widget[createName(baseName)]);
			});

			simple.forEach(baseName => {
				chartItem[baseName] = widget[createName(baseName)];
			});

			data.data[widget[createName(dataKey)]] = chartItem;
		});
	}

	return data;
};

const {
	aggregation,
	breakdown,
	breakdownGroup,
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
	nested: [aggregation, breakdownGroup, group, source, type],
	simple: [breakdown, descriptor, sourceForCompute, xAxis, yAxis]
};

const summaryFields: CompositeFields = {
	nested: [aggregation, source],
	simple: [descriptor, indicator, sourceForCompute]
};

const tableFields: CompositeFields = {
	nested: [aggregation, breakdownGroup, source],
	simple: [breakdown, calcTotalColumn, calcTotalRow, column, descriptor, row, sourceForCompute]
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
