// @flow
import cn from 'classnames';
import {ICONS} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Icon extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render () {
		const {className, name, onClick} = this.props;
		const Icon = ICONS[name];

		return Icon ? <Icon className={cn(styles.icon, className)} onClick={onClick} /> : null;
	}
}

export default Icon;
