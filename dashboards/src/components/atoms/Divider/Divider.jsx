// @flow
import classnames from 'classnames';
import type {Props} from './types';
import React from 'react';
import styles from './styles.less';

export const Divider = (props: Props) => {
	const {className} = props;
	const classProps: string = classnames(
		className,
		styles.divider
	);

	return <div className={classProps}/>;
};

export default Divider;
