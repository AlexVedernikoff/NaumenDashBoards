// @flow
import {store} from 'src';

/**
 * Формирует параметры для запросов изменения данных дашборда
 * @returns {void}
 */
const getParams = () => {
	const {context, dashboard} = store.getState();
	const {contentCode, editableDashboard: editable, subjectUuid: classFqn} = context;
	const {personal: isPersonal} = dashboard.settings;

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

/**
 * Возвращает ключ для сохранения данных в localStorage
 * @returns {string}
 */
const getLocalStorageId = () => {
	const {jsApi} = window;
	let contentCode = '';
	let subjectUuid = '';
	let userId = '';

	try {
		contentCode = jsApi.findContentCode();
		subjectUuid = jsApi.extractSubjectUuid();
		({uuid: userId} = jsApi.getCurrentUser());
	} catch (e) {
		console.error(e);
	}

	return `dashboard_${contentCode}_${subjectUuid}_${userId}`;
};

/**
 * Сохраняет данные в localStorage относительно конкретного дашборда
 * @param {string} key - ключ
 * @param {any} value - значение
 */
const setLocalStorageValue = (key: string, value: any) => {
	const localStorageId = getLocalStorageId();
	let storage = localStorage.getItem(localStorageId);
	storage = storage ? JSON.parse(storage) : {};
	storage[key] = value;

	localStorage.setItem(localStorageId, JSON.stringify(storage));
};

/**
 * Возвращает данные из localStorage относительно конкретного дашборда
 * @param {string} key - ключ
 * @param {any} defaultValue - значение по умолчанию
 * @returns {any} - данные localStorage
 */
const getLocalStorageValue = (key: string, defaultValue: any) => {
	const localStorageId = getLocalStorageId();
	let storage = localStorage.getItem(localStorageId);
	storage = storage ? JSON.parse(storage) : {};

	return storage[key] || defaultValue;
};

export {
	getLocalStorageValue,
	getParams,
	getSourceTypes,
	parseResponseErrorText,
	setLocalStorageValue
};
