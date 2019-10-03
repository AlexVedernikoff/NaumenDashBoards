// @flow
import {GEOLOCATION_EVENTS} from './constants';
import type {GeolocationAction, GeolocationState} from './types';

export const initialGeolocationState: GeolocationState = {
	context: {
		contentCode: '',
		subjectUuid: ''
	},
	dynamicMarkers: {},
	error: false,
	loading: false,
	params: {
		colorDynamicActivePoint: '#4D92C8',
		colorDynamicInactivePoint: '#828282',
		colorStaticPoint: '#EB5757',
		timeIntervalInactivity: {length: '1200', interval: 'SECOND'}
	},
	staticMarkers: {},
	success: false
};

export const defaultGeolocationAction: GeolocationAction = {
	type: GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION,
	payload: null
};
