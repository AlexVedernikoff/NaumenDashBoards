// @flow
import type {AppState} from 'store/types';
import {changeZoom, resetSingleObject} from 'store/geolocation/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import getLatLngBounds from 'helpers/bound';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */
export const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {controls: {zoom}, mapObjects, mapSelect, mapsKeyList, showSingleObject, singleObject, timeUpdate} = geolocation;
	const bounds = mapObjects && mapObjects.length ? mapObjects : [];

	return {
		bounds: getLatLngBounds(bounds),
		mapSelect,
		mapsKeyList,
		showSingleObject,
		singleObject,
		timeUpdate,
		zoom
	};
};

export const functions: ConnectedFunctions = {
	changeZoom,
	resetSingleObject
};
