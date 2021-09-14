// @flow
import Checkbox from 'components/atoms/Checkbox';
import cn from 'classnames';
import {COUNT_OPTIONS} from './constants';
import {DEFAULT_TOP_SETTINGS, DEFAULT_TOP_SETTINGS_INIT} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormControl from 'components/molecules/FormControl';
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

	changeSettingsInit = () => {
		const {onChange} = this.props;
		return onChange(DEFAULT_TOP_SETTINGS_INIT);
	};

	handleChangeCount = ({name, value}: OnChangeEvent<string>) => {
		const intValue = parseInt(value);
		return this.changeSettings(name, isNaN(intValue) ? null : intValue);
	};

	handleSelectCount = ({name, value}: OnSelectEvent) => this.changeSettings(name, value);

	handleToggleShow = ({name, value}: OnChangeEvent<boolean>) => {
		const {count} = this.props.value;

		if (!value && count === null) {
			this.changeSettingsInit();
		} else {
			this.changeSettings(name, !value);
		}
	};

	renderCountSelect = () => {
		const {count, show} = this.props.value;

		return (
			<Select
				className={styles.select}
				disabled={!show}
				editable={true}
				name={DIAGRAM_FIELDS.count}
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
			<FormControl label="Вывести топ">
				<Checkbox checked={show} name={DIAGRAM_FIELDS.show} onChange={this.handleToggleShow} value={show} />
			</FormControl>
		);
	};

	render () {
		const {disabled} = this.props;
		const CN = cn({
			[styles.field]: true,
			[styles.disabled]: disabled
		});

		return (
			<div className={CN}>
				{this.renderShowCheckbox()}
				{this.renderCountSelect()}
			</div>
		);
	}
}

export default DataTopField;
