// @flow
import {AxisChart, BarChart, CircleChart, ComboChart, Summary, Table} from './WidgetFields';
import {CHART_SELECTS, CHART_VARIANTS} from 'utils/chart';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import {Divider} from 'components/atoms';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import {WIDGET_SELECTS, WIDGET_VARIANTS} from 'utils/widget';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ParamsTab extends DataFormBuilder {
	handleBlurName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {handleBlur, setFieldValue, values} = this.props;
		const diagramName = values[FIELDS.diagramName];

		if (values[FIELDS.isNew] && !diagramName) {
			setFieldValue(FIELDS.diagramName, e.target.value);
		}

		handleBlur(e);
	};

	renderWidgetFields = (type: string) => {
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		const variants = {
			[BAR]: BarChart,
			[BAR_STACKED]: BarChart,
			[COLUMN]: AxisChart,
			[COLUMN_STACKED]: AxisChart,
			[COMBO]: ComboChart,
			[DONUT]: CircleChart,
			[LINE]: AxisChart,
			[PIE]: CircleChart,
			[SUMMARY]: Summary,
			[TABLE]: Table
		};

		const Fields = variants[type];
		return <Fields />;
	};

	renderInputs = () => {
		const {values} = this.props;
		const {diagramName, name, type} = FIELDS;
		const {AXIS_HORIZONTAL_SELECTS, AXIS_SELECTS, CIRCLE_SELECTS, COMBO_SELECT} = CHART_SELECTS;

		const nameProps = {
			handleBlur: this.handleBlurName,
			label: 'Название виджета',
			name,
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values[name]
		};

		const diagramNameProps = {
			label: 'Название диаграммы',
			name: diagramName,
			value: values[diagramName]
		};

		const typeProps = {
			getOptionLabel: this.getLabelWithIcon,
			name: type,
			options: [...AXIS_SELECTS, ...AXIS_HORIZONTAL_SELECTS, ...CIRCLE_SELECTS, COMBO_SELECT, ...WIDGET_SELECTS],
			placeholder: 'Выберите тип виджета',
			value: values[type]
		};

		return (
			<Fragment>
				{this.renderTextArea(nameProps)}
				{this.renderTextArea(diagramNameProps)}
				<Divider />
				{this.renderSelect(typeProps)}
				{this.renderWidgetFields(values[type].value)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(ParamsTab);
