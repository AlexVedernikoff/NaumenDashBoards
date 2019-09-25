// @flow
import axios from 'axios';
import {BASE_URL, KEY} from 'constants/api';
import {DASHBOARD_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {push} from 'connected-react-router';
import {setRootDataSources} from 'store/sources/data/actions';
import {switchOffStatic, switchOnStatic} from 'store/widgets/data/actions';

/**
 * Получаем данные, необходимые для работы дашборда
 * @returns {ThunkAction}
 */
const fetchDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestDashboard);

	try {
		const {data} = await axios.post(`${BASE_URL}/exec-post?accessKey=${KEY}&func=modules.dashboards.getDataSources&params=`);
		dispatch(receiveDashboard());
		dispatch(setRootDataSources(data));
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
	dispatch(switchOffStatic());
	dispatch(push('/edit'));
};

/**
 * Делаем виджеты статичными и переходим на страницу просмотра
 * @returns {ThunkAction}
 */
const seeDashboard = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(resetEditable());
	dispatch(switchOnStatic());
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

const setEditable = () => ({
	type: DASHBOARD_EVENTS.SET_EDITABLE
});

export {
	editDashboard,
	fetchDashboard,
	seeDashboard
};
