// @flow
import type {AttrSetConditions, Context, GetDescriptorCases} from './types';
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';

/**
 * ! Внимание, код данного модуля может не совпадать с работой платформы
 * ! необходимо тестирование на каждом изменении версии платформы
 */

/**
 * Проверяет есть ли в дескрипторе установленные фильтры
 * TODO: убрать JSON.parse, завязать логику на бек
 * @param {string} descriptor - дескриптор
 * @returns {boolean} - true - если в дескрипторе установлены фильтры которые пользователь может поменять
 */
const descriptorContainsFilter = async (descriptor: ?string): Promise<boolean> => /* */
	new Promise(resolve => {
		let result = false;

		if (descriptor !== null && descriptor !== undefined) {
			try {
				const descriptorObject = JSON.parse(descriptor);

				result = descriptorObject.filters && descriptorObject.filters.length > 0;
			} catch (e) {
				result = false;
			}
		}

		resolve(result);
	});

/**
 * Создает контекст для формы фильтрации из кода источника
 * TODO: убрать логику, завязать логику на бек
 * @param {string} classFqn - код основного источника
 * @param {GetDescriptorCases} getDescriptorCases - функция получающая суб-источники из источника
 * @returns {Context}
 */
const createFilterContext = async (classFqn: string, getDescriptorCases: ?GetDescriptorCases = null): Promise<Context> =>
	new Promise(resolve => {
		const context: Object = {};

		if (classFqn.includes('$')) {
			context.cases = getDescriptorCases?.(classFqn) ?? [];
		} else {
			context.clazz = classFqn;
		}

		resolve(context);
	});

/**
 * Формирует контекст для формы фильтрации из дескриптора
 * TODO: убрать JSON.parse, завязать логику на бек
 * @param {string} descriptor - дескриптор
 * @param {string} classFqn - код основного источника
 * @param {GetDescriptorCases} getDescriptorCases - функция получающая суб-источники из источника
 * @returns {Context}
 */
const getFilterContext = async (descriptor: string, classFqn: string, getDescriptorCases: ?GetDescriptorCases = null): Promise<Context> =>
	new Promise(resolve => {
		const context = JSON.parse(descriptor);

		if (!context.clazz) {
			context.cases = context.cases || [];

			if (getDescriptorCases) {
				getDescriptorCases(classFqn).forEach(item => context.cases.push(item));
			}
		}

		resolve(context);
	});

/**
 * Извлекает код источника из дескриптора
 * TODO: убрать JSON.parse, завязать логику на бек
 * @param {string} descriptor  - дескриптор
 * @returns {string}
 */
const getValueFromDescriptor = async (descriptor: string): Promise<string> =>
	new Promise(resolve => {
		const descriptorObject = JSON.parse(descriptor);
		let classFqn;

		if (Array.isArray(descriptorObject.cases) && descriptorObject.cases.length > 1) {
			classFqn = descriptorObject.cases[0].split('$').shift();
		} else {
			classFqn = descriptorObject.clazz || descriptorObject.cases[0];
		}

		resolve(classFqn);
	});

/**
 * Извлекает фильтр для атрибутов из дескриптора
 * TODO: убрать JSON.parse, завязать логику на бек
 * @param {string} descriptor - дескриптор
 * @returns {?AttrSetConditions}
 */
const parseCasesAndGroupCode = async (descriptor: string): Promise<?AttrSetConditions> =>
	new Promise(resolve => {
		let result = null;

		try {
			const descriptorObject = JSON.parse(descriptor);
			const {attrGroupCode, cases} = descriptorObject;

			result = {attrGroupCode, cases};
		} catch (e) {
			console.error('error parsing descriptor');
		}

		resolve(result);
	});

/**
 * Проверяет на наличие фильтра по датам
 * TODO: убрать JSON.parse, завязать логику на бек
 * @param {string} descriptor - дескриптор
 * @returns {boolean}
 */
const hasDateFilter = async (descriptor: string): Promise<boolean> =>
	new Promise(resolve => {
		let result = false;

		if (descriptor && descriptor !== '') {
			const {filters} = JSON.parse(descriptor);

			if (filters) {
				result = filters.flat().some(({properties: {attrTypeCode}}) =>
					attrTypeCode === ATTRIBUTE_TYPES.date || attrTypeCode === ATTRIBUTE_TYPES.dateTime
				);
			}
		}

		resolve(result);
	});

export {
	createFilterContext,
	descriptorContainsFilter,
	getFilterContext,
	getValueFromDescriptor,
	hasDateFilter,
	parseCasesAndGroupCode
};
