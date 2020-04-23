// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBox} from 'components/molecules';
import React, {Fragment} from 'react';

export class ParamsTab extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.indicator];

	renderIndicatorField = (index: number) => (
		<Fragment>
			{this.renderIndicator(index)}
			{this.renderBreakdown(index)}
		</Fragment>
	)

	renderIndicatorSection = () => (
		<FormBox title="Показатель">
			{this.renderByOrder(this.renderIndicatorField)}
		</FormBox>
	);

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderIndicatorSection()}
			</Fragment>
		);
	}
}

export default ParamsTab;
