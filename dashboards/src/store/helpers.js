// @flow
import {store} from 'src';

/**
 * Формирует параметры для запросов изменения данных дашборда
 * @returns {void}
 */
const getParams = () => {
	const {context, dashboard} = store.getState();
	const {contentCode, subjectUuid: classFqn} = context;
	const {editable, personal: isPersonal} = dashboard.settings;

	return {
		classFqn,
		contentCode,
		editable,
		isPersonal
	};
};

/**
 * Парсит текст серверной ошибки
 * @param {string} text - текст ошибки
 * @returns {object | string}
 */
const parseResponseErrorText = (text: string) => {
	let data = text.split('njava.lang.Exception:')[1];
	data = data.substr(0, data.length - 2).trim();
	let result;

	try {
		result = JSON.parse(JSON.parse(`"${data}"`));
	} catch (e) {
		result = data;
	}

	return result;
};

export {
	getParams,
	parseResponseErrorText
};
