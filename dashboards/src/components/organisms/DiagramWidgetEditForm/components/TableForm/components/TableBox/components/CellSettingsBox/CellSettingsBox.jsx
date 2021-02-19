// @flow
import FormField from 'components/molecules/FormField';
import type {InputValue, OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class CellSettingsBox extends PureComponent<Props> {
	handleChange = ({name, value}: OnChangeInputEvent) => this.updateSettings(name, value);

	handleChangeFontStyle = (event: OnChangeInputEvent) => {
		const {data} = this.props;
		let {name, value} = event;

		if (data[name] === value) {
			value = '';
		}

		this.updateSettings(name, value);
	};

	updateSettings = (name: string, value: InputValue) => {
		const {data, name: dataName, onChange} = this.props;

		onChange(dataName, {
			...data,
			[name]: value
		});
	};

	render () {
		const {data, label, renderColorInput, renderFontStyleButtons} = this.props;
		const {fontColor, fontStyle} = data;

		return (
			<FormField label={label} row>
				{renderFontStyleButtons({
					onChange: this.handleChangeFontStyle,
					value: fontStyle
				})}
				{renderColorInput({
					onChange: this.handleChange,
					value: fontColor
				})}
			</FormField>
		);
	}
}

export default withStyleFormBuilder(CellSettingsBox);
