// @flow
import './icons';
import cn from 'classnames';
import React from 'react';
import styles from './styles.less';

export const Icon = ({className, height, name, onClick, title, viewBox, width}) => {
	Icon.defaultProps = {
		className: '',
		height: 16,
		title: '',
		viewBox: '0 0 16 16',
		width: 16
	};

	const svgCN = cn(styles.icon, className);

	return (
		<svg className={svgCN} fill="currentColor" height={height} onClick={onClick} viewBox={viewBox} width={width}>
			{title && <title>{title}</title>}
			<use className={styles.use} xlinkHref={`#${name}`} />
		</svg>
	);
};

export default Icon;
