// @flow
import {createRefName} from 'utils/widget';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Table extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.column, FIELDS.row];

	renderCalcTotalInput = (name: string) => {
		const {values} = this.props;

		const totalRow = {
			hideDivider: true,
			label: 'Подсчитывать итоги',
			name,
			value: values[name]
		};

		return this.renderCheckBox(totalRow);
	};

	renderColumn = (name: string) => {
		const {values} = this.props;
		const aggregationName = createRefName(name, FIELDS.aggregation);

		const refInputProps = {
			name: aggregationName,
			type: 'aggregation',
			value: values[aggregationName]
		};

		const props = {
			name,
			refInputProps,
			value: values[name],
			withCreate: true
		};

		return this.renderAttribute(props);
	};

	renderRowInput = (name: string) => {
		const {values} = this.props;

		const row = {
			name,
			value: values[name],
			withDivider: true
		};

		return this.renderAttribute(row);
	};

	render () {
		const {breakdown, calcTotalColumn, calcTotalRow, column, row} = FIELDS;

		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderLabel('Строки')}
				{this.renderByOrder(this.renderRowInput, row, false)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalRow)}
				{this.renderLabel('Колонки')}
				{this.renderByOrder(this.renderColumn, column)}
				{this.renderByOrder(this.renderBreakdown, breakdown)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalColumn)}
			</Fragment>
		);
	}
}

export default withForm(Table);
