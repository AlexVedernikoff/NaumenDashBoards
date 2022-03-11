// @flow

import type {GeolocationAction, GeolocationState} from './types';
import {GEOLOCATION_EVENTS} from './constants';

export const initialGeolocationState: GeolocationState = {
	context: {
		contentCode: '',
		subjectUuid: ''
	},
	controls: {
		filterOpen: false,
		panelOpen: true
	},
	error: false,
	loading: true,
	mapObjects: [],
	panelShow: 'static',
	params: {
		autoUpdateLocation: true,
		colorPart: '#000000',
		groupingMethodName: '',
		listName: 'Объекты ВОЛС',
		locationUpdateFrequency: {interval: 'SECOND', length: 60},
		requestCurrentLocation: false,
		trailsMethodName: 'trailsMethodName',
		updatePointsMode: 'getMapObjects'
	},
	showSingleObject: false,
	singleObject: null,
	staticGroups: [],
	success: false,
	timeUpdate: new Date().getTime()
};

export const defaultGeolocationAction: GeolocationAction = {
	payload: null,
	type: GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION
};
