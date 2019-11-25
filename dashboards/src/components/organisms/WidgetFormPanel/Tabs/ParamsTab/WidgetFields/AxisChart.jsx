// @flow
import {CHART_VARIANTS} from 'utils/chart';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS, getAggregateOptions, getGroupOptions} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	renderXAxis = (withDivider: boolean = true) => {
		const {values} = this.props;
		const {group, xAxis} = FIELDS;

		const props = {
			name: xAxis,
			onSelect: this.handleSelectWithRef(group, getGroupOptions),
			refInput: this.renderGroup(group, xAxis),
			value: values[xAxis],
			withDivider
		};

		return this.renderAttribute(props);
	};

	renderYAxis = (withDivider: boolean = true) => {
		const {values} = this.props;
		const {aggregation, yAxis} = FIELDS;

		const props = {
			name: yAxis,
			onSelect: this.handleSelectWithRef(aggregation, getAggregateOptions),
			refInput: this.renderAggregation(aggregation, yAxis),
			value: values[yAxis],
			withDivider
		};

		return this.renderAttribute(props);
	};

	renderBarInputs = () => (
		<Fragment>
			{this.renderLabel('Источник')}
			{this.renderSource()}
			{this.renderSectionDivider()}
			{this.renderLabel('Ось X')}
			{this.renderYAxis()}
			{this.renderBreakdownWithExtend()}
			{this.renderLabel('Ось Y')}
			{this.renderXAxis(false)}
		</Fragment>
	);

	renderBaseInputs = () => (
		<Fragment>
			{this.renderLabel('Источник')}
			{this.renderSource()}
			{this.renderSectionDivider()}
			{this.renderLabel('Ось Х')}
			{this.renderXAxis()}
			{this.renderLabel('Ось Y')}
			{this.renderYAxis()}
			{this.renderBreakdownWithExtend()}
		</Fragment>
	);

	render () {
		const {type} = this.props.values;
		const {BAR, BAR_STACKED} = CHART_VARIANTS;

		return [BAR, BAR_STACKED].includes(type) ? this.renderBarInputs() : this.renderBaseInputs();
	}
}

export default withForm(AxisChart);
