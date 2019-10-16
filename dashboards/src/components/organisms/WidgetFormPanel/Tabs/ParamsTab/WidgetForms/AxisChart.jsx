// @flow
import type {AttrSelectProps} from 'components/organisms/WidgetFormPanel/types';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms/Divider/Divider';
import {FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions} from 'utils/group';
import React, {Fragment} from 'react';
import styles from 'components/organisms/WidgetFormPanel/styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	renderInputs = () => {
		const {values} = this.props;

		const xAxis: AttrSelectProps = {
			handleSelect: this.handleSelectAxis(FIELDS.group, getGroupOptions),
			name: FIELDS.xAxis,
			placeholder: 'Ось X',
			value: values[FIELDS.xAxis]
		};

		const yAxis: AttrSelectProps = {
			handleSelect: this.handleSelectAxis(FIELDS.aggregation, getAggregateOptions),
			name: FIELDS.yAxis,
			placeholder: 'Ось Y',
			value: values[FIELDS.yAxis]
		};

		return (
			<Fragment>
				{this.renderSourceInput()}
				<Divider />
				<div className={styles.inputWrap}>
					{this.renderGroupInput()}
					{this.renderAttrSelect(xAxis)}
				</div>
				<Divider />
				<div className={styles.inputWrap}>
					{this.renderAggregateInput(FIELDS.aggregation, FIELDS.yAxis)}
					{this.renderAttrSelect(yAxis)}
				</div>
				{this.renderBreakdownInput()}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
