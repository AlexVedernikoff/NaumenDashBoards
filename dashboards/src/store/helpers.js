// @flow
import {store} from 'app.constants';

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
 * Возвращает ключ для сохранения данных в localStorage относительно пользователя
 * @returns {string}
 */
const getUserLocalStorageId = () => {
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
 * Сохраняет данные localStorage
 * @param {string} storageKey - ключ данных
 * @param {string} key - ключ значения
 * @param {any} value - значение
 */
const setLocalStorageValue = (storageKey: string, key: string, value: any) => {
	let storage = localStorage.getItem(storageKey);
	storage = storage ? JSON.parse(storage) : {};
	storage[key] = value;

	localStorage.setItem(storageKey, JSON.stringify(storage));
};

/**
 * Возвращает данные из localStorage
 * @param {string} storageKey - ключ данных
 * @param {string} key - ключ
 * @param {any} defaultValue - значение по умолчанию
 * @returns {any} - данные localStorage
 */
const getLocalStorageValue = (storageKey: string, key: string, defaultValue: any) => {
	let storage = localStorage.getItem(storageKey);
	storage = storage ? JSON.parse(storage) : {};

	return storage[key] || defaultValue;
};

/**
 * Удаляет данные из localStorage
 * @param {string} storageKey - ключ данных
 * @param {string} key - ключ
 */
const removeLocalStorageValue = (storageKey: string, key: string) => {
	let storage = localStorage.getItem(storageKey);

	if (storage) {
		localStorage.setItem(storageKey, JSON.stringify({...JSON.parse(storage), [key]: undefined}));
	}
};

/**
 * Возвращает массив для окна фильтрации, содержащий код источника и все его подтипы
 * @param {string} classFqn - код источника
 * @returns {Array<string>}
 */
const getDescriptorCases = (classFqn: string) => [classFqn, ...getSourceTypes(classFqn)];

export {
	getDescriptorCases,
	getLocalStorageValue,
	getParams,
	getSourceTypes,
	getUserLocalStorageId,
	parseResponseErrorText,
	removeLocalStorageValue,
	setLocalStorageValue
};
