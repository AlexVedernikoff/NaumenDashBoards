// @flow
import 'react-table/react-table.css';
import type {Props, State} from './types';
import React, {Component, Fragment} from 'react';
import ReactTable from 'react-table';
import styles from './styles.less';

export class Table extends Component<Props, State> {
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

		return (
			<ReactTable
				className={styles.table}
				columns={columns}
				data={data}
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
