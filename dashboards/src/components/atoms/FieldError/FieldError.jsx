// @flow
import cn from 'classnames';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class FieldError extends Component<Props> {
	static defaultProps = {
		className: ''
	};

	renderError = () => {
		const {className, text} = this.props;
		const errorCN = cn(styles.error, className);

		if (text) {
			return <div className={errorCN}>{text}</div>;
		}

		return null;
	};

	render () {
		return this.renderError();
	}
}

export default FieldError;
