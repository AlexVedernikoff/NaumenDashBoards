// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Row extends PureComponent<Props> {
	render () {
		const {children, width} = this.props;

		return (
			<div className={styles.row} style={{width}}>
				{children}
			</div>
		);
	}
}

export default Row;
