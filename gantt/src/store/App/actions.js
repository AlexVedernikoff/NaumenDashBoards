// @flow
import {APP_EVENTS, defaultCommonSettings, defaultResourceSetting, defaultResourceSettings} from './constants';
import type {CommonSettings, DiagramData, ResourceSettings, Settings, Source, UserData} from './types';
import type {Dispatch, ThunkAction} from 'store/types';
import {getContext, getCurrentUser, getDataSources, getAttributeGroups, getDiagramData, getInitialSettings, getUserData, saveData, postChangeProgress} from 'utils/api';
import {v4 as uuidv4} from 'uuid';

/**
 * Получает данные, необходимые для работы ВП
 * @returns {ThunkAction}
 */
const getAppConfig = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderSettings());

		const {contentCode, subjectUuid} = getContext();
		const {email, groupUser: role, name} = await getUserData();
		const sources = await getDataSources();
		const {commonSettings, diagramKey, resourceAndWorkSettings, workProgresses} = await getInitialSettings(contentCode, subjectUuid);

		dispatch(changeWorkProgress(workProgresses));
		dispatch(setDiagramKey(diagramKey));
		dispatch(setContentCode(contentCode));
		dispatch(setSubjectUuid(subjectUuid));
		dispatch(setUserData({email, name, role}));
		dispatch(setCommonSettings(commonSettings && Object.keys(commonSettings).length ? commonSettings : defaultCommonSettings));
		dispatch(setResourceSettings(resourceAndWorkSettings && Object.keys(resourceAndWorkSettings).length ? resourceAndWorkSettings : [{ ...defaultResourceSetting, id: uuidv4() }]));
		dispatch(setSources(sources));
		dispatch(saveMasterSettings());
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Получает список групповых аттрибутов
 * @returns {ThunkAction}
 */
const getListOfGroupAttributes = (metaClass): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const groupAttribute = await getAttributeGroups(metaClass);

		dispatch(saveListOfAttributes(groupAttribute));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Сохраняет и отправляет данные работы у которой изменили прогресс и параметры текущей диаграммы
 * @param {string} workUUID - идентификатор работы
 * @param {number} progress - прогресс работы
 * @returns {ThunkAction}
 */
const saveChangeProgress = (workUUID: string, progress: number): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();

		await postChangeProgress(workUUID, progress, contentCode, subjectUuid);

		dispatch(setContentCode(contentCode));
		dispatch(setSubjectUuid(subjectUuid));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Получает данные, необходимые для отображения данных ВП
 * @returns {ThunkAction}
 */
const getGanttData = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const {contentCode, subjectUuid} = getContext();
		const user = await getCurrentUser();
		const timeZone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
		const {commonSettings, diagramKey, links, tasks} = await getDiagramData(contentCode, subjectUuid, user, timeZone);

		dispatch(setContentCode(contentCode));
		dispatch(setDiagramKey(diagramKey));
		dispatch(setSubjectUuid(subjectUuid));
		dispatch(setCommonSettings(commonSettings && Object.keys(commonSettings).length ? commonSettings : defaultCommonSettings));
		dispatch(setDiagramData(tasks || []));
		dispatch(setDiagramLinksData(links || []));
	} catch (error) {
		dispatch(setErrorData(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Отправляет обновленные данные
 * @param {Settings} data - сохраняемые пользователем настройки
 * @returns {ThunkAction}
 */
const saveSettings = (data: Settings): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const {commonSettings, resourceAndWorkSettings} = await saveData(subjectUuid, contentCode, data);

		await dispatch(getGanttData());
		dispatch(showLoaderSettings());
		dispatch(setCommonSettings(commonSettings || defaultCommonSettings));
		dispatch(setResourceSettings(resourceAndWorkSettings || defaultResourceSettings));
		dispatch(saveMasterSettings());
	} catch (error) {
		dispatch(setErrorSettings(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Сохраняет копию исходных данных
 */
const saveMasterSettings = () => ({
	type: APP_EVENTS.SAVE_MASTER_SETTINGS
});

/**
 * Сохраняет список аттрибутов
 */
const saveListOfAttributes = (payload: ListOfAttributes) => ({
	payload,
	type: APP_EVENTS.SET_ATTRIBUTE
});

/**
 * Скрывает индикатор загрузки диаграммы
 */
const hideLoaderData = () => ({
	type: APP_EVENTS.HIDE_LOADER_DATA
});

/**
 * Показывает индикатор загрузки диаграммы
 */
const showLoaderData = () => ({
	type: APP_EVENTS.SHOW_LOADER_DATA
});

/**
 * Скрывает индикатор загрузки панели настроек
 */
const hideLoaderSettings = () => ({
	type: APP_EVENTS.HIDE_LOADER_SETTINGS
});

/**
 * Показывает индикатор загрузки панели настроек
 */
const showLoaderSettings = () => ({
	type: APP_EVENTS.SHOW_LOADER_SETTINGS
});

/**
 * Сохраняет contentCode - код самого ВП
 * @param {string} payload - contentCode
 */
const setContentCode = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_CONTENT_CODE
});

/**
 * Сохраняет ключ диаграммы
 * @param {string} payload - ключ диаграммы
 */
const setDiagramKey = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_DIAGRAM_KEY
});

/**
 * Сохраняет subjectUuid - код объекта, куда встроенно ВП
 * @param {string} payload - subjectUuid
 */
const setSubjectUuid = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_SUBJECT_UUID
});

/**
 * Сохраняет данные о пользователе
 * @param {UserData} payload - данные пользователя
 */
const setUserData = (payload: UserData) => ({
	payload,
	type: APP_EVENTS.SET_USER_DATA
});

/**
 * Сохраняет ошибку загрузки данных
 * @param {string} payload - сообщение об ошибке
 */
const setErrorData = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_ERROR_DATA
});

/**
 * Сохраняет ошибку настроек
 * @param {string} payload - сообщение об ошибке
 */
const setErrorSettings = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_ERROR_SETTINGS
});

/**
 * Сохраняет общую ошибку приложения
 * @param {string} payload - сообщение об ошибке
 */
const setErrorCommon = (payload: string) => ({
	payload,
	type: APP_EVENTS.SET_ERROR_COMMON
});

/**
 * Сохраняет общие настройки
 * @param {CommonSettings} payload - общие настройки
 */
const setCommonSettings = (payload: CommonSettings) => ({
	payload,
	type: APP_EVENTS.SET_COMMON_SETTINGS
});

/**
 * Сохраняет настройки ресурсов
 * @param {ResourceSettings} payload - настройки ресурсов
 */
const setResourceSettings = (payload: ResourceSettings) => ({
	payload,
	type: APP_EVENTS.SET_RESOURCE_SETTINGS
});

/**
 * Сохраняет данные связей диаграммы
 * @param {DiagramData} payload - данные диаграммы
 */
 const setDiagramLinksData = (payload: []) => ({
	payload,
	type: APP_EVENTS.SET_LINKS_DIAGRAM_DATA
});

/**
 * Сохраняет данные диаграммы
 * @param {DiagramData} payload - данные диаграммы
 */
const setDiagramData = (payload: DiagramData) => ({
	payload,
	type: APP_EVENTS.SET_DIAGRAM_DATA
});

/**
 * Сохраняет диапазон времени
 * @param {DiagramData} payload - данные диаграммы
 */
 const setRangeTime = payload => ({
	payload,
	type: APP_EVENTS.SET_RANGE_TIME
});

/**
 * Сохраняет источники
 * @param {Array<Source>} payload - массив из источников
 */
const setSources = (payload: Array<Source>) => ({
	payload,
	type: APP_EVENTS.SET_SOURCES
});

/**
 * Отмена заполненных настроек
 */
const cancelSettings = () => ({
	type: APP_EVENTS.CANCEL_SETTINGS
});

/**
 * Изминение масштаба на диаграмме
 */
const changeScale = (payload: CommonSettings) => ({
	payload,
	type: APP_EVENTS.CHANGE_SCALE
});

/**
 * Изменение отображения табов
 */
const setColumnSettings = payload => ({
	payload,
	type: APP_EVENTS.SET_COLUMN_SETTINGS
});

/**
 * Изменение колонки задачи
 */
const setColumnTask = payload => ({
	payload,
	type: APP_EVENTS.SET_COLUMN_TASK
});

/**
 * Изменение прогресса работы
 */
const changeWorkProgress = (payload: WorkProgress) => ({
	payload,
	type: APP_EVENTS.SET_WORK_PROGRESS
});

export {
	cancelSettings,
	changeScale,
	getAppConfig,
	getGanttData,
	getListOfGroupAttributes,
	hideLoaderData,
	hideLoaderSettings,
	saveListOfAttributes,
	saveChangeProgress,
	saveSettings,
	setColumnSettings,
	setCommonSettings,
	setColumnTask,
	changeWorkProgress,
	setDiagramLinksData,
	setDiagramData,
	setRangeTime,
	setResourceSettings,
	showLoaderData,
	showLoaderSettings
};
