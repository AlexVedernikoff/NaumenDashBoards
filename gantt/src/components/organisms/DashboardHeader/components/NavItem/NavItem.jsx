// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class NavItem extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render () {
		const {children, className} = this.props;

		return (
			<li className={cn(styles.navItem, className)}>
				{children}
			</li>
		);
	}
}

export default NavItem;
