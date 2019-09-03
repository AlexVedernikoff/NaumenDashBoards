// @flow
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {Layout} from 'types/layout';
import type {Widget} from 'entities';

/**
 * Добавляем новый виджет в массив дашборда
 * @param {Widget} payload - Объект добавленного виджета
 * @returns ThunkAction
 */
const addWidget = (payload: Widget): ThunkAction => (dispatch: Dispatch, getState?: GetState): void => {
	dispatch({
		type: DASHBOARD_EVENTS.ADD_WIDGET,
		payload
	});
};

/**
 * Сохраняем изменение положения виджета
 * @param {Layout} payload - массив объектов местоположения виджетов на дашборде
 * @returns ThunkAction
 */
const editLayout = (payload: Layout): ThunkAction => (dispatch: Dispatch, getState?: GetState): void => {
	dispatch({
		type: DASHBOARD_EVENTS.EDIT_LAYOUT,
		payload
	});
};

export {
	addWidget,
	editLayout
};
