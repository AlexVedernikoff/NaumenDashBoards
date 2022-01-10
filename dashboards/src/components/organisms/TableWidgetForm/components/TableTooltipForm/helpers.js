// @flow
import {ATTRIBUTE_TYPES} from 'src/store/sources/attributes/constants';
import type {Indicator} from 'store/widgetForms/types';

/**
 * Формирует код индикатора, пригодный для сравнения на уникальность в таблицах
 * @param {Indicator} indicator - индикатор
 * @returns {string} - код индикатора
 */
const indicatorToKey = (indicator: ?Indicator): ?string => {
	if (indicator) {
		const {aggregation, attribute} = indicator;

		if (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			const {code, property, sourceCode} = attribute.ref || attribute;
			return `${sourceCode}_${property}_${code}_${aggregation}`;
		}
	}

	return null;
};

export {
	indicatorToKey
};
