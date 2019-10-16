// @flow
import {CheckBox, Divider, Label, MultiSelect, TextArea} from 'components/atoms';
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
		const {hideDivider, label, name, value} = props;

		return (
			<div className={styles.field} key={name}>
				<CheckBox
					onClick={this.handleClick}
					label={label}
					name={name}
					value={value}
				/>
				{!hideDivider && <Divider className={styles.dividerLeft} />}
			</div>
		);
	};

	renderSelect = (props: SelectProps) => (
		<div className={styles.field}>
			<MultiSelect onSelect={props.handleSelect || this.handleSelect} {...props} />
			<span className={styles.error}>
				<ErrorMessage name={props.name}/>
			</span>
		</div>
	);

	renderLabel = (props: LabelProps) => (
		<div className={styles.field}>
			<Label {...props} />
		</div>
	);

	renderHeader = (title: string) => (
		<div className={styles.field}>
			<span className={styles.header}>{title}</span>
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
				<span className={styles.error}>
					<ErrorMessage name={name} />
				</span>
			</div>
		);
	};
}

export default FormBuilder;
