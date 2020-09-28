// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps} from './types';
import getLatLngBounds from 'helpers/bound';
import {reloadGeolocation, resetSinglePoint} from 'store/geolocation/actions';
import {filterByGroup} from 'helpers/marker';

/**
 * @param {AppState} state - глобальное хранилище состояния
 * @returns {ConnectedProps}
 */

export const props = (state: AppState): ConnectedProps => {
	const {geolocation} = state;
	const {dynamicPoints, showSinglePoint, singlePoint, loading, staticGroups, staticPoints} = geolocation;
	const points = filterByGroup(staticPoints, staticGroups);
	const bounds = [].concat(dynamicPoints, points);
	const showSingle = (singlePoint) => !!singlePoint.geoposition;

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
