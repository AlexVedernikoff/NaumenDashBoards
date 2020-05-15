// @flow
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormCheckControl, FormField, ToggableFormBox} from 'components/molecules';
import type {Props} from './types';
import {RadioButton} from 'components/atoms';
import React, {Fragment, PureComponent} from 'react';
import {SORTING_VALUES} from 'store/widgets/data/constants';
import styles from './styles.less';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class SortingBox extends PureComponent<Props> {
	static defaultProps = {
		circle: false
	};

	renderAxisFields = () => {
		const {INDICATOR, PARAMETER} = SORTING_VALUES;

		return (
			<Fragment>
				<FormField row>
					{this.renderRadioButton('Параметр', PARAMETER)}
					{this.renderSortingButtons()}
				</FormField>
				<FormField>
					{this.renderRadioButton('Показатель', INDICATOR)}
				</FormField>
			</Fragment>
		);
	};

	renderCircleFields = () => {
		const {INDICATOR} = SORTING_VALUES;

		return (
			<FormField row>
				{this.renderRadioButton('Показатель', INDICATOR)}
				{this.renderSortingButtons()}
			</FormField>
		);
	};

	renderFields = () => this.props.circle ? this.renderCircleFields() : this.renderAxisFields();

	renderRadioButton = (label: string, value: string) => {
		const {data, handleChange} = this.props;
		const {value: currentValue} = data;
		const checked = currentValue === value;

		return (
			<FormCheckControl label={label}>
				<RadioButton checked={checked} name={FIELDS.value} onChange={handleChange} value={value} />
			</FormCheckControl>
		);
	};

	renderSortingButtons = () => (
		<div className={styles.sortingButtons}>
			{this.props.renderSortingButtons()}
		</div>
	);

	render () {
		return (
			<ToggableFormBox title="Сортировка">
				{this.renderFields()}
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(SortingBox);
