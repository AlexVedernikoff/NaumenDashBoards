// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms/Divider/Divider';
import {FIELDS, getAggregateOptions, getGroupOptions} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class BarChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	renderInputs = () => {
		const {values} = this.props;

		const xAxis = {
			border: false,
			onSelect: this.handleSelectWithRef(FIELDS.group, getGroupOptions),
			name: FIELDS.xAxis,
			placeholder: 'Ось Y',
			value: values[FIELDS.xAxis]
		};

		const yAxis = {
			border: false,
			onSelect: this.handleSelectWithRef(FIELDS.aggregation, getAggregateOptions),
			name: FIELDS.yAxis,
			placeholder: 'Ось X',
			value: values[FIELDS.yAxis]
		};

		return (
			<Fragment>
				{this.renderSourceInput()}
				<Divider />
				{this.combineInputs(
					this.renderAggregateInput(FIELDS.aggregation, FIELDS.yAxis),
					this.renderAttrSelect(yAxis)
				)}
				{this.combineInputs(
					this.renderGroupInput(),
					this.renderAttrSelect(xAxis)
				)}
				{this.renderBreakdownWithGroup(FIELDS.breakdownGroup, FIELDS.breakdown)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(BarChart);
