// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {DiagramFormWidget, Indicator, Parameter} from 'containers/DiagramWidgetEditForm/types';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {getDefaultSystemGroup, isCircleChart, usesCustomGroup} from 'store/widgets/helpers';
import {SORTING_OPTIONS} from './components/SortingBox/constants';
import type {SortingValueOption} from './components/SortingBox/types';
import {SORTING_VALUES, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Values} from 'containers/WidgetEditForm/types';

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
		const source = data[index][FIELDS.source];

		if (mainSource && source && source.value !== mainSource.value) {
			parentClassFqn = mainSource.value;
		}
	}

	return parentClassFqn;
};

/**
 * Возвращает набор опций значений сортировки в зависимости от данных виджета
 * @param {DiagramFormWidget} widget - виджет
 * @returns {Array<SortingValueOption>}
 */
const getSortingOptions = (widget: DiagramFormWidget): Array<SortingValueOption> => SORTING_OPTIONS
	.map(option => option.value === SORTING_VALUES.DEFAULT
		? {...option, disabled: !usesCustomGroup(widget, isCircleChart(widget.type))}
		: option
	);

/**
 * Возвращает объект показателя по умолчанию
 * @returns {Indicator}
 */
const getDefaultIndicator = () => ({
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
});

/**
 * Возвращает объект параметра по умолчанию
 * @returns {Parameter}
 */
const getDefaultParameter = () => ({
	attribute: null,
	group: getDefaultSystemGroup(null)
});

export {
	filterByAttribute,
	getDataErrorKey,
	getDefaultIndicator,
	getDefaultParameter,
	getErrorKey,
	getParentClassFqn,
	getSortingOptions
};
