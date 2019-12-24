// @flow
import {AxisChart, CircleChart, ComboChart, Summary, Table} from './WidgetFields';
import {CHART_VARIANTS} from 'utils/chart';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FieldLabel} from 'components/atoms';
import {FIELDS, OPTIONS, styles} from 'components/organisms/WidgetFormPanel';
import {OuterSelect} from 'components/molecules';
import React, {Fragment} from 'react';
import {WIDGET_VARIANTS} from 'utils/widget';
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

		const Fields = variants[type];
		return <Fields key={type} />;
	};

	renderWidgetSelect = () => {
		const {values} = this.props;

		return (
			<div className={styles.field}>
				<FieldLabel text="Тип диаграммы" />
				<OuterSelect
					name={FIELDS.type}
					onSelect={this.handleSelect}
					options={OPTIONS.WIDGETS}
					value={values[FIELDS.type]}
				/>
			</div>
		);
	};

	render () {
		const {values} = this.props;
		const {diagramName, name, type} = FIELDS;

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

		return (
			<Fragment>
				{this.renderTextArea(nameProps)}
				{this.renderTextArea(diagramNameProps)}
				{this.renderDivider('section')}
				{this.renderWidgetSelect()}
				{this.renderDivider('section')}
				{this.renderWidgetFields(values[type])}
			</Fragment>
		);
	}
}

export default withForm(ParamsTab);
