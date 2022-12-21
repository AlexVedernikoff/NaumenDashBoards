// @flow
import {
	addNewWorkForVersionRequest,
	applyVersion,
	changeWorkProgressFromVersionRequest,
	checkWorksOfResource,
	createPersonalViewDiagram,
	deleteGanttVersionSettingsRequest,
	deletePersonalViewDiagram,
	deleteWorkDateRanges,
	deleteWorkFromVersionDiagramRequest,
	editWorkData,
	editWorkDataFromVersionRequest,
	editWorkDateRangesFromVersionRequest,
	getContext,
	getDataSources,
	getDiagramData,
	getGanttVersionDiagramData,
	getGanttVersionTitlesAndKeys,
	getGanttVersionsSettings,
	getInitialSettings,
	getUserData,
	getUsers,
	getWorkAttributes,
	getWorkDataForWork,
	getWorks,
	postChangedWorkInterval,
	postChangedWorkProgress,
	postChangedWorkRelations,
	postUsers,
	saveData,
	saveGanttVersionSettingsRequest,
	updateGanttVersionSettingsRequest
} from 'utils/api';
import {APP_EVENTS, defaultCommonSettings, defaultResourceSetting, defaultResourceSettings} from './constants';
import type {CommonSettings, DiagramData, ResourceSettings, Settings, Source, Tasks, UserData, Users, WorkRelations} from './types';
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
 * Создает личный вид
 * @returns {ThunkAction}
 */
const createPersonalView = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		await createPersonalViewDiagram(contentCode, subjectUuid, timezone);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
 * Удаляет личный вид
 * @returns {ThunkAction}
 */
const deletePersonalView = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		await deletePersonalViewDiagram(contentCode, subjectUuid, timezone);
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
const getVersionSettingsAll = (isPersonal: boolean, diagramKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {subjectUuid} = getContext();
		const versions = await getGanttVersionTitlesAndKeys(isPersonal, diagramKey, subjectUuid);

		dispatch(setListVersions(versions));
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Получает список пользователей
* @return {ThunkAction}
*/
const getUsersAll = (): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const users = await getUsers();

		dispatch(setUsers(users));
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
const getVersionSettings = (versionKey: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
		const {workRelations, workProgresses, diagramKey, commonSettings, endDate, startDate, tasks} = await getGanttVersionsSettings(versionKey, timezone);

		dispatch(setColumnTask(tasks));
		dispatch(setCurrentVersion(versionKey));
		dispatch(changeWorkProgress(workProgresses));
		dispatch(setDiagramKey(diagramKey));
		dispatch(setCommonSettings(commonSettings && Object.keys(commonSettings).length ? commonSettings : defaultCommonSettings));
		dispatch(setDiagramLinksData(workRelations));
		dispatch(setRangeTime({endDate, startDate}));
		dispatch(saveMasterSettings());
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
* Сохраняет настройки версий диаграммы в хранилище
* @param {string} title - название версии
* @param {string} createdDate - дата создания
* @param {Tasks} tasks - задачи на диаграмме
* @param {WorkRelations} workRelations - объект связи между работами
*/
const savedGanttVersionSettings = (isPersonal: boolean, commonSettings, title: string, createdDate: string, tasks: Tasks, workRelations: WorkRelations): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();

		await saveGanttVersionSettingsRequest(isPersonal, commonSettings, contentCode, createdDate, subjectUuid, title, tasks, workRelations);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Сохраняет данные текущей версии
* @param {string} diagramKey - ключ диаграммы
* @param {Tasks} tasksClone - копия задач на диаграмме
* @param {WorkRelations} workRelations - объект связи между работами
*/
const saveDataCurrentVersion = (diagramKey: string, tasksClone: Tasks, workRelations: WorkRelations) => async (dispatch) => {
	try {
		const {contentCode, subjectUuid} = getContext();

		await applyVersion(diagramKey, tasksClone, workRelations, contentCode, subjectUuid);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderData());
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
*/
const editWorkDateRangesFromVersion = (versionKey: string, workDateInterval: workDateInterval): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		await editWorkDateRangesFromVersionRequest(subjectUuid, contentCode, timezone, versionKey, workDateInterval);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderSettings());
	}
};

/**
* Добавляет новую работу в диаграмму версий
* @param classFqn - метакласс работы,
* @param timezone - часовой пояс пользователя
* @param versionKey - ключ диаграммы версий
* @param workData - данные работы
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
* @param classFqn - метакласс работы
* @param workUUID - индефекатор работы
* @param versionKey - ключ диаграммы версий
* @param workData - данные работы
* @param timezone - часовой пояс пользователя
*/
const editWorkDataFromVersion = (classFqn: string, workUUID: string, versionKey: string, workData: string, timezone: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await editWorkDataFromVersionRequest(classFqn, workData, timezone, workUUID);
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
* @param {string} timezone - часовой пояс пользователя
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
* @param {string} workUUID - идентификатор работы
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
* Отправляет измененный объект работы
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - идентификатор работы
*/
const postEditedWorkData = (workData: WorkData, classFqn: string, workUUID: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
		const {contentCode, subjectUuid} = getContext();

		await editWorkData(workData, classFqn, timezone, workUUID, contentCode, subjectUuid);
	} catch (error) {
		return error;
	}
};

/**
 * Получает список атрибутов работы
 * @param {string} metaClassFqn - метакласс работы
 * @param {string} attributeGroupCode - код группы атрибутов
 * @param {string} workUUID - идентификатор работы
 * @returns {ThunkAction}
 */
const getListOfWorkAttributes = (metaClassFqn: string, attributeGroupCode: string, workUUID: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
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
 * Получает данные работы
 * @param {string} workUUID - идентификатор работы
* @param {string} diagramKey - ключ диаграммы
 * @returns {ThunkAction}
 */
const getWorkData = (workUUID, diagramKey): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const workData = await getWorkDataForWork(workUUID, diagramKey);

		dispatch(setWorkData(workData));
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
* Отправляет данные пользователей
* @param {Users} data - данные пользователей
*/
const postDataUsers = (data: Users): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await postUsers(data);
	} catch (error) {
		dispatch(setErrorCommon(error));
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
* Сохраняет позицию работу
* @param {string} workId - идентификатор работы
* @param {string} resourceId - идентификатор ресурса
* @param {string} diagramKey - ключ диаграммы
* @returns {ThunkAction}
*/
const savePositionOfWork = (workId, resourceId, diagramKey, tIndex, versionKey): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		await checkWorksOfResource(workId, resourceId, diagramKey, tIndex, versionKey);
	} catch (error) {
		return error;
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
 * Обновляет работы
 * @param {boolean} worksWithoutStartOrEndDateCheckbox - состояние флажка
 * @param {string} timezone - часовой пояс пользователя
 * @param {string} contentCode - ключ контента, на котором расположена диаграмма
 * @param {string} subjectUUID - UUID объекта
 * @return {ThunkAction}
 */
const updateWorks = (worksWithoutStartOrEndDateCheckbox: boolean): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		const {contentCode, subjectUuid} = getContext();
		const timeZone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;

		const workData = await getWorks(contentCode, subjectUuid, timeZone, worksWithoutStartOrEndDateCheckbox);

		// dispatch(setColumnTask(workData));
		dispatch(setContentCode(contentCode));
		dispatch(setSubjectUuid(subjectUuid));
		return workData;
	} catch (error) {
		dispatch(setErrorCommon(error));
		console.log(error);
	} finally {
		dispatch(hideLoaderData());
	}
};

/**
 * Получает данные, необходимые для отображения данных ВП
 * @returns {ThunkAction}
 */
const getGanttData = (personal): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	try {
		dispatch(showLoaderData());

		const {contentCode, subjectUuid} = getContext();
		const timeZone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
		const {
			attributesMap,
			commonSettings,
			currentInterval,
			diagramKey,
			endDate,
			isPersonal,
			isPersonalDiagram,
			milestonesCheckbox,
			progressCheckbox,
			startDate,
			stateMilestonesCheckbox,
			tasks,
			workRelationCheckbox,
			workRelations,
			worksWithoutStartOrEndDateCheckbox
		} = await getDiagramData(contentCode, subjectUuid, timeZone, personal);

		dispatch(getUsersAll());
		dispatch(switchMilestonesCheckbox(milestonesCheckbox));
		dispatch(switchStateMilestonesCheckbox(stateMilestonesCheckbox));
		dispatch(switchWorksWithoutStartOrEndDateCheckbox(worksWithoutStartOrEndDateCheckbox));
		dispatch(setCurrentValueForInterval(currentInterval));
		dispatch(setRangeTime({endDate, startDate}));
		dispatch(switchProgressCheckbox(progressCheckbox));
		dispatch(switchWorkRelationCheckbox(workRelationCheckbox));
		dispatch(setAttributesMap(attributesMap));
		dispatch(setPersonalView(isPersonalDiagram));
		dispatch(setPersonal(isPersonal));
		dispatch(setContentCode(contentCode));
		dispatch(setDiagramKey(diagramKey));
		dispatch(setSubjectUuid(subjectUuid));
		dispatch(setCommonSettings(commonSettings && Object.keys(commonSettings).length ? commonSettings : defaultCommonSettings));
		dispatch(setDiagramData(tasks || []));
		dispatch(setDiagramLinksData(workRelations));
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
		const timezone = new window.Intl.DateTimeFormat().resolvedOptions().timeZone;
		const {contentCode, subjectUuid} = getContext();
		const {isPersonal, commonSettings, resourceAndWorkSettings} = await saveData(timezone, subjectUuid, contentCode, data);

		await dispatch(getGanttData(isPersonal));
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
 * Переключает чекбокс вех
 * @param {string} payload - состояние чекбокса, показывает/скрывает вехи на диаграмме
 */
 const switchMilestonesCheckbox = (payload: Boolean) => ({
	payload,
	type: APP_EVENTS.SWITCH_MILESTONES_CHECKBOX
});

/**
 * Переключает чекбокс состояния вех
 * @param {string} payload - состояние чекбокса, показывает/скрывает состояние вех на диаграмме
 */
 const switchStateMilestonesCheckbox = (payload: Boolean) => ({
	payload,
	type: APP_EVENTS.SWITCH_STATE_MILESTONES_CHECKBOX
});

/**
 * Переключает чекбокс работ без начальной или конечной даты
 * @param {string} payload - состояние чекбокса, показывает/скрывает работы без начала или конца дат
 */
 const switchWorksWithoutStartOrEndDateCheckbox = (payload: Boolean) => ({
	payload,
	type: APP_EVENTS.SWITCH_WORKS_WITHOUT_START_OR_END_DATE_CHECKBOX
});

/**
 * Устанавливает текущую версию
 */
 const setCurrentVersion = payload => ({
	payload,
	type: APP_EVENTS.SET_CURRENT_VERSION
});

/**
 * Устанавливает список версий
 */
 const setListVersions = payload => ({
	payload,
	type: APP_EVENTS.SET_LIST_VERSIONS
});

/**
 * Устанавливает данные работы
 * @param {CurrentInterval} currentInterval - Текущий интервал
 */
 const setWorkData = workData => ({
	workData,
	type: APP_EVENTS.SET_WORK_DATA
});

/**
 * Устанавливает текущенее значение для интервала
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
 * Сохраняет атрибуты работы
 */
 const setworkAttributes = payload => ({
	payload,
	type: APP_EVENTS.SET_WORK_ATTRIBUTES
});

/**
 * Сохраняет коллекцию атрибутов
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
 * Сохраняет список атрибутов
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
 * Cохраняет пользователей в состояние приложения
 */
const setUsers = payload => ({
	payload,
	type: APP_EVENTS.SET_USERS
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

const setPersonalView = (payload: boolean) => ({
	payload,
	type: APP_EVENTS.SET_PERSONAL_VIEW
});

const setPersonal = (payload: boolean) => ({
	payload,
	type: APP_EVENTS.SET_PERSONAL
});

export {
	addNewWorkForVersion,
	cancelSettings,
	changeScale,
	setPersonal,
	changeWorkProgress,
	changeWorkProgressFromVersion,
	createPersonalView,
	deleteGanttVersionSettings,
	deletePersonalView,
	deleteWork,
	deleteWorkFromVersionDiagram,
	editWorkDataFromVersion,
	editWorkDateRangesFromVersion,
	getAppConfig,
	getGanttData,
	getListOfWorkAttributes,
	getGanttVersionDiagramDataCurrent,
	getUsersAll,
	getVersionSettings,
	getVersionSettingsAll,
	getWorkData,
	hideLoaderData,
	hideLoaderSettings,
	postEditedWorkData,
	postDataUsers,
	setAttributesMap,
	saveChangedWorkInterval,
	saveChangedWorkProgress,
	saveChangedWorkRelations,
	saveDataCurrentVersion,
	saveSettings,
	savedGanttVersionSettings,
	saveListOfAttributes,
	savePositionOfWork,
	setColumnTask,
	setColumnSettings,
	setCommonSettings,
	setDiagramData,
	setDiagramLinksData,
	setCurrentValueForInterval,
	setCurrentVersion,
	setListVersions,
	setPersonalView,
	setRangeTime,
	setResourceSettings,
	setUsers,
	showLoaderSettings,
	switchMilestonesCheckbox,
	switchProgressCheckbox,
	switchStateMilestonesCheckbox,
	switchWorkRelationCheckbox,
	switchWorksWithoutStartOrEndDateCheckbox,
	updateGanttVersionSettings,
	updateWorks
};
