// @flow
import {AttrSelect, Button, CheckBox, FormField, TextArea} from 'components/atoms';
import type {
	AttrSelectProps,
	CheckBoxProps,
	SelectProps,
	SelectValue,
	TextAreaProps,
	TreeSelectProps
} from './types';
import {CHART_SELECTS} from 'utils/chart';
import DataSourceInput from 'containers/DataSourceInput/DataSourceInput';
import {getActualAggregate, getAggregateOptions, typeOfExtendedAggregate} from 'utils/aggregate';
import {getGroupOptions, typeOfExtendedGroups} from 'utils/group';
import {ErrorMessage} from 'formik';
import type {OptionType} from 'react-select/src/types';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component} from 'react';
import Select from 'react-select';
import styles from './styles.less';

export class WidgetFormPanel extends Component<Props> {
	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (value: OptionType, {name}: OptionType) => this.props.setFieldValue(name, value);

	handleSelectXAxis = (value: OptionType) => {
		const {setFieldValue} = this.props;

		setFieldValue('xAxis', value);

		if (!typeOfExtendedGroups(value)) {
			setFieldValue('group', null);
		}
	};

	handleSelectYAxis = (value: OptionType) => {
		const {setFieldValue, values} = this.props;

		setFieldValue('yAxis', value);

		if (!typeOfExtendedAggregate(value)) {
			setFieldValue('aggregate', getActualAggregate(value, values.group));
		}
	};

	handleSelectSource = (source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue} = this.props;

		setFieldValue('source', source);
		['xAxis', 'yAxis', 'aggregate', 'group'].forEach(k => setFieldValue(k, null));

		if (!attributes[source.value]) {
			fetchAttributes(source.value);
		}
	};

	renderTextArea = (props: TextAreaProps) => {
		const {handleBlur, handleChange} = this.props;
		const {label, name, placeholder, value} = props;

		return (
			<FormField>
				<TextArea
					label={label}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					onReset={this.handleResetTextArea}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</FormField>
		);
	};

	renderCheckBox = (props: CheckBoxProps) => {
		const {handleChange} = this.props;
		const {label, name, value} = props;

		return (
			<FormField>
				<CheckBox
					handleClick={handleChange}
					label={label}
					name={name}
					value={value}
				/>
			</FormField>
		);
	};

	renderTreeSelect = (props: TreeSelectProps) => {
		const {name, value} = props;

		return (
			<FormField>
				<DataSourceInput
					onChange={this.handleSelectSource}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</FormField>
		);
	};

	renderSelect = (props: SelectProps) => {
		const {name, options, placeholder, value} = props;

		return (
			<FormField>
				<Select
					placeholder={placeholder}
					onChange={this.handleSelect}
					options={options}
					value={value}
					name={name}
				/>
				<ErrorMessage name={name}/>
			</FormField>
		);
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		const {isLoading, name, onChange, options, placeholder, value} = props;

		return (
			<FormField>
				<AttrSelect
					placeholder={placeholder}
					name={name}
					onChange={onChange}
					isLoading={isLoading}
					value={value}
					options={options}
				/>
				<ErrorMessage name={name}/>
			</FormField>
		);
	};

	renderControlButtons = () => {
		const {cancelForm} = this.props;

		return (
			<div className={styles.formGroup}>
				<Button type="submit">Применить</Button>
				<Button outline onClick={cancelForm}>Отмена</Button>
			</div>
		);
	};

	renderForm = () => {
		const {
			attributes,
			isLoadingAttr,
			handleSubmit,
			values
		} = this.props;

		const attrOptions = (values.source && attributes[values.source.value]) || [];

		const name: TextAreaProps = {
			label: 'Название виджета',
			name: 'name',
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values.name
		};

		const nameVisibility: CheckBoxProps = {
			label: 'Название виджета',
			name: 'isNameShown',
			value: values.isNameShown
		};

		const desc: TextAreaProps = {
			label: 'Описание',
			name: 'desc',
			value: values.desc
		};

		const source: TreeSelectProps = {
			name: 'desc',
			value: values.source
		};

		const chart: SelectProps = {
			name: 'chart',
			options: CHART_SELECTS,
			placeholder: 'Список диаграмм',
			value: values.chart
		};

		const xAxis: AttrSelectProps = {
			isLoading: isLoadingAttr,
			name: 'xAxis',
			onChange: this.handleSelectXAxis,
			options: attrOptions,
			placeholder: 'Ось X',
			value: values.xAxis
		};

		const group: SelectProps = {
			name: 'chart',
			options: getGroupOptions(values.xAxis),
			placeholder: 'Группировка',
			value: values.group
		};

		const yAxis: AttrSelectProps = {
			isLoading: isLoadingAttr,
			name: 'yAxis',
			onChange: this.handleSelectYAxis,
			options: attrOptions,
			placeholder: 'Ось T',
			value: values.yAxis
		};

		const aggregate: SelectProps = {
			name: 'aggregate',
			options: getAggregateOptions(values.yAxis),
			placeholder: 'Агрегация',
			value: values.aggregate
		};

		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				{this.renderTextArea(name)}
				{this.renderCheckBox(nameVisibility)}
				{this.renderTextArea(desc)}
				{this.renderTreeSelect(source)}
				{this.renderSelect(chart)}
				{this.renderAttrSelect(xAxis)}
				{typeOfExtendedGroups(values.xAxis) && this.renderSelect(group)}
				{this.renderAttrSelect(yAxis)}
				{this.renderSelect(aggregate)}
				{this.renderControlButtons()}
			</form>
		);
	};

	render () {
		return this.renderForm();
	}
}

export default WidgetFormPanel;
