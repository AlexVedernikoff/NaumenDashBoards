// @flow
import cn from 'classnames';
import type {DefaultProps, Props} from './types';
import {DEFAULT_TABLE_VALUE, FONT_STYLES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Cell extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		className: '',
		defaultValue: DEFAULT_TABLE_VALUE.EMPTY_ROW,
		fontColor: '',
		row: null,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP,
		tip: '',
		value: '',
		width: null
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
		const {components, value} = this.props;
		const {Value} = components;

		return value && Number(value) !== 0 ? <Value value={value} /> : this.renderDefaultValue();
	};

	render () {
		const {className, fontColor, fontStyle, textAlign, textHandler, tip, width} = this.props;
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
			<div className={cellCN} onClick={this.handleClick} style={{color: fontColor, textAlign, width}} title={tip} >
				{this.renderValue()}
			</div>
		);
	}
}

export default Cell;
