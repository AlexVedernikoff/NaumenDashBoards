// @flow
import {GEOLOCATION_EVENTS} from './constants';
import type {GeolocationAction, GeolocationState} from './types';

export const initialGeolocationState: GeolocationState = {
	context: {
		contentCode: '',
		subjectUuid: ''
	},
	dynamicMarkers: [],
	error: false,
	loading: false,
	multipleMarkers: [],
	params: {
		autoUpdateLocation: true,
		colorStaticPoint: '#EB5757',
		colorDynamicActivePoint: '#4D92C8',
		colorDynamicInactivePoint: '#828282',
		getPointsMethodName: 'employeesByServiceCallCustom',
		locationUpdateFrequency: {length: 60, interval: 'SECOND'},
		requestCurrentLocation: true,
		timeIntervalInactivity: {length: 1200, interval: 'SECOND'},
		updatePointsMode: 'getPoints'
	},
	staticMarkers: [],
	success: false
};

export const defaultGeolocationAction: GeolocationAction = {
	type: GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION,
	payload: null
};
