// @flow
import {CheckBox, Label, MultiSelect, TextArea} from 'components/atoms';
import type {CheckBoxProps, LabelProps, SelectProps, State, TextAreaProps} from 'components/organisms/WidgetFormPanel/types';
import {ErrorMessage} from 'formik';
import type {OptionType} from 'react-select/src/types';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component} from 'react';
import {styles} from 'components/organisms/WidgetFormPanel';

export class FormBuilder extends Component<Props, State> {
	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: OptionType) => this.props.setFieldValue(name, value);

	handleClick = (name: string, value: boolean) => this.props.setFieldValue(name, value);

	renderCheckBox = (props: CheckBoxProps) => {
		const {label, name, value} = props;

		return (
			<div className={styles.field}>
				<CheckBox
					onClick={this.handleClick}
					label={label}
					name={name}
					value={value}
				/>
			</div>
		);
	};

	renderSelect = (props: SelectProps) => (
		<div className={styles.field}>
			<MultiSelect onSelect={props.handleSelect || this.handleSelect} {...props} />
			<ErrorMessage name={props.name}/>
		</div>
	);

	renderLabel = (props: LabelProps) => (
		<div className={styles.field}>
			<Label {...props} />
		</div>
	);

	renderTextArea = (props: TextAreaProps) => {
		const {handleBlur, handleChange} = this.props;
		const {label, name, placeholder, value} = props;

		return (
			<div className={styles.field}>
				<TextArea
					label={label}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					onReset={this.handleResetTextArea}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name} />
			</div>
		);
	};
}

export default FormBuilder;
