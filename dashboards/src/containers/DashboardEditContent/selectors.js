// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {editLayout} from 'store/dashboard/actions';
import type {Layout} from 'types/layout';

/**
 *При получении виджетов, отключаем статичность для использования Drag'n'Drop
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	state.dashboard.widgets.forEach(w => {
		w.layout.static = false;
		return w;
	});
	return {
		widgets: state.dashboard.widgets
	}
};

export const functions: ConnectedFunctions = {
	editLayout: (layout: Layout) => editLayout(layout)
};
