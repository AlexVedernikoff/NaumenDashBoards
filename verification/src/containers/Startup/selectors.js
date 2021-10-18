// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getAttributes} from 'store/attributes/actions';
import {getSetting} from 'store/setting/actions';
import type {State} from 'store/types';

/**
 * @param {State} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: State): ConnectedProps => {
	const {error: errorSetting, loading: loadingSetting} = state.setting;
	const {error: errorAttributes, loading: loadingAttributes} = state.attributes;

	return {
		errorAttributes,
		errorSetting,
		loadingAttributes,
		loadingSetting
	};
};

export const functions: ConnectedFunctions = {
	getAttributes,
	getSetting
};
