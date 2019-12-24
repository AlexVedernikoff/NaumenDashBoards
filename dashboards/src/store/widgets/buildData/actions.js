// @flow
import {AXIS_FIELDS, CIRCLE_FIELDS, COMBO_FIELDS, SUMMARY_FIELDS, TABLE_FIELDS} from 'components/organisms/WidgetFormPanel/constants/fields';
import {buildUrl, client} from 'utils/api';
import type {BuildDataMap, ReceiveBuildDataPayload} from './types';
import {createOrdinalName, WIDGET_VARIANTS} from 'utils/widget';
import {BUILD_DATA_EVENTS} from './constants';
import {DEFAULT_AGGREGATION} from 'components/molecules/AttributeRefInput/constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {CHART_VARIANTS} from 'utils/chart';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import type {OptionType} from 'react-select/src/types';
import type {Widget} from 'store/widgets/data/types';

const getValue = (option: OptionType) => option && option.value;

const createAxisChartData = (widget: Widget) => {
	const {BAR_STACKED, COLUMN_STACKED} = CHART_VARIANTS;
	const {COUNT, PERCENT} = DEFAULT_AGGREGATION;
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

const createPostData = (widget: Widget, {dataKey, ...fields}: Object) => {
	const {aggregation, source} = FIELDS;
	const {COUNT, PERCENT} = DEFAULT_AGGREGATION;
	const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = CHART_VARIANTS;
	const {order, type} = widget;
	let data: Object = {};

	if (Array.isArray(order)) {
		data = {
			data: {},
			type
		};

		order.forEach(number => {
			let sourceData = {};
			sourceData[source] = getValue(widget[createOrdinalName(source, number)]);

			Object.keys(fields).forEach(field => {
				if (field === source) {
					sourceData[field] = getValue(widget[createOrdinalName(field, number)]);
					return;
				}

				/*
				Когда для графика с накоплением пользователь выбирает агрегацию в процентах,
				нам нужно провести замену значения агрегации для подсчета данных на бэке т.к
				для отображения графику необходимо все также количество.
				*/
				if (field === aggregation) {
					let aggregationValue = widget[createOrdinalName(field, number)];
					const widgetType = widget[type];

					if (aggregationValue === PERCENT && (widgetType === BAR_STACKED || widgetType === COLUMN_STACKED)) {
						aggregationValue = COUNT;
					}

					sourceData[field] = aggregationValue;
					return;
				}

				sourceData[field] = widget[createOrdinalName(field, number)];
			});

			data.data[widget[createOrdinalName(dataKey, number)]] = sourceData;
		});
	} else {
		data = [DONUT, PIE].includes(type) ? createCircleChartData(widget) : createAxisChartData(widget);
	}

	return data;
};

const resolve = (type: string) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;

	const creators = {
		[BAR]: AXIS_FIELDS,
		[BAR_STACKED]: AXIS_FIELDS,
		[COLUMN]: AXIS_FIELDS,
		[COLUMN_STACKED]: AXIS_FIELDS,
		[COMBO]: COMBO_FIELDS,
		[DONUT]: CIRCLE_FIELDS,
		[LINE]: AXIS_FIELDS,
		[PIE]: CIRCLE_FIELDS,
		[SUMMARY]: SUMMARY_FIELDS,
		[TABLE]: TABLE_FIELDS
	};

	return creators[type];
};

/**
 * Получаем данные графиков для всех виджетов
 * @param {Array<Widget>} widgets - список виджетов
 * @returns {ThunkAction}
 */
const fetchAllBuildData = (widgets: Array<Widget>): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let postData = {};
		const {subjectUuid} = getState().dashboard.context;

		dispatch(requestAllBuildData(widgets));

		widgets.forEach(widget => {
			const {type} = widget;
			const fields = resolve(type);
			postData[widget.id] = createPostData(widget, fields);
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
		const {type} = widget;
		const {subjectUuid} = getState().dashboard.context;
		const fields = resolve(type);
		const postData = createPostData(widget, fields);
		const {data} = await client.post(buildUrl('dashboardDataSet', 'getDataForCompositeDiagram', `requestContent,'${subjectUuid}'`), postData);

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
