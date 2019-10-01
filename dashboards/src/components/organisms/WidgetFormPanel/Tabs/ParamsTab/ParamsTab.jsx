// @flow
import {AxisChart, CircleChart, ComboChart} from './WidgetForms';
import {CHART_VARIANTS} from 'utils/chart/constansts';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms';
import React from 'react';
import type {SelectValue, TextAreaProps} from 'components/organisms/WidgetFormPanel/types';
import {styles} from 'components/organisms/WidgetFormPanel';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ParamsTab extends DataFormBuilder {
	renderWidgetFields = (chart: SelectValue) => {
		const {BAR, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;

		const widgetsForm = {
			[BAR]: AxisChart,
			[COMBO]: ComboChart,
			[DONUT]: CircleChart,
			[LINE]: AxisChart,
			[PIE]: CircleChart
		};

		const WidgetForm = widgetsForm[chart.value];
		return <WidgetForm />;
	};

	renderInputs = () => {
		const {values} = this.props;

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

		return (
			<section className={styles.main}>
				{this.renderTextArea(name)}
				{this.renderTextArea(desc)}
				<Divider />
				{this.renderChartInput()}
				{values.chart && this.renderWidgetFields(values.chart)}
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ParamsTab);
