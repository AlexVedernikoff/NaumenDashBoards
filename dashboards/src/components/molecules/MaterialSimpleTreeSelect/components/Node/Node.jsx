// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Node extends PureComponent<Props> {
	handleClick = () => {
		const {onClick, value} = this.props;
		const {children} = value;

		if (!Array.isArray(children) || children.length === 0) {
			onClick(value);
		}
	};

	renderLabel = () => {
		const {getValueLabel, value} = this.props;
		const {root, selected} = this.props;

		const labelCN = cn({
			[styles.labelContainer]: true,
			[styles.selected]: selected,
			[styles.root]: root
		});

		return (
			<div className={labelCN} onClick={this.handleClick}>
				{getValueLabel(value)}
			</div>
		);
	};

	render () {
		const {children} = this.props;

		return (
			<div>
				{this.renderLabel()}
				{children}
			</div>
		);
	}
}

export default Node;
