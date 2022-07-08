// @flow
import cn from 'classnames';
import type {DefaultProps, Props} from './types';
import {DEFAULT_TABLE_VALUE, FONT_STYLES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

export class Cell extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		children: null,
		className: '',
		defaultValue: DEFAULT_TABLE_VALUE.EMPTY_ROW,
		fontColor: '',
		left: null,
		row: null,
		rowIndex: 0,
		rowsInfo: null,
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
		const {column, onClick, row, rowIndex, value} = this.props;

		if (onClick) {
			const props = {
				column,
				row,
				rowIndex,
				value
			};

			onClick(e, props);
		}
	};

	renderValue = () => {
		const {column, components, fontColor, tooltip, value} = this.props;
		const {Value} = components;
		const renderValue = value || this.getDefaultValue();

		if (tooltip?.show) {
			return (
				<Fragment>
					<div>
						<Value column={column} fontColor={fontColor} value={renderValue} />
						<WidgetTooltip tooltip={tooltip} />
					</div>
				</Fragment>
			);
		}

		return (
			<Value column={column} fontColor={fontColor} value={renderValue} />
		);
	};

	render () {
		const {children, className, fontColor, fontStyle, last, left, textAlign, textHandler, tip, tooltip, width} = this.props;
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
		const title = tooltip && tooltip.show ? null : tip;

		return (
			<div className={cellCN} onClick={this.handleClick} style={style} title={title}>
				{this.renderValue()}
				{children}
			</div>
		);
	}
}

export default Cell;
