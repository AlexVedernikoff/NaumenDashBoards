// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import type {BreakdownItem, DiagramFormWidget, Indicator, Parameter} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {getDefaultSystemGroup, isCircleChart, usesCustomGroup} from 'store/widgets/helpers';
import {SORTING_OPTIONS} from './components/SortingBox/constants';
import type {SortingValueOption} from './components/SortingBox/types';
import {SORTING_VALUES, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Values} from 'containers/WidgetEditForm/types';

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
 * @returns {string | null}
 */
const getParentClassFqn = (values: Values): string | null => {
	const {data, type} = values;

	return type === WIDGET_TYPES.TABLE ? data[0][FIELDS.source]?.value?.value : null;
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
const getDefaultIndicator = (): Indicator => ({
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
});

/**
 * Возвращает объект параметра по умолчанию
 * @returns {Parameter}
 */
const getDefaultParameter = (): Parameter => ({
	attribute: null,
	group: getDefaultSystemGroup(null)
});

/**
 * Возвращает объект разбивки по умолчанию
 * @param {string} dataKey - ключ сета данных
 * @returns {BreakdownItem}
 */
const getDefaultBreakdown = (dataKey: string): BreakdownItem => ({
	attribute: null,
	dataKey,
	group: getDefaultSystemGroup(null)
});

export {
	filterByAttribute,
	getDataErrorKey,
	getDefaultBreakdown,
	getDefaultIndicator,
	getDefaultParameter,
	getErrorKey,
	getParentClassFqn,
	getSortingOptions
};
