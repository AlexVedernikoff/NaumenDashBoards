// @flow
import type {AttrSetConditions, Breakdown, SourceData} from './types';
import {DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';

/**
 * Возвращает разбивку по умолчанию
 * @param {string} dataKey - ключ сета данных
 * @returns {Breakdown}
 */
const getDefaultBreakdown = (dataKey: string): Breakdown => [{
	attribute: null,
	dataKey,
	group: {
		data: DEFAULT_SYSTEM_GROUP.OVERLAP,
		way: GROUP_WAYS.SYSTEM
	}
}];

/**
 * Извлекает фильтр для атрибутов из источника с дескриптором.
 * Используется при пользовательском режиме
 * @param {SourceData} data - источник с установленным дескриптором
 * @returns {AttrSetConditions} - информация для фильтрации атрибутов
 */
const parseAttrSetConditions = (data: ?SourceData): ?AttrSetConditions => {
	let result = null;

	if (data) {
		try {
			const {descriptor} = data;
			const descriptorObject = JSON.parse(descriptor);

			const {attrGroupCode: groupCode, cases} = descriptorObject;

			result = {cases, groupCode};
		} catch (e) {
			result = null;
		}
	}

	return result;
};

export {
	getDefaultBreakdown,
	parseAttrSetConditions
};
