// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {ATTRIBUTES_HELPERS_CONTEXT} from './constants';
import type {Breakdown, Indicator, Parameter} from 'store/widgetForms/types';
import type {DynamicAttributes} from './types';
import {filterByAttribute} from 'containers/WidgetFormPanel/helpers';
import {getSourceAttribute} from 'store/sources/attributes/helpers';
import memoize from 'memoize-one';
import type {Props} from 'containers/DiagramWidgetForm/types';
import React from 'react';
import {VISOR_CODE_TYPES} from 'store/sources/attributes/constants';

export const withAttributesHelperContext = <Config: Props>(Component: React$ComponentType<Config>): React$ComponentType<Config> =>
	class WithAttributesHelperContext extends React.Component<Config> {
		getHelpers = memoize(() => ({
			filterAttributeByMainDataSet: this.filterAttributeByMainDataSet,
			filterAttributesByUsed: this.filterAttributesByUsed,
			filterBreakdownAttributeByMainDataSet: this.filterBreakdownAttributeByMainDataSet,
			filterDynamicAttributes: this.filterDynamicAttributes,
			getCommonAttributes: this.getCommonAttributes
		}));

		/**
		 * Фильтрует атрибуты в зависимости от главного источника
		 * Используется в таблицах, в которых установленно "не использовать параметры"
		 * @param {Array<Attribute>} options - список атрибутов
		 * @param {number} dataSetIndex - индекс набора данных
		 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
		 */
		filterAttributeByMainDataSet = (options: Array<Attribute>, dataSetIndex: number): Array<Attribute> => {
			const {attributes, fetchAttributes, setLoadingStateAttributes, values: {data}} = this.props;
			let result = [];

			if (options && options.length > 0) {
				const dataSet = data[dataSetIndex];
				const dataSetSource = dataSet.source.value.value;
				const mainDataSet = data.find(ds => !ds.sourceForCompute);
				const mainSource = mainDataSet.source?.value?.value;
				const mainAttributes = attributes[mainSource];

				if (!mainAttributes || (!mainAttributes.uploaded && !mainAttributes.loading)) {
					// атрибуты главного источника не загружены, переводим источник в загрузку,
					// и загружаем атрибуты главного источника
					setLoadingStateAttributes(dataSetSource, true);
					fetchAttributes(mainSource, null, null, () => setLoadingStateAttributes(dataSetSource, false));
				} else {
					if (!mainAttributes.loading) {
						// атрибуты главного источника загружены,
						// оставляем только те атрибуты, которые встречаются
						// в главном источнике
						const mainOptions = mainAttributes.options;

						result = options.filter(({code, property}) =>
							mainOptions.find(item => item.code === code && item.property === property)
						);
					}
				}
			}

			return result;
		};

		/**
		 * Фильтрует атрибуты в зависимости от уже использованных
		 * @param {Array<Attribute>} options - список атрибутов
		 * @param {number} dataSetIndex - индекс набора данных
		 * @param {?Array<?Attribute>} includeAttributes - атрибут, который не надо отфильтровывать
		 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
		 */
		filterAttributesByUsed = (options: Array<Attribute>, dataSetIndex: number, includeAttributes: ?Array<?Attribute>): Array<Attribute> => {
			const {breakdown, indicators, parameters} = this.props.values.data[dataSetIndex];
			const usedAttributes = [
				...this.getUsedAttributes(parameters),
				...this.getUsedAttributes(indicators),
				...this.getUsedAttributes(breakdown)
			];

			let filteredOptions = options;

			if (usedAttributes.length > 0) {
				filteredOptions = [];

				options.forEach(attribute => {
					const {code, sourceCode = null} = attribute;
					const isInclude = includeAttributes?.some(
						includeAttribute => includeAttribute && includeAttribute.code === code && includeAttribute.sourceCode === sourceCode
					) ?? false;
					const isUsedAttribute = usedAttributes.find(
						usedAttribute => usedAttribute.code === code && usedAttribute.sourceCode === sourceCode
					);

					if (isInclude || !isUsedAttribute) {
						filteredOptions.push(attribute);
					}
				});
			}

			return filteredOptions;
		};

		/**
		 * Фильтрует атрибуты разбивки в соответствии с типом разбивки первого источника
		 * @param {Array<Attribute>} options - список атрибутов
		 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
		 */
		filterBreakdownAttributeByMainDataSet = (options: Array<Attribute>): Array<Attribute> => {
			const {values: {data}} = this.props;
			let result = [];

			if (options && options.length > 0) {
				const mainDataSet = data.find(ds => !ds.sourceForCompute);

				if (mainDataSet && mainDataSet.breakdown && mainDataSet.breakdown.length > 0) {
					const {attribute} = mainDataSet.breakdown[0];

					result = filterByAttribute(options, attribute, false);
				}
			}

			return result;
		};

		/**
		 * Фильтрует динамические атрибуты в соответствии с типом атрибута и использованными атрибутами
		 *
		 * @param {Array<Attribute>} options - список атрибутов
		 * @param {number} dataSetIndex - индекс набора данных
		 * @param {?Array<?Attribute>} includeAttributes - атрибут, который не надо отфильтровывать
		 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
		 */
		filterDynamicAttributes = (
			options: DynamicAttributes,
			dataSetIndex: number,
			includeAttributes: Array<?string>
		): DynamicAttributes => {
			const {breakdown, indicators, parameters} = this.props.values.data[dataSetIndex];
			const usedAttributes = [
				...this.getUsedAttributes(parameters),
				...this.getUsedAttributes(indicators),
				...this.getUsedAttributes(breakdown)
			];
			const result = {};
			const clearChildren = [];

			Object.keys(options).forEach(itemKey => {
				const item = options[itemKey];
				const {parent, value} = item;

				if (parent) {
					// $FlowFixMe:prop-missing
					const isFailTypes = value.visorCode === VISOR_CODE_TYPES.HYPERLINK;
					const isUsed = usedAttributes.find(
						// $FlowFixMe:prop-missing
						attr => attr.code === value.code && attr.property === value.property
					);
					const isInclude = includeAttributes.find(attrCode => attrCode === value.code);

					if (isFailTypes || (isUsed && !isInclude)) {
						clearChildren.push({key: itemKey, parent});
					} else {
						result[itemKey] = {...item};
					}
				} else {
					result[itemKey] = {...item};
				}
			});

			clearChildren.forEach(({key, parent}) => {
				if (parent && result[parent]) {
					const parentItem = result[parent];

					parentItem.children = parentItem.children.filter(child => child !== key);

					if (parentItem.children.length === 0) {
						delete result[parent];
					}
				}
			});

			return result;
		};

		/**
		 * Фильтрует атрибуты разбивки в соответствии с типом разбивки первого источника
		 * @param {Array<Attribute>} options - список атрибутов
		 * @returns {Array<Attribute>} - список отфильтрованных атрибутов
		 */
		getCommonAttributes = (options: Array<Attribute>): Array<Attribute> => {
			const {attributes, fetchAttributes, values: {data}} = this.props;
			const result = [];
			const optionsList = [];
			let allLoaded = true;

			// проверка на загруженность атрибутов
			data.forEach(ds => {
				const source = ds.source?.value?.value;
				const sourceAttributes = attributes[source];

				if (!sourceAttributes || (!sourceAttributes.uploaded && !sourceAttributes.loading)) {
					allLoaded = false;
					fetchAttributes(source, null, null);
				} else if (sourceAttributes.loading) {
					allLoaded = false;
				} else {
					optionsList.push(sourceAttributes.options);
				}
			});

			// оставляет те атрибуты первого источника,
			// которые есть во всех остальных источниках
			if (allLoaded) {
				options.forEach(mainItem => {
					const isAdd = optionsList.every(options =>
						options.find(({code, property}) => code === mainItem.code && property === mainItem.property)
					);

					if (isAdd) {
						result.push(mainItem);
					}
				});
			}

			return result;
		};

		/**
		 * Возвращает использованные атрибуты
		 * @param {Array<Indicator> | Array<Parameter> | Breakdown} items - Список параметров, индикаторов или разбивок
		 * @returns {Array<Attribute>} - использованные атрибуты
		 */
		getUsedAttributes = (items: Array<Indicator> | ?(Array<Parameter> | Breakdown)): Array<Attribute> => {
			const result = [];

			if (items) {
				items.forEach(({attribute}) => {
					const sourceAttribute = getSourceAttribute(attribute);

					if (sourceAttribute) {
						result.push(sourceAttribute.ref ?? sourceAttribute);
					}
				});
			}

			return result;
		};

		render () {
			return (
				<ATTRIBUTES_HELPERS_CONTEXT.Provider value={this.getHelpers()}>
					<Component {...this.props} />
				</ATTRIBUTES_HELPERS_CONTEXT.Provider>
			);
		}
	};

export default withAttributesHelperContext;
