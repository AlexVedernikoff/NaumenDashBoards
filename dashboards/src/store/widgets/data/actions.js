// @flow
import {buildUrl, client} from 'utils/api';
import type {Context} from 'utils/api/types';
import type {CreateFormData, SaveFormData} from 'components/organisms/WidgetFormPanel/types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {fetchDiagramData} from 'store/widgets/diagrams/actions';
import type {Layout} from 'utils/layout/types';
import type {Widget} from './types';
import {WIDGETS_EVENTS} from './constants';

/**
 * Получаем все виджеты
 * @param {boolean} isInit - выполняется ли действие в процессе инициализации дашборда
 * @returns {ThunkAction}
 */
	const getWidgets = (isInit: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestWidgets());

	try {
		const context = getState().dashboard.context;
		const params = `'${context.subjectUuid || ''}','${context.contentCode}',user`;
		const {data} = await client.post(buildUrl('dashboardSettings', 'getSettings', params));

		if (Array.isArray(data)) {
			const widgets = data.filter(w => w.value).map(w => {
				const {key, value: widget} = w;

				widget.layout.static = true;
				data.map[key] = widget;

				dispatch(fetchDiagramData(widget));

				return widget;
			});
			dispatch(receiveWidgets(widgets));
		}
	} catch (e) {
		dispatch(recordWidgetsError());

		if (isInit) {
			throw e;
		}
	}
};

/**
 * Добавляем новый виджет
 * @param {number} payload - номер строки для отрисовки нового виджета
 * @returns {ThunkAction}
 */
const addWidget = (payload: number): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: WIDGETS_EVENTS.ADD_WIDGET,
		payload
	});
};

/**
 * Сохраняем изменение положения виджетов
 * @param {Layout} payload - массив объектов местоположения виджетов на дашборде
 * @returns {ThunkAction}
 */
const editLayout = (payload: Layout): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(setNewLayout(payload));
};

/**
 * Сохраняем новое положение виджетов
 * @param {Context} context - контекст ВП;
 * @param {boolean} editable - является ли дашборд редактируемым
 * @param {boolean} asDefault - указывает как сохранить виджет;
 * @returns {ThunkAction}
 */
const saveNewLayout = (context: Context, editable: boolean, asDefault: boolean): ThunkAction => async (dispatch: Dispatch, getState: GetState) => {
	dispatch(requestLayoutSave());

	try {
		const {widgets} = getState();
		const widgetMap = widgets.data.map;
		const method = asDefault ? 'bulkEditDefaultWidget' : 'bulkEditWidget';
		const layoutsSettings = Object.keys(widgetMap).map(key => ({
			key: key,
			value: widgetMap[key].layout
		}));

		await client.post(buildUrl('dashboardSettings', method, 'requestContent,user'), {
			classFqn: context.subjectUuid,
			contentCode: context.contentCode,
			editable,
			layoutsSettings
		});
	} catch (e) {
		dispatch(recordLayoutSaveError());
	}
};

/**
 * Закрываем форму
 * @returns {ThunkAction}
 */
const cancelForm = (): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(resetWidget());
};

/**
 * Сохраняем изменения данных виджета
 * @param {SaveFormData} formData - данные формы редактирования
 * @param {boolean} asDefault - указывает как сохранить виджет;
 * @returns {ThunkAction}
 */
const saveWidget = (formData: SaveFormData, asDefault: boolean): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestWidgetSave());

	try {
		const {dashboard, widgets} = getState();
		const {context, editable, master} = dashboard;
		const method = asDefault ? 'editDefaultWidget' : 'editPersonalWidgetSettings';
		const isEditable = editable || master;
		const widget = {...formData, layout: widgets.data.map[formData.id].layout};
		const data = {
			classFqn: context.subjectUuid,
			contentCode: context.contentCode,
			editable: isEditable,
			widgetKey: widget.id,
			widgetSettings: widget
		};
		await client.post(buildUrl('dashboardSettings', method, 'requestContent,user'), data);
		await dispatch(saveNewLayout(context, isEditable, asDefault));
		dispatch(updateWidget(widget));
		dispatch(fetchDiagramData(widget));
	} catch (e) {
		dispatch(recordSaveError());
	}
};

/**
 * Создаем виджет
 * @param {CreateFormData} formData - данные формы создания виджета
 * @param {boolean} asDefault - указывает какого типа создать виджет;
 * @returns {ThunkAction}
 */
const createWidget = (formData: CreateFormData, asDefault: boolean): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestWidgetSave());

	try {
		const {dashboard, widgets} = getState();
		const {context, editable, master} = dashboard;
		const newWidget = widgets.data.newWidget;

		if (newWidget) {
			const method = asDefault ? 'createDefaultWidgetSettings' : 'createPersonalWidgetSettings';
			const isEditable = editable || master;
			let widget = {...formData, layout: newWidget.layout};
			const data = {
				classFqn: context.subjectUuid,
				contentCode: context.contentCode,
				editable: isEditable,
				widgetSettings: widget
			};
			const {data: id} = await client.post(buildUrl('dashboardSettings', method, 'requestContent,user'), data);
			await dispatch(saveNewLayout(context, isEditable, asDefault));

			widget = {...widget, id, layout: {...widget.layout, i: id}};
			dispatch(setCreatedWidget(widget));
			dispatch(fetchDiagramData(widget));
		}
	} catch (e) {
		dispatch(recordSaveError());
	}
};

/**
 * Устанавливаем выбранный виджет для последующего редактирования
 * @param {string} payload - id виджета
 * @returns {ThunkAction}
 */
const selectWidget = (payload: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(setSelectedWidget(payload));
};

const resetWidget = () => ({
	type: WIDGETS_EVENTS.RESET_WIDGET
});

const recordLayoutSaveError = () => ({
	type: WIDGETS_EVENTS.RECORD_LAYOUT_SAVE_ERROR
});

const recordSaveError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGET_SAVE_ERROR
});

const requestWidgetSave = () => ({
	type: WIDGETS_EVENTS.REQUEST_WIDGET_SAVE
});

const recordWidgetsError = () => ({
	type: WIDGETS_EVENTS.RECORD_WIDGETS_ERROR
});

const requestLayoutSave = () => ({
	type: WIDGETS_EVENTS.REQUEST_LAYOUT_SAVE
});

const requestWidgets = () => ({
	type: WIDGETS_EVENTS.REQUEST_WIDGETS
});

const receiveWidgets = (payload: Widget[]) => ({
	type: WIDGETS_EVENTS.RECEIVE_WIDGETS,
	payload
});

const setSelectedWidget = (payload: string) => ({
	type: WIDGETS_EVENTS.SET_SELECTED_WIDGET,
	payload
});

const setCreatedWidget = (payload: Widget) => ({
	type: WIDGETS_EVENTS.SET_CREATED_WIDGET,
	payload
});

const setNewLayout = (payload: Layout) => ({
	type: WIDGETS_EVENTS.EDIT_LAYOUT,
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
	getWidgets,
	resetWidget,
	saveWidget,
	selectWidget
};
