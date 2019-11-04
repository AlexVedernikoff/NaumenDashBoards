// @flow
import {Chart} from './WidgetFields';
import {CHART_VARIANTS} from 'utils/chart';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React, {Fragment} from 'react';
import {WIDGET_VARIANTS} from 'utils/widget';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class DesignTab extends FormBuilder {
	renderWidgetFields = (type: string) => {
		const {COMBO, DONUT, PIE} = CHART_VARIANTS;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		if (type !== SUMMARY && type !== TABLE) {
			const axis = !(type === PIE || type === DONUT || type === COMBO);

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
			<Fragment>
				{this.renderHeader('Показывать на диаграмме')}
				{this.renderCheckBox(nameProps)}
				{this.renderWidgetFields(values[type].value)}
			</Fragment>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(DesignTab);
