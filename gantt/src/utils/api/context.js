// @flow
import {api} from './';
import {arrayToTree} from 'utils/arrayToTree';
import {FilterFormDescriptorDTO} from './types';
import type {Params, Settings, Source, Task, UserData} from 'store/app/types';

const getDataSourceValue = ({classFqn: value, hasDynamic, title: label}) => ({
	hasDynamic,
	label,
	value
});

/**
* Получает названия и ключи версий
* @param {string} diagramKey - ключ диаграммы
* @return {Promise<Params>}
*/
const getGanttVersionTitlesAndKeys = async (diagramKey: string): Promise<Params> => {
	return api.getGanttVersionTitlesAndKeys(diagramKey);
};

/**
* Получает настройки версий по ключу версии диаграммы
* @param {string} versionKey - ключ диаграммы версий
* @return {Promise<Params>}
*/
const getGanttVersionsSettingsFromDiagramVersionKey = async (versionKey: string): Promise<Params> => {
	return api.getGanttVersionsSettingsFromDiagramVersionKey(versionKey);
};

/**
* Сохраняет настройки версий диаграммы в хранилище
* @param {string} title - название версии
* @param {string} createdDate - дата создания
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
* @param {string} subjectUUID - UUID объекта
*/
const saveGanttVersionSettingsRequest = async (title: string, createdDate: string, contentCode: string, subjectUUID: string): Promise<Params> => {
	api.saveGanttVersionSettingsRequest(contentCode, createdDate, subjectUUID, title);
};

/**
* Изменяет настройки в диаграмме версий
* @param {string} versionKey - ключ диаграммы версий
* @param {string} title - название диаграммы
*/
const updateGanttVersionSettingsRequest = async (versionKey: string, title: string): Promise<Params> => {
	api.updateGanttVersionSettingsRequest(title, versionKey);
};

/**
* Удаляет диаграмму версий из хранилища
* @param {string} ganttVersionId  - индекс диаграммы
*/
const deleteGanttVersionSettingsRequest = async (ganttVersionId: string): Promise<Params> => {
	api.deleteGanttVersionSettingsRequest(ganttVersionId);
};

/**
* Редактирует диапазон дат работ диаграмм версий
* @param {string} versionKey - ключ диаграммы версий
* @param {workDateInterval} workDateInterval - объект временных рамок работы
* @param {string} subjectUUID - UUID  объекта
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
*/
const editWorkDateRangesFromVersionRequest = async (versionKey: string, workDateInterval: workDateInterval, subjectUUID: string, contentCode: string): Promise<Params> => {
	api.editWorkDateRangesFromVersionRequest(contentCode, subjectUUID, workDateInterval);
};

/**
* Добавляет новую работу в диаграмму версий
* @param {string} versionKey - ключ диаграммы версий
* @param {string} classFqn - матакласс работы
* @param {workData} workData - данные работы
* @param {string} timezone - ключ диаграммы версий
*/
const addNewWorkForVersionRequest = async (classFqn: string, timezone: string, versionKey: string, workData: string): Promise<Params> => {
	api.addNewWorkForVersionRequest(classFqn, timezone, workData);
};

/**
* Редактирует работы в диаграмме версий
* @param {string} versionKey - ключ диаграммы версий
* @param {string} workUUID - индефекатор работы
* @param {workData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} timezone - таймзона устройства пользователя
*/
const editWorkDataFromVersionRequest = async (classFqn: string, workUUID: string, versionKey: string, workData: string, timezone): Promise<Params> => {
	api.editWorkDataFromVersionRequest(classFqn, timezone, workData, workUUID);
};

/**
* Редактирует прогресса работы в диаграмме версий
* @param {string} versionKey - ключ диаграммы версий
* @param {string} workUUID - индефекатор работы
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
* @param {string} subjectUUID - UUID  объекта
* @param {string} progress - прогресс работы
*/
const changeWorkProgressFromVersionRequest = async (versionKey: string, workUUID: string, contentCode: string, subjectUUID: string, progress: string): Promise<Params> => {
	api.changeWorkProgressFromVersionRequest(contentCode, progress, subjectUUID, workUUID);
};

/**
* Удаляет задачу из диаграммы версий
* @param {string} workUUID - индефекатор работы
* @param {string} versionKey - ключ диаграммы версий
*/
const deleteWorkFromVersionDiagramRequest = async (workUUID: string, versionKey: string): Promise<Params> => {
	api.deleteWorkFromVersionDiagramRequest(versionKey, workUUID);
};

/**
* Получает данные для построения версий диаграммы Ганта
* @return {Promise<Params>}
*/
const getGanttVersionDiagramData = async (user: UserData): Promise<Params> => {
	return api.getGanttVersionDiagramData(user);
};

/**
 * Получает ссылку на страницу работы
 * @param {string} workUUID - идентификатор работы
 * @returns {string} link - ссылка на карточку работы
 */
const getWorkPageLink = async (workUUID: string): Promise<Params> => {
	return api.getWorkPageLink(workUUID);
};

/**
 * Возвращает текущего пользователя
 * @returns {Promise<UserData>} - пользователь
 */
const getCurrentUser = async (): Promise<UserData> => {
	return api.getCurrentUser();
};

/**
 * Вычисляет UUID  объекта, на карточке которого выведено ВП.
 * @returns {string} - UUID  объекта, на карточке которого выведено ВП.
 */
const getContext = (): string => {
	return {
		contentCode: api.getContentCode(),
		subjectUuid: api.getSubjectUuid()
	};
};

/**
 * Получает данные о пользователе (в тч и его права)
 * @returns {string} - UUID объекта, на карточке которого выведено ВП.
 */
const getUserData = async (contentCode: string, subjectUuid: string): Promise<UserData> => {
	const userData = await api.getUserData(contentCode, subjectUuid);
	return userData;
};

/**
 * Возвращает параметры, переданные ВП
 * @returns {Promise<Params>} - параметры
 */
const getInitialParams = async (): Promise<Params> => {
	const appParams = await api.getParams();
	return appParams;
};

/**
 * Возвращает сохраненные настройки
 * @param contentCode - code объекта
 * @param subjectUuid - UUID  объекта
 * @returns {Promise<Params>} - настройки
 */
const getInitialSettings = async (contentCode: string, subjectUuid: string): Promise<Params> => {
	const settings = await api.getInitialSettings(contentCode, subjectUuid);
	return settings;
};

/**
 * Возвращает данные с учетом настроек
 * @returns {Promise<Params>} - данные
 */
const getDiagramData = async (contentCode: string, subjectUuid: string, timezone: string): Promise<Params> => {
	const data = await api.getDiagramData(contentCode, subjectUuid, timezone);
	return data;
};

/**
 * Возвращает список атрибутов для источника данных
 * @param classFqn - код класса
 * @param parentClassFqn - код класса родителя
 */
const getDataSourceAttributes = async (classFqn: string, parentClassFqn: string = null): Promise<Source> => {
	const attributes = await api.getDataSourceAttributes(classFqn, parentClassFqn);
	return attributes;
};

/**
* Добавляет новую работу
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - индификатор работы
* @param {string} timezone - таймзона
*/
const addNewWork = async (workData: WorkData, classFqn: string, workUUID: string, timezone: string): Promise<Source> => {
	await api.addNewWork(workData, classFqn, workUUID, timezone);
};

/**
* Изменяет данные работы
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - индификатор работы
* @param {string} timezone - таймзона
*/
const editWorkData = async (workData: WorkData, classFqn: string, workUUID: string, timezone: string): Promise<Source> => {
	await api.editWorkData(workData, classFqn, timezone);
};

/**
* Удаляет работу
* @param {string} workUUID - индификатор работы
*/
const deleteWorkDateRanges = async (workUUID: string): Promise<Source> => {
	await api.deleteWorkDateRanges(workUUID);
};

/**
* Отправляет данные изменения временных рамок работ
* @param  {string} timezone - таймзона
* @param  {workDateInterval} workDateInterval - объект временных рамок работы
* @param  {string} contentCode - code объекта
* @param  {string} subjectUuid - UUID объекта
*/
const postChangedWorkInterval = async (timezone: string, workDateInterval: workDateInterval, contentCode: string, subjectUuid: string): Promise<Source> => {
	await api.postChangedWorkInterval(timezone, workDateInterval, contentCode, subjectUuid);
};

/**
 * Отправляет изменение связей
 * @param workRelations - объект связи между работами
 * @param contentCode - code объекта
 * @param subjectUuid -  UUID объекта
 */
const postChangedWorkRelations = async (workRelations, contentCode: string, subjectUuid: string) => {
	await api.postChangedWorkRelations(workRelations, contentCode, subjectUuid);
};

/**
 * Возвращает список атрибутов для источника данных по типам
 * @returns {Promise<Source>} - атрибуты
 * @param classFqn - код класса
 * @param types - типы
 */
const getDataSourceAttributesByTypes = async (classFqn: string, types: string = null): Promise<Source> => {
	const attributes = await api.getDataSourceAttributesByTypes(classFqn, types);
	return attributes;
};

/**
 * Отправляет сохраненные настройки
 * @param contentCode - code объекта
 * @param subjectUuid - UUID объекта
 * @param data - сохраняемые пользователем настройки
 * @returns {Promise<Params>} - новые настройки
 */
const saveData = async (subjectUuid: string, contentCode: string, data: Settings): Promise<Params> => {
	const res = await api.postData(subjectUuid, contentCode, data);
	return res;
};

/**
 * Отправляет данные изменения прогресса работы
 * @param {string} workUUID - идентификатор работы
 * @param {number} progress - прогресс работы
 * @param {string} contentCode - code объекта
 * @param {string} subjectUUID - UUID объекта
 */
const postChangedWorkProgress = async (workUUID: string, progress: number, contentCode: string, subjectUUID: string): Promise<Task> => {
	await api.postChangedWorkProgress(workUUID, progress, contentCode, subjectUUID);
};

/**
 * Открывает окно фильтрации
 *
 * @returns {string} - JSON объект с настройкой фильтрации
 * @param context
 */
const openFilterForm = (context: FilterFormDescriptorDTO): string => {
	return api.openFilterForm(context);
};

/**
 * Возвращает список ресурсов и работ, которые могут быть вложены друг в друга
 * @returns {Promise<Params>} - ресурсы и работы
 */
const getDataSources = async (): Promise<Params> => {
	const sources = await api.getDataSources();
	return arrayToTree(sources, {
		keys: {
			value: 'classFqn'
		},
		values: {
			id: node => node.classFqn,
			value: getDataSourceValue
		}
	});
};

/**
 * Получает аттрибуты работы
 * @param {string} attributeGroupCode - код группы аттрибутов
 * @param {string} metaClassFqn - метакласс работы
 * @param {string} workUUID - идентификатор работы
 * @returns {ThunkAction}
 */
const getWorkAttributes = async (attributeGroupCode: string, metaClassFqn: string, workUUID: string): Promise<Params> => {
	const workAttributes = await api.getWorkAttributes(attributeGroupCode, metaClassFqn, workUUID);
	return workAttributes;
};

export {
	addNewWork,
	addNewWorkForVersionRequest,
	changeWorkProgressFromVersionRequest,
	deleteGanttVersionSettingsRequest,
	deleteWorkDateRanges,
	deleteWorkFromVersionDiagramRequest,
	editWorkData,
	editWorkDataFromVersionRequest,
	editWorkDateRangesFromVersionRequest,
	getWorkAttributes,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getGanttVersionDiagramData,
	getGanttVersionTitlesAndKeys,
	getGanttVersionsSettingsFromDiagramVersionKey,
	getInitialParams,
	getInitialSettings,
	getWorkPageLink,
	openFilterForm,
	getUserData,
	postChangedWorkRelations,
	postChangedWorkProgress,
	postChangedWorkInterval,
	saveGanttVersionSettingsRequest,
	saveData,
	updateGanttVersionSettingsRequest
};
