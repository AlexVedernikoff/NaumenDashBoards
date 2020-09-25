// @flow
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {getDefaultSystemGroup} from 'store/widgets/helpers';

/**
 * Проверяет используются ли в наборах данных для построения виджета разные типы агрегаций
 * @param {Array<DataSet>} data - массив наборов данных для построения
 * @returns {boolean}
 */
const hasDifferentAggregations = (data: Array<DataSet>) => !data
	.filter(set => !set.sourceForCompute)
	.every(({indicators = [getDefaultIndicator()]}, setIndex, data) =>
		indicators.every(({aggregation}, indicatorIndex) => {
			if (setIndex === 0 && indicatorIndex === 0) {
				return true;
			} else if (indicatorIndex === 0) {
				return aggregation === data[setIndex - 1].indicators[0].aggregation;
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
