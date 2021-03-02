// @flow
import Checkbox from 'src/components/atoms/Checkbox';
import type {
	CustomBreakdownChartColorsSettings as BreakdownColorsSettings,
	CustomChartColorsSettingsData,
	CustomLabelChartColorsSettings as LabelColorsSettings
} from 'store/widgets/data/types';
import CustomBreakdownColorsSettings
	from 'DiagramWidgetEditForm/components/ColorsBox/components/CustomBreakdownColorsSettings';
import {CUSTOM_CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import CustomLabelColorsSettings from 'DiagramWidgetEditForm/components/ColorsBox/components/CustomLabelColorsSettings';
import FormCheckControl from 'src/components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import {isCircleChart} from 'store/widgets/helpers';
import type {OnChangeEvent} from 'src/components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';

export class CustomColorsSettings extends PureComponent<Props> {
	getBreakdownLabels = (): Array<string> => {
		const {data, type} = this.props.buildData;
		const {labels, series} = data;

		return isCircleChart(type) ? labels : series.map(s => s.name);
	};

	handleChange = (data: CustomChartColorsSettingsData) => {
		const {onChange, value} = this.props;

		onChange({...value, data});
	};

	handleChangeApplyToAllCheckbox = ({value}: OnChangeEvent<boolean>) => {
		const {onChange, value: settings} = this.props;

		onChange({...settings, useGlobal: !value});
	};

	renderApplyToAllCheckbox = () => {
		const {useGlobal} = this.props.value;

		return (
			<FormField>
				<FormCheckControl label="Применить для всех виджетов на дашборде">
					<Checkbox checked={useGlobal} onChange={this.handleChangeApplyToAllCheckbox} value={useGlobal} />
				</FormCheckControl>
			</FormField>
		);
	};

	renderBreakdownCustomColorsSettings = (settings: BreakdownColorsSettings) => {
		const {defaultColors} = this.props;

		return (
			<CustomBreakdownColorsSettings
				defaultColors={defaultColors}
				labels={this.getBreakdownLabels()}
				onChange={this.handleChange}
				value={settings}
			/>
		);
	};

	renderLabelCustomColorsSettings = (settings: LabelColorsSettings) => {
		const {buildData, defaultColors} = this.props;

		return (
			<CustomLabelColorsSettings
				defaultColors={defaultColors}
				labels={buildData.data.labels}
				onChange={this.handleChange}
				value={settings}
			/>
		);
	};

	renderSettingsByType = () => {
		const {data} = this.props.value;

		if (data) {
			return data.type === CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN
				? this.renderBreakdownCustomColorsSettings(data)
				: this.renderLabelCustomColorsSettings(data);
		}

		return null;
	};

	render () {
		return (
			<Fragment>
				{this.renderSettingsByType()}
				{this.renderApplyToAllCheckbox()}
			</Fragment>
		);
	}
}

export default CustomColorsSettings;
