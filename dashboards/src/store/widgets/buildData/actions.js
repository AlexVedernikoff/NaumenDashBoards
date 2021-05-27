// @flow
import type {AnyWidget, AxisWidget, TableWidget, Widget} from 'store/widgets/data/types';
import {BUILD_DATA_EVENTS} from './constants';
import type {DiagramBuildData, ReceiveBuildDataPayload} from './types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {editWidgetChunkData} from 'store/widgets/data/actions';
import {getWidgetFilterOptionsDescriptors} from './helpers';
import {LIMITS, WIDGET_SETS, WIDGET_TYPES} from 'store/widgets/data/constants';

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

		await dispatch(checkDiagramsDataLimits(widget, data));
		dispatch(receiveBuildData({data, id: widget.id}));
	} catch (e) {
		dispatch(recordBuildDataError(widget.id));
	}
};

/**
 * Проверяет и согласовывает ограничения и вид отображения виджета
 *
 * @param {AnyWidget} widget - виджет для проверки
 * @param {DiagramBuildData} data - данные для проверки отображения
 * @returns {ThunkAction<Promise>} - обещание, которое будет разрешено после всех проверок и согласований с пользователем.
 */
const checkDiagramsDataLimits = (widget: AnyWidget, data: DiagramBuildData): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		if (widget.type in WIDGET_SETS.AXIS) {
			// $FlowFixMe widget.type in WIDGET_SETS.AXIS
			const axisWidget: AxisWidget = widget;
			const sumDataValues = data?.series.reduce((sum, s) => sum + s.data.length, 0) ?? 0;
			let dataLabels = null;

			if (sumDataValues > LIMITS.DATA_LABELS_LIMIT) {
				dataLabels = {...axisWidget.dataLabels, disabled: true, show: false};
			} else {
				if (axisWidget.dataLabels.disabled) {
					dataLabels = {...axisWidget.dataLabels, disabled: false};
				}
			}

			if (dataLabels) {
				await dispatch(editWidgetChunkData(axisWidget, {dataLabels}, false));
			}
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
