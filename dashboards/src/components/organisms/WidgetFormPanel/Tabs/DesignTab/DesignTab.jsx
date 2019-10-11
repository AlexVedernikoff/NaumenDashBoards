// @flow
import {Chart} from './WidgetForms';
import {CHART_VARIANTS} from 'utils/chart';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React from 'react';
import {WIDGET_VARIANTS} from 'utils/widget';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class DesignTab extends FormBuilder {
	renderWidgetFields = (type: string) => {
		const {DONUT, PIE} = CHART_VARIANTS;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		if (type !== SUMMARY && type !== TABLE) {
			const axis = !(type === PIE || type === DONUT);

			return <Chart axis={axis} />;
		}
	};

	renderInputs = () => {
		const {values} = this.props;
		const {showName, type} = FIELDS;

		const nameProps = {
			label: 'Заголовок диаграммы',
			name: showName,
			value: values[showName]
		};

		return (
			<section className={styles.main}>
				{this.renderHeader('Показывать на диаграмме')}
				{this.renderCheckBox(nameProps)}
				{this.renderWidgetFields(values[type].value)}
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(DesignTab);
