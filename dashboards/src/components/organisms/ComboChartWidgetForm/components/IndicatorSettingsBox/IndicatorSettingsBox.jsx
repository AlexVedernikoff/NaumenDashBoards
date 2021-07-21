// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import type {DataSet} from 'store/widgetForms/comboChartForm/types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import HorizontalLabel from 'components/atoms/HorizontalLabel';
import LegacyCheckbox from 'components/atoms/LegacyCheckbox';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import Toggle from 'components/atoms/Toggle';

export class IndicatorSettingsBox extends PureComponent<Props, State> {
	state = this.initState(this.props);

	initState (props: Props) {
		const {max, min, showDependent} = props.value;

		return {
			showAdditionalSettings: Boolean(max || min || showDependent)
		};
	}

	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	handleChangeScale = (event: OnChangeEvent<string>) => {
		let {name, value} = event;

		if (value.toString().length === 0) {
			value = undefined;
		}

		this.change(name, value);
	};

	handleCheckboxChange = ({name, value}: OnChangeEvent<boolean>) => this.change(name, !value);

	handleClickDependentCheckbox = (name: string, value: boolean) => this.change(name, value);

	handleToggleAdditionalSettings = () => {
		const {name, onChange, value} = this.props;
		const {showAdditionalSettings} = this.state;

		this.setState({showAdditionalSettings: !showAdditionalSettings});

		if (showAdditionalSettings) {
			onChange(name, {
				...value,
				max: undefined,
				min: undefined,
				showDependent: false
			});
		}
	};

	renderAdditionalSettings = () => {
		const {showAdditionalSettings} = this.state;

		if (showAdditionalSettings) {
			return (
				<Fragment>
					{this.renderScaleField(DIAGRAM_FIELDS.min)}
					{this.renderScaleField(DIAGRAM_FIELDS.max)}
					{this.renderShowDependentCheckbox()}
				</Fragment>
			);
		}

		return null;
	};

	renderNameField = (dataSet: DataSet, index: number) => {
		const {onChangeYAxisName} = this.props;
		const {dataKey, sourceForCompute, yAxisName} = dataSet;

		if (!sourceForCompute) {
			return (
				<FormField key={dataKey} small>
					<TextInput
						maxLength={MAX_TEXT_LENGTH}
						name={DIAGRAM_FIELDS.yAxisName}
						onChange={onChangeYAxisName(index)}
						value={yAxisName}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderScaleField = (name: string) => {
		const {[name]: value} = this.props.value;

		return (
			<FormField row small>
				<HorizontalLabel>{name}</HorizontalLabel>
				<TextInput name={name} onChange={this.handleChangeScale} onlyNumber={true} placeholder="auto" value={value} />
			</FormField>
		);
	};

	renderShowDependentCheckbox = () => {
		const {showDependent} = this.props.value;

		return (
			<LegacyCheckbox
				className={styles.showDependentCheckbox}
				label="Показывать зависимо"
				name={DIAGRAM_FIELDS.showDependent}
				onClick={this.handleClickDependentCheckbox}
				value={showDependent}
			/>
		);
	};

	render () {
		const {data, value} = this.props;
		const {showAdditionalSettings} = this.state;
		const {show, showName} = value;

		return (
			<CollapsableFormBox title="Показатель">
				<FormField>
					<FormControl label="Показать ось" reverse={true}>
						<Toggle checked={show} name={DIAGRAM_FIELDS.show} onChange={this.handleCheckboxChange} value={show} />
					</FormControl>
				</FormField>
				<FormField>
					<FormControl label="Выводить название" reverse={true}>
						<Toggle checked={showName} name={DIAGRAM_FIELDS.showName} onChange={this.handleCheckboxChange} value={showName} />
					</FormControl>
				</FormField>
				{data.map(this.renderNameField)}
				<FormField>
					<FormControl label="Настроить параметры оси" reverse={true}>
						<Toggle
							checked={showAdditionalSettings}
							onChange={this.handleToggleAdditionalSettings}
							value={show}
						/>
					</FormControl>
				</FormField>
				{this.renderAdditionalSettings()}
			</CollapsableFormBox>
		);
	}
}

export default IndicatorSettingsBox;
