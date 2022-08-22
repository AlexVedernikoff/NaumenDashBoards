// @flow
import {FONT_STYLES} from 'store/widgets/data/constants';
import type {HeaderColumnStyle, TitleColumnStyle} from './types';
import type {PivotHeaderSettings} from 'src/store/widgets/data/types';

/**
 * Формирует стили для ячейки заголовка сводной таблицы
 * @param {number} columnWidth - ширина ячейки
 * @param {PivotHeaderSettings} style - стиль заголовка
 * @returns  {HeaderColumnStyle}
 */
export const getHeaderColumnStyle = (columnWidth: number, style: PivotHeaderSettings): HeaderColumnStyle => ({
	flex: `0 0 ${columnWidth}px`
});

/**
 * Формирует стили для подписи ячейки заголовка сводной таблицы
 * @param {number} height - высота подписи
 * @param {PivotHeaderSettings} style - стиль заголовка
 * @returns {HeaderColumnStyle}
 */
export const getTitleStyle = (height: number, style: PivotHeaderSettings): TitleColumnStyle => {
	const {fontColor, fontStyle, textAlign} = style;

	return {
		color: fontColor,
		fontStyle: fontStyle === FONT_STYLES.ITALIC ? 'italic' : '',
		fontWeight: fontStyle === FONT_STYLES.BOLD ? '500' : 'normal',
		height: `${height * 2}em`,
		textAlign,
		textDecoration: fontStyle === FONT_STYLES.UNDERLINE ? 'underline' : ''
	};
};
