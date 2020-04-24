// @flow
import {FormControl, FormField, ToggableFormBox} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class IndicatorBox extends PureComponent<Props> {
	render () {
		const {renderColorInput, renderFontFamilySelect, renderFontSizeSelect, renderFontStyleButtons} = this.props;

		return (
			<ToggableFormBox title="Показатель">
				<FormField>
					<FormControl label="Шрифт" row>
						{renderFontFamilySelect()}
						{renderFontSizeSelect()}
					</FormControl>
				</FormField>
				<FormField row>
					{renderFontStyleButtons()}
					{renderColorInput()}
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorBox);
