// @flow
import {isObject} from 'components/atoms/helpers';
import type {Option} from './types';

/**
 * Возвращает представление опции
 * @param {Option} option - опция
 * @returns {string}
 */
const getOptionLabel = (option: Option): string => {
	let label = '';

	if (option) {
		label = isObject(option) ? option.label : option;
	}

	return label;
};

/**
 * Возвращает значение опции
 * @param {Option} option - опция
 * @returns {?string}
 */
const getOptionValue = (option: Option): ?string => isObject(option) ? option.value : option;

/**
 * Функция получения опций для отображения
 * @param {Array<Option>} options - опции
 * @returns {Array<Option>}
 */
const getOptions = (options: Array<Option>): Array<Option> => options;

export {
	getOptionLabel,
	getOptionValue,
	getOptions
};
