// @flow
import {addLayouts, removeLayouts, replaceLayoutsId, saveNewLayouts} from 'store/dashboard/layouts/actions';
import {batch} from 'react-redux';
import {createToast} from 'store/toasts/actions';
import type {Dispatch, GetState, ResponseError, ThunkAction} from 'store/types';
import {editDashboard} from 'store/dashboard/settings/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {getParams, parseResponseErrorText} from 'store/helpers';
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

	batch(() => {
		dispatch({
			payload,
			type: WIDGETS_EVENTS.ADD_WIDGET
		});
		dispatch(addLayouts(NewWidget.id));
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
const saveWidget = (settings: Widget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		const payload = {
			...getParams(),
			widget: settings
		};
		const widget = await window.jsApi.restCallModule('dashboardSettings', 'editWidget', payload);

		dispatch(updateWidget(widget));
		dispatch(saveNewLayouts());
		dispatch(fetchBuildData(widget));
	} catch (e) {
		validationErrors = getErrors(e);

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
const editWidgetChunkData = (widget: Widget, chunkData: Object): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const payload = {
			...getParams(),
			chunkData,
			id: widget.id
		};
		const updatedWidgetData = {
			...widget,
			...chunkData
		};

		await window.jsApi.restCallModule('dashboardSettings', 'editWidgetChunkData', payload);

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
const createWidget = (settings: Widget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		const payload = {
			...getParams(),
			widget: settings
		};
		const widget = await window.jsApi.restCallModule('dashboardSettings', 'createWidget', payload);

		batch(() => {
			dispatch(deleteWidget(NewWidget.id));
			dispatch(replaceLayoutsId(NewWidget.id, widget.id));
			dispatch(setCreatedWidget(widget));
			dispatch(fetchBuildData(widget));
		});
		dispatch(saveNewLayouts());
	} catch (e) {
		validationErrors = getErrors(e);
		dispatch(recordSaveError());
	}

	return validationErrors;
};

/**
 * Копирует виджет
 * @param {string} widgetId - идентификатор виджета
 * @returns {ThunkAction}
 */
const copyWidget = (widgetId: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch({
		type: WIDGETS_EVENTS.REQUEST_WIDGET_COPY
	});

	try {
		const payload = {
			...getParams(),
			widgetKey: widgetId
		};
		const widget = await window.jsApi.restCallModule('dashboardSettings', 'copyWidgetToDashboard', payload);

		batch(() => {
			dispatch(setCreatedWidget(widget));
			dispatch(addLayouts(widget.id));
			dispatch(fetchBuildData(widget));
		});
		dispatch(saveNewLayouts());
		dispatch({
			type: WIDGETS_EVENTS.RESPONSE_WIDGET_COPY
		});
	} catch (e) {
		dispatch({
			type: WIDGETS_EVENTS.RECORD_WIDGET_COPY_ERROR
		});
	}
};

/**
 * Удаляет виджет
 * @param {string} widgetId - идентификатор виджета;
 * @returns {ThunkAction}
 */
const removeWidget = (widgetId: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestWidgetDelete());

	try {
		const payload = {
			...getParams(),
			widgetId
		};

		await window.jsApi.restCallModule('dashboardSettings', 'deleteWidget', payload);
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

/**
 * Возвращает объект ошибок из ответа сервера
 * @param {ResponseError} error - серверная ошибка
 * @returns {object | void}
 */
const getErrors = (error: ResponseError) => {
	const {responseText, status} = error;
	let errors;

	if (status === 500) {
		const data = parseResponseErrorText(responseText);

		if (isObject(data)) {
			// $FlowFixMe
			errors = data.errors;
		}
	}

	return errors;
};

/**
 * Проверяет является ли выбранный виджет валидным для копирования
 * @param {string} widgetKey - id виджета
 * @returns {ThunkAction}
 */
const validateWidgetToCopy = (widgetKey: string): ThunkAction => async (dispatch: Dispatch): Promise<boolean> => {
	let isValid = true;

	dispatch({
		type: WIDGETS_EVENTS.REQUEST_VALIDATE_TO_COPY
	});

	try {
		const payload = {
			...getParams(),
			widgetKey
		};

		const {result} = await window.jsApi.restCallModule('dashboardSettings', 'widgetIsBadToCopy', payload);
		isValid = !result;

		dispatch({
			type: WIDGETS_EVENTS.RESPONSE_VALIDATE_TO_COPY
		});
	} catch (e) {
		dispatch({
			type: WIDGETS_EVENTS.RECORD_VALIDATE_TO_COPY_ERROR
		});
	}

	return isValid;
};

/**
 * Устанавливает выбранный виджет для редактирования
 * @param {string} widgetId - уникальный идентификатор выбранного виджета
 * @returns {ThunkAction}
 */
const setSelectedWidget = (widgetId: string) => (dispatch: Dispatch, getState: GetState) => {
	const {selectedWidget} = getState().widgets.data;

	if (selectedWidget === NewWidget.id) {
		dispatch(deleteWidget(selectedWidget));
		dispatch(removeLayouts(selectedWidget));
	}

	dispatch({
		payload: widgetId,
		type: WIDGETS_EVENTS.SET_SELECTED_WIDGET
	});
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

const setWidgets = (widgets: Array<Widget>): Object => {
	const payload = widgets
		.map(rawWidget => {
			let widget;

			try {
				widget = normalizer.widget(rawWidget);
			} catch (e) {
				widget = null;
			}

			return widget;
		})
		.filter(widget => widget);

	return ({
		payload,
		type: WIDGETS_EVENTS.SET_WIDGETS
	});
};

const updateWidget = (payload: Widget) => ({
	payload,
	type: WIDGETS_EVENTS.UPDATE_WIDGET
});

export {
	addWidget,
	cancelForm,
	copyWidget,
	createWidget,
	editWidgetChunkData,
	removeWidget,
	resetWidget,
	saveWidget,
	selectWidget,
	setSelectedWidget,
	setWidgets,
	updateWidget,
	validateWidgetToCopy
};
