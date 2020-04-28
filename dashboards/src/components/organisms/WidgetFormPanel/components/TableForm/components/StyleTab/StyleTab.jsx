// @flow
import {DEFAULT_TABLE_SETTINGS} from 'components/organisms/Table/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {HeaderBox} from 'WidgetFormPanel/components';
import React, {Component} from 'react';
import type {StyleTabProps} from 'WidgetFormPanel/types';
import styles from './styles.less';
import {TableBox} from 'WidgetFormPanel/components/TableForm/components';

export class StyleTab extends Component<StyleTabProps> {
	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;
		setFieldValue(name, data);
	};

	render () {
		const {
			header,
			table = DEFAULT_TABLE_SETTINGS
		} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<TableBox data={table} name={FIELDS.table} onChange={this.handleChange} />
			</div>
		);
	}
}

export default StyleTab;
