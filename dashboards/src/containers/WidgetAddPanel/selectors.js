// @flow
import {addNewWidget} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {showCopyPanel} from 'store/dashboard/settings/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	layoutMode: state.dashboard.settings.layoutMode
});

export const functions: ConnectedFunctions = {
	addNewWidget,
	showCopyPanel
};
