// @flow
import type {Attribute} from './types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from './constants';
import type {MixedAttribute} from 'store/widgets/data/types';

/**
 * Получаем необходимый атрибут для применения группировки и агрегации
 * @param {Attribute} attribute - базовый атрибут
 * @returns {Attribute} - attribute если это обычный атрибут, attribute.ref - если атрибут ссылочный
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
		const targetAttribute = attribute.ref || attribute;

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

/**
 * Получает Attribute из MixedAttribute
 * @param {MixedAttribute}  attribute  - атрибут
 * @returns {Attribute} - приведенный тип, или null если тип атрибута не совпадает
 */
const getSourceAttribute = (attribute: MixedAttribute | null): Attribute | null => {
	if (
		attribute
		&& attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR
		&& attribute.type !== ATTRIBUTE_TYPES.PERCENTAGE_RELATIVE_ATTR
	) {
		return attribute;
	}

	return null;
};

export {
	getAttributeValue,
	getProcessedAttribute,
	getSourceAttribute,
	setAttributeValue
};
