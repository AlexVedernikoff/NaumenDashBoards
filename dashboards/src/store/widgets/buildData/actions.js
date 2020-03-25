// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {
	AxisWidget,
	CircleWidget,
	ComboWidget,
	MixedAttribute,
	SummaryWidget,
	TableWidget,
	Widget,
	WidgetType
} from 'store/widgets/data/types';
import {BUILD_DATA_EVENTS} from './constants';
import type {BuildDataMap, PostData, ReceiveBuildDataPayload} from './types';
import {buildUrl, client} from 'utils/api';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {transformGroupFormat} from 'store/widgets/helpers';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const getSourceValue = source => source && typeof source === 'object' ? source.value : '';

/**
 * Производит замену значений агрегации, для графиков с накоплением, c процентов на количество.
 * Необходимо для корректной реализации библиотеки apexcharts.
 * @param {string} aggregation - значение агрегации
 * @param {WidgetType} type - тип виджета
 * @returns {string} - итоговое значение агрегации
 */
const transformAggregation = (aggregation: string, type: WidgetType) => {
	const {COUNT, PERCENT} = DEFAULT_AGGREGATION;
	const {BAR_STACKED, COLUMN_STACKED} = WIDGET_TYPES;

	if (aggregation === PERCENT && (type === BAR_STACKED || type === COLUMN_STACKED)) {
		return COUNT;
	}

	return aggregation;
};

/**
 * Сбрасывает состояние вычисляемого атрибута.
 * @param {MixedAttribute} attribute - атрибут.
 * @returns {MixedAttribute} - возвращает вычисляемый атрибут со сброшенным состоянием или исходный атрибут.
 */
const resetComputedAttributeState = (attribute: MixedAttribute) => {
	if (attribute && typeof attribute === 'object' && attribute.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
		return {
			...attribute,
			state: undefined
		};
	}

	return attribute;
};

const createAxisData = (widget: AxisWidget) => {
	const {type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {
			aggregation,
			breakdown,
			breakdownGroup,
			dataKey,
			descriptor,
			group,
			source,
			sourceForCompute,
			xAxis,
			yAxis
		} = set;

		data[dataKey] = {
			aggregation: transformAggregation(aggregation, type),
			breakdown,
			breakdownGroup: transformGroupFormat(breakdownGroup),
			descriptor,
			group: transformGroupFormat(group),
			source: getSourceValue(source),
			sourceForCompute,
			xAxis,
			yAxis: resetComputedAttributeState(yAxis)
		};
	});

	return {
		data,
		type
	};
};

const createCircleData = (widget: CircleWidget) => {
	const {type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {
			aggregation,
			breakdown,
			breakdownGroup,
			dataKey,
			descriptor,
			indicator,
			source,
			sourceForCompute
		} = set;

		data[dataKey] = {
			aggregation,
			breakdown,
			breakdownGroup: transformGroupFormat(breakdownGroup),
			descriptor,
			indicator: resetComputedAttributeState(indicator),
			source: getSourceValue(source),
			sourceForCompute
		};
	});

	return {
		data,
		type
	};
};

const createComboData = (widget: ComboWidget) => {
	const {type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {
			aggregation,
			breakdown,
			breakdownGroup,
			dataKey,
			descriptor,
			group,
			source,
			sourceForCompute,
			type,
			xAxis,
			yAxis
		} = set;

		data[dataKey] = {
			aggregation: transformAggregation(aggregation, type),
			breakdown,
			breakdownGroup: transformGroupFormat(breakdownGroup),
			descriptor,
			group: transformGroupFormat(group),
			source: getSourceValue(source),
			sourceForCompute,
			type,
			xAxis,
			yAxis: resetComputedAttributeState(yAxis)
		};
	});

	return {
		data,
		type
	};
};

const createSummaryData = (widget: SummaryWidget) => {
	const {type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {
			aggregation,
			dataKey,
			descriptor,
			indicator,
			source,
			sourceForCompute
		} = set;

		data[dataKey] = {
			aggregation,
			descriptor,
			indicator: resetComputedAttributeState(indicator),
			source: getSourceValue(source),
			sourceForCompute
		};
	});

	return {
		data,
		type
	};
};

const createTableData = (widget: TableWidget) => {
	const {type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {
			aggregation,
			breakdown,
			breakdownGroup,
			calcTotalColumn,
			calcTotalRow,
			column,
			dataKey,
			descriptor,
			row,
			source,
			sourceForCompute
		} = set;

		data[dataKey] = {
			aggregation,
			breakdown,
			breakdownGroup: transformGroupFormat(breakdownGroup),
			calcTotalColumn,
			calcTotalRow,
			column,
			descriptor,
			row: resetComputedAttributeState(row),
			source: getSourceValue(source),
			sourceForCompute
		};
	});

	return {
		data,
		type
	};
};

const createPostData = (widget: Widget): PostData | void => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

	switch (widget.type) {
		case BAR:
		case BAR_STACKED:
		case COLUMN:
		case COLUMN_STACKED:
		case LINE:
			return createAxisData(widget);
		case COMBO:
			return createComboData(widget);
		case DONUT:
		case PIE:
			return createCircleData(widget);
		case SUMMARY:
			return createSummaryData(widget);
		case TABLE:
			return createTableData(widget);
	}
};

/**
 * Получаем данные графиков для всех виджетов
 * @param {Array<Widget>} widgets - список виджетов
 * @returns {ThunkAction}
 */
const fetchAllBuildData = (widgets: Array<Widget>): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let postData = {};
		const {subjectUuid} = getState().context;

		dispatch(requestAllBuildData(widgets));

		widgets.forEach(widget => {
			postData[widget.id] = createPostData(widget);
		});

		const {data} = await client.post(buildUrl('dashboardDataSet', 'getDataForDiagrams', `requestContent,'${subjectUuid}'`), postData);

		dispatch(receiveAllBuildData(data));
	} catch (e) {
		dispatch(recordAllBuildDataError(widgets));
	}
};

/**
 * Получаем данные графика для конкретного виджета
 * @param {Widget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchBuildData = (widget: Widget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestBuildData(widget.id));

	try {
		const {subjectUuid} = getState().context;
		const postData = createPostData(widget);
		const url = buildUrl('dashboardDataSet', 'getDataForCompositeDiagram', `requestContent,'${subjectUuid}'`);
		const {data} = await client.post(url, postData);

		dispatch(
			receiveBuildData({data, id: widget.id})
		);
	} catch (e) {
		dispatch(recordBuildDataError(widget.id));
	}
};

const receiveBuildData = (payload: ReceiveBuildDataPayload) => ({
	type: BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA,
	payload
});

const receiveAllBuildData = (payload: BuildDataMap) => ({
	type: BUILD_DATA_EVENTS.RECEIVE_ALL_BUILD_DATA,
	payload
});

const recordBuildDataError = (payload: string) => ({
	type: BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR,
	payload
});

const recordAllBuildDataError = (payload: Array<Widget>) => ({
	type: BUILD_DATA_EVENTS.RECORD_ALL_BUILD_DATA_ERROR,
	payload
});

const requestBuildData = (payload: string) => ({
	type: BUILD_DATA_EVENTS.REQUEST_BUILD_DATA,
	payload
});

const requestAllBuildData = (payload: Array<Widget>) => ({
	type: BUILD_DATA_EVENTS.REQUEST_ALL_BUILD_DATA,
	payload
});

export {
	fetchBuildData,
	fetchAllBuildData
};
