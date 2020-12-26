// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	CARD_OBJECT_VALUE_SEPARATOR,
	IGNORE_TABLE_DATA_LIMITS_SETTINGS,
	META_CLASS_VALUE_SEPARATOR
} from 'store/widgets/buildData/constants';
import {Cell, HeaderCell} from 'components/organisms/Table/components';
import type {CellConfigProps, OnClickCellProps, ValueProps} from 'components/organisms/Table/types';
import type {Column, ParameterColumn, Props, Row, State} from './types';
import {COLUMN_TYPES, EMPTY_VALUE, ID_ACCESSOR} from './constants';
import type {ColumnsRatioWidth, TableSorting} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {debounce} from 'src/helpers';
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import {getSeparatedLabel, isCardObjectColumn, isIndicatorColumn} from './helpers';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';
import {LIMIT_NAMES} from './components/ValueWithLimitWarning/constants';
import type {Props as HeaderCellProps} from 'components/organisms/Table/components/HeaderCell/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Table} from 'components/organisms';
import {ValueWithLimitWarning} from './components';

export class TableWidget extends PureComponent<Props, State> {
	state = {
		columns: this.getColumns(this.props)
	};

	getColumns (props: Props): Array<Column> {
		const {data, widget} = props;
		let {columns} = data;

		if (!widget.table.body.showRowNum) {
			columns = (columns.filter(c => c.accessor !== ID_ACCESSOR): Array<Column>);
		} else {
			columns = (columns.map(column => {
				if (column.accessor === ID_ACCESSOR && !column.type) {
					return {
						...column,
						width: this.getMaxValueCellLength(data.data, ID_ACCESSOR)
					};
				}

				return column;
			}): Array<Column>);
		}

		return columns;
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
		const {onDrillDown, widget} = this.props;
		const {columns} = this.state;
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
		const {columns} = this.state;
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
				data={tableData.data}
				onChangeColumnWidth={debounce(this.handleChangeColumnWidth, 1000)}
				onChangeSorting={this.handleChangeSorting}
				onClickDataCell={this.handleClickDataCell}
				pageSize={pageSize}
				settings={table}
				sorting={sorting}
			/>
		);
	}
}

export default TableWidget;
