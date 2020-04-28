// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Row extends PureComponent<Props> {
	render () {
		return (
			<tr className={styles.row}>
				{this.props.children}
			</tr>
		);
	}
}

export default Row;
