// @flow
import {api} from './';
import {arrayToTree} from 'utils/arrayToTree';
import type {
	CommonSettings,
	CurrentColorSettings,
	Params,
	Settings,
	Source,
	Task,
	Tasks,
	UserData,
	Users,
	WorkRelations
} from 'store/App/types';
import type {FilterFormDescriptorDTO} from 'utils/api/types'

const getDataSourceValue = ({classFqn: value, hasDynamic, title: label}) => ({
	hasDynamic,
	label,
	value
});

/**
* Получает список пользователей
* @return {Promise<Params>}
*/
const getUsers = async () => api.getUsers();

/**
* Получает названия и ключи версий
* @param {boolean} isPersonal - личный вид
* @param {string} diagramKey - ключ диаграммы
* @param {string} subjectUuid - ключ текущей карточки объекта
* @return {Promise<Params>}
*/
const getGanttVersionTitlesAndKeys = async (isPersonal: boolean, diagramKey: string, subjectUuid: string): Promise<Params> => {
	return api.getGanttVersionTitlesAndKeys(isPersonal, diagramKey, subjectUuid);
};

/**
* Создает личный вид для диаграммы гантта
* @param {string} contentCode - ключ диаграммы версий
* @param {string} subjectUUID - название диаграммы
* @param {string} timezone - название диаграммы
*/
const createPersonalViewDiagram = async (contentCode: string, subjectUUID: string, timezone: string): Promise<Params> => {
	return api.createPersonalViewDiagram(contentCode, subjectUUID, timezone);
};

/**
* Удаляет личный вид для диаграммы гантта
* @param {string} contentCode - ключ диаграммы версий
* @param {string} subjectUUID - название диаграммы
* @param {string} timezone - название диаграммы
*/
const deletePersonalViewDiagram = async (contentCode: string, subjectUUID: string, timezone: string): Promise<Params> => {
	return api.deletePersonalViewDiagram(contentCode, subjectUUID, timezone);
};

/**
* Получает настройки версий
* @param {string} versionKey - ключ диаграммы версий
* @param {string} timezone - часовой пояс пользователя
* @return {Promise<Params>}
*/
const getGanttVersionsSettings = async (versionKey: string, timezone: string): Promise<Params> => {
	return api.getGanttVersionsSettings(versionKey, timezone);
};

/**
* Сохраняет настройки версий диаграммы в хранилище
* @param {boolean} isPersonal - личный вид
* @param {CommonSettings} - общие настройки
* @param {string} title - название версии
* @param {string} createdDate - дата создания
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
* @param {string} subjectUUID - UUID объекта
* @param {Tasks} tasks - задачи на диаграмме
* @param {WorkRelations} workRelations - объект связи между работами
*/
const saveGanttVersionSettingsRequest = async (
	isPersonal: boolean,
	commonSettings: CommonSettings,
	contentCode: string,
	createdDate: string,
	subjectUUID: string,
	title: string,
	tasks: Tasks,
	workRelations: WorkRelations
): Promise<Params> => {
	api.saveGanttVersionSettingsRequest(
		isPersonal,
		commonSettings,
		contentCode,
		createdDate,
		subjectUUID,
		title,
		tasks,
		workRelations
	);
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
* @param {string} subjectUUID - UUID  объекта
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
* @param {string} timezone - часовой пояс пользователя
* @param {string} versionKey - ключ диаграммы версий
* @param {workDateInterval} workDateInterval - объект временных рамок работы
*/
const editWorkDateRangesFromVersionRequest = async (subjectUUID: string, contentCode: string, timezone: string, versionKey: string, workDateInterval: workDateInterval): Promise<Params> => {
	api.editWorkDateRangesFromVersionRequest(contentCode, subjectUUID, timezone, versionKey, workDateInterval);
};

/**
* Добавляет новую работу в диаграмму версий
* @param {string} classFqn - матакласс работы
* @param {string} timezone - ключ диаграммы версий
* @param {string} versionKey - ключ диаграммы версий
* @param {workData} workData - данные работы
*/
const addNewWorkForVersionRequest = async (classFqn: string, timezone: string, versionKey: string, workData: string): Promise<Params> => {
	api.addNewWorkForVersionRequest(classFqn, timezone, workData);
};

/**
* Редактирует работы в диаграмме версий
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - индефекатор работы
* @param {string} versionKey - ключ диаграммы версий
* @param {workData} workData - данные работы
* @param {string} timezone - часовой пояс пользователя
*/
const editWorkDataFromVersionRequest = async (classFqn: string, workUUID: string, versionKey: string, workData: string, timezone: string): Promise<Params> => {
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
* Получает данные для работы
* @param {string} workUUID - идентификатор работы
* @param {string} diagramKey - ключ диаграммы
* @returns {ThunkAction}
*/
const getWorkDataForWork = async (workUUID: string, diagramKey: string): Promise<Params> => {
	return api.getWorkDataForWork(workUUID, diagramKey);
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
 * @param contentCode - ключ контента, на котором расположена диаграмма
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
const getDiagramData = async (contentCode: string, subjectUuid: string, timezone: string, isPersonal: boolean): Promise<Params> => {
	const data = await api.getDiagramData(contentCode, subjectUuid, timezone, isPersonal);
	return data;
};

/**
* Сохраняет настройки цветов
* @param {CurrentColorSettings} currentColorSettings - список настроек цветов
* @param {string} contentCode - список настроек цветов
* @param {string} subjectUuid - список настроек цветов
* @returns {ThunkAction}
*/
const saveGanttColorSettings = async (currentColorSettings: CurrentColorSettings, contentCode: string, subjectUuid: string): Promise<Source> => {
	await api.saveGanttColorSettings(currentColorSettings, contentCode, subjectUuid);
};

/**
 * Возвращает список атрибутов для источника данных
 * @param {string} classFqn - код класса
 * @param {string} parentClassFqn - код класса родителя
 */
const getDataSourceAttributes = async (classFqn: string, parentClassFqn: string = null): Promise<Source> => {
	const attributes = await api.getDataSourceAttributes(classFqn, parentClassFqn);
	return attributes;
};

/**
* Получает данные атрибутов статуса контрольной точки
* @param {string} classFqn - метакласс работы
* @param {string} parentClassFqn - код класса родителя
*/
 const getDataAttributesControlPointStatus = async (classFqn: string, parentClassFqn: string = null): Promise<Source> => {
	const attributes = await api.getDataAttributesControlPointStatus(classFqn, parentClassFqn);
	return attributes;
};

/**
* Добавляет новую работу
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} workUUID - идентификатор работы
* @param {string} timezone - часовой пояс пользователя
*/
const addNewWork = async (workData: WorkData, classFqn: string, timezone: string, attr): Promise<Source> => {
	await api.addNewWork(workData, classFqn, timezone, attr);
};

/**
* Проверяет работы ресурса
* @param {string} workId - идентификатор работы
* @param {string} resourceId - идентификатор ресурса
* @param {string} diagramKey - ключ диаграммы
* @returns {ThunkAction}
*/
const checkWorksOfResource = async (workId: string, resourceId: string, diagramKey: string, tIndex, versionKey): Promise<Source> => {
	await api.checkWorksOfResource(workId, resourceId, diagramKey, tIndex, versionKey);
};

/**
* Изменяет данные работы
* @param {WorkData} workData - данные работы
* @param {string} classFqn - метакласс работы
* @param {string} timezone - часовой пояс пользователя
* @param {string} workUUID - идентификатор работы
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
* @param {string} subjectUuid - UUID объекта
*/
const editWorkData = async (workData: WorkData, classFqn: string, timezone: string, workUUID: string, contentCode, subjectUuid): Promise<Source> => {
	await api.editWorkData(workData, classFqn, timezone, workUUID, contentCode, subjectUuid);
};

/**
* Удаляет работу
* @param {string} workUUID - идентификатор работы
*/
const deleteWorkDateRanges = async (workUUID: string): Promise<Source> => {
	await api.deleteWorkDateRanges(workUUID);
};

/**
* Отправляет данные изменения временных рамок работ
* @param  {string} timezone - часовой пояс пользователя
* @param  {workDateInterval} workDateInterval - объект временных рамок работы
* @param  {string} contentCode - ключ контента, на котором расположена диаграмма
* @param  {string} subjectUuid - UUID объекта
*/
const postChangedWorkInterval = async (timezone: string, workDateInterval: workDateInterval, contentCode: string, subjectUuid: string): Promise<Source> => {
	await api.postChangedWorkInterval(timezone, workDateInterval, contentCode, subjectUuid);
};

/**
 * Отправляет изменение связей
 * @param {WorkRelations} workRelations - объект связи между работами
 * @param {string} contentCode - ключ контента, на котором расположена диаграмма
 * @param {string} subjectUuid -  UUID объекта
 */
const postChangedWorkRelations = async (workRelations: WorkRelations, contentCode: string, subjectUuid: string) => {
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
 * @param {string} timezone - часовой пояс пользователя
 * @param subjectUuid - UUID объекта
 * @param contentCode - ключ контента, на котором расположена диаграмма
 * @param data - сохраняемые пользователем настройки
 * @returns {Promise<Params>} - новые настройки
 */
const saveData = async (timezone: string, subjectUuid: string, contentCode: string, data: Settings): Promise<Params> => {
	const res = await api.postData(timezone, subjectUuid, contentCode, data);
	return res;
};

/**
 * Отправляет данные изменения прогресса работы
 * @param {string} workUUID - идентификатор работы
 * @param {number} progress - прогресс работы
 * @param {string} contentCode - ключ контента, на котором расположена диаграмма
 * @param {string} subjectUUID - UUID объекта
 */
const postChangedWorkProgress = async (workUUID: string, progress: number, contentCode: string, subjectUUID: string): Promise<Task> => {
	await api.postChangedWorkProgress(workUUID, progress, contentCode, subjectUUID);
};

/**
* Отправляет пользователей
* @param {Users} data - данные пользователей
*/
const postUsers = async (data: Users) => {
	await api.postUsers(data);
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
 * Получает работы
 * @param {boolean} worksWithoutStartOrEndDateCheckbox - состояние флажка
 * @param {string} timezone - часовой пояс пользователя
 * @param {string} contentCode - ключ контента, на котором расположена диаграмма
 * @param {string} subjectUUID - UUID объекта
 * @return {Promise<Params>}
 */
const getWorks = async (contentCode: string, subjectUUID: string, timezone: string, worksWithoutStartOrEndDateCheckbox: boolean) => {
	const workData = await api.getWorks(contentCode, subjectUUID, timezone, worksWithoutStartOrEndDateCheckbox);
	return workData;
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
 * Получает атрибуты работы
 * @param {string} attributeGroupCode - код группы атрибутов
 * @param {string} metaClassFqn - метакласс работы
 * @param {string} workUUID - идентификатор работы
 * @returns {ThunkAction}
 */
const getWorkAttributes = async (attributeGroupCode: string, metaClassFqn: string, workUUID: string): Promise<Params> => {
	const workAttributes = await api.getWorkAttributes(attributeGroupCode, metaClassFqn, workUUID);
	return workAttributes;
};

/**
* Применяет версию
* @param {string} diagramKey - ключ диаграммы
* @param {Tasks} tasksClone - копия задач на диаграмме
* @param {WorkRelations} workRelations - объект связи между работами
* @param {string} subjectUUID - Uuid объекта
* @param {string} contentCode - ключ контента, на котором расположена диаграмма
*/
const applyVersion = async (
	diagramKey: string,
	tasksClone: Tasks,
	workRelations: WorkRelations,
	contentCode: string,
	subjectUuid: string,
	viewWork
) => {
	await api.applyVersion(diagramKey, tasksClone, workRelations, contentCode, subjectUuid, viewWork);
};

export {
	addNewWork,
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
	getWorkAttributes,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataAttributesControlPointStatus,
	getDataSources,
	getDiagramData,
	getGanttVersionDiagramData,
	getGanttVersionTitlesAndKeys,
	getGanttVersionsSettings,
	getInitialParams,
	getInitialSettings,
	getWorkDataForWork,
	openFilterForm,
	getUserData,
	getUsers,
	getWorks,
	postChangedWorkRelations,
	postChangedWorkProgress,
	postChangedWorkInterval,
	postUsers,
	saveGanttVersionSettingsRequest,
	saveData,
	saveGanttColorSettings,
	updateGanttVersionSettingsRequest
};
