// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Summary extends DataFormBuilder {
	renderInputs = () => (
		<Fragment>
			{this.renderSourceInput()}
			{this.renderIndicatorInput()}
			{this.renderAggregateInput(FIELDS.aggregate, FIELDS.indicator)}
		</Fragment>
	);

	render () {
		return this.renderInputs();
	}
}

export default withForm(Summary);
