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
import type {CustomFilter, SourceData} from 'store/widgets/data/types';
import {fetchAttributesForFilters} from 'store/sources/actions';
import {getSelectedWidget} from 'store/widgets/data/selectors';
import {getSourceAttributeGroup} from 'store/sources/selectors';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Преобразует список CustomFilter (хранение) в CustomFilterValue (отображение)
 * @param {number} dataSetIndex - индекс источника
 * @param {CustomFilter[]}  widgetFilterOptions - кастомные фильтры источника
 * @returns {Array<CustomFilterValue>} - раз
 */
const mapCustomFilterToValues = (
	dataSetIndex: number,
	widgetFilterOptions: CustomFilter[]
): Array<CustomFilterValue> => {
	const result = [];

	widgetFilterOptions.forEach(({attributes, label}) => {
		result.push(({attributes, dataSetIndex, label}: CustomFilterValue));
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
 * Сформировать справочные данные для отображения источника
 * @param {DataSetTypes} data - источник
 * @param {AttributesState} attributes - справочник атрибутов для источников из стора
 * @param {Function} attrGroupCodeGenerator - генератор для attrGroupCode
 * @returns {Array<CustomFilterDataSet>}
 */
const generateCustomFilterItems = (
	data: DataSetTypes,
	attributes: AttributesState,
	attrGroupCodeGenerator: (SourceData) => string | null
): Array<CustomFilterDataSet> => {
	const mainDataSet = data.find(ds => !ds.sourceForCompute);
	const parentClassFqn = mainDataSet?.source.value?.value ?? null;

	return data.map(({dataKey, source}, dataSetIndex) => {
		const classFqn = source.value?.value;
		const {loading: attributesLoading = false, options = []} = attributes?.[classFqn] || {};

		return {
			attrGroupCode: attrGroupCodeGenerator(source),
			attributes: options,
			attributesLoading,
			dataSetIndex,
			parentClassFqn,
			source
		};
	});
};

export const props = (state: AppState, props: ContainerProps): ConnectedProps => {
	const {values: {data}} = props;
	const {attributes} = state.sources;
	const widget = getSelectedWidget(state);
	const isUserMode = isUserModeDashboard(state);
	const attrGroupCodeGenerator = source => getSourceAttributeGroup(state, source);
	const initialCustomFiltersValues = generateCustomFiltersValues(data);
	let dataSets = generateCustomFilterItems(data, attributes, attrGroupCodeGenerator);

	if (widget.type === WIDGET_TYPES.TABLE && dataSets.length > 0) {
		const [firstDataSet] = dataSets;

		dataSets = [firstDataSet];
	}

	return {
		availableFiltersOnWidget: !isUserMode,
		dataSets,
		initialCustomFiltersValues
	};
};

export const functions: ConnectedFunctions = {
	fetchAttributesForFilters
};
