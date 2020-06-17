// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
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
		const value = e.currentTarget.value.replace(',', '.');

		if (!value || /^(\d+)(\.)?(\d+)?$/.test(value)) {
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
				<Icon
					className={styles.successIcon}
					name={ICON_NAMES.ACCEPT}
					onClick={this.handleClickSuccessIcon}
				/>
				<Icon
					className={styles.cancelIcon}
					name={ICON_NAMES.CANCEL}
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
