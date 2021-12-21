// @flow
import Cell from 'Table/components/Cell';
import type {CellConfigProps, ColumnsWidth, OnClickCellProps, ValueProps} from 'components/organisms/Table/types';
import type {Column, ColumnType, ParameterColumn, Row} from 'store/widgets/buildData/types';
import {COLUMN_TYPES, IGNORE_TABLE_DATA_LIMITS_SETTINGS} from 'store/widgets/buildData/constants';
import type {ColumnsRatioWidth, TableSorting} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {debounce, deepClone} from 'helpers';
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import {getSeparatedLabel, hasIndicatorsWithAggregation, isCardObjectColumn, isIndicatorColumn} from 'store/widgets/buildData/helpers';
import {hasMSInterval, hasPercent, hasUUIDsInLabels, parseMSInterval} from 'store/widgets/helpers';
import HeaderCell from 'Table/components/HeaderCell';
import {ID_ACCESSOR} from './constants';
import {LIMIT_NAMES} from './components/ValueWithLimitWarning/constants';
import type {Props as HeaderCellProps} from 'components/organisms/Table/components/HeaderCell/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import {sumColumnsWidth} from 'components/organisms/Table/helpers';
import t from 'localization';
import Table from 'components/organisms/Table';
import ValueWithLimitWarning from './components/ValueWithLimitWarning';

export class TableWidget extends PureComponent<Props, State> {
	tableRef: Ref<typeof Table> = createRef();
	state = this.initState(this.props);

	initState (props: Props): State {
		const {data} = props;
		const {columns} = data;

		const fixedColumnsCount = columns.findIndex(column => column.type === COLUMN_TYPES.INDICATOR);
		const idColumn = columns.find(column => column.accessor === ID_ACCESSOR);

		if (idColumn) {
			idColumn.width = this.getMaxValueCellLength(data.data, ID_ACCESSOR);
		}

		return {
			fixedColumnsCount
		};
	}

	getMaxValueCellLength (data: Array<Row>, accessor: string): number {
		return data.reduce((maxLength, row) => {
			const currentLength = String(row[accessor]).length * 16;

			return currentLength > maxLength ? currentLength : maxLength;
		}, 0);
	}

	/**
	 * Переводит пользователя на список объектов по выбранному значению показателя
	 * @param {OnClickCellProps} props - данные выбранной ячейки показателя
	 * @returns {void}
	 */
	drillDown = (props: OnClickCellProps) => {
		const {data, onDrillDown, widget} = this.props;
		const {columns} = data;
		const {column, row} = props;
		const {BREAKDOWN} = COLUMN_TYPES;
		const mixin = createDrillDownMixin(widget);
		// $FlowFixMe
		const dataColumns: Array<ParameterColumn> = columns.filter(this.isGroupColumn);
		let {aggregation, attribute, type} = column;

		if (type === BREAKDOWN) {
			dataColumns.push(column);
			({aggregation, attribute} = column.indicator);
		}

		mixin.filters.push({aggregation, attribute});

		dataColumns.forEach(column => {
			const {accessor, attribute, group, header, type} = column;
			let rowValue = '';

			if (row) {
				({[accessor]: rowValue = t('TableWidget::EmptyValue')} = row);

				if (rowValue === '') {
					rowValue = t('TableWidget::EmptyValue');
				}
			}

			const value = type === BREAKDOWN ? header : rowValue;

			if (value) {
				const subTitle: string = getSeparatedLabel(value);

				mixin.title = `${mixin.title}. ${subTitle}`;
			}

			mixin.filters.push({
				attribute,
				group,
				value
			});
		});

		onDrillDown(widget, 0, mixin);
	};

	findRow = (id: number, accessor: string) => {
		const {data} = this.props.data;
		const row = data.find(row => row[ID_ACCESSOR] === id && accessor in row);

		return row || id === 1 ? row : this.findRow(id - 1, accessor);
	};

	getLastTypedColumn = (columns: $ReadOnlyArray<Column>, type: ColumnType): ?Column => columns.find((column, index, columns) => {
		const nextColumn = columns[index + 1];

		return column.type === type && (!nextColumn || nextColumn.type !== type);
	});

	getNewColumnsWidth = (column: Column, newWidth: number, columnsWidth: ColumnsWidth, minWidth: ?number = null): ColumnsWidth => {
		const {columns} = this.props.data;
		const {current: table} = this.tableRef;
		const {accessor} = column;
		const {BREAKDOWN, INDICATOR, PARAMETER} = COLUMN_TYPES;
		const ratio = columnsWidth[accessor] / newWidth;
		const isLastIndicator = this.isLastTypedColumn(columns, column, INDICATOR);
		let newColumnsWidth = columnsWidth;
		let isLastBreakdown = false;

		if (!isLastIndicator) {
			const lastIndicator = this.getLastTypedColumn(columns, INDICATOR);

			isLastBreakdown = lastIndicator && this.isLastTypedColumn(lastIndicator.columns, column, BREAKDOWN);
		}

		if (isLastIndicator || isLastBreakdown) {
			newColumnsWidth = this.getNewIndicatorsColumnsWidth(column, newColumnsWidth, ratio, minWidth);
		} else if (this.isLastTypedColumn(columns, column, PARAMETER)) {
			newColumnsWidth = this.getNewParametersColumnsWidth(column, newColumnsWidth, ratio, minWidth);
		} else if (table) {
			newColumnsWidth = table.getNewColumnsWidth(column, newWidth, columnsWidth, minWidth);
		}

		return newColumnsWidth;
	};

	getNewIndicatorsColumnsWidth = (column: Column, columnsWidth: ColumnsWidth, ratio: number, minWidth: ?number): ColumnsWidth => {
		const {columns} = this.props.data;
		const {BREAKDOWN, INDICATOR} = COLUMN_TYPES;
		const newColumnsWidth = deepClone(columnsWidth);

		columns.filter(column => column.type === INDICATOR).forEach(column => {
			let width = 0;

			if (Array.isArray(column.columns)) {
				column.columns.filter(column => column.type === BREAKDOWN).forEach(column => {
					const newWidth = newColumnsWidth[column.accessor] / ratio;

					newColumnsWidth[column.accessor] = newWidth;
					width += newWidth;
				});
			} else {
				width = newColumnsWidth[column.accessor] / ratio;
			}

			newColumnsWidth[column.accessor] = width;
		});

		return newColumnsWidth;
	};

	getNewParametersColumnsWidth = (column: Column, columnsWidth: ColumnsWidth, ratio: number, minWidth: ?number = null): ColumnsWidth => {
		const {columns} = this.props.data;
		const {INDICATOR, PARAMETER} = COLUMN_TYPES;
		const newColumnsWidth = deepClone(columnsWidth);

		columns.forEach(column => {
			if (column.type === PARAMETER) {
				newColumnsWidth[column.accessor] = columnsWidth[column.accessor] / ratio;
			}
		});
		const sumWidth = sumColumnsWidth(newColumnsWidth, columns);

		if (minWidth && minWidth > sumWidth) {
			const diff = minWidth - sumWidth;
			const extendColumns = columns.filter(({type}) => type === INDICATOR);

			if (extendColumns.length > 0) {
				const extendColumnsWidth = extendColumns.reduce((sum, {accessor}) => sum + newColumnsWidth[accessor], 0);
				const extendRatio = (extendColumnsWidth + diff) / extendColumnsWidth;

				extendColumns.forEach(({accessor, columns: subColumns}) => {
					let newWidth = newColumnsWidth[accessor];

					if (subColumns && subColumns.length > 0) {
						let sumSubColumnsWidth = 0;

						subColumns.forEach(({accessor: subColumn}) => {
							newColumnsWidth[subColumn] *= extendRatio;
							sumSubColumnsWidth += newColumnsWidth[subColumn];
						});

						newWidth = sumSubColumnsWidth;
					} else {
						newWidth = newWidth * extendRatio;
					}

					newColumnsWidth[accessor] = newWidth;
				});
			}

			const sumWidthAfter = sumColumnsWidth(newColumnsWidth, columns);

			if (sumWidthAfter < minWidth) {
				newColumnsWidth[column.accessor] += minWidth - sumWidthAfter;
			}
		}

		return newColumnsWidth;
	};

	handleChangeColumnWidth = (columnsRatioWidth: ColumnsRatioWidth) => {
		const {onUpdateWidget, widget} = this.props;

		onUpdateWidget({...widget, columnsRatioWidth});
	};

	handleChangeSorting = (sorting: TableSorting) => {
		const {onUpdateWidget, widget} = this.props;

		onUpdateWidget({...widget, sorting});
	};

	handleClickDataCell = (e: MouseEvent, props: OnClickCellProps) => {
		const {columns} = this.props.data;
		const {column} = props;

		if (isIndicatorColumn(column)) {
			if (!hasIndicatorsWithAggregation(columns) && isCardObjectColumn(column)) {
				this.openCardObject(props);
			} else {
				this.drillDown(props);
			}
		}
	};

	handleFetch = (pageSize: number, page: number) => {
		const {onUpdateData, widget} = this.props;

		onUpdateData(widget, page, true);
	};

	handleSubmitLimitWarningModal = (name: string) => {
		const {onUpdateData, onUpdateWidget, widget} = this.props;
		const {ignoreDataLimits = IGNORE_TABLE_DATA_LIMITS_SETTINGS} = widget;

		if (!ignoreDataLimits[name]) {
			const newWidget = {
				...widget,
				ignoreDataLimits: {
					...ignoreDataLimits,
					[name]: true
				}
			};

			onUpdateWidget(newWidget);
			onUpdateData(newWidget);
		}
	};

	isGroupColumn = (column: Column): boolean => column.type === COLUMN_TYPES.PARAMETER;

	isLastTypedColumn = (columns: $ReadOnlyArray<Column> = [], column: Column, type: ColumnType): boolean => {
		const {accessor} = column;
		const lastTypedColumn = this.getLastTypedColumn(columns, type);

		return column.type === type && !!lastTypedColumn && lastTypedColumn.accessor === accessor;
	};

	openCardObject = (props: OnClickCellProps) => {
		const {onOpenCardObject} = this.props;
		const {column, row} = props;

		row && onOpenCardObject(row[column.accessor].toString());
	};

	renderBodyCell = (props: CellConfigProps) => {
		const {column} = props;
		const {type} = column;
		let Component = Cell;

		if (isIndicatorColumn(column)) {
			Component = this.renderIndicatorCell;
		}

		if (type === COLUMN_TYPES.PARAMETER) {
			Component = this.renderParameterCell;
		}

		return <Component {...props} />;
	};

	renderHeaderCell = (props: HeaderCellProps) => {
		const {ignoreDataLimits = IGNORE_TABLE_DATA_LIMITS_SETTINGS} = this.props.widget;
		const {breakdown: breakdownLimitIgnored, parameter: parameterLimitIgnored} = ignoreDataLimits;
		const {breakdown: breakdownLimitExceeded, parameter: parameterLimitExceeded} = this.props.data.limitsExceeded;
		const {BREAKDOWN, INDICATOR, PARAMETER} = COLUMN_TYPES;
		const {attribute, group, type} = props.column;
		let {components, value} = props;

		if (type === BREAKDOWN && hasUUIDsInLabels(attribute, group) && typeof value === 'string') {
			value = getSeparatedLabel(value);
		}

		if (type === INDICATOR && breakdownLimitExceeded && !breakdownLimitIgnored) {
			components = {...components, Value: this.renderIndicatorHeaderValueWithWarning};
		} else if (type === PARAMETER && parameterLimitExceeded && !parameterLimitIgnored) {
			components = {...components, Value: this.renderParameterHeaderValueWithWarning};
		}

		return <HeaderCell {...props} components={components} value={value} />;
	};

	renderIndicatorCell = (props: CellConfigProps) => {
		const {fontColor, fontStyle} = this.props.widget.table.body.indicatorSettings;
		const {column, value = ''} = props;
		const {aggregation, attribute} = column;
		const components = {
			Value: this.renderLinkValue
		};
		let cellValue = value;

		if (hasMSInterval(attribute, aggregation)) {
			cellValue = parseMSInterval(Number(value));
		} else if (value && hasPercent(attribute, aggregation)) {
			cellValue = `${value}%`;
		} else if (isCardObjectColumn(column)) {
			cellValue = getSeparatedLabel(value);
		}

		return <Cell {...props} components={components} fontColor={fontColor} fontStyle={fontStyle} value={cellValue.toString()} />;
	};

	renderIndicatorHeaderValueWithWarning = (props: ValueProps) => (
		<ValueWithLimitWarning
			name={LIMIT_NAMES.BREAKDOWN}
			onSubmit={this.handleSubmitLimitWarningModal}
			value={props.value}
			warningText={t('TableWidget::ColumnsLimit', {limit: 30})}
		/>
	);

	renderLinkValue = (props: ValueProps) => {
		const {fontColor: color, value} = props;

		return (
			<span className={styles.link} style={{color}}>
				{value}
			</span>
		);
	};

	renderParameterCell = (props: CellConfigProps) => {
		const {fontColor, fontStyle} = this.props.widget.table.body.parameterSettings;
		let {column, value} = props;

		if (hasUUIDsInLabels(column.attribute) && typeof value === 'string') {
			value = getSeparatedLabel(value);
		}

		return (
			<Cell
				{...props}
				defaultValue={DEFAULT_TABLE_VALUE.EMPTY_ROW}
				fontColor={fontColor}
				fontStyle={fontStyle}
				value={value}
			/>
		);
	};

	renderParameterHeaderValueWithWarning = (props: ValueProps) => (
		<ValueWithLimitWarning
			name={LIMIT_NAMES.PARAMETER}
			onSubmit={this.handleSubmitLimitWarningModal}
			value={props.value}
			warningText={t('TableWidget::ValueCountLimit', {limit: 10000})}
		/>
	);

	render (): React$Node {
		const {data: tableData, loading, widget} = this.props;
		const {fixedColumnsCount} = this.state;
		const {columns, data, total} = tableData;
		const {columnsRatioWidth, showTotalAmount, sorting, table} = widget;
		const {pageSize} = table.body;
		const components = {
			BodyCell: this.renderBodyCell,
			HeaderCell: this.renderHeaderCell
		};
		const countTotals = showTotalAmount ? tableData.countTotals : null;

		return (
			<Table
				className={styles.table}
				columns={columns}
				columnsRatioWidth={columnsRatioWidth}
				components={components}
				countTotals={countTotals}
				data={data}
				fixedColumnsCount={fixedColumnsCount}
				getNewColumnsWidth={this.getNewColumnsWidth}
				loading={loading}
				onChangeColumnWidth={debounce(this.handleChangeColumnWidth, 1000)}
				onChangeSorting={this.handleChangeSorting}
				onClickDataCell={this.handleClickDataCell}
				onFetch={this.handleFetch}
				pageSize={pageSize}
				ref={this.tableRef}
				settings={table}
				sorting={sorting}
				total={total}
			/>
		);
	}
}

export default TableWidget;
