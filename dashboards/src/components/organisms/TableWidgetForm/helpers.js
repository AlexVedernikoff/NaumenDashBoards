// @flow
import api from 'api';
import type {DataSet} from 'store/widgetForms/tableForm/types';

/**
 * Проверяет используются ли в наборах данных для построения виджета разные типы агрегаций
 * @param {Array<DataSet>} data - массив наборов данных для построения
 * @returns {boolean}
 */
const hasDifferentAggregations = (data: Array<DataSet>) => !data
	.filter(dataSet => !dataSet.sourceForCompute)
	.every(({indicators}, dataSetIndex, data) =>
		indicators?.every(({aggregation}, indicatorIndex) => {
			if (dataSetIndex === 0 && indicatorIndex === 0) {
				return true;
			} else if (indicatorIndex === 0) {
				const {indicators} = data[dataSetIndex - 1];

				return Array.isArray(indicators) && aggregation === indicators[0].aggregation;
			}

			return aggregation === indicators[indicatorIndex - 1].aggregation;
		})
	);

/**
 * Функция обработчик для правила валидации связи источников
 * @returns {Promise<boolean>}
 */
async function checkSourceForParent () {
	const {options, parent} = this;
	const {data} = options.values;
	const {dataKey, source, sourceRowName = null} = parent;
	const mainSource = data[0].source;
	const index = data.findIndex(dataSet => dataSet.dataKey === dataKey);
	let result = true;

	if (index > 0 && source?.value && mainSource && sourceRowName === null) {
		const {value: mainValue} = mainSource.value;
		const {value} = source.value;

		if (mainValue !== value) {
			try {
				({result} = await api.instance.dashboards.checkForParent(mainValue, value));
			} catch (e) {
				result = false;
			}
		}
	}

	return result;
}

/**
 * Проверяет запрет на выбор top записей для таблицы
 * @param {DataSet} data - набор данных виджета
 * @returns {number}
 */
const isDisableDataTopField = (data: Array<DataSet>): boolean =>
	data.some(
		({indicators, sourceForCompute}) => !sourceForCompute && Array.isArray(indicators) && indicators.length > 1
	);

export {
	checkSourceForParent,
	isDisableDataTopField,
	hasDifferentAggregations
};
