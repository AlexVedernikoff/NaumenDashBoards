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
	const {controls, timeUpdate, trails} = geolocation;
	const bounds = trails && trails.length ? trails : [];
	const {filterOpen, panelOpen} = controls;
	const panelRightPadding = (filterOpen || panelOpen) ? 400 : 0;

	return {
		bounds: getLatLngBounds(bounds),
		panelRightPadding,
		timeUpdate
	};
};

export const functions: ConnectedFunctions = {
	resetSingleObject
};
