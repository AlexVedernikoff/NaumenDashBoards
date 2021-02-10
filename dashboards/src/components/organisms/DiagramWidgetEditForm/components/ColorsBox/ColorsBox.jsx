// @flow
import type {
	AutoChartColorsSettings,
	ChartColorsSettings,
	ChartColorsSettingsType,
	CustomChartColorsSettings
} from 'store/widgets/data/types';
import AutoColorsSettings from './components/AutoColorsSettings';
import {CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import CustomColorsSettings from './components/CustomColorsSettings';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import RadioField from 'components/atoms/RadioField';
import React, {Fragment, PureComponent} from 'react';

export class ColorsBox extends PureComponent<Props> {
	change = (value: ChartColorsSettings) => {
		const {name, onChange} = this.props;

		onChange(name, value);
	};

	getCurrentSettingsType = () => {
		const {disabledCustomSettings, value} = this.props;
		const {AUTO} = CHART_COLORS_SETTINGS_TYPES;

		return disabledCustomSettings ? AUTO : value.type;
	};

	handleChangeAutoSettings = (auto: AutoChartColorsSettings) => {
		const {value} = this.props;

		this.change({...value, auto});
	};

	handleChangeCustomSettings = (custom: CustomChartColorsSettings) => {
		const {value} = this.props;

		this.change({...value, custom});
	};

	handleChangeType = ({value: type}: OnChangeEvent<ChartColorsSettingsType>) => {
		const {value} = this.props;

		this.change({...value, type});
	};

	renderAutoColorsSettings = () => {
		const {auto} = this.props.value;

		return <AutoColorsSettings onChange={this.handleChangeAutoSettings} value={auto} />;
	};

	renderCustomColorsSettings = () => {
		const {disabledCustomSettings, labels, value} = this.props;
		const {auto: autoSettings, custom: customSettings} = value;

		if (!disabledCustomSettings && customSettings.data) {
			const {colors: defaultColors} = autoSettings;

			return (
				<CustomColorsSettings
					defaultColors={defaultColors}
					labels={labels}
					onChange={this.handleChangeCustomSettings}
					value={customSettings}
				/>
			);
		}

		return null;
	};

	renderSettings = () => {
		const {CUSTOM} = CHART_COLORS_SETTINGS_TYPES;

		return this.getCurrentSettingsType() === CUSTOM ? this.renderCustomColorsSettings() : this.renderAutoColorsSettings();
	};

	renderSettingsTypeControl = (value: ChartColorsSettingsType, label: string, disabled: boolean = false) => {
		const checked = this.getCurrentSettingsType() === value;

		return (
			<FormField>
				<RadioField
					checked={checked}
					disabled={disabled}
					label={label}
					onChange={this.handleChangeType}
					value={value}
				/>
			</FormField>
		);
	};

	renderSettingsTypeControls = () => {
		const {disabledCustomSettings} = this.props;
		const {AUTO, CUSTOM} = CHART_COLORS_SETTINGS_TYPES;

		return (
			<Fragment>
				{this.renderSettingsTypeControl(AUTO, 'Автоматически')}
				{this.renderSettingsTypeControl(CUSTOM, 'Вручную', disabledCustomSettings)}
			</Fragment>
		);
	};

	render () {
		return (
			<CollapsableFormBox showContent={true} title="Цвета диаграммы">
				{this.renderSettingsTypeControls()}
				{this.renderSettings()}
			</CollapsableFormBox>
		);
	}
}

export default ColorsBox;
