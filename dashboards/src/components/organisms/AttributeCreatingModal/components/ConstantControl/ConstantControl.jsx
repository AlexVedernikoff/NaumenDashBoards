// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {InputRef} from 'components/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class ConstantControl extends PureComponent<Props, State> {
	inputRef: InputRef = createRef();

	state = {
		showForm: false,
		value: ''
	};

	componentDidMount () {
		const {value} = this.props;

		if (value) {
			this.setState({value});
		} else {
			const {current: input} = this.inputRef;

			if (input) {
				input.focus();
			}
		}
	}

	forceSuccess = () => {
		if (this.shouldShowForm()) {
			this.handleSuccess();
		}
	};

	handleCancel = () => {
		const {index, name, onCancel, value} = this.props;

		if (value) {
			return this.setState({showForm: false});
		}

		onCancel(index, name);
	};

	handleChange = () => {
		const value = this.inputRef.current?.value.replace(',', '.');

		if (!value || /^(\d+)(\.)?(\d+)?$/.test(value)) {
			this.setState({value});
		}
	};

	handleSpecialKeysDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
		if (event.key === 'Enter') {
			this.handleSuccess();
		} else if (event.key === 'Escape') {
			this.handleCancel();
		}
	};

	handleSuccess = () => {
		const {index, name, onSubmit, type} = this.props;
		const value = parseFloat(this.state.value);

		if (value && value !== 0) {
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

	showForm = () => this.setState({showForm: true}, () => {
		const {current: input} = this.inputRef;

		if (input) {
			input.focus();
		}
	});

	renderForm = () => {
		const {value} = this.state;

		return (
			<div className={styles.form}>
				<input
					autoComplete="off"
					className={styles.input}
					onChange={this.handleChange}
					onKeyDown={this.handleSpecialKeysDown}
					ref={this.inputRef}
					value={value}
				/>
				<Icon
					className={styles.successIcon}
					name={ICON_NAMES.ACCEPT}
					onClick={this.handleSuccess}
				/>
				<Icon
					className={styles.cancelIcon}
					name={ICON_NAMES.CANCEL}
					onClick={this.handleCancel}
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
