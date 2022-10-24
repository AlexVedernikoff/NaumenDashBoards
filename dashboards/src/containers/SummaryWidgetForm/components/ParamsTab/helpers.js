// @flow
import type {FilterDescriptorGetter} from './types';
import {hasDateFilter} from 'utils/descriptorUtils';
import type {SourcesFiltersMap} from 'store/sources/sourcesFilters/types';
import type {Values} from 'components/organisms/SummaryWidgetForm/types';

/**
 * Формирует фабрику дескриптор из хранилища, по источнику и идентификатору фильтра
 * @param {SourcesFiltersMap} filters - хранилище сохраненных фильтров
 * @returns {FilterDescriptorGetter} - функция возвращающая дескриптор по источнику и идентификатору фильтра
 */
const getFilterDescriptorGetter = (filters: SourcesFiltersMap): FilterDescriptorGetter =>
	(source: string, filterId: string): string => {
		let result = '';

		if (source) {
			const sourceFilters = filters[source];
			const filter = sourceFilters.find(({id}) => id === filterId);

			if (filter) {
				result = filter.descriptor;
			}
		}

		return result;
	};

/**
 * Возвращает все дескрипторы по историкам виджета
 * @param {Values} values - виджет сводки
 * @param {FilterDescriptorGetter<string>} getter - функция получения сохраненных дескрипторов
 * @returns {Array<string>} - дескрипторы
 */
const getAllDescriptors = (values: Values, getter: FilterDescriptorGetter): Array<string> => {
	const descriptors = [];

	// eslint-disable-next-line no-unused-vars
	for (const dataSet of values.data) {
		const {descriptor, filterId, value} = dataSet.source;
		let calcDescriptor = descriptor;

		if (value && filterId) {
			calcDescriptor = getter(value?.value, filterId);
		}

		descriptors.push(calcDescriptor);
	}

	return descriptors;
};

/**
 * Проверяет есть ли дескрипторы с фильтрацией по дате
 * @param {Array<string>} descriptors - список дескрипторов
 * @returns {Promise<boolean>} - результат проверки того, что в дескрипторах есть фильтрация по дате
 */
const checkIsAllowComparePeriod = async (descriptors: Array<string>): Promise<boolean> => {
	const promises = descriptors.map(hasDateFilter);
	const data = await Promise.all(promises);
	const result = data.some(val => val);

	return result;
};

export {
	getAllDescriptors,
	getFilterDescriptorGetter,
	checkIsAllowComparePeriod
};
