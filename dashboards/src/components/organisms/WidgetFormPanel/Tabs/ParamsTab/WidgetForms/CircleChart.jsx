// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	renderInputs = () => (
		<Fragment>
			{this.renderSourceInput()}
			{this.renderBreakdownInput()}
		</Fragment>
	);

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
