// @flow
import type {Attribute} from './types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from './constants';
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
 * @return {any}
 */
const getAttributeValue = (attribute: MixedAttribute | null, key: string, defaultValue: any = '') => {
	if (attribute) {
		let targetAttribute = attribute;

		if (targetAttribute.type in ATTRIBUTE_SETS.REFERENCE && targetAttribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
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
 * @return {MixedAttribute | null}
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
