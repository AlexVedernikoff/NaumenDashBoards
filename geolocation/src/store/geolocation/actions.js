// @flow
import {buildUrl, client, getContext, getParams} from 'utils/api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {GEOLOCATION_EVENTS} from './constants';
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
	notify(label);
};

const getGeoMarkers = (markers: Array<Point>) => {
	const notGeoMarkers = [];
	const geoMarkers = {
		dynamic: [],
		multiple: [],
		static: []
	};

	markers.forEach((marker, index) => {
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

	showNotGeoNotifications(notGeoMarkers);

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

const reloadGeolocation = (): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	try {
		let markers = testData2;
		const {dynamicMarkers} = getState().geolocation;

		const dynamicMarkersUuids = dynamicMarkers.map(marker => marker.uuid).join(',');

		if (environment !== 'development') {
			const {data} = await client.get(buildUrl('mapRest', 'getCurrentGeopositions', dynamicMarkersUuids));
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
