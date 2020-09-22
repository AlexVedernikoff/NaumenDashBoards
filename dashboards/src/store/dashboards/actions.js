// @flow
import {createToast} from 'store/toasts/actions';
import {DASHBOARDS_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {parseResponseErrorText} from 'store/helpers';

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
		const errorText = parseResponseErrorText(e.responseText);

		if (errorText) {
			dispatch(createToast({
				text: errorText,
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
