// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Loader extends PureComponent<Props> {
	static defaultProps = {
		size: 25
	};

	render () {
		const {size} = this.props;
		return <div className={styles.loader} style={{height: size, width: size}} />;
	}
}

export default Loader;
