// @flow
import {CHART_VARIANTS} from 'utils/chart';
import {createRefName} from 'utils/widget';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	renderXAxis = (withDivider: boolean = true) => (name: string) => {
		const {values} = this.props;
		const groupName = createRefName(name, FIELDS.group);

		const refInput = {
			name: groupName,
			type: 'group',
			value: values[groupName]
		};

		const props = {
			name,
			refInput,
			value: values[name],
			withDivider
		};

		return this.renderAttribute(props);
	};

	renderYAxis = (withDivider: boolean = true) => (name: string) => {
		const {values} = this.props;
		const aggregationName = createRefName(name, FIELDS.aggregation);

		const refInput = {
			name: aggregationName,
			type: 'aggregation',
			value: values[aggregationName]
		};

		const props = {
			name,
			refInput,
			value: values[name],
			withCreate: true,
			withDivider
		};

		return this.renderAttribute(props);
	};

	renderBarInputs = () => {
		const {breakdown, xAxis, yAxis} = FIELDS;

		return (
			<Fragment>
				{this.renderLabel('Ось X')}
				{this.renderByOrder(this.renderYAxis(true), yAxis)}
				{this.renderByOrder(this.renderBreakdown, breakdown)}
				{this.renderLabel('Ось Y')}
				{this.renderByOrder(this.renderXAxis(false), xAxis)}
			</Fragment>
		);
	};

	renderBaseInputs = () => {
		const {breakdown, xAxis, yAxis} = FIELDS;

		return (
			<Fragment>
				{this.renderLabel('Ось Х')}
				{this.renderByOrder(this.renderXAxis(true), xAxis, false)}
				{this.renderLabel('Ось Y')}
				{this.renderByOrder(this.renderYAxis(true), yAxis)}
				{this.renderByOrder(this.renderBreakdown, breakdown)}
			</Fragment>
		);
	};

	renderFieldsByType = () => {
		const {type} = this.props.values;
		const {BAR, BAR_STACKED} = CHART_VARIANTS;

		return [BAR, BAR_STACKED].includes(type) ? this.renderBarInputs() : this.renderBaseInputs();
	};

	render () {
		return (
			<Fragment>
				{this.renderSourceSection()}
				{this.renderFieldsByType()}
			</Fragment>
		);
	}
}

export default withForm(AxisChart);
