// @flow
import {Label} from 'components/atoms';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class TextArea extends Component<Props> {
	static defaultProps = {
		maxLength: null,
		placeholder: 'Введите текст...'
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChange} = this.props;
		const {value} = e.currentTarget;

		onChange({name, value});
	};

	handleClear = () => {
		const {name, onChange} = this.props;
		onChange({name, value: ''});
	};

	renderClearButton = () => {
		const {value} = this.props;

		return (
			<button className={styles.clearButton} disabled={!value} onClick={this.handleClear}>Очистить</button>
		);
	};

	renderLabel = () => <Label>{this.props.label}</Label>;

	renderLabelContainer = () => {
		return (
			<div className={styles.labelContainer}>
				{this.renderLabel()}
				{this.renderClearButton()}
			</div>
		);
	};

	renderTextArea = () => {
		const {maxLength, name, onBlur, placeholder, value} = this.props;

		return (
			<textarea
				className={styles.input}
				maxLength={maxLength}
				name={name}
				onBlur={onBlur}
				onChange={this.handleChange}
				placeholder={placeholder}
				rows={1}
				value={value}
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderLabelContainer()}
				{this.renderTextArea()}
			</Fragment>
		);
	}
}

export default TextArea;
