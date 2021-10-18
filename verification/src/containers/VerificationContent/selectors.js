// @flow
import type {ConnectedProps} from './types';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => {
	const {setting} = state.setting;
	const {attributes} = state.attributes;

	return {
		attributes,
		setting
	};
};
