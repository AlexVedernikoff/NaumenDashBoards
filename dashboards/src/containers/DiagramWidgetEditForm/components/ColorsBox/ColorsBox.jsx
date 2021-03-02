// @flow
import type {
	ChartColorsSettings,
	CustomBreakdownChartColorsSettings,
	CustomChartColorsSettingsType,
	CustomLabelChartColorsSettings
} from 'store/widgets/data/types';
import {CHART_COLORS_SETTINGS_TYPES, CUSTOM_CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import Component from 'DiagramWidgetEditForm/components/ColorsBox';
import {connect} from 'react-redux';
import {DEFAULT_COLORS_SETTINGS} from 'utils/chart/constants';
import {functions, props} from './selectors';
import {getCustomColorsSettingsKey, getCustomColorsSettingsType} from 'store/widgets/data/helpers';
import type {Props} from './types';
import React from 'react';

export class ColorsBox extends React.Component<Props> {
	static defaultProps = {
		disabledCustomSettings: true,
		value: DEFAULT_COLORS_SETTINGS
	};

	componentDidMount () {
		this.setSettingsByActualData();
	}

	componentDidUpdate (prevProps: Props) {
		const {values: prevValues} = prevProps;
		const {values} = this.props;

		if (prevValues.data !== values.data) {
			this.setSettingsByActualData();
		}
	}

	createBreakdownCustomSettings = (key: string): CustomBreakdownChartColorsSettings => ({
		colors: [],
		key,
		type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
	});

	createCustomSettings = (type: CustomChartColorsSettingsType, key: string) => type === CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
		? this.createBreakdownCustomSettings(key)
		: this.createLabelCustomSettings(key);

	createLabelCustomSettings = (key: string): CustomLabelChartColorsSettings => {
		const {colors: defaultColors} = this.props.value.auto;

		return {
			colors: [],
			defaultColor: defaultColors[0],
			key,
			type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.LABEL
		};
	};

	getCustomColorsSettingsData = () => {
		const {customChartColorsSettings, values, widget} = this.props;
		const {data: customSettingsData, useGlobal} = values.colorsSettings.custom;
		const currentType = getCustomColorsSettingsType(widget);
		const currentKey = getCustomColorsSettingsKey(widget);
		let settingsData;

		if (useGlobal && customChartColorsSettings[currentKey]?.data) {
			settingsData = customChartColorsSettings[currentKey].data;
		} else if (customSettingsData?.key === currentKey) {
			settingsData = customSettingsData;
		} else if (getCustomColorsSettingsKey(values) === currentKey) {
			settingsData = this.createCustomSettings(currentType, currentKey);
		}

		return settingsData;
	};

	handleChange = (name: string, value: ChartColorsSettings) => {
		const {
			customChartColorsSettings,
			onChange,
			removeCustomChartColorsSettings,
			setUseGlobalChartSettings,
			value: colorsSettings,
			values
		} = this.props;
		const {custom: customSettings} = colorsSettings;
		const {custom: newCustomSettings} = value;
		let newSettings = value;

		if (customSettings.useGlobal && !newCustomSettings.useGlobal && newCustomSettings.data) {
			const {key} = newCustomSettings.data;

			if (customChartColorsSettings[key]?.data) {
				setUseGlobalChartSettings(key, false);
				removeCustomChartColorsSettings(key);
			}
		}

		if (newSettings.type === CHART_COLORS_SETTINGS_TYPES.CUSTOM && !newCustomSettings.data) {
			const type = getCustomColorsSettingsType(values);
			const key = getCustomColorsSettingsKey(values);

			newSettings = {
				...newSettings,
				custom: {
					...newSettings.custom,
					data: this.createCustomSettings(type, key)
				}
			};
		}

		onChange(name, newSettings);
	};

	isDisabledCustomSettings = () => {
		const {disabledCustomSettings, values, widget} = this.props;

		return disabledCustomSettings || getCustomColorsSettingsKey(widget) !== getCustomColorsSettingsKey(values);
	};

	setSettingsByActualData = () => {
		const {name, onChange, value: colorsSettings} = this.props;
		const {custom: customSettings, type} = colorsSettings;

		if (type === CHART_COLORS_SETTINGS_TYPES.CUSTOM) {
			let newColorsSettings = colorsSettings;
			const customData = this.getCustomColorsSettingsData();

			if (!customData) {
				newColorsSettings = {
					...newColorsSettings,
					type: CHART_COLORS_SETTINGS_TYPES.AUTO
				};
			} else if (customData !== customSettings.data) {
				newColorsSettings = {
					...newColorsSettings,
					custom: {
						...colorsSettings.custom,
						data: customData
					}
				};
			}

			onChange(name, newColorsSettings);
		}
	};

	render () {
		const {buildData, name, value} = this.props;

		return (
			<Component
				buildData={buildData}
				disabledCustomSettings={this.isDisabledCustomSettings()}
				name={name}
				onChange={this.handleChange}
				value={value}
			/>
		);
	}
}

export default connect(props, functions)(ColorsBox);
