// @flow
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import TableBox from 'TableWidgetForm/components/TableBox';
import {TABLE_FIELDS} from 'TableWidgetForm/constants';

export class StyleTab extends Component<Props> {
	handleChange = (name: string, data: Object) => {
		const {onChange} = this.props;

		onChange(name, data);
	};

	render () {
		const {header, table} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox name={TABLE_FIELDS.header} onChange={this.handleChange} value={header} />
				<TableBox name={TABLE_FIELDS.table} onChange={this.handleChange} value={table} />
			</div>
		);
	}
}

export default StyleTab;
