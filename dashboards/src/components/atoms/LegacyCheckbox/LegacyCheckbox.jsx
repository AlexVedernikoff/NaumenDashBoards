// @flow
import {ACTIVE_COLORS} from './constants';
import CheckIcon from 'icons/form/checked.svg';
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

class LegacyCheckbox extends Component<Props> {
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

	render () {
		const {label, value} = this.props;

		return (
			<label className={styles.label} onClick={this.handleClick}>
				<div className={this.getIconClassName()}>
					{value && <CheckIcon />}
				</div>
				<div>{label}</div>
			</label>
		);
	}
}

export default LegacyCheckbox;
