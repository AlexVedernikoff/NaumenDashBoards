// @flow
import {addLayouts, removeLayouts, replaceLayoutsId, saveNewLayouts} from 'store/dashboard/layouts/actions';
import type {AnyWidget, Chart, SetWidgetWarning, ValidateWidgetToCopyResult, Widget} from './types';
import {batch} from 'react-redux';
import {CHART_COLORS_SETTINGS_TYPES, LIMITS, WIDGETS_EVENTS} from './constants';
import {createToast} from 'store/toasts/actions';
import {DASHBOARD_EVENTS} from 'store/dashboard/settings/constants';
import {deepClone, isObject} from 'helpers';
import type {Dispatch, GetState, ResponseError, ThunkAction} from 'store/types';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {fetchCustomGroups} from 'store/customGroups/actions';
import {fetchSourcesFilters} from 'store/sources/sourcesFilters/actions';
import {getAllWidgets} from 'store/widgets/data/selectors';
import {getCustomColorsSettingsKey, updateNewWidgetCustomColorsSettings} from './helpers';
import {getParams, parseResponseErrorText} from 'store/helpers';
import {hasChartColorsSettings} from 'store/widgets/helpers';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';
import NewWidget from 'store/widgets/data/NewWidget';
import {resizer as dashboardResizer} from 'app.constants';
import {saveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';

/**
 * Добавляет новый виджет
 * @returns {ThunkAction}
 */
const checkWidgetsCount = () => (dispatch: Dispatch, getState: GetState): void => {
	const {map} = getState().widgets.data;
	const {DASHBOARD_WIDGET_COUNT_LIMIT: LIMIT} = LIMITS;

	if (Object.keys(map).length >= LIMIT) {
		throw dispatch(createToast({
			text: `На дашборд можно вывести не больше ${LIMIT} виджетов.
			Чтобы добавить на текущий дашборд виджет, удалите один из существующих.`,
			type: 'error'
		}));
	}
};

/**
 * Добавляет новый виджет
 * @param {NewWidget} payload - объект нового виджета
 * @returns {ThunkAction}
 */
const addNewWidget = (payload: NewWidget): ThunkAction => (dispatch: Dispatch): void => {
		dispatch(checkWidgetsCount());

		batch(() => {
			dispatch(focusWidget(payload.id));
			dispatch({payload, type: WIDGETS_EVENTS.ADD_WIDGET});
			dispatch({type: DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE});
			dispatch(addLayouts(NewWidget.id, payload.recommendedPosition));
		});
};

/**
 * Сбрасывает выбранный виджет
 * @returns {ThunkAction}
 */
const cancelForm = (): ThunkAction => (dispatch: Dispatch, getState: GetState): void => {
	const {selectedWidget} = getState().widgets.data;

	if (selectedWidget === NewWidget.id) {
		batch(() => {
			dispatch(deleteWidget(NewWidget.id));
			dispatch(removeLayouts(NewWidget.id));
		});
	}

	dispatch({
		type: DASHBOARD_EVENTS.SWITCH_OFF_EDIT_MODE
	});
	dispatch(resetWidget());
};

/**
 * Сохраняет виджет
 * @param {AnyWidget} widget - данные виджета
 * @returns {ThunkAction}
 */
const saveWidget = (widget: AnyWidget): ThunkAction => (dispatch: Dispatch): void => {
	widget.id === NewWidget.id ? dispatch(createWidget(widget)) : dispatch(editWidget(widget));
};

/**
 * Сохраняет график
 * @param {Chart} widget - данные виджета
 * @returns {ThunkAction}
 */
const saveChartWidget = (widget: Chart): ThunkAction => (dispatch: Dispatch): void => {
	widget.id === NewWidget.id ? dispatch(createWidget(widget)) : dispatch(editChartWidget(widget));
};

/**
 * Редактирует данные графика
 * @param {Chart} widget - данные графика
 * @returns {ThunkAction}
 */
const editChartWidget = (widget: Chart): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {colorsSettings} = widget;
	const {data, useGlobal} = colorsSettings.custom;

	if (useGlobal && data) {
		await dispatch(saveCustomChartColorsSettings(data));
		await dispatch(setUseGlobalChartSettings(data.key, useGlobal, widget.id));
	}

	dispatch(editWidget(widget));
};

/**
 * Редактирует данные виджета
 * @param {AnyWidget} settings - данные виджета
 * @returns {ThunkAction}
 */
const editWidget = (settings: AnyWidget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
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
 * @param {AnyWidget} widget - данные виджета
 * @param {object} chunkData - данные которые нужно изменить
 * @param {boolean} refreshData - указывает на необходимость обновить данные для построения
 * @returns {ThunkAction}
 */
const editWidgetChunkData = (widget: AnyWidget, chunkData: Object, refreshData: boolean = true): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
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
		refreshData && dispatch(fetchBuildData(updatedWidgetData));
	} catch (e) {
		dispatch(recordSaveError());
	}
};

/**
 * Сохраняет данные настройки виджета с обновленными пользовательскими фильтрами
 * @param {Widget} widget - данные виджета
 * @returns {ThunkAction}
 */
const saveWidgetWithNewFilters = (widget: Widget): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		try {
			const state = getState();
			const isPersonal = isPersonalDashboard(state);

			if (isPersonal) {
				dispatch(editWidgetChunkData(widget, {data: widget.data}));
			} else {
				const updatedWidget = deepClone(widget);

				dispatch(updateWidget(updatedWidget));
				dispatch(fetchBuildData(updatedWidget));
			}
		} catch (e) {
			dispatch(recordSaveError());
		}
};

/**
 * Создает новый виджет
 * @param {AnyWidget} settings - данные формы создания виджета
 * @returns {ThunkAction}
 */
const createWidget = (settings: AnyWidget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const state = getState();
	let validationErrors;

	dispatch(requestWidgetSave());

	try {
		updateNewWidgetCustomColorsSettings(settings, state);

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
 *
 * @param {string} dashboardKey - идентификатор дашборда
 * @param {string} widgetKey - идентификатор виджета
 * @returns {ThunkAction}
 */
const copyWidget = (dashboardKey: string, widgetKey: string): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch({
		type: WIDGETS_EVENTS.REQUEST_WIDGET_COPY
	});

	try {
		dispatch(checkWidgetsCount());

		const payload = {
			...getParams(),
			dashboardKey,
			widgetKey
		};
		const widget = await window.jsApi.restCallModule('dashboardSettings', 'copyWidgetToDashboard', payload);
		const state = getState();

		if (updateNewWidgetCustomColorsSettings(widget, state)) {
			const {colorsSettings} = widget;

			await dispatch(editWidgetChunkData(widget, {colorsSettings}, false));
		}

		batch(() => {
			dispatch(setCreatedWidget(widget));
			dispatch(addLayouts(widget.id));
			dispatch(focusWidget(widget.id));
		});
		dispatch(saveNewLayouts());
		dispatch(fetchCustomGroups());
		dispatch(fetchBuildData(widget));
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

		batch(() => {
			dispatch(removeLayouts(widgetId));
			dispatch(deleteWidget(widgetId));
		});

		dispatch(saveNewLayouts());
	} catch (e) {
		dispatch(recordDeleteError());
	}
};

/**
 * Устанавливает выбранный виджет для последующего редактирования
 * @param {string} widgetId - id виджета
 * @returns {ThunkAction}
 */
const selectWidget = (widgetId: string): ThunkAction => (dispatch: Dispatch, getState: GetState): void => {
	const state = getState();
	const {data: widgetsData} = state.widgets;

	if (widgetId !== NewWidget.id) {
		const widgetData = widgetsData.map[widgetId];

		if (widgetData.data) {
			const sourcesSet = new Set(
				widgetData
					.data
					.map(dataSet => dataSet.source.value?.value)
					.filter(e => !!e)
			);

			sourcesSet.forEach((item) => {
				dispatch(fetchSourcesFilters(item));
			});
		}
	}

	dispatch(setSelectedWidget(widgetId));
	dispatch({
		type: DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE
	});

	dashboardResizer.resetHeight();
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
 * @param {string} dashboardKey - идентификатор дашборда
 * @param {string} widgetKey - идентификатор виджета
 * @returns {ThunkAction}
 */
const validateWidgetToCopy = (dashboardKey: string, widgetKey: string): ThunkAction =>
	async (dispatch: Dispatch): Promise<ValidateWidgetToCopyResult> => {
	let isValid = true;
	let reasons = [];

	dispatch({
		type: WIDGETS_EVENTS.REQUEST_VALIDATE_TO_COPY
	});

	try {
		const payload = {
			...getParams(),
			dashboardKey,
			widgetKey
		};
		let result = false;

		({reasons, result} = await window.jsApi.restCallModule('dashboardSettings', 'widgetIsBadToCopy', payload));
		isValid = !result;

		dispatch({
			type: WIDGETS_EVENTS.RESPONSE_VALIDATE_TO_COPY
		});
	} catch (e) {
		dispatch({
			type: WIDGETS_EVENTS.RECORD_VALIDATE_TO_COPY_ERROR
		});
	}

	return {isValid, reasons};
};

/**
 * Устанавливает значение использования глобальной настройки цветов графика для всех подходящих виджетов
 * @param {string} key - ключ настроек
 * @param {boolean} useGlobal - значение использования глобальной настройки
 * @param {string} targetWidgetId - идентификатор виджета, настройки которого в дальнейшем будут применяться к остальным виджетам
 * @returns {ThunkAction}
 */
const setUseGlobalChartSettings = (key: string, useGlobal: boolean, targetWidgetId: string = ''): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const widgets = getAllWidgets(getState());

	// eslint-disable-next-line no-unused-vars
	for (const widget of widgets) {
		const {colorsSettings, id, type: widgetType} = widget;

		try {
			const isValidWidget = id !== targetWidgetId && hasChartColorsSettings(widgetType);

			if (isValidWidget && getCustomColorsSettingsKey(widget) === key) {
				await dispatch(editWidgetChunkData(widget, {
					colorsSettings: {
						...colorsSettings,
						custom: {
							...colorsSettings.custom,
							useGlobal
						},
						type: CHART_COLORS_SETTINGS_TYPES.CUSTOM
					}
				}, false));
			}
		} catch (e) {
			console.log(e);
		}
	}
};

/**
 * Устанавливает выбранный виджет для редактирования
 * @param {string} widgetId - уникальный идентификатор выбранного виджета
 * @returns {ThunkAction}
 */
const setSelectedWidget = (widgetId: string) => (dispatch: Dispatch, getState: GetState) => {
	const state = getState();
	const {data: widgetsData} = state.widgets;
	const {selectedWidget} = widgetsData;

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

const focusWidget = (payload: string) => ({
	payload,
	type: WIDGETS_EVENTS.SET_FOCUSED_WIDGET
});

const recordDeleteError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGET_DELETE_ERROR
});

const resetFocusedWidget = () => ({
	type: WIDGETS_EVENTS.RESET_FOCUSED_WIDGET
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

const setCreatedWidget = (payload: AnyWidget) => ({
	payload,
	type: WIDGETS_EVENTS.SET_CREATED_WIDGET
});

const setWidgets = (payload: Array<AnyWidget>) => ({
	payload,
	type: WIDGETS_EVENTS.SET_WIDGETS
});

const setWarningMessage = (payload: SetWidgetWarning) => ({
	payload,
	type: WIDGETS_EVENTS.WIDGET_SET_WARNING
});

const clearWarningMessage = (payload: string) => ({
	payload,
	type: WIDGETS_EVENTS.WIDGET_CLEAR_WARNING
});

const updateWidget = (payload: AnyWidget) => ({
	payload,
	type: WIDGETS_EVENTS.UPDATE_WIDGET
});

export {
	addNewWidget,
	cancelForm,
	copyWidget,
	clearWarningMessage,
	createWidget,
	editWidgetChunkData,
	focusWidget,
	removeWidget,
	resetFocusedWidget,
	resetWidget,
	saveWidget,
	saveWidgetWithNewFilters,
	selectWidget,
	setSelectedWidget,
	setWarningMessage,
	setUseGlobalChartSettings,
	setWidgets,
	updateWidget,
	validateWidgetToCopy,
	saveChartWidget
};
