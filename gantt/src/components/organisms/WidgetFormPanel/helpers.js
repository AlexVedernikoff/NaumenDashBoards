// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {SORTING_OPTIONS} from 'WidgetFormPanel/components/SortingBox/constants';
import type {SortingValueOption} from 'WidgetFormPanel/components/SortingBox/types';
import {SORTING_VALUES} from 'store/widgets/data/constants';

/**
 * Возвращает составной ключ ошибки валидации
 * @param {Array<string>} keys - ключи в порядке вложенности
 * @returns {string}
 */
const getErrorPath = (...keys: Array<string | number>): string => {
	let errorKey = keys.splice(0, 1)[0].toString();

	keys.forEach(key => {
		errorKey += typeof key === 'string' ? `.${key}` : `[${key}]`;
	});

	return errorKey;
};

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

/**
 * Возвращает набор опций значений сортировки в зависимости от данных виджета
 * @param {boolean} disabledDefault - указывает на необходимость дизейбла дефолтной опции
 * @returns {Array<SortingValueOption>}
 */
const getSortingOptions = (disabledDefault: boolean): Array<SortingValueOption> => SORTING_OPTIONS
	.map(option => option.value === SORTING_VALUES.DEFAULT ? {...option, disabled: disabledDefault} : option);

export {
	getErrorPath,
	filterByAttribute,
	getSortingOptions
};
