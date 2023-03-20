// @flow
import {addNewWidget} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {DISPLAY_MODE} from 'store/widgets/data/constants';
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
	const newWidgetDisplay = isUserMode ? DISPLAY_MODE.ANY : state.dashboard.settings.layoutMode;

	return {
		canShowCopyPanel,
		newWidgetDisplay
	};
};

export const functions: ConnectedFunctions = {
	addNewWidget,
	showCopyPanel
};
