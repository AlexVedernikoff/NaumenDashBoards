// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Row extends PureComponent<Props> {
	render () {
		return (
			<div className={styles.row}>
				{this.props.children}
			</div>
		);
	}
}

export default Row;
