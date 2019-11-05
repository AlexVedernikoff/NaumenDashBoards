// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import getLatLngBounds from 'helpers/bound';
import {getTimeInSeconds} from 'helpers/time';
import {reloadGeolocation} from 'store/geolocation/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */

export const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicMarkers, staticMarkers, multipleMarkers, params} = geolocation;
	const reloadInterval = params.autoUpdateLocation ? getTimeInSeconds(params.locationUpdateFrequency) : 0;
	const bounds = [].concat(dynamicMarkers, staticMarkers, multipleMarkers);

	return {
		bounds: getLatLngBounds(bounds),
		reloadInterval
	};
};

export const functions: ConnectedFunctions = {
	reloadGeolocation
};
