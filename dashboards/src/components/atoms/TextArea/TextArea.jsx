// @flow
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class TextArea extends Component<Props> {
	static defaultProps = {
		maxLength: null,
		placeholder: ''
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

	renderClearIcon = () => {
		const {value} = this.props;

		if (value) {
			return (
				<div className={styles.icon}>
					<IconButton icon={ICON_NAMES.REMOVE} onClick={this.handleClear} />
				</div>
			);
		}
	};

	render () {
		const {maxLength, name, onBlur, placeholder, value} = this.props;

		return (
			<div className={styles.container}>
				<textarea
					className={styles.input}
					maxLength={maxLength}
					name={name}
					onBlur={onBlur}
					onChange={this.handleChange}
					placeholder={placeholder}
					value={value}
				/>
				{this.renderClearIcon()}
			</div>
		);
	}
}

export default TextArea;
