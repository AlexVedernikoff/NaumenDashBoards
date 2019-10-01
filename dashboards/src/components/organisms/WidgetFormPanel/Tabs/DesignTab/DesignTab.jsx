// @flow
import type {CheckBoxProps, SelectProps} from 'components/organisms/WidgetFormPanel/types';
import {Divider, DropDownMenu} from 'components/atoms';
import {FormBuilder} from 'components/organisms/WidgetFormPanel/Builders';
import React from 'react';
import styles from 'components/organisms/WidgetFormPanel/styles.less';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class DesignTab extends FormBuilder {
	renderVisibilityLegend = () => {
		const {values} = this.props;

		const fields = [
			{
				label: 'Выводить название осей',
				name: 'areAxisesNamesShown',
				value: values.areAxisesNamesShown
			},
			{
				label: 'Выводить подписи осей',
				name: 'areAxisesLabelsShown',
				value: values.areAxisesLabelsShown
			},
			{
				label: 'Выводить подписи значений',
				name: 'areAxisesMeaningsShown',
				value: values.areAxisesMeaningsShown
			}
		];

		return (
			<div className={styles.dropdownMenuContainer}>
				<DropDownMenu name="Редактировать легенду">
					{fields.map(this.renderLegendField)}
				</DropDownMenu>
			</div>
		);
	};

	renderLegendField = (checkBox: CheckBoxProps) => (
		<div className={styles.checkboxContainerLeft}>
			{this.renderCheckBox(checkBox)}
			<Divider className={styles.dividerLeft} />
		</div>
	);

	renderInputs = () => {
		const {values} = this.props;

		const nameVisibility: CheckBoxProps = {
			label: 'Название виджета',
			name: 'isNameShown',
			value: values.isNameShown
		};

		const legendPosition: SelectProps = {
			label: 'Положение легенды',
			name: 'legendPosition',
			options: [
				{value: 'right', label: 'Справа'},
				{value: 'left', label: 'Слева'},
				{value: 'top', label: 'Вверху'},
				{value: 'bottom', label: 'Внизу'}
			],
			placeholder: '',
			value: values.legendPosition
		};

		const legendVisibility: CheckBoxProps = {
			label: 'Выводить легенду',
			name: 'isLegendShown',
			value: values.isLegendShown
		};

		return (
			<section className={styles.main}>
				{this.renderCheckBox(nameVisibility)}
				<Divider />
				{this.renderCheckBox(legendVisibility)}
				{this.renderSelect(legendPosition)}
				{this.renderVisibilityLegend()}
			</section>
		);
	};

	render () {
		return this.renderInputs();
	}
}

export default withForm(DesignTab);
