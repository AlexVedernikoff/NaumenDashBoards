// @flow
import FormField from 'components/molecules/FormField';
import type {InputValue, OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class HeaderSettingsBox extends PureComponent<Props> {
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
		const {data, onChange} = this.props;

		onChange({
			...data,
			[name]: value
		});
	};

	render () {
		const {data, renderColorInput, renderFontStyleButtons, renderTextAlignButtons, renderTextHandlerButtons} = this.props;
		const {fontColor, fontStyle, textAlign, textHandler} = data;

		return (
			<Fragment>
				<FormField label="Шапка таблицы" row>
					{renderFontStyleButtons({
						onChange: this.handleChangeFontStyle,
						value: fontStyle
					})}
					{renderColorInput({
						onChange: this.handleChange,
						value: fontColor
					})}
				</FormField>
				<FormField row>
					{renderTextAlignButtons({
						onChange: this.handleChange,
						value: textAlign
					})}
					{renderTextHandlerButtons({
						onChange: this.handleChange,
						value: textHandler
					})}
				</FormField>
			</Fragment>
		);
	}
}

export default withStyleFormBuilder(HeaderSettingsBox);
