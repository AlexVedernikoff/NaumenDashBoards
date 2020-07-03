// @flow
import {DisableableBox, FormField, ToggableFormBox} from 'components/molecules';
import {FIELDS} from 'WidgetFormPanel/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class HeaderBox extends PureComponent<Props> {
	render () {
		const {
			data,
			handleBoolChange,
			renderColorInput,
			renderFontFamilySelect,
			renderFontSizeSelect,
			renderFontStyleButtons,
			renderTextAlignButtons,
			renderTextHandlerButtons
		} = this.props;

		return (
			<ToggableFormBox title="Заголовок">
				<DisableableBox handleChange={handleBoolChange} label="Показывать на диаграмме" name={FIELDS.show} value={data.show}>
					<FormField label="Шрифт" row>
						{renderFontFamilySelect()}
						{renderFontSizeSelect()}
					</FormField>
					<FormField row>
						{renderFontStyleButtons()}
						{renderColorInput()}
					</FormField>
					<FormField row>
						{renderTextAlignButtons()}
						{renderTextHandlerButtons()}
					</FormField>
				</DisableableBox>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(HeaderBox);
