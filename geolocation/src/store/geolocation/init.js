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
	dynamicPoints: [],
	error: false,
	loading: true,
	panelShow: 'static',
	params: {
		autoUpdateLocation: true,
		dynamicPointsListName: 'Инженеры',
		command: 'getCurrentContentParameters',
		colorDynamicActivePoint: '#4D92C8',
		colorDynamicInactivePoint: '#828282',
		colorStaticPoint: '#EB5757',
		groupingMethodName: 'groupingMethodName',
		locationUpdateFrequency: {length: 60, interval: 'SECOND'},
		pointsMethodName: 'pointsMethodName',
		requestCurrentLocation: false,
		staticPointsListName: 'Заявки',
		timeIntervalInactivity: {length: 1200, interval: 'SECOND'},
		updatePointsMode: 'getPoints'
	},
	staticGroups: [],
	staticPoints: [],
	showSinglePoint: false,
	singlePoint: null,
	success: false
};

export const defaultGeolocationAction: GeolocationAction = {
	type: GEOLOCATION_EVENTS.UNKNOWN_GEOLOCATION_ACTION,
	payload: null
};
