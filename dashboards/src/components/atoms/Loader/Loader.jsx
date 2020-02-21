// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Loader extends PureComponent<Props> {
	render () {
		return (
			<div className={this.props.className}>
				<div className={styles.loader} />
			</div>
		);
	}
}

export default Loader;
