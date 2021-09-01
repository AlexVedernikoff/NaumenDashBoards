// @flow
import {APP_EVENTS, defaultCommonSettings, defaultResourceSettings} from './constants';
import type {Dispatch, ThunkAction} from 'store/types';
import {getContext, getDataSources, getInitialSettings, saveData} from 'utils/api';
import type {Sources} from './types';

/**
 * Получает данные, необходимые для работы ВП
 * @returns {ThunkAction}
 */
const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const sources = await getDataSources();
		const {commonSettings, diagramKey, resourceAndWorkSettings} = await getInitialSettings(contentCode, subjectUuid);

		dispatch(showLoader());
		dispatch(setContentCode(contentCode));
		dispatch(setDiagramKey(diagramKey));
		dispatch(setSubjectUuid(subjectUuid));
		dispatch(setCommonSettings(commonSettings || defaultCommonSettings));
		dispatch(setResourceSettings(resourceAndWorkSettings || defaultResourceSettings));
		dispatch(setSources(sources));
		dispatch(saveMasterSettings());
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(hideLoader());
	}
};

/**
 * Отправляет обновленные данные
 * @returns {ThunkAction}
 * @param data
 */
const saveSettings = (data): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const {commonSettings, resourceAndWorkSettings} = await saveData(subjectUuid, contentCode, data);

		dispatch(showLoader());
		dispatch(setCommonSettings(commonSettings || defaultCommonSettings));
		dispatch(setResourceSettings(resourceAndWorkSettings || defaultResourceSettings));
		dispatch(saveMasterSettings());
	} catch (error) {
		dispatch(setError(error));
	} finally {
		dispatch(hideLoader());
	}
};

/**
 * Сохраняет копию исходных данных
 */
const saveMasterSettings = () => ({
	type: APP_EVENTS.SAVE_MASTER_SETTINGS
});

/**
 * Скрывает лоадер
 */
const hideLoader = () => ({
	type: APP_EVENTS.HIDE_LOADER
});

/**
 * Показывает лоадер
 */
const showLoader = () => ({
	type: APP_EVENTS.SHOW_LOADER
});

/**
 * Сохраняет contentCode - код самого ВП
 * @param payload
 */
const setContentCode = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_CONTENT_CODE
});

/**
 * Сохраняет ключ диаграммы
 * @param payload
 */
const setDiagramKey = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_DIAGRAM_KEY
});

/**
 * Сохраняет subjectUuid - код объекта, куда встроенно ВП
 * @param payload
 */
const setSubjectUuid = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_SUBJECT_UUID
});

/**
 * Сохраняет ошибку
 * @param payload
 */
const setError = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_ERROR
});

/**
 * Сохраняет общие настройки
 * @param payload
 */
const setCommonSettings = (payload: CommonSettings) => ({
	payload,
	type: APP_EVENTS.SET_COMMON_SETTINGS
});

/**
 * Сохраняет настройки ресурсов
 * @param payload
 */
const setResourceSettings = (payload: ResourceSettings) => ({
	payload,
	type: APP_EVENTS.SET_RESOURCE_SETTINGS
});

/**
 * Сохраняет источники
 * @param payload
 */
const setSources = (payload: Sources) => ({
	payload,
	type: APP_EVENTS.SET_SOURCES
});

/**
 * Отмена заполненных настроек
 */
const cancelSettings = () => ({
	type: APP_EVENTS.CANCEL_SETTINGS
});

export {
	cancelSettings,
	getAppConfig,
	hideLoader,
	saveSettings,
	setCommonSettings,
	setResourceSettings,
	showLoader
};
