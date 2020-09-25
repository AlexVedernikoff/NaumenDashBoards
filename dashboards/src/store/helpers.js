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

/**
 * Возвращает подтипы источника
 * @param {string} classFqn - код источника
 * @returns {Array<string>}
 */
const getSourceTypes = (classFqn: string) => {
	const {map: sources} = store.getState().sources.data;
	let types = sources[classFqn].children || [];

	if (types.length > 0) {
		const subTypes = types.map(getSourceTypes)
			.reduce((allSubTypes, subTypes) => [...allSubTypes, ...subTypes], []);
		types = [...types, ...subTypes];
	}

	return types;
};

export {
	getParams,
	getSourceTypes,
	parseResponseErrorText
};
