// @flow
import type {AttributeState} from 'store/attribute/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {getAttributeData} from 'store/attribute/actions';

/**
 * @param {AttributeState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AttributeState): ConnectedProps => {
	const {errorCommon} = state.attribute;

	return {
		error: errorCommon
	};
};

export const functions: ConnectedFunctions = {
	getAttributeData,
};
