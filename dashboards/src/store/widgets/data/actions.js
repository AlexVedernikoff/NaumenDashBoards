// @flow
import {buildUrl, client} from 'utils/api';
import {createToast} from 'store/toasts/actions';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {editDashboard} from 'store/dashboard/actions';
import {fetchAllBuildData, fetchBuildData} from 'store/widgets/buildData/actions';
import {getParams} from 'store/helpers';
import {isObject} from 'src/helpers';
import type {Layout} from 'utils/layout/types';
import {LIMIT, WIDGETS_EVENTS} from './constants';
import {NewWidget} from 'utils/widget';
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

	dispatch({
		type: WIDGETS_EVENTS.ADD_WIDGET,
		payload
	});
};

/**
 * Сохраняет локально изменение положения виджетов
 * @param {Layout} payload - массив объектов местоположения виджетов на дашборде
 * @returns {ThunkAction}
 */
const editLayout = (payload: Layout): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(setNewLayout(payload));
};

/**
 * Сохраняет в изменение положения виджетов
 * @returns {ThunkAction}
 */
const saveNewLayout = (): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	dispatch(requestLayoutSave());

	try {
		const state = getState();
		const {widgets} = getState();
		const widgetMap = widgets.data.map;
		const layouts = Object.keys(widgetMap).map(key => ({
			key: key,
			value: widgetMap[key].layout
		}));
		const url = buildUrl('dashboardSettings', 'editLayouts', 'requestContent,user');
		const params = {
			...getParams(state),
			layouts
		};

		await client.post(url, params);
	} catch (e) {
		dispatch(recordLayoutSaveError());
	}
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
 * @param {Widget} widget - данные формы редактирования
 * @returns {ThunkAction}
 */
const saveWidget = (widget: Widget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		const state = getState();
		const url = buildUrl('dashboardSettings', 'editWidget', 'requestContent,user');
		const params = {
			...getParams(state),
			widget
		};
		await client.post(url, params);

		dispatch(updateWidget(widget));
		dispatch(saveNewLayout());
		dispatch(fetchBuildData(widget));
	} catch (e) {
		validationErrors = getValidationErrors(e);

		dispatch(recordSaveError());
	}

	return validationErrors;
};

/**
 * Сохраняет массив виджетов и получает данные для построения
 * @param {Array<object>} widgets - данные формы редактирования
 * @returns {ThunkAction}
 */
const setWidgets = (widgets: Array<Object>): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const payload = widgets.map(normalizer.widget);

	dispatch({
		type: WIDGETS_EVENTS.SET_WIDGETS,
		payload
	});
	await dispatch(fetchAllBuildData(payload));
};

/**
 * Создает новый виджет
 * @param {Widget} widget - данные формы создания виджета
 * @returns {ThunkAction}
 */
const createWidget = (widget: Widget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		const state = getState();
		const url = buildUrl('dashboardSettings', 'createWidget', 'requestContent,user');
		const params = {
			...getParams(state),
			widget
		};
		const {data: id} = await client.post(url, params);

		const createdWidget = {...widget, id, layout: {...widget.layout, i: id}};
		dispatch(setCreatedWidget(createdWidget));
		dispatch(fetchBuildData(createdWidget));
		dispatch(saveNewLayout());
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
const removeWidget = (widgetId: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestWidgetDelete());

	try {
		const url = buildUrl('dashboardSettings', 'deleteWidget', 'requestContent,user');
		const params = {
			...getParams(getState()),
			widgetId
		};

		await client.post(url, params);
		dispatch(deleteWidget(widgetId));
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
	type: WIDGETS_EVENTS.DELETE_WIDGET,
	payload
});

const recordDeleteError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR
});

const recordLayoutSaveError = () => ({
	type: WIDGETS_EVENTS.RECORD_LAYOUT_SAVE_ERROR
});

const recordSaveError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR
});

const requestLayoutSave = () => ({
	type: WIDGETS_EVENTS.REQUEST_LAYOUT_SAVE
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
	type: WIDGETS_EVENTS.SET_CREATED_WIDGET,
	payload
});

const setNewLayout = (payload: Layout) => ({
	type: WIDGETS_EVENTS.EDIT_LAYOUT,
	payload
});

const setSelectedWidget = (payload: string) => ({
	type: WIDGETS_EVENTS.SET_SELECTED_WIDGET,
	payload
});

const updateWidget = (payload: Widget) => ({
	type: WIDGETS_EVENTS.UPDATE_WIDGET,
	payload
});

export {
	addWidget,
	cancelForm,
	createWidget,
	editLayout,
	removeWidget,
	resetWidget,
	saveWidget,
	selectWidget,
	setSelectedWidget,
	setWidgets,
	updateWidget
};
