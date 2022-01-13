// @flow
import Label from 'components/atoms/Label';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {Props} from './types';
import React, {Component, createRef, Fragment} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';

export class TextArea extends Component<Props> {
	inputRef: Ref<'textarea'> = createRef();

	static defaultProps = {
		focusOnMount: false,
		label: '',
		maxLength: MAX_TEXT_LENGTH,
		placeholder: t('TextArea::Placeholder')
	};

	componentDidMount () {
		const {focusOnMount} = this.props;
		const input = this.inputRef?.current;

		focusOnMount && input && input.focus();
	}

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
			<button className={styles.clearButton} disabled={!value} onClick={this.handleClear}><T text="TextArea::Clear" /></button>
		);
	};

	renderLabel = () => <Label>{this.props.label}</Label>;

	renderLabelContainer = () => {
		const {label} = this.props;

		if (label) {
			return (
				<div className={styles.labelContainer}>
					{this.renderLabel()}
					{this.renderClearButton()}
				</div>
			);
		}

		return null;
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
				ref={this.inputRef}
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
