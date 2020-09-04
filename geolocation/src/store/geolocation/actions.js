// @flow
import {buildUrl, client, getContext, getParams} from 'utils/api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from './constants';
import {getGeoMarkers} from 'helpers/marker';
import {getTimeInSeconds} from 'helpers/time';
import {notify} from 'helpers/notify';
import testData from 'helpers/testData';
import testData2 from 'helpers/testData2';

const environment = process.env.NODE_ENV;

/**
 * Получаем данные, необходимые для работы карты
 * @returns {ThunkAction}
 */

const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<any> => {
	try {
		const context = getContext();
		const params = await getParams();

		dispatch(setContext(context));
		dispatch(setParams(params))
			.then(() => dispatch(fetchGeolocation()))
			.then(() => dispatch(reloadGeolocation(true)))
			.catch(error => error);
	} catch (error) {
		dispatch(recordGeolocationdError());
	}
};

const fetchGeolocation = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let markers = testData;
		const {context, params} = getState().geolocation;
		const {pointsMethodName} = params;
		const {subjectUuid} = context;

		if (environment !== 'development') {
			const query = `user,'${pointsMethodName}','${subjectUuid}'`;
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

const reloadGeolocation = (firstCall: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let markers = testData2;
		const {dynamicMarkers, params} = getState().geolocation;
		const dynamicMarkersUuids = dynamicMarkers.map(marker => marker.uuid).join("','");
		const {requestCurrentLocation, locationUpdateFrequency} = params;
		const updateFrequency = getTimeInSeconds(locationUpdateFrequency);

		if (dynamicMarkersUuids && firstCall) {
			const reloadInterval = params.autoUpdateLocation ? getTimeInSeconds(params.locationUpdateFrequency) : 0;

			if (reloadInterval) {
				setInterval(() => dispatch(reloadGeolocation()), reloadInterval * 1000);
			} else {
				notify('common', 'info', 'Отправлен запрос на получение информации о местоположении. Обновите через пару минут.');
			}
		}
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

const togglePanel = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_PANEL,
});

const toggleFilter = () => ({
	type: GEOLOCATION_EVENTS.TOGGLE_FILTER,
});

export {
	getAppConfig,
	fetchGeolocation,
	reloadGeolocation,
	toggleFilter,
	togglePanel,
};
