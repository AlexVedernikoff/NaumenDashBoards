// @flow
import api from 'api';
import {DASHBOARD_EDIT_MODE} from 'store/context/constants';
import {isSourceType} from 'store/sources/data/helpers';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {store} from 'app.constants';

/**
 * Формирует параметры для запросов изменения данных дашборда
 * @returns {void}
 */
const getParams = () => {
	const state = store.getState();
	const {context, dashboard} = state;
	const {contentCode, dashboardMode, subjectUuid: classFqn} = context;
	const {personal: isPersonal} = dashboard.settings;
	const isForUser = isUserModeDashboard(state);
	const editable = dashboardMode === DASHBOARD_EDIT_MODE.EDIT;

	return {
		classFqn,
		contentCode,
		editable,
		isForUser,
		isPersonal
	};
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
	let contentCode = '';
	let subjectUuid = '';
	let userId = '';

	try {
		contentCode = api.instance.frame.getContentCode();
		subjectUuid = api.instance.frame.getSubjectUuid();
		({uuid: userId} = api.instance.frame.getCurrentUser());
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
	const storage = localStorage.getItem(storageKey);

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

const createFilterContext = (classFqn: string) => {
	const context: Object = {};

	if (isSourceType(classFqn)) {
		context.cases = getDescriptorCases(classFqn);
	} else {
		context.clazz = classFqn;
	}

	return context;
};

const getFilterContext = (descriptor: string, classFqn: string) => {
	let context = JSON.parse(descriptor);

	if (!context.clazz) {
		context = {
			...context,
			cases: getDescriptorCases(classFqn)
		};
	}

	return context;
};

export {
	createFilterContext,
	getDescriptorCases,
	getFilterContext,
	getLocalStorageValue,
	getParams,
	getSourceTypes,
	getUserLocalStorageId,
	removeLocalStorageValue,
	setLocalStorageValue
};
