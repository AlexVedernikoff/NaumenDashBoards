// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import getLatLngBounds from 'helpers/bound';
import {resetSingleObject} from 'store/geolocation/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {controls: {zoom}, mapObjects, mapSelect, timeUpdate} = geolocation;
	const bounds = mapObjects && mapObjects.length ? mapObjects : [];

	return {
		bounds: getLatLngBounds(bounds),
		mapSelect,
		timeUpdate,
		zoom
	};
};

export const functions: ConnectedFunctions = {
	resetSingleObject
};
