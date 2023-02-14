// @flow
import cn from 'classnames';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class TextInput extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		disabled: false,
		maxLength: null,
		name: '',
		onlyNumber: false,
		placeholder: '',
		value: ''
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChange, onlyNumber} = this.props;
		const {value} = e.currentTarget;

		if (!onlyNumber || /^(\d+)?$/.test(value)) {
			onChange({name, value});
		}
	};

	handleClear = () => {
		const {name, onChange} = this.props;

		onChange({name, value: ''});
	};

	renderClearIcon = () => {
		const {value} = this.props;

		return value ? <IconButton className={styles.icon} icon={ICON_NAMES.REMOVE} onClick={this.handleClear} /> : null;
	};

	renderInput = () => {
		const {forwardedRef, maxLength, onBlur, onFocus, placeholder, value} = this.props;

		return (
			<input
				className={styles.input}
				maxLength={maxLength}
				onBlur={onBlur}
				onChange={this.handleChange}
				onFocus={onFocus}
				placeholder={placeholder}
				ref={forwardedRef}
				value={value}
			/>
		);
	};

	render () {
		const {className, disabled} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[className]: true,
			[styles.disabled]: disabled
		});

		return (
			<div className={containerCN}>
				{this.renderInput()}
				{this.renderClearIcon()}
			</div>
		);
	}
}

export default TextInput;
