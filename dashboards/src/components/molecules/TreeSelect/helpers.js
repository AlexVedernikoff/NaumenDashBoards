// @flow
import type {Option} from './types';

/**
 * Возвращает представление опции
 * @param {Option} option - опция
 * @returns {string}
 */
const getOptionLabel = (option: Option | null): string => option?.label ?? '';

/**
 * Возвращает значение опции
 * @param {Option} option - опция
 * @returns {?string}
 */
const getOptionValue = (option: Option | null): ?string => option?.value;

export {
	getOptionLabel,
	getOptionValue
};
