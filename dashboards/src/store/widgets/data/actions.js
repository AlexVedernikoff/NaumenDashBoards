// @flow
import type {CreateFormData, SaveFormData} from 'components/organisms/WidgetFormPanel/types';
import type {Dispatch, ThunkAction} from 'store/types';
import {fetchChartData} from '../charts/actions';
import type {Layout} from 'types/layout';
import type {UpdateWidgetPayload, Widget} from './types';
import uuid from 'tiny-uuid';
import {WIDGETS_EVENTS} from './constants';

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
const editLayout = (payload: Layout): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: WIDGETS_EVENTS.EDIT_LAYOUT,
		payload
	});
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
 * @param {string} id - id виджета
 * @returns {ThunkAction}
 */
const saveWidget = (formData: SaveFormData, id: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(updateWidget({formData, id}));
	dispatch(fetchChartData(formData, id));
};

/**
 * Создаем виджет
 * @param {CreateFormData} formData - данные формы создания виджета
 * @returns {ThunkAction}
 */
const createWidget = (formData: CreateFormData): ThunkAction => (dispatch: Dispatch): void => {
	const id = uuid();
	formData.layout.i = id;
	const widget = {...formData, id};
	dispatch(setCreatedWidget(widget));
	dispatch(fetchChartData(formData, id));
};

/**
 * Устанавливаем выбранный виджет для последующего редактирования
 * @param {string} payload - id виджета
 * @returns {ThunkAction}
 */
const selectWidget = (payload: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch(setSelectedWidget(payload));
};

const setSelectedWidget = (payload: string) => ({
	type: WIDGETS_EVENTS.SET_SELECTED_WIDGET,
	payload
});

const resetWidget = () => ({
	type: WIDGETS_EVENTS.RESET_WIDGET
});

const switchOnStatic = () => ({
	type: WIDGETS_EVENTS.SWITCH_ON_STATIC
});

const switchOffStatic = () => ({
	type: WIDGETS_EVENTS.SWITCH_OFF_STATIC
});

const updateWidget = (payload: UpdateWidgetPayload) => ({
	type: WIDGETS_EVENTS.UPDATE_WIDGET,
	payload
});

const setCreatedWidget = (payload: Widget) => ({
	type: WIDGETS_EVENTS.SET_CREATED_WIDGET,
	payload
});

export {
	addWidget,
	cancelForm,
	createWidget,
	editLayout,
	saveWidget,
	selectWidget,
	switchOffStatic,
	switchOnStatic
};
