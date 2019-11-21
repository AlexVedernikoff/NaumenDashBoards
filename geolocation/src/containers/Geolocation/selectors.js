// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import getLatLngBounds from 'helpers/bound';
import {reloadGeolocation} from 'store/geolocation/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */

export const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicMarkers, loading, multipleMarkers, staticMarkers} = geolocation;
	const bounds = [].concat(dynamicMarkers, multipleMarkers, staticMarkers);

	return {
		bounds: getLatLngBounds(bounds),
		loading
	};
};

export const functions: ConnectedFunctions = {
	reloadGeolocation
};
