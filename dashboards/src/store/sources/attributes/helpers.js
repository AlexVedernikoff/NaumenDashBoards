// @flow
import type {Attribute} from './types';

/*
	Получаем необходимый атрибут для применения группировки и агрегации
 */
const getProcessedAttribute = (attribute: Attribute) => {
	while (attribute.ref) {
		attribute = attribute.ref;
	}

	return attribute;
};

export {
	getProcessedAttribute
};
