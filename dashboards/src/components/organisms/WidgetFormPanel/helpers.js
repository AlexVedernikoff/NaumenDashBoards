// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from './constants';

const filterByAttribute = (options: Array<Attribute>, attribute: Attribute): Array<Attribute> => {
	const {DATE, OBJECT} = ATTRIBUTE_SETS;

	options = options.filter(option => {
		if (attribute.type in OBJECT) {
			return option.property === attribute.property;
		}

		if (attribute.type in DATE) {
			return option.type in DATE;
		}

		return option.type === attribute.type;
	});

	return options;
};

const getDataErrorKey = (...keys: Array<string | number>) => {
	let errorKey = FIELDS.data;

	keys.forEach(key => {
		errorKey += typeof key === 'string' ? `.${key}` : `[${key}]`;
	});

	return errorKey;
};

export {
	getDataErrorKey,
	filterByAttribute
};
