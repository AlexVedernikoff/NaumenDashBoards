// @flow
import type {Column, Row as RowType} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {ROW_HEIGHT} from 'Table/constants';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class Body extends PureComponent<Props> {
	getSortValue = (value: string | number): number => typeof value === 'string' ? Number(value) : value;

	sort = (data: Array<RowType>, accessor: string, asc: boolean): Array<RowType> => data.sort((row1, row2) => {
		// TODO убрать, когда начнут приходить данные числами
		const leftValue = this.getSortValue(row1[accessor]);
		const rightValue = this.getSortValue(row2[accessor]);

		// $FlowFixMe
		if (leftValue > rightValue) {
			return asc ? 1 : -1;
		}
		// $FlowFixMe
		if (leftValue < rightValue) {
			return asc ? -1 : 1;
		}

		return 0;
	});

	renderCell = (row: RowType, rowIndex: number) => (column: Column, columnIndex: number) => {
		const {components, onClickCell, settings} = this.props;
		const {defaultValue, textAlign, textHandler} = settings.body;
		const width = this.props.columnsWidth[columnIndex];
		const {BodyCell} = components;
		const {accessor} = column;

		return (
			<BodyCell
				column={column}
				defaultValue={defaultValue.value}
				key={accessor}
				onClick={onClickCell}
				row={row}
				rowIndex={rowIndex}
				textAlign={textAlign}
				textHandler={textHandler}
				value={row[accessor]}
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
		const {columns, data, page, pageSize, sorting, width} = this.props;
		const {column, type} = sorting;
		const start = pageSize * (page - 1);
		let rows = data;
		let height;

		if (column !== null && columns[column]) {
			rows = this.sort(data, columns[column].accessor, type === SORTING_TYPES.ASC);
		}

		rows = rows.slice(start, start + pageSize);
		height = rows.length * ROW_HEIGHT;

		return (
			<tbody className={styles.container} style={{height, minWidth: width}}>
				{rows.map(this.renderRow)}
			</tbody>
		);
	}
}

export default Body;
