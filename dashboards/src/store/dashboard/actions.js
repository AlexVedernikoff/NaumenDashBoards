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
		throw e;
	}
};

/**
 * Отключаем статичность виджетов и переходим на страницу редактирования
 * @returns {ThunkAction}
 */
const editDashboard = (): ThunkAction => (dispatch: Dispatch) => {
	dispatch(push('/edit'));
};

/**
 * Сброс дашборда на дефолтные настройки мастера
 * @returns {ThunkAction}
 */
const resetDashboard = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const context = getState().dashboard.context;
	const params = `'${context.subjectUuid || ''}','${context.contentCode}',user`;
	const {data} = await client.post(buildUrl('dashboardSettings', 'resetPersonalDashboard', params));

	if (data) {
		dispatch(getWidgets());
	}
};

/**
 * Делаем виджеты статичными и переходим на страницу просмотра
 * @returns {ThunkAction}
 */
const seeDashboard = (): ThunkAction => (dispatch: Dispatch) => {
	dispatch(resetWidget());
	dispatch(push('/'));
};

/**
 * Отправка файла на почту
 * @param {Blob} file - файл для отправки
 * @param {string} format - формат файла
 * @returns {ThunkAction}
 */
const sendToMail = (file: Blob, format: string): ThunkAction => () => {
	const data = new FormData();
	data.append('fileBytes', file);
	data.append('fileFormat', format);

	client.post(buildUrl('dashboardSendEmail', 'sendFileToMail', 'user'), data, {
		headers: {
			'Content-Type': 'multipart/form-data',
			timeout: 30000
		}
	});
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
	seeDashboard,
	sendToMail
};
