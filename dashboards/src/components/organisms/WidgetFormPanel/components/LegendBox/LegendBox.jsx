// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {DISPLAY_TYPE_OPTIONS, POSITION_OPTIONS} from 'WidgetFormPanel/components/LegendBox/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormField from 'components/molecules/FormField';
import {LEGEND_POSITIONS} from 'utils/chart/constants';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import TextHandlerControl from 'WidgetFormPanel/components/TextHandlerControl';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class LegendBox extends PureComponent<Props> {
	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	handleChange = ({name, value}: OnChangeEvent<string>) => this.change(name, value);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	renderLegendDisplayTypeButtons = () => {
		const {displayType, position} = this.props.value;
		const {left, right} = LEGEND_POSITIONS;
		const disabled = position === left || position === right;

		return (
			<CheckIconButtonGroup
				disabled={disabled}
				name={DIAGRAM_FIELDS.displayType}
				onChange={this.handleChange}
				options={DISPLAY_TYPE_OPTIONS}
				value={displayType}
			/>
		);
	};

	renderLegendPositionButtons = () => {
		const {position} = this.props.value;

		return <CheckIconButtonGroup name={DIAGRAM_FIELDS.position} onChange={this.handleChange} options={POSITION_OPTIONS} value={position} />;
	};

	render () {
		const {fontFamily, fontSize, show, textHandler} = this.props.value;

		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleChange} showContent={show} title="Легенда">
				<FormField row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
					<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleSelect} value={fontSize} />
				</FormField>
				<FormField>
					{this.renderLegendPositionButtons()}
				</FormField>
				<FormField row>
					<TextHandlerControl name={DIAGRAM_FIELDS.textHandler} onChange={this.handleChange} value={textHandler} />
					{this.renderLegendDisplayTypeButtons()}
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default LegendBox;
