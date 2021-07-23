// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class ButtonGroup extends PureComponent<Props> {
	render () {
		const {children, disabled} = this.props;
		const containerCN = cn({
			[styles.container]: true,
			[styles.disabled]: disabled
		});

		return (
			<div className={containerCN}>
				{children}
			</div>
		);
	}
}

export default ButtonGroup;
