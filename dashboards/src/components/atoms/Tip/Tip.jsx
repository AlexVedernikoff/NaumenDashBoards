// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Tip extends PureComponent<Props> {
	render () {
		const {children, text} = this.props;

		return (
			<div className={styles.tip} data-tip={text}>
				{children}
			</div>
		);
	}
}

export default Tip;
