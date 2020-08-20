// @flow
import {addLayouts, removeLayouts, replaceLayoutsId, saveNewLayouts} from 'store/dashboard/layouts/actions';
import {batchActions} from 'redux-batched-actions';
import {buildUrl, client} from 'utils/api';
import {createToast} from 'store/toasts/actions';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {editDashboard} from 'store/dashboard/settings/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {getParams} from 'store/helpers';
import {isObject} from 'src/helpers';
import {LIMIT, WIDGETS_EVENTS} from './constants';
import NewWidget from 'store/widgets/data/NewWidget';
import normalizer from 'utils/normalizer';
import type {Widget} from './types';

/**
 * Добавляет новый виджет
 * @param {NewWidget} payload - объект нового виджета
 * @returns {ThunkAction}
 */
const addWidget = (payload: NewWidget): ThunkAction => (dispatch: Dispatch, getState: GetState): void => {
	const {map} = getState().widgets.data;

	if (Object.keys(map).length >= LIMIT) {
		return dispatch(createToast({
			text: `На дашборд можно вывести не больше ${LIMIT} виджетов.
			Чтобы добавить на текущий дашборд виджет, удалите один из существующих.`,
			type: 'error'
		}));
	}

	dispatch(addLayouts(NewWidget.id));
	dispatch({
		payload,
		type: WIDGETS_EVENTS.ADD_WIDGET
	});
};

/**
 * Сбрасывает выбранный виджет
 * @returns {ThunkAction}
 */
const cancelForm = (): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(resetWidget());
};

/**
 * Сохраняет изменение данных виджета
 * @param {Widget} settings - данные формы редактирования
 * @returns {ThunkAction}
 */
const saveWidget = (settings: Widget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		const url = buildUrl('dashboardSettings', 'editWidget', 'requestContent,user');
		const params = {
			...getParams(),
			widget: settings
		};
		const {data: widget} = await client.post(url, params);

		dispatch(updateWidget(widget));
		dispatch(saveNewLayouts());
		dispatch(fetchBuildData(widget));
	} catch (e) {
		validationErrors = getValidationErrors(e);

		dispatch(recordSaveError());
	}

	return validationErrors;
};

/**
 * Сохраняет изменение части данных виджета
 * @param {Widget} widget - данные виджета
 * @param {object} chunkData - данные которые нужно изменить
 * @returns {ThunkAction}
 */
const editWidgetChunkData = (widget: Widget, chunkData: Object): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		const url = buildUrl('dashboardSettings', 'editWidgetChunkData', 'requestContent,user');
		const params = {
			...getParams(),
			chunkData,
			id: widget.id
		};
		const updatedWidgetData = {
			...widget,
			...chunkData
		};

		await client.post(url, params);

		dispatch(updateWidget(updatedWidgetData));
		dispatch(fetchBuildData(updatedWidgetData));
	} catch (e) {
		dispatch(recordSaveError());
	}
};

/**
 * Создает новый виджет
 * @param {Widget} settings - данные формы создания виджета
 * @returns {ThunkAction}
 */
const createWidget = (settings: Widget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		const url = buildUrl('dashboardSettings', 'createWidget', 'requestContent,user');
		const params = {
			...getParams(),
			widget: settings
		};
		const {data: widget} = await client.post(url, params);

		dispatch(batchActions([
			deleteWidget(NewWidget.id),
			replaceLayoutsId(NewWidget.id, widget.id),
			setCreatedWidget(widget),
			fetchBuildData(widget)
		]));
		dispatch(saveNewLayouts());
	} catch (e) {
		validationErrors = getValidationErrors(e);

		dispatch(recordSaveError());
	}

	return validationErrors;
};

/**
 * Удаляет виджет
 * @param {string} widgetId - идентификатор виджета;
 * @returns {ThunkAction}
 */
const removeWidget = (widgetId: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestWidgetDelete());

	try {
		const url = buildUrl('dashboardSettings', 'deleteWidget', 'requestContent,user');
		const params = {
			...getParams(),
			widgetId
		};

		await client.post(url, params);
		dispatch(removeLayouts(widgetId));
		dispatch(deleteWidget(widgetId));
		dispatch(saveNewLayouts());
	} catch (e) {
		dispatch(recordDeleteError());
	}
};

/**
 * Устанавливает выбранный виджет для последующего редактирования
 * @param {string} payload - id виджета
 * @returns {ThunkAction}
 */
const selectWidget = (payload: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(setSelectedWidget(payload));
	dispatch(editDashboard());
};

const getValidationErrors = (error: Object) => {
	const {response} = error;
	let errors;

	if (response && response.status === 500) {
		const data = JSON.parse(response.data.split('error:')[1]);

		if (isObject(data) && isObject(data.errors)) {
			errors = data.errors;
		}
	}

	return errors;
};

const deleteWidget = (payload: string) => ({
	payload,
	type: WIDGETS_EVENTS.DELETE_WIDGET
});

const recordDeleteError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR
});

const recordSaveError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR
});

const requestWidgetDelete = () => ({
	type: WIDGETS_EVENTS.REQUEST_WIDGET_DELETE
});

const requestWidgetSave = () => ({
	type: WIDGETS_EVENTS.REQUEST_WIDGET_SAVE
});

const resetWidget = () => ({
	type: WIDGETS_EVENTS.RESET_WIDGET
});

const setCreatedWidget = (payload: Widget) => ({
	payload,
	type: WIDGETS_EVENTS.SET_CREATED_WIDGET
});

const setSelectedWidget = (payload: string) => ({
	payload,
	type: WIDGETS_EVENTS.SET_SELECTED_WIDGET
});

const setWidgets = (payload: Array<Widget>): Object => ({
	payload: payload.map(normalizer.widget),
	type: WIDGETS_EVENTS.SET_WIDGETS
});

const updateWidget = (payload: Widget) => ({
	payload,
	type: WIDGETS_EVENTS.UPDATE_WIDGET
});

export {
	addWidget,
	cancelForm,
	createWidget,
	editWidgetChunkData,
	removeWidget,
	resetWidget,
	saveWidget,
	selectWidget,
	setSelectedWidget,
	setWidgets,
	updateWidget
};
