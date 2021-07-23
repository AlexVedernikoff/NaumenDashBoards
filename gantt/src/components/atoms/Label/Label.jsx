// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Label extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	render () {
		const {children, className} = this.props;
		const labelCN = cn(styles.label, className);

		return <div className={labelCN} title={children}>{children}</div>;
	}
}

export default Label;
