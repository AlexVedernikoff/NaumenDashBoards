// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBox} from 'components/molecules';
import React, {Fragment} from 'react';

export class ParamsTab extends DataFormBuilder {
	sourceRefs = [FIELDS.indicator];

	renderIndicatorSection = () => (
		<FormBox title="Показатель">
			{this.renderByOrder(this.renderIndicator)}
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
