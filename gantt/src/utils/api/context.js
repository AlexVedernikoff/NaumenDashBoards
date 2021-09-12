// @flow
import {api} from './';
import {arrayToTree} from 'utils/arrayToTree';
import {FilterFormDescriptorDTO} from './types';
import type {Params, Settings, Source} from 'store/app/types';

const getDataSourceValue = ({classFqn: value, hasDynamic, title: label}) => ({
	hasDynamic,
	label,
	value
});

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
 * Возвращает параметры, переданные ВП
 * @returns {Promise<Params>} - параметры
 */
const getInitialParams = async (): Promise<Params> => {
	const appParams = await api.getParams();
	return appParams;
};

/**
 * Возвращает сохраненные настройки
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
const getDiagramData = async (contentCode: string, subjectUuid: string): Promise<Params> => {
	const data = await api.getDiagramData(contentCode, subjectUuid);
	return data;
};

/**
 * Возвращает список атрибутов для источника данных
 * @returns {Promise<Source>} - атрибуты
 */
const getDataSourceAttributes = async (classFqn: string, parentClassFqn: string = null): Promise<Source> => {
	const attributes = await api.getDataSourceAttributes(classFqn, parentClassFqn);
	return attributes;
};

/**
 * Возвращает список атрибутов для источника данных по типам
 * @returns {Promise<Source>} - атрибуты
 */
const getDataSourceAttributesByTypes = async (classFqn: string, types: string = null): Promise<Source> => {
	const attributes = await api.getDataSourceAttributesByTypes(classFqn, types);
	return attributes;
};

/**
 * Отправляет сохраненные настройки
 * @returns {Promise<Params>} - новые настройки
 */
const saveData = async (subjectUuid: string, contentCode: string, data: Settings): Promise<Params> => {
	const res = await api.postData(subjectUuid, contentCode, data);
	return res;
};

/**
 * Открывает окно фильтрации
 * @returns {string} - JSON объект с настройкой фильтрации
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

export {
	getContext,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	openFilterForm,
	saveData
};
