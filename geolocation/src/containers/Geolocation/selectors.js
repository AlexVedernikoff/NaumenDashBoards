// @flow
import getLatLngBounds from 'helpers/bound';
import {reloadGeolocation} from 'store/geolocation/actions';
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */

export const props = (state: AppState): ConnectedProps => {
	const {dynamicMarkers, staticMarkers, multipleMarkers} = state.geolocation;
	const bounds = [].concat(dynamicMarkers, staticMarkers, multipleMarkers);

	return {
		bounds: getLatLngBounds(bounds)
	};
};

export const functions: ConnectedFunctions = {
	reloadGeolocation
};
