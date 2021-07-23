// @flow

import cn from 'classnames';
import Container from 'components/atoms/Container';
import {DEFAULT_PROPS} from './constants';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';

export class NumberInput extends Component<Props> {
	static defaultProps = DEFAULT_PROPS;

	components = {
		ContolsContainer: Container,
		...this.props.controls
	};

	handleChange = (value: number) => {
		const {max, min, name, onChange} = this.props;

		if (onChange && (max == null || max >= value) && (min == null || min <= value)) {
			onChange({name, value});
		}
	};

	handleChangeValue = ({name, value}: OnChangeEvent<string>) => {
		const numberValue = value ? parseInt(value) : 0;

		this.handleChange(numberValue);
	};

	handleVariation = (vary: number) => () => {
		const {value = 0} = this.props;
		const newValue = (value ?? 0) + vary;

		this.handleChange(newValue);
	};

	renderContorls = (): React$Node => {
		const {ContolsContainer} = this.components;
		return (
			<ContolsContainer className={styles.contolsContainer}>
				<IconButton className={styles.button} icon={ICON_NAMES.MINUS} onClick={this.handleVariation(-1)} round={false} />
				<IconButton className={styles.button} icon={ICON_NAMES.PLUS} onClick={this.handleVariation(1)} round={false} />
			</ContolsContainer>
		);
	};

	renderInputContainer = (): React$Node => {
		const {disabled, forwardedInputRef, name, placeholder, value} = this.props;

		return (
			<TextInput
				className={styles.input}
				disabled={disabled}
				forwardedRef={forwardedInputRef}
				name={name}
				onChange={this.handleChangeValue}
				onlyNumber={true}
				placeholder={placeholder}
				value={value}
			/>
		);
	};

	render () {
		const {className, disabled} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.disabledContainer]: disabled,
			[className]: true
		});

		return (
			<div className={containerCN}>
				{this.renderInputContainer()}
				{this.renderContorls()}
			</div>
		);
	}
}
