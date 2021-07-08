// @flow
import './icons';
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Icon extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		height: 16,
		title: '',
		viewBox: '0 0 16 16',
		width: 16
	};

	render () {
		const {className, height, name, onClick, title, viewBox, width} = this.props;
		const svgCN = cn(styles.icon, className);

		return (
			<svg className={svgCN} fill="currentColor" height={height} onClick={onClick} viewBox={viewBox} width={width}>
				{title && <title>{title}</title>}
				<use className={styles.use} xlinkHref={`#${name}`} />
			</svg>
		);
	}
}

export default Icon;
