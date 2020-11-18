// @flow
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {getDefaultSystemGroup} from 'store/widgets/helpers';

/**
 * Проверяет используются ли в наборах данных для построения виджета разные типы агрегаций
 * @param {Array<DataSet>} data - массив наборов данных для построения
 * @returns {boolean}
 */
const hasDifferentAggregations = (data: Array<DataSet>) => !data
	.filter(set => !set.sourceForCompute)
	.every(({indicators = [getDefaultIndicator()]}, dataSetIndex, data) =>
		indicators.every(({aggregation}, indicatorIndex) => {
			if (dataSetIndex === 0 && indicatorIndex === 0) {
				return true;
			} else if (indicatorIndex === 0) {
				const {indicators} = data[dataSetIndex - 1];

				return Array.isArray(indicators) && aggregation === indicators[0].aggregation;
			}

			return aggregation === indicators[indicatorIndex - 1].aggregation;
		})
	);

const getDefaultIndicator = () => ({
	aggregation: DEFAULT_AGGREGATION.COUNT,
	attribute: null
});

const getDefaultParameter = () => ({
	attribute: null,
	group: getDefaultSystemGroup(null)
});

export {
	getDefaultIndicator,
	getDefaultParameter,
	hasDifferentAggregations
};
