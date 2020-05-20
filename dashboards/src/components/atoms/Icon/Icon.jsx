// @flow
import './icons';
import {ICON_PROPS, ICON_SIZES} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Icon extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		size: ICON_SIZES.NORMAL
	};

	render () {
		const {className, name, onClick, size} = this.props;

		return (
			<svg className={className || styles.icon} fill="currentColor" onClick={onClick} {...ICON_PROPS[size]}>
				<use xlinkHref={`#${name}`} />
			</svg>
		);
	}
}

export default Icon;
