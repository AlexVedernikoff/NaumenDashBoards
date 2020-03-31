// @flow
import cn from 'classnames';
import {Node} from 'components/molecules/MaterialSimpleTreeSelect/components';
import type {Option, Props, Value} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Tree extends PureComponent<Props> {
	handleClickNode = (value: Value) => {
		const {onSelect} = this.props;
		onSelect(value);
	};

	renderNode = (node: Option, root: boolean = false) => {
		const {getOptionLabel, getOptionValue, value} = this.props;
		const selected = Boolean(value && getOptionValue(value) === getOptionValue(node));
		const {children} = node;

		return (
			<Node
				getValueLabel={getOptionLabel}
				onClick={this.handleClickNode}
				root={root}
				selected={selected}
				value={node}
			>
				{children && children.map(child => this.renderNode(child, false))}
			</Node>
		);
	};

	render () {
		const {className, options} = this.props;

		return (
			<div className={cn(styles.container, className)}>
				{options.map(node => this.renderNode(node, true))}
			</div>
		);
	}
}

export default Tree;
