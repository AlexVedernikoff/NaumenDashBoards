// @flow
import type {AppState} from 'store/types';
import type {AttributesState} from 'store/sources/attributes/types';
import type {
	ConnectedFunctions,
	ConnectedProps,
	ContainerProps,
	CustomFilterDataSet,
	CustomFilterValue,
	DataSetTypes
} from './types';
import type {CustomFilter} from 'store/widgets/data/types';
import {fetchAttributes} from 'store/sources/attributes/actions';

/**
 * Преобразует список CustomFilter (хранение) в CustomFilterValue (отображение)
 * @param {number} dataSetIndex - индекс источника
 * @param {CustomFilter[]}  widgetFilterOptions - кастомные фильтры источника
 * @returns {Array<CustomFilterValue>} - раз
 */
const mapCustomFilterToValues = (dataSetIndex: number, widgetFilterOptions: CustomFilter[]): Array<CustomFilterValue> => {
	const result = [];

	widgetFilterOptions.forEach(({attributes, label}) => {
		attributes.forEach((attribute) => {
			result.push(({attribute, dataSetIndex, label}: CustomFilterValue));
		});
	});

	return result;
};

/**
 * Получает список фильтров для отображения с указанного источника
 * @param {DataSetTypes} data - источник
 * @returns  {Array<CustomFilterValue>}  - список фильтров
 */
const generateCustomFiltersValues = (data: DataSetTypes): Array<CustomFilterValue> => {
	let result = [];

	data.forEach((dataSet, dataSetIndex) => {
		const {source: {widgetFilterOptions}} = dataSet;

		if (Array.isArray(widgetFilterOptions)) {
			const widgetFilterOptionsItems = mapCustomFilterToValues(dataSetIndex, widgetFilterOptions);

			if (widgetFilterOptionsItems.length > 0) {
				result = [...result, ...widgetFilterOptionsItems];
			}
		}
	});

	return result;
};

/**
 * Сформировать спавочные данные для отображения источника
 *
 * @param {DataSetTypes} data - источник
 * @param {AttributesState} attributes - справочник атрибутов для источников из стора
 * @returns {Array<CustomFilterDataSet>}
 */
const generateCustomFilterItems = (data: DataSetTypes, attributes: AttributesState): Array<CustomFilterDataSet> => {
	return data.map(({dataKey, source}, dataSetIndex) => {
		const classFqn = source.value?.value;
		let {loading: attributesLoading = false, options = []} = attributes?.[classFqn] || {};

		return {
			attributes: options,
			attributesLoading,
			dataSetIndex,
			source
		};
	});
};

export const props = (state: AppState, props: ContainerProps): ConnectedProps => {
	let {values: {data}} = props;
	const {attributes} = state.sources;
	const initialCustomFiltersValues = generateCustomFiltersValues(data);
	const dataSets = generateCustomFilterItems(data, attributes);

	return {
		dataSets,
		initialCustomFiltersValues
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributes
};
