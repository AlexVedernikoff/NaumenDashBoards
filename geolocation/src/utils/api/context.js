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
	const {requestCurrentLocation, locationUpdateFrequency} = paramsApp;

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

export {
	getContext,
	getParams,
	injectJsApi
};
