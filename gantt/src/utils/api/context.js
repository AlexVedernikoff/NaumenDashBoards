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
 * Возвращает текущего пользователя
 * @returns {Promise<UserData>} - пользователь
 */
const getCurrentUser = async (): Promise<UserData> => {
	return api.getCurrentUser();
};

/**
 * Вычисляет uuid объекта, на карточке которого выведено ВП.
 * @returns {string} - uuid объекта, на карточке которого выведено ВП.
 */
const getContext = (): string => {
	return {
		contentCode: api.getContentCode(),
		subjectUuid: api.getSubjectUuid()
	};
};

/**
 * Получает данные о пользователе (в тч и его права)
 * @returns {string} - uuid объекта, на карточке которого выведено ВП.
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
 * @param subjectUuid - Uuid объекта
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
const getDiagramData = async (contentCode: string, subjectUuid: string, user: UserData, timezone: string): Promise<Params> => {
	const data = await api.getDiagramData(contentCode, subjectUuid, user, timezone);
	return data;
};

/**
 * Возвращает список атрибутов для источника данных
 * @param classFqn - код класса
 * @param parentClassFqn - код класса родителя
 * @returns {Promise<Source>} - атрибуты
 */
const getDataSourceAttributes = async (classFqn: string, parentClassFqn: string = null): Promise<Source> => {
	const attributes = await api.getDataSourceAttributes(classFqn, parentClassFqn);
	return attributes;
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
 * @param subjectUuid - Uuid объекта
 * @param data - сохраняемые пользователем настройки
 * @returns {Promise<Params>} - новые настройки
 */
const saveData = async (subjectUuid: string, contentCode: string, data: Settings): Promise<Params> => {
	const res = await api.postData(subjectUuid, contentCode, data);
	return res;
};

/**
 * Отправляет измененный прогресс
 * @param workUUID - идентификатор работы
 * @param progress - прогресс работы
 * @param contentCode - code объекта
 * @param subjectUUID - Uuid объекта
 * @returns {Promise<Origress>} - новый прогресс
 */

const postChangeProgress = async (workUUID: string, progress: number, contentCode: string, subjectUUID): Promise<Task> => {
	const res = await api.postChangeProgress(workUUID, progress, contentCode, subjectUUID);
	return res;
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
 * Возвращает список групп аттрибутов
 * @param {string} metaClass - метакласс работы
 * @returns {Promise<Params>} -  группы аттрибутов
 */
const getAttributeGroups = async (metaClass): Promise<Params> => {
	const res = await api.getAttributeGroups(metaClass);
	return res;
};

export {
	getAttributeGroups,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	openFilterForm,
	getUserData,
	postChangeProgress,
	saveData
};
