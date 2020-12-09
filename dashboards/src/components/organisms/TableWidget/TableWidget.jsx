// @flow
import type {AttributeColumn, Column, Props, State} from './types';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {
	CARD_OBJECT_VALUE_SEPARATOR,
	IGNORE_TABLE_DATA_LIMITS_SETTINGS,
	META_CLASS_VALUE_SEPARATOR
} from 'store/widgets/buildData/constants';
import {Cell, HeaderCell} from 'components/organisms/Table/components';
import type {CellConfigProps, OnClickCellProps, ValueProps} from 'components/organisms/Table/types';
import {COLUMN_TYPES, EMPTY_VALUE, ID_ACCESSOR} from './constants';
import type {ColumnsRatioWidth, TableSorting} from 'store/widgets/data/types';
import {createDrillDownMixin} from 'store/widgets/links/helpers';
import {debounce} from 'src/helpers';
import {DEFAULT_AGGREGATION} from 'store/widgets/constants';
import {DEFAULT_TABLE_VALUE} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';
import {LIMIT_NAMES} from './components/ValueWithLimitWarning/constants';
import type {Props as HeaderCellProps} from 'components/organisms/Table/components/HeaderCell/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {Table} from 'components/organisms';
import {ValueWithLimitWarning} from './components';

export class TableWidget extends PureComponent<Props, State> {
	state = {
		columns: []
	};

	static getDerivedStateFromProps (props: Props) {
		const {data, widget} = props;
		let {columns} = data;

		if (!widget.table.body.showRowNum) {
			columns = (columns.filter(c => c.accessor !== ID_ACCESSOR): Array<Column>);
		}

		return {
			columns
		};
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
		const {type} = column;
		const {BREAKDOWN} = COLUMN_TYPES;
		const mixin = createDrillDownMixin(widget);
		const dataColumns = columns.filter(this.isGroupColumn);

		if (type === BREAKDOWN) {
			dataColumns.push(column);
		}

		dataColumns.forEach(column => {
			const {accessor, attribute, group, header, type} = column;
			let rowValue = '';

			if (row) {
				({[accessor]: rowValue = EMPTY_VALUE} = row);
			}

			let value = type === BREAKDOWN ? header : rowValue;
			let subTitle = value;

			if (attribute.type === ATTRIBUTE_TYPES.metaClass) {
				subTitle = this.getSeparatedLabel(value, META_CLASS_VALUE_SEPARATOR);
			}

			mixin.title = `${mixin.title}. ${subTitle}`;

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

	getSeparatedLabel = (value?: string | number, separator: string): string =>
		value && typeof value === 'string' ? value.split(separator)[0] : '';

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

		if (this.isIndicatorColumn(column)) {
			this.isCardObjectColumn(column) ? this.openCardObject(props) : this.drillDown(props);
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

	isCardObjectColumn = (column: AttributeColumn): boolean => {
		let {attribute} = column;
		let aggregation;

		if (column.type === COLUMN_TYPES.INDICATOR) {
			({aggregation} = column);
		}

		if (column.type === COLUMN_TYPES.BREAKDOWN) {
			({aggregation, attribute} = column.indicator);
		}

		return this.isIndicatorColumn(column) && aggregation === DEFAULT_AGGREGATION.NOT_APPLICABLE
			&& (attribute.type in ATTRIBUTE_SETS.REFERENCE || attribute.type === ATTRIBUTE_TYPES.string);
	};

	isGroupColumn = (column: Column): boolean => column.type === COLUMN_TYPES.PARAMETER;

	isIndicatorColumn = (column: AttributeColumn): boolean => {
		const {type} = column;
		const {BREAKDOWN, INDICATOR} = COLUMN_TYPES;

		return type === BREAKDOWN || type === INDICATOR;
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

		if (this.isIndicatorColumn(column)) {
			Component = this.renderIndicatorCell;
		}

		if (type === COLUMN_TYPES.PARAMETER) {
			Component = this.renderParameterCell;
		}

		return <Component {...props} />;
	};

	renderHeaderCell = (props: HeaderCellProps) => {
		const {ignoreDataLimits = IGNORE_TABLE_DATA_LIMITS_SETTINGS} = this.props.widget;
		const {indicator: indicatorLimitIgnored, parameter: parameterLimitIgnored} = ignoreDataLimits;
		const {indicator: indicatorLimitExceeded, parameter: parameterLimitExceeded} = this.props.data.limitsExceeded;
		const {BREAKDOWN, INDICATOR, PARAMETER} = COLUMN_TYPES;
		const {attribute, type} = props.column;
		let {components, value} = props;

		if (type === BREAKDOWN && attribute.type === ATTRIBUTE_TYPES.metaClass) {
			value = this.getSeparatedLabel(value, META_CLASS_VALUE_SEPARATOR);
		}

		if (type === INDICATOR && indicatorLimitExceeded && !indicatorLimitIgnored) {
			components = {...components, Value: this.renderIndicatorHeaderValueWithWarning};
		} else if (type === PARAMETER && parameterLimitExceeded && !parameterLimitIgnored) {
			components = {...components, Value: this.renderParameterHeaderValueWithWarning};
		}

		return <HeaderCell {...props} components={components} value={value} />;
	};

	renderIndicatorCell = (props: CellConfigProps) => {
		const {fontColor, fontStyle} = this.props.widget.table.body.indicatorSettings;
		const {column, value} = props;
		const components = {
			Value: this.renderLinkValue
		};
		let cellValue = value;

		if (hasMSInterval(column, FIELDS.attribute)) {
			cellValue = parseMSInterval(Number(value));
		} else if (value && hasPercent(column, FIELDS.attribute)) {
			cellValue = `${value}%`;
		} else if (this.isCardObjectColumn(column)) {
			cellValue = this.getSeparatedLabel(value, CARD_OBJECT_VALUE_SEPARATOR);
		}

		return <Cell {...props} components={components} fontColor={fontColor} fontStyle={fontStyle} value={cellValue} />;
	};

	renderIndicatorHeaderValueWithWarning = (props: ValueProps) => (
		<ValueWithLimitWarning
			name={LIMIT_NAMES.INDICATOR}
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

		if (column.attribute.type === ATTRIBUTE_TYPES.metaClass) {
			value = this.getSeparatedLabel(props.value, CARD_OBJECT_VALUE_SEPARATOR);
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
			warningText="Результат превышает 10000 значений. Вы уверены, что хотите выгрузить данные на диаграмму."
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
