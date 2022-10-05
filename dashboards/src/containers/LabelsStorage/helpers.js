// @flow
import type {Label} from './types';

/**
 * Формирует уникальный ключ для метки данных
 * @param {Label} label - метка данных
 * @returns {string} - ключ
 */
export const generateLabelKey = (label: Label) => {
	const {dataKey, name} = label;
	return `${dataKey || ''}::${name || ''}`;
};
