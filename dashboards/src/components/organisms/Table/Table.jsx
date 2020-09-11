// @flow
import {Body, Cell, Footer, Header, HeaderCell, Pagination, Row} from './components';
import {DEFAULT_COLUMN_WIDTH} from './components/Cell/constants';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {ResizeDetector} from 'components/molecules';
import styles from './styles.less';

export class Table extends PureComponent<Props, State> {
	components = {
		Cell,
		HeaderCell,
		Row,
		Value: this.renderDisplayValue
	};
	ref: Ref<'div'> = createRef();

	state = {
		columnsWidth: [],
		page: 1,
		pageSize: 30,
		width: NaN
	};

	componentDidMount () {
		const {columns, columnsRatioWidth} = this.props;
		const {width} = this.state;
		const columnsWidth = columns.map((column, index) => {
			return columnsRatioWidth[index] ? Number(columnsRatioWidth[index] * width) : DEFAULT_COLUMN_WIDTH;
		});

		this.setState({columnsWidth});
	}

	getComponents = () => {
		const {components} = this.props;
		return components ? {...this.components, ...components} : this.components;
	};

	handleChangeColumnWidth = (columnWidth: number, index: number) => {
		const {columns, onChangeColumnWidth} = this.props;
		const {current: container} = this.ref;
		let {columnsRatioWidth} = this.props;
		let {columnsWidth} = this.state;

		columnsWidth[index] = columnWidth;

		this.setState({columnsWidth, width: columnsWidth.reduce(this.sumColumnsWidth)});

		if (container) {
			if (columnsRatioWidth.length !== columns.length) {
				columnsRatioWidth = columnsRatioWidth.slice(0, columns.length);
			}

			columnsRatioWidth[index] = Number((columnWidth / container.clientWidth).toFixed(2));
			onChangeColumnWidth(columnsRatioWidth);
		}
	};

	handleNextClick = () => this.setState({page: this.state.page + 1});

	handlePrevClick = () => this.setState({page: this.state.page - 1});

	handleResize = (widgetWidth: number) => {
		const {columns, columnsRatioWidth} = this.props;

		const columnsWidth = columns.map((item, i) => {
			return columnsRatioWidth[i] ? widgetWidth * columnsRatioWidth[i] : DEFAULT_COLUMN_WIDTH;
		});
		const width = columnsWidth.reduce(this.sumColumnsWidth);
		this.setState({columnsWidth, width});
	};

	sumColumnsWidth = (sum: number, width: number) => sum + width;

	renderBody = () => {
		const {columns, data, onClickDataCell, settings, sorting} = this.props;
		const {columnsWidth, page, pageSize, width} = this.state;

		return (
			<Body
				columns={columns}
				columnsWidth={columnsWidth}
				components={this.getComponents()}
				data={data}
				onClickDataCell={onClickDataCell}
				page={page}
				pageSize={pageSize}
				settings={settings}
				sorting={sorting}
				width={width}
			/>
		);
	};

	renderDisplayValue (props: Object) {
		return props.value;
	}

	renderFooter = () => {
		const {columns} = this.props;
		const {columnsWidth, width} = this.state;
		const hasFooter = columns.find(i => i.footer);

		if (hasFooter) {
			return (
				<Footer
					columns={columns}
					columnsWidth={columnsWidth}
					components={this.getComponents()}
					width={width}
				/>
			);
		}
	};

	renderHeader = () => {
		const {columns, data, onChangeSorting, settings, sorting} = this.props;
		const {columnsWidth} = this.state;
		const {width} = this.state;
		const {columnHeader} = settings;

		return (
			<Header
				columns={columns}
				columnSettings={columnHeader}
				columnsWidth={columnsWidth}
				components={this.getComponents()}
				data={data}
				onChangeColumnWidth={this.handleChangeColumnWidth}
				onChangeSorting={onChangeSorting}
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

	render () {
		return (
			<ResizeDetector className={styles.container} forwardedRef={this.ref} onResize={this.handleResize}>
				{this.renderTable()}
				{this.renderPagination()}
			</ResizeDetector>
		);
	}
}

export default Table;
