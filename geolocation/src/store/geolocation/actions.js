// @flow
import {getContext, getParams, getMap, getLastGeopositions} from 'utils/api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from './constants';
import {getGeoMarkers} from 'helpers/marker';
import {getTimeInSeconds} from 'helpers/time';
import {notify} from 'helpers/notify';
import type {PanelShow} from 'types/helper';
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
		const {context} = getState().geolocation;
		const {subjectUuid} = context;

		if (environment !== 'development') {
			markers = await getMap(subjectUuid)
		}

		const geoMarkers = getGeoMarkers(markers);

		dispatch(setData(geoMarkers));
	} catch (error) {
		notify('error', 'error');
		dispatch(recordGeolocationdError());
	}
};

const reloadGeolocation = (firstCall: boolean = false): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let refreshDada = testData2;
		const {dynamicPoints, context, params} = getState().geolocation;
		const dynamicPointsUuids = dynamicPoints.map(marker => marker.uuid);
		const {subjectUuid} = context;
		const {autoUpdateLocation, locationUpdateFrequency} = params;

		if (dynamicPointsUuids && firstCall) {
			const reloadInterval = autoUpdateLocation ? getTimeInSeconds(locationUpdateFrequency) : 0;

			if (reloadInterval) {
				setInterval(() => dispatch(reloadGeolocation()), reloadInterval * 1000);
			} else {
				notify('common', 'info', 'Отправлен запрос на получение информации о местоположении. Обновите через пару минут.');
			}
		}
		if (environment !== 'development' && dynamicPointsUuids) {
			refreshDada = await getLastGeopositions(subjectUuid, dynamicPointsUuids);
		}
		const {geopositions, errors} = refreshDada;

		if (errors.length) {
			const label = errors.join(', ') + '.';

			notify('dynamic', 'info', label);
		}
		Array.isArray(geopositions) && geopositions.map(marker => {
			if (marker.hasOwnProperty('geoposition')) {
				const index = dynamicPoints.findIndex(markerTmp => markerTmp.uuid === marker.uuid);
				if (index !== -1) {
					dynamicPoints[index].geoposition = marker.geoposition;
				}
			}
		});
		dispatch(reloadActivePoint(dynamicPoints));
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

const setTab = (payload: PanelShow) => ({
	type: GEOLOCATION_EVENTS.SET_TAB,
	payload
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
	setTab,
	toggleFilter,
	togglePanel,
};
