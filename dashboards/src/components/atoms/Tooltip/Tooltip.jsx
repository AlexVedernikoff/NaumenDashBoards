// @flow
import cn from 'classnames';
import {PLACEMENTS} from './constants';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

class Tooltip extends Component<Props> {
	static defaultProps = {
		placement: PLACEMENTS.RIGHT,
		text: ''
	};

	renderTooltip = () => {
		const {placement, text} = this.props;

		const contentCN = cn({
			[styles.content]: true,
			[styles.contentBottom]: placement === PLACEMENTS.BOTTOM,
			[styles.contentLeft]: placement === PLACEMENTS.LEFT,
			[styles.contentRight]: placement === PLACEMENTS.RIGHT,
			[styles.contentTop]: placement === PLACEMENTS.TOP
		});

		if (text) {
			return (
				<div className={contentCN}>
					{text}
				</div>
			);
		}
	};

	render () {
		const {children} = this.props;

		return (
			<span className={styles.container}>
				{children}
				{this.renderTooltip()}
			</span>
		);
	}
}

export default Tooltip;
