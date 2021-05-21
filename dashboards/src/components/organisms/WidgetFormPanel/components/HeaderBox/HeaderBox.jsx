// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import ColorInput from 'components/molecules/ColorInput';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import {POSITION_OPTIONS} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import TextAlignControl from 'WidgetFormPanel/components/TextAlignControl';
import TextHandlerControl from 'WidgetFormPanel/components/TextHandlerControl/TextHandlerControl';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class HeaderBox extends PureComponent<Props> {
	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	handleChange = ({name, value}: OnChangeEvent<any>) => this.change(name, !value);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	renderPositionControl = () => {
		const {position} = this.props.value;

		return (
			<CheckIconButtonGroup
				name={DIAGRAM_FIELDS.position}
				onChange={this.handleSelect}
				options={POSITION_OPTIONS} value={position}
			/>
		);
	};

	render () {
		const {value} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle, show, textAlign, textHandler} = value;

		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleChange} showContent={show} title="Заголовок">
					<FormField row>
						<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
						<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleSelect} value={fontSize} />
					</FormField>
					<FormField row>
						<FontStyleControl name={DIAGRAM_FIELDS.fontStyle} onChange={this.handleSelect} value={fontStyle} />
						<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleSelect} portable={true} value={fontColor} />
					</FormField>
					<FormField row>
						<TextAlignControl name={DIAGRAM_FIELDS.textAlign} onChange={this.handleSelect} value={textAlign} />
						<TextHandlerControl name={DIAGRAM_FIELDS.textHandler} onChange={this.handleSelect} value={textHandler} />
						{this.renderPositionControl()}
					</FormField>
			</ToggableFormBox>
		);
	}
}

export default HeaderBox;
