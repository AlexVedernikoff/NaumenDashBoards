// @flow
import CheckIcon from 'icons/form/checked.svg';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

class CheckBox extends Component<Props> {
	renderLabel = () => {
		const {label, name, value} = this.props;

		return (
			<label htmlFor={name} className={styles.label}>
				<div className={styles.icon}>
					{value && <CheckIcon/>}
				</div>
				<span> {label}</span>
			</label>
		);
	};

	renderInput = () => {
		const {handleClick, name} = this.props;

		return (
			<input
				className={styles.input}
				id={name}
				name={name}
				onChange={handleClick}
				type="checkbox"
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderLabel()}
				{this.renderInput()}
			</Fragment>
		);
	}
}

export default CheckBox;
