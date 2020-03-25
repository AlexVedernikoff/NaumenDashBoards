// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	renderFieldsByType = () => {
		const {type} = this.props.values;
		const {BAR, BAR_STACKED} = WIDGET_TYPES;

		return [BAR, BAR_STACKED].includes(type) ? this.renderVerticalInputs() : this.renderHorizontalInputs();
	};

	renderHorizontalInputs = () => (
		<Fragment>
			{this.renderLabel('Ось Х')}
			{this.renderByOrder(this.renderXAxis(true), false)}
			{this.renderLabel('Ось Y')}
			{this.renderByOrder(this.renderYAxis(true))}
			{this.renderByOrder(this.renderBreakdown)}
		</Fragment>
	);

	renderVerticalInputs = () => (
		<Fragment>
			{this.renderLabel('Ось X')}
			{this.renderByOrder(this.renderYAxis(true))}
			{this.renderByOrder(this.renderBreakdown)}
			{this.renderLabel('Ось Y')}
			{this.renderByOrder(this.renderXAxis(false))}
		</Fragment>
	);

	renderXAxis = (withDivider: boolean = true) => (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.group,
			type: 'group',
			value: set[FIELDS.group]
		};

		const props = {
			name: FIELDS.xAxis,
			refInputProps,
			value: set[FIELDS.xAxis],
			withDivider
		};

		return this.renderAttribute(index, props);
	};

	renderYAxis = (withDivider: boolean = true) => (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.aggregation,
			type: 'aggregation',
			value: set[FIELDS.aggregation]
		};

		const props = {
			name: FIELDS.yAxis,
			refInputProps,
			value: set[FIELDS.yAxis],
			withCreate: true,
			withDivider
		};

		return this.renderAttribute(index, props);
	};

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderFieldsByType()}
			</Fragment>
		);
	}
}

export default withForm(AxisChart);
