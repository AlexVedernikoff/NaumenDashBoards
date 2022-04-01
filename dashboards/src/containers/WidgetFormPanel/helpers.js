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
		if (targetAttribute.type in OBJECT) {
			return option.property === targetAttribute.property;
		}

		if (targetAttribute.type in DATE) {
			return option.type in DATE;
		}

		return option.type === targetAttribute.type;
	}) : options;
};

export {
	filterByAttribute
};
