// @flow
import {addPivotData} from 'utils/recharts/pivot.helpers.js';
import type {CellStyle, ParameterStyle} from './types';
import {FONT_STYLES} from 'store/widgets/data/constants';
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

	if (column.type === PIVOT_COLUMN_TYPE.SUM || column.type === PIVOT_COLUMN_TYPE.TOTAL_SUM) {
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

	const formatValue = formatter(keyForFormats, value ?? null);

	return formatValue;
};

/**
 * Формирует стиль для ячейки параметра
 * @param {number} width - ширина ячейки
 * @param {number} level - уровень вложенности
 * @param {PivotBodySettings} style - стиль таблицы
 * @param {boolean} isTotal - ячейка находится в строке Итого
 * @returns {ParameterStyle}
 */
export const getParameterStyle = (width: number, level: number, style: PivotBodySettings, isTotal: boolean): ParameterStyle => {
	const {parameterRowColor, parameterSettings} = style;
	const {fontColor, fontStyle} = parameterSettings;
	const backgroundColor = level === 0 && parameterRowColor ? parameterRowColor : 'white';
	const PADDING_BY_LEVEL = 26;
	const FIRST_PADDING = 9;
	const SECOND_PADDING = 5;
	const padding = PADDING_BY_LEVEL * level + (level === 0 ? FIRST_PADDING : SECOND_PADDING);

	return {
		backgroundColor,
		color: fontColor,
		flex: `0 0 ${Math.max(width, 0)}px`,
		fontStyle: fontStyle === FONT_STYLES.ITALIC ? 'italic' : '',
		fontWeight: fontStyle === FONT_STYLES.BOLD || isTotal ? '500' : '400',
		paddingLeft: `${padding}px`,
		textDecoration: fontStyle === FONT_STYLES.UNDERLINE && !isTotal ? 'underline' : ''
	};
};

/**
 * Формирует стиль для ячейки сводной таблицы
 * @param {number} width - ширина ячейки
 * @param {number} level - уровень вложенности
 * @param {PivotBodySettings} style - стиль таблицы
 * @param {boolean} isTotal - ячейка находится в строке Итого
 * @param {boolean} isSumColumn - ячейка находится в столбце Сумм
 * @param {boolean} isTotalColumn - ячейка находится в столбце Итого
 * @returns {ParameterStyle}
 */
export const getCellStyle = (
	width: number,
	level: number,
	style: PivotBodySettings,
	isTotal: boolean,
	isSumColumn: boolean,
	isTotalColumn: boolean
): CellStyle => {
	const {indicatorSettings, parameterRowColor, textAlign} = style;
	let backgroundColor = 'transparent';

	if (level === 0 && parameterRowColor) {
		backgroundColor = parameterRowColor ?? 'white';
	} else if (isTotalColumn) {
		backgroundColor = 'white';
	}

	const {fontColor, fontStyle} = indicatorSettings;
	const isUnderline = fontStyle === FONT_STYLES.UNDERLINE && !isSumColumn && !isTotal && !isTotalColumn;

	return {
		backgroundColor,
		color: fontColor,
		flex: `0 0 ${Math.max(width, 0)}px`,
		fontStyle: fontStyle === FONT_STYLES.ITALIC ? 'italic' : '',
		fontWeight: fontStyle === FONT_STYLES.BOLD || isTotal || isTotalColumn ? '500' : '400',
		textAlign,
		textDecoration: isUnderline ? 'underline' : ''
	};
};
