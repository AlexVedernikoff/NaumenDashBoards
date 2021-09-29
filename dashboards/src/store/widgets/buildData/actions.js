// @flow
import type {AnyWidget, AxisWidget, Chart, ComboWidget, SummaryWidget, TableWidget, Widget} from 'store/widgets/data/types';
import api from 'api';
import {ApiError} from 'api/errors';
import type {AppState, Dispatch, GetState, ThunkAction} from 'store/types';
import {BUILD_DATA_EVENTS} from './constants';
import {DEFAULT_NUMBER_AXIS_FORMAT, LIMITS, WIDGET_SETS, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {DiagramBuildData, ReceiveBuildDataPayload, TableBuildData} from './types';
import {editWidgetChunkData, updateWidget} from 'store/widgets/data/actions';
import {exportSheet, getSnapshotName} from 'utils/export';
import {getAllWidgets} from 'store/widgets/data/selectors';
import {getWidgetFilterOptionsDescriptors, removeCodesFromTableData} from './helpers';
import {INTEGER_AGGREGATION} from 'store/widgets/constants';
import t from 'localization';

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
	const data = await api.instance.dashboardDataSet.getDataForTableDiagram(
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
			let error = t('store::buildData::DEFAULT_RECORD_BUILD_DATA_ERROR');

			if (e instanceof ApiError) {
				error = e.message;
			}

			dispatch(recordBuildDataError(widget.id, error));
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
	const name = getSnapshotName(widget.name);

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

			const data = await api.instance.dashboardDataSet.getDataForCompositeDiagram(
				dashboard.settings.code,
				widget.id,
				context.subjectUuid,
				widgetFilters
			);

			await dispatch(checkDiagramsDataLimits(widget.id, data));
			await dispatch(checkComputedFormat(widget.id, data));
			dispatch(receiveBuildData({data, id: widget.id}));
		} catch (e) {
			let error = t('store::buildData::DEFAULT_RECORD_BUILD_DIAGRAM_ERROR');

			if (e instanceof ApiError) {
				error = e.message;
			}

			dispatch(recordBuildDataError(widget.id, error));
		}
	};

/**
 * Проверяет и согласовывает ограничения и вид отображения виджета
 *
 * @param {string} widgetId - id виджет для проверки
 * @param {DiagramBuildData} data - данные для проверки отображения
 * @returns {ThunkAction<Promise>} - обещание, которое будет разрешено после всех проверок и согласований с пользователем.
 */
const checkDiagramsDataLimits = (widgetId: string, data: DiagramBuildData): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		const widgets = getAllWidgets(getState());
		const widget = widgets.find(item => item.id === widgetId);

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
 * Проверяет и согласовывает вид меток по умолчанию. Для данных с целочисленным форматом - формат по умолчанию с 0 значений, для нецелочисленных с 2
 *
 * @param {string} widgetId - id виджет для проверки
 * @param {DiagramBuildData} data - данные для проверки отображения
 * @returns {ThunkAction<Promise>} - обещание, которое будет разрешено после всех проверок
 */
const checkComputedFormat = (widgetId: string, data: DiagramBuildData): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		const widgets = getAllWidgets(getState());
		const widget = widgets.find(item => item.id === widgetId);

		let useDecimal = false;

		if (widget.type in WIDGET_SETS.AXIS || widget.type in WIDGET_SETS.CIRCLE || widget.type === WIDGET_TYPES.COMBO) {
			// $FlowFixMe проверка типов выше
			const chart = (widget: Chart);

			if (chart.type in WIDGET_SETS.AXIS || chart.type === WIDGET_TYPES.COMBO) {
				data.series.forEach(({data: items = []}) => {
					useDecimal = useDecimal || items.some(val => !Number.isInteger(Number.parseFloat(val)));
				});
			}

			if (chart.type in WIDGET_SETS.CIRCLE) {
				useDecimal = data.series.some(val => !Number.isInteger(val));
			}

			const dataLabels = {
				...chart.dataLabels,
				computedFormat: {
					...DEFAULT_NUMBER_AXIS_FORMAT,
					symbolCount: useDecimal ? 2 : 0
				}
			};
			const updatedWidgetData = {
				...widget,
				dataLabels
			};

			await dispatch(updateWidget(updatedWidgetData));
		}

		if (widget.type === WIDGET_TYPES.SUMMARY) {
			// $FlowFixMe проверка типов выше
			const summary = (widget: SummaryWidget);

			if (!summary.indicator.format) {
				const data = summary.data.find(({sourceForCompute}) => !sourceForCompute);

				if (data && data.indicators?.[0]?.aggregation === INTEGER_AGGREGATION.AVG) {
					let {indicator} = summary;

					indicator = {...indicator, computedFormat: {...DEFAULT_NUMBER_AXIS_FORMAT, symbolCount: 2}};
					const updatedWidgetData = {...summary, indicator};

					await dispatch(updateWidget(updatedWidgetData));
				}
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

const recordBuildDataError = (widgetId: string, message: string) => ({
	payload: {message, widgetId},
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
