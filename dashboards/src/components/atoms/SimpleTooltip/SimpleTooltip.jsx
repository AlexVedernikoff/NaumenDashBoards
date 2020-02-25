// @flow
import cn from 'classnames';
import {PLACEMENTS} from './constants';
import type {Props} from './types';
import React, {Children, cloneElement, Component} from 'react';
import styles from './styles.less';

class SimpleTooltip extends Component<Props> {
	static defaultProps = {
		className: '',
		placement: PLACEMENTS.TOP,
		text: ''
	};

	getClassNames = () => {
		const {className, placement} = this.props;
		const {BOTTOM, TOP} = PLACEMENTS;

		return cn({
			[styles.tooltip]: true,
			[styles.tooltipTop]: placement === TOP,
			[styles.tooltipBottom]: placement === BOTTOM,
			[className]: true
		});
	};

	renderTooltip = () => <div className={this.getClassNames()}>{this.props.text}</div>;

	render () {
		const child = Children.only(this.props.children);
		const className = cn(child.props.className, styles.container);

		return cloneElement(child, {className}, [...Children.toArray(child.props.children), this.renderTooltip()]);
	}
}

export default SimpleTooltip;
