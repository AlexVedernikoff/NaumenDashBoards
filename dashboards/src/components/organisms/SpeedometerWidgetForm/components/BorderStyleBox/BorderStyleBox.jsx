// @flow
import ColorInput from 'components/molecules/ColorInput';
import {DEFAULT_NUMBER_AXIS_FORMAT} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import {FONT_SIZE_OPTIONS} from './constants';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import ParameterFormatPanel from 'components/molecules/ParameterFormatPanel';
import type {Props} from './types';
import React, {Component} from 'react';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class BorderStyleBox extends Component<Props> {
	change = (key: string, value: any, callback?: Function) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		}, callback);
	};

	handleChange = ({name, value}: OnChangeEvent<any>) => this.change(name, !value);

	handleChangeFormat = (format, callback?) => this.change(DIAGRAM_FIELDS.format, format, callback);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	render () {
		const {value} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle, format = DEFAULT_NUMBER_AXIS_FORMAT, show} = value;

		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleChange} showContent={show} title="Подпись пределов шкалы">
				<FormField row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
					<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleSelect} options={FONT_SIZE_OPTIONS} value={fontSize} />
				</FormField>
				<FormField row>
					<FontStyleControl name={DIAGRAM_FIELDS.fontStyle} onChange={this.handleSelect} value={fontStyle} />
					<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleSelect} portable={true} value={fontColor} />
				</FormField>
				<ParameterFormatPanel onChange={this.handleChangeFormat} value={format ?? DEFAULT_NUMBER_AXIS_FORMAT} />
			</ToggableFormBox>
		);
	}
}

export default BorderStyleBox;
