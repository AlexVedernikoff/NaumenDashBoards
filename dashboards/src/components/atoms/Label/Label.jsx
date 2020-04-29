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
		const {className, text} = this.props;
		const labelCN = cn(styles.label, className);

		return <div className={labelCN} title={text}>{text}</div>;
	}
}

export default Label;
