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

const getProcessedValue = (attribute: Attribute | null, key: string, defaultValue: any = '') => {
	if (attribute) {
		let processedAttribute = attribute;

		if (attribute.type in ATTRIBUTE_SETS.REF) {
			processedAttribute = attribute.ref;
		}

		if (processedAttribute && typeof processedAttribute === 'object') {
			return processedAttribute[key];
		}
	}

	return defaultValue;
};

export {
	getProcessedAttribute,
	getProcessedValue
};
