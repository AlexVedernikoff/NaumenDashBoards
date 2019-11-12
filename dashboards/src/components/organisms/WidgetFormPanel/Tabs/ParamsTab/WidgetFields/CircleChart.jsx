// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.indicator];

	renderInputs = () => {
		const {values} = this.props;

		const indicator = {
			border: false,
			name: FIELDS.indicator,
			placeholder: 'Показатель',
			value: values[FIELDS.indicator]
		};

		return (
			<Fragment>
				{this.renderSourceInput()}
				{this.combineInputs(
					this.renderAggregateInput(FIELDS.aggregation, FIELDS.indicator),
					this.renderAttrSelect(indicator)
				)}
				{this.renderBreakdownWithGroup(FIELDS.breakdownGroup, FIELDS.breakdown)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
