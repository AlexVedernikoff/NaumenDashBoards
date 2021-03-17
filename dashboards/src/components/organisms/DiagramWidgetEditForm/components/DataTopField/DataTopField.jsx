// @flow
import Checkbox from 'components/atoms/Checkbox';
import cn from 'classnames';
import {COUNT_OPTIONS} from './constants';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class DataTopField extends PureComponent<Props> {
	static defaultProps = {
		disabled: false,
		value: DEFAULT_TOP_SETTINGS
	};

	changeSettings = (name: string, value: any) => {
		const {onChange, value: settings} = this.props;

		onChange({
			...settings,
			[name]: value
		});
	};

	handleChangeCount = ({name, value}: OnChangeEvent<string>) => {
		const intValue = parseInt(value);

		if (!isNaN(intValue)) {
			this.changeSettings(name, intValue);
		}
	};

	handleSelectCount = ({name, value}: OnSelectEvent) => this.changeSettings(name, value);

	handleToggleShow = ({name, value}: OnChangeEvent<boolean>) => this.changeSettings(name, !value);

	renderCountSelect = () => {
		const {count} = this.props.value;

		return (
			<Select
				className={styles.select}
				editable={true}
				name={FIELDS.count}
				onChangeLabel={this.handleChangeCount}
				onSelect={this.handleSelectCount}
				options={COUNT_OPTIONS}
				value={count}
			/>
		);
	};

	renderShowCheckbox = () => {
		const {show} = this.props.value;

		return (
			<FormCheckControl label="Вывести топ">
				<Checkbox checked={show} name={FIELDS.show} onChange={this.handleToggleShow} value={show} />
			</FormCheckControl>
		);
	};

	render () {
		const {disabled, error} = this.props;
		const CN = cn({
			[styles.field]: true,
			[styles.disabled]: disabled
		});

		return (
			<FormField error={error}>
				<div className={CN}>
					{this.renderShowCheckbox()}
					{this.renderCountSelect()}
				</div>
			</FormField>
		);
	}
}

export default DataTopField;
