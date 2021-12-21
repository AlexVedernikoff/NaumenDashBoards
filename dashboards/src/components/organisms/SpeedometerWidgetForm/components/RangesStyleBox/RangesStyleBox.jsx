// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import ColorInput from 'components/molecules/ColorInput';
import {DEFAULT_NUMBER_AXIS_FORMAT, RANGES_POSITION} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {DISPLAY_TYPE_OPTIONS, POSITION_OPTIONS} from 'WidgetFormPanel/components/LegendBox/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import {FONT_SIZE_OPTIONS, RANGES_POSITION_OPTIONS} from './constants';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FontStyleControl from 'WidgetFormPanel/components/FontStyleControl';
import FormField from 'components/molecules/FormField';
import {LEGEND_POSITIONS} from 'utils/chart/constants';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import ParameterFormatPanel from 'components/molecules/ParameterFormatPanel';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import t, {translateObjectsArray} from 'localization';
import TextHandlerControl from 'WidgetFormPanel/components/TextHandlerControl';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class RangesStyleBox extends Component<Props> {
	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	handleChange = ({name, value}: OnChangeEvent<any>) => this.change(name, !value);

	handleChangeFormat = format => this.change(DIAGRAM_FIELDS.format, format);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	renderCurveOptions = () => {
		const {value} = this.props;
		const {fontColor, fontStyle, position} = value;

		if (position === RANGES_POSITION.CURVE) {
			return (
				<FormField row>
					<FontStyleControl name={DIAGRAM_FIELDS.fontStyle} onChange={this.handleSelect} value={fontStyle} />
					<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleSelect} portable={true} value={fontColor} />
				</FormField>
			);
		}

		return null;
	};

	renderDisplayTypeButtons = () => {
		const {displayType, legendPosition} = this.props.value;
		const {left, right} = LEGEND_POSITIONS;
		const disabled = legendPosition === left || legendPosition === right;

		return (
			<CheckIconButtonGroup
				disabled={disabled}
				name={DIAGRAM_FIELDS.displayType}
				onChange={this.handleSelect}
				options={DISPLAY_TYPE_OPTIONS}
				value={displayType}
			/>
		);
	};

	renderLegendOptions = () => {
		const {value} = this.props;
		const {position, textHandler} = value;

		if (position === RANGES_POSITION.LEGEND) {
			return (
				<Fragment>
					<FormField row>
						{this.renderLegendPositionButtons()}
					</FormField>
					<FormField row>
						<TextHandlerControl name={DIAGRAM_FIELDS.textHandler} onChange={this.handleSelect} value={textHandler} />
						{this.renderDisplayTypeButtons()}
					</FormField>
				</Fragment>
			);
		}

		return null;
	};

	renderLegendPositionButtons = () => {
		const {legendPosition} = this.props.value;

		return (
			<CheckIconButtonGroup
				name={DIAGRAM_FIELDS.legendPosition}
				onChange={this.handleSelect}
				options={POSITION_OPTIONS}
				value={legendPosition}
			/>
		);
	};

	renderPositionButtons = () => {
		const {position} = this.props.value;
		const options = translateObjectsArray('title', RANGES_POSITION_OPTIONS);

		return <CheckIconButtonGroup name={DIAGRAM_FIELDS.position} onChange={this.handleSelect} options={options} value={position} />;
	};

	render () {
		const {value} = this.props;
		const {fontFamily, fontSize, show, format = DEFAULT_NUMBER_AXIS_FORMAT} = value;

		return (
			<ToggableFormBox name={DIAGRAM_FIELDS.show} onToggle={this.handleChange} showContent={show} title={t('BordersRangesStyleBox::Range')}>
				<FormField row>
					{this.renderPositionButtons()}
				</FormField>
				<FormField row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
					<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleSelect} options={FONT_SIZE_OPTIONS} value={fontSize} />
				</FormField>
				{this.renderLegendOptions()}
				{this.renderCurveOptions()}
				<ParameterFormatPanel onChange={this.handleChangeFormat} value={format ?? DEFAULT_NUMBER_AXIS_FORMAT} />
			</ToggableFormBox>
		);
	}
}

export default RangesStyleBox;
