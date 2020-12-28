// @flow
import {Body, Cell, Footer, Header, HeaderCell, Pagination, Row} from './components';
import cn from 'classnames';
import type {Column, ColumnsWidth, Components, Props, State, ValueProps} from './types';
import {DEFAULT_COLUMN_WIDTH} from './components/Cell/constants';
import {DEFAULT_TABLE_SETTINGS} from './constants';
import React, {createRef, Fragment, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {ResizeDetector} from 'components/molecules';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';
import {sumColumnsWidth} from './helpers';
import type {TableSorting} from 'store/widgets/data/types';

export class Table extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		columnsRatioWidth: {},
		pageSize: 20,
		settings: DEFAULT_TABLE_SETTINGS,
		sorting: {
			accessor: null,
			type: SORTING_TYPES.ASC
		}
	};

	components = {
		BodyCell: Cell,
		Cell,
		FooterCell: Cell,
		HeaderCell,
		Row,
		Value: this.renderValue
	};
	ref: Ref<'div'> = createRef();

	state = {
		columnsWidth: {},
		components: this.getExtendedComponents(this.props.components),
		fixedColumns: this.getFixedColumns(this.props),
		page: 1,
		sorting: this.props.sorting,
		width: null
	};

	getExtendedComponents (components?: Components): Components {
		return components ? {...this.components, ...components} : this.components;
	}

	getFixedColumns (props: Props): Array<Column> {
		const {columns, fixedColumnsCount} = props;
		return columns.slice(0, fixedColumnsCount);
	}

	renderValue (props: ValueProps) {
		return props.value;
	}

	/**
	 * Подсчитывает ширину колонки по умолчанию относительно ширины родителя
	 * @param {number} parentWidth - ширина родителя
	 * @param {Array<Column>} columns - колонки
	 * @returns {number}
	 */
	calcDefaultColumnWidth = (parentWidth: number, columns: Array<Column>): number => {
		const sumCustomWidths = columns.reduce((sum, column) => Number.isInteger(column.width) ? sum + column.width : sum, 0);
		const columnsWithoutCustomWidth = columns.filter(column => !Number.isInteger(column.width));

		return Math.max(Math.round((parentWidth - sumCustomWidths) / columnsWithoutCustomWidth.length), DEFAULT_COLUMN_WIDTH);
	};

	/**
	 * Возвращает массив колонок для отрисовки без учёта объединяющих столбцов
	 * @returns {Array<Column>}
	 */
	getColumnsForRender = (columns: Array<Column>): Array<Column> => columns.map(column => column.columns || column)
			.reduce((columns, value) => Array.isArray(value) ? [...columns, ...value] : [...columns, value], []);

	/**
	 * Возвращает данные ширины столбцов относительно ширины таблицы с учетом подстолбцов
	 * @param {number} tableWidth - ширина таблицы
	 * @param {Array<Column>} columns - колонки
	 * @param {ColumnsWidth} columnsWidth - данные ширины столбцов
	 * @returns {ColumnsWidth}
	 */
	getColumnsWidthByTableWidth = (tableWidth: number, columns: Array<Column>, columnsWidth: ColumnsWidth): ColumnsWidth => {
		const defaultWidth = this.calcDefaultColumnWidth(tableWidth, columns);
		let newColumnsWidth = {...columnsWidth};

		columns.forEach(column => {
			let {accessor, columns: subColumns, width} = column;

			if (Array.isArray(subColumns)) {
				newColumnsWidth = this.getColumnsWidthByTableWidth(tableWidth, subColumns, newColumnsWidth);
				width = sumColumnsWidth(newColumnsWidth, subColumns);
			}

			newColumnsWidth[accessor] = width || defaultWidth;
		});

		return newColumnsWidth;
	};

	/**
	 * Возвращает данные ширины колонок с учетом подстолбцов при изменении ширины одной из колонок
	 * @param {Column} column - колонка
	 * @param {number} newWidth - новая ширина колонки
	 * @param {ColumnsWidth} columnsWidth - данные ширины столбцов
	 * @returns {ColumnsWidth}
	 */
	getNewColumnsWidth = (column: Column, newWidth: number, columnsWidth: ColumnsWidth): ColumnsWidth => {
		const {accessor, columns} = column;
		let newColumnsWidth = {
			...columnsWidth,
			[accessor]: newWidth
		};

		if (Array.isArray(columns)) {
			const delta = columnsWidth[accessor] - newWidth;
			const deltaSubColumn = Math.round(delta / columns.length);

			columns.map(column => {
				const {accessor} = column;
				const subColumnWidth = columnsWidth[accessor] - deltaSubColumn;

				newColumnsWidth = this.getNewColumnsWidth(column, subColumnWidth, newColumnsWidth);
			});
		}

		return newColumnsWidth;
	};

	handleChangeColumnWidth = (columnWidth: number, column: Column) => {
		const {columns, columnsRatioWidth, getNewColumnsWidth = this.getNewColumnsWidth, onChangeColumnWidth} = this.props;
		const {columnsWidth} = this.state;
		const {current: container} = this.ref;
		const {accessor} = column;

		if (container) {
			const {clientWidth: containerWidth} = container;
			const newColumnsWidth = getNewColumnsWidth(column, columnWidth, columnsWidth);
			const width = sumColumnsWidth(newColumnsWidth, columns);

			if (width >= container.clientWidth) {
				this.setState(() => ({
					columnsWidth: newColumnsWidth,
					width: sumColumnsWidth(newColumnsWidth, columns)
				}));

				columnsRatioWidth[accessor] = Number((columnWidth / containerWidth).toFixed(2));
				onChangeColumnWidth && onChangeColumnWidth(columnsRatioWidth);
			}
		}
	};

	handleChangeSorting = (sorting: TableSorting) => {
		const {onChangeSorting} = this.props;

		this.setState({sorting});
		onChangeSorting && onChangeSorting(sorting);
	};

	handleNextClick = () => this.setState({page: this.state.page + 1});

	handlePrevClick = () => this.setState({page: this.state.page - 1});

	handleResize = (newWidth: number) => {
		const {columns, columnsRatioWidth} = this.props;
		let {columnsWidth} = this.state;

		columnsWidth = this.getColumnsWidthByTableWidth(newWidth, columns, columnsWidth);

		Object.keys(columnsRatioWidth).forEach(accessor => {
			if (columnsRatioWidth[accessor]) {
				columnsWidth[accessor] = newWidth * columnsRatioWidth[accessor];
			}
		});

		const width = sumColumnsWidth(columnsWidth, columns);

		this.setState({columnsWidth, width});
	};

	renderBody = (columns: Array<Column>) => {
		const {data, onClickDataCell, pageSize, settings} = this.props;
		const {columnsWidth, components, page, sorting} = this.state;

		return (
			<Body
				columns={this.getColumnsForRender(columns)}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				onClickCell={onClickDataCell}
				page={page}
				pageSize={pageSize}
				settings={settings}
				sorting={sorting}
			/>
		);
	};

	renderColumns = (columns: Array<Column> = this.props.columns) => (
		<Fragment>
			{this.renderHeader(columns)}
			{this.renderBody(columns)}
			{this.renderFooter(columns)}
		</Fragment>
	);

	renderFixedTable = () => {
		const {columns, fixedColumnsCount} = this.props;
		const {width} = this.state;
		const fixedColumns = columns.slice(0, fixedColumnsCount);

		return width ? <div className={styles.fixedTable}>{this.renderColumns(fixedColumns)}</div> : null;
	};

	renderFooter = (columns: Array<Column>) => {
		const {columnsWidth, components} = this.state;
		const hasFooter = columns.find(i => i.footer);

		if (hasFooter) {
			return (
				<Footer
					columns={this.getColumnsForRender(columns)}
					columnsWidth={columnsWidth}
					components={components}
				/>
			);
		}
	};

	renderHeader = (columnsToRender: Array<Column>) => {
		const {columns, data, settings} = this.props;
		const {columnsWidth, components, sorting} = this.state;
		const {columnHeader} = settings;
		const usesSubColumns = !!columns.find(column => Array.isArray(column.columns));

		return (
			<Header
				columns={columnsToRender}
				columnSettings={columnHeader}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				onChangeColumnWidth={this.handleChangeColumnWidth}
				onChangeSorting={this.handleChangeSorting}
				sorting={sorting}
				usesSubColumns={usesSubColumns}
			/>
		);
	};

	renderNoData = () => {
		const {data} = this.props;
		return data.length === 0 ? <div className={styles.noData}>Данные отсутствуют</div> : null;
	};

	renderPagination = () => {
		const {data, pageSize} = this.props;
		const {page, width} = this.state;
		const total = Math.max(Math.ceil(data.length / pageSize), 1);

		if (width) {
			return (
				<Pagination
					onNextClick={this.handleNextClick}
					onPrevClick={this.handlePrevClick}
					page={page}
					total={total}
				/>
			);
		}
	};

	renderTable = () => {
		const {width} = this.state;
		return width ? <div className={styles.table}>{this.renderColumns()}</div> : null;
	};

	render () {
		const {className} = this.props;

		return (
			<ResizeDetector onResize={this.handleResize} >
				<div className={cn(styles.container, className)} ref={this.ref}>
					{this.renderFixedTable()}
					{this.renderTable()}
					{this.renderNoData()}
					{this.renderPagination()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Table;
