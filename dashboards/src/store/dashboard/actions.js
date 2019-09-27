// @flow
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import type {Layout} from 'types/layout';
import type {updateInfo} from 'types/updateInfo'
import type {Widget} from 'entities';

/**
 * Добавляем новый виджет в массив дашборда
 * @param {Widget} payload - Объект добавленного виджета
 * @returns {ThunkAction}
 */
const addWidget = (payload: Widget): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: DASHBOARD_EVENTS.ADD_WIDGET,
		payload
	});
};

/**
 * Закрываем панель редактирования виджетов
 * @returns {ThunkAction}
*/
const closeWidgetPanel = (): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: DASHBOARD_EVENTS.CLOSE_WIDGET_PANEL
	});
};

/**
 * Редактировать виджет
 * @param {string} payload - id редактируемого виджета
 * @returns {ThunkAction}
*/
const editWidget = (payload: string): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: DASHBOARD_EVENTS.EDIT_WIDGET,
		payload
	});
};

/**
 * Сохраняем изменение положения виджета
 * @param {Layout} payload - массив объектов местоположения виджетов на дашборде
 * @returns {ThunkAction}
 */
const editLayout = (payload: Layout): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: DASHBOARD_EVENTS.EDIT_LAYOUT,
		payload
	});
};

/**
 * Обновить редактируемую информацию виджета
 * @param {object} payload - объект с ключом и значением редактируемого поля
 * @returns {ThunkAction}
*/
const updateWidget = (payload: updateInfo): ThunkAction => (dispatch: Dispatch): void => {
	dispatch({
		type: DASHBOARD_EVENTS.UPDATE_WIDGET,
		payload
	});
};

export {
	addWidget,
	closeWidgetPanel,
	editLayout,
	editWidget,
	updateWidget
};
