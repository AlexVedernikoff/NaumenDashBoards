// @flow
import type {Column, Row as RowType} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class Body extends PureComponent<Props> {
	sort = (data: Array<RowType>, accessor: string, asc: boolean): Array<RowType> => data.sort((row1, row2) => {
		const leftValue = String(asc ? row1[accessor] : row2[accessor]);
		const rightValue = String(asc ? row2[accessor] : row1[accessor]);

		return leftValue.localeCompare(rightValue, undefined, {
			numeric: true,
			sensitivity: 'base'
		});
	});

	renderCell = (row: RowType, rowIndex: number) => (column: Column) => {
		const {columnsWidth, components, onClickCell, settings} = this.props;
		const {defaultValue, textAlign, textHandler} = settings.body;
		const {accessor} = column;
		const {BodyCell} = components;
		const width = columnsWidth[accessor];
		let value = row[accessor];

		if (Number(value) === 0) {
			value = '';
		}

		return (
			<BodyCell
				className={styles.cell}
				column={column}
				components={components}
				defaultValue={defaultValue.value}
				key={accessor}
				onClick={onClickCell}
				row={row}
				rowIndex={rowIndex}
				textAlign={textAlign}
				textHandler={textHandler}
				value={value}
				width={width}
			/>
		);
	};

	renderRow = (row: RowType, index: number) => {
		const {columns, components} = this.props;
		const {Row} = components;

		return <Row>{columns.map(this.renderCell(row, index))}</Row>;
	};

	render () {
		const {data, page, pageSize, sorting} = this.props;
		const {accessor, type} = sorting;
		const start = pageSize * (page - 1);
		let rows = data;

		if (accessor !== null) {
			rows = this.sort(data, accessor, type === SORTING_TYPES.ASC);
		}

		rows = rows.slice(start, start + pageSize);

		return (
			<div className={styles.container}>
				{rows.map(this.renderRow)}
			</div>
		);
	}
}

export default Body;
