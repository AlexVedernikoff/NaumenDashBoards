// @flow
import Checkbox from 'components/atoms/Checkbox';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import {getDefaultComboYAxisName} from 'store/widgets/data/helpers';
import HorizontalLabel from 'components/atoms/HorizontalLabel';
import LegacyCheckbox from 'components/atoms/LegacyCheckbox';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class IndicatorSettingsBox extends PureComponent<Props, State> {
	state = this.initState(this.props);

	initState (props: Props) {
		const {max, min, showDependent} = props.data;

		return {
			showAdditionalSettings: Boolean(max || min || showDependent)
		};
	}

	handleChange = (event: OnChangeInputEvent) => {
		const {handleChange} = this.props;
		let {value} = event;

		if (value.toString().length === 0) {
			value = undefined;
		}

		handleChange({...event, value});
	};

	handleChangeName = (index: number) => (event: OnChangeInputEvent) => {
		const {onChangeDataSetValue} = this.props;
		const {name, value} = event;

		onChangeDataSetValue(index, name, value);
	};

	handleClickDependentCheckbox = (name: string, value: boolean) => this.props.handleChange({name, value});

	handleToggleAdditionalSettings = () => {
		const {data, name, onChange} = this.props;
		const {showAdditionalSettings} = this.state;

		this.setState({showAdditionalSettings: !showAdditionalSettings});

		if (showAdditionalSettings) {
			onChange(name, {
				...data,
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
					{this.renderScaleField(FIELDS.min)}
					{this.renderScaleField(FIELDS.max)}
					{this.renderShowDependentCheckbox()}
				</Fragment>
			);
		}

		return null;
	};

	renderNameField = (dataSet: DataSet, index: number) => {
		const {yAxisName = getDefaultComboYAxisName(dataSet)} = dataSet;

		return (
			<FormField small>
				<TextInput
					maxLength={MAX_TEXT_LENGTH}
					name={FIELDS.yAxisName}
					onChange={this.handleChangeName(index)}
					value={yAxisName}
				/>
			</FormField>
		);
	};

	renderScaleField = (name: string) => {
		const {[name]: value} = this.props.data;

		return (
			<FormField row small>
				<HorizontalLabel>{name}</HorizontalLabel>
				<TextInput name={name} onChange={this.handleChange} onlyNumber={true} placeholder="auto" value={value} />
			</FormField>
		);
	};

	renderShowDependentCheckbox = () => {
		const {data} = this.props;
		const {showDependent} = data;

		return (
			<LegacyCheckbox
				className={styles.showDependentCheckbox}
				label="Показывать зависимо"
				name={FIELDS.showDependent}
				onClick={this.handleClickDependentCheckbox}
				value={showDependent}
			/>
		);
	};

	render () {
		const {data, handleBoolChange, values} = this.props;
		const {show, showName} = data;
		const {showAdditionalSettings} = this.state;

		return (
			<CollapsableFormBox title="Показатель">
				<FormField>
					<FormCheckControl label="Показать ось">
						<Checkbox checked={show} name={FIELDS.show} onChange={handleBoolChange} value={show} />
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormCheckControl label="Выводить название">
						<Checkbox checked={showName} name={FIELDS.showName} onChange={handleBoolChange} value={showName} />
					</FormCheckControl>
				</FormField>
				{values.data.filter(dataSet => !dataSet.sourceForCompute).map(this.renderNameField)}
				<FormField>
					<FormCheckControl label="Настроить параметры оси">
						<Checkbox
							checked={showAdditionalSettings}
							onChange={this.handleToggleAdditionalSettings}
							value={show}
						/>
					</FormCheckControl>
				</FormField>
				{this.renderAdditionalSettings()}
			</CollapsableFormBox>
		);
	}
}

export default withStyleFormBuilder(IndicatorSettingsBox);
