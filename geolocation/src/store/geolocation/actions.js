// @flow
import {buildUrl, client, getContext, getParams} from 'utils/api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from './constants';
import {getTimeInSeconds} from 'helpers/time';
import {notify} from 'helpers/notify';
import type {Point} from 'types/point';
import testData from 'helpers/testData';
import testData2 from 'helpers/testData2';

const environment = process.env.NODE_ENV;

/**
 * Получаем данные, необходимые для работы карты
 * @returns {ThunkAction}
 */
const showNotGeoNotifications = (notGeoMarkers: Array<Point>) => {
	const label = notGeoMarkers
		.sort((a, b) => a.type > b.type ? -1 : a.type < b.type ? 1 : 0)
		.map(marker => marker.header).join(', ') + '.';
	notify('geolocation', 'info', label);
};

const getGeoMarkers = (markers: Array<Point>) => {
	const notGeoMarkers = [];
	const geoMarkers = {
		dynamic: [],
		multiple: [],
		static: []
	};

	markers.forEach((marker) => {
		const {geoposition, header} = marker;

		if (marker.hasOwnProperty('geoposition')) {
			const anotherOne = markers.find((markerTmp) =>
				marker.type !== 'dynamic'
				&& markerTmp.header !== marker.header
				&& JSON.stringify(markerTmp.geoposition) === JSON.stringify(geoposition)
			);

			if (anotherOne) {
				const multipleMarkerIndex = geoMarkers.multiple.findIndex(markerTmp => JSON.stringify(markerTmp.geoposition) === JSON.stringify(marker.geoposition));

				if (multipleMarkerIndex === -1) {
					geoMarkers.multiple.push({
						data: [marker],
						geoposition,
						header,
						type: 'multiple'
					});
				} else {
					geoMarkers.multiple[multipleMarkerIndex].data.push(marker);
				}
			} else {
				marker.type === 'dynamic' ? geoMarkers.dynamic.push(marker) : geoMarkers.static.push(marker);
			}
		} else {
			notGeoMarkers.push(marker);
		}
	});

	notGeoMarkers.length && showNotGeoNotifications(notGeoMarkers);

	return geoMarkers;
};

const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<any> => {
	try {
		const context = getContext();
		const params = await getParams();
		dispatch(setContext(context));
		dispatch(setParams(params))
			.then(() => dispatch(fetchGeolocation()))
			.then(() => dispatch(reloadGeolocation()))
			.catch(error => error);
	} catch (error) {
		dispatch(recordGeolocationdError());
	}
};

const fetchGeolocation = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let markers = testData;
		const {context, params} = getState().geolocation;
		const {getPointsMethodName} = params;
		const {subjectUuid} = context;

		if (environment !== 'development') {
			const query = `user,'${getPointsMethodName}','${subjectUuid}'`;
			const {data} = await client.get(buildUrl('mapRest', 'getPoints', query));

			markers = data;
		}
		!markers.length && notify('empty', 'empty');
		const geoMarkers = getGeoMarkers(markers);
		dispatch(setData(geoMarkers));
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError());
	}
};

const reloadGeolocation = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let markers = testData2;
		const {dynamicMarkers, params} = getState().geolocation;
		const dynamicMarkersUuids = dynamicMarkers.map(marker => marker.uuid).join("','");
		const {requestCurrentLocation, locationUpdateFrequency} = params;
		const updateFrequency = getTimeInSeconds(locationUpdateFrequency);

		if (environment !== 'development' && dynamicMarkersUuids) {
			const query = `user, ${requestCurrentLocation.toString()}, ${updateFrequency}, '${dynamicMarkersUuids}'`;
			const {data} = await client.get(buildUrl('mapRest', 'getLastGeopositions', query));
			markers = data;
		}
		Array.isArray(markers) && markers.map(marker => {
			if (marker.hasOwnProperty('geoposition')) {
				const index = dynamicMarkers.findIndex(markerTmp => markerTmp.uuid === marker.uuid);
				if (index !== -1) {
					dynamicMarkers[index].geoposition = marker.geoposition;
				}
			}
		});
		dispatch(reloadActivePoint(dynamicMarkers));
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError());
	}
};

const setContext = (payload: Object) => ({
	type: GEOLOCATION_EVENTS.SET_CONTEXT,
	payload
});

const setParams = (payload: Object) => dispatch => {
	dispatch({
		type: GEOLOCATION_EVENTS.SET_PARAMS,
		payload
	});
	return Promise.resolve();
};

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
	getAppConfig,
	fetchGeolocation,
	reloadGeolocation
};
