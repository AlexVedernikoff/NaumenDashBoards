// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {BreakdownItem, DataSet, DiagramFormWidget, Indicator, Parameter} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {getDefaultSystemGroup, isCircleChart, usesCustomGroup} from 'store/widgets/helpers';
import type {MixedAttribute} from 'store/widgets/data/types';
import {SORTING_OPTIONS} from './components/SortingBox/constants';
import type {SortingValueOption} from './components/SortingBox/types';
import {SORTING_VALUES, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Values} from 'containers/WidgetEditForm/types';

/**
 * Фильтрация списка атрибутов по типу атрибута
 * @param {Array<Attribute>} options - Список атрибутов
 * @param {Attribute}  attribute - Атрибут для фильтрации
 * @param {boolean} filterByRef - Фильтрация по группировке
 * @returns {Array<Attribute>} - Отфильтрованный список атрибутов
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
 * Получить использованные атрибуты
 * @param {Array<Indicator> | Array<Parameter> | Array<BreakdownItem>} items - Список параметров, индикаторов или разбивок
 * @returns {Array<Attribute>} - использованные атрибуты
 */
const getUsedArributes = (items: ?(Array<Indicator> | Array<Parameter> | Array<BreakdownItem>)): Array<MixedAttribute> => {
	if (!items) return [];

	return items.reduce((used, {attribute}) => {
		if (attribute) {
			used.push(attribute);
		}

		return used;
	}, []);
};

/**
 * Фильтрация атрибутов в зависимости от текущего атрибута и датасета
 * @param {Array<Attribute>} options - список атрибутов
 * @param {Attribute} selectedAttribute - выбранный атрибут
 * @param {DataSet<Attribute>} currentSet -текущий датасет
 * @returns  {Array<Attribute>} - список отфильтрованнныхатрибутов
 */
const filterByUsedAttributes = (options: Array<Attribute>, selectedAttribute: ?MixedAttribute, currentSet: ?DataSet): Array<Attribute> => {
	let usedAttribute = currentSet
		? [
			...getUsedArributes(currentSet.parameters),
			...getUsedArributes(currentSet.indicators),
			...getUsedArributes(currentSet.breakdown)
		]
		: [];

	return options.filter((option) => {
		const {code, sourceCode = null, type} = option;

		if (selectedAttribute) {
			const {code: selectedCode, sourceCode: selectedSourceCode = null} = selectedAttribute;

			if (code === selectedCode && (type === ATTRIBUTE_TYPES.COMPUTED_ATTR || sourceCode === selectedSourceCode)) {
					return true;
			}
		}

		return usedAttribute.findIndex(
				(used) => used.code === code && (used.type === ATTRIBUTE_TYPES.COMPUTED_ATTR || used.sourceCode === sourceCode)
			) === -1;
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
	filterByUsedAttributes,
	getDataErrorKey,
	getDefaultBreakdown,
	getDefaultIndicator,
	getDefaultParameter,
	getErrorKey,
	getParentClassFqn,
	getSortingOptions
};
