// @flow
import cn from 'classnames';
import {DEFAULT_COLUMN_WIDTH} from './constants';
import {DEFAULT_TABLE_VALUE, FONT_STYLES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Cell extends PureComponent<Props> {
	static defaultProps = {
		body: true,
		children: null,
		className: '',
		defaultValue: DEFAULT_TABLE_VALUE.EMPTY_ROW,
		fontColor: '',
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP,
		value: '',
		width: DEFAULT_COLUMN_WIDTH
	};

	renderValue = () => {
		const {defaultValue, value} = this.props;
		const {DASH, NULL, ZERO} = DEFAULT_TABLE_VALUE;

		if (value) {
			return value;
		}

		switch (defaultValue) {
			case DASH:
				return '-';
			case NULL:
				return 'null';
			case ZERO:
				return '0';
			default:
				return '\u00A0';
		}
	};

	render () {
		const {body, children, className, fontColor, fontStyle, onClick, textAlign, textHandler, width} = this.props;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const {CROP, WRAP} = TEXT_HANDLERS;
		const cellCN = cn({
			[styles.cell]: true,
			[styles.bodyCell]: body,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE,
			[settingsStyles.crop]: textHandler === CROP,
			[settingsStyles.wrap]: textHandler === WRAP,
			[className]: true
		});

		return (
			<td className={cellCN} onClick={onClick} style={{color: fontColor, textAlign}} width={width}>
				{this.renderValue()}
				{children}
			</td>
		);
	}
}

export default Cell;
