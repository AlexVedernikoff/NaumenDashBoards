// @flow
import {Checkbox, HorizontalLabel, LegacyCheckbox, TextInput} from 'components/atoms';
import {CollapsableFormBox, FormCheckControl, FormField} from 'components/molecules';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class IndicatorSettingsBox extends PureComponent<Props, State> {
	state = this.initState(this.props);

	initState (props: Props) {
		const {max, min, showDependent} = props.data;

		return {
			showAdditionalSettings: Boolean(max || min || showDependent)
		};
	}

	handleChange = (event: OnChangeInputEvent) => {
		const {handleChange} = this.props;
		let {value} = event;

		if (value.toString().length === 0) {
			value = undefined;
		}

		handleChange({...event, value});
	};

	handleClickDependentCheckbox = (name: string, value: boolean) => this.props.handleChange({name, value});

	handleToggleAdditionalSettings = () => {
		const {data, name, onChange} = this.props;
		const {showAdditionalSettings} = this.state;

		this.setState({showAdditionalSettings: !showAdditionalSettings});

		if (showAdditionalSettings) {
			onChange(name, {
				...data,
				max: undefined,
				min: undefined,
				showDependent: false
			});
		}
	};

	renderAdditionalSettings = () => {
		const {showAdditionalSettings} = this.state;

		if (showAdditionalSettings) {
			return (
				<Fragment>
					{this.renderScaleField(FIELDS.min)}
					{this.renderScaleField(FIELDS.max)}
					{this.renderShowDependentCheckbox()}
				</Fragment>
			);
		}

		return null;
	};

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
			<LegacyCheckbox
				label="Показывать зависимо"
				name={FIELDS.showDependent}
				onClick={this.handleClickDependentCheckbox}
				value={showDependent}
			/>
		);
	};

	render () {
		const {data, handleBoolChange, handleChange} = this.props;
		const {name, show, showName} = data;
		const {showAdditionalSettings} = this.state;

		return (
			<CollapsableFormBox title="Показатель">
				<FormField>
					<FormCheckControl label="Показать ось">
						<Checkbox checked={show} name={FIELDS.show} onChange={handleBoolChange} value={show} />
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={FIELDS.showName} onChange={handleBoolChange} value={showName} />
					</FormCheckControl>
				</FormField>
				<FormField small>
					<TextInput maxLength={MAX_TEXT_LENGTH} name={FIELDS.name} onChange={handleChange} value={name} />
				</FormField>
				<FormField>
					<FormCheckControl label="Настроить параметры оси">
						<Checkbox
							checked={showAdditionalSettings}
							onChange={this.handleToggleAdditionalSettings}
							value={show}
						/>
					</FormCheckControl>
				</FormField>
				{this.renderAdditionalSettings()}
			</CollapsableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorSettingsBox);
