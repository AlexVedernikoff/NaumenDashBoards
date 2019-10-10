// @flow
import 'react-table/react-table.css';
import type {Props, State} from './types';
import React, {Component} from 'react';
import ReactTable from 'react-table';
import styles from './styles.less';

export class Table extends Component<Props, State> {
	static getDerivedStateFromProps (props: Props, state: State) {
		const {columns, data} = props.data;

		if (Array.isArray(columns) && Array.isArray(data)) {
			state = {columns, data};
		}

		return state;
	}

	render () {
		const {columns, data} = this.state;

		return (
			<ReactTable
				className={styles.table}
				columns={columns}
				data={data}
			/>
		);
	}
}

export default Table;
