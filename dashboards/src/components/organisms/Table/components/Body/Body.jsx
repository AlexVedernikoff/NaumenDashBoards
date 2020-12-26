// @flow
import type {Column, Row as RowType} from 'Table/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {ROW_HEIGHT} from 'Table/constants';
import {sort} from './helpers';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class Body extends PureComponent<Props, State> {
	state = {
		rows: []
	};

	static getDerivedStateFromProps (props: Props) {
		const {data, page, pageSize, sorting} = props;
		const {accessor, type} = sorting;
		const start = pageSize * (page - 1);
		let rows = data;

		if (accessor !== null) {
			rows = sort(data, accessor, type === SORTING_TYPES.ASC);
		}

		rows = (rows.slice(start, start + pageSize): Array<RowType>);

		return {
			rows
		};
	}

	renderCell = (column: Column, row: RowType, rowIndex: number) => {
		const {components, onClickCell, settings} = this.props;
		const {defaultValue, textAlign, textHandler} = settings.body;
		const {accessor} = column;
		const {BodyCell} = components;
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
				onClick={onClickCell}
				row={row}
				rowIndex={rowIndex}
				textAlign={textAlign}
				textHandler={textHandler}
				value={value}
			/>
		);
	};

	renderColumn = (column: Column) => {
		const {columnsWidth} = this.props;
		const {rows} = this.state;
		const {accessor} = column;
		const width = columnsWidth[accessor];

		return (
			<div key={accessor} style={{width}}>
				{rows.map((row, i) => this.renderCell(column, row, i))}
			</div>
		);
	};

	render () {
		const {columns, width} = this.props;
		const {rows} = this.state;

		let height;

		height = rows.length * ROW_HEIGHT;

		return (
			<div className={styles.container} style={{height, width}}>
				{columns.map(this.renderColumn)}
			</div>
		);
	}
}

export default Body;
