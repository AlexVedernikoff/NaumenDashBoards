// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import ColorInput from 'components/molecules/ColorInput';
import {DEFAULT_NUMBER_AXIS_FORMAT} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import ParameterFormatPanel from 'components/molecules/ParameterFormatPanel';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';

export class IndicatorBox extends PureComponent<Props> {
	static defaultProps = {
		useAutoFontSize: false
	};

	change = (key: string, value: any, callback?: Function) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		}, callback);
	};

	handleChange = ({name, value}: OnChangeEvent<string>) => this.change(name, value);

	handleChangeParameterFormat = (value, callback?) => this.change(DIAGRAM_FIELDS.format, value, callback);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	render () {
		const {useAutoFontSize, value} = this.props;
		const {computedFormat, fontColor, fontFamily, fontSize, fontStyle, format} = value;
		const parameterFormat = format ?? computedFormat ?? DEFAULT_NUMBER_AXIS_FORMAT;

		return (
			<CollapsableFormBox title={t('SummaryWidgetForm::IndicatorBox::Indicator')}>
				<FormField label={t('SummaryWidgetForm::IndicatorBox::Font')} row>
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
				<ParameterFormatPanel onChange={this.handleChangeParameterFormat} value={parameterFormat} />
			</CollapsableFormBox>
		);
	}
}

export default IndicatorBox;
