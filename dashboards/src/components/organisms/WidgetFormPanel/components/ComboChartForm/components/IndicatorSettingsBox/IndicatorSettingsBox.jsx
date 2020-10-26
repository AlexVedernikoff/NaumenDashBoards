// @flow
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormField, ToggableFormBox} from 'components/molecules';
import {HorizontalLabel, LegacyCheckbox as Checkbox, TextInput} from 'components/atoms';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class IndicatorSettingsBox extends PureComponent<Props> {
	handleChange = (event: OnChangeInputEvent) => {
		const {handleChange} = this.props;
		let {value} = event;

		if (value.toString().length === 0) {
			value = undefined;
		}

		handleChange({...event, value});
	};

	handleClickDependentCheckbox = (name: string, value: boolean) => this.props.handleChange({name, value});

	renderScaleField = (name: string) => {
		const {[name]: value = 'auto'} = this.props.data;

		return (
			<FormField row small>
				<HorizontalLabel>{name}</HorizontalLabel>
				<TextInput name={name} onChange={this.handleChange} onlyNumber={true} value={value} />
			</FormField>
		);
	};

	renderShowDependentCheckbox = () => {
		const {data} = this.props;
		const {showDependent} = data;

		return (
			<Checkbox
				label="Показывать зависимо"
				name={FIELDS.showDependent}
				onClick={this.handleClickDependentCheckbox}
				value={showDependent}
			/>
		);
	};

	render () {
		const {data} = this.props;
		const {max, min} = data;
		const showContent = Boolean(min || max);

		return (
			<ToggableFormBox showContent={showContent} title="Параметры оси показателя">
				{this.renderScaleField(FIELDS.min)}
				{this.renderScaleField(FIELDS.max)}
				{this.renderShowDependentCheckbox()}
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorSettingsBox);
