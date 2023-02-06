// @flow
import type {Context, UserData} from 'types/api';
import {initialGeolocationState} from 'store/geolocation/init';
import {notify} from 'helpers/notify';

const injectJsApi = () => top.injectJsApi(top, window);

/**
 * Получаем контекст встроенного приложения.
 * subjectUuid - код объекта, куда встроенно ВП.
 * contentCode - код самого ВП.
 * @returns {Context}
 */
const getContext = (): Context => {
	if (process.env.NODE_ENV === 'development') {
		return {
			contentCode: 'Dashbord12',
			currentUser: 'user12',
			subjectUuid: 'root$101'
		};
	}

	const {jsApi} = window;

	return {
		contentCode: jsApi.findContentCode(),
		currentUser: jsApi.getCurrentUser(),
		subjectUuid: jsApi.extractSubjectUuid()
	};
};

const getParams = async () => {
	const {params} = initialGeolocationState;

	if (process.env.NODE_ENV === 'development') {
		return params;
	}

	const {jsApi} = window;
	const paramsApp = await jsApi.commands.getCurrentContentParameters().then(data => data);
	const {listName, locationUpdateFrequency, requestCurrentLocation, updatePointsMode} = paramsApp;

	if (!listName) {
		paramsApp.listName = params.listName;
	}

	if (!requestCurrentLocation) {
		paramsApp.requestCurrentLocation = params.requestCurrentLocation;
	}

	if (!locationUpdateFrequency) {
		paramsApp.locationUpdateFrequency = params.locationUpdateFrequency;
	}

	if (!updatePointsMode) {
		paramsApp.updatePointsMode = params.updatePointsMode;
	}

	paramsApp.autoUpdateLocation = paramsApp.autoUpdateLocation === 'true';
	paramsApp.requestCurrentLocation = paramsApp.requestCurrentLocation === 'true';

	return paramsApp;
};

const getMapObjects = async (contentCode: string, subjectUuid: string, currentUser: UserData) => {
	const {jsApi} = window;
	return await jsApi.restCallModule('mapRestSettings', 'getMapObjects', subjectUuid, contentCode, currentUser);
};

const changeState = async (uuid: string, states: Array<string>): Promise<string | null> => {
	const {jsApi} = window;
	let result;

	try {
		result = await jsApi.forms.changeState(uuid, states);
	} catch (err) {
		const message = err.toString();

		notify('common', 'info', message);
	}

	return result || Promise.resolve(null);
};

const changeResponsible = async (uuid: string): Promise<string | null> => {
	const {jsApi} = window;
	let result;

	try {
		return await jsApi.forms.changeResponsible(uuid);
	} catch (err) {
		const message = err.toString();

		notify('common', 'info', message);
	}

	return result || Promise.resolve(null);
};

const getEditForm = (objectUUID: string, editFormCode: string) => {
	const {jsApi} = window;
	return new Promise((resolve, reject) => {
		jsApi.commands.quickEditObject(objectUUID, editFormCode, {}, (uuid, error) => {
			if (error) {
				reject(error);
			} else {
				resolve(uuid);
			}
		});
	});
};

const getUuidObjects = async (searchString: string) => {
	if (process.env.NODE_ENV === 'development') {
		return [searchString];
	}

	const {jsApi} = window;
	return jsApi.restCallModule('mapRestSettings', 'getUuidObjects', searchString);
};

export {
	changeResponsible,
	changeState,
	getContext,
	getEditForm,
	getParams,
	getMapObjects,
	getUuidObjects,
	injectJsApi
};
