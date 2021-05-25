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
	const {controls, dynamicPoints, timeUpdate, staticPoints} = geolocation;
	const bounds = [].concat(dynamicPoints, staticPoints).filter(point => point.geoposition !== null);
	const {filterOpen, panelOpen} = controls;
	const panelRightPadding = (filterOpen || panelOpen) ? 400 : 0;

	return {
		bounds: getLatLngBounds(bounds),
		panelRightPadding,
		timeUpdate
	};
};

export const functions: ConnectedFunctions = {
	reloadGeolocation,
	resetSinglePoint
};
