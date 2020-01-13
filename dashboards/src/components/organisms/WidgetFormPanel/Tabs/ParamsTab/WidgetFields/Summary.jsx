// @flow
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Summary extends DataFormBuilder {
	sourceRefs = [FIELDS.indicator];

	renderInputs = () => {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderLabel('Показатель')}
				{this.renderByOrder(this.renderIndicator, FIELDS.indicator)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(Summary);
