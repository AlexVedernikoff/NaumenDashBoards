// @flow
import cn from 'classnames';
import type {DefaultProps, Props} from './types';
import {DEFAULT_TABLE_VALUE, FONT_STYLES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Cell extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		children: null,
		className: '',
		defaultValue: DEFAULT_TABLE_VALUE.EMPTY_ROW,
		fontColor: '',
		left: null,
		row: null,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP,
		tip: '',
		value: '',
		width: '100%'
	};

	getDefaultValue = () => {
		const {defaultValue} = this.props;
		const {DASH, NULL, ZERO} = DEFAULT_TABLE_VALUE;

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

	handleClick = (e: MouseEvent) => {
		const {column, onClick, row, value} = this.props;

		if (onClick) {
			const props = {
				column,
				row,
				value
			};

			onClick(e, props);
		}
	};

	renderValue = () => {
		const {components, fontColor, value} = this.props;
		const {Value} = components;
		const renderValue = value || this.getDefaultValue();

		return <Value fontColor={fontColor} value={renderValue} />;
	};

	render () {
		const {children, className, fontColor, fontStyle, last, left, textAlign, textHandler, tip, width} = this.props;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const {CROP, WRAP} = TEXT_HANDLERS;
		const fixed = !isNaN(parseFloat(left));
		const cellCN = cn({
			[styles.cell]: true,
			[styles.fixedCell]: fixed,
			[styles.lastCell]: last,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE,
			[settingsStyles.crop]: textHandler === CROP,
			[settingsStyles.wrap]: textHandler === WRAP,
			[className]: true
		});
		const style = {
			color: fontColor,
			left,
			textAlign,
			width
		};

		return (
			<div className={cellCN} onClick={this.handleClick} style={style} title={tip}>
				{this.renderValue()}
				{children}
			</div>
		);
	}
}

export default Cell;
