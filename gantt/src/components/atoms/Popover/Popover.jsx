// @flow
import cn from 'classnames';
import {PLACEMENTS} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Popover extends PureComponent<Props> {
	static defaultProps = {
		placement: PLACEMENTS.RIGHT,
		text: ''
	};

	renderPopover = () => {
		const {placement, renderContent, text} = this.props;

		const contentCN = cn({
			[styles.content]: true,
			[styles.contentRight]: placement === PLACEMENTS.RIGHT
		});

		return (
			<div className={contentCN}>
				{renderContent ? renderContent() : text}
			</div>
		);
	};

	render () {
		const {children} = this.props;

		return (
			<div className={styles.container}>
				{children}
				{this.renderPopover()}
			</div>
		);
	}
}

export default Popover;
