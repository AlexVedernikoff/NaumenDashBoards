// @flow
import cn from 'classnames';
import {getHeaderColumnStyle, getTitleStyle} from './helpers';
import {PIVOT_COLUMN_MIN_WIDTH, PIVOT_COLUMN_TYPE} from 'utils/recharts/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';

export class HeaderColumn extends PureComponent<Props, State> {
	dragStart = false;
	resizerOffset: number;
	cursorStart: number;

	state = {
		columnWidth: 0,
		columnWidths: []
	};

	static getDerivedStateFromProps (props: Props) {
		const {column, columnsWidth, offset} = props;
		const columnWidths = columnsWidth.slice(offset, offset + column.width);
		const columnWidth = columnWidths.reduce((sum, e) => sum + e, 0);

		return {columnWidth, columnWidths};
	}

	componentDidMount () {
		document.addEventListener('mousemove', this.mouseMove);
		document.addEventListener('mouseup', this.mouseUp);
	}

	componentWillUnmount () {
		document.removeEventListener('mousemove', this.mouseMove);
		document.removeEventListener('mouseup', this.mouseUp);
	}

	handleChangeSubWidth = (changeOffset: number, newWidth: number) => {
		const {offset, onChangeWidth} = this.props;

		onChangeWidth(offset + changeOffset, newWidth);
	};

	handleChangeWidth = (changeOffset: number, newWidth: number) => {
		const {columnsWidth, offset, onChangeWidth} = this.props;
		let changeWidth = newWidth;

		if (changeOffset !== offset) {
			const headWidths = columnsWidth.slice(offset, changeOffset);
			const sumHeadWidths = headWidths.reduce((sum, e) => sum + e, 0);

			changeWidth -= sumHeadWidths;
		}

		onChangeWidth(changeOffset, changeWidth);
	};

	mouseDown = (event: MouseEvent) => {
		const {columnWidth} = this.state;

		this.cursorStart = event.pageX;
		this.resizerOffset = columnWidth;
		this.dragStart = true;

		event.stopPropagation();
	};

	mouseMove = (event: MouseEvent) => {
		if (this.dragStart) {
			const {column, offset} = this.props;
			const newWidth = Math.floor(Math.max(this.resizerOffset + event.pageX - this.cursorStart, PIVOT_COLUMN_MIN_WIDTH));

			this.handleChangeWidth(offset + column.width - 1, newWidth);
		}
	};

	mouseUp = () => {
		// Хак. Отключаем вызов handleMouseDownCell сразу после mouseUp
		setTimeout(() => {
			this.dragStart = false;
		}, 0);
	};

	renderDivider = () => (<div className={styles.divider} onMouseDown={this.mouseDown}></div>);

	renderSubColumn = () => {
		const {column, formatter, style} = this.props;
		const {columnWidths} = this.state;

		if (column.type === PIVOT_COLUMN_TYPE.GROUP && column.children && column.children.length > 0) {
			const subColumns = [];
			let offset = 0;

			column.children.forEach(subColumn => {
				subColumns.push(
					<HeaderColumn
						column={subColumn}
						columnsWidth={columnWidths}
						formatter={formatter}
						key={subColumn.key}
						offset={offset}
						onChangeWidth={this.handleChangeSubWidth}
						style={style}
					/>
				);
				offset += subColumn.width;
			});

			return (
				<div className={styles.subColumns}>
					{subColumns}
				</div>
			);
		}

		return null;
	};

	renderTitle = () => {
		const {column, formatter, style} = this.props;
		const title = column.type === PIVOT_COLUMN_TYPE.SUM ? t('PivotWidget::Sum') : formatter(column.title);
		const titleStyle = getTitleStyle(column.height, style);

		return (
			<div className={styles.title} style={titleStyle}>
				<div className={styles.titleWrap} title={title}>
					{title}
				</div>
			</div>
		);
	};

	render () {
		const {column, style} = this.props;
		const {columnWidth} = this.state;
		const className = cn(styles.column, {[styles.parameter]: column.type === PIVOT_COLUMN_TYPE.PARAMETER});
		const columnStyle = getHeaderColumnStyle(columnWidth, style);

		return (
			<div className={className} style={columnStyle}>
				{this.renderTitle()}
				{this.renderSubColumn()}
				{this.renderDivider()}
			</div>
		);
	}
}

export default HeaderColumn;
