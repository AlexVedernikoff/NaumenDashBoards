// @flow
import cn from 'classnames';
import {DEFAULT_COLUMN_WIDTH} from './constants';
import type {DefaultProps, Props} from './types';
import {DEFAULT_TABLE_VALUE, FONT_STYLES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Cell extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		body: true,
		children: null,
		className: '',
		defaultValue: DEFAULT_TABLE_VALUE.EMPTY_ROW,
		fontColor: '',
		rowIndex: 0,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP,
		value: '',
		width: DEFAULT_COLUMN_WIDTH
	};

	handleClick = (e: MouseEvent) => {
		const {columnIndex, onClick, rowIndex, value} = this.props;

		if (onClick) {
			const props = {
				columnIndex,
				rowIndex,
				value
			};

			onClick(e, props);
		}
	};

	renderValue = () => {
		const {columnIndex, components, defaultValue, value} = this.props;
		const {DASH, NULL, ZERO} = DEFAULT_TABLE_VALUE;
		const {Value} = components;
		let displayValue = value;

		if (displayValue) {
			return <Value columnIndex={columnIndex} value={displayValue} />;
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
		const {body, children, className, fontColor, fontStyle, textAlign, textHandler, width} = this.props;
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
			<td className={cellCN} onClick={this.handleClick} style={{color: fontColor, textAlign}} width={width}>
				{this.renderValue()}
				{children}
			</td>
		);
	}
}

export default Cell;
