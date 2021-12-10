// @flow
import Localization from './localization';
import type {LocalizationParams} from './types';

export const localization = new Localization();

const translate = (key: string, params?: LocalizationParams) => localization.translate(key, params);

/**
 * Преобразует поле [key] в каждом элементе-объекте из массива array. Нужен для локализации списков
 * @param {string} key - имя поле в объекте
 * @param {Array<object>} array - массив, каждый элемент который содержит объект с полем [key]
 * @returns {Array<object>}
 */
export function translateObjectsArray (key: string, array: Array<Object>): Array<Object> {
	return array.map(obj => ({...obj, [key]: translate(obj[key])}));
}

/**
 * Возвращает установленную локаль
 * @returns {string}
 */
export const getLocale = () => localization.locale;

export default translate;
