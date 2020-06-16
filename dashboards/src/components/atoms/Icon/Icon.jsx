// @flow
import './icons';
import cn from 'classnames';
import {ICON_PROPS, ICON_SIZES} from './constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Icon extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		size: ICON_SIZES.NORMAL,
		title: ''
	};

	render () {
		const {className, name, onClick, size, title} = this.props;
		const svgCN = cn({
			[className]: true,
			[styles.icon]: true
		});

		return (
			<svg className={svgCN} fill="currentColor" onClick={onClick} {...ICON_PROPS[size]}>
				{title && <title>{title}</title>}
				<use xlinkHref={`#${name}`} />
			</svg>
		);
	}
}

export default Icon;
