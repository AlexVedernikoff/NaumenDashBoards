// @flow
import {Checkbox} from 'components/atoms';
import cn from 'classnames';
import {COUNT_OPTIONS} from './constants';
import {DEFAULT_TOP_SETTINGS} from 'store/widgets/data/constants';
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormCheckControl, FormField, Select} from 'components/molecules';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
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

	handleChangeCount = ({name, value}: OnChangeInputEvent) => this.changeSettings(name, value);

	handleSelectCount = ({name, value}: OnSelectEvent) => this.changeSettings(name, value);

	handleToggleShow = ({name, value}: OnChangeInputEvent) => this.changeSettings(name, !value);

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
		const {disabled} = this.props;
		const CN = cn({
			[styles.field]: true,
			[styles.disabled]: disabled
		});

		return (
			<FormField className={CN} row>
				{this.renderShowCheckbox()}
				{this.renderCountSelect()}
			</FormField>
		);
	}
}

export default DataTopField;
