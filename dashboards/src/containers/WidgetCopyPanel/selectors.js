// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {copyWidget} from 'store/widgets/actions';
import {fetchDashboards} from 'store/dashboards/actions';
import {seeDashboard} from 'store/dashboard/settings/actions';
import {validateWidgetToCopy} from 'store/widgets/data/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	dashboards: state.dashboards
});

export const functions: ConnectedFunctions = {
	cancelForm: seeDashboard,
	copyWidget,
	fetchDashboards,
	validateWidgetToCopy
};
