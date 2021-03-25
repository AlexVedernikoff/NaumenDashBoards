// @flow
import type {Attribute} from './types';
import {ATTRIBUTE_SETS} from './constants';
import type {MixedAttribute} from 'store/widgets/data/types';

/*
	Получаем необходимый атрибут для применения группировки и агрегации
 */
const getProcessedAttribute = (attribute: Attribute) => {
	if (attribute.type in ATTRIBUTE_SETS.REFERENCE) {
		return attribute.ref;
	}

	return attribute;
};

/**
 * Возвращает значение атрибута с учетом вложенности
 * @param {MixedAttribute | null} attribute - атрибут
 * @param {string} key - ключ свойства атрибута
 * @param {any} defaultValue - дефолтное значение
 * @returns {any}
 */
const getAttributeValue = (attribute: ?MixedAttribute, key: string, defaultValue: any = '') => {
	if (attribute) {
		let targetAttribute = attribute;

		if (targetAttribute.ref) {
			targetAttribute = targetAttribute.ref;
		}

		if (targetAttribute && typeof targetAttribute === 'object') {
			return targetAttribute[key];
		}
	}

	return defaultValue;
};

/**
 * Устанавливает значение атрибута с учетом вложенности
 * @param {MixedAttribute | null} attribute - атрибут
 * @param {string} key - ключ свойства атрибута
 * @param {any} value - значение
 * @returns {MixedAttribute | null}
 */
const setAttributeValue = (attribute: Attribute, key: string, value: any) => {
	let newAttribute = attribute;

	if (newAttribute.ref) {
		newAttribute = {
			...newAttribute,
			ref: {
				...newAttribute.ref,
				[key]: value
			}
		};
	} else {
		newAttribute = {
			...newAttribute,
			[key]: value
		};
	}

	return newAttribute;
};

export {
	getProcessedAttribute,
	getAttributeValue,
	setAttributeValue
};
