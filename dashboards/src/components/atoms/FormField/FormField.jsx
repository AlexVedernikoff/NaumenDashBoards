// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class FormField extends Component<Props> {
	render () {
		const {children} = this.props;

		return (
			<div className={styles.field}>
				{children}
			</div>
		);
	}
}

export default FormField;
