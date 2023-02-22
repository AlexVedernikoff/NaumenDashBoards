// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_AXIS_FORMAT} from 'store/widgets/data/constants';
import {getSourceAttribute} from 'store/sources/attributes/helpers';
import {hasMSInterval} from 'store/widgets/helpers';
import type {IndicatorFormat, SomeDataSets} from './types';

/**
 * Проверяет есть ли в источниках отображаемый атрибут с типом dtInterval
 * @param {SomeDataSets} data - источники
 * @returns {boolean} - true, если такой атрибут существует
 */
export const hasDTInterval = (data: SomeDataSets): boolean =>
	data.some(({indicators, sourceForCompute}) => {
		let dataSetResult = false;

		if (!sourceForCompute) {
			dataSetResult = indicators.some(indicator => {
				let indicatorsResult = false;
				const sourceAttribute = getSourceAttribute(indicator.attribute);

				if (sourceAttribute) {
					const attribute = sourceAttribute.ref ?? sourceAttribute;

					indicatorsResult = hasMSInterval(attribute, indicator.aggregation);
				}

				return indicatorsResult;
			});
		}

		return dataSetResult;
	});

/**
 * Формирует массив параметров форматирования по индикаторам источников
 * @param {SomeDataSets} data - источники из виджета
 * @returns {Array<IndicatorFormat>} - массив параметров форматирования для индикаторов виджета
 */
export const getIndicatorsFormats = (data: SomeDataSets): Array<IndicatorFormat> => {
	const indicatorsFormats = [];

	data.forEach((dataSet, dataSetIndex) => {
		if (!dataSet.sourceForCompute && dataSet.indicators) {
			const dataSetTitle = dataSet.source.value?.label ?? '';

			dataSet.indicators.forEach((indicator, indicatorIndex) => {
				let attribute = getSourceAttribute(indicator.attribute);

				attribute = attribute?.ref ?? attribute;

				if (attribute && hasMSInterval(attribute, indicator.aggregation)) {
					let title = attribute.title;

					if (data.length > 1) {
						title = `${dataSetTitle} - ${title}`;
					}

					indicatorsFormats.push({
						dataSetIndex,
						format: indicator.format ?? DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.DT_INTERVAL_FORMAT],
						indicatorIndex,
						title
					});
				}
			});
		}
	});

	return indicatorsFormats;
};
