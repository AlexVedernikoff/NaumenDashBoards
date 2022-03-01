// @flow
import cn from 'classnames';
import type {DefaultProps, Props, State} from './types';
import {DEFAULT_TABLE_VALUE, FONT_STYLES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

export class Cell extends PureComponent<Props, State> {
	static defaultProps: DefaultProps = {
		children: null,
		className: '',
		defaultValue: DEFAULT_TABLE_VALUE.EMPTY_ROW,
		fontColor: '',
		left: null,
		row: null,
		rowAggregations: null,
		rowIndex: 0,
		textAlign: TEXT_ALIGNS.left,
		textHandler: TEXT_HANDLERS.CROP,
		tip: '',
		value: '',
		width: '100%'
	};

	state = {
		position: null
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

	handleClearTooltip = () => this.setState({position: null});

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

	handleTooltipShow = ({clientX: x, clientY: y}: MouseEvent) => {
		this.setState({position: {x, y}});
	};

	renderValue = () => {
		const {column, components, fontColor, tooltip, value} = this.props;
		const {position} = this.state;
		const {Value} = components;
		const renderValue = value || this.getDefaultValue();

		if (tooltip?.show) {
			return (
				<Fragment>
					<div
						onMouseEnter={this.handleTooltipShow}
						onMouseLeave={this.handleClearTooltip}
					>
						<Value column={column} fontColor={fontColor} value={renderValue} />
						<WidgetTooltip position={position} tooltip={tooltip} />
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
