// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {FONT_FAMILIES} from 'store/widgets/data/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import {FONT_SIZE_OPTIONS} from './constants';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';
import Toggle from 'components/atoms/Toggle';

export class AxisSettingsBox extends PureComponent<Props> {
	handleChangeSettings = ({name: key, value}: OnChangeEvent<boolean>) => {
		const {name, onChange, value: settings} = this.props;
		return onChange(name, {...settings, [key]: !value});
	};

	handleSelect = ({name: key, value}: OnSelectEvent) => {
		const {name, onChange, value: settings} = this.props;
		return onChange(name, {...settings, [key]: value});
	};

	renderAxisFormat = () => {
		const {renderAxisFormat, value} = this.props;
		const {show} = value;

		if (show && renderAxisFormat) {
			return renderAxisFormat();
		}

		return null;
	};

	renderFontFormat =() => {
		const {fontFamily = FONT_FAMILIES[0], fontSize = 12, show} = this.props.value;

		if (show) {
			return (
				<FormField row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
					<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleSelect} options={FONT_SIZE_OPTIONS} value={fontSize} />
				</FormField>
			);
		}

		return null;
	};

	renderNameField = () => {
		const {renderNameField, value: {showName}} = this.props;

		if (showName && renderNameField) {
			return renderNameField();
		}

		return null;
	};

	render () {
		const {title, value} = this.props;
		const {show, showName} = value;

		return (
			<CollapsableFormBox title={title}>
				<FormField>
					<FormControl label={t('AxisSettingsBox::Axis')} reverse={true}>
						<Toggle checked={show} name={DIAGRAM_FIELDS.show} onChange={this.handleChangeSettings} value={show} />
					</FormControl>
				</FormField>
				{this.renderFontFormat()}
				{this.renderAxisFormat()}
				<FormField>
					<FormControl label={t('AxisSettingsBox::AxisName')} reverse={true}>
						<Toggle checked={showName} name={DIAGRAM_FIELDS.showName} onChange={this.handleChangeSettings} value={showName} />
					</FormControl>
				</FormField>
				{this.renderNameField()}
			</CollapsableFormBox>
		);
	}
}

export default AxisSettingsBox;
