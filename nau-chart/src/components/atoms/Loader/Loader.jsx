// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Loader extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		size: 25
	};

	render () {
		const {className, size} = this.props;

		return (
			<svg className={cn(styles.spinner, className)} height={size} width={size} viewBox="0 0 50 50">
				<circle className={styles.path} cx="25" cy="25" fill="none" r="20" strokeWidth="5" />
			</svg>
		);
	}
}

export default Loader;
