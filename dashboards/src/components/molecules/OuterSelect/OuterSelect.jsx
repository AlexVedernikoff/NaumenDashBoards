// @flow
import {CheckedIcon} from 'icons/form';
import type {Option, Props} from './types';
import React, {createElement, PureComponent} from 'react';
import styles from './styles.less';

export class OuterSelect extends PureComponent<Props> {
	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {name, onSelect} = this.props;
		onSelect(name, e.currentTarget.dataset.value);
	};

	renderCheckedIcon = (value: string) => {
		const {value: selectedValue} = this.props;

		if (value === selectedValue) {
			return (
				<div className={styles.checkedIcon}>
					<CheckedIcon />
				</div>
			);
		}
	};

	renderOption = (option: Option) => {
		let {label, tip, value} = option;

		if (typeof label === 'function') {
			label = createElement(label);
		}

		return (
			<div className={styles.optionContainer} title={tip}>
					<div className={styles.option} data-value={value} onClick={this.handleClick}>
						{label}
						{this.renderCheckedIcon(value)}
					</div>
			</div>
		);
	};

	render () {
		const {options} = this.props;

		return (
			<div className={styles.select}>
				{options.map(this.renderOption)}
			</div>
		);
	}
}

export default OuterSelect;
