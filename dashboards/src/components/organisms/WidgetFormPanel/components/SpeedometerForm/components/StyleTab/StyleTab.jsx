// @flow
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'WidgetFormPanel/constants';
import {HeaderBox} from 'WidgetFormPanel/components';
import {IndicatorStyleBox as IndicatorBox} from 'WidgetFormPanel/components/SpeedometerForm/components';
import React, {Component} from 'react';
import type {StyleTabProps} from 'WidgetFormPanel/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;
		setFieldValue(name, data);
	};

	render () {
		const {header, indicator} = this.props.values;

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<IndicatorBox
					data={extend(DEFAULT_SPEEDOMETER_SETTINGS.indicator, indicator)}
					name={FIELDS.indicator}
					onChange={this.handleChange}
				/>
			</div>
		);
	}
}

export default StyleTab;
