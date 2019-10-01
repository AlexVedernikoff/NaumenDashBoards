// @flow
import {AxisFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends AxisFormBuilder {
	renderInputs = () => {
		return (
			<Fragment>
				{this.renderSourceInput()}
				{this.renderXAxisInput()}
				{this.renderGroupInput()}
				{this.renderYAxisInput()}
				{this.renderAggregateInput()}
				{this.renderBreakdownInput()}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
