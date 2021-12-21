// @flow
import ColorInput from 'components/molecules/ColorInput';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import type {InputValue, OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import t from 'localization';
import TextAlignControl from 'WidgetFormPanel/components/TextAlignControl';
import TextHandlerControl from 'WidgetFormPanel/components/TextHandlerControl';

export class HeaderSettingsBox extends PureComponent<Props> {
	handleChange = ({name, value}: OnChangeInputEvent) => this.updateSettings(name, value);

	handleChangeFontStyle = (event: OnChangeInputEvent) => {
		const {onChange, value: settings} = this.props;
		let {name, value} = event;

		if (settings[name] === value) {
			value = '';
		}

		onChange({
			...settings,
			[name]: value
		});
	};

	updateSettings = (name: string, value: InputValue) => {
		const {onChange, value: settings} = this.props;

		onChange({
			...settings,
			[name]: value
		});
	};

	render () {
		const {fontColor, fontStyle, textAlign, textHandler} = this.props.value;

		return (
			<Fragment>
				<FormField label={t('TableWidgetForm::HeaderSettingsBox::TableHead')} row>
					<FontStyleControl name={DIAGRAM_FIELDS.fontStyle} onChange={this.handleChangeFontStyle} value={fontStyle} />
					<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleChange} portable={true} value={fontColor} />
				</FormField>
				<FormField row>
					<TextAlignControl name={DIAGRAM_FIELDS.textAlign} onChange={this.handleChange} value={textAlign} />
					<TextHandlerControl name={DIAGRAM_FIELDS.textHandler} onChange={this.handleChange} value={textHandler} />
				</FormField>
			</Fragment>
		);
	}
}

export default HeaderSettingsBox;
