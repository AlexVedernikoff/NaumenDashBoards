// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import FormField from 'components/molecules/FormField';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class IndicatorBox extends PureComponent<Props> {
	render () {
		const {renderColorInput, renderFontFamilySelect, renderFontSizeSelect, renderFontStyleButtons} = this.props;

		return (
			<CollapsableFormBox title="Показатель">
				<FormField label="Шрифт" row>
					{renderFontFamilySelect()}
					{renderFontSizeSelect({usesAuto: true})}
				</FormField>
				<FormField row>
					{renderFontStyleButtons()}
					{renderColorInput()}
				</FormField>
			</CollapsableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorBox);
