// @flow
import cn from 'classnames';
import {DEFAULT_COLUMN_WIDTH} from './constants';
import type {DefaultProps, Props, ValueProps} from './types';
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
		row: null,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP,
		tip: '',
		value: '',
		width: DEFAULT_COLUMN_WIDTH
	};

	components = {
		Value: this.ValueComponent
	};

	ValueComponent (props: ValueProps) {
		return props.value;
	}

	getComponents = () => this.props.components || this.components;

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

	renderDefaultValue = () => {
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

	renderValue = () => {
		const {value} = this.props;
		const {Value} = this.getComponents();

		return value ? <Value value={value} /> : this.renderDefaultValue();
	};

	render () {
		const {children, className, fontColor, fontStyle, textAlign, textHandler, tip, width} = this.props;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const {CROP, WRAP} = TEXT_HANDLERS;
		const cellCN = cn({
			[styles.cell]: true,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE,
			[settingsStyles.crop]: textHandler === CROP,
			[settingsStyles.wrap]: textHandler === WRAP,
			[className]: true
		});

		return (
			<td className={cellCN} onClick={this.handleClick} style={{color: fontColor, height: 32, textAlign}} title={tip} width={width}>
				{this.renderValue()}
				{children}
			</td>
		);
	}
}

export default Cell;
