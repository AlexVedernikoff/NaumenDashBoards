// @flow
import type {Context} from 'types/api';
import {initialGeolocationState} from 'store/geolocation/init';

const injectJsApi = () => top.injectJsApi(top, window);

/**
 * Получаем контекст встроенного приложения.
 * subjectUuid - кода объекта куда встроенно ВП.
 * contentCode - код самого ВП.
 * @returns {Context}
 */
const getContext = (): Context => {
	if (process.env.NODE_ENV === 'development') {
		return {
			contentCode: 'Dashbord12',
			subjectUuid: 'root$101'
		};
	}

	const {jsApi} = window;

	return {
		contentCode: jsApi.findContentCode(),
		subjectUuid: jsApi.extractSubjectUuid(),
		user: jsApi.getCurrentUser()
	};
};

const getParams = async () => {
	const {params} = initialGeolocationState;

	if (process.env.NODE_ENV === 'development') {
		return params;
	}

	const {jsApi} = window;
	const paramsApp = await jsApi.commands.getCurrentContentParameters().then(data => data);
	const {dynamicPointsListName, locationUpdateFrequency, requestCurrentLocation, staticPointsListName} = paramsApp;

	if (!dynamicPointsListName) {
		paramsApp.dynamicPointsListName = params.dynamicPointsListName;
	}

	if (!staticPointsListName) {
		paramsApp.staticPointsListName = params.staticPointsListName;
	}

	if (!requestCurrentLocation) {
		paramsApp.requestCurrentLocation = params.requestCurrentLocation;
	}

	if (!locationUpdateFrequency) {
		paramsApp.locationUpdateFrequency = params.locationUpdateFrequency;
	}

	paramsApp.autoUpdateLocation = paramsApp.autoUpdateLocation === 'true';
	paramsApp.requestCurrentLocation = paramsApp.requestCurrentLocation === 'true';

	return paramsApp;
};

const getMap = async (contentCode: string, subjectUuid: string) => {
	const {jsApi} = window;
	const data = await jsApi.restCallModule('mapRest', 'getMap', subjectUuid, contentCode);

	return data;
};

const getLastGeopositions = async (contentCode: string, subjectUuid: string, dynamicPointsUuids: any) => {
	const {jsApi} = window;
	const data = await jsApi.restCallModule('mapRest', 'getLastGeopositions', subjectUuid, contentCode, dynamicPointsUuids);

	return data;
};

const changeState = async (uuid: string, states: Array<any>) => {
	const {jsApi} = window;
	const response = await jsApi.forms.changeState(uuid, states);

	return response;
}

const changeResponsible = async (uuid: string) => {
	const {jsApi} = window;
	const response = await jsApi.forms.changeResponsible(uuid);

	return response;
};

export {
	changeResponsible,
	changeState,
	getContext,
	getMap,
	getLastGeopositions,
	getParams,
	injectJsApi
};
