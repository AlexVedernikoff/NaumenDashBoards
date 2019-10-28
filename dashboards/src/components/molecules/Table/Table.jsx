// @flow
import 'react-table/react-table.css';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import ReactTable from 'react-table';
import styles from './styles.less';

export class Table extends PureComponent<Props, State> {
	state = {
		columns: [],
		data: []
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {columns, data} = props.data;

		if (Array.isArray(columns) && Array.isArray(data)) {
			state = {columns, data};
		}

		return state;
	}

	renderName = () => {
		const {diagramName, showName} = this.props.widget;
		return showName && <p className={styles.name}>{diagramName}</p>;
	};

	renderTable = () => {
		const {columns, data} = this.state;
		const {showName} = this.props.widget;
		const CNTable = showName ? styles.tableWithName : styles.table;

		return (
			<ReactTable
				className={CNTable}
				columns={columns}
				data={data}
				defaultPageSize={10}
				loadingText="Загрузка данных..."
				nextText="Следующая"
				ofText="из"
				pageText="Страница"
				previousText="Предыдущая"
				rowsText="строк"
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderName()}
				{this.renderTable()}
			</Fragment>
		);
	}
}

export default Table;
