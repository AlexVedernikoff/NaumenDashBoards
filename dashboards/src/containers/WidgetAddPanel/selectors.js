// @flow
import {addNewWidget} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {isEditableDashboardContext, isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {showCopyPanel} from 'store/dashboard/settings/actions';
import {USER_ROLES} from 'store/context/constants';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const isEditableContext = isEditableDashboardContext(state);
	const isUserMode = isUserModeDashboard(state);
	const user = state.context.user;
	const canShowCopyPanel = user.role !== USER_ROLES.REGULAR && !isEditableContext && !isUserMode;

	return {
		canShowCopyPanel,
		layoutMode: state.dashboard.settings.layoutMode
	};
};

export const functions: ConnectedFunctions = {
	addNewWidget,
	showCopyPanel
};
