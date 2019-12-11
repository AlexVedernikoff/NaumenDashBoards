// @flow
import {Checkbox, Divider, ExtendButton, FieldLabel, Label, TextArea} from 'components/atoms';
import type {CheckBoxProps, LabelProps, MiniSelectProps, SelectProps, State, TextAreaProps} from './types';
import type {FormikProps} from 'formik';
import {MiniSelect, Select, TreeSelectInput} from 'components/molecules';
import type {Node} from 'react';
import type {Props} from 'containers/WidgetFormPanel/types';
import type {Props as ExtendButtonProps} from 'components/atoms/ExtendButton/types';
import type {Props as TreeProps} from 'components/molecules/TreeSelectInput/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {styles as mainStyles} from 'components/organisms/WidgetFormPanel';

export class FormBuilder extends Component<Props & FormikProps, State> {
	handleClick = (name: string, value: boolean) => this.props.setFieldValue(name, value);

	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: any) => this.props.setFieldValue(name, value);

	renderCheckBox = (props: CheckBoxProps) => {
		const {hideDivider, label, name, value} = props;

		return (
			<Fragment>
				<div className={mainStyles.field} key={name}>
					<Checkbox
						label={label}
						onClick={this.handleClick}
						name={name}
						value={value}
					/>
				</div>
				{!hideDivider && <Divider className={styles.checkboxDivider} />}
			</Fragment>
		);
	};

	renderCombinedInputs = (left: Node, right: Node, withDivider: boolean = true) => (
		<div className={mainStyles.field}>
			<div className={styles.combinedInputs}>
				<div className={styles.combinedLeftInput}>{left}</div>
				<div className={styles.combinedRightInput}>{right}</div>
			</div>
			{withDivider && this.renderFieldDivider()}
		</div>
	);

	renderError = (name: string) => (
		<span className={mainStyles.error}>
			{this.props.errors[name]}
		</span>
	);

	renderExtendButton = (props: ExtendButtonProps) => (
		<div className={mainStyles.field}>
			<ExtendButton {...props} />
		</div>
	);

	renderFieldDivider = () => <Divider className={styles.fieldDivider} />;

	renderLabel = (text: string) => (
		<div className={mainStyles.field}>
			<span className={styles.label}>{text}</span>
		</div>
	);

	renderLabelWithIcon = (props: LabelProps) => (
		<div className={mainStyles.field}>
			<Label {...props} />
		</div>
	);

	renderMiniSelect = (props: MiniSelectProps) => <MiniSelect onSelect={this.handleSelect} {...props} />;

	renderSectionDivider = () => <Divider className={styles.sectionDivider} />;

	renderSelect = (props: SelectProps) => {
		const {hideError, onSelect, ...selectProps} = props;

		return (
			<div key={props.name}>
				<Select onSelect={onSelect || this.handleSelect} {...selectProps} />
				{!hideError && this.renderError(props.name)}
			</div>
		);
	};

	renderTextArea = (props: TextAreaProps) => {
		const {handleBlur: formikHandleBlur, handleChange} = this.props;
		const {handleBlur, label, name, placeholder, value} = props;

		return (
			<div className={mainStyles.field}>
				<FieldLabel text={label} />
				<TextArea
					name={name}
					onBlur={handleBlur || formikHandleBlur}
					onChange={handleChange}
					onReset={this.handleResetTextArea}
					placeholder={placeholder}
					value={value}
				/>
				{this.renderError(props.name)}
			</div>
		);
	};

	renderTreeSelect = (props: TreeProps) => (
		<div className={mainStyles.field}>
			<TreeSelectInput {...props} />
			{this.renderError(props.name)}
		</div>
	);
}

export default FormBuilder;
