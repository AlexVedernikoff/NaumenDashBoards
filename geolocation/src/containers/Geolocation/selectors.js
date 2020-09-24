// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import getLatLngBounds from 'helpers/bound';
import {reloadGeolocation, resetSinglePoint} from 'store/geolocation/actions';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */

export const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints,showSinglePoint, singlePoint, loading, staticPoints} = geolocation;
	const bounds = [].concat(dynamicPoints, staticPoints);
	const showSingle = (singlePoint) => singlePoint.geoposition ? true : false;

	return {
		bounds: getLatLngBounds(bounds),
		loading,
		showSinglePoint: (showSinglePoint && singlePoint) ? showSingle(singlePoint) : false,
		singlePoint
	};
};

export const functions: ConnectedFunctions = {
	reloadGeolocation,
	resetSinglePoint
};
