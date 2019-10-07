// @flow
import {CheckBox, Label, MultiSelect, TextArea} from 'components/atoms';
import type {CheckBoxProps, LabelProps, SelectProps, TextAreaProps} from 'components/organisms/WidgetFormPanel/types';
import {ErrorMessage} from 'formik';
import type {OptionType} from 'react-select/src/types';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component} from 'react';
import {styles} from 'components/organisms/WidgetFormPanel';

export class FormBuilder<P = {}, S = {}> extends Component<Props & P, S> {
	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: OptionType) => this.props.setFieldValue(name, value);

	renderCheckBox = (props: CheckBoxProps) => {
		const {handleChange} = this.props;
		const {label, name, value} = props;

		return (
			<div className={styles.field}>
				<CheckBox
					handleClick={handleChange}
					label={label}
					name={name}
					value={value}
				/>
			</div>
		);
	};

	renderSelect = (props: SelectProps) => {
		const {label, name, onChange, options, placeholder, value} = props;

		return (
			<div className={styles.field}>
				<MultiSelect
					label={label}
					name={name}
					onChange={onChange || this.handleSelect}
					options={options}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name} />
			</div>
		);
	};

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
