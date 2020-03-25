// @flow
import {Chart} from './WidgetFields';
import {FieldLabel} from 'components/atoms';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import React from 'react';
import styles from './styles.less';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class DesignTab extends FormBuilder {
	renderCheckboxesLabel = () => {
		return (
			<div className={styles.showLabel}>
				<FieldLabel text="Показывать на диаграмме" />
			</div>
		);
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
			<div className={styles.tab}>
				{this.renderCheckboxesLabel()}
				{this.renderCheckBox(nameProps)}
				{this.renderWidgetFields(values[type])}
			</div>
		);
	};

	renderWidgetFields = (type: string) => {
		const {SUMMARY, TABLE} = WIDGET_TYPES;

		if (type !== SUMMARY && type !== TABLE) {
			return <Chart />;
		}
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(DesignTab);
