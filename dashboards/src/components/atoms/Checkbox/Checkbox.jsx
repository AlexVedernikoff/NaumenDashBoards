// @flow
import {ACTIVE_COLORS} from './constants';
import CheckIcon from 'icons/form/checked.svg';
import cn from 'classnames';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

class Checkbox extends Component<Props> {
	static defaultProps = {
		activeColor: ACTIVE_COLORS.LIGHT,
		className: ''
	};

	getIconClassName = () => {
		const {activeColor, className, value} = this.props;
		const CN = [styles.icon, className];

		if (value && activeColor) {
			CN.push(`active${this.upperFirst(activeColor)}`);
		}

		return cn(CN);
	};

	handleClick = () => {
		const {name, onClick, value} = this.props;
		onClick(name, !value);
	};

	upperFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

	renderIconWithLabel = () => {
		const {label, name, value} = this.props;

		return (
			<label className={styles.label} htmlFor={name}>
				<div className={this.getIconClassName()}>
					{value && <CheckIcon />}
				</div>
				<div> {label}</div>
			</label>
		);
	};

	renderInput = () => {
		const {name} = this.props;

		return (
			<input
				className={styles.input}
				id={name}
				name={name}
				onChange={this.handleClick}
				type="checkbox"
			/>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderIconWithLabel()}
				{this.renderInput()}
			</Fragment>
		);
	}
}

export default Checkbox;
