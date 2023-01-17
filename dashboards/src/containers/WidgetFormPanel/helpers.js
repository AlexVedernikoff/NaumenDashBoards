// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';

/**
 * Отфильтровывает массив атрибутов относительно типа переданного атрибута
 * @param {Array<Attribute>} options - массив атрибутов
 * @param {?Attribute} attribute - атрибут относительного которого происходит фильтрации
 * @param {boolean} filterByRef - сообщает о необходимости проводить фильтрацию по вложенному атрибуту
 * @returns {Array<Attribute>}
 */
const filterByAttribute = (options: Array<Attribute>, attribute: ?Attribute, filterByRef: boolean): Array<Attribute> => {
	const {DATE, OBJECT} = ATTRIBUTE_SETS;
	const targetAttribute = filterByRef ? attribute?.ref : attribute;

	return targetAttribute ? options.filter(option => {
		const optionAttribute = filterByRef && option.ref ? option.ref : option;

		if (targetAttribute.type in OBJECT) {
			return optionAttribute.property === targetAttribute.property;
		}

		if (targetAttribute.type in DATE) {
			return optionAttribute.type in DATE;
		}

		return optionAttribute.type === targetAttribute.type;
	}) : options;
};

export {
	filterByAttribute
};
