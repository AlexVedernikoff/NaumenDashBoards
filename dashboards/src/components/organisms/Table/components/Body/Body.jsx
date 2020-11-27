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
		const {data, page, pageSize, sorting, width} = this.props;
		const {accessor, type} = sorting;
		const start = pageSize * (page - 1);
		let rows = data;
		let height;

		if (accessor !== null) {
			rows = this.sort(data, accessor, type === SORTING_TYPES.ASC);
		}

		rows = rows.slice(start, start + pageSize);
		height = rows.length * ROW_HEIGHT;

		return (
			<div className={styles.container} style={{height, width}}>
				{rows.map(this.renderRow)}
			</div>
		);
	}
}

export default Body;
