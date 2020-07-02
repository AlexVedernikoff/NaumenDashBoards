// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class FieldError extends Component<Props> {
	static defaultProps = {
		className: ''
	};

	render () {
		const {className, text} = this.props;
		const errorCN = cn(styles.error, className);

		return <div className={errorCN} tip={text}>{text}</div>;
	}
}

export default FieldError;
