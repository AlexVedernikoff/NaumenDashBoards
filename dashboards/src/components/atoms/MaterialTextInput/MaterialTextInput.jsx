// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class MaterialTextInput extends PureComponent<Props> {
	static defaultProps = {
		forwardedRef: {
			current: null
		},
		name: '',
		onlyNumber: false,
		placeholder: ''
	};

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {name, onChange, onlyNumber} = this.props;
		const {value} = e.currentTarget;

		if (!onlyNumber || /^(\d+)?$/.test(value)) {
			onChange(name, value);
		}
	};

	renderInput = () => {
		const {forwardedRef, placeholder, value} = this.props;

		return (
			<input
				className={styles.input}
				onChange={this.handleChange}
				placeholder={placeholder}
				ref={forwardedRef}
				value={value}
			/>
		);
	};

	renderPlaceholder = () => {
		const {placeholder, value} = this.props;

		if (placeholder && value) {
			return <div className={styles.placeholder}>{placeholder}</div>;
		}
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderPlaceholder()}
				{this.renderInput()}
			</div>
		);
	}
}

export default MaterialTextInput;
