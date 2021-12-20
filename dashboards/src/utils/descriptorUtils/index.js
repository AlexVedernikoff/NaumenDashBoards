// @flow
import type {AttrSetConditions, Context, GetDescriptorCases} from './types';

/**
 * Внимание, код данного модуля может не совпадать с работой платформы
 * необходимо тестирование на каждом изменении версии платформы
 */

/**
 * Проверяет есть ли в дескрипторе установленные фильтры
 * @param {string} descriptor - дескриптор
 * @returns {boolean} - true - если в дескрипторе установлены фильтры которые пользователь может поменять
 */
const descriptorContainsFilter = (descriptor: ?string): boolean => {
	let result = false;

	if (descriptor !== null && descriptor !== undefined) {
		try {
			const descriptorObject = JSON.parse(descriptor);

			result = descriptorObject.filters && descriptorObject.filters.length > 0;
		} catch (e) {
			result = false;
		}
	}

	return result;
};

/**
 * Создает контекст для формы фильтрации из кода источника
 * @param {string} classFqn - код основного источника
 * @param {GetDescriptorCases} getDescriptorCases - функция получающая суб-источники из источника
 * @returns {Context}
 */
const createFilterContext = (classFqn: string, getDescriptorCases: ?GetDescriptorCases = null): Context => {
	const context: Object = {};

	if (classFqn.includes('$')) {
		context.cases = getDescriptorCases?.(classFqn) ?? [];
	} else {
		context.clazz = classFqn;
	}

	return context;
};

/**
 * Формирует контекст для формы фильтрации из дескриптора
 * @param {string} descriptor - дескриптор
 * @param {string} classFqn - код основного источника
 * @param {GetDescriptorCases} getDescriptorCases - функция получающая суб-источники из источника
 * @returns {Context}
 */
const getFilterContext = (descriptor: string, classFqn: string, getDescriptorCases: ?GetDescriptorCases = null): Context => {
	const context = JSON.parse(descriptor);

	if (!context.clazz) {
		context.cases = context.cases || [];

		if (getDescriptorCases) {
			getDescriptorCases(classFqn).forEach(item => context.cases.push(item));
		}
	}

	return context;
};

/**
 * Извлекает код источника из дескриптора
 * @param {string} descriptor  - дескриптор
 * @returns {string}
 */
const getValueFromDescriptor = (descriptor: string): string => {
	const descriptorObject = JSON.parse(descriptor);
	let classFqn;

	if (Array.isArray(descriptorObject.cases) && descriptorObject.cases.length > 1) {
		classFqn = descriptorObject.cases[0].split('$').shift();
	} else {
		classFqn = descriptorObject.clazz || descriptorObject.cases[0];
	}

	return classFqn;
};

/**
 * Извлекает фильтр для атрибутов из дескриптора
 * @param {string} descriptor - дескриптор
 * @returns {?AttrSetConditions}
 */
const parseCasesAndGroupCode = (descriptor: string): ?AttrSetConditions => {
	let result = null;

	try {
		const descriptorObject = JSON.parse(descriptor);
		const {attrGroupCode, cases} = descriptorObject;

		result = {cases, groupCode: attrGroupCode};
	} catch (e) {
		console.log('error parsing descriptor');
	}

	return result;
};



export {
	descriptorContainsFilter,
	createFilterContext,
	getValueFromDescriptor,
	parseCasesAndGroupCode,
	getFilterContext
};
