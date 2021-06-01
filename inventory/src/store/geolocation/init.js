// @flow
import {GEOLOCATION_EVENTS} from './constants';
import type {GeolocationAction, GeolocationState} from './types';

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
	panelShow: 'static',
	params: {
		autoUpdateLocation: true,
		colorPart: '#000000',
		groupingMethodName: '',
		listName: 'Объекты ВОЛС',
		locationUpdateFrequency: {length: 60, interval: 'SECOND'},
		requestCurrentLocation: false,
		updatePointsMode: 'getTrails'
	},
	showSingleObject: false,
	singleObject: null,
	staticGroups: [],
	success: false,
	timeUpdate: new Date().getTime(),
	trails: []
};

export const defaultGeolocationAction: GeolocationAction = {
	type: GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION,
	payload: null
};
