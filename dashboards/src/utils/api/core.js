// @flow
import type {Method, Module} from './types';

/**
 * Билдер для конструирования url`ов для api.
 * @param {Module} module - название модуля
 * @param {Method} method - исполняемый метод модуля
 * @param {string} params - набор GET параметров
 * @returns {string}
 */
const buildUrl = (module: Module, method: Method, params: string = '') => {
	const dev = process.env.NODE_ENV === 'development';
	const url = dev ? 'http://nordclan.nsd.naumen.ru/sd/services/rest' : window.jsApi.getAppRestBaseUrl();

	if (dev && module === 'dashboardSettings') {
		module = 'DevDashboardSettings';
	}

	return `${url}/exec-post?func=modules.${module}.${method}&params=${params}`;
};

export default buildUrl;
