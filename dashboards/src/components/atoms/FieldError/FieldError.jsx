// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class FieldError extends Component<Props> {
	static defaultProps = {
		className: styles.error
	};

	render () {
		const {className, forwardedRef, text} = this.props;

		return <div className={className} ref={forwardedRef} title={text}>{text}</div>;
	}
}

export default FieldError;
