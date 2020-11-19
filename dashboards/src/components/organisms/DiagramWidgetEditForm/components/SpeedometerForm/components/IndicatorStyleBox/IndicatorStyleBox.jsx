// @flow
import {FIELDS} from 'DiagramWidgetEditForm';
import {FormField, ToggableFormBox} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class IndicatorBox extends PureComponent<Props> {
	render () {
		const {
			data,
			handleBoolChange,
			renderColorInput,
			renderFontFamilySelect,
			renderFontSizeSelect,
			renderFontStyleButtons
		} = this.props;

		return (
			<ToggableFormBox name={FIELDS.show} onToggle={handleBoolChange} showContent={data.show} title="Показатель">
				<FormField row>
					{renderFontFamilySelect()}
					{renderFontSizeSelect({usesAuto: true})}
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