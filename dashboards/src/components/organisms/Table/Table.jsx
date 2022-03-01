// @flow
import Body from './components/Body';
import Cell from './components/Cell';
import cn from 'classnames';
import type {Column, ColumnsWidth, Components, FixedPositions, Props, State, ValueProps} from './types';
import {COLUMN_TYPES} from 'store/widgets/buildData/constants';
import {DEFAULT_COLUMN_WIDTH} from './components/Cell/constants';
import {DEFAULT_TABLE_SETTINGS} from './constants';
import Footer from './components/Footer';
import Header from './components/Header';
import HeaderCell from './components/HeaderCell';
import {isLegacyBrowser} from 'utils/export/helpers';
import Pagination from './components/Pagination';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import ResizeDetector from 'components/molecules/ResizeDetector';
import Row from './components/Row';
import {SORTING_TYPES} from 'store/widgets/data/constants';
import styles from './styles.less';
import {sumColumnsWidth} from './helpers';
import T from 'components/atoms/Translation';
import type {TableSorting} from 'store/widgets/data/types';
import Total from './components/Total';

export class Table extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		columnsRatioWidth: {},
		pageSize: 20,
		settings: DEFAULT_TABLE_SETTINGS,
		sorting: {
			accessor: null,
			type: SORTING_TYPES.ASC
		},
		total: 0
	};

	components = {
		BodyCell: Cell,
		Cell,
		FooterCell: Cell,
		HeaderCell,
		Row,
		TotalCell: Cell,
		Value: this.renderValue
	};
	tableRef: Ref<'div'> = createRef();
	headerRef: Ref<'div'> = createRef();
	footerRef: Ref<'div'> = createRef();
	totalRef: Ref<'div'> = createRef();

	state = {
		columnsWidth: {},
		components: this.getExtendedComponents(this.props.components),
		containerWidth: 0,
		dataColumns: this.getDataColumns(this.props),
		fixedPositions: {},
		page: 1,
		scrollBarWidth: 0,
		sorting: this.props.sorting,
		width: 0
	};

	componentDidUpdate (prevProps: Props) {
		const {columns: prevColumns} = prevProps;
		const {columns} = this.props;

		if (prevColumns !== columns) {
			this.setState({dataColumns: this.getDataColumns(this.props)});
		}
	}

	/**
	 * Возвращает массив колонок для отрисовки без учёта объединяющих столбцов
	 * @param {Props} props - пропсы компонента
	 * @returns {Array<Column>}
	 */
	getDataColumns (props: Props): Array<Column> {
		const result = props.columns.flatMap(column => column.columns ? column.columns : column);
		return result;
	}

	/**
	 * Применяет преднастройки относительной ширины колонок
	 * @param {number} width - ширина таблицы
	 * @param {ColumnsWidth} columnsWidth - данные ширины столбцов
	 * @returns {ColumnsWidth}
	 */
	applyColumnsRatioWidth = (width: number, columnsWidth: ColumnsWidth) => {
		const {columns, columnsRatioWidth} = this.props;
		let newColumnsWidth = Object.keys(columnsRatioWidth).reduce((newColumnsWidth, accessor) => ({
			...newColumnsWidth,
			[accessor]: width * columnsRatioWidth[accessor]
		}), columnsWidth);

		const sumWidth = sumColumnsWidth(newColumnsWidth, columns);

		if (sumWidth < width) {
			const diff = sumWidth / width;

			newColumnsWidth = Object.keys(newColumnsWidth).reduce((newColumnsWidth, accessor) => ({
				...newColumnsWidth,
				[accessor]: newColumnsWidth[accessor] / diff
			}), newColumnsWidth);
		}

		return newColumnsWidth;
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
		const sumCustomWidths = columns.reduce((sum, column) => column.width && Number.isInteger(column.width) ? sum + column.width : sum, 0);
		const columnsWithDefaultWidth = columns.filter(({width}) => !Number.isInteger(width));

		return Math.max(Math.floor((parentWidth - sumCustomWidths) / columnsWithDefaultWidth.length), DEFAULT_COLUMN_WIDTH);
	};

	fetch = () => {
		const {onFetch, pageSize} = this.props;
		const {page, sorting} = this.state;

		onFetch(pageSize, page, sorting);
	};

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
			const {accessor, columns: subColumns, width: columnWidth} = column;
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
	 * @param {number} minWidth - минимальная ширина всех столбцов
	 * @returns {ColumnsWidth}
	 */
	getNewColumnsWidth = (column: Column, newWidth: number, columnsWidth: ColumnsWidth, minWidth: ?number = null): ColumnsWidth => {
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

				newColumnsWidth = this.getNewColumnsWidth(column, subColumnWidth, newColumnsWidth, minWidth);
			});
		}

		if (minWidth) {
			const sumWidth = sumColumnsWidth(newColumnsWidth, this.props.columns);
			const diff = minWidth - sumWidth;

			if (minWidth && diff > 0) {
				const {type} = column;
				const {INDICATOR, PARAMETER} = COLUMN_TYPES;
				const targetType = type === PARAMETER ? INDICATOR : PARAMETER;
				const targetColumns = this.props.columns.filter(({type}) => type === targetType);
				const targetColumnsWidth = sumColumnsWidth(newColumnsWidth, targetColumns);
				const addRatio = 1 + diff / targetColumnsWidth;

				targetColumns.forEach(({accessor, columns}) => {
					newColumnsWidth[accessor] *= addRatio;

					if (columns && columns.length > 0) {
						columns.forEach(({accessor}) => {
							newColumnsWidth[accessor] *= addRatio;
						});
					}
				});
			}
		}

		return newColumnsWidth;
	};

	handleBodyScroll = (e: SyntheticEvent<HTMLDivElement>) => {
		const {scrollLeft} = e.currentTarget;
		const {current: header} = this.headerRef;
		const {current: footer} = this.footerRef;
		const {current: total} = this.totalRef;

		[header, footer, total].forEach(element => {
			if (element) {
				element.scrollLeft = scrollLeft;
			}
		});
	};

	handleChangeColumnWidth = (columnWidth: number, column: Column) => {
		const {columns, columnsRatioWidth, getNewColumnsWidth = this.getNewColumnsWidth, onChangeColumnWidth} = this.props;
		const {columnsWidth} = this.state;
		const {current: container} = this.tableRef;
		const {accessor} = column;

		if (container) {
			const {clientWidth: containerWidth} = container;
			const newColumnsWidth = getNewColumnsWidth(column, columnWidth, columnsWidth, containerWidth);
			const fixedPositions = this.getFixedPositions(newColumnsWidth);
			const width = sumColumnsWidth(newColumnsWidth, columns);

			if (width >= containerWidth) {
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

		this.setState({sorting}, this.fetch);
		onChangeSorting && onChangeSorting(sorting);
	};

	handleNextClick = () => this.setState({page: this.state.page + 1}, this.fetch);

	handlePrevClick = () => this.setState({page: this.state.page - 1}, this.fetch);

	handleResize = (newWidth: number) => {
		const {columns} = this.props;
		const {columnsWidth, containerWidth} = this.state;

		if (newWidth !== containerWidth) {
			let newColumnsWidth = columnsWidth;

			newColumnsWidth = this.getColumnsWidthByTableWidth(newWidth, columns, newColumnsWidth);
			newColumnsWidth = this.applyColumnsRatioWidth(newWidth, newColumnsWidth);

			const width = sumColumnsWidth(newColumnsWidth, columns);
			const fixedPositions = this.getFixedPositions(newColumnsWidth);

			this.setState({columnsWidth: newColumnsWidth, containerWidth: newWidth, fixedPositions, width});
		}
	};

	renderBody = () => {
		const {data, onClickDataCell, pageSize, rowAggregations, settings} = this.props;
		const {columnsWidth, components, dataColumns, fixedPositions, page, sorting, width} = this.state;

		return (
			<Body
				columns={dataColumns}
				columnsWidth={columnsWidth}
				components={components}
				data={data}
				fixedPositions={fixedPositions}
				onChangeScrollBarWidth={this.handleChangeScrollBarWidth}
				onClickCell={onClickDataCell}
				onScroll={this.handleBodyScroll}
				page={page}
				pageSize={pageSize}
				rowAggregations={rowAggregations}
				settings={settings}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderFooter = () => {
		const {columns} = this.props;
		const {columnsWidth, components, dataColumns, fixedPositions, scrollBarWidth, width} = this.state;
		const hasFooter = columns.find(i => i.footer);

		if (hasFooter) {
			return (
				<Footer
					columns={dataColumns}
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
				columnSettings={columnHeader}
				columns={columns}
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

	renderLoading = () => this.props.loading && <div className={styles.loading}><T text="Table::Loading" /></div>;

	renderNoData = () => {
		const {data} = this.props;

		return data.length === 0 ? <div className={styles.noData}><T text="Table::EmptyData" /></div> : null;
	};

	renderPagination = () => {
		const {data, pageSize, total} = this.props;
		const {page, width} = this.state;
		const pages = Math.max(Math.ceil(total / pageSize), 1);
		const {current} = this.tableRef;

		if (data.length > 0 && width > 0 && current) {
			return (
				<Pagination
					onNextClick={this.handleNextClick}
					onPrevClick={this.handlePrevClick}
					page={page}
					total={pages}
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
					{this.renderTotal()}
				</div>
			);
		}

		return null;
	};

	renderTotal = () => {
		const {countTotals} = this.props;
		const {columnsWidth, components, dataColumns, fixedPositions, scrollBarWidth, width} = this.state;

		if (countTotals) {
			return (
				<Total
					columns={dataColumns}
					columnsWidth={columnsWidth}
					components={components}
					countTotals={countTotals}
					fixedPositions={fixedPositions}
					forwardedRef={this.totalRef}
					scrollBarWidth={scrollBarWidth}
					width={width}
				/>
			);
		}

		return null;
	};

	render () {
		const {className} = this.props;

		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={cn(styles.container, className)} ref={this.tableRef}>
					{this.renderTable()}
					{this.renderNoData()}
					{this.renderLoading()}
					{this.renderPagination()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Table;
