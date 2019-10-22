// @flow
import type {AttrSelectProps, CheckBoxProps} from 'components/organisms/WidgetFormPanel/types';
import {OrderFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Table extends OrderFormBuilder {
	defaultOrder = [1];

	renderCalcTotalInput = (name: string) => {
		const {values} = this.props;

		const totalRow: CheckBoxProps = {
			label: 'Подсчитывать итоги',
			name,
			value: values[name]
		};

		return this.renderCheckBox(totalRow);
	};

	renderColumnInput = (name: string) => {
		const {values} = this.props;

		const row: AttrSelectProps = {
			name,
			placeholder: 'Столбцы',
			value: values[name]
		};

		return this.renderAttrSelect(row);
	};

	renderCompositeInputs = (aggregation: string, column: string) => this.combineInputs(
		this.renderAggregateInput(aggregation, column),
		this.renderColumnInput(column)
	);

	renderRowInput = (name: string) => {
		const {values} = this.props;

		const row: AttrSelectProps = {
			name,
			placeholder: 'Строки',
			value: values[name],
			withCreateButton: true
		};

		return this.renderAttrSelect(row);
	};

	renderInputs = () => {
		const {aggregation, breakdown, calcTotalRow, calcTotalColumn, column, row, source} = FIELDS;

		return (
			<Fragment>
				{this.renderModal()}
				{this.renderAddSourceInput()}
				{this.renderByOrder(this.renderOrderSource(false), source)}
				{this.renderByOrder(this.renderRowInput, row, true)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalRow, true)}
				{this.renderByOrder(this.renderCompositeInputs, [aggregation, column], true)}
				{this.renderByOrder(this.renderBreakdownInput, breakdown, true)}
				{this.renderByOrder(this.renderCalcTotalInput, calcTotalColumn, true)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(Table);
