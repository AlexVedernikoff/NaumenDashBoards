// @flow
import type {
	ChartColorsSettings,
	CustomChartColorsSettingsData,
	CustomChartColorsSettingsType
} from 'store/widgets/data/types';
import {
	CHART_COLORS_SETTINGS_TYPES,
	CUSTOM_CHART_COLORS_SETTINGS_TYPES,
	DEFAULT_BREAKDOWN_COLOR,
	DEFAULT_COLORS_SETTINGS
} from 'store/widgets/data/constants';
import Component from 'DiagramWidgetEditForm/components/ColorsBox';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {getCustomColorsSettingsKey, getCustomColorsSettingsType} from 'store/widgets/data/helpers';
import {hasBreakdown, isAxisChart, isCircleChart} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React from 'react';

export class ColorsBox extends React.Component<Props, State> {
	static defaultProps = {
		disabledCustomSettings: true,
		value: DEFAULT_COLORS_SETTINGS
	};

	state = {
		labels: this.getLabels(this.props)
	};

	componentDidMount () {
		this.setSettingsByActualData();
	}

	componentDidUpdate (prevProps: Props) {
		const {globalColorsSettings: prevGlobalSettings, values: prevValues} = prevProps;
		const {globalColorsSettings, values} = this.props;

		if (prevValues.data !== values.data || prevGlobalSettings !== globalColorsSettings) {
			this.setSettingsByActualData();
			this.setState({labels: this.getLabels(this.props)});
		}
	}

	getLabels (props: Props): Array<string> {
		const {buildData, widget} = props;
		let labels = [];

		if (buildData?.data && (isCircleChart(buildData.type) || isAxisChart(buildData.type))) {
			const {labels: dataLabels, series} = buildData.data;

			labels = hasBreakdown(widget) && !isCircleChart(widget.type)
				? series.map(s => s.name)
				: dataLabels;
		}

		return labels;
	}

	createBreakdownCustomSettings = (key: string): CustomChartColorsSettingsData => ({
		colors: [],
		defaultColor: DEFAULT_BREAKDOWN_COLOR,
		key,
		type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
	});

	createCustomSettings = (type: CustomChartColorsSettingsType, key: string | null) => {
		let settings = null;

		if (key) {
			settings = type === CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
				? this.createBreakdownCustomSettings(key)
				: this.createLabelCustomSettings(key);
		}

		return settings;
	};

	createLabelCustomSettings = (key: string): CustomChartColorsSettingsData => {
		const {colors: defaultColors} = this.props.value.auto;

		return {
			colors: [],
			defaultColor: defaultColors[0],
			key,
			type: CUSTOM_CHART_COLORS_SETTINGS_TYPES.LABEL
		};
	};

	getCustomColorsSettingsData = () => {
		const {globalColorsSettings, values, widget} = this.props;
		const {data: customSettingsData, useGlobal} = values.colorsSettings.custom;
		const currentKey = getCustomColorsSettingsKey(widget);
		let settingsData;

		if (useGlobal && globalColorsSettings) {
			settingsData = globalColorsSettings;
		} else if (customSettingsData?.key === currentKey) {
			settingsData = customSettingsData;
		} else if (getCustomColorsSettingsKey(values) === currentKey) {
			const currentType = getCustomColorsSettingsType(widget);

			settingsData = this.createCustomSettings(currentType, currentKey);
		}

		return settingsData;
	};

	getNewSettingsByResetGlobal = (settings: ChartColorsSettings) => {
		const {
			globalColorsSettings,
			removeCustomChartColorsSettings,
			setUseGlobalChartSettings,
			widget
		} = this.props;
		const {data: newCustomData} = settings.custom;
		let newSettings = settings;

		if (globalColorsSettings && newCustomData) {
			const {key} = newCustomData;
			const widgetCustomSettingsData = widget.colorsSettings?.custom.data;

			setUseGlobalChartSettings(newCustomData, false);
			removeCustomChartColorsSettings(key);

			if (widgetCustomSettingsData?.key === key) {
				newSettings = {
					...newSettings,
					custom: {
						...newSettings.custom,
						data: widgetCustomSettingsData
					}
				};
			} else {
				newSettings = {
					...newSettings,
					custom: {
						...newSettings.custom,
						data: undefined
					},
					type: CHART_COLORS_SETTINGS_TYPES.AUTO
				};
			}
		}

		return newSettings;
	};

	handleChange = (name: string, value: ChartColorsSettings) => {
		const {onChange, value: colorsSettings, values} = this.props;
		const {custom: customSettings} = colorsSettings;
		const {custom: newCustomSettings} = value;
		let newSettings = value;

		if (customSettings.useGlobal && !newCustomSettings.useGlobal) {
			newSettings = this.getNewSettingsByResetGlobal(newSettings);
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
		const {disabledCustomSettings, globalColorsSettings, values, widget} = this.props;
		const currentKey = getCustomColorsSettingsKey(values);

		return disabledCustomSettings
			|| (globalColorsSettings?.key !== currentKey && getCustomColorsSettingsKey(widget) !== currentKey);
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

			if (newColorsSettings !== colorsSettings) {
				onChange(name, newColorsSettings);
			}
		}
	};

	render () {
		const {name, value, widget} = this.props;
		const {labels} = this.state;

		return (
			<Component
				disabledCustomSettings={this.isDisabledCustomSettings()}
				labels={labels}
				name={name}
				onChange={this.handleChange}
				usesBreakdownCustomSettings={hasBreakdown(widget)}
				value={value}
			/>
		);
	}
}

export default connect(props, functions)(ColorsBox);
