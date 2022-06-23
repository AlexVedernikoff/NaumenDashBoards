// @flow
import cn from 'classnames';
import type {Props} from './types';
import React from 'react';
import styles from './styles.less';

const Label = ({children, className}: Props) => {
	const labelCN = cn(styles.label, className);

	return <div className={labelCN} title={children}>{children}</div>;
};

export default Label;
