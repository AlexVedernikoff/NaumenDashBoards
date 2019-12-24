// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class FieldError extends Component<Props> {
	renderError = () => {
		const {text} = this.props;

		if (text) {
			return <span className={styles.error}>{text}</span>;
		}

		return null;
	};

	render () {
		return this.renderError();
	}
}

export default FieldError;
