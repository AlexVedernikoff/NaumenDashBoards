// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Loader extends PureComponent<Props> {
	render () {
		return (
			<div className={cn(this.props.className, styles.container)}>
				<div className={styles.loader} />
			</div>
		);
	}
}

export default Loader;
