// @flow
import {Cell, Row} from 'Table/components';
import type {Column, Row as RowType} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {ROW_HEADER_ACCESSOR, ROW_NUM_ACCESSOR} from 'Table/constants';
import {SORTING_TYPES, TEXT_ALIGNS} from 'store/widgets/data/constants';

export class Body extends PureComponent<Props> {
	getSortValue = (value: string = '') => Number(value) || value;

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

	renderCell = (row: RowType, rowIndex: number) => (column: Column, index: number) => {
		const width = this.props.columnsWidth[index];
		const {accessor} = column;
		const value = row[accessor];

		switch (accessor) {
			case ROW_HEADER_ACCESSOR:
				return this.renderHeaderCell(value, width, accessor);
			case ROW_NUM_ACCESSOR:
				return this.renderRowNumCell(rowIndex, width, accessor);
			default:
				return this.renderDataCell(value, width, accessor);
		}
	};

	renderDataCell = (value: string, width: number, key: string) => {
		const {body} = this.props.settings;
		const {defaultValue, textAlign, textHandler} = body;

		return (
			<Cell
				defaultValue={defaultValue.value}
				key={key}
				textAlign={textAlign}
				textHandler={textHandler}
				value={value}
				width={width}
			/>
		);
	};

	renderHeaderCell = (value: string, width: number, key: string) => {
		const {fontColor, fontStyle} = this.props.settings.rowHeader;

		return (
			<Cell
				fontColor={fontColor}
				fontStyle={fontStyle}
				key={key}
				value={value}
				width={width}
			/>
		);
	};

	renderRow = (row: RowType, index: number) => {
		const {columns} = this.props;
		return <Row>{columns.map(this.renderCell(row, index))}</Row>;
	};

	renderRowNumCell = (num: number, width: number, key: string) => {
		const {page, pageSize} = this.props;
		const value = `${pageSize * (page - 1) + num + 1}.`;

		return (
			<Cell
				key={key}
				textAlign={TEXT_ALIGNS.center}
				value={value}
				width={width}
			/>
		);
	};

	render () {
		const {columns, data, page, pageSize, sorting, width} = this.props;
		const start = pageSize * (page - 1);
		let rows = data;

		if (sorting.column) {
			const {column, type} = sorting;
			const accessor = columns[column].accessor;
			rows = this.sort(data, accessor, type === SORTING_TYPES.ASC);
		}

		return (
			<tbody style={{minWidth: width}}>
				{rows.slice(start, start + pageSize).map(this.renderRow)}
			</tbody>
		);
	}
}

export default Body;
