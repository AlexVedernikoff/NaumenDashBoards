// @flow
import type {
	AutoChartColorsSettings,
	ChartColorsSettings,
	ChartColorsSettingsType,
	CustomChartColorsSettings
} from 'store/widgets/data/types';
import AutoColorsSettings from './components/AutoColorsSettings';
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import {CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import CustomColorsSettings from './components/CustomColorsSettings';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import RadioField from 'components/atoms/RadioField';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import t from 'localization';
import T from 'components/atoms/Translation';

export class ColorsBox extends PureComponent<Props> {
	static defaultProps = {
		labels: [],
		usesBreakdownCustomSettings: false
	};

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
		const {position, value} = this.props;
		const {auto} = value;

		return (
			<AutoColorsSettings
				onChange={this.handleChangeAutoSettings}
				position={position}
				value={auto}
			/>
		);
	};

	renderClearButton = (showClear: boolean) => {
		const {isChanged, onClear} = this.props;

		if (showClear && isChanged) {
			return (
				<Button
					className={styles.clearButton}
					onClick={onClear}
					tooltip={t('ColorsBox::ClearButtonTooltip')}
					variant={BUTTON_VARIANTS.SIMPLE}
				>
					<T text="ColorsBox::ClearButton" />
				</Button>
			);
		}

		return null;
	};

	renderCustomColorsSettings = () => {
		const {disabledCustomSettings, labels, usesBreakdownCustomSettings, value} = this.props;
		const {auto: autoSettings, custom: customSettings} = value;

		if (!disabledCustomSettings && customSettings) {
			const {colors: defaultColors} = autoSettings;

			return (
				<CustomColorsSettings
					defaultColors={defaultColors}
					labels={labels}
					onChange={this.handleChangeCustomSettings}
					usesBreakdownSettings={usesBreakdownCustomSettings}
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

	renderSettingsTypeControl = (
		value: ChartColorsSettingsType,
		label: string,
		showClear: boolean,
		disabled: boolean = false
	) => (
		<FormField>
			<div className={styles.autoContainer}>
				{this.renderSettingsTypeField(value, label, disabled)}
				{this.renderClearButton(showClear)}
			</div>
		</FormField>
	);

	renderSettingsTypeControls = () => {
		const {disabledCustomSettings} = this.props;
		const {AUTO, CUSTOM} = CHART_COLORS_SETTINGS_TYPES;

		return (
			<Fragment>
				{this.renderSettingsTypeControl(AUTO, t('ColorsBox::Automatically'), true)}
				{this.renderSettingsTypeControl(CUSTOM, t('ColorsBox::Manually'), false, disabledCustomSettings)}
			</Fragment>
		);
	};

	renderSettingsTypeField = (value: ChartColorsSettingsType, label: string, disabled: boolean) => {
		const checked = this.getCurrentSettingsType() === value;

		return (
			<RadioField
				checked={checked}
				disabled={disabled}
				label={label}
				onChange={this.handleChangeType}
				value={value}
			/>
		);
	};

	render () {
		return (
			<CollapsableFormBox showContent={true} title={t('ColorsBox::ColorsOfChart')}>
				{this.renderSettingsTypeControls()}
				{this.renderSettings()}
			</CollapsableFormBox>
		);
	}
}

export default ColorsBox;
