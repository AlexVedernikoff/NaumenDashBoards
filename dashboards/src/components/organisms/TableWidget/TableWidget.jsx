// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {Column, Props, State} from './types';
import {COLUMN_TYPES, ID_ACCESSOR} from './constants';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {debounce} from 'src/helpers';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import type {OnClickCellProps, ValueProps} from 'components/organisms/Table/types';
import {parseMSInterval} from 'store/widgets/helpers';
import React, {PureComponent} from 'react';
import {Table} from 'components/organisms';
import type {TableSorting} from 'store/widgets/data/types';

export class TableWidget extends PureComponent<Props, State> {
	state = {
		columns: []
	};

	static getDerivedStateFromProps (props: Props) {
		const {data, widget} = props;
		let {columns} = data;

		if (!widget.table.body.showRowNum) {
			columns = columns.filter(c => c.accessor !== ID_ACCESSOR);
		}

		return {
			columns
		};
	}

	findRow = (id: number, accessor: string) => {
		const {data} = this.props.data;
		const row = data.find(row => row[ID_ACCESSOR] === id && accessor in row);

		return row || id === 1 ? row : this.findRow(id - 1, accessor);
	};

	handleChangeColumnWidth = (columnsRatioWidth: Array<number>) => {
		const {onUpdate, widget} = this.props;
		onUpdate({...widget, columnsRatioWidth});
	};

	handleChangeSorting = (sorting: TableSorting) => {
		const {onUpdate, widget} = this.props;
		onUpdate({...widget, sorting});
	};

	handleClickDataCell = (e: MouseEvent, props: OnClickCellProps) => {
		const {data: tableData, onDrillDown, widget} = this.props;
		const {columns} = this.state;
		const {columnIndex, rowIndex} = props;
		const {data} = tableData;

		if (columns[columnIndex].type === COLUMN_TYPES.INDICATOR) {
			const mixin = createDrillDownMixin(widget);
			const currentRow = data[rowIndex];
			let currentGroupIndex = columns
				.findIndex(column => {
					return this.isGroupColumn(column) && column.accessor in currentRow;
				});
			let currentId = currentRow[ID_ACCESSOR];

			while (currentGroupIndex > -1 && this.isGroupColumn(columns[currentGroupIndex])) {
				const {accessor, attribute, group} = columns[currentGroupIndex];
				const row = this.findRow(currentId, accessor);

				if (row) {
					const {[accessor]: value} = row;
					mixin.title = `${mixin.title}. ${value}`;

					mixin.filters.push({
						attribute,
						group,
						value
					});
				}

				currentGroupIndex--;
			}

			onDrillDown(widget, 0, mixin);
		}
	};

	isGroupColumn = (column: Column) => {
		const {BREAKDOWN, PARAMETER} = COLUMN_TYPES;
		const {type} = column;

		return type === PARAMETER || type === BREAKDOWN;
	};

	renderValue = (props: ValueProps) => {
		const {columns} = this.state;
		const {columnIndex, value} = props;
		const {aggregation, attribute, type} = columns[columnIndex];

		if (type === COLUMN_TYPES.INDICATOR) {
			if (attribute.type === ATTRIBUTE_TYPES.dtInterval) {
				return parseMSInterval(Number(value));
			}

			if (aggregation === DEFAULT_AGGREGATION.PERCENT) {
				return `${value}%`;
			}
		}

		return value;
	};

	render (): React$Node {
		const {data: tableData, widget} = this.props;
		const {columns} = this.state;
		const {columnsRatioWidth, sorting, table} = widget;
		const components = {
			Value: this.renderValue
		};

		return (
			<Table
				columns={columns}
				columnsRatioWidth={columnsRatioWidth}
				components={components}
				data={tableData.data}
				onChangeColumnWidth={debounce(this.handleChangeColumnWidth, 1000)}
				onChangeSorting={this.handleChangeSorting}
				onClickDataCell={this.handleClickDataCell}
				settings={table}
				sorting={sorting}
			/>
		);
	}
}

export default TableWidget;
