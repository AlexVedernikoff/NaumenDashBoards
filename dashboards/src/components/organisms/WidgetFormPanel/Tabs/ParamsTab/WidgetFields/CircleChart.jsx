// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.indicator];

	renderInputs = () => (
		<Fragment>
			{this.renderLabel('Источник')}
			{this.renderSource()}
			{this.renderSectionDivider()}
			{this.renderLabel('Показатель')}
			{this.renderIndicator()}
			{this.renderBreakdownWithExtend()}
		</Fragment>
	);

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
