// @flow
import {DASHBOARDS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';

/**
 * Получает список всех дашбордов с наборами виджетов
 * @returns {ThunkAction}
 */
const fetchDashboards = () => async (dispatch: Dispatch) => {
	dispatch({
		type: DASHBOARDS_EVENTS.REQUEST_DASHBOARDS
	});

	try {
		const dashboards = await window.jsApi.restCallModule('dashboardSettings', 'getDashboardsAndWidgetsTree');

		dispatch({
			payload: dashboards,
			type: DASHBOARDS_EVENTS.RESPONSE_DASHBOARDS
		});
	} catch (e) {
		dispatch({
			type: DASHBOARDS_EVENTS.RECORD_DASHBOARDS_ERROR
		});
	}
};

export {
	fetchDashboards
};
