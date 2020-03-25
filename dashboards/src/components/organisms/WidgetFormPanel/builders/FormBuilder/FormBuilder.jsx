// @flow
import {Checkbox, Divider, ExtendButton, FieldError, FieldLabel, Label, TextArea} from 'components/atoms';
import type {CheckboxProps, LabelProps, TextAreaProps} from './types';
import {formRef, styles as mainStyles} from 'components/organisms/WidgetFormPanel';
import {MiniSelect} from 'components/molecules';
import type {Props as FormProps} from 'components/organisms/WidgetFormPanel/types';
import type {Props as ExtendButtonProps} from 'components/atoms/ExtendButton/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import type {Variant as DividerVariant} from 'components/atoms/Divider/types';

export class FormBuilder extends Component<FormProps> {
	invalidInputs = {};

	componentDidUpdate () {
		const {setFieldValue, values} = this.props;
		const {current: form} = formRef;
		let top = this.getFirstInvalidCoordinate();

		if (form && values.shouldScrollToError && top) {
			top = form.clientHeight / form.scrollHeight * top;

			form.scrollTo({behavior: 'smooth', top});
			setFieldValue('shouldScrollToError', false);

			this.invalidInputs = {};
		}
	}

	getFirstInvalidCoordinate = () => {
		let firstCoordinate = null;

		Object.keys(this.invalidInputs).forEach(key => {
			const input = this.invalidInputs[key];

			if (!firstCoordinate || firstCoordinate > input.offsetTop) {
				firstCoordinate = input.offsetTop;
			}
		});

		return firstCoordinate;
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {setFieldValue} = this.props;
		const {name, value} = e.currentTarget;

		setFieldValue(name, value);
	};

	handleClick = (name: string, value: boolean) => this.props.setFieldValue(name, value);

	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: any) => this.props.setFieldValue(name, value);

	setInputRef = (name: string) => (ref: any) => {
		const {errors, values} = this.props;

		if (errors[name] && values.shouldScrollToError) {
			this.invalidInputs[name] = ref;
		}
	};

	renderCheckBox = (props: CheckboxProps) => {
		const {hideDivider, label, name, onClick, value} = props;

		return (
			<Fragment>
				<div className={mainStyles.field}>
					<Checkbox
						label={label}
						name={name}
						onClick={onClick || this.handleClick}
						value={value}
					/>
				</div>
				{!hideDivider && this.renderDivider('checkbox')}
			</Fragment>
		);
	};

	renderDivider = (variant?: DividerVariant) => <Divider variant={variant} />;

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

	renderTextArea = (props: TextAreaProps) => {
		const {handleBlur, label, name, placeholder, value} = props;

		return (
			<div className={mainStyles.field} ref={this.setInputRef(name)}>
				<FieldLabel text={label} />
				<TextArea
					name={name}
					onBlur={handleBlur}
					onChange={this.handleChange}
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
