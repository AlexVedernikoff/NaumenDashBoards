// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBox} from 'components/molecules';
import React, {Fragment} from 'react';

export class ParamsTab extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	renderFields = () => (
		<Fragment>
			<FormBox title="Параметр">
				{this.renderByOrder(this.renderXAxis, false)}
			</FormBox>
			<FormBox title="Показатель">
				{this.renderByOrder(this.renderYAxis)}
			</FormBox>
		</Fragment>
	);

	renderXAxis = (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.group,
			type: 'group',
			value: set[FIELDS.group]
		};

		const props = {
			name: FIELDS.xAxis,
			refInputProps,
			value: set[FIELDS.xAxis]
		};

		return this.renderAttribute(index, props);
	};

	renderYAxis = (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.aggregation,
			type: 'aggregation',
			value: set[FIELDS.aggregation]
		};

		const props = {
			name: FIELDS.yAxis,
			refInputProps,
			value: set[FIELDS.yAxis],
			withCreate: true
		};

		return (
			<Fragment>
				{this.renderAttribute(index, props)}
				{this.renderBreakdown(index)}
			</Fragment>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderFields()}
			</Fragment>
		);
	}
}

export default ParamsTab;
