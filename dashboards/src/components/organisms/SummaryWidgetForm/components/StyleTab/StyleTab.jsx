// @flow
import ComparePeriodStyle from 'components/organisms/SummaryWidgetForm/components/ComparePeriodStyle';
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
		const {comparePeriod, header, indicator} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={this.handleChange} value={header} />
				<IndicatorBox name={DIAGRAM_FIELDS.indicator} onChange={this.handleChange} useAutoFontSize={true} value={indicator} />
				{false && <ComparePeriodStyle name={DIAGRAM_FIELDS.comparePeriod} onChange={this.handleChange} value={comparePeriod} /> /* SMRMEXT-12334 */}
			</div>
		);
	}
}

export default StyleTab;
