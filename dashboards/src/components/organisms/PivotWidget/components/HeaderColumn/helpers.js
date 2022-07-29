// @flow
import {FONT_STYLES} from 'store/widgets/data/constants';
import type {HeaderColumnStyle, TitleColumnStyle} from './types';
import type {PivotHeaderSettings} from 'src/store/widgets/data/types';

export const getHeaderColumnStyle = (columnWidth: number, style: PivotHeaderSettings): HeaderColumnStyle => ({
	width: `${columnWidth}px`
});

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
