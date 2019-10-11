// @flow
import {AxisChart, CircleChart, ComboChart, Summary, Table} from './WidgetForms';
import {CHART_SELECTS, CHART_VARIANTS} from 'utils/chart';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import React from 'react';
import type {SelectProps, TextAreaProps} from 'components/organisms/WidgetFormPanel/types';
import {WIDGET_SELECTS, WIDGET_VARIANTS} from 'utils/widget';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ParamsTab extends DataFormBuilder {
	renderWidgetFields = (type: string) => {
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		const widgetsForm = {
			[BAR]: AxisChart,
			[BAR_STACKED]: AxisChart,
			[COLUMN]: AxisChart,
			[COLUMN_STACKED]: AxisChart,
			[COMBO]: ComboChart,
			[DONUT]: CircleChart,
			[LINE]: AxisChart,
			[PIE]: CircleChart,
			[SUMMARY]: Summary,
			[TABLE]: Table
		};

		const WidgetForm = widgetsForm[type];
		return <WidgetForm />;
	};

	renderInputs = () => {
		const {values} = this.props;
		const {name, diagramName, type} = FIELDS;
		const {AXIS_HORIZONTAL_SELECTS, AXIS_SELECTS, CIRCLE_SELECTS, COMBO_SELECT} = CHART_SELECTS;

		const nameProps: TextAreaProps = {
			label: 'Название виджета',
			name: name,
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values[name]
		};

		const diagramNameProps: TextAreaProps = {
			label: 'Название диаграммы',
			name: diagramName,
			value: values[diagramName]
		};

		const typeProps: SelectProps = {
			getOptionLabel: this.getLabelWithIcon,
			name: type,
			options: [...AXIS_SELECTS, ...AXIS_HORIZONTAL_SELECTS, ...CIRCLE_SELECTS, COMBO_SELECT, ...WIDGET_SELECTS],
			placeholder: 'Выберите тип виджета',
			value: values[type]
		};

		return (
			<section className={styles.main}>
				{this.renderTextArea(nameProps)}
				{this.renderTextArea(diagramNameProps)}
				<Divider />
				{this.renderSelect(typeProps)}
				{this.renderWidgetFields(values[type].value)}
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ParamsTab);
