// @flow
import type {AnyWidget, TableWidget, Widget} from 'store/widgets/data/types';
import {BUILD_DATA_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getWidgetFilterOptionsDescriptors} from './helpers';
import type {ReceiveBuildDataPayload} from './types';
import {WIDGET_TYPES} from 'src/store/widgets/data/constants';

/**
 * Получаем данные для таблицы
 * @param {TableWidget} widget - данные виджета
 * @param {number} pageNumber - номер текущей строки
 * @param {boolean} update - сообщает о необходимости обновить данные или получить их заново
 * @returns {ThunkAction}
 */
const fetchTableBuildData = (widget: TableWidget, pageNumber: number = 1, update: boolean = false): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	update
		? dispatch({payload: widget.id, type: BUILD_DATA_EVENTS.UPDATE_BUILD_DATA})
		: dispatch({payload: widget, type: BUILD_DATA_EVENTS.REQUEST_BUILD_DATA});

	try {
		const {context, dashboard} = getState();
		const {
			ignoreDataLimits: ignoreLimits = {
				breakdown: false,
				parameter: false
			},
			sorting,
			table
		} = widget;
		const requestData = {
			ignoreLimits,
			pageNumber,
			pageSize: table.body.pageSize,
			sorting
		};
		const widgetFilters = getWidgetFilterOptionsDescriptors(widget);
		const data = await window.jsApi.restCallModule(
			'dashboardDataSet',
			'getDataForTableDiagram',
			dashboard.settings.code,
			widget.id,
			context.subjectUuid,
			requestData,
			widgetFilters
		);

		dispatch(
			receiveBuildData({data: {...data, page: pageNumber}, id: widget.id})
		);
	} catch (e) {
		dispatch(recordBuildDataError(widget.id));
	}
};

/**
 * Получаем данные построения для диаграмм
 * @param {Widget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchDiagramBuildData = (widget: Widget): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestBuildData(widget));

		try {
			const {context, dashboard} = getState();
			const widgetFilters = getWidgetFilterOptionsDescriptors(widget);

			const data = await window.jsApi.restCallModule(
				'dashboardDataSet',
				'getDataForCompositeDiagram',
				dashboard.settings.code,
				widget.id,
				context.subjectUuid,
				widgetFilters
			);

		dispatch(
			receiveBuildData({data, id: widget.id})
		);
	} catch (e) {
		dispatch(recordBuildDataError(widget.id));
	}
};

/**
 * Получаем данные построения для конкретного виджета
 * @param {Widget} widget - данные виджета
 * @returns {ThunkAction}
 */
const fetchBuildData = (widget: Widget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {TABLE} = WIDGET_TYPES;

	switch (widget.type) {
		case TABLE:
			return dispatch(fetchTableBuildData(widget));
		default:
			return dispatch(fetchDiagramBuildData(widget));
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

const requestBuildData = (payload: AnyWidget) => ({
	payload,
	type: BUILD_DATA_EVENTS.REQUEST_BUILD_DATA
});

export {
	fetchBuildData,
	fetchTableBuildData
};
