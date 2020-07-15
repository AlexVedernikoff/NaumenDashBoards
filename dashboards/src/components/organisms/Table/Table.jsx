// @flow
import {Body, Footer, Header, Pagination} from './components';
import {DEFAULT_COLUMN_WIDTH} from './components/Cell/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, hasPercent, parseMSInterval} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {ResizeDetector} from 'components/molecules';
import {ROW_NUM_COLUMN} from './constants';
import styles from './styles.less';
import type {TableSorting} from 'store/widgets/data/types';

export class Table extends PureComponent<Props, State> {
	ref: Ref<'div'> = createRef();

	state = {
		columns: [],
		columnsWidth: [],
		data: [],
		page: 1,
		pageSize: 10,
		usesMSInterval: false,
		usesPercent: false,
		width: NaN
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {data: buildData, widget} = props;
		const buildSet = getBuildSet(widget);
		let {columns, data} = buildData;

		if (widget.table.body.showRowNum) {
			columns = [ROW_NUM_COLUMN, ...columns];
		}

		return {
			...state,
			columns,
			data,
			usesMSInterval: hasMSInterval(buildSet, FIELDS.column),
			usesPercent: hasPercent(buildSet)
		};
	}

	handleChangeColumnWidth = (columnWidth: number, index: number) => {
		const {columnsWidth} = this.state;
		columnsWidth[index] = columnWidth;
		const width = columnsWidth.reduce(this.sumColumnsWidth);

		this.setState({columnsWidth, width});
	};

	handleChangeSorting = (sorting: TableSorting) => {
		const {onUpdate, widget} = this.props;
		onUpdate({...widget, sorting});
	};

	handleFinishedChangeColumnWidth = (index: number) => {
		const {onUpdate, widget} = this.props;
		const {columns, columnsWidth} = this.state;
		const {current: container} = this.ref;
		const width = columnsWidth[index];
		let {columnsRatioWidth} = widget;

		if (container) {
			if (columnsRatioWidth.length !== columns.length) {
				columnsRatioWidth = columns.map((c, index) => columnsRatioWidth[index]);
			}

			columnsRatioWidth[index] = Number((width / container.clientWidth).toFixed(2));
			onUpdate({...widget, columnsRatioWidth});
		}
	};

	handleNextClick = () => this.setState({page: this.state.page + 1});

	handlePrevClick = () => this.setState({page: this.state.page - 1});

	handleResize = (widgetWidth: number) => {
		const {widget} = this.props;
		const {columns} = this.state;
		const {columnsRatioWidth} = widget;

		const columnsWidth = columns.map((item, i) => {
			return columnsRatioWidth[i] ? widgetWidth * columnsRatioWidth[i] : DEFAULT_COLUMN_WIDTH;
		});
		const width = columnsWidth.reduce(this.sumColumnsWidth);

		this.setState({columnsWidth, width});
	};

	sumColumnsWidth = (sum: number, width: number) => sum + width;

	renderBody = () => {
		const {sorting, table} = this.props.widget;
		const {columns, columnsWidth, data, page, pageSize, width} = this.state;

		return (
			<Body
				columns={columns}
				columnsWidth={columnsWidth}
				data={data}
				page={page}
				pageSize={pageSize}
				renderValue={this.renderValue}
				settings={table}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderFooter = () => {
		const {columns, columnsWidth, width} = this.state;
		const hasFooter = columns.find(i => i.footer);

		return hasFooter ? <Footer columns={columns} columnsWidth={columnsWidth} renderValue={this.renderValue} width={width} /> : null;
	};

	renderHeader = () => {
		const {sorting, table} = this.props.widget;
		const {columns, columnsWidth, data, width} = this.state;
		const {columnHeader} = table;

		return (
			<Header
				columns={columns}
				columnSettings={columnHeader}
				columnsWidth={columnsWidth}
				data={data}
				onChangeColumnWidth={this.handleChangeColumnWidth}
				onChangeSorting={this.handleChangeSorting}
				onFinishedChangeColumnWidth={this.handleFinishedChangeColumnWidth}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderNoData = () => {
		const {data} = this.props.data;
		return data.length === 0 ? <div className={styles.noData}>Данные отсутствуют</div> : null;
	};

	renderPagination = () => {
		const {data} = this.props.data;
		const {page, pageSize, width} = this.state;
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

		if (width) {
			return (
				<table cellPadding={0} cellSpacing={0} className={styles.table}>
					{this.renderHeader()}
					{this.renderBody()}
					{this.renderFooter()}
					{this.renderNoData()}
				</table>
			);
		}
	};

	renderValue = (value: number | string) => {
		const {usesMSInterval, usesPercent} = this.state;

		if (usesMSInterval) {
			return parseMSInterval(Number(value));
		}

		if (usesPercent) {
			return `${value}%`;
		}

		return value;
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={styles.container} ref={this.ref}>
					{this.renderTable()}
					{this.renderPagination()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Table;
