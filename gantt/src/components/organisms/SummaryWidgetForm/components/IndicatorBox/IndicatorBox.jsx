// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import ColorInput from 'components/molecules/ColorInput';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class IndicatorBox extends PureComponent<Props> {
	static defaultProps = {
		useAutoFontSize: false
	};

	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	handleChange = ({name, value}: OnChangeEvent<string>) => this.change(name, value);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	render () {
		const {useAutoFontSize, value} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle} = value;

		return (
			<CollapsableFormBox title="Показатель">
				<FormField label="Шрифт" row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
					<FontSizeSelect
						name={DIAGRAM_FIELDS.fontSize}
						onSelect={this.handleSelect}
						useAuto={useAutoFontSize}
						value={fontSize}
					/>
				</FormField>
				<FormField row>
					<FontStyleControl name={DIAGRAM_FIELDS.fontStyle} onChange={this.handleChange} value={fontStyle} />
					<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleChange} portable={true} value={fontColor} />
				</FormField>
			</CollapsableFormBox>
		);
	}
}

export default IndicatorBox;
