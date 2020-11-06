// @flow
import {Cell} from 'components/organisms/Table/components';
import type {CellConfigProps, OnClickCellProps} from 'components/organisms/Table/types';
import type {Column, Props, State} from './types';
import {COLUMN_TYPES, EMPTY_VALUE, ID_ACCESSOR} from './constants';
import type {ColumnsRatioWidth, TableSorting} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {debounce} from 'src/helpers';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Table} from 'components/organisms';
import type {ValueProps} from 'components/organisms/Table/components/Cell/types';

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

	handleChangeColumnWidth = (columnsRatioWidth: ColumnsRatioWidth) => {
		const {onUpdate, widget} = this.props;
		onUpdate({...widget, columnsRatioWidth});
	};

	handleChangeSorting = (sorting: TableSorting) => {
		const {onUpdate, widget} = this.props;
		onUpdate({...widget, sorting});
	};

	handleClickDataCell = (e: MouseEvent, props: OnClickCellProps) => {
		const {column, row} = props;
		const {attribute, type} = column;
		const {BREAKDOWN, INDICATOR} = COLUMN_TYPES;

		if ((type === INDICATOR || type === BREAKDOWN) && row) {
			const {onDrillDown, widget} = this.props;
			const {columns} = this.state;
			const mixin = createDrillDownMixin(widget);
			const dataColumns = columns.filter(this.isGroupColumn);

			if (type === BREAKDOWN) {
				dataColumns.push(column);
			}

			dataColumns.forEach(column => {
				const {accessor, group, header, type} = column;
				const {[accessor]: rowValue = EMPTY_VALUE} = row;
				const value = type === BREAKDOWN ? header : rowValue;
				mixin.title = `${mixin.title}. ${value}`;

				mixin.filters.push({
					attribute,
					group,
					value
				});
			});

			onDrillDown(widget, 0, mixin);
		}
	};

	isGroupColumn = (column: Column) => column.type === COLUMN_TYPES.PARAMETER;

	renderBodyCell = (props: CellConfigProps) => {
		const {BREAKDOWN, INDICATOR, PARAMETER} = COLUMN_TYPES;
		const {aggregation, type} = props.column;
		let Component = Cell;

		if ((type === INDICATOR || type === BREAKDOWN) && aggregation !== DEFAULT_AGGREGATION.NOT_APPLICABLE) {
			Component = this.renderIndicatorCell;
		}

		if (type === PARAMETER) {
			Component = this.renderParameterCell;
		}

		return <Component {...props} />;
	};

	renderIndicatorCell = (props: CellConfigProps) => {
		const {column, value} = props;
		const components = {
			Value: this.renderLink
		};
		let cellValue = value;

		if (hasMSInterval(column, FIELDS.attribute)) {
			cellValue = parseMSInterval(Number(value));
		} else if (value && hasPercent(column, FIELDS.attribute)) {
			cellValue = `${value}%`;
		}

		return <Cell {...props} components={components} value={cellValue} />;
	};

	renderLink = (props: ValueProps) => (
		<a href="javascript:void(0)" >
			{props.value}
		</a>
	);

	renderParameterCell = (props: CellConfigProps) => <Cell {...props} defaultValue={DEFAULT_TABLE_VALUE.EMPTY_ROW} />;

	render (): React$Node {
		const {data: tableData, widget} = this.props;
		const {columns} = this.state;
		const {columnsRatioWidth, sorting, table} = widget;
		const components = {
			BodyCell: this.renderBodyCell
		};

		return (
			<Table
				className={styles.table}
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
