// @flow
import {Checkbox, Divider, ExtendButton, FieldError, FieldLabel, Label, TextArea} from 'components/atoms';
import type {CheckboxProps, LabelProps, SelectProps, TextAreaProps} from './types';
import {MiniSelect, Select} from 'components/molecules';
import type {Props as FormProps} from 'containers/WidgetFormPanel/types';
import type {Props as ExtendButtonProps} from 'components/atoms/ExtendButton/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {styles as mainStyles} from 'components/organisms/WidgetFormPanel';
import type {Variant as DividerVariant} from 'components/atoms/Divider/types';

export class FormBuilder<Props: ?{} = {}, State: ?{} = null> extends Component<Props & FormProps, State> {
	handleClick = (name: string, value: boolean) => this.props.setFieldValue(name, value);

	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: any) => this.props.setFieldValue(name, value);

	renderCheckBox = (props: CheckboxProps) => {
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
				{!hideDivider && this.renderDivider('checkbox')}
			</Fragment>
		);
	};

	renderDivider = (variant: DividerVariant) => <Divider variant={variant} />;

	renderError = (name: string) => <FieldError text={this.props.errors[name]} />;

	renderExtendButton = (props: ExtendButtonProps) => (
		<div className={mainStyles.field}>
			<ExtendButton {...props} />
		</div>
	);

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

	renderMiniSelect = (props: Object) => <MiniSelect onSelect={this.handleSelect} {...props} />;

	renderSelect = (props: SelectProps) => <Select onSelect={this.handleSelect} {...props} />;

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
}

export default FormBuilder;
