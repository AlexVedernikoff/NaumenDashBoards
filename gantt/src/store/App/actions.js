// @flow
import {APP_EVENTS} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getContext, getDataSources, getInitialSettings} from 'utils/api';
import type {Settings, Sources} from './types';

/**
 * Получает данные, необходимые для работы ВП
 * @returns {ThunkAction}
 */
const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const context = getContext();
		const settings = await getInitialSettings();
		const sources = await getDataSources();

		dispatch(showLoader());
		dispatch(setContext(context));
		dispatch(setCommonSettings(settings.commonSettings));
		dispatch(setResourceSettings(settings.resourceAndWorkSettings));
		dispatch(setSources(sources));
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(hideLoader());
	}
};

const hideLoader = () => ({
	type: APP_EVENTS.HIDE_LOADER
});

const showLoader = () => ({
	type: APP_EVENTS.SHOW_LOADER
});

const setContext = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_CONTEXT
});

const setError = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_ERROR
});

const setCommonSettings = (payload: CommonSettings) => ({
	payload,
	type: APP_EVENTS.SET_COMMON_SETTINGS
});

const setResourceSettings = (payload: ResourceSettings) => ({
	payload,
	type: APP_EVENTS.SET_RESOURCE_SETTINGS
});

const setSources = (payload: Sources) => ({
	payload,
	type: APP_EVENTS.SET_SOURCES
});

export {
	hideLoader,
	setCommonSettings,
	setResourceSettings,
	showLoader,
	getAppConfig
};
