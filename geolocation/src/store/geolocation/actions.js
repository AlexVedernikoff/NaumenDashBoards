// @flow
import {buildUrl, client, getContext, getParams} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from './constants';
import {notify} from 'helpers/notify';
import testData from 'helpers/testData';
import testData2 from 'helpers/testData2';

const environment = process.env.NODE_ENV;

/**
 * Получаем данные, необходимые для работы карты
 * @returns {ThunkAction}
 */
const getGeoMarkers = (markers) => {
	let notGeoMarkers = [];
	let geoMarkers = {
		dynamic: {},
		static: {}
	};

	markers.forEach((marker, index) => {
		if (marker.hasOwnProperty('geoposition')) {
			marker.type === 'dynamic' ? geoMarkers['dynamic'][marker.uuid] = marker : geoMarkers['static'][index] = marker;
		} else {
			notGeoMarkers.push(marker);
		}
	});

	if (notGeoMarkers.length) {
		const sortMarker = notGeoMarkers.sort((a, b) => a.type > b.type ? -1 : a.type < b.type ? 1 : 0);
		const lableMarkers = sortMarker.map(marker => marker.header).join(', ') + '.';

		notify(lableMarkers);
	}

	return geoMarkers;
};

const fetchGeolocation = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const context = getContext();
		const params = await getParams();
		let markers = testData;
		if (environment !== 'development') {
			const {data} = await client.get(buildUrl('mapRest', 'getPoints', context.subjectUuid));
			markers = data;
		}
		const geoMarkers = getGeoMarkers(markers);
		dispatch(setContext(context));
		dispatch(setParams(params));
		dispatch(setData(geoMarkers));
	} catch (error) {
		dispatch(recordGeolocationdError());
	}
};

const reloadGeolocation = (dynamicMarkersUuids: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		let markers = testData2;
		if (environment !== 'development') {
			const {data} = await client.get(buildUrl('mapRest', 'getCurrentGeopositions', dynamicMarkersUuids));
			markers = data;
		}
		Array.isArray(markers) && markers.map(marker => {
			marker.hasOwnProperty('geoposition') && dispatch(reloadActivePoint(marker));
		});
	} catch (error) {
		dispatch(recordGeolocationdError());
	}
};

const setContext = (payload: Object) => ({
	type: GEOLOCATION_EVENTS.SET_CONTEXT,
	payload
});

const setParams = (payload: Object) => ({
	type: GEOLOCATION_EVENTS.SET_PARAMS,
	payload
});

const setData = (payload: Object) => ({
	type: GEOLOCATION_EVENTS.SET_DATA_GEOLOCATION,
	payload
});

const reloadActivePoint = (payload: Object) => ({
	type: GEOLOCATION_EVENTS.RELOAD_ACTIVE_POINT,
	payload
});

const recordGeolocationdError = () => ({
	type: GEOLOCATION_EVENTS.RECORD_GEOLOCATION_ERROR
});

export {
	fetchGeolocation,
	reloadGeolocation
};
