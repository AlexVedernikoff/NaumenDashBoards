// @flow
import CrossIcon from 'icons/form/cross.svg';
import {IconButton} from 'components/atoms';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class TextArea extends Component<Props> {
	handleReset = () => {
		const {name, onReset} = this.props;
		onReset(name);
	};

	renderClearIcon = () => {
		const {value} = this.props;

		if (value) {
			return (
				<div className={styles.icon}>
					<IconButton>
						<CrossIcon onClick={this.handleReset} />
					</IconButton>
				</div>
			);
		}
	};

	renderLabel = () => {
		const {label, name} = this.props;
		return label ? <label className={styles.label} htmlFor={name}>{label}</label> : null;
	};

	renderTextArea = () => {
		const {
			name,
			onBlur,
			onChange,
			placeholder,
			value
		} = this.props;

		return (
			<div className={styles.inputField}>
				<textarea
					className={styles.input}
					id={name}
					name={name}
					onBlur={onBlur}
					onChange={onChange}
					placeholder={placeholder}
					value={value}
				/>
				{this.renderClearIcon()}
			</div>
		);
	};

	render () {
		return (
			<div>
				{this.renderLabel()}
				{this.renderTextArea()}
			</div>
		);
	}
}

export default TextArea;
