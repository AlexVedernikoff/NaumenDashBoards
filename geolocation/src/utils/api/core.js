// @flow
import {BASE_URL} from './constants';
import type {Method, Module} from 'types/api';

/**
 * Билдер для конструирования url`ов для api.
 * @param {Module} module - название модуля
 * @param {Method} method - исполняемый метод модуля
 * @param {string} params - набор GET параметров
 * @returns {string}
 */
const buildUrl = (module: Module, method: Method, params: string = ''): string => {
	const url: string = `${BASE_URL}`;

	return `${url}?func=modules.${module}.${method}&params='${params}'`;
};

export default buildUrl;
