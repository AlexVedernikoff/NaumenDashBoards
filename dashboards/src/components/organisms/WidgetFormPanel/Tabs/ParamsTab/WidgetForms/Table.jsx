// @flow
import type {AttrSelectProps, CheckBoxProps} from 'components/organisms/WidgetFormPanel/types';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import React, {Fragment} from 'react';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class Table extends DataFormBuilder {
	renderInputs = () => {
		const {values} = this.props;

		const row: AttrSelectProps = {
			name: FIELDS.row,
			placeholder: 'Строки',
			value: values[FIELDS.row]
		};

		const totalRow: CheckBoxProps = {
			label: 'Подсчитывать итоги',
			name: FIELDS.totalRow,
			value: values[FIELDS.totalRow]
		};

		const column: AttrSelectProps = {
			name: FIELDS.column,
			placeholder: 'Столбцы',
			value: values[FIELDS.column]
		};

		const totalColumn: CheckBoxProps = {
			label: 'Подсчитывать итоги',
			name: FIELDS.totalColumn,
			value: values[FIELDS.totalColumn]
		};

		return (
			<Fragment>
				{this.renderSourceInput()}
				{this.renderAttrSelect(row)}
				{this.renderCheckBox(totalRow)}
				{this.renderAttrSelect(column)}
				{this.renderAggregateInput(FIELDS.aggregate, FIELDS.column)}
				{this.renderBreakdownInput()}
				{this.renderCheckBox(totalColumn)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(Table);
