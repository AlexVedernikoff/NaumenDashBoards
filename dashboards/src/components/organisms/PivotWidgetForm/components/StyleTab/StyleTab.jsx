// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import PivotStyleBox from 'PivotWidgetForm/components/PivotStyleBox';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class StyleTab extends Component<Props> {
	handleChange = (name: string, data: Object) => {
		const {onChange} = this.props;

		onChange(name, data);
	};

	render () {
		const {header, pivot} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={this.handleChange} value={header} />
				<PivotStyleBox name={DIAGRAM_FIELDS.pivot} onChange={this.handleChange} value={pivot} />
			</div>
		);
	}
}

export default StyleTab;
