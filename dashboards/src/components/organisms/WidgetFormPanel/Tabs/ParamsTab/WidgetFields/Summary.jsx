// @flow
import {Divider} from 'components/atoms';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Summary extends OrderFormBuilder {
	sourceRefs = [FIELDS.indicator];

	renderIndicatorWithAggregation = (aggregation: string, indicator: string) => this.renderCombinedInputs(
		this.renderAggregateInput(aggregation, indicator),
		this.renderIndicatorInput(indicator),
		false
	);

	renderIndicatorInput = (indicator: string) => {
		const {values} = this.props;

		const props = {
			border: false,
			getOptionLabel: this.getLabelWithSource,
			name: indicator,
			placeholder: 'Показатель',
			value: values[indicator],
			withCreateButton: true
		};

		return this.renderAttrSelect(props);
	};

	renderInputs = () => {
		const {aggregation, indicator, source} = FIELDS;

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(false), source)}
				<Divider />
				{this.renderByOrder(this.renderIndicatorWithAggregation, [aggregation, indicator], true)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(Summary);
