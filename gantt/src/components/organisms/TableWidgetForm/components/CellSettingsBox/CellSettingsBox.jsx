// @flow
import ColorInput from 'components/molecules/ColorInput';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import type {InputValue, OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class CellSettingsBox extends PureComponent<Props> {
	handleChange = ({name, value}: OnChangeInputEvent) => this.updateSettings(name, value);

	handleChangeFontStyle = (event: OnChangeInputEvent) => {
		const {value: settings} = this.props;
		let {name, value} = event;

		if (settings[name] === value) {
			value = '';
		}

		this.updateSettings(name, value);
	};

	updateSettings = (key: string, value: InputValue) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	render () {
		const {label, value} = this.props;
		const {fontColor, fontStyle} = value;

		return (
			<FormField label={label} row>
				<FontStyleControl name={DIAGRAM_FIELDS.fontStyle} onChange={this.handleChangeFontStyle} value={fontStyle} />
				<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleChange} portable={true} value={fontColor} />
			</FormField>
		);
	}
}

export default CellSettingsBox;
