// @flow
import {buildUrl, client, getContext, getEditableParameter} from 'utils/api';
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {getDataSources} from 'store/sources/data/actions';
import {getWidgets, resetWidget} from 'store/widgets/data/actions';
import {push} from 'connected-react-router';

/**
 * Получаем данные, необходимые для работы дашборда
 * @returns {ThunkAction}
 */
const fetchDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestDashboard);

	try {
		const context = getContext();
		const editable = await getEditableParameter();

		dispatch(setContext(context));
		dispatch(setEditable(editable));

		await Promise.all([
			dispatch(getDataSources()),
			dispatch(getRoleMaster()),
			dispatch(getWidgets(true))
		]);

		dispatch(receiveDashboard());
	} catch (error) {
		dispatch(recordDashboardError());
	}
};

const getRoleMaster = (): ThunkAction => async (dispatch: Dispatch) => {
	try {
		const {data} = await client.post(buildUrl('dashboardSettings', 'getAvailabilityGroupMasterDashboard', 'user'));
		dispatch(receiveRoleMaster(data));
	} catch (e) {
		dispatch(recordDashboardError());
	}
};

/**
 * Отключаем статичность виджетов и переходим на страницу редактирования
 * @returns {ThunkAction}
 */
const editDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(push('/edit'));
};

/**
 * Сброс дашборда на дефотные настройки мастера
 * @returns {ThunkAction}
 */
const resetDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const context = getState().dashboard.context;
	const params = `'${context.subjectUuid || ''}','${context.contentCode}',user`;
	await client.post(buildUrl('DevDashboardSettings', 'resetPersonalDashboard', params));
};

/**
 * Делаем виджеты статичными и переходим на страницу просмотра
 * @returns {ThunkAction}
 */
const seeDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(resetWidget());
	dispatch(push('/'));
};

const requestDashboard = () => ({
	type: DASHBOARD_EVENTS.REQUEST_DASHBOARD
});

const receiveRoleMaster = payload => ({
	type: DASHBOARD_EVENTS.RECEIVE_ROLE_MASTER,
	payload
});

const receiveDashboard = () => ({
	type: DASHBOARD_EVENTS.RECEIVE_DASHBOARD
});

const recordDashboardError = () => ({
	type: DASHBOARD_EVENTS.RECORD_DASHBOARD_ERROR
});

const setContext = payload => ({
	type: DASHBOARD_EVENTS.SET_CONTEXT,
	payload
});

const setEditable = payload => ({
	type: DASHBOARD_EVENTS.SET_EDITABLE,
	payload
});

export {
	editDashboard,
	fetchDashboard,
	resetDashboard,
	seeDashboard
};
