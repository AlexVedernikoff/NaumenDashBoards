// @flow
import CheckBox from 'components/molecules/CheckBox';
import {ErrorMessage, Field, FieldProps, Form, Formik, FormikProps} from 'formik';
import type {ButtonProps, InputProps, SettingsProps} from './types';
import type {Props} from 'containers/DashboardWidgetPanelForm/types';
import React, {Component} from 'react';
import TextArea from 'components/molecules/TextArea';

export class DashboardWidgetPanelForm extends Component<Props> {
	handleEdit = (key: string, value: string | boolean): void => {
		const {updateWidget} = this.props;
		updateWidget({[key]: value});
	};

	handleChangeTextArea = ({target}: SyntheticInputEvent<HTMLInputElement>): void => {
		this.handleEdit(target.name, target.value);
	};

	handleClickCheckBox = (name: string, value: boolean): void => {
		this.handleEdit(name, !value);
	};

	checkBox = ({field, onClick, label}: FieldProps) => <CheckBox field={field} handleClick={onClick} label={label} />;

	validateTitle = (value: string): string | undefined => {
		return value ? undefined : 'Введите название виджета!';
	};

	textArea = (props: FieldProps) => {
		const {field, handleChange, label, onBlur, placeholder, value} = props;
		const {name} = field;

		return (
			<div>
				<TextArea
					label={label}
					name={name}
					onBlur={onBlur}
					onChange={handleChange}
					placeholder={placeholder}
					value={value}
					/>
				<ErrorMessage name={name}/>
			</div>
		);
	};

	renderButton = ({type, value}: ButtonProps) => <button type={type}>{value}</button>;

	renderCheckBox = (settingsProps: SettingsProps) => <Field {...settingsProps} component={this.checkBox} />;

	renderTextArea = (inputProps: InputProps) => <Field {...inputProps} component={this.textArea} />;

	renderForm = ({values, handleBlur}: FormikProps) => {
		const description = {
			label: 'Описание виджета',
			name: 'description',
			handleChange: this.handleChangeTextArea,
			placeholder: ''
		};

		const name = {
			handleChange: this.handleChangeTextArea,
			label: 'Название виджета',
			name: 'name',
			onBlur: handleBlur,
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			validate: this.validateTitle,
			value: values.name
		};

		const buttons = {
			submit: {
				type: 'submit',
				value: 'Сохранить'
			}
		};

		const settings = {
			isNameShown: {
				label: 'Выводить название',
				name: 'isNameShown',
				onClick: this.handleClickCheckBox
			}
		};

		return (
			<Form>
				{this.renderTextArea(name)}
				{this.renderTextArea(description)}
				{this.renderCheckBox(settings.isNameShown)}
				{this.renderButton(buttons.submit)}
			</Form>
		);
	};

	render () {
		const {closeWidgetPanel, editedWidget} = this.props;
		const {description, isNameShown, name} = editedWidget;
		const initialValues = {
			description,
			isNameShown,
			name
		};

		return (
			<div>
				<h2>{name}</h2>
				<Formik
					enableReinitialize={true}
					initialValues={initialValues}
					onSubmit={closeWidgetPanel}
					render={this.renderForm}
				/>
			</div>
		);
	}
}

export default DashboardWidgetPanelForm;
