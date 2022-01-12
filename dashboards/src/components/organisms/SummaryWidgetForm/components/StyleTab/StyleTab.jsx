// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import IndicatorBox from 'components/organisms/SummaryWidgetForm/components/IndicatorBox';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class StyleTab extends Component<Props> {
	handleChange = (name: string, data: Object, callback?: Function) => {
		const {onChange} = this.props;

		onChange(name, data, callback);
	};

	render () {
		const {header, indicator} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={this.handleChange} value={header} />
				<IndicatorBox name={DIAGRAM_FIELDS.indicator} onChange={this.handleChange} value={indicator} />
			</div>
		);
	}
}

export default StyleTab;
