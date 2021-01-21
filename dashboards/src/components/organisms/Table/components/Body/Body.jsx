// @flow
import type {Column, Row as RowType} from 'Table/types';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';

export class Body extends PureComponent<Props> {
	bodyRef: Ref<'div'> = createRef();

	componentDidMount () {
		const {onChangeScrollBarWidth} = this.props;
		const {current: body} = this.bodyRef;

		if (body) {
			const {clientWidth, offsetWidth} = body;
			const scrollBarWidth = offsetWidth - clientWidth;

			onChangeScrollBarWidth(scrollBarWidth);
		}
	}

	sort = (data: Array<RowType>, accessor: string, asc: boolean): Array<RowType> => data.sort((row1, row2) => {
		const leftValue = String(asc ? row1[accessor] : row2[accessor]);
		const rightValue = String(asc ? row2[accessor] : row1[accessor]);

		return leftValue.localeCompare(rightValue, undefined, {
			numeric: true,
			sensitivity: 'base'
		});
	});

	renderCell = (row: RowType, rowIndex: number) => (column: Column, columnIndex: number, columns: Array<Column>) => {
		const {columnsWidth, components, fixedPositions, onClickCell, settings} = this.props;
		const {defaultValue, textAlign, textHandler} = settings.body;
		const {accessor} = column;
		const {BodyCell} = components;
		const width = columnsWidth[accessor];
		const last = columnIndex === columns.length - 1;
		const left = fixedPositions[accessor];
		const key = `${accessor}-${rowIndex}`;
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
				key={key}
				last={last}
				left={left}
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
		const {columns, components, width} = this.props;
		const {Row} = components;

		return <Row width={width}>{columns.map(this.renderCell(row, index))}</Row>;
	};

	render () {
		const {data, onScroll, page, pageSize, sorting} = this.props;
		const {accessor, type} = sorting;
		const start = pageSize * (page - 1);
		let rows = data;

		if (accessor !== null) {
			rows = this.sort(data, accessor, type === SORTING_TYPES.ASC);
		}

		rows = rows.slice(start, start + pageSize);

		return (
			<div className={styles.body} onScroll={onScroll} ref={this.bodyRef}>
				{rows.map(this.renderRow)}
			</div>
		);
	}
}

export default Body;
