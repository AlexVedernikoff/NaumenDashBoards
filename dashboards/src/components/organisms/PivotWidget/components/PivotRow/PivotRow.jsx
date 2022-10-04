// @flow
import cn from 'classnames';
import {getCellStyle, getParameterStyle, getValueForColumn} from './helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {PivotColumn, PivotDataRow} from 'utils/recharts/types';
import {PIVOT_COLUMN_TYPE} from 'utils/recharts/constants';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import {TEXT_HANDLERS} from 'store/widgets/data/constants';

export class PivotRow extends PureComponent<Props, State> {
	state = {
		showChildren: true
	};

	handleClickCell = (column: PivotColumn) => () => {
		const {drillDown, filter} = this.props;

		if (column.type === PIVOT_COLUMN_TYPE.VALUE) {
			if (column.isBreakdown) {
				const keySplitIndex = column.key.indexOf('$');
				const indicator = column.key.slice(0, keySplitIndex);
				const breakdown = column.key.slice(keySplitIndex + 1);

				drillDown(indicator, filter, breakdown);
			} else {
				drillDown(column.key, filter);
			}
		}
	};

	handleToggleShowChild = e => {
		this.setState(({showChildren}) => ({showChildren: !showChildren}));
		e.stopPropagation();
	};

	renderCell = (column: PivotColumn, index: number) => {
		const {columnsWidth, formatters, level, row: {data, isTotal}, style} = this.props;
		const isTotalColumn = column.type === PIVOT_COLUMN_TYPE.TOTAL_SUM;
		const className = cn(styles.valueCell, {
			[styles.valueCellLast]: column.isLastColumnGroup,
			[styles.totalColumn]: isTotalColumn
		});
		const formatter = isTotal ? formatters.total : formatters.value;
		const formatValue = getValueForColumn(column, data, formatter);
		const cellStyle = getCellStyle(columnsWidth[index + 1], level, style, isTotal);

		return (
			<div className={className} key={column.key} onClick={this.handleClickCell(column)} style={cellStyle}>
				{formatValue}
			</div>
		);
	};

	renderCells = () => {
		const {columns} = this.props;
		const valuesCells = columns.filter(({type}) => type !== PIVOT_COLUMN_TYPE.PARAMETER);

		return valuesCells.map(this.renderCell);
	};

	renderIndex = () => {
		const {index, row, style} = this.props;

		if (style.showRowNum && !row.isTotal) {
			return (<span className={styles.index}>{index}</span>);
		}

		return null;
	};

	renderParameter = () => {
		const {columnsWidth, formatters, level, row, style} = this.props;
		const parameterStyle = getParameterStyle(columnsWidth[0], level, style, row.isTotal);
		const value = formatters.parameter(row.value);
		const className = cn(styles.cell, styles.parameter, {
			[styles.cellNoWrap]: style.textHandler === TEXT_HANDLERS.CROP
		});

		return (
			<div className={className} style={parameterStyle} title={value}>
				{this.renderToggler()}
				{this.renderIndex()}
				{value}
			</div>
		);
	};

	renderSubRow = (subRow: PivotDataRow, idx: number) => {
		const {columns, columnsWidth, drillDown, filter, formatters, index, level, style} = this.props;
		const subFilter = [...filter, {key: subRow.key, value: subRow.value}];
		const subIndex = `${index}${idx + 1}.`;
		const key = `${subRow.key}::${subRow.value}`;

		return (
			<PivotRow
				columns={columns}
				columnsWidth={columnsWidth}
				drillDown={drillDown}
				filter={subFilter}
				formatters={formatters}
				index={subIndex}
				key={key}
				level={level + 1}
				row={subRow}
				style={style}
			/>
		);
	};

	renderSubRows = () => {
		const {row} = this.props;
		const {showChildren} = this.state;

		if (showChildren && row.children && row.children.length > 0) {
			return row.children.map(this.renderSubRow);
		}

		return null;
	};

	renderToggler = () => {
		const {row} = this.props;

		if (row.children && row.children.length > 0) {
			const {showChildren} = this.state;
			const title = showChildren ? 'PivotWidget::HideChildren' : 'PivotWidget::ShowChildren';
			const className = cn(styles.toggler, {[styles.togglerClosed]: !showChildren});

			return (
				<Icon
					className={className}
					name={ICON_NAMES.ARROW_BOTTOM}
					onClick={this.handleToggleShowChild}
					title={t(title)}
				/>
			);
		}
	};

	render () {
		const {level, row} = this.props;
		const className = cn(styles.row, {
			[styles.topRow]: level === 0,
			[styles.totalRow]: row.isTotal
		});

		return (
			<>
				<div className={className}>
					{this.renderParameter()}
					{this.renderCells()}
				</div>
				{this.renderSubRows()}
			</>
		);
	}
}

export default PivotRow;
