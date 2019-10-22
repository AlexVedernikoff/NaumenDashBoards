// @flow
import type {AttrSelectProps} from 'components/organisms/WidgetFormPanel/types';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class AxisChart extends DataFormBuilder {
	renderInputs = () => {
		const {values} = this.props;

		const indicator: AttrSelectProps = {
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
				{this.renderBreakdownInput()}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(AxisChart);
