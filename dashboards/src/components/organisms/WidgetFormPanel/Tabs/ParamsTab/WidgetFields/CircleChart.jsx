// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.indicator];

	render () {
		const {breakdown, indicator} = FIELDS;

		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderLabel('Показатель')}
				{this.renderByOrder(this.renderIndicator, indicator)}
				{this.renderByOrder(this.renderBreakdown, breakdown)}
			</Fragment>
		);
	}
}

export default withForm(AxisChart);
