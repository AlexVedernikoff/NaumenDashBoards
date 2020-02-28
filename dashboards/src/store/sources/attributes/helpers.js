// @flow
import type {Attribute} from './types';
import {ATTRIBUTE_SETS} from './constants';

/*
	Получаем необходимый атрибут для применения группировки и агрегации
 */
const getProcessedAttribute = (attribute: Attribute) => {
	if (attribute.type in ATTRIBUTE_SETS.REF) {
		return attribute.ref;
	}

	return attribute;
};

const getProcessedValue = (attribute: Attribute, key: string, defaultValue: any) => {
	let processedAttribute = attribute;

	if (attribute.type in ATTRIBUTE_SETS.REF) {
		processedAttribute = attribute.ref;
	}

	return processedAttribute && typeof processedAttribute === 'object' ? processedAttribute[key] : defaultValue;
};

export {
	getProcessedAttribute,
	getProcessedValue
};
