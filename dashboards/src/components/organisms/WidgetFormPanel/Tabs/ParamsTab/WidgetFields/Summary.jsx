// @flow
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Summary extends OrderFormBuilder {
	sourceRefs = [FIELDS.indicator];

	renderSummaryIndicator = (indicator: string, aggregation: string) => {
		const props = {
			withCreate: true,
			withDivider: false
		};

		return this.renderIndicator(indicator, aggregation, props);
	};

	renderInputs = () => {
		const {aggregation, indicator, source} = FIELDS;

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(false), source)}
				{this.renderSectionDivider()}
				{this.renderLabel('Показатель')}
				{this.renderByOrder(this.renderSummaryIndicator, [indicator, aggregation], true)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(Summary);
