// @flow
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS, getAggregateOptions} from 'components/organisms/WidgetFormPanel';
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

	renderColumn = (name: string, aggregationName: string) => {
		const {values} = this.props;

		const props = {
			name,
			onSelect: this.handleSelectWithRef(aggregationName, getAggregateOptions),
			refInput: this.renderAggregation(aggregationName, name),
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
		const {aggregation, breakdown, breakdownGroup, calcTotalRow, calcTotalColumn, column, row, source, withBreakdown} = FIELDS;

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(false), source)}
				{this.renderSectionDivider()}
				{this.renderLabel('Строки')}
				{this.renderByOrder(this.renderRowInput, row, true)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalRow, true)}
				{this.renderLabel('Колонки')}
				{this.renderByOrder(this.renderColumn, [column, aggregation], true)}
				{this.renderByOrder(this.renderBreakdownWithExtend, [withBreakdown, breakdown, breakdownGroup], true)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalColumn, true)}
			</Fragment>
		);
	}
}

export default withForm(Table);
