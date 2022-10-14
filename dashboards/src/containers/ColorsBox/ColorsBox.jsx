// @flow
import type {
	ChartColorsSettings,
	Widget
} from 'store/widgets/data/types';
import {
	CHART_COLORS_SETTINGS_TYPES,
	DEFAULT_BREAKDOWN_COLOR,
	DEFAULT_COLORS_SETTINGS
} from 'store/widgets/data/constants';
import ColorsBox from 'WidgetFormPanel/components/ColorsBox';
import {compose} from 'redux';
import {connect} from 'react-redux';
import deepEqual from 'fast-deep-equal';
import {functions, props} from './selectors';
import {getCustomColorsSettingsKey, getCustomColorsSettingsKeyByData} from 'store/widgets/data/helpers';
import {hasBreakdown, isAxisChart, isCircleChart} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React from 'react';
import type {Values} from 'components/organisms/WidgetForm/types';
import withType from 'WidgetFormPanel/HOCs/withType';

export class ColorsBoxContainer extends React.Component<Props, State> {
	static defaultProps = {
		disabledCustomSettings: true,
		value: DEFAULT_COLORS_SETTINGS
	};

	state = {
		labels: this.getLabels(this.props),
		valueChanged: false
	};

	componentDidMount () {
		this.checkValueChanged();
		this.setSettingsByActualData();
	}

	componentDidUpdate (prevProps: Props) {
		const {
			buildData: prevBuildData,
			globalColorsSettings: prevGlobalSettings,
			value: prevValue,
			values: prevValues
		} = prevProps;
		const {buildData, globalColorsSettings, value, values} = this.props;

		if (prevValues.data !== values.data
			|| prevGlobalSettings !== globalColorsSettings
			|| prevBuildData?.data !== buildData?.data
			|| (value.type === CHART_COLORS_SETTINGS_TYPES.CUSTOM && value.type !== prevValue.type)
		) {
			this.setSettingsByActualData();
			this.setState({labels: this.getLabels(this.props)});
		}

		if (!deepEqual(value, prevValue)) {
			this.checkValueChanged();
		}
	}

	checkValueChanged = () => {
		const {value} = this.props;
		const valueChanged = !deepEqual(value, DEFAULT_COLORS_SETTINGS);

		this.setState({valueChanged});
	};

	createCustomSettings = (widget: Widget | Values) => {
		const {colors: defaultColors} = this.props.value.auto;
		const key = getCustomColorsSettingsKey(widget);
		let settings = null;

		if (key) {
			const defaultColor = hasBreakdown(widget) ? DEFAULT_BREAKDOWN_COLOR : defaultColors[0];

			settings = {
				colors: [],
				defaultColor,
				key
			};
		}

		return settings;
	};

	getCustomColorsSettingsData = () => {
		const {globalColorsSettings, type, values, widget} = this.props;
		const {data: customSettingsData, useGlobal} = values.colorsSettings.custom;
		const currentKey = getCustomColorsSettingsKey(widget);
		let settingsData;

		if (useGlobal && globalColorsSettings) {
			settingsData = globalColorsSettings;
		} else if (customSettingsData?.key === currentKey) {
			settingsData = customSettingsData;
		} else if (getCustomColorsSettingsKeyByData(values.data, type.value) === currentKey) {
			settingsData = this.createCustomSettings(widget);
		}

		return settingsData;
	};

	getLabels (props: Props): Array<string> {
		const {buildData, widget} = props;
		let labels = [];

		if (buildData?.data && (isCircleChart(buildData.type) || isAxisChart(buildData.type))) {
			const {labels: dataLabels, series} = buildData.data;

			labels = hasBreakdown(widget) && !isCircleChart(widget.type) ? series.map(s => s.name) : dataLabels;
		}

		return labels;
	}

	getNewSettingsByResetGlobal = (settings: ChartColorsSettings) => {
		const {
			globalColorsSettings,
			removeCustomChartColorsSettings,
			setUseGlobalChartSettings,
			/*
				$FlowFixMe - отображает ошибку отсутствия виджета в пропсах, но на самом деле ошибка в отсутствии colorsSettings
				в некоторых виджетах. На текущей версии flow[0.145.0] по другому обойти не получается
			 */
			widget
		} = this.props;
		let newSettings = settings;

		if (globalColorsSettings) {
			const {key} = globalColorsSettings;
			const widgetCustomSettingsData = widget?.colorsSettings?.custom?.data;

			setUseGlobalChartSettings(key, false);
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
			newSettings = {
				...newSettings,
				custom: {
					...newSettings.custom,
					data: this.createCustomSettings(values)
				}
			};
		}

		onChange(name, newSettings);
	};

	handleClear = () => {
		const {name, onChange} = this.props;
		return onChange(name, DEFAULT_COLORS_SETTINGS);
	};

	isDisabledCustomSettings = () => {
		const {disabledCustomSettings, globalColorsSettings, type, values, widget} = this.props;
		const currentKey = getCustomColorsSettingsKeyByData(values.data, type.value);

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
		const {name, position, value, widget} = this.props;
		const {labels, valueChanged} = this.state;

		return (
			<ColorsBox
				disabledCustomSettings={this.isDisabledCustomSettings()}
				isChanged={valueChanged}
				labels={labels}
				name={name}
				onChange={this.handleChange}
				onClear={this.handleClear}
				position={position}
				usesBreakdownCustomSettings={hasBreakdown(widget)}
				value={value}
			/>
		);
	}
}

export default compose(withType, connect(props, functions))(ColorsBoxContainer);
