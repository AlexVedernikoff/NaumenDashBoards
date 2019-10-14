// @flow
import {buildUrl, client, getContext} from 'utils/api';
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getWidgets, resetWidget} from 'store/widgets/data/actions';
import {push} from 'connected-react-router';
import {getDataSources, getUserRole} from 'store/sources/data/actions';

/**
 * Получаем данные, необходимые для работы дашборда
 * @returns {ThunkAction}
 */
const fetchDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestDashboard);

	try {
		const context = getContext();
		dispatch(setContext(context));

		await Promise.all([
			dispatch(getDataSources()),
			dispatch(getUserRole()),
			dispatch(getWidgets(true))
		]);

		dispatch(receiveDashboard());
	} catch (error) {
		dispatch(recordDashboardError());
	}
};

/**
 * Отключаем статичность виджетов и переходим на страницу редактирования
 * @returns {ThunkAction}
 */
const editDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(setEditable());
	dispatch(push('/edit'));
};

/**
 * Сброс дашборда на дефотные настройки мастера
 * @returns {ThunkAction}
 */
const resetDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	// Модуль DevDashboardSettings или DashboardsSettings
	// Метод resetPersonalDashboard
	// параметры classFqn, contentCode, user

	try {
		const context = getState().dashboard.context;
		const params = `'${context.subjectUuid || ''}','${context.contentCode}',user`;
		await client.post(buildUrl('DevDashboardSettings', 'resetPersonalDashboard', params));
		dispatch(recordDashboardError());
	} catch (e) {
		dispatch(recordDashboardError());
	}
};

/**
 * Делаем виджеты статичными и переходим на страницу просмотра
 * @returns {ThunkAction}
 */
const seeDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(resetEditable());
	dispatch(resetWidget());
	dispatch(push('/'));
};

const requestDashboard = () => ({
	type: DASHBOARD_EVENTS.REQUEST_DASHBOARD
});

const receiveDashboard = () => ({
	type: DASHBOARD_EVENTS.RECEIVE_DASHBOARD
});

const recordDashboardError = () => ({
	type: DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR
});

const resetEditable = () => ({
	type: DASHBOARD_EVENTS.RESET_EDITABLE
});

const setContext = payload => ({
	type: DASHBOARD_EVENTS.SET_CONTEXT,
	payload
});

const setEditable = () => ({
	type: DASHBOARD_EVENTS.SET_EDITABLE
});

export {
	editDashboard,
	fetchDashboard,
	resetDashboard,
	seeDashboard
};
