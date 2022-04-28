// @flow
import {
	addNewWork,
	addNewWorkForVersionRequest,
	changeWorkProgressFromVersionRequest,
	deleteGanttVersionSettingsRequest,
	deleteWorkDateRanges,
	deleteWorkFromVersionDiagramRequest,
	editWorkData,
	editWorkDataFromVersionRequest,
	editWorkDateRangesFromVersionRequest,
	getContext,
	getDataSources,
	getDiagramData,
	getGanttVersionDiagramData,
	getGanttVersionsSettings,
	getGanttVersionsSettingsFromDiagramVersionKey,
	getInitialSettings,
	getUserData,
	getWorkAttributes,
	getWorkPageLink,
	postChangedWorkInterval,
	postChangedWorkProgress,
	postChangedWorkRelations,
	saveData,
	saveGanttVersionSettingsRequest,
	updateGanttVersionSettingsRequest
} from 'utils/api';
import {APP_EVENTS, defaultCommonSettings, defaultResourceSetting, defaultResourceSettings} from './constants';
import type {CommonSettings, DiagramData, ResourceSettings, Settings, Source, UserData} from './types';
import type {Dispatch, ThunkAction} from 'store/types';
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
		await dispatch(getGanttData());
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Получает все настройки версий
* @param {string} diagramKey - ключ диаграммы
* @return {ThunkAction}
*/
const getVersionSettingsAll = (diagramKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await getGanttVersionsSettings(diagramKey);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Получает настройки версий
* @param {string} versionKey - ключ диаграммы версий
* @return {ThunkAction}
*/
const getVersionSettings = (diagramKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await getGanttVersionsSettingsFromDiagramVersionKey(diagramKey);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Сохраняет настройки версий диаграммы в хранилище
* @param {string} title - название версии
* @param {string} createdDate - дата создания
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
* @param {string} subjectUUID - UUID объекта
*/
const savedGanttVersionSettings = (title: string, createdDate: string, contentCode: string, subjectUUID: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await saveGanttVersionSettingsRequest(contentCode, createdDate, subjectUUID, title);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Изменяет поля в диаграмме версий
* @param {string} versionKey - ключ диаграммы версий
* @param {string} title - название диаграммы
*/
const updateGanttVersionSettings = (versionKey: string, title: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await updateGanttVersionSettingsRequest(title, versionKey);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Удаляет диаграмму версий из хранилища
* @param {string} ganttVersionId  - индекс диаграммы
*/
const deleteGanttVersionSettings = (ganttVersionId: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await deleteGanttVersionSettingsRequest(ganttVersionId);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Редактирует диапазон дат работ диаграмм версий
* @param {string} versionKey - ключ диаграммы версий
* @param {workDateInterval} workDateInterval - объект временных рамок работы
* @param {string} subjectUUID - UUID объекта
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
*/
const editWorkDateRangesFromVersion = (versionKey: string, workDateInterval: workDateInterval, subjectUUID: string, contentCode: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await editWorkDateRangesFromVersionRequest(contentCode, subjectUUID, versionKey, workDateInterval);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Добавляет новую работу в диаграмму версий
* @param versionKey - ключ диаграммы версий
* @param classFqn - метакласс работы
* @param workData - данные работы
* @param timezone - таймзона устройства пользователя
*/
const addNewWorkForVersion = (classFqn: string, timezone: string, versionKey: string, workData: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await addNewWorkForVersionRequest(classFqn, timezone, versionKey, workData);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Редактирует работы в диаграмме версий
* @param versionKey - ключ диаграммы версий
* @param workUUID - индефекатор работы
* @param workData - данные работы
* @param classFqn - метакласс работы
* @param timezone - таймзона устройства пользователя
*/
const editWorkDataFromVersion = (classFqn: string, workUUID: string, versionKey: string, workData: string, timezone): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {

		await editWorkDataFromVersionRequest(classFqn, timezone, workData, workUUID);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Редактирует прогресс работы в диаграмме версий
* @param versionKey - ключ диаграммы версий
* @param workUUID - индефекатор работы
* @param contentCode - ключ контента, на котором расположена диаграмма
* @param subjectUUID - UUID объекта
* @param progress - прогресс работы
*/
const changeWorkProgressFromVersion = (versionKey: string, workUUID: string, contentCode: string, subjectUUID: string, progress: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await changeWorkProgressFromVersionRequest(contentCode, progress, subjectUUID, versionKey, workUUID);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Удаляет задачу из диаграммы версий
* @param workUUID - индефекатор работы
* @param versionKey - ключ диаграммы версий
*/
const deleteWorkFromVersionDiagram = (workUUID: string, versionKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await deleteWorkFromVersionDiagramRequest(versionKey, workUUID);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Получает данные для построения версий диаграммы Ганта
* @param {string} workUUID - индефекатор работы
* @param {string} timezone - таймзона устройства пользователя
* @returns {ThunkAction}
*/
const getGanttVersionDiagramDataCurrent = (workUUID: string, timezone: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await getGanttVersionDiagramData(timezone, workUUID);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Удаляет работу
* @param {string} workUUID - индификатор работы
*/
const deleteWork = (workUUID: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await deleteWorkDateRanges(workUUID);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Отправляет новый объект работы
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - индификатор работы
*/
const postNewWorkData = (workData: WorkData, classFqn: string, workUUID: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		await addNewWork(workData, classFqn, workUUID, timezone);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Отправляет измененный объект работы
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - индификатор работы
*/
const postEditedWorkData = (workData: WorkData, classFqn: string, workUUID: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		await editWorkData(workData, classFqn, workUUID, timezone);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Получает список аттрибутов работы
 * @param {string} attributeGroupCode - код группы аттрибутов
 * @param {string} metaClassFqn - метакласс работы
 * @param {string} workUUID - идентификатор работы
 * @returns {ThunkAction}
 */
const getListOfWorkAttributes = (metaClassFqn, attributeGroupCode, workUUID): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const workAttributes = await getWorkAttributes(metaClassFqn, attributeGroupCode, workUUID);

		dispatch(setworkAttributes(workAttributes));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Получает ссылку работы
 * @param {string} workUUID - идентификатор работы
 * @returns {ThunkAction}
 */
const getWorlLink = (workUUID): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const workLink = await getWorkPageLink(workUUID);

		dispatch(setWorkLink(workLink));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Сохраняет и отправляет данные изменения прогресса работы
 * @param {string} workUUID - идентификатор работы
 * @param {number} progress - прогресс работы
 * @returns {ThunkAction}
 */
const saveChangedWorkProgress = (workUUID: string, progress: number): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();

		await postChangedWorkProgress(workUUID, progress, contentCode, subjectUuid);

		dispatch(setContentCode(contentCode));
		dispatch(setSubjectUuid(subjectUuid));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Сохраняет и отправляет данные изменненых временных рамок работы
 * @param {workDateInterval} workDateInterval - Объект временных рамок работы
 * @returns {ThunkAction}
 */
const saveChangedWorkInterval = (workDateInterval): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		await postChangedWorkInterval(timezone, workDateInterval, contentCode, subjectUuid);

		dispatch(setContentCode(contentCode));
		dispatch(setSubjectUuid(subjectUuid));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Сохраняет и отправляет данные изменненых рабочих связей
 * @param workRelations - объект связи между работами
 * @returns {ThunkAction}
 */
const saveChangedWorkRelations = (workRelations): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();

		await postChangedWorkRelations(workRelations, contentCode, subjectUuid);

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
		const timeZone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
		const {attributesMap, commonSettings, currentInterval, diagramKey, endDate, progressCheckbox, startDate, tasks, workRelationCheckbox, workRelations} = await getDiagramData(contentCode, subjectUuid, timeZone);

		dispatch(setCurrentValueForInterval(currentInterval));
		dispatch(setRangeTime({endDate, startDate}));
		dispatch(switchProgressCheckbox(progressCheckbox));
		dispatch(switchWorkRelationCheckbox(workRelationCheckbox));
		dispatch(setAttributesMap(attributesMap));
		dispatch(setContentCode(contentCode));
		dispatch(setDiagramKey(diagramKey));
		dispatch(setSubjectUuid(subjectUuid));
		dispatch(setCommonSettings(commonSettings && Object.keys(commonSettings).length ? commonSettings : defaultCommonSettings));
		dispatch(setDiagramData(tasks || []));
		dispatch(setDiagramLinksData(workRelations || []));
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
 * Установить ссылку работы
 * @param {CurrentInterval} currentInterval - Текущий интервал
 */
 const setWorkLink = (workLink: string) => ({
	workLink,
	type: APP_EVENTS.SET_WORK_LINK
});

/**
 * Установить текущенее значение для интервала
 * @param {CurrentInterval} currentInterval - Текущий интервал
 */
 const setCurrentValueForInterval = (currentInterval: CurrentInterval) => ({
	currentInterval,
	type: APP_EVENTS.SET_CURRENT_VALUE_FOR_INTERVAL
});

/**
 * Переключает чекбокс прогресса
 */
 const switchProgressCheckbox = (isShowProgress: Boolean) => ({
	isShowProgress,
	type: APP_EVENTS.SWITCH_PROGRESS_CHECKBOX
});

/**
 * Переключает чекбокс связи работы
 */
 const switchWorkRelationCheckbox = (isShowWorkRelation: Boolean) => ({
	isShowWorkRelation,
	type: APP_EVENTS.SWITCH_WORK_RELATION_CHECKBOX
});

/**
 * Сохраняет аттрибуты работы
 */
 const setworkAttributes = payload => ({
	payload,
	type: APP_EVENTS.SET_WORK_ATTRIBUTES
});

/**
 * Сохраняет коллекцию аттрибутов
 */
 const setAttributesMap = payload => ({
	payload,
	type: APP_EVENTS.SET_ATTRIBUTE_MAP
});

/**
 * Сохраняет копию исходных данных
 */
const saveMasterSettings = () => ({
	type: APP_EVENTS.SAVE_MASTER_SETTINGS
});

/**
 * Сохраняет список аттрибутов
 */
 const saveListOfAttributes = payload => ({
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
	changeWorkProgress,
	deleteWork,
	getAppConfig,
	getGanttData,
	getListOfWorkAttributes,
	getVersionSettings,
	getGanttVersionDiagramDataCurrent,
	getVersionSettingsAll,
	getWorlLink,
	hideLoaderData,
	hideLoaderSettings,
	postEditedWorkData,
	postNewWorkData,
	deleteWorkFromVersionDiagram,
	changeWorkProgressFromVersion,
	deleteGanttVersionSettings,
	addNewWorkForVersion,
	editWorkDataFromVersion,
	savedGanttVersionSettings,
	editWorkDateRangesFromVersion,
	updateGanttVersionSettings,
	setAttributesMap,
	saveListOfAttributes,
	saveChangedWorkRelations,
	saveChangedWorkProgress,
	saveChangedWorkInterval,
	saveSettings,
	setColumnSettings,
	setCommonSettings,
	setColumnTask,
	setCurrentValueForInterval,
	setDiagramLinksData,
	setDiagramData,
	setRangeTime,
	setResourceSettings,
	showLoaderSettings,
	switchProgressCheckbox,
	switchWorkRelationCheckbox
};
