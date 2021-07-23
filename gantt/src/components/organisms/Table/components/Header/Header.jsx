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
		const {accessor} = column;
		let type = ASC;

		if (sorting.accessor === accessor && sorting.type === ASC) {
			type = DESC;
		}

		onChangeSorting && onChangeSorting({accessor, type});
	};

	isLast = (columns: Array<Column>, index: number) => index === columns.length - 1;

	renderColumn = (column: Column, index: number, columns: Array<Column>) => {
		const {columns: subColumns} = column;
		const last = this.isLast(columns, index);

		return Array.isArray(subColumns)
			? this.renderColumnWithSubColumns(column, index, subColumns, last)
			: this.renderHeaderCell(column, index, columns, last);
	};

	renderColumnWithSubColumns = (column: Column, index: number, columns: Array<Column>, isLast: boolean) => {
		const {columnsWidth, fixedPositions} = this.props;
		const {accessor, columns: subColumns} = column;
		const width = Array.isArray(subColumns) ? sumColumnsWidth(columnsWidth, subColumns) : columnsWidth[accessor];
		const left = fixedPositions[accessor];

		return (
			<div className={styles.cellContainer} key={accessor} style={{left, minWidth: width}}>
				{this.renderHeaderCell(column, index, columns, isLast)}
				{this.renderSubColumns(columns, isLast)}
			</div>
		);
	};

	renderHeaderCell = (column: Column, index: number, columns: Array<Column>, isLast: boolean, isSubColumn: boolean = false) => {
		const {columnSettings, columnsWidth, components, fixedPositions, onChangeColumnWidth, scrollBarWidth, sorting} = this.props;
		const {HeaderCell} = components;
		const {fontColor, fontStyle, textAlign, textHandler} = columnSettings;
		const {accessor, columns: subColumns, header} = column;
		const left = fixedPositions[accessor];
		let width = Array.isArray(subColumns) ? sumColumnsWidth(columnsWidth, subColumns) : columnsWidth[accessor];
		let sortingType;
		let onClick;

		if (sorting.accessor === accessor) {
			sortingType = sorting.type;
		}

		if (isLast) {
			width += scrollBarWidth;
		}

		if (!isSubColumn && !Array.isArray(subColumns)) {
			onClick = this.handleClick;
		}

		return (
			<HeaderCell
				column={column}
				columnIndex={index}
				components={components}
				fontColor={fontColor}
				fontStyle={fontStyle}
				key={accessor}
				last={isLast}
				left={left}
				onChangeWidth={onChangeColumnWidth}
				onClick={onClick}
				sorting={sortingType}
				textAlign={textAlign}
				textHandler={textHandler}
				value={header}
				width={width}
			/>
		);
	};

	renderSubColumns = (columns?: Array<Column>, lastColumn: boolean): React$Node => {
		if (Array.isArray(columns) && columns.length > 0) {
			return (
				<div className={styles.subColumnsContainer}>
					{columns.map((column, index, columns) => {
						const last = lastColumn && this.isLast(columns, index);

						return this.renderHeaderCell(column, index, columns, last);
					})}
				</div>
			);
		}

		return null;
	};

	render () {
		const {columns, forwardedRef} = this.props;

		return (
			<div className={styles.headerContainer} ref={forwardedRef}>
				<div className={styles.header}>
					{columns.map(this.renderColumn)}
				</div>
			</div>
		);
	}
}

export default Header;
