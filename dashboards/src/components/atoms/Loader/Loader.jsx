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

		return <div className={cn(styles.loader, className)} style={{height: size, width: size}} />;
	}
}

export default Loader;
