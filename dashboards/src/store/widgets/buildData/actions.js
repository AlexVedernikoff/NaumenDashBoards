// @flow
import type {AnyWidget, AxisWidget, ComboWidget, TableWidget, Widget} from 'store/widgets/data/types';
import api from 'api';
import type {AppState, Dispatch, GetState, ThunkAction} from 'store/types';
import {BUILD_DATA_EVENTS} from './constants';
import {createContextName, exportSheet} from 'utils/export';
import type {DiagramBuildData, ReceiveBuildDataPayload, TableBuildData} from './types';
import {editWidgetChunkData} from 'store/widgets/data/actions';
import {getWidgetFilterOptionsDescriptors, removeCodesFromTableData} from './helpers';
import {LIMITS, WIDGET_SETS, WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Получаем данные для таблицы
 * @param {AppState} state - данные по окружению
 * @param {TableWidget} widget - данные виджета
 * @param {number} pageNumber - номер текущей строки
 * @param {number} pageSize - размер страицы
 * @returns {Promise<TableBuildData>}
 */
const getDataForTableDiagram = async (state: AppState, widget: TableWidget, pageNumber: number, pageSize: number): Promise<TableBuildData> => {
	const {context, dashboard} = state;
	const {
		ignoreDataLimits: ignoreLimits = {
			breakdown: false,
			parameter: false
		},
		sorting
	} = widget;
	const requestData = {
		ignoreLimits,
		pageNumber,
		pageSize,
		sorting
	};
	const widgetFilters = getWidgetFilterOptionsDescriptors(widget);
	const data = await api.dashboardDataSet.getDataForTableDiagram(
		dashboard.settings.code,
		widget.id,
		context.subjectUuid,
		requestData,
		widgetFilters
	);
	return data;
};

/**
 * Обновление данные для таблицы
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
			const state = getState();
			const {table} = widget;
			const {pageSize} = table.body;
			const data = await getDataForTableDiagram(state, widget, pageNumber, pageSize);

			dispatch(
				receiveBuildData({data: {...data, page: pageNumber}, id: widget.id})
			);
		} catch (e) {
			dispatch(recordBuildDataError(widget.id));
		}
	};

/**
 * Экспортируем таблицу в XLSX
 * @param {TableWidget} widget - данные виджета
 * @param {number} rowCount - количество записей для экспорта
 * @returns {ThunkAction}
 */
const exportTableToXLSX = (widget: TableWidget, rowCount: number = 1e4): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const state = getState();
	const data = await getDataForTableDiagram(state, widget, 1, rowCount);
	const contextName = await createContextName();
	const name = `${widget.name}_${contextName}`;

	return exportSheet(name, removeCodesFromTableData(data));
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

			const data = await api.dashboardDataSet.getDataForCompositeDiagram(
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
		if (widget.type in WIDGET_SETS.AXIS || widget.type === WIDGET_TYPES.COMBO) {
			// $FlowFixMe widget.type in WIDGET_SETS.AXIS
			const axisWidget: (AxisWidget | ComboWidget) = widget;
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
	fetchTableBuildData,
	exportTableToXLSX
};
