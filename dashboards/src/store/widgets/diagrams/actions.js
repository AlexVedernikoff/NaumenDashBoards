// @flow
import {buildUrl, client} from 'utils/api';
import type {DiagramMap, ReceiveDiagramPayload} from './types';
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
	const {breakdown, breakdownGroup, descriptor, group, source, type, xAxis, yAxis} = widget;
	let {aggregation} = widget;

	/*
	Когда для графика с накоплением пользователь выбирает агрегацию в процентах,
	нам нужно провести замену значения агрегации для подсчета данных на бэке т.к
	для отображения графику необходимо все также количество.
	*/
	if (aggregation === PERCENT && (type === BAR_STACKED || type === COLUMN_STACKED)) {
		aggregation = COUNT;
	}

	return {
		aggregation,
		breakdown,
		breakdownGroup,
		descriptor,
		group,
		source: getValue(source),
		type,
		xAxis,
		yAxis
	};
};

const createCircleChartData = (widget: Widget) => {
	const {aggregation, breakdown, breakdownGroup, descriptor, indicator, source, type} = widget;

	return {
		aggregation,
		breakdown,
		breakdownGroup,
		descriptor,
		indicator,
		source: getValue(source),
		type
	};
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
	sourceForCompute,
	type,
	xAxis,
	yAxis
} = FIELDS;

const comboFields = [aggregation, breakdown, breakdownGroup, descriptor, group, sourceForCompute, type, xAxis, yAxis];

const summaryFields = [aggregation, descriptor, indicator, sourceForCompute];

const tableFields = [aggregation, breakdown, breakdownGroup, calcTotalColumn, calcTotalRow, column, descriptor, row, sourceForCompute];

const createCompositeData = (fields: Array<string>) => (widget: Widget) => {
	const {source} = FIELDS;
	const {order} = widget;
	const data = {
		data: {},
		type: widget[type]
	};

	if (Array.isArray(order)) {
		order.forEach(num => {
			const createName = createOrderName(num);
			let chartItem = {};

			chartItem[source] = getValue(widget[createName(source)]);

			fields.forEach(baseName => {
				chartItem[baseName] = widget[createName(baseName)];
			});

			data.data[widget[createName(dataKey)]] = chartItem;
		});
	}

	return data;
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
 * Получаем данные графиков для всех виджетов
 * @param {Array<Widget>} widgets - список виджетов
 * @returns {ThunkAction}
 */
const fetchDiagramsData = (widgets: Array<Widget>): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		let postData = {};

		dispatch(requestDiagrams(widgets));

		widgets.forEach(widget => {
			const {type} = widget;

			postData[widget.id] = resolvePostDataCreator(type)(widget);
		});

		const {data} = await client.post(buildUrl('dashboardDataSet', 'getDataForDiagrams', 'requestContent'), postData);

		dispatch(receiveDiagrams(data));
	} catch (e) {
		dispatch(recordDiagramsError(widgets));
	}
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
		const {type} = widget;
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

const requestDiagrams = (payload: Array<Widget>) => ({
	type: DIAGRAMS_EVENTS.REQUEST_DIAGRAMS,
	payload
});

const receiveDiagram = (payload: ReceiveDiagramPayload) => ({
	type: DIAGRAMS_EVENTS.RECEIVE_DIAGRAM,
	payload
});

const receiveDiagrams = (payload: DiagramMap) => ({
	type: DIAGRAMS_EVENTS.RECEIVE_DIAGRAMS,
	payload
});

const recordDiagramError = (payload: string) => ({
	type: DIAGRAMS_EVENTS.RECORD_DIAGRAM_ERROR,
	payload
});

const recordDiagramsError = (payload: Array<Widget>) => ({
	type: DIAGRAMS_EVENTS.RECORD_DIAGRAMS_ERROR,
	payload
});

export {
	fetchDiagramData,
	fetchDiagramsData
};
