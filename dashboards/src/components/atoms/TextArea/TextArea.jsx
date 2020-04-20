// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {IconButton} from 'components/atoms';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class TextArea extends Component<Props> {
	static defaultProps = {
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
					<IconButton>
						<Icon name={ICON_NAMES.CLOSE} onClick={this.handleClear} />
					</IconButton>
				</div>
			);
		}
	};

	render () {
		const {name, onBlur, placeholder, value} = this.props;

		return (
			<div className={styles.container}>
				<textarea
					className={styles.input}
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
