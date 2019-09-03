// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

/**
 * При получении виджетов, делаем их статичными, для запрета Drag'n'Drop
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	state.dashboard.widgets.forEach(w => {
		w.layout.static = true;
	});

	return {
		widgets: state.dashboard.widgets
	}
};
