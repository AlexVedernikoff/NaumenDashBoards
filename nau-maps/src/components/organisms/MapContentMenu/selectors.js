// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {resetSingleObject, showEditForm, toggleMapContextMenu} from 'store/geolocation/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {geolocation: {controls: {mapContentMenuOpen}, singleObject}} = state;
	return {
		mapContentMenuOpen,
		singleObject
	};
};

export const functions: ConnectedFunctions = {
	resetSingleObject,
	showEditForm,
	toggleMapContextMenu
};
