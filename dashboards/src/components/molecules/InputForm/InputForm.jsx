// @flow
import {CheckedIcon, CloseIcon} from 'icons/form';
import {Formik} from 'formik';
import type {FormikProps} from 'formik';
import {object} from 'yup';
import type {Props, Values} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

const name = 'value';

export class InputForm extends Component<Props> {
	handleSubmit = (values: Values) => {
		const {onSubmit} = this.props;
		const value = values[name];

		if (value) {
			onSubmit(value);
		}
	};

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
	};

	renderFormContent = (props: FormikProps) => {
		const {handleChange, handleSubmit, values} = props;
		const {onClose} = this.props;

		return (
			<div className={styles.container}>
				<input
					autoComplete="off"
					className={styles.input}
					name={name}
					onChange={handleChange}
					required
					type="text"
					value={values[name]}
				/>
				<CheckedIcon
					className={styles.successIcon}
					onClick={handleSubmit}
					onMouseDown={this.stopPropagation}
				/>
				<CloseIcon
					className={styles.cancelIcon}
					onClick={onClose}
					onMouseDown={this.stopPropagation}
				/>
			</div>
		);
	};

	render () {
		const {rule, value} = this.props;
		let schema;

		if (rule) {
			schema = object().shape({
				value: rule
			});
		}

		return (
			<Formik
				initialValues={{value}}
				enableReinitialize={true}
				onSubmit={this.handleSubmit}
				render={this.renderFormContent}
				validationSchema={schema}
			/>
		);
	}
}

export default InputForm;
