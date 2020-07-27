// @flow
import {addWidget} from 'store/widgets/data/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	layoutMode: state.dashboard.layoutMode,
	widgets: state.widgets.data.map
});

export const functions: ConnectedFunctions = {
	addWidget
};
