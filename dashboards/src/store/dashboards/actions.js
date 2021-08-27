// @flow
import api from 'api';
import {ApiError} from 'api/errors';
import {createToast} from 'store/toasts/actions';
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
		const dashboards = await api.instance.dashboardSettings.settings.getDashboardsAndWidgetsTree();

		dispatch({
			payload: dashboards,
			type: DASHBOARDS_EVENTS.RESPONSE_DASHBOARDS
		});
	} catch (e) {
		if (e instanceof ApiError) {
			dispatch(createToast({
				text: e.message,
				time: 5000,
				type: 'error'
			}));
		}

		dispatch({
			type: DASHBOARDS_EVENTS.RECORD_DASHBOARDS_ERROR
		});
	}
};

export {
	fetchDashboards
};
