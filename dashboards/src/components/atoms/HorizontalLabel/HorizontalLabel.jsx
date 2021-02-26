// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class HorizontalLabel extends PureComponent<Props> {
	render () {
		const {children} = this.props;

		return <div className={styles.label}>{children}</div>;
	}
}

export default HorizontalLabel;
