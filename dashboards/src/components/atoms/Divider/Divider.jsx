// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS} from './constants';

export class Divider extends PureComponent<Props> {
	static defaultProps = {
		variant: VARIANTS.SIMPLE
	};

	render () {
		const {variant} = this.props;
		const containerCN = cn(styles[variant], styles.container);

		return (
			<div className={containerCN}>
				<div className={styles.divider} />
			</div>
		);
	}
}

export default Divider;
