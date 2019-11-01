// @flow
import 'react-table/react-table.css';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
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

	renderTable = () => {
		const {columns, data} = this.state;

		return (
			<ReactTable
				className={styles.table}
				columns={columns}
				data={data}
				defaultPageSize={10}
				loadingText="Загрузка данных..."
				nextText="Следующая"
				ofText="из"
				pageText="Страница"
				previousText="Предыдущая"
				rowsText="строк"
				showPageJump={false}
				showPageSizeOptions={false}
			/>
		);
	};

	render () {
		return this.renderTable();
	}
}

export default Table;
