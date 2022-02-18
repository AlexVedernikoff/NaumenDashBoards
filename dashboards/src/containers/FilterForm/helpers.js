// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {SourcesFiltersMap} from 'store/sources/sourcesFilters/types';

/**
 * Ищет дескриптор в SourcesFiltersMap по коду источника и ключу фильтра
 * @param {SourcesFiltersMap} filtersMap - хранилище сохраненных фильтров
 * @param {string} classFqn - код источника
 * @param {string} filterId - ключ фильтра
 * @returns {string | null} - дескриптор фильтра или null, если его нет
 */
export const findFilter = (filtersMap: SourcesFiltersMap, classFqn: string, filterId: string): (string | null) => {
	let result = null;
	const filters = filtersMap[classFqn];

	if (filters) {
		const filter = filters.find(item => item.id === filterId);

		if (filter) {
			result = filter.descriptor;
		}
	}

	return result;
};

/**
 * Возвращает атрибут sourceFilterAttributeGroup источника
 * @param {DataSourceMap} sources - хранилище источников
 * @param {string} classFqn - код источника
 * @returns {string} - атрибут sourceFilterAttributeGroup
 */
export const getSourceFilterAttributeGroup = (sources: DataSourceMap, classFqn: string): string | null => {
	let result = null;
	const source = sources[classFqn];

	if (source) {
		result = source.value.sourceFilterAttributeGroup;
	}

	return result;
};
