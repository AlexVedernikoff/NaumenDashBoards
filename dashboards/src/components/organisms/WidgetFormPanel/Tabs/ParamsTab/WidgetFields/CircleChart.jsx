// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.indicator];

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderLabel('Показатель')}
				{this.renderByOrder(this.renderIndicator)}
				{this.renderByOrder(this.renderBreakdown)}
			</Fragment>
		);
	}
}

export default withForm(AxisChart);
