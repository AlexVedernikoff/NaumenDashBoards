// @flow
import {CheckedIcon, CloseIcon} from 'icons/form';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class InputForm extends Component<Props, State> {
	state = {
		value: ''
	};

	componentDidMount () {
		const {value} = this.props;
		this.setState({value: value.toString()});
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value} = e.currentTarget;
		this.setState({value});
	};

	handleClickCheckedIcon = () => {
		const {onSubmit} = this.props;
		const {value} = this.state;

		if (value) {
			onSubmit(value);
		}
	};

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
	};

	render () {
		const {onClose} = this.props;
		const {value} = this.state;

		return (
			<div className={styles.container}>
				<input
					autoComplete="off"
					className={styles.input}
					onChange={this.handleChange}
					required
					type="text"
					value={value}
				/>
				<CheckedIcon
					className={styles.successIcon}
					onClick={this.handleClickCheckedIcon}
					onMouseDown={this.stopPropagation}
				/>
				<CloseIcon
					className={styles.cancelIcon}
					onClick={onClose}
					onMouseDown={this.stopPropagation}
				/>
			</div>
		);
	}
}

export default InputForm;
