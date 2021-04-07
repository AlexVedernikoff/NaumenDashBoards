// @flow
import {addLayouts, removeLayouts, replaceLayoutsId, saveNewLayouts} from 'store/dashboard/layouts/actions';
import type {AnyWidget, Chart, SetWidgetWarning, ValidateWidgetToCopyResult, Widget} from './types';
import {batch} from 'react-redux';
import {CHART_COLORS_SETTINGS_TYPES, LIMITS, WIDGETS_EVENTS} from './constants';
import {confirmDialog} from 'store/commonDialogs/actions';
import {createToast} from 'store/toasts/actions';
import {deepClone, isObject} from 'helpers';
import {DEFAULT_BUTTONS} from 'components/molecules/Modal/constants';
import type {Dispatch, GetState, ResponseError, ThunkAction} from 'store/types';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {fetchCustomGroups} from 'store/customGroups/actions';
import {fetchSourcesFilters} from 'store/sources/sourcesFilters/actions';
import {getAllWidgets} from 'src/store/widgets/data/selectors';
import {getCustomColorsSettingsKey} from './helpers';
import {getParams, parseResponseErrorText} from 'store/helpers';
import {getWidgetsBuildData} from './selectors';
import {hasChartColorsSettings} from 'store/widgets/helpers';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';
import NewWidget from 'store/widgets/data/NewWidget';
import {saveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import {WIDGET_SETS} from 'store/widgets/data/constants';

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
const editChartWidget = (widget: Chart): ThunkAction => (dispatch: Dispatch): void => {
	const {colorsSettings} = widget;
	const {data, useGlobal} = colorsSettings.custom;

	if (useGlobal && data) {
		dispatch(saveCustomChartColorsSettings(data));
		dispatch(setUseGlobalChartSettings(data.key, useGlobal, widget.id));
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
		dispatch(checkWidgetDataLimits(widget));
	} catch (e) {
		validationErrors = getErrors(e);

		dispatch(recordSaveError());
	}

	return validationErrors;
};

/**
 * Проверяет и согласовывает ограничения и вид отображения виджета
 * @param {AnyWidget} widget - виджет для проверки; данные должны быть загружены в виджет предварительно
 * @returns {ThunkAction<Promise>} - обещание, которое будет разрешено после всех проверок и согласований с пользователем.
 */
const checkWidgetDataLimits = (widget: AnyWidget): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	if (widget.type in WIDGET_SETS.AXIS) {
		if (widget.dataLabels && widget.dataLabels.show) {
			const state = getState();
			const buildData = getWidgetsBuildData(state);
			const {data} = buildData[widget.id];
			const sumDataValues = data?.series.reduce((sum, s) => sum + s.data.length, 0) ?? 0;

			// SMRMEXT-11660 (SMRMEXT-11965) - если количество меток больше 250 откоючаем отображение меток
			if (sumDataValues > LIMITS.DATA_LABELS_LIMIT) {
				if (widget.dataLabels) {
					const updatedWidgetData: Object = {
						...widget,
						dataLabels: {...widget.dataLabels, show: false}
					};

					dispatch(updateWidget(updatedWidgetData));
				}

				const show = await dispatch(
					confirmDialog(
						'Внимание',
						'Метки данных были отключены из-за большего кол-ва данных, включить? Внимание - это может замедлить работу дашбордов.',
						{
							defaultButton: DEFAULT_BUTTONS.CANCEL_BUTTON
						}
					)
				);

				if (widget.dataLabels) {
					const dataLabels = {...widget.dataLabels, show};

					dispatch(editWidgetChunkData(widget, {dataLabels}, false));
				}
			}
		}
	}
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
 * @param {string} payload - id виджета
 * @returns {ThunkAction}
 */
const selectWidget = (payload: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(setSelectedWidget(payload));
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
