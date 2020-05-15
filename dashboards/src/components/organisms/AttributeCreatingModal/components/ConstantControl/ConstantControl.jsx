// @flow
import {CheckedIcon, CloseIcon} from 'icons/form';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ConstantControl extends PureComponent<Props, State> {
	state = {
		showForm: false,
		value: ''
	};

	componentDidMount () {
		const {value} = this.props;

		if (value) {
			this.setState({value});
		}
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value} = e.currentTarget;

		if (!value || /^\d+$/.test(value)) {
			this.setState({value});
		}
	};

	handleClickCancelIcon = () => {
		const {index, name, onCancel, value} = this.props;

		if (value) {
			return this.setState({showForm: false});
		}

		onCancel(index, name);
	};

	handleClickSuccessIcon = () => {
		const {index, name, onSubmit, type} = this.props;
		const {value} = this.state;

		if (value && Number(value) !== 0) {
			this.hideForm();
			onSubmit(index, name, value, type);
		}
	};

	hideForm = () => this.setState({showForm: false});

	shouldShowForm = () => {
		const {value} = this.props;
		const {showForm} = this.state;

		return showForm || !value;
	};

	showForm = () => this.setState({showForm: true});

	renderForm = () => {
		const {value} = this.state;

		return (
			<div className={styles.form}>
				<input
					autoComplete="off"
					className={styles.input}
					onChange={this.handleChange}
					value={value}
				/>
				<CheckedIcon
					className={styles.successIcon}
					onClick={this.handleClickSuccessIcon}
				/>
				<CloseIcon
					className={styles.cancelIcon}
					onClick={this.handleClickCancelIcon}
				/>
			</div>
		);
	};

	renderValue = () => {
		const {value} = this.props;

		return (
			<div className={styles.value} onClick={this.showForm}>
				{value}
			</div>
		);
	};

	render () {
		return this.shouldShowForm() ? this.renderForm() : this.renderValue();
	}
}

export default ConstantControl;
