// @flow
import Checkbox from 'components/atoms/Checkbox';
import CustomBreakdownColorsSettings
	from 'WidgetFormPanel/components/ColorsBox/components/CustomBreakdownColorsSettings';
import type {CustomChartColorsSettingsData} from 'store/widgets/data/types';
import CustomLabelColorsSettings from 'WidgetFormPanel/components/ColorsBox/components/CustomLabelColorsSettings';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import t from 'localization';

export class CustomColorsSettings extends PureComponent<Props> {
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
				<FormControl label={t('CustomColorsSettings::ApplyForAllWidgets')}>
					<Checkbox checked={useGlobal} onChange={this.handleChangeApplyToAllCheckbox} value={useGlobal} />
				</FormControl>
			</FormField>
		);
	};

	renderBreakdownCustomColorsSettings = (value: CustomChartColorsSettingsData) => {
		const {defaultColors, labels} = this.props;

		return (
			<CustomBreakdownColorsSettings
				defaultColors={defaultColors}
				labels={labels}
				onChange={this.handleChange}
				value={value}
			/>
		);
	};

	renderLabelCustomColorsSettings = (value: CustomChartColorsSettingsData) => {
		const {defaultColors, labels} = this.props;

		return (
			<CustomLabelColorsSettings
				defaultColors={defaultColors}
				labels={labels}
				onChange={this.handleChange}
				value={value}
			/>
		);
	};

	renderSettingsByType = () => {
		const {usesBreakdownSettings, value} = this.props;

		if (value.data) {
			return usesBreakdownSettings
				? this.renderBreakdownCustomColorsSettings(value.data)
				: this.renderLabelCustomColorsSettings(value.data);
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
