// @flow
import {api} from './';
import {arrayToTree} from 'utils/arrayToTree';
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
	return api.getSubjectUuid();
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
 * @returns {Promise<Settings>} - настройки
 */
const getInitialSettings = async (): Promise<Params> => {
	const settings = await api.getInitialSettings();
	return settings;
};

/**
 * Возвращает список ресурсов и работ, которые могут быть вложены друг в друга
 * @returns {Promise<Source>} - ресурсы и работы
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
	getInitialParams,
	getInitialSettings,
	getDataSources
};
