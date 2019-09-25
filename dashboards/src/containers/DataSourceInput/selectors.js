// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {fetchDataSources} from 'store/sources/data/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => ({
	attributes: state.sources.attributes.map,
	dataSources: state.sources.data.map
});

export const functions: ConnectedFunctions = {
	fetchDataSources
};
