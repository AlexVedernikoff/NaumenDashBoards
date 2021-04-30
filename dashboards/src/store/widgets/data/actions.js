// @flow
import {addLayouts, removeLayouts, replaceLayoutsId, saveNewLayouts} from 'store/dashboard/layouts/actions';
import type {AnyWidget, SetWidgetWarning, ValidateWidgetToCopyResult} from './types';
import {batch} from 'react-redux';
import {CHART_COLORS_SETTINGS_TYPES, LIMIT, WIDGETS_EVENTS} from './constants';
import {createFilterContext, getFilterContext, getParams, parseResponseErrorText} from 'store/helpers';
import {createToast} from 'store/toasts/actions';
import {deepClone, isObject} from 'helpers';
import type {Dispatch, GetState, ResponseError, ThunkAction} from 'store/types';
import {editDashboard} from 'store/dashboard/settings/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {fetchSourcesFilters} from 'store/sources/sourcesFilters/actions';
import {
	generateClearedWidgetCustomFilters,
	generateUpdatedWidgetCustomFilters,
	getCustomColorsSettingsKey
} from './helpers';
import {getAllWidgets} from 'src/store/widgets/data/selectors';
import {hasChartColorsSettings} from 'store/widgets/helpers';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';
import NewWidget from 'store/widgets/data/NewWidget';
import {refreshCustomGroups} from 'store/customGroups/actions';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Добавляет новый виджет
 * @returns {ThunkAction}
 */
const checkWidgetsCount = () => (dispatch: Dispatch, getState: GetState): void => {
	const {map} = getState().widgets.data;

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
const addWidget = (payload: NewWidget): ThunkAction => (dispatch: Dispatch): void => {
		dispatch(checkWidgetsCount());
		batch(() => {
			dispatch(focusWidget(payload.id));
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
const cancelForm = (): ThunkAction => (dispatch: Dispatch, getState: GetState): void => {
	const {selectedWidget} = getState().widgets.data;

	if (selectedWidget === NewWidget.id) {
		batch(() => {
			dispatch(deleteWidget(NewWidget.id));
			dispatch(removeLayouts(NewWidget.id));
		});
	}

	dispatch(resetWidget());
};

/**
 * Сохраняет изменение данных виджета
 * @param {AnyWidget} settings - данные формы редактирования
 * @returns {ThunkAction}
 */
const saveWidget = (settings: AnyWidget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
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
 * Сохраняет изменение части данных виджета
 * @param {AnyWidget} widget - данные виджета
 * @param {boolean} refreshData - указывает на необходимость обновить данные для построения
 * @returns {ThunkAction}
 */
const clearWidgetFilters = (widget: AnyWidget, refreshData: boolean = true): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		if (widget.type !== WIDGET_TYPES.TEXT) {
			const {data} = widget;

			if (data && Array.isArray(data)) {
				const data = generateClearedWidgetCustomFilters(widget);
				const state = getState();
				const isPersonal = isPersonalDashboard(state);

				if (isPersonal) {
					dispatch(editWidgetChunkData(widget, {data}, refreshData));
				} else {
					const updatedWidget = deepClone({...widget, data});

					dispatch(updateWidget(updatedWidget));
					dispatch(fetchBuildData(updatedWidget));
				}
			}
		}
	} catch (e) {
		dispatch(recordSaveError());
	}
};

/**
 * Установка фильтров виджета через вызов формы фильтрации
 *
 * @param {AnyWidget} widget - виджет
 * @param {number} dataSetIndex - индекс источника
 * @param {number} filterIndex -  индекс фильтра
 * @returns {ThunkAction}
 */
const callWidgetFilters = (widget: AnyWidget, dataSetIndex: number, filterIndex: number): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		try {
			if (widget.type !== WIDGET_TYPES.TEXT) {
				const dataSet = widget.data[dataSetIndex];
				const {source: {value}} = dataSet;
				const {value: classFqn} = value;
				const filter = dataSet.source.widgetFilterOptions?.[filterIndex];

				if (filter) {
					const {descriptor} = filter;
					const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

					if (context) {
						context['attrCodes'] = filter.attributes.map(attr => `${attr.metaClassFqn}@${attr.code}`);
						const {serializedContext} = await window.jsApi.commands.filterForm(context, true);

						const state = getState();
						const isPersonal = isPersonalDashboard(state);
						const data = generateUpdatedWidgetCustomFilters(widget, dataSetIndex, filterIndex, serializedContext);

						if (isPersonal) {
							dispatch(editWidgetChunkData(widget, {data}, true));
						} else {
							const updatedWidget = deepClone({...widget, data});

							dispatch(updateWidget(updatedWidget));
							dispatch(fetchBuildData(updatedWidget));
						}
					}
				}
			}
		} catch (ex) {
			console.error('Ошибка формы фильтрации', ex);
		}
	};

/**
 * Создает новый виджет
 * @param {AnyWidget} settings - данные формы создания виджета
 * @returns {ThunkAction}
 */
const createWidget = (settings: AnyWidget): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
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
 *
 * @param {string} dashboardKey - идентификатор дашборда
 * @param {string} widgetKey - идентификатор виджета
 * @returns {ThunkAction}
 */
const copyWidget = (dashboardKey: string, widgetKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
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

		batch(() => {
			dispatch(setCreatedWidget(widget));
			dispatch(addLayouts(widget.id));
			dispatch(focusWidget(widget.id));
		});
		dispatch(saveNewLayouts());
		dispatch(refreshCustomGroups());
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
 * @param {string} payload - id виджета
 * @param {Function} callback - коллбэк-функция, которая будет вызвана после выбора виджета
 * @returns {ThunkAction}
 */
const selectWidget = (payload: string, callback?: Function): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(setSelectedWidget(payload));
	dispatch(editDashboard());
	callback && callback();
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
	(dispatch: Dispatch, getState: GetState): void => {
	const widgets = getAllWidgets(getState());

	widgets.forEach(widget => {
		const {id, type: widgetType} = widget;

		try {
			const isValidWidget = id !== targetWidgetId && hasChartColorsSettings(widgetType);

			if (isValidWidget && getCustomColorsSettingsKey(widget) === key) {
				const {colorsSettings} = widget;

				dispatch(editWidgetChunkData(widget, {
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
	});
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

	if (widgetId !== NewWidget.id) {
		const widgetData = widgetsData.map[widgetId];
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
	payload: '',
	type: WIDGETS_EVENTS.SET_FOCUSED_WIDGET
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
	addWidget,
	cancelForm,
	clearWidgetFilters,
	copyWidget,
	clearWarningMessage,
	createWidget,
	editWidgetChunkData,
	focusWidget,
	removeWidget,
	resetFocusedWidget,
	resetWidget,
	saveWidget,
	selectWidget,
	setSelectedWidget,
	setWarningMessage,
	setUseGlobalChartSettings,
	setWidgets,
	updateWidget,
	validateWidgetToCopy,
	callWidgetFilters
};
