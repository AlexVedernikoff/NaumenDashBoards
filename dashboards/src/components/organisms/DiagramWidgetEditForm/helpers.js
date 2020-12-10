// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import type {Values} from 'containers/WidgetEditForm/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

const filterByAttribute = (options: Array<Attribute>, attribute: Attribute): Array<Attribute> => {
	const {DATE, OBJECT} = ATTRIBUTE_SETS;

	return options.filter(option => {
		if (attribute.type in OBJECT) {
			return option.property === attribute.property;
		}

		if (attribute.type in DATE) {
			return option.type in DATE;
		}

		return option.type === attribute.type;
	});
};

/**
 * Возвращает составной ключ ошибки валидации
 * @param {Array<string>} keys - ключи в порядке вложенности
 * @returns {string}
 */
const getErrorKey = (...keys: Array<string | number>): string => {
	let errorKey = keys.splice(0, 1)[0].toString();

	keys.forEach(key => {
		errorKey += typeof key === 'string' ? `.${key}` : `[${key}]`;
	});

	return errorKey;
};

/**
 * Возвращает составной ключ ошибки валидации для параметров
 * @param {Array<string>} keys - ключи в порядке вложенности
 * @returns {string}
 */
const getDataErrorKey = (...keys: Array<string | number>): string => getErrorKey(FIELDS.data, ...keys);

/**
 * Возвращает код источника родителя в формах, где дополнительные источники являются дочерними к первому.
 * @param {Values} values - значения формы
 * @param {number} index - индекс набора данных
 * @returns {string | null}
 */
const getParentClassFqn = (values: Values, index: number) => {
	const {data, type} = values;
	let parentClassFqn = null;

	if (type === WIDGET_TYPES.TABLE && index > 0) {
		const mainSource = data[0][FIELDS.source];

		if (mainSource) {
			parentClassFqn = mainSource.value;
		}
	}

	return parentClassFqn;
};

export {
	getDataErrorKey,
	getErrorKey,
	getParentClassFqn,
	filterByAttribute
};
