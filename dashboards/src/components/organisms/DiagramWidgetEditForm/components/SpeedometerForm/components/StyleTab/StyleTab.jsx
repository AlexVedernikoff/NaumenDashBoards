// @flow
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'DiagramWidgetEditForm';
import {HeaderBox} from 'DiagramWidgetEditForm/components';
import {IndicatorStyleBox as IndicatorBox} from 'DiagramWidgetEditForm/components/SpeedometerForm/components';
import React, {Component} from 'react';
import type {StyleTabProps} from 'DiagramWidgetEditForm/types';
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