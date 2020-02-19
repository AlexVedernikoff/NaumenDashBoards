// @flow
import type {Attribute} from './types';
import {ATTRIBUTE_SETS} from './constants';

/*
	Получаем необходимый атрибут для применения группировки и агрегации
 */
const getProcessedAttribute = (attribute: Attribute) => {
	if (ATTRIBUTE_SETS.REF.includes(attribute.type)) {
		return attribute.ref;
	}

	return attribute;
};

const getProcessedValue = (attribute: Attribute, key: string, defaultValue: any) => {
	let processedAttribute = attribute;

	if (ATTRIBUTE_SETS.REF.includes(attribute.type)) {
		processedAttribute = attribute.ref;
	}

	return processedAttribute && typeof processedAttribute === 'object' ? processedAttribute[key] : defaultValue;
};

export {
	getProcessedAttribute,
	getProcessedValue
};
