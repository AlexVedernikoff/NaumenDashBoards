// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	CARD_OBJECT_VALUE_SEPARATOR,
	IGNORE_TABLE_DATA_LIMITS_SETTINGS,
	META_CLASS_VALUE_SEPARATOR
} from 'store/widgets/buildData/constants';
import {Cell, HeaderCell} from 'components/organisms/Table/components';
import type {CellConfigProps, ColumnsWidth, OnClickCellProps, ValueProps} from 'components/organisms/Table/types';
import type {Column, ColumnType, ParameterColumn, Props, State} from './types';
import {COLUMN_TYPES, EMPTY_VALUE, ID_ACCESSOR} from './constants';
import type {ColumnsRatioWidth, TableSorting} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {debounce, deepClone} from 'src/helpers';
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getSeparatedLabel, isCardObjectColumn, isIndicatorColumn} from './helpers';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';
import {LIMIT_NAMES} from './components/ValueWithLimitWarning/constants';
import type {Props as HeaderCellProps} from 'components/organisms/Table/components/HeaderCell/types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import {Table} from 'components/organisms';
import {ValueWithLimitWarning} from './components';

export class TableWidget extends PureComponent<Props, State> {
	tableRef: Ref<typeof Table> = createRef();
	state = this.initState(this.props);

	initState (props: Props): State {
		const {data} = props;
		let {columns} = data;

		const fixedColumnsCount = columns.findIndex(column => column.type === COLUMN_TYPES.INDICATOR);

		return {
			fixedColumnsCount
		};
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
				({[accessor]: rowValue = EMPTY_VALUE} = row);
			}

			let value = type === BREAKDOWN ? header : rowValue;

			if (value) {
				let subTitle: string = value;

				if (attribute.type === ATTRIBUTE_TYPES.metaClass) {
					subTitle = getSeparatedLabel(subTitle, META_CLASS_VALUE_SEPARATOR);
				}

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

	getNewColumnsWidth = (column: Column, newWidth: number, columnsWidth: ColumnsWidth): ColumnsWidth => {
		const {current: table} = this.tableRef;
		const {accessor, type} = column;
		const {BREAKDOWN, INDICATOR, PARAMETER} = COLUMN_TYPES;
		const ratio = columnsWidth[accessor] / newWidth;
		let newColumnsWidth = columnsWidth;

		if (type === PARAMETER) {
			newColumnsWidth = this.getNewParametersColumnsWidth(column, newColumnsWidth, ratio);
		} else if (type === BREAKDOWN || type === INDICATOR) {
			newColumnsWidth = this.getNewIndicatorsColumnsWidth(column, newColumnsWidth, ratio);
		} else if (table) {
			newColumnsWidth = table.getNewColumnsWidth(column, newWidth, columnsWidth);
		}

		return newColumnsWidth;
	};

	getNewIndicatorsColumnsWidth = (column: Column, columnsWidth: ColumnsWidth, ratio: number): ColumnsWidth => {
		const {columns} = this.props.data;
		const {BREAKDOWN, INDICATOR} = COLUMN_TYPES;
		const {accessor, type} = column;
		let newColumnsWidth = columnsWidth;
		let isLastIndicator = false;
		let isLastBreakdown = false;

		if (type === INDICATOR) {
			isLastIndicator = this.isLastTypedColumn(column, INDICATOR);
		} else if (type === BREAKDOWN) {
			const lastIndicator = columns.find((column) => this.isLastTypedColumn(column, INDICATOR));

			if (lastIndicator && Array.isArray(lastIndicator.columns)) {
				isLastBreakdown = !!lastIndicator.columns.find(
					(column, index, columns) => column.accessor === accessor && index === columns.length - 1
				);
			}
		}

		if (isLastIndicator || isLastBreakdown) {
			newColumnsWidth = deepClone(newColumnsWidth);

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
		}

		return newColumnsWidth;
	};

	getNewParametersColumnsWidth = (column: Column, columnsWidth: ColumnsWidth, ratio: number): ColumnsWidth => {
		const {columns} = this.props.data;
		const {PARAMETER} = COLUMN_TYPES;
		let newColumnsWidth = columnsWidth;

		if (this.isLastTypedColumn(column, PARAMETER)) {
			newColumnsWidth = deepClone(newColumnsWidth);

			columns.forEach(column => {
				if (column.type === PARAMETER) {
					newColumnsWidth[column.accessor] = columnsWidth[column.accessor] / ratio;
				}
			});
		}

		return newColumnsWidth;
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
		const {column} = props;

		if (isIndicatorColumn(column)) {
			isCardObjectColumn(column) ? this.openCardObject(props) : this.drillDown(props);
		}
	};

	handleSubmitLimitWarningModal = (name: string) => {
		const {onFetchBuildData, onUpdate, widget} = this.props;
		const {ignoreDataLimits = IGNORE_TABLE_DATA_LIMITS_SETTINGS} = widget;

		if (!ignoreDataLimits[name]) {
			const newWidget = {
				...widget,
				ignoreDataLimits: {
					...ignoreDataLimits,
					[name]: true
				}
			};

			onUpdate(newWidget);
			onFetchBuildData(newWidget);
		}
	};

	isGroupColumn = (column: Column): boolean => column.type === COLUMN_TYPES.PARAMETER;

	isLastTypedColumn = (column: Column, type: ColumnType): boolean => {
		const {columns} = this.props.data;
		const {accessor, type: columnType} = column;
		const columnIndex = columns.findIndex(column => column.accessor === accessor);
		const nextColumn = columns[columnIndex + 1];

		return columnType === type && (!nextColumn || nextColumn.type !== type);
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
		const {attribute, type} = props.column;
		let {components, value} = props;

		if (type === BREAKDOWN && attribute.type === ATTRIBUTE_TYPES.metaClass) {
			value = getSeparatedLabel(value, META_CLASS_VALUE_SEPARATOR);
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
		const components = {
			Value: this.renderLinkValue
		};
		let cellValue = value;

		if (hasMSInterval(column, FIELDS.attribute)) {
			cellValue = parseMSInterval(Number(value));
		} else if (value && hasPercent(column, FIELDS.attribute)) {
			cellValue = `${value}%`;
		} else if (isCardObjectColumn(column)) {
			cellValue = getSeparatedLabel(value, CARD_OBJECT_VALUE_SEPARATOR);
		}

		return <Cell {...props} components={components} fontColor={fontColor} fontStyle={fontStyle} value={cellValue.toString()} />;
	};

	renderIndicatorHeaderValueWithWarning = (props: ValueProps) => (
		<ValueWithLimitWarning
			name={LIMIT_NAMES.BREAKDOWN}
			onSubmit={this.handleSubmitLimitWarningModal}
			value={props.value}
			warningText="Результат превышает 30 столбцов и может быть труден для восприятия. Вы уверены, что хотите выгрузить данные на диаграмму?"
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

		if (column.attribute.type === ATTRIBUTE_TYPES.metaClass && typeof value === 'string') {
			value = getSeparatedLabel(value, CARD_OBJECT_VALUE_SEPARATOR);
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
			warningText="Результат превышает 10000 значений. Вы уверены, что хотите выгрузить данные на диаграмму?"
		/>
	);

	render (): React$Node {
		const {data: tableData, widget} = this.props;
		const {fixedColumnsCount} = this.state;
		const {columns, data} = tableData;
		const {columnsRatioWidth, sorting, table} = widget;
		const {pageSize} = table.body;
		const components = {
			BodyCell: this.renderBodyCell,
			HeaderCell: this.renderHeaderCell
		};

		return (
			<Table
				className={styles.table}
				columns={columns}
				columnsRatioWidth={columnsRatioWidth}
				components={components}
				data={data}
				fixedColumnsCount={fixedColumnsCount}
				getNewColumnsWidth={this.getNewColumnsWidth}
				onChangeColumnWidth={debounce(this.handleChangeColumnWidth, 1000)}
				onChangeSorting={this.handleChangeSorting}
				onClickDataCell={this.handleClickDataCell}
				pageSize={pageSize}
				ref={this.tableRef}
				settings={table}
				sorting={sorting}
			/>
		);
	}
}

export default TableWidget;
