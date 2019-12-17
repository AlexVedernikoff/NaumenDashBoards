// @flow
import {buildUrl, client} from 'utils/api';
import type {Context} from 'utils/api/types';
import type {CreateFormData, SaveFormData} from 'components/organisms/WidgetFormPanel/types';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {editDashboard} from 'store/dashboard/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import type {Layout} from 'utils/layout/types';
import {NewWidget} from 'utils/widget';
import type {Widget} from './types';
import {WIDGETS_EVENTS} from './constants';

/**
 * Добавляем новый виджет
 * @param {NewWidget} payload - объект нового виджета
 * @returns {ThunkAction}
 */
const addWidget = (payload: NewWidget): ThunkAction => (dispatch: Dispatch): void => {
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

	const {dashboard, widgets} = getState();
	const {context, editable, role} = dashboard;
	const method = asDefault ? 'editDefaultWidget' : 'editPersonalWidgetSettings';
	const isEditable = editable || role !== null;
	const widget = {...formData, layout: widgets.data.map[formData.id].layout};
	const data = {
		classFqn: context.subjectUuid,
		contentCode: context.contentCode,
		editable: isEditable,
		widgetKey: widget.id,
		widgetSettings: widget
	};

	try {
		const {data: id} = await client.post(buildUrl('dashboardSettings', method, 'requestContent,user'), data);

		if (widget.id !== id) {
			dispatch(deleteWidget(widget.id));
			widget.id = id;
		}

		dispatch(updateWidget(widget));
		dispatch(saveNewLayout(context, isEditable, asDefault));
	} catch (e) {
		dispatch(recordSaveError());
	}

	dispatch(fetchBuildData(widget));
};

/**
 * Создаем виджет
 * @param {CreateFormData} formData - данные формы создания виджета
 * @param {boolean} asDefault - указывает какого типа создать виджет;
 * @returns {ThunkAction}
 */
const createWidget = (formData: CreateFormData, asDefault: boolean): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestWidgetSave());

	const {dashboard, widgets} = getState();
	const {context, editable, role} = dashboard;
	const newWidget = widgets.data.newWidget;

	if (newWidget) {
		const method = asDefault ? 'createDefaultWidgetSettings' : 'createPersonalWidgetSettings';
		const isEditable = editable || role !== null;
		let widget = {...formData, layout: newWidget.layout};

		try {
			const {data: id} = await client.post(buildUrl('dashboardSettings', method, 'requestContent,user'), {
				classFqn: context.subjectUuid,
				contentCode: context.contentCode,
				editable: isEditable,
				widgetSettings: widget
			});

			widget = {...widget, id, layout: {...widget.layout, i: id}};
			dispatch(setCreatedWidget(widget));
			dispatch(saveNewLayout(context, isEditable, asDefault));
		} catch (e) {
			dispatch(recordSaveError());
		}

		dispatch(fetchBuildData(widget));
	}
};

/**
 * Удаляет виджет
 * @param {string} widgetId - идентификатор виджета;
 * @param {boolean} onlyPersonal - в случае "true" удаляем только персональный вариант, иначе оба (персональный и по умолчанию).
 * @returns {ThunkAction}
 */
const removeWidget = (widgetId: string, onlyPersonal: boolean): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	dispatch(requestWidgetDelete());

	try {
		const {context, editable} = getState().dashboard;
		const method = onlyPersonal ? 'deletePersonalWidget' : 'deleteWidget';

		const data = {
			classFqn: context.subjectUuid,
			contentCode: context.contentCode,
			editable,
			widgetId
		};
		await client.post(buildUrl('dashboardSettings', method, 'requestContent,user'), data);
		dispatch(deleteWidget(widgetId));
	} catch (e) {
		dispatch(recordDeleteError());
	}
};

/**
 * Устанавливаем выбранный виджет для последующего редактирования
 * @param {string} payload - id виджета
 * @returns {ThunkAction}
 */
const selectWidget = (payload: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(setSelectedWidget(payload));
	dispatch(editDashboard());
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

const setWidgets = (payload: Widget[]) => ({
	type: WIDGETS_EVENTS.SET_WIDGETS,
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
	setWidgets
};
