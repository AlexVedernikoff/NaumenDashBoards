// @flow
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Table extends DataFormBuilder {
	sourceRefs = [FIELDS.breakdown, FIELDS.column, FIELDS.row];

	renderCalcTotalColumn = (index: number) => this.renderCalcTotalInput(index, FIELDS.calcTotalColumn);

	renderCalcTotalInput = (index: number, name: string) => {
		const {setDataFieldValue} = this.props;
		const set = this.getSet(index);

		const props = {
			hideDivider: true,
			label: 'Подсчитывать итоги',
			name,
			onClick: setDataFieldValue(index),
			value: set[name]
		};

		return this.renderCheckBox(props);
	};

	renderCalcTotalRow = (index: number) => this.renderCalcTotalInput(index, FIELDS.calcTotalRow);

	renderColumn = (index: number) => {
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

	renderRowInput = (index: number) => {
		const set = this.getSet(index);

		const props = {
			name: FIELDS.row,
			value: set[FIELDS.row],
			withDivider: true
		};

		return this.renderAttribute(index, props);
	};

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection()}
				{this.renderLabel('Строки')}
				{this.renderByOrder(this.renderRowInput, false)}
				{this.renderByOrder(this.renderCalcTotalRow)}
				{this.renderLabel('Колонки')}
				{this.renderByOrder(this.renderColumn)}
				{this.renderByOrder(this.renderBreakdown)}
				{this.renderByOrder(this.renderCalcTotalColumn)}
			</Fragment>
		);
	}
}

export default withForm(Table);
