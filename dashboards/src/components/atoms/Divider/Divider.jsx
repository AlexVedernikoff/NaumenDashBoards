// @flow
import cn from 'classnames';
import type {Props} from './types';
import React from 'react';
import styles from './styles.less';

export const Divider = (props: Props) => {
	const {className} = props;
	const containerCN = cn(className, styles.container);

	return (
		<div className={containerCN}>
			<div className={styles.divider} />
		</div>
	);
};

export default Divider;
