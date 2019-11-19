// @flow
import {CheckBox, Divider, FieldLabel, Label, TextArea} from 'components/atoms';
import cn from 'classnames';
import type {CheckBoxProps, LabelProps, SelectProps, State, TextAreaProps} from './types';
import {ErrorMessage} from 'formik';
import type {FormikProps} from 'formik';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, Fragment} from 'react';
import {Select} from 'components/molecules';
import {styles} from 'components/organisms/WidgetFormPanel';

export class FormBuilder extends Component<Props & FormikProps, State> {
	handleClick = (name: string, value: boolean) => this.props.setFieldValue(name, value);

	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: any) => this.props.setFieldValue(name, value);

	renderLabel = (props: LabelProps) => (
		<div className={styles.field}>
			<Label {...props} />
		</div>
	);

	renderCheckBox = (props: CheckBoxProps) => {
		const {hideDivider, label, name, value} = props;

		return (
			<Fragment>
				<div className={styles.field} key={name}>
					<CheckBox
						label={label}
						onClick={this.handleClick}
						name={name}
						value={value}
					/>
				</div>
				{!hideDivider && <Divider className={styles.dividerLeft} />}
			</Fragment>
		);
	};

	renderSelect = (props: SelectProps) => (
		<div key={props.name}>
			<Select onSelect={props.onSelect || this.handleSelect} {...props} />
			<span className={styles.error}>
				{this.props.errors[props.name]}
			</span>
		</div>
	);

	renderTextArea = (props: TextAreaProps) => {
		const {handleBlur: formikHandleBlur, handleChange} = this.props;
		const {handleBlur, label, name, placeholder, value} = props;

		return (
			<div className={cn([styles.field, styles.textAreaField])}>
				<FieldLabel text={label} />
				<TextArea
					name={name}
					onBlur={handleBlur || formikHandleBlur}
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
