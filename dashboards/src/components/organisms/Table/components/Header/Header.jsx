// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';
import {sumColumnsWidth} from 'Table/helpers';

export class Header extends PureComponent<Props> {
	handleClick = (column: Column) => {
		const {onChangeSorting, sorting} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		const {accessor, columns} = column;

		if (!columns) {
			let type = ASC;

			if (sorting.accessor === accessor && sorting.type === ASC) {
				type = DESC;
			}

			onChangeSorting && onChangeSorting({accessor, type});
		}
	};

	renderColumn = (column: Column, index: number, columns: Array<Column>) => {
		const {columns: subColumns} = column;

		return Array.isArray(subColumns)
			? this.renderColumnWithSubColumns(column, index, subColumns)
			: this.renderHeaderCell(column, index, columns);
	};

	renderColumnWidthSubColumns = (column: Column, index: number, columns: Array<Column>) => {
		const {columnsWidth} = this.props;
		const {accessor, columns: subColumns} = column;
		const width = Array.isArray(subColumns) ? sumColumnsWidth(columnsWidth, subColumns) : columnsWidth[accessor];

		return (
			<div className={styles.cellContainer} style={{minWidth: width}}>
				{this.renderHeaderCell(column, index, columns)}
				{this.renderSubColumns(columns)}
			</div>
		);
	};

	renderHeaderCell = (column: Column, index: number, columns: Array<Column>, isSubColumn: boolean = false) => {
		const {columnSettings, columnsWidth, components, fixedColumnsCount, fixedLeft, onChangeColumnWidth, sorting} = this.props;
		const {HeaderCell} = components;
		const {fontColor, fontStyle, textAlign, textHandler} = columnSettings;
		const {accessor, columns: subColumns, header} = column;
		const width = Array.isArray(subColumns) ? sumColumnsWidth(columnsWidth, subColumns) : columnsWidth[accessor];
		const last = index === columns.length - 1;
		const left = fixedColumnsCount - index > 0 && !isSubColumn ? fixedLeft : 0;
		let sortingType;

		if (sorting.accessor === accessor) {
			sortingType = sorting.type;
		}

		return (
			<HeaderCell
				column={column}
				columnIndex={index}
				components={components}
				fontColor={fontColor}
				fontStyle={fontStyle}
				key={accessor}
				last={last}
				left={left}
				onChangeWidth={onChangeColumnWidth}
				onClick={this.handleClick}
				sorting={sortingType}
				textAlign={textAlign}
				textHandler={textHandler}
				value={header}
				width={width}
			/>
		);
	};

	renderSubColumns = (columns?: Array<Column>): React$Node => {
		if (Array.isArray(columns) && columns.length > 0) {
			return (
				<div className={styles.subColumnsContainer}>
					{columns.map((column, index, columns) => this.renderHeaderCell(column, index, columns, true))}
				</div>
			);
		}

		return null;
	};

	render () {
		const {columns, width} = this.props;

		return (
			<div className={styles.header} style={{maxWidth: width}}>
				{columns.map(this.renderColumn)}
			</div>
		);
	}
}

export default Header;
