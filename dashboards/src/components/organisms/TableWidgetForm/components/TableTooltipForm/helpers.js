// @flow
import {getSourceAttribute} from 'store/sources/attributes/helpers';
import type {Indicator} from 'store/widgetForms/types';

/**
 * Формирует код индикатора, пригодный для сравнения на уникальность в таблицах
 * @param {Indicator} indicator - индикатор
 * @returns {string} - код индикатора
 */
const indicatorToKey = (indicator: ?Indicator): ?string => {
	if (indicator) {
		const {aggregation, attribute} = indicator;
		const sourceAttribute = getSourceAttribute(attribute);

		if (sourceAttribute) {
			const {code, property, sourceCode} = sourceAttribute.ref || sourceAttribute;
			return `${sourceCode}_${property}_${code}_${aggregation}`;
		}
	}

	return null;
};

export {
	indicatorToKey
};
