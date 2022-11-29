// @flow
import type {DataSet} from 'store/widgetForms/pivotForm/types';

/**
 * Возвращает список ключей источников, в которых было изменено значение
 * @param {Array<DataSet>} data - текущий массив источников
 * @param {Array<DataSet>} prevData - начальный массив источников
 * @returns {Array<string>} - список ключей источников, в которых было изменено значение
 */
export const getDataKeysWithChangedDataSourceValue = (data: Array<DataSet>, prevData: Array<DataSet>) => {
	const result = [];

	data.forEach(({dataKey, source}) => {
		const prevDataSet = prevData.find(prevItem => prevItem.dataKey === dataKey);

		if (prevDataSet && prevDataSet.source.value?.value !== source.value?.value) {
			result.push(dataKey);
		}
	});

	return result;
};

/**
 * Сравнивает изменение ключей источников
 * @param {Array<DataSet>} data - текущий массив источников
 * @param {Array<DataSet>} prevData - начальный массив источников
 * @returns {boolean} - true, если были заменены источники
 */
export const isDataKeysChanged = (data: Array<DataSet>, prevData: Array<DataSet>) => {
	let result = false;

	if (data.length === prevData.length) {
		const keys1 = data.map(({dataKey}) => dataKey);
		const keys2 = new Set(prevData.map(({dataKey}) => dataKey));

		result = keys1.every(key => keys2.has(key));
	}

	return result;
};
