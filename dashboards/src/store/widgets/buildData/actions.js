// @flow
import type {
	AnyWidget,
	AxisWidget,
	CircleWidget,
	ComboWidget,
	MixedAttribute,
	SpeedometerWidget,
	SummaryWidget,
	TableWidget,
	Widget,
	WidgetType
} from 'store/widgets/data/types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {BUILD_DATA_EVENTS} from './constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DIAGRAM_WIDGET_TYPES, DISPLAY_MODE, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {mixinBreakdown} from 'utils/normalizer/widget/helpers';
import type {PostData, ReceiveBuildDataPayload} from './types';
import {transformGroupFormat} from 'store/widgets/helpers';

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
	const {sorting, type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {dataKey, descriptor, group, source, sourceForCompute, xAxis} = set;

		data[dataKey] = {
			descriptor,
			group: transformGroupFormat(group),
			source: getSourceValue(source),
			sourceForCompute,
			xAxis
		};

		if (!set.sourceForCompute) {
			const {aggregation, showEmptyData, yAxis} = set;
			data[dataKey] = {
				...data[dataKey],
				aggregation: transformAggregation(aggregation, type),
				showEmptyData,
				yAxis: resetComputedAttributeState(yAxis)
			};

			data[dataKey] = mixinBreakdown(set, data[dataKey], true);
		}
	});

	return {
		data,
		sorting,
		type
	};
};

const createCircleData = (widget: CircleWidget) => {
	const {sorting, type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {
			dataKey,
			descriptor,
			source
		} = set;

		data[dataKey] = {
			descriptor,
			source: getSourceValue(source),
			sourceForCompute: true
		};

		if (!set.sourceForCompute) {
			const {aggregation, indicator} = set;
			data[dataKey] = {
				...data[dataKey],
				aggregation,
				indicator: resetComputedAttributeState(indicator),
				sourceForCompute: false
			};

			data[dataKey] = mixinBreakdown(set, data[dataKey], true);
		}
	});

	return {
		data,
		sorting,
		type
	};
};

const createComboData = (widget: ComboWidget) => {
	const {sorting, type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {dataKey, descriptor, group, source, sourceForCompute, xAxis} = set;

		data[dataKey] = {
			descriptor,
			group: transformGroupFormat(group),
			source: getSourceValue(source),
			sourceForCompute,
			xAxis
		};

		if (!set.sourceForCompute) {
			const {aggregation, showEmptyData, type, yAxis} = set;
			data[dataKey] = {
				...data[dataKey],
				aggregation: transformAggregation(aggregation, type),
				showEmptyData,
				type,
				yAxis: resetComputedAttributeState(yAxis)
			};

			data[dataKey] = mixinBreakdown(set, data[dataKey], true);
		}
	});

	return {
		data,
		sorting,
		type
	};
};

const createSummaryData = (widget: SummaryWidget | SpeedometerWidget) => {
	const {type} = widget;
	const data: Object = {};

	widget.data.forEach(set => {
		const {dataKey, descriptor, source} = set;

		data[dataKey] = {
			descriptor,
			source: getSourceValue(source),
			sourceForCompute: true
		};

		if (!set.sourceForCompute) {
			const {aggregation, indicator} = set;
			data[dataKey] = {
				...data[dataKey],
				aggregation: transformAggregation(aggregation, type),
				indicator: resetComputedAttributeState(indicator),
				sourceForCompute: false
			};
		}
	});

	return {
		data,
		type
	};
};

const createTableData = (widget: TableWidget) => {
	const {calcTotalColumn, showEmptyData, table, type} = widget;
	const {showRowNum} = table.body;
	const data: Object = {};

	widget.data.forEach(set => {
		const {dataKey, descriptor, parameters, source} = set;

		data[dataKey] = {
			descriptor,
			parameters: parameters.map(parameter => ({...parameter, group: transformGroupFormat(parameter.group)})),
			source: getSourceValue(source),
			sourceForCompute: true
		};

		if (!set.sourceForCompute) {
			const {dataKey, indicators} = set;

			data[dataKey] = {
				...data[dataKey],
				indicators: indicators.map(indicator => ({
						...indicator,
						attribute: resetComputedAttributeState(indicator.attribute)
					})
				),
				sourceForCompute: false
			};

			data[dataKey] = mixinBreakdown(set, data[dataKey], true);
		}
	});

	return {
		calcTotalColumn,
		data,
		showEmptyData,
		showRowNum,
		type
	};
};

const createPostData = (widget: Widget): PostData | void => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SPEEDOMETER, SUMMARY, TABLE} = WIDGET_TYPES;

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
		case SPEEDOMETER:
		case SUMMARY:
			return createSummaryData(widget);
		case TABLE:
			return createTableData(widget);
	}
};

/**
 * Получаем данные графиков для всех виджетов
 * @param {Array<AnyWidget>} widgets - список виджетов
 * @returns {ThunkAction}
 */
const fetchAllBuildData = (widgets: Array<AnyWidget>): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {layoutMode} = getState().dashboard.settings;
	const filteredWidgets = widgets.filter(item => (item.displayMode === layoutMode || item.displayMode === DISPLAY_MODE.ANY));

	filteredWidgets.forEach(widget => dispatch(fetchBuildData(widget)));
};

/**
 * Получаем данные графика для конкретного виджета
 * @param {AnyWidget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchBuildData = (widget: AnyWidget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	if (widget.type in DIAGRAM_WIDGET_TYPES) {
		dispatch(requestBuildData(widget.id));

		try {
			const {subjectUuid} = getState().context;
			// $FlowFixMe
			const payload = createPostData(widget);
			const data = await window.jsApi.restCallModule('dashboardDataSet', 'getDataForCompositeDiagram', payload, subjectUuid);

			dispatch(
				receiveBuildData({data, id: widget.id})
			);
		} catch (e) {
			dispatch(recordBuildDataError(widget.id));
		}
	}
};

const receiveBuildData = (payload: ReceiveBuildDataPayload) => ({
	payload,
	type: BUILD_DATA_EVENTS.RECEIVE_BUILD_DATA
});

const recordBuildDataError = (payload: string) => ({
	payload,
	type: BUILD_DATA_EVENTS.RECORD_BUILD_DATA_ERROR
});

const requestBuildData = (payload: string) => ({
	payload,
	type: BUILD_DATA_EVENTS.REQUEST_BUILD_DATA
});

export {
	fetchBuildData,
	fetchAllBuildData
};
