// @flow
import {AxisChart, CircleChart, ComboChart, Summary, Table} from './WidgetForms';
import {CHART_SELECTS, CHART_VARIANTS} from 'utils/chart';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms';
import React from 'react';
import type {SelectProps, SelectValue, TextAreaProps} from 'components/organisms/WidgetFormPanel/types';
import {styles} from 'components/organisms/WidgetFormPanel';
import {WIDGET_SELECTS, WIDGET_VARIANTS} from 'utils/widget';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ParamsTab extends DataFormBuilder {
	renderWidgetFields = (type: SelectValue) => {
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

		const WidgetForm = widgetsForm[type.value];
		return <WidgetForm />;
	};

	renderInputs = () => {
		const {values} = this.props;
		const {AXIS_SELECTS, CIRCLE_SELECTS, COMBO_SELECT} = CHART_SELECTS;
		const currentWidgetType = values.type || AXIS_SELECTS[0];

		const name: TextAreaProps = {
			label: 'Название виджета',
			name: 'name',
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values.name
		};

		const desc: TextAreaProps = {
			label: 'Описание',
			name: 'desc',
			value: values.desc
		};

		const type: SelectProps = {
			getOptionLabel: this.getLabelWithIcon,
			name: 'type',
			options: [...AXIS_SELECTS, ...CIRCLE_SELECTS, COMBO_SELECT, ...WIDGET_SELECTS],
			placeholder: 'Выберите тип виджета',
			value: currentWidgetType
		};

		return (
			<section className={styles.main}>
				{this.renderTextArea(name)}
				{this.renderTextArea(desc)}
				<Divider />
				{this.renderSelect(type)}
				{this.renderWidgetFields(currentWidgetType)}
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ParamsTab);
