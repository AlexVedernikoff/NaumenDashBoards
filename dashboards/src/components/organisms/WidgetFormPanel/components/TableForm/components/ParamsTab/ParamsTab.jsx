// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBox} from 'components/molecules';
import React, {Fragment} from 'react';

export class ParamsTab extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.column, FIELDS.row];

	renderCalcTotalColumn = (index: number) => this.renderCalcTotalInput(index, FIELDS.calcTotalColumn);

	renderCalcTotalInput = (index: number, name: string) => {
		const {setDataFieldValue} = this.props;
		const set = this.getSet(index);

		const props = {
			label: 'Подсчитывать итоги',
			name,
			onClick: setDataFieldValue(index),
			value: set[name]
		};

		return this.renderCheckBox(props);
	};

	renderCalcTotalRow = (index: number) => this.renderCalcTotalInput(index, FIELDS.calcTotalRow);

	renderColumnInput = (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.aggregation,
			type: 'aggregation',
			value: set[FIELDS.aggregation]
		};

		const props = {
			name: FIELDS.column,
			refInputProps,
			value: set[FIELDS.column],
			withCreate: true
		};

		return this.renderAttribute(index, props);
	};

	renderColumnSection = (index: number) => (
		<FormBox title="Показатель">
			{this.renderColumnInput(index)}
			{this.renderBreakdown(index)}
			{this.renderCalcTotalColumn(index)}
		</FormBox>
	);

	renderRowField = (index: number) => (
		<Fragment>
			{this.renderRowInput(index)}
			{this.renderCalcTotalRow(index)}
		</Fragment>
	)

	renderRowInput = (index: number) => {
		const set = this.getSet(index);
		const props = {
			name: FIELDS.row,
			value: set[FIELDS.row]
		};

		return this.renderAttribute(index, props);
	};

	renderRowSection = () => (
		<FormBox title="Параметр">
			{this.renderByOrder(this.renderRowField, false)}
		</FormBox>
	)

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderRowSection()}
				{this.renderByOrder(this.renderColumnSection)}
			</Fragment>
		);
	}
}

export default ParamsTab;
