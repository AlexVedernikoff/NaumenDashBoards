// @flow
import {Body, Cell, Footer, Header, HeaderCell, Pagination, Row} from './components';
import cn from 'classnames';
import type {Column, ColumnsWidth, Components, Props, State, ValueProps} from './types';
import {DEFAULT_COLUMN_WIDTH} from './components/Cell/constants';
import {DEFAULT_TABLE_SETTINGS} from './constants';
import React, {createRef, PureComponent} from 'react';
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
		page: 1,
		pageSize: 20,
		sorting: this.props.sorting,
		width: null
	};

	getExtendedComponents (components?: Components): Components {
		return components ? {...this.components, ...components} : this.components;
	}

	renderValue (props: ValueProps) {
		return props.value;
	}

	/**
	 * Подсчитывает ширину колонки по умолчанию относительно ширины родителя
	 * @param {number} parentWidth - ширина родителя
	 * @param {number} count - количество колонок
	 * @returns {number}
	 */
	calcDefaultColumnWidth = (parentWidth: number, count: number): number => {
		return Math.max(Math.round(parentWidth / count), DEFAULT_COLUMN_WIDTH);
	};

	/**
	 * Возвращает массив колонок для отрисовки без учёта объединяющих столбцов
	 * @returns {Array<Column>}
	 */
	getColumnsForRender = (): Array<Column> => {
		const {columns} = this.props;

		return columns
			.map(column => column.columns || column)
			.reduce((columns, value) => Array.isArray(value) ? [...columns, ...value] : [...columns, value], []);
	};

	/**
	 * Возвращает начальные данные ширины столбцов относительно ширины таблицы с учетом подстолбцов
	 * @param {number} tableWidth - ширина таблицы
	 * @param {Array<Column>} columns - колонки
	 * @param {ColumnsWidth} columnsWidth - данные ширины столбцов
	 * @returns {ColumnsWidth}
	 */
	getInitColumnsWidth = (tableWidth: number, columns: Array<Column>, columnsWidth: ColumnsWidth): ColumnsWidth => {
		const defaultWidth = this.calcDefaultColumnWidth(tableWidth, columns.length);
		let newColumnsWidth = {...columnsWidth};

		columns.forEach(column => {
			const {accessor, columns: subColumns} = column;
			let width;

			if (Array.isArray(subColumns)) {
				newColumnsWidth = this.getInitColumnsWidth(tableWidth, subColumns, newColumnsWidth);
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
	getNewColumnsWidth = (column: Column, newWidth: number, columnsWidth: ColumnsWidth = this.state.columnsWidth): ColumnsWidth => {
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
		const {columns, columnsRatioWidth, onChangeColumnWidth} = this.props;
		const {columnsWidth} = this.state;
		const {current: container} = this.ref;
		const {accessor} = column;

		if (container) {
			const {clientWidth: containerWidth} = container;
			const newColumnsWidth = this.getNewColumnsWidth(column, columnWidth, columnsWidth);

			this.setState(() => ({
				columnsWidth: newColumnsWidth,
				width: sumColumnsWidth(newColumnsWidth, columns)
			}));

			columnsRatioWidth[accessor] = Number((columnWidth / containerWidth).toFixed(2));
			onChangeColumnWidth && onChangeColumnWidth(columnsRatioWidth);
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

		if (Object.keys(columnsWidth).length === 0) {
			columnsWidth = this.getInitColumnsWidth(newWidth, columns, columnsWidth);
		}

		Object.keys(columnsRatioWidth).forEach(accessor => {
			if (columnsRatioWidth[accessor]) {
				columnsWidth[accessor] = newWidth * columnsRatioWidth[accessor];
			}
		});

		const width = sumColumnsWidth(columnsWidth, columns);

		this.setState({columnsWidth, width});
	};

	renderBody = (width: number) => {
		const {data, onClickDataCell, settings} = this.props;
		const {columnsWidth, components, page, pageSize, sorting} = this.state;

		return (
			<Body
				columns={this.getColumnsForRender()}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				onClickCell={onClickDataCell}
				page={page}
				pageSize={pageSize}
				settings={settings}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderFooter = (width: number) => {
		const {columns} = this.props;
		const {columnsWidth, components} = this.state;
		const hasFooter = columns.find(i => i.footer);

		if (hasFooter) {
			return (
				<Footer
					columns={this.getColumnsForRender()}
					columnsWidth={columnsWidth}
					components={components}
					width={width}
				/>
			);
		}
	};

	renderHeader = (width: number) => {
		const {columns, data, settings} = this.props;
		const {columnsWidth, components, sorting} = this.state;
		const {columnHeader} = settings;

		return (
			<Header
				columns={columns}
				columnSettings={columnHeader}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				onChangeColumnWidth={this.handleChangeColumnWidth}
				onChangeSorting={this.handleChangeSorting}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderNoData = () => {
		const {data} = this.props;
		return data.length === 0 ? <div className={styles.noData}>Данные отсутствуют</div> : null;
	};

	renderPagination = () => {
		const {data} = this.props;
		const {page, pageSize, width} = this.state;
		const total = Math.max(Math.ceil(data.length / pageSize), 1);

		if (width) {
			return (
				<Pagination
					onNextClick={this.handleNextClick}
					onPrevClick={this.handlePrevClick}
					page={page}
					total={total}
					width={width}
				/>
			);
		}
	};

	renderTable = () => {
		const {width} = this.state;

		if (width) {
			return (
				<div className={styles.table}>
					{this.renderHeader(width)}
					{this.renderBody(width)}
					{this.renderFooter(width)}
					{this.renderNoData()}
					{this.renderPagination()}
				</div>
			);
		}

		return null;
	};

	render () {
		const {className} = this.props;

		return (
			<ResizeDetector className={cn(styles.container, className)} forwardedRef={this.ref} onResize={this.handleResize}>
				{this.renderTable()}
			</ResizeDetector>
		);
	}
}

export default Table;
