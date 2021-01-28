// @flow
import {Body, Cell, Footer, Header, HeaderCell, Pagination, Row} from './components';
import cn from 'classnames';
import type {Column, ColumnsWidth, Components, FixedPositions, Props, State, ValueProps} from './types';
import {DEFAULT_COLUMN_WIDTH} from './components/Cell/constants';
import {DEFAULT_TABLE_SETTINGS} from './constants';
import {isLegacyBrowser} from 'utils/export/helpers';
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
	tableRef: Ref<'div'> = createRef();
	headerRef: Ref<'div'> = createRef();
	footerRef: Ref<'div'> = createRef();

	state = {
		columnsWidth: {},
		components: this.getExtendedComponents(this.props.components),
		fixedPositions: {},
		page: 1,
		scrollBarWidth: 0,
		sorting: this.props.sorting,
		width: 0
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
	 * @param {Array<Column>} columns - колонки
	 * @returns {number}
	 */
	calcDefaultColumnWidth = (parentWidth: number, columns: Array<Column>): number => {
		const {columnsRatioWidth} = this.props;
		const {current: table} = this.tableRef;
		const sumCustomWidths = columns.reduce((sum, column) => Number.isInteger(column.width) ? sum + column.width : sum, 0);
		let sumRelativeWidth = 0;

		if (table) {
			sumRelativeWidth = columns.reduce(
				(sum, {accessor}) => accessor in columnsRatioWidth ? sum + table.clientWidth * columnsRatioWidth[accessor] : sum, 0
			);
		}

		const columnsWithDefaultWidth = columns.filter(({accessor, width}) => !Number.isInteger(width) && !(accessor in columnsRatioWidth));

		return Math.max(Math.floor((parentWidth - sumCustomWidths - sumRelativeWidth) / columnsWithDefaultWidth.length), DEFAULT_COLUMN_WIDTH);
	};

	/**
	 * Возвращает массив колонок для отрисовки без учёта объединяющих столбцов
	 * @returns {Array<Column>}
	 */
	getColumnsForRender = (): Array<Column> => this.props.columns.map(column => column.columns || column)
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
			let {accessor, columns: subColumns, width: columnWidth} = column;
			let width = columnWidth || defaultWidth;

			if (Array.isArray(subColumns)) {
				newColumnsWidth = this.getColumnsWidthByTableWidth(width, subColumns, newColumnsWidth);
				width = sumColumnsWidth(newColumnsWidth, subColumns);
			}

			newColumnsWidth[accessor] = width || defaultWidth;
		});

		return newColumnsWidth;
	};

	getFixedPositions = (columnsWidth: ColumnsWidth): FixedPositions => {
		const {columns, fixedColumnsCount} = this.props;
		const fixedPositions = {};

		if (!isLegacyBrowser(false)) {
			columns.slice(0, fixedColumnsCount).forEach(({accessor}, index, columns) => {
				fixedPositions[accessor] = index > 0
					? columns.slice(0, index).reduce((width, column) => width + columnsWidth[column.accessor], 0)
					: 0;
			});
		}

		return fixedPositions;
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

	handleBodyScroll = (e: SyntheticEvent<HTMLDivElement>) => {
		const {scrollLeft} = e.currentTarget;
		const {current: header} = this.headerRef;
		const {current: footer} = this.footerRef;

		if (header) {
			header.scrollLeft = scrollLeft;
		}

		if (footer) {
			footer.scrollLeft = scrollLeft;
		}
	};

	handleChangeColumnWidth = (columnWidth: number, column: Column) => {
		const {columns, columnsRatioWidth, getNewColumnsWidth = this.getNewColumnsWidth, onChangeColumnWidth} = this.props;
		const {columnsWidth} = this.state;
		const {current: container} = this.tableRef;
		const {accessor} = column;

		if (container) {
			const {clientWidth: containerWidth} = container;
			const newColumnsWidth = getNewColumnsWidth(column, columnWidth, columnsWidth);
			const fixedPositions = this.getFixedPositions(newColumnsWidth);
			const width = sumColumnsWidth(newColumnsWidth, columns);

			if (width >= container.clientWidth) {
				this.setState(() => ({
					columnsWidth: newColumnsWidth,
					fixedPositions,
					width
				}));

				columnsRatioWidth[accessor] = Number((columnWidth / containerWidth).toFixed(2));
				onChangeColumnWidth && onChangeColumnWidth(columnsRatioWidth);
			}
		}
	};

	handleChangeScrollBarWidth = (scrollBarWidth: number) => this.setState({scrollBarWidth});

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
		const fixedPositions = this.getFixedPositions(columnsWidth);

		this.setState({columnsWidth, fixedPositions, width});
	};

	renderBody = () => {
		const {data, onClickDataCell, pageSize, settings} = this.props;
		const {columnsWidth, components, fixedPositions, page, sorting, width} = this.state;

		return (
			<Body
				columns={this.getColumnsForRender()}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				fixedPositions={fixedPositions}
				onChangeScrollBarWidth={this.handleChangeScrollBarWidth}
				onClickCell={onClickDataCell}
				onScroll={this.handleBodyScroll}
				page={page}
				pageSize={pageSize}
				settings={settings}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderFooter = () => {
		const {columns} = this.props;
		const {columnsWidth, components, fixedPositions, scrollBarWidth, width} = this.state;
		const hasFooter = columns.find(i => i.footer);

		if (hasFooter) {
			return (
				<Footer
					columns={this.getColumnsForRender()}
					columnsWidth={columnsWidth}
					components={components}
					fixedPositions={fixedPositions}
					forwardedRef={this.footerRef}
					scrollBarWidth={scrollBarWidth}
					width={width}
				/>
			);
		}
	};

	renderHeader = () => {
		const {columns, data, settings} = this.props;
		const {columnsWidth, components, fixedPositions, scrollBarWidth, sorting, width} = this.state;
		const {columnHeader} = settings;

		return (
			<Header
				columns={columns}
				columnSettings={columnHeader}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				fixedPositions={fixedPositions}
				forwardedRef={this.headerRef}
				onChangeColumnWidth={this.handleChangeColumnWidth}
				onChangeSorting={this.handleChangeSorting}
				scrollBarWidth={scrollBarWidth}
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
		const {data, pageSize} = this.props;
		const {page, width} = this.state;
		const total = Math.max(Math.ceil(data.length / pageSize), 1);
		const {current} = this.tableRef;

		if (width > 0 && current) {
			return (
				<Pagination
					onNextClick={this.handleNextClick}
					onPrevClick={this.handlePrevClick}
					page={page}
					total={total}
					width={current.clientWidth}
				/>
			);
		}

		return null;
	};

	renderTable = () => {
		const {data} = this.props;
		const {width} = this.state;

		if (data.length > 0 && width > 0) {
			return (
				<div className={styles.table}>
					{this.renderHeader()}
					{this.renderBody()}
					{this.renderFooter()}
				</div>
			);
		}

		return null;
	};

	render () {
		const {className} = this.props;

		return (
			<ResizeDetector onResize={this.handleResize} >
				<div className={cn(styles.container, className)} ref={this.tableRef}>
					{this.renderTable()}
					{this.renderNoData()}
					{this.renderPagination()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Table;
