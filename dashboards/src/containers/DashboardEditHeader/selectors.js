// @flow
import {addWidget} from 'store/dashboard/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import type {LastPosition} from 'types/layout';
import {Widget} from 'entities';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	widgets: state.dashboard.widgets
});

export const functions: ConnectedFunctions = {
	addWidget: (lastPosition: LastPosition) => addWidget(new Widget(lastPosition))
};
