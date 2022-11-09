// @flow
import {addLayouts, removeLayouts, replaceLayoutsId, saveNewLayouts} from 'store/dashboard/layouts/actions';
import type {AnyWidget, Chart, SetWidgetWarning, ValidateWidgetToCopyResult, Widget} from './types';
import api from 'api';
import {ApiError} from 'api/errors';
import {batch} from 'react-redux';
import {CHART_COLORS_SETTINGS_TYPES, LIMITS, WIDGET_TYPES, WIDGETS_EVENTS} from './constants';
import {confirmDialog} from 'store/commonDialogs/actions';
import {createToast} from 'store/toasts/actions';
import {DASHBOARD_EVENTS} from 'store/dashboard/settings/constants';
import {deepClone} from 'helpers';
import {DEFAULT_BUTTONS, FOOTER_POSITIONS, SIZES} from 'components/molecules/Modal/constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {DivRef} from 'components/types';
import type {FetchBuildDataAction} from 'store/widgets/buildData/types';
import {fetchCustomGroups} from 'store/customGroups/actions';
import {fetchSourcesFilters} from 'store/sources/sourcesFilters/actions';
import {getAllWidgets} from 'store/widgets/data/selectors';
import {getCustomColorsSettingsKey} from './helpers';
import {getParams} from 'store/helpers';
import {getWidgetGlobalChartColorsSettings} from 'store/dashboard/customChartColorsSettings/selectors';
import {hasChartColorsSettings} from 'store/widgets/helpers';
import {isPersonalDashboard} from 'store/dashboard/settings/selectors';
import NewWidget from 'store/widgets/data/NewWidget';
import {resizer as dashboardResizer} from 'app.constants';
import {saveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import t from 'localization';

/**
 * Добавляет новый виджет
 * @param {DivRef} relativeElement - элемент, вызвавший событие проверки
 * @returns {ThunkAction}
 */
const checkWidgetsCount = (relativeElement?: DivRef) => (dispatch: Dispatch, getState: GetState): void => {
	const {map} = getState().widgets.data;
	const {DASHBOARD_WIDGET_COUNT_LIMIT: LIMIT} = LIMITS;

	if (Object.keys(map).length >= LIMIT) {
		throw dispatch(createToast({
			text: t('store::widgets::data::Limit', {limit: LIMIT}),
			type: 'error'
		}, relativeElement));
	}
};

/**
 * Добавляет новый виджет
 * @param {NewWidget} payload - объект нового виджета
 * @param {DivRef} relativeElement - элемент, вызвавший событие проверки
 * @returns {ThunkAction}
 */
const addNewWidget = (payload: NewWidget, relativeElement?: DivRef): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(checkWidgetsCount(relativeElement));

	batch(() => {
		dispatch(focusWidget(payload.id));
		dispatch({payload, type: WIDGETS_EVENTS.ADD_WIDGET});
		dispatch({type: DASHBOARD_EVENTS.SWITCH_ON_EDIT_MODE});
		dispatch(addLayouts(NewWidget.id, payload.recommendedPosition));
	});

	dashboardResizer.resetHeight();
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
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @returns {ThunkAction}
 */
const saveWidget = (widget: AnyWidget, fetchBuildData: FetchBuildDataAction): ThunkAction => (dispatch: Dispatch): void => {
	if (widget.id === NewWidget.id) {
		dispatch(createWidget(widget, fetchBuildData));
	} else {
		dispatch(editWidget(widget, fetchBuildData));
	}
};

/**
 * Сохраняет график
 * @param {Chart} widget - данные виджета
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @returns {ThunkAction}
 */
const saveChartWidget = (widget: Chart, fetchBuildData: FetchBuildDataAction): ThunkAction => (dispatch: Dispatch): void => {
	if (widget.id === NewWidget.id) {
		dispatch(createWidget(widget, fetchBuildData));
	} else {
		dispatch(editChartWidget(widget, fetchBuildData));
	}
};

/**
 * Редактирует данные графика
 * @param {Chart} widget - данные графика
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @returns {ThunkAction}
 */
const editChartWidget = (widget: Chart, fetchBuildData: FetchBuildDataAction): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		const {colorsSettings} = widget;
		const {data, useGlobal} = colorsSettings.custom;

		if (useGlobal && data) {
			await dispatch(saveCustomChartColorsSettings(data));
			await dispatch(setUseGlobalChartSettings(data.key, useGlobal, fetchBuildData, widget.id));
		}

		dispatch(editWidget(widget, fetchBuildData));
	};

/**
 * Редактирует данные виджета
 * @param {AnyWidget} settings - данные виджета
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @returns {ThunkAction}
 */
const editWidget = (settings: AnyWidget, fetchBuildData: FetchBuildDataAction): ThunkAction =>
	async (dispatch: Dispatch): Promise<string | void> => {
		let validationErrors;

		dispatch(requestWidgetSave());

		try {
			const widget = await api.instance.dashboardSettings.widget.edit(getParams(), settings);

			dispatch(updateWidget(widget));
			dispatch(saveNewLayouts());
			dispatch(fetchBuildData(widget));
		} catch (e) {
			validationErrors = e instanceof ApiError ? e.message : t('store::widgets::data::ServerError');

			dispatch(recordSaveError());
		}

		return validationErrors;
	};

/**
 * Сохраняет изменение части данных виджета
 * @param {AnyWidget} widget - данные виджета
 * @param {object} chunkData - данные которые нужно изменить
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @param {boolean} refreshData - указывает на необходимость обновить данные для построения
 * @returns {ThunkAction}
 */
const editWidgetChunkData = (
	widget: AnyWidget,
	chunkData: Object,
	fetchBuildData: FetchBuildDataAction,
	refreshData: boolean = true
): ThunkAction =>
	async (dispatch: Dispatch): Promise<void> => {
		try {
			const updatedWidgetData = {
				...widget,
				...chunkData
			};

			await api.instance.dashboardSettings.widget.editChunkData(getParams(), widget.id, chunkData);

			dispatch(updateWidget(updatedWidgetData));
			refreshData && dispatch(fetchBuildData(updatedWidgetData));
		} catch (e) {
			dispatch(recordSaveError());
		}
	};

/**
 * Сохраняет данные настройки виджета с обновленными пользовательскими фильтрами
 * @param {Widget} widget - данные виджета
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @returns {ThunkAction}
 */
const saveWidgetWithNewFilters = (widget: Widget, fetchBuildData: FetchBuildDataAction): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		try {
			const state = getState();
			const isPersonal = isPersonalDashboard(state);

			if (isPersonal) {
				dispatch(editWidgetChunkData(widget, {data: widget.data}, fetchBuildData));
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
 * Обновляет настройки цветов из глобальных источников
 * @param {AnyWidget} anyWidget - виджет
 * @returns {ThunkAction}
 */
const updateWidgetCustomColorsSettings = (anyWidget: AnyWidget) =>
	async (dispatch: Dispatch, getState: GetState): Promise<boolean> => {
		let isChanged = false;
		const state = getState();

		if (anyWidget.type !== WIDGET_TYPES.TEXT) {
		// $FlowFixMe: это не WIDGET_TYPES.TEXT => Widget
			const widget = (anyWidget: Widget);
			const settings = getWidgetGlobalChartColorsSettings(widget)(state);

			if (settings) {
			// $FlowFixMe: getWidgetGlobalChartColorsSettings проверяет на то что это AxisWidget или CircleWidget
				const colorWidget = (widget: AxisWidget | CircleWidget);
				const {colorsSettings: oldColorsSettings} = colorWidget;

				if (oldColorsSettings && !oldColorsSettings.custom.useGlobal) {
					colorWidget.colorsSettings = {
						...oldColorsSettings,
						custom: {
							data: {...settings},
							useGlobal: true
						},
						type: CHART_COLORS_SETTINGS_TYPES.CUSTOM
					};

					isChanged = true;
				}
			}
		}

		return isChanged;
	};

/**
 * Создает новый виджет
 * @param {AnyWidget} settings - данные формы создания виджета
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @returns {ThunkAction}
 */
const createWidget = (settings: AnyWidget, fetchBuildData: FetchBuildDataAction): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<string | void> => {
		let validationErrors;

		dispatch(requestWidgetSave());

		try {
			await dispatch(updateWidgetCustomColorsSettings(settings));

			const widget = await api.instance.dashboardSettings.widget.create(getParams(), settings);

			batch(() => {
				dispatch(deleteWidget(NewWidget.id));
				dispatch(replaceLayoutsId(NewWidget.id, widget.id));
				dispatch(setCreatedWidget(widget));
				dispatch(fetchBuildData(widget));
			});
			dispatch(saveNewLayouts());
		} catch (e) {
			validationErrors = e instanceof ApiError ? e.message : t('store::widgets::data::ServerError');

			dispatch(recordSaveError());
		}

		return validationErrors;
	};

/**
 * Копирует виджет
 * @param {string} dashboardKey - идентификатор дашборда
 * @param {string} widgetKey - идентификатор виджета
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @param {DivRef} relativeElement - элемент, вызвавший событие проверки
 * @returns {ThunkAction}
 */
const copyWidget = (
	dashboardKey: string,
	widgetKey: string,
	fetchBuildData: FetchBuildDataAction,
	relativeElement?: DivRef
): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		dispatch({
			type: WIDGETS_EVENTS.REQUEST_WIDGET_COPY
		});

		try {
			dispatch(checkWidgetsCount(relativeElement));

			const widget = await api.instance.dashboardSettings.widget.copyWidget(getParams(), dashboardKey, widgetKey);
			const widgetCustomColorsSettingsUpdated = await dispatch(updateWidgetCustomColorsSettings(widget));

			if (widgetCustomColorsSettingsUpdated) {
				const {colorsSettings} = widget;

				await dispatch(editWidgetChunkData(widget, {colorsSettings}, fetchBuildData, false));
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
 * Удаляет виджет c запросом разрешения у пользователя
 * @param {string} widgetId - идентификатор виджета;
 * @param {DivRef} relativeElement - вызывающий контейнер
 * @returns {ThunkAction}
 */
const removeWidgetWithConfirm = (widgetId: string, relativeElement?: DivRef): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const confirmOptions = {
		cancelText: t('store::widgets::data::RemoveWidgetConfirmNo'),
		defaultButton: DEFAULT_BUTTONS.CANCEL_BUTTON,
		footerPosition: FOOTER_POSITIONS.RIGHT,
		relativeElement,
		size: SIZES.SMALL,
		submitText: t('store::widgets::data::RemoveWidgetConfirmYes')
	};

	if (await dispatch(confirmDialog(
		t('store::widgets::data::RemoveWidgetConfirmTitle'),
		t('store::widgets::data::RemoveWidgetConfirmText'),
		confirmOptions
	))) {
		dispatch(removeWidget(widgetId));
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
		await api.instance.dashboardSettings.widget.delete(getParams(), widgetId);

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

			sourcesSet.forEach(item => {
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
			let result = false;

			({reasons, result} = await api.instance.dashboardSettings.widget.checkToCopy(getParams(), dashboardKey, widgetKey));
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
 * @param {FetchBuildDataAction} fetchBuildData - thunk обновления данных виджета
 * @param {string} targetWidgetId - идентификатор виджета, настройки которого в дальнейшем будут применяться к остальным виджетам
 * @returns {ThunkAction}
 */
const setUseGlobalChartSettings = (
	key: string,
	useGlobal: boolean,
	fetchBuildData: FetchBuildDataAction,
	targetWidgetId: string = ''
): ThunkAction =>
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
					}, fetchBuildData, false));
				}
			} catch (e) {
				console.error(e);
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
	const {focusedWidget, selectedWidget} = widgetsData;

	if (selectedWidget === NewWidget.id) {
		dispatch(deleteWidget(selectedWidget));
		dispatch(removeLayouts(selectedWidget));
	}

	if (focusedWidget) {
		dispatch(resetFocusedWidget());
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
	removeWidgetWithConfirm,
	saveChartWidget
};
