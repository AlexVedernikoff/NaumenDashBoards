// @flow
import cn from 'classnames';
import {POSITIONS} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Popover extends PureComponent<Props> {
	static defaultProps = {
		position: POSITIONS.RIGHT,
		text: ''
	};

	renderPopover = () => {
		const {position, renderContent, text} = this.props;

		return (
			<div className={cn(styles.content, styles[position])}>
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
