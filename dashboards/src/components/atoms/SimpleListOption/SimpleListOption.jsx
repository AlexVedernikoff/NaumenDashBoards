// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class SimpleListOption extends PureComponent<Props> {
	getClassName = () => {
		const {found, selected} = this.props;

		return cn({
			[styles.option]: true,
			[styles.found]: found,
			[styles.selected]: selected
		});
	};

	getOptionLabel = () => {
		const {getOptionLabel, option} = this.props;
		return getOptionLabel ? getOptionLabel(option) : option.label;
	};

	handleClick = () => {
		const {onClick, option, selected} = this.props;
		selected ? onClick(null) : onClick(option);
	};

	render () {
		return (
			<div className={this.getClassName()} onClick={this.handleClick}>
				<div className={styles.label}>{this.getOptionLabel()}</div>
			</div>
		);
	}
}

export default SimpleListOption;
