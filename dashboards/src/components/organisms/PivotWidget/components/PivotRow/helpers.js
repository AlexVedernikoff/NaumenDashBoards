// @flow
import {addPivotData} from 'utils/recharts/pivot.helpers.js';
import type {CellStyle, ParameterStyle} from './types';
import type {PivotBodySettings} from 'src/store/widgets/data/types';
import type {PivotColumn, PivotDataItem} from 'utils/recharts/types';
import {PIVOT_COLUMN_TYPE} from 'utils/recharts/constants';
import type {ValuePivotFormatter} from 'utils/recharts/formater/types';

/**
 * Формирует отформатированное значение для столбца
 * @param {PivotColumn} column - столбец
 * @param {PivotDataItem} data - данные по показателю
 * @param {ValuePivotFormatter} formatter - форматтер для значения
 * @returns {string} - значение
 */
export const getValueForColumn = (column: PivotColumn, data: PivotDataItem, formatter: ValuePivotFormatter) => {
	let value = null;
	let keyForFormats = column.key;

	if (column.type === PIVOT_COLUMN_TYPE.SUM) {
		let result = null;
		const {sumKeys} = column;
		const values = sumKeys.map(key => data[key]).filter(Boolean);

		values.forEach(item => {
			result = addPivotData(result, item);
		});

		if (sumKeys.length > 0) {
			keyForFormats = sumKeys[0];
		}

		value = result;
	} else {
		value = data[column.key];
	}

	const formatValue = formatter(keyForFormats, value ?? '');

	return formatValue;
};

/**
 * Формирует стиль для ячейки параметра
 * @param {number} width - ширина ячейки
 * @param {number} level - уровень вложенности
 * @param {PivotBodySettings} style - стиль таблицы
 * @returns {ParameterStyle}
 */
export const getParameterStyle = (width: number, level: number, style: PivotBodySettings): ParameterStyle => {
	const backgroundColor = level === 0 && style.parameterRowColor ? style.parameterRowColor : 'transparent';
	const PADDING_BY_LEVEL = 26;
	const FIRST_PADDING = 9;
	const SECOND_PADDING = 5;
	const padding = PADDING_BY_LEVEL * level + (level === 0 ? FIRST_PADDING : SECOND_PADDING);

	return {
		backgroundColor,
		paddingLeft: `${padding}px`,
		width: Math.max(width - 1, 0)
	};
};

/**
 * Формирует стиль для ячейки сводной таблицы
 * @param {number} width - ширина ячейки
 * @param {number} level - уровень вложенности
 * @param {PivotBodySettings} style - стиль таблицы
 * @returns {ParameterStyle}
 */
export const getCellStyle = (width: number, level: number, style: PivotBodySettings): CellStyle => {
	const backgroundColor = level === 0 && style.parameterRowColor ? style.parameterRowColor : 'transparent';
	return {backgroundColor, width: Math.max(width, 0)};
};
