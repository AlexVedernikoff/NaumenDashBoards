// @flow
import 'react-table/react-table.css';
import {debounce} from 'src/helpers';
import type {DivRef} from 'components/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import ReactTable from 'react-table';
import styles from './styles.less';

export class Table extends PureComponent<Props, State> {
	ref: DivRef = createRef();

	state = {
		width: null
	};

	componentDidMount () {
		const {current} = this.ref;

		if (current) {
			const width = current.clientWidth;

			this.setColumnWidth(width);
			this.setState({width});
		}
	}

	handleResize = (rows: Array<Object>) => {
		const {data, onUpdate, widget} = this.props;
		const {columns} = data;
		const {current} = this.ref;

		if (current) {
			const {id: accessor, value: width} = rows[0];
			const index = columns.findIndex(column => column.accessor === accessor);
			let {rowsWidth = []} = widget;

			if (rowsWidth.length !== columns.length) {
				rowsWidth = columns.map((c, index) => rowsWidth[index]);
			}

			rowsWidth[index] = Number((width / current.clientWidth).toFixed(2));

			onUpdate({...widget, rowsWidth});
		}
	};

	setColumnWidth = (width: number) => {
		const {data, widget} = this.props;
		const {columns} = data;
		const {rowsWidth} = widget;

		if (Array.isArray(rowsWidth)) {
			columns.forEach((column, index) => {
				column.width = rowsWidth[index] ? width * rowsWidth[index] : undefined;
			});
		}
	};

	renderTable = () => {
		const {columns, data} = this.props.data;
		const {width} = this.state;

		if (width) {
			return (
				<ReactTable
					className={styles.table}
					columns={columns}
					data={data}
					defaultPageSize={10}
					loadingText="Загрузка данных..."
					nextText="Следующая"
					noDataText="Данные отсутствуют"
					ofText="из"
					onResizedChange={debounce(this.handleResize, 500)}
					pageText="Страница"
					previousText="Предыдущая"
					rowsText="строк"
					showPageJump={false}
					showPageSizeOptions={false}
				/>
			);
		}
	};

	render () {
		return (
			<div ref={this.ref}>
				{this.renderTable()}
			</div>
		);
	}
}

export default Table;
