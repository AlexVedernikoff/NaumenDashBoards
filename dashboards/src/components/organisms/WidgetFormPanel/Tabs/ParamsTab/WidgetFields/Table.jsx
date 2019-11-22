// @flow
import {Divider} from 'components/atoms';
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Table extends OrderFormBuilder {
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

	renderColumnInput = (name: string) => {
		const {values} = this.props;

		const row = {
			border: false,
			name,
			placeholder: 'Столбцы',
			value: values[name],
			withCreateButton: true
		};

		return this.renderAttrSelect(row);
	};

	renderColumnWithAggregation = (aggregation: string, column: string) => this.renderCombinedInputs(
		this.renderAggregateInput(aggregation, column),
		this.renderColumnInput(column)
	);

	renderRowInput = (name: string) => {
		const {values} = this.props;

		const row = {
			name,
			placeholder: 'Строки',
			value: values[name]
		};

		return (
			<div className={styles.field} key={name}>
				{this.renderAttrSelect(row)}
			</div>
		);
	};

	renderTableBreakdownWithGroup = (breakdownGroup: string, breakdown: string) => this.renderBreakdownWithGroup(breakdownGroup, breakdown, false);

	render () {
		const {aggregation, breakdown, breakdownGroup, calcTotalRow, calcTotalColumn, column, row, source} = FIELDS;

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(false), source)}
				<Divider />
				{this.renderByOrder(this.renderRowInput, row, true)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalRow, true)}
				{this.renderByOrder(this.renderColumnWithAggregation, [aggregation, column], true)}
				{this.renderByOrder(this.renderTableBreakdownWithGroup, [breakdownGroup, breakdown], true)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalColumn, true)}
			</Fragment>
		);
	}
}

export default withForm(Table);
